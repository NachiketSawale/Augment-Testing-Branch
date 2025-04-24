/**
 * Created by chi on 6/28/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'procurement.package';

	angular.module(moduleName).factory('procurementPackageItemAssignmentValidationService', procurementPackageItemAssignmentValidationService);

	procurementPackageItemAssignmentValidationService.$inject = ['_', 'procurementPackageItemAssignmentReadonlyProcessor',
		'procurementPackageBoqLookupService', 'cloudCommonGridService', 'procurementPackageItemAssignmentValidationStatusService'];

	function procurementPackageItemAssignmentValidationService(_, procurementPackageItemAssignmentReadonlyProcessor,
		procurementPackageBoqLookupService, cloudCommonGridService,
		procurementPackageItemAssignmentValidationStatusService) {

		var serviceCache = {};

		return getService;

		// ////////////////////
		function getService(name, dataService) {
			if (serviceCache[name]) {
				return serviceCache[name];
			} else {
				var newService = config(dataService);
				serviceCache[name] = newService;
				return newService;
			}
		}

		function config(dataService) {
			var service = {};

			service.validateEstHeaderFk = validateEstHeaderFk;
			service.validateEstLineItemFk = validateEstLineItemFk;
			service.validateBoqItemFk = validateBoqItemFk;
			service.validateEstResourceFk = validateEstResourceFk;
			service.validatePrcItemFk = validatePrcItemFk;

			procurementPackageItemAssignmentValidationStatusService.setDataService(dataService);
			procurementPackageItemAssignmentValidationStatusService.setValidationService(service);

			return service;

			// /////////////////////////////////
			function validateEstHeaderFk(entity, value, model) {
				var result = procurementPackageItemAssignmentValidationStatusService.validateAsChangeEntity(entity, value, model);
				setFieldsReadonly(entity, value, model);
				return result;
			}

			function validateEstLineItemFk(entity, value, model) {
				var result = procurementPackageItemAssignmentValidationStatusService.validateAsChangeEntity(entity, value, model);
				setFieldsReadonly(entity, value, model);
				return result;
			}

			function validateBoqItemFk(entity, value, model) {
				var result = procurementPackageItemAssignmentValidationStatusService.validateAsChangeEntity(entity, value, model);
				setFieldsReadonly(entity, value, model);
				return result;
			}

			function validateEstResourceFk(entity, value, model) {
				var result = procurementPackageItemAssignmentValidationStatusService.validateAsChangeEntity(entity, value, model);
				setFieldsReadonly(entity, value, model);
				return result;
			}

			function validatePrcItemFk(entity, value, model) {
				var result = procurementPackageItemAssignmentValidationStatusService.validateAsChangeEntity(entity, value, model);
				setFieldsReadonly(entity, value, model);
				return result;
			}

			function setFieldsReadonly(entity, value, model) {
				var temp = angular.copy(entity);
				temp[model] = value;
				procurementPackageItemAssignmentReadonlyProcessor.setReadonly(temp, 'EstHeaderFk');
				procurementPackageItemAssignmentReadonlyProcessor.setReadonly(temp, 'EstLineItemFk');
				procurementPackageItemAssignmentReadonlyProcessor.setReadonly(temp, 'BoqItemFk');
				procurementPackageItemAssignmentReadonlyProcessor.setReadonly(temp, 'EstResourceFk');
				procurementPackageItemAssignmentReadonlyProcessor.setReadonly(temp, 'PrcItemFk');
				angular.extend(entity.__rt$data.readonly, temp.__rt$data.readonly);
			}

		}
	}
})(angular);