// jshint -W072
/**
 * @ngdoc contrller
 * @name cloudDesktopFilterDefinitionSaveDialogController
 * @requires jgsldkfjslkdfjdl
 * @requires sdfsdfsdf
 *
 * @property {Object} current Reference to the current route definition.
 * @property {Object} routes Object with all route configuration Objects as its properties.
 *
 * @description
 *this documentation is for a value
 *
 * @example
 */
angular.module('cloud.desktop').controller('cloudDesktopFilterDefinitionBulkSaveDialogController',
	['$scope', '$modalInstance', '$translate', '_', 'cloudDesktopBulkSearchDataService',
		function ($scope, $modalInstance, $translate, _, bulkFilterService) { // jshint ignore:line
			'use strict';

			var currentFilter = $scope.searchOptions.selectedItem;

			if (!currentFilter) {
				console.error('cloudDesktopFilterDefinitionBulkSaveDialogController not current filterdefinition found ');
				$modalInstance.dismiss('cancel');
			}

			// definition for AreaItems
			var areaItems = bulkFilterService.accessLevelAreaItems();

			$scope.modalOptions = {
				cancelBtnText: $translate.instant('cloud.desktop.filterdefSaveCancelBnt'),
				actionBtnText: $translate.instant('cloud.desktop.filterdefSaveSaveBnt'),
				headerText: $translate.instant('cloud.desktop.filterdefSaveTitle'),
				areaLabelText: $translate.instant('cloud.desktop.filterdefSaveAreaLabel'),
				nameLabelText: $translate.instant('cloud.desktop.filterdefSaveNameLabel'),
				namePlaceHolder: $translate.instant('cloud.desktop.filterdefSaveNamePlaceHolder'),

				areaItems: areaItems,
				selectedItem: areaItems.length > 0 ? areaItems[0] : undefined,

				selectedItemChanged: function (item) {
					console.log('selectedItemChanged called', item);
				},
				filterName: '',
				isValid: function isValid() {
					return !!($scope.modalOptions.selectedItem && $scope.modalOptions.filterName && $scope.modalOptions.filterName.length > 0);
				}
			};

			// set values from current filter
			$scope.modalOptions.filterName = (currentFilter.accessLevel !== 'New') ? currentFilter.filterName : '';

			var selectedFound = _.find(areaItems, function (item) {
				return item.id === currentFilter.accessLevelId;
			});
			if (selectedFound) {
				$scope.modalOptions.selectedItem = selectedFound;
			}

			/**
			 *
			 * @param result
			 */
			$scope.modalOptions.ok = function () {
				if ($scope.modalOptions.isValid()) {
					var newFilter = {
						filterName: $scope.modalOptions.filterName,
						accessLevelId: $scope.modalOptions.selectedItem.id,
						updated: moment().format()
					};
					$modalInstance.close(newFilter);
				}
			};

			/**
			 *
			 */
			$scope.modalOptions.cancel = function (/* result */) {
				$modalInstance.dismiss('cancel');
			};

		}]);
