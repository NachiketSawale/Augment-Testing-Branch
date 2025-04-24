(function (angular) {
	'use strict';
	/* global globals */
	const moduleName = 'productionplanning.activity';
	let angModule = angular.module(moduleName);

	angModule.service('productionplanningActivityGobacktoBtnsExtension', Extension);
	Extension.$inject = ['_', '$http', '$translate', 'ppsCommonToolbarGotoAndGobacktoBtnsExtension'];

	function Extension(_, $http, $translate, ppsCommonToolbarGotoAndGobacktoBtnsExtension) {
		this.createGobacktoBtns = function (service) {
			let disabledFn = () => {
				let selectedItem = service.getSelected();
				return !selectedItem || _.isNil(selectedItem.MntRequisitionFk);
			};
			let navBtnCreationObjs = [{
				id: 'requisitionGobackto',
				caption: $translate.instant('productionplanning.mounting.entityRequisition'),
				iconClass: 'app-small-icons ico-requisition',
				navigator: {moduleName: 'productionplanning.mounting'},
				getNavigationEntity: () => new Promise((resolve) => {
					resolve(service.getSelected()); // return an entity that includes property MntRequisitionFk
				}),
				triggerField: 'MntRequisitionFk',
				disabled: disabledFn
			}, {
				id: 'ppsItemGobackto',
				caption: $translate.instant('productionplanning.item.entityItem'),
				iconClass: 'app-small-icons ico-production-planning',
				navigator: {moduleName: 'productionplanning.item'},
				getNavigationEntity: () => $http.get(`${globals.webApiBaseUrl}basics/lookupdata/master/getitembykey?lookup=mntrequisition&Id=${service.getSelected().MntRequisitionFk}`),
				triggerField: 'PpsHeaderFk',
				disabled: disabledFn
			}];

			return ppsCommonToolbarGotoAndGobacktoBtnsExtension.createGobacktoBtns(service, navBtnCreationObjs);
		};
	}
})(angular);
