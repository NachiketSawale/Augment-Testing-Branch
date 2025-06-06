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
angular.module('basics.workflow').controller('basicWorkflowFilterSaveDialogController',
	['$scope', '$modalInstance', '$translate', '_', 'cloudDesktopEnhancedFilterService',
		function ($scope, $modalInstance, $translate, _, eFilterService) { // jshint ignore:line
			'use strict';

			var currentFilterDef = $scope.searchOptions.enhancedFilter.currentFilterDef;

			if (!currentFilterDef) {
				console.error('basicWorkflowFilterSaveDialogController not current filterdefinition found ');
				$modalInstance.dismiss('cancel');
			}

			// definition for AreaItems
			var areaItems = eFilterService.accessLevelAreaItems();

			// just set default values
			var dropboxOptions = {
				items: eFilterService.availableFilterDefs,
				valueMember: 'filterName', displayMember: 'filterName',
				templateResult: function (item) {
					// var res= '<span>'+item.text+'</span>';
					var res = '' + item.text + '';
					return res;
				},
				templateSelection: function (item) {
					var res = '' + item.text + '';
					return res;
				}
			};

			$scope.modalOptions = {
				cancelBtnText: $translate.instant($scope.cancelBtnTextKey || 'cloud.desktop.filterdefSaveCancelBnt'),
				actionBtnText: $translate.instant($scope.actionBtnTextKey || 'cloud.desktop.filterdefSaveSaveBnt'),
				headerText: $translate.instant($scope.headerTextKey || 'basics.workflow.approve.TemplateSaveTitle'),
				namePlaceHolder: $translate.instant($scope.namePlaceHolderKey || 'basics.workflow.approve.TemplateSaveNamePlaceHolder'),
				areaLabelText: $translate.instant($scope.areaLabelTextKey || 'basics.workflow.approve.TemplateSaveAreaLabel'),
				nameLabelText: $translate.instant($scope.nameLabelTextKey || 'basics.workflow.approve.TemplateSaveNameLabel'),

				areaItems: areaItems,
				selectedItem: areaItems.length > 0 ? areaItems[0] : undefined,

				selectedItemChanged: function (item) {
					console.log('selectedItemChanged called', item);
				},
				filterName: '',
				isValid: function isValid() {
					if ($scope.modalOptions.selectedItem && $scope.modalOptions.filterName && $scope.modalOptions.filterName.length > 0) {
						return true;
					}
					return false;
				},
				dropboxOptions: dropboxOptions
			};

			// set values from current filter
			$scope.modalOptions.filterName = (currentFilterDef.accesslevel !== 'New') ? currentFilterDef.name : '';

			var selectedFound = _.find(areaItems, function (item) {
				return item.id === currentFilterDef.accesslevel;
			});
			if (selectedFound) {
				$scope.modalOptions.selectedItem = selectedFound;
			}

			/**
			 *
			 * @param result
			 */
			$scope.modalOptions.ok = function (result) {
				if ($scope.modalOptions.isValid()) {
					currentFilterDef.name = $scope.modalOptions.filterName;
					currentFilterDef.accesslevel = $scope.modalOptions.selectedItem.id;
					$modalInstance.close(result);
				}
			};

			/**
			 *
			 */
			$scope.modalOptions.cancel = function (/*result*/) {
				$modalInstance.dismiss('cancel');
			};

		}]);
