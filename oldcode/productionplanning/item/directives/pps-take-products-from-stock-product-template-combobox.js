(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.item';

	angular.module(moduleName).directive('ppsTakeProductsFromStockProductTemplateCombobox', [
		'BasicsLookupdataLookupDirectiveDefinition',
		'ppsCommonStockProductDataService',
		function (BasicsLookupdataLookupDirectiveDefinition,
			ppsCommonStockProductDataService) {

			const defaults = {
				lookupType: 'PPSProductDescription',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '0f42c5b00e81433296dcac4d1bf69a6f',
				version: 3,
				disableDataCaching: true,
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: {
					getList: function (options, scope) {
						return ppsCommonStockProductDataService.getAllPpsProductTemplateByPpsHeaderIdAsync(scope.entity.PpsHeaderId);
					},
					getItemByKey: function (value) {
						// not used
					}
				}
			});
		}
	]);
})(angular);

