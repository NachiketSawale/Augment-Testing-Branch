/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).directive('estimateWizardGenerateCxbmLookup', ['BasicsLookupdataLookupDirectiveDefinition', 'estimateWizardGenerateBudgetCXBMLookupService',

		function (BasicsLookupdataLookupDirectiveDefinition, estimateWizardGenerateBudgetCXBMLookupService) {
			let defaults = {
				lookupType: 'EstimatesFromCXBM',
				valueMember: 'EstimateId',
				displayMember: 'EstimateId',
				uuid: '2C61CBC4F8084FEF90D2053729A81AED',
				disableDataCaching: true,
				columns: [
					{
						id: 'ProjectCode',
						field: 'ProjectCode',
						name: 'Project Number',
						width: 150,
						name$tr$: 'procurement.common.wizard.updateEstimate.projectNo'
					},
					{
						id: 'ProjectDes',
						field: 'ProjectDes',
						name: 'Project Description',
						width: 150,
						name$tr$: 'procurement.common.projectDescription'
					},
					{
						id: 'EstimateId',
						field: 'EstimateId',
						name: 'Estimate Code',
						width: 150,
						name$tr$: 'estimate.main.entityEstimationHeader'
					},
					{
						id: 'EstimateDes',
						field: 'EstimateDes',
						name: 'Estimate Description',
						width: 150,
						name$tr$: 'cloud.common.entityEstimateHeaderDescription'
					},
					{
						id: 'CodeLibraryName',
						field: 'CodeLibraryName',
						name: 'Code Library',
						width: 150,
						name$tr$: 'estimate.main.generateBudgetCXBMWizard.codeLibrary'
					}
				],
				onDataRefresh: function ($scope) {
					estimateWizardGenerateBudgetCXBMLookupService.refresh().then(function (data) {
						if(data){
							$scope.refreshData(data);
						}
					});
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults,
				{dataProvider: 'estimateWizardGenerateBudgetCXBMLookupService'}
			);
		}]);

})(angular);
