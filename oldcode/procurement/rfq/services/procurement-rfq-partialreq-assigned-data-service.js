(function (angular) {
	// eslint-disable-next-line no-redeclare
	/* global angular */
	'use strict';

	var moduleName = 'procurement.rfq';

	angular.module(moduleName).factory('procurementRfqPartialreqAssignedDataService', procurementRfqPartialreqAssignedDataService);

	procurementRfqPartialreqAssignedDataService.$inject = [
		'_',
		'platformDataServiceFactory',
		'globals',
		'procurementRfqBusinessPartnerService',
		'procurementRfqMainService',
		'$q',
		'$http'
	];

	function procurementRfqPartialreqAssignedDataService(
		_,
		platformDataServiceFactory,
		globals,
		procurementRfqBusinessPartnerService,
		procurementRfqMainService,
		$q,
		$http
	) {

		let options = {
			flatLeafItem: {
				module: angular.module(moduleName),
				serviceName: 'procurementRfqPartialreqAssignedDataService',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'procurement/rfq/partialreqassigned/',
					endRead: 'listpartial',
					usePostForRead: true,
					initReadData: initReadData
				},
				presenter: {
					list: {}
				},
				entityRole: {
					leaf: {
						itemName: 'RfqPartialReqAssigned',
						parentService: procurementRfqBusinessPartnerService,
						doesRequireLoadAlways: true
					}
				},
				actions: {
					create: 'flat',
					delete: true
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createNewComplete(options);
		let service = serviceContainer.service;
		let data = serviceContainer.data;
		data.usesCache = false;
		service.canModify = canModify;
		service.createItem = createItem;
		service.clearData = clearData;
		service.getListAsync = getListAsync;
		return service;

		// //////////////////////////
		function isReadonlyByMainStatus() {
			let readonly = false;
			let headerStatus = procurementRfqMainService.getStatus();
			if (!headerStatus || headerStatus.IsReadonly) {
				readonly = true;
			}
			return readonly;
		}

		function canModify() {
			let rfqItem = procurementRfqMainService.getSelected();
			if (!rfqItem || angular.isUndefined(rfqItem.Id)) {
				return false;
			}

			return !isReadonlyByMainStatus();
		}

		function createItem (newItem) {
			if (!newItem) {
				return;
			}
			data.itemList.push(newItem);
			data.markItemAsModified(newItem, data);
		}

		function clearData() {
			return service.loadSubItemList()
				.then(function () {
					let list = service.getList();
					if (!list || list.length === 0) {
						return false;
					}

					_.forEach(list, function (item) {
						service.deleteItem(item);
					});
					procurementRfqMainService.update()
						.then(function () {
							return true;
						});
				});
		}

		function initReadData(readData) {
			let rfqHeader = procurementRfqMainService.getSelected();
			let bidderData = procurementRfqBusinessPartnerService.getSelected();
			readData.RfqHeaderFk = rfqHeader ? rfqHeader.Id : -1;
			readData.BusinesspartnerFk = bidderData ? bidderData.BusinessPartnerFk : -1;
		}

		function getListAsync(dataContext) {
			if (!dataContext || !dataContext.BusinessPartnerFk || !dataContext.RfqHeaderFk) {
				return $q.when([]);
			}
			let businessPartnerFk = dataContext.BusinessPartnerFk;
			let rfqHeaderFk = dataContext.RfqHeaderFk;
			return $http.post(globals.webApiBaseUrl + 'procurement/rfq/partialreqassigned/listpartial',
				{
					RfqHeaderFk: rfqHeaderFk,
					BusinesspartnerFk: businessPartnerFk
				})
				.then(function (response) {
					if (!response || !response.data) {
						return $q.when([]);
					}
					return data.handleReadSucceeded(response.data, data, true);
				});
		}
	}

})(angular);