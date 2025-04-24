/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainCostBudgetAssignDetailUIConfigService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	angular.module(moduleName).factory('estimateMainCostBudgetAssignDetailUIConfigService', ['platformTranslateService',
		function ( platformTranslateService) {

			let service = {};

			let gridColumns = [
				{
					id: 'estMdcCostCodeFk',
					field: 'MdcCostCodeFk',
					name: 'Code',
					name$tr$: 'estimate.main.costCodeAssignmentDetails.MdcCostCodeFk',
					toolTip: 'Code',
					editor: 'directive',
					editorOptions: {
						usageContext: 'estimateMainCostBudgetAssignDetailDataService',
						directive: 'estimate-main-column-config-cost-codes-lookup',
						gridOptions: {
							multiSelect: true
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'costcode',
						displayMember: 'Code'
					},
					width: 80,
					sorting:1
				},
				{
					id: 'description',
					field: 'Description',
					name: 'Description',
					name$tr$: 'cloud.common.entityDescription',
					toolTip: 'Description',
					formatter: 'code',
					readonly: true,
					width: 160,
					sorting:2
				},
				{
					id: 'Type',
					field: 'CostcodeTypeFk',
					name: 'Type',
					name$tr$: 'estimate.main.costCodeAssignmentDetails.Type',
					toolTip: 'Type',
					formatter: 'lookup',
					formatterOptions: {
						lookupSimpleLookup: true,
						lookupModuleQualifier: 'basics.costcodes.costcodetype',
						valueMember: 'Id',
						displayMember: 'Description'
					},
					readonly: true,
					width: 160,
					sorting:3
				},
				{
					id: 'estBasUoMFk',
					field: 'BasUomFk',
					name: 'UoM',
					name$tr$: 'estimate.main.totalsConfigDetails.BasUoMFk',
					toolTip: 'UoM',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'uom',
						displayMember: 'Unit'
					},
					readonly: true,
					width: 80,
					sorting:4
				},
				{
					id: 'currency',
					field: 'CurrencyFk',
					name: 'Currency',
					name$tr$: 'estimate.main.costCodeAssignmentDetails.Currency',
					toolTip: 'Currency',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'currency',
						displayMember: 'Currency'
					},
					readonly: true,
					width: 60,
					sorting:5
				}
			];

			platformTranslateService.translateGridConfig(gridColumns);

			service.getStandardConfigForListView = function(){
				return{
					addValidationAutomatically: true,
					columns : gridColumns
				};
			};

			return service;
		}]);
})(angular);
