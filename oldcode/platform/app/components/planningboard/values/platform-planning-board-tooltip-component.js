/* global d3: false */
(function () {
	'use strict';
	angular.module('platform').factory('planningBoardTooltipComponent', ['moment',
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
				tooltip: function tooltip() {
					let supplierScale, calendarScale, timeScale, supplierScrollValue, assignmentMappingService, assignments, onClickFn, onDblClickFn, onHoverFn, positionX;
					let rectHeight = 12;

					let _tooltip = function (selection) {

						function getCollectionYPos(assignment) {
							if(d3 && d3.event && d3.event.offsetY) {
								let supplierId = supplierScale.supplierIdForYpx(d3.event.offsetY + supplierScrollValue);
								return supplierScale.headerLineHeight() + supplierScale.verticalIndex().get(supplierId) * supplierScale.lineHeight();
							}
							var supplierIdx = supplierScale.verticalIndex().get(assignmentMappingService.supplier(assignment));
							if (_.isUndefined(supplierIdx)) {
								return 0;
							} else {
								return supplierScale.headerLineHeight() + (supplierIdx * supplierScale.lineHeight()) + (supplierScale.lineHeight() - rectHeight);
							}
						}


						function getCorrectRectHeight() {
							return selection.selectAll('g.tooltip-container text')._groups[0][0].getBoundingClientRect().height // main line
								+ 15; // add height second line
						}




						let tooltipSelection = selection.selectAll('g.tooltip-container').data(assignments);
						tooltipSelection.exit().remove();
						tooltipSelection.enter().append('g')
							.classed('tooltip-container', true)
							.merge(tooltipSelection);

						tooltipSelection.raise();

						var tooltipDiv = selection.selectAll('g.tooltip-container')
							.append('rect')
							.style('background', 'transparent')
							.attr('stroke', '#6c848d')
							.attr('fill', '#ADD8E6')
							.attr('x', function () {
								if (!_.isUndefined(positionX)) {
									return positionX;
								}
								return calendarScale(assignmentMappingService.from(assignments[0]));
							})
							.attr('y', function (d) {
								return getCollectionYPos(assignments[0])
									+ 45.40000057220459 // height of single rect
									* assignments.indexOf(d) + 7;
							});


						let tooltipText = selection.selectAll('g.tooltip-container')
							.append('text')
							.attr('dx', '15px')
							.style('pointer-events', 'none')
							.classed('assignmentdescription', true)
							.attr('x', function (d) {
								if (!_.isUndefined(positionX)) {
									return positionX;
								}
								return calendarScale(assignmentMappingService.from(assignments[0]));
							})
							.text(function (d) {
								return assignmentMappingService.from(d).format('LLLL') + ' - ' + assignmentMappingService.to(d).format('LLLL');
							})
							.attr('width', function (d) {
								return 300;
							})
							.attr('clip-path', function (d) {
								return 'url(#clip' + d.Id + ')';
							})
							.attr('dy', function (d) {
								return getCollectionYPos(assignments[0])
									+ 45.40000057220459 // height of single rect
									* assignments.indexOf(d) + 25;
							})
							.attr('font-size', function (d) {
								return  '12px';
							})
							.attr('display', function () {
								return 'block';
							})
							.style('position', 'absolute')

							// add next text line
							.append('tspan')
							.classed('assignmentDescription', true)
							.text(function (d) {
								return assignmentMappingService.description(d) || '-';
							})
							.attr('x' , function (d) {
								if (!_.isUndefined(positionX)) {
									return positionX + 15;
								}
								return calendarScale(assignmentMappingService.from(assignments[0])) + 15;
							})
							.attr('dy', function () {
								return 15;
							});

						tooltipDiv
							.style('width', function (d) {
								return selection.selectAll('g.tooltip-container text')._parents[0].getBoundingClientRect().width + 30;
							})
							.style('height', function (d) {
								return getCorrectRectHeight();
							});



						if (_.isFunction(onClickFn)) {
							tooltipSelection
								.classed('assignment', true)
								.on('click', function (d) {
									onClickFn(d);
								});
						}
						if (_.isFunction(onDblClickFn)) {
							tooltipSelection
								.classed('assignment', true)
								.on('dblclick', function (d) {
									onDblClickFn(d);
								});
						}
						if (_.isFunction(onHoverFn)) {
							tooltipSelection
								.classed('assignment', true)
								.on('mouseover', function (d) {
									onHoverFn(d);
								});
						}

					};

					_tooltip.supplierScale = function (sc) {
						if (!arguments.length) {
							return supplierScale;
						}
						supplierScale = sc;
						return this;
					};

					_tooltip.calendarScale = function (value) {
						if (!arguments.length) {
							return calendarScale;
						}
						calendarScale = value;
						return this;
					};

					_tooltip.mapService = function (service) {
						if (!arguments.length) {
							return assignmentMappingService;
						}
						assignmentMappingService = service;
						return this;
					};

					_tooltip.supplierScrollValue = function (sv) {
						if (!arguments.length) {
							return supplierScrollValue;
						}
						supplierScrollValue = sv;
						return this;
					};

					_tooltip.assignments = function (data) {
						if (!arguments.length) {
							return assignments;
						}
						assignments = data;
						return this;
					};

					_tooltip.onHover = function (fn) {
						if (!arguments.length) {
							return onHoverFn;
						}
						onHoverFn = fn;
						return this;
					};

					_tooltip.onClick = function (fn) {
						if (!arguments.length) {
							return onClickFn;
						}
						onClickFn = fn;
						return this;
					};

					_tooltip.onDblClick = function (fn) {
						if (!arguments.length) {
							return onDblClickFn;
						}
						onDblClickFn = fn;
						return this;
					};

					_tooltip.positionX = function (value) {
						if (!arguments.length) {
							return positionX;
						}
						positionX = value;
						return this;
					};

					_tooltip.supplierScrollValue = function (sv) {
						if (!arguments.length) {
							return supplierScrollValue;
						}
						supplierScrollValue = sv;
						return this;
					};

					return _tooltip;
				}
			};

		}]
	);
})();