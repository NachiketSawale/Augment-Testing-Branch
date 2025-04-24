/**
 * Created by snehal on 2024/8/23.
 */

(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.productionplace';
	let angModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name ppsProductionPlacePlanningBoardGotoBtnsExtension
	 * @function
	 * @requires _, $translate, platformModuleNavigationService
	 * @description
	 * ppsProductionPlacePlanningBoardGotoBtnsExtension provides goto-buttons for productionplace planningboard
	 */
	angModule.service('ppsProductionPlacePlanningBoardGotoBtnsExtension', Extension);
	Extension.$inject = ['_', '$http','$translate', 'ppsCommonToolbarGotoAndGobacktoBtnsExtension', 'platformModuleNavigationService'];

	function Extension(_, $http, $translate, ppsCommonToolbarGotoAndGobacktoBtnsExtension, naviService) {

		/**
		 * @ngdoc function
		 * @name createGotoBtns
		 * @description Public function that creates goto-buttons for ProductionPlace Planning Board Controller.
		 * @param {Object} service: The dataService that functionality of goto-buttons depends on.
		 **/
		this.createGotoBtns = function (dataService, demandService) {
			return {
				id: 'goto',
				caption: $translate.instant('cloud.common.Navigator.goTo'),
				type: 'dropdown-btn',
				iconClass: 'tlb-icons ico-goto',
				list: {
					showImages: true,
					listCssClass: 'dropdown-menu-right',
					items: [{
						id: 'ppsItemGoto',
						caption: $translate.instant('productionplanning.item.entityItem'),
						type: 'item',
						iconClass: 'app-small-icons ico-production-planning',
						fn: function () {
							let selectedItem = dataService.getSelected();
							let navigator = {moduleName: 'productionplanning.item'};
							let demands = demandService.getList();
							let mainItem = demands? demands.find(d => d.Id === selectedItem.ItemId): {};
							if (!mainItem) {
								// get products by routeId, then collect ItemFks from products, set ItemFks as part of param for navigation.
								const url = `${globals.webApiBaseUrl}productionplanning/item/getRootItem?itemId=${selectedItem.ItemId}`;
								$http.get(url).then(function (response) {
									let itemFks = response.data? [response.data.Id] : [];
									naviService.navigate(navigator, {LgmJobFk: selectedItem.LgmJobFk, ItemFks: itemFks}, 'LgmJobFk');
								});
							}else{
								let itemFks = [mainItem.PPSItemFk];
								naviService.navigate(navigator, {LgmJobFk: selectedItem.LgmJobFk, ItemFks: itemFks}, 'LgmJobFk');
							}
						},
						disabled: function () {
							let selectedItem = dataService.getSelected();
							return !selectedItem || _.isNil(selectedItem.LgmJobFk);
						}
					},
					{
						id: 'engDrawingGobackto',
						caption: $translate.instant('productionplanning.drawing.entityDrawing'),
						type: 'item',
						iconClass: 'app-small-icons ico-engineering-drawing',
						fn: function () {
							let selectedItem = dataService.getSelected();
							let navigator = {moduleName: 'productionplanning.drawing'};
								naviService.navigate(navigator, selectedItem, 'EngDrawingFk');
						},
						disabled: function () {
							let selectedItem = dataService.getSelected();
							return !selectedItem || _.isNil(selectedItem.EngDrawingFk);
						}
					},
					{
						id: 'productionPlanningGobackto',
						caption: $translate.instant('platform.planningboard.ppsHeader'),
						type: 'item',
						iconClass: 'app-small-icons ico-production-planning',
						fn: function () {
							let selectedItem = dataService.getSelected();
							let navigator = {moduleName: 'productionplanning.header'};
							naviService.navigate(navigator, selectedItem, 'PpsHeaderFk');
						},
						disabled: function () {
							let selectedItem = dataService.getSelected();
							return !selectedItem || _.isNil(selectedItem.EngDrawingFk);
						}
					}

				]
				}

			};
		};
	}
})(angular);
