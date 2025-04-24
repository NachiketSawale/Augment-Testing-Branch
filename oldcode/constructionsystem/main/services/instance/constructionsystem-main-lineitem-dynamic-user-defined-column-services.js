/**
 * Created by myh on 01/12/2022.
 */

(function(angular){
	'use strict';

	let moduleName = 'constructionsystem.main';

	angular.module(moduleName).factory('constructionsystemMainDynamicUserDefinedColumnService', ['$injector', '_', '$q', 'userDefinedColumnTableIds',
		'basicsCommonUserDefinedColumnServiceFactory', 'constructionsystemMainLineItemDynamicConfigurationService', 'estimateMainDynamicUserDefinedColumnCalculationService',
		function($injector, _, $q, userDefinedColumnTableIds,
			basicsCommonUserDefinedColumnServiceFactory, constructionsystemMainLineItemDynamicConfigurationService, estimateMainDynamicUserDefinedColumnCalculationService){
			let columnOptions = {
				columns : {
					idPreFix : 'EstimateLineItem',
					overloads : {
						readonly : true,
						editor : null
					}
				},
				addTotalColumn : true,
				totalColumns : {
					idPreFix : 'EstimateLineItem',
					overloads : {
						readonly : true,
						editor : null
					}
				},
			};
			let serviceOptions = {
				getRequestData : function(item){
					return {
						Pk1 : item.EstHeaderFk
					};
				},
				getFilterFn : function(tableId){
					return function(e, dto){
						return e.TableId === tableId && e.Pk1 === dto.EstHeaderFk && e.Pk2 === dto.Id;
					};
				},
				getModifiedItem : function(tableId, item){
					return {
						TableId : tableId,
						Pk1 : item.EstHeaderFk,
						Pk2 : item.Id,
						Pk3 : null
					};
				}
			};
			let reAttachDataToResource = false;
			let moduleName = 'ConstructionsystemMainLineItem';
			let service = basicsCommonUserDefinedColumnServiceFactory.getService(constructionsystemMainLineItemDynamicConfigurationService, userDefinedColumnTableIds.EstimateLineItem, 'constructionsystemMainLineItemService', columnOptions, serviceOptions, moduleName);

			service.calculate = function(lineitem, resourceList){
				let resFieldChange = $injector.get('estimateMainResourceDynamicUserDefinedColumnService').baseFieldChange;
				estimateMainDynamicUserDefinedColumnCalculationService.setUserDefinedColumns(service.getUserDefinedColumnFields());
				if(reAttachDataToResource){
					reAttachDataToResource = false;
					$injector.get('estimateMainResourceDynamicUserDefinedColumnService').attachDataToColumn(resourceList, lineitem).then(function(){
						estimateMainDynamicUserDefinedColumnCalculationService.calculateLineItemAndResoruce(lineitem, resourceList, resFieldChange, service.fieldChange);
					});
				}else{
					estimateMainDynamicUserDefinedColumnCalculationService.calculateLineItemAndResoruce(lineitem, resourceList, resFieldChange, service.fieldChange);
				}
			};

			service.setReAttachDataToResource = function(value){
				reAttachDataToResource = value;
			};

			service.resolveRefLineitem = function(lineitem, value){
				if(!lineitem || !value) {return;}

				service.attachDataToColumnFromColVal([lineitem], [value], true);
			};

			return service;
		}]);
})(angular);