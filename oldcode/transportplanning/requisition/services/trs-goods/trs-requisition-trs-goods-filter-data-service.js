(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.requisition';

	angular.module(moduleName).factory('trsRequisitionTrsGoodsFilterDataService', DataService);

	DataService.$inject = ['platformDataServiceFactory',
		'platformDataServiceEntityReadonlyProcessor',
		'trsRequisitionTrsGoodsFilterService',
		'$http', 'platformDataValidationService',
		'transportplanningTransportRouteStatusLookupService'];

	function DataService(platformDataServiceFactory,
						 platformDataServiceEntityReadonlyProcessor,
						 trsRequisitionTrsGoodsFilterService,
						 $http, platformDataValidationService,
						 routeStatusLookupService) {
		var serviceOptions = {
			flatRootItem: {
				module: moduleName,
				serviceName: 'trsRequisitionTrsGoodsFilterDataService',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'transportplanning/requisition/trsgoods/',
					endRead: 'listbyfilter',
					usePostForRead: true,
					initReadData: function (readData) {
						if (trsRequisitionTrsGoodsFilterService.entity.date) {
							readData.CombineResReq = service.combineResReq;
							readData.Date = trsRequisitionTrsGoodsFilterService.entity.date.format('YYYY-MM-DD');
							readData.JobId = trsRequisitionTrsGoodsFilterService.entity.jobId;
							readData.IsPickup = trsRequisitionTrsGoodsFilterService.entity.isPickup;
						}
					}
				},
				entityRole: {
					root: {}
				},
				actions: {}
			}
		};

		var container = platformDataServiceFactory.createNewComplete(serviceOptions);
		var service = container.service;
		container.data.isRealRootForOpenedModule = () => {return false;};
		container.data.showHeaderAfterSelectionChanged = null;
		service.getSelectedFilter = function (filter) {
			return trsRequisitionTrsGoodsFilterService.entity[filter];
		};

		service.setSelectedFilter = function () {
			if (trsRequisitionTrsGoodsFilterService.entity['date']) {
				service.load();
			}
		};

		service.additionalUIConfigs = {
			editableColumns: ['trsplannedstart', 'uomfk', 'quantity'],
			combineUIConfigs: [{
				UIService: 'transportplanningRequisitionUIStandardService',
				columns: [{
					id: 'code',
					overload: {
						id: 'trscode',
						field: 'TrsCode',
						name$tr$: 'transportplanning.requisition.entityRequisition'
					}
				}, {
					id: 'lgmjobfk', overload: {id: 'trslgmjobfk', field: 'TrsLgmJobFk'}
				}, {
					id: 'plannedstart',
					overload: {
						id: 'trsplannedstart',
						field: 'TrsPlannedStart',
						name$tr$: 'transportplanning.requisition.entityRequisitionDate'
					}
				}, {
					id: 'trsreqstatusfk', overload: {name$tr$: 'transportplanning.requisition.entityRequisitionStatus'}
				}, {
					id: 'ispickup', overload: {id: 'trsispickup', field: 'TrsIsPickup'}
				}],
			}]
		};

		service.canCreateRoute = function () {
			return !_.isEmpty(service.getSelectedEntities());
		};

		service.createRoute = function (transportMainService) {
			var selectedIds = _.map(service.getSelectedEntities(), 'Id');
			$http.post(globals.webApiBaseUrl + 'transportplanning/transport/route/createbytrsgoods', {
				TrsGoodIds: selectedIds
			}).then(function (response) {
				if (response && response.data) {
					transportMainService.appendUnSavedNewItem(response.data);
				}
			});
		};

		service.canUpdateRoute = function (transportMainService, route) {
			route = route || transportMainService.getSelected();
			if (route && !_.isEmpty(service.getSelectedEntities())) {
				var status = _.find(routeStatusLookupService.getList(), {Id: route.TrsRteStatusFk});
				return status && status.IsInPlanning;
			}
			return false;
		};

		service.updateRoute = function (transportMainService, route) {
			route = route || transportMainService.getSelected();
			transportMainService.updateAndExecute(function () {
				if (platformDataValidationService.hasErrors(transportMainService)) {
					return;//stop when still has errors
				}
				var selectedIds = _.map(service.getSelectedEntities(), 'Id');
				$http.post(globals.webApiBaseUrl + 'transportplanning/transport/route/updatebytrsgoods', {
					TrsGoodIds: selectedIds,
					RouteId: route.Id
				}).then(function (response) {
					if (response && response.data) {
						response.data.oldRoute = route;//set to target route
						var isDelay = transportMainService.getSelected() !== route;
						transportMainService.setSelected(route).then(function () {
							transportMainService.appendUnSavedNewItem(response.data, true, isDelay);
						});
					}
				});

			});
		};

		return service;
	}

})(angular);