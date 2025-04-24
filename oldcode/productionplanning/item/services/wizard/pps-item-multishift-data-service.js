/**
 * Created by mik on 13/07/2020.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).service('productionplanningItemMultishiftDataService', ProductionplanningItemMultishiftDataService);

	ProductionplanningItemMultishiftDataService.$inject = ['_', '$http', '$q', 'platformGridAPI', 'platformDateshiftHelperService', 'cloudCommonGridService'];

	function ProductionplanningItemMultishiftDataService(_, $http, $q, platformGridAPI, platformDateshiftHelperService, cloudCommonGridService) {
		var service = this;

		var msEvents = [];
		var msRelations = [];
		var msCalendarData = [];

		var msOriginalEvents = [];
		var msOriginalRelations = [];

		let gridDataFlattenCache = [];

		//process data correctly!
		function processData(events, relations) {
			_.forEach(events, (ev) => {
				if (!_.isNil(ev.MultishiftType)) {
					let originalId = ev.Id.toString();
					//suffix mulitshift events
					ev.Id = `${originalId}MS`;
					let linkedRelations = _.filter(relations, (rel) => {
						return rel.PredecessorFk === originalId || rel.SuccessorFk === originalId;
					});
					_.forEach(linkedRelations, (linkRel) => {
						if (linkRel.PredecessorFk === originalId) {
							linkRel.PredecessorFk = ev.Id;
						} else if (linkRel.SuccessorFk === originalId) {
							linkRel.SuccessorFk = ev.Id;
						}
					});
				}
			});
		}

		service.setData = function setData(events, relations, calendarData) {
			processData(events, relations);

			msOriginalEvents = _.cloneDeep(events);
			msOriginalRelations = _.cloneDeep(relations);

			msEvents = _.cloneDeep(events);
			msRelations = _.cloneDeep(relations);
			msCalendarData = _.cloneDeep(calendarData);
			platformDateshiftHelperService.resetDateshift(service.getServiceName());
		};

		service.setOriginalEvents = function setOriginalEvents() {
			msEvents = _.cloneDeep(msOriginalEvents);
			msRelations = _.cloneDeep(msOriginalRelations);
		};

		service.setEvents = function setEvents(events) {
			msEvents = events;
		};

		/**
		 * @name getTriggerEventsByMultishiftType
		 * @type function
		 * @description Find all MS events to a selected item with the given MS type.
		 *
		 * @param type {string} - Multishift Dateshift type. (PULL || PUSH)
		 * @param gridId {string?} - GridUUID to find the selected rows.
		 *
		 * @property {Event[]} selectedEvents - Array of events from selected item.
		 * @property {Integer[]} possibleMSIds - Array of possible MS event ids.
		 * @property {Integer[]} selectedEventIds - Array of event ids.
		 *
		 * @returns {Event[]} - Filtered trigger events for multi dateshift.
		 */
		service.getTriggerEventsByMultishiftType = (type, gridId) => {
			let selectedEvents = (gridId) ? service.getEventsFromSelectedItems(gridId) : msEvents;

			let possibleMSIds = [];
			let selectedEventIds = _.map(selectedEvents, event => event.Id.toString());
			if (selectedEventIds.length > 0) {
				// find possible multishift (MS) relations and add them to possibleMSIds
				_.forEach(msRelations, (relation) => {
					if (selectedEventIds.includes(relation.PredecessorFk) && relation.SuccessorFk.includes('MS')) {
						possibleMSIds.push(relation.SuccessorFk);
					} else if (selectedEventIds.includes(relation.SuccessorFk) && relation.PredecessorFk.includes('MS')) {
						possibleMSIds.push(relation.PredecessorFk);
					}
				});
			}

			return _.filter(msEvents, (event) => {
				return possibleMSIds.includes(event.Id.toString()) && event.MultishiftType === type;
			});
		};

		/**
		 * @name getEventsFromSelectedItems
		 * @type function
		 * @description Get all events from selected item.
		 *
		 * @param {Integer} gridId - GridUUID
		 *
		 * @property {Item[]} selectedItems - Selected items in grid.
		 * @property {Event[]} selectedEvents - Events from selected item
		 *
		 * @returns {Event[]} - Events from selected item or all events.
		 */
		service.getEventsFromSelectedItems = (gridId) => {
			let selectedItems = service.getSelectedItems(gridId);
			let selectedEvents = [];
			if (selectedItems.length > 0) {
				_.forEach(selectedItems, (item) => {
					if (item.Id.indexOf('E') > -1) {
						let event = msEvents.find(event => event.Id === item.OriginalId);
						selectedEvents.push(event);
					}
				});
			}
			return selectedEvents;
		};

		service.getSelectedItems = (gridId, includeStructNode) => {
			// return platformGridAPI.rows.selection({gridId: gridId, wantsArray: true});
			return _.filter(service.getFlattenItems(gridId), function (item) {
				if(includeStructNode){
					return item.Selected === true || item.Selected === 'true' || item.Selected === 'unknown';
				}
				return item.OriginalId > 0 && (item.Selected === true || item.Selected === 'true');
			});
		};

		service.getFlattenItems = (gridId, childProp) => {
			// return platformGridAPI.rows.selection({gridId: gridId, wantsArray: true});
			if(!gridDataFlattenCache[gridId] || gridDataFlattenCache[gridId].length === 0){
				gridDataFlattenCache[gridId] = [];
				childProp = _.isNil(childProp)? 'ChildItems' : childProp;
				cloudCommonGridService.flatten(platformGridAPI.items.data(gridId),gridDataFlattenCache[gridId], childProp);
				return gridDataFlattenCache[gridId];
			}
			return gridDataFlattenCache[gridId];
		};

		service.ClearCache = () =>{
			gridDataFlattenCache= [];
		};

		// dateshift region

		service.getServiceName = function () {
			return service.getModule();
		};

		service.getModule = function() {
			return 'productionplanningItemMultishiftDataService';
		};

		service.getDateshiftData = function () {
			var dateshiftConfig = {
				id: 'Id',
				end: 'PlannedFinish',
				start: 'PlannedStart',
				nextEdgeKey: 'SuccessorFk',
				prevEdgeKey: 'PredecessorFk',
				isLocked: 'IsLocked'
			};

			return {
				fullshift: {'default': true},
				originalActivities: msEvents,
				relations: msRelations,
				config: dateshiftConfig,
				calendarData: msCalendarData
			};
		};

		service.getList = function () {
			return msEvents;
		};
		service.getRelations = function () {
			return msRelations;
		};
		service.isItemFilterEnabled = function () {
			return false;
		};

		service.shiftDate = function (triggerEvent, value) {
		};

		service.postProcessDateshift = function (dateshiftResult) {
			// do nothing
		};
		platformDateshiftHelperService.registerDateshift(service);

		service.lastSelectType = 'Pull';
		service.additionalEvents = null;
		service.additionalRelations = null;

		return service;
	}
})(angular);
