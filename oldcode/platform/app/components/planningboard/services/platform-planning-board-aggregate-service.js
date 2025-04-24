(function (angular) {
	'use strict';

	var moduleName = 'platform';

	angular.module(moduleName).service('platformPlanningBoardAggregationService', PlatformPlanningBoardAggregationService);

	PlatformPlanningBoardAggregationService.$inject = ['_', 'moment', 'math', 'platformDateshiftCalendarService', 'basicsCommonDrawingUtilitiesService'];

	const DAY_IN_MS = 86400000;
	/**
	 * @property {Array.<Aggregate>} assignmentAggregations - Array of aggragtions.
	 * @property {Array.<Interval>} intervals - Array of intervals.
	 * @constructor
	 */
	function PlatformPlanningBoardAggregationService(_, moment, math, platformDateshiftCalendarService, basicsCommonDrawingUtilitiesService) {
		var service = {
			getAssignmentAggregations: getAssignmentAggregations,
			getSumAggregations: getSumAggregations,
			updateAssignmentAggregations: updateAssignmentAggregations,
			updateCapacities: updateCapacities,
			clearData: clearData,
			setMapService: setMapService,
			getAggregationValue: getAggregationValue

		};

		const serviceDataMap = new Map();

		// access example:
		// in pb directive
		// platformPlanningBoardAggregationService.setMapService($scope.assignmentConfig.mappingService);
		// var aggregates = platformPlanningBoardAggregationService.updateAssignmentAggregations($scope.assignments, dateRange.start, dateRange.end);

		/**
		 * @ngdoc Class
		 * @name Aggregate
		 * @param {boolean} setId - Boolean to either set id or not.
		 * @param {Interval}  interval - Enddate of the Interval.
		 * @param {object}  sum - Config object for interval capacities.
		 * @param {string}  type - Color to represent the current interval capacity usage.
		 * @param {string}  reference - Color to represent the current interval capacity usage.
		 * @param {array.<Aggregate>}  aggregates - Array of aggregations.
		 * @param {int}  displayFactor - Uom factor for display.
		 * @param {string}  uomDescription - Uom description
		 * @param {int} aggregationLength - Size of the aggregations.
		 *
		 * @property {int} id
		 * @property {moment} startDate
		 * @property {moment} endDate
		 * @property {int} sum
		 * @property {int} displayFactor
		 * @property {string} uomDescription
		 * @property {string} type
		 * @property {string} reference
		 * @property {object} aggregates
		 * @property {int} targetValue
		 * @property {int} amount - Size of the aggregations.
		 * @property {string} color
		 * @constructor
		 */
		// todo: remove sum from aggregate and only use sums as soon as it works
		class Aggregate {
			constructor(setId, interval, sum, sums, type, reference, aggregates, displayFactor, uomDescription, aggregationLength, currentMapService) {
				this.id = setId ? currentMapService.idMachine.getId() : -1;
				this.startDate = interval.startDate;
				this.endDate = interval.endDate;
				this.sum = sum || sumAggregates(aggregates);
				this.sums = sums || {};
				this.displayFactor = displayFactor || 1;
				this.uomDescription = uomDescription || '';
				this.type = type;
				this.reference = reference;
				this.aggregates = aggregates;
				this.targetValue = interval.capacity;
				this.amount = aggregationLength;
				this.color = getAggregationColor(this.sum, interval, currentMapService);// 'rgb(170,170,170)'; // default color
			}
		}

		/**
		 * @ngdoc Class
		 * @name Interval
		 * @param {moment}  startDate - Startdate of the Interval.
		 * @param {moment}  endDate - Enddate of the Interval.
		 *
		 * @property {moment}  startDate - Startdate of the Interval.
		 * @property {moment}  endDate - Enddate of the Interval.
		 * @property {object}  capacityLevels - Config object for interval capacities.
		 * @property {int}  capacity - Color to represent the current interval capacity usage.
		 * @constructor
		 */
		class Interval {
			constructor(startDate, endDate, currentMapService) {
				this.startDate = startDate.utc();
				this.endDate = endDate.utc();
				this.startDateInMs = this.startDate.toDate().getTime();
				this.endDateInMs = this.endDate.toDate().getTime();
				this.capacityLevels = {
					underload: {
						value: currentMapService.aggregationTrafficLightsValuesConfig.underload,
						color: getAggregationTrafficLights('underload', currentMapService)
					},
					goodload: {
						value: currentMapService.aggregationTrafficLightsValuesConfig.goodload,
						color: getAggregationTrafficLights('goodload', currentMapService)
					},
					maxload: {
						value: currentMapService.aggregationTrafficLightsValuesConfig.maxload,
						color: getAggregationTrafficLights('maxload', currentMapService)
					},
					overload: {
						value: currentMapService.aggregationTrafficLightsValuesConfig.overload,
						color: getAggregationTrafficLights('overload', currentMapService)
					}
				};
				this.capacity = getCapacity(startDate, endDate, currentMapService);
			}
		}

		function getAggregationTrafficLights(type, currentMapService) {
			var color = 'rgb(170,170,170)'; // default color
			switch (type) {
				case 'underload':
					color = currentMapService.aggregationTrafficLightsConfig ? basicsCommonDrawingUtilitiesService.intToRgbColor(currentMapService.aggregationTrafficLightsConfig['underload']).toString() : 'rgb(23,176,39, 1)';
					break;
				case 'goodload':
					color = currentMapService.aggregationTrafficLightsConfig ? basicsCommonDrawingUtilitiesService.intToRgbColor(currentMapService.aggregationTrafficLightsConfig['goodload']).toString() : 'rgb(226,116,14, 1)';
					break;
				case 'maxload':
					color= currentMapService.aggregationTrafficLightsConfig ? basicsCommonDrawingUtilitiesService.intToRgbColor(currentMapService.aggregationTrafficLightsConfig['maxload']).toString() : 'rgb(214,28,28, 1)';
					break;
				case 'overload':
					color = currentMapService.aggregationTrafficLightsConfig ? basicsCommonDrawingUtilitiesService.intToRgbColor(currentMapService.aggregationTrafficLightsConfig['overload']).toString() : 'rgb(115,2,2, 1)';
					break;
				default:
					break;
			}
			return color;
		}

		function updateAssignmentAggregations(assignments, tickValues, useMinAggregation, minAggregationLevel, doUpdateSumAggregations, assignmentDataServiceName, service) {
			if (serviceDataMap.get(service)) {
				const currentMapService = serviceDataMap.get(service);
				currentMapService.idMachine.resetId();
				let spanAboveMin = true; // checks if the selected minimal aggregation is in current tick span
				let needsUpdate = currentMapService.prevUseMinAggregation !== useMinAggregation || !_.isEqual(currentMapService.prevMinAggregationLevel, minAggregationLevel); // on settings change update needed
				let minDuration = moment.duration(minAggregationLevel.value, minAggregationLevel.type).asSeconds(); // duration of minimal aggregation level in seconds

				// add tick value before first and after last tick
				if (tickValues.length >= 2) {
					var tickSpan = moment(tickValues[1]).diff(tickValues[0], 'seconds'); // from first to second
					var firstTick = moment(tickValues[0]).subtract(tickSpan, 'seconds').toDate();
					tickValues.unshift(firstTick);
					var lastTick = moment(tickValues[tickValues.length - 1]).add(tickSpan, 'seconds').toDate();
					tickValues.push(lastTick);
					spanAboveMin = tickSpan - minDuration >= 0;
				}

				// clear intervals if new tickValues
				// if(_.difference(tickValues, newTickValues).length > 0) {
				if (!_.isEqual(tickValues, currentMapService.newTickValues) || needsUpdate) { // update aggregations if ticks changed or if minimal aggregation settings has been changed
					currentMapService.prevUseMinAggregation = useMinAggregation;
					currentMapService.prevMinAggregationLevel = minAggregationLevel;
					currentMapService.newTickValues = tickValues;
					clearIntervals(currentMapService);
					updateIntervals(tickValues, useMinAggregation && !spanAboveMin ? minAggregationLevel : null, currentMapService);
				}

				if (currentMapService) {
					setAssignmentRealDuarion(assignments, currentMapService);
					updateAggregations(assignments, doUpdateSumAggregations, currentMapService);
				} else {
					console.warn('Mapping service is not set!');
				}
			}
		}

		function updateSumAggregations(interval, intervalIdx, intervalAggregations, currentMapService) {
			let sums = {};
			const aggregationProperties = (_.isFunction(currentMapService.mappingService.getAggregationProperties)) ? currentMapService.mappingService.getAggregationProperties() : [];
			// set inital sums map values for all exsisitng properties
			aggregationProperties.forEach((property) => {
				if (!sums[property]) {
					sums[property] = 0;
				}
			});


			const aggregationPropertiesWithDomain = _.isFunction(currentMapService.mappingService.getPropertiesWithDomain) ? currentMapService.mappingService.getPropertiesWithDomain() : {};

			let aggregationQtyAndDecPropsWDomainObj = {};

			// filter only for needed domains
			_.forEach(aggregationPropertiesWithDomain, function (value, key) {
				if (value.domain === 'decimal' || value.domain === 'quantity') {
					aggregationQtyAndDecPropsWDomainObj[key] = value;
				}
			});

			let intervalAggregationAmount = 0;
			if (!_.isUndefined(intervalAggregations) && intervalAggregations.length > 0) {
				let subSumAggregations = [];
				intervalAggregations.forEach((aggregate) => {
					if (aggregate.aggregates) {
						_.forEach(aggregate.aggregates, function (subAggregate) {
							subSumAggregations.push(subAggregate);
						});
					}

					aggregationProperties.forEach((property) => {
						let tempValues = [sums[property]];
						let aggregatePropValue = aggregate.sums[property];
						if (aggregatePropValue) {
							tempValues.push(aggregatePropValue);
						}

						let foundDomain = aggregationQtyAndDecPropsWDomainObj[property];
						if (foundDomain) {
							switch (foundDomain.domain) {
								case 'integer':
								case 'decimal':
								case 'quantity':
									sums[property] = sum(tempValues);
									break;
								default:
									break;
							}
						} else {
							sums[property] = sum(tempValues);
						}

					});
					intervalAggregationAmount += aggregate.amount;
				});
				let aggregateDisplayFactor = _.map(intervalAggregations, 'displayFactor')[0];
				let aggregateUomDescription = _.map(intervalAggregations, 'uomDescription')[0];
				// todo: remove sum from aggregate as soon as it works with sums only
				let sumAggregation = new Aggregate(true, interval, null, sums, 'sum', intervalIdx, intervalAggregations, aggregateDisplayFactor, aggregateUomDescription, intervalAggregationAmount, currentMapService);
				sumAggregation.aggregates = (subSumAggregations.length > 0) ? subSumAggregations : [];
				currentMapService.sumAggregations.push(sumAggregation);
			}
		}

		function getSumAggregations(service) {
			return serviceDataMap.get(service) ? serviceDataMap.get(service).sumAggregations : [];
		}

		function updateCapacities(capacities, service) {
			const currentMapService = serviceDataMap.get(service);
			if (currentMapService && _.isFunction(currentMapService.mappingService.useCapacities) && currentMapService.mappingService.useCapacities()) {
				currentMapService.capacityList = capacities[Object.keys(capacities)[0]]; // TODO: temporary solution, solve it by using capacity per supplier
				clearIntervals(currentMapService);
				let minAggregation = currentMapService.planningBoardDataService.useMinAggregation() ? currentMapService.planningBoardDataService.minAggregationLevel() : null;
				updateIntervals(currentMapService.newTickValues, minAggregation, currentMapService);
			}
		}

		function getAssignmentAggregations(service) {
			return serviceDataMap.get(service) ? serviceDataMap.get(service).assignmentAggregations : [];
		}

		function clearData(service) {
			const currentMapService = serviceDataMap.get(service);
			if (currentMapService) {
				clearIntervals(currentMapService);
				clearAssignmentAggregations(currentMapService);
			}
		}

		function setMapService(service, planningBoardDataService) {
			if(!serviceDataMap.get(service)) {
				serviceDataMap.set(service, {
					assignmentAggregations: [],
					sumAggregations: [],
					assignmentDurationObject: {},
					capacityList: [],
					intervals: [],
					newTickValues: [],
					prevUseMinAggregation: false,
					prevMinAggregationLevel: {},
					idMachine: {
						internalCounter: 0,
						getId: function () {
							return this.internalCounter++;
						},
						resetId: function () {
							this.internalCounter = 0;
						}
					},
					mappingService: service,
					planningBoardDataService: planningBoardDataService,
					intCalenderData: {},
					aggregationTrafficLightsConfig: {}
				});
			}
		}

		function clearIntervals(currentMapService) {
			currentMapService.intervals = [];
		}

		function clearAssignmentAggregations(currentMapService) {
			currentMapService.assignmentAggregations = [];
			currentMapService.sumAggregations = [];
		}

		function updateIntervals(tickValues, minAggregation = null, currentMapService) {
			currentMapService.intCalenderData = platformDateshiftCalendarService.parseCalendarData(currentMapService.planningBoardDataService.calendarInUse);
			currentMapService.aggregationTrafficLightsConfig = currentMapService.planningBoardDataService.aggregationTrafficLightsConfig();
			currentMapService.aggregationTrafficLightsValuesConfig = currentMapService.planningBoardDataService.aggregationTrafficLightsValuesConfig();
			let newInterval = null;
			if (minAggregation !== null && minAggregation.type !== 'hour') {
				let actualMomentStart = null;
				let actualMomentEnd = null;
				let tempIntervalArray = [];
				let tickValueType = minAggregation.type;
				if(tickValueType === 'week') {
					tickValueType = 'isoWeek';
				}
				for (let tickValue of tickValues) {
					actualMomentStart = moment(tickValue).utc().startOf(tickValueType);
					actualMomentEnd = moment(tickValue).utc().endOf(tickValueType);
					if (!_.find(tempIntervalArray, actualMomentStart)) {
						tempIntervalArray.push(actualMomentStart);
						newInterval = new Interval(actualMomentStart, actualMomentEnd, currentMapService);
						currentMapService.intervals.push(newInterval);
					}
				}
			} else {
				for (var i = 0; i < tickValues.length - 1; i++) {
					if (!_.find(currentMapService.intervals, {startDate: tickValues[i], endDate: tickValues[i + 1]})) {
						newInterval = new Interval(moment(tickValues[i]), moment(tickValues[i + 1]), currentMapService);
						currentMapService.intervals.push(newInterval);
					}
				}
			}

			return currentMapService.intervals;
		}

		function updateAggregations(assignments, doUpdateSumAggregations, currentMapService) {
			clearAssignmentAggregations(currentMapService);

			let selectedAggregationProperties = [];
			selectedAggregationProperties.push(currentMapService.planningBoardDataService.getPlanningBoardSettingsList()[0].sumAggregationLine1.value);
			selectedAggregationProperties.push(currentMapService.planningBoardDataService.getPlanningBoardSettingsList()[0].sumAggregationLine2.value);
			selectedAggregationProperties.push(currentMapService.planningBoardDataService.getPlanningBoardSettingsList()[0].sumAggregationLine3.value);

			let aggregationPropertiesSet = new Set((_.isFunction(currentMapService.mappingService.getAggregationProperties)) ? currentMapService.mappingService.getAggregationProperties() : []);

			// iterate intervals
			let intervalAggregations = new Map();
			let supplierAssignments = new Map();
			let supplierId = 0;
			// collect supplierAssignments that intersect
			assignments.forEach((assignment) => {
				supplierId = currentMapService.mappingService.supplier(assignment);
				if (!supplierAssignments.has(supplierId)) {
					supplierAssignments.set(supplierId, []);
				}
				supplierAssignments.get(supplierId).push(assignment);
			});

			currentMapService.intervals.forEach((interval, intervalIdx) => {
				intervalAggregations.set(interval.startDate, []);

				// iterate suppliers
				supplierAssignments.forEach((assignmentsBySupplierAll, supplierId) => {
					let assignmentsBySupplier = [];

					assignmentsBySupplier = assignmentsBySupplierAll.filter(assignment => {
						return assignment._endDateInMs > interval.startDateInMs &&
						assignment._startDateInMs < interval.endDateInMs;
					});


					let supplierAggregate;
					let aggregateDisplayFactor = 1;
					if (_.isFunction(currentMapService.mappingService.aggregationUomFactor)) {
						aggregateDisplayFactor = _.map(assignmentsBySupplier, function (assignment) {
							return currentMapService.mappingService.aggregationUomFactor(assignment);
						})[0];
					} else {
						console.warn('There is no [aggregationUomFactor] mapping defined for this service.', currentMapService.mappingService);
					}

						var aggregateUomDescription = '';
						if (_.isFunction(currentMapService.mappingService.aggregationUomDescription)) {
							aggregateUomDescription = _.map(assignmentsBySupplier, function (assignment) {
								return currentMapService.mappingService.aggregationUomDescription(assignment);
							})[0];
						} else {
							console.warn('There is no [aggregationUomDescription] mapping defined for this service.', currentMapService.mappingService);
						}

					if (currentMapService.mappingService.aggregateType) { // todo: refactor without the usage of aggregateType, sub types must be added differently
						// add type aggregations
						let typeAggregates = [];
						// collect typeAssignments
						let typeAssignments = {};
						_.forEach(assignmentsBySupplier, function (assignment) {
							let type = currentMapService.mappingService.aggregateType(assignment);
							if (_.isUndefined(typeAssignments[type])) {
								typeAssignments[type] = [];
							}
							typeAssignments[currentMapService.mappingService.aggregateType(assignment)].push(assignment);
						});

						// create type aggregates
						_.forEach(typeAssignments, function (assignmentsByType, type) {
							let sumValue = sum(_.map(assignmentsByType, function (assignment) {
								return getFractionQuantity(assignment, interval, 'default', currentMapService);
							}));
							let typeAggregate = new Aggregate(false, interval, sumValue, false, 'type', type, [], aggregateDisplayFactor, aggregateUomDescription, typeAssignments.length, currentMapService);
							typeAggregates.push(typeAggregate);
						});

						// create supplier aggregates
						supplierAggregate = new Aggregate(true, interval, null, false, 'supplier', _.toNumber(supplierId), typeAggregates, aggregateDisplayFactor, aggregateUomDescription, assignmentsBySupplier.length, currentMapService);
					} else {
						// add aggregations without sub types
						let aggregationProperties = [];
						selectedAggregationProperties.forEach(selectedProp => {
							if (aggregationPropertiesSet.has(selectedProp)) {
								aggregationProperties.push(selectedProp);
							}
						});

						let sums = {};
						_.forEach(aggregationProperties, property => {
							sums[property] = sum(_.map(assignmentsBySupplier, assignment => {
								return getFractionQuantity(assignment, interval, property, currentMapService);
							}));
						});

							// currently sums[Object.keys(sums)[0]] is used as the default sum for each supplier this must change to a mapped property
							// todo: remove sum from aggregate as soon as it works with sums only (temporary solution)
							supplierAggregate = new Aggregate(true, interval, sums[Object.keys(sums)[0]], sums, 'supplier', _.toNumber(supplierId), [], aggregateDisplayFactor, aggregateUomDescription, assignmentsBySupplier.length, currentMapService);
						}

					intervalAggregations.get(interval.startDate).push(supplierAggregate);
					currentMapService.assignmentAggregations.push(supplierAggregate);
				});
				if (doUpdateSumAggregations) {
					updateSumAggregations(interval, intervalIdx, intervalAggregations.get(interval.startDate), currentMapService);
				}
			});
		}

		/**
		 * @ngdoc function
		 * @name sumAggregates
		 *
		 * @param aggregates
		 * @returns {int}
		 */
		function sumAggregates(aggregates) {
			return sum(_.map(aggregates, 'sum'));
		}

		function getFractionQuantity(assignment, interval, property = 'default', currentMapService) {
			var totalQuantity = (property !== 'default') ? assignment[property] : currentMapService.mappingService.quantity(assignment);
			if (totalQuantity === undefined && _.isFunction(currentMapService.mappingService.valueToSelectedAggregation)){
				totalQuantity = currentMapService.mappingService.valueToSelectedAggregation(assignment, property);
			}
			if (totalQuantity === undefined){
				console.warn('The property is not  found in the assignment.', property);
				return 0;
			}

			//let fractionFactor = getFractionFactor(interval, currentMapService.mappingService.from(assignment), currentMapService.mappingService.to(assignment));
			let fractionFactor = getFractionFactor(interval, assignment._startDateInMs, assignment._endDateInMs);
			let fraction = (fractionFactor !== -1)?  math.abs(fractionFactor / currentMapService.assignmentDurationObject[currentMapService.mappingService.id(assignment)]): 1;
			//if capacity is 0 then set fraction to 0
			if(interval.capacity === 0){
				fraction = 0;
			}
			var uomFactor = 1;
			if (_.isFunction(currentMapService.mappingService.uomFactor)) {
				uomFactor = currentMapService.mappingService.uomFactor(assignment);
			} else {
				console.warn('There is no [uomFactor] mapping defined for this service.', currentMapService.mappingService);
			}
			return totalQuantity * fraction * uomFactor;
		}

		function getFractionFactor(interval, startDateMs, endDateMs) {
			if (interval.capacity === 0) {
				return -1;
			}
			var intersectingTime;

			const msInSec = 1000;

			const assignmentIsEarlier = startDateMs < interval.startDateInMs;
			const assignmentIsLater = endDateMs > interval.endDateInMs;

			if (assignmentIsEarlier && assignmentIsLater) { // completely overlapping
				intersectingTime = (interval.endDateInMs - interval.startDateInMs) / msInSec;
			} else if (assignmentIsEarlier && !assignmentIsLater) { // only end inside
				intersectingTime = (endDateMs - interval.startDateInMs) / msInSec;
			} else if (!assignmentIsEarlier && assignmentIsLater) { // only start inside
				intersectingTime = (interval.endDateInMs - startDateMs) / msInSec;
				// intersectingTime = startDate.diff(interval.endDate, 'seconds');
			} else if (!assignmentIsEarlier && !assignmentIsLater) {
				return -1; // completely inside
			}

			// var totalTime = getTotalTime(startDate, endDate);
			return intersectingTime;// /totalTime);
		}

		/**
		 * @ngdoc function
		 * @name setAssignmentRealDuarion
		 * @description Set the realDuration of an assignemnt without the capacity 0 days.
		 *
		 * @param {array<assignment>}assignments
		 */
		function setAssignmentRealDuarion(assignments, currentMapService) {
			const intervals = currentMapService.intervals;

			assignments.forEach((assignment) => {
				let realDuration = (assignment._endDateInMs - assignment._startDateInMs) / 1000;

				intervals.forEach((interval) => {
					if (interval.capacity === 0 && !(interval.endDateInMs < assignment._startDateInMs || interval.startDateInMs > assignment._endDateInMs)) { // interval has no capacity and is not completly outside
						let assignmentIsEarlier = assignment._startDateInMs < interval.startDateInMs;
						let assignmentIsLater = assignment._endDateInMs  > interval.endDate;

						if (assignmentIsEarlier && assignmentIsLater) { // completely overlapping
							realDuration -= (interval.endDateInMs - interval.startDateInMs) / 1000;
						} else if (assignmentIsEarlier && !assignmentIsLater) { // only end inside
							realDuration -= (assignment._endDateInMs  - interval.startDateInMs) / 1000;
						} else if (!assignmentIsEarlier && assignmentIsLater) { // only start inside
							realDuration -= (interval.endDateInMs - assignment._startDateInMs) / 1000;
						}
						// else if (!assignmentIsEarlier && !assignmentIsLater) {
						// completely inside do nothing
						// }
					}

					currentMapService.assignmentDurationObject[currentMapService.mappingService.id(assignment)] = realDuration;
				});
			});
		}

		function getCapacity(startDate, endDate, currentMapService) {
			let capacity = 0;
			if(typeof currentMapService.capacityList !== 'undefined' && Object.keys(currentMapService.capacityList).length > 0) {
				_.forEach(currentMapService.capacityList, (value, date) => {
					if (moment(date).diff(startDate) < 0) {
						return;
					}

					if (moment(date).isSame(startDate) || moment(date).isBetween(startDate, endDate)) {
						capacity += value;
					}

					if (moment(date).diff(endDate) > 0) {
						return false;
					}
				});
			} else {
				if(platformDateshiftCalendarService.isExceptionDay(currentMapService.intCalenderData, startDate) && isMidnightExceptionOrExceptionDay(currentMapService.intCalenderData, endDate)){
					capacity = 0;
				} else {
					capacity = 1;
				}
			}
			return capacity;
		}


		function isMidnightExceptionOrExceptionDay(calendar, date) {
			var result = platformDateshiftCalendarService.isExceptionDay(calendar, date);
			if (result === false && date.toDate().getTime() === (moment(date).startOf('day')).toDate().getTime()) {
				result = platformDateshiftCalendarService.isExceptionDay(calendar,moment(new Date(date.toDate().getTime() - DAY_IN_MS)));
			}
			return result;
		}

		/**
		 * @ngdoc function
		 * @name getAggregationColor
		 * @description Get aggregation color.
		 *
		 * @param {int} sum - Sum of aggregation.
		 * @param {Interval} interval
		 *
		 * @return {string} color
		 */
		function getAggregationColor(sum, interval, currentMapService) {
			var color = 'rgb(170,170,170)'; // default color
			if (interval.capacity !== 0 && _.isFunction(currentMapService.mappingService.useCapacities) && currentMapService.mappingService.useCapacities()) {
				//capacities for 1 day! we need to divide it to correct interval
				const realIntervalCapacity = interval.capacity / (24/ interval.endDate.diff(interval.startDate, 'h'));
				var capacityPercent = Math.round(sum / realIntervalCapacity * 100);
				if (capacityPercent < interval.capacityLevels.underload.value) {
					color = getAggregationTrafficLights('underload', currentMapService);
				} else if (capacityPercent <= interval.capacityLevels.goodload.value) {
					color = getAggregationTrafficLights('goodload', currentMapService);
				} else if (capacityPercent <= interval.capacityLevels.maxload.value) {
					color = getAggregationTrafficLights('maxload', currentMapService);
				} else if (capacityPercent <= interval.capacityLevels.overload.value || capacityPercent > interval.capacityLevels.overload.value) {
					color = getAggregationTrafficLights('overload', currentMapService);
				}
			}

			return color;
		}

		// todo: remove sum from aggregate as soon as it works with sums only
		function getAggregationValue(d, value, service) {
			const currentMapService = serviceDataMap.get(service);
			if (currentMapService) {
				let text = '';
				switch (value) {
					case 'amount':
						text = d.amount;
						break;
					case 'targetValue':
						text = `${(d.targetValue / d.displayFactor).toFixed(2)} ${d.uomDescription}`;
						break;
					case 'actualValue':
						text = `${(d.sum / d.displayFactor).toFixed(2)} ${d.uomDescription}`;
						break;
					case 'residualValue':
						text = `${((d.targetValue / d.displayFactor) - (d.sum / d.displayFactor)).toFixed(2)} ${d.uomDescription}`;
						break;
					default:
						text = (_.isFunction(currentMapService.mappingService.getAggregationText)) ? currentMapService.mappingService.getAggregationText(value, d) : '';
						break;
				}
				return text;
			}
			return '';
		}

		/*
			Helper functions
		*/
		function sum(arr) {
			let sum = 0;
			for (let e of arr) {
			  sum += e;
			}
			return sum;
		}

		return service;
	}
})(angular);