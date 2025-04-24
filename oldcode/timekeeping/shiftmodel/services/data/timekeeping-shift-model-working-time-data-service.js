/**
 * Created by baf on 06.06.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('timekeeping.shiftmodel');

	/**
	 * @ngdoc service
	 * @name timekeepingShiftModelWorkingTimeDataService
	 * @description pprovides methods to access, create and update timekeeping shiftModel workingTime entities
	 */
	myModule.service('timekeepingShiftModelWorkingTimeDataService', TimekeepingShiftModelWorkingTimeDataService);

	TimekeepingShiftModelWorkingTimeDataService.$inject = ['_', '$http','platformRuntimeDataService','platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'timekeepingShiftModelConstantValues', 'timekeepingShiftModelDataService', 'SchedulingDataProcessTimesExtension','timekeepingRecordingRoundingDataService'];

	function TimekeepingShiftModelWorkingTimeDataService(_, $http,platformRuntimeDataService,platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, timekeepingShiftModelConstantValues, timekeepingShiftModelDataService, SchedulingDataProcessTimesExtension,timekeepingRecordingRoundingDataService) {
		var self = this;
		var timekeepingShiftModelWorkingTimeServiceOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'timekeepingShiftModelWorkingTimeDataService',
				entityNameTranslationID: 'timekeeping.shiftmodel.timekeepingShiftModelWorkingTimeEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/shiftModel/workingTime/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = timekeepingShiftModelDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					timekeepingShiftModelConstantValues.schemes.workingTime), new SchedulingDataProcessTimesExtension(['FromTime', 'ToTime','BreakFrom','BreakTo']),
					{ processItem: calculateDuration }
				],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = timekeepingShiftModelDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					node: {itemName: 'WorkingTimes', parentService: timekeepingShiftModelDataService}
				},
				translation: { uid: 'timekeepingShiftModelWorkingTimeDataService',
					title: 'timekeeping.shiftmodel.translationDescShift',
					columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
					dtoScheme: {
						typeName: 'ShiftWorkingTimeDto',
						moduleSubModule: 'Timekeeping.ShiftModel'
					}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(timekeepingShiftModelWorkingTimeServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'timekeepingShiftModelWorkingTimeValidationService'
		}, timekeepingShiftModelConstantValues.schemes.workingTime));
		var service = serviceContainer.service;

		function calculateDuration(entity){
			if(entity.IsBreaksAvailable){
				if(!entity.IsOnlyOneBreak){
					if(entity.BreakFrom!==null && entity.BreakTo!==null){
						entity.BreakFrom = null;
						entity.BreakTo = null;
					}
				}
				let fields = [
					{ field: 'BreakFrom', readonly: true },
					{ field: 'BreakTo', readonly: true }
				];
				platformRuntimeDataService.readonly(entity, fields);
			}else{
				let fields = [
					{ field: 'BreakFrom', readonly: false },
					{ field: 'BreakTo', readonly: false }
				];
				platformRuntimeDataService.readonly(entity, fields);
				if(entity.BreakFrom===null && entity.BreakTo===null){
					entity.Duration = calculateHours(entity.FromTime,entity.ToTime);
				}
			}
		}


		function calculateHours(FromTime,ToTime){
			let fromTimeString = moment(FromTime).format('HH:mm')+':00';
			let toTimeString = moment(ToTime).format('HH:mm')+':00';
			let fromDateString = moment(new Date()).format('YYYY-MM-DD');
			let toDateString = moment(new Date()).format('YYYY-MM-DD');
			let dt1 = new Date(fromDateString + ' ' + fromTimeString);
			let dt2 = new Date(toDateString + ' ' + toTimeString);
			return hoursDiff(dt1,dt2);
		}
		function hoursDiff(dt1, dt2)
		{
			let diffTime =(dt2.getTime() - dt1.getTime());
			let hoursDiff = diffTime / (1000 * 3600);
			return hoursDiff;
		}

		service.setReadOnly = function (entity) {
			calculateDuration(entity);
		}
		return service;
	}
})(angular);
