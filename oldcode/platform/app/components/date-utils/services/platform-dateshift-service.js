(angular => {
	'use strict';

	let moduleName = 'platform';
	angular.module(moduleName).service('platformDateshiftService', PlatformDateshiftService);
	PlatformDateshiftService.$inject = ['_', 'moment'];

	// eslint-disable-next-line no-unused-vars
	function PlatformDateshiftService(_, moment) {

		// /### START ###/// of Vanilla JS Dateshift service
		// / when modified copy changes also to this \trunk\ProductionPlanning\Development\Common\Common.BusinessComponents\Resources\dateshift-service-doNotModify.js

		// region Class defintions

		// region Result

		/**
		 * @ngdoc Class
		 * @name DateShiftResult
		 * @property {Object[]}  activities - Array of modified activity object that are returned as result.
		 * @property {Object[]}  messages - Array of message objects that are returned.
		 * @property {boolean}  shiftCorrected - Flag to indicate that invalid data was corrected during the dateshift processed.
		 * @property {boolean}  shiftCancelled - Flag to indicate that the dateshift could not finish correctly.
		 * @constructor
		 */
		let DateShiftResult = function DateShiftResult() {
			this.resetResult();
		};

		DateShiftResult.prototype.resetResult = function resetResult() {
			this.activities = [];
			this.messages = [];
			this.shiftCorrected = false; // boolean if shift needed correction (invalid data within shift)
			this.shiftCancelled = false; // boolean if shift couldn't be done (invalid data within shift)
		};

		DateShiftResult.prototype.addMessage = function addMessage(message, type, activityId, additionalInfo) {
			this.messages.push({ message: message, type: type, id: activityId ? activityId : null, additionalInfo: additionalInfo});
		};

		// endregion

		// endregion

		// region Global variables


		const DAY_IN_MS = 86400000;

		const DAY_IN_S = 86400;
		const HOUR_IN_S = 3600;
		const MIN_IN_S = 60;
		const SECOND = 1;

		let startPointPrefix = 'S';
		let endPointPrefix = 'E';
		let lastDateShiftData = { activities: [], relations: [], shiftMode: {}, lastTriggerVerticesDates: null, lastOriginalActToShift: []}; // cache for shiftData
		let verticesMap = new Map();

		// settings:

		let service = this;
		service.config = false; // config object
		service.trigger = false; // shift trigger event
		service.shiftFailed = false; // boolean if the shift went wrong
		service.shiftCorrection = {
			deltaX: null,
			lockedActivities: []
		}; // object that contains information on data that needs to be corrected
		service.deltaX = { start: 0, end: 0 };
		service.shiftData = {};
		service.activities = {};
		service.calendarData = new Map();
		service.fullShift = false;
		service.shiftInterval = 'none';
		service.shiftDate = shiftDate; // public method for dateshift
		service.shiftResult = new DateShiftResult();
		const shiftIntervals = {
			//week: 604800,   // too much cases where this is wrongly dedected (e.g. createforPlaningboard)
			day: DAY_IN_S,
			hour: HOUR_IN_S,
			minute: MIN_IN_S,
			second: SECOND
		};
		const dateShiftErrorMessages = {
			noDateAtAll: {
				messageCode: 'DS-001',
				defaultMessageText: '*Has no date(s) set! Correct the dates of entity with given ID to be able to shift'
			},
			durationNotZero: {
				messageCode: 'DS-002',
				defaultMessageText: '*Duration must not be zero! Change duration of entity with given ID to be able to shift'
			},
			startAfterEnd:{
				messageCode: 'DS-003',
				defaultMessageText: '*Has a start date set after the end date after shifting'
			},
			skipOverDate: {
				messageCode: 'DS-004',
				defaultMessageText: '*Skipped over date'
			},
			exceptionDayForStartOrEnd:{
				messageCode: 'DS-005',
				defaultMessageText: '*Start date or end date would be set to exception (non-working) day'
			},
			isLockedActitiy:{
				messageCode: 'DS-006',
				defaultMessageText: '*Activity is locked'
			},
			nonTriggerActivityDurationChanged:{
				messageCode: 'DS-007',
				defaultMessageText: '*Non-trigger activity duration would change'
			},
			originalStartAfterEnd: {
				messageCode: 'DS-008',
				defaultMessageText: '*Has a start date set after the end date before shifting! Correct the dates of entity with given ID to be able to shift'
			},
			nonTriggerActivityIsInvalid: {
				messageCode: 'DS-009',
				defaultMessageText: '*Activity would be invalid after shifting'
			}/* ,
			originalStartAfterEndAutoCorrect: {
				messageCode: 'DS-010',
				defaultMessageText: '*Has a start date set after the end date before shifting! Auto-corrected to start same as end to be able to shift'
			} */
		};
		// endregion

		// region Public methods

		/**
		 * @ngdoc function
		 * @name shiftDate
		 * @description Shift the activity with deltaX and shift all depending activities.
		 *
		 * @param { Arrray } activities: array of activities
		 * @param { Array } relations: array of relations
		 * @param { Object } trigger: activity which triggered the dateshift
		 * @param { Object } config: includes all necessary config attributes for shifting.
		 * @param { Map } calendarData: includes array of data for each calendar.
		 * @param { Number } calendarData[].Id: Id of the calendar data. Needs to match the calendar id of the activity.
		 * @param { Number[] } calendarData[].WeekendDays: Array of iso weekdays that are non working days.
		 * @param { Number[] } calendarData[].ExceptionDays: Array of days as integer (in the format of YYYYMMDD) that are exception days.
		 * @param { Number[] } calendarData[].NonExceptionDays: Array of days as integer (in the format of YYYYMMDD) that are working days even if they are non working days according to WeekendDays.
		 * @param { Object } shiftOptions: Includes property shiftVariant includes shiftMode e.g. 'startShift', 'endShift' or 'fullShift'
		 * @param { String } shiftOptions.shiftVariant: Property consisting of current shiftMode having possible values of 'startShift', 'endShift' or 'fullShift'
		 *
		 * @return { Object } dateShiftResult: Result object including multiple properties
		 * @return { Array } dateShiftResult.activities: List of activity that matches the passed acitivities (see above) modified by date shift.
		 * @return { Bool } dateShiftResult.shiftCorrected: Flag to indicate whether the shoift corrected invalid data.
		 **/
		function shiftDate(activities, relations, trigger, config, calendarData, shiftOptions) {
			resetData();

			let _relations = [];
			service.config = JSON.parse(JSON.stringify(config)); // create new object instance
			service.trigger = _.cloneDeep(trigger);
			service.trigger[service.config.start] = moment(service.trigger[service.config.start]).utc();
			service.trigger[service.config.end] = moment(service.trigger[service.config.end]).utc();

			service.fullShift = shiftOptions.fullShift || shiftOptions.shiftVariant === 'fullShift';

			service.originalMode = service.config.mode;

			if (service.originalMode === 'fullPush') {
				service.config.mode = 'both'; // 'fullPush' is a mix of 'both' and 'push' modes
			}

			validateCalendarData(calendarData);
			let foundInterval = 'none';

			// only setActivities (refresh the vertices and relations) when different data is available
			// checking if the reference is still the same. if not, resetDateshift has been triggered (on change of trigger entity, on load of new data, change on data and so on)
			// if activities changed -> relations need to be set anew too!
			if ((lastDateShiftData.activities[0] !== activities[0] || _.isNil(service.shiftData.startVertex) || !_.isEqual(lastDateShiftData.shiftMode, shiftOptions.shiftVariant))) {
				_relations = relations;
				lastDateShiftData = { activities, relations: _relations, shiftMode: shiftOptions.shiftVariant, lastTriggerVerticesDates: null};
				setActivities(activities, _relations, service.trigger);
				lastDateShiftData.lastOriginalActToShift = deepCopy(service.activities);
				foundInterval = detectLastValidShiftInterval(shiftOptions.shiftVariant);
			} else {
				_relations = lastDateShiftData.relations;

				// set the calendar id to temp for the calculations!
				service.activities.filter(activity => !!activity._tempCalendarId).forEach(activity => activity[service.config.calendar] = activity._tempCalendarId);

				foundInterval = detectLastValidShiftInterval(shiftOptions.shiftVariant);
				if (!_.isEqual(service.shiftData.startVertex.id, trigger[service.config.id]) && !_.isUndefined(verticesMap.get(trigger[service.config.id]))) {
					service.shiftData.endVertex = verticesMap.get(trigger[service.config.id]).endVertex;
					service.shiftData.startVertex = verticesMap.get(trigger[service.config.id]).startVertex;
				}

				lastDateShiftData.lastTriggerVerticesDates = {
					startVertexDate: moment(service.shiftData.startVertex.date),
					endVertexDate: moment(service.shiftData.endVertex.date)
				};

				service.shiftData.startVertex.date.set(service.shiftData.startVertex.originalDate.toObject());
				service.shiftData.endVertex.date.set(service.shiftData.endVertex.originalDate.toObject());
			}

			service.shiftInterval = foundInterval;

			// calculate deltaX
			calculateDeltaX(service.activities, shiftOptions);
			// account for invalid data
			evaluateTrigger();
			// before shifting -> check if it was cancelled
			if (service.shiftResult.shiftCancelled) {
				// set result to passed activities -> nothing has changed
				service.shiftResult.activities = activities;
				service.shiftResult.changedActivities = service.activities.filter(activity => activity.hasChanged);
				return service.shiftResult;
			}
			// start shifting
			startShifting();

			function startShifting() {
				// if both are locked, don't shift
				if (service.shiftData.startVertex.isLocked && service.shiftData.endVertex.isLocked) {
					// mark activity as has changed!
					service.shiftData.startVertex.addTime(0);
					return;
				}

				if (service.deltaX.start !== 0 && service.deltaX.end === 0) {
					// startVertex
					if (service.deltaX.start < 0) {
						shiftPrevRoutine(service.shiftData.startVertex, 'prevEdges', service.deltaX.start);
					} else {
						shiftNextRoutine(service.shiftData.startVertex, 'nextEdges', service.deltaX.start); // todo: special behaviour - compare start < end
					}
				} else if (service.deltaX.start === 0 && service.deltaX.end !== 0) {
					// endVertex
					if (service.deltaX.end < 0) {
						shiftPrevRoutine(service.shiftData.endVertex, 'prevEdges', service.deltaX.end); // todo: special behaviour - compare start < end
					} else {
						shiftNextRoutine(service.shiftData.endVertex, 'nextEdges', service.deltaX.end);
					}
				} else {
					if (service.deltaX.start < 0) {
						// trigger start
						shiftPrevRoutine(service.shiftData.startVertex, 'prevEdges', service.deltaX.start);

						// trigger end
						shiftPrevRoutine(service.shiftData.endVertex, 'prevEdges', service.deltaX.end);
					} else {
						// trigger end
						shiftNextRoutine(service.shiftData.endVertex, 'nextEdges', service.deltaX.end);

						// trigger start
						shiftNextRoutine(service.shiftData.startVertex, 'nextEdges', service.deltaX.start);
					}
				}
			}

			if (service.shiftFailed) {
				let activityCache;
				if (activities.length <= 50000) {
					activityCache = deepCopy(activities);
				} else {
					activityCache = _.cloneDeep(activities);
				}

				// set all locked activities
				_.forEach(activityCache.filter(function findAct(act) {
					return service.shiftCorrection.lockedActivities.includes(act[service.config.id]);
				}), function setActLocked(lockedAct) {
					lockedAct[service.config.isLocked] = true;
				});
				setActivities(activityCache, _relations, service.trigger);
				// set deltaX to new values
				if (!_.isNil(service.shiftCorrection.deltaX)) {
					if (service.deltaX.start !== 0 && service.deltaX.end !== 0) {
						service.deltaX.start = service.shiftCorrection.deltaX;
						service.deltaX.end = service.shiftCorrection.deltaX;
					} else if (service.deltaX.start !== 0 && service.deltaX.end === 0) {
						service.deltaX.start = service.shiftCorrection.deltaX;
					} else if (service.deltaX.start === 0 && service.deltaX.end !== 0) {
						service.deltaX.end = service.shiftCorrection.deltaX;
					}
				}
				evaluateTrigger();
				service.shiftFailed = false;
				startShifting();
			}

			const changedActivities = service.activities.filter(activity => activity.hasChanged);
			const isShiftValid = isShiftValidCheck(changedActivities, lastDateShiftData.lastOriginalActToShift, trigger);

			// modify dateshift result:
			if (!isShiftValid) {
				service.shiftResult.activities = activities;
				service.shiftResult.changedActivities = [];
			} else {
				// set the calendar id to the original one before returnig the result!
				service.activities.filter(activity => !!activity._originalCalendarId).forEach(activity => activity[service.config.calendar] = activity._originalCalendarId);
				service.shiftResult.activities = service.activities;

				service.shiftResult.changedActivities = changedActivities;

			}
			return service.shiftResult;
		}
		function isShiftValidCheck(activities, originalActivities, trigger) {

			let originalActivitiesMap = new Map(originalActivities.map(ogAct => [ogAct.Id, ogAct]));

			activities.forEach(activity => {
				const originalActivity = originalActivitiesMap.get(activity.Id);
				const origintalActivityCalender = getCalendarById(originalActivity[service.config.calendar]);
				const activityCalendar = getCalendarById(activity[service.config.calendar]);

				const originalActivityStart = moment(originalActivity[service.config.start]);
				const originalActivityEnd = moment(originalActivity[service.config.end]);


				// #region check start date after end date (OG & SH)
				if (originalActivityStart.isAfter(originalActivityEnd)) {
					let originalActivityWhichIsAfterStart = `StartDate: ${originalActivityStart.toString()}, EndDate: ${originalActivityEnd.toString()}`;
					service.shiftResult.addMessage(dateShiftErrorMessages.originalStartAfterEnd, 'error', originalActivity.CompositeId, `${originalActivityWhichIsAfterStart}`);
				} else if (activity[service.config.start].isAfter(activity[service.config.end])) {
					let activityWhichIsAfterStart = `StartDate: ${activity[service.config.start]}, EndDate: ${activity[service.config.end]}`;
					service.shiftResult.addMessage(dateShiftErrorMessages.startAfterEnd, 'error', activity.CompositeId, `${activityWhichIsAfterStart}`);
				}
				// #endregion

				// #region check start or end on exception (SH)
				let { isStartDateException, isEndDateException } = isMidnightException(activity[service.config.start], activity[service.config.end], activityCalendar);
				if (isStartDateException || isEndDateException) {
					let startExceptionMessage = isStartDateException ? `StartDate: ${activity[service.config.start].toString()}` : '';
					let endExceptionMessage = isEndDateException ? `EndDate: ${activity[service.config.end].toString()}` : '';
					service.shiftResult.addMessage(
						dateShiftErrorMessages.exceptionDayForStartOrEnd,
						'error',
						activity.CompositeId,
						`${startExceptionMessage}
                  ${endExceptionMessage}`
					);
				}
				// #endregion

				// #region check activity locked (SH)
				if (activity[service.config.isLocked]) {
					service.shiftResult.addMessage(dateShiftErrorMessages.isLockedActitiy, 'error', activity.CompositeId);
				}
				// #endregion


				if (trigger.Id !== activity.Id) {
					// #region check activity invalid (SH)
					let isShiftedActivityInvalid = isActivityInvalid(activity[service.config.start], activity[service.config.end], activityCalendar);
					if (isShiftedActivityInvalid) {
						service.shiftResult.addMessage(dateShiftErrorMessages.nonTriggerActivityIsInvalid, 'error', activity.CompositeId);
					}
					// #endregion

					if (!isShiftedActivityInvalid) {
						// #region check duration changed
						let originalActivityDuration = 0;

						let areOrgDatesException = isMidnightException(originalActivityStart, originalActivityEnd, origintalActivityCalender);
						if (areOrgDatesException.isStartDateException && areOrgDatesException.isEndDateException) {
							originalActivityDuration = originalActivityEnd.diff(originalActivityStart, 's');
						} else {
							originalActivityDuration = diffWithoutException(originalActivityEnd, originalActivityStart, origintalActivityCalender);
						}

						let shiftActivityDuration = diffWithoutException(activity[service.config.end], activity[service.config.start], activityCalendar);
						if (originalActivityDuration !== shiftActivityDuration) {
							const originalDates = `OGStart: ${originalActivityStart.toString()} OGEnd: ${originalActivityEnd.toString()}`;
							const shiftedDates = `SHStart: ${activity[service.config.start].toString()} SHEnd: ${activity[service.config.end].toString()}`;
							const originalDurationInReadableFormat = `Original Duration: d:${moment.duration(originalActivityDuration, 's').asDays().toFixed(2)}`;
							const shiftDurationInReadableFormat = `Shifted Duration: d:${moment.duration(shiftActivityDuration, 's').asDays().toFixed(2)}`;

							service.shiftResult.addMessage(dateShiftErrorMessages.nonTriggerActivityDurationChanged, 'error', activity.CompositeId, `${originalDurationInReadableFormat}
                     ${shiftDurationInReadableFormat}
                     ${originalDates}
                     ${shiftedDates}
                     -----------------`
							);
						}
						// #endregion
					}
				}
			});

			// failed only if errors occur!
			return service.shiftResult.messages.filter(msg => msg.type === 'error').length === 0;
		}

		/**
		 * @ngdoc function
		 * @name deepCopy
		 * @description Private function that fast deep copies the objects that are instances of Object, Date, Map and Array as alternative to lodash cloneDeep.
		 * Use with caution! Objcets of other instances won't be copied! If needed can be expanded.
		 *
		 * @param {Object} obj - The object to be deep copied
		 * @returns {Object} - Deep copy of given object
		 **/
		function deepCopy(obj) {
			if (typeof obj !== 'object' || obj === null) {
				return obj;
			}

			if (obj instanceof moment) {
				return moment(new Date(obj).getTime());
			}

			if (obj instanceof Date) {
				return new Date(obj.getTime());
			}

			if (obj instanceof Map) {
				let map = new Map();
				obj.forEach((value, key) => {
					map.set(key, deepCopy(value));
				});
				return map;
			}

			if (obj instanceof Array) {
				return obj.reduce((arr, item, i) => {
					arr[i] = deepCopy(item);
					return arr;
				}, []);
			}

			if (obj instanceof Object) {
				return Object.keys(obj).reduce((newObj, key) => {
					if (obj[key] instanceof Date) {
						newObj[key] = new Date(obj[key].getTime());
					} else if (obj[key] instanceof moment) {
						newObj[key] = moment(new Date(obj[key]).getTime());
					} else if (obj[key] instanceof Map) {
						let map = new Map(obj[key]);
						obj[key].forEach((value, key) => {
							map.set(key, deepCopy(value));
						});
						newObj[key] = map;
					} else if (obj[key] instanceof Array) {
						newObj[key] = [...obj[key]];
						obj[key].forEach((item, index) => {
							if (item instanceof Date) {
								newObj[key][index] = new Date(item.getTime());
							} else if (item instanceof moment) {
								newObj[key][index] = moment(new Date(item).getTime());
							} else {
								newObj[key][index] = deepCopy(item);
							}
						});
					} else if (obj[key] instanceof Object) {
						newObj[key] = Object.assign({}, obj[key]);
					} else {
						newObj[key] = obj[key];
					}
					return newObj;
				}, {});
			}
		}

		/**
		 * @ngdoc function
		 * @name setActivities
		 * @description Sets the shiftData for the dateShift.
		 *
		 * @param activities
		 * @param _relations
		 */
		function setActivities(activities, _relations, trigger) {
			service.generatedSequenceData = generateSequenceData(activities, _relations, activities.find(act => act[service.config.id] === trigger[service.config.id]));

			// workaround only for testing!
			/* 			service.generatedSequenceData[0].actualData.activities.filter(x => x.StartDate > x.EndDate).forEach(x => {
							let additionalInfoString = `StartDate: ${x.StartDate}, EndDate: ${x.EndDate}`;
							service.shiftResult.addMessage(dateShiftErrorMessages.originalStartAfterEndAutoCorrect, 'warning', x.CompositeId, `${additionalInfoString}`);
							x.StartDate = x.EndDate
						}); */
			// end workaround

			const sequenceOfTrigger = service.generatedSequenceData.find(x => x.sequenceId.has(trigger[service.config.id])).actualData;
			const activitiesToShift = sequenceOfTrigger.activities;
			const relationsOfToShift = sequenceOfTrigger.relations;

			service.activities = deepCopy(activitiesToShift); // create new object instance
			_.forEach(service.activities, function setAct(activity) {
				// convert strings to moment
				activity[service.config.end] = moment(new Date(activity[service.config.end]).getTime()).utc();
				activity[service.config.start] = moment(new Date(activity[service.config.start]).getTime()).utc();
			});
			// build dateshift data
			service.shiftData = createDateshiftData(service.activities, relationsOfToShift, service.trigger);
		}

		function createTempCalendarForInvalidActivity(invalidActivity, activity) {
			if (invalidActivity) {
				// create temp calendar
				let calendarOfActivity = _.cloneDeep(getCalendarById(activity[service.config.calendar]));
				calendarOfActivity.Id = +('' + /[0-9]\w+/.exec(activity[service.config.id]) + calendarOfActivity.Id);

				activity._originalCalendarId = activity[service.config.calendar];
				activity[service.config.calendar] = activity._tempCalendarId = calendarOfActivity.Id;

				const isStartDateException = isDateExceptionForCalendar(activity[service.config.start], 'end', calendarOfActivity);
				if (isStartDateException) {
					const dateInInt = getIntFromDate(new Date(activity[service.config.start]));
					calendarOfActivity.NonExceptionDays.add(dateInInt);
					calendarOfActivity.ExceptionDays.delete(dateInInt);
				}

				const isEndDateException = isDateExceptionForCalendar(activity[service.config.end], 'start', calendarOfActivity);
				if (isEndDateException) {
					const dateInInt = getIntFromDate(new Date(activity[service.config.end]));
					calendarOfActivity.NonExceptionDays.add(dateInInt);
					calendarOfActivity.ExceptionDays.delete(dateInInt);
				}

				service.calendarData.set(calendarOfActivity.Id, calendarOfActivity);
				invalidActivity = false;
			}
			return invalidActivity;
		}

		/**
		 * @ngdoc function
		 * @name createDateshiftData
		 * @description Generates the dateShiftData.
		 *
		 * @param activities
		 * @param relations
		 * @param trigger
		 * @returns trigger as vertex object with his edges.
		 */
		function createDateshiftData(activities, relations, trigger) {
			// reset vertices cache
			verticesMap = new Map();
			// create a map out of relations array for performance
			let relationsMap = new Map(relations.map((relation) => [relation.PredecessorFk, relation]));
			// region trigger vertex

			// select trigger
			let triggerActivity = activities.find(function findTrgAct(act) {
				return act[service.config.id] === trigger[service.config.id];
			});

			const triggerCalendar = service.calendarData.get(triggerActivity[service.config.calendar]) || service.calendarData.get('default');
			let invalidTrigger = isActivityInvalid(triggerActivity[service.config.start], triggerActivity[service.config.end], triggerCalendar);
			invalidTrigger = createTempCalendarForInvalidActivity(invalidTrigger, triggerActivity);
			let minDeltaXForTrigger = invalidTrigger ? triggerActivity[service.config.end].diff(triggerActivity[service.config.start], 'seconds') : undefined;
			// create the two trigger vertices and DON'T connect them
			let addedVerticesMap = new Map();
			let vertices = {};
			let triggerStartVertex = new Vertex(true, triggerActivity, invalidTrigger, minDeltaXForTrigger, true);
			let triggerEndVertex = new Vertex(false, triggerActivity, invalidTrigger, minDeltaXForTrigger, true);

			vertices[triggerActivity[service.config.id] + startPointPrefix] = triggerStartVertex;
			addedVerticesMap.set(vertices[triggerActivity[service.config.id] + startPointPrefix].id, vertices[triggerActivity[service.config.id] + startPointPrefix]);
			vertices[triggerActivity[service.config.id] + endPointPrefix] = triggerEndVertex;

			// endregion

			// region create vertices

			// create all other activies and connect them
			activities.forEach(activity => {
				let activityStartVertex, activityEndVertex;
				if (addedVerticesMap.get(activity[service.config.id])) {
					activityStartVertex = vertices[activity[service.config.id] + startPointPrefix];
					activityEndVertex = vertices[activity[service.config.id] + endPointPrefix];
					activity[service.config.start] = activityStartVertex.date;
					activity[service.config.end] = activityEndVertex.date;
				} else {
					let outputObject = { diffWithoutExceptionVal: 0 };
					let invalidActivity = isActivityInvalid(activity[service.config.start], activity[service.config.end], getCalendarById(activity[service.config.calendar]), outputObject);

					invalidActivity = createTempCalendarForInvalidActivity(invalidActivity, activity);

					const minDeltaXForActivity = invalidActivity ? activity[service.config.end].diff(activity[service.config.start], 's') : undefined;

					activityStartVertex = new Vertex(true, activity, invalidActivity, minDeltaXForActivity, false);
					activityEndVertex = new Vertex(false, activity, invalidActivity, minDeltaXForActivity, false);
					vertices[activity[service.config.id] + startPointPrefix] = activityStartVertex;
					vertices[activity[service.config.id] + endPointPrefix] = activityEndVertex;
					if (activity[service.config.id] !== trigger[service.config.id]) {
						let minTime = outputObject.diffWithoutExceptionVal;
						activityStartVertex.nextEdges.push(new Edge(relationsMap.get(activityEndVertex.id), activityEndVertex, false, true, invalidActivity ? activityEndVertex.minDeltaX : minTime));
						activityEndVertex.prevEdges.push(new Edge(relationsMap.get(activityStartVertex.id), activityStartVertex, false, true, invalidActivity ? activityStartVertex.minDeltaX : minTime));
					}
				}

				// region cache vertices

				verticesMap.set(activity[service.config.id], {
					startVertex: activityStartVertex,
					endVertex: activityEndVertex
				});

				// endregion
			});

			// endregion

			// region create edges

			// add all edges
			let uniqueRelations = _.uniqWith(relations, function filterUniqRel(thisRel, otherRel) {
				return thisRel[service.config.prevEdgeKey] === otherRel[service.config.prevEdgeKey] &&
					thisRel[service.config.nextEdgeKey] === otherRel[service.config.nextEdgeKey];
			});
			_.forEach(uniqueRelations, function crtEdg(relation) {
				switch (relation[service.config.relationType]) {
					case 1: // Interlocked relation
						processInterlockedRelation(relation, vertices, relations);
						break;
					default: // 0 = Sequential relation; 2 = Backward Lock relation; 3 = Forward Lock relation; 4 = Full Lock relation;
						processSequentialRelation(relation, vertices);
						break;
				}
			});

			// endregion

			// region validate edges

			// finally, calculate edges and remove own connecting edge!
			// #117943: Handle interlocked relations: due to interlocked activities: All interlocked activities must be checked as well!
			let interlockedStartVertices = [triggerStartVertex].concat(triggerStartVertex.interlockedVertices);
			let interlockedEndVertices = [triggerEndVertex].concat(triggerEndVertex.interlockedVertices);
			let interlockedVertices = interlockedStartVertices.concat(interlockedEndVertices);
			_.forEach(interlockedVertices, (v) => {
				v.validateEdges('forward');
				v.validateEdges('backward');
			});
			_.forEach(interlockedVertices, (v) => v.separateVertex());

			// endregion

			return {
				startVertex: triggerStartVertex,
				endVertex: triggerEndVertex
			};
		}

		/**
		 * @ngdoc function
		 * @name processSequentialRelation
		 * @description Generates edges for vertices out of a sequential relation.
		 *
		 * @param { Object } relation: Relation object detailing start and end activity and how they are connected.
		 * @param { Vertex[] } vertices: List of vertices that the relation may reference.
		 */
		function processSequentialRelation(relation, vertices) {
			// for each relation select the two correct vertices
			let fromKey = relation[service.config.prevEdgeKey];
			let toKey = relation[service.config.nextEdgeKey];
			let fromVertex;
			let toVertex;
			switch (relation[service.config.relationKind]) {
				default: // Finish - Start is default
				case 1: // Finish - Start
					fromVertex = vertices[fromKey + endPointPrefix];
					toVertex = vertices[toKey + startPointPrefix];
					break;
				case 2: // Finish - Finish
					fromVertex = vertices[fromKey + endPointPrefix];
					toVertex = vertices[toKey + endPointPrefix];
					break;
				case 3: // Start - Finish
					fromVertex = vertices[fromKey + startPointPrefix];
					toVertex = vertices[toKey + endPointPrefix];
					break;
				case 4: // Start - Start
					fromVertex = vertices[fromKey + startPointPrefix];
					toVertex = vertices[toKey + startPointPrefix];
					break;
			}

			let relationType = relation[service.config.relationType];
			let fromCanShiftTo = relationType !== 3 && relationType !== 4; // any type but Forward Lock (3) and Full Lock (4)
			let toCanShiftFrom = relationType !== 2 && relationType !== 4; // any type but Backward Lock (2) and Full Lock (4)
			fromVertex.nextEdges.push(new Edge(relation, toVertex, false, fromCanShiftTo));
			toVertex.prevEdges.push(new Edge(relation, fromVertex, false, toCanShiftFrom));
		}

		/**
		 * @ngdoc function
		 * @name processInterlockedRelation
		 * @description Generates interlocked vertices for vertices out of an interlocked relation.
		 *
		 * @param { Object } relation: Relation object detailing two interlocked activities.
		 * @param { Vertex[] } vertices: List of vertices that the relation may reference.
		 * @param { Object[] } relations: List of other relations to check for duplicates and other interlocked vertices.
		 */
		function processInterlockedRelation(relation, vertices, relations) {
			// #117943: Handle interlocked relations
			let fromKey = relation[service.config.prevEdgeKey];
			// if any vertex already has interlocked vertices => skip this relation
			if (!_.isEmpty(vertices[fromKey + startPointPrefix].interlockedVertices)) {
				return;
			}
			let interLockedRelations = relations.filter((r) => {
				return !_.isNil(service.config.relationType) && r[service.config.relationType] === 1;
			});
			let interlockedActivityKeys = [relation[service.config.prevEdgeKey], relation[service.config.nextEdgeKey]];
			let lastIterationCount;
			do {
				lastIterationCount = interlockedActivityKeys.length;
				let relatedRelations = interLockedRelations.filter(function findInterlockedRelations(r) {
					return interlockedActivityKeys.includes(r[service.config.prevEdgeKey]) || interlockedActivityKeys.includes(r[service.config.nextEdgeKey]);
				});
				_.forEach(relatedRelations, function addNewActivityKey(r) {
					interlockedActivityKeys.push(r[service.config.prevEdgeKey]);
					interlockedActivityKeys.push(r[service.config.nextEdgeKey]);
				});
				// finally, make uniq
				interlockedActivityKeys = _.uniq(interlockedActivityKeys);
			} while (lastIterationCount < interlockedActivityKeys.length);
			let intStartVtc = interlockedActivityKeys.map(function getInterlockedStartVtx(interlockedActivityKey) {
				return vertices[interlockedActivityKey + startPointPrefix];
			});
			let intEndVtc = interlockedActivityKeys.map(function getInterlockedEndVtx(interlockedActivityKey) {
				return vertices[interlockedActivityKey + endPointPrefix];
			});
			_.forEach(intStartVtc, function linkInterlockedStartVtx(vtx) {
				let otherVertices = intStartVtc.filter(function getOtherVtx(oVtx) {
					return !_.isEqual(oVtx, vtx);
				});
				vtx.interlockedVertices.push(...otherVertices);
			});
			_.forEach(intEndVtc, function linkInterlockedEndVtx(vtx) {
				let otherVertices = intEndVtc.filter(function getOtherVtx(oVtx) {
					return !_.isEqual(oVtx, vtx);
				});
				vtx.interlockedVertices.push(...otherVertices);
			});
		}

		/**
		 * @ngdoc function
		 * @name isActivityInvalid
		 * @description Returns true if activity is entirely in an exception area
		 *
		 * @param {Moment} startDate
		 * @param {Moment} endDate
		 * @param {Object} calendar
		 *
		 * @returns {Boolean} true if invalid.
		 */
		function isActivityInvalid(startDate, endDate, calendar, outputObject = { diffWithoutExceptionVal: 0 }) {
			outputObject.diffWithoutExceptionVal = diffWithoutException(endDate, startDate, calendar);
			let { isStartDateException, isEndDateException } = isMidnightException(startDate, endDate, calendar);
			return !!(outputObject.diffWithoutExceptionVal === 0 && isStartDateException && isEndDateException);
		}

		// endregion

		// region Vertex

		/**
		 * @ngdoc Class
		 * @name Vertex
		 *
		 * @param {Boolean} startVertex - true if the vertex of start of the activity should be created; otherwise the vertex for the end is created
		 * @param activity - activity object with data
		 * @param {Boolean} invalid  - optional flag to mark a vertex as invalid; default is false
		 * @param {number} minDeltaX  - optional number for minimum shift in seconds in order to shift correctly (used together with invalid for now)
		 * @constructor
		 */
		let Vertex = function Vertex(startVertex, activity, invalid, minDeltaX, isTriggerVertex) {

			let date = startVertex ? activity[service.config.start] : activity[service.config.end];

			// date: (as reference!)
			this.id = activity[service.config.id]; // only for testing remove afterwards
			this.date = date; // type: moment()
			this.originalDate = moment(date); // type: moment()
			// additional properties:

			if (!_.isUndefined(lastDateShiftData.shiftMode) && isTriggerVertex) {
				switch (lastDateShiftData.shiftMode) {
					case 'fullShift':
						this.isLocked = IsLockedStart() || IsLockedFinish();
						break;
					case 'startShift':
						this.isLocked = IsLockedStart();
						break;
					case 'endShift':
						this.isLocked = IsLockedFinish();
						break;
					default:
						this.isLocked = IsLockedStart() || IsLockedFinish();
						break;
				}
			} else {
				this.isLocked = startVertex ? IsLockedStart() : IsLockedFinish();
			}

			this.skipException = startVertex ? 'end' : 'start';
			this.calendar = getCalendarById(activity && activity[service.config.calendar]);
			// edges:
			this.prevEdges = []; // type: Edge
			this.nextEdges = []; // type: Edge
			// vertices
			this.interlockedVertices = [];
			this.hasChanged = false;
			this.maxDeltaX = 0;
			this.minDeltaX = minDeltaX || 0;
			this.isInvalid = invalid || false;

			function IsLockedStart() {
				return !!activity[service.config.isLocked] ||
					!!activity[service.config.IsLockedStart] ||
					!!activity[service.config.IsLockedStartVirtual];
			}

			function IsLockedFinish() {
				return !!activity[service.config.isLocked] ||
					!!activity[service.config.IsLockedFinish] ||
					!!activity[service.config.IsLockedFinishVirtual];
			}
		};

		//#region shiftNextEdges
		/**
		 * @ngdoc function
		 * @name shiftNextEdges
		 * @description Shifts all next edges from vertex.
		 *
		 * @param deltaX - moved deltaX
		 */
		Vertex.prototype.shiftNextEdges = function shiftNextEdges(deltaX, propagateShiftForRelated, projectedNearestDate) {
			this.updateMaxDeltaX(deltaX);
			if (this.canShift(deltaX) && this.isShiftPossible(deltaX, 'forward')) {
				// if edge against shift direction invalid -> subtract distance from deltaX
				// deltaX is negative, prevEdgeDistance is positive
				deltaX += this.measureInvalidEdge('backward');

				const that = this;
				if (!projectedNearestDate) {
					projectedNearestDate = getProjectedDate(this, deltaX);
				}

				if (this.id !== service.trigger[service.config.id]) {
					if (this.prevEdges.length > 0 && !this.isLocked && propagateShiftForRelated) {
						const prevEdges = this.prevEdges
							.filter(edge => edge.vertex.id !== this.id
								&& edge.vertex.id !== service.trigger[service.config.id]);

						prevEdges.forEach(function shiftEdges(edge) {
							if (edge.canShift) {
								edge.vertex.shiftPrevEdgesRecursive(deltaX);
							}
						});
					}

					// validate if not trigger
					this.validateAndShift('prevEdges', deltaX);
				}

				if (this.nextEdges.length > 0) {
					_.forEach(this.nextEdges, function shiftEdges(edge) {
						if (edge.canShift) {
							const correctionDeltaX = correctDeltaXForEdge(that, edge.vertex, projectedNearestDate, deltaX, -1);
							let deltaForEdge = correctionDeltaX.deltaForEdge;
							let projectedEdgeDate = correctionDeltaX.projectedEdgeDate;
							edge.vertex.shiftNextEdges(deltaForEdge, edge.propagateShiftForRelated, projectedEdgeDate);
						}
					});
				}

			}
		};
		//#endregion

		//#region shiftNextEdgesRecursive
		/**
		 * @ngdoc function
		 * @name shiftNextEdgesRecursive
		 * @description Shifts all next edges recursive from vertex.
		 *
		 * @param deltaX - moved deltaX
		 */
		Vertex.prototype.shiftNextEdgesRecursive = function shiftNextEdgesRecursive(deltaX, projectedNearestDate) {
			this.updateMaxDeltaX(deltaX);
			if (this.canShift(deltaX)) {
				let { canShift, currentDeltaX } = recursiveShiftDeltaXCorrection(this, 'prevEdges', deltaX, true);
				if (this.nextEdges.length > 0) {
					const that = this;
					const currentDate = this.date;

					// initial calculation for trigger
					if (!projectedNearestDate || currentDeltaX !== deltaX) {
						projectedNearestDate = getProjectedDate(this, currentDeltaX);
					}

					if (canShift) {
						_.forEach(this.nextEdges, function shiftEdges(edge) {
							if (edge.canShift) {
								// #112666: Usecase a) invalid activity is in shift direction of trigger
								if (edge.isInvalid) {
									// if edge is invalid -> correct it; affects following shifts only!
									currentDeltaX += edge.vertex.date.diff(currentDate, 'seconds');
								}

								const correctionDeltaX = correctDeltaXForEdge(that, edge.vertex, projectedNearestDate, currentDeltaX, 1);
								edge.vertex.shiftNextEdgesRecursive(edge.vertex.isInvalid ? currentDeltaX : correctionDeltaX.deltaForEdge, correctionDeltaX.projectedEdgeDate);
							}
						});
					}
				}
				// validate if not trigger
				if (this.id !== service.trigger[service.config.id] && canShift) {
					this.validateAndShift('nextEdges', deltaX);
				}
			}
		};

		//#endregion

		//#region shiftPrevEdges
		/**
		 * @ngdoc function
		 * @name shiftPrevEdges
		 * @description Shifts all previous edges from vertex.
		 *
		 * @param deltaX - moved deltaX
		 */
		Vertex.prototype.shiftPrevEdges = function shiftPrevEdges(deltaX, propagateShiftForRelated, projectedNearestDate) {
			this.updateMaxDeltaX(deltaX);
			if (this.canShift(deltaX) && this.isShiftPossible(deltaX, 'backward')) {
				// if edge against shift direction invalid -> subtract distance from deltaX
				// deltaX is positive, nextEdgeDistance is negative
				deltaX += this.measureInvalidEdge('forward');

				const that = this;
				if (!projectedNearestDate) {
					projectedNearestDate = getProjectedDate(this, deltaX);
				}

				if (this.id !== service.trigger[service.config.id] && !this.isLocked) {
					if (this.nextEdges.length > 0 && propagateShiftForRelated) {
						const nextEdges = this.nextEdges
							.filter(edge =>
								edge.vertex.id !== this.id
								&& edge.vertex.id !== service.trigger[service.config.id]);

						nextEdges.forEach(function shiftEdges(edge) {
							if (edge.canShift) {
								edge.vertex.shiftNextEdgesRecursive(deltaX);
							}
						});
					}

					// validate if not trigger
					this.validateAndShift('nextEdges', deltaX);
				}

				if (this.prevEdges.length > 0 && !this.isLocked) {
					_.forEach(this.prevEdges, function shiftEdges(edge) {
						if (edge.canShift) {
							const correctionDeltaX = correctDeltaXForEdge(that, edge.vertex, projectedNearestDate, deltaX, -1);
							let deltaForEdge = correctionDeltaX.deltaForEdge;
							let projectedEdgeDate = correctionDeltaX.projectedEdgeDate;
							edge.vertex.shiftPrevEdges(deltaForEdge, edge.propagateShiftForRelated, projectedEdgeDate);
						}
					});
				}

			}
		};
		//#endregion

		//#region shiftPrevEdgesRecursive
		/**
		 * @ngdoc function
		 * @name shiftPrevEdgesRecursive
		 * @description Shifts all previous edges recursive from vertex.
		 *
		 * @param deltaX - moved deltaX
		 */
		Vertex.prototype.shiftPrevEdgesRecursive = function shiftPrevEdgesRecursive(deltaX, projectedNearestDate) {
			this.updateMaxDeltaX(deltaX);
			if (this.canShift(deltaX)) {
				let { canShift, currentDeltaX } = recursiveShiftDeltaXCorrection(this, 'nextEdges', deltaX, true);
				if (this.prevEdges.length > 0) {
					const that = this;
					const currentDate = this.date;

					if (!projectedNearestDate || currentDeltaX !== deltaX) {
						projectedNearestDate = getProjectedDate(this, currentDeltaX);
					}

					if (canShift) {
						_.forEach(this.prevEdges, function shiftEdges(edge) {
							if (edge.canShift && canShift) {
								// #112666: Usecase a) invalid activity is in shift direction of trigger
								if (edge.isInvalid) {
									// if edge is invalid -> correct it; affects following shifts only!
									currentDeltaX += edge.vertex.date.diff(currentDate, 'seconds');
								}

								const correctionDeltaX = correctDeltaXForEdge(that, edge.vertex, projectedNearestDate, currentDeltaX, 1);
								edge.vertex.shiftPrevEdgesRecursive(edge.vertex.isInvalid ? currentDeltaX : correctionDeltaX.deltaForEdge, correctionDeltaX.projectedEdgeDate);
							}
						});
					}
				}

				// validate if not trigger
				if (this.id !== service.trigger[service.config.id] && canShift) {
					this.validateAndShift('prevEdges', deltaX);
				}
			}
		};
		//#endregion


		function isDateExceptionForCalendar(date, skipException, calendar) {
			let dateForCheck = date;
			if (skipException === 'start' && moment(date).startOf('day').toDate().getTime() === date.toDate().getTime()) {
				dateForCheck = moment(date).add(-1, 's');
			}
			const exceptionCheckObj = isMidnightException(dateForCheck, dateForCheck, calendar);
			return skipException === 'start' && exceptionCheckObj.isEndDateException || skipException === 'end' && exceptionCheckObj.isStartDateException;
		}

		function getTempEdgeCalendars(currentVertex, relatedVertex, projectedCurrentDate, projectedEdgeDate) {
			let tempCurrentCalendar = _.cloneDeep(currentVertex.calendar);
			tempCurrentCalendar.ExceptionDays.delete(getIntFromDate(relatedVertex.originalDate.toDate()));
			tempCurrentCalendar.ExceptionDays.delete(getIntFromDate(currentVertex.originalDate.toDate()));
			if (projectedEdgeDate) {
				tempCurrentCalendar.ExceptionDays.delete(getIntFromDate(projectedEdgeDate.toDate()));
			}

			let tempRelatedCalendar = _.cloneDeep(relatedVertex.calendar);
			tempRelatedCalendar.ExceptionDays.delete(getIntFromDate(currentVertex.originalDate.toDate()));

			tempRelatedCalendar.ExceptionDays.delete(getIntFromDate(relatedVertex.originalDate.toDate()));
			if (projectedCurrentDate) {
				tempRelatedCalendar.ExceptionDays.delete(getIntFromDate(projectedCurrentDate.toDate()));
			}

			return {
				current: tempCurrentCalendar,
				related: tempRelatedCalendar
			};
		}

		/**
		 * @name correctDeltaXForEdge
		 * @description Adapts delta for related based on their calendars
		 *
		 * @param {Vertex} currentVertex
		 * @param {Vertex} relatedVertex
		 * @param {moment} projectedCurrentDate
		 * @param {number} currentDeltaX
		 * @param {number} directionOfRelation - 1 = related is nextEdge for current vertex, -1 = related is prevEdge for current vertex
		 * @returns {object} {deltaForEdge, projectedEdgeVertexDate}
		 */
		function correctDeltaXForEdge(currentVertex, relatedVertex, projectedCurrentDate, currentDeltaX, directionOfRelation) {
			const edgeCalendars = {current: currentVertex.calendar, related: relatedVertex.calendar};
			const deltaSign = currentDeltaX === 0 ? 1 : Math.sign(currentDeltaX);
			const skipExceptionForDelta = deltaSign > 0 ? 'start' : 'end';
			// #region calculate projected shift by related calendar and project related vertex date
			let deltaForEdge = diffWithoutException(projectedCurrentDate, currentVertex.originalDate, edgeCalendars.related, currentVertex.skipException);
			let projectedEdgeVertexDate = getProjectedDate(relatedVertex, deltaForEdge);
			// #endregion calculate projected shift by related calendar and project related vertex date

			// #region calculate original diff between original dates and projected dates for each calendar
 			const orgDiffByRelated = diffWithoutException(relatedVertex.originalDate, currentVertex.originalDate, edgeCalendars.related, skipExceptionForDelta);
			const orgDiffByCurrent = diffWithoutException(relatedVertex.originalDate, currentVertex.originalDate, edgeCalendars.current, skipExceptionForDelta);

			let projectedDiffByRelated = diffWithoutException(projectedEdgeVertexDate, projectedCurrentDate, edgeCalendars.related, skipExceptionForDelta);

			if (projectedDiffByRelated !== orgDiffByRelated) {
				projectedDiffByRelated = diffWithoutException(projectedEdgeVertexDate, projectedCurrentDate, getTempEdgeCalendars(currentVertex, relatedVertex).related, skipExceptionForDelta);
			}

			let projectedDiffByCurrent = diffWithoutException(projectedEdgeVertexDate, projectedCurrentDate, edgeCalendars.current, skipExceptionForDelta);

			if (projectedDiffByCurrent !== orgDiffByCurrent) {
				projectedDiffByCurrent = diffWithoutException(projectedEdgeVertexDate, projectedCurrentDate, getTempEdgeCalendars(currentVertex, relatedVertex).current, skipExceptionForDelta);
			}
			// #endregion calculate original diff between original dates and projected dates for each calendar

			while (directionOfRelation * deltaSign * (orgDiffByRelated - projectedDiffByRelated) > 0 || directionOfRelation * deltaSign * (orgDiffByCurrent - projectedDiffByCurrent) > 0) {
				let directionOfCorrection = 1;
				if (directionOfRelation * deltaSign * (orgDiffByRelated - projectedDiffByRelated) > 0) {
					directionOfCorrection = Math.sign(orgDiffByRelated - projectedDiffByRelated);
				} else {
					directionOfCorrection = Math.sign(orgDiffByCurrent - projectedDiffByCurrent);
				}
				deltaForEdge += directionOfCorrection * DAY_IN_S;
				projectedEdgeVertexDate = getProjectedDate(relatedVertex, deltaForEdge);
				projectedDiffByRelated = diffWithoutException(projectedEdgeVertexDate, projectedCurrentDate, edgeCalendars.related, skipExceptionForDelta);
				projectedDiffByCurrent = diffWithoutException(projectedEdgeVertexDate, projectedCurrentDate, edgeCalendars.current, skipExceptionForDelta);
			}

			return {
				deltaForEdge: deltaForEdge,
				projectedEdgeDate: projectedEdgeVertexDate
			}
		}

		function recursiveShiftDeltaXCorrection(vertex, compareWith, deltaX, canShift) {
			let canShiftRecursive = canShift;

			let previousChange = diffWithoutException(vertex.date, vertex.originalDate, vertex.calendar);
			let fullPushCalculation = service.originalMode === 'fullPush' && (compareWith === 'prevEdges' && deltaX - previousChange >= 0 || compareWith === 'nextEdges' && deltaX - previousChange <= 0);

			if (vertex.id !== service.trigger[service.config.id] && (service.config.mode === 'push' || fullPushCalculation) && !service.shiftFailed) {

				let direction = compareWith === 'prevEdges' ? -1 : 1;

				const relatedEdges = vertex[compareWith].filter(edge => edge.vertex.id !== vertex.id);// calculate only for not related to self!
				if (relatedEdges.length > 0) {
					const listOfDiffs = relatedEdges.map(edge => edge.vertex.date.toDate() - vertex.date.toDate());
					const minDiffToRelated = _.sortBy(listOfDiffs.filter(diff => direction * diff >= 0), diff => diff)[0];

					if (minDiffToRelated) {
						const relatedEdgeWithMinDiff = relatedEdges.find(edge => (edge.vertex.date.toDate() - vertex.date.toDate()) === minDiffToRelated);
						let projectedRelatedDate = getProjectedDate(relatedEdgeWithMinDiff.vertex, deltaX);
						let originalDiffWithMinTime = diffWithoutException(vertex.originalDate, relatedEdgeWithMinDiff.vertex.originalDate, vertex.calendar) + Math.sign(deltaX) * relatedEdgeWithMinDiff.minTime;
						canShiftRecursive = vertex.date.toDate() < projectedRelatedDate.toDate() && direction < 0 || vertex.date.toDate() > projectedRelatedDate.toDate() && direction > 0;

						if (canShiftRecursive) {
							deltaX = deltaX - (parseInt(originalDiffWithMinTime / shiftIntervals[service.shiftInterval]) * shiftIntervals[service.shiftInterval]);
						}
					}
				}

			}

			return { canShift: canShiftRecursive, currentDeltaX: deltaX };
		}

		function getProjectedDate(vertexForCalc, deltaX) {
			let nearestPossbleDate = moment.isMoment(vertexForCalc.originalDate) ? moment(vertexForCalc.originalDate.toDate().getTime()) : vertexForCalc.originalDate instanceof Date ? moment(vertexForCalc.originalDate.getTime()) : moment(vertexForCalc.originalDate);

			let skipExceptionByDelta = deltaX < 0 ? 'start' : 'end';

			let exceptionDeltaX;
			if (vertexForCalc.isInvalid) {
				let nextAvailableDay;
				if (deltaX < 0) {
					nextAvailableDay = getExceptionEdge(vertexForCalc.originalDate, skipExceptionByDelta, vertexForCalc.calendar);
					if (vertexForCalc.skipException === 'end') {
						nextAvailableDay = getExceptionEdge(nextAvailableDay.add(-vertexForCalc.minDeltaX, 's'), vertexForCalc.skipException, vertexForCalc.calendar);
					}
				} else {
					nextAvailableDay = getExceptionEdge(vertexForCalc.originalDate, skipExceptionByDelta, vertexForCalc.calendar);
					if (vertexForCalc.skipException === 'start') {
						nextAvailableDay = getExceptionEdge(nextAvailableDay.add(vertexForCalc.minDeltaX, 's'), vertexForCalc.skipException, vertexForCalc.calendar);
					}
				}

				exceptionDeltaX = nextAvailableDay.diff(vertexForCalc.originalDate, 'seconds');
				if (deltaX > 0 && exceptionDeltaX < deltaX || deltaX < 0 && exceptionDeltaX > deltaX) {
					exceptionDeltaX = deltaX;
				}
			} else {
				// deltaX and all weekends inbetween
				if (vertexForCalc.skipException === 'end') {
					exceptionDeltaX = deltaXWithExceptionTime(vertexForCalc.originalDate, deltaX, vertexForCalc.calendar, vertexForCalc.skipException);
				} else {
					exceptionDeltaX = deltaXWithExceptionTime(vertexForCalc.originalDate, deltaX, vertexForCalc.calendar);
				}
			}

			nearestPossbleDate.add(exceptionDeltaX, 'seconds');
			// calculate nearest moment then add diff of nearest moment

			if (!vertexForCalc.isInvalid || vertexForCalc.id === service.trigger[service.config.id]) {
				nearestPossbleDate = getExceptionEdge(nearestPossbleDate, vertexForCalc.skipException, vertexForCalc.calendar);
			}
			return nearestPossbleDate;
		}

		/**
		 * @ngdoc function
		 * @name validateAndShift
		 * @description Validates if the current shift is possible.
		 *
		 * @param { string } compareEdges: string of the edges to compare with
		 * @param { number } deltaX: number of seconds the vertex should be shifted (excluding exception times)
		 * @param { boolean } [simulate=false]: ATTENTION - does not really "simulate". It resets the dates of vertices to original date after "simulation"
		 * @param { boolean } [ignoreInterlocks=false]: flag
		 *
		 * @returns { number } number of seconds the vertex was actually shifted (excluding exception times)
		 */
		Vertex.prototype.validateAndShift = function validateAndShift(compareEdges, deltaX, simulate = false, ignoreInterlocks = false) {

			// region Interlocked Vertices

			// #117943: Handle interlocked relations
			// if there are interlocked vertices: simulate a shift for each of them first, then shift all of them by the min amount
			if (!_.isEmpty(this.interlockedVertices) && ignoreInterlocks === false) {
				let allInterlockedVertices = [this].concat(this.interlockedVertices);
				// simulate shifts for all interlocked vertices (including own)
				let interlockedShiftSimulation = allInterlockedVertices.map(function simulateShift(interlockedVertex) {
					return interlockedVertex.validateAndShift(compareEdges, deltaX, true, true);
				});
				// set the value of delta x to the (absolute!) min value of all simulated shifts.
				let newDeltaX = _.minBy(interlockedShiftSimulation, Math.abs);
				_.forEach(this.interlockedVertices, function shiftInterlockedVertices(interlockedVertex) {
					interlockedVertex.validateAndShift(compareEdges, newDeltaX, false, true);
				});
				// if deltaX has changed and is trigger => set dateshift failed
				if (newDeltaX !== deltaX && this.id === service.trigger[service.config.id]) {
					service.shiftFailed = true;
					service.shiftCorrection.deltaX = _.isNil(service.shiftCorrection.deltaX) ? newDeltaX : _.minBy([newDeltaX, service.shiftCorrection.deltaX], Math.abs);
				}
				deltaX = newDeltaX;
			}

			// endregion

			// region Set target date (tempShiftMoment)

			let tempShiftMoment = moment(this.date); // copy for shift validation
			let originalShiftMoment = moment(this.date);

			// if vertex has been shifted before, replace date by original date
			if (this.hasChanged) {
				tempShiftMoment = moment(this.originalDate); // copy for shift validation
				originalShiftMoment = moment(this.originalDate);
				this.date.set(this.originalDate.toObject());
			}
			tempShiftMoment = getProjectedDate(this, deltaX);
			let nearestMoment = tempShiftMoment;


			let that = this;
			// endregion

			// region Compare edges
			// validate minTime between vertices
			_.forEach(this[compareEdges], function compareEdge(edge) {
				let currentItemMoment = moment(edge.vertex.date);
				// #region when the edges are overlapping
				let originalDiff = diffWithoutException(edge.vertex.originalDate, originalShiftMoment, edge.calendar);
				if (compareEdges === 'nextEdges' && originalDiff < 0
					|| compareEdges === 'prevEdges' && originalDiff > 0
				) {
					currentItemMoment.add(deltaXWithExceptionTime(currentItemMoment, -originalDiff, edge.calendar, edge.vertex.skipException), 's');
				}
				// #endregion when the edges are overlapping

				let isAfter;
				if (originalShiftMoment.isSame(currentItemMoment)) {
					isAfter = deltaX < 0;
				} else {
					isAfter = !!originalShiftMoment.isAfter(currentItemMoment);
				}

				let itemMinTime = 0;
				let projectedTimeSpan = isAfter ? edge.minTime * 1 : edge.minTime * -1;
				itemMinTime = edge.vertex.isInvalid ? projectedTimeSpan : deltaXWithExceptionTime(currentItemMoment, projectedTimeSpan, edge.calendar, edge.vertex.skipException);
				currentItemMoment.add(itemMinTime, 'seconds');

				if (!edge.vertex.isInvalid) {
					let shiftIntervalCorectionDelta = calculateShiftIntervalCorrectionDelta(currentItemMoment, originalShiftMoment, compareEdges === 'nextEdges' ? edge.calendar : that.calendar);
					if (shiftIntervalCorectionDelta !== 0) {
						currentItemMoment.add(shiftIntervalCorectionDelta, 'seconds');
					}
				}


				if (isAfter && currentItemMoment.isAfter(nearestMoment)) {
					nearestMoment = currentItemMoment;
				} else if (!isAfter && currentItemMoment.isBefore(nearestMoment)) {
					nearestMoment = currentItemMoment;
				}
			});
			// endregion

			// region Final weekend skip

			// if nearestMoment on weekend: determine whether to jump to start/end of weekend
			let finalWeekendSkip;
			if (!this.isInvalid) {
				let skipException = this.skipException;

				const verticesOfValidated = verticesMap.get(this.id);
				const durationOfValidatedAct = verticesOfValidated.endVertex.originalDate.toDate().getTime() - verticesOfValidated.startVertex.originalDate.toDate().getTime();

				// special use case when duration of activity is 0 - calculate end date the same way as start date!
				if (skipException === 'start') {
					let { isEndDateException } = isMidnightException(null, nearestMoment, this.calendar);
					if (isEndDateException && skipException === 'start' && durationOfValidatedAct === 0) {
						skipException = 'end';
					}
				} else {
					let { isStartDateException } = isMidnightException(nearestMoment, null, this.calendar);
					if (isStartDateException && skipException === 'start' && durationOfValidatedAct === 0) {
						skipException = 'end';
					}
				}

				finalWeekendSkip = calculateExceptionTimeSpan(nearestMoment, skipException, this.calendar);
			}

			if (finalWeekendSkip) {
				nearestMoment.add(finalWeekendSkip, 'seconds');
			}

			// endregion

			// region validate shift result

			let finalDeltaX = nearestMoment.diff(this.date, 'seconds');

			// if shift is trigger and trigger has not reached the desired time -> shift has failed
			if (!tempShiftMoment.isSame(nearestMoment) && this.id === service.trigger[service.config.id]) {
				service.shiftFailed = true;
				service.shiftCorrection.deltaX = diffWithoutException(nearestMoment, originalShiftMoment, this.calendar);
			}

			if (this.minDeltaX > Math.abs(finalDeltaX)) {
				// unsucessful -> don't shift, set shift to failed and lock activity for next dateshift!
				finalDeltaX = 0;
				service.shiftFailed = true;
				service.shiftCorrection.lockedActivities.push(this.id);
			}
			if (this.isInvalid && Math.abs(finalDeltaX) > 0) {
				service.shiftResult.shiftCorrected = true;
			}

			// endregion

			if (!simulate) {
				this.addTime(finalDeltaX);
			} else {
				let skipExceptionTypeByDeltaX = deltaX < 0 ? 'start' : 'end';
				// return time difference of new and original date!
				return diffWithoutException(nearestMoment, this.originalDate, this.calendar, skipExceptionTypeByDeltaX);
			}
		};

		function calculateShiftIntervalCorrectionDelta(currentItemMoment, originalShiftMoment, calendar) {
			const actualShiftTime = currentItemMoment.diff(originalShiftMoment, 'seconds');
			const intervalUnit = service.shiftInterval !== 'auto' ? shiftIntervals[service.shiftInterval] : shiftIntervals['second'];
			let diffToFullInterval = Math.abs(actualShiftTime) % intervalUnit;
			let diffToFullIntervalInverse = intervalUnit - Math.abs(diffToFullInterval);
			if (actualShiftTime < 0) {
				diffToFullInterval *= -1;
			} else {
				diffToFullIntervalInverse *= -1;
			}
			if (Math.abs(diffToFullIntervalInverse) < Math.abs(diffToFullInterval)) {
				diffToFullInterval = diffToFullIntervalInverse;
			}

			let itemMinTime = 0;
			if (diffToFullInterval !== 0) {
				let invalid = isActivityInvalid(currentItemMoment, currentItemMoment, calendar);
				itemMinTime = invalid ? -diffToFullInterval : deltaXWithExceptionTime(currentItemMoment, -diffToFullInterval, calendar);
			}
			return itemMinTime;
		}

		/**
		 * @ngdoc function
		 * @name addTime
		 * @description Adds time to the vertex.
		 *
		 * @param deltaX
		 */
		Vertex.prototype.addTime = function addTime(deltaX) {
			if(deltaX !== 0) {
				this.date.add(deltaX, 'seconds');
				this.hasChanged = true;
				if (this.id !== service.trigger[service.config.id]) {
					this.maxDeltaX = Math.abs(deltaX) > Math.abs(this.maxDeltaX) ? deltaX : this.maxDeltaX;
				}
				let _self = this;
				_.forEach(service.activities, function setActChanged(activity) {
					if (activity[service.config.id] === _self.id) {
						activity.hasChanged = true;
					}
				});
			}
		};

		/**
		 * @ngdoc function
		 * @name canShift
		 * @description Checks if vertex needs shift
		 *
		 * @param { Number } deltaX
		 * @returns { Boolean } does vertex need shift
		 */
		Vertex.prototype.canShift = function canShift(deltaX) {
			let maxDeltaXAbs = Math.abs(this.maxDeltaX);
			return (maxDeltaXAbs === 0 || maxDeltaXAbs < Math.abs(deltaX)) && !this.isLocked;
		};

		/**
		 * @ngdoc function
		 * @name updateMaxDeltaX
		 * @description Updates maxDeltaX of the vertex according to current deltaX
		 *
		 * @param { Number } deltaX
		 */
		Vertex.prototype.updateMaxDeltaX = function updateMaxDeltaX(deltaX) {
			let deltaXAbs = Math.abs(deltaX);
			if (deltaXAbs <= Math.abs(this.maxDeltaX)) { // if the direction of shifting changed - reset maxDeltaX
				this.maxDeltaX = 0;
			}
		};

		/**
		 * @ngdoc function
		 * @name validateEdges
		 * @description Calculates the min time to adjacent edges recursively and sets invalid flag
		 * @param { String } direction: forward/backward
		 */
		Vertex.prototype.validateEdges = function validateEdges(direction) {
			if (service.shiftResult.shiftCancelled || this.isLocked) {
				return;
			}
			let adjacentEdges = this.getEdges(direction);
			let currentVertex = this;
			_.forEach(adjacentEdges, function validateAdjacentEdge(edge) {
				// only calculate mintime if it hasn't be calculated yet!
				if (_.isNil(edge.minTime)) {
					if (edge.vertex.id !== currentVertex.id) {
						// if not same activity -> minTime default of 0
						edge.minTime = 0;
					} else {
						// if same activity
						// 1.) check for missing date
						let isCurrentMoment = moment.isMoment(currentVertex.date) && currentVertex.date.isValid();
						let isEdgeMoment = moment.isMoment(edge.vertex.date) && edge.vertex.date.isValid();
						if (!isCurrentMoment && !isEdgeMoment) {
							service.shiftResult.addMessage(dateShiftErrorMessages.noDateAtAll, 'error', currentVertex.id);
							service.shiftResult.shiftCancelled = true;
							// stop current but finish loop!
							return;
						} else if (!isCurrentMoment) {
							currentVertex.date = moment(edge.vertex.date);
						} else if (!isEdgeMoment) {
							edge.vertex.date = moment(currentVertex.date);
						}
						// 2.) check for invalid dates (eg. end before start)
						let earlierDate;
						let laterDate;
						if (direction === 'forward') {
							earlierDate = currentVertex.date;
							laterDate = edge.vertex.date;
						} else if (direction === 'backward') {
							earlierDate = edge.vertex.date;
							laterDate = currentVertex.date;
						}
						if (earlierDate.isAfter(laterDate)) {
							// data cannot be corrected -> cancel dateshift
							service.shiftResult.addMessage(dateShiftErrorMessages.startAfterEnd, 'error', currentVertex.id);
							service.shiftResult.shiftCancelled = true;
							// stop current but finish loop!
							return;
						}
						// 3.) calculate min time
						let isInvalid = isActivityInvalid(earlierDate, laterDate, edge.calendar);
						// if invalid: set all to true and set min time to duration
						if (isInvalid) {
							/* let connectionDiffLate = laterDate.diff(earlierDate, 'seconds');
							let connectionDiffEarly = earlierDate.diff(laterDate, 'seconds');
							currentVertex.isInvalid = true;
							currentVertex.minDeltaX = (direction === 'forward') ? connectionDiffEarly : connectionDiffLate;
							edge.isInvalid = true;
							edge.minTime = (direction === 'forward') ? connectionDiffEarly : connectionDiffLate;
							edge.vertex.isInvalid = true;
							edge.vertex.minDeltaX = (direction === 'forward') ? connectionDiffLate : connectionDiffEarly; */
							let connectionDiff = laterDate.diff(earlierDate, 'seconds');
							currentVertex.isInvalid = true;
							currentVertex.minDeltaX = connectionDiff;
							edge.isInvalid = true;
							edge.minTime = connectionDiff;
							edge.vertex.isInvalid = true;
							edge.vertex.minDeltaX = connectionDiff;
						} else {
							edge.minTime = diffWithoutException(laterDate, earlierDate, edge.calendar);
						}
						// #113202: If diff is 0 -> skip is always end!
						if (edge.minTime === 0) {
							currentVertex.skipException = 'end';
							edge.vertex.skipException = 'end';
						}
					}
					let inversedEdge = edge.vertex.nextEdges.concat(edge.vertex.prevEdges).find(e => e.vertex === currentVertex);
					if (!_.isNil(inversedEdge)) {
						inversedEdge.minTime = edge.minTime;
						inversedEdge.isInvalid = edge.isInvalid;
					}
				}
				edge.vertex.validateEdges(direction);
			});
		};

		/**
		 * @ngdoc function
		 * @name separateVertex
		 * @description Separates a vertex from its own counterpart (start/end)
		 */
		Vertex.prototype.separateVertex = function separateVertex() {
			// #117943: Handle interlocked relations
			let startVertexEdge = this.prevEdges.find((e) => {
				return e.vertex.id === this.id;
			});
			let endVertexEdge = this.nextEdges.find((e) => {
				return e.vertex.id === this.id;
			});
			_.remove(this.prevEdges, (e) => {
				return e === startVertexEdge;
			});
			_.remove(this.nextEdges, (e) => {
				return e === endVertexEdge;
			});
		};

		/**
		 * @ngdoc function
		 * @name isShiftPossible
		 * @description Determines whether shift is possible based on potentially invalid edges.
		 *
		 * @param { number } deltaX: Required deltaX in seconds
		 * @param { string } direction: forward/backward
		 * @returns { boolean } Returns true if shift is possible otherwise false.
		 */
		Vertex.prototype.isShiftPossible = function isShiftPossible(deltaX, direction) {
			let shiftPossible = true;
			// #112666: Usecase c) invalid activity is against shift direction of trigger
			// validate forward/backward edges -> if invalid edge, check if shift is possible
			// #region we can work with invalid now - do we need this code?
			/* if (this.isInvalid) {
				let adjacentEdges = this.getEdges(direction);
				let invalidEdge = adjacentEdges.find(function findInvalidEdge(edg) {
					return edg.vertex.isInvalid;
				});
				if (!_.isNil(invalidEdge)) {
					let edgeDistance = this.date.diff(invalidEdge.vertex.date, 'seconds');
					shiftPossible = Math.abs(edgeDistance) <= Math.abs(deltaX);
				}
			} */
			return shiftPossible;
		};

		/**
		 * @ngdoc function
		 * @name measureInvalidEdge
		 * @description Measures the distance to an invalid vertex based on a direction.
		 *
		 * @param { string } direction: forward/backward
		 * @returns { number } Returns the distance to the invalid vertex.
		 * Returns 0 if no invalid vertex was found.
		 */
		Vertex.prototype.measureInvalidEdge = function measureInvalidEdge(direction) {
			// check edges (against shift direction)
			if (this.invalid) {
				let adjacentEdges = this.getEdges(direction);
				let invalidPrevEdge = adjacentEdges.find(function findEdge(edg) {
					return edg.vertex.isInvalid;
				});
				if (!_.isNil(invalidPrevEdge)) {
					return this.date.diff(invalidPrevEdge.vertex.originalDate, 'seconds');
				}
			}
			return 0;
		};

		/**
		 * @ngdoc function
		 * @name getEdges
		 * @description Returns adjacent edges based on a direction string.
		 * @param { String } direction: forward/backward
		 * @returns { Object[] } List of adjacent directions.
		 * Empty array if an invalid direction was passed.
		 */
		Vertex.prototype.getEdges = function getEdges(direction) {
			let adjacentEdges;
			switch (direction) {
				case 'forward':
					adjacentEdges = this.nextEdges;
					break;
				case 'backward':
					adjacentEdges = this.prevEdges;
					break;
				default:
					adjacentEdges = [];
					break;
			}
			return adjacentEdges;
		};

		// endregion

		/**
		 *
		 * @param {int} id
		 * @returns the calender for the id of the default-calender if undefined/null
		 */
		function getCalendarById(id) {

			if (_.isNil(id)) {
				return service.calendarData.get('default');
			}
			let cal = service.calendarData.get(id);

			if (!_.isNil(cal)) {
				return cal;
			}
			return service.calendarData.get('default');
		}

		// region Edge

		/**
		 * @ngdoc Class
		 * @name Edge
		 *
		 * @param { Object } relation - Relation the edge is based on
		 * @param { Object } relatedVertex - Vertex that is linked with this edge.
		 * @param { boolean } [isInvalid] - Flag to indicate if the edge is invalid. False by default.
		 * @param { boolean } [canShift] - Flag to indicate if the edge allows shifting its vertex. True by default.
		 *
		 * @constructor
		 */
		let Edge = function Edge(relation, relatedVertex, isInvalid = false, canShift = true, minTime) {
			if (_.isNil(minTime)) {
				this.minTime = !_.isNil(relation) ? relation[service.config.minTime] || 0 : null; // type: int
			} else {
				this.minTime = minTime;
			}
			this.vertex = relatedVertex; // type: Vertex
			this.calendar = getCalendarById(relation && relation[service.config.calendar]);
			this.isInvalid = isInvalid;
			this.canShift = canShift;
			this.propagateShiftForRelated = (relation && relation[service.config.propagateShiftForRelated]) || false;
		};

		// endregion

		// region Private methods

		// region Shift methods

		/* HELPER FUNCTIONS */
		/**
		 * @ngdoc function
		 * @name shiftPrevRoutine
		 * @description Does the shift routine for a negative deltaX shift.
		 *
		 * @param vertex
		 * @param triggerValidationKey
		 * @param deltaX
		 */
		function shiftPrevRoutine(vertex, triggerValidationKey, deltaX) {
			if (service.config.mode === 'left' || service.config.mode === 'both' || service.config.mode === 'push') {
				vertex.shiftPrevEdgesRecursive(deltaX);
			}
			// validate trigger
			vertex.validateAndShift(triggerValidationKey, deltaX);

			if (service.config.mode === 'right' || service.config.mode === 'both') {
				vertex.shiftNextEdges(deltaX, false, vertex.date);
			}
		}

		/**
		 * @ngdoc function
		 * @name shiftNextRoutine
		 * @description Does the shift routine for a positive deltaX shift.
		 *
		 * @param vertex
		 * @param triggerValidationKey
		 * @param deltaX
		 */
		function shiftNextRoutine(vertex, triggerValidationKey, deltaX) {
			if (service.config.mode === 'right' || service.config.mode === 'both' || service.config.mode === 'push') {
				vertex.shiftNextEdgesRecursive(deltaX);
			}
			// validate trigger
			vertex.validateAndShift(triggerValidationKey, deltaX);

			if (service.config.mode === 'left' || service.config.mode === 'both') {
				vertex.shiftPrevEdges(deltaX, false, vertex.date);
			}
		}


		function detectLastValidShiftInterval(shiftVariant) {
			let diff = 0;

			const triggerFromActivities = service.activities.find(function findTrgAct(activity) {
				return activity[service.config.id] === service.trigger[service.config.id];
			});

			if (shiftVariant === 'endShift') {
				diff = service.trigger[service.config.end].diff(triggerFromActivities[service.config.end], 's');
			} else {
				diff = service.trigger[service.config.start].diff(triggerFromActivities[service.config.start], 's');
			}

			let foundInterval = 'none';

			if (diff !== 0) {
				service.shiftInterval = 'none';
				let diffToInterval = 0;
				let absDiff = Math.abs(diff) + 1;// fix gannt/pb "1 sec issue" when dragging to past
				absDiff = Math.floor(absDiff / 10) * 10;
				foundInterval = Object.entries(shiftIntervals).sort((a, b) => a[1] + b[1]).find((interval) => {
					diffToInterval = absDiff % interval[1];
					return diffToInterval === 0;
				});

				foundInterval = _.isUndefined(foundInterval) || foundInterval[0] === 'minute' ? 'auto' : foundInterval[0];
			} else {
				foundInterval = service.shiftInterval !== 'none' ? service.shiftInterval : 'auto';
			}

			return foundInterval;
		}

		/**
		 * @ngdoc function
		 * @name calculateDeltaX
		 * @description Calculates the deltaX object.
		 *
		 * @param activities
		 */
		function calculateDeltaX(activities, shiftOptions) {
			// why not use startVertex?
			let triggerFromActivities = activities.find(function findTrgAct(activity) {
				return activity[service.config.id] === service.trigger[service.config.id];
			});

			// NaN should be turned to 0
			let startDiff = 0;
			let endDiff = 0;

			let smallestVaildIntervalInSeconds = shiftIntervals['second'];

			// no need to manipulate start date, diffWithoutException is always correct
			if (shiftOptions.shiftVariant !== 'endShift') {
				if (!service.shiftData.startVertex.isInvalid) {
					if (!service.fullShift) {
						let actEndToTriggerStart = diffWithoutException(triggerFromActivities[service.config.end], service.trigger[service.config.start], service.shiftData.startVertex.calendar);
						if (actEndToTriggerStart <= 0 || actEndToTriggerStart < smallestVaildIntervalInSeconds) {
							// prevent trigger start-end duration reach zero
							if (lastDateShiftData.lastTriggerVerticesDates) {
								startDiff = diffWithoutException(lastDateShiftData.lastTriggerVerticesDates.startVertexDate, triggerFromActivities[service.config.start], service.shiftData.startVertex.calendar, service.shiftData.startVertex.skipException);
							} else {
								startDiff = 0;
							}
						} else {
							startDiff = diffWithoutException(service.trigger[service.config.start], triggerFromActivities[service.config.start], service.shiftData.startVertex.calendar, service.shiftData.startVertex.skipException);
						}

					} else {
						startDiff = diffWithoutException(service.trigger[service.config.start], triggerFromActivities[service.config.start], service.shiftData.startVertex.calendar, service.shiftData.startVertex.skipException);
					}
				} else {
					startDiff = service.trigger[service.config.start].diff(triggerFromActivities[service.config.start], 's');
				}

				if (service.fullShift) {
					endDiff = startDiff;
				}
			} else if (shiftOptions.shiftVariant === 'endShift' && !service.shiftData.endVertex.isInvalid) {
				if (!service.shiftData.endVertex.isInvalid) {
					if (!service.fullShift) {
						let actStartToTriggerEnd = diffWithoutException(service.trigger[service.config.end], triggerFromActivities[service.config.start], service.shiftData.endVertex.calendar);
						if (actStartToTriggerEnd <= 0 || actStartToTriggerEnd < smallestVaildIntervalInSeconds) {
							// prevent trigger start-end duration reach zero
							if (lastDateShiftData.lastTriggerVerticesDates) {
								endDiff = diffWithoutException(lastDateShiftData.lastTriggerVerticesDates.endVertexDate, triggerFromActivities[service.config.end], service.shiftData.endVertex.calendar, service.shiftData.endVertex.skipException);
							} else {
								endDiff = 0;
							}
						} else {
							endDiff = diffWithoutException(service.trigger[service.config.end], triggerFromActivities[service.config.end], service.shiftData.endVertex.calendar, service.shiftData.endVertex.skipException);
						}

					} else {
						endDiff = diffWithoutException(service.trigger[service.config.end], triggerFromActivities[service.config.end], service.shiftData.endVertex.calendar, service.shiftData.endVertex.skipException);
					}
				} else {
					endDiff = service.trigger[service.config.end].diff(triggerFromActivities[service.config.end], 's');
				}

				if (service.fullShift) {
					startDiff = endDiff;
				}
			}

			if (startDiff === 0 && endDiff === 0) {
				// both 0 -> fullshift is true
				service.fullShift = true;
			}

			if (!service.fullShift) {
				let lengthDiff = diffWithoutException(triggerFromActivities[service.config.end], triggerFromActivities[service.config.start]);
				if (endDiff === 0 && startDiff > lengthDiff) {
					startDiff = lengthDiff;
					service.trigger[service.config.start] = moment(service.trigger[service.config.end]);
				} else if (startDiff === 0 && endDiff < lengthDiff * -1) {
					endDiff = lengthDiff * -1;
					service.trigger[service.config.end] = moment(service.trigger[service.config.start]);
				}
			}

			service.deltaX = {
				start: startDiff,
				end: endDiff
			};
		}

		/**
		 * @ngdoc function
		 * @name evaluateTrigger
		 * @description Modifies deltaX if trigger is invalid
		 */
		function evaluateTrigger() {
			// #113202: Check for missing trigger dates
			let startVtxDtSet = moment.isMoment(service.shiftData.startVertex.date) && service.shiftData.startVertex.date.isValid();
			let endVtxDtSet = moment.isMoment(service.shiftData.endVertex.date) && service.shiftData.endVertex.date.isValid();
			if (!startVtxDtSet && !endVtxDtSet) {
				service.shiftResult.addMessage(dateShiftErrorMessages.noDateAtAll, 'error', service.shiftData.startVertex.id);
				service.shiftResult.shiftCancelled = true;
				return;
			} else if (!startVtxDtSet) {
				service.shiftData.startVertex.date = moment(service.shiftData.endVertex.date);
				service.deltaX.start = service.deltaX.end;
			} else if (!endVtxDtSet) {
				service.shiftData.endVertex.date = moment(service.shiftData.startVertex.date);
				service.deltaX.end = service.deltaX.start;
			} else if (service.shiftData.startVertex.date.isAfter(service.shiftData.endVertex.date)) {
				service.shiftResult.addMessage(dateShiftErrorMessages.startAfterEnd, 'error', service.shiftData.startVertex.id);
				service.shiftResult.shiftCancelled = true;
			}
			// #113202: If trigger has same date!
			if (service.trigger[service.config.end].isSame(service.trigger[service.config.start])) {
				if (service.fullshift || service.deltaX.end !== 0) {
					service.shiftData.endVertex.skipException = 'end';
				} else {
					service.shiftData.startVertex.skipException = 'start';
				}
			}
			// #112666: Usecase b) if trigger is invalid
			/* if (service.shiftData.startVertex.isInvalid && !service.shiftData.startVertex.isLocked) {
				let triggerDuration = service.shiftData.endVertex.date.diff(service.shiftData.startVertex.date, 'seconds');
				let isShiftForward = (service.deltaX.start + service.deltaX.end > 0);
				if (isShiftForward) { // deltaX positive
					service.deltaX.end = service.deltaX.end >= triggerDuration ? service.deltaX.end : triggerDuration;
					service.deltaX.start = service.deltaX.end - triggerDuration;
					if (service.deltaX.start === 0) {
						let startVertexEdge = getExceptionEdge(service.shiftData.startVertex.date, 'end', service.shiftData.startVertex.calendar);
						service.shiftData.startVertex.addTime(startVertexEdge.diff(service.shiftData.startVertex.date, 'seconds'));
					}
				} else { // deltaX negative
					service.deltaX.start = service.deltaX.start <= triggerDuration * -1 ? service.deltaX.start : triggerDuration * -1;
					service.deltaX.end = service.deltaX.start + triggerDuration;
					if (service.deltaX.end === 0) {
						let endVertexEdge = getExceptionEdge(service.shiftData.endVertex.date, 'start', service.shiftData.endVertex.calendar);
						service.shiftData.endVertex.addTime(endVertexEdge.diff(service.shiftData.endVertex.date, 'seconds'));
					}
				}
			} */
		}

		// endregion

		// region Weekend calculations

		/**
		 * @ngdoc function
		 * @name deltaXWithWeekends
		 * @description provides a recalculated deltaX that moves the date of the provided vortex to a date
		 * that results in a diffWithoutException() between the original and projected date
		 * that matches the provided deltaX.
		 *
		 * @param { moment } date
		 * @param { number } deltaX
		 *
		 * @return { number }
		 */
		// eslint-disable-next-line no-unused-vars
		function deltaXWithWeekends(date, deltaX) {
			if (deltaX === 0) {
				return 0;
			}
			let weekenSpan = 0;
			let projectedDate = moment(date);
			// if is already on weekend: skip to shift direction
			let skipTime;
			if (deltaX > 0) {
				skipTime = calculateWeekendSpan(projectedDate, 'end');
			} else {
				skipTime = calculateWeekendSpan(projectedDate, 'start');
			}
			if (skipTime) {
				projectedDate.add(skipTime, 'seconds');
				weekenSpan += skipTime;
			}
			// add deltaX
			projectedDate.add(deltaX, 'seconds');
			let recursionStopper = 0;
			// add weekends until it reaches the same point
			while (diffWithoutWeekends(projectedDate, date) !== deltaX && recursionStopper < 100) {
				// add a weekend
				let skipWeekendDelta = (deltaX > 0) ? 172800 : (-172800);
				projectedDate.add(skipWeekendDelta, 'seconds');
				weekenSpan += skipWeekendDelta;
				recursionStopper++;
			}
			if (recursionStopper === 100) {
				console.warn('Recursion: Weekend dateshift caluclation was incorrect');
				return 0;
			}

			return weekenSpan + deltaX;
		}

		/**
		 * @ngdoc function
		 * @name diffWithoutWeekends
		 * @description Returns whether the passed date is on a weekend (Saturday and Sunday) or not.
		 * Analogue to moment().diff()
		 *
		 * @param { Moment } newDate
		 * @param { Moment } oldDate
		 *
		 * @return { number }
		 */
		function diffWithoutWeekends(newDate, oldDate) {
			// if it's the same week and the same weekend
			if (newDate.isSame(oldDate) || (newDate.isSame(oldDate, 'week') && isWeekend(newDate) && isWeekend(oldDate))) {
				return 0;
			}
			let weekendSpan = 0;
			let laterDate = newDate.isAfter(oldDate) ? newDate : oldDate;
			let earlierDate = newDate.isAfter(oldDate) ? oldDate : newDate;

			// count the number of weekends between two days
			function countFullWeekends(date1, date2) {
				// set weekDiff to 0
				let weekDiff = 0;
				let laterDate = date1.isBefore(date2) ? date2 : date1;
				let earlierDate = date1.isBefore(date2) ? date1 : date2;
				// if both dates are not in the same week: Count full weeks
				if (!date1.isSame(date2, 'week')) {
					// count full weeks by setting the date of earlier date to same as later date
					let earlierDateStartOfWeek = moment(earlierDate).startOf('week');
					weekDiff = Math.floor(Math.abs(laterDate.diff(earlierDateStartOfWeek, 'seconds')) / 604800);
					if (isWeekend(earlierDate)) {
						weekDiff--;
					}
				}
				return weekDiff;
			}

			let weekendCount = countFullWeekends(laterDate, earlierDate);
			// add weekends of both dates
			if (isWeekend(laterDate)) {
				weekendSpan -= calculateWeekendSpan(laterDate, 'start');
			}
			if (isWeekend(earlierDate)) {
				weekendSpan += calculateWeekendSpan(earlierDate, 'end');
			}
			// add full weekends between
			weekendSpan += weekendCount * 172800;
			// calculate original diff
			let diffOriginal = newDate.diff(oldDate, 'seconds');
			// subtract calculated weekends
			let result = Math.abs(diffOriginal) - weekendSpan;
			// return result or negative result
			return diffOriginal >= 0 ? result : result * -1;
		}

		/**
		 * @ngdoc function
		 * @name calculateWeekendSpan
		 * @description Returns the span between the passed date
		 * and the start/end (based on the passed destination) of the weekend in seconds.
		 * Returns null if the provided date is not on a weekend.
		 *
		 * @param { Moment } date
		 * @param { string } destination
		 *
		 * @return { number }
		 */
		function calculateWeekendSpan(date, destination) {
			if (!isWeekend(date)) {
				// special case?
				// monday midnight == weekend?
				let mondayMidnight = date.isoWeekday() === 1 ? date.isSame(moment(date).startOf('day')) : false;
				if (mondayMidnight && destination === 'start') {
					return -172800;
				} else {
					return null;
				}
			}
			let destinationDate;
			if (destination === 'start') {
				destinationDate = moment(date).isoWeekday(6).startOf('day');
			} else if (destination === 'end') {
				destinationDate = moment(date).isoWeekday(7).add(1, 'day').startOf('day');
			}
			return destinationDate.diff(date, 'seconds');
		}

		/**
		 * @ngdoc function
		 * @name isWeekend
		 * @description Returns whether the passed date is on a weekend (Saturday and Sunday) or not.
		 *
		 * @param { Moment } date
		 *
		 * @return { bool }
		 */
		function isWeekend(date) {
			return (date.isoWeekday() === 6 || date.isoWeekday() === 7);
		}

		// endregion

		// region Exception Days

		/**
		 * @ngdoc function
		 * @name calculateExceptionTimeSpan
		 * @description Returns the span between the passed date
		 * and the start/end (based on the passed destination) of the exception time in seconds.
		 * Returns null if the provided date is not during an exception time.
		 * If no destination is passed, both are combined.
		 *
		 * @param { Moment } date
		 * @param { string } destination
		 *
		 * @return { number }
		 */
		function calculateExceptionTimeSpan(date, destination, calendar) {
			let startDate;
			let destinationDate;
			if (_.isString(destination)) {
				startDate = date;
				destinationDate = getExceptionEdge(date, destination, calendar, false);
			} else {
				startDate = getExceptionEdge(date, 'start', calendar);
				destinationDate = getExceptionEdge(date, 'end', calendar);
			}
			return destinationDate.diff(startDate, 'seconds');
		}

		// count the number of weekend and exception days between two dates
		function countExceptionSpan(date1Mom, date2Mom, calendar) {
			let date1 = date1Mom instanceof Date ? date1Mom : date1Mom.toDate();
			let date2 = date2Mom instanceof Date ? date2Mom : date2Mom.toDate();

			if (date1 === date2 || !calendar) {
				return 0;
			}

			let earlierDate = date1 < date2 ? date1 : date2;
			let laterDate = date1 > date2 ? date1 : date2;

			// if date is already at the start of the day do NOT add extra day!
			if (new Date(earlierDate).setUTCHours(0, 0, 0, 0) !== earlierDate.getTime()) {
				earlierDate = new Date(earlierDate.getTime() + DAY_IN_MS);
			}

			let dayCount = 0;
			const startOfDayLater = (new Date(laterDate)).setUTCHours(0, 0, 0, 0);
			while (earlierDate.getTime() < laterDate.getTime()
				&& new Date(earlierDate).setUTCHours(0, 0, 0, 0) !== startOfDayLater
				&& earlierDate.getUTCDay() !== laterDate.getUTCDay()
			) {
				if (isExceptionTime(earlierDate, calendar)) {
					dayCount++;
				}
				earlierDate = new Date(earlierDate.getTime() + DAY_IN_MS);
			}

			const diffInDays = (laterDate.getTime() - earlierDate.getTime()) / DAY_IN_MS;

			if (diffInDays > 0) {
				// convert dates to int format
				const earlInt = getIntFromDate(earlierDate);
				const latInt = getIntFromDate(laterDate);

				const exDaysBetweenDates = [...calendar.ExceptionDays.values()].filter(exceptionDate => exceptionDate > earlInt && exceptionDate < latInt);
				const actualExDaysBetween = exDaysBetweenDates.filter(x => !calendar.NonExceptionDays.has(x) && !isWeekendDay(getDateFromInt(x), calendar));

				dayCount = dayCount + actualExDaysBetween.length + (isExceptionTime(earlierDate, calendar) ? 1 : 0);

				if (diffInDays >= 7) {
					const weekendDaysCount = calendar ? calendar.WeekendDays.size : 0;
					let weeksCount = diffInDays / 7;
					weeksCount = ((weeksCount * 10) % 10) > 5 ? Math.ceil(weeksCount) : Math.floor(weeksCount);
					dayCount = dayCount + (weeksCount * weekendDaysCount);

					const workingWeekendDays = [...calendar.NonExceptionDays.values()].filter(nonExceptionDate => nonExceptionDate > earlInt && nonExceptionDate < latInt)
						.filter(nonExBetween => {
							let dateFromInt = getDateFromInt(nonExBetween)
							return isWeekendDay(dateFromInt, calendar);
						});

					dayCount -= workingWeekendDays.length;

					if (isWeekendDay(laterDate, calendar)) {
						dayCount -= 1;
					}
				}
			}

			return dayCount * DAY_IN_S;
		}

		function getIntFromDate(date) {
			return ((date.getUTCFullYear() * 100) + date.getUTCMonth() + 1) * 100 + date.getUTCDate();
		}

		function getDateFromInt(dateInt) {
			let str = dateInt.toString();
			return new Date(`${str.substring(0, 4)}-${str.substring(4, 6)}-${str.substring(6)}`)
		}

		function isWeekendDay(date, calendar) {
			if (!calendar) {
				return false;
			}

			let dateIsoWeekday = (date.getUTCDay() + 6) % 7 + 1;
			return calendar.WeekendDays.has(dateIsoWeekday);
		}

		/**
		 * @ngdoc function
		 * @name deltaXWithExceptionTime
		 * @description provides a recalculated deltaX that moves the date of the provided vortex to a date
		 * that results in a diffWithoutException() between the original and projected date
		 * that matches the provided deltaX.
		 *
		 * @param { moment } date
		 * @param { number } deltaX
		 *
		 * @return { number }
		 */
		function deltaXWithExceptionTime(date, deltaX, calendar, skipExceptionType) {
			if (deltaX === 0) {
				return 0;
			}
			let exceptionSpan = 0;
			let projectedDate = moment(date);
			// if is already on an exception time: skip to shift direction
			let skipTime;
			if (!skipExceptionType) {
				if (deltaX > 0) {
					skipTime = calculateExceptionTimeSpan(projectedDate, 'end', calendar);
				} else {
					skipTime = calculateExceptionTimeSpan(projectedDate, 'start', calendar);
				}
				if (skipTime) {
					projectedDate.add(skipTime, 'seconds');
					exceptionSpan += skipTime;
				}
			}

			// store last projectedDate!
			let lastProjectedDate = projectedDate.clone();

			// add deltaX
			projectedDate.add(deltaX, 'seconds');

			let recursionStopper = 0;
			let lastDateCollection = [];

			// workaround to make the diffWithoutException calc only one time!
			let currentDiffWithoutException = 0;
			let diffWOExcpFn = (projectedDate, date, calendar) => {
				currentDiffWithoutException = diffWithoutException(projectedDate, date, calendar, skipExceptionType);
				return currentDiffWithoutException;
			}

			while ((diffWOExcpFn(projectedDate, date, calendar) !== deltaX || isExceptionTime(projectedDate, calendar)) && recursionStopper < 100) {
				lastDateCollection.push(lastProjectedDate);
				if (Math.abs(currentDiffWithoutException) > Math.abs(deltaX)) {
					service.shiftResult.addMessage(dateShiftErrorMessages.skipOverDate, 'info', service.trigger[service.config.id]);
					console.log('Skipped over date!');
				}
				// add all exception days inbetween
				let skipExceptionTimeAbsolute = countExceptionSpan(projectedDate, lastProjectedDate, calendar);
				// clone last projected Date
				lastProjectedDate = projectedDate.clone();
				if (skipExceptionTimeAbsolute > 0) {
					let skipExceptionTime = deltaX > 0 ? skipExceptionTimeAbsolute : skipExceptionTimeAbsolute * -1;
					projectedDate.add(skipExceptionTime, 'seconds');
					exceptionSpan += skipExceptionTime;
				} else {
					// todo: better code? Use getExceptionEdge?
					// if still exception: add skippedTime
					let skipDay = deltaX > 0 ? DAY_IN_S : -DAY_IN_S;
					projectedDate.add(skipDay, 'seconds');
					exceptionSpan += skipDay;
				}
				recursionStopper++;
			}

			if (recursionStopper === 100) {
				console.warn('Recursion: Exception dateshift caluclation was incorrect');
				return 0;
			}

			return exceptionSpan + deltaX;
		}

		/**
		 * @ngdoc function
		 * @name diffWithoutException
		 * @description Returns the time span between two dates compressed by the exception times inbetween.
		 * Analogue to moment().diff()
		 *
		 * @param { Moment } newDate
		 * @param { Moment } oldDate
		 *
		 * @return { number }
		 */
		function diffWithoutException(newDateMom, oldDateMom, calendar, skipException) {
			let newDate = newDateMom.toDate().getTime();
			let oldDate = oldDateMom.toDate().getTime();

			if (newDate === oldDate) {
				return 0;
			}
			// assign old/new to later/earlier
			let laterDate = newDate > oldDate ? newDateMom : oldDateMom;
			let earlierDate = newDate > oldDate ? oldDateMom : newDateMom;
			// move both dates to end/start of their exception period
			if (skipException) {
				earlierDate = getExceptionEdge(earlierDate, skipException, calendar, false);
				laterDate = getExceptionEdge(laterDate, skipException, calendar, false);
			} else {
				earlierDate = getExceptionEdge(earlierDate, 'end', calendar, false);
				laterDate = getExceptionEdge(laterDate, 'start', calendar, false);
			}
			if (laterDate < earlierDate) {
				return 0;
			}

			let newModifiedDate = newDate > oldDate ? laterDate.toDate().getTime() : earlierDate.toDate().getTime();
			let oldModifiedDate = newDate > oldDate ? earlierDate.toDate().getTime() : laterDate.toDate().getTime();
			let simpleDiff = (newModifiedDate - oldModifiedDate) / 1000; //'seconds'

			// exception time in seconds
			let inbetweenExceptionTime = countExceptionSpan(new Date(earlierDate), new Date(laterDate), calendar);

			// subtract calculated weekends
			let result = Math.abs(simpleDiff) - inbetweenExceptionTime;
			// return result or negative result
			return simpleDiff >= 0 ? result : result * -1;
		}

		/**
		 * @ngdoc function
		 * @name isExceptionTime
		 * @description Checks whether the passed date is during an excpetion time or not.
		 *
		 * @param { Moment } date
		 * @param { Object } calendar: Object containing the calendar data.
		 *
		 * @return { bool }
		 */
		function isExceptionTime(dateMom, calendar) {
			let date;
			if (_.isNumber(dateMom)) {
				date = new Date(dateMom);
			}

			if (moment.isMoment(dateMom)) {
				date = dateMom.toDate();
			}

			if (dateMom instanceof Date) {
				date = dateMom;
			}

			if (!_.isNil(calendar)) {
				const integerYear = date.getUTCFullYear();
				const integerMonth = (date.getUTCMonth() + 1);
				const integerDay = date.getUTCDate();

				const dateAsInteger = (integerYear * 100 + integerMonth) * 100 + integerDay;

				// #region isNonExceptionDay
				let isNonExceptionDay = calendar.NonExceptionDays.has(dateAsInteger);
				// #endregion isNonExceptionDay

				// #region isNonWorkingDay
				let isoWeekday = (date.getUTCDay() + 6) % 7 + 1;
				let isNonWorkingDay = calendar.WeekendDays.has(isoWeekday);

				// #endregion isNonWorkingDay

				// #region isExceptionDay
				let isExceptionDay = calendar.ExceptionDays.has(dateAsInteger);
				// #endregion isExceptionDay

				if (isNonWorkingDay) {
					return isNonWorkingDay && !isNonExceptionDay;
				} else {
					return isExceptionDay && !isNonExceptionDay;
				}
			} else {
				return false;
			}
		}

		/**
		 * @ngdoc function
		 * @name isMidnightException
		 * @description Checks whether the optional passed dates are during an exception time span.
		 * startdate will be checked for an expcetion day & enddate for exception day and midnight exception
		 * @param { Moment } startDateInput
		 * @param { Moment } endDateInput
		 * @param { Object } calendar: Object containing the calendar data.
		 *
		 * @return { Object } with boolean values for each start-/and endException
		 */

		function isMidnightException(startDateInput, endDateInput, calendar) {
			let startIsException = false;
			let endIsException = false;

			let startDate = false;
			let endDate = false;

			// make sure dates are UTC!
			if (startDateInput) {
				startDate = !moment.isMoment(startDateInput) || !startDateInput.isUTC() ? moment.utc(startDateInput) : startDateInput;
			}

			if (endDateInput) {
				endDate = !moment.isMoment(endDateInput) || !endDateInput.isUTC() ? moment.utc(endDateInput) : endDateInput;
			}

			if (startDate) {
				startIsException = isExceptionTime(startDate, calendar);
			}
			if (endDate) {
				let endDateTocheck = endDate;
				if (endDate.toDate().getTime() === moment(endDate).startOf('day').toDate().getTime()) {
					let endDateMinusOne = moment(endDate).add(-1, 's');

					if (!startDate || endDateMinusOne.toDate().getTime() > startDate.toDate().getTime()) {
						endDateTocheck = endDateMinusOne;
					}
				}
				endIsException = isExceptionTime(endDateTocheck, calendar);
			}

			return { isStartDateException: startIsException, isEndDateException: endIsException };
		}

		/**
		 * @ngdoc function
		 * @name getExceptionEdge
		 * @description Returns the start or end date of the current exception time span.
		 * Returns null if parameters are inncorrect.
		 *
		 * @param { Moment } date
		 * @param { string } destination
		 * @param { bool } returnStartOfDay optional; if true (=default) it returns the start of the day of the found ExceptionDay. Otherwise it returns the date with unchanged time-part
		 * *
		 * @return { Moment }
		 */
		function getExceptionEdge(date, destination, calendar, returnStartOfDay = true) {
			let resultDate = moment.isMoment(date) ? moment(date.toDate().getTime()) : date instanceof Date ? moment(date.getTime()) : moment(date);

			// TODO special case for midnight of day after exception edge!
			// Obsolete?
			// let isMidnightExceptionCheck = date.isSame(moment(date).startOf('day')) && isExceptionTime(moment(date).add(-1, 'day'), calendar);

			if (destination === 'start') {
				let { isEndDateException } = isMidnightException(null, date, calendar);
				if (!isEndDateException) {
					return resultDate;
				}
			} else if (!isExceptionTime(date, calendar)) {
				return resultDate;
			}

			let dayDirection;
			switch (destination) {
				case 'start':
					dayDirection = -1;
					break;
				case 'end':
					dayDirection = 1;
					break;
				default:
					dayDirection = null;
					break;
			}
			if (!resultDate.isValid() || _.isNil(dayDirection)) {
				return null;
			}

			let resultDateForCalc = resultDate.toDate().getTime();
			// start with skipping one day for midnight exception
			resultDateForCalc = resultDateForCalc + (dayDirection * DAY_IN_MS);

			let loopTimeout = 100;
			while (isExceptionTime(resultDateForCalc, calendar) && loopTimeout > 0) {
				resultDateForCalc = resultDateForCalc + (dayDirection * DAY_IN_MS);
				loopTimeout--;
			}
			// workaround to start on the beginning of the next exception day!
			if (dayDirection < 0) {
				resultDateForCalc = resultDateForCalc + (1 * DAY_IN_MS);
			}

			resultDate = moment.utc(resultDateForCalc);

			if (returnStartOfDay) {
				return resultDate.startOf('day');
			} else {
				return resultDate;
			}
		}

		// endregion

		/**
		 * @ngdoc function
		 * @name resetData
		 * @description Reset all data from dateshift.
		 *
		 **/
		function resetData() {
			service.config = false;
			service.trigger = false;
			service.calendarData.clear();
			service.shiftFailed = false;
			service.shiftCorrection = {
				deltaX: null,
				lockedActivities: []
			};
			service.shiftResult.resetResult();
		}

		/**
		 * @ngdoc function
		 * @name validateCalendarData
		 * @description Validates the type of calendar data in service and adds new calendar data
		 */
		function validateCalendarData(calendarData) {
			if (!_.isMap(service.calendarData)) {
				let tempCalendarData = new Map();
				if (_.isArray(service.calendarData)) {
					service.calendarData.forEach(data => tempCalendarData.set(data.Id, data));
				}
				service.calendarData = tempCalendarData;
			}

			if (_.isArray(calendarData)) {
				calendarData.forEach(data => service.calendarData.set(data.Id, data));
			}

			if (_.isMap(calendarData)) {
				let incommingCalendarData = new Map();
				[...calendarData.entries()].forEach(calendarEntry => {
					let entryKey = calendarEntry[0];
					let calendar = calendarEntry[1];
					let calCopyWithSets = Object.assign({}, calendar);
					for (let key in calendar) {
						// create set from array
						if (calendar[key] instanceof Array) {
							calCopyWithSets[key] = new Set(calendar[key]);
						}
					}
					incommingCalendarData.set(entryKey, calCopyWithSets);
				});

				service.calendarData = new Map([...incommingCalendarData, ...service.calendarData]);
			}
		}

		// endregion

		//#region sequence obj generation

		function buildSequence(relations, activities, sequenceRelations, sequenceActivities) {
			const actIdsMap = new Set(sequenceActivities.map(y => y[service.config.id]));
			let tempSequenceRelations = relations.filter(x => actIdsMap.has(x.PredecessorFk) || actIdsMap.has(x.SuccessorFk));

			if (sequenceRelations.length < tempSequenceRelations.length) {
				sequenceRelations = tempSequenceRelations;
				let sequenceRelationsIds = new Set([...sequenceRelations.map(x => x.SuccessorFk), ...sequenceRelations.map(x => x.PredecessorFk)]);
				sequenceActivities = activities.filter(searchedActivity => sequenceRelationsIds.has(searchedActivity.CompositeId));

				return buildSequence(relations, activities, sequenceRelations, sequenceActivities);
			}
			return {
				sequenceRelations: sequenceRelations,
				sequenceAcitivities: sequenceActivities
			};
		}

		function generateSequenceData(activities, relations, trigger) {
			const sequenceArray = [];

			let { sequenceRelations, sequenceAcitivities } = buildSequence(relations, activities, [], [trigger]);

			let sequence = {
				sequenceId: new Set(sequenceAcitivities.map(a => a.CompositeId)),
				actualData: {
					activities: sequenceAcitivities,
					relations: sequenceRelations
				}
			};

			sequenceArray.push(sequence);

			return sequenceArray;
		}
		//#endregion sequence obj generation

		// /### END ###/// of Vanilla JS Dateshift service

		/**
		 * only for debug purpose
		 * @returns a easy readable duration in the format DD HH:MM:SS
		 */
		// Number.prototype.toHHMMSS =
		// eslint-disable-next-line no-unused-vars
		function toHHMMSS() {
			let sec_num = Math.abs(this);
			let days = Math.floor(sec_num / 3600 / 24);
			sec_num -= days * 3600 * 24;
			let hours = Math.floor((sec_num) / 3600);
			sec_num -= hours * 3600;
			let minutes = Math.floor(sec_num / 60);
			sec_num -= minutes * 60;
			let seconds = sec_num;

			if (hours < 10) { hours = '0' + hours; }
			if (minutes < 10) { minutes = '0' + minutes; }
			if (seconds < 10) { seconds = '0' + seconds; }

			let res = days + ' ' + hours + ':' + minutes + ':' + seconds;

			if (this < 0)
				return '- ' + res;

			return res;
		}
	}
})(angular);
