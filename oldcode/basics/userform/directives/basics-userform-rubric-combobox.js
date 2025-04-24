/**
 * Created by reimer on 20.11.2014.
 */

(function (angular) {

	'use strict';

	var moduleName = 'basics.userform';

	angular.module(moduleName).directive('basicsUserformRubricCombobox', [
		'BasicsLookupdataLookupDirectiveDefinition',
		'basicsUserformRubricLookupService',
		function (
			BasicsLookupdataLookupDirectiveDefinition,
			dataService) {

			var defaults = {
				lookupType: dataService.getlookupType(),
				valueMember: 'Id',
				displayMember: 'Description',
				uuid: '443e1b2056874ee0a636b83c7a152a35'
			};

			function getList() {
				return dataService.loadData().then(function () {
					return dataService.getList();
				});
			}

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {

				dataProvider: {

					getList: getList,

					getItemByKey: function (value) {
						return dataService.loadData().then(function () {
							return dataService.getItemByKey(value);
						});
					},

					getSearchList: getList

				}
			});
		}
	]);

})(angular);

