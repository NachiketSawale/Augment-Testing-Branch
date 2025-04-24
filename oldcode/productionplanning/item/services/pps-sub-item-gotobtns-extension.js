/**
 * Created by snehalc on 2025/3/24.
 */

(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.item';
	let angModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningSubItemGotoBtnsExtension
	 * @function
	 * @requires _, $translate, platformModuleNavigationService
	 * @description
	 * productionplanningSubItemGotoBtnsExtension provides goto-buttons for PPS item list/tree controller
	 */
	angModule.service('productionplanningSubItemGotoBtnsExtension', Extension);
	Extension.$inject = ['_', '$translate', 'ppsCommonToolbarGotoAndGobacktoBtnsExtension', 'ppsProductionplaceSiteFilterDataService'];

	function Extension(_, $translate, ppsCommonToolbarGotoAndGobacktoBtnsExtension, ppsProductionplaceSiteFilterDataService) {

		/**
		 * @ngdoc function
		 * @name createGotoBtns
		 * @description Public function that creates goto-buttons for PPS item list/tree controller.
		 * @param {Object} service: The dataService that functionality of goto-buttons depends on.
		 **/
		this.createGotoBtns = function (service) {
			let navBtnCreationObjs = [{
				id: 'transportReqGoto',
				caption: $translate.instant('transportplanning.requisition.entityRequisition'),
				iconClass: 'app-small-icons ico-transport-requisition',
				navigator: {moduleName: 'transportplanning.requisition'},
				getNavigationEntity: () => new Promise((resolve) => {
					let selectedItem= service.getSelected();
					let trsRequisitionFks = [];
					if(selectedItem.TrsRequistionId){
						trsRequisitionFks.push(selectedItem.TrsRequistionId);
					}
					if(selectedItem.ProdTrsRequisitionIds && selectedItem.ProdTrsRequisitionIds.length > 0){
						trsRequisitionFks = [...trsRequisitionFks, ...selectedItem.ProdTrsRequisitionIds];
					}

					selectedItem.RequisitionsInfo = {};
               selectedItem.RequisitionsInfo.Ids = _.uniq(trsRequisitionFks);
               resolve(selectedItem);
				}),
				triggerField: 'RequisitionsInfo.Ids',
				disabled: () => {
					let selectedItem = service.getSelected();
					return !selectedItem || !selectedItem.IsTransportRequisitionPlanned;
				}
			}, {
				id: 'transportRouteGoto',
				caption: $translate.instant('transportplanning.transport.entityRoute'),
				iconClass: 'app-small-icons ico-transport',
				navigator: {moduleName: 'transportplanning.transport'},
				getNavigationEntity: () => new Promise((resolve) => {
					let selectedItem= service.getSelected();
					let routeIds = selectedItem.RouteIds;
					selectedItem.RoutesInfo = {};
					selectedItem.RoutesInfo.Ids = routeIds;
					resolve(selectedItem);
				}),
				triggerField: 'RoutesInfo.Codes',
				disabled: () => {
					let selectedItem = service.getSelected();
					return !selectedItem || _.isNil(selectedItem.RouteIds) || selectedItem.RouteIds.length === 0;
				}
			}, {
				id: 'prodPlaceGoto',
				caption: $translate.instant('productionplanning.productionplace.entityProductionPlace'),
				iconClass: 'app-small-icons ico-product',
				navigator: {moduleName: 'productionplanning.productionplace'},
				getNavigationEntity: () => new Promise((resolve) => {
					let site = _.find(ppsProductionplaceSiteFilterDataService.getList(), function (item) {
						return item.Id === service.getSelected().SiteFk;
					});
					resolve({Id: site.Id, ChildItems: site.ChildItems, SiteTypeFk: site.SiteTypeFk});
				}),
				triggerField: 'SiteFk',
				disabled: () => {
					let selectedItem = service.getSelected();
					if (!_.isNil(selectedItem) && !_.isNil(selectedItem.SiteFk)) {
						let find = _.find(ppsProductionplaceSiteFilterDataService.getList(), function (item) {
							return item.Id === selectedItem.SiteFk;
						});
						return _.isNil(find);
					}
					return true;
				}
			}];

			return ppsCommonToolbarGotoAndGobacktoBtnsExtension.createGotoBtns(service, navBtnCreationObjs);
		};
	}
})(angular);
