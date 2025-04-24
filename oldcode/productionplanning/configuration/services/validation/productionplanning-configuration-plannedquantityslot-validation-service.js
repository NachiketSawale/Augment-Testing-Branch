/**
 * Created by zwz on 2022/9/26
 */
(function (angular) {
	/* global _ */
	'use strict';
	const moduleName = 'productionplanning.configuration';
	let angModule = angular.module(moduleName);

	angModule.factory('productionplanningConfigurationPlannedQuantitySlotValidationService', ValidationService);

	ValidationService.$inject = ['platformDataValidationService', 'platformModuleStateService', 'platformRuntimeDataService', 'productionplanningConfigurationPlannedQuantitySlotDataService',
		'ppsConfigurationPlannedQuantityTypes'];

	function ValidationService(platformDataValidationService, platformModuleStateService, platformRuntimeDataService, dataService,
		plannedQuantityTypes) {
		let service = {};

		function canUomBeNull(plnQtyTypeId) {
			// if Type is Property or Userdefined, field Uom is nullable, otherwise Uom is required.
			return plnQtyTypeId === plannedQuantityTypes.Property || plnQtyTypeId === plannedQuantityTypes.Userdefined ||
				plnQtyTypeId === plannedQuantityTypes.Characteristic || plnQtyTypeId === plannedQuantityTypes.FormulaParameter;
		}

		function canResultBeNull(plnQtyTypeId) {
			// if Type is Userdefined, field Result is nullable
			return plnQtyTypeId === plannedQuantityTypes.Userdefined || plnQtyTypeId === plannedQuantityTypes.FormulaParameter;
		}

		function clearError(result, entity, model) {
			// clear error if validation passes
			if ((result === true || result.valid === true) && entity.__rt$data.errors) {
				delete entity.__rt$data.errors[model];
				let modState = platformModuleStateService.state(dataService.getModule ? dataService.getModule() : dataService.getService().getModule());
				if (modState.validation && modState.validation.issues) {
					_.remove(modState.validation.issues, function (error) {
						if (_.has(error, 'model') && error.model === model) {
							return true;
						}
					});
				}
			}
		}

		function onValidateField(result, entity, model) {
			clearError(result, entity, model); // clear error if validation passes
			platformRuntimeDataService.applyValidationResult(result, entity, model);
		}

		function trickValidateUom(entity, plnQtyTypeFkNewValue) {
			let resultUom = canUomBeNull(plnQtyTypeFkNewValue) ? true : platformDataValidationService.validateMandatory(entity, entity.BasUomFk, 'BasUomFk', service, dataService);
			onValidateField(resultUom, entity, 'BasUomFk');
		}

		function trickValidateResult(entity, plnQtyTypeFkNewValue) {
			let result = canResultBeNull(plnQtyTypeFkNewValue) ? true : platformDataValidationService.validateMandatory(entity, entity.Result, 'Result', service, dataService);
			onValidateField(result, entity, 'Result');
		}

		function onPpsPlannedQuantityTypeFkChanging(entity, value) {
			// clear value of field Result if PpsPlannedQuantityTypeFk changed
			if (!_.isNil(entity.PpsPlannedQuantityTypeFk)) {
				entity.BasUomFk = null;
				entity.Result = null;
				entity.MdcMaterialFk = null;
				entity.MdcCostCodeFk = null;
				entity.Property = null;
				entity.CharacteristicFk = null;
				entity.FormulaParameter = null;
				entity.MdcProductDescriptionFk = null;
			}

			trickValidateUom(entity, value);
			trickValidateResult(entity, value);
		}

		function onResultChanging(entity, value) {
			entity.MdcProductDescriptionFk = null;
			function setUom(entity) {
				let tmpUomId = null;
				if (entity.selectedResult) {
					if (entity.selectedResult.UomFk) {
						tmpUomId = entity.selectedResult.UomFk;
					} else if (entity.selectedResult.BasUomFk) {
						tmpUomId = entity.selectedResult.BasUomFk;
					}
					entity.selectedResult = null;
				}
				entity.BasUomFk = tmpUomId;
				trickValidateUom(entity, entity.PpsPlannedQuantityTypeFk);
			}

			switch (entity.PpsPlannedQuantityTypeFk) {
				case plannedQuantityTypes.Material:
					entity.MdcMaterialFk = value;
					setUom(entity);
					break;
				case plannedQuantityTypes.CostCode:
					entity.MdcCostCodeFk = value;
					setUom(entity);
					break;
				case plannedQuantityTypes.Property:
					entity.Property = value;
					break;
				case plannedQuantityTypes.Characteristic:
					entity.CharacteristicFk = value;
					break;
				case plannedQuantityTypes.FormulaParameter:
					entity.FormulaParameter = value;
					break;
			}
		}

		service.validatePpsPlannedQuantityTypeFk = function (entity, value, model) {
			let result = platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			if (result === true || (result && result.valid === true)) {
				onPpsPlannedQuantityTypeFkChanging(entity, value);
			}
			return result;
		};

		service.validateResult = function (entity, value, model) {
			if (entity.PpsPlannedQuantityTypeFk === plannedQuantityTypes.Userdefined) {
				return true;
			}
			value = value === 0 ? null : value;
			let result = platformDataValidationService.validateMandatory(entity, value, model, service, dataService);

			if (result === true || (result && result.valid === true)) {
				onResultChanging(entity, value);
			} else { // clear BasUomFk if Result is changed to null
				entity.BasUomFk = null;
				trickValidateUom(entity, entity.PpsPlannedQuantityTypeFk);
			}
			return result;
		};

		service.validateBasUomFk = function (entity, value, model) {
			if (canUomBeNull(entity.PpsPlannedQuantityTypeFk)) {
				clearError(true, entity, model);
				return true;
			}
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};

		return service;
	}
})(angular);
