(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('productionplanningItemClerkValidationService', PPSItemClerkValidationService);

	PPSItemClerkValidationService.$inject = ['platformDataValidationService', 'productionplanningItemClerkDataService', 'ppsCommonLoggingHelper', 'ppsEntityConstant', 'ppsCommonCustomColumnsServiceFactory'];


	function PPSItemClerkValidationService(platformDataValidationService, dataService, ppsCommonLoggingHelper, ppsEntityConstant, customColumnsServiceFactory) {
		var service = {};

		function syncSlotFieldOfPu(entity, value) {
			let itemDataSerive = dataService.parentService();
			let parentSelected = itemDataSerive.getSelectedEntities();
			if (parentSelected && parentSelected.length === 1) {
				let customColumnsService = customColumnsServiceFactory.getService(moduleName);
				let slots = _.filter(customColumnsService.clerkRoleSlots, {
					'ClerkRoleFk': entity.ClerkRoleFk,
					'PpsEntityFk': ppsEntityConstant.PPSItem
				});
				if (_.isNil(entity.From) || entity.From === '') {
					slots = slots.filter((slot) => {
						return slot.PpsEntityRefFk === ppsEntityConstant.PPSItem || _.isNil(slot.PpsEntityRefFk);
					});
				} else if (entity.From === 'ENGTASK') {
					slots = _.filter(slots, (slot) => {
						return slot.PpsEntityRefFk === ppsEntityConstant.EngineeringTask;
					});
				}
				if(slots.length > 0){
					_.forEach(slots, (slot) => {
						parentSelected[slot.FieldName] = value;
					});
					itemDataSerive.gridRefresh();
				}
			}
		}

		service.validateClerkRoleFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};

		service.validateClerkFk = function (entity, value, model) {
			let result = platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			if ((result === true || (result && result.valid)) && entity.ClerkFk !== value) {
				syncSlotFieldOfPu(entity, value);
			}
			return result;
		};

		service.validateValidFrom = function validateValidFrom(entity, value, model) {
			return platformDataValidationService.validatePeriod(value, entity.ValidTo, entity, model, service, dataService, 'ValidTo');
		};

		service.validateValidTo = function validateValidTo(entity, value, model) {
			return platformDataValidationService.validatePeriod(entity.ValidFrom, value, entity, model, service, dataService, 'ValidFrom');
		};


		// extend validation for logging(HP-ALM #128338 by zwz 2022/04/20)
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
})(angular);