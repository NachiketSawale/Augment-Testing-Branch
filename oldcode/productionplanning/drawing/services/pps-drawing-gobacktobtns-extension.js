(function (angular) {
	'use strict';
	/* global globals */
	const moduleName = 'productionplanning.drawing';
	let angModule = angular.module(moduleName);

	angModule.service('productionplanningDrawingGobacktoBtnsExtension', Extension);
	Extension.$inject = ['_', '$http', '$translate', 'ppsCommonToolbarGotoAndGobacktoBtnsExtension'];

	function Extension(_, $http, $translate, ppsCommonToolbarGotoAndGobacktoBtnsExtension) {
		this.createGobacktoBtns = function (service) {
			let navBtnCreationObjs = [{
				id: 'headerGobackto',
				caption: $translate.instant('productionplanning.header.entityHeader'),
				iconClass: 'app-small-icons ico-production-orders',
				navigator: {moduleName: 'productionplanning.header'},
				getNavigationEntity: () => $http.post(`${globals.webApiBaseUrl}basics/lookupdata/masternew/getitembykey?lookup=ppsitem`, {id: service.getSelected().PpsItemFk}),
				triggerField: 'PPSHeaderFk',
				disabled: () => {
					let selectedItem = service.getSelected();
					return !selectedItem || _.isNil(selectedItem.PpsItemFk);
				}
			}];

			return ppsCommonToolbarGotoAndGobacktoBtnsExtension.createGobacktoBtns(service, navBtnCreationObjs);
		};
	}
})(angular);
