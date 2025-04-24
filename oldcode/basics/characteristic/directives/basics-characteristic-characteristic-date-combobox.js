(function (angular) {

	'use strict';
	angular.module('basics.characteristic').directive('basicsCharacteristicDateCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'CharacteristicDate',
				valueMember: 'Id',
				displayMember: 'Description',
				isDataUpdatedPopup: true,
				showClearButton: true
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: 'basicsCharacteristicCharacteristicDateDataService'
			});
		}
	]);
})(angular);