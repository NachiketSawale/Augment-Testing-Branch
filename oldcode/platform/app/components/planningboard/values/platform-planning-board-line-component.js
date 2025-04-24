/* global d3: false */
(function () {
	'use strict';
	angular.module('platform').factory('planningBoardLineComponent', ['moment',
		function (moment) {
			// monkey patching
			if (!d3.selection.prototype.parent) {
				d3.selection.prototype.parent = function selectParent() {
					return this.select(function () {
						return this.parentNode;
					});
				};
			}

			return {
				line: function line() {
					let supplierScale, calendarScale, timeScale, mappingService, assignments, lineColor;


					let _line = function (selection) {

						function getPositionY1(d) {
							if (!_.isUndefined(d.positionY1)) {
								return d.positionY1;
							}
							return supplierScale(d, 'bottom');
						}

						function getPositionY2(d) {
							if (!_.isUndefined(d.positionY2)) {
								return d.positionY2;
							}
							return supplierScale(d, 'bottom');
						}

						function getPositionX1(d) {
							if (!_.isUndefined(d.positionX)) {
								return d.positionX1;
							}
							return calendarScale(mappingService.from(d));
						}

						function getPositionX2(d) {
							if (!_.isUndefined(d.positionX)) {
								return d.positionX2;
							}
							return calendarScale(mappingService.from(d));
						}

						let lineSelection = selection.selectAll('line.base-assignment-line').data(assignments);
						lineSelection.exit().remove();

						lineSelection.enter().append('line')
							.classed('base-assignment-line', true)
							.merge(lineSelection)
							.classed('assignment', true)
							.attr('id', function (d) {
								return mappingService.id(d);
							})
							.style('stroke', lineColor)
							.style('stroke-width', 2)
							.style('stroke-dasharray', 2)
							.style('stroke-opacity', 0.8)
							.attr('x1', function (d) {
								return getPositionX1(d);
							})
							.attr('x2', function (d) {
								return getPositionX2(d);
							})
							.attr('y1', function (d) {
								return getPositionY1(d);
							})
							.attr('y2', function (d) {
								return getPositionY2(d);
							});

					};

					_line.supplierScale = function (sc) {
						if (!arguments.length) {
							return supplierScale;
						}
						supplierScale = sc;
						return this;
					};

					_line.calendarScale = function (value) {
						if (!arguments.length) {
							return calendarScale;
						}
						calendarScale = value;
						return this;
					};

					_line.mapService = function (service) {
						if (!arguments.length) {
							return mappingService;
						}
						mappingService = service;
						return this;
					};

					_line.timeScale = function (ts) {
						if (!arguments.length) {
							return timeScale;
						}
						timeScale = ts;
						return this;
					};

					_line.assignments = function (data) {
						if (!arguments.length) {
							return assignments;
						}
						assignments = data;
						return this;
					};


					_line.lineColor = function (value) {
						if (!arguments.length) {
							return lineColor;
						}
						lineColor = value;
						return this;
					};

					return _line;
				}
			};

		}]
	);
})();