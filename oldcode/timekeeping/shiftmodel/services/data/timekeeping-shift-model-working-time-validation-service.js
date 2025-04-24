/**
 * Created by baf on 06.06.2019
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.shiftmodel';

	/**
	 * @ngdoc service
	 * @name timekeepingShiftModelWorkingTimeValidationService
	 * @description provides validation methods for timekeeping shiftModel workingTime entities
	 */
	angular.module(moduleName).service('timekeepingShiftModelWorkingTimeValidationService', TimekeepingShiftModelWorkingTimeValidationService);

	TimekeepingShiftModelWorkingTimeValidationService.$inject = ['platformValidationServiceFactory', 'timekeepingShiftModelConstantValues', 'timekeepingShiftModelWorkingTimeDataService'];

	function TimekeepingShiftModelWorkingTimeValidationService(platformValidationServiceFactory, timekeepingShiftModelConstantValues, timekeepingShiftModelWorkingTimeDataService) {

		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingShiftModelConstantValues.schemes.workingTime, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingShiftModelConstantValues.schemes.workingTime),

			periods: [{from: 'From', to: 'To'}]
		},
		self,
		timekeepingShiftModelWorkingTimeDataService);

		function calculateHours(FromTime,ToTime){
			let toDateString=null;
			if(FromTime >ToTime){
				let fromDate = moment();
				let toDate = fromDate.clone().add(1, 'days');
				toDateString = toDate.format('YYYY-MM-DD');

			}else{
				toDateString = moment(new Date()).format('YYYY-MM-DD');
			}

			let fromTimeString = moment(FromTime).format('HH:mm')+':00';
			let toTimeString = moment(ToTime).format('HH:mm')+':00';
			let fromDateString = moment().format('YYYY-MM-DD');
			//let toDateString = moment().format('YYYY-MM-DD');
			let dt1 = new Date(fromDateString + ' ' + fromTimeString);
			let dt2 = new Date(toDateString + ' ' + toTimeString);
			return hoursDiff(dt1,dt2);
		}
		function hoursDiff(dt1, dt2){
			let diffTime =(dt2.getTime() - dt1.getTime());
			let hoursDiff = diffTime / (1000 * 3600);
			return hoursDiff;
		}

		this.validateFromTime = function validateFromTime(entity, value) {
			if (entity.ToTime !== null && value !== null && entity.BreakFrom !== null && entity.BreakTo !== null) {
				let hours = calculateHours(value,entity.ToTime);
				if(entity.BreakFrom !== null && entity.BreakTo !== null){
					let breakHours = calculateHours(entity.BreakFrom,entity.BreakTo);
					if(checkIsBreakInShift(value,entity.ToTime,entity.BreakFrom,entity.BreakTo)){
						hours = hours-breakHours;
					}
				}
				if(checkIsShiftInBreak(value,entity.ToTime,entity.BreakFrom,entity.BreakTo)){
					hours=0;
				}
				if(hours<0){
					hours=0;
				}
				if(hours>24){
					hours = hours-24;
				}
				entity.Duration = hours;
			} else {
				if (entity.ToTime !== null && value !== null) {
					let hours = calculateHours(value,entity.ToTime);
					if(entity.BreakFrom !== null && entity.BreakTo !== null){
						let breakHours = calculateHours(entity.BreakFrom,entity.BreakTo);
						if(checkIsBreakInShift(value,entity.ToTime,entity.BreakFrom,entity.BreakTo)){
							hours = hours-breakHours;
						}
					}
					if(checkIsShiftInBreak(value,entity.ToTime,entity.BreakFrom,entity.BreakTo)){
						hours=0;
					}
					if(hours<0){
						hours=0;
					}
					if(hours>24){
						hours = hours-24;
					}
					entity.Duration = hours;
				}
			}
		};

		this.validateToTime = function validateToTime(entity, value) {
			if (entity.FromTime !== null && value !== null && entity.BreakFrom !== null && entity.BreakTo !== null) {
				let hours = calculateHours(entity.FromTime,value);
				if(entity.BreakFrom !== null && entity.BreakTo !== null){
					let breakHours = calculateHours(entity.BreakFrom,entity.BreakTo);
					if(checkIsBreakInShift(entity.FromTime,value,entity.BreakFrom,entity.BreakTo)){
						hours = hours-breakHours;
					}
				}
				if(checkIsShiftInBreak(entity.FromTime,value,entity.BreakFrom,entity.BreakTo)){
					hours=0;
				}
				if(hours<0){
					hours=0;
				}
				if(hours>24){
					hours = hours-24;
				}
				entity.Duration = hours;

			} else {
				if (entity.FromTime !== null && value !== null) {
					let hours = calculateHours(entity.FromTime,value);
					if(entity.BreakFrom !== null && entity.BreakTo !== null){
						let breakHours = calculateHours(entity.BreakFrom,entity.BreakTo);
						if(checkIsBreakInShift(entity.FromTime,value,entity.BreakFrom,entity.BreakTo)){
							hours = hours-breakHours;
						}
					}
					if(checkIsShiftInBreak(entity.FromTime,value,entity.BreakFrom,entity.BreakTo)){
						hours=0;
					}
					if(hours<0){
						hours=0;
					}
					if(hours>24){
						hours = hours-24;
					}
					entity.Duration = hours;

				}
			}
		};
		this.validateBreakFrom = function validateBreakFrom(entity, value) {
			if (entity.FromTime !== null && entity.ToTime && value !== null && entity.BreakTo!==null) {
				let hours = calculateHours(entity.FromTime,entity.ToTime);
				if(value !== null && entity.BreakTo !== null){
					let breakHours = calculateHours(value,entity.BreakTo);
					if(checkIsBreakInShift(entity.FromTime,entity.ToTime,value,entity.BreakTo)){
						hours = hours-breakHours;
					}
				}
				if(checkIsShiftInBreak(entity.FromTime,entity.ToTime,value,entity.BreakTo)){
					hours=0;
				}
				if(hours<0){
					hours=0;
				}
				if(hours>24){
					hours = hours-24;
				}
				entity.Duration = hours;
			}
		};
		this.validateBreakTo = function validateTo(entity, value /* ,model */) {
			if (entity.FromTime !== null && entity.ToTime && value !== null && entity.BreakFrom!==null) {
				let hours = calculateHours(entity.FromTime,entity.ToTime);
				if(value !== null && entity.BreakFrom !== null){
					let breakHours = calculateHours(entity.BreakFrom,value);
					if(checkIsBreakInShift(entity.FromTime,entity.ToTime,entity.BreakFrom,value)){
						hours = hours-breakHours;
					}
				}
				if(checkIsShiftInBreak(entity.FromTime,entity.ToTime,entity.BreakFrom,value)){
					hours=0;
				}
				if(hours<0){
					hours=0;
				}
				if(hours>24){
					hours = hours-24;
				}
				entity.Duration = hours;
			}
		};

		function checkIsShiftInBreak(from,to,breakFrom,breakTo){
			let fromTime = moment(from).format('H');
			let toTime = moment(to).format('H');
			if(parseInt(fromTime) > parseInt(toTime)) {
				let breakInMilliseconds = breakTo - breakFrom;
				let breakHours = breakInMilliseconds / (1000*60*60);
				let shiftInMilliseconds = to - from;
				let shiftHours = shiftInMilliseconds / (1000*60*60);
				if(shiftHours<0){
					shiftHours = shiftHours+24;
				}
				if(breakHours<0){
					breakHours = breakHours+24;
				}
				if(breakHours>shiftHours){
					return true;
				}else{
					return false;
				}
			}
			else{
				if(from>= breakFrom && to<=breakTo) {
					return true;
				} else {
					return false;
				}
			}
		}

		function checkIsBreakInShift(from,To,BreakFrom,BreakTo){
			if(from<=BreakFrom && To>BreakFrom && To>=BreakTo){
				return true;
			}
			else{
				return false;
			}
		}
	}
})(angular);
