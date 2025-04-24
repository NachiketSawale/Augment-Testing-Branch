(function (angular) {
	'use strict';
	angular.module( 'basics.material' ).directive( 'basicsMaterialMaterialValueLookup', [
		'BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'MaterialGroupCharval',
				valueMember: 'Id',
				displayMember: 'CharacteristicInfo.Translated',
				disableDataCaching: true,
				maxLength: 252
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: 'basicsMaterialMaterialValueLookupDataService'
			});
		}
	]);
})(angular);