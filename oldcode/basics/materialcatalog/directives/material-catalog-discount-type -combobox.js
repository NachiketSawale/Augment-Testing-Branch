/**
 * Created by wuj on 5/19/2015.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.materialcatalog';

	angular.module(moduleName).directive('basicsMaterialCatalogDiscountTypeComboBox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'discountType',
				valueMember: 'Id',
				displayMember: 'Description'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: 'basicsMaterialCatalogDiscountTypeDataService'
			});
		}
	]);
})(angular);
