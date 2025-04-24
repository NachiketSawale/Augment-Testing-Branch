(function (angular) {
	'use strict';
	/* global */
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).service('ppsActualTimeRecordingEmployeeDataService', Service);
	Service.$inject = ['platformDataServiceFactory', 'ppsActualTimeRecordingTimeAssignmentDataService'];

	function Service(platformDataServiceFactory, assignmentDataService) {
		const self = this;
		const serviceOption = {
			flatRootItem: {
				module: moduleName,
				serviceName: 'ppsActualTimeRecordingEmployeeDataService',
				httpRead: {
					useLocalResource: true,
					resourceFunction: () => {
						return assignmentDataService.getEmployees();
					},
				},
				actions: { create: false, delete: false },
				dataProcessor: [],
				entityRole: {
					root: { itemName: 'Employee' }
				},
				modification: 'none',
				entitySelection: {supportsMultiSelection: false},
				presenter: {list: {}},
			}
		};

		const serviceContainer = platformDataServiceFactory.createService(serviceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.service.markItemAsModified = null;
		serviceContainer.data.showHeaderAfterSelectionChanged = null;
		serviceContainer.data.doUpdate = null;

		const service = serviceContainer.service;

		service.loadData = () => {
			const selected = service.getSelected();
			service.load().then(() => {
				if (selected) {
					service.deselect().then(() => service.setSelected(selected));
				}
				service.gridRefresh();
			});
		};

		service.isValid = employee => employee && employee.RemainingTime > 0;

		service.filter = (doFilter, gridInstance) => {
			if (doFilter && !service.isValid(service.getSelected())) {
				const availableRecords = serviceContainer.data.itemList.filter(i => service.isValid(i));

				if (availableRecords.length > 0) {
					service.setSelected(availableRecords[0]);
				} else {
					service.deselect().then(() => {
						if (gridInstance !== null) {
							gridInstance.setSelectedRows([]);
							gridInstance.invalidate();
						}
					});
				}
			}
		};
	}
})(angular);
