(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.item';

	angular.module(moduleName).directive('ppsTakeProductsFromStockHeaderCombobox', [
		'BasicsLookupdataLookupDirectiveDefinition',
		'ppsCommonStockProductDataService',
		function (BasicsLookupdataLookupDirectiveDefinition,
			ppsCommonStockProductDataService) {

			const defaults = {
				lookupType: 'PpsHeader',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'a5b495c8788145e59d6f1a26300ad076',
				version: 3,
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: {
					getList: function () {
						return ppsCommonStockProductDataService.getAllPpsHeadersAsync();
					},
					getItemByKey: function (value) {
						// not used
					}
				}
			});
		}
	]);
})(angular);

