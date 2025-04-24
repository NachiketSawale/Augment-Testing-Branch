(function (angular, globals) {

	/* globals globals */

	'use strict';

	globals.lookups.QtoFormulaRubricCategory = function QtoFormulaRubricCategory(){
		return {
			lookupOptions:{
				lookupType: 'QtoFormulaRubricCategory',
				valueMember: 'Id',
				displayMember: 'Description'
			}
		};
	};

	angular.module('qto.formula').directive('qtoFormulaRubricCategoryLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = globals.lookups.QtoFormulaRubricCategory();

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults.lookupOptions);
		}]);
})(angular, globals);
