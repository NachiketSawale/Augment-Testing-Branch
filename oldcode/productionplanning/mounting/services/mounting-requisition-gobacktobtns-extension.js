(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.mounting';
	let angModule = angular.module(moduleName);

	angModule.service('productionplanningMountingRequisitionGobacktoBtnsExtension', Extension);
	Extension.$inject = ['_', '$translate', 'ppsCommonToolbarGotoAndGobacktoBtnsExtension'];

	function Extension(_, $translate, ppsCommonToolbarGotoAndGobacktoBtnsExtension) {

		this.createGobacktoBtns = function (service) {
			let navBtnCreationObjs = [{
				id: 'headerGobackto',
				caption: $translate.instant('productionplanning.header.entityHeader'),
				iconClass: 'app-small-icons ico-production-orders',
				navigator: {moduleName: 'productionplanning.header'},
				getNavigationEntity: () => new Promise((resolve) => {
					resolve({PPSHeaderFk: service.getSelected().PpsHeaderFk}); // return an entity that includes property PPSHeaderFk
				}),
				triggerField: 'PPSHeaderFk',
				disabled: () => {
					let selectedItem = service.getSelected();
					return !selectedItem || _.isNil(selectedItem.PpsHeaderFk);
				}
			}];

			return ppsCommonToolbarGotoAndGobacktoBtnsExtension.createGobacktoBtns(service, navBtnCreationObjs);
		};
	}
})(angular);
