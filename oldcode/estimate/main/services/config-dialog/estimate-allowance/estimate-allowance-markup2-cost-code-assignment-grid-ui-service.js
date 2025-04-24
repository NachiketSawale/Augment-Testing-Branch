
(function (angular) {
	/* global */
	'use strict';
	let moduleName = 'estimate.main';


	angular.module(moduleName).factory('estimateAllowanceMarkUp2CostCodeAssignmentGridUIService',
		['$injector', 'platformTranslateService',
			function ($injector, platformTranslateService) {

				let service = {};

				service.getColumns = function getColumns(){
					let editType = $injector.get('estimateMainCostCodeAssignmentDetailLookupDataService').getEditType();
					let formatterOptions = {};
					if (editType === 'estimate'){
						formatterOptions = {
							lookupType: 'estmasterprojectcostcode',
							dataServiceName: 'estimateMainOnlyCostCodeAssignmentDetailLookupDataService',
							displayMember: 'Code',
						};
					}else{
						formatterOptions = {
							lookupType: 'costcode',
							displayMember: 'Code',
							version: 3
						};
					}
					let formatterOptionsDescription = {};
					if (editType === 'estimate'){
						formatterOptionsDescription = {
							lookupType: 'estmasterprojectcostcode',
							dataServiceName: 'estimateMainOnlyCostCodeAssignmentDetailLookupDataService',
							displayMember: 'DescriptionInfo.Translated'
						};
					}else{
						formatterOptionsDescription = {
							lookupType: 'costcode',
							displayMember: 'DescriptionInfo.Translated',
							version: 3
						};
					}

					return [
						{
							id: 'estMdcCostCodeFk',
							field: 'MdcCostCodeFk',
							name: 'Code',
							name$tr$: 'estimate.main.costCodeAssignmentDetails.MdcCostCodeFk',
							toolTip: 'Code',
							directive: editType === 'estimate'? 'estimate-main-master-project-cost-code-lookup': 'estimate-main-cost-code-assignment-detail-lookup',
							editor: null,
							readonly: true,
							formatter: 'lookup',
							formatterOptions: formatterOptions,
							width: 80
						},
						{
							id: 'description',
							field: 'MdcCostCodeFk',
							name: 'Description',
							name$tr$: 'cloud.common.entityDescription',
							toolTip: 'Description',
							formatter: 'lookup',
							formatterOptions: formatterOptionsDescription,
							readonly: true,
							width: 160
						},
						{
							id: 'MarkupGa',
							field: 'MarkupGa',
							sortOrder: 8,
							editor: 'money',
							name: 'G&A[%]',
							name$tr$: 'estimate.main.markupGA',
							formatter: 'money'
						},{
							id: 'MarkupAm',
							field: 'MarkupAm',
							sortOrder: 9,
							name: 'AM[%]',
							editor: 'money',
							name$tr$: 'estimate.main.markupAM',
							formatter: 'money'
						},{
							id: 'MarkupRp',
							field: 'MarkupRp',
							sortOrder: 10,
							editor: 'money',
							name: 'R&P[%]',
							name$tr$: 'estimate.main.markupRP',
							formatter: 'money'
						}
					];
				};

				let gridColumns =  service.getColumns();

				platformTranslateService.translateGridConfig(gridColumns);

				service.getStandardConfigForListView = function(){
					return{
						addValidationAutomatically: true,
						columns : gridColumns
					};
				};

				/* service.getFields = function (){
					let fields = ['EstStructureFk', 'EstQuantityRelFk', 'Sorting'];
					return fields;
				};
*/
				return service;

			}
		]);

})(angular);
