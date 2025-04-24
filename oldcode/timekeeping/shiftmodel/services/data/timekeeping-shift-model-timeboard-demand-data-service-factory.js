(function (angular) {
	'use strict';
	var module = angular.module('timekeeping.shiftmodel');

	module.service('timekeepingShiftModelTimeboardDemandDataServiceFactory', TimekeepingShiftModelTimeboardDemandDataServiceFactory);

	TimekeepingShiftModelTimeboardDemandDataServiceFactory.$inject = ['platformPlanningBoardServiceFactoryProviderService', 'basicsCommonMandatoryProcessor'];

	function TimekeepingShiftModelTimeboardDemandDataServiceFactory(platformPlanningBoardServiceFactoryProviderService, mandatoryProcessor) {

		var self = this;

		self.createDemandService = function createService(options) {

			var factoryOptions = platformPlanningBoardServiceFactoryProviderService.createDemandCompleteOptions({
				isNode:true,
				baseSettings: options,
				module: module,
				translationId: 'timekeeping.shiftmodel.entityShift',
				http: platformPlanningBoardServiceFactoryProviderService.createHttpOptions({
					routePostFix: 'timekeeping/shiftmodel/workingtime/',
					endRead: 'GetForTimeboard',
					endDelete: 'multidelete',
					usePostForRead: true
				}),
				processor: [platformPlanningBoardServiceFactoryProviderService.createDateProcessor('ShiftWorkingTimeDto', 'Timekeeping.ShiftModel')],
				role: {
					itemName: 'Shiftmodel',
					moduleName: 'cloud.desktop.moduleDisplayNameShiftModel',
					useIdentification: true
				}
			});

			var serviceContainer = platformPlanningBoardServiceFactoryProviderService.createFactory(factoryOptions);
			serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
				mustValidateFields: true,
				typeName: 'ShiftWorkingTimeDto',
				moduleSubModule: 'Timekeeping.ShiftModel',
				validationService: 'timekeepingShiftModelWorkingTimeValidationService'
			});

			return serviceContainer;
		};
	}
})(angular);
