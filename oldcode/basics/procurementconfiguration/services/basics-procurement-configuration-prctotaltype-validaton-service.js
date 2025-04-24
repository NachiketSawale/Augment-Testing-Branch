/**
 * Created by wuj on 9/2/2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementconfiguration';

	angular.module(moduleName).constant('basicsProcurementConfigurationTotalKinds', {
		freeTotal: 0,
		netTotal: 1,
		fromPackage: 2,
		budgetNet: 3,
		costPlanningNet: 4,
		formula: 5,
		calculatedCost: 6,
		estimateTotal: 7,
		configurableLine:8,
		netTotalNoDiscountSplit: 9
	});

	angular.module(moduleName).factory('basicsProcurementConfigurationPrcTotalTypeValidationService',
		['$translate','platformDataValidationService', 'basicsProcurementConfigurationPrcTotalTypeDataService',
			'platformRuntimeDataService', 'basicsProcurementConfigurationTotalKinds','platformObjectHelper',
			function ($translate,platformDataValidationService, dataService, platformRuntimeDataService, totalKinds,platformObjectHelper) {

				var service = {};
				var self = this;

				self.handleDefaultItem = function (entity) {
					var defaultItem = _.find(dataService.getList(), function (item) {
						return item.Id !== entity.Id && item.IsDefault;
					});


					if (defaultItem && defaultItem.IsDefault) {
						defaultItem.IsDefault = false;
						dataService.markItemAsModified(defaultItem);
					}
				};
				self.removeError = function (entity) {
					if (entity.__rt$data && entity.__rt$data.errors) {
						entity.__rt$data.errors = null;
					}
				};
				self.handleError = function (result, entity, groups) {
					if (!result.valid) {
						_.forEach(groups, function (item) {
							//noinspection JSUnresolvedFunction
							platformRuntimeDataService.applyValidationResult(result, entity, item);
						});
					} else {
						self.removeError(entity);
					}
				};
				self.changeFormulaReadonly = function (entity, value) {
					platformRuntimeDataService.readonly(entity, [{
						field: 'Formula',
						readonly: value
					}]);
				};

				self.changeSqlStatementReadonly = function (entity, value) {
					platformRuntimeDataService.readonly(entity, [{
						field: 'SqlStatement',
						readonly: value
					}]);
				};

				//by zpa: change the status of the IsEditable checkbox
				self.changeIsEditableReadonly=function (entity,value){

					self.changeIsEditableNetReadonly (entity, value);
					self.changeIsEditableTaxReadonly (entity, value);
					self.changeIsEditableGrossReadonly (entity, value);

				};

				self.changeIsEditableNetReadonly = function (entity, value) {
					platformRuntimeDataService.readonly(entity, [{
						field: 'IsEditableNet',
						readonly: value
					}]);
					if(value){
						entity.IsEditableNet=!value;
					}
				};
				self.changeIsEditableTaxReadonly = function (entity, value) {
					platformRuntimeDataService.readonly(entity, [{
						field: 'IsEditableTax',
						readonly: value
					}]);
					if(value){
						entity.IsEditableTax=!value;
					}
				};
				self.changeIsEditableGrossReadonly = function (entity, value) {
					platformRuntimeDataService.readonly(entity, [{
						field: 'IsEditableGross',
						readonly: value
					}]);
					if(value){
						entity.IsEditableGross=!value;
					}
				};

				self.validateFormula = function validateFormula(entity, value) {
					var result = false;
					if (_.isEmpty(value)) {
						result = platformDataValidationService.createErrorObject('basics.procurementconfiguration.nullFormularError', {object: 'formular'});
					} else {
						//noinspection JSUnresolvedFunction
						result = platformDataValidationService.createSuccessObject();
					}
					self.handleError(result, entity, ['Formula']);
					return result;
				};

				service.validateFormula = self.validateFormula;

				service.validatePrcTotalKindFk = function (entity, value, model) {
					var result = {apply: true, valid: true};
					if (value === totalKinds.formula) {
						self.validateFormula(entity, entity.Formula);
						self.changeFormulaReadonly(entity, false);
						self.changeIsEditableReadonly(entity, true);
					}
					else if(value === totalKinds.calculatedCost){
						entity.Formula = null;
						self.changeFormulaReadonly(entity, true);
						self.changeIsEditableReadonly(entity, true);
					}
					else {
						entity.Formula = null;
						self.changeFormulaReadonly(entity, true);
						self.changeIsEditableReadonly(entity, false);
					}
					self.changeSqlStatementReadonly(entity, value !== totalKinds.configurableLine);

					//self.removeError(entity);
					if (value === totalKinds.netTotal || value === totalKinds.costPlanningNet || value === totalKinds.budgetNet) {
						//return platformDataValidationService.isUnique(dataService.getList(), model, value, entity.Id);
						var itemList = dataService.getList();
						var id = entity.Id;
						self.changeIsEditableReadonly(entity, true);
						if (_.some(itemList, function (item) {
							return item.PrcTotalKindFk === value && item.Id !== id;
						})) {
							     var isUniqueError = platformDataValidationService.createErrorObject('cloud.common.uniqueValueErrorMessage', {object: 'Total Kind'});
							     result = angular.extend(result, isUniqueError);
							     //noinspection JSUnresolvedFunction
							platformRuntimeDataService.applyValidationResult(result, entity, model);
							     //noinspection JSUnresolvedFunction
							return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
							//return platformDataValidationService.createErrorObject('cloud.common.uniqueValueErrorMessage', {object: 'Total Kind'});
						} else {
							//update other item
							var oldValue = platformObjectHelper.getValue(_.find(itemList, {Id: id}), model);
							var filter = function (item) {
								return oldValue && oldValue === platformObjectHelper.getValue(item, model);
							};
							angular.forEach(_.filter(itemList, filter), function (item) {
								//noinspection JSUnresolvedFunction
								platformRuntimeDataService.applyValidationResult(true, item, model);
							});
							result= {apply: true, valid: true, error: ''};
							//noinspection JSUnresolvedFunction
							return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);

						}
					}
					//noinspection JSUnresolvedFunction
					return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				};
				service.validateDescriptionInfo = function validateDescriptionInfo() {
					return true;
				};
				service.validateIsDefault = function (entity, value) {
					if (value) {
						var currentItem = dataService.getSelected();
						if (currentItem && currentItem.Id !== entity.Id) {
							dataService.setSelected(entity).then(function () {
								self.handleDefaultItem(entity);
							});
						} else {
							self.handleDefaultItem(entity);
						}
					}
					return true;
				};
				service.validateCode = function (entity, value, model) {
					var result = {apply: true, valid: true};
					if (entity.PrcTotalKindFk === totalKinds.netTotal && (value === '' || value === null) && entity.Code !== 'NET') {
						entity.Code = 'NET';
						value = 'NET';
						const totalTypeItem = dataService.getTotalKind(entity.PrcTotalKindFk);
						if (totalTypeItem) {
							entity.DescriptionInfo.Description = totalTypeItem.Description;
							entity.DescriptionInfo.Translated = totalTypeItem.Description;
							entity.DescriptionInfo.DescriptionModified = true;
							entity.DescriptionInfo.Modified = true;
						}
					}
					if (value === ''||value===null) {
						result.valid = false;
						result.error = $translate.instant('basics.procurementconfiguration.totalTypeNotNull');
					}
					if (result.valid &&!isNaN(value)) {
						var isnumberError = platformDataValidationService.createErrorObject('basics.procurementconfiguration.isNumberError', {object: 'description'});
						result = angular.extend(result, isnumberError);
					}
					if(result.valid){
	                    //noinspection JSUnresolvedFunction
	                    result = platformDataValidationService.isUnique(dataService.getList(), model, value, entity.Id);
					}
					//noinspection JSUnresolvedFunction
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					//noinspection JSUnresolvedFunction
					return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				};

				var validateWhenCreate = function (e, newData) {
					/** @namespace newData.TotalType */
					var result = (newData.TotalType === totalKinds.netTotal || newData.TotalType === totalKinds.costPlanningNet || newData.TotalType === totalKinds.budgetNet);
					if (result) {
						result = platformDataValidationService.createErrorObject('cloud.common.uniqueValueErrorMessage', {object: 'code'});
					} else {
						//noinspection JSUnresolvedFunction
						result = platformDataValidationService.createSuccessObject();
					}
					if (newData.TotalType !==totalKinds.formula) {
						self.changeFormulaReadonly(newData, true);
					}
					if (newData.TotalType !==totalKinds.configurableLine) {
						self.changeSqlStatementReadonly(newData, true);
					}
					if ((newData.TotalType !==totalKinds.fromPackage) && (newData.TotalType !==totalKinds.freeTotal)) {
						self.changeIsEditableReadonly(newData, true);
					}
					self.handleError(result, newData, ['TotalType']);
					return result;
				};
				dataService.registerEntityCreated(validateWhenCreate);
				return service;

			}]);
})(angular);