## A04 - MongoDB
### Stephanie Nagel
### Description:

Server created and is up and running! IP: 64.225.25.171

View the current progress [here](https://aelious.me/Candy-Store)!

### Files

|   #   | File            | Description                                        |
| :---: | --------------- | -------------------------------------------------- |
|  1    |   [api.py](https://github.com/aelious/4443-MobileApps/blob/main/Assignments/A04/api.py)      |     API for our candy store database.       |
|  2    |   [loadMongo.py](https://github.com/aelious/4443-MobileApps/blob/main/Assignments/A04/loadMongo.py)      |   Used to populate the database.     |
|  3    |   [mongoManager.py](https://github.com/aelious/4443-MobileApps/blob/main/Assignments/A04/mongoManager.py)     |      Handles mongo requests.       |

### Instructions:

The API should be publicly available [here](http://aelious.me:8080/docs). If it's not, follow the following instructions.

Server terminal instructions:

1. After connecting to the server via ssh, navigate to the A04 folder.

2. Run the command `source myenv/bin/activate` to activate the virtual environment.

3. Run `pip install -r requirements.txt` to ensure dependencies are available.

4. Use `python3 mongoManager.py #` where # is replaced by a value from 1 to 11 to perform requests on the database.

** If the API is down, run `python3 api.py` after these instructions **
