(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).controller('constructionsystemMasterSelectionStatementController', [
		'$scope', 'constructionsystemCommonSelectionStatementCustomControllerService', 'constructionSystemMasterHeaderService',
		function ($scope, constructionsystemCommonSelectionStatementCustomControllerService, constructionSystemMasterHeaderService) {

			constructionsystemCommonSelectionStatementCustomControllerService.initController($scope);


			function registerSelectionChanged() {
				if (constructionSystemMasterHeaderService.hasSelection()) {
					$scope.currentHeaderId = constructionSystemMasterHeaderService.getSelected().Id;
				} else {
					$scope.currentHeaderId = -1;
				}
			}

			constructionSystemMasterHeaderService.registerSelectionChanged(registerSelectionChanged);
			registerSelectionChanged();

			$scope.$on('$destroy', function () {
				constructionSystemMasterHeaderService.unregisterSelectionChanged(registerSelectionChanged);
			});

		}
	]);
})(angular);