(function (angular) {
	'use strict';
	/* global */
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).service('ppsActualTimeRecordingAreaToEmployeeDataService', Service);
	Service.$inject = ['platformDataServiceFactory',
		'platformRuntimeDataService',
		'ppsActualTimeRecordingTimeAssignmentDataService',
		'ppsActualTimeRecordingAreaDataService'];

	function Service(platformDataServiceFactory,
		platformRuntimeDataService,
		assignmentDataService,
		areaDataService) {
		const self = this;

		const serviceOption = {
			flatLeafItem: {
				module: moduleName,
				serviceName: 'ppsActualTimeRecordingAreaToEmployeeDataService',
				httpRead: {
					useLocalResource: true,
					resourceFunction: () => {
						const area = areaDataService.getSelected();
						return assignmentDataService.getEmployeesOfArea(area.Id);
					},
				},
				actions: { create: false, delete: false },
				dataProcessor: [{
					processItem: item => {
						const allActions = assignmentDataService.getActions();
						// make empty cells readonly
						const fields = [];
						allActions.forEach(i => {
							if (!item.Actions[i.Id]) {
								fields.push({ field: `Actions['${i.Id}'].AssignedTime`, readonly: true });
							}
						});

						platformRuntimeDataService.readonly(item, fields);
					},
				}],
				entityRole: {
					leaf: { itemName: 'AreaToEmployee', parentService: areaDataService }
				},
				modification: 'none',
				entitySelection: {supportsMultiSelection: false},
				presenter: {list: {}},
			}
		};

		const serviceContainer = platformDataServiceFactory.createService(serviceOption, self);
		serviceContainer.data.Initialised = true;

		const service = serviceContainer.service;

		service.markItemAsModified = item => {
			assignmentDataService.markReportAsModified(item);
		};
	}
})(angular);
