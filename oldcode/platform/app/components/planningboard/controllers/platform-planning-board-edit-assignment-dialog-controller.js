(function () {
	'use strict';
	var moduleName = 'platform';
	var angModule = angular.module(moduleName);

	angModule.controller('platformPlanningBoardEditAssignmentDialogController', PlatformPlanningBoardEditAssignmentDialogController);

	PlatformPlanningBoardEditAssignmentDialogController.$inject = ['$scope',
		'platformDetailControllerService',
		'platformToolbarService','platformDateshiftHelperService','productionplanningCommonActivityDateshiftService'
	];

	function PlatformPlanningBoardEditAssignmentDialogController($scope,
		platformDetailControllerService,
		platformToolbarService,platformDateshiftHelperService, ppsActivityDateshiftService) {

		$scope.getContainerUUID = function getContainerUUID() {
			return '2860df783e894efcbfd0fa5c8cbef024';
		};


		$scope.assignmentItem = $scope.$parent.$parent.entity;
		let uiStandardService = $scope.$parent.groups[0].rows[0].options.uiStandardService;
		let dataServiceForDetail = $scope.$parent.groups[0].rows[0].options.dataServiceForDetail;
		let dataService = $scope.$parent.groups[0].rows[0].options.dataService;

		let registeredVirtualDataService = ppsActivityDateshiftService.getVirtualDataServiceByMatch(dataService.getAssignmentConfig().dataService);
		let gridToolConfig = [
			{
				id: 'dateshiftModes',
				excluded: true
			},
			{
				id: 'fullshift',
				value: true
			}
		];
		$scope.dateShiftModeTools = platformDateshiftHelperService.getDateshiftTools(registeredVirtualDataService.getServiceName(), gridToolConfig, dataService.getDateshiftConfig().dateshiftId, $scope);


		$scope.setTools = (tools) => {
			tools.items = platformToolbarService.getTools($scope.getContainerUUID(), tools.items);
			$scope.tools = tools || [];
			if ($scope.tools.items && $scope.tools.items.length > 0) {
				let itemsToDelete = ['create', 'delete', 'first','previous','next','last','print'];
				$scope.tools.items = $scope.tools.items.filter(item => !itemsToDelete.includes(item.id));

				if (!_.isUndefined($scope.dateShiftModeTools)) {
					$scope.dateShiftModeTools.forEach(function f(tool) {
						$scope.tools.items.unshift(tool);
					});
				}
			}
			$scope.tools.update = () => {
				return true;
			};
		};

		platformDetailControllerService.initDetailController($scope, dataServiceForDetail, dataServiceForDetail.getValidationService(), uiStandardService);

	}

})();