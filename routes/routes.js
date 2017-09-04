'use strict';


const
    express = require('express'),
    util = require('util'),
    errorMessages = require('../utils/errormessages'),
    log = require('../helpers/logger').getLogger('ROUTES'),
    CustomUtils = require('../utils/utils'),
    _ = require('lodash');
//=============================================================================
/**
 * Router instance
 */
//=============================================================================
const router = express.Router();

let DB;

/*
    {
    	"collection" : "smiles",
    	"data": {
			"fname":"daser",
			"lname": "david",
			"address":"nhub"
    	}
    }


    {
    	"collection" : "smiles",
    	"data": [{
    		"fname":"daser",
			"lname": "david",
			"address":"nhub"
    	},
    	{
    		"fname":"zipporah",
			"lname": "sunday",
			"address":"abuja"
    	}
    		
    		]
			
    	
}
*/
router.post('/createNewRecord', (req, res) => {
	var colTable = req.body.collection;
	var coll =  DB.collection(`${colTable}`); 
   return CustomUtils.createRecord(coll, req.body.data)
   		.then(doc=>{
   			log.info("Successfully created new record");
   			return res.status(200).json(doc);
   		})
   		.catch(err=>{
   			log.error('error occured' + JSON.stringify(err));
   			let error = errorMessages.processError(err);
            return res.status(error.code).json(error.msg);
   		});
});



/*{
        "collection" :"smiles",
        "rowfilter" : {
            "_id" : "59abbdd107e6e90dd0579485"
        }
}

{
        "collection" :"smiles",
        "rowfilter" : {
            "fname" : "daser"
        }
}
*/
router.delete('/deleteRecord', (req, res) => {
	var colTable = req.body.collection;
	var coll = DB.collection(`${colTable}`);
    return CustomUtils.deleteRecord(coll, req.body.rowfilter)
        .then(ok => {
            log.info("Successfully deleted Record");
            return res.status(200).json(ok);
        })
        .catch(err => {
            log.debug('Delete err ' + JSON.stringify(err));
            let error = errorMessages.processError(err);
            return res.status(error.code).json(error.msg);
        });
});


/*
  {
  		"collection": "smiles", //name of table
        "filter" : {
            "fname" : "zipporah"  //get this record
        },
        "update" : {
            "lname" : "daser"     //update this column
        }
    }
    */
router.put('/updateRecord', (req, res) => {
	var colTable = req.body.collection;
	var coll = DB.collection(`${colTable}`);

    return CustomUtils.updateRecord(coll, req.body.filter, req.body.update)
        .then(doc => {
            log.info("Record successfully updated");
            return res.status(200).json(doc);
        })
        .catch(err => {
            log.info('Update err ' + JSON.stringify(err));
            let error = errorMessages.processError(err);
            return res.status(error.code).json(error.msg);
        });
});

/*
{
    	"collection" : "smiles",
    	"filter": {
			"fname":"zipporah"
    	}
    }


    {
    	"collection" : "smiles",
    	"filter": {
			"fname": "zipporah",
			"lname":"dasers"
    	}
}

*/
router.post('/getAllRecords', (req, res) => {
	var colTable = req.body.collection;
	var coll = DB.collection(`${colTable}`);

    return CustomUtils.getAllRecords(coll, req.body.filter)
        .then(doc => {
            log.info("Successfully got all info");
            return res.status(200).json(doc);
        })
        .catch(err => {
            log.error('Fetch err ' + JSON.stringify(err));
            let error = errorMessages.processError(err);
            return res.status(error.code).json(error.msg);
        });
});



 
module.exports = (db) => {
    DB = db;
    return router;
};