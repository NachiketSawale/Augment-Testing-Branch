(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name estimateMainPlantListColumnGenerateService
	 * @description use for generate cost code columns
	 */
	let moduleName = 'estimate.main';
	angular.module(moduleName).factory('estimateMainPlantListColumnGenerateService', ['$injector', 'platformGridAPI', '_', 'accounting', 'basicsCommonChangeColumnConfigService',
		function ($injector, platformGridAPI, _, accounting, basicsCommonChangeColumnConfigService) {
			let service = {};

			let mdcColumnPrefix = 'Mdc_CostCode_';
			let prjColumnPrefix = 'Prj_CostCode_';

			function createCostCodeColumn(costCodeInfo, isMdcCostCode){
				let prefix = isMdcCostCode ? mdcColumnPrefix : prjColumnPrefix;
				let namePrefix = costCodeInfo.Code + ' ' + (isMdcCostCode ? costCodeInfo.DescriptionInfo.Description : costCodeInfo.Description);
				return {
					id : (prefix + costCodeInfo.Id).toLowerCase(),
					field : prefix + costCodeInfo.Id,
					name : namePrefix,
					name$tr$ : undefined,
					isMdcCostCode : isMdcCostCode,
					costCodeId : costCodeInfo.Id,
					sortable: true,
					required : false,
					hidden : false,
					bulkSupport: false,
					formatter : function(a, b, c, columnConfig, rowData){
						if(columnConfig.isMdcCostCode){
							if(rowData.MdcCostCodeSummary && rowData.MdcCostCodeSummary[columnConfig.costCodeId]){
								return accounting.formatNumber(rowData.MdcCostCodeSummary[columnConfig.costCodeId].AssemblyCostTotal, 2 ,',','.');
							}
						}else{
							if(rowData.PrjCostCodeSummary && rowData.PrjCostCodeSummary[columnConfig.costCodeId]){
								return accounting.formatNumber(rowData.PrjCostCodeSummary[columnConfig.costCodeId].AssemblyCostTotal, 2 ,',','.');
							}
						}
						return accounting.formatNumber(0, 2 ,',','.');
					}
				};
			}

			service.createCostCodeColumns = function(mdcCostCodeInfos, prjCostCodeInfos){
				let costCodeColumns = [];
				if(mdcCostCodeInfos && mdcCostCodeInfos.length){
					_.forEach(mdcCostCodeInfos, function(item){
						costCodeColumns.push(createCostCodeColumn(item, true));
					});
				}

				if(prjCostCodeInfos && prjCostCodeInfos.length){
					_.forEach(prjCostCodeInfos, function(item){
						costCodeColumns.push(createCostCodeColumn(item, false));
					});
				}

				return costCodeColumns;
			};

			service.refreshGrid = function(mdcCostCodeInfos, prjCostCodeInfos){
				let costCodeColumns = service.createCostCodeColumns(mdcCostCodeInfos, prjCostCodeInfos);
				$injector.get('estimateMainPlantListUIConfigService').attachData({
					costCode : costCodeColumns
				});
				$injector.get('estimateMainPlantListUIConfigService').fireRefreshConfigLayout();
			};

			return service;
		}

	]);
})(angular);