/* global globals */
/**
 * Created by henkel on 03.03.2016.
 */
(function (angular) {
	'use strict';

	angular.module('scheduling.main').controller('schedulingLocationWizardDialogController', ['$scope', '$translate', 'platformGridAPI','platformModalFormConfigService','platformModalGridConfigService', '$timeout',
		function ($scope, $translate, platformGridAPI, platformModalFormConfigService, platformModalGridConfigService, $timeout) {


			$scope.tabs = [
				{
					title: $translate.instant('scheduling.main.locations'),
					content: globals.appBaseUrl +'scheduling.main/templates/wizard/scheduling-location-wizard-dialog-location-grid.html',
					active: true,
					id: 'locations',
					disabled: false
				},
				{
					title: $translate.instant('scheduling.main.listRelationship'),
					content: globals.appBaseUrl +'scheduling.main/templates/wizard/scheduling-location-wizard-dialog-relation-form.html',
					id: 'relation',
					disabled: false
				}
			];

			// Function for button
			$scope.onCancel = function () {
				$scope.$close({});
				platformGridAPI.grids.unregister(platformModalGridConfigService.getGridUUID());
			};
			$scope.onOK = function () {

				var dataItem = {
					relData: platformModalFormConfigService.getDataItem(),
					locData: platformModalGridConfigService.getDataItems()
				};

				$scope.$close({yes: true, data: dataItem});
				platformGridAPI.grids.unregister(platformModalGridConfigService.getGridUUID());
			};

			$scope.onTabSelect = function (tab) {
				// in location tab exist a grid. this grid must be resize by click on tab location
				if (tab.id === 'locations' && platformModalGridConfigService.getGridUUID()) {
					// resize grid if tab-content is visible.
					$timeout(function() {
						platformGridAPI.grids.resize(platformModalGridConfigService.getGridUUID());
					}, 25, false);
				}
			};
		}
	]);

})(angular);
