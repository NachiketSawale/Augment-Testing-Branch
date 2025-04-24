(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name timekeepingRecordingReportValidationServiceFactory
	 * @description provides validation methods for timekeeping timeallocation report entity
	 */
	let moduleName = 'timekeeping.timeallocation';
	angular.module(moduleName).service('timekeepingRecordingReportValidationServiceFactory', timekeepingRecordingReportValidationServiceFactory);

	timekeepingRecordingReportValidationServiceFactory.$inject = ['_', '$q', '$http', '$injector', '$translate', 'platformValidationServiceFactory', 'timekeepingRecordingConstantValues',
		'timekeepingRecordingReportDataService', 'platformRuntimeDataService', 'platformDataValidationService', 'moment', 'timekeepingRecordingRoundingDataService', 'timekeepingRecordingBreakDataService'];

	function timekeepingRecordingReportValidationServiceFactory(_, $q, $http, $injector, $translate, platformValidationServiceFactory,
		timekeepingRecordingConstantValues, timekeepingRecordingReportDataService, platformRuntimeDataService, platformDataValidationService, moment, timekeepingRecordingRoundingDataService, timekeepingRecordingBreakDataService) {

		let self = this;

		self.createTimekeepingReportValidationService = function createTimekeepingReportValidationService(validationService, dataService) {

			validationService.asyncValidateProjectActionFk = function asyncValidateProjectActionFk(entity, value, model) {
				return self.asyncValidateProjectActionFk(entity, value, model, validationService, dataService);
			};

			validationService.asyncValidateFromTimePartTime = function asyncValidateFromTimePartTime(entity, value, model) {
				return self.asyncValidateFromTimePartTime(entity, value, model, validationService, dataService);
			};

			validationService.asyncValidateToTimePartTime = function asyncValidateToTimePartTime(entity, value, model) {
				return self.asyncValidateToTimePartTime(entity, value, model, validationService, dataService);
			};

			validationService.asyncValidateFromTimePartDate = function asyncValidateFromTimePartDate(entity, value, model) {
				return self.asyncValidateFromTimePartDate(entity, value, model, validationService, dataService);
			};

			validationService.asyncValidateToTimePartDate = function asyncValidateToTimePartDate(entity, value, model) {
				return self.asyncValidateToTimePartDate(entity, value, model, validationService, dataService);
			};

			validationService.asyncValidateBreakFrom = function asyncValidateBreakFrom(entity, value, model) {
				return self.asyncValidateBreakFrom(entity, value, model, validationService, dataService);
			};

			validationService.asyncValidateBreakTo = function asyncValidateBreakTo(entity, value, model) {
				return self.asyncValidateBreakTo(entity, value, model, validationService, dataService);
			};

			validationService.validateFromTimePartTime = function validateFromTimePartTime(entity, value) {
				return self.validateFromTimePartTime(entity, value, dataService);
			};

			validationService.validateToTimePartTime = function validateToTimePartTime(entity, value) {
				return self.validateToTimePartTime(entity, value, dataService);
			};

			validationService.validateBreakFrom = function validateBreakFrom(entity, value) {
				return self.validateBreakFrom(entity, value, dataService);
			};

			validationService.validateFromTimePartDate = function validateFromTimePartDate(entity, value) {
				return self.validateFromTimePartDate(entity, value, dataService);
			};

			validationService.validateToTimePartDate = function validateToTimePartDate(entity, value) {
				return self.validateToTimePartDate(entity, value, dataService);
			};

			validationService.validateBreakTo = function validateBreakTo(entity, value) {
				return self.validateBreakTo(entity, value, dataService);
			};

			validationService.validateTimeSymbolFk = function validateTimeSymbolFk(entity, value, model) {
				return self.validateTimeSymbolFk(entity, value, model, validationService, dataService);
			};
			validationService.validateDueDate = function validateDueDate(entity, value, model) {
				return self.validateDueDate(entity, value, model, validationService, dataService);
			};
			validationService.asyncValidateDueDate = function asyncValidateDueDate(entity, value, model) {
				return self.asyncValidateDueDate(entity, value, model, validationService, dataService);
			};

			validationService.asyncValidateJobFk = function asyncValidateJobfk(entity, value, model) {
				return self.asyncValidateValidateJobFk(entity, value, model, validationService, dataService);
			};

			validationService.asyncValidateProjectFk = function asyncValidateProjectFk(entity, value, model) {
				return self.asyncValidateProjectFk(entity, value, model, validationService, dataService);
			};

			validationService.asyncValidateControllingUnitFk = function asyncValidateControllingUnitFk(entity, value, model) {
				return self.asyncValidateControllingUnitFk(entity, value, model, validationService, dataService);
			};

			validationService.asyncValidateTimeSymbolFk = function asyncValidateTimeSymbolFk(entity, value, model) {
				return self.asyncValidateTimeSymbolFk(entity, value, model, validationService, dataService);
			};

			validationService.validateTimeSymbolFkForBulkConfig = function validateTimeSymbolFkForBulkConfig(entity, value, model) {
				return self.validateTimeSymbolFkForBulkConfig(entity, value, model, validationService, dataService);
			};

			validationService.asyncValidateTimeSymbolFkForBulkConfig = function asyncValidateTimeSymbolFkForBulkConfig(entity, value, model) {
				return self.asyncValidateTimeSymbolFkForBulkConfig(entity, value, model, validationService, dataService);
			};

		};

		self.asyncValidateTimeSymbolFk = function asyncValidateTimeSymbolFk(entity, value, model, validationService, dataService) {
			if (value === null) {
				removeMandatory(entity, 'ControllingUnitFk', validationService, dataService);
				return $q.when(true);
			}
			let postData = {PKey2: value};
			return $http.post(globals.webApiBaseUrl + 'timekeeping/timesymbols/listbysymbol', postData).then(function (result) {
				if (result.data) {
					let isMandatory = result.data[0].IsCUMandatory;
					if (isMandatory) {
						if (entity.ControllingUnitFk > 0) {
							return removeMandatory(entity, 'ControllingUnitFk', validationService, dataService);
						} else {
							return addMandatory(entity, 'ControllingUnitFk', validationService, dataService);
						}
					} else {
						return removeMandatory(entity, 'ControllingUnitFk', validationService, dataService);
					}
				} else {
					return removeMandatory(entity, 'ControllingUnitFk', validationService, dataService);
				}
			});

		};

		self.validateTimeSymbolFkForBulkConfig = function valiudateTimeSymbolFkForBulkConfig(entity, value, model, validationService, dataService) {
			let result = {apply: true, valid: true};
			return platformDataValidationService.finishValidation(result, entity, true, model, validationService, dataService);
		};

		self.asyncValidateTimeSymbolFkForBulkConfig = function asyncValidateTimeSymbolFkForBulkConfig(entity, value, model, validationService, dataService) {
			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, 'TimeSymbolFk', dataService);
			let result = {apply: true, valid: true, error: ''};
			let report = _.cloneDeep(entity);
			let Processor = $injector.get('SchedulingDataProcessTimesExtension');
			let dateProcessor = new Processor(['BreakFrom', 'BreakTo', 'FromTimePartTime', 'ToTimePartTime']);
			dateProcessor.revertProcessItem(report);

			asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'timekeeping/recording/report/validateforbulk', report).then(function (response) {
				result.valid = response.data;
				if (response.data) {
					self.validateTimeSymbolFk(entity, value, 'TimeSymbolFk', validationService, dataService);
				} else {
					result.error = 'Selected TimeSymbol is not available for this report or TimeSymbol needs a Controlling Unit';
				}
				return platformDataValidationService.finishAsyncValidation(result, entity, value, 'TimeSymbolFk', asyncMarker, validationService, dataService);
			});
			return asyncMarker.myPromise;
		};

		self.asyncValidateControllingUnitFk = function asyncValidateControllingUnitFk(entity, value, model, validationService, dataService) {
			if (!_.isNil(value)) {
				let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
				asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'controlling/structure/getcontrollingunit?Id=' + value).then(function (result) {
					entity.ProjectFk = result.data.ProjectFk;
					removeMandatory(entity, 'TimeSymbolFk', validationService, dataService);
					return platformDataValidationService.finishAsyncValidation({
						valid: true,
						error: '',
						apply: true,
						invalidFields: [model]
					}, entity, value, model, asyncMarker, validationService, dataService);
				});
				return asyncMarker.myPromise;
			} else {
				if (entity.TimeSymbolFk > 0) {
					let postData = {PKey2: entity.TimeSymbolFk};
					return $http.post(globals.webApiBaseUrl + 'timekeeping/timesymbols/listbysymbol', postData).then(function (result) {
						if (result.data) {
							let isMandatory = result.data[0].IsCUMandatory;
							if (isMandatory) {
								if (value > 0) {
									return removeMandatory(entity, 'ControllingUnitFk', validationService, dataService);
								} else {
									return addMandatory(entity, 'ControllingUnitFk', validationService, dataService);
								}
							} else {
								return removeMandatory(entity, 'ControllingUnitFk', validationService, dataService);
							}
						} else {
							return removeMandatory(entity, 'ControllingUnitFk', validationService, dataService);
						}
					});
				} else {
					return $q.when(true);
				}
			}
		};

		self.validateDueDate = function validateDueDate(entity, value) {
			// Requested
			if (entity.FromTimePartDate === null || entity.ToTimePartDate === null) return;
			let first = value.startOf('day');
			let second = entity.DueDate.startOf('day');
			let daydif = moment.duration(first.diff(second)).asDays();
			entity.FromTimePartDate = moment.utc(entity.FromTimePartDate).add(daydif, 'd').toISOString();
			entity.ToTimePartDate = moment.utc(entity.ToTimePartDate).add(daydif, 'd').toISOString();

		};

		self.asyncValidateDueDate = function asyncValidateDueDate(entity, value, model, validationService, dataService) {
			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
			let data = {
				dueDate: value,
				recordingId: entity.RecordingFk
			};
			asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'timekeeping/recording/report/validatebookingdate', data).then(function (response) {
				if (response.data) {
					return platformDataValidationService.finishAsyncValidation({
						valid: response.data.IsValid,
						error: 'The booking date is outside of the selected period',
						apply: true,
						invalidFields: [model]
					}, entity, value, model, asyncMarker, validationService, dataService);
				}
			});
			return asyncMarker.myPromise;
		};

		self.asyncValidateProjectActionFk = function asyncValidateProjectActionFk(entity, value, model, validationService, dataService) {
			if (!_.isNil(value)) {
				return $http.post(globals.webApiBaseUrl + 'project/main/action/getbyid', {Id: value}).then(function (result) {
					entity.ControllingUnitFk = result.data.ControllingUnitFk;
					entity.ProjectFk = result.data.ProjectFk;
					entity.JobFk = result.data.LogisticJobFk;
					setReadonlyDrivenByProjectActionFk(entity, value);
					if(entity.ControllingUnitFk !== null){
						platformDataValidationService.ensureNoRelatedError(entity, model, ['ControllingUnitFk'], self, dataService);
					}
					return true;
				});
			} else {
				entity.ProjectFk = null;
				setReadonlyDrivenByProjectActionFk(entity, value);
				return $q.resolve(true);
			}
		};

		function setReadonlyDrivenByProjectActionFk(entity, value) {
			let readonly = !_.isNil(value);
			platformRuntimeDataService.readonly(entity, [
				{field: 'ControllingUnitFk', readonly: readonly},
				{field: 'ProjectFk', readonly: readonly},
				{field: 'JobFk', readonly: readonly}
			]);
		}

		self.asyncValidateProjectFk = function asyncValidateProjectFk(entity, value) {
			if (entity.ProjectFk !== value || value === null) {
				entity.JobFk = null;
				return $q.resolve(true);
			} else {
				return $q.resolve(true);
			}
		};
		self.asyncValidateValidateJobFk = function asyncValidateJobFk(entity, value /* , model */) {
			if (!_.isNil(value)) {
				return $http.get(globals.webApiBaseUrl + 'logistic/job/getbyid?jobId=' + value).then(function (result) {
					entity.ProjectFk = result.data.ProjectFk;
					setReadonlyDrivenByJobFk(entity, value);
					return true;
				});
			} else {
				entity.ProjectFk = null;
				setReadonlyDrivenByJobFk(entity, value);
				return $q.resolve(true);
			}
		};

		function setReadonlyDrivenByJobFk(entity, value) {
			let readonly = !_.isNil(value);
			platformRuntimeDataService.readonly(entity, [
				{field: 'ProjectFk', readonly: readonly}
			]);
		}

		this.validateTimeSymbolFk = function valiudateTimeSymbolFk(entity, value, model, validationService, dataService) {
			let result = {apply: true, valid: true};
			if (value !== null) {
				$http.get(globals.webApiBaseUrl + 'timekeeping/timesymbols/getTimeSymbolGroup?timesymbolid=' + value).then(function (response) {
					if (response.data) {
						entity.TimeSymbolGroupFk = response.data[0];
					}
				});
			}
			return platformDataValidationService.finishValidation(result, entity, true, model, validationService, dataService);
		};

		function removeMandatory(entity, model, validationService, dataService) {

			let result = {apply: true, valid: false};
			result.apply = true;
			result.valid = true;
			platformRuntimeDataService.applyValidationResult(result, entity, model);
			platformDataValidationService.finishValidation(result, entity, true, model, validationService, dataService);
			return result;
		}

		function addMandatory(entity, model, validationService, dataService) {
			let result = {apply: true, valid: false};
			result.apply = true;
			result.valid = false;
			result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
			platformRuntimeDataService.applyValidationResult(result, entity, model);
			platformDataValidationService.finishValidation(result, entity, false, model, validationService, dataService);
			return result;
		}

		function calculateHours(FromTime, ToTime, FromDate, ToDate) {
			let fromTimeString = moment.utc(FromTime).toISOString();
			let toTimeString = moment.utc(ToTime).toISOString();
			let fromDateString = moment.utc(FromDate).toISOString();
			let toDateString = moment.utc(ToDate).toISOString();
			let dt1 = new Date(fromDateString + ' ' + fromTimeString);
			let dt2 = new Date(toDateString + ' ' + toTimeString);
			return hoursDiff(dt1, dt2);
		}

		function calculateBreakHours(FromTime, ToTime, FromDate, ToDate, breakFrom, breakTo) {
			if (checkIsBreakOutsideShift(FromTime, ToTime, FromDate, ToDate, breakFrom, breakTo)) {
				return 0;
			} else {
				if (checkInTimeWithinBreak(FromTime, breakFrom, breakTo)) {
					breakFrom = FromTime;
				} else if (checkOutTimeWithinBreak(ToTime, breakFrom, breakTo)) {
					breakTo = ToTime;
				}
				let fromTimeString = moment.utc(breakFrom).toISOString();
				let toTimeString = moment.utc(breakTo).toISOString();
				let fromDateString = moment.utc(FromDate).toISOString();
				let toDateString = moment.utc(ToDate).toISOString();
				let dt1 = new Date(fromDateString + ' ' + fromTimeString);
				let dt2 = new Date(toDateString + ' ' + toTimeString);

				return hoursDiff(dt1, dt2);
			}

		}

		self.asyncValidateFromTimePartDate = function asyncValidateFromTimePartDate(entity, value) {
			if (value !== null && entity.FromTimePartTime !== null) {
				const dateString = value.format('YYYY-MM-DD');
				const timeString = entity.FromTimePartTime.format('HH:mm:ss');
				const datetimeString = `${dateString} ${timeString}`;
				entity.From = moment(datetimeString, 'YYYY-MM-DD HH:mm:ss');
			} else {
				if (value !== null && entity.FromTimePartTime === null) {
					const dateString = value.format('YYYY-MM-DD');
					const timeString = '00:00:00';
					const datetimeString = `${dateString} ${timeString}`;
					entity.From = moment(datetimeString, 'YYYY-MM-DD HH:mm:ss');
				}
				if (value === null) {
					entity.From = null;
					entity.FromTimePartTime = null;
				}
			}
			if (entity.FromTimePartTime===null && entity.ToTimePartTime === null) {
				entity.Duration = 0;
			}
			return $q.when(true);
		};

		self.validateFromTimePartDate = function validateFromTimePartDate(entity, value, dataService, fieldsOrModel) {
			if (entity.ToTimePartTime !== null && entity.FromTimePartTime !== null && value !== null && entity.ToTimePartDate !== null) {
				let breakData = timekeepingRecordingBreakDataService.getList();
				if (breakData.length > 0) {
					if (breakData.length === 1) {
						entity.breakFrom = breakData[0].breakFrom;
						entity.breakTo = breakData[0].breakTo;
					}
					let hours = calculateWorkingDuration(entity.FromTimePartTime, entity.ToTimePartTime, value, entity.ToTimePartDate, breakData, dataService);
					entity.Duration = timekeepingRecordingRoundingDataService.roundValue(hours, 'Duration', entity);
					adjustFromTimeReportedHours(entity,value);
				} else {
					adjustFromTimeReportedHours(entity,value);
					entity.FromTimePartDate =value;
					recalculateDuration(entity);

				}

			} else {
				if (entity.ToTimePartTime !== null && entity.FromTimePartTime !== null && value !== null && entity.ToTimePartDate !== null) {
					let breakData = timekeepingRecordingBreakDataService.getList();
					if (breakData.length > 0) {
						if (breakData.length === 1) {
							entity.breakFrom = breakData[0].breakFrom;
							entity.breakTo = breakData[0].breakTo;
						}
						let hours = calculateWorkingDuration(entity.FromTimePartTime, entity.ToTimePartTime, value, entity.ToTimePartDate, breakData, dataService);
						entity.Duration = timekeepingRecordingRoundingDataService.roundValue(hours, 'Duration', entity);
						adjustFromTimeReportedHours(entity,value);
					} else {
						adjustFromTimeReportedHours(entity,value);
						entity.FromTimePartDate =value;
						recalculateDuration(entity);
					}
				}

			}
			updateReportChangeFields(entity, 'FromTimePartDate');
		};

		self.asyncValidateToTimePartDate = function asyncValidateToTimePartDate(entity, value) {
			if (value !== null && entity.ToTimePartTime !== null) {
				const dateString = value.format('YYYY-MM-DD');
				const timeString = entity.ToTimePartTime.format('HH:mm:ss');
				const dateTimeString = `${dateString} ${timeString}`;

				entity.To = moment(dateTimeString, 'YYYY-MM-DD HH:mm:ss');
			} else {
				if (value !== null && entity.ToTimePartTime === null) {
					const dateString = value.format('YYYY-MM-DD');
					const timeString = '00:00:00';
					const dateTimeString = `${dateString} ${timeString}`;

					entity.To = moment(dateTimeString, 'YYYY-MM-DD HH:mm:ss');
				}
				if (value === null) {
					entity.To = null;
					entity.ToTimePartTime = null;
				}
			}
			if (entity.FromTimePartTime===null && entity.ToTimePartTime === null) {
				entity.Duration = 0;
			}
			return $q.when(true);
		};

		self.validateToTimePartDate = function validateToTimePartDate(entity, value, dataService) {
			if (entity.FromTimePartTime !== null && entity.ToTimePartTime !== null && entity.FromTimePartDate !== null && value !== null) {

				let breakData = timekeepingRecordingBreakDataService.getList();
				if (breakData.length > 0) {
					if (breakData.length === 1) {
						entity.breakFrom = breakData[0].breakFrom;
						entity.breakTo = breakData[0].breakTo;
					}
					let hours = calculateWorkingDuration(entity.FromTimePartTime, entity.ToTimePartTime, entity.FromTimePartDate, value, breakData, dataService);
					entity.Duration = timekeepingRecordingRoundingDataService.roundValue(hours, 'Duration', entity);
					adjustToTimeReportedHours(entity,value);
				} else {
					adjustToTimeReportedHours(entity,value);
					entity.ToTimePartDate =value;
					recalculateDuration(entity);
				}

			} else {
				if (entity.FromTimePartTime !== null && entity.ToTimePartTime !== null && entity.FromTimePartDate !== null && value !== null) {
					let breakData = timekeepingRecordingBreakDataService.getList();
					if (breakData.length > 0) {
						if (breakData.length === 1) {
							entity.breakFrom = breakData[0].breakFrom;
							entity.breakTo = breakData[0].breakTo;
						}
						let hours = calculateWorkingDuration(entity.FromTimePartTime, entity.ToTimePartTime, entity.FromTimePartDate, value, breakData, dataService);
						entity.Duration = timekeepingRecordingRoundingDataService.roundValue(hours, 'Duration', entity);
						adjustToTimeReportedHours(entity,value);
					} else {
						adjustToTimeReportedHours(entity,value);
						entity.ToTimePartDate =value;
						recalculateDuration(entity);
					}
				}
			}

			updateReportChangeFields(entity, 'ToTimePartDate');
		};

		self.asyncValidateFromTimePartTime = function asyncValidateFromTimePartTime(entity, value) {
			// Check if value is not null and set the From date and time accordingly
			if (value !== null) {
				entity.FromTimePartTime = value;
				const dateString = entity.FromTimePartDate !== null
					? moment(entity.FromTimePartDate).format('YYYY-MM-DD')
					: moment(entity.DueDate).format('YYYY-MM-DD');

				if (entity.ToTimePartTime !== null && entity.ToTimePartTime.format('HH:mm:ss') !== '00:00:00' && entity.FromTimePartDate!==null) {
					if (moment(entity.ToTimePartTime, 'HH:mm:ss').isSameOrAfter(moment(entity.FromTimePartTime, 'HH:mm:ss'))) {
						entity.ToTimePartDate = moment(entity.FromTimePartDate).format('YYYY-MM-DD');
					} else {
						entity.ToTimePartDate = moment(entity.FromTimePartDate).add(1, 'days').format('YYYY-MM-DD');
					}
				}
				const timeString = value.format('HH:mm:ss');
				const dateTimeString = `${dateString} ${timeString}`;
				entity.From = moment(dateTimeString, 'YYYY-MM-DD HH:mm:ss');
			} else {
				entity.From = null;
				entity.FromTimePartDate = null;
				entity.Duration = 0; // If 'From' time is null, reset duration to 0
				return $q.when(true);
			}
			recalculateDuration(entity);
			return $q.when(true);
		};


		self.validateFromTimePartTime = function validateFromTimePartTime(entity, value, dataService) {
			if (entity.ToTimePartTime !== null && value !== null && entity.FromTimePartDate !== null && entity.ToTimePartDate !== null) {
				let breakData = timekeepingRecordingBreakDataService.getList();
				if (breakData.length > 0) {
					if (breakData.length === 1) {
						entity.breakFrom = breakData[0].breakFrom;
						entity.breakTo = breakData[0].breakTo;
					}
					let hours = calculateWorkingDuration(value, entity.ToTimePartTime, entity.FromTimePartDate, entity.ToTimePartDate, breakData, dataService);
					entity.Duration = timekeepingRecordingRoundingDataService.roundValue(hours, 'Duration', entity);
					adjustFromReportedHours(entity,value);
				} else {
					adjustFromReportedHours(entity,value);
					entity.FromTimePartTime =value;
					recalculateDuration(entity);
				}


			} else {
				if (entity.ToTimePartTime !== null && value !== null && entity.FromTimePartDate !== null && entity.ToTimePartDate !== null) {
					let breakData = timekeepingRecordingBreakDataService.getList();
					if (breakData.length > 0) {
						if (breakData.length === 1) {
							entity.breakFrom = breakData[0].breakFrom;
							entity.breakTo = breakData[0].breakTo;
						}
						let hours = calculateWorkingDuration(value, entity.ToTimePartTime, entity.FromTimePartDate, entity.ToTimePartDate, breakData, dataService);
						entity.Duration = timekeepingRecordingRoundingDataService.roundValue(hours, 'Duration', entity);
						adjustFromReportedHours(entity,value);
					} else {
						adjustFromReportedHours(entity,value);
						entity.FromTimePartTime =value;
						recalculateDuration(entity);
					}

				}

			}
			updateReportChangeFields(entity, 'FromTimePartDate');
		};

		self.asyncValidateToTimePartTime = function asyncValidateToTimePartTime(entity, value) {
			// Check if value is not null and set the To date and time accordingly
			if (value !== null) {
				entity.ToTimePartTime = value;
				const dateString = entity.ToTimePartDate !== null
					? moment(entity.ToTimePartDate).format('YYYY-MM-DD')
					: (entity.FromTimePartTime !== null && entity.FromTimePartTime > entity.ToTimePartTime)
						? moment(entity.DueDate).add(1, 'days').format('YYYY-MM-DD')
						: moment(entity.DueDate).format('YYYY-MM-DD');

				if (value.format('HH:mm:ss') !== '00:00:00' && entity.FromTimePartDate!==null) {
					if (moment(value, 'HH:mm:ss').isSameOrAfter(moment(entity.FromTimePartTime, 'HH:mm:ss'))) {
						// If ToTime is after or equal to FromTime, keep ToDate same as FromDate
						entity.ToTimePartDate = moment(entity.FromTimePartDate).format('YYYY-MM-DD');
					} else {
						// If ToTime is before FromTime, set ToDate to the next day
						entity.ToTimePartDate = moment(entity.FromTimePartDate).add(1, 'days').format('YYYY-MM-DD');
					}
				}
				const timeString = value.format('HH:mm:ss');
				const dateTimeString = `${dateString} ${timeString}`;
				entity.To =  moment(dateTimeString, 'YYYY-MM-DD HH:mm:ss');
			} else {
				entity.To = null;
				entity.ToTimePartDate = null;
				entity.Duration = 0; // If 'To' time is null, reset duration to 0
				return $q.when(true);
			}
			recalculateDuration(entity);
			return $q.when(true);
		};

		self.validateToTimePartTime = function validateToTimePartTime(entity, value, dataService) {
			if (entity.FromTimePartTime !== null && value !== null && entity.FromTimePartDate !== null && entity.ToTimePartDate !== null) {
				let breakData = timekeepingRecordingBreakDataService.getList();
				if (breakData.length > 0) {
					if (breakData.length === 1) {
						entity.breakFrom = breakData[0].breakFrom;
						entity.breakTo = breakData[0].breakTo;
					}
					let hours = calculateWorkingDuration(entity.FromTimePartTime, value, entity.FromTimePartDate, entity.ToTimePartDate, breakData, dataService);
					entity.Duration = timekeepingRecordingRoundingDataService.roundValue(hours, 'Duration', entity);
					adjustToReportedHours(entity,value);
				} else {
					adjustToReportedHours(entity,value);
					entity.ToTimePartTime =value;
					recalculateDuration(entity);

				}
			} else {
				if (entity.FromTimePartTime !== null && value !== null && entity.FromTimePartDate !== null && entity.ToTimePartDate !== null) {
					let breakData = timekeepingRecordingBreakDataService.getList();
					if (breakData.length > 0) {
						if (breakData.length === 1) {
							entity.breakFrom = breakData[0].breakFrom;
							entity.breakTo = breakData[0].breakTo;
						}
						let hours = calculateWorkingDuration(entity.FromTimePartTime, value, entity.FromTimePartDate, entity.ToTimePartDate, breakData, dataService);
						entity.Duration = timekeepingRecordingRoundingDataService.roundValue(hours, 'Duration', entity);
						adjustToReportedHours(entity,value);
					} else {
						adjustToReportedHours(entity,value);
						entity.ToTimePartTime =value;
						recalculateDuration(entity);
					}
				}
			}
			updateReportChangeFields(entity, 'ToTimePartDate');
		};
		self.validateBreakFrom = function validateBreakFrom(entity, value, dataService) {
			if (entity.FromTimePartTime !== null && entity.ToTimePartTime && value !== null && entity.BreakTo !== null && entity.FromTimePartDate !== null && entity.ToTimePartDate !== null) {
				let breakData = timekeepingRecordingBreakDataService.getList();
				if (breakData.length > 0) {
					if (breakData.length === 1) {
						entity.breakFrom = breakData[0].breakFrom;
						entity.breakTo = breakData[0].breakTo;
					}
					let hours = calculateWorkingDuration(entity.FromTimePartTime, entity.ToTimePartTime, entity.FromTimePartDate, entity.ToTimePartDate, breakData, dataService);
					entity.Duration = timekeepingRecordingRoundingDataService.roundValue(hours, 'Duration', entity);
				} else {
					entity.BreakFrom =value;
					recalculateDuration(entity);
				}
			} else {
				if (value === null && entity.BreakTo === null) {
					let hours = giveTimeInHours(convertDateAndTime(entity.FromTimePartDate? entity.FromTimePartDate.format('YYYY-MM-DD'): (entity.DueDate ? entity.DueDate.format('YYYY-MM-DD') : null),entity.FromTimePartTime ? entity.FromTimePartTime.format('HH:mm:ss') : null),
						convertDateAndTime(entity.ToTimePartDate? entity.ToTimePartDate.format('YYYY-MM-DD'): (entity.DueDate ? entity.DueDate.format('YYYY-MM-DD') : null),entity.ToTimePartTime ? entity.ToTimePartTime.format('HH:mm:ss') : null));
					entity.Duration = timekeepingRecordingRoundingDataService.roundValue(hours, 'Duration', entity);
				}
			}

			updateReportChangeFields(entity, 'BreakFrom');
		};
		self.validateBreakTo = function validateBreakTo(entity, value, dataService) {
			if (entity.FromTimePartTime !== null && entity.ToTimePartTime !== null && value !== null && entity.BreakFrom !== null && entity.FromTimePartDate !== null && entity.ToTimePartDate !== null) {
				let breakData = timekeepingRecordingBreakDataService.getList();
				if (breakData.length > 0) {
					if (breakData.length === 1) {
						entity.breakFrom = breakData[0].breakFrom;
						entity.breakTo = breakData[0].breakTo;
					}
					let hours = calculateWorkingDuration(entity.FromTimePartTime, entity.ToTimePartTime, entity.FromTimePartDate, entity.ToTimePartDate, breakData, dataService);
					entity.Duration = timekeepingRecordingRoundingDataService.roundValue(hours, 'Duration', entity);
				} else {
					entity.BreakTo =value;
					recalculateDuration(entity);
				}
			} else {
				if (value === null && entity.BreakFrom === null) {
					let hours =0;
					let fromDate = moment(entity.FromTimePartDate);
					let fromTime = moment(entity.FromTimePartTime, 'HH:mm:ss');
					let toDate = moment(entity.ToTimePartDate);
					let toTime = moment(entity.ToTimePartTime, 'HH:mm:ss');

					// Check if the date and time objects are valid before formatting
					if (fromDate.isValid() && fromTime.isValid() && toDate.isValid() && toTime.isValid()) {
						 hours = giveTimeInHours(
							convertDateAndTime(fromDate.format('YYYY-MM-DD'), fromTime.format('HH:mm:ss')),
							convertDateAndTime(toDate.format('YYYY-MM-DD'), toTime.format('HH:mm:ss'))
						);
					}
					entity.Duration = timekeepingRecordingRoundingDataService.roundValue(hours, 'Duration', entity);
				}
			}

			updateReportChangeFields(entity, 'BreakTo');
		};

		self.asyncValidateBreakFrom = function asyncValidateBreakFrom(entity, value) {
			entity.BreakFrom = null;
			if (value !== null) {
				let breakFromTimeString = moment(value).format('HH:mm') + ':00';
				let breakFromDateString = entity.FromTimePartDate
					? moment(entity.FromTimePartDate).format('YYYY-MM-DD')
					: moment(entity.DueDate).format('YYYY-MM-DD');
				let newBreakFromDatetime = breakFromDateString + ' ' + breakFromTimeString;
				entity.BreakFrom = moment(newBreakFromDatetime);
			}
			if(entity.BreakTo!==null){
				let breakToTimeString = moment(entity.BreakTo).format('HH:mm') + ':00';
				let breakToDateString = entity.ToTimePartDate
					? moment(entity.ToTimePartDate).format('YYYY-MM-DD')
					: moment(entity.DueDate).format('YYYY-MM-DD');
				let newBreakToDatetime = breakToDateString + ' ' + breakToTimeString;
				entity.BreakTo = moment(newBreakToDatetime);
			}
			// Recalculate the duration considering the new break time
			recalculateDuration(entity);

			return $q.when(true);
		};

		self.asyncValidateBreakTo = function asyncValidateBreakTo(entity, value) {
			entity.BreakTo = null;
			if (value !== null) {
				let breakToTimeString = moment(value).format('HH:mm') + ':00';
				let breakToDateString = entity.ToTimePartDate
					? moment(entity.ToTimePartDate).format('YYYY-MM-DD')
					: moment(entity.DueDate).format('YYYY-MM-DD');
				let newBreakToDatetime = breakToDateString + ' ' + breakToTimeString;
				entity.BreakTo = moment(newBreakToDatetime);
			}
			if(entity.BreakFrom!==null) {
				let breakFromTimeString = moment(entity.BreakFrom).format('HH:mm') + ':00';
				let breakFromDateString = entity.FromTimePartDate
					? moment(entity.FromTimePartDate).format('YYYY-MM-DD')
					: moment(entity.DueDate).format('YYYY-MM-DD');
				let newBreakFromDatetime = breakFromDateString + ' ' + breakFromTimeString;
				entity.BreakFrom = moment(newBreakFromDatetime);
			}
			// Recalculate the duration considering the new break time
			recalculateDuration(entity);
			return $q.when(true);
		};

		function adjustFromTimeReportedHours(entity,value){
			let FromMoment = moment(value).set('hour', entity.FromTimePartTime.hours()).set('minute', entity.FromTimePartTime.minutes()).set('second', entity.FromTimePartTime.seconds());
			let ToMoment = moment(entity.ToTimePartDate).set('hour', entity.ToTimePartTime.hours()).set('minute', entity.ToTimePartTime.minutes()).set('second', entity.ToTimePartTime.seconds());
			entity.FromTimePartDate = value;
			validateFrom(entity, FromMoment, ToMoment);
		}
		function adjustFromReportedHours(entity,value){
			let FromMoment = moment(entity.FromTimePartDate).set('hour', value.hours()).set('minute', value.minutes()).set('second', value.seconds());
			let ToMoment = moment(entity.ToTimePartDate).set('hour', entity.ToTimePartTime.hours()).set('minute', entity.ToTimePartTime.minutes()).set('second', entity.ToTimePartTime.seconds());
			entity.FromTimePartTime = value;
			validateFrom(entity, FromMoment, ToMoment);
		}

		function adjustToReportedHours(entity,value){
			let FromMoment = moment(entity.FromTimePartDate).set('hour', entity.FromTimePartTime.hours()).set('minute', entity.FromTimePartTime.minutes()).set('second', entity.FromTimePartTime.seconds());
			let ToMoment = moment(entity.ToTimePartDate).set('hour', value.hours()).set('minute', value.minutes()).set('second', value.seconds());
			entity.ToTimePartTime = value;
			validateTo(entity, FromMoment, ToMoment);
		}

		function adjustToTimeReportedHours(entity,value){
			let FromMoment = moment(entity.FromTimePartDate).set('hour', entity.FromTimePartTime.hours()).set('minute', entity.FromTimePartTime.minutes()).set('second', entity.FromTimePartTime.seconds());
			let ToMoment = moment(value).set('hour', entity.ToTimePartTime.hours()).set('minute', entity.ToTimePartTime.minutes()).set('second', entity.ToTimePartTime.seconds());
			entity.ToTimePartDate = value;
			validateTo(entity, FromMoment, ToMoment);
		}

		function convertDateAndTime(dateString,timeString){
			const dateTimeString = `${dateString} ${timeString}`;
			return moment(dateTimeString, 'YYYY-MM-DD HH:mm:ss');
		}

		function recalculateDuration(entity) {
			if (!entity.From) {
				entity.Duration = 0;
				entity.BreakDuration = 0;
				return;
			}
			// Helper function to convert date and time
			const convertToDateTime = (date, time) => {
				// Ensure date and time are moment objects
				const momentDate = moment.isMoment(date) ? date : moment(date);
				const momentTime = moment.isMoment(time) ? time : moment(time);

				return convertDateAndTime(momentDate.format('YYYY-MM-DD'), momentTime.format('HH:mm:ss'));
			};

			// Parsing From and To times

			const fromDateTime = entity.From? convertToDateTime(entity.FromTimePartDate ?? entity.DueDate, entity.FromTimePartTime): null;
			const toDateTime = entity.To? convertToDateTime(entity.ToTimePartDate ?? entity.DueDate, entity.ToTimePartTime): null;

			// Calculate total working hours
			const totalHours = giveTimeInHours(fromDateTime, toDateTime);

			let workingHours = totalHours;
			let breakHours = 0;

			if (entity.BreakFrom && entity.BreakTo) {
				const breakFromTime = entity.BreakFrom.format('HH:mm:ss');
				const breakToTime = entity.BreakTo.format('HH:mm:ss');
				let breakFromDateTime, breakToDateTime;

				// Determine breakFromDateTime and breakToDateTime based on their time relations
				if (breakFromTime >= breakToTime) {
					breakFromDateTime = convertToDateTime(entity.FromTimePartDate ?? entity.DueDate, entity.BreakFrom);
					breakToDateTime = convertToDateTime(entity.ToTimePartDate ?? entity.DueDate, entity.BreakTo);
				} else {
					if (breakFromTime < entity.FromTimePartTime.format('HH:mm:ss')) {
						breakFromDateTime = convertToDateTime(entity.ToTimePartDate ?? entity.DueDate, entity.BreakFrom);
					} else {
						breakFromDateTime = convertToDateTime(entity.FromTimePartDate ?? entity.DueDate, entity.BreakFrom);
					}
					if (breakToTime < entity.FromTimePartTime.format('HH:mm:ss')) {
						breakToDateTime = convertToDateTime(entity.ToTimePartDate ?? entity.DueDate, entity.BreakTo);
					} else {
						breakToDateTime = convertToDateTime(entity.FromTimePartDate ?? entity.DueDate, entity.BreakTo);
					}
				}

				if (
					entity.FromTimePartTime && entity.BreakFrom &&
					entity.ToTimePartTime && entity.BreakTo
				) {
					if (
						entity.FromTimePartTime.format('HH:mm:ss') <= entity.BreakFrom.format('HH:mm:ss') &&
						entity.ToTimePartTime.format('HH:mm:ss') >= entity.BreakTo.format('HH:mm:ss')
					) {
						breakHours = breakToDateTime.diff(breakFromDateTime, 'hours', true);
					} else if (
						entity.FromTimePartTime.format('HH:mm:ss') >= entity.BreakFrom.format('HH:mm:ss') &&
						entity.FromTimePartTime.format('HH:mm:ss') < entity.BreakTo.format('HH:mm:ss')
					) {
						breakHours = breakToDateTime.diff(fromDateTime, 'hours', true);
					}
				}
				// Determine break hours based on conditions
				if (fromDateTime >= breakFromDateTime && toDateTime <= breakToDateTime) {
					workingHours = 0;
				} else if (fromDateTime < breakFromDateTime && toDateTime > breakToDateTime) {
					breakHours = breakToDateTime.diff(breakFromDateTime, 'hours', true);
					workingHours -= breakHours;
				} else if (fromDateTime < breakFromDateTime && toDateTime > breakFromDateTime && toDateTime <= breakToDateTime) {
					breakHours = toDateTime.diff(breakFromDateTime, 'hours', true);
					workingHours -= breakHours;
				} else if (fromDateTime >= breakFromDateTime && fromDateTime < breakToDateTime && toDateTime > breakToDateTime) {
					breakHours = breakToDateTime.diff(fromDateTime, 'hours', true);
					workingHours -= breakHours;
				} else if (fromDateTime < breakFromDateTime && toDateTime > breakFromDateTime && toDateTime > breakToDateTime) {
					breakHours = breakToDateTime.diff(breakFromDateTime, 'hours', true);
					workingHours -= breakHours;
				} else if (fromDateTime < breakFromDateTime && toDateTime > breakFromDateTime && toDateTime < breakToDateTime) {
					breakHours = toDateTime.diff(breakFromDateTime, 'hours', true);
					workingHours -= breakHours;
				} else if (fromDateTime > breakFromDateTime && fromDateTime < breakToDateTime && toDateTime > breakFromDateTime && toDateTime > breakToDateTime) {
					breakHours = breakToDateTime.diff(fromDateTime, 'hours', true);
					workingHours -= breakHours;
				} else if (fromDateTime < breakFromDateTime && toDateTime > breakFromDateTime && toDateTime > breakToDateTime) {
					breakHours = breakToDateTime.diff(breakFromDateTime, 'hours', true);
					workingHours -= breakHours;
				} else if (fromDateTime > breakFromDateTime && fromDateTime < breakToDateTime && toDateTime > breakFromDateTime && toDateTime < breakToDateTime) {
					breakHours = toDateTime.diff(breakFromDateTime, 'hours', true);
					workingHours -= breakHours;
				}
			}

			// Ensure working hours are not negative
			workingHours = Math.max(0, workingHours);

			// Round and assign the calculated duration
			entity.Duration = timekeepingRecordingRoundingDataService.roundValue(workingHours, 'Duration', entity);
			entity.BreakDuration = timekeepingRecordingRoundingDataService.roundValue(breakHours, 'BreakDuration', entity);
		}



		function validateTo(entity, FromMoment, ToMoment) {
			if (ToMoment !== null && entity.To !== null) {
				let timeAllocationItemService = $injector.get('timekeepingTimeallocationItemDataService');
				let toDate = moment(entity.ToTimePartDate);
				// Set the time components explicitly
				toDate.set({
					hour: entity.ToTimePartTime.hours(),
					minute: entity.ToTimePartTime.minutes(),
					second: entity.ToTimePartTime.seconds(),
				});
				// Convert to Date if needed
				let oldTo = toDate.toDate();
				let totalamount = giveTimeInHours(ToMoment, oldTo);
				if (ToMoment < oldTo) {
					timeAllocationItemService.updateTotalHours(totalamount * (-1));
				} else {
					timeAllocationItemService.updateTotalHours(totalamount);
				}
			}
		}


		function validateFrom(entity, FromMoment, ToMoment) {
			if (FromMoment !== null && ToMoment !== null) {
				let timeAllocationItemService = $injector.get('timekeepingTimeallocationItemDataService');
				let fromDate = moment(entity.FromTimePartDate);
				// Set the time components explicitly
				fromDate.set({
					hour: entity.FromTimePartTime.hours(),
					minute: entity.FromTimePartTime.minutes(),
					second: entity.FromTimePartTime.seconds(),
				});
				// Convert to Date object if needed
				let oldFROM = fromDate.toDate();
				// Calculate the total amount of time
				let totalamount = giveTimeInHours(FromMoment, oldFROM);

				// Update total hours based on comparison
				if (FromMoment > oldFROM) {
					timeAllocationItemService.updateTotalHours(totalamount * (-1));
				} else {
					timeAllocationItemService.updateTotalHours(totalamount);
				}
			}
		}

		function giveTimeInHours(from, to) {
			if (from === null || to === null) {
				return 0;
			}
			let diffTime;
			if (to.valueOf() < from.valueOf()) {
				diffTime = (to.valueOf() + (24 * 1000 * 60 * 60) - from.valueOf());
			} else {
				diffTime = Math.abs(to.valueOf() - from.valueOf());
			}
			return diffTime / 1000 / 60 / 60;
		}

		function calculateWorkingDuration(starttime, endtime, fromDateStart, toDateEnd, newBreaks, dataService) {
			let fromTimeString = moment.utc(starttime).toISOString();
			let toTimeString = moment.utc(endtime).toISOString();
			let fromDateString = moment.utc(fromDateStart).toISOString();
			let toDateString = moment.utc(toDateEnd).toISOString();
			let nstartDatetime = new Date(fromDateString + ' ' + fromTimeString);
			let nendDatetime = new Date(toDateString + ' ' + toTimeString);
			let report = dataService.getSelected();

			let startDatetime = moment.utc(nstartDatetime).toISOString();
			let endDatetime = moment.utc(nendDatetime).toISOString();
			let breaks = [];
			newBreaks.forEach(item => {

				let fromTimeString = moment.utc(item.FromTimeBreakTime).toISOString();
				let toTimeString = moment.utc(item.ToTimeBreakTime).toISOString();
				let fromDateString = moment.utc(item.FromTimeBreakDate).toISOString();
				let toDateString = moment.utc(item.ToTimeBreakDate).toISOString();
				let prestartDatetime = new Date(fromDateString + ' ' + fromTimeString);
				let preendDatetime = new Date(toDateString + ' ' + toTimeString);

				let breakstartDatetime = moment.utc(prestartDatetime).toISOString();
				let breakendDatetime = moment.utc(preendDatetime).toISOString();

				let nestedItem = [breakstartDatetime, breakendDatetime, item.FromTimeBreakDate, item.ToTimeBreakDate];

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
				let breakStartDate = value[2];
				let breakEndDate = value[3];
				let breakStart = value[0];
				let breakEnd = value[1];
				if ((breakStart <= startDatetime && breakEnd >= endDatetime) || (breakStart === startDatetime && breakEnd >= endDatetime)) {
					breakStart = startDatetime;
					breakEnd = endDatetime;
					if (breakEnd < breakStart) {
						breakHours = 0;
					} else {
						breakHours = calculateHours(breakStart, breakEnd, breakStartDate, breakEndDate);
					}
					//breakHours = calculateHours(breakStart,breakEnd,fromDateStart,toDateEnd);
					BH.push(breakHours);
					startDatetime = breakEnd;
				} else if ((breakStart <= startDatetime && breakEnd <= endDatetime) || (breakStart === startDatetime && breakEnd <= endDatetime) || (breakStart <= startDatetime && breakEnd === endDatetime)) {
					breakStart = startDatetime;
					// breakEnd=breakEnd;
					if (breakEnd < breakStart) {
						breakHours = 0;
					} else {
						breakHours = calculateHours(breakStart, breakEnd, breakStartDate, breakEndDate);
					}
					//breakHours = calculateHours(breakStart,breakEnd,fromDateStart,toDateEnd);
					BH.push(breakHours);
					startDatetime = breakEnd;
				} else if (breakStart >= startDatetime && breakEnd >= endDatetime) {
					// breakStart=breakStart;
					breakEnd = endDatetime;
					if (breakEnd < breakStart) {
						breakHours = 0;
					} else {
						breakHours = calculateHours(breakStart, breakEnd, breakStartDate, breakEndDate);
					}
					//breakHours = calculateHours(breakStart,breakEnd,fromDateStart,toDateEnd);
					BH.push(breakHours);
					startDatetime = breakEnd;
				} else if ((breakStart >= startDatetime && breakEnd === endDatetime) || (breakStart === startDatetime && breakEnd === endDatetime) || (breakStart >= startDatetime && breakEnd <= endDatetime)) {
					// breakStart=breakStart;
					// breakEnd=breakEnd;
					if (breakEnd < breakStart) {
						breakHours = 0;
					} else {
						breakHours = calculateHours(breakStart, breakEnd, breakStartDate, breakEndDate);
					}
					//breakHours = calculateHours(breakStart,breakEnd,fromDateStart,toDateEnd);
					BH.push(breakHours);
					startDatetime = breakEnd;
				}
			}
			for (let n = 0; n < BH.length; n++) {
				TBH += BH[n];
			}
			let totalBreakHours = TBH;
			let ActualWorkingHours = totalWorkingHours - totalBreakHours;
			report.BreakDuration = totalBreakHours;
			dataService.markItemAsModified(report);
			dataService.gridRefresh();
			return ActualWorkingHours;

		}

		function hoursDiff(dt1, dt2) {
			let diffTime = (dt2.getTime() - dt1.getTime());
			let hoursDiff = diffTime / (1000 * 3600);
			return hoursDiff;
		}

		function checkInTimeWithinBreak(from, breakFrom, breakTo) {
			if (from >= breakFrom && from < breakTo) {
				return true;
			} else {
				return false;
			}
		}

		function checkOutTimeWithinBreak(to, breakFrom, breakTo) {
			if (to > breakFrom && to < breakTo) {
				return true;
			} else {
				return false;
			}
		}

		function checkIsBreakOutsideShift(FromTime, ToTime, FromDate, ToDate, breakFrom, breakTo) {
			if (FromTime > breakTo || breakFrom > ToTime) {
				return true;
			} else {
				return false;
			}
		}

		function updateReportChangeFields(entity, fieldName) {
			entity.ReportChangeFields = entity.ReportChangeFields || [];
			if (!entity.ReportChangeFields.includes(fieldName)) {
				entity.ReportChangeFields.push(fieldName);
			}
		}
	}
})(angular);