# Libraries for FastAPI
from fastapi import FastAPI, Query, Path, File, UploadFile
from fastapi.responses import RedirectResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from typing import List
from mongoManager import MongoManager
from random import randint

# Builtin libraries
import os
import uuid
from random import shuffle


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
IMAGEDIR = "userImages/"
mm = MongoManager(db="candy_store")



@app.get("/")
async def docs_redirect():
    """Api's base route that displays the information created above in the ApiInfo section."""
    return RedirectResponse(url="/docs")



@app.get("/candies", tags=["candies"])
def list_all_candies():
    """
    Retrieve a list of all candies available in the store.
    """
    mm.setCollection("candies")
    result = mm.get(filter={"_id": 0})
    return result

@app.get("/categories", tags=["candies"])
def list_all_categories():
    """
    Retrieve a list of all candy categories available in the store.
    """
    mm.setCollection("categories")
    results = mm.get(filter={"_id": 0})
    return results

@app.get("/candies/category/{category}", tags=["candies"])
def candies_by_category(category: str):
    """
    Search for candies based on a query string (e.g., name, category, flavor).
    """
    mm.setCollection("candies")
    result = mm.get(
        query={"category": category},
        filter={"_id": 0, "id":1, "name": 1, "price": 1, "category": 1},
    )
    return result

@app.get("/candies/desc/{desc}", tags=["candies"])
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

@app.get("/candies/name/{name}", tags=["candies"])
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

@app.get("/candies/id/{id}", tags=["candies"])
def get_candy_by_id(id: str):
    """
    Get detailed information about a specific candy.
    """
    mm.setCollection("candies")
    result = mm.get(
        query={"id": id}, filter={"_id": 0, "name": 1, "price": 1, "category": 1, "desc": 1, "img_url": 1}
    )
    return result

@app.get("/candies/price/{price1}-{price2}", tags=["candies"])
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


@app.post("/candies", tags=["candies"])
def add_new_candy(document):
    """
    Add a new candy to the store's inventory.
    """
    mm.setCollection("candies")
    result = mm.post(document)
    return result
    


@app.put("/candies/{candy_id}/{update_type}/{update_data}", tags=["candies"])
def update_candy_info_not_price(candy_id: int, update_type: str, update_data: str):
    """
    Update information about an existing candy.
    """
    mm.setCollection("candies")
    result = mm.put2("_id", candy_id, update_type, update_data)
    return result


@app.delete("/candies/{candy_id}", tags=["candies"])
def delete_candy(candy_id: int):
    """
    Remove a candy from the store's inventory.
    """
    mm.setCollection("candies")
    result = mm.delete(candy_id)
    return result

@app.get("/location", tags=["location"])
def list_locations():
    """
    Get a list of user locations.
    """
    mm.setCollection("location")
    result = mm.get(filter={"_id": 0})
    return result

    
@app.get("/login", tags=["user"])
def list_logins():
    """
    Login test
    """
    mm.setCollection("login")
    result = mm.get(filter={"_id": 0})
    return result

@app.get("/{user}", tags=["user"])
def check_profile(user: str):
    """
    Contains user info including first and last name
    """
    mm.setCollection("login")
    result = mm.get(
        query={"username": user},
        filter={"_id": 0, "username":1, "firstName": 1, "lastName": 1, "password": 1, "email": 1, "contacts": 1},
    )
    return result

@app.get("/email/{email}", tags=["user"])
def check_profile(email: str):
    """
    Contains user info including first and last name
    """
    mm.setCollection("login")
    result = mm.get(
        query={"email": email},
        filter={"_id": 0, "username":1, "firstName": 1, "lastName": 1, "password": 1},
    )
    return result




    
@app.post("/register/{user}/{pw}/{first}/{last}/{email}", tags=["user"])
def add_new_user(user: str, pw:str, first:str, last:str, email:str):
    """
    Add a new login to the site.
    """
    mm.setCollection("login")
    result = mm.post({"username": user, "password": pw, "firstName": first, "lastName": last, "email": email, "contacts": ["aelious", "bannie", "awills", "jmama"]})
    
    return result

@app.put("/{user}/updatefirst/{updateName}", tags=["user"])
def update_profile_firstName(user: str, updateName: str):
    """
    Update information about an existing user's first OR last name.
    """
    mm.setCollection("login")
    result = mm.put2("username", user, "firstName", updateName)
    return result

@app.put("/{user}/updatelast/{updateName}", tags=["user"])
def update_profile_lastName(user: str, updateName: str):
    """
    Update information about an existing user's first OR last name.
    """
    mm.setCollection("login")
    result = mm.put2("username", user, "lastName", updateName)
    return result

@app.post("/location/{user}/{lat}/{lon}", tags=["location"])
def create_loc_for_user(user: str, lat: float, lon: float):
    """
    Create a user's location
    """
    mm.setCollection("location")
    result = mm.post({"username": user, "latitude": lat, "longitude": lon})
    
    return result


@app.put("/location/{user}/{lat}/{lon}", tags=["location"])
def update_loc_for_user(user: str, lat: float, lon:float):
    """
    Update a user's location
    """
    mm.setCollection("location")
    response1 = mm.put2("username", user, "latitude", lat)
    response2 = mm.put2("username", user, "longitude", lon)
    combined_response = {
        "lat_update_response1": response1,
        "lat_update_response2": response2,
    }
    return (combined_response)

@app.get("/location/{user}", tags=["location"])
def check_profile(user: str):
    """
    Contains user info including username, latitude, and longitude
    """
    mm.setCollection("location")
    result = mm.get(
        query={"username": user},
        filter={"_id": 0, "username":1, "latitude": 1, "longitude": 1},
    )
    return result


@app.delete("/delete/{user_id}", tags=["user"])
def delete_user(user_id: str):
    """
    Remove a user from the store's login database.
    """
    mm.setCollection("login")
    result = mm.delete(user_id)
    return result

@app.post("/uploadfile/{user}")
async def create_upload_file(file: UploadFile, user:str):
    file.filename=f"{user}.jpg"
    contents = await file.read()
    with open(f"{IMAGEDIR}{file.filename}", "wb") as f:
        f.write(contents)
    return {"filename": file.filename}

@app.get("/show/{user}")
async def read_user_image(user:str):
    path = f"{IMAGEDIR}{user}.jpg"

    return FileResponse(path, media_type="image/jpg")

if __name__ == "__main__":
    uvicorn.run(
        "api:app", host="aelious.me", port=8084, log_level="debug", reload=True
    )

