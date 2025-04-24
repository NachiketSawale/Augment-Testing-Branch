/**
 * Created by wui on 10/18/2018.
 */

(function(angular){
	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).controller('prcItemScopeDetailController', [
		'$scope',
		'platformTranslateService',
		'platformDetailControllerService',
		'prcItemScopeUIStandardService',
		'prcItemScopeDataService',
		'prcItemScopeValidationService',
		function ($scope,
			platformTranslateService,
			platformDetailControllerService,
			prcItemScopeUIStandardService,
			prcItemScopeDataService,
			prcItemScopeValidationService) {

			var dataService = prcItemScopeDataService.getService();
			var validationService = prcItemScopeValidationService.getService(dataService);
			var uiStandardService = prcItemScopeUIStandardService.getService(dataService);

			dataService.parentService().registerSelectionChanged(onParentItemChanged);

			function onParentItemChanged() {
				$scope.parentItem = dataService.parentService().getSelected();
				if($scope.parentItem) {
					let itemTypeFk = $scope.parentItem.BasItemTypeFk;
					updateTools(itemTypeFk);
				}
			}

			function updateTools(itemTypeFk){
				var tools = $scope.tools;
				if(tools) {
					_.forEach($scope.tools.items, (item) => {
						if (item.id === 'create' || item.id === 'delete') {
							if (itemTypeFk === 7) {
								item.disabled = true;
							} else {
								item.disabled = false;
							}
						}
					});
					$scope.tools.update();
				}
			}

			platformDetailControllerService.initDetailController($scope, dataService, validationService, uiStandardService, platformTranslateService);

			dataService.watch($scope);
		}
	]);

})(angular);