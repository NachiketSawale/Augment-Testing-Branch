(function () {
	/* global _ */
	'use strict';

	let modulename = 'estimate.main';

	/**
     * @ngdoc service
     * @name estimateMainConfigUiTotalService
     * @description
     */
	angular.module(modulename).factory('estimateMainConfigUiTotalService',
		['$injector', 'estimateMainCommonUIService', 'estimateCommonDynamicConfigurationServiceFactory',
			function ($injector, estimateMainCommonUIService, estimateCommonDynamicConfigurationServiceFactory) {

				function allowancePropertyFormatter(row, cell, value, columnDef, dataContext, plainText, uniqueId){
					let activeAllowanceEntity = $injector.get('estimateMainContextDataService').getAllowanceEntity();
					let totalKey = $injector.get('estimateConfigTotalService').getLastSelectedKey();
					if(activeAllowanceEntity && totalKey !== 'configTotalGrand' && [1,3].indexOf(activeAllowanceEntity.MdcAllowanceTypeFk) > -1 && activeAllowanceEntity.IsOneStep && ([1,2,3,4].indexOf(dataContext.LineType) > -1)){
						return '<span></span>';
					}else{
						let css = $injector.get('platformGridDomainService').alignmentCssClass('money');
						let result = $injector.get('platformGridDomainService').formatter('money')(row, cell, value, columnDef, dataContext, plainText, uniqueId);

						if (css && !plainText) {
							result = '<div class="' + css + '">' + result + '</div>';
						}
						return result;
					}
				}

				let uiService = estimateMainCommonUIService.createUiService(['Description',  'Quantity', 'AQDayWorkRateTotal', 'WQDayWorkRateTotal', 'UoM',
					'Total', 'Currency', 'AQCostTotal',
					'AQBudget', 'AQRevenue', 'AQMargin',
					'WQCostTotal', 'WQBudget', 'WQRevenue',
					'WQMargin', 'CostExchangeRate1','CostExchangeRate2',
					'Currency1Fk','Currency2Fk',
					'ForeignBudget1','ForeignBudget2','RiskCostTotal','EscalationCostTotal','GrandTotal','FromDJC','FromTJC','CO2SourceTotal','CO2ProjectTotal'],
				null,
				null,
				null,
				{
					allowNullColumns:['total']
				},
				{
					doBeforeCreateUIService:function(detailLayout){
						detailLayout.overloads.total = {
							'grid': {
								domain:'money',
								editor:null,
								formatter: allowancePropertyFormatter
							}
						};
						detailLayout.overloads.fromdjc = {
							'grid': {
								editor:null,
								formatter: allowancePropertyFormatter
							}
						};
						detailLayout.overloads.fromtjc = {
							'grid': {
								editor:null,
								formatter: allowancePropertyFormatter
							}
						};
						detailLayout.overloads.costexchangerate1 = {
							'grid': {
								editor:null,
								formatter: allowancePropertyFormatter
							}
						};
						detailLayout.overloads.costexchangerate2 = {
							'grid': {
								editor:null,
								formatter: allowancePropertyFormatter
							}
						};
					}
				});

				// disable column sorting
				let columns = uiService.getStandardConfigForListView().columns;
				_.each(columns, function (col) {
					col.sortable = true;
				});

				return estimateCommonDynamicConfigurationServiceFactory.getService(uiService);
			}

		]);

})();
