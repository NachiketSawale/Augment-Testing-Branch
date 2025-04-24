/**
 * Created by balkanci on 19.01.2015.
 */
(function (angular) {
	'use strict';
	angular.module('basics.lookupdata').directive('basicsLookupdataSimple', ['$q', 'basicsLookupdataSimpleLookupService', '_', 'basicsLookupSimpleDataProcessor',
		'BasicsLookupdataLookupDirectiveDefinition','basicsLookupDataColorItemFormatter',
		function ($q, basicsLookupdataSimpleLookupService, _, simpleProcessor, BasicsLookupdataLookupDirectiveDefinition, colorItemFormatterService) {

			var baseOptions = {

				dataProvider: {

					getList: function (lookupOptions) {
						var deferred = $q.defer();
						basicsLookupdataSimpleLookupService.getList(lookupOptions).then(function (list) {

							deferred.resolve(simpleProcessor.getFilterProcessor()(list));
						});
						return deferred.promise;
					},

					getDefault: function (lookupOptions) {

						var deferred = $q.defer();
						basicsLookupdataSimpleLookupService.getDefault(lookupOptions).then(function (defaultItem) {
							deferred.resolve(defaultItem);
						});
						return deferred.promise;
					},

					getItemByKey: function (value, lookupOptions) {

						var deferred = $q.defer();
						basicsLookupdataSimpleLookupService.getItemById(value, lookupOptions).then(function (item) {
							deferred.resolve(item);
						});
						return deferred.promise;
					},

					getSearchList: function (lookupOptions) {
						var deferred = $q.defer();
						basicsLookupdataSimpleLookupService.getList(lookupOptions).then(function (list) {
							deferred.resolve(simpleProcessor.getFilterProcessor()(list));
						}
						);
						return deferred.promise;
					}
				}
			};

			var configObject = {
				onDataRefresh: function ($scope) {
					if ($scope.$parent && $scope.$parent.options && $scope.$parent.options.lookupModuleQualifier) {
						// returns the 'fresh' data from server, with maybe new items
						basicsLookupdataSimpleLookupService.refreshCachedData($scope.$parent.options).then(function (data) {
							$scope.updateData(simpleProcessor.getFilterProcessor()(data));
						});
					}
				},
				showCustomInputContent: true,
				formatter: colorItemFormatterService.formatter,
				popupOptions: {
					showLastSize: true
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', configObject, baseOptions);
		}
	]);
})(angular);
