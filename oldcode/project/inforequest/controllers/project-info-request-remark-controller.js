/**
 * Created by baf on 2016.06.17.
 */
(function (angular) {
	'use strict';
	var moduleName = 'project.inforequest';

	angular.module(moduleName).controller('projectInfoRequestRemarkController', ProjectInfoRequestRemarkController);

	ProjectInfoRequestRemarkController.$inject = ['$scope', 'platformSingleRemarkControllerService', 'projectInfoRequestDataService'];

	function ProjectInfoRequestRemarkController($scope, platformSingleRemarkControllerService, projectInfoRequestDataService) {

		let hasSelectionChanged = false;

		function selectionChanged() {
			hasSelectionChanged = true;
			$scope.selectedInfoRequest = projectInfoRequestDataService.getSelected();
		}

		$scope.onChange = function () {
			if (hasSelectionChanged) {
				hasSelectionChanged = false;
			} else {
				projectInfoRequestDataService.markItemAsModified($scope.selectedInfoRequest);
			}
		};

		$scope.textareaEditable = () => Boolean(projectInfoRequestDataService.getSelected());

		projectInfoRequestDataService.registerSelectionChanged(selectionChanged);

		selectionChanged();

		$scope.$on('$destroy', function () {
			projectInfoRequestDataService.unregisterSelectionChanged(selectionChanged);
		});
	}
})(angular);