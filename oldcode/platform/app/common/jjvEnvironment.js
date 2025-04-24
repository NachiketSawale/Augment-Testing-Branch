(function (window) {

	'use strict';

	/**
	 * returns a RIB specific environment for jjs schema validation tool
	 * requires moment.js lib
	 **/

	function jjvEnvironment() {
		var env = jjv();

		env.defaultOptions.checkRequired = true;
		env.defaultOptions.useCoerce = true;         // enables type coercion where defined.

		// convert valid numeric strings to the 'number' type before check them (string types do not pass the number type validation !)
		env.addTypeCoercion('number', function (x) {

			if (isNumeric(x)) {
				return parseFloat(x);
			} else {
				return x;
			}
		});

		// convert valid integer strings to the 'integer' type before check them (string types do not pass the integer type validation !)
		env.addTypeCoercion('integer', function (x) {

			if (isInteger(x)) {
				return parseInt(x);
			} else {
				return x;
			}
		});

		// convert null objects to an empty string before check them (object types do not pass the string type validation !)
		env.addTypeCoercion('string', function (x) {

			if (x === null) {
				return '';
			} else {
				return x;
			}
		});

		// additional types
		env.addType('date', function (x) {

			/* jshint -W117 */
			var m = moment(x);  // moment.js is required !
			/* jshint +W117 */
			return m.isValid();
		});

		// update the error list of an complete entity
		env.setErrors = function (entity, errors, schemaName) {
			env.clearErrors(entity);
			for (var property in errors) {
				env.setPropertyErrors(entity, property, errors[property], schemaName);
			}
		};

		// remove the error property of an entity object
		env.clearErrors = function (entity) {
			entity.errors = undefined;
		};

		//

		/**
		 * @ngdoc function
		 * @name setPropertyErrors
		 * @function
		 * @methodOf jjvEnvironment
		 * @description updates the error list of a single property
		 * @param {errors} an object array (e.g. 0: ERR_KEY1, 1: ERR_KEY2)
		 * @returns
		 */
		env.setPropertyErrors = function (entity, propertyName, errors, schemaName) {
			var schema = env.schema[schemaName];
			if (entity.hasOwnProperty(propertyName)) {

				if (entity.errors === undefined) {
					// entity.errors = [];
					entity.errors = {};
				}

				env.clearPropertyErrors(entity, propertyName);
				var keys = [];
				for (var error in errors) {
					var propertySchema = schema.properties[propertyName];
					if (propertySchema.hasOwnProperty(error + 'ErrorKey')) {    // predefined error key
						keys.push(propertySchema[error + 'ErrorKey']);
					} else {
						keys.push(errors[error]);   // individual error key object
					}
				}
				if (keys.length > 0) {
					entity.errors[propertyName] = keys;
				}
			}
		};

		// remove errors for a property from the entity error list
		env.clearPropertyErrors = function (entity, propertyName) {
			if (entity.errors !== undefined) {
				if (entity.hasOwnProperty(propertyName)) {
					delete entity.errors[propertyName];
				}
			}
		};

		// validate a single property in the entity
		env.validateModel = function (entity, model, value, schemaName) {

			if (env.schema[schemaName] === undefined) {
				return true;
			}

			// create a validation object with a single property
			var object2Validate = {};
			object2Validate[model] = value;
			// clear the error list of the property
			env.clearPropertyErrors(entity, model);
			// call jjv validation
			var errors = env.validate(schemaName, object2Validate);
			if (!errors)   // validation was successful
			{
				return true;
			} else {

				// object has errors - check for model specific errors
				if (errors.validation[model] === undefined) {
					return true;
				} else {
					// update the error list of the property
					env.setPropertyErrors(entity, model, errors.validation[model], schemaName);
					return false;
				}
			}
		};

		// validate the complete entity against the schema
		env.validateEntity = function (entity, schemaName) {

			if (env.schema[schemaName] === undefined) {
				return true;
			}

			var errors = env.validate(schemaName, angular.copy(entity));   // test with a cloned entity to keep original values !
			if (!errors) {          // validation was successful
				return true;
			} else {
				env.setErrors(entity, errors.validation, schemaName);
				return false;
			}
		};

		env.entityHasErrors = function (entity) {
			var hasErrors = entity.errors !== undefined && Object.keys(entity.errors).length > 0;
			return hasErrors;
		};

		return env;
	}

	function isNumeric(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	function isInteger(n) {
		return isNumeric(n) && n % 1 === 0;
	}

	// 'window' refers to the parameter
	window.jjvEnvironment = jjvEnvironment;

})(window); // Pass in a reference to the global window object
