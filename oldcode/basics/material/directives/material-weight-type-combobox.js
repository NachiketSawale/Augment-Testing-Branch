/**
 * Created by wuj on 4/14/2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.material';

	angular.module(moduleName).directive('basicsMaterialWeightTypeComboBox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'weightType',
				valueMember: 'Id',
				displayMember: 'Description'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: 'basicsMaterialWeightTypeDataService'
			});
		}
	]);
})(angular);
