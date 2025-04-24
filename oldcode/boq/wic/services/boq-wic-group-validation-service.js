/**
 * Created by bh on 05.05.2015.
 */
(function () {
	/* global globals, jjvEnvironment */
	'use strict';

	var moduleName = 'boq.wic';

	/**
	 * @ngdoc service
	 * @name boqWicGroupValidationService
	 * @description provides validation methods for boq wic group entities
	 */
	angular.module(moduleName).factory('boqWicGroupValidationService', ['$http', '$injector', 'platformDataValidationService',
		function ($http, $injector, platformDataValidationService) {

			var service = {};

			// get a RIB specific schema validation environment
			var env = jjvEnvironment();

			// Unique name of scheme for activity validation
			var BOQ_WIC_GROUP_SCHEME = 'boqwicgroupscheme';

			// validate a single property in the entity
			service.validateModel = function (entity, model, value) {
				return env.validateModel(entity, model, value, BOQ_WIC_GROUP_SCHEME);
			};

			// validate the complete entity against the schema
			service.validateEntity = function (entity) {
				return env.validateEntity(entity, BOQ_WIC_GROUP_SCHEME);
			};

			service.validateCode = function (entity, value) {
				var dataService = $injector.get('boqWicGroupService');
				var items = dataService.getList();

				return platformDataValidationService.validateMandatoryUniqEntity(entity, value, 'Code', items, service, dataService);
			};

			service.asyncValidateCode = function asyncValidateCode(entity, value, model) {
				var dataService = $injector.get('boqWicGroupService');
				return platformDataValidationService.isAsyncUnique(globals.webApiBaseUrl + 'boq/wic/group/iscodeunique', entity, value, model).then(function (response) {
					return platformDataValidationService.finishAsyncValidation(response, entity, value, model, null, service, dataService);
				});
			};

			var init = function () {
				$http(
					{
						method: 'GET',
						// gets the description of the activity as JSON schema
						url: globals.webApiBaseUrl + 'boq/wic/group/scheme'
					}
				).then(function (response) {
					env.addSchema(BOQ_WIC_GROUP_SCHEME, response.data);
				});
			};
			init();

			return service;
		}
	]);

})();