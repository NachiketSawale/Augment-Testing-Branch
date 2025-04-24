/**
 * Created by chi on 2015/8/13. Implemented by sus. It will be removed later.
 */

(function (angular) {
	'use strict';

	// get a RIB specific schema validation environment
	const env = window.jjvEnvironment();

	angular.module('basics.common').factory('validationService', ['$http', '$q', 'globals', function ($http, $q, globals) {

		const create = function create(schema, schemaUrl) {
			const service = {
				schemaName: schema,
				schemaUrl: schemaUrl,
				jjv: env
			};

			const isAllowNull = function isAllowNull(entity, model) {
				if (env.schema[service.schemaName] === undefined) {
					return false;
				}
				if (env.schema[service.schemaName].required) {
					const required = env.schema[service.schemaName].required;
					for (let i = 0; i < required.length; i++) {
						if (required[i] === model) {
							return false;
						}
					}
				}
				return true;
			};

			/**
			 * @ngdoc service
			 * @name customizeValidate
			 * @parameter entity, model, value
			 * @description you can overwrite the function when you need to add rule
			 */
			service.customizeValidate = function () {
				return {isValid: true, error: null, model: null};
			};

			/**
			 * @ngdoc service
			 * @name validateModel
			 * @parameter entity, model, value
			 * @description validate a single property in the entity
			 */
			service.validateModel = function (entity, model, value) {
				let result = true, allow = false;
				if (!value) {
					allow = isAllowNull(entity, model, value);
					// service.handlerError(allow, entity, model, '');
				}
				if (result && !allow) {
					result = env.validateModel(entity, model, value, service.schemaName);
					service.handlerError(result, entity, model, '');
				}
				if (result && !allow) {
					result = onCustomizeValidate(entity, model, value);
				}
				// if validate pass , can to property change
				if (result && service.onPropertyChanged) {
					service.onPropertyChanged(entity, model, value);
				}
				return result;
			};

			const onCustomizeValidate = function (entity, model, value) {
				let result = true;
				const validateResult = service.customizeValidate(entity, model, value);
				if (angular.isFunction(validateResult.then)) {
					validateResult.then(function (response) {
						result = response.isValid;
						const errorModel = response.model || model;
						service.handlerError(result, entity, errorModel, response.error);
						return result;
					});
				} else {
					result = validateResult.isValid;
					const errorModel = validateResult.model || model;
					service.handlerError(result, entity, errorModel, validateResult.error);
				}
				return result;
			};

			service.handlerError = function handlerError(result, entity, model, errorInfo) {
				if (!result) {
					entity.errors = entity.errors || [];
					entity.errors[model] = entity.errors[model] || [];
					if (entity.errors[model].indexOf(errorInfo) === -1) {
						entity.errors[model].push(errorInfo);
					}
				} else {
					if (angular.isArray(entity.errors) && angular.isObject(entity.errors[model])) {
						delete entity.errors[model];
					}
				}
			};

			service.removeError = function (entity) {
				if (entity.__rt$data && entity.__rt$data.errors) {
					entity.__rt$data.errors = null;
				}
			};

			/**
			 * @ngdoc service
			 * @name validateEntity
			 * @parameter entity, model, value
			 * @description validate the complete entity against the schema
			 */
			service.validateEntity = function (entity) {
				let result = true;

				for (const model in entity) {
					if (Object.prototype.hasOwnProperty.call(entity, model)) {
						const tempResult = onCustomizeValidate(entity, model, entity[model]);
						if (result) {
							result = tempResult;
						}
					}
				}

				return result;
			};

			service.getSchema = function () {
				const defer = $q.defer();
				if (env.schema[service.schemaName]) {
					defer.resolve(env.schema[service.schemaName]);
				} else {
					$http.get(globals.webApiBaseUrl + service.schemaUrl).then(function (response) {
						defer.resolve(response.data);
					});
				}
				return defer.promise;
			};

			const init = function (url) {
				$http(
					{
						method: 'GET',
						// gets the description of the BoqItemEntity as JSON schema
						url: globals.webApiBaseUrl + url
					}
				).then(function (response) {
					env.addSchema(service.schemaName, response.data);
				});
			};

			init(service.schemaUrl);
			return service;
		};

		return {create: create};

	}]);

	// load the schema from the server and add it to the validator environment
})(angular);// Pass in a reference to the global window object