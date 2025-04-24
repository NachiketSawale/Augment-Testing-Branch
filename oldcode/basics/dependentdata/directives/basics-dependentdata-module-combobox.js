/**
 * Created by reimer on 20.11.2014.
 */

(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name basicsDependentDataModuleCombobox
	 * @requires
	 * @description ComboBox to select a module
	 */

	var moduleName = 'basics.dependentdata';

	angular.module(moduleName).directive('basicsDependentDataModuleCombobox', ['$q', 'BasicsLookupdataLookupDirectiveDefinition', 'basicsDependentDataModuleLookupService',
		function ($q, BasicsLookupdataLookupDirectiveDefinition, dataService) {

			var defaults = {
				lookupType: dataService.getlookupType(),
				valueMember: 'Id',
				displayMember: 'Description.Description',
				onDataRefresh: function () {
					dataService.refresh();
				}
			};

			function getList() {

				var deferred = $q.defer();
				dataService.loadData().then(
					function() {
						deferred.resolve(dataService.getListSortByDescription(defaults.removeDynamicItem));
					}
				);
				return deferred.promise;

			}

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {

				controller: ['$scope', function ($scope) {

					defaults.removeDynamicItem = $scope.lookupOptions.removeDynamicItem;

				}],

				dataProvider: {

					getList: getList,

					getItemByKey: function (value) {

						var deferred = $q.defer();
						dataService.loadData().then(
							function() {
								deferred.resolve(dataService.getItemByKey(value));
							}
						);
						return deferred.promise;
					}
				},

				getSearchList: getList

			});
		}
	]);

})(angular);

