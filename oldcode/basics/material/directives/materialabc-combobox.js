/**
 * Created by wuj on 9/9/2014.
 */
(function (angular) {
	'use strict';
	angular.module( 'basics.material' ).directive( 'basicsMaterialMaterialAbcCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'materailabc',
				valueMember: 'Id',
				displayMember: 'Description'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);

		}
	]);
})(angular);