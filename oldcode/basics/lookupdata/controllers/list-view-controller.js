/**
 * Created by wui on 9/21/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).constant('basicsLookupdataListViewOptions', {
		// callback after grid data refreshed.
		afterDataRefreshed: null
	});

	angular.module(moduleName).controller('basicsLookupdataListViewController', ['_', '$scope', '$popupInstance', '$popupContext', 'platformObjectHelper', 'basicsLookupdataListViewOptions',
		function (_, $scope, $popupInstance, $popupContext, platformObjectHelper, defaults) {
			var settings = _.merge({}, defaults, $popupContext);

			$scope.list = [];
			$scope.isLoading = false;
			$scope.settings = settings;

			$scope.settings.formatItem = function (lookupItem) {
				var id, snippet = platformObjectHelper.getValue(lookupItem, settings.displayMember);

				snippet = _.escape(snippet);

				if (angular.isFunction(settings.formatter)) {
					id = platformObjectHelper.getValue(lookupItem, settings.idProperty);
					snippet = settings.formatter(id, lookupItem, snippet, settings, $scope.entity);
				}

				if(!_.isNil(snippet) && !angular.isString(snippet)){
					snippet = snippet.toString();
				}

				return snippet;
			};

			$scope.settings.onItemClick = applySelection;

			/**
            * @description reload lookup data.
            */
			$scope.refresh = function () {
				if ($scope.settings.onDataRefresh) { // exists external data refresh callback.
					$scope.settings.onDataRefresh($scope);
				}
				else {
					$scope.settings.dataView.invalidateData();
					loadData('', true);
				}
			};

			$scope.$on('$destroy', function () {
				if ($scope.$close) {
					$scope.$close();
				}
			});

			initialize();

			function initialize() {
				settings.dataView.setScope($scope);
				settings.dataView.init(settings);
				loadData();
			}

			function loadData() {
				$scope.isLoading = true;

				$scope.settings.dataView.loadData().then(function (data) {
					$scope.list = data;
				}).finally(function () {
					$scope.isLoading = false;
				});
			}

			function applySelection(dataItem) {
				$scope.$close({
					isOk: true,
					value: dataItem
				});
			}
		}
	]);

})(angular);