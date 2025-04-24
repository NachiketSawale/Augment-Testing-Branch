(function () {
	'use strict';

	var moduleName = 'productionplanning.mounting';
	var module = angular.module(moduleName);

	module.controller('productionplanningMountingReq2ContactListController', ListController);

	ListController.$inject = ['$scope', 'platformContainerControllerService',
	'productionplanningMountingReq2ContactDataService', 'basicsCommonToolbarExtensionService',
	'productionplanningMountingMoveItemService'];

	function ListController($scope, platformContainerControllerService,
	                        dataService, toolbarExtensionService,
	                        moveItemService) {
		platformContainerControllerService.initController($scope, moduleName, '3ffa784706a24bd99918b3d72ed52687');

		toolbarExtensionService.insertBefore($scope, {
			id: 'moveDown',
			sort: 10,
			cpation: 'cloud.common.toolbarMoveDown',
			type: 'item',
			iconClass: 'tlb-icons ico-grid-row-down',
			fn: function () {
				moveItemService.moveDown(dataService, '3ffa784706a24bd99918b3d72ed52687');
			},
			disabled: function () {
				return !dataService.getSelected();
			}
		});

		toolbarExtensionService.insertBefore($scope, {
			id: 'moveUp',
			sort: 10,
			caption: 'cloud.common.toolbarMoveUp',
			type: 'item',
			iconClass: 'tlb-icons ico-grid-row-up',
			fn: function () {
				moveItemService.moveUp(dataService, '3ffa784706a24bd99918b3d72ed52687');
			},
			disabled: function () {
				return !dataService.getSelected();
			}
		});
	}
})();
