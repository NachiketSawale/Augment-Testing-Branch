(function (angular) {

	// todo: use basicsCharacteristicDiscreteValueCombobox

	'use strict';
	angular.module('basics.characteristic').directive('basicsCharacteristicValueCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'CharacteristicValue',
				valueMember: 'Id',
				disableDataCaching: true,
				displayMember: 'DescriptionInfo.Translated'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: 'basicsCharacteristicCharacteristicValueDataService'
			});
		}
	]);
})(angular);