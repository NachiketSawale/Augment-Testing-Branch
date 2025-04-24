/**
 * Created by las on 1/25/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.engineering';

	angular.module(moduleName).factory('productionplanningEngineeringTaskValidationService', ValidationService);

	ValidationService.$inject = ['$http', '$q', 'platformDataValidationService',
		'productionplanningEngineeringMainService', 'ppsCommonCustomColumnsServiceFactory','productionplanningCommonEventValidationServiceExtension'];

	function ValidationService($http, $q, platformDataValidationService,
	                           dataServ, customColumnsServiceFactory,eventValidationServiceExtension) {
		var service = {};

		function validateForeignKeyFieldMandatory(entity, value, model) {
			// check if value is invalid
			var invalidValueArray = [0]; // Generally, we set value 0 as the invalid value for foreign key field. At least, PRJ_PROJECT, BAS_CLERK, BAS_SITE and LGM_JOB don't have a record whose ID is 0.
			if (invalidValueArray.indexOf(value) > -1) {
				value = null;
			}
			//validate mandatory of value
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataServ);
		}

		service.validateEngHeaderFk = validateForeignKeyFieldMandatory;
		service.validateClerkFk = validateForeignKeyFieldMandatory;

		//validate mandatory and unique for Code
		service.validateCode = function (entity, value, model) {
			//get engtask items under the same engheader
			var itemList = dataServ.getList();
			var items = [];
			_.each(itemList, function (item) {
				if (item.EngHeaderFk === entity.EngHeaderFk) {
					items.push(item);
				}
			});
			//validate mandatory and unique
			return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, service, dataServ);
		};
		//async validate unique for Code
		service.asyncValidateCode = function (entity, value, model) {
			//asynchronous validation is only called, if the normal returns true, so we do not need to call it again.
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataServ);
			//Now the data service knows there is an outstanding asynchronous request.
			var url = globals.webApiBaseUrl + 'productionplanning/engineering/task/isuniquecode?id=' + entity.Id + '&&engheaderid=' + entity.EngHeaderFk + '&&code=' + value;
			asyncMarker.myPromise = $http.get(url).then(function (response) {
				//Interprete result.
				var res = {};
				if (response.data) {
					res = {apply: true, valid: true, error: ''};
				} else {
					res.valid = false;
					res.apply = true;
					res.error = '...';
					res.error$tr$ = 'productionplanning.engineering.errors.uniqTaskCode';
				}
				//Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
				platformDataValidationService.finishAsyncValidation(res, entity, value, model, asyncMarker, service, dataServ);
				//Provide result to grid / form container.
				return res;
			});

			return asyncMarker.myPromise;
		};

		eventValidationServiceExtension.addMethodsForEvent(service,dataServ);
		eventValidationServiceExtension.addMethodsForDerivedEvent(service);

		var customColumnsService = customColumnsServiceFactory.getService(moduleName);
		customColumnsService.addValidations(service, dataServ, '', 'productionplanning/engineering/task/geteventslotvalue');

		customColumnsService.addValidationsOfClerkRoleSlotColumns(service, dataServ); // for HP-ALM #128338  by zwz 2022/6/2

		return service;
	}
})(angular);