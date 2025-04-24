/* global globals */
(function (angular) {
	'use strict';

	angular.module('scheduling.main').controller('schedulingGenerateActivitiesWizardDialogController', ['_', '$scope', '$translate', 'platformGridAPI','platformModalFormConfigService', '$timeout', 'schedulingMainGenerateActivitiesSelectionService',
		function (_, $scope, $translate, platformGridAPI, platformModalFormConfigService, $timeout,schedulingMainGenerateActivitiesSelectionService) {

			schedulingMainGenerateActivitiesSelectionService.init().then(function()
			{
				$scope.tabs = [
					{
						title: $translate.instant('scheduling.main.generateActivitiesWizard.generateActivities'),
						// content: globals.appBaseUrl +'scheduling.main/templates/wizard/scheduling-generate-activities-wizard-dialog-selection-form - Kopie.html',
						content: globals.appBaseUrl + 'scheduling.main/templates/wizard/scheduling-generate-activities-wizard-dialog-selection-form.html',
						active: true,
						id: 'locations',
						disabled: false
					},
					{
						title: $translate.instant('scheduling.main.listRelationship'),
						content: globals.appBaseUrl + 'scheduling.main/templates/wizard/scheduling-generate-activities-wizard-dialog-relation-form.html',
						id: 'relation',
						disabled: false
					}
				];
			});
			// Function for button
			$scope.onCancel = function () {
				$scope.$close({});
				// platformGridAPI.grids.unregister(platformModalGridConfigService.getGridUUID());
			};
			$scope.onOK = function () {

				let dataItems = {
					relData: platformModalFormConfigService.getDataItem(),
					generationData: schedulingMainGenerateActivitiesSelectionService.getSelectedCriteria()
				};

				$scope.$close({yes: true, data: dataItems});
				// platformGridAPI.grids.unregister(platformModalGridConfigService.getGridUUID());
			};

			$scope.isDisable = function () {

				let result = true;
				let relData = null;
				let config = platformModalFormConfigService.getConfig();
				if (!_.isNil(config) && !_.isNil(config.dataItem)) {
					relData = config.dataItem;
				}

				let generationData = schedulingMainGenerateActivitiesSelectionService.getSelectedCriteria();

				if (!(generationData.criteria1 === null || generationData.isFreeOrEstimate === 'FromEstimate' && generationData.estimateFk === null) &&
						(relData === null || relData.Create && relData.RelationKindFk !== null || !relData.Create)) {
					result = false;
				}
				return result;
			};

			$scope.onTabSelect = function (/* tab */) {
			};
		}
	]);

})(angular);
