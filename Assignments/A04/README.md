## A04 - MongoDB
### Stephanie Nagel
### Description:

Server created and is up and running! IP: 64.225.25.171

### Files

|   #   | File            | Description                                        |
| :---: | --------------- | -------------------------------------------------- |
|  1    |   api.py      |     API for our candy store database.       |
|  2    |   loadMongo.py      |   Used to populate the database.     |
|  3    |   mongoManager.py     |      Handles mongo requests.       |

### Instructions:

The API should be publicly available [here](http://aelious.me:8080/docs).

Server terminal instructions:
After connecting to the server via ssh, navigate to the A04 folder.
Run the command `source myenv/bin/activate` to activate the virtual environment.
Follow this command with `pip install -r requirements.txt` to ensure dependencies are available.
Use `python3 mongoManager.py #` where # is replaced by a value from 1 to 11 to perform requests on the database.
