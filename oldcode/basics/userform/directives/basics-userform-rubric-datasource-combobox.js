/**
 * Created by reimer on 20.07.2016.
 */

(function (angular) {

	'use strict';

	var moduleName = 'basics.userform';

	angular.module(moduleName).directive('basicsUserformRubricDataSourceCombobox', [
		'$q',
		'BasicsLookupdataLookupDirectiveDefinition',
		'basicsUserformRubricDataSourceService',
		function (
			$q,
			BasicsLookupdataLookupDirectiveDefinition,
			dataService) {

			var defaults = {
				lookupType: dataService.getlookupType(),
				valueMember: 'description',
				displayMember: 'description',
				onDataRefresh: function () {
					dataService.refresh();
				}
			};

			function getList() {

				var deferred = $q.defer();
				dataService.loadData().then(
					function () {
						deferred.resolve(dataService.getList());
					}
				);
				return deferred.promise;
			}

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {

				dataProvider: {

					getList: getList,

					getItemByKey: function (value) {

						var deferred = $q.defer();
						dataService.loadData().then(
							function () {
								deferred.resolve(dataService.getItemByDescription(value));
							}
						);
						return deferred.promise;
					},

					getSearchList: getList
				}
			});
		}
	]);

})(angular);

