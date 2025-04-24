(function (angular) {

	'use strict';
	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).controller('constructionsystemMainObjectHierarchicalListController', [
		'$scope', 'platformGridControllerService', 'constructionsystemMainObjectHierarchicalConfigurationService',
		'constructionsystemMainObjectHierarchicalDataService',
		'constructionsystemMainObjectHierarchicalValidationService', 'constructionSystemMainClipboardService',
		function ($scope, platformGridControllerService, uiConfigService, dataService, validateService, cosMainClipboardService) {

			var gridConfig = dataService.getGridConfig();

			gridConfig.type= 'cosModelObjectsHierarchical';
			gridConfig.dragDropService = cosMainClipboardService;
			gridConfig.dragTextCallback = function (items) {

				if (items.length > 0) {
					return items.length + (items.length > 1 ? ' (items)' : ' (item)');
				}
				return '';
			};

			platformGridControllerService.initListController($scope, uiConfigService, dataService, validateService, gridConfig);

			dataService.loadData();
		}]);

})(angular);