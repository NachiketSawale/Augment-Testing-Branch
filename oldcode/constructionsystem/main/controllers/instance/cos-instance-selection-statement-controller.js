(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).controller('constructionsystemInstanceSelectionStatementController', [
		'$scope', 'constructionsystemCommonSelectionStatementCustomControllerService',
		'constructionSystemMainInstanceService', 'constructionSystemMainJobDataService',
		'constructionSystemCommonPropertyNameLookupService',
		function ($scope, constructionsystemCommonSelectionStatementCustomControllerService,
			constructionSystemMainInstanceService, constructionSystemMainJobDataService,
			constructionSystemCommonPropertyNameLookupService) {

			$scope.toolbarOption = {
				showExecute: true,
				execute: function () {
					constructionSystemMainJobDataService.createObjectAssignJob(true);
				}
			};

			constructionsystemCommonSelectionStatementCustomControllerService.initController($scope);

			function registerSelectionChanged() {
				if (constructionSystemMainInstanceService.hasSelection()) {
					$scope.currentHeaderId = constructionSystemMainInstanceService.getSelected().HeaderFk;
				} else {
					$scope.currentHeaderId = -1;
				}
			}

			constructionSystemMainInstanceService.registerSelectionChanged(registerSelectionChanged);
			registerSelectionChanged();

			$scope.$on('$destroy', function () {
				constructionSystemMainInstanceService.unregisterSelectionChanged(registerSelectionChanged);
				constructionSystemCommonPropertyNameLookupService.setCurrentModelId(null);
			});

		}
	]);
})(angular);