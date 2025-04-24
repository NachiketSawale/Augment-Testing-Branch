(function () {
	'use strict';

	var moduleName = 'productionplanning.mounting';
	var module = angular.module(moduleName);

	module.controller('productionplanningMountingReq2BizPartnerListController', ListController);

	ListController.$inject = ['$scope', 'platformContainerControllerService',
		'productionplanningMountingReq2BizPartnerDataService', 'basicsCommonToolbarExtensionService',
		'productionplanningMountingMoveItemService'];

	function ListController($scope, platformContainerControllerService,
	                        dataService, toolbarExtensionService,
	                        moveItemService) {
		platformContainerControllerService.initController($scope, moduleName, '64adfcf420784ac29a06c0cbac339611');

		toolbarExtensionService.insertBefore($scope, {
			id: 'moveDown',
			sort: 10,
			cpation: 'cloud.common.toolbarMoveDown',
			type: 'item',
			iconClass: 'tlb-icons ico-grid-row-down',
			fn: function () {
				moveItemService.moveDown(dataService, '64adfcf420784ac29a06c0cbac339611');
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
				moveItemService.moveUp(dataService, '64adfcf420784ac29a06c0cbac339611');
			},
			disabled: function () {
				return !dataService.getSelected();
			}
		});
	}
})();
