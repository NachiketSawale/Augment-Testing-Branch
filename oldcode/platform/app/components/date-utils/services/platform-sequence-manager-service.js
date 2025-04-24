/* global moment */
((angular) => {
	'use strict';

	let moduleName = 'platform';

	/**
	 * @ngdoc service
	 * @name platformSequenceManagerService
	 * @description
	 * platformConflictingAssignmentsService provides functions for special behaviour in the planningboard
	 */
	angular.module(moduleName).service('platformSequenceManagerService', platformSequenceManagerService);
	platformSequenceManagerService.$inject = ['_', 'moment', '$translate', 'platformModalFormConfigService', 'platformDateshiftCalendarService', 'platformTranslateService',];

	function platformSequenceManagerService(_, moment, $translate, platformModalFormConfigService, platformDateshiftCalendarService, platformTranslateService) {
		let service = {
			isAmbiguous: isAmbiguous,
			getIntersectingSequences: getIntersectingSequences,
			generateSequenceData: generateSequenceData
		};
		service.config = false;

		let startPointPrefix = 'S';
		let endPointPrefix = 'E';

		function isAmbiguous(phases, phase, mapServ, conflictPhases) {
			var from = mapServ.from(phase),
				to = mapServ.to(phase);

			phases.forEach(sPhase => {
				var fromDate = mapServ.from(sPhase),
					toDate = mapServ.to(sPhase);

				if ((moment(fromDate).isBetween(from, to)
					|| moment(toDate).isBetween(to, from)
					|| moment(from).isBetween(fromDate, toDate)
					|| moment(to).isBetween(toDate, fromDate)
					|| moment(fromDate).isSame(from)
					|| moment(toDate).isSame(from))) {
					if (_.isFunction(mapServ.supplier) &&
						mapServ.supplier(phase) === mapServ.supplier(sPhase)) {
						if (phase.Id !== sPhase.Id) {
							conflictPhases.push(sPhase);
						}
					}
				}
			});

			if (conflictPhases.length > 0) {
				var preselectSequence = {
					value: conflictPhases[0].Id,
					type: 'item',
					id: conflictPhases[0].Id,
					caption: conflictPhases[0].Id
				};

				let dialogConfig;
				let formconfig = getFormConfigForShowingConflictPhases(conflictPhases);
				dialogConfig = {
					title: $translate.instant('platform.dateUtil.conflictingPhases'),
					resizeable: false,
					showOkButton: false,
					customBtn1: {
						label: '*Create New Sequence',
						label$tr$: 'platform.dateUtil.createNewSequence',
						action: function () {
							// will create a new sequence
						}
					},
					customBtn2: {
						label: '*Merge',
						label$tr$: 'platform.dateUtil.merge',
						action: function () {
							// merge the sequence
						}
					},
					formConfiguration: formconfig,
					dataItem: {
						entity: conflictPhases,
						conflictingPhase: preselectSequence,
					},
				};
				platformTranslateService.translateFormConfig(dialogConfig.formConfiguration);

				platformModalFormConfigService.showDialog(dialogConfig);
			}
		}
		function getFormConfigForShowingConflictPhases(conflictPhases) {
			let phaseItems = [];
			var Itemsobj;

			conflictPhases.forEach(element => {
				Itemsobj = {
					value: element.Id,
					type: 'item', id: element.Id,
					caption: element.Id
				};
				phaseItems.push(Itemsobj);
			});

			return {
				fid: 'cloud.uom.form',
				version: '1.0.0',
				groups: [{
					gid: '1',
					isOpen: true
				}],
				rows: [
					{
						gid: '1',
						rid: 'conflictingPhases',
						model: 'conflictingPhase',
						type: 'select',
						label: '*Conflicting Phases',
						label$tr$: 'platform.dateUtil.conflictingPhases',
						options: {
							displayMember: 'caption',
							valueMember: 'id',
							items: phaseItems,
						},
						visible: true
					}
				],

			};
		}

		function getIntersectingSequences(sequences, plannedStartDate, itemsMap, defaultCalendarData) {
			let intersectSequences = [];
			let calendarData = {};
			if (defaultCalendarData.size > 0) {
				calendarData = defaultCalendarData.get('default');
			}
			sequences.forEach(function (sq) {
				let fromDate, toDate, nextToDate;
				fromDate = moment(sq.sequenceStart);
				let formworkActivities = sq.actualData.activities.filter(activity => itemsMap.get(activity.Id) && itemsMap.get(activity.Id).FormworkTypeFk > 0);
				const lastActivity = sq.actualData.activities[sq.actualData.activities.length - 1];
				let endsWithDisassembly = itemsMap.get(lastActivity.Id) && itemsMap.get(lastActivity.Id).FormworkTypeFk > 0 ? true : false;

				if (!endsWithDisassembly && formworkActivities.length === 1) {
					toDate = moment(sq.sequenceEnd).add(1, 'd');
					nextToDate = platformDateshiftCalendarService.getNextFreeDay(calendarData, toDate, false, false);

				} else {
					nextToDate = moment(sq.sequenceEnd);
				}
				plannedStartDate = moment(plannedStartDate).format('YYYY-MM-DD');
				if (moment(plannedStartDate).isBetween(fromDate.format('YYYY-MM-DD'), nextToDate.format('YYYY-MM-DD'), null, '()')) {
					sq.sequenceCaption = sq.actualData.activities.map(activity => (itemsMap.get(activity.Id) && itemsMap.get(activity.Id).Code) || activity.CompositeId).join(' -> ');
					intersectSequences.push(sq);
				}
			});
			return intersectSequences;
		}


		function onlyUnique(value, index, array) {
			return array.indexOf(value) === index;
		}

		function sortByStartDate(sequenceAcitivities) {
			return sequenceAcitivities.sort((a, b) => {
				if (moment(a.StartDate).isBefore(moment(b.StartDate))) {
					return -1;
				}
				if (moment(b.StartDate).isBefore(moment(a.StartDate))) {
					return 1;
				}
				return 0;
			});
		}

		function buildSequence(relations, activities, sequenceRelations, sequenceActivities) {
			const actIdsMap = new Set(sequenceActivities.map(y => y.CompositeId));
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

		function generateSequenceData(activities, relations, config, calendarData, containerData) {
			validateCalendarData(calendarData);

			service.config = JSON.parse(JSON.stringify(config)); // create new object instance


			const sequenceArray = [];

			let activitiesInSequenceArray = new Set();
			let activityStartVertex, activityEndVertex;

			let filteredActivities = activities;
			let filteredRelations = new Map(relations.map(rel => [rel.PredecessorFk + rel.SuccessorFk, rel]));

			if (containerData.entityPrefixes && containerData.itemName) {
				const filterByEntityName = Object.keys(containerData.entityPrefixes).find(entityName => containerData.itemName && containerData.itemName.includes(entityName));
				if (_.isString(filterByEntityName)) {
					filteredActivities = activities.filter(activity => activity.EntityName === filterByEntityName);
				}
			}

			filteredActivities.forEach(activity => {
				if (!activitiesInSequenceArray.has(activity)) {

					let { sequenceRelations, sequenceAcitivities: sequenceActivities } = buildSequence([...filteredRelations.values()], filteredActivities, [], [activity]);

					sequenceActivities = sortByStartDate(sequenceActivities);

					let sequence = {
						sequenceId: sequenceActivities.map(a => a.CompositeId).join(' -> '),
						sequenceEnd: '',
						sequenceStart: '',
						actualData: {
							activities: sequenceActivities,
							relations: sequenceRelations
						},
						vertices: {}
					};

					sequence.sequenceEnd = moment.max(sequenceActivities.map(d => moment(d[service.config.end])));
					sequence.sequenceStart = moment.min(sequenceActivities.map(d => moment(d[service.config.start])));

					sequenceActivities.forEach(sequenceActivity => {
						activityStartVertex = new Vertex(sequenceActivity[service.config.start], sequenceActivity, 'end');
						activityEndVertex = new Vertex(sequenceActivity[service.config.end], sequenceActivity, 'start');
						sequence.vertices[sequenceActivity[service.config.id] + startPointPrefix] = activityStartVertex;
						sequence.vertices[sequenceActivity[service.config.id] + endPointPrefix] = activityEndVertex;
					});


					sequenceRelations.forEach(sequenceRelation => deleteFromMap(filteredRelations, (sequenceRelation.PredecessorFk + sequenceRelation.SuccessorFk)));
					activitiesInSequenceArray = new Set([...activitiesInSequenceArray.values()].concat(sequenceActivities));

					sequenceArray.push(sequence);
				}
			});

			return sequenceArray;
		}

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
			this.originalDate = moment(new Date(date).getTime); // type: moment()
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

		function deleteFromMap(map, item) {
			if (map.has(item)) {
				map.delete(item);
			}
		}

		return service;
	}
})(angular);
