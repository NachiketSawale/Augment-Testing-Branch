/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).directive('estimateWizardGenerateStructureLookup', ['BasicsLookupdataLookupDirectiveDefinition','estimateWizardGenerateSourceLookupService',

		function (BasicsLookupdataLookupDirectiveDefinition,estimateWizardGenerateSourceLookupService) {
			let defaults = {
				lookupType: 'EstimateGenerate4LeadingSource',
				valueMember: 'Id',
				displayMember: 'Desc',
				onDataRefresh: function ($scope) {
					estimateWizardGenerateSourceLookupService.refresh().then(function (data) {
						if(data){
							$scope.refreshData(data);
						}
					});
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults,
				{dataProvider: 'estimateWizardGenerateSourceLookupService'}
			);
		}]);

})(angular);

