(function (angular) {

	'use strict';
	var module = angular.module('timekeeping.employee');
	module.service('timekeepingEmployeeTimeboardServiceFactory', ['_', '$injector', 'platformPlanningBoardServiceFactoryProviderService',
		'platformDataServiceProcessDatesBySchemeExtension',
		function (_, $injector, platformPlanningBoardServiceFactoryProviderService, platformDataServiceProcessDatesBySchemeExtension) {

			var self = this;

			self.createSupplierService = function createService(options) {
				var factoryOptions = platformPlanningBoardServiceFactoryProviderService.createSupplierCompleteOptions({
					baseSettings: options,
					module: module,
					translationId: 'timekeeping.employee.entityResource',
					http: platformPlanningBoardServiceFactoryProviderService.createHttpOptions({
						routePostFix: 'timekeeping/employee/',
						endRead: 'GetForTimeboard',
						usePostForRead: true
					}),
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'EmployeeDto',
						moduleSubModule: 'Timekeeping.Employee'
					})],
					translation: {
						uid: 'timekeepingEmployeeTimeboard',
						title: 'timekeeping.employee.timeboard',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}]
					},
					role: {
						itemName: 'EmployeeDto',
						moduleName: 'cloud.desktop.moduleDisplayNameTimekeepingEmployee',
						descField: 'DescriptionInfo.Translated',
						useIdentification: true
					}
				});

				var service = platformPlanningBoardServiceFactoryProviderService.createFactory(factoryOptions).service;

				service.getIdList = function getIdList() {
					if (service.getList() && service.getList().length) {
						return _.map(service.getList(), function (resource) {
							return resource.Id;
						});
					}

					return [];
				};

				return service;
			};
		}
	]);
})(angular);
