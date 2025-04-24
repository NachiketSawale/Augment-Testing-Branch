/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.simulation.modelSimulationMasterService
	 * @function
	 *
	 * @description Manages and replays simulation data.
	 */
	angular.module('model.simulation').factory('modelSimulationMasterService',
		modelSimulationMasterService);

	modelSimulationMasterService.$inject = ['_', '$http', '$injector', 'moment',
		'PlatformMessenger', 'platformCollectionUtilitiesService'];

	function modelSimulationMasterService(_, $http, $injector, moment, PlatformMessenger, platformCollectionUtilitiesService) {
		const service = {};

		// monkey-patch Moment.js
		if (!_.isFunction(moment.fn.isSameOrAfter)) {
			moment.fn.isSameOrAfter = function () {
				return this.isSame.apply(this, arguments) || this.isAfter.apply(this, arguments);
			};
		}
		if (!_.isFunction(moment.fn.isSameOrBefore)) {
			moment.fn.isSameOrBefore = function () {
				return this.isSame.apply(this, arguments) || this.isBefore.apply(this, arguments);
			};
		}

		const getNearestSnapshot = function (time) {
			let found = null;
			let foundDistance = null;
			this.snapshots.forEach(function (ss) {
				const dist = Math.abs(ss.time.diff(time));
				if (!found || (dist < foundDistance)) {
					found = ss;
					foundDistance = dist;
				}
			});
			return found;
		};

		const state = {
			timelines: [],
			nextTimelineId: 1,
			onTimelineListChanged: new PlatformMessenger(),
			currentTime: null,
			onCurrentTimeChanged: new PlatformMessenger(),
			suggestedTime: null,
			zoomedTimerange: null,
			onZoomedTimerangeChanged: new PlatformMessenger(),
			timerId: null,
			clearInterval: function () {
				if (this.timerId) {
					window.clearInterval(this.timerId);
					this.timerId = null;
				}
			},
			checkTimelineReady: function () {
				if (this.timelines.length <= 0) {
					throw new Error('No timeline has been loaded.');
				}
			},
			checkTimeSuggested: function () {
				if (_.isNull(this.suggestedTime)) {
					throw new Error('Currently, there is no suggested time.');
				}
			},
			eventProcessors: {},
			speed: 3,
			restrictEventTypes: function (typeIds) {
				const that = this;
				if (angular.isArray(typeIds)) {
					this.restrictedEventTypes = [];
					this.restrictedEventTypes.byId = {};
					typeIds.forEach(function (typeId) {
						if (angular.isString(typeId)) {
							if (that.eventProcessors[typeId]) {
								that.restrictedEventTypes.push(typeId);
								that.restrictedEventTypes.byId[typeId] = true;
							}
						}
					});
				} else {
					this.restrictedEventTypes = null;
				}
			},
			restrictedEventTypes: null,
			includeEventType: function (typeId) {
				if (this.restrictedEventTypes) {
					return !!this.restrictedEventTypes.byId[typeId];
				} else {
					return true;
				}
			},
			includedEventTypeIds: function () {
				if (this.restrictedEventTypes) {
					return this.restrictedEventTypes;
				} else {
					return Object.keys(this.eventProcessors);
				}
			}
		};

		state.timelines.update = function updateAllTimelinesData() {
			if (this.length > 0) {
				this.from = moment.min(_.map(this, function (tlr) {
					return tlr.timelineData.from;
				}));
				this.to = moment.max(_.map(this, function (tlr) {
					return tlr.timelineData.to;
				}));
			} else {
				this.from = null;
				this.to = null;
			}
		};

		(function patchTimelineListChangedFire() {
			const origFire = state.onTimelineListChanged.fire;
			state.onTimelineListChanged.fire = function (info) {
				let actualInfo;

				function generateList(name) {
					let list;
					if (_.isArray(info[name])) {
						list = info[name];
					} else {
						list = [];
					}

					list.byId = {};
					list.forEach(function (timelineId) {
						list.byId[timelineId] = true;
						actualInfo.byId[timelineId] = name;
					});

					actualInfo[name] = list;
				}

				if (!_.isObject(info)) {
					throw new Error('No info object supplied.');
				}

				actualInfo = {
					byId: {}
				};
				generateList('added');
				generateList('reloaded');
				generateList('deleted');

				origFire.call(state.onTimelineListChanged, actualInfo);
			};
		})();

		/**
		 * @ngdoc function
		 * @name isTimelineReady
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Checks whether a timeline is currently ready.
		 * @returns {Boolean} A value taht indicates whether a timeline is ready.
		 */
		service.isTimelineReady = function () {
			return state.timelines.length > 0;
		};

		/**
		 * @ngdoc function
		 * @name countLoadedTimelines
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Indicates the number of loaded timelines.
		 * @returns {Number} The number of timelines.
		 */
		service.countLoadedTimelines = function () {
			return state.timelines.length;
		};

		/**
		 * @ngdoc function
		 * @name invokeEventProcessors
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Invokes event processors for a set of events. If the type of an event is unknown, the event
		 *              will be ignored.
		 * @param {Array<Object>} events An array of events.
		 * @param {Function} invoker The function that handles the events based on their respective event processor.
		 */
		function invokeEventProcessors(events, invoker) {
			events.forEach(function (ev) {
				if (state.includeEventType(ev.type)) {
					const proc = state.eventProcessors[ev.type];
					if (proc) {
						invoker(proc, ev);
					}
				}
			});
		}

		/**
		 * @ngdoc function
		 * @name executeBeginningEvents
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Executes actions associated with the beginning of an event based on the appropriate event
		 *              processors.
		 * @param {Boolean} reverse Indicates whether the event is running in reverse direction.
		 */
		const executeBeginningEvents = function (reverse) {
			invokeEventProcessors(this.beginningEvents, function (proc, ev) {
				if (reverse) {
					proc.invertBegin(ev);
				} else {
					proc.begin(ev);
				}
			});
		};

		/**
		 * @ngdoc function
		 * @name executeEndingEvents
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Executes actions associated with the ending of an event based on the appropriate event
		 *              processors.
		 * @param {Boolean} reverse Indicates whether the event is running in reverse direction.
		 */
		const executeEndingEvents = function (reverse) {
			invokeEventProcessors(this.endingEvents, function (proc, ev) {
				if (reverse) {
					proc.invertEnd(ev);
				} else {
					proc.end(ev);
				}
			});
		};

		/**
		 * @ngdoc function
		 * @name isStepIncludedFunc
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Checks whether a step (that has to be passed as the `this` argument to this function) is
		 *              included based upon any current event type restriction.
		 * @returns {Boolean} A value that indicates whether the step is included.
		 */
		const isStepIncludedFunc = function () {
			function includeForEventsList(events) {
				for (let idx = 0; idx < events.length; idx++) {
					if (state.restrictedEventTypes.byId[events[idx].type]) {
						return true;
					}
				}
				return false;
			}

			if (state.restrictedEventTypes) {
				return includeForEventsList(this.beginningEvents) || includeForEventsList(this.endingEvents);
			} else {
				return true;
			}
		};

		function anchorToTime(timelineInfo, anchor) {
			switch (anchor) {
				case 's':
					return moment.isMoment(timelineInfo.from) ? timelineInfo.from : moment();
				case 'e':
					return moment.isMoment(timelineInfo.to) ? timelineInfo.to : moment();
			}
			return moment();
		}

		/**
		 * @ngdoc function
		 * @name extractTimelineSteps
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Creates a sorted list of timeline steps for a set of events, along with any event-type-
		 *              specific global data transported with the events.
		 * @param {Array<Object>} events The original set of events.
		 * @param {String} timelineId The ID of the timeline.
		 * @returns {Object} An object with timeline steps and a map of optional global objects per event type.
		 */
		function extractTimelineSteps(events, timelineId) {
			const result = {
				steps: [],
				global: {}
			};
			const byTime = {};

			function retrieveStep(time) {
				let step = byTime[moment(time)];
				if (!step) {
					step = {
						time: moment(time),
						beginningEvents: [],
						endingEvents: [],
						executeBeginningEvents: executeBeginningEvents,
						executeEndingEvents: executeEndingEvents,
						isStepIncluded: isStepIncludedFunc
					};
					byTime[step.time] = step;
					result.steps.push(step);
				}
				return step;
			}

			const insertEvent = function (ev) {
				if (ev.from.isSameOrAfter(ev.to)) {
					ev.to = ev.from.clone().add(1, 'ms');
				}

				retrieveStep(ev.from).beginningEvents.push(ev);
				retrieveStep(ev.to).endingEvents.push(ev);

				let globalObj = result.global[ev.type];
				if (!globalObj) {
					globalObj = result.global[ev.type] = {};
				}
				if (ev.global) {
					_.assign(globalObj, ev.global);
				}
				if (ev.data && angular.isArray(ev.globalCopy)) {
					ev.globalCopy.forEach(function (propMapping) {
						globalObj[propMapping.to] = _.cloneDeep(ev.data[propMapping.from]);
					});
				}
				ev.global = globalObj;

				ev.timelineId = timelineId;
			};

			const anchoredEvents = [];
			events.forEach(function (ev) {
				ev.from = moment(ev.from);
				ev.to = moment(ev.to);

				if (_.isNil(ev.fromAnchor) && _.isNil(ev.toAnchor)) {
					insertEvent(ev);
				} else {
					if (_.isNil(ev.fromAnchor)) {
						retrieveStep(ev.from);
					} else if (_.isNil(ev.toAnchor)) {
						retrieveStep(ev.to);
					}
					anchoredEvents.push(ev);
				}
			});

			if (anchoredEvents.length > 0) {
				let minTime, maxTime;
				result.steps.forEach(function (step) {
					if (_.isNil(minTime) || step.time.isBefore(minTime)) {
						minTime = step.time;
					}
					if (_.isNil(maxTime) || step.time.isAfter(maxTime)) {
						maxTime = step.time;
					}
				});

				const timelineInfo = {
					from: moment.isMoment(minTime) ? minTime : moment(),
					to: moment.isMoment(maxTime) ? maxTime : moment()
				};

				anchoredEvents.forEach(function (ev) {
					if (!_.isNil(ev.fromAnchor)) {
						ev.from = anchorToTime(timelineInfo, ev.fromAnchor).clone();
					}
					if (!_.isNil(ev.toAnchor)) {
						ev.to = anchorToTime(timelineInfo, ev.toAnchor).clone();
						if (ev.from.isSameOrAfter(ev.to)) {
							ev.from = ev.to.clone().subtract(1, 'ms');
						}
					} else {
						if (ev.from.isSameOrAfter(ev.to)) {
							ev.to = ev.from.clone().add(1, 'ms');
						}
					}

					insertEvent(ev);
				});
			}

			result.steps.sort(function (step1, step2) {
				return step1.time.diff(step2.time);
			});
			return result;
		}

		let updatesSuspended = 0;

		/**
		 * @ngdoc function
		 * @name suspendUpdates
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Issues a method to all event processors that updates are suspended while some processing
		 *              occurs. The event processors are supposed to halt any further processing of
		 *              simulation-related data as the final state of the current simulation step has not yet been
		 *              computed.
		 */
		function suspendUpdates() {
			if (updatesSuspended <= 0) {
				Object.keys(state.eventProcessors).forEach(function (epId) {
					const ep = state.eventProcessors[epId];
					if (_.isFunction(ep.suspendUpdates)) {
						ep.suspendUpdates();
					}
				});
				updatesSuspended = 1;
			} else {
				updatesSuspended++;
			}
		}

		/**
		 * @ngdoc function
		 * @name resumeUpdates
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Issues a method to all event processors that updates have resumed after some processing has
		 *              occurred.
		 */
		function resumeUpdates() {
			updatesSuspended--;
			if (updatesSuspended <= 0) {
				updatesSuspended = 0;
				Object.keys(state.eventProcessors).forEach(function (epId) {
					const ep = state.eventProcessors[epId];
					if (_.isFunction(ep.resumeUpdates)) {
						ep.resumeUpdates();
					}
				});
			}
		}

		const onTimelineLoaded = new PlatformMessenger();
		const onTimelineUnloaded = new PlatformMessenger();

		/**
		 * @ngdoc function
		 * @name registerTimelineLoaded
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Registers an event handler for the event when a new timeline has been loaded.
		 * @param {Function} handler The event handler.
		 */
		service.registerTimelineLoaded = function (handler) {
			onTimelineLoaded.register(handler);
		};

		/**
		 * @ngdoc function
		 * @name unregisterTimelineLoaded
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Unregisters an event handler registered with {@see registerTimelineLoaded}.
		 * @param {Function} handler The event handler.
		 */
		service.unregisterTimelineLoaded = function (handler) {
			onTimelineLoaded.unregister(handler);
		};

		/**
		 * @ngdoc function
		 * @name registerTimelineUnloaded
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Registers an event handler for the event when the loaded timeline has been purged from
		 *              memory.
		 * @param {Function} handler The event handler.
		 */
		service.registerTimelineUnloaded = function (handler) {
			onTimelineUnloaded.register(handler);
		};

		/**
		 * @ngdoc function
		 * @name unregisterTimelineUnloaded
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Unregisters an event handler registered with {@see registerTimelineUnloaded}.
		 * @param {Function} handler The event handler.
		 */
		service.unregisterTimelineUnloaded = function (handler) {
			onTimelineUnloaded.unregister(handler);
		};

		/**
		 * @ngdoc function
		 * @name registerTimelineReplaced
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Registers an event handler for the event when the loaded timeline has either changed or
		 *              been unloaded.
		 * @param {Function} handler The event handler.
		 */
		service.registerTimelineReplaced = function (handler) {
			onTimelineLoaded.register(handler);
			onTimelineUnloaded.register(handler);
		};

		/**
		 * @ngdoc function
		 * @name unregisterTimelineReplaced
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Unregisters an event handler registered with {@see registerTimelineReplaced}.
		 * @param {Function} handler The event handler.
		 */
		service.unregisterTimelineReplaced = function (handler) {
			onTimelineLoaded.unregister(handler);
			onTimelineUnloaded.unregister(handler);
		};

		function TimelineHeader(id) {
			this.id = id;
		}

		TimelineHeader.prototype.isLoaded = function () {
			const that = this;
			return !!state.some(function (tlr) {
				return tlr.header === that;
			});
		};

		TimelineHeader.prototype.unload = function () {
			service.unloadTimeline(this.id);
		};

		TimelineHeader.prototype.getRequest = function () {
			throw new Error('There is no timeline request available for timeline ' + this.id + '.');
		};

		TimelineHeader.prototype.getTimerange = function () {
			const result = [this.getFrom(), this.getTo()];
			result.from = result[0];
			result.to = result[1];
			return result;
		};

		TimelineHeader.prototype.getDisplayName = function () {
			return this.id;
		};

		function requestActivePeriods() {
			const that = this; // jshint ignore: line
			that.activePeriods = null;
			const request = that.getRequest();
			that.activePeriodsPromise = $http.post(globals.webApiBaseUrl + 'model/simulation/retrieval/activeperiods', request).then(function activePeriodsReceived(response) {
				that.activePeriods = _.map(response.data, function (p) {
					return {
						from: moment(p.From),
						to: moment(p.To)
					};
				});
				that.activePeriodsPromise = null;
			}, function () {
				that.activePeriodsPromise = null;
			});
		}

		/**
		 * @ngdoc function
		 * @name registerTimelineListChanged
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Registers an event handler for the event when the list of loaded timelines has changed.
		 * @param {Function} handler The event handler.
		 */
		service.registerTimelineListChanged = function (handler) {
			state.onTimelineListChanged.register(handler);
		};

		/**
		 * @ngdoc function
		 * @name unregisterTimelineListChanged
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Unregisters an event handler registered with {@see registerTimelineListChanged}.
		 * @param {Function} handler The event handler.
		 */
		service.unregisterTimelineListChanged = function (handler) {
			state.onTimelineListChanged.unregister(handler);
		};

		/**
		 * @ngdoc function
		 * @name loadTimeline
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Loads a timeline as a basis for a simulation.
		 * @param {Object|Array<Object>} timeline The original timeline. Passing `null` clears the timeline.
		 * @param {Object} options An object that modifies the loaded timeline.
		 * @returns {TimelineHeader} A unique identifier for the timeline.
		 */
		service.loadTimeline = function (timeline, options) {
			if (_.isNil(timeline)) {
				throw new Error('No timeline data supplied.');
			}

			const timelineId = 'tl' + state.nextTimelineId++;

			let tl;
			if (_.isArray(timeline)) {
				tl = {
					events: timeline
				};
			} else {
				tl = timeline;
			}

			const tlSteps = extractTimelineSteps(_.isArray(tl.events) ? tl.events : [], timelineId);

			const timelineRecord = {
				header: new TimelineHeader(timelineId),
				getNearestSnapshot: getNearestSnapshot
			};

			function updateTimelineData(tl, isReload) {
				timelineRecord.timelineData = {
					from: moment(tl.from || moment.min(_.map(tl.events, function (ev) {
						return moment(ev.from);
					}))),
					to: moment(tl.to || moment.max(_.map(tl.events, function (ev) {
						return moment(ev.to);
					}))),
					steps: tlSteps.steps,
					global: tlSteps.global,
					getLastTypedEventsIterator: function (eventType) {
						const that = this;
						const iteratorState = {
							stepIndex: that.steps.length - 1,
							stepState: 'b',
							eventIndex: 0
						};
						iteratorState.findNext = function () {
							while (iteratorState.stepIndex >= 0) {
								try {
									const step = that.steps[iteratorState.stepIndex];
									let currentEventList;
									let nextStepState;
									switch (iteratorState.stepState) {
										case 'b':
											currentEventList = step.beginningEvents;
											nextStepState = 'e';
											break;
										case 'e':
											currentEventList = step.endingEvents;
											nextStepState = 'b';
											break;
										default:
											throw new Error('Invalid state: ' + iteratorState.stepState);
									}
									if (iteratorState.eventIndex < currentEventList.length) {
										const evt = currentEventList[iteratorState.eventIndex];
										if (evt.type === eventType) {
											return evt;
										}
									} else {
										if (nextStepState === 'b') {
											iteratorState.stepIndex--;
										}
										iteratorState.stepState = nextStepState;
										iteratorState.eventIndex = -1;
									}
								} finally {
									iteratorState.eventIndex++;
								}
							}
							return null;
						};
						return function () {
							return iteratorState.findNext();
						};
					},
					searchBinarily: function (time, minIndex, maxIndex) {
						let min = minIndex >= 0 ? minIndex : 0;
						let max = maxIndex >= 0 ? maxIndex : this.steps.length - 1;
						while (min <= max) {
							const index = Math.floor((min + max) / 2);
							if (this.steps[index].time.isBefore(time)) {
								min = index + 1;
							} else if (this.steps[index].time.isAfter(time)) {
								max = index - 1;
							} else {
								return {
									found: true,
									index: index
								};
							}
						}
						return {
							found: false,
							min: min,
							max: max
						};
					},
					indexOfStepBefore: function (time, minIndex, maxIndex) {
						const result = this.searchBinarily(time, minIndex, maxIndex);
						if (result.found) {
							return result.index;
						} else {
							return result.min >= 0 ? result.min - 1 : null;
						}
					},
					indexOfStepAfter: function (time, minIndex, maxIndex) {
						const result = this.searchBinarily(time, minIndex, maxIndex);
						if (result.found) {
							return result.index;
						} else {
							if (result.min < this.steps.length) {
								return result.min;
							} else {
								return null;
							}
						}
					},
					executeEvents: function (from, to) { // jshint ignore: line
						suspendUpdates();
						try {
							let reverse, fromIdx, toIdx;
							if (from.isBefore(to)) {
								reverse = false;
								fromIdx = this.indexOfStepAfter(from);
								toIdx = this.indexOfStepBefore(to, fromIdx);
							} else if (from.isAfter(to)) {
								reverse = true;
								fromIdx = this.indexOfStepAfter(to);
								toIdx = this.indexOfStepBefore(from, fromIdx);
							} else {
								fromIdx = null;
								toIdx = null;
							}

							if (_.isNull(fromIdx) || _.isNull(toIdx)) {
								return;
							}

							let fromStep, toStep;
							const middleSteps = [];
							if (this.steps[fromIdx].time.isSame(reverse ? to : from)) {
								fromStep = this.steps[fromIdx];
							} else {
								middleSteps.push(this.steps[fromIdx]);
							}
							if (fromIdx + 1 <= toIdx) {
								platformCollectionUtilitiesService.appendItems(middleSteps, this.steps.slice(fromIdx + 1, toIdx));
							}
							if ((middleSteps.length <= 0) || (middleSteps[middleSteps.length - 1] !== this.steps[toIdx])) {
								middleSteps.push(this.steps[toIdx]);
							} else {
								toStep = this.steps[toIdx];
							}

							let currentIdx, middleStep;
							if (reverse) {
								if (toStep) {
									toStep.executeBeginningEvents(true);
								}
								for (currentIdx = middleSteps.length - 1; currentIdx >= 0; currentIdx--) {
									middleStep = middleSteps[currentIdx];
									middleStep.executeEndingEvents(true);
									middleStep.executeBeginningEvents(true);
								}
								if (fromStep) {
									fromStep.executeEndingEvents(true);
								}
							} else {
								if (fromStep) {
									fromStep.executeEndingEvents(false);
								}
								for (currentIdx = 0; currentIdx < middleSteps.length; currentIdx++) {
									middleStep = middleSteps[currentIdx];
									middleStep.executeBeginningEvents(false);
									middleStep.executeEndingEvents(false);
								}
								if (toStep) {
									toStep.executeBeginningEvents(false);
								}
							}
						} finally {
							resumeUpdates();
						}
					}
				};

				if (options) {
					if (angular.isFunction(options.modifyStart)) {
						timelineRecord.timelineData.from = options.modifyStart(timelineRecord.timelineData.from);
					}
					if (angular.isFunction(options.modifyEnd)) {
						timelineRecord.timelineData.to = options.modifyEnd(timelineRecord.timelineData.to);
					}
				}

				const finalSnapshot = {
					time: timelineRecord.timelineData.to,
					data: {}
				};
				Object.keys(state.eventProcessors).forEach(function (epId) {
					const ep = state.eventProcessors[epId];
					const globalData = timelineRecord.timelineData.global[epId] ? timelineRecord.timelineData.global[epId] : {};
					if (angular.isFunction(ep.loadTimeline)) {
						ep.loadTimeline(timelineRecord.timelineData.getLastTypedEventsIterator(epId), globalData);
					}
					finalSnapshot.data[epId] = ep.getFinalSnapshot(timelineRecord.timelineData.getLastTypedEventsIterator(epId), globalData, timelineId);
				});
				timelineRecord.snapshots = [finalSnapshot];

				if (isReload) {
					suspendUpdates();
					try {
						updateTimelineTime.call(timelineRecord);
					} finally {
						resumeUpdates();
					}
				}
			}

			updateTimelineData(tl, false);

			if (options) {
				if (angular.isObject(options.request)) {
					timelineRecord.request = _.cloneDeep(options.request);
					timelineRecord.header.getRequest = function () {
						return _.cloneDeep(timelineRecord.request);
					};
					timelineRecord.name = _.isString(timeline.name) ? timeline.name : options.request.Name;
					timelineRecord.header.getDisplayName = function () {
						return timelineRecord.name;
					};
					requestActivePeriods.call(timelineRecord.header);

					timelineRecord.header.reload = function () {
						const modelSimulationRetrievalService = $injector.get('modelSimulationRetrievalService');
						return modelSimulationRetrievalService.retrieveTimeline(timelineRecord.request).then(function (tlData) {
							updateTimelineData(tlData, true);
							requestActivePeriods.call(timelineRecord.header);

							state.timelines.update();

							onTimelineLoaded.fire();
							state.onTimelineListChanged.fire({
								reloaded: [timelineId]
							});
							fireCurrentTimeChanged();
						});
					};
				}
			}

			timelineRecord.header.getFrom = function () {
				return timelineRecord.timelineData.from.clone();
			};

			timelineRecord.header.getTo = function () {
				return timelineRecord.timelineData.to.clone();
			};

			state.timelines.push(timelineRecord);
			state.timelines.update();

			if (state.timelines.length === 1) {
				state.currentTime = state.timelines.from;
			}

			onTimelineLoaded.fire();
			state.onTimelineListChanged.fire({
				added: [timelineId]
			});
			state.zoomedTimerange = null;
			state.onZoomedTimerangeChanged.fire();
			fireCurrentTimeChanged();

			suspendUpdates();
			try {
				updateTimelineTime.call(timelineRecord);
			} finally {
				resumeUpdates();
			}

			return timelineRecord.header;
		};

		/**
		 * @ngdoc function
		 * @name unloadTimeline
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Unloads a timeline.
		 * @param {String} id The ID of the timeline to unload.
		 * @returns {Boolean} A value that indicates whether the operation was successful.
		 */
		service.unloadTimeline = function (id) {
			const idx = _.findIndex(state.timelines, function (tlr) {
				return tlr.header.id === id;
			});
			if (idx >= 0) {
				state.timelines.splice(idx, 1);
				state.timelines.update();
				onTimelineUnloaded.fire();
				state.onTimelineListChanged.fire({
					deleted: [id]
				});
				state.zoomedTimerange = null;
				state.onZoomedTimerangeChanged.fire();
				return true;
			} else {
				return false;
			}
		};

		/**
		 * @ngdoc function
		 * @name unloadAllTimelines
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Unloads all loaded timelines.
		 */
		service.unloadAllTimelines = function () {
			const allIds = _.map(state.timelines, function (tlr) {
				return tlr.header.id;
			});
			state.timelines.splice(0, state.timelines.length);
			onTimelineUnloaded.fire();
			state.onTimelineListChanged.fire({
				deleted: allIds
			});
			state.zoomedTimerange = null;
			state.onZoomedTimerangeChanged.fire();
		};

		/**
		 * @ngdoc function
		 * @name getLoadedTimelines
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Returns headers for all loaded timelines.
		 * @returns {Array<TimelineHeader>} The loaded timelines.
		 */
		service.getLoadedTimelines = function () {
			return _.map(state.timelines, function (tlr) {
				return tlr.header;
			});
		};

		function updateTimelineTime() {
			const that = this; // jshint ignore:line
			const snapshot = that.getNearestSnapshot(state.currentTime);
			state.includedEventTypeIds().forEach(function (epId) {
				const ep = state.eventProcessors[epId];
				ep.applySnapshot(snapshot.data[epId], that.timelineData.global[epId] ? that.timelineData.global[epId] : {});
			});

			that.timelineData.executeEvents(snapshot.time, state.currentTime);
		}

		/**
		 * @ngdoc function
		 * @name moveToTime
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Moves the simulation to the specified time.
		 * @param {moment} time The time to move to.
		 * @throws {Error} No timeline has been loaded.
		 */
		service.moveToTime = function (time) {
			state.checkTimelineReady();
			let newTime = moment(time);
			if (newTime.isBefore(state.timelines.from)) {
				newTime = state.timelines.from.clone();
			} else if (newTime.isAfter(state.timelines.to)) {
				newTime = state.timelines.to.clone();
			}
			state.currentTime = newTime;

			suspendUpdates();
			try {
				state.timelines.forEach(function moveTimelineToTime(tlr) {
					updateTimelineTime.call(tlr);
				});
			} finally {
				resumeUpdates();

				fireCurrentTimeChanged();
			}
		};

		/**
		 * @ngdoc function
		 * @name collectSamples
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Invokes a callback function while executing a simulation. The execution of the simulation
		 *              happens clandestinely, so no UI update events are fired. The original time will be
		 *              reinstated after completion of the process.
		 * @param {Object} samplingParams An object that contains all settings for the operation. Please refer to
		 *                                the wiki for further information.
		 * @returns {Array<moment>} An array of time steps for which the callback was invoked.
		 * @throws {Error} No timeline has been loaded, or `samplingParams` is invalid.
		 */
		service.collectSamples = function (samplingParams) {
			let samplingFrom;
			let samplingTo;
			let samplingInterval;

			function retrieveSampleTimesWithInterval(sampleTimes) {
				const currentSampleTime = samplingFrom.clone();
				while (currentSampleTime.isSame(samplingTo) || currentSampleTime.isBefore(samplingTo)) {
					if (samplingParams.sampleCount) {
						if (sampleTimes.length >= samplingParams.sampleCount) {
							break;
						}
					}
					sampleTimes.push(currentSampleTime.clone());
					currentSampleTime.add(samplingInterval);
				}
				if (!samplingParams.sampleCount || (sampleTimes.length < samplingParams.sampleCount)) {
					if ((sampleTimes.length < 0) || !sampleTimes[sampleTimes.length - 1].isSame(samplingTo)) {
						sampleTimes.push(samplingTo.clone());
					}
				}
			}

			// This will only be called if no interval has been set _and_ if no interval could be computed based on
			// the requested number of samples.
			function retrieveSampleTimesWithoutInterval(sampleTimes) {
				const allTimes = [];

				state.timelines.forEach(function retrieveSampleTimesWithoutIntervalForTimeline(tlr) {
					const firstIndex = tlr.timelineData.indexOfStepAfter(samplingFrom);
					const lastIndex = tlr.timelineData.indexOfStepBefore(samplingTo);

					allTimes.push(samplingFrom.clone());
					if ((firstIndex !== null) && (lastIndex !== null)) {
						for (let idx = firstIndex; idx <= lastIndex; idx++) {
							const step = tlr.timelineData.steps[idx];
							if (step.isStepIncluded()) {
								allTimes.push(step.time.clone().add(1, 'ms'));
							}
						}
					}
					allTimes.push(samplingTo.clone());
				});

				allTimes.sort(function (m1, m2) {
					return m1 - m2;
				});

				platformCollectionUtilitiesService.appendItems(sampleTimes, _.uniqWith(allTimes, function (m1, m2) {
					return m1.isSame(m2);
				}));
			}

			function retrieveSampleTimes() {
				const sampleTimes = [];
				if (samplingFrom.isSame(samplingTo) || samplingFrom.isBefore(samplingTo)) {
					if (samplingInterval) {
						retrieveSampleTimesWithInterval(sampleTimes);
					} else {
						retrieveSampleTimesWithoutInterval(sampleTimes);
					}
				}
				return _.map(sampleTimes, function (t) {
					return moment.isMoment(t) ? t : moment(t);
				});
			}

			state.checkTimelineReady();
			if (!samplingParams) {
				throw new Error('No sampling parameters supplied.');
			}
			if (!angular.isFunction(samplingParams.sampleFn)) {
				throw new Error('No sampling function provided.');
			}

			samplingFrom = moment(samplingParams.from ? samplingParams.from : state.timelines.from);
			samplingTo = moment(samplingParams.to ? samplingParams.to : state.timelines.to);
			samplingInterval = null;
			if (samplingParams.sampleInterval) {
				samplingInterval = samplingParams.sampleInterval;
			} else {
				if (samplingParams.sampleCount === 1) {
					samplingInterval = moment.duration(1, 'days');
				} else if (samplingParams.sampleCount > 1) {
					const timespan = samplingTo.diff(samplingFrom);
					samplingInterval = moment.duration(timespan / samplingParams.sampleCount - 1, 'ms');
				}
			}

			const sampleTimes = retrieveSampleTimes();
			if (sampleTimes.length > 0) {
				suspendUpdates();
				state.restrictEventTypes(samplingParams.eventTypes);
				try {
					const originalTime = state.currentTime.clone();
					sampleTimes.forEach(function (time, index) {
						service.moveToTime(time);
						samplingParams.sampleFn(time.clone(), index, samplingParams.samplingContext);
					});
					service.moveToTime(originalTime);
				} finally {
					state.restrictEventTypes(null);
					resumeUpdates();
				}
			}

			return sampleTimes;
		};

		/**
		 * @ngdoc function
		 * @name getCurrentTime
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Retrieves the current simulation time.
		 * @returns {moment} The current time.
		 * @throws {Error} No timeline has been loaded.
		 */
		service.getCurrentTime = function () {
			state.checkTimelineReady();

			return state.currentTime.clone();
		};

		/**
		 * @ngdoc function
		 * @name getTimerange
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Retrieves the time range spanned by the current timeline.
		 * @returns {Array<moment>} An array with two elements and with the properties `from` and `to`.
		 * @throws {Error} No timeline has been loaded.
		 */
		service.getTimerange = function () {
			state.checkTimelineReady();

			const result = [state.timelines.from.clone(), state.timelines.to.clone()];
			result.from = result[0];
			result.to = result[1];
			return result;
		};

		/**
		 * @ngdoc function
		 * @name suggestTime
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Suggests a time that the simulation could move to.
		 * @param {moment} time The time to suggest.
		 */
		service.suggestTime = function (time) {
			state.suggestedTime = moment(time);
		};

		/**
		 * @ngdoc function
		 * @name applySuggestedTime
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Moves to the last suggested time.
		 * @throws {Error} No timeline has been loaded or no time has been suggested.
		 */
		service.applySuggestedTime = function () {
			state.checkTimelineReady();
			state.checkTimeSuggested();

			const newTime = state.suggestedTime;
			state.suggestedTime = null;
			service.moveToTime(newTime);
		};

		/**
		 * @ngdoc function
		 * @name getSuggestedTime
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Retrieves the suggested time.
		 * @returns {moment} The most recently suggested time.
		 * @throws {Error} No time has been suggested.
		 */
		service.getSuggestedTime = function () {
			state.checkTimeSuggested();

			return state.suggestedTime.clone();
		};

		/**
		 * @ngdoc function
		 * @name isTimeSuggested
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Checks whether a time has been suggested as a possible simulation progress state.
		 * @returns {Boolean} A value that indicates whether a time has been suggested.
		 */
		service.isTimeSuggested = function () {
			return !_.isNull(state.suggestedTime);
		};

		/**
		 * @ngdoc function
		 * @name cancelTimeSuggestion
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Clears any suggested time.
		 */
		service.cancelTimeSuggestion = function () {
			state.suggestedTime = null;
		};

		/**
		 * @ngdoc function
		 * @name fireCurrentTimeChanged
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Fires the `onCurrentTimeChanged` event.
		 */
		function fireCurrentTimeChanged() {
			if (updatesSuspended <= 0) {
				state.onCurrentTimeChanged.fire(state.timelines.length > 0 ? state.currentTime.clone() : null);
			}
		}

		service.onCurrentTimeChanged = {
			register: function (handler) {
				state.onCurrentTimeChanged.register(handler);
			},
			unregister: function (handler) {
				state.onCurrentTimeChanged.unregister(handler);
			}
		};

		/**
		 * @ngdoc function
		 * @name play
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Plays back the simulation. The interface of this method is tentative.
		 * @throws {Error} No timeline has been loaded.
		 */
		service.play = function () {
			state.checkTimelineReady();

			startAnimation();
			fireStartStopAnimation();
		};

		service.speeds = [{
			interval: 1000,
			factor: 6,
			unit: 'hours'
		}, {
			interval: 1000,
			factor: 12,
			unit: 'hours'
		}, {
			interval: 1000,
			factor: 18,
			unit: 'hours'
		}, {
			interval: 1000,
			factor: 24,
			unit: 'hours'
		}, {
			interval: 1000,
			factor: 48,
			unit: 'hours'
		}, {
			interval: 1000,
			factor: 72,
			unit: 'hours'
		}, {
			interval: 1000,
			factor: 168,
			unit: 'hours'
		}, {
			interval: 1000,
			factor: 720,
			unit: 'hours'
		}];

		/**
		 * @ngdoc function
		 * @name startAnimation
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Activates the animation.
		 */
		function startAnimation() {
			state.clearInterval();
			const currentSpeed = service.speeds[state.speed];
			state.timerId = window.setInterval(function () {
				const nextTime = state.currentTime.clone().add(currentSpeed.factor, currentSpeed.unit);
				if (nextTime.isAfter(state.timelines.to)) {
					window.clearInterval(state.timerId);
					state.timerId = null;
					fireStartStopAnimation();
				}
				service.moveToTime(nextTime);
			}, currentSpeed.interval);
		}

		/**
		 * @ngdoc function
		 * @name pause
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Stops playback of the simulation. The interface of this method is tentative.
		 */
		service.pause = function () {
			state.clearInterval();
			fireStartStopAnimation();
		};

		/**
		 * @ngdoc function
		 * @name rewind
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Rewinds the playback position to the beginning of the current timeline.
		 * @throws {Error} No timeline has been loaded.
		 */
		service.rewind = function () {
			state.checkTimelineReady();

			service.moveToTime(state.timelines.from);
		};

		/**
		 * @ngdoc function
		 * @name pause
		 * @function
		 * @methodOf registerEventProcessor
		 * @description Registers an event processor that will be taken into account when evaluating events.
		 * @param {Object} processor The new event processor.
		 */
		service.registerEventProcessor = function (processor) {
			state.eventProcessors[processor.id] = processor;

			state.timelines.forEach(function (tlr) {
				if (tlr.snapshots.length > 0) {
					const globalData = tlr.timelineData.global[processor.id] ? tlr.timelineData.global[processor.id] : {};
					if (angular.isFunction(processor.loadTimeline)) {
						processor.loadTimeline(tlr.timelineData.getLastTypedEventsIterator(processor.id), globalData);
					}
					tlr.snapshots[tlr.snapshots.length - 1].data[processor.id] = processor.getFinalSnapshot(tlr.timelineData.getLastTypedEventsIterator(processor.id), globalData, tlr.header.timelineId);
				}
			});
		};

		/**
		 * @ngdoc function
		 * @name getMinSimulationSpeed
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Retrieves the defined minimum simulation speed.
		 * @returns {Number} The minimum simulation speed. All integer speeds between this number and
		 *                   {@see getMaxSimulationSpeed} are supported (with both boundaries included).
		 */
		service.getMinSimulationSpeed = function () {
			return 0;
		};

		/**
		 * @ngdoc function
		 * @name getMaxSimulationSpeed
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Retrieves the defined maximum simulation speed.
		 * @returns {Number} The maximum simulation speed. All integer speeds between this number and
		 *                   {@see getMinSimulationSpeed} are supported (with both boundaries included).
		 */
		service.getMaxSimulationSpeed = function () {
			return service.speeds.length - 1;
		};

		/**
		 * @ngdoc function
		 * @name getCurrentSimulationSpeed
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Retrieves the current simulation speed.
		 * @returns {Number} The current simulation speed.
		 */
		service.getCurrentSimulationSpeed = function () {
			return state.speed;
		};

		/**
		 * @ngdoc function
		 * @name setCurrentSimulationSpeed
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Sets the current simulation speed. If the simulation is running, it will continue with the
		 *              new speed.
		 * @param {Number} speed The new simulation speed. This should be an integer number between the minimum and
		 *                       the maximum speed.
		 */
		service.setCurrentSimulationSpeed = function (speed) {
			const newSpeed = Math.min(Math.max(speed, 0), service.speeds.length - 1);
			if (state.speed !== newSpeed) {
				const restartAnimation = Boolean(state.timerId);
				state.clearInterval();
				state.speed = newSpeed;
				if (restartAnimation) {
					startAnimation();
				}
			}
		};

		service.onStartStopAnimation = new PlatformMessenger();

		/**
		 * @ngdoc function
		 * @name fireStartStopAnimation
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Fires the `onStartStopAnimation` event.
		 */
		function fireStartStopAnimation() {
			service.onStartStopAnimation.fire();
		}

		/**
		 * @ngdoc function
		 * @name getAnimationState
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Returns an object that provides some information about the state of the animation.
		 *              Currently, it contains a boolean `isRunning` property that indicates whether an animation is
		 *              running.
		 * @returns {Object} The information object.
		 */
		service.getAnimationState = function () {
			return {
				isRunning: !!state.timerId
			};
		};

		/**
		 * @ngdoc function
		 * @name getContextOptions
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Creates an object that contains context information that may be relevant for various event
		 *              providers in the back-end. The context information is retrieved from all registered event
		 *              processors.
		 * @returns {Object} The assembled context information.
		 */
		service.getContextOptions = function () {
			const result = {};

			let epCtxOptions;
			state.includedEventTypeIds().forEach(function (epId) {
				const ep = state.eventProcessors[epId];
				if (_.isFunction(ep.getContextOptions)) {
					epCtxOptions = ep.getContextOptions();
					if (epCtxOptions) {
						_.extend(result, epCtxOptions);
					}
				}
			});

			return result;
		};

		/**
		 * @ngdoc function
		 * @name getZoomedTimerange
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Returns a timerange that represents the current zoomed excerpt of the timerange.
		 * @returns {Object} A timerange. This function is guaranteed to never return null.
		 */
		service.getZoomedTimerange = function () {
			if (_.isObject(state.zoomedTimerange)) {
				return _.cloneDeep(state.zoomedTimerange);
			} else if (state.timelines.length > 0) {
				return service.getTimerange();
			} else {
				const result = [moment().month(0).date(1), moment().month(11).date(31)];
				result.from = result[0];
				result.to = result[1];
				return result;
			}
		};

		/**
		 * @ngdoc function
		 * @name registerZoomedTimerangeChanged
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Registers an event handler for the event that the zoomed excerpt of the current timeline
		 *              has changed.
		 * @param {Function} handler The event handler function to register.
		 */
		service.registerZoomedTimerangeChanged = function (handler) {
			state.onZoomedTimerangeChanged.register(handler);
		};

		/**
		 * @ngdoc function
		 * @name unregisterZoomedTimerangeChanged
		 * @function
		 * @methodOf modelSimulationMasterService
		 * @description Unregisters an event handler registered with {@see registerZoomedTimerangeChanged}.
		 * @param {Function} handler The event handler function to unregister.
		 */
		service.unregisterZoomedTimerangeChanged = function (handler) {
			state.onZoomedTimerangeChanged.unregister(handler);
		};

		service.setZoomedTimerange = function (from, to) {
			if (_.isArray(from)) {
				to = from[1];
				from = from[0];
			} else if (_.isObject(from) && from.from && from.to) {
				to = from.to;
				from = from.from;
			}

			state.zoomedTimerange = [moment(from), moment(to)];
			state.zoomedTimerange.to = state.zoomedTimerange[0];
			state.zoomedTimerange.from = state.zoomedTimerange[1];
			state.onZoomedTimerangeChanged.fire();
		};

		return service;
	}
})(angular);
