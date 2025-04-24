(function (angular) {
	'use strict';

	var moduleName = 'documents.import';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('documentImportOrphanController',
		['_','$scope', 'platformGridControllerService', 'documentImportDataService',
			'documentImportUIStandardService', 'platformToolbarService', 'cloudDesktopSidebarService',
			function (_,$scope, platformGridControllerService, documentImportDataService, documentImportUIStandardService,
				platformToolbarService, cloudDesktopSidebarService) {
				var gridConfig = {initCalled: false, columns: []};
				platformGridControllerService.initListController($scope, documentImportUIStandardService, documentImportDataService, {}, gridConfig);

				/* var containerUuid = $scope.getContainerUUID();

				  var toolItems = _.filter(platformToolbarService.getTools(containerUuid), function (item) {
						return item && item.id !== 'create' && item.id !== 'delete' && item.id !== 'createChild';
				  });
				  platformToolbarService.removeTools(containerUuid); */
				_.remove($scope.tools.items, function (item) {
					return item.id === 'create';
				});

				$scope.tools.items.splice(1, 0, {
					id: 'assignment',
					sort: 10,
					caption: 'documents.import.assignment',
					type: 'item',
					iconClass: 'tlb-icons ico-import',
					fn: documentImportDataService.assignment,
					disabled: documentImportDataService.disableAssignment
				});

				/* $scope.setTools({
					  showImages: true,
					  showTitles: true,
					  cssClass: 'tools',
					  items: toolItems
				 });
*/
				cloudDesktopSidebarService.showHideButtons([{
					sidebarId: cloudDesktopSidebarService.getSidebarIds().search,
					active: true
				}]);

				documentImportDataService.registerSidebarFilter();
				cloudDesktopSidebarService.onExecuteSearchFilter.register(documentImportDataService.executeSearchFilter);

				$scope.$watch(function () {
					return documentImportDataService.parentServiceHasSelected();
				}, function () {
					$scope.tools.update();
				});

				$scope.$on('$destroy', function () {
					cloudDesktopSidebarService.onExecuteSearchFilter.unregister(documentImportDataService.executeSearchFilter);
				});
			}]);
})(angular);
