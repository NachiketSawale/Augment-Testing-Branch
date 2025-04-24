/**
 * Created by clv on 2/5/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.common';
	/**
	 * @ngdoc service
	 * @name constructionSystemCommonObjectParamValidationService
	 * @description provides validation methods for ConstructionSystemObjectParam
	 */
	/* jshint -W074 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('constructionSystemCommonObjectParamValidationService',
		['_', 'basicsLookupdataLookupDescriptorService',
			'platformModalService', 'constructionSystemMainInstance2ObjectParamFormatterProcessor', '$http',
			'parameterDataTypes',
			'constructionSystemMasterParameterValidationHelperService',
			'constructionSystemMainScriptDataService', 'constructionSystemMainValidationEnhanceService',
			'constructionSystemMainInstanceParameterHelpService', 'globals',
			function (_, basicsLookupdataLookupDescriptorService,
				platformModalService, formatterProcessor, $http,
				parameterDataTypes,
				cosParameterValidationHelperService,
				constructionSystemMainScriptDataService, constructionSystemMainValidationEnhanceService,
				constructionSystemMainInstanceParameterHelpService, globals) {

				return function(dataService, parentService){

					var instanceModuleName = 'constructionsystem.main';
					function markAsNotInherit(entity) {
						if (entity.IsInherit) {
							entity.IsInherit = false;
							dataService.markItemAsModified(entity);

							if (parentService.hasSelection()) {
								parentService.getSelected().IsParameterChanged = true;
								parentService.gridRefresh();
							}
						}
					}

					function checkChanged() {
						var changedItems = _.filter(dataService.getList(), function (item) {
							return item.IsInherit === false;
						});
						parentService.getSelected().IsParameterChanged = !!(_.isArray(changedItems) && changedItems.length > 0 && parentService.hasSelection());
						parentService.gridRefresh();
					}

					var service = {};

					service.validateIsInherit = function validateIsInherit(entity, value) {
						entity.IsInherit = value;
						checkChanged();
					};

					service.validateQuantityQuery = function validateQuantityQuery(entity, value) {
						if (entity.QuantityQuery !== value) {
							entity.IsInherit = false;
							markAsNotInherit(entity);
						}
						return {apply: true, valid: true};
					};

					service.validateParameterValue = function validateParameterValue(entity, value) {
						if (entity.ParameterValue !== value) {
							markAsNotInherit(entity);
						}
						return {apply: true, valid: true};
					};

					service.validateParameterValueVirtual = function (entity, value) {
						if (entity.ParameterValueVirtual !== value) {
							markAsNotInherit(entity);
						}
						var parameters = basicsLookupdataLookupDescriptorService.getData('CosParameter');
						var parameterValues = basicsLookupdataLookupDescriptorService.getData('CosMainInstanceParameterValue');
						var parameterValue = parameterValues ? parameterValues[value] : null;
						var parameterItem;
						if (parameters) {
							parameterItem = _.filter(parameters, function (item) {
								return item.Id === entity.ParameterFk;
							});
						}

						var originParameterValue = entity.ParameterValue;
						entity.ParameterValue = value;
						entity.ParameterValueVirtual = value;
						if (parameterItem) {
							if (parameterItem[0].IsLookup) {
								if (parameterValue) {
									entity.ParameterValue = parameterValue.ParameterValue;
								}
								entity.ParameterValueFk = value !== null && value >= 0 ? Number(value) : null;
							}
						}

						if (parameterItem && !parameterItem.IsLookup && parameterItem.AggregateType !== 0 && originParameterValue !== entity.ParameterValue) { // TODO chi: not consider lookup at the moment
							updateInstanceParameterByObjectParameter(entity);
						}

						// script validation
						service.validator();

						dataService.gridRefresh();
						return true;
					};

					service.validatePropertyName = function validatePropertyName(entity, value) {
						if (entity.PropertyName !== value) {
							markAsNotInherit(entity);
						}
						updatePropertyName(entity, value);
						return {apply: true, valid: true};
					};

					function updatePropertyName(entity, value) {
						var parameters = basicsLookupdataLookupDescriptorService.getData('CosParameter');
						var parameterItem = null;
						if (parameters) {
							parameterItem = _.find(parameters, function (item) {
								return item.Id === entity.ParameterFk;
							});
						}
						var propertyName = value;
						var originParameterValue = entity.ParameterValue;
						entity.ModelPropertyFk = null;
						entity.ParameterValueFk = null;

						if (!entity.IsLookup && parameterItem.ParameterTypeFk === parameterDataTypes.Boolean) {
							entity.ParameterValueVirtual = false;
						} else {
							entity.ParameterValueVirtual = null;
						}

						entity.PropertyName = propertyName;
						if (!propertyName) {
							if (!entity.IsLookup && parameterItem.ParameterTypeFk === parameterDataTypes.Boolean) {
								entity.ParameterValue = false;
							} else {
								entity.ParameterValue = null;
							}
						}

						if (propertyName) {
							dataService.getAsyncParameterValueByPropertyName(entity).then(function (response) {
								var propertyValue = response.data.ObjectPropertyValue;
								var errMsgs = response.data.ErrorMessages;

								entity.ParameterValue = propertyValue;
								entity.ParameterValueVirtual = propertyValue;
								if (parameterItem && parameterItem.IsLookup && propertyValue) {
									entity.ParameterValueFk = null;
									entity.ParameterValueVirtual = dataService.servicePrefixName + entity.Id;
									basicsLookupdataLookupDescriptorService.updateData('CosMainInstanceParameterValue', [{
										Id: entity.ParameterValueVirtual,
										Description: propertyValue,
										ParameterValue: propertyValue
									}]);
								}
								if (parameterItem && !parameterItem.IsLookup && parameterItem.AggregateType !== 0 && originParameterValue !== propertyValue) { // TODO chi: not consider lookup at the moment
									updateInstanceParameterByObjectParameter(entity);
								}
								/* jshint -W055 */
								new formatterProcessor(dataService.servicePrefixName).processItem(entity);
								dataService.gridRefresh();

								if (errMsgs && errMsgs.length > 0) {
									_.forEach(errMsgs, function (error) {
										platformModalService.showErrorDialog(error);
									});
								}
							});
						}
						else if (parameterItem && !parameterItem.IsLookup && parameterItem.AggregateType !== 0 && originParameterValue !== entity.ParameterValue) { // TODO chi: not consider lookup at the moment
							updateInstanceParameterByObjectParameter(entity);
						}
					}

					service.validateModelPropertyFk = function validateModelPropertyFk(entity, value) {
						if (entity.ModelPropertyFk !== value) {
							markAsNotInherit(entity);
						}
						updateModelPropertyFk(entity, value);
						return {apply: true, valid: true};
					};

					function updateModelPropertyFk(entity, value) {
						var propertyNames = basicsLookupdataLookupDescriptorService.getData('CosMainInstanceParameterPropertyName');
						var parameters = basicsLookupdataLookupDescriptorService.getData('CosParameter');
						var parameterItem = null;
						if (parameters) {
							parameterItem = _.find(parameters, function (item) {
								return item.Id === entity.ParameterFk;
							});
						}
						var propertyName = null;
						var originParameterValue = entity.ParameterValue;
						entity.ModelPropertyFk = value;
						entity.ParameterValueFk = null;

						if (!entity.IsLookup && parameterItem.ParameterTypeFk === parameterDataTypes.Boolean) {
							entity.ParameterValueVirtual = false;
						} else {
							entity.ParameterValueVirtual = null;
						}

						if (value !== null && angular.isDefined(value) &&
							propertyNames && propertyNames[value]) {
							propertyName = entity.PropertyName = propertyNames[value].PropertyName;
						} else {
							propertyName = entity.PropertyName = null;
							if (!entity.IsLookup && parameterItem.ParameterTypeFk === parameterDataTypes.Boolean) {
								entity.ParameterValue = false;
							} else {
								entity.ParameterValue = null;
							}
						}

						if (propertyName) {
							dataService.getAsyncParameterValueByPropertyName(entity).then(function (response) {
								var propertyValue = response.data.ObjectPropertyValue;
								var errMsgs = response.data.ErrorMessages;

								entity.ParameterValue = propertyValue;
								entity.ParameterValueVirtual = propertyValue;
								if (parameterItem && parameterItem.IsLookup && propertyValue) {
									entity.ParameterValueFk = null;
									entity.ParameterValueVirtual = dataService.servicePrefixName + entity.Id;
									basicsLookupdataLookupDescriptorService.updateData('CosMainInstanceParameterValue', [{
										Id: entity.ParameterValueVirtual,
										Description: propertyValue,
										ParameterValue: propertyValue
									}]);
								}
								if (parameterItem && !parameterItem.IsLookup && parameterItem.AggregateType !== 0 && originParameterValue !== propertyValue) { // TODO chi: not consider lookup at the moment
									updateInstanceParameterByObjectParameter(entity);
								}
								/* jshint -W055 */
								new formatterProcessor(dataService.servicePrefixName).processItem(entity);
								dataService.gridRefresh();

								if (errMsgs && errMsgs.length > 0) {
									_.forEach(errMsgs, function (error) {
										platformModalService.showErrorDialog(error);
									});
								}
							});
						}
						else if (parameterItem && !parameterItem.IsLookup && parameterItem.AggregateType !== 0 && originParameterValue !== entity.ParameterValue) { // TODO chi: not consider lookup at the moment
							updateInstanceParameterByObjectParameter(entity);
						}
					}

					function updateInstanceParameterByObjectParameter(entity) { // todo change dataService
						dataService.markItemAsModified(entity);
						if(dataService.getModule().name === instanceModuleName){
							var modifiedItems = constructionSystemMainInstanceParameterHelpService.getModifiedIns2ObjParamsByParameterId(entity.ParameterFk);

							return $http.post(globals.webApiBaseUrl + 'constructionsystem/main/instanceparameter/updatevaluebyobjectparameter', {
								ModelId: parentService.getSelected().ModelFk,
								InsHeaderId: parentService.getSelected().InstanceHeaderFk,
								InstanceId: entity.InstanceFk,
								ParameterId: entity.ParameterFk,
								ModifiedInstance2ObjectParameters: modifiedItems
							}).then(function (response) {
								if (response.data) {
									constructionSystemMainInstanceParameterHelpService.updateInstanceParameterByObjectParameter(response.data);
								}
							});
						}
					}

					service.validator = function validator() {

						var cosParameters = basicsLookupdataLookupDescriptorService.getData('CosParameter');
						var objParameters = dataService.getList();

						cosParameterValidationHelperService.copyValue(objParameters, cosParameters);

						var scriptData = constructionSystemMainScriptDataService.getCurrentScript();
						var parameterValues = {
							ValidateScriptData: scriptData.validationScriptData,
							ParameterList: objParameters
						};

						constructionSystemMainScriptDataService.validate(parameterValues)
							.then(function (response) {
								if (response && response.length > 0) {
									cosParameterValidationHelperService.handleValidatorInfo(response, objParameters, 'ParameterValueVirtual');
								}
							});
					};

					constructionSystemMainValidationEnhanceService.extendValidate(service, {
						typeName: 'Instance2ObjectParamDto',
						moduleSubModule: 'ConstructionSystem.Common',
						onlyValidationFields: ['QuantityQuery']
					});

					return service;
				};
			}
		]);
})(angular);
