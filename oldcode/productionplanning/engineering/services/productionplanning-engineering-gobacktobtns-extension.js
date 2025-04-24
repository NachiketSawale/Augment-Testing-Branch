(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.engineering';
	let angModule = angular.module(moduleName);

	angModule.service('productionplanningEngineeringGobacktoBtnsExtension', Extension);
	Extension.$inject = ['_', '$translate', 'ppsCommonToolbarGotoAndGobacktoBtnsExtension'];

	function Extension(_, $translate, ppsCommonToolbarGotoAndGobacktoBtnsExtension) {
		this.createGobacktoBtns = function (service) {
			let navBtnCreationObjs = [{
				id: 'drawingGobackto',
				caption: $translate.instant('productionplanning.drawing.entityDrawing'),
				iconClass: 'app-small-icons ico-production-planning',
				navigator: {moduleName: 'productionplanning.drawing'},
				getNavigationEntity: () => new Promise((resolve) => {
					resolve(service.getSelected()); // return an entity that includes property EngDrawingFk
				}),
				triggerField: 'EngDrawingFk',
				disabled: () => {
					let selectedItem = service.getSelected();
					return !selectedItem || _.isNil(selectedItem.EngDrawingFk);
				}
			}, {
				id: 'ppsItemGobackto',
				caption: $translate.instant('productionplanning.item.entityItem'),
				iconClass: 'app-small-icons ico-production-planning',
				navigator: {moduleName: 'productionplanning.item'},
				getNavigationEntity: () => new Promise((resolve) => {
					resolve(service.getSelected()); // return an entity that includes property PPSItemFk
				}),
				triggerField: 'PPSItemFk',
				disabled: () => {
					let selectedItem = service.getSelected();
					return !selectedItem || _.isNil(selectedItem.PPSItemFk);
				}
			}, {
				id: 'ppsHeaderGobackto',
				caption: $translate.instant('cloud.desktop.moduleDisplayNamePPSHeader'),
				iconClass: 'app-small-icons ico-production-planning',
				navigator: {moduleName: 'productionplanning.header'},
				getNavigationEntity: () => new Promise((resolve) => {
					resolve(service.getSelected()); // return an entity that includes property PPSItem_PpsHeaderFk
				}),
				triggerField: 'PPSItem_PpsHeaderFk',
				disabled: () => {
					let selectedItem = service.getSelected();
					return !selectedItem || _.isNil(selectedItem.PPSItem_PpsHeaderFk);
				}
			}];

			return ppsCommonToolbarGotoAndGobacktoBtnsExtension.createGobacktoBtns(service, navBtnCreationObjs);
		};
	}
})(angular);
