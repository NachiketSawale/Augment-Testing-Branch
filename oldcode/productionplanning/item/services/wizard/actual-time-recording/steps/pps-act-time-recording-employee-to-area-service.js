(function (angular) {
	'use strict';
	/* global */
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).service('ppsActualTimeRecordingEmployeeToAreaDataService', Service);
	Service.$inject = ['$injector', 'platformDataServiceFactory', 'platformRuntimeDataService',
		'ppsActualTimeRecordingTimeAssignmentDataService', 'ppsActualTimeRecordingEmployeeDataService', 'ppsActualTimeRecordingAreaDataService'];

	function Service($injector, platformDataServiceFactory, platformRuntimeDataService,
		assignmentDataService, employeeDataService, areaDataService) {
		const self = this;

		const serviceOption = {
			flatLeafItem: {
				module: moduleName,
				serviceName: 'ppsActualTimeRecordingEmployeeToAreaDataService',
				httpRead: {
					useLocalResource: true,
					resourceFunction: () => {
						const employee = employeeDataService.getSelected();
						return assignmentDataService.getAreasOfEmployee(employee.Id);
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
					leaf: { itemName: 'EmployeeToArea', parentService: employeeDataService }
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

		service.reset = () => {
			const selectedEmployee = employeeDataService.getSelected();
			const selectedArea = areaDataService.getSelected();
			return assignmentDataService.reset()
				.then(() => reselect(employeeDataService, selectedEmployee))
				.then(() => reselect(areaDataService, selectedArea));
		};

		service.canReset = () => employeeDataService.getList().length > 0;

		function reselect(dataService, preSelectedItem) {
			if (preSelectedItem) {
				return dataService.deselect().then(() => dataService.setSelected(preSelectedItem));
			}
		}
	}
})(angular);
