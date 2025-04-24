/**
 * Created by xsi on 2016-03-25.
 */
/* global _ */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';
	/**
	 * @ngdoc service
	 * @name constructionSystemMainInstanceParameterValidationService
	 * @description provides validation methods for InstanceParameter
	 */
	/* jshint -W074 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('constructionSystemMainInstanceParameterValidationService',
		['$http',
			'constructionSystemMainInstanceParameterService',
			'basicsLookupdataLookupDescriptorService',
			'constructionSystemMainInstanceParameterHelpService',
			'constructionSystemMasterParameterValidationHelperService',
			'constructionSystemMainScriptDataService',
			'constructionSystemMainInstanceParameterFormatterProcessor',
			'constructionSystemMainValidationEnhanceService',
			function (
				$http,
				dataService,
				basicsLookupdataLookupDescriptorService,
				constructionSystemMainInstanceParameterHelpService,
				cosParameterValidationHelperService,
				constructionSystemMainScriptDataService,
				formatterProcessor,
				constructionSystemMainValidationEnhanceService) {

				var service = {};
				service.validateParameterValueVirtual = function (entity, value) {
					var parameters = basicsLookupdataLookupDescriptorService.getData('CosParameter');
					var parameterValues = basicsLookupdataLookupDescriptorService.getData('CosMainInstanceParameterValue');
					var parameterValue = parameterValues ? parameterValues[value] : null;
					var parameterItem;
					if (parameters) {
						parameterItem = _.filter(parameters, function (item) {
							return item.Id === entity.ParameterFk;
						});
					}

					entity.ParameterValue = value;
					entity.ParameterValueVirtual = value;
					if (parameterItem) {
						if (parameterItem[0].IsLookup) {
							if(parameterValue) {
								entity.ParameterValue = parameterValue.ParameterValue;
							}
							entity.ParameterValueFk = value !== null && value >= 0 ? Number(value) : null;
						}
					}
					dataService.gridRefresh();
					var parentService = dataService.parentService();
					var childServices = parentService.getChildServices();
					var detailService = _.find(childServices, {name: 'constructionsystem.main.instanceparameter.detail'});
					if (detailService) {
						var detailList = detailService.getList();
						if (detailList && detailList.length > 0) {
							var detail = detailList[0];
							detail['m' + entity.ParameterFk].ParameterValue = value;
							detail['m' + entity.ParameterFk].ParameterValueVirtual = value;
							if (parameterItem) {
								if (parameterItem[0].IsLookup) {
									if(parameterValue) {
										detail['m' + entity.ParameterFk].ParameterValue = parameterValue.ParameterValue;
									}
									detail['m' + entity.ParameterFk].ParameterValueFk = Number(value);
								}
							}
						}
					}

					// execute additional user defined script to validate parameters
					service.validator({entity: entity, value: value});

					return true;
				};

				service.validateQuantityQuery = function validateQuantityQuery(entity, value) {
					var parentService = dataService.parentService();
					var childServices = parentService.getChildServices();
					var detailService = _.find(childServices, {name: 'constructionsystem.main.instanceparameter.detail'});
					if (detailService) {
						var detailList = detailService.getList();
						if (detailList && detailList.length > 0) {
							var detail = detailList[0];
							detail['m' + entity.ParameterFk].QuantityQuery = value;
						}
					}
					return {apply: true, valid: true};
				};

				service.validateModelPropertyFk = function validateModelPropertyFk(entity, value) {
					var parentItem = dataService.parentService().getSelected();
					constructionSystemMainInstanceParameterHelpService.updateModelPropertyFk(entity, value, parentItem.IsDistinctInstances);
					return true;
				};

				service.validatePropertyName = function validatePropertyName(entity, value) {
					var parentItem = dataService.parentService().getSelected();
					constructionSystemMainInstanceParameterHelpService.updatePropertyName(entity, value, parentItem.IsDistinctInstances);
					return true;
				};

				service.validator = function validator(data) {
					if(data && data.entity) {
						formatterProcessor.processItem(data.entity);
					}

					var insParameters = dataService.getList();
					var scriptData = constructionSystemMainScriptDataService.getCurrentScript();
					var parameterValues = {
						ValidateScriptData: scriptData.validationScriptData,
						ParameterList: insParameters
					};

					constructionSystemMainScriptDataService.validate(parameterValues)
						.then(function (response) {
							if (response && response.length > 0) {
								cosParameterValidationHelperService.handleValidatorInfo(response, insParameters, 'ParameterValueVirtual');
							}
						});
				};

				constructionSystemMainValidationEnhanceService.extendValidate(service,{
					typeName: 'InstanceParameterDto',
					moduleSubModule: 'ConstructionSystem.Main'
				});

				return service;
			}
		]);
})(angular);
