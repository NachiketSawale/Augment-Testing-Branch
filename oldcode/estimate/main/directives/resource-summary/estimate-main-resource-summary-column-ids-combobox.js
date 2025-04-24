/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).directive('estimateMainResourceSummaryColumnIdsCombobox', [
		'BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition){
			let defaults = {
				lookupType: 'EstSummaryColumnId',
				valueMember: 'Id',
				displayMember: 'Description',
				filterKey: 'estimate-main-resource-summary-columnid-filter'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: 'estimateMainResourceSummaryColumnIdsComboboxService'
			});
		}
	]);
})(angular);
