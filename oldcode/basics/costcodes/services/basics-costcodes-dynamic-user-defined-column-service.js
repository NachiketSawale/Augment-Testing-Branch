/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'basics.costcodes';
	/**
     * @ngdoc service
     * @name basicsCostCodesDynamicUserDefinedColumnService
     * @function
     *
     * @description
     * basicsCostCodesDynamicUserDefinedColumnService is the config service for costcode dynamic user defined column
     */
	angular.module(moduleName).factory('basicsCostCodesDynamicUserDefinedColumnService', ['userDefinedColumnTableIds', 'basicsCostCodesDynamicConfigurationService', 'basicsCommonUserDefinedColumnServiceFactory',
		function (userDefinedColumnTableIds, basicsCostCodesDynamicConfigurationService, basicsCommonUserDefinedColumnServiceFactory) {
			let columnOptions = {
				columns : {
					idPreFix : 'BasicsCostCode'
				}
			};

			let serviceOptions = {
				getRequestData : function(){
					return {};
				},
				getFilterFn : function(tableId){
					return function(e, dto){
						return e.TableId === tableId && e.Pk1 === dto.Id;
					};
				},
				getModifiedItem : function(tableId, item){
					return {
						TableId : tableId,
						Pk1 : item.Id,
						Pk2 : null,
						Pk3 : null
					};
				}
			};

			return basicsCommonUserDefinedColumnServiceFactory.getService(basicsCostCodesDynamicConfigurationService, userDefinedColumnTableIds.BasicsCostCode, 'basicsCostCodesMainService', columnOptions, serviceOptions);
		}
	]);
})(angular);
