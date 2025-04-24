/**
 * Created by zwz on 01/06/2023.
 */

(function (angular) {
	'use strict';
	/* global angular, _ */
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('productionplanningActualTimeRecordingWizardStep2ProductAssignmentController', Controller);
	Controller.$inject = ['$scope', 'platformTranslateService', 'productionplanningActualTimeRecordingWizardStep2ProductAssignmentService','ppsActualTimeRecordingTimeAssignmentDataService', 'ppsActualTimeRecordingProductAssignmentDataService', 'ppsActTimeRecordingFormConfiguration'];

	function Controller($scope, platformTranslateService, service, timeAssignmentDataService, productAssignmentDataService, ppsActTimeRecordingFormConfiguration) {

		const formConfig = ppsActTimeRecordingFormConfiguration.getFormConfig(null, true);
		$scope.formOptions = {
			configure: platformTranslateService.translateFormConfig(formConfig),
			entity: $scope.context,
		};

		function createAreaActionActualTimeAssignments(areas) {
			let actions = timeAssignmentDataService.getActions();
			const timeSymbolIds = Array.from(new Set(_.map(actions, 'TksTimeSymbolFk')));
			let list = [];
			if (_.isArray(areas)) {
				_.each(areas, area => {
					_.each(timeSymbolIds, timeSymbolId => {
						let action = area.Actions[timeSymbolId];
						if (action) {
							list.push({
								SiteId: action.BasSiteFk,
								TimeSymbolId: action.TksTimeSymbolFk,
								TimeSymbolSorting: action.Sorting,
								Code: action.Code,
								DurationSum: action.AssignedTime
							});
						}
					});
				});
			}
			return list;
		}

		function loadData() {
			$scope.isLoading = true;
			$scope.productAssignmentRequest = {
				DueDate : $scope.context.date,
				Reports : timeAssignmentDataService.getAllReports(),
				AreaActionActualTimeAssignments : createAreaActionActualTimeAssignments(timeAssignmentDataService.getAreas())
			};
			productAssignmentDataService.load($scope.productAssignmentRequest)
				.then(() => $scope.isLoading = false);
		}
		loadData();

		service.setLoadingStatus = status => $scope.isLoading = status;
		service.isLoading = () => $scope.isLoading;
		service.loadData = loadData;

		service.initial($scope);

		$scope.$on('$destroy', function () {
		});

		setTimeout(function () {
			$scope.$broadcast('forceInitOnceKendoSplitter', 'ActualTimeRecordingWizardStep2ProductAssignment');
		}, 200);
	}
})(angular);