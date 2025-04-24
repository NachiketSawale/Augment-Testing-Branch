/**
 * Created by reimer on 20.07.2016.
 */

(function (angular) {

	'use strict';

	var moduleName = 'basics.userform';

	angular.module(moduleName).directive('basicsUserformProcessingtypeCombobox', [
		'$q',
		'BasicsLookupdataLookupDirectiveDefinition',
		'basicsUserformProcessingTypeService',
		function (
			$q,
			BasicsLookupdataLookupDirectiveDefinition,
			dataService) {

			var defaults = {
				lookupType: dataService.getlookupType(),
				valueMember: 'Id',
				displayMember: 'Description',
				onDataRefresh: function () {
					dataService.refresh();
				}
			};

			function getList() {
				return $q.when(dataService.getList());
			}

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {

				dataProvider: {

					getList: getList,

					getItemByKey: function (value) {
						return $q.when(dataService.getItemByKey(value));
					},

					getSearchList: getList
				}
			});
		}
	]);

})(angular);

