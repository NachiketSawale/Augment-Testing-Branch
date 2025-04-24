/**
 * Created by lja on 9/04/2014.
 */

(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection

	/**
	 * @ngdoc controller
	 * @name basics.Material.basicsMaterialCatalogGridController
	 * @require $scope basicsMaterialCatalogGridColumns
	 * @description controller for basics material catalog
	 */
	angular.module('basics.materialcatalog').controller('basicsMaterialCatalogGridController',
		['$scope','$translate','platformGridControllerService', 'basicsMaterialCatalogService',
			'basicsMaterialCatalogUIStandardService', 'basicsMaterialCatalogValidationService','platformModuleNavigationService',
			function ($scope, $translate,gridControllerService, dataService, uiStandardService, validationService,naviService) {
				var gridConfig = {
					columns: []
				};

				gridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);

				var tools =  [];
				tools.push({
					id: 't11',
					caption: $translate.instant('cloud.common.Navigator.goTo'),
					type: 'item',
					iconClass: 'tlb-icons ico-goto',
					fn: function gotoMaterialRecord() {
						// First save current changes via parent service
						dataService.update().then(function(){
							// Then navigate to material module
							var navigator = {moduleName: 'basics.material', registerService: 'basicsMaterialRecordService'},
								selectedItem = dataService.getSelected();

							if (dataService.isSelection(selectedItem)) {
								naviService.navigate(navigator, selectedItem, 'fromMaterialCatalog');
							}
						});
					},
					disabled: function () {
						return _.isEmpty(dataService.getSelected());
					}
				});

				gridControllerService.addTools(tools);

				//for hidden bulk editor button
				var index = 0;
				for (; index < $scope.tools.items.length; index++) {
					if ($scope.tools.items[index].id === 't14') {
						break;
					}
				}
				$scope.tools.items.splice(index, 1);
			}
		]);
})(angular);