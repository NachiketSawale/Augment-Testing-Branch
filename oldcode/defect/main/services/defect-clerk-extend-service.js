
/* global _ */
(function (angular) {
	'use strict';
	var moduleName = 'defect.main';
	angular.module(moduleName).factory('defectClerkExtendService', defectClerkExtendService);
	defectClerkExtendService.$inject = ['defectMainHeaderDataService', 'platformRuntimeDataService', '$injector'];

	function defectClerkExtendService(defectMainHeaderDataService, platformRuntimeDataService, $injector) {
		var service = {};
		service.beforeInitAdditionalServices = beforeInitAdditionalServices;

		function beforeInitAdditionalServices(container) {
			if (container) {
				let clerkService = container.service;
				let oldStoreCacheFor = container.data.storeCacheFor;
				container.data.storeCacheFor = function storeCacheFor(item, data) {
					var foundInValidData = _.find(data.itemList, function (dataItem) {
						return dataItem.MainItemFk !== item.Id;
					});
					if (foundInValidData) {
						return;
					}
					oldStoreCacheFor(item, data);
				};

				clerkService.storeCacheForCopy = function (item) {
					container.data.storeCacheFor(item, container.data);
				};

				let itemCnCreate = clerkService.canCreate;
				clerkService.canCreate = function () {
					if (parentReadOnly()) {
						return false;
					}
					return itemCnCreate();
				};

				let parentReadOnly = function parentReadOnly() {
					let mainItem = defectMainHeaderDataService.getSelected();
					if (mainItem) {
						let readonlyStatus = defectMainHeaderDataService.getModuleState(mainItem);
						return !!readonlyStatus;
					}
					return false;
				};

				let itemCanDelete = clerkService.canDelete;
				clerkService.canDelete = function () {
					if (parentReadOnly()) {
						return false;
					}
					return itemCanDelete();
				};
				clerkService.registerListLoaded(function () {
					let lookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');
					let clerks = lookupDescriptorService.getData('clerk');
					if (!clerks || clerks.length === 0) {
						$injector.get('basicsLookupdataLookupDataService').getList('clerk').then(function (clerkItem) {
							lookupDescriptorService.updateData('clerk', clerkItem);
						});
					}
					let isReadonly = parentReadOnly();
					let items = clerkService.getList();
					if (items && items.length > 0 && clerkService.setReadOnlyRow) {
						items.forEach(item => {
							platformRuntimeDataService.readonly(item, isReadonly);
						});
					}
				});
			}
		}

		service.InitAdditionalServices = InitAdditionalServices;

		function InitAdditionalServices() {

		}

		return service;
	}

})(angular);

