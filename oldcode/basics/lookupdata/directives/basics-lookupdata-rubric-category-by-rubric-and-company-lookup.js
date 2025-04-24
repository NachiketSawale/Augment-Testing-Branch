/**
 * Created by henkel on 2023.
 */

(function (angular) {
	'use strict';

	let moduleName = 'basics.lookupdata';

	globals.lookups.rubriccategorybyrubricandcompany = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'RubricCategoryByRubricAndCompany',
				valueMember: 'Id',
				displayMember: 'Description',
				columns: [
					{id: 'description', field: 'Description', name: 'Description', width: 300, formatter: 'description', name$tr$: 'cloud.common.entityDescription'}
				]
			}
		};
	};

	angular.module(moduleName).directive('basicsLookupdataRubricCategoryByRubricAndCompanyLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.rubriccategorybyrubricandcompany().lookupOptions);
		}]);
})(angular);