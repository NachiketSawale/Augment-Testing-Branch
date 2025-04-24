/**
 * Created by waz on 1/25/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.bundle';

	angular.module(moduleName).factory('transportplanningBundleValidationServiceFactory', TransportplanningBundleValidationServiceFactory);

	TransportplanningBundleValidationServiceFactory.$inject = ['platformDataValidationService', 'ppsCommonCustomColumnsServiceFactory',
		'moment', 'ppsCommonTransportInfoHelperService'];

	function TransportplanningBundleValidationServiceFactory(platformDataValidationService, customColumnsServiceFactory,
															 moment, ppsCommonTransportInfoHelperService) {
		var serviceCache = {};

		function createService(dataService) {
			var service = {
				validateCode: validateCode,
				validateLgmJobFk: validateLgmJobFk,
				validateProjectFk: validateProjectFk,
				validateLoadingDevice$Quantity: validateLoadingDevice$Quantity,
				validateLoadingDevice$RequestedFrom: validateLoadingDevice$RequestedFrom,
				validateLoadingDevice$RequestedTo: validateLoadingDevice$RequestedTo,
				validateLoadingDevice$UomFk: validateLoadingDevice$UomFk,
				validateLoadingDevice$TypeFk: validateLoadingDevice$TypeFk,
				validateLoadingDevice$JobFk: validateLoadingDevice$JobFk
			};

			function validateCode(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			}

			function validateLgmJobFk(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			}

			function validateProjectFk(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			}

			function validateLoadingDevice$Quantity(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			}

			function validateLoadingDevice$RequestedFrom(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			}

			function validateLoadingDevice$RequestedTo(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			}

			function validateLoadingDevice$UomFk(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			}

			function validateLoadingDevice$TypeFk(entity, value, model) {
				entity.ResTypeFk = value;
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			}

			function validateLoadingDevice$JobFk(entity, value, model) {
				return validateForeignKeyFieldMandatory(entity, value, model, service, dataService);
			}

			function validateForeignKeyFieldMandatory(entity, value, model, service, itemDataService, invalidValues) {
				//check if value is invalid
				var invalidValueArray = [0];//generally, we set value 0 as the invalid value for foreign key field
				if (invalidValues) {
					invalidValueArray = invalidValues;
				}
				if (invalidValueArray.indexOf(value) > -1) {
					value = null;
				}
				//validate mandatory of value
				return platformDataValidationService.validateMandatory(entity, value, model, service, itemDataService);
			}

			var customColumnsService = customColumnsServiceFactory.getService(moduleName);
			customColumnsService.addValidations(service, dataService, 'transportplanning.bundle.event', 'transportplanning/bundle/bundle/geteventslotvalue');

			ppsCommonTransportInfoHelperService.addValidations(dataService, service);

			return service;
		}

		//get service or create service by data-service name
		function getService(dataService) {
			var dsName = dataService.getServiceName();
			var srv = serviceCache[dsName];
			if (_.isNull(srv) || _.isUndefined(srv)) {
				srv = createService(dataService);
				serviceCache[dsName] = srv;
			}
			return srv;
		}

		return {
			createService: createService,
			getService: getService
		};
	}
})(angular);
