/**
 * Created by lvy on 6/26/2018.
 */
/* global globals,_ */
(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).factory('basicsLookupdataDimensionTypeDataService', ['$q', '$http',
		function ($q, $http) {
			var options = {
				lookupModuleQualifier: 'basics.lookup.dimensiontype',
				displayProperty: 'Description',
				valueProperty: 'Id',
				CustomIntegerProperty: null
			};
			var list = [];

			function getItem(id) {
				for (var i = 0; i < list.length; i++) {
					if (list[i].Id === id) {
						return list[i];
					}
				}
			}

			return {
				getList: function () {
					var deferred = $q.defer();
					$http.post(globals.webApiBaseUrl + 'basics/lookupData/getData', options).then(
						function (response) {
							angular.forEach(response.data.items, function (e) {
								e.Description = e.displayValue;
								e.Id = e.id;
							});
							_.remove(response.data.items, {isLive: false});
							list = response.data.items;
							deferred.resolve(response.data.items);
						});
					return deferred.promise;
				},
				getItemByKey: function getItemByKey(key) {
					var item;
					var deferred = $q.defer();
					for (var i = 0; i < list.length; i++) {
						if (list[i].Id === key) {
							item = list[i];
							break;
						}
					}
					deferred.resolve(item);
					return deferred.promise;
				},
				getItemById: function (id) {
					return getItem(id);
				},
				getItemByIdAsync: function (id) {
					return this.getList().then(function () {
						return getItem(id);
					});
				},
				getSearchList: function () {
					return $q.when(list);
				},
				getDisplayItem: function getItemByKey(key) {
					var item;
					var deferred = $q.defer();
					for (var i = 0; i < list.length; i++) {
						if (list[i].Id === key) {
							item = list[i];
							break;
						}
					}
					deferred.resolve(item);
					return deferred.promise;
				}
			};
		}
	]);

	angular.module(moduleName).directive('basicsLookupdataDimensionTypeComboBox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'DimensionTypes',
				valueMember: 'Id',
				displayMember: 'Description'
			};
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: 'basicsLookupdataDimensionTypeDataService'
			});
		}]);
})(angular);