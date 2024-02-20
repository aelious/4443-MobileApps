# Libraries for FastAPI
from fastapi import FastAPI, Query, Path
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json
from pymongo import MongoClient
from typing import List
from pydantic import BaseModel
from mongoManager import MongoManager

# Builtin libraries
import os

from random import shuffle

"""
           _____ _____   _____ _   _ ______ ____
     /\   |  __ \_   _| |_   _| \ | |  ____/ __ \
    /  \  | |__) || |     | | |  \| | |__ | |  | |
   / /\ \ |  ___/ | |     | | | . ` |  __|| |  | |
  / ____ \| |    _| |_   _| |_| |\  | |   | |__| |
 /_/    \_\_|   |_____| |_____|_| \_|_|    \____/

The `description` is the information that gets displayed when the api is accessed from a browser and loads the base route.
Also the instance of `app` below description has info that gets displayed as well when the base route is accessed.
"""

description = """🤡
(temp desc.)🤡


## Description:
API For Website

#### Contact Information:

- **Email:** aeliousx@gmail.com
- **Website:** www.aelious.me

"""

# Needed for CORS
# origins = ["*"]


# This is the `app` instance which passes in a series of keyword arguments
# configuring this instance of the api. The URL's are obviously fake.
app = FastAPI(
    title="aelious.me",
    description=description,
    version="0.0.1",
    terms_of_service="https://aelious.me",
    contact={
        "name": "aelious.me",
        "url": "https://www.aelious.me",
        "email": "aeliousx@gmail.com",
    },
    license_info={
        "name": "Apache 2.0",
        "url": "https://www.apache.org/licenses/LICENSE-2.0.html",
    },
)

# Needed for CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

"""
  _      ____   _____          _         _____ _                _____ _____ ______  _____
 | |    / __ \ / ____|   /\   | |       / ____| |        /\    / ____/ ____|  ____|/ ____|
 | |   | |  | | |       /  \  | |      | |    | |       /  \  | (___| (___ | |__  | (___
 | |   | |  | | |      / /\ \ | |      | |    | |      / /\ \  \___ \\___ \|  __|  \___ \
 | |___| |__| | |____ / ____ \| |____  | |____| |____ / ____ \ ____) |___) | |____ ____) |
 |______\____/ \_____/_/    \_\______|  \_____|______/_/    \_\_____/_____/|______|_____/

This is where you will add code to load all the countries and not just countries. Below is a single
instance of the class `CountryReader` that loads countries. There are 6 other continents to load or
maybe you create your own country file, which would be great. But try to implement a class that 
organizes your ability to access a countries polygon data.
"""

mm = MongoManager(db="candy_store")

"""
  _      ____   _____          _        __  __ ______ _______ _    _  ____  _____   _____
 | |    / __ \ / ____|   /\   | |      |  \/  |  ____|__   __| |  | |/ __ \|  __ \ / ____|
 | |   | |  | | |       /  \  | |      | \  / | |__     | |  | |__| | |  | | |  | | (___
 | |   | |  | | |      / /\ \ | |      | |\/| |  __|    | |  |  __  | |  | | |  | |\___ \
 | |___| |__| | |____ / ____ \| |____  | |  | | |____   | |  | |  | | |__| | |__| |____) |
 |______\____/ \_____/_/    \_\______| |_|  |_|______|  |_|  |_|  |_|\____/|_____/|_____/

This is where methods you write to help with any routes written below should go. Unless you have 
a module written that you include with statements above.  
"""


"""
  _____   ____  _    _ _______ ______  _____
 |  __ \ / __ \| |  | |__   __|  ____|/ ____|
 | |__) | |  | | |  | |  | |  | |__  | (___
 |  _  /| |  | | |  | |  | |  |  __|  \___ \
 | | \ \| |__| | |__| |  | |  | |____ ____) |
 |_|  \_\\____/ \____/   |_|  |______|_____/

 This is where your routes will be defined. Routes are just python functions that retrieve, save, 
 delete, and update data. How you make that happen is up to you.
"""


@app.get("/")
async def docs_redirect():
    """Api's base route that displays the information created above in the ApiInfo section."""
    return RedirectResponse(url="/docs")


@app.get("/candies")
def list_all_candies():
    """
    Retrieve a list of all candies available in the store.
    """
    mm.setCollection("candies")
    result = mm.get(filter={"_id": 0})
    return result

@app.get("/categories")
def list_all_categories():
    """
    Retrieve a list of all candy categories available in the store.
    """
    mm.setCollection("categories")
    results = mm.get(filter={"_id": 0})
    return results

@app.get("/candies/category/{category}")
def candies_by_category(category: str):
    """
    Search for candies based on a query string (e.g., name, category, flavor).
    """
    mm.setCollection("candies")
    result = mm.get(
        query={"category": category},
        filter={"_id": 0, "name": 1, "price": 1, "category": 1},
    )
    return result

@app.get("/candies/desc/{desc}")
def candies_by_description(desc: str):
    """
    Search for candies based on a description keyword string (e.g., name, category, flavor).
    """
    mm.setCollection("candies")
    regex_query = {
        "desc": {"$regex": desc, "$options": "i"}
    } 
    results = mm.get(
        query=regex_query,
        sort_criteria=[("name", 1)],
    )
    return results

@app.get("/candies/name/{name}")
def candies_by_name(name: str):
    """
    Search for candies based on a name keyword string (e.g., name, category, flavor).
    """
    mm.setCollection("candies")
    regex_query = {
        "name": {"$regex": name, "$options": "i"}
    } 
    results = mm.get(
        query=regex_query,
        sort_criteria=[("name", 1)],
    )
    return results

@app.get("/candies/id/{id}")
def get_candy_by_id(id: str):
    """
    Get detailed information about a specific candy.
    """
    mm.setCollection("candies")
    result = mm.get(
        query={"id": id}, filter={"_id": 0, "name": 1, "price": 1, "category": 1}
    )
    return result

@app.get("/candies/price/{price1}-{price2}")
def get_candy_by_price_range(price1: float, price2: float):
    """
    Get candies within a specified price range.
    """
    price_range_query = {"price": {"$gte": price1, "$lte": price2}}
    mm.setCollection("candies")
    rangeQuery = mm.get(
        query=price_range_query,
        filter={"_id": 0, "price": 1, "category_id": 1, "name": 1},
        sort_criteria={"price": -1},
    )
    return rangeQuery


@app.post("/candies")
def add_new_candy(document):
    """
    Add a new candy to the store's inventory.
    """
    mm.setCollection("candies")
    result = mm.post(document)
    return result
    


@app.put("/candies/{candy_id}/{update_type}/{update_data}")
def update_candy_info_not_price(candy_id: int, update_type: str, update_data: str):
    """
    Update information about an existing candy.
    """
    mm.setCollection("candies")
    result = mm.put2("_id", candy_id, update_type, update_data)
    return result


@app.delete("/candies/{candy_id}")
def delete_candy(candy_id: int):
    """
    Remove a candy from the store's inventory.
    """
    mm.setCollection("candies")
    result = mm.delete(candy_id)
    return result


@app.get("/categories")
def list_categories():
    """
    Get a list of candy categories (e.g., chocolates, gummies, hard candies).
    """
    mm.setCollection("categories")
    result = mm.get(filter={"_id": 0})
    return result
    


@app.get("/promotions")
def promotions_and_deals():
    """
    Information about current promotions, deals, or discounts.
    """
    return "NO PROMOTIONS. YOU PAY FULL PRICE. >:-("
    


@app.get("/store-info")
def store_information():
    """
    Basic information about the candy store, including contact details.
    """
    return "Come visit Generic Candy Store! We have the best collection of candies you can find!"

if __name__ == "__main__":
    uvicorn.run(
        "api:app", host="aelious.me", port=8080, log_level="debug", reload=True
    )

