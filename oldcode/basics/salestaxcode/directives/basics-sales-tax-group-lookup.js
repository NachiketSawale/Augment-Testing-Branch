( function (angular) {
	'use strict';

	angular.module('basics.salestaxcode').directive('basicsSalesTaxGroupLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				version: 2,
				lookupType: 'SalesTaxGroup',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', width: 100, name$tr$: 'cloud.common.entityCode' },
					{ id: 'desc', field: 'DescriptionInfo.Translated', name: 'Description', width: 120, name$tr$: 'cloud.common.entityDescription' }
				],
				width: 500,
				height: 200
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}
	]);
})(angular);