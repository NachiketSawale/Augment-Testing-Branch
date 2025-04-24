(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.report';
	const angModule = angular.module(moduleName);

	angModule.service('productionplanningReportGobacktoBtnsExtension', Extension);
	Extension.$inject = ['_', '$translate', 'ppsCommonToolbarGotoAndGobacktoBtnsExtension'];

	function Extension(_, $translate, ppsCommonToolbarGotoAndGobacktoBtnsExtension) {
		this.createGobacktoBtns = function (service) {
			let navBtnCreationObjs = [{
				id: 'activityGobackto',
				caption: $translate.instant('productionplanning.activity.entityActivity'),
				iconClass: 'app-small-icons ico-mounting-activity',
				navigator: {moduleName: 'productionplanning.activity'},
				getNavigationEntity: () => new Promise((resolve) => {
					resolve({MntActivityFk: service.getSelected().ActivityFk}); // return an entity that includes property MntActivityFk
				}),
				triggerField: 'MntActivityFk',
				disabled: () => {
					let selectedItem = service.getSelected();
					return !selectedItem || _.isNil(selectedItem.ActivityFk);
				}
			}, {
				id: 'requisitionGobackto',
				caption: $translate.instant('productionplanning.mounting.entityRequisition'),
				iconClass: 'app-small-icons ico-requisition',
				navigator: {moduleName: 'productionplanning.mounting'},
				getNavigationEntity: () => new Promise((resolve) => {
					resolve(service.getSelected());
				}),
				triggerField: 'MntRequisitionId',
				disabled: () => {
					let selectedItem = service.getSelected();
					return !selectedItem || _.isNil(selectedItem.MntRequisitionId);
				}
			}];

			return ppsCommonToolbarGotoAndGobacktoBtnsExtension.createGobacktoBtns(service, navBtnCreationObjs);
		};
	}
})(angular);
