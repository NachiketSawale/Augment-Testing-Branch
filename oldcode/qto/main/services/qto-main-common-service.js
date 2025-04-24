(function (angular) {

	'use strict';
	let qtoMainModule = angular.module('qto.main');

	// jshint -W072
	qtoMainModule.factory('qtoMainCommonService', ['$injector', '$timeout', 'qtoBoqType', 'permissions', 'platformPermissionService',
		function ($injector, $timeout, qtoBoqType, permissions, platformPermissionService) {

			let service = {};

			let gridToReadonly = {};

			service.setLookupWithProjectId = function (projectId){
				$injector.get('salesWipLookupDataService').setProjectId(projectId);
				$injector.get('salesBillingNoLookupDataService').setProjectId(projectId);

				$injector.get('qtoHeaderSalesContractLookupDialogService').setProjectId(projectId);
				$injector.get('qtoDetailBillToLookupDataService').setProjectId(projectId);

				$injector.get('pesHeaderLookupDataService').setProjectId(projectId);
			};

			service.getItemService = function (boqType){
				var itemService = null;

				switch (boqType) {
					case qtoBoqType.PrcBoq:
						itemService = $injector.get('procurementPackageDataService');
						break;
					case qtoBoqType.PrjBoq:
						itemService = $injector.get('boqMainService');
						break;
					case qtoBoqType.WipBoq:
						itemService = $injector.get('salesWipService');
						break;
					case qtoBoqType.BillingBoq:
						itemService = $injector.get('salesBillingService');
						break;
					case qtoBoqType.PesBoq:
						itemService = $injector.get('procurementPesHeaderService');
						break;
				}

				return itemService;
			};

			service.setContainerReadOnly = function (isBackup, grid){
				$timeout(function () {
						if (isBackup) {
							if (!gridToReadonly[grid]) {
								platformPermissionService.restrict(grid, permissions.read);
								gridToReadonly[grid] = true;
							}
						} else if (gridToReadonly[grid]) {
							platformPermissionService.restrict(grid, false); // Reset restriction
							gridToReadonly[grid] = false;
						}
				}, 300);
			};

			return service;
		}]);
})(angular);