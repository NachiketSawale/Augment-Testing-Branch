/**
 * Created by Sudarshan on 27.06.2023
 */
(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('timekeeping.recording');

	/**
	 * @ngdoc service
	 * @name timekeepingRecordingBreakDataService
	 * @description provides methods to access, create and update timekeeping recording break entities
	 */
	myModule.service('timekeepingRecordingBreakDataService', TimekeepingRecordingBreakDataService);

	TimekeepingRecordingBreakDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'timekeepingRecordingConstantValues', 'timekeepingRecordingReportDataService','SchedulingDataProcessTimesExtension', 'timekeepingRecordingBreakValidationServiceFactory', 'moment','timekeepingRecordingRoundingDataService'];

	function TimekeepingRecordingBreakDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, timekeepingRecordingConstantValues, timekeepingRecordingReportDataService,SchedulingDataProcessTimesExtension, timekeepingRecordingBreakValidationServiceFactory, moment,timekeepingRecordingRoundingDataService) {
		let self = this;
		let timekeepingRecordingBreakServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'timekeepingRecordingBreakDataService',
				entityNameTranslationID: 'timekeeping.recording.recordingBreakEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/recording/break/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = timekeepingRecordingReportDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					timekeepingRecordingConstantValues.schemes.break),
					new SchedulingDataProcessTimesExtension(['BreakStart','BreakEnd','FromTimeBreakTime', 'ToTimeBreakTime']),
				],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = timekeepingRecordingReportDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Breaks', parentService: timekeepingRecordingReportDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(timekeepingRecordingBreakServiceOption, self);
		serviceContainer.data.Initialised = true;
		let service = serviceContainer.service;
		serviceContainer.service.registerItemModified(function (e, item) {
			let report = timekeepingRecordingReportDataService.getSelected();
			if (item) {
				if(!report.IsModified)
				{
					report.IsModified = true;
					timekeepingRecordingReportDataService.markItemAsModified(report);
				}
			}
		});
		// serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
		// 	mustValidateFields: true,
		// 	typeName: 'TimekeepingBreakDto',
		// 	moduleSubModule: 'Timekeeping.Recording',
		// 	validationService: 'timekeepingRecordingBreakValidationService'
		// }, timekeepingRecordingConstantValues.schemes.break));

		function deleteItems(entities){
			let report = timekeepingRecordingReportDataService.getSelected();
			if (report) {
				serviceContainer.data.deleteEntities(entities, serviceContainer.data).then(() =>{
					return serviceContainer.data.getList();
				}).then(allBreaks =>{
					let breakData = service.getList();
					if(breakData.length>0){
						if(breakData.length===1){
							report.BreakFrom = breakData[0].FromTimeBreakTime;
							report.BreakTo = breakData[0].ToTimeBreakTime;
						}
						let hours = calculateWorkingDuration(report.FromTimePartTime,report.ToTimePartTime,report.FromTimePartDate,report.ToTimePartDate,breakData,report);
						if(hours<0){
							hours = hours+24;
						}if(hours>24){
							hours = hours-24;
						}
						report.Duration = timekeepingRecordingRoundingDataService.roundValue(hours, 'Duration', report);
					}
					else{
						let hours = calculateHours(report.FromTimePartTime,report.ToTimePartTime,report);
						if(hours<0){
							hours = hours+24;
						}if(hours>24){
							hours = hours-24;
						}
						report.BreakFrom = null;
						report.BreakTo = null;
						report.Duration = timekeepingRecordingRoundingDataService.roundValue(hours, 'Duration', report);
						report.BreakDuration = 0;
					}
					report.IsModified = true;
					timekeepingRecordingReportDataService.markItemAsModified(report);
					return timekeepingRecordingReportDataService.gridRefresh();
				})
			}
		}
		serviceContainer.service.deleteItem = function deleteItem(entity){
			return deleteItems([entity]);
		};

		function calculateWorkingDuration(starttime,endtime,fromDateStart,toDateEnd,newBreaks,entity) {
			let fromTimeString = moment(starttime).format('HH:mm')+':00';
			let toTimeString = moment(endtime).format('HH:mm')+':00';
			let fromDateString = moment(fromDateStart).format('YYYY-MM-DD');
			let toDateString = moment(toDateEnd).format('YYYY-MM-DD');
			let nstartDatetime = new Date(fromDateString + ' ' + fromTimeString);
			let nendDatetime = new Date(toDateString + ' ' + toTimeString);

			let startDatetime = moment(nstartDatetime).format('YYYY-MM-DD HH:mm');
			let endDatetime = moment(nendDatetime).format('YYYY-MM-DD HH:mm');
			let breaks = [];
			let nestedItem = [];
			newBreaks.forEach(item => {
				if((item.Id === entity.Id) && (moment.utc(item.BreakStart).format('HH:mm') + ':00' !== moment(entity.FromTimeBreakTime).format('HH:mm') + ':00' ||
					moment.utc(item.BreakStart).format('YYYY-MM-DD') !== moment(entity.FromTimeBreakDate).format('YYYY-MM-DD') ||
					moment.utc(item.BreakEnd).format('HH:mm') + ':00' !== moment(entity.ToTimeBreakTime).format('HH:mm') + ':00' ||
					moment.utc(item.BreakEnd).format('YYYY-MM-DD') !== moment(entity.ToTimeBreakDate).format('YYYY-MM-DD'))) {
					let fromTimeString = moment(entity.FromTimeBreakTime).format('HH:mm') + ':00';
					let toTimeString = moment(entity.ToTimeBreakTime).format('HH:mm') + ':00';
					let fromDateString = moment(entity.FromTimeBreakDate).format('YYYY-MM-DD');
					let toDateString = moment(entity.ToTimeBreakDate).format('YYYY-MM-DD');
					let prestartDatetime = new Date(fromDateString + ' ' + fromTimeString);
					let preendDatetime = new Date(toDateString + ' ' + toTimeString);

					let breakstartDatetime = moment(prestartDatetime).format('YYYY-MM-DD HH:mm');
					let breakendDatetime = moment(preendDatetime).format('YYYY-MM-DD HH:mm');

					nestedItem = [breakstartDatetime, breakendDatetime,item.FromTimeBreakDate,item.ToTimeBreakDate];
				}else{
					let fromTimeString = moment(item.FromTimeBreakTime).format('HH:mm') + ':00';
					let toTimeString = moment(item.ToTimeBreakTime).format('HH:mm') + ':00';
					let fromDateString = moment(item.FromTimeBreakDate).format('YYYY-MM-DD');
					let toDateString = moment(item.ToTimeBreakDate).format('YYYY-MM-DD');
					let prestartDatetime = new Date(fromDateString + ' ' + fromTimeString);
					let preendDatetime = new Date(toDateString + ' ' + toTimeString);
					let breakstartDatetime = moment(prestartDatetime).format('YYYY-MM-DD HH:mm');
					let breakendDatetime = moment(preendDatetime).format('YYYY-MM-DD HH:mm');
					nestedItem = [breakstartDatetime, breakendDatetime,item.FromTimeBreakDate,item.ToTimeBreakDate];
				}
				breaks.push(nestedItem);
			});
			let BH = [];
			let TBH = 0;
			let breakHours = 0;
			let durationInMilliseconds = new Date(endDatetime) - new Date(startDatetime);
			// Convert milliseconds to hours
			const totalWorkingHours = durationInMilliseconds / (1000 * 60 * 60);

			//breaks.sort((a, b) => a[0] - b[0]);
			breaks.sort((a, b) => {
				// Convert the date strings in the date ranges to Date objects
				const dateA = new Date(a[0]);
				const dateB = new Date(b[0]);
				// Compare the dates
				if (dateA < dateB) {
					return -1;
				} else if (dateA > dateB) {
					return 1;
				} else {
					return 0;
				}
			});

			for (let i = 0; i < breaks.length; i++) {
				let value = breaks[i];
				let breakStart = new Date(value[0]).getTime(); // Ensure these are timestamps
				let breakEnd = new Date(value[1]).getTime();
				let startTimestamp = new Date(startDatetime).getTime();
				let endTimestamp = new Date(endDatetime).getTime();

				let adjustedStart = Math.max(breakStart, startTimestamp);
				let adjustedEnd = Math.min(breakEnd, endTimestamp);

				if (isNaN(adjustedStart) || isNaN(adjustedEnd)) {
					BH.push(0); // Handle NaN case
					continue; // Skip the current loop iteration
				}
				if (adjustedEnd > adjustedStart) {
					let breakHours = calculateHours(new Date(adjustedStart), new Date(adjustedEnd), entity); // Convert back to Date if needed
					BH.push(breakHours);
					startDatetime = new Date(adjustedEnd); // Update to Date if needed
				} else {
					BH.push(0); // No valid break period
				}
			}

			for (let n = 0; n < BH.length; n++) {
				TBH += BH[n];
			}
			let totalBreakHours = TBH;
			let ActualWorkingHours = totalWorkingHours - totalBreakHours;
			entity.BreakDuration = totalBreakHours;
			return ActualWorkingHours;
		}

		function calculateHours(FromTime,ToTime,entity){
			let toDateString=null;
			if(entity.ISStartAfterMidnight || entity.ISEndAfterMidnight){
				let fromDate = moment();
				let toDate = fromDate.clone().add(1, 'days');
				toDateString = toDate.format('YYYY-MM-DD');

			}else{
				toDateString = moment(new Date()).format('YYYY-MM-DD');
			}
			let fromTimeString = moment(FromTime).format('HH:mm')+':00';
			let toTimeString = moment(ToTime).format('HH:mm')+':00';
			let fromDateString = moment(new Date()).format('YYYY-MM-DD');

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

		serviceContainer.service.deleteEntities = function deleteEntities(entities){
			return deleteItems(entities);
		};
	}
})(angular);
