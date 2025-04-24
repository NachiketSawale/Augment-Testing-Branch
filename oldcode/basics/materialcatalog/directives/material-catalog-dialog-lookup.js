(function (angular) {
	'use strict';

	angular.module( 'basics.materialcatalog' ).directive( 'basicsMaterialMaterialCatalogDialogLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'MaterialCatalog',
				valueMember: 'Id',
				displayMember: 'Code',
				isTextEditable: true,
				isColumnFilters: true,
				uuid: 'acf5bc6a5dec4cfab8ef3331352eb0fb',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', width: 100, name$tr$: 'cloud.common.entityCode' },
					{ id: 'desc', field: 'DescriptionInfo.Translated', name: 'Description', width: 150, name$tr$: 'cloud.common.entityDescription' },
					{ id: 'bpname', field: 'BusinessPartnerName1', name: 'Business Partner Name1', width: 100, name$tr$: 'cloud.common.entityBusinessPartnerName1' }
				],
				width: 500,
				height: 200
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}
	]);
})(angular);