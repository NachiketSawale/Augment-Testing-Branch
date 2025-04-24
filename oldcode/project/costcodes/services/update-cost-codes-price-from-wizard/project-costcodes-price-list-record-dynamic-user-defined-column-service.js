/**
 * Created by lsi on 09/08/2021.
 */
(function (angular) {
	'use strict';
	var moduleName = 'project.costcodes';
	/**
	 * @ngdoc service
	 * @name projectCostCodesPriceListRecordDynColumnService
	 * @function
	 * @description
	 * projectCostCodesPriceListRecordDynColumnService is the config service for wizard 'Update Cost Codes Price' dynamic user defined column
	 */
	angular.module(moduleName).factory('projectCostCodesPriceListRecordDynColumnService', ['$q', '_', '$translate', 'userDefinedColumnTableIds',
		'projectCostCodesPriceListRecordDynConfigService', 'basicsCommonUserDefinedColumnServiceFactory',
		function ($q, _, $translate, userDefinedColumnTableIds,
			projectCostCodesPriceListRecordDynConfigService, basicsCommonUserDefinedColumnServiceFactory) {
			let columnOptions = {
				columns : {
					idPreFix : 'Record',
					overloads : {
						readonly : true,
						editor : null
					}
				}
			};
			let serviceOptions = {
				getRequestData : function(item){
					return {
						Pk1 : item.CostCodeFk
					};
				},
				getFilterFn : function(tableId){
					return function(e, dto){
						return e.TableId === tableId && e.Pk1 === dto.CostCodeFk && e.Pk2 === dto.Id;
					};
				}
			};
			return basicsCommonUserDefinedColumnServiceFactory.getService(projectCostCodesPriceListRecordDynConfigService, userDefinedColumnTableIds.BasicsCostCodePriceList, 'projectCostCodesPriceListRecordDataService', columnOptions, serviceOptions);
		}
	]);
})(angular);
