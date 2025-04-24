/**
 * Created by Sudarshan on 10.07.2023
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name timekeepingShiftModelBreakValidationServiceFactory
	 * @description provides validation methods for timekeeping timeallocation break entity
	 */
	let moduleName = 'timekeeping.timeallocation';
	angular.module(moduleName).service('timekeepingShiftModelBreakValidationServiceFactory', TimekeepingShiftModelBreakValidationServiceFactory);

	TimekeepingShiftModelBreakValidationServiceFactory.$inject = ['_', '$q', '$http','$injector','$translate','platformValidationServiceFactory', 'timekeepingShiftModelConstantValues',
		'timekeepingShiftModelWorkingTimeDataService', 'platformRuntimeDataService','platformDataValidationService', 'moment', 'timekeepingRecordingRoundingDataService','timekeepingShiftModelBreakDataService'];

	function TimekeepingShiftModelBreakValidationServiceFactory(_, $q, $http,$injector,$translate,platformValidationServiceFactory,
		timekeepingShiftModelConstantValues, timekeepingShiftModelWorkingTimeDataService, platformRuntimeDataService,platformDataValidationService, moment, timekeepingRecordingRoundingDataService,timekeepingShiftModelBreakDataService) {

		let self = this;

		self.createTimekeepingShiftBreakValidationService = function createTimekeepingShiftBreakValidationService(validationService, dataService) {

			validationService.validateBreakStart = function validateBreakStart(entity, value) {
				return self.validateBreakStart(entity, value);
			};

			validationService.validateBreakEnd = function validateBreakEnd(entity, value) {
				return self.validateBreakEnd(entity, value);
			};
		};
		self.validateBreakStart = function validateBreakStart(entity, value) {
			if (entity.BreakEnd !== null && entity.BreakEnd!=='00:00:00' && value !== null  /*  && entity.FromTimeBreakDate!==null && entity.ToTimeBreakDate!==null */ ) {
				let hours = calculateHours(value,entity.BreakEnd,entity);
				if(hours<0){
					hours=0;
				}
				entity.Duration = timekeepingRecordingRoundingDataService.roundValue(hours, 'Duration', entity);
				entity.BreakStart=value;
				updateDuration(entity);
			} else {
				if (entity.BreakEnd !== null && entity.BreakEnd!=='00:00:00' && value !== null /* && entity.FromTimeBreakDate!==null && entity.ToTimeBreakDate!==null */ ) {
					let hours = calculateHours(value,entity.BreakEnd,entity);
					if(hours<0){
						hours=0;
					}
					entity.Duration = timekeepingRecordingRoundingDataService.roundValue(hours, 'Duration', entity);
					entity.BreakStart=value;
					updateDuration(entity);
				}
			}
		};

		self.validateBreakEnd = function validateBreakEnd(entity, value) {
			if (entity.BreakStart !== null && entity.BreakStart!=='00:00:00' && value !== null /* && entity.FromTimeBreakDate!==null && entity.ToTimeBreakDate!==null */) {
				let hours = calculateHours(entity.BreakStart,value,entity);
				if(hours<0){
					hours=0;
				}
				entity.Duration = timekeepingRecordingRoundingDataService.roundValue(hours, 'Duration', entity);
				entity.BreakEnd=value;
				updateDuration(entity);
			} else {
				if (entity.BreakStart !== null && entity.BreakStart!=='00:00:00' && value !== null /* && entity.FromTimeBreakDate!==null && entity.ToTimeBreakDate!==null */ ) {
					let hours = calculateHours(entity.BreakStart,value,entity);
					if(hours<0){
						hours=0;
					}
					entity.Duration = timekeepingRecordingRoundingDataService.roundValue(hours, 'Duration', entity);
					entity.BreakEnd=value;
					updateDuration(entity);
				}
			}
		};


		function updateDuration(entity){
			let workingTime = timekeepingShiftModelWorkingTimeDataService.getSelected();
			let breakData = timekeepingShiftModelBreakDataService.getList();

			if(breakData.length>0){
				workingTime.IsBreaksAvailable = true;
				if(breakData.length===1){
					workingTime.IsOnlyOneBreak = true;
					workingTime.BreakFrom = entity.BreakStart;
					workingTime.BreakTo = entity.BreakEnd;
				} else {
					workingTime.IsOnlyOneBreak = false;
					workingTime.BreakFrom = null;
					workingTime.BreakTo = null;
				}
				let hours = calculateWorkingDuration(workingTime.FromTime,workingTime.ToTime,breakData,entity);
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
		}

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
						 //breakstartDatetime = moment(item.BreakStart).clone().add(1, 'days').format('YYYY-MM-DD HH:mm');
						// breakendDatetime = moment(item.BreakEnd).clone().add(1, 'days').format('YYYY-MM-DD HH:mm');
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
						//breakstartDatetime = moment(item.BreakStart).clone().add(1, 'days').format('YYYY-MM-DD HH:mm');
						//breakendDatetime = moment(item.BreakEnd).clone().add(1, 'days').format('YYYY-MM-DD HH:mm');
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
	}
})(angular);
