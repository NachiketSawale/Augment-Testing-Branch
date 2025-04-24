/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).directive('estimateMainColumnConfigColumnIdsCombobox', [
		'BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition){
			let defaults = {
				lookupType: 'DynamicColumns',
				valueMember: 'Id',
				displayMember: 'Description'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: 'estimateMainEstColumnConfigColumnIdsComboboxService'
			});
		}
	]);
})(angular);
