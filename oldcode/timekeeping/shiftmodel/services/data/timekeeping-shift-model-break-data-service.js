/**
 * Created by Sudarshan on 28.06.2023
 */
(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('timekeeping.shiftmodel');

	/**
	 * @ngdoc service
	 * @name timekeepingShiftModelBreakDataService
	 * @description provides methods to access, create and update timekeeping recording break entities
	 */
	myModule.service('timekeepingShiftModelBreakDataService', TimekeepingShiftModelBreakDataService);

	TimekeepingShiftModelBreakDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'timekeepingShiftModelConstantValues', 'timekeepingShiftModelWorkingTimeDataService','SchedulingDataProcessTimesExtension','timekeepingRecordingRoundingDataService'];

	function TimekeepingShiftModelBreakDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, timekeepingShiftModelConstantValues, timekeepingShiftModelWorkingTimeDataService,SchedulingDataProcessTimesExtension,timekeepingRecordingRoundingDataService) {
		let self = this;
		function calculateWorkingDuration(starttime,endtime,newBreaks,entity) {
			//check midnight flag
			//add from and to date to calculateHours
			let startDatetime=null;
			let endDatetime=null;
			if(starttime<endtime){
				 startDatetime = moment(starttime).format('YYYY-MM-DD HH:mm');
				 endDatetime = moment(endtime).format('YYYY-MM-DD HH:mm');
			}else{
				startDatetime = moment(starttime).clone().add(-1, 'days').format('YYYY-MM-DD HH:mm');
				endDatetime = moment(endtime).format('YYYY-MM-DD HH:mm');
			}

			let breaks = [];
			let nestedItem = [];
			newBreaks.forEach(item => {

				let breakstartDatetime = moment(item.BreakStart).format('YYYY-MM-DD HH:mm');
				let breakendDatetime = moment(item.BreakEnd).format('YYYY-MM-DD HH:mm');
				if((item.Id === entity.Id) && (moment.utc(item.BreakStart).format('HH:mm') + ':00' !== moment(entity.BreakStart).format('HH:mm') + ':00' ||
					moment.utc(item.BreakStart).format('YYYY-MM-DD') !== moment(entity.BreakStart).format('YYYY-MM-DD') ||
					moment.utc(item.BreakEnd).format('HH:mm') + ':00' !== moment(entity.BreakEnd).format('HH:mm') + ':00' ||
					moment.utc(item.BreakEnd).format('YYYY-MM-DD') !== moment(entity.BreakEnd).format('YYYY-MM-DD'))) {
					if(item.BreakStart>item.BreakEnd){
						 breakstartDatetime = moment(item.BreakStart).clone().add(-1, 'days').format('YYYY-MM-DD HH:mm');
						 breakendDatetime = moment(item.BreakEnd).format('YYYY-MM-DD HH:mm');
					}else if(startDatetime>breakstartDatetime && endDatetime<breakendDatetime){
						 breakstartDatetime = moment(item.BreakStart).clone().add(1, 'days').format('YYYY-MM-DD HH:mm');
						 breakendDatetime = moment(item.BreakEnd).clone().add(1, 'days').format('YYYY-MM-DD HH:mm');
					}else{
						breakstartDatetime = moment(item.BreakStart).format('YYYY-MM-DD HH:mm');
						breakendDatetime = moment(item.BreakEnd).format('YYYY-MM-DD HH:mm');
					}
					nestedItem = [breakstartDatetime, breakendDatetime,entity];
				}else{
					if(item.BreakStart>item.BreakEnd){
						breakstartDatetime = moment(item.BreakStart).clone().add(-1, 'days').format('YYYY-MM-DD HH:mm');
						breakendDatetime = moment(item.BreakEnd).format('YYYY-MM-DD HH:mm');
					}else if(startDatetime>breakstartDatetime && endDatetime<breakendDatetime){
						breakstartDatetime = moment(item.BreakStart).clone().add(1, 'days').format('YYYY-MM-DD HH:mm');
						breakendDatetime = moment(item.BreakEnd).clone().add(1, 'days').format('YYYY-MM-DD HH:mm');
					}else{
						breakstartDatetime = moment(item.BreakStart).format('YYYY-MM-DD HH:mm');
						breakendDatetime = moment(item.BreakEnd).format('YYYY-MM-DD HH:mm');
					}
					nestedItem = [breakstartDatetime, breakendDatetime,entity];
				}

				breaks.push(nestedItem);
			});
			let BH = [];
			let TBH = 0;
			let breakHours = 0;
			let durationInMilliseconds = new Date(endDatetime) - new Date(startDatetime);
			// Convert milliseconds to hours
			const totalWorkingHours = durationInMilliseconds / (1000 * 60 * 60);

			breaks.sort((a, b) => a[0] - b[0]);

			for (let i = 0; i < breaks.length; i++) {
				let value = breaks[i];
				let breakStart = value[0];
				let breakEnd = value[1];
				let entity = value[2];
				if ((breakStart <= startDatetime && breakEnd >= endDatetime) || (breakStart === startDatetime && breakEnd >= endDatetime))
				{
					breakStart = startDatetime;
					breakEnd = endDatetime;
					if(breakEnd<breakStart){
						breakHours = 0;
					}else{
						breakHours = calculateHours(breakStart,breakEnd,entity);
					}
					BH.push(breakHours);
					startDatetime = breakEnd;
				}
				else if ((breakStart <= startDatetime && breakEnd <= endDatetime) || (breakStart === startDatetime && breakEnd <= endDatetime) || (breakStart <= startDatetime && breakEnd === endDatetime))
				{
					breakStart=startDatetime;
					//breakEnd=breakEnd;
					if(breakEnd<breakStart){
						breakHours = 0;
					}else{
						breakHours = calculateHours(breakStart,breakEnd,entity);
					}
					BH.push(breakHours);
					startDatetime = breakEnd;
				}
				else if (breakStart >= startDatetime && breakEnd >= endDatetime)
				{
					//breakStart=breakStart;
					breakEnd=endDatetime;
					if(breakEnd<breakStart){
						breakHours = 0;
					}else{
						breakHours = calculateHours(breakStart,breakEnd,entity);
					}
					BH.push(breakHours);
					startDatetime = breakEnd;
				}

				else if ((breakStart >= startDatetime && breakEnd === endDatetime) || (breakStart === startDatetime && breakEnd === endDatetime) || (breakStart >= startDatetime && breakEnd <= endDatetime))
				{
					//breakStart=breakStart;
					//breakEnd=breakEnd;
					if(breakEnd<breakStart){
						breakHours = 0;
					}else{
						breakHours = calculateHours(breakStart,breakEnd,entity);
					}
					BH.push(breakHours);
					startDatetime = breakEnd;
				}
			}
			for (let n = 0; n < BH.length; n++) {
				TBH += BH[n];
			}
			let totalBreakHours = TBH;
			let ActualWorkingHours = totalWorkingHours - totalBreakHours;
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

		let timekeepingRecordingBreakServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'timekeepingShiftModelBreakDataService',
				entityNameTranslationID: 'timekeeping.recording.recordingBreakEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/shift/break/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = timekeepingShiftModelWorkingTimeDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: { delete: true, create: 'flat' },
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					timekeepingShiftModelConstantValues.schemes.break),
					new SchedulingDataProcessTimesExtension(['BreakStart', 'BreakEnd']),
				],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = timekeepingShiftModelWorkingTimeDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Breaks', parentService: timekeepingShiftModelWorkingTimeDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(timekeepingRecordingBreakServiceOption, self);
		serviceContainer.data.Initialised = true;

		let service = serviceContainer.service;
		service.deleteEntities = function deleteEntities(items) {
			serviceContainer.data.deleteEntities(items, serviceContainer.data).then(function () {

				let workingTime = timekeepingShiftModelWorkingTimeDataService.getSelected();
				let breakData = service.getList();
				if(breakData.length>0){
					workingTime.IsBreaksAvailable = true;

					if(breakData.length===1){
						workingTime.IsOnlyOneBreak = true;
						workingTime.BreakFrom = breakData[0].BreakStart;
						workingTime.BreakTo = breakData[0].BreakEnd;
					} else {
						workingTime.IsOnlyOneBreak = false;
						workingTime.BreakFrom = null;
						workingTime.BreakTo = null;
					}
					let hours = calculateWorkingDuration(workingTime.FromTime,workingTime.ToTime,breakData,workingTime);
					if(hours<0){
						hours = hours+24;
					}if(hours>24){
						hours = hours-24;
					}
					workingTime.Duration = timekeepingRecordingRoundingDataService.roundValue(hours, 'Duration', workingTime);
					timekeepingShiftModelWorkingTimeDataService.markItemAsModified(workingTime);
					timekeepingShiftModelWorkingTimeDataService.setReadOnly(workingTime);
					timekeepingShiftModelWorkingTimeDataService.gridRefresh();
				}
				else{
					workingTime.IsBreaksAvailable = false;
					workingTime.IsOnlyOneBreak = false;
					let hours = calculateHours(workingTime.FromTime,workingTime.ToTime,workingTime);
					if(breakData.length === 0){
						workingTime.BreakFrom = null;
						workingTime.BreakTo = null;
						workingTime.BreakDuration = 0;
						workingTime.Duration = timekeepingRecordingRoundingDataService.roundValue(hours, 'Duration', workingTime);
					}
					timekeepingShiftModelWorkingTimeDataService.markItemAsModified(workingTime);
					timekeepingShiftModelWorkingTimeDataService.setReadOnly(workingTime);
					timekeepingShiftModelWorkingTimeDataService.gridRefresh();
				}
			});
		};

		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			typeName: 'ShiftBreakDto',
			moduleSubModule: 'Timekeeping.shiftmodel',
			validationService: 'timekeepingShiftModelBreakValidationService'
		}, timekeepingShiftModelConstantValues.schemes.break));
	}
})(angular);
