/**
 * Created by reimer on 20.03.2017.
 */

(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name
	 * @requires
	 * @description
	 */

	var moduleName = 'boq.main';

	angular.module(moduleName).directive('boqMainCatalogAssignCatalogCombobox', [
		'$q',
		'BasicsLookupdataLookupDirectiveDefinition',
		'boqMainCatalogAssignCatalogLookupService',
		function ($q,
			BasicsLookupdataLookupDirectiveDefinition,
			dataService) {

			var defaults = {
				lookupType: 'boqMainCatalogAssignCatalogLookup',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				uuid: '66ec9a6328cf4f608b7e08098acf473e',
				onDataRefresh: function () {
					dataService.refresh();
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {

				dataProvider: {

					getList: function () {
						return dataService.getList();
					},

					getItemByKey: function (value) {
						return dataService.getItemByKeyAsync(value);
					},

					getSearchList: function () {
						return dataService.getList();
					}

				}
			});
		}
	]);

})(angular);

