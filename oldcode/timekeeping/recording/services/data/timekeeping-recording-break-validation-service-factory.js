(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name timekeepingRecordingBreakValidationServiceFactory
	 * @description provides validation methods for timekeeping timeallocation break entity
	 */
	let moduleName = 'timekeeping.timeallocation';
	angular.module(moduleName).service('timekeepingRecordingBreakValidationServiceFactory', timekeepingRecordingBreakValidationServiceFactory);

	timekeepingRecordingBreakValidationServiceFactory.$inject = ['_', '$q', '$http', '$injector', '$translate', 'platformValidationServiceFactory', 'timekeepingRecordingConstantValues',
		'platformRuntimeDataService', 'platformDataValidationService', 'moment', 'timekeepingRecordingRoundingDataService','timekeepingRecordingResultDataService'];

	function timekeepingRecordingBreakValidationServiceFactory(_, $q, $http, $injector, $translate, platformValidationServiceFactory,
		timekeepingRecordingConstantValues, platformRuntimeDataService, platformDataValidationService, moment, timekeepingRecordingRoundingDataService,timekeepingRecordingResultDataService) {

		let self = this;

		self.createTimekeepingBreakValidationService = function createTimekeepingBreakValidationService(validationService, dataService) {
			validationService.asyncValidateFromTimeBreakTime = function asyncValidateFromTimeBreakTime(entity, value) {
				return self.asyncValidateFromTimeBreakTime(entity, value, dataService);
			};

			validationService.asyncValidateToTimeBreakTime = function asyncValidateToTimeBreakTime(entity, value) {
				return self.asyncValidateToTimeBreakTime(entity, value, dataService);
			};

			validationService.asyncValidateFromTimeBreakDate = function asyncValidateFromTimeBreakDate(entity, value) {
				return self.asyncValidateFromTimeBreakDate(entity, value, dataService);
			};

			validationService.asyncValidateToTimeBreakDate = function asyncValidateToTimeBreakDate(entity, value) {
				return self.asyncValidateToTimeBreakDate(entity, value, dataService);
			};

		};
		self.asyncValidateFromTimeBreakDate = function asyncValidateFromTimeBreakDate(entity, value, dataService) {
			if (entity.ToTimeBreakTime !== null && entity.FromTimeBreakTime !== null && value !== null && entity.ToTimeBreakDate !== null) {
				let hours = calculateHours(entity.FromTimeBreakTime, entity.ToTimeBreakTime, value, entity.ToTimeBreakDate);
				if (hours < 0) {
					hours = 0;
				}
				entity.Duration = timekeepingRecordingRoundingDataService.roundValue(hours, 'Duration', entity);
				entity.FromTimeBreakDate = value;
				updateReportDuration(entity, dataService);
			} else {
				if (entity.ToTimeBreakTime !== null && entity.FromTimeBreakTime !== null && value !== null && entity.ToTimeBreakDate !== null) {
					let hours = calculateHours(entity.FromTimeBreakTime, entity.ToTimeBreakTime, value, entity.ToTimeBreakDate);
					if (hours < 0) {
						hours = 0;
					}
					entity.Duration = timekeepingRecordingRoundingDataService.roundValue(hours, 'Duration', entity);
					entity.FromTimeBreakDate = value;
					updateReportDuration(entity, dataService);
				}
			}
			updateReportChangeFields(entity, 'BreakFrom');
			return $q.when(true);
		};

		self.asyncValidateToTimeBreakDate = function asyncValidateToTimeBreakDate(entity, value, dataService) {
			if (entity.FromTimeBreakTime !== null && entity.ToTimeBreakTime !== null && entity.FromTimeBreakDate !== null && value !== null) {
				let hours = calculateHours(entity.FromTimeBreakTime, entity.ToTimeBreakTime, entity.FromTimeBreakDate, value);
				if (hours < 0) {
					hours = 0;
				}
				entity.Duration = timekeepingRecordingRoundingDataService.roundValue(hours, 'Duration', entity);
				entity.ToTimeBreakDate = value;
				updateReportDuration(entity, dataService);
			} else {
				if (entity.FromTimeBreakTime !== null && entity.ToTimeBreakTime !== null && entity.FromTimeBreakDate !== null && value !== null) {
					let hours = calculateHours(entity.FromTimeBreakTime, entity.ToTimeBreakTime, entity.FromTimeBreakDate, value);
					if (hours < 0) {
						hours = 0;
					}
					entity.Duration = timekeepingRecordingRoundingDataService.roundValue(hours, 'Duration', entity);
					entity.ToTimeBreakDate = value;
					updateReportDuration(entity, dataService);
				}
			}
			updateReportChangeFields(entity, 'BreakTo');
			return $q.when(true);
		};

		self.asyncValidateFromTimeBreakTime = function asyncValidateFromTimeBreakTime(entity, value, dataService) {
			if(value!==null){
				let report = dataService.parentService().getSelected();
				if(report.FromTimePartDate!==null){
					entity.FromTimeBreakDate =report.FromTimePartDate;
				}
				if(report.ToTimePartDate!==null){
					entity.ToTimeBreakDate = report.ToTimePartDate;
				}else{
					entity.ToTimeBreakDate = report.FromTimePartDate;
				}
			}
			if (entity.ToTimeBreakTime !== null && value !== null && entity.FromTimeBreakDate !== null && entity.ToTimeBreakDate !== null) {
				let hours = calculateHours(value, entity.ToTimeBreakTime, entity.FromTimeBreakDate, entity.ToTimeBreakDate);
				if (hours < 0) {
					hours = 0;
				}
				entity.Duration = timekeepingRecordingRoundingDataService.roundValue(hours, 'Duration', entity);
				entity.FromTimeBreakTime = value;
				updateReportDuration(entity, dataService);
			} else {
				if (entity.ToTimeBreakTime !== null && value !== null && entity.FromTimeBreakDate !== null && entity.ToTimeBreakDate !== null) {
					let hours = calculateHours(value, entity.ToTimeBreakTime, entity.FromTimeBreakDate, entity.ToTimeBreakDate);

					if (hours < 0) {
						hours = 0;
					}
					entity.Duration = timekeepingRecordingRoundingDataService.roundValue(hours, 'Duration', entity);
					entity.FromTimeBreakTime = value;
					this.FromTimeBreakTime = moment(entity.FromTimeBreakTime).format('HH:mm') + ':00';
					updateReportDuration(entity, dataService);
				}
			}
			updateReportChangeFields(entity, 'BreakFrom');
			return $q.when(true);
		};

		self.asyncValidateToTimeBreakTime = function asyncValidateToTimeBreakTime(entity, value, dataService) {
			if(value!==null){
				let report = dataService.parentService().getSelected();
				if(report.FromTimePartDate!==null){
					entity.FromTimeBreakDate =report.FromTimePartDate;
				}
				if(report.ToTimePartDate!==null){
					entity.ToTimeBreakDate = report.ToTimePartDate;
				}else{
					entity.ToTimeBreakDate = report.FromTimePartDate;
				}
			}
			if (entity.FromTimeBreakTime !== null && value !== null && entity.FromTimeBreakDate !== null && entity.ToTimeBreakDate !== null) {
				let hours = calculateHours(entity.FromTimeBreakTime, value, entity.FromTimeBreakDate, entity.ToTimeBreakDate);

				if (hours < 0) {
					hours = 0;
				}
				entity.Duration = timekeepingRecordingRoundingDataService.roundValue(hours, 'Duration', entity);
				entity.ToTimeBreakTime = value;
				updateReportDuration(entity, dataService);
			} else {
				if (entity.FromTimeBreakTime !== null && value !== null && entity.FromTimeBreakDate !== null && entity.ToTimeBreakDate !== null) {
					let hours = calculateHours(entity.FromTimeBreakTime, value, entity.FromTimeBreakDate, entity.ToTimeBreakDate);
					if (hours < 0) {
						hours = 0;
					}
					entity.Duration = timekeepingRecordingRoundingDataService.roundValue(hours, 'Duration', entity);
					entity.ToTimeBreakTime = value;
					this.ToTimeBreakTime = moment(entity.ToTimeBreakTime).format('HH:mm') + ':00';

					updateReportDuration(entity, dataService);
				}
			}
			updateReportChangeFields(entity, 'BreakTo');
			return $q.when(true);
		};

		function updateReportDuration(entity, dataService) {
			let report = dataService.parentService().getSelected();
			let hours = 0;
			if (report !== null) {
				let breakData = dataService.getList();
				if (breakData.length > 0) {
					if (breakData.length === 1) {
						report.BreakFrom = entity.FromTimeBreakTime;
						report.BreakTo = entity.ToTimeBreakTime;
						report.IsModified = true;
					}
					if (report.FromTimePartTime !== null && report.ToTimePartTime !== null && report.FromTimePartDate !== null && report.ToTimePartDate !== null) {
						hours = calculateWorkingDuration(report.FromTimePartTime, report.ToTimePartTime, report.FromTimePartDate, report.ToTimePartDate, breakData, entity, dataService.parentService());
					}
					report.Duration = timekeepingRecordingRoundingDataService.roundValue(hours, 'Duration', report);
				}
				dataService.parentService().markItemAsModified(report);
				dataService.parentService().gridRefresh();

			} else {
				let dataServiceName = $injector.get('timekeepingTimeAllocationReportForEmployeeAndPeriodDataServiceFactory').createDataService();
				let newReport = dataServiceName.getSelected();
				let hours = 0;
				if (newReport !== null) {
					let breakDataService = $injector.get('timekeepingTimeAllocationBreakDataServiceFactory').createDataService();
					let breakData = breakDataService.getList();
					if (breakData.length > 0) {
						if (breakData.length === 1) {
							newReport.BreakFrom = entity.FromTimeBreakTime;
							newReport.BreakTo = entity.ToTimeBreakTime;
						}
						if (newReport.FromTimePartTime !== null && newReport.ToTimePartTime !== null && newReport.FromTimePartDate !== null && newReport.ToTimePartDate !== null) {
							hours = calculateWorkingDuration(newReport.FromTimePartTime, newReport.ToTimePartTime, newReport.FromTimePartDate, newReport.ToTimePartDate, breakData, entity);
						}
						newReport.Duration = timekeepingRecordingRoundingDataService.roundValue(hours, 'Duration', newReport);
					}
					dataServiceName.markItemAsModified(newReport);
					dataServiceName.gridRefresh();
				}
			}

			if(entity.ReportFk>0){
				return $http.get(globals.webApiBaseUrl + 'timekeeping/recording/result/listbyreport?reportId='+ entity.ReportFk).then(function (result) {
					if (result.data) {
						let resultData = result.data;
						let myitem = timekeepingRecordingResultDataService.getItemById(resultData.Id);
						let breakData = dataService.getList();
						myitem.Hours = calculateDurationWithBreaks(myitem.FromTime,myitem.ToTime,breakData,entity);
						timekeepingRecordingResultDataService.markItemAsModified(myitem);
						timekeepingRecordingResultDataService.gridRefresh();
					}
				});
			}
		}

		function calculateDurationWithBreaks(fromTime, toTime, newBreaks, entity) {
			function parseTime(timeStr) {
				if (!timeStr) return null;
				const date = moment(timeStr);
				return date.isValid() ? date : null;
			}

			function getMinutesDifference(start, end) {
				return end.diff(start, 'minutes');
			}
			const startTime = parseTime(fromTime);
			const endTime = parseTime(toTime);

			if (!startTime || !endTime || endTime.isSameOrBefore(startTime)) {
				return 0; // Return 0 if invalid or inverted times
			}

			let totalDuration = getMinutesDifference(startTime, endTime);
			let breaks = [];

			newBreaks.forEach(item => {
				let breakStart, breakEnd;
				if (item.Id === entity.Id && (
					moment.utc(item.BreakStart).format('HH:mm') + ':00' !== moment(entity.FromTimeBreakTime).format('HH:mm') + ':00' ||
					moment.utc(item.BreakStart).format('YYYY-MM-DD') !== moment(entity.FromTimeBreakDate).format('YYYY-MM-DD') ||
					moment.utc(item.BreakEnd).format('HH:mm') + ':00' !== moment(entity.ToTimeBreakTime).format('HH:mm') + ':00' ||
					moment.utc(item.BreakEnd).format('YYYY-MM-DD') !== moment(entity.ToTimeBreakDate).format('YYYY-MM-DD')
				)) {
					breakStart = moment(entity.FromTimeBreakDate + ' ' + entity.FromTimeBreakTime, 'YYYY-MM-DD HH:mm');
					breakEnd = moment(entity.ToTimeBreakDate + ' ' + entity.ToTimeBreakTime, 'YYYY-MM-DD HH:mm');
				} else {
					breakStart = moment(item.FromTimeBreakDate + ' ' + item.FromTimeBreakTime, 'YYYY-MM-DD HH:mm');
					breakEnd = moment(item.ToTimeBreakDate + ' ' + item.ToTimeBreakTime, 'YYYY-MM-DD HH:mm');
				}

				// Trim breaks to fit within the working period
				if (breakEnd.isAfter(startTime) && breakStart.isBefore(endTime)) {
					breaks.push([
						moment.max(breakStart, startTime),
						moment.min(breakEnd, endTime)
					]);
				}
			});

			const mergedBreaks = mergeBreaks(breaks);

			let totalBreakMinutes = 0;
			mergedBreaks.forEach(interval => {
				if (interval && interval[0] && interval[1]) {
					totalBreakMinutes += getMinutesDifference(interval[0], interval[1]);
				}
			});

			const finalDuration = (totalDuration - totalBreakMinutes) / 60;
			return finalDuration;
		}

		function calculateWorkingDuration(starttime, endtime, fromDateStart, toDateEnd, newBreaks, entity, parentService) {
			let fromTimeString = moment(starttime).format('HH:mm') + ':00';
			let toTimeString = moment(endtime).format('HH:mm') + ':00';
			let fromDateString = moment(fromDateStart).format('YYYY-MM-DD');
			let toDateString = moment(toDateEnd).format('YYYY-MM-DD');
			let nstartDatetime = new Date(fromDateString + ' ' + fromTimeString);
			let nendDatetime = new Date(toDateString + ' ' + toTimeString);
			let report = parentService.getSelected();

			let startDatetime = moment(nstartDatetime).format('YYYY-MM-DD HH:mm');
			let endDatetime = moment(nendDatetime).format('YYYY-MM-DD HH:mm');

			// Prepare breaks
			let breaks = [];
			newBreaks.forEach(item => {
				let breakStart, breakEnd;

				breakStart = new Date(moment(item.FromTimeBreakDate).format('YYYY-MM-DD') + ' ' + moment(item.FromTimeBreakTime).format('HH:mm') + ':00');
				breakEnd = new Date(moment(item.ToTimeBreakDate).format('YYYY-MM-DD') + ' ' + moment(item.ToTimeBreakTime).format('HH:mm') + ':00');

				// Trim breaks to fit within working hours
				if (breakStart < nstartDatetime) breakStart = nstartDatetime;
				if (breakEnd > nendDatetime) breakEnd = nendDatetime;

				if (breakStart < breakEnd) {
					breaks.push([breakStart, breakEnd]);
				}
			});

			// Merge overlapping breaks
			const mergedBreaks = mergeBreaks(breaks);

			// Calculate total break hours
			let totalBreakHours = 0;
			if(mergedBreaks.length>0){
				mergedBreaks.forEach(interval => {
					totalBreakHours += (interval.end - interval.start) / (1000 * 60 * 60); // Convert ms to hours
				});
			}
			// Calculate total working hours
			const totalWorkingHours = (new Date(endDatetime) - new Date(startDatetime)) / (1000 * 60 * 60); // Convert ms to hours
			let ActualWorkingHours = totalWorkingHours - totalBreakHours;

			// Ensure non-negative values
			if (totalBreakHours < 0) totalBreakHours = 0;
			if (ActualWorkingHours < 0) ActualWorkingHours = 0;

			// Update report
			report.BreakDuration = totalBreakHours;
			parentService.markItemAsModified(report);
			parentService.gridRefresh();

			return ActualWorkingHours;
		}

		function mergeBreaks(breaks) {
			if (!breaks || breaks.length === 0) {
				return [];
			}
			const intervals = breaks.map(([start, end]) => ({
				start: new Date(start).getTime(),
				end: new Date(end).getTime(),
			}));
			intervals.sort((a, b) => a.start - b.start);

			const merged = [];
			let current = intervals[0];

			for (let i = 1; i < intervals.length; i++) {
				if (current.end >= intervals[i].start) {
					current.end = Math.max(current.end, intervals[i].end);
				} else {
					merged.push(current);
					current = intervals[i];
				}
			}
			merged.push(current);
			return merged;
		}


		function calculateHours(FromTime, ToTime, FromDate, ToDate) {
			let fromTimeString = moment(FromTime).format('HH:mm') + ':00';
			let toTimeString = moment(ToTime).format('HH:mm') + ':00';
				let fromDateString = moment(FromDate).format('YYYY-MM-DD');
				let toDateString = moment(ToDate).format('YYYY-MM-DD');
				let dt1 = new Date(fromDateString + ' ' + fromTimeString);
				let dt2 = new Date(toDateString + ' ' + toTimeString);
				return hoursDiff(dt1, dt2);
		}

		function hoursDiff(dt1, dt2) {
			let diffTime = (dt2.getTime() - dt1.getTime());
			return diffTime / (1000 * 3600);
		}

		function updateReportChangeFields(entity, fieldName) {
			entity.BreakChangeField = entity.BreakChangeField || [];
			if (!entity.BreakChangeField.includes(fieldName)) {
				entity.BreakChangeField.push(fieldName);
			}
		}
	}
})(angular);
