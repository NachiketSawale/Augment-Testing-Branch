/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

// This file uses D3 v4.
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.simulation.modelSimulationTimelineGraphicService
	 * @function
	 *
	 * @description Proivdes graphical elements and utilities for use in the simulation timeline.
	 */
	angular.module('model.simulation').factory('modelSimulationTimelineGraphicService',
		modelSimulationTimelineGraphicService);

	modelSimulationTimelineGraphicService.$inject = ['_', 'moment',
		'modelSimulationMasterService', 'd3'];

	function modelSimulationTimelineGraphicService(_, moment, modelSimulationMasterService, d3) {
		const service = {};

		/**
		 * @ngdoc function
		 * @name bgBox
		 * @function
		 * @methodOf modelSimulationTimelineGraphicService
		 * @description Provides a colored background rectangle.
		 * @returns {Function} A function that displays the rectangle.
		 */
		service.bgBox = function () {
			return function (selection) {
				let box = selection.select('rect.box');
				if (box.empty()) {
					box = selection.append('rect').classed('box', true);
					box.attr('fill', '#dcdcdc');
				}
			};
		};

		/**
		 * @ngdoc function
		 * @name thumb
		 * @function
		 * @methodOf modelSimulationTimelineGraphicService
		 * @description Provides an indicator for the current simulation time in a timebar.
		 * @param {d3.selection} axisLayer The axis layer that determines the overall height of the timebar.
		 * @returns {Function} A function that displays the thumb.
		 */
		service.thumb = function (axisLayer) {
			let scale = d3.scaleUtc().clamp(false);

			const thumb_ = function (selection) {
				let thumbLine = selection.select('line.thumbLine.actual');
				if (modelSimulationMasterService.isTimelineReady()) {
					// selection.attr('transform', 'translate(' + scale(modelSimulationMasterService.getCurrentTime()) + ',0)');
					if (thumbLine.empty()) {
						thumbLine = selection.append('line').classed('thumbLine', true).classed('actual', true).attr('y1', '0').attr('y2', function () {
							if (axisLayer.empty()) {
								return 0;
							} else {
								return axisLayer.node().getBBox().height;
							}
						});
					}

					let newX = scale(modelSimulationMasterService.getCurrentTime()) + 'px';
					thumbLine.attr('x1', newX).attr('x2', newX);

					let previewLine = selection.select('line.thumbLine.preview');
					if (modelSimulationMasterService.isTimeSuggested()) {
						thumbLine.classed('ghosted', true);
						if (previewLine.empty()) {
							previewLine = selection.append('line').classed('thumbLine', true).classed('preview', true).attr('y1', '0').attr('y2', function () {
								if (axisLayer.empty()) {
									return 0;
								} else {
									return axisLayer.node().getBBox().height;
								}
							});
						}
						newX = scale(modelSimulationMasterService.getSuggestedTime()) + 'px';
						previewLine.attr('x1', newX).attr('x2', newX);
					} else {
						thumbLine.classed('ghosted', false);
						if (!previewLine.empty()) {
							previewLine.remove();
						}
					}
				} else {
					thumbLine.remove();
				}
			};

			thumb_.scale = function (newScale) {
				if (!arguments.length) {
					return scale;
				}
				scale = newScale;
				return this;
			};

			return thumb_;
		};

		/**
		 * @ngdoc function
		 * @name past
		 * @function
		 * @methodOf modelSimulationTimelineGraphicService
		 * @description Provides an indicator for the passed simulation time in a timebar.
		 * @param {d3.selection} axisLayer The axis layer that determines the overall height of the timebar.
		 * @returns {Function} A function that displays the colored area.
		 */
		service.past = function (axisLayer) {
			let scale = d3.scaleUtc().clamp(false);

			const past_ = function (selection) {
				let pastArea = selection.select('rect.pastArea');
				if (modelSimulationMasterService.isTimelineReady()) {
					if (pastArea.empty()) {
						pastArea = selection.append('rect').classed('pastArea', true).attr('x', '0').attr('y', '0').attr('height', function () {
							if (axisLayer.empty()) {
								return 0;
							} else {
								return axisLayer.node().getBBox().height;
							}
						});
					}
					pastArea.attr('width', Math.max(scale(modelSimulationMasterService.getCurrentTime()), 0));
				} else {
					pastArea.remove();
				}
			};

			past_.scale = function (newScale) {
				if (!arguments.length) {
					return scale;
				}
				scale = newScale;
				return this;
			};

			return past_;
		};

		/**
		 * @ngdoc function
		 * @name today
		 * @function
		 * @methodOf modelSimulationTimelineGraphicService
		 * @description Provides an indicator for the current day in a timebar.
		 * @param {d3.selection} axisLayer The axis layer that determines the overall height of the timebar.
		 * @returns {Function} A function that displays the indicator.
		 */
		service.today = function (axisLayer) {
			let scale = d3.scaleUtc().clamp(false);

			const today_ = function (selection) {
				let todayLine = selection.select('line.todayLine');
				selection.attr('transform', 'translate(' + scale(moment.utc().startOf('day')) + ',0)');
				if (todayLine.empty()) {
					todayLine = selection.append('line').classed('todayLine', true);
					todayLine.attr('y1', '0').attr('y2', function () {
						if (axisLayer.empty()) {
							return 0;
						} else {
							return axisLayer.node().getBBox().height;
						}
					});
				}
			};

			today_.scale = function (newScale) {
				if (!arguments.length) {
					return scale;
				}
				scale = newScale;
				return this;
			};

			return today_;
		};

		return service;
	}
})(angular);
