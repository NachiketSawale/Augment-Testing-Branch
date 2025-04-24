(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('documents.import').controller('documentsImportResultController',
		['_', '$scope', 'platformGridAPI', 'platformToolbarService', 'platformGridControllerService', 'documentsImportResultUiService', 'documentsImportResultService',
			function (_, $scope, platformGridAPI, platformToolbarService, platformGridControllerService, documentsImportResultUiService, documentsImportResultService) {

				platformGridControllerService.initListController($scope, documentsImportResultUiService, documentsImportResultService, {}, {});

				_.remove($scope.tools.items, function (item) {
					return item.id === 'create';
				});
				var newTools = [{
					id: 't-delete-all',
					sort: 0,
					caption: 'documents.import.pre',
					type: 'item',
					iconClass: 'tlb-icons ico-rec-previous',
					fn: documentsImportResultService.prePage,
					disabled: documentsImportResultService.previousDisabled
				},
				{
					id: 't-import-task',
					sort: 1,
					caption: 'documents.import.next',
					type: 'item',
					iconClass: 'tlb-icons ico-rec-next',
					fn: documentsImportResultService.nextPage,
					disabled: documentsImportResultService.nextDisabled
				}];
				$scope.tools.items.splice(1, 0, newTools[0], newTools[1]);

				$scope.$watch(function () {
					return platformGridAPI.rows.getRows($scope.gridId);
				}, function () {
					$scope.tools.update();// $scope.addTools(newTools);
				});

				function importResultRefresh(data) {
					platformGridAPI.items.data($scope.gridId, data);
				}

				documentsImportResultService.importResultChanged.register(importResultRefresh);

				$scope.$on('$destroy', function () {
					documentsImportResultService.importResultChanged.unregister(importResultRefresh);
					documentsImportResultService.clearData();
				});

			}]);
})(angular);