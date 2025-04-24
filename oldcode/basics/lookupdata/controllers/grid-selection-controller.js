/**
 * Created by wui on 8/20/2015.
 */

(function(angular){
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).controller('basicsLookupdataGridSelectionController', ['$scope', '$log', '$options',
		'basicsLookupdataLookupControllerFactory', 'platformCreateUuid',
		function controller($scope, $log, $options, lookupControllerFactory, platformCreateUuid) {
			var gridOptions = {
				gridId: $options.uuid,
				idProperty: $options.idProperty || $options.valueMember,
				lazyInit: true
			};

			if(!gridOptions.gridId){
				$log.warn('Lookup ' + $options.lookupType + ' miss uuid definition!');
				gridOptions.gridId = platformCreateUuid();
			}

			var ctrlConfig = {
					grid: true,
					dialog: true,
					search: true
				},
				extension = $.extend({}, $options, gridOptions),
				self = lookupControllerFactory.create(ctrlConfig, $scope, extension);

			$scope.settings = $options;

			$scope.searchValue = $scope.settings.initialSearchValue;

			$scope.search = function (searchValue) {
				$scope.searchValue = searchValue;
				$scope.isLoading = true;
				$scope.settings.dataView.simpleSearch({
					searchFields: $scope.settings.inputSearchMembers,
					searchString: searchValue
				}).then(function (data) {
					self.updateData(data);
				});
			};

			$scope.refresh = function () {
				// exists external data refresh callback.
				if ($scope.settings.onDataRefresh) {
					$scope.settings.onDataRefresh($scope);
				}
				else {
					$scope.search($scope.searchValue, true);
				}
			};

			$scope.$on('$destroy', function () {
				$scope.close();
				self.destroy();
			});

			$scope.settings.dataView.setScope($scope);
			$scope.settings.dataView.init($scope.settings);
			self.onApply.register(apply);
			self.onSearch.register(search);
			if ($scope.settings.eagerSearch) {
				$scope.search($scope.searchValue);
			}

			/**
			 * extend okButtonDisabled
			 */
			if($scope.settings.okBtnDisabled){
				$scope.okBtnDisabled = function () {
					return $scope.settings.okBtnDisabled(self);
				};
			}

			/**
			 * close dialog and apply selection.
			 */
			function apply() {
				$scope.$close({
					isOk: true,
					data: self.getSelectedItems()
				});
			}

			/**
			 * search data with search string.
			 * @param e
			 * @param searchValue
			 */
			function search(e, searchValue) {
				$scope.search(searchValue);
			}

		}
	]);

})(angular);