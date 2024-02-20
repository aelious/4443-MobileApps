from pymongo import MongoClient, ASCENDING, DESCENDING
from pymongo.errors import PyMongoError
from rich import print
from rich.console import Console
from rich.traceback import install
import re
import sys
from bson.objectid import ObjectId
from bson.errors import InvalidId


def is_valid_object_id(id_str):
    try:
        # Attempt to convert the string to an ObjectId
        obj_id = ObjectId(id_str)
        # If the above line doesn't raise an exception, the id_str is a valid ObjectId
        return True
    except InvalidId:
        # If an InvalidId exception is caught, the id_str is not a valid ObjectId
        return False


# Set up Rich to pretty-print tracebacks
install()


class MongoManager:
    def __init__(self, **kwargs):
        self.console = Console()

        self.username = kwargs.get("username", None)
        self.password = kwargs.get("password", None)
        self.host = kwargs.get("host", "localhost")
        self.port = kwargs.get("port", "27017")  # Default MongoDB port
        self.db = kwargs.get("db", None)
        self.collection = kwargs.get("collection", None)

        if self.username is None and self.password is None:
            self.connection_url = f"mongodb://{self.host}:{self.port}/"
        else:
            # Need to check that a db name was passed in
            # Create the connection URL
            self.connection_url = f"mongodb://{self.username}:{self.password}@{self.host}:{self.port}/{self.db}?authSource=admin"

        try:
            self.client = MongoClient(self.connection_url)
            # The ismaster command is cheap and does not require auth.
            self.client.admin.command("ismaster")
        except:
            print("Server not available")

        # if a db is specified then make connection
        if self.db is not None:
            self.setDb(self.db)

            # if db is specified then check for collection as well
            if self.collection is not None:
                self.collection = self.db[self.collection]

    def __str__(self):
        return f"url: {self.connection_url} coll: {self.collection_name}"

    def setDb(self, db_name):
        """Sets the current database."""
        if db_name in self.client.list_database_names():
            self.db = self.client[db_name]
            print(f"Database set to {db_name}")
        else:
            print(f"Database {db_name} does not exist. Creating {db_name}.")
            self.db = self.client[db_name]

    def setCollection(self, collection_name):
        """Sets the current collection."""
        if self.db is not None:  # Corrected the check here
            if collection_name in self.db.list_collection_names():
                self.collection = self.db[collection_name]
                print(f"Collection set to {collection_name}")
            else:
                print(
                    f"Collection {collection_name} does not exist. Creating {collection_name}."
                )
                self.collection = self.db[collection_name]
        else:
            print("No database selected. Use set_database() first.")

    def dropCollection(self, collection_name):
        """Deletes a collection from the current database."""
        if self.db is not None:  # Corrected the check here
            if collection_name in self.db.list_collection_names():
                self.db.drop_collection(collection_name)
                print(f"Collection {collection_name} deleted.")
            else:
                print(f"Collection {collection_name} does not exist.")
        else:
            print("No database selected. Use set_database() first.")

    def dropDb(self, db_name):
        """Deletes a database."""
        if db_name in self.client.list_database_names():
            self.client.drop_database(db_name)
            print(f"Database {db_name} deleted.")
            if (
                self.db is not None and self.db.name == db_name
            ):  # Corrected the check here
                self.db = None
                self.collection = None
        else:
            print(f"Database {db_name} does not exist.")

    def get(self, **kwargs):
        """
        Retrieves documents from the collection based on the provided criteria.

        :param filter_query: Dictionary for filtering documents.
        :param pagination: Tuple or dictionary with 'skip' and 'limit' for pagination.
        :param sort_order: List of tuples specifying field and direction to sort by.
        :return: List of documents matching the criteria.
        """

        self.query = kwargs.get("query", {})
        self.filter = kwargs.get("filter", {})
        self.skip = kwargs.get("skip", 0)
        self.limit = kwargs.get("limit", 0)
        self.sort_criteria = kwargs.get("sort_criteria", [("_id,1")])

        try:
            results = (
                self.collection.find(self.query, self.filter)
                .sort(self.sort_criteria)
                .skip(self.skip)
                .limit(self.limit)
            )
            resultList = list(results)
            if len(resultList) >= 0:

                kwargs["success"] = True
                kwargs["result_size"] = len(resultList)
                kwargs["data"] = resultList

                return kwargs
        except PyMongoError as e:
            # print(f"An error occurred: {e}")
            kwargs["success"] = False
            kwargs["error"] = e
            return kwargs

    def get2(self, **kwargs):
        """
        Retrieves documents from the collection based on the provided criteria.

        :param query: Dictionary for filtering documents using MongoDB query syntax.
        :param skip: Integer specifying the number of documents to skip.
        :param limit: Integer specifying the maximum number of documents to return.
        :param sort_criteria: List of tuples specifying field and direction to sort by.
        :return: Dictionary with the operation's success status, result size, and data.
        """

        query = kwargs.get("query", {})
        skip = kwargs.get("skip", 0)
        limit = kwargs.get("limit", 10)  # Assuming a default limit might be helpful
        sort_criteria = kwargs.get(
            "sort_criteria", [("_id", 1)]
        )  # Fixed the sort criteria syntax

        try:
            results = (
                self.collection.find(query).sort(sort_criteria).skip(skip).limit(limit)
            )
            resultList = list(results)
            return {"success": True, "result_size": len(resultList), "data": resultList}
        except PyMongoError as e:
            return {
                "success": False,
                "error": str(
                    e
                ),  # It's often a good idea to convert exceptions to strings for readability
            }

    def post(self, document):
        print(type(document))
        # Implement the logic to insert data
        if isinstance(document, dict):
            self.collection.insert_one(document)
        elif isinstance(document, list):
            self.collection.insert_many(document)

    def put(self, filter_query, update_data, upsert=False):
        """
        Updates documents in the collection based on the provided criteria.

        :param filter_query: Dictionary specifying the criteria to select documents to update.
        :param update_data: Dictionary specifying the update operations to be applied to the documents.
        :param upsert: If True, a new document is inserted if no document matches the filter_query.
        :return: Result of the update operation.
        """
        if self.collection is None:
            raise ValueError("Collection not set.")

        # MongoDB requires update operations to be prefixed with operators like '$set', '$unset', etc.
        # Ensure update_data is structured properly or wrap it with '$set' if it's a direct field update.
        if not any(key.startswith("$") for key in update_data.keys()):
            update_data = {"$set": update_data}

        result = self.collection.update_many(filter_query, update_data, upsert=upsert)
        return result

    def put2(self, id_key, id_val, update_key, update_value):
        """
        Updates the price of a specific item in the collection.

        :param item_id: The unique identifier for the item.
        :param new_price: The new price to set.
        :return: Result of the update operation.
        """
        if id_key == "_id" and is_valid_object_id(id_val):
            # Convert string ID to ObjectId
            id_val = ObjectId(id_val)

        # Perform the update
        result = self.collection.update_one(
            {id_key: id_val},  # Query to match the document
            {"$set": {update_key: update_value}},  # Update operation
        )

        # Check if the update was successful
        if result.matched_count > 0:
            return {"success": True, "updated_count": result.modified_count}
        else:
            return {"success": False, "message": "No matching document found."}

    def delete(self, query):
        """
        Deletes an entry from the database.

        :param query: The unique identifier for the item.
        :return: Result of the update operation.
        """
        if self.collection is None:
            raise ValueError("Collection not set.")
        query = str(query)
        if is_valid_object_id(query):
            query = ObjectId(query)
            try:
                self.collection.deleteOne( { "_id" : ObjectId(query)})
            except PyMongoError as e:
                return {
                    "success": False,
                    "error": str(
                        e
                    )
            }
        else:
            return "Enter a valid candy ID."

        


if __name__ == "__main__":

    query = sys.argv[1]

    mm = MongoManager()

    mm.setDb("candy_store")

    # Get all candies.
    if query == "1":
        mm.setCollection("candies")
        results = mm.get(filter={"_id": 0})
        print(results)
    
    # Get a list of categories.
    elif query == "2":
        mm.setCollection("categories")
        results = mm.get(filter={"_id": 0})
        print(results)

    # Get candies in a specific category.
    elif query == "3":
        cat = input("Enter a category.\n")
        mm.setCollection("candies")
        results = mm.get(filter={"name": 1, "category": cat, "_id": 0})
        print(results)

    # Get candies with a key word in the description.
    elif query == "4":
        kw = input("Enter a description key word to search for.\n")
        mm.setCollection("candies")
        regex_query = {
            "desc": {"$regex": kw, "$options": "i"}
        } 
        results = mm.get(
            query=regex_query,
            sort_criteria=[("name", 1)],
        )
        print(results)

    # Get candies with a key word in the name.
    elif query == "5":
        kw = input("Enter a name key word to search for.\n")
        mm.setCollection("candies")
        regex_query = {
            "name": {"$regex": kw, "$options": "i"}
        } 
        results = mm.get(
            query=regex_query,
            sort_criteria=[("name", 1)],
        )
        print(results)

    # Get candies by price range.
    elif query == "6":
        lower = float(input("Enter lower price boundary.\n"))
        upper = float(input("Enter upper price boundary.\n"))
        price_range_query = {"price": {"$gte": lower, "$lte": upper}}
        mm.setCollection("candies")
        rangeQuery = mm.get(
            query=price_range_query,
            filter={"_id": 0, "price": 1, "category_id": 1, "name": 1},
            sort_criteria={"price": -1},
        )
        print(rangeQuery)
    
    # Get a candy with a specific ID.
    elif query == "7":
        candy_id = input("Enter candy id.\n")
        if is_valid_object_id(candy_id):
            candy_id = ObjectId(candy_id)
            candyID_query = {"_id": candy_id}
            mm.setCollection("candies")
            results = mm.get(
                query=candyID_query,
                filter={"_id": 0, "price": 1, "category_id": 1, "name": 1},
            )
            print(results)
        else:
            print("Invalid ID.")

    elif query == "8":
        candy_id = input("Enter candy id.\n")
        if is_valid_object_id(candy_id):
            candy_id = ObjectId(candy_id)
            candyID_query = {"_id": candy_id}
            mm.setCollection("candies")
            results = mm.get(
                query=candyID_query,
                filter={"_id": 0, "price": 1, "category_id": 1, "name": 1},
            )
            print(results)
            print("Pretend there is a picture here, source was never updated to include the photos.")
        else:
            print("Invalid ID.")
    
    # Update a candy's price.
    elif query == "9":
        candy_id = input("Enter candy id.\n")
        if is_valid_object_id(candy_id):
            candy_id = ObjectId(candy_id)
            candyID_query = {"_id": candy_id}
            mm.setCollection("candies")
            results = mm.get(
                query=candyID_query,
                filter={"_id": 0, "price": 1, "category_id": 1, "name": 1},
            )
            print(results)
            new_price = input("Enter the new price for this candy.\n")
            results = mm.put2("_id", candy_id, "price", float(new_price))
            print(results)
        else:
            print("Invalid ID.")

    # Update a candy's information
    elif query == "10":
        candy_id = input("Enter candy id.\n")
        if is_valid_object_id(candy_id):
            candy_id = ObjectId(candy_id)
            candyID_query = {"_id": candy_id}
            mm.setCollection("candies")
            results = mm.get(
                query=candyID_query
            )
            print(results)
            upgrade_type = input("Enter the type to update:\nname\nprod_url\nimg_url\nprice\ndesc\ncategory\ncategory_id\n")
            if upgrade_type != 'name' and upgrade_type != 'prod_url' and upgrade_type != 'img_url' and upgrade_type != 'price' and upgrade_type != 'desc' and upgrade_type != 'category' and upgrade_type != 'category_id':
                print("Invalid update value.")
            else:
                new_data = input("Enter the new data for this type.\n")
                if upgrade_type == "price":
                    results = mm.put2("_id", candy_id, upgrade_type, float(new_data))
                else:
                    results = mm.put2("_id", candy_id, upgrade_type, new_data)
                print(results)
        else:
            print("Invalid ID.")
    
    # Delete a candy.
    elif query == "11":
        candy_id = input("Enter candy id to delete.\nThis is permanent.\n")
        if is_valid_object_id(candy_id):
            candy_id = ObjectId(candy_id)
            candyID_query = {"_id": candy_id}
            mm.setCollection("candies")
            results = mm.delete(candy_id)
            print(results)
        else:
            print("Invalid ID.")

    