/**
 * Created by myh on 08/16/2021.
 */

(function (angular) {
	'use strict';
	let moduleName = 'basics.costcodes';
	/**
     * @ngdoc service
     * @name basicsCostCodesPriceVersionListRecordDynamicUserDefinedColumnService
     * @function
     *
     * @description
     * basicsCostCodesDynamicUserDefinedColumnService is the config service for costcode dynamic user defined column
     */
	angular.module(moduleName).factory('basicsCostCodesPriceVersionListRecordDynamicUserDefinedColumnService', ['userDefinedColumnTableIds', 'basicsCostcodesPriceVersionListRecordDynamicConfigurationService', 'basicsCommonUserDefinedColumnServiceFactory',
		function (userDefinedColumnTableIds, basicsCostcodesPriceVersionListRecordDynamicConfigurationService, basicsCommonUserDefinedColumnServiceFactory) {
			let columnOptions = {
				columns : {
					idPreFix : 'BasicsCostCodePriceList'
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
				},
				getModifiedItem : function(tableId, item){
					return {
						TableId : tableId,
						Pk1 : item.CostCodeFk,
						Pk2 : item.Id,
						Pk3 : null
					};
				}
			};

			return basicsCommonUserDefinedColumnServiceFactory.getService(basicsCostcodesPriceVersionListRecordDynamicConfigurationService, userDefinedColumnTableIds.BasicsCostCodePriceList, 'basicsCostCodesPriceVersionListRecordDataService', columnOptions, serviceOptions);
		}
	]);
})(angular);
