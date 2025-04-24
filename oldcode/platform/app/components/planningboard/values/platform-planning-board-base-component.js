/* global d3: false */
(function () {
	'use strict';
	angular.module('platform').factory('planningBoardBaseComponent', ['moment',
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
				baseAssignment: function baseAssignment() {
					let supplierScale, calendarScale, timeScale, supplierScrollValue, mappingService, assignments, onClickFn, onDblClickFn, onHoverFn,
						onMouseOutFn, arePointerEventsDeactivated = false;


					let _baseAssignment = function (selection) {

						function getAssignmentPositionY(d) {
							if(d3 && d3.event && d3.event.offsetY && d.isDragging) {
								let supplierId = supplierScale.supplierIdForYpx(d3.event.offsetY + supplierScrollValue);
								return supplierScale.headerLineHeight() + supplierScale.verticalIndex().get(supplierId) * supplierScale.lineHeight();
							}
							if (!_.isUndefined(d.positionY)) {
								return d.positionY;
							}
							return supplierScale.headerLineHeight() +  supplierScale.verticalIndex().get(mappingService.supplier(d)) * supplierScale.lineHeight();
						}

						function getAssignmentPositionX(d) {
							if(d3 && d3.event && d3.event.offsetX && d.isDragging) {
								return d3.event.offsetX;
							}
							if (!_.isUndefined(d.positionX)) {
								return d.positionX;
							}
							return calendarScale(mappingService.from(d));
						}

						function getAssignmentWidth(d) {
							if (!_.isUndefined(d.width)) {
								return d.width;
							}else if(_.isFunction(mappingService.duration)){
								let productDuration = mappingService.duration(d);
								const finishDate = moment();
								const startDate = moment(finishDate).subtract(productDuration, 'seconds');
								return Math.max(10, timeScale(finishDate.utc()) - timeScale(startDate.utc()));
							}
							return Math.max(10, timeScale(mappingService.to(d).utc()) - timeScale(mappingService.from(d).utc()));
						}

						function getAssignmentHeight(d) {
							if (!_.isUndefined(d.height)) {
								return d.height;
							}
							return supplierScale(d, 'bottom') - supplierScale(d, 'top');
						}

						function getFillColor(d) {
							if(d3 && d3.event && d3.event.offsetY && d.isDragging) {
								return 'rgba(0, 123, 255, 0.41)';
							}
							if (!_.isUndefined(d.fillColor)) {
								return d.fillColor;
							}
							return '#69a3b2';
						}



						let baseSelection = selection.selectAll('rect.base-assignment').data(assignments);
						baseSelection.exit().remove();

						baseSelection.enter().append('rect')
							.classed('base-assignment', true)
							.merge(baseSelection)
							.classed('assignment', true)
							.attr('id', function (d) {
								return mappingService.id(d);
							})
							.attr('x', function (d) {
								return getAssignmentPositionX(d);})
							.attr('y', function (d) {
								return getAssignmentPositionY(d);
							})
							.attr('width', function (d) {
								return getAssignmentWidth(d);
							})
							.attr('height', function (d) {
								return getAssignmentHeight(d);
							})
							.attr('stroke', 'black')
							.attr('fill',  function (d) {
								return getFillColor(d);
							});

						if (arePointerEventsDeactivated) {
							baseSelection
								.classed('assignment', true)
								.attr('pointer-events', 'none'); // otherwise drop will be triggered from wrong html element!
						}


						if (_.isFunction(onClickFn)) {
							baseSelection
								.classed('assignment', true)
								.on('click', function (d) {
									onClickFn(d);
								});
						}
						if (_.isFunction(onDblClickFn)) {
							baseSelection
								.classed('assignment', true)
								.on('dblclick', function (d) {
									onDblClickFn(d);
								});
						}
						if (_.isFunction(onHoverFn)) {
							baseSelection
								.classed('assignment', true)
								.on('mouseover', function (d) {
									onHoverFn(d);
								});
						}

						if (_.isFunction(onMouseOutFn)) {
							baseSelection
								.classed('assignment', true)
								.on('mouseout', function (d) {
									onMouseOutFn(d);
								});
						}


					};

					_baseAssignment.supplierScale = function (sc) {
						if (!arguments.length) {
							return supplierScale;
						}
						supplierScale = sc;
						return this;
					};

					_baseAssignment.calendarScale = function (value) {
						if (!arguments.length) {
							return calendarScale;
						}
						calendarScale = value;
						return this;
					};

					_baseAssignment.mapService = function (service) {
						if (!arguments.length) {
							return mappingService;
						}
						mappingService = service;
						return this;
					};

					_baseAssignment.timeScale = function (ts) {
						if (!arguments.length) {
							return timeScale;
						}
						timeScale = ts;
						return this;
					};

					_baseAssignment.supplierScrollValue = function (sv) {
						if (!arguments.length) {
							return supplierScrollValue;
						}
						supplierScrollValue = sv;
						return this;
					};

					_baseAssignment.assignments = function (data) {
						if (!arguments.length) {
							return assignments;
						}
						assignments = data;
						return this;
					};

					_baseAssignment.onHover = function (fn) {
						if (!arguments.length) {
							return onHoverFn;
						}
						onHoverFn = fn;
						return this;
					};

					_baseAssignment.onClick = function (fn) {
						if (!arguments.length) {
							return onClickFn;
						}
						onClickFn = fn;
						return this;
					};

					_baseAssignment.onDblClick = function (fn) {
						if (!arguments.length) {
							return onDblClickFn;
						}
						onDblClickFn = fn;
						return this;
					};

					_baseAssignment.onMouseOut = function (fn) {
						if (!arguments.length) {
							return onMouseOutFn;
						}
						onMouseOutFn = fn;
						return this;
					};

					_baseAssignment.deactivatePointerEvents = function (deactivate) {
						if (!arguments.length) {
							return arePointerEventsDeactivated;
						}
						arePointerEventsDeactivated = deactivate;
						return this;
					}

					return _baseAssignment;
				}
			};

		}]
	);
})();