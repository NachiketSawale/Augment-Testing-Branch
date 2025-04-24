(angular => {
	'use strict';
	const moduleName = 'productionplanning.item';
	angular.module(moduleName).constant('ppsActTimeRecordingConstantValues', {
		employee: 'employee',
		area: 'area',
		employeeToArea: 'employeeToArea',
		areaToEmployee: 'areaToEmployee',
		area2: 'area2', // for area grid on the second step
		product: 'product', // for productAssignment grid on the second step
		uuid: {
			employee: '6357e69463cd461f95e61cb888183011',
			area: 'a95909d50c264e7bbaafb9b7168d88f0',
			employeeToArea: 'c047e7d1221a4a3c8407856e81dc5383',
			areaToEmployee: 'f93cbab8ae284f2a920d9f33289d0734',
		},
		schemes: {
			actualTimeReport: {
				typeName: 'PpsActualTimeReportVDto',
				moduleSubModule: 'ProductionPlanning.Item'
			},
			productAssignment: {
				typeName: 'PpsActualTimeRecordingProductAssignmentDto',
				moduleSubModule: 'ProductionPlanning.Item'
			},
		},
	});
})(angular);