/**
 * Created by gaz on 6/28/2018.
 */

(function (angular, globals) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.package';

	globals.lookups.suggestedMaterials = function suggestedMaterials() {
		return {
			lookupOptions: {
				lookupType: 'suggestedMaterials',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'bde7c60e4c364099b22cae4fe7213896',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', width: 50, name$tr$: 'cloud.common.entityCode' },
					{ id: 'desc', field: 'DescriptionInfo1.Translated', name: 'Description', width: 200, name$tr$: 'cloud.common.entityDescription' },
					{ id: 'totalcurrency', field: 'TotalCurrency', name: 'TotalCurrency', width: 100, name$tr$: 'procurement.common.prcItemTotalCurrency' }
				],
				width: 480,
				height: 120
			},
			dataProvider: 'procurementPackageItemMaterialAiAlternativesSuggestedMaterialDataService'
		};
	};

	angular.module(moduleName).directive('procurementPackageItemMaterialAiAlternativesSuggestedMaterialLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			var defaults = globals.lookups.suggestedMaterials();
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults.lookupOptions, {
				dataProvider: defaults.dataProvider
			});
		}
	]);
})(angular, globals);
