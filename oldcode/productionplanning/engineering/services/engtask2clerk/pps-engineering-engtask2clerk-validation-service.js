(function () {
	'use strict';

	var moduleName = 'productionplanning.engineering';
	angular.module(moduleName).factory('ppsEngTask2ClerkValidationService', ValidationService);

	ValidationService.$inject = ['platformDataValidationService', 'ppsEngTask2ClerkDataService', 'ppsCommonLoggingHelper', 'ppsEntityConstant', 'ppsCommonCustomColumnsServiceFactory'];

	function ValidationService(platformDataValidationService, dataService, ppsCommonLoggingHelper, ppsEntityConstant, customColumnsServiceFactory) {
		var service = {};

		function syncSlotFieldOfTask(entity, value) {
			let taskDataSerive = dataService.parentService();
			let parentSelected = taskDataSerive.getSelectedEntities();
			if (parentSelected && parentSelected.length === 1) {
				let customColumnsService = customColumnsServiceFactory.getService(moduleName);
				let slots = _.filter(customColumnsService.clerkRoleSlots, {
					'ClerkRoleFk': entity.ClerkRoleFk,
					'PpsEntityFk': ppsEntityConstant.EngineeringTask
				});
				if (_.isNil(entity.From) || entity.From === '') {
					slots = slots.filter((slot) => {
						return slot.PpsEntityRefFk === ppsEntityConstant.EngineeringTask || _.isNil(slot.PpsEntityRefFk);
					});
				} else if (entity.From === 'PU') {
					slots = _.filter(slots, (slot) => {
						return slot.PpsEntityRefFk === ppsEntityConstant.PPSItem;
					});
				}
				if(slots.length > 0){
					_.forEach(slots, (slot) => {
						parentSelected[slot.FieldName] = value;
					});
					taskDataSerive.gridRefresh();
				}
			}
		}

		service.validateClerkFk = function (entity, value, model) {
			let result = platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			if ((result === true || (result && result.valid)) && entity.ClerkFk !== value) {
				syncSlotFieldOfTask(entity, value);
			}
			return result;
		};

		function validateMandatory (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		}

		service.validateClerkRoleFk = validateMandatory;

		service.validateValidFrom = function validateValidFrom(entity, value, model) {
			return platformDataValidationService.validatePeriod(value, entity.ValidTo, entity, model, service, dataService, 'ValidTo');
		};

		service.validateValidTo = function validateValidTo(entity, value, model) {
			return platformDataValidationService.validatePeriod(entity.ValidFrom, value, entity, model, service, dataService, 'ValidFrom');
		};

		// extend validation for logging(HP-ALM #128338 by zwz 2022/06/01)
		ppsCommonLoggingHelper.extendValidationIfNeeded(
			dataService,
			service,
			{
				typeName: 'EngTask2ClerkDto',
				moduleSubModule: 'ProductionPlanning.Engineering'
			}
		);

		return service;
	}
})();