'use strict';


const
   error_codes = require('../utils/errormessages').error_codes,
   log = require('../helpers/logger').getLogger('ROUTES'),
    _ = require('lodash'),
    Promise = require('bluebird');




exports.createRecord = (ColName, doc) =>{
	if(_.isEmpty(ColName) || _.isEmpty(doc)){
		log.error("Error there are mising or wrong fields");
        return Promise.reject(error_codes.MissingFields);
	}
	if(_.isArray(doc)){
		let numOfdocs = doc.length;
		return ColName.insertMany(doc)
			.then(result => {
				result = result.result;
				let numofInsDocs = result.n;
				if(result.ok ==1 && numofInsDocs){
					return result;
				}else{
					log.error("Error creating record" + JSON.stringify(result));
                    return Promise.reject(error_codes.UnknownError);
				}
			});
	}else{
		return ColName.insertOne(doc)
			.then(result => {
				result = JSON.parse(result);
				if(result.ok ==1){
					return result;
				}else{
					log.error("Error creating record" + JSON.stringify(result));
                    return Promise.reject(error_codes.UnknownError);
				}
			});
	}

};




exports.deleteRecord = (ColName, cfilter) => {
    if (_.isEmpty(cfilter) || _.isEmpty(ColName)) {
        log.error("Error there are missing or wrong fields");
        return Promise.reject(error_codes.MissingFields);
    }

    if (!_.isPlainObject(cfilter)) {
        log.error("Error input is not an object");
        return Promise.reject(error_codes.BadRequest);
    }

  //console.log(Object.keys(cfilter)[0]);

    return ColName.deleteMany(cfilter)
        .then(result => {
            result = JSON.parse(result);
            if (result.n == 0) {
                log.error("Error cannot find any resource in the db");
                return Promise.reject(error_codes.ResourceNotExist);
            }
            else if (result.n > 0) {
                return result;
            }
            else if (result.ok !== 1) {
                log.error("Error cannot delete the value or object described by the input");
                return Promise.reject(error_codes.BadRequest);
            }
            else {
                log.error("Error cannot delete the resource " + JSON.stringify(result));
                return Promise.reject(error_codes.UnknownError)
            }
        });
};


exports.updateRecord = (ColName, filter, update) => {
    if (_.isEmpty(filter) || _.isEmpty(update) || _.isEmpty(ColName)) {
        log.error("Error there are missing or wrong fields");
        return Promise.reject(error_codes.MissingFields);
    }

    let updateQuery = {};
    updateQuery["$set"] = update;

    return ColName.updateMany(filter, updateQuery)
        .then(result => {
            result = JSON.parse(result);
            if (result.ok != 1) {
                log.error("Error cannot construct the value or object described by the input");
                return Promise.reject(error_codes.BadRequest);
            }
            else if (result.nModified >= 0) {
                return result;
            }
            else {
                log.error("Error cannot update the resource " + JSON.stringify(result));
                return Promise.reject(error_codes.UnknownError)
            }
        })
        .catch(err => {
            return Promise.reject(err);
        });
};



exports.getAllRecords = (ColName, filter) => {
    if (_.isEmpty(filter) || _.isEmpty(ColName)) {
        log.error("Error there are missing or wrong fields");
        return Promise.reject(error_codes.MissingFields);
    }
    return ColName.find(filter)
        .toArray()
        .then(result => {
            if (!_.isEmpty(result)) {
                return result;
            }
            else {
                log.error("Error input doesn't exist " + JSON.stringify(filter));
                return Promise.reject(error_codes.ResourceNotExist);
            }
        });
};