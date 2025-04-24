(function (angular) {
	'use strict';
	/* global angular */
	var moduleName = 'platform';
	angular.module(moduleName).directive('platformPlanningBoardEditAssignmentDialogDirective', [
		function () {
			return {
				scope: {},
				restrict: 'A',
				controller: 'platformPlanningBoardEditAssignmentDialogController',
				templateUrl: globals.appBaseUrl +'app/components/planningboard/templates/platform-planning-board-edit-assignment-dialog-template.html',
				link: ($scope,element) => {
					let dataService = $scope.$parent.groups[0].rows[0].options.dataService;
					if(dataService.getDateshiftConfig()){
						let cancelButton = document.querySelector('.modal-footer .cancel');
						if (cancelButton) {
							cancelButton.disabled = true;
						}
					}
				}
			};


		}]);
})(angular);