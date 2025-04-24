/**
 * Created by wuj on 4/14/2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.material';

	angular.module(moduleName).directive('basicsMaterialWeightNumberComboBox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'weightNumber',
				valueMember: 'Id',
				displayMember: 'Description'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: 'basicsMaterialWeightNumberDataService'
			});
		}
	]);
})(angular);
