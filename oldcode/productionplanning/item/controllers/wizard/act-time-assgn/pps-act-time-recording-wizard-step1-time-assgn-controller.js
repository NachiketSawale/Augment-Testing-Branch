/**
 * Created by zwz on 01/06/2023.
 */

(function (angular) {
	'use strict';
	/* global moment */
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('productionplanningActualTimeRecordingWizardStep1TimeAssignmentController', Controller);
	Controller.$inject = ['$rootScope',
		'$scope',
		'platformTranslateService',
		'ppsActTimeRecordingFormConfiguration',
		'productionplanningActualTimeRecordingWizardStep1TimeAssignmentService'];

	function Controller($rootScope,
		$scope, 
		platformTranslateService,
		ppsActTimeRecordingFormConfiguration,
		step1TimeAssignmentService) {

		const formConfig = ppsActTimeRecordingFormConfiguration.getFormConfig(loadData);

		$scope.formOptions = {
			configure: platformTranslateService.translateFormConfig(formConfig),
			entity: $scope.context,
		};

		step1TimeAssignmentService.active($scope);

		loadData();
		function loadData() {
			$scope.isLoading = true;
			step1TimeAssignmentService.initial($scope.context.date, $scope.context.siteId, $scope.context.timeSymbolId)
				.then(() => $scope.isLoading = false);
		}

		$scope.$on('$destroy', function () {
		});

		$rootScope.$on('actual-time-reporting-wizard-is-closing', function () {
			step1TimeAssignmentService.clearCache();
		});
	}
})(angular);