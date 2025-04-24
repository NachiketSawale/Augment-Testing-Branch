/**
 * Created by myh on 09/17/2021.
 */

(function(angular){
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainConfigTotalDynamicUserDefinedColumnService', ['$injector', '_', '$q', '$translate', 'userDefinedColumnTableIds',
		'basicsCommonUserDefinedColumnServiceFactory', 'estimateMainConfigTotalDynamicConfigurationService', 'estimateConfigTotalService',
		function($injector, _, $q, $translate, userDefinedColumnTableIds,
			basicsCommonUserDefinedColumnServiceFactory, estimateMainConfigTotalDynamicConfigurationService, estimateConfigTotalService){

			let columnOptions = {
				columns : {
					idPreFix : 'EstimateConfigTotalAq',
					fieldSuffix : 'TotalAq',
					nameSuffix : ' ' + $translate.instant('basics.common.userDefinedColumn.totalSuffix') +'(AQ)',
					overloads : {
						readonly : true,
						editor : null
					}
				},
				additionalColumns : true,
				additionalColumnOption : {
					idPreFix : 'EstimateConfigTotalWq',
					fieldSuffix : 'TotalWq',
					nameSuffix : ' ' + $translate.instant('basics.common.userDefinedColumn.totalSuffix') +'(WQ)',
					overloads : {
						readonly : true,
						editor : null
					}
				}
			};

			let service = basicsCommonUserDefinedColumnServiceFactory.getService(estimateMainConfigTotalDynamicConfigurationService, null, estimateConfigTotalService, columnOptions);

			service.attachDataToColumn = function(items, notifyWhenLoad){
				if(!items || items.length === 0 ) {return;}

				let columns = service.getDynamicColumns();
				if(!columns || columns.length === 0 ) {return;}

				items.forEach(function(item){
					_.forEach(columns, function(column){
						let field = column.field;
						item[field] = item.ColValTotals && item.ColValTotals[field] ? item.ColValTotals[field] : 0;
					});
				});

				if(notifyWhenLoad){
					return;
				}
				estimateConfigTotalService.gridRefresh();
			};

			return service;
		}]);
})(angular);