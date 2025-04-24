(function (angular) {
	'use strict';
	angular.module('basics.material').directive('basicsMaterialMaterialCharacteristicLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'MaterialGroupChar',
				valueMember: 'Id',
				displayMember: 'PropertyInfo.Translated',
				maxLength: 252
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);

		}]);
})(angular);