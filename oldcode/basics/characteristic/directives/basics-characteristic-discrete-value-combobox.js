(function (angular) {

	'use strict';
	var moduleName = 'basics.characteristic';

	angular.module(moduleName).directive('basicsCharacteristicDiscreteValueCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'basicsCharacteristicDiscreteValueLookup',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}
	]);

})(angular);