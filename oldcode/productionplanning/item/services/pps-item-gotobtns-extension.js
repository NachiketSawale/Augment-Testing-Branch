/**
 * Created by zwz on 2021/3/16.
 */

(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.item';
	let angModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningItemGotoBtnsExtension
	 * @function
	 * @requires _, $translate, platformModuleNavigationService
	 * @description
	 * productionplanningItemGotoBtnsExtension provides goto-buttons for PPS item list/tree controller
	 */
	angModule.service('productionplanningItemGotoBtnsExtension', Extension);
	Extension.$inject = ['_', '$http', '$translate', 'ppsCommonToolbarGotoAndGobacktoBtnsExtension', 'ppsProductionplaceSiteFilterDataService','platformGridAPI'];

	function Extension(_, $http, $translate, ppsCommonToolbarGotoAndGobacktoBtnsExtension, ppsProductionplaceSiteFilterDataService, platformGridAPI) {

		/**
		 * @ngdoc function
		 * @name createGotoBtns
		 * @description Public function that creates goto-buttons for PPS item list/tree controller.
		 * @param {Object} service: The dataService that functionality of goto-buttons depends on.
		 **/
		this.createGotoBtns = function (service) {

			let navBtnCreationObjs = [{
				id: 'prodSetGoto',
				caption: $translate.instant('productionplanning.productionset.listProductionsetTitle'),
				iconClass: 'app-small-icons ico-production-sets',
				navigator: {moduleName: 'productionplanning.productionset'},
				getNavigationEntity: () => new Promise((resolve) => {
					resolve({ProductionSetFk: getCurrentSelectedItem(service).ProductionSetId}); // return an entity that includes property ProductionSetFk
				}),
				triggerField: 'ProductionSetFk',
				disabled: () => {
					let selectedItem = getCurrentSelectedItem(service);
					return !selectedItem || _.isNil(selectedItem.ProductionSetId);
				}
			}, {
				id: 'engTaskGoto',
				caption: $translate.instant('productionplanning.engineering.entityEngTask'),
				iconClass: 'app-small-icons ico-engineering-planning',
				navigator: {moduleName: 'productionplanning.engineering'},
				getNavigationEntity: () => new Promise((resolve) => {
					resolve({EngTaskFk: getCurrentSelectedItem(service).EngTaskId}); // return an entity that includes property EngTaskFk
				}),
				triggerField: 'EngTaskFk',
				disabled: () => {
					let selectedItem = getCurrentSelectedItem(service);
					return !selectedItem || _.isNil(selectedItem.EngTaskId);
				}
			}, {
				id: 'transportReqGoto',
				caption: $translate.instant('transportplanning.requisition.entityRequisition'),
				iconClass: 'app-small-icons ico-transport-requisition',
				navigator: {moduleName: 'transportplanning.requisition'},
				getNavigationEntity: () => new Promise((resolve) => {

					let selectedItem = getCurrentSelectedItem(service);
					let trsRequisitionFks = [];

					if(selectedItem.TrsRequistionId){
						trsRequisitionFks.push(selectedItem.TrsRequistionId);
					}
					if(selectedItem.ProdTrsRequisitionIds && selectedItem.ProdTrsRequisitionIds.length > 0){
						trsRequisitionFks = [...trsRequisitionFks, ...selectedItem.ProdTrsRequisitionIds];
					}
					const url = `${globals.webApiBaseUrl}productionplanning/item/getsubitems?mainItemId=${selectedItem.Id}`;
					$http.get(url).then(function (response) {
						if(response.data && response.data.dtos){
							response.data.dtos.forEach(dto => {

								if(dto.TrsRequistionId){
									trsRequisitionFks.push(dto.TrsRequistionId);
								}
								if(dto.ProdTrsRequisitionIds && dto.ProdTrsRequisitionIds.length > 0){
									trsRequisitionFks = [...trsRequisitionFks, ...dto.ProdTrsRequisitionIds];
								}
							});
						}
						selectedItem.RequisitionsInfo = {};
						selectedItem.RequisitionsInfo.Ids = _.uniq(trsRequisitionFks);
						resolve(selectedItem);
					});
				}),
				triggerField: 'RequisitionsInfo.Ids',
				disabled: () => {
					let selectedItem = getCurrentSelectedItem(service);
					return !selectedItem || !selectedItem.IsTransportRequisitionPlanned;
				}
			}, {
				id: 'transportRouteGoto',
				caption: $translate.instant('transportplanning.transport.entityRoute'),
				iconClass: 'app-small-icons ico-transport',
				navigator: {moduleName: 'transportplanning.transport'},
				getNavigationEntity: () => new Promise((resolve, reject) => {
					let selectedItem= getCurrentSelectedItem(service);
					let allRouteIds = selectedItem.RouteIds ? selectedItem.RouteIds : [];
					const url = `${globals.webApiBaseUrl}productionplanning/item/getsubitems?mainItemId=${selectedItem.Id}`;
					$http.get(url).then(function (response) {
						if (response.data?.dtos?.length) {
							response.data.dtos.forEach(dto => {
								if (dto.RouteIds && Array.isArray(dto.RouteIds)) {
									allRouteIds = [...allRouteIds, ...dto.RouteIds];
								}
							});
						}

						selectedItem.RoutesInfo = {};
						selectedItem.RoutesInfo.Ids = _.uniq(allRouteIds);
						resolve(selectedItem);

					});
				}),
				triggerField: 'RoutesInfo.Codes',
				disabled: () => {
					let selectedItem = getCurrentSelectedItem(service);
					return !selectedItem || !selectedItem.IsTransportPlanned;
				}
			}, {
				id: 'prodPlaceGoto',
				caption: $translate.instant('productionplanning.productionplace.entityProductionPlace'),
				iconClass: 'app-small-icons ico-product',
				navigator: {moduleName: 'productionplanning.productionplace'},
				getNavigationEntity: () => new Promise((resolve) => {
					let site = _.find(ppsProductionplaceSiteFilterDataService.getList(), function (item) {
						return item.Id === getCurrentSelectedItem(service).SiteFk;
					});
					resolve({Id: site.Id, ChildItems: site.ChildItems, SiteTypeFk: site.SiteTypeFk});
				}),
				triggerField: 'SiteFk',
				disabled: () => {
					let selectedItem = getCurrentSelectedItem(service);
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


		function getCurrentSelectedItem(service) {
			let containerUUID = service?.getContainerData()?.usingContainer?.[0] ?? null;
			let selectedItem = service.getSelected();

			if (containerUUID) {
				let gridElement = platformGridAPI.grids.element('id', containerUUID);
				const selectedRows = gridElement?.instance?.getSelectedRows?.() ?? [];
				if (selectedRows.length > 0) {
					selectedItem = gridElement.instance.getData().getItem(selectedRows.at(-1));
				}
			}
			return selectedItem;
		}

	}
})(angular);
