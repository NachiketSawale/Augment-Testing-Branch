/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerHoopsTouchService
	 * @function
	 *
	 * @description Processes touch input registered by a HOOPS viewer and translates it into events.
	 */
	angular.module('model.viewer').factory('modelViewerHoopsTouchService', ['Communicator', '_',
		'modelViewerHoopsUtilitiesService',
		function (Communicator, _, modelViewerHoopsUtilitiesService) {
			var service = {};

			service.retrieveTouchManager = function (viewer) {
				var tm = viewer.rib$touchManager;
				if (!tm) {
					tm = createTouchManager();
					viewer.rib$touchManager = tm;
				}
				return tm;
			};

			function createTouchManager() {
				var state = {
					touchCount: 0,
					touches: {},
					handlers: [],
					doHandle: function (handlerFunc) {
						for (var i = this.handlers.length - 1; i >= 0; i--) {
							if (this.handlers[i]) {
								var isHandled = handlerFunc(this.handlers[i]);
								if (isHandled) {
									return;
								}
							}
						}
					},
					handleStartSingle: function (position) {
						this.doHandle(function (h) {
							return h.handleStartSingle(position);
						});
					},
					handleMoveSingle: function (position) {
						this.doHandle(function (h) {
							return h.handleMoveSingle(position);
						});
					},
					handleEndSingle: function () {
						this.doHandle(function (h) {
							return h.handleEndSingle();
						});
					},
					handleStartPinch: function () {
						this.doHandle(function (h) {
							return h.handleStartPinch();
						});
					},
					handlePinch: function (scale, absolute) {
						this.doHandle(function (h) {
							return h.handlePinch(scale, absolute);
						});
					},
					handleStartSlide: function (position) {
						this.doHandle(function (h) {
							return h.handleStartSlide(position);
						});
					},
					handleSlide: function (position) {
						this.doHandle(function (h) {
							return h.handleSlide(position);
						});
					},
					handleEndSlide: function () {
						this.doHandle(function (h) {
							return h.handleEndSlide();
						});
					}
				};
				state.getTouchesArray = function () {
					return _.map(Object.keys(state.touches), function (id) {
						return state.touches[id];
					});
				};

				var result = {
					startTouch: function (id, position) {
						if (!state.touches[id]) {
							state.touchCount++;
						}

						state.touches[id] = {
							currentPos: position.copy()
						};
						var touches = state.getTouchesArray();
						touches.forEach(function (t) {
							t.startPos = t.currentPos;
						});

						switch (state.touchCount) {
							case 1:
								state.handleStartSingle(state.touches[id].startPos);
								break;
							case 2:
								state.handleEndSingle();
								state.avgStartPos = modelViewerHoopsUtilitiesService.getCenter2(touches[0].startPos, touches[1].startPos);
								state.startPosDist = Math.abs(Communicator.Point2.subtract(touches[0].startPos, touches[1].startPos).length());
								if (state.startPosDist === 0) {
									state.startPosDist = 1;
								}

								state.handleStartPinch();
								state.handleStartSlide(state.avgStartPos);
								break;
						}
					},
					moveTouch: function (id, position) {
						if (state.touches[id]) {
							if (state.touches[id].currentPos.equals(position)) {
								return;
							}

							state.touches[id].currentPos = position.copy();

							switch (state.touchCount) {
								case 1:
									state.handleMoveSingle(state.touches[id].currentPos);
									break;
								case 2:
									(function () {
										var touches = state.getTouchesArray();

										var avgCurrent = modelViewerHoopsUtilitiesService.getCenter2(touches[0].currentPos, touches[1].currentPos);
										var currentDist = Math.abs(Communicator.Point2.subtract(touches[0].currentPos, touches[1].currentPos).length());

										state.handlePinch(currentDist / state.startPosDist, currentDist - state.startPosDist);
										state.handleSlide(avgCurrent);
									})();
									break;
							}
						}
					},
					endTouch: function (id) {
						if (state.touches[id]) {
							delete state.touches[id];
							state.touchCount--;

							switch (state.touchCount) {
								case 0:
									state.handleEndSingle();
									break;
								case 1:
									(function () {
										state.handleEndSlide();
										var singleTouch = state.touches[Object.keys(state.touches)[0]];
										singleTouch.startPos = singleTouch.currentPos;
										state.handleStartSingle(singleTouch.currentPos);
									})();
									break;
							}
						}
					},
					registerHandler: function (priority, handler) {
						state.handlers[priority] = handler;
					},
					unregisterHandler: function (handler) {
						var idx = state.handlers.indexOf(handler);
						if (idx >= 0) {
							state.handlers.splice(idx, 1);
						}
					}
				};
				return result;
			}

			return service;
		}]);
})(angular);
