
Creation of a CRUD plugin which can take a mongoDB collection as target and apply CRUD operations against the collection.

Purpose: Required to support ‘Admin user management CRUD’ task for the WEB sub project.




To start this service: NODE_ENV=development node server.js




1. The function createNewRecord, need the request structure examplified below


   For single record, the method would require the collection name in this case i used "user" and a data object containing the field names with their corresponding values
    ```
    {
        "collection" : "users",
        "data": {
            "fname":"daser",
            "lname": "david",
            "address":"nhub"
        }
    }
    ```


   For multiple records, the method would require the collection name in this case i used "user" and  data which is an array of objects containing the field names with their corresponding values per record.
    ```
    {
        "collection" : "users",
        "data": [{
            "fname":"daser",
            "lname": "david",
            "address":"nhub"
        },
        {
            "fname":"zipporah",
            "lname": "sunday",
            "address":"abuja"
        }]           
        
    }
    ```

Route: api/createNewRecord
Method: POST

2. The function deleteRecord requires the request structure exemplified below:

   As a matter of convention in this microservice, collection key contains the name of the collection as value. Then the rowfiler is an object containing the deletion criteria. See two examples below: 

   This deletes a document with lname equals to david.
   ```
   {
        "collection" :"users",
        "rowfilter" : {
            "lname" : "david"
        }
    }
    ```


   This deletes a document with fname equals to daser.

   ```
   {
        "collection" :"users",
        "rowfilter" : {
            "fname" : "daser"
        }
    }
    ```


Route: api/deleteRecord
Method: DELETE

3. The functions updateRecord, request structure exemplified below:

    Collection is collection name, filter is the record we are searching by to update and update is the field we are editing and the value. So in this case, giving users collection, we want to edit change the lname of a user whose fname is zipporah to daser.
   ```
   {
        "collection": "users", //name of table
        "filter" : {
            "fname" : "zipporah"  //get this record
        },
        "update" : {
            "lname" : "daser"     //update this column
        }
    }

    ```


    Route:  api/createNewRecord
    Method: PUT



4. The method getAllRecords, request structure exemplified below:

    Returns all records from users collection with fname equals to zipporah
    ```
    {
        "collection" : "users",
        "filter": {
            "fname":"zipporah"
        }
    }
    ```
 
    Returns all records from users collection with fname equals to zipporah and lname equals dasers

    ```
    {
        "collection" : "users",
        "filter": {
            "fname": "zipporah",
            "lname":"dasers"
        }
    }
    ```

    Route:  api/deleteRecord
    Method: POST


