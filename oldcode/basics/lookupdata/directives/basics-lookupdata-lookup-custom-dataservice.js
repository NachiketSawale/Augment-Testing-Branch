/**
 * Created by balkanci on 23.02.2015.
 */
( function (angular) {
	'use strict';

	var directiveSwitch = function (IsGridDisabled) {
		return function ($injector, BasicsLookupdataLookupDirectiveDefinition) {
			var baseOptions = {
				dataProvider: {
					getService: function getService(lookupOptions, scope) {
						var service = $injector.get(lookupOptions.dataServiceName);

						if (lookupOptions.filter && scope) {
							service.setFilter(lookupOptions.filter(scope.entity));
						}

						return service;
					},

					getList: function getList(lookupOptions, scope) {
						var service = baseOptions.dataProvider.getService(lookupOptions, scope);

						return service.getLookupData(lookupOptions);
					},

					getDefault: function getDefault(lookupOptions) {
						var service = baseOptions.dataProvider.getService(lookupOptions);

						return service.getDefault(lookupOptions);
					},

					getItemByKey: function getItemByKey(value, lookupOptions, scope) {
						var service = baseOptions.dataProvider.getService(lookupOptions, scope);

						return service.getItemByIdAsync(value, lookupOptions, scope);
					},

					getSearchList: function getSearchList(searchString, displayMember, scope) {
						var service = baseOptions.dataProvider.getService(scope.options, scope);

						if (_.isFunction(service.setFilter) && (angular.isUndefined(scope.options.filterOnSearchIsFixed) || !scope.options.filterOnSearchIsFixed)) {
							service.setFilter(searchString);
						}

						return service.getList(scope.options, scope);
					}
				}
			};

			var configObject = {
				onDataRefresh: function ($scope) {
					if ($scope.$parent && $scope.$parent.options && $scope.$parent.options.lookupModuleQualifier && $scope.$parent.options.dataServiceName) {
						var service = baseOptions.dataProvider.getService($scope.$parent.options, $scope.$parent);

						service.resetCache($scope.$parent.options).then(function (data) {
							$scope.updateData(data);
						});
					}
				},
				selectableCallback: function (dataItem, entity, settings) {
					var service = baseOptions.dataProvider.getService(settings, null);
					if (angular.isFunction(service.selectableCallback)) {
						return service.selectableCallback(dataItem, entity, settings);
					}
					// when there is no Callback, all items are selectable per default
					return true;
				}
			};

			var directiveType = IsGridDisabled ? 'combobox-edit' : 'lookup-edit';
			return new BasicsLookupdataLookupDirectiveDefinition(directiveType, configObject, baseOptions);
		};
	};

	angular.module('basics.lookupdata').directive('basicsLookupDataByCustomDataService', ['$injector', 'BasicsLookupdataLookupDirectiveDefinition', directiveSwitch(false)]);
	angular.module('basics.lookupdata').directive('basicsLookupDataByCustomDataServiceGridLess', ['$injector', 'BasicsLookupdataLookupDirectiveDefinition', directiveSwitch(true)]);

})(angular);
