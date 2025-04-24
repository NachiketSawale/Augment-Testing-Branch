(angular => {
	'use strict';

	var moduleName = 'platform';
	angular.module(moduleName).service('platformRefactoredDateshiftService', PlatformDateshiftService);
	PlatformDateshiftService.$inject = ['_', 'moment'];

	function PlatformDateshiftService(_, moment) {

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
		var DateShiftResult = function DateShiftResult() {
			this.resetResult();
		};

		DateShiftResult.prototype.resetResult = function resetResult() {
			this.activities = [];
			this.messages = [];
			this.shiftCorrected = false; // boolean if shift needed correction (invalid data within shift)
			this.shiftCancelled = false; // boolean if shift couldn't be done (invalid data within shift)
		};

		DateShiftResult.prototype.addMessage = function addMessage(message, type) {
			this.messages.push({message: message, type: type});
		};

		// endregion

		// endregion

		// region Global variables

		var startPointPrefix = 'S';
		var endPointPrefix = 'E';
		let lastDateShiftData = {activities: [], relations: []}; // cache for shiftData
		let verticesMap = new Map();

		// settings:

		var service = this;
		service.config = false; // config object
		service.trigger = false; // shift trigger event
		service.shiftFailed = false; // boolean if the shift went wrong
		service.shiftCorrection = {
			deltaX: null,
			lockedActivities: []
		}; // object that contains information on data that needs to be corrected
		service.deltaX = {start: 0, end: 0};
		service.shiftData = {};
		service.activities = {};
		service.calendarData = new Map();
		service.fullShift = false;
		service.shiftDate = shiftDate; // public method for dateshift
		service.shiftResult = new DateShiftResult();

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
		 *
		 * @return { Object } dateShiftResult: Result object including multiple properties
		 * @return { Array } dateShiftResult.activities: List of activity that matches the passed acitivities (see above) modified by date shift.
		 * @return { Bool } dateShiftResult.shiftCorrected: Flag to indicate whether the shoift corrected invalid data.
		 **/
		function shiftDate(activities, relations, trigger, config, calendarData) {
			resetData();

			var _relations = _.cloneDeep(relations);
			service.config = JSON.parse(JSON.stringify(config)); // create new object instance
			service.trigger = _.cloneDeep(trigger);
			service.trigger[service.config.start] = moment(service.trigger[service.config.start]).utc();
			service.trigger[service.config.end] = moment(service.trigger[service.config.end]).utc();

			validateCalendarData(calendarData);

			// only setActivities (refresh the vertices and relations) when different data is available
			if (!_.isEqual(lastDateShiftData.activities, activities) || !_.isEqual(lastDateShiftData.relations,_relations)) {
				lastDateShiftData = {activities, relations: _relations};
				setActivities(activities, _relations);
			} else {
				if (!_.isEqual(service.shiftData.startVertex.id, trigger[service.config.id]) && !_.isUndefined(verticesMap.get(trigger[service.config.id]))) {
					service.shiftData.endVertex = verticesMap.get(trigger[service.config.id]).endVertex;
					service.shiftData.startVertex = verticesMap.get(trigger[service.config.id]).startVertex;
				}
				service.shiftData.startVertex.date.set(service.shiftData.startVertex.originalDate.toObject());
				service.shiftData.endVertex.date.set(service.shiftData.endVertex.originalDate.toObject());
			}

			// calculate deltaX
			calculateDeltaX(service.activities);
			// account for invalid data
			evaluateTrigger();
			// before shifting -> check if it was cancelled
			if (service.shiftResult.shiftCancelled) {
				// set result to passed activities -> nothing has changed
				service.shiftResult.activities = activities;
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
						shift(service.shiftData.startVertex, service.deltaX.start, shiftStartEndMode.shiftPreviousEdges);
					} else {
						shift(service.shiftData.startVertex, service.deltaX.start, shiftStartEndMode.shiftNextEdges);
					}
				} else if (service.deltaX.start === 0 && service.deltaX.end !== 0) {
					if (service.deltaX.end < 0) {
						shift(service.shiftData.endVertex, service.deltaX.end, shiftStartEndMode.shiftPreviousEdges);
					} else {
						shift(service.shiftData.endVertex, service.deltaX.end, shiftStartEndMode.shiftNextEdges);
					}
				} else {
					if (service.deltaX.start < 0) {
						shift(service.shiftData.endVertex, service.deltaX.end, shiftStartEndMode.shiftBothSidesEdges);
						shift(service.shiftData.startVertex, service.deltaX.start, shiftStartEndMode.shiftBothSidesEdges);
					} else {
						shift(service.shiftData.endVertex, service.deltaX.end, shiftStartEndMode.shiftBothSidesEdges);
						shift(service.shiftData.startVertex, service.deltaX.start, shiftStartEndMode.shiftBothSidesEdges);
					}
				}
			}

			// modify dateshift result:
			service.shiftResult.activities = service.activities;
			return service.shiftResult;
		}

		/**
		 * @ngdoc function
		 * @name setActivities
		 * @description Sets the shiftData for the dateShift.
		 *
		 * @param activities
		 * @param _relations
		 */
		function setActivities(activities, _relations) {
			service.activities = JSON.parse(JSON.stringify(activities)); // create new object instance
			_.forEach(service.activities, function setAct(activity) {
				// convert strings to moment
				activity[service.config.end] = moment(new Date(activity[service.config.end]).getTime()).utc();
				activity[service.config.start] = moment(new Date(activity[service.config.start]).getTime()).utc();
			});
			// build dateshift data
			service.shiftData = createDateshiftData(service.activities, _relations, service.trigger);
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
			var relationsMap = new Map(relations.map((relation) => [relation.PredecessorFk, relation]));

			// region trigger vertex

			// select trigger
			var triggerActivity = activities.find(function findTrgAct(act) {
				return act[service.config.id] === trigger[service.config.id];
			});

			const triggerCalendar = service.calendarData.get(triggerActivity[service.config.calendar]) ||  service.calendarData.get('default');
			var invalidTrigger = isActivityInvalid(triggerActivity[service.config.start], triggerActivity[service.config.end], triggerCalendar);
			var minDeltaXForTrigger = invalidTrigger ? triggerActivity[service.config.end].diff(triggerActivity[service.config.start], 'seconds') : undefined;
			// create the two trigger vertices and DON'T connect them
			var addedVerticesMap = new Map();
			var vertices = {};
			var triggerStartVertex = new Vertex(triggerActivity[service.config.start], triggerActivity, 'end', invalidTrigger, minDeltaXForTrigger);
			var triggerEndVertex = new Vertex(triggerActivity[service.config.end], triggerActivity, 'start', invalidTrigger, minDeltaXForTrigger);

			vertices[triggerActivity[service.config.id] + startPointPrefix] = triggerStartVertex;
			addedVerticesMap.set(vertices[triggerActivity[service.config.id] + startPointPrefix].id, vertices[triggerActivity[service.config.id] + startPointPrefix]);
			vertices[triggerActivity[service.config.id] + endPointPrefix] = triggerEndVertex;

			// endregion

			// region create vertices

			// create all other activies and connect them
			_.forEach(activities, function crtVrtx(activity) {
				var activityStartVertex, activityEndVertex;
				// var invalidActivity = isActivityInvalid(activity, service.calendarData[0]);
				if (addedVerticesMap.get(activity[service.config.id])) {
					activityStartVertex = vertices[activity[service.config.id] + startPointPrefix];
					activityEndVertex = vertices[activity[service.config.id] + endPointPrefix];
					activity[service.config.start] = activityStartVertex.date;
					activity[service.config.end] = activityEndVertex.date;
				} else {
					activityStartVertex = new Vertex(activity[service.config.start], activity, 'end');
					activityEndVertex = new Vertex(activity[service.config.end], activity, 'start');
					vertices[activity[service.config.id] + startPointPrefix] = activityStartVertex;
					vertices[activity[service.config.id] + endPointPrefix] = activityEndVertex;
					if (activity[service.config.id] !== trigger[service.config.id]) {
						// activityStartVertex.nextEdges.push(new Edge(relation, activityEndVertex, invalidActivity));
						activityStartVertex.nextEdges.push(new Edge(relationsMap.get(activityEndVertex.id), activityEndVertex));
						// activityEndVertex.prevEdges.push(new Edge(relation, activityStartVertex, invalidActivity));
						activityEndVertex.prevEdges.push(new Edge(relationsMap.get(activityStartVertex.id), activityStartVertex));
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
			var uniqueRelations = _.uniqWith(relations, function filterUniqRel(thisRel, otherRel) {
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
			var fromKey = relation[service.config.prevEdgeKey];
			var toKey = relation[service.config.nextEdgeKey];
			var fromVertex;
			var toVertex;
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
			fromVertex.nextEdges.push(new Edge(relation, toVertex, false, fromCanShiftTo, fromVertex.date.diff(toVertex.date, 's')));
			toVertex.prevEdges.push(new Edge(relation, fromVertex, false, toCanShiftFrom, toVertex.date.diff(fromVertex.date, 's')));
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
			var fromKey = relation[service.config.prevEdgeKey];
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
			let intEndVtc =interlockedActivityKeys.map(function getInterlockedEndVtx(interlockedActivityKey) {
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
		function isActivityInvalid(startDate, endDate, calendar) {
			return !!(diffWithoutException(endDate, startDate, calendar) === 0 &&
				isExceptionTime(startDate, calendar) &&
				isMidnightException(endDate, calendar));
		}

		// endregion

		// region Vertex

		/**
		 * @ngdoc Class
		 * @name Vertex
		 *
		 * @param date - date of the vertex
		 * @param activity - activity object with data
		 * @param {String} skipException  - 'end' or 'start' when skipping
		 * @param {Boolean} invalid  - optional flag to mark a vertex as invalid; default is false
		 * @param {number} minDeltaX  - optional number for minimum shift in seconds in order to shift correctly (used together with invalid for now)
		 * @constructor
		 */
		var Vertex = function Vertex(date, activity, skipException, invalid, minDeltaX) {
			// date: (as reference!)
			this.id = activity[service.config.id]; // only for testing remove afterwards
			this.date = date; // type: moment()
			this.originalDate = moment(date); // type: moment()
			// additional properties:
			this.isLocked = activity[service.config.isLocked];
			this.skipException = skipException;
			this.calendar = activity && activity[service.config.calendar] ? service.calendarData.get(activity[service.config.calendar]) : service.calendarData.get('default');
			// edges:
			this.prevEdges = []; // type: Edge
			this.nextEdges = []; // type: Edge
			// vertices
			this.interlockedVertices = [];
			this.hasChanged = false;
			this.maxDeltaX = 0;
			this.minDeltaX = minDeltaX || 0;
			this.isInvalid = invalid || false;
		};

		/**
		 * @ngdoc function
		 * @name shiftNextEdges
		 * @description Shifts all next edges from vertex.
		 *
		 * @param deltaX - moved deltaX
		 */
		Vertex.prototype.shiftNextEdges = function shiftNextEdges(deltaX) {
			this.updateMaxDeltaX(deltaX);
			if (this.canShift(deltaX) && this.isShiftPossible(deltaX, 'forward')) {
				// if edge against shift direction invalid -> subtract distance from deltaX
				// deltaX is negative, prevEdgeDistance is positive
				deltaX += this.measureInvalidEdge('backward');

				// validate if not trigger
				if (this.id !== service.trigger[service.config.id]) {
					this.validateShift('prevEdges', deltaX);
				}

				if (this.nextEdges.length > 0) {
					_.forEach(this.nextEdges, function shiftEdges(edge) {
						if (edge.canShift) {
							edge.vertex.shiftNextEdges(deltaX);
						}
					});
				}
			}
		};

		/**
		 * @ngdoc function
		 * @name shiftNextEdgesRecursive
		 * @description Shifts all next edges recursive from vertex.
		 *
		 * @param deltaX - moved deltaX
		 */
		Vertex.prototype.shiftNextEdgesRecursive = function shiftNextEdgesRecursive(deltaX) {
			// validate if not trigger
			// if (this.id !== service.trigger[service.config.id]) {
			this.validateShift('nextEdges', deltaX);
			// }
			if (this.canShift(deltaX)) {
				if (this.nextEdges.length > 0) {
					var currentDate = this.date;
					_.forEach(this.nextEdges, (edge) => {
						let originalDateRelation = this.originalDate.diff(edge.vertex.originalDate, 's');
						let currentDeltaX = deltaX;
						// currentDeltaX += originalDateRelation;
						this.updateMaxDeltaX(currentDeltaX);
						if (edge.canShift) {
							// #112666: Usecase a) invalid activity is in shift direction of trigger
							if (edge.isInvalid) {
								// if edge is invalid -> correct it; affects following shifts only!
								currentDeltaX += edge.vertex.date.diff(currentDate, 'seconds');
							}
							edge.vertex.shiftNextEdgesRecursive(currentDeltaX);
						}
					});
				}
			}
		};


		/**
		 * @ngdoc function
		 * @name shiftPrevEdges
		 * @description Shifts all previous edges from vertex.
		 *
		 * @param deltaX - moved deltaX
		 */
		Vertex.prototype.shiftPrevEdges = function shiftPrevEdges(deltaX) {
			this.updateMaxDeltaX(deltaX);
			if (this.canShift(deltaX) && this.isShiftPossible(deltaX, 'backward')) {
				// if edge against shift direction invalid -> subtract distance from deltaX
				// deltaX is positive, nextEdgeDistance is negative
				deltaX += this.measureInvalidEdge('forward');

				// validate if not trigger
				if (this.id !== service.trigger[service.config.id] && !this.isLocked) {
					this.validateShift('nextEdges', deltaX);
				}

				if (this.prevEdges.length > 0 && !this.isLocked) {
					_.forEach(this.prevEdges, function shiftEdges(edge) {
						if (edge.canShift) {
							edge.vertex.shiftPrevEdges(deltaX);
						}
					});
				}
			}
		};

		/**
		 * @ngdoc function
		 * @name shiftPrevEdgesRecursive
		 * @description Shifts all previous edges recursive from vertex.
		 *
		 * @param deltaX - moved deltaX
		 */
		Vertex.prototype.shiftPrevEdgesRecursive = function shiftPrevEdgesRecursive(deltaX) {
			// validate if not trigger
			// if (this.id !== service.trigger[service.config.id]) {
			this.validateShift('prevEdges', deltaX);
			// }
			if (this.canShift(deltaX)) {
				if (this.prevEdges.length > 0) {
					let currentDate = this.date;
					_.forEach(this.prevEdges, (edge) => {
						let originalDateRelation = this.originalDate.diff(edge.vertex.originalDate, 's');
						let currentDeltaX = deltaX;
						// currentDeltaX += originalDateRelation;
						this.updateMaxDeltaX(currentDeltaX);
						if (edge.canShift) {
							// #112666: Usecase a) invalid activity is in shift direction of trigger
							if (edge.isInvalid) {
								// if edge is invalid -> correct it; affects following shifts only!
								currentDeltaX += edge.vertex.date.diff(currentDate, 'seconds');
							}

							edge.vertex.shiftPrevEdgesRecursive(currentDeltaX);
						}
					});
				}
				/*
				// validate if not trigger
				if (this.id !== service.trigger[service.config.id]) {
					this.validateShift('prevEdges', deltaX);
				} */
			}
		};

		/**
		 * @ngdoc function
		 * @name validateShift
		 * @description Validates if the current shift is possible.
		 *
		 * @param { string } compareEdges: string of the edges to compare with
		 * @param { number } deltaX: number of seconds the vertex should be shifted (excluding exception times)
		 * @param { boolean } [simulate=false]: flag to ...
		 * @param { boolean } [ignoreInterlocks=false]: flag
		 *
		 * @returns { number } number of seconds the vertex was actually shifted (excluding exception times)
		 */
		Vertex.prototype.validateShift = function validateShift(compareEdges, deltaX, simulate = false, ignoreInterlocks = false) {

			// region Interlocked Vertices

			// #117943: Handle interlocked relations
			// if there are interlocked vertices: simulate a shift for each of them first, then shift all of them by the min amount
			if (!_.isEmpty(this.interlockedVertices) && ignoreInterlocks === false) {
				let allInterlockedVertices = [this].concat(this.interlockedVertices);
				// simulate shifts for all interlocked vertices (including own)
				let interlockedShiftSimulation = allInterlockedVertices.map(function simulateShift(interlockedVertex) {
					return interlockedVertex.validateShift(compareEdges, deltaX, true, true);
				});
				// set the value of delta x to the (absolute!) min value of all simulated shifts.
				let newDeltaX = _.minBy(interlockedShiftSimulation, Math.abs);
				_.forEach(this.interlockedVertices, function shiftInterlockedVertices(interlockedVertex) {
					interlockedVertex.validateShift(compareEdges, newDeltaX, false, true);
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

			var tempShiftMoment = moment(this.date); // copy for shift validation
			var originalShiftMoment = moment(this.date);

			/*	// if vertex has been shifted before, replace date by original date
			if (this.hasChanged) {
				tempShiftMoment = moment(this.originalDate); // copy for shift validation
				originalShiftMoment = moment(this.originalDate);
				this.date.set(this.originalDate.toObject());
			} */

			var exceptionDeltaX;
			if (this.isInvalid) {
				// not quite
				var nextAvailableDay;
				if (deltaX < 0) {
					nextAvailableDay = getExceptionEdge(this.date, 'start', this.calendar);
				} else {
					nextAvailableDay = getExceptionEdge(this.date, 'end', this.calendar);
				}
				exceptionDeltaX = deltaX + nextAvailableDay.diff(this.date, 'seconds');
			} else {
				// deltaX and all weekends inbetween
				exceptionDeltaX = deltaXWithExceptionTime(this.date, deltaX, this.calendar);
			}

			tempShiftMoment.add(exceptionDeltaX, 'seconds'); // should never be on a weekend!
			// calculate nearest moment then add diff of nearest moment
			var nearestMoment = tempShiftMoment;

			// endregion

			// region Compare edges
			// validate minTime between vertices
			/* const originalDateValidated = this.originalDate;
			_.forEach(this[compareEdges], function compareEdge(edge) {
				const currentItemMoment = moment(edge.vertex.date);
				const orgTimeSpan = diffWithoutException(originalDateValidated, edge.vertex.originalDate, edge.calendar);
				const projectedTimeSpan = diffWithoutException(nearestMoment, currentItemMoment, edge.calendar);

				const diffToMin = orgTimeSpan + projectedTimeSpan + deltaX;

				const needCheck = orgTimeSpan < 0 ? projectedTimeSpan > orgTimeSpan : projectedTimeSpan < orgTimeSpan;

				if (needCheck) {
					if (deltaX < 0 && diffToMin < edge.minTime
					 || deltaX > 0 && diffToMin > edge.minTime) {
						let itemMinTime = 0;
						if (deltaX < 0 && diffToMin < edge.minTime) {
							itemMinTime = edge.minTime;
						}
						if (deltaX > 0 && diffToMin > edge.minTime) {
							itemMinTime = -edge.minTime;
						}

						itemMinTime = deltaXWithExceptionTime(currentItemMoment, itemMinTime, edge.calendar);
						currentItemMoment.add(itemMinTime, 'seconds');
						nearestMoment = currentItemMoment;
					}
				}
			}); */
			// endregion


			// region Final weekend skip

			// if nearestMoment on weekend: determine whether to jump to start/end of weekend
			var finalWeekendSkip;
			if (!this.isInvalid) {
				finalWeekendSkip = calculateExceptionTimeSpan(nearestMoment, this.skipException, this.calendar);
			}

			if (finalWeekendSkip) {
				nearestMoment.add(finalWeekendSkip, 'seconds');
			}

			// endregion

			// region validate shift result

			var finalDeltaX = nearestMoment.diff(this.date, 'seconds');

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
				// return time difference of new and original date!
				return diffWithoutException(nearestMoment, this.originalDate, this.calendar);
			}
		};

		/**
		 * @ngdoc function
		 * @name addTime
		 * @description Adds time to the vertex.
		 *
		 * @param deltaX
		 */
		Vertex.prototype.addTime = function addTime(deltaX) {
			this.date.add(deltaX, 'seconds');
			this.hasChanged = true;
			if (this.id !== service.trigger[service.config.id]) {
				this.maxDeltaX = Math.abs(deltaX) > Math.abs(this.maxDeltaX) ? deltaX : this.maxDeltaX;
			}
			var _self = this;
			_.forEach(service.activities, function setActChanged(activity) {
				if (activity[service.config.id] === _self.id) {
					activity.hasChanged = true;
				}
			});
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
			/* var maxDeltaXAbs = Math.abs(this.maxDeltaX);
			return (maxDeltaXAbs === 0 || maxDeltaXAbs < Math.abs(deltaX)) && !this.isLocked; */
			return !this.isLocked;
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
			if(deltaXAbs <= Math.abs(this.maxDeltaX)) { // if the direction of shifting changed - reset maxDeltaX
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
			var adjacentEdges = this.getEdges(direction);
			var currentVertex = this;
			_.forEach(adjacentEdges, function validateAdjacentEdge(edge) {
				// only calculate mintime if it hasn't be calculated yet!
				if (_.isNil(edge.minTime)) {
					if (edge.vertex.id !== currentVertex.id) {
						// if not same activity -> minTime default of 0
						edge.minTime = 0;
					} else {
						// if same activity
						// 1.) check for missing date
						var isCurrentMoment = moment.isMoment(currentVertex.date) && currentVertex.date.isValid();
						var isEdgeMoment = moment.isMoment(edge.vertex.date) && edge.vertex.date.isValid();
						if (!isCurrentMoment && !isEdgeMoment) {
							var noDatesMsg = 'Activity with id ' + currentVertex.id + ' has no dates set!';
							service.shiftResult.addMessage(noDatesMsg, 'error');
							service.shiftResult.shiftCancelled = true;
							// stop current but finish loop!
							return;
						} else if (!isCurrentMoment) {
							currentVertex.date = moment(edge.vertex.date);
						} else if (!isEdgeMoment) {
							edge.vertex.date = moment(currentVertex.date);
						}
						// 2.) check for invalid dates (eg. end before start)
						var earlierDate;
						var laterDate;
						if (direction === 'forward') {
							earlierDate = currentVertex.date;
							laterDate = edge.vertex.date;
						} else if (direction === 'backward') {
							earlierDate = edge.vertex.date;
							laterDate = currentVertex.date;
						}
						if (earlierDate.isAfter(laterDate)) {
							// data cannot be corrected -> cancel dateshift
							var startAfterEndMsg = 'Activity with id ' + currentVertex.id + ' has a start date set after the end date!';
							service.shiftResult.addMessage(startAfterEndMsg, 'error');
							service.shiftResult.shiftCancelled = true;
							// stop current but finish loop!
							return;
						}
						// 3.) calculate min time
						var isInvalid = isActivityInvalid(earlierDate, laterDate, edge.calendar);
						// if invalid: set all to true and set min time to duration
						if (isInvalid) {
							var connectionDiff = laterDate.diff(earlierDate, 'seconds');
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
					var inversedEdge = edge.vertex.nextEdges.concat(edge.vertex.prevEdges).find(e => e.vertex === currentVertex);
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
			var shiftPossible = true;
			// #112666: Usecase c) invalid activity is against shift direction of trigger
			// validate forward/backward edges -> if invalid edge, check if shift is possible
			if (this.isInvalid) {
				let adjacentEdges = this.getEdges(direction);
				let invalidEdge = adjacentEdges.find(function findInvalidEdge(edg) {
					return edg.vertex.isInvalid;
				});
				if (!_.isNil(invalidEdge)) {
					var edgeDistance = this.date.diff(invalidEdge.vertex.date, 'seconds');
					shiftPossible = Math.abs(edgeDistance) <= Math.abs(deltaX);
				}
			}
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
			var adjacentEdges;
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
		var Edge = function Edge(relation, relatedVertex, isInvalid = false, canShift = true, initDiffWithoutException = 0) {
			// this.minTime = !_.isNil(relation) ? relation[service.config.minTime] || 0 : null; // type: int
			this.minTime = 0; // type: int
			this.vertex = relatedVertex; // type: Vertex
			this.calendar = relation && relation[service.config.calendar] ? service.calendarData.get({ Id: relation[service.config.calendar]}) : service.calendarData.get('default');
			this.isInvalid = isInvalid;
			this.canShift = canShift;
			this.initDiffWithoutException = initDiffWithoutException;
		};

		// endregion

		// region Private methods

		// region Shift methods


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
		/*
			// validate trigger
			vertex.validateShift(triggerValidationKey, deltaX); */
			if (service.config.mode === 'right' || service.config.mode === 'both') {
				// shiftNextRecursive
				vertex.shiftNextEdgesRecursive(deltaX);
			}

			if (service.config.mode === 'left' || service.config.mode === 'both') {
				// shiftPrevEdges
				// vertex.shiftPrevEdges(deltaX);
				if (vertex.prevEdges && vertex.prevEdges[0]) {
					vertex.prevEdges[0].vertex.shiftPrevEdgesRecursive(deltaX);
				}
			}
		}

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
			var startDate;
			var destinationDate;
			if (_.isString(destination)) {
				startDate = date;
				destinationDate = getExceptionEdge(date, destination, calendar);
			} else {
				startDate = getExceptionEdge(date, 'start', calendar);
				destinationDate = getExceptionEdge(date, 'end', calendar);
			}
			return destinationDate.diff(startDate, 'seconds');
		}

		// count the number of weekends between two days
		function countExceptionSpan(date1, date2, calendar) {
			if (date1.isSame(date2)) {
				return 0;
			}
			var earlierDate = moment(date1.isBefore(date2) ? date1 : date2);
			var laterDate = moment(date1.isAfter(date2) ? date1 : date2);

			earlierDate.add(1, 'day');

			var dayCount = 0;
			while (!earlierDate.isSame(laterDate, 'day') && earlierDate.isBefore(laterDate)) {
				if (isExceptionTime(earlierDate, calendar)) {
					dayCount++;
				}
				earlierDate.add(1, 'day');
			}
			return dayCount * 86400;
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
		function deltaXWithExceptionTime(date, deltaX, calendar) {
			if (deltaX === 0) {
				return 0;
			}
			var exceptionSpan = 0;
			var projectedDate = moment(date);
			// if is already on an exception time: skip to shift direction
			var skipTime;
			if (deltaX > 0) {
				skipTime = calculateExceptionTimeSpan(projectedDate, 'end', calendar);
			} else {
				skipTime = calculateExceptionTimeSpan(projectedDate, 'start', calendar);
			}
			if (skipTime) {
				projectedDate.add(skipTime, 'seconds');
				exceptionSpan += skipTime;
			}

			// store last projectedDate!
			var lastProjectedDate = projectedDate.clone();

			// add deltaX
			projectedDate.add(deltaX, 'seconds');

			var recursionStopper = 0;
			var lastDateCollection = [];
			// add exception time until it reaches the same point
			while (diffWithoutException(projectedDate, date, calendar) !== deltaX && recursionStopper < 100) {
				lastDateCollection.push(lastProjectedDate);
				if (Math.abs(diffWithoutException(projectedDate, date, calendar)) > Math.abs(deltaX)) {
					console.log('Skipped over date!');
				}
				// add all exception days inbetween
				var skipExceptionTimeAbsolute = countExceptionSpan(projectedDate, lastProjectedDate, calendar);
				// clone last projected Date
				lastProjectedDate = projectedDate.clone();
				if (skipExceptionTimeAbsolute > 0) {
					var skipExceptionTime = deltaX > 0 ? skipExceptionTimeAbsolute : skipExceptionTimeAbsolute * -1;
					projectedDate.add(skipExceptionTime, 'seconds');
					exceptionSpan += skipExceptionTime;
				} else {
					// todo: better code? Use getExceptionEdge?
					// if still exception: add skippedTime
					var skipDay = deltaX > 0 ? 86400 : -86400;
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
		function diffWithoutException(newDate, oldDate, calendar) {
			if (newDate.isSame(oldDate)) {
				return 0;
			}
			// assign old/new to later/earlier
			var laterDate = moment(newDate.isAfter(oldDate) ? newDate : oldDate);
			var earlierDate = moment(newDate.isAfter(oldDate) ? oldDate : newDate);
			// move both dates to end/start of their exception period
			earlierDate = getExceptionEdge(earlierDate, 'end', calendar);
			laterDate = getExceptionEdge(laterDate, 'start', calendar);
			if (laterDate.isBefore(earlierDate)) {
				return 0;
			}

			var newModifiedDate = newDate.isAfter(oldDate) ? laterDate : earlierDate;
			var oldModifiedDate = newDate.isAfter(oldDate) ? earlierDate : laterDate;
			var simpleDiff = newModifiedDate.diff(oldModifiedDate, 'seconds');

			// exception time in seconds
			var inbetweenExceptionTime = countExceptionSpan(earlierDate, laterDate, calendar);

			// subtract calculated weekends
			var result = Math.abs(simpleDiff) - inbetweenExceptionTime;
			// return result or negative result
			return simpleDiff >= 0 ? result : result * -1;
		}


		/**
		 * @ngdoc function
		 * @name isMidnightException
		 * @description Checks whether the passed date is during an exception or at midnight of a day before an exception.
		 *
		 * @param { Moment } date
		 * @param { Object } calendar: Object containing the calendar data.
		 *
		 * @return { bool }
		 */
		function isMidnightException(date, calendar) {
			var result = isExceptionTime(date, calendar);
			if (result === false && date.isSame(moment(date).startOf('day'))) {
				result = isExceptionTime(moment(date).add(-1, 'day'), calendar);
			}
			return result;
		}

		/**
		 * @ngdoc function
		 * @name getExceptionEdge
		 * @description Returns the start or end date of the current exception time span.
		 * Returns null if parameters are inncorrect.
		 *
		 * @param { Moment } date
		 * @param { string } destination
		 *
		 * @return { bool }
		 */
		function getExceptionEdge(date, destination, calendar) {
			var resultDate = moment(date);

			// TODO special case for midnight of day after exception edge!
			// Obsolete?
			// var isMidnightExceptionCheck = date.isSame(moment(date).startOf('day')) && isExceptionTime(moment(date).add(-1, 'day'), calendar);

			if (destination === 'start') {
				if (!isMidnightException(date, calendar)) {
					return date;
				}
			} else if (!isExceptionTime(date, calendar)) {
				return date;
			}

			var dayDirection;
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

			// start with skipping one day for midnight exception
			resultDate.add(dayDirection, 'day');

			var loopTimeout = 100;
			while (isExceptionTime(resultDate, calendar) && loopTimeout > 0) {
				resultDate.add(dayDirection, 'day');
				loopTimeout--;
			}
			// workaround to start on the beginning of the next exception day!
			if (dayDirection < 0) {
				resultDate.add(1, 'day');
			}

			return resultDate.startOf('day');
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

		// endregion

		/**
		 * @ngdoc function
		 * @name calculateDeltaX
		 * @description Calculates the deltaX object.
		 *
		 * @param activities
		 */
		function calculateDeltaX(activities) {
			// why not use startVertex?
			var triggerFromActivities = activities.find(function findTrgAct(activity) {
				return activity[service.config.id] === service.trigger[service.config.id];
			});

			// NaN should be turned to 0
			var startDiff = service.trigger[service.config.start].diff(triggerFromActivities[service.config.start], 'seconds') || 0;
			var endDiff = service.trigger[service.config.end].diff(triggerFromActivities[service.config.end], 'seconds') || 0;

			service.fullShift = false;
			// no need to manipulate start date, diffWithoutException is always correct

		 	if (!service.shiftData.startVertex.isInvalid) {
				if (startDiff !== 0) {
					startDiff = diffWithoutException(service.trigger[service.config.start], triggerFromActivities[service.config.start], service.shiftData.startVertex.calendar);
					if (endDiff !== 0) {
						service.fullShift = true;
						endDiff = startDiff;
					}
				} else if (endDiff !== 0) {
					endDiff = diffWithoutException(service.trigger[service.config.end], triggerFromActivities[service.config.end], service.shiftData.endVertex.calendar);
				}
			}

			if (startDiff === 0 && endDiff === 0) {
				// both 0 -> fullshift is true
				service.fullShift = true;
			}

			var lengthDiff = diffWithoutException(triggerFromActivities[service.config.end], triggerFromActivities[service.config.start]);
			// #116482: If fullshift is false trim diff to length of trigger and set trigger dates to same date
			if (!service.fullShift) {
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
			var startVtxDtSet = moment.isMoment(service.shiftData.startVertex.date) && service.shiftData.startVertex.date.isValid();
			var endVtxDtSet = moment.isMoment(service.shiftData.endVertex.date) && service.shiftData.endVertex.date.isValid();
			if (!startVtxDtSet && !endVtxDtSet) {
				var noDatesMsg = 'Trigger activity with id ' + service.shiftData.startVertex.id + ' has no dates set!';
				service.shiftResult.addMessage(noDatesMsg, 'error');
				service.shiftResult.shiftCancelled = true;
				return;
			} else if (!startVtxDtSet) {
				service.shiftData.startVertex.date = moment(service.shiftData.endVertex.date);
				service.deltaX.start = service.deltaX.end;
			} else if (!endVtxDtSet) {
				service.shiftData.endVertex.date = moment(service.shiftData.startVertex.date);
				service.deltaX.end = service.deltaX.start;
			} else if (service.shiftData.startVertex.date.isAfter(service.shiftData.endVertex.date)) {
				var startAfterEndMsg = 'Trigger activity with id ' + service.shiftData.startVertex.id + ' has a start date set after the end date!';
				service.shiftResult.addMessage(startAfterEndMsg, 'error');
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
			if (service.shiftData.startVertex.isInvalid && !service.shiftData.startVertex.isLocked) {
				var triggerDuration = service.shiftData.endVertex.date.diff(service.shiftData.startVertex.date, 'seconds');
				var isShiftForward = (service.deltaX.start + service.deltaX.end > 0);
				if (isShiftForward) { // deltaX positive
					service.deltaX.end = service.deltaX.end >= triggerDuration ? service.deltaX.end : triggerDuration;
					service.deltaX.start = service.deltaX.end - triggerDuration;
					if (service.deltaX.start === 0) {
						var startVertexEdge = getExceptionEdge(service.shiftData.startVertex.date, 'end', service.shiftData.startVertex.calendar);
						service.shiftData.startVertex.addTime(startVertexEdge.diff(service.shiftData.startVertex.date, 'seconds'));
					}
				} else { // deltaX negative
					service.deltaX.start = service.deltaX.start <= triggerDuration * -1 ? service.deltaX.start : triggerDuration * -1;
					service.deltaX.end = service.deltaX.start + triggerDuration;
					if (service.deltaX.end === 0) {
						var endVertexEdge = getExceptionEdge(service.shiftData.endVertex.date, 'start', service.shiftData.endVertex.calendar);
						service.shiftData.endVertex.addTime(endVertexEdge.diff(service.shiftData.endVertex.date, 'seconds'));
					}
				}
			}
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
			var weekenSpan = 0;
			var projectedDate = moment(date);
			// if is already on weekend: skip to shift direction
			var skipTime;
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
			var recursionStopper = 0;
			// add weekends until it reaches the same point
			while (diffWithoutWeekends(projectedDate, date) !== deltaX && recursionStopper < 100) {
				// add a weekend
				var skipWeekendDelta = (deltaX > 0) ? 172800 : (-172800);
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
			var weekendSpan = 0;
			var laterDate = newDate.isAfter(oldDate) ? newDate : oldDate;
			var earlierDate = newDate.isAfter(oldDate) ? oldDate : newDate;

			// count the number of weekends between two days
			function countFullWeekends(date1, date2) {
				// set weekDiff to 0
				var weekDiff = 0;
				var laterDate = date1.isBefore(date2) ? date2 : date1;
				var earlierDate = date1.isBefore(date2) ? date1 : date2;
				// if both dates are not in the same week: Count full weeks
				if (!date1.isSame(date2, 'week')) {
					// count full weeks by setting the date of earlier date to same as later date
					var earlierDateStartOfWeek = moment(earlierDate).startOf('week');
					weekDiff = Math.floor(Math.abs(laterDate.diff(earlierDateStartOfWeek, 'seconds')) / 604800);
					if (isWeekend(earlierDate)) {
						weekDiff--;
					}
				}
				return weekDiff;
			}

			var weekendCount = countFullWeekends(laterDate, earlierDate);
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
			var diffOriginal = newDate.diff(oldDate, 'seconds');
			// subtract calculated weekends
			var result = Math.abs(diffOriginal) - weekendSpan;
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
				var mondayMidnight = date.isoWeekday() === 1 ? date.isSame(moment(date).startOf('day')) : false;
				if (mondayMidnight && destination === 'start') {
					return -172800;
				} else {
					return null;
				}
			}
			var destinationDate;
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

		// region my experiment

		let leadingCalendar = 0; // past calendar is leading

		const shiftStartEndMode = {
			shiftPreviousEdges: 1,
			shiftNextEdges: 2,
			shiftBothSidesEdges: 3
		};

		const leadingCalendarMode = {
			pastCalendar: 0,
			futureCalendar: 1
		};

		function shift(trigger, deltaX, mode) {
			let shiftNextSucceed = true;
			let shiftPreviousSucceed = true;
			resetDateToOriginal(trigger);
			deltaX = calculateNextPossibleDate(trigger, deltaX, trigger.calendar);
			if (!isExceptionTime(trigger.date, trigger.calendar)) {
				if (deltaX > 0) {
					if ((mode === 2 || mode === 3) && trigger.nextEdges.length > 0) {
						trigger.nextEdges.forEach(nextEdge => {
							shiftNextSucceed = shiftRelatedEdges(trigger, nextEdge.vertex, deltaX, nextEdge.initDiffWithoutException, false);
						});
					}
					if (shiftNextSucceed && (mode === 1 || mode === 3) && trigger.prevEdges.length > 0) {
						trigger.prevEdges.forEach(prevEdge => {
							shiftPreviousSucceed = shiftRelatedEdges(trigger, prevEdge.vertex, deltaX, prevEdge.initDiffWithoutException, true);
						});
					}
				}

				if (deltaX < 0) {
					if ((mode === 1 || mode === 3) && trigger.prevEdges.length > 0) {
						trigger.prevEdges.forEach(prevEdge => {
							shiftPreviousSucceed = shiftRelatedEdges(trigger, prevEdge.vertex, deltaX, prevEdge.initDiffWithoutException, true);
						});
					}
					if (shiftPreviousSucceed && (mode === 2 || mode === 3) && trigger.nextEdges.length > 0) {
						trigger.nextEdges.forEach(nextEdge => {
							shiftNextSucceed = shiftRelatedEdges(trigger, nextEdge.vertex, deltaX, nextEdge.initDiffWithoutException, false);
						});
					}
				}

			}
			return {
				shiftNextSucceed,
				shiftPreviousSucceed
			};
		}

		function shiftRelatedEdges(trigger, related, deltaX, initDiffWithoutException, isPrevious = false) {
			if (!related.isInvalid && !related.isLocked && moment.isMoment(related.date) && moment.isMoment(trigger.date)) {
				const calendarForCalc = getCalendarForCalculations(trigger, related, isPrevious);
				resetDateToOriginal(related);
				let deltaXWithExceptionDays = calculateNextPossibleDate(related, deltaX, calendarForCalc);
				if (deltaXWithExceptionDays !== 0) {
					let currentInitDiff = 0;
					if(isPrevious) {
						currentInitDiff = resetDiffToOriginal(related, trigger, isPrevious, initDiffWithoutException);
					} else {
						currentInitDiff = resetDiffToOriginal(trigger, related, isPrevious, initDiffWithoutException);
					}
					deltaXWithExceptionDays -= currentInitDiff;
					if (deltaXWithExceptionDays !== 0) {
						if (isPrevious && related.prevEdges.length > 0) {
							related.prevEdges.forEach(pEdge => shiftRelatedEdges(related, pEdge.vertex, deltaXWithExceptionDays, pEdge.initDiffWithoutException, isPrevious));
						} else if (!isPrevious && related.nextEdges.length > 0) {
							related.nextEdges.forEach(nEdge => shiftRelatedEdges(related, nEdge.vertex, deltaXWithExceptionDays, nEdge.initDiffWithoutException, isPrevious));
						}
					}
				}
			} else {
				return false; // 'Invalid data or shift impossible!';
			}
			return true;
		}

		function calculateNextPossibleDate(edge, deltaX, calendar) {
			let count = 0;
			if (deltaX !== 0) {
				count = deltaX < 0 ? -1 : 1;
			}
			edge.addTime(deltaX);
			return nextDate(edge, calendar, count, deltaX, 0);
		}


		function nextDate(edge, calendar, count, deltaX, loops) {
			if (loops >= 10) {
				console.log('Too many loops! Edge not valid');
				return 0;
			} else if(!isExceptionTime(edge.date, calendar)) {// && !isMidnightException(edge.date, calendar)) {
				return deltaX;
			} else {
				const addExtraDay = moment.duration(count, 'day').asSeconds();
				deltaX += addExtraDay;
				edge.addTime(addExtraDay);
				loops++;
				return nextDate(edge, calendar, count, deltaX, loops);
			}
		}

		function resetDateToOriginal(edge) {
			if (edge.hasChanged) {
				edge.date.set(edge.originalDate.toObject());
			}
		}

		function resetDiffToOriginal(prevEdge, nextEdge, isPrevious, initDiffWithoutException) {
			const currentDiffWithoutException = diffWithoutException(nextEdge.date, prevEdge.date, isPrevious ? prevEdge.calendar : nextEdge.calendar);
			if (currentDiffWithoutException !== initDiffWithoutException) {
				if (isPrevious) {
					prevEdge.date.set(moment(nextEdge.date).add(-initDiffWithoutException, 's'));
				} else {
					nextEdge.date.set(moment(prevEdge.date).add(initDiffWithoutException, 's'));
				}
			}
			return currentDiffWithoutException - initDiffWithoutException;
		}

		function getCalendarForCalculations(trigger, related, isPrevious) {
			let calendarForCalc = trigger.calendar;
				if (leadingCalendar === leadingCalendarMode.futureCalendar && !isPrevious ||
					leadingCalendar === leadingCalendarMode.pastCalendar && isPrevious) {
					calendarForCalc = related.calendar;
				}
			return calendarForCalc;
		}
		// endregion my experiment

		// region reused functions

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
		function isExceptionTime(date, calendar) {
			if (_.isNumber(date)) {
				date = moment(date.toString());
			}

			// var calendar = _.find(service.calendarData, {Id: calendarId});
			if (!_.isNil(calendar)) {
				var dateAsInteger = parseInt(date.format('YYYYMMDD'));
				var isNonExceptionDay = calendar.NonExceptionDays.includes(dateAsInteger);
				var isNonWorkingDay = calendar.WeekendDays.includes(date.isoWeekday());
				if (isNonWorkingDay) {
					return isNonWorkingDay && !isNonExceptionDay;
				} else {
					var isExceptionDay = calendar.ExceptionDays.includes(dateAsInteger);
					return isExceptionDay && !isNonExceptionDay;
				}
			} else {
				return false;
			}
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
				service.calendarData = new Map([...service.calendarData, ...calendarData]);
			}
		}

	}


})(angular);
