/**
 * Created by wuj on 4/23/2015.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).directive('basicsLookupdataRubricCategoryComboBox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'RubricCategory',
				valueMember: 'Id',
				displayMember: 'Description'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}]);
})(angular);
