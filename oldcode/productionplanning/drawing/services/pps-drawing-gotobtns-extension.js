(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.drawing';
	let angModule = angular.module(moduleName);

	angModule.service('productionplanningDrawingGotoBtnsExtension', Extension);
	Extension.$inject = ['_', '$translate', 'ppsCommonToolbarGotoAndGobacktoBtnsExtension'];

	function Extension(_, $translate, ppsCommonToolbarGotoAndGobacktoBtnsExtension) {
		this.createGotoBtns = function (service) {
			let navBtnCreationObjs = [{
				id: 'ppsItemGoto',
				caption: $translate.instant('productionplanning.item.entityItem'),
				iconClass: 'app-small-icons ico-production-planning',
				navigator: {moduleName: 'productionplanning.item'},
				getNavigationEntity: () => new Promise((resolve) => {
					resolve({EngDrawingFk: service.getSelected().Id}); // return an entity that includes property EngDrawingFk
				}),
				triggerField: 'EngDrawingFk',
				disabled: () => !service.getSelected()
			}, {
				id: 'engTaskGoto',
				caption: $translate.instant('productionplanning.common.gotoEngineeringTask'),
				iconClass: 'app-small-icons ico-engineering-planning',
				navigator: {moduleName: 'productionplanning.engineering'},
				getNavigationEntity: () => new Promise((resolve) => {
					resolve({EngDrawingFk: service.getSelected().Id}); // return an entity that includes property EngDrawingFk
				}),
				triggerField: 'EngDrawingFk',
				disabled: () => {
					let selectedItem = service.getSelected();
					return !selectedItem || _.isNil(selectedItem.PpsItemFk);
				}
			}];

			return ppsCommonToolbarGotoAndGobacktoBtnsExtension.createGotoBtns(service, navBtnCreationObjs);
		};
	}
})(angular);
