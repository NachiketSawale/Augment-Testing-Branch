/* global moment Platform globals */
/**
 *
 * @ngdoc service
 * @name scheduling.main.schedulingMainLobService
 * @function
 * @requires schedulingMainService, projectLocationMainService, calendarUtilitiesService
 *
 * @description
 * #LOBService
 * 1) Provides common data for the chart control, collecting it from several injected services
 * 2) Keeps settings during the lifetime of the app for controllers and directives in the scheduling.main
 * module but does not persist them.
 */
/* jshint -W072 */ // many parameters because of dependency injection
// noinspection JSAnnotator
angular.module('scheduling.main').factory('schedulingMainChartService', ['_', '$q', '$injector', '$translate', 'platformContextService',
	'schedulingMainService', 'calendarUtilitiesService', 'schedulingMainActivityValidationService',
	'schedulingScheduleTimelinePresentService', '$http', 'platformRuntimeDataService', 'platformModalService', 'schedulingLookupService',
	function(_, $q, $injector, translate, context, activityservice, calendarUtilitiesService, validation, timeline, $http, platformRuntimeDataService, platformModalService, schedulingLookupService) {
		'use strict';
		let activitymap = new Map();
		let service = Object.create({}, {
			'activities': {
				get: function() {
					return activityservice.getList() || [];
				},
				enumerable: true
			},
			'holidays': {
				value: [],
				enumerable: true,
				writable: true
			},
			'weekends': {
				value: [],
				enumerable: true,
				writable: true
			},
			'workingDays': {
				value: [],
				enumerable: true,
				writable: true
			},
			'timelines': {
				get: function() {
					return timeline.getList().filter(function(item) {
						return item.IsActive;
					});
				},
				enumerable: true
			},
			'exceptionDates': {
				value: [],
				enumerable: true,
				writable: true
			},
			'timerange': {
				get: getTimeRange,
				enumerable: true
			},
			'translations': {
				value: translate.instant([
					'scheduling.main.plannedStart',
					'scheduling.main.plannedFinish',
					'scheduling.main.plannedDuration',
					'scheduling.main.calendar.weekAbbreviation',
					'scheduling.main.calendar.weekNumberFormat'
					/* WBS element and description; Rate of completion */
				]),
				writable: true,
				enumerable: true
			},
			'project': {
				get: getProjectName,
				enumerable: true
			},
			'schedule': {
				get: function() {
					let result = activityservice.getSelectedSchedule();
					return result && Object.keys(result).length > 0 ? result : null;
				},
				enumerable: true
			},
			'logo': {
				value: '',
				enumerable: true,
				writable: true
			},
			'colors': {
				value: new Map(),
				enumerable: true,
				writable: true
			},
			'presentation': {
				value: new Map(),
				enumerable: true,
				writable: true
			},
			'activitytype': {
				value: new Map(),
				enumerable: true,
				writable: true
			},
			'activitystate': {
				value: new Map(),
				enumerable: true,
				writable: true
			}
		});

		// Methods
		service.validatePlannedStart = validatePlannedStart;
		service.validatePlannedFinish = validatePlannedFinish;
		// service.validatePlannedDurationAndFinish = validatePlannedDurationAndFinish;
		service.validatePlannedMove = validatePlannedMove;
		service.getActivity = getActivityById;
		service.translate = translateKey;
		service.getHolidaysAsync = getHolidaysAsync;
		service.getActivitiesAsync = getActivitiesAsync;
		service.getLogo = getLogo;
		service.readonlyStart = readonlyStart;
		service.readonlyFinish = readonlyFinish;
		service.convertMapToObject = convertMapToObject;
		service.loadPresentationAttributes = loadPresentationAttributes;
		service.getValuesFromMap = getValuesFromMap;

		// global update message for new control
		service.dataUpdated = new Platform.Messenger();
		service.collectionChanged = new Platform.Messenger();
		service.selectionChanged = new Platform.Messenger();
		service.forceLayoutUpdate = new Platform.Messenger();
		service.requestRedraw = new Platform.Messenger();

		setupHandlers();
		buildActivityMap();

		return service;

		function finishValidationAndApplyValue(result, activity, val, fields) {

			_.each(fields, function(field) {
				writebackValidationResults(result, activity, val, field);
			});
			// apply the Value
			// activity.PlannedStart = val.start;
			// activity.PlannedFinish = val.end;
			service.forceLayoutUpdate.fire();
		}

		function validatePlannedStart(activity, val) {
			let fields = ['PlannedStart', 'PlannedFinish'];
			// Check if start is a valid date
			if (!val.start.isValid()) {
				let deferred = $q.defer();
				deferred.reject();
				return deferred.promise;
			}
			return validation.asyncValidatePlannedStart(activity, val.start, fields).then(function(result) {
				finishValidationAndApplyValue(result, activity, val, result.invalidFields);
			});
		}

		function validatePlannedFinish(activity, val) {
			let field = 'PlannedFinish';
			// Check if finish is a valid date
			if (!val.end.isValid()) {
				let deferred = $q.defer();
				deferred.reject();
				return deferred.promise;
			}

			return validation.asyncValidatePlannedFinish(activity, val.end, field).then(function(result) {
				finishValidationAndApplyValue(result, activity, val, result.invalidFields);
			});
		}

		function validatePlannedMove(activity, val) {
			let fields = ['PlannedStart', 'PlannedFinish'];
			if (!val.start.isValid() || !val.end.isValid()) {
				let deferred = $q.defer();
				deferred.reject();
				return deferred.promise;
			}
			return validation.asyncValidatePlannedMove(activity, [val.start, val.end], fields).then(function(result) {
				finishValidationAndApplyValue(result, activity, val, result.invalidFields);
			});
		}

		function getActivityById(id) {
			return activitymap.get(id);
		}

		function readonlyStart() {
			let selected = activityservice.getSelected();
			if (selected.IsReadOnly === true) {
				return true;
			}
			let dataservice = $injector.get('platformRuntimeDataService');
			// platformruntimedataservice
			return dataservice.isReadonly(selected, 'PlannedStart');
		}

		function readonlyFinish() {
			let selected = activityservice.getSelected();
			if (selected.IsReadOnly === true) {
				return true;
			}
			let dataservice = $injector.get('platformRuntimeDataService');
			// platformruntimedataservice
			return dataservice.isReadonly(selected, 'PlannedFinish');
		}

		function getProjectName() {
			let result = activityservice.getSelectedProject();
			if (result) {
				return result;
			} else { // Handles case when project lookup does not find project. Happens if project is "deleted" or isLive is set to false.
				return {
					ProjectNo: 'deleted',
					ProjectName: 'deleted',
					ProjectName2: 'deleted'
				};
			}
		}

		// only handlers for when selected item is changed
		function setupHandlers() {
			activityservice.registerSelectedProjectChanged(getHolidaysAsync);
			activityservice.registerSelectionChanged(function() {
				service.selectionChanged.fire();
			});
			activityservice.registerListLoaded(buildActivityMap);
			activityservice.registerEntityCreated(buildActivityMap);
			activityservice.registerEntityDeleted(buildActivityMap);
			context.contextChanged.register(updateContext);

			timeline.registerListLoaded(processTimelines);
			timeline.registerDataModified(processTimelines);
			// timeline.registerItemModified(processTimelines);
		}

		function buildActivityMap() {
			activitymap.clear();
			_.forEach(activityservice.getList(), function(item) {
				activitymap.set(item.Id, item);
			});
		}

		function translateKey(key) {
			let result = translate.instant([key]);
			return result[key];
		}

		function getHolidaysAsync() {
			let prjId = activityservice.getSelectedProjectId();
			let calId = null;
			let selectedSchedule = activityservice.getSelectedSchedule();
			if (selectedSchedule) {
				calId = selectedSchedule.CalendarFk;
			}

			return calendarUtilitiesService.getCalendarChartDataByProject(calId, prjId).then(function(hol) {
				service.exceptionDates = hol.ExceptionDays;
				service.exceptionDates = _.map(_.filter(service.exceptionDates, {
					'IsShownInChart': true
				}), 'ExceptDate');
				service.holidays = buildHolidays(hol.ExceptionDays);
				service.weekends = _.map(_.filter(hol.WeekDays, 'IsWeekend'), 'WeekdayIndex') || [];
				service.workingDays = _.map(_.filter(hol.WeekDays, {
					'IsWeekend': false
				}), 'WeekdayIndex');

				return hol.NonWorkingDays;
			});
		}

		function writebackValidationResults(result, entity, value, field) {
			platformRuntimeDataService.applyValidationResult(result, entity, field);
			if (result.valid) { // if values are valid, apply valid values
				if (field === 'PlannedStart') {
					value.start = entity.PlannedStart;
				}
				if (field === 'PlannedFinish') {
					value.end = entity.PlannedFinish;
				}
			} else { // if values are invalid, restore invalid values so user can correct manually
				entity.PlannedStart = value.start;
				entity.PlannedFinish = value.end;
			}

			activityservice.markCurrentItemAsModified(); // If we do not mark the current item as modified our change that was created via drag and drop is not registered in the main service
			// Also trigger collection changed event to recalculate 100 %
			service.collectionChanged.fire();
		}

		function processTimelines() {
			service.dataUpdated.fire();
		}

		// only dates with flag IsShownInChart are considered, either showing them or hiding them (cut out from timeline).
		// otherwise they are ignored
		function buildHolidays(rawdates) {
			let holidays = [];
			let dates = _.sortBy(_.filter(rawdates, {
				'IsShownInChart': true
			}), 'ExceptDate');
			dates.forEach(function(date) {
				holidays.push({
					Start: date.ExceptDate,
					End: date.ExceptDate.clone().endOf('d'),
					Color: date.BackgroundColor,
					Text: date.DescriptionInfo.Description
				});
			});
			return holidays;
		}

		function getTimeRange(containerId) {
			let chartinterval = service.schedule ? service.schedule.ScheduleChartIntervalFk : 1; // there is not always a selected schedule

			switch (chartinterval) {
				case 1: // Project start. Uses previous behaviour
					return getProjectTimeRange(containerId);
				case 2: // Start of year
					return [moment.utc().startOf('year'), moment.utc().endOf('year')];
				case 3: // Start of quarter
					return [moment.utc().startOf('quarter'), moment.utc().endOf('quarter')];
				case 4: // Custom start date
					// if option "custom start date" is set but there is no custom start we use the old default behaviour
					if (!moment.isMoment(service.schedule.ChartIntervalStartDate)) {
						return getProjectTimeRange(containerId);
					} else {
						return [moment.utc(service.schedule.ChartIntervalStartDate), (moment.isMoment(service.schedule.ChartIntervalEndDate) ? moment.utc(service.schedule.ChartIntervalEndDate) : moment.utc(service.schedule.ChartIntervalStartDate).add(3, 'months'))];
					}
			}
		}

		function getProjectTimeRange() {
			let mindate, maxdate,
				activitydates = {
					min: null,
					max: null
				},
				keydates = {
					min: null,
					max: null
				};

			activitydates.min = moment.min(_.compact(_.map(service.activities, 'CurrentStart'))); // if no activties with plannedstart
			let finishdates = _.compact(_.map(service.activities, 'CurrentFinish')); // this would default to today as activitydate.min.
			if (finishdates.length > 0) {
				activitydates.max = moment.max(finishdates);
			} else {
				activitydates.max = activitydates.min.clone().add(6, 'months');
			}

			// also take keydates into consideration
			let keydatesmin = _.compact(_.map(service.timelines, 'Date'));
			if (keydatesmin.length > 0) {
				keydates.min = moment.min(keydatesmin);
				keydates.max = moment.max(keydatesmin);
			}
			let keydatesmax = _.compact(_.map(service.timelines, 'EndDate'));
			if (keydatesmin.length > 0 && keydatesmax.length > 0) {
				keydates.max = moment.max([keydates.max, moment.max(keydatesmax)]);
			} else if (keydatesmax.length > 0) {
				keydates.max = moment.max(keydatesmax);
			}

			mindate = moment.min(_.compact([keydates.min, activitydates.min]));
			maxdate = moment.max(_.compact([keydates.max, activitydates.max]));

			return [mindate, maxdate];
		}

		function updateContext(args) {
			if (args === 'language') {
				service.translations = angular.extend(service.translations, translate.instant([
					'scheduling.main.plannedStart',
					'scheduling.main.plannedFinish',
					'scheduling.main.plannedDuration'
					/* WBS element and description; Rate of completion */
				]));
			}
		}

		function getActivitiesAsync() {
			return activityservice.load();
		}

		function getLogo() {
			return $http.post(globals.webApiBaseUrl + 'basics/company/logo/smalllogo')
				.then(function(response) {
					service.logo = response.data;
				});
		}

		function loadPresentationAttributes() {
			return $http.post(globals.webApiBaseUrl + 'basics/customize/chartpresentation/list').then(function(response) {
				let data = response.data;
				service.colors.clear();
				_.forEach(data, function(element) {
					service.colors.set(element.Id, decimalToHex(element.Color, 6));
					service.presentation.set(element.Id, element.DescriptionInfo.Translated);
				});
				_.forEach(schedulingLookupService.getActivityStates(), function(element) {
					service.activitystate.set(element.Id, element.Description);
				});
			});

			function decimalToHex(decimal, chars) {
				return '#' + ((decimal + Math.pow(16, chars)).toString(16).slice(-chars).toUpperCase());
			}
		}

		function convertMapToObject(strMap) {
			let obj = Object.create(null);
			strMap.forEach(function(value, key) {
				let convertedvalue;
				if (isMap(value)) {
					convertedvalue = {};
					value.forEach(function(value2, key2) {
						convertedvalue[key2 + ''] = value2;
					});
					obj[key + ''] = convertedvalue;
				} else {
					obj[key + ''] = value;
				}
			});
			return obj;

			function isMap(myobject) {
				return typeof(myobject.get) === 'function' && typeof(myobject.set) === 'function' && typeof(myobject.has) === 'function';
			}
		}

		function getValuesFromMap(map) {
			let result = [];
			map.forEach(function(item) {
				result.push(item);
			});
			return result;
		}
	}
]);
