/**
 * Created by lvy on 4/17/2018.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	var moduleName = 'constructionsystem.main';
	/**
	 * @ngdoc service
	 * @name constructionSystemMainInstanceHeaderParameterValidationService
	 * @description provides validation methods for InstanceHeaderParameter
	 */
	angular.module(moduleName).factory('constructionSystemMainInstanceHeaderParameterValidationService',
		['constructionSystemMainInstanceParameterService',
			'basicsLookupdataLookupDescriptorService',
			'constructionSystemMainValidationEnhanceService',
			'basicsLookupdataLookupFilterService',
			'constructionSystemMainInstanceHeaderParameterParameterValueFilterService',
			function (dataService,
				basicsLookupdataLookupDescriptorService,
				constructionSystemMainValidationEnhanceService,
				basicsLookupdataLookupFilterService,
				constructionSystemMainInstanceHeaderParameterParameterValueFilterService) {

				var service = {};
				service.validateParameterValueVirtual = function (entity, value) {
					var parameters = basicsLookupdataLookupDescriptorService.getData('cosglobalparam');
					var parameterValues = basicsLookupdataLookupDescriptorService.getData('cosglobalparamvalue');
					var parameterValue = parameterValues ? parameterValues[value] : null;
					var parameterItem;
					if (parameters) {
						parameterItem = _.filter(parameters, function (item) {
							return item.Id === entity.CosGlobalParamFk;
						});
					}

					entity.ParameterValue = value;
					entity.ParameterValueVirtual = value;
					if (parameterItem) {
						if (parameterItem[0].IsLookup) {
							/* if(parameterValue) {
								//entity.ParameterValue = parameterValue.ParameterValue;
							} */
							entity.CosGlobalParamvalueFk = value !== null && value >= 0 ? Number(value) : null;
						}
					}
					dataService.gridRefresh();
					var parentService = dataService.parentService();
					var childServices = parentService.getChildServices();
					var detailService = _.find(childServices, {name: 'constructionsystem.main.instanceheader.parameter.detail'});
					if (detailService) {
						var detailList = detailService.getList();
						if (detailList && detailList.length > 0) {
							var detail = detailList[0];
							detail['m' + entity.CosGlobalParamFk].ParameterValue = value;
							detail['m' + entity.CosGlobalParamFk].ParameterValueVirtual = value;
							if (parameterItem) {
								if (parameterItem[0].IsLookup) {
									if(parameterValue) {
										detail['m' + entity.CosGlobalParamFk].ParameterValue = parameterValue.ParameterValue;
									}
									detail['m' + entity.CosGlobalParamFk].CosGlobalParamvalueFk = Number(value);
								}
							}
						}
					}

					return true;
				};
				var lookupFilters2 = [
					constructionSystemMainInstanceHeaderParameterParameterValueFilterService('parameterfk-for-constructionsystem-main-instanceheaderparameter-filter', true)
				];
				basicsLookupdataLookupFilterService.registerFilter(lookupFilters2);

				constructionSystemMainValidationEnhanceService.extendValidate(service,{
					typeName: 'InstanceHeaderParameterDto',
					moduleSubModule: 'ConstructionSystem.Main'
				});

				return service;
			}
		]);
})(angular);
