(function (angular) {
	'use strict';

	var moduleName = 'platform';

	angular.module(moduleName).service('platformPlanningBoardAssignmentGroupingService', PlatformPlanningBoardAssignmentGroupingService);

	PlatformPlanningBoardAssignmentGroupingService.$inject = ['_', 'moment', 'basicsCommonDrawingUtilitiesService', 'chartService'];

	function PlatformPlanningBoardAssignmentGroupingService(_, moment, basicsCommonDrawingUtilitiesService, chartService) {
		const service = {
			// getGroupIntervals: getGroupIntervals,
			updateAssignmentGrouping: updateAssignmentGrouping,
		};

		function updateAssignmentGrouping(timeAxis, timeScale, supplierScale, planningBoardDataService) {
			const groupViews = [];
			const maxCapacityLineViews = [];
			const intervals = calculateGroupIntervals(planningBoardDataService, timeAxis, timeScale);
			let defaultMarginForLines = 2;
			const lineHeightForMaxLoad = supplierScale.lineHeight() / (planningBoardDataService.aggregationTrafficLightsValuesConfig().overload / 100) - 2*defaultMarginForLines;

			// region create assignment grouping object

			const groupedBySupplier = createAssignmentGroupsObject(
				{
					assignments: planningBoardDataService.assignments,
					assignmentConfig: planningBoardDataService.getAssignmentConfig(),
					intervals: intervals,
					planningBoardDataService: planningBoardDataService
				});
			// endregion create assignment grouping object

			for (let supplierId in groupedBySupplier) {
				let groupedByStartDate = groupedBySupplier[supplierId];
				const heightPerAssignment = calculateGroupHeightPerAssignment(groupedByStartDate, lineHeightForMaxLoad);
				for (let groupStartDate in groupedByStartDate) {
					const groupedByMappedProperty = groupedByStartDate[groupStartDate];
					// region set start values for the component objects calculation
					let heightOfLastGroups = supplierScale.lineHeight();
					let startOfGroup = moment();
					let endOfGroup = moment();
					let intervalCapacity = 0;
					// endregion


					for (let groupProp in groupedByMappedProperty.groups) {

						startOfGroup = groupedByMappedProperty.startDate;
						endOfGroup = groupedByMappedProperty.endDate;
						intervalCapacity = groupedByMappedProperty.capacity;

						let groupView = generateGroupObject(groupedByMappedProperty.groups[groupProp][0], groupProp, startOfGroup, endOfGroup, heightOfLastGroups, heightPerAssignment, supplierId, groupedByMappedProperty.groups[groupProp]);
						groupViews.push(groupView);
						heightOfLastGroups -= groupView.height;
					}

					// region generate max capacity line component

					// left vertical line
					let leftVerticalLineView = generateBaseLineObject(groupViews.at(-1), timeScale(startOfGroup), timeScale(startOfGroup), supplierScale(groupViews.at(-1), 'bottom'), supplierScale(groupViews.at(-1), 'bottom'));
					setLineObjectYPositions(leftVerticalLineView, maxCapacityLineViews, intervalCapacity, supplierId, heightPerAssignment, false);
					maxCapacityLineViews.push(leftVerticalLineView);

					// horizontal line
					let horizontalLineView = generateBaseLineObject(groupViews.at(-1), timeScale(startOfGroup), timeScale(endOfGroup), supplierScale(groupViews.at(-1), 'bottom'), supplierScale(groupViews.at(-1), 'bottom'));
					setLineObjectYPositions(horizontalLineView, maxCapacityLineViews, intervalCapacity, supplierId, heightPerAssignment, true);
					maxCapacityLineViews.push(horizontalLineView);

					// end region generate max capacity line component
				}
			}

			return {
				groupViews: groupViews,
				maxCapacityLineViews: maxCapacityLineViews
			};

			function generateGroupObject(baseObject, id, startOfGroup, endOfGroup, heightOfLastGroups, heightPerAssignment, supplierId, reservations) {
				let groupObject = Object.assign({}, baseObject);
				groupObject.Id = id;
				groupObject.width = Math.max(10, timeScale(endOfGroup) - timeScale(startOfGroup));
				groupObject.positionX = timeScale(startOfGroup);
				groupObject.reservations = reservations;

				// region set height of group component
				groupObject.height = heightPerAssignment * reservations.length;
				if (heightOfLastGroups - groupObject.height < 0) {
					groupObject.height = heightOfLastGroups;
				}
				// endregion set height of group component
				groupObject.positionY = supplierScale.headerLineHeight() + supplierScale.verticalIndex().get(parseInt(supplierId)) * supplierScale.lineHeight() + heightOfLastGroups - groupObject.height;


				const fillColor = getComponentFillColor(planningBoardDataService.getAssignmentConfig().mappingService, planningBoardDataService.assignmentStatusItems, groupObject);
				if (fillColor) { // if the background color by the status is available (only if the grouping by status) -> needs specification for other use cases
					groupObject.fillColor = fillColor;
				}
				return groupObject;
			}

			function generateBaseLineObject(baseObject, positionX1, positionX2, positionY1, positionY2) {
				let baseLineObject = Object.assign({}, baseObject);
				baseLineObject.positionX1 = positionX1 + defaultMarginForLines;
				baseLineObject.positionX2 = positionX2 + defaultMarginForLines;
				baseLineObject.positionY1 = positionY1 - defaultMarginForLines;
				baseLineObject.positionY2 = positionY2 - defaultMarginForLines;
				return baseLineObject;
			}

			function setLineObjectYPositions(objToUpdate, maxCapacityLineViews, intervalCapacity, supplierId, heightPerAssignment, horizontal) {
				if (!horizontal && intervalCapacity > 0) {
					objToUpdate.positionY2 = supplierScale.headerLineHeight() + supplierScale.verticalIndex().get(parseInt(supplierId)) * supplierScale.lineHeight() + (supplierScale.lineHeight() - heightPerAssignment * intervalCapacity);
				}
				if (maxCapacityLineViews.length > 0 &&
					planningBoardDataService.getAssignmentConfig().mappingService.supplier(maxCapacityLineViews.at(-1)) === planningBoardDataService.getAssignmentConfig().mappingService.supplier(objToUpdate)) {
					objToUpdate.positionY1 = maxCapacityLineViews.at(-1).positionY2;
				} else if (!horizontal){
					objToUpdate.positionY1 = objToUpdate.positionY2;
				}

				if (horizontal) {
					objToUpdate.positionY2 = objToUpdate.positionY1;
				}
			}
		}

		/**
		 * @ngdoc function
		 * @name createAssignmentGroupsObject
		 * @description Creates an assignment grouping object depending on the grouping property in mapping service
		 *
		 * @param {Object} updateData
		 * @return {Object} Object: {
		 * 			grouped by supplier ID: {
		 * 			     grouped by start date of interval: {
		 * 			           grouped by grouping property from assignment mapping service
		 * 			     }
		 * 			}
		 * }
		 */
		function createAssignmentGroupsObject(updateData) {
			const assignmentMappingServ = updateData.assignmentConfig.mappingService;
			const validConfigSupplier = Object.keys(updateData.planningBoardDataService.supplierCapacityPerBaseUnit).map(x => parseInt(x));
			const uniqIntervals = _.orderBy(_.uniqBy(updateData.intervals, function (interval) {
				return interval.startDate.toISOString();
			}), ['startDate'], ['asc']);
			const assignmentArray = getValidAssignmentsForGrouping(Array.from(updateData.assignments.values()), uniqIntervals, assignmentMappingServ, validConfigSupplier);

			if (assignmentArray && assignmentArray.length > 0 && validConfigSupplier.length > 0) {
				// region group assignments by supplier ID
				let assignmentsGroupsBySupplier = _.groupBy(assignmentArray, function (assignment) {
					return assignmentMappingServ.supplier(assignment);
				});
				// endregion group assignments by supplier ID

				let assignmentsGroupBySupplier, tempGroupObj;
				for (let supplierId in assignmentsGroupsBySupplier) {
					assignmentsGroupBySupplier = assignmentsGroupsBySupplier[supplierId];
					tempGroupObj = {};
					let capacityPerDay = updateData.planningBoardDataService.supplierCapacityPerBaseUnit[supplierId];
					_.forEach(uniqIntervals, function (interval) {
						const intervalCapacity = calculateCapacityInInterval(interval, capacityPerDay);
						_.forEach(assignmentsGroupBySupplier, function (assignment) {
							createGroupObjectObject(tempGroupObj, interval, intervalCapacity, assignment, assignmentMappingServ);
						});
					});

					// region update main assignment groups object with generated groups for given supplier
					assignmentsGroupBySupplier = tempGroupObj;
					assignmentsGroupsBySupplier[supplierId] = assignmentsGroupBySupplier;
					for (let groupProp in assignmentsGroupBySupplier) {
						let assignmentCount = assignmentsGroupBySupplier[groupProp].groups.length;
						assignmentsGroupBySupplier[groupProp].groups = assignmentMappingServ.grouping(assignmentsGroupBySupplier[groupProp].groups);
						assignmentsGroupBySupplier[groupProp].assignmentCount = assignmentCount;
					}
					// endregion update main assignment groups object with generated groups for given supplier
				}
				return assignmentsGroupsBySupplier;
			}
		}

		/**
		 * @description Calculates the intervals according to minimal aggregation setting in planning board. ATTENTION! The minimal interval is 1 day!
		 * @param planningBoardDataService
		 * @param timeAxis
		 * @param timeScale
		 * @return {*}
		 */
		function calculateGroupIntervals(planningBoardDataService, timeAxis, timeScale) {
			// default level of intervals - prohibit intervals smaller than a day
			let levelOfIntervals = {type: 'day', value: 1};

			if (planningBoardDataService.useMinAggregation() && !_.isEqual(planningBoardDataService.minAggregationLevel().type, 'hour')) {
				levelOfIntervals = planningBoardDataService.minAggregationLevel();
			}

			const tickValues = timeAxis.tickvalues().length > 0 ? timeAxis.tickvalues() : timeScale.ticks();
			return chartService.calculateIntervals(tickValues, levelOfIntervals);
		}

		/**
		 * @description Retrieves background color for the component
		 * @param mappingService
		 * @param assignmentStatusItems
		 * @param assignment
		 * @return {*} color in hex format || undefined
		 */
		function getComponentFillColor(mappingService, assignmentStatusItems, assignment) {
			let fillColor;
			// TODO color should be handled by mapping service
			if (_.isFunction(mappingService.grouping) && mappingService.grouping() === 'status') {
				let status = _.find(assignmentStatusItems, {Id: mappingService.status(assignment)});

				if (status && status.BackgroundColor) {
					fillColor = basicsCommonDrawingUtilitiesService.decToHexColor(status.BackgroundColor);
				}
			}
			return fillColor;
		}

		/**
		 * @description Calculate capacity of resource for given interval
		 * @param interval
		 * @param capacityPerDay
		 * @return {number}
		 */
		function calculateCapacityInInterval(interval, capacityPerDay) {
			// region calculate capacity of resource for given interval
			let intervalCapacity = 0;
			let daysInInterval = interval.endDate.diff(interval.startDate, 'days');
			let tempStartDate = moment(interval.startDate);
			if (daysInInterval) {
				while (daysInInterval > 0) {
					if (!_.isUndefined(capacityPerDay) && !_.isUndefined(capacityPerDay.get(tempStartDate.format('YYYY-MM-DD')))) {
						intervalCapacity += capacityPerDay.get(tempStartDate.format('YYYY-MM-DD'));
					}
					tempStartDate.add(1, 'day');
					--daysInInterval;
				}
			} else {
				if (!_.isUndefined(capacityPerDay) && !_.isUndefined(capacityPerDay.get(tempStartDate.format('YYYY-MM-DD')))) {
					intervalCapacity = capacityPerDay.get(tempStartDate.format('YYYY-MM-DD'));
				}
			}
			return intervalCapacity;
		}

		function createGroupObjectObject(tempGroupObj, interval, intervalCapacity, assignment, assignmentMappingServ) {
			let reservationStart = assignmentMappingServ.from(assignment).utc();
			let reservationEnd = assignmentMappingServ.to(assignment).utc();

			// region generate group object
			if (reservationStart.isSameOrAfter(interval.startDate) && reservationStart.isBefore(interval.endDate)
				|| reservationEnd.isSameOrBefore(interval.endDate) && reservationEnd.isAfter(interval.startDate)
				|| reservationStart.isBefore(interval.startDate) && reservationEnd.isAfter(interval.endDate)) {
				if (tempGroupObj[interval.startDate.toISOString()]) {
					tempGroupObj[interval.startDate.toISOString()].groups.push(assignment);
				} else {
					tempGroupObj[interval.startDate.toISOString()] = {
						startDate: interval.startDate,
						endDate: interval.endDate,
						groups: [assignment],
						capacity: intervalCapacity || 0
					};
				}
			}
		}

		/**
		 * @description Filters assignments between start of first and end of last interval and checks if there is valid capacity config for supplier of assignment
		 * @param assignments
		 * @param uniqIntervals
		 * @param assignmentMappingServ
		 * @param validConfigSupplier
		 * @return {*}
		 */
		function getValidAssignmentsForGrouping(assignments, uniqIntervals, assignmentMappingServ, validConfigSupplier) {
			return assignments
				.filter(assignment =>
					(assignmentMappingServ.from(assignment).isSameOrAfter(uniqIntervals[0].startDate) && assignmentMappingServ.from(assignment).isBefore(uniqIntervals.at(-1).endDate)
						|| assignmentMappingServ.to(assignment).isSameOrBefore(uniqIntervals.at(-1).endDate) && assignmentMappingServ.to(assignment).isAfter(uniqIntervals[0].startDate)
						|| assignmentMappingServ.from(assignment).isBefore(uniqIntervals[0].startDate) && assignmentMappingServ.to(assignment).isAfter(uniqIntervals.at(-1).endDate))
					&& validConfigSupplier.includes(assignmentMappingServ.supplier(assignment)));
		}

		/**
		 *
		 * @param groupedByStartDate
		 * @param lineHeightForMaxLoad
		 * @return {number|number}
		 */
		function calculateGroupHeightPerAssignment(groupedByStartDate, lineHeightForMaxLoad) {
			const capacities = _.flatMap(groupedByStartDate).map(grp => grp.capacity);
			let nonExceptionDayCapacity = Math.max(...capacities);
			return nonExceptionDayCapacity > 0 ? lineHeightForMaxLoad / nonExceptionDayCapacity : 0;
		}

		return service;
	}
})(angular);