/**
 * Created by janas on 09.07.2018.
 */

(function () {
	'use strict';
	var moduleName = 'controlling.structure';
	var controllingStructureModule = angular.module(moduleName);

	// TODO: #134943/134945 - consider read-only status (parent-child-relationship)

	/**
	 * @ngdoc service
	 * @name controllingStructurePlannedAttributesService
	 * @function
	 *
	 * @description
	 * helper service to handle attributes planned start, planned end, planned duration.
	 */
	controllingStructureModule.factory('controllingStructurePlannedAttributesService', ['calendarUtilitiesService', 'projectMainForCOStructureService', 'controllingStructureMainService', '_', 'moment','$q',
		function (calendarUtilitiesService, projectMainForCOStructureService, controllingStructureMainService, _, moment, $q) {
			var service = {},
				companyCalId = null;    // default calendar (from current company)
			var init = function () {
				calendarUtilitiesService.getCalendarIdFromCompany().then(function (value) {
					companyCalId = value;
				});
			};
			init();

			// Calculate planned attributes
			service.calculateAllPlannedAttributes = function (cellName, entity) {
				let defer = $q.defer();
				service.checkAndFillRowPlannedAttributes(cellName, entity, () => {
					// controllingStructureMainService.gridRefresh(); // TODO: check if can be removed
					defer.resolve();
				});
				return defer.promise;
			};

			// TODO: reset to 0 on deleting the planned start or/and planned finish dates
			// completes one of following attributes: planned start / end / duration
			service.checkAndFillRowPlannedAttributes = function (column, item, doneFunc) {
				var changedAttribute = column,
					calendarId = projectMainForCOStructureService.getSelected().CalendarFk || companyCalId,
					plannedStart = item.PlannedStart,
					plannedEnd = item.PlannedEnd,
					plannedDuration = (angular.isString(item.PlannedDuration)) ? parseFloat(item.PlannedDuration) : item.PlannedDuration;

				// only complete third attribute if calendar is available
				if (calendarId === null || !angular.isDefined(changedAttribute)) {
					return;
				}

				var computeStartDate = function computeStartDate() {
					if ((changedAttribute === 'plannedend' || changedAttribute === 'plannedduration') && plannedEnd && plannedDuration !== 0) {
						calendarUtilitiesService.getStartDate(calendarId, plannedEnd, plannedDuration).then(function (value) {
							item.PlannedStart = moment(value);
							service.updateAntecessors(item);
						});
						return true;
					}
				};

				var computeEndDate = function computeEndDate() {
					if ((changedAttribute === 'plannedstart' || changedAttribute === 'plannedduration') && plannedStart && plannedDuration !== 0) {
						calendarUtilitiesService.getEndDate(calendarId, plannedStart, plannedDuration).then(function (value) {
							item.PlannedEnd = moment(value);
							service.updateAntecessors(item);
						});
						return true;
					}
				};

				var computeDuration = function computeDuration() {
					if ((changedAttribute === 'plannedstart' || changedAttribute === 'plannedend') && plannedStart && plannedEnd) {
						calendarUtilitiesService.getDuration(calendarId, plannedStart, plannedEnd).then(function (value) {
							item.PlannedDuration = value;
							service.updateAntecessors(item);
						});
						return true;
					}
					else {
						item.PlannedDuration = 0;
						service.updateAntecessors(item);
						return false;
					}
				};

				// priority: duration -> enddate -> startdate
				if (!computeDuration()) {
					if (!computeEndDate()) {
						computeStartDate();
					}
				}
				if (_.isFunction(doneFunc)) {
					doneFunc();
				}
			};

			var updateParentAttributes = function (parentItem) {
				if (parentItem === null) { return; }

				var newPlannedStart = null,
					newPlannedEnd = null,
					newPlannedDuration = 0,
					estimateCost=0;

				// update parent attributes
				// TODO: use aggregate functions here better? (sum, min, max)
				angular.forEach(parentItem.ControllingUnits, function (child) {
					// sum of all children durations
					if (angular.isNumber(parseFloat(child.PlannedDuration)) && !isNaN(parseFloat(child.PlannedDuration))) {
						newPlannedDuration += parseFloat(child.PlannedDuration);
					}
					// parent start -> earliest date of all children
					if (newPlannedStart !== null && child.PlannedStart !== null) {
						newPlannedStart = (moment(newPlannedStart).isBefore(moment(child.PlannedStart))) ? newPlannedStart : child.PlannedStart;
					} else {
						newPlannedStart = (newPlannedStart !== null) ? newPlannedStart : child.PlannedStart;
					}
					// parent end -> latest date of all children
					if (newPlannedEnd !== null && child.PlannedEnd !== null) {
						newPlannedEnd = (moment(newPlannedEnd).isAfter(moment(child.PlannedEnd))) ? newPlannedEnd : child.PlannedEnd;
					} else {
						newPlannedEnd = (newPlannedEnd !== null) ? newPlannedEnd : child.PlannedEnd;
					}
					estimateCost+= child.EstimateCost;
				});
				parentItem.PlannedDuration = newPlannedDuration;
				parentItem.PlannedStart = newPlannedStart;
				parentItem.PlannedEnd = newPlannedEnd;
				if (!(parentItem.EstimateCost !== null && parentItem.EstimateCost > 0)) {
					parentItem.EstimateCost = estimateCost;
				}
			};

			service.updateAntecessors = function updateAntecessors(childItem) {
				var curItem = childItem;
				while (curItem !== null && curItem.ControllingunitFk !== null) {
					var parent = _.find(controllingStructureMainService.getList(), {Id: curItem.ControllingunitFk}) || null;
					// TODO: check status for readonly
					updateParentAttributes(parent);
					controllingStructureMainService.fireItemModified(curItem);
					controllingStructureMainService.markItemAsModified(parent);

					// next...
					curItem = parent;
				}
			};

			/**
			 * Remark: only current planned start/end/duration are updated, e.g. if calendar has changed,
			 * the attributes are NOT modified to the selected calendar.
			 */
			service.updateAllUnits = function updateAllUnits() { // TODO: remove? see alms 71906+137384
				var allLeafs = _.filter(controllingStructureMainService.getList(), function (unit) {
					return unit.ControllingunitFk && !unit.HasChildren;
				});
				_.each(allLeafs, service.updateAntecessors);

				controllingStructureMainService.gridRefresh();
			};

			return service;
		}]);
})();