/**
 * Created by myh on 08/16/2021.
 */

(function(angular){
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainDynamicUserDefinedColumnService', ['$injector', '_', '$q', 'userDefinedColumnTableIds', 'basicsCommonUserDefinedColumnServiceFactory', 'estimateMainDynamicConfigurationService', 'estimateMainDynamicUserDefinedColumnCalculationService',
		function($injector, _, $q, userDefinedColumnTableIds, basicsCommonUserDefinedColumnServiceFactory, estimateMainDynamicConfigurationService, estimateMainDynamicUserDefinedColumnCalculationService){
			function getDecimalPlacesOption(field){
				return {
					decimalPlaces: function (columnDef) {
						return $injector.get('estimateMainRoundingService').getUiRoundingDigits(columnDef,field);
					}
				};
			}
			let columnOptions = {
				columns : {
					idPreFix : 'EstimateLineItem',
					overloads : {
						readonly : true,
						editor : null,
						options: getDecimalPlacesOption('CostUnit'),
						formatterOptions: getDecimalPlacesOption('CostUnit')
					}
				},
				addTotalColumn : true,
				totalColumns : {
					idPreFix : 'EstimateLineItem',
					overloads : {
						readonly : true,
						editor : null,
						options: getDecimalPlacesOption('CostTotal'),
						formatterOptions: getDecimalPlacesOption('CostTotal')
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
			let moduleName = 'EstimateLineItem';
			let service = basicsCommonUserDefinedColumnServiceFactory.getService(estimateMainDynamicConfigurationService, userDefinedColumnTableIds.EstimateLineItem, 'estimateMainService', columnOptions, serviceOptions, moduleName);

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