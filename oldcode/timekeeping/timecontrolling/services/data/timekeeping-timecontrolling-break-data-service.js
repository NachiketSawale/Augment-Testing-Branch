(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('timekeeping.timecontrolling');

	/**
	 * @ngdoc service
	 * @name timekeepingTimeControllingBreakDataService
	 * @description provides methods to access, create and update timekeeping time controlling break entities
	 */
	myModule.service('timekeepingTimeControllingBreakDataService', TimekeepingTimeControllingBreakDataService);

	TimekeepingTimeControllingBreakDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'timekeepingTimeControllingConstantValues', 'timekeepingTimecontrollingReportDataService','SchedulingDataProcessTimesExtension'];

	function TimekeepingTimeControllingBreakDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, timekeepingTimeControllingConstantValues, timekeepingTimecontrollingReportDataService,SchedulingDataProcessTimesExtension) {
		let self = this;
		let timekeepingTimeControllingBreakServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'timekeepingTimeControllingBreakDataService',
				entityNameTranslationID: 'timekeeping.timecontrolling.entityBreak',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/recording/break/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = timekeepingTimecontrollingReportDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					timekeepingTimeControllingConstantValues.schemes.break),
					new SchedulingDataProcessTimesExtension(['BreakStart','BreakEnd','FromTimeBreakTime', 'ToTimeBreakTime']),
				],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = timekeepingTimecontrollingReportDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Breaks', parentService: timekeepingTimecontrollingReportDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(timekeepingTimeControllingBreakServiceOption, self);
		serviceContainer.data.Initialised = true;

		serviceContainer.service.registerItemModified(function (e, item) {
			let report = timekeepingTimecontrollingReportDataService.getSelected();
			if (item) {
				if(!report.IsModified)
				{
					report.IsModified = true;
					timekeepingTimecontrollingReportDataService.markItemAsModified(report);
				}
			}
		});
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'timekeepingTimeControllingBreakValidationService'
		}, timekeepingTimeControllingConstantValues.schemes.break));
	}
})(angular);
