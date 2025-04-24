(function (angular) {
	'use strict';
	/* global */
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).service('ppsActualTimeRecordingAreaDataService', Service);
	Service.$inject = ['platformDataServiceFactory', 'platformRuntimeDataService', 'ppsActualTimeRecordingTimeAssignmentDataService'];

	function Service(platformDataServiceFactory, platformRuntimeDataService, assignmentDataService) {
		const self = this;
		const serviceOption = {
			flatRootItem: {
				module: moduleName,
				serviceName: 'ppsActualTimeRecordingAreaDataService',
				httpRead: {
					useLocalResource: true,
					resourceFunction: () => {
						return assignmentDataService.getAreas();
					},
				},
				actions: { create: false, delete: false },
				dataProcessor: [{
					processItem: item => platformRuntimeDataService.readonly(item, true)
				}],
				entityRole: {
					root: { itemName: 'Area' }
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

		const service= serviceContainer.service;

		service.loadData = () => {
			const selected = service.getSelected();
			service.load().then(() => {
				if (selected) {
					service.deselect().then(() => service.setSelected(selected));
				}
				service.gridRefresh();
			});
		};
	}
})(angular);
