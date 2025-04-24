/**
 * Created by chi on 9/4/2020.
 */
(function (angular, globals) {
	'use strict';
	globals.lookups.materialTempType = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'materialtemptype',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			}
		};
	};

	angular.module( 'basics.material' ).directive( 'basicsMaterialMaterialTempTypeCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.materialTempType().lookupOptions);
		}
	]);
})(angular, globals);