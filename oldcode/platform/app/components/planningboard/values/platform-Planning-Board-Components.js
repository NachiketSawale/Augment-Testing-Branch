/* global d3: false */
(function () {
	'use strict';
	angular.module('platform').factory('planningBoardComponents', ['basicsCustomizeReservationTypeIconService', 'platformStatusIconService', 'moment',
		'basicsCommonDrawingUtilitiesService', 'platfromPlanningBoardAssignmentComponentConstants', 'platformPlanningBoardAggregationService', 'planningBoardTooltipComponent', 'platformPlanningBoardLabelConfigService', '_',
		function (basicsCustomizeReservationTypeIconService, platformStatusIconService, moment, basicsCommonDrawingUtilitiesService, assignmentComponentConstants, platformPlanningBoardAggregationService,
			planningBoardTooltipComponent, platformPlanningBoardLabelConfigService, _) {
			// monkey patching
			if (!d3.selection.prototype.parent) {
				d3.selection.prototype.parent = function selectParent() {
					return this.select(function () {
						return this.parentNode;
					});
				};
			}

			const rgbaColorCache = {}; // key: int (dec), values: {key: decrease factor or 'defualt' for 0 decrease factor}rgba string

			function getMin(data) {
				return data.reduce((a, c) => a < c ? a : c, data[0]);
			}


			function getMax(data) {
				return data.reduce((a, c) => a > c ? a : c, data[0]);
			}

			return {
				toolTipBackground: function toolTipBackground() {
					var infoMsg, timeScale, offset, day, onDblClickFn;
					var _toolTipBackground = function (selection) {
						selection.append('g').classed('toolTipBackground', true)
							.append('rect')
							.attr('transform', 'translate(' + (timeScale(day.day) + 15) + ',' + (d3.event.offsetY - 22 - offset) + ')')
							.attr('width', infoMsg.length * 6.5 + 20)
							.attr('height', 30)
							.parent().append('text')
							.attr('transform', 'translate(' + (timeScale(day.day) + 25) + ',' + (d3.event.offsetY - 5 - offset) + ')')
							.text(function () {
								return infoMsg;
							})
							.classed('toolTipLabel', true);

						if (_.isFunction(onDblClickFn)) {
							selection.on('dblclick', onDblClickFn);
						}

					};

					// public properties and functions
					_toolTipBackground.infoMsg = function (msg) {
						if (!arguments.length) {
							return infoMsg;
						}
						infoMsg = msg;
						return this;
					};

					_toolTipBackground.timeScale = function (ts) {
						if (!arguments.length) {
							return timeScale;
						}
						timeScale = ts;
						return this;
					};

					_toolTipBackground.offset = function (os) {
						if (!arguments.length) {
							return offset;
						}
						offset = os;
						return this;
					};

					_toolTipBackground.day = function (d) {
						if (!arguments.length) {
							return day;
						}
						day = d;
						return this;
					};

					_toolTipBackground.onDblClickFn = function (d) {
						if (!arguments.length) {
							return onDblClickFn;
						}
						onDblClickFn = d;
						return this;
					};

					return _toolTipBackground;
				},
				backgroundHeader: function backgroundHeader() {
					var heExceptionDayClickHandler, startDate, timeScale;
					var _backgroundHeader = function (selection) {
						var newBackgroundsHeader = selection.enter()
							.append('rect')
							.on('click', heExceptionDayClickHandler)
							.classed('backgrounds', true)
							.style('fill', function (d) {
								return d.bgColor;
							});
						selection.exit().remove();
						selection = newBackgroundsHeader.merge(selection);
						selection.attr('height', 19)
							.attr('width', timeScale(moment(new Date(startDate).getTime()).add(1, 'day')))
							.attr('transform', function (day) {
								return 'translate(' + timeScale(day.day) + ', -19)';
							});

					};

					// public properties and functions
					_backgroundHeader.startDate = function (sd) {
						if (!arguments.length) {
							return startDate;
						}
						startDate = sd;
						return this;
					};

					_backgroundHeader.heExceptionDayClickHandler = function (he) {
						if (!arguments.length) {
							return heExceptionDayClickHandler;
						}
						heExceptionDayClickHandler = he;
						return this;
					};

					_backgroundHeader.timeScale = function (ts) {
						if (!arguments.length) {
							return timeScale;
						}
						timeScale = ts;
						return this;
					};

					return _backgroundHeader;
				},

				backgrounds: function backgrounds() {
					let supplierScale, bgExceptionDayClickHandler, timeScale, startDate, endDate, verticalIndexSize, containerDimensions, supplierScrollValue, supplierBackgrounds, supplierScaleScopeVerticalIndex;

					function filterSupplierInYAxis () {
						let visibleSuppIds = supplierScale.verticalIndex();
						let filteredSuppliersInY = new Map();
						[...visibleSuppIds.entries()].map(x => filteredSuppliersInY.set(x[0], supplierBackgrounds.get(x[0])));
						return filteredSuppliersInY;
					}

					let _backgrounds = function (selection) {
						let startDateMS = new Date(startDate).getTime();
						let filteredSuppliersAllAxis = filterSupplierInYAxis();
						selection = selection.selectAll('g.backgrounds').data([...filteredSuppliersAllAxis.keys()], function identify(supplierId) {
							return supplierId;
						});

						let newBackgrounds = selection.enter()
							.append('g')
							.classed('backgrounds', true);

						selection.exit().remove();
						selection = newBackgrounds.merge(selection);

						selection.attr('height', () => {
							return supplierScale.lineHeight();
						})
							.attr('width', containerDimensions().width)
							.attr('transform', function (supplierId) {
								let supplierIndex = supplierScaleScopeVerticalIndex.get(supplierId);
								if(_.isUndefined(supplierIndex)) {
									supplierIndex = 0;
								}
								return 'translate(' + 0 + ',' +(supplierScale.headerLineHeight() + (supplierIndex  * supplierScale.lineHeight()))+ ')';
							});
							let supplierLineHeight = supplierScale.lineHeight();
						selection.each(function setDayBackground (supplierId) {
							const supplierBackgroundData = filteredSuppliersAllAxis.get(supplierId);
							if(supplierBackgroundData) {
								let that = this;
								let subBackgrounds = d3.select(that).selectAll('rect.sub-background').data(supplierBackgroundData);
									let newSubBackgrounds = subBackgrounds.enter()
									.append('rect')
									.on('click', bgExceptionDayClickHandler)
									.classed('sub-background', true);

									subBackgrounds.exit().remove();
									const mergedSubBackgrounds = newSubBackgrounds.merge(subBackgrounds);
									mergedSubBackgrounds
									.attr('width', timeScale(startDateMS + 86400000))
									.attr('x', function (day) {
										return timeScale(day.dayMs);
									})
									.attr('height', () => {
										return supplierLineHeight;
									})
									.style('fill', function (day) {
										return day.bgColor;
									});
							}
						});
					};

					// public properties and functions
					_backgrounds.supplierScale = function (sc) {
						if (!arguments.length) {
							return supplierScale;
						}
						supplierScale = sc;
						return this;
					};

					_backgrounds.bgExceptionDayClickHandler = function (b) {
						if (!arguments.length) {
							return bgExceptionDayClickHandler;
						}
						bgExceptionDayClickHandler = b;
						return this;
					};

					_backgrounds.startDate = function (sd) {
						if (!arguments.length) {
							return startDate;
						}
						startDate = sd;
						return this;
					};

					_backgrounds.endDate = function (sd) {
						if (!arguments.length) {
							return endDate;
						}
						endDate = sd;
						return this;
					};

					_backgrounds.verticalIndexSize = function (vis) {
						if (!arguments.length) {
							return verticalIndexSize;
						}
						verticalIndexSize = vis;
						return this;
					};

					_backgrounds.timeScale = function (ts) {
						if (!arguments.length) {
							return timeScale;
						}
						timeScale = ts;
						return this;
					};

					_backgrounds.containerDimensions = function (containerDimensionsFn) {
						if (!arguments.length) {
							return containerDimensions;
						}
						containerDimensions = containerDimensionsFn;
						return this;
					};

					_backgrounds.supplierScrollValue = function (scv) {
						if (!arguments.length) {
							return supplierScrollValue;
						}
						supplierScrollValue = scv;
						return this;
					};

					_backgrounds.supplierBackgrounds = function (scv) {
						if (!arguments.length) {
							return supplierBackgrounds;
						}
						supplierBackgrounds = scv;
						return this;
					};

					_backgrounds.supplierScaleScopeVerticalIndex = function (svi) {
						if (!arguments.length) {
							return supplierScaleScopeVerticalIndex;
						}
						supplierScaleScopeVerticalIndex = svi;
						return this;
					};

					return _backgrounds;
				},
				lanes: function lanes() {
					var panelWidth, supplierScale;
					var _lanes = function (selection) {
						var newLanes = selection.enter()
							.append('rect')
							.attr('width', panelWidth)
							.attr('height', 1)
							.classed('lanes', true)
							.classed('lanesLine', true);
						selection.exit().remove();
						selection = newLanes.merge(selection);
						selection.attr('width', panelWidth)
							.attr('transform', function (d) {
								return 'translate(0,' + (supplierScale.headerLineHeight() + (d + 1) * supplierScale.lineHeight()) + ')';
							});
					};

					// public properties and functions
					_lanes.panelWidth = function (pw) {
						if (!arguments.length) {
							return panelWidth;
						}
						panelWidth = pw;
						return this;
					};

					_lanes.supplierScale = function (s) {
						if (!arguments.length) {
							return supplierScale;
						}
						supplierScale = s;
						return this;
					};

					return _lanes;
				},

				textLine: function textLine(d, textlineValue, isMainInfoLabel = false, mapService) {
					return platformPlanningBoardLabelConfigService.getTextLineOfType(d, textlineValue, isMainInfoLabel, mapService);
				},
				indicatorAreas: function indicatorAreas() {
					function getAreaXWidth(d) {
						return Math.max(15, calendarScale(endDate.toDate()) - calendarScale(startDate.toDate()));
					}

					function getAreaYPosition(d) {
						var supplierIdx = supplierScale.verticalIndex().get(mapService.id(d));
						if (_.isUndefined(supplierIdx)) {
							return 0;
						} else {
							return supplierScale.headerLineHeight() + (supplierIdx * supplierScale.lineHeight()) + 1;
						}
					}

					var panelWidth, supplierScale, calendarScale, startDate, endDate, indicatorY, mapService;
					var _indicatorAreas = function (selection) {
						var newIndicatorAreas = selection.enter()
							.append('rect')
							.attr('height', function (d) {
								return supplierScale.lineHeight();
							})
							.attr('width', function (d) {
								return getAreaXWidth(d);
							})
							.attr('x', function (d) {
								return calendarScale(startDate.toDate());
							})
							.attr('y', function (d) {
								return (indicatorY) ? indicatorY : getAreaYPosition(d);
							})
							.attr('class', function (d) {
								if (d.indicationAreaType === 'warning') {
									return 'warning';
								} else if (d.indicationAreaType === 'error') {
									return 'error';
								} else {
									return 'disabled';
								}
							})
							.classed('assignment indicator-area', true);
						selection.exit().remove();
					};

					// public properties and functions
					_indicatorAreas.calendarScale = function (s) {
						if (!arguments.length) {
							return calendarScale;
						}
						calendarScale = s;
						return this;
					};

					_indicatorAreas.supplierScale = function (s) {
						if (!arguments.length) {
							return supplierScale;
						}
						supplierScale = s;
						return this;
					};

					_indicatorAreas.startDate = function (s) {
						if (!arguments.length) {
							return startDate;
						}
						startDate = s;
						return this;
					};

					_indicatorAreas.endDate = function (s) {
						if (!arguments.length) {
							return endDate;
						}
						endDate = s;
						return this;
					};

					_indicatorAreas.indicatorY = function (s) {
						if (!arguments.length) {
							return indicatorY;
						}
						indicatorY = s;
						return this;
					};

					_indicatorAreas.mapService = function (s) {
						if (!arguments.length) {
							return mapService;
						}
						mapService = s;
						return this;
					};

					return _indicatorAreas;
				},
				assignmentCollection: function assignmentCollection() {

					function getCollectionText(assignments) {
						let collectionString = '';
						if (assignments[0].collectionStart && assignments.some(x => x.isVerticallyCollected)) {
							collectionString += '+';
						}
						return (assignments.length > 9) ? collectionString + '*' : collectionString + assignments.length;
					}

					function getCollectionYPos(assignment) {
						var supplierIdx = supplierScale.verticalIndex().get(mapService.supplier(assignment));
						if (_.isUndefined(supplierIdx)) {
							return 0;
						} else if (assignment.collectionStart && assignment.isVerticallyCollected) {
							return supplierScale.headerLineHeight() + (supplierIdx * supplierScale.lineHeight()) + (supplierScale.lineHeight() - rectHeight);
						} else {
							return supplierScale.headerLineHeight() + (supplierIdx * supplierScale.lineHeight()) + 1;
						}
					}

					function getCollectionWidth(assignment) {
						if (assignment.collectionStart && assignment.isVerticallyCollected) {
							return rectWidth;
						}
						return rectHeight;
					}

					var calendarScale, supplierScale, mapService, assignmentCollectionsObject, collectionConfig, supplierScrollValue, calendarDateEnd, calendarDateStart;
					var rectHeight = 12;
					var rectWidth = 15;

					let assignmentGroupTooltipsLayer = d3.selection().select('g.assignment-tooltip-container');

					var _assignmentCollection = function (selection) {


						const visibleSupplierIds = Array.from(supplierScale.verticalIndex().keys());
						// render only assignments of visible suppliers in y-axis
						if (assignmentCollectionsObject) {
							assignmentCollectionsObject = assignmentCollectionsObject.filter(fitleredAssignmentsCollection => visibleSupplierIds.includes(mapService.supplier(fitleredAssignmentsCollection[0])));
							// render only assignment in visible range in x-axis
							assignmentCollectionsObject = assignmentCollectionsObject.filter(function (fitleredAssignmentsCollection) {
								return !_.isUndefined(mapService) ? moment.min(fitleredAssignmentsCollection.map(x => mapService.from(x))).toDate() - calendarDateEnd.toDate() <= -3600000 && moment.max(fitleredAssignmentsCollection.map(x => mapService.to(x))).toDate() - calendarDateStart.toDate() >= 3600000 : fitleredAssignmentsCollection;
							});
						}


						var collectionContainer = selection.select('g.collection-container');
						collectionContainer.raise();

						var collections = collectionContainer.selectAll('g.collection').data(assignmentCollectionsObject);
						var newCollections = collections.enter()
							.append('g')
							.classed('collection', true);
						collections.exit().remove();

						newCollections.append('rect')
							.style('fill', function() {
								let color = 'rgba(255,255,255,1)';

								if (!_.isUndefined(collectionConfig) && !_.isUndefined(collectionConfig.background)) {
									let dec = +(collectionConfig.background);
									color = rgbaColorCache[dec]?.default;

									if (!color) {
										color = basicsCommonDrawingUtilitiesService.intToRgbColor(collectionConfig.background);
										!rgbaColorCache[dec] ? rgbaColorCache[dec] = {} : true;
										rgbaColorCache[dec].default = color;
									}
								}
								return color;
							})
							.style('stroke',
								function() {
									let color = 'rgba(0,0,0,1)';

									if (!_.isUndefined(collectionConfig) && !_.isUndefined(collectionConfig.border)) {
										let dec = +(collectionConfig.border);
										color = rgbaColorCache[dec]?.default;

										if (!color) {
											color = basicsCommonDrawingUtilitiesService.intToRgbColor(collectionConfig.border);
											!rgbaColorCache[dec] ? rgbaColorCache[dec] = {} : true;
											rgbaColorCache[dec].default = color;
										}
									}
									return color;
							})
							.style('stroke-width', '1px')
							.on('mouseover', function (d) {

								assignmentGroupTooltipsLayer = selection.parent().select('g.assignment-tooltip-container');

								const tooltipDiv = assignmentGroupTooltipsLayer.selectAll('rect');
								const tooltipDiv2 = assignmentGroupTooltipsLayer.selectAll('text');
								tooltipDiv.remove();
								tooltipDiv2.remove();

								const assignmentGroupTooltipComponent = planningBoardTooltipComponent.tooltip()
									.supplierScale(supplierScale)
									.calendarScale(calendarScale)
									.mapService(mapService)
									.supplierScrollValue(supplierScrollValue)
									.assignments(d)
									.positionX(calendarScale(d[0].collectionStart) + 7);

								assignmentGroupTooltipsLayer.call(assignmentGroupTooltipComponent);
								assignmentGroupTooltipsLayer.transition()
									.duration(100)
									.style('opacity', 0.9);
							})
							.on('mouseout', function (d) {
								assignmentGroupTooltipsLayer.transition()
									.duration(100)
									.style('opacity', 0);
								const tooltipDiv = assignmentGroupTooltipsLayer.selectAll('rect');
								const tooltipDiv2 = assignmentGroupTooltipsLayer.selectAll('text');
								tooltipDiv.remove();
								tooltipDiv2.remove();
							})
							.classed('collection-item', true);

						newCollections.append('text')
							.style('text-anchor', 'middle')
							.style('pointer-events', 'none')
							.classed('assignmentdescription', true);

						var mergedCollections = newCollections.merge(collections);

						mergedCollections.select('rect.collection-item')
							.attr('height', function () {
								return rectHeight;
							})
							.attr('width', function (d) {
								return getCollectionWidth(d[0]);
							})
							.attr('x', function (d) {
								return calendarScale(d[0].collectionStart);
							})
							.attr('y', function (d) {
								return getCollectionYPos(d[0]);
							});

						mergedCollections
							.attr('x', function (d) {
								return calendarScale(d[0].collectionStart);
							})
							.attr('y', function (d) {
								return getCollectionYPos(d[0]);
							});

						mergedCollections.select('text.assignmentdescription')
							.attr('height', function () {
								return rectHeight;
							})
							.attr('width', function (d) {
								return getCollectionWidth(d[0]);
							})
							.attr('x', function (d) {
								return calendarScale(d[0].collectionStart);
							})
							.attr('y', function (d) {
								return getCollectionYPos(d[0]) + ((d.length > 9) ? 7 : 0);
							})
							.attr('dx', function (d) {
								return ((getCollectionWidth(d[0]) / 2));
							})
							.attr('dy', function () {
								return ((rectHeight / 2) + 4);
							})
							.style('font-size', function (d) {
								return (d.length > 9) ? '20px' : '12px';
							})
							.style('fill', function() {
								let color = 'rgba(0,0,0,1)';

								if (!_.isUndefined(collectionConfig) && !_.isUndefined(collectionConfig.background)) {
									let dec = +(collectionConfig.font);
									color = rgbaColorCache[dec]?.default;

									if (!color) {
										color = basicsCommonDrawingUtilitiesService.intToRgbColor(collectionConfig.font);
										!rgbaColorCache[dec] ? rgbaColorCache[dec] = {} : true;
										rgbaColorCache[dec].default = color;
									}
								}
								return color;
							})
							.text(function (d) {
								return getCollectionText(d);
							});
					};

					// public properties and functions
					_assignmentCollection.calendarScale = function (s) {
						if (!arguments.length) {
							return calendarScale;
						}
						calendarScale = s;
						return this;
					};

					_assignmentCollection.supplierScale = function (s) {
						if (!arguments.length) {
							return supplierScale;
						}
						supplierScale = s;
						return this;
					};

					_assignmentCollection.assignments = function (a) {
						if (!arguments.length) {
							return assignmentCollectionsObject;
						}
						assignmentCollectionsObject = a;
						return this;
					};

					_assignmentCollection.mapService = function (service) {
						if (!arguments.length) {
							return mapService;
						}
						mapService = service;
						return this;
					};

					_assignmentCollection.collectionConfig = function (config) {
						if (!arguments.length) {
							return collectionConfig;
						}
						collectionConfig = config;
						return this;
					};

					_assignmentCollection.supplierScrollValue = function (value) {
						if (!arguments.length) {
							return supplierScrollValue;
						}
						supplierScrollValue = value;
						return this;
					};


					_assignmentCollection.calendarDateStart = function (cds) {
						if (!arguments.length) {
							return calendarDateStart;
						}
						calendarDateStart = cds;
						return this;
					};

					_assignmentCollection.calendarDateEnd = function (cde) {
						if (!arguments.length) {
							return calendarDateEnd;
						}
						calendarDateEnd = cde;
						return this;
					};


					return _assignmentCollection;
				},
				assignmentItems: function assignmentItems() {

					// private 'static' stuff (functions and members)
					var calendarScale, supplierScale, dragHandler, clickEvent, doubleClickEvent,
						assignmentStartDragHandler,
						assignmentEndDragHandler, showHeaderColor, showSameAssignments, showStatusIcon, showInTransportIcon, statusIconItems,
						backgroundColorConfig,
						showTypeIcon, showMainText, showInfo1Text, showInfo2Text, showInfo3Text, mainInfoLabel, info1Label, info2Label, info3Label,
						typeIconItems, mapService, assignmentDataService, assignments,
						draggingAssignmentSupplier, lastDraggingAssignmentSupplier = false, draggingAssignment,
						isMultiSelect = false,
						assignmentCollection,
						aggregationHeight = 20,
						useTaggingSystem = false,
						calendarDateStart, calendarDateEnd, containerDimensions, supplierScrollValue;

					let allStausIconItems = {};
					let allReservationStausIconItems = {};

					var _assignmentItems = function (selection, actionType) {
						var assignmentData = [];
						var maintainanceData = [];
						var layerAssignmentData = [];

						function getAssignmentYPos(sel, d) {
							const y = supplierScale(d, 'top');

							if (d.hasOwnProperty('top')) {
								return y + d.top;
							}

							return y + 0;
						}

						function getAssignmentYHeight(sel, d) {
							var assignmentHeight = supplierScale(d, 'bottom') - supplierScale(d, 'top');
							return (assignmentHeight - aggregationHeight) * d.scale;
						}

						function getAssignmentYBottom(sel, d) {
							return getAssignmentYPos(sel, d) + getAssignmentYHeight(sel, d);
						}

						function getAssignmentYCenter(sel, d) {
							return getAssignmentYPos(sel, d) + (getAssignmentYHeight(sel, d) / 2);
						}

						function getAssignmentIconSize(sel, d) {
							return getMin([assignmentComponentConstants.maxIconSize, getAssignmentYHeight(sel, d) / 4]);
						}

						function getAssignmentXWidth(d, calendarToFromDiff) {
							if (!calendarToFromDiff) {
								calendarToFromDiff = calendarScale(d._endDateInMs) - calendarScale(d._startDateInMs);
							}
							return assignmentComponentConstants.minAssignmentSize > calendarToFromDiff ? 1 : calendarToFromDiff;
						}

						function firstTextLineY(d) {
							return getMin([assignmentComponentConstants.maxSpaceInfoTexts, getMax([10, (getAssignmentYHeight(selection.datum(), d) / 5) + 15])]); // 10 without tagging system
						}

						function textLineHeight(d) {
							return getMin([assignmentComponentConstants.maxFontSizeInfoText, getMax([9, (Math.round(Number(getAssignmentYHeight(selection.datum(), d) / 14))) + 9])]);
						}

						function assignmentInRange(assignment) {
							return mapService.supplier(draggingAssignment) === mapService.supplier(assignment) ||
								lastDraggingAssignmentSupplier === mapService.supplier(assignment);
						}

						function pushIntoDataArrays(val) {
							if (_.isFunction(mapService.layer) && mapService.layer(val).length > 0) {
								if (!_.isArray(layerAssignmentData[mapService.layer(val)])) {
									layerAssignmentData[mapService.layer(val)] = [];
								}
								val.Disabled = !(val.PlanningboardConfig.Editable);
								layerAssignmentData[mapService.layer(val)].push(val);
							} else {
								if (mapService.forMaintenance(val)) {
									maintainanceData.push(val);
								} else {
									assignmentData.push(val);
								}
							}
						}

						function getBackgroundColorByConfig(id, items, decreaseFactor, bgcEntity) {
							let color;
							if (id) {
								if (!bgcEntity) {
									bgcEntity = items.find(sii => sii.Id === id && sii.BackgroundColor);
								}

								if (bgcEntity) {
									let dec = +(bgcEntity.BackgroundColor);
									color = rgbaColorCache[dec] && rgbaColorCache[dec][decreaseFactor];

									if(!color) {
										let hexa = bgcEntity.BackgroundColor.toString(16);
										hexa = hexa.padStart(6, '0').slice('');
										let r = parseInt(hexa[0] + hexa[1], 16) - decreaseFactor;
										let g = parseInt(hexa[2] + hexa[3], 16) - decreaseFactor;
										let b = parseInt(hexa[4] + hexa[5], 16) - decreaseFactor;
										let a = parseInt(hexa[6] + hexa[7], 16) / 255 || 1;
										color = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
										!rgbaColorCache[dec] ? rgbaColorCache[dec] = {} : true;
										rgbaColorCache[dec][decreaseFactor] = color;
									}
								}
							}
							return color;
						}


						function decreaseValueByFactor(value, decreaseFactor) {
							if (value >= decreaseFactor) {
								return value - decreaseFactor;
							}
							return 0;
						}


						function getBackgroundColor(assignment, decreaseFactor) {
							let defaulColor = 'rgb(128, 171, 202)';
							let color = defaulColor;

							switch (backgroundColorConfig.id) {
								case 'statuscolor':
									color = getBackgroundColorByConfig(mapService.status(assignment), statusIconItems, decreaseFactor);
									break;
								case 'projectcolor':
									if (mapService.project(assignment) > 0 && mapService.headerColor) {
										let headerColor = mapService.headerColor(assignment);
										if (_.isNumber(headerColor)) {
											let dec = +(headerColor);
											color = rgbaColorCache[dec] && rgbaColorCache[dec][decreaseFactor];

											if (!color) {
												let d3interpolate = d3.interpolateRainbow(headerColor);
												let value = d3interpolate.substring(4, d3interpolate.length - 1).split(',');
												color = `rgba(${decreaseValueByFactor(1 * value[0], decreaseFactor)}, ${decreaseValueByFactor(1 * value[1], decreaseFactor)}, ${decreaseValueByFactor(1 * value[2], decreaseFactor)}, 1)`;
												!rgbaColorCache[dec] ? rgbaColorCache[dec] = {} : true;
												rgbaColorCache[dec][decreaseFactor] = color;
											}
										} else {
											color =  headerColor;
										}
									}
									break;
								case 'ppsHeadercolor':
									if (mapService.project(assignment) > 0 && mapService.ppsHeaderColor) {
										var ppsHeaderColor = mapService.ppsHeaderColor(assignment);
										if (_.isNumber(ppsHeaderColor)) {
											let dec = +(ppsHeaderColor);
											color = rgbaColorCache[dec] && rgbaColorCache[dec][decreaseFactor];

											if (!color) {
												color = basicsCommonDrawingUtilitiesService.intToRgbColor(ppsHeaderColor);
												let rValue = color.toString().split(',')[0].substring(5);
												let gValue = color.toString().split(',')[1];
												let bValue = color.toString().split(',')[2];
												color = `rgba(${decreaseValueByFactor(1 * rValue, decreaseFactor)}, ${decreaseValueByFactor(1 * gValue, decreaseFactor)}, ${decreaseValueByFactor(1 * bValue, decreaseFactor)}, 1)`;
												!rgbaColorCache[dec] ? rgbaColorCache[dec] = {} : true;
												rgbaColorCache[dec][decreaseFactor] = color;
											}
										}
									} else {
										color =  defaulColor;
									}
									break;
								case 'defaultcolor':
									color = defaulColor;
									break;
								default:
									break;
							}
							return color;
						}


						var xMargin = 3;
						var draggerSize = 5;
						var projSize = 5;
						var redrawAll = true;
						// var assignmentCollections = {};

						allReservationStausIconItems = Object.fromEntries(basicsCustomizeReservationTypeIconService.getItems().map(icon => [icon.id, icon]));

						_.forEach(selection.datum(), function (val) {
							if (draggingAssignmentSupplier && !isMultiSelect) {
								if (assignmentInRange(val)) { // assignment drag
									pushIntoDataArrays(val);
								}
								redrawAll = false;
							} else {
								redrawAll = true;
								pushIntoDataArrays(val);
							}
						});

						// create own component
						selection.select('g.tooltip-container').remove();
						var tooltipDiv = selection.append('g')
							.style('width', '100%')
							.style('height', '100%')
							.style('opacity', 0)
							.style('background', 'transparent')
							.style('border-radius', '1px')
							.style('pointer-events', 'none')
							.classed('tooltip-container', true);

						tooltipDiv.exit().remove();

						layerAssignmentData = layerAssignmentData.filter(function (el) {
							return el !== null;
						});

						_.forEachRight(layerAssignmentData, (layer, idx) => {
							drawAssignment(layer, 'layer-' + idx, actionType);
						});

						drawAssignment(assignmentData, 'assignment', actionType);
						drawAssignment(maintainanceData, 'maintenance', actionType);

						selection.select('#mainGradient').remove();

						var mainHatch = selection.append('pattern')
							.attr('id', 'mainGradient')
							.attr('patternUnits', 'userSpaceOnUse')
							.attr('patternTransform', 'rotate(45 0 0)')
							.attr('width', '20')
							.attr('height', '10');

						mainHatch.append('line')
							.attr('x1', '0')
							.attr('y1', '0')
							.attr('x2', '0')
							.attr('y2', '10')
							.style('stroke', 'rgba(70,70,70,.35)')
							.style('stroke-width', '20');

						mainHatch.append('line')
							.attr('x1', '20')
							.attr('y1', '0')
							.attr('x2', '20')
							.attr('y2', '10')
							.style('stroke', 'rgba(0,0,0,.35)')
							.style('stroke-width', '20');

						function identify(assignment) {
							return mapService.id(assignment);
						}

						function isReadOnly(assignment) {
							return !_.isUndefined(mapService.isReadOnly) ? mapService.isReadOnly(assignment) : false;
						}

						function drawAssignment(data, assignmentType, actionType) { // zoom or move or click
							var isMaintenance = (assignmentType === 'maintenance');
							var layer = (_.includes(assignmentType, 'layer'));

							var assignmentGs;
							var assignmentContainer = selection.selectAll('g.' + assignmentType + '-container')
								.data([{ 'type': assignmentType }]);
							assignmentContainer.enter()
								.append('g')
								.classed(assignmentType + '-container', true);

							assignmentContainer.exit().remove();
							if (assignmentType.indexOf('layer') >= 0) {
								assignmentContainer.lower(); // lower drawing level of layers
							}

							if (redrawAll) {

								const calendarDateEndTime =  calendarDateEnd.toDate().getTime();
								const calendarDateStartTime =  calendarDateStart.toDate().getTime();

								const filteredAssignments = data.filter(assignment =>
									supplierScale.verticalIndexObjReadOnly().hasOwnProperty(mapService.supplier(assignment))
									&& (assignment._startDateInMs - calendarDateEndTime <= -3600000 && assignment._endDateInMs - calendarDateStartTime >= 3600000)
								);

								assignmentGs = assignmentContainer.selectAll('g.' + assignmentType + '.assignment-item').data(filteredAssignments, identify);
							} else { // assignment drag
								assignmentGs = assignmentContainer.selectAll('g.' + assignmentType + '.assignment-item').filter(function (d) {
									return (mapService.supplier(d) === lastDraggingAssignmentSupplier ||
										mapService.supplier(d) === draggingAssignmentSupplier);
								}).data(data, identify);
							}
							assignmentGs.exit().remove();

							var newassignmentGs;
							if (!isMaintenance && !layer) {
								newassignmentGs = assignmentGs.enter()
									.append('g')
									.classed('assignment assignment-item', true)
									.attr('data-supplier', function (d) {
										return mapService.supplier(d);
									})
									.on('mousedown', clickEvent);
							} else {
								newassignmentGs = assignmentGs.enter()
									.append('g')
									.classed(assignmentType + ' assignment-item', true)
									.attr('data-supplier', function (d) {
										return mapService.supplier(d);
									});
							}

							var clip = newassignmentGs.append('clipPath').attr('id', function (d) {
								return 'clip' + d.Id;
							});
							clip.append('rect')
								.classed('assignmentClipPath', true);

							newassignmentGs.append('rect')
								.classed('assignment', true);

							newassignmentGs.each(function (item) {
								var sel = d3.select(this);
								// if (!isReadOnly(item)) {
								sel.on('dblclick', doubleClickEvent)
									.call(dragHandler);
								if (item.IsFromFixed === false || _.isUndefined(item.IsFromFixed)) {
									sel.append('circle')
										.attr('data-special', function (e) {
											return 'startid-' + e.Id;
										})
										.classed('assignmentStartDragHandlerCircle assignmentDragSizeCircle assignmentSizeCircle assignmentActiveSizeCircle', true)
										.attr('r', draggerSize).call(assignmentStartDragHandler);
								}
								if (item.IsToFixed === false || _.isUndefined(item.IsToFixed)) {
									sel.append('circle')
										.attr('data-special', function (e) {
											return 'startid-' + e.Id;
										})
										.classed('assignmentEndDragHandlerCircle assignmentDragSizeCircle assignmentSizeCircle assignmentActiveSizeCircle', true)
										.attr('r', draggerSize).call(assignmentEndDragHandler);
								}
								// }
							});

							newassignmentGs.append('text')
								.attr('dx', xMargin)
								.style('pointer-events', 'none')
								.classed('assignmentdescription', true);
							newassignmentGs.append('text')
								.attr('dx', xMargin)
								.classed('assignmentinfotext1', true);
							newassignmentGs.append('text')
								.attr('dx', xMargin)
								.classed('assignmentinfotext2', true);
							newassignmentGs.append('text')
								.attr('dx', xMargin)
								.classed('assignmentinfotext3', true);
							newassignmentGs.append('use')
								.classed('typeIcon', true);
							newassignmentGs.append('use')
								.classed('statusIcon', true);
							newassignmentGs.append('use')
								.classed('inTransportIcon', true);
							newassignmentGs.append('rect')
								.attr('height', projSize)
								.classed('assignmentHeaderColor', true);
							newassignmentGs.append('text')
								.classed('modifiedAssignment', true);
							newassignmentGs.append('image')
								.classed('validation', true);


							if (assignmentDataService.isHighlightAssignments && assignments.size > 0 && _.isFunction(mapService.filteredAssignmentsOnProductionSet)) {
								let highlightAssignmentKeys = mapService.filteredAssignmentsOnProductionSet(assignments);
								if (highlightAssignmentKeys.length > 0) {
									highlightAssignmentKeys.forEach(function f(key) {

										newassignmentGs.filter(assignment => assignment.Id === key).style('filter', 'url(#glow)');
									});
								}
							}


							var combinedassignmentGs = newassignmentGs.merge(assignmentGs);

							combinedassignmentGs.classed('disabled', (assignment) => {
								return assignment.Disabled;// && !assignment.pBoardModified; //why disable only when not modified?
							});

							if (actionType !== 'drag') {
								combinedassignmentGs.select('rect.assignment')
								.classed('activeAssignmentItem', function (assignment) {
									return assignment.selectedFlag;
								})
								.classed('item', function (assignment) {
									return !assignment.selectedFlag;
								})
								.attr('height', function (d) {
									return Math.max(0, getAssignmentYHeight(selection.datum(), d));
								})
								.attr('width', function (d) {
									return getAssignmentXWidth(d);
								})
								.attr('x', function (d) {
									return calendarScale(d._startDateInMs);
								})
								.attr('y', function (d) {
									return getAssignmentYPos(selection.datum(), d);
								})
								.style('fill', function (assignment) {
									if (assignment.selectedFlag) {
										return 'rgb(196, 226, 248)';
									} else if (isMaintenance) {
										return 'url(#mainGradient)';
									} else {
										return getBackgroundColor(assignment, 0);
									}
								})
								.style('stroke', function (d) {
									var decreaseFactor = 50;
									var r = 0, g = 0, b = 0, a = 1;
									if (d.selectedFlag) {
										r = 196 - decreaseFactor;
										g = 226 - decreaseFactor;
										b = 248 - decreaseFactor;
										return 'rgba(' + r + ', ' + g + ', ' + b + ',1)';
									} else if (isMaintenance) {
										return 'rgba(0,0,0,0)';
									} else {
										return getBackgroundColor(d, decreaseFactor);
									}
								})
								.style('cursor', function () {
									return (isMaintenance) ? 'not-allowed' : false;
								})
								.style('pointer-events', function () {
									return (isMaintenance) ? 'none' : false;
								})
								.parent().selectAll('circle.assignmentDragSizeCircle')
								.classed('assignmentActiveSizeCircle', function (assignment) {
									return assignment.activeFlag || !isReadOnly(assignment) || !assignment.Disabled;
								})
								.classed('assignmentSizeCircle', function (assignment) {
									return !assignment.activeFlag || isReadOnly(assignment) || assignment.Disabled;
								});

							combinedassignmentGs.select('circle.assignmentStartDragHandlerCircle')
								.attr('cx', function (d) {
									return calendarScale(d._startDateInMs);
								})
								.attr('cy', function (d) {
									return getAssignmentYCenter(selection.datum(), d);
								});

							combinedassignmentGs.select('circle.assignmentEndDragHandlerCircle')
								.attr('cx', function (d) {
									return calendarScale(d._endDateInMs);
								})
								.attr('cy', function (d) {
									return getAssignmentYCenter(selection.datum(), d);
								});

							combinedassignmentGs.select('use.typeIcon')
								.attr('x', function (d) {
									return xMargin + calendarScale(d._startDateInMs);
								})
								.attr('y', function (d) {
									return getAssignmentYBottom(selection.datum(), d) - getAssignmentIconSize(selection.datum(), d) - 2;
								})
								.attr('width', function (d) {
									return getAssignmentIconSize(selection.datum(), d) + 'px';
								})
								.attr('height', function (d) {
									return getAssignmentIconSize(selection.datum(), d) + 'px';
								})
								.attr('display', function () {
									return (showTypeIcon && !useTaggingSystem) ? 'block' : 'none';
								})
								.attr('href', function (assignment) {
									var icon = '';
									var assignmentType = mapService.assignmentType(assignment);
									if (assignmentType) {
										var iconId = 0;
										let typeIcon = typeIconItems.find(tii => tii.Id === assignmentType);
										if (typeIcon) {
											iconId = typeIcon.icon;
										}

										if (iconId) {
											var resTypeIconPath = allStausIconItems[+iconId];
											icon = resTypeIconPath.substr(resTypeIconPath.indexOf('#'));
										}
									}
									return icon;
								});

							combinedassignmentGs.select('use.statusIcon')
								.attr('x', function (d) {
									const withoutIconSize = xMargin + calendarScale(d._startDateInMs);
									let withIconSize = calendarScale(d._endDateInMs) - getAssignmentIconSize(selection.datum(), d) - xMargin;
									if(getAssignmentXWidth(d) < 40 && d.RoutesInfo !== null) {
										withIconSize = calendarScale(d._endDateInMs) - getAssignmentIconSize(selection.datum(), d) + xMargin/2;
									}
									return withIconSize > withoutIconSize ? withIconSize : withoutIconSize;
								})
								.attr('y', function (d) {
									let yMargin = 2;
										if(getAssignmentXWidth(d) < 40 && d.RoutesInfo !== null) {
											yMargin = 0;
										}
										return getAssignmentYBottom(selection.datum(), d) - getAssignmentIconSize(selection.datum(), d) - yMargin;
								})
								.attr('width', function (d) {
									let computedAssignmentIconSize = getAssignmentIconSize(selection.datum(), d);
									if(getAssignmentXWidth(d) < 40 && d.RoutesInfo !== null) {
										computedAssignmentIconSize= getAssignmentIconSize(selection.datum(), d) / 1.4 + 'px';
									}
									return computedAssignmentIconSize;
								})
								.attr('height', function (d) {
									return getAssignmentIconSize(selection.datum(), d) + 'px';
								})
								.attr('display', function () {
									return (showStatusIcon && !useTaggingSystem) ? 'block' : 'none';
								})
								.attr('href', function (assignment) {
									var icon = '';
									var status = mapService.status(assignment);
									if (status) {
										var iconId = 0;
										let statusIcon = statusIconItems.find(sii => sii.Id === status);
										if (statusIcon) {
											iconId = statusIcon.icon;
										}

										if (iconId) {
											var resStatusIconPath = platformStatusIconService.getImageResById(iconId);
											icon = '#' + resStatusIconPath.substr(resStatusIconPath.indexOf(' ') + 1);
										}
									}
									return icon;
								});

								combinedassignmentGs
									.select('use.inTransportIcon')
									.attr('x', function (d) {
										let xMarginTransport = getAssignmentIconSize(selection.datum(), d) + xMargin * 2;
										if(getAssignmentXWidth(d) < 40) {
											xMarginTransport = getAssignmentIconSize(selection.datum(), d) - xMargin;
										}
										const withoutIconSize = xMargin + calendarScale(d._startDateInMs);
										if (useTaggingSystem) {
											xMarginTransport = xMargin;
										}
										let withIconSize = calendarScale(d._endDateInMs) - getAssignmentIconSize(selection.datum(), d) - xMarginTransport;
										return withIconSize > withoutIconSize ? withIconSize : withoutIconSize;
									})
									.attr('y', function (d) {
										let yMargin = 2;
										if(getAssignmentXWidth(d) < 40) {
											yMargin = 0;
										}
										return getAssignmentYBottom(selection.datum(), d) - getAssignmentIconSize(selection.datum(), d) - yMargin;
									})
									.attr('width', function (d) {
										let computedAssignmentIconSize = getAssignmentIconSize(selection.datum(), d);
										if(getAssignmentXWidth(d) < 40) {
											computedAssignmentIconSize= getAssignmentIconSize(selection.datum(), d) / 1.4 + 'px';
										}
										return computedAssignmentIconSize;
									})
									.attr('height', function (d) {
										return getAssignmentIconSize(selection.datum(), d) + 'px';
									})
									.attr('display', function (d) {
										return showInTransportIcon &&  !isMaintenance ? 'block' : 'none';
									})
									.attr('xlink:href', function (assignment) {
										let icon = '';
											if(_.isFunction(mapService.getTransportInfo) && mapService.getTransportInfo(assignment).isInTransport) {
												icon = globals.appBaseUrl + 'cloud.style/content/images/status-icons.svg#ico-status94';
											}
										return icon;
									})
									.attr('style', function () {
										return '--icon-color-7: black; --icon-color-6: white';
									});

							combinedassignmentGs
								.attr('x', function (d) {
									return calendarScale(d._startDateInMs);
								})
								.attr('y', function (d) {
									return supplierScale(d, 'top');
								});

							combinedassignmentGs.select('text.assignmentdescription')
								.attr('x', function (d) {
									return calendarScale(d._startDateInMs);
								})
								.text(function (assignment) {
									return platformPlanningBoardLabelConfigService.getTextLineOfType(assignment, mainInfoLabel, true, mapService);

								})
								.attr('y', function (d) {
									return getAssignmentYPos(selection.datum(), d);
								})
								.attr('width', function (d) {
									return getAssignmentXWidth(d) - (xMargin * 2);
								})
								.attr('clip-path', function (d) {
									return 'url(#clip' + d.Id + ')';
								})
								.attr('dy', function (d) {
									return firstTextLineY(d);
								})
								.attr('font-size', function (d) {
									return textLineHeight(d) + 'px';
								})
								.attr('display', function () {
									return showMainText ? 'block' : 'none';
								})
								.style('fill', function () {
									return (isMaintenance) ? 'rgb(0,0,0)' : false;
								});

							combinedassignmentGs.select('text.assignmentinfotext1')
								.attr('x', function (d) {
									return calendarScale(d._startDateInMs);
								})
								.text(function (assignment) {
									return platformPlanningBoardLabelConfigService.getTextLineOfType(assignment, info1Label, false, mapService);
								})
								.attr('y', function (d) {
									return getAssignmentYPos(selection.datum(), d);
								})
								.attr('width', function (d) {
									return getAssignmentXWidth(d) - (xMargin * 2);
								})
								.attr('clip-path', function (d) {
									return 'url(#clip' + d.Id + ')';
								})
								.attr('dy', function (d) {
									return firstTextLineY(d) + (textLineHeight(d) + 3);
								})
								.attr('font-size', function (d) {
									return (textLineHeight(d) - 1) + 'px';
								})
								.attr('display', function () {
									return showInfo1Text ? 'block' : 'none';
								})
								.style('fill', function () {
									return (isMaintenance) ? 'rgb(0,0,0)' : false;
								})
								.attr('cursor', function (d) {
									return (d.selectedFlag) ? 'move' : 'pointer';
								});

							combinedassignmentGs.select('text.assignmentinfotext2')
								.attr('x', function (d) {
									return calendarScale(d._startDateInMs);
								})
								.text(function (assignment) {
									return platformPlanningBoardLabelConfigService.getTextLineOfType(assignment, info2Label, false, mapService);
								})
								.attr('y', function (d) {
									return getAssignmentYPos(selection.datum(), d);
								})
								.attr('width', function (d) {
									return getAssignmentXWidth(d) - (xMargin * 2);
								})
								.attr('clip-path', function (d) {
									return 'url(#clip' + d.Id + ')';
								})
								.attr('dy', function (d) {
									return firstTextLineY(d) + 2 * (textLineHeight(d) + 3);
								})
								.attr('font-size', function (d) {
									return (textLineHeight(d) - 1) + 'px';
								})
								.attr('display', function () {
									return showInfo2Text ? 'block' : 'none';
								})
								.style('fill', function () {
									return (isMaintenance) ? 'rgb(0,0,0)' : false;
								})
								.attr('cursor', function (d) {
									return (d.selectedFlag) ? 'move' : 'pointer';
								});

							combinedassignmentGs.select('text.assignmentinfotext3')
								.attr('x', function (d) {
									return calendarScale(d._startDateInMs);
								})
								.text(function (assignment) {
									return platformPlanningBoardLabelConfigService.getTextLineOfType(assignment, info3Label, false, mapService);
								})
								.attr('y', function (d) {
									return getAssignmentYPos(selection.datum(), d);
								})
								.attr('width', function (d) {
									return getAssignmentXWidth(d) - (xMargin * 2);
								})
								.attr('clip-path', function (d) {
									return 'url(#clip' + d.Id + ')';
								})
								.attr('dy', function (d) {
									return firstTextLineY(d) + 3 * (textLineHeight(d) + 3);
								})
								.attr('font-size', function (d) {
									return (textLineHeight(d) - 1) + 'px';
								})
								.attr('display', function () {
									return showInfo3Text ? 'block' : 'none';
								})
								.style('fill', function () {
									return (isMaintenance) ? 'rgb(0,0,0)' : false;
								})
								.attr('cursor', function (d) {
									return (d.selectedFlag) ? 'move' : 'pointer';
								});

							combinedassignmentGs.select('rect.assignmentClipPath')
								.attr('x', function (d) {
									return calendarScale(d._startDateInMs);
								})
								.attr('y', function (d) {
									return getAssignmentYPos(selection.datum(), d);
								})
								.attr('width', function (d) {
									return getAssignmentXWidth(d);
								})
								.attr('height', function (d) {
									return getAssignmentYHeight(selection.datum(), d);
								});

							combinedassignmentGs.select('rect.assignmentHeaderColor')
								.attr('x', function (d) {
									return calendarScale(d._startDateInMs) + 1;
								})
								.attr('y', function (d) {
									return getAssignmentYPos(selection.datum(), d);
								})
								.attr('width', function (d) {
									var result = getAssignmentXWidth(d) - 2;
									if (result > 0) {
										return result;
									} else {
										return 0;
									}
								})
								.style('fill', function (assignment) {
									if (isMaintenance) {
										return 'transparent';
									}

									// black project color if same project
									if (showSameAssignments && assignment.areRelated) {
										return 'rgb(0,0,0)';
									}

									if (showHeaderColor && mapService.project(assignment) > 0) {
										var headerColor = mapService.headerColor(assignment); // could be rgb or idx
										if (_.isNumber(headerColor)) {
											return d3.interpolateRainbow(headerColor);
										} else {
											return headerColor;
										}
									} else {
										return 'transparent';
									}
								})
								.attr('display', function () {
									return !useTaggingSystem ? 'block' : 'none';
								})
								.attr('height', 5);

							combinedassignmentGs.select('text.modifiedAssignment')
								.attr('dx', function (d) {
									return (getAssignmentXWidth(d) - xMargin);
								})
								.attr('x', function (d) {
									return calendarScale(d._startDateInMs);
								})
								.text(function (d) {
									if (d.pBoardModified) {
										return '*';
									}
								})
								.attr('y', function (d) {
									return getAssignmentYPos(selection.datum(), d);
								})
								.attr('width', function (d) {
									return getAssignmentXWidth(d) - (xMargin * 2);
								})
								.attr('clip-path', function (d) {
									return 'url(#clip' + d.Id + ')';
								})
								.attr('dy', function (d) {
									return firstTextLineY(d) + (textLineHeight(d));
								})
								.attr('font-size', function (d) {
									return (textLineHeight(d) * 2.5) + 'px';
								})
								.attr('display', function (d) {
									return (d.pBoardModified && !useTaggingSystem) ? 'block' : 'none';
								})
								.style('text-anchor', 'end')
								.style('fill', 'red')
								.style('stroke', 'white')
								.style('stroke-width', '2px')
								.style('paint-order', 'stroke');

							combinedassignmentGs.select('image.validation')
								.attr('x', function (d) {
									var marginRight = getAssignmentIconSize(selection.datum(), d) + 5;
									if (d.pBoardModified) {
										marginRight = getAssignmentIconSize(selection.datum(), d) + 15;
									}

									return (calendarScale(d._endDateInMs) + (getAssignmentXWidth(d)) - marginRight);
								})
								.attr('y', function (d) {
									return getAssignmentYPos(selection.datum(), d) + 10;
								})
								.attr('width', function (d) {
									return getAssignmentIconSize(selection.datum(), d) + 'px';
								})
								.attr('height', function (d) {
									return getAssignmentIconSize(selection.datum(), d) + 'px';
								})
								.attr('display', function (d) {
									return (!d.isValid && !useTaggingSystem) ? 'block' : 'none';
								})
								.attr('xlink:href', globals.appBaseUrl + 'cloud.style/content/images/tlb-icons.svg#ico-validation-error');
							} else {
								newassignmentGs.select('rect.assignment')
								.classed('activeAssignmentItem', function (assignment) {
									return assignment.selectedFlag;
								})
								.classed('item', function (assignment) {
									return !assignment.selectedFlag;
								}).style('fill', function (assignment) {
									if (assignment.selectedFlag) {
										return 'rgb(196, 226, 248)';
									} else if (isMaintenance) {
										return 'url(#mainGradient)';
									} else {
										return getBackgroundColor(assignment, 0);
									}
								})
								.style('stroke', function (d) {
									var decreaseFactor = 50;
									var r = 0, g = 0, b = 0, a = 1;
									if (d.selectedFlag) {
										r = 196 - decreaseFactor;
										g = 226 - decreaseFactor;
										b = 248 - decreaseFactor;
										return 'rgba(' + r + ', ' + g + ', ' + b + ',1)';
									} else if (isMaintenance) {
										return 'rgba(0,0,0,0)';
									} else {
										return getBackgroundColor(d, decreaseFactor);
									}
								})
								.style('cursor', function () {
									return (isMaintenance) ? 'not-allowed' : false;
								})
								.style('pointer-events', function () {
									return (isMaintenance) ? 'none' : false;
								})
								.attr('height', function (d) {
									return Math.max(0, getAssignmentYHeight(selection.datum(), d));
								})
								.attr('width', function (d) {
									return getAssignmentXWidth(d);
								})
								.attr('x', function (d) {
									return calendarScale(d._startDateInMs);
								})
								.attr('y', function (d) {
									return getAssignmentYPos(selection.datum(), d);
								})
								.parent().selectAll('circle.assignmentDragSizeCircle')
								.classed('assignmentActiveSizeCircle', function (assignment) {
									return assignment.activeFlag || !isReadOnly(assignment) || !assignment.Disabled;
								})
								.classed('assignmentSizeCircle', function (assignment) {
									return !assignment.activeFlag || isReadOnly(assignment) || assignment.Disabled;
								});


								assignmentGs.select('rect.assignment').attr('x', function (d) {
									return calendarScale(d._startDateInMs);
								})
								.attr('y', function (d) {
									return getAssignmentYPos(selection.datum(), d);
								})
								.attr('height', function (d) {
									return Math.max(0, getAssignmentYHeight(selection.datum(), d));
								})
								.attr('width', function (d) {
									return getAssignmentXWidth(d);
								});

							combinedassignmentGs.select('circle.assignmentStartDragHandlerCircle')
								.attr('cx', function (d) {
									return calendarScale(d._startDateInMs);
								})
								.attr('cy', function (d) {
									return getAssignmentYCenter(selection.datum(), d);
								});

							combinedassignmentGs.select('circle.assignmentEndDragHandlerCircle')
								.attr('cx', function (d) {
									return calendarScale(d._endDateInMs);
								})
								.attr('cy', function (d) {
									return getAssignmentYCenter(selection.datum(), d);
								});

							newassignmentGs.select('use.typeIcon')
								.attr('x', function (d) {
									return xMargin + calendarScale(d._startDateInMs);
								})
								.attr('y', function (d) {
									return getAssignmentYBottom(selection.datum(), d) - getAssignmentIconSize(selection.datum(), d) - 2;
								})
								.attr('width', function (d) {
									return getAssignmentIconSize(selection.datum(), d) + 'px';
								})
								.attr('height', function (d) {
									return getAssignmentIconSize(selection.datum(), d) + 'px';
								})
								.attr('display', function () {
									return (showTypeIcon && !useTaggingSystem) ? 'block' : 'none';
								})
								.attr('href', function (assignment) {
									var icon = '';
									var assignmentType = mapService.assignmentType(assignment);
									if (assignmentType) {
										var iconId = 0;
										let typeIcon = typeIconItems.find(tii => tii.Id === assignmentType);
										if (typeIcon) {
											iconId = typeIcon.icon;
										}

										if (iconId) {
											var resTypeIconPath = allReservationStausIconItems[+iconId];
											icon = resTypeIconPath.substr(resTypeIconPath.indexOf('#'));
										}
									}
									return icon;
								});

								assignmentGs.select('use.typeIcon')
								.attr('x', function (d) {
									return xMargin + calendarScale(d._endDateInMs);
								})
								.attr('y', function (d) {
									return getAssignmentYBottom(selection.datum(), d) - getAssignmentIconSize(selection.datum(), d) - 2;
								});

								newassignmentGs.select('use.statusIcon')
								.attr('x', function (d) {
									if(getAssignmentXWidth(d) < 40 && d.RoutesInfo !== null) {
										return Math.max(xMargin + calendarScale(d._startDateInMs), calendarScale(d._endDateInMs) - getAssignmentIconSize(selection.datum(), d)) + xMargin/2;
									}
									return Math.max(xMargin + calendarScale(d._startDateInMs), calendarScale(d._endDateInMs) - getAssignmentIconSize(selection.datum(), d) - xMargin);
								})
								.attr('y', function (d) {
									let yMargin = 2;
										if(getAssignmentXWidth(d) < 40 && d.RoutesInfo !== null) {
											yMargin = 0;
										}
										return getAssignmentYBottom(selection.datum(), d) - getAssignmentIconSize(selection.datum(), d) - yMargin;
								})
								.attr('width', function (d) {
									let computedAssignmentIconSize = getAssignmentIconSize(selection.datum(), d);
									if(getAssignmentXWidth(d) < 40 && d.RoutesInfo !== null) {
										computedAssignmentIconSize= getAssignmentIconSize(selection.datum(), d) / 1.4 + 'px';
									}
									return computedAssignmentIconSize;
								})
								.attr('height', function (d) {
									return getAssignmentIconSize(selection.datum(), d) + 'px';
								})
								.attr('display', function () {
									return (showStatusIcon && !useTaggingSystem) ? 'block' : 'none';
								})
								.attr('href', function (assignment) {
									var icon = '';
									var status = mapService.status(assignment);
									if (status) {
										var iconId = 0;
										let statusIcon = statusIconItems.find(sii => sii.Id === status);
										if (statusIcon) {
											iconId = statusIcon.icon;
										}

										if (iconId) {
											var resStatusIconPath = platformStatusIconService.getImageResById(iconId);
											icon = '#' + resStatusIconPath.substr(resStatusIconPath.indexOf(' ') + 1);
										}

									}
									return icon;
								});

								assignmentGs.select('use.statusIcon')
								.attr('x', function (d) {
									if(getAssignmentXWidth(d) < 40 && d.RoutesInfo !== null) {
										return Math.max(xMargin + calendarScale(d._startDateInMs), calendarScale(d._endDateInMs) - getAssignmentIconSize(selection.datum(), d)) + xMargin/2;
									}
									return Math.max(xMargin + calendarScale(d._startDateInMs), calendarScale(d._endDateInMs) - getAssignmentIconSize(selection.datum(), d) - xMargin);
								})
								.attr('y', function (d) {
									let yMargin = 2;
										if(getAssignmentXWidth(d) < 40 && d.RoutesInfo !== null) {
											yMargin = 0;
										}
										return getAssignmentYBottom(selection.datum(), d) - getAssignmentIconSize(selection.datum(), d) - yMargin;
								})
								.attr('width', function (d) {
									let computedAssignmentIconSize = getAssignmentIconSize(selection.datum(), d);
									if(getAssignmentXWidth(d) < 40 && d.RoutesInfo !== null) {
										computedAssignmentIconSize= getAssignmentIconSize(selection.datum(), d) / 1.4 + 'px';
									}
									return computedAssignmentIconSize;
								})
								.attr('height', function (d) {
									return getAssignmentIconSize(selection.datum(), d) + 'px';
								});

								newassignmentGs.select('use.inTransportIcon')
								.attr('x', function (d) {
									if(getAssignmentXWidth(d) < 40) {
										return Math.max(xMargin + calendarScale(d._startDateInMs), calendarScale(d._endDateInMs) - getAssignmentIconSize(selection.datum(), d)) + xMargin;
									}
									return Math.max(xMargin + calendarScale(d._startDateInMs), calendarScale(d._endDateInMs) - getAssignmentIconSize(selection.datum(), d) - xMargin);
								})
								.attr('y', function (d) {
									let yMargin = 2;
										if(getAssignmentXWidth(d) < 40) {
											yMargin = 0;
										}
										return getAssignmentYBottom(selection.datum(), d) - getAssignmentIconSize(selection.datum(), d) - yMargin;
								})
								.attr('width', function (d) {
									let computedAssignmentIconSize = getAssignmentIconSize(selection.datum(), d);
										if(getAssignmentXWidth(d) < 40) {
											computedAssignmentIconSize= getAssignmentIconSize(selection.datum(), d) / 1.4 + 'px';
										}
										return computedAssignmentIconSize;
								})
								.attr('height', function (d) {
									return getAssignmentIconSize(selection.datum(), d) + 'px';
								})
								.attr('display', function (d) {
									return (showInTransportIcon   && !isMaintenance) ? 'block' : 'none';
								})
								.attr('xlink:href', function (assignment) {
									let icon = '';
										if(_.isFunction(mapService.getTransportInfo) && mapService.getTransportInfo(assignment).isInTransport) {
											icon = globals.appBaseUrl + 'cloud.style/content/images/status-icons.svg#ico-status94';
										}
									return icon;
								})
								.attr('style', function () {
									return '--icon-color-7: black; --icon-color-6: white';
								});

								assignmentGs.select('use.inTransportIcon')
								.attr('x', function (d) {
									let xMarginTransport = getAssignmentIconSize(selection.datum(), d) + (xMargin *2);
									if(getAssignmentXWidth(d) < 40) {
										xMarginTransport = getAssignmentIconSize(selection.datum(), d) -xMargin;
									}
									if(useTaggingSystem) {
										xMarginTransport = xMargin;
									}
									return Math.max(xMargin + calendarScale(d._startDateInMs), calendarScale(d._endDateInMs) - getAssignmentIconSize(selection.datum(), d) - xMarginTransport);
								})
								.attr('y', function (d) {
									let yMargin = 2;
										if(getAssignmentXWidth(d) < 40) {
											yMargin = 0;
										}
										return getAssignmentYBottom(selection.datum(), d) - getAssignmentIconSize(selection.datum(), d) - yMargin;
								})
								.attr('width', function (d) {
									let computedAssignmentIconSize = getAssignmentIconSize(selection.datum(), d);
										if(getAssignmentXWidth(d) < 40) {
											computedAssignmentIconSize= getAssignmentIconSize(selection.datum(), d) / 1.4 + 'px';
										}
									return computedAssignmentIconSize;
								})
								.attr('height', function (d) {
									return getAssignmentIconSize(selection.datum(), d) + 'px';
								});

							combinedassignmentGs
								.attr('x', function (d) {
									return calendarScale(d._startDateInMs);
								})
								.attr('y', function (d) {
									return supplierScale(d, 'top');
								});

							newassignmentGs.select('text.assignmentdescription')
							.attr('x', function (d) {
								return calendarScale(d._startDateInMs);
							})
							.attr('y', function (d) {
								return getAssignmentYPos(selection.datum(), d);
							})
								.text(function (assignment) {
									return platformPlanningBoardLabelConfigService.getTextLineOfType(assignment, mainInfoLabel, true, mapService);

								})
								.attr('width', function (d) {
									return getAssignmentXWidth(d) - (xMargin * 2);
								})
								.attr('clip-path', function (d) {
									return 'url(#clip' + d.Id + ')';
								})
								.attr('dy', function (d) {
									return firstTextLineY(d);
								})
								.attr('font-size', function (d) {
									return textLineHeight(d) + 'px';
								})
								.attr('display', function () {
									return showMainText ? 'block' : 'none';
								})
								.style('fill', function () {
									return (isMaintenance) ? 'rgb(0,0,0)' : false;
								});

							assignmentGs.select('text.assignmentdescription')
							.attr('x', function (d) {
								return calendarScale(d._startDateInMs);
							})
							.attr('y', function (d) {
								return getAssignmentYPos(selection.datum(), d);
							});

							newassignmentGs.select('text.assignmentinfotext1')
								.attr('x', function (d) {
									return calendarScale(d._startDateInMs);
								})
								.attr('y', function (d) {
									return getAssignmentYPos(selection.datum(), d);
								})
								.text(function (assignment) {
									return platformPlanningBoardLabelConfigService.getTextLineOfType(assignment, info1Label, false, mapService);
								})
								.attr('width', function (d) {
									return getAssignmentXWidth(d) - (xMargin * 2);
								})
								.attr('clip-path', function (d) {
									return 'url(#clip' + d.Id + ')';
								})
								.attr('dy', function (d) {
									return firstTextLineY(d) + (textLineHeight(d) + 3);
								})
								.attr('font-size', function (d) {
									return (textLineHeight(d) - 1) + 'px';
								})
								.attr('display', function () {
									return showInfo1Text ? 'block' : 'none';
								})
								.style('fill', function () {
									return (isMaintenance) ? 'rgb(0,0,0)' : false;
								})
								.attr('cursor', function (d) {
									return (d.selectedFlag) ? 'move' : 'pointer';
								});

								assignmentGs.select('text.assignmentinfotext1')
								.attr('x', function (d) {
									return calendarScale(d._startDateInMs);
								})
								.attr('y', function (d) {
									return getAssignmentYPos(selection.datum(), d);
								});

							newassignmentGs.select('text.assignmentinfotext2')
								.attr('x', function (d) {
									return calendarScale(d._startDateInMs);
								})
								.attr('y', function (d) {
									return getAssignmentYPos(selection.datum(), d);
								})
								.text(function (assignment) {
									return platformPlanningBoardLabelConfigService.getTextLineOfType(assignment, info2Label, false, mapService);
								})
								.attr('width', function (d) {
									return getAssignmentXWidth(d) - (xMargin * 2);
								})
								.attr('clip-path', function (d) {
									return 'url(#clip' + d.Id + ')';
								})
								.attr('dy', function (d) {
									return firstTextLineY(d) + 2 * (textLineHeight(d) + 3);
								})
								.attr('font-size', function (d) {
									return (textLineHeight(d) - 1) + 'px';
								})
								.attr('display', function () {
									return showInfo2Text ? 'block' : 'none';
								})
								.style('fill', function () {
									return (isMaintenance) ? 'rgb(0,0,0)' : false;
								})
								.attr('cursor', function (d) {
									return (d.selectedFlag) ? 'move' : 'pointer';
								});

								assignmentGs.select('text.assignmentinfotext2')
								.attr('x', function (d) {
									return calendarScale(d._startDateInMs);
								})
								.attr('y', function (d) {
									return getAssignmentYPos(selection.datum(), d);
								});

							newassignmentGs.select('text.assignmentinfotext3')
								.attr('x', function (d) {
									return calendarScale(d._startDateInMs);
								})
								.attr('y', function (d) {
									return getAssignmentYPos(selection.datum(), d);
								})
								.text(function (assignment) {
									return platformPlanningBoardLabelConfigService.getTextLineOfType(assignment, info3Label, false, mapService);
								})
								.attr('width', function (d) {
									return getAssignmentXWidth(d) - (xMargin * 2);
								})
								.attr('clip-path', function (d) {
									return 'url(#clip' + d.Id + ')';
								})
								.attr('dy', function (d) {
									return firstTextLineY(d) + 3 * (textLineHeight(d) + 3);
								})
								.attr('font-size', function (d) {
									return (textLineHeight(d) - 1) + 'px';
								})
								.attr('display', function () {
									return showInfo3Text ? 'block' : 'none';
								})
								.style('fill', function () {
									return (isMaintenance) ? 'rgb(0,0,0)' : false;
								})
								.attr('cursor', function (d) {
									return (d.selectedFlag) ? 'move' : 'pointer';
								});

								assignmentGs.select('text.assignmentinfotext3')
								.attr('x', function (d) {
									return calendarScale(d._startDateInMs);
								})
								.attr('y', function (d) {
									return getAssignmentYPos(selection.datum(), d);
								});

							newassignmentGs.select('rect.assignmentClipPath')
								.attr('x', function (d) {
									return calendarScale(d._startDateInMs);
								})
								.attr('y', function (d) {
									return getAssignmentYPos(selection.datum(), d);
								})
								.attr('width', function (d) {
									return getAssignmentXWidth(d);
								})
								.attr('height', function (d) {
									return getAssignmentYHeight(selection.datum(), d);
								});

								assignmentGs.select('rect.assignmentClipPath')
								.attr('x', function (d) {
									return calendarScale(d._startDateInMs);
								})
								.attr('y', function (d) {
									return getAssignmentYPos(selection.datum(), d);
								});

							newassignmentGs.select('rect.assignmentHeaderColor')
								.attr('x', function (d) {
									return calendarScale(d._startDateInMs) + 1;
								})
								.attr('y', function (d) {
									return getAssignmentYPos(selection.datum(), d);
								})
								.attr('width', function (d) {
									var result = getAssignmentXWidth(d) - 2;
									if (result > 0) {
										return result;
									} else {
										return 0;
									}
								})
								.style('fill', function (assignment) {
									if (isMaintenance) {
										return 'transparent';
									}

									// black project color if same project
									if (showSameAssignments && assignment.areRelated) {
										return 'rgb(0,0,0)';
									}

									if (showHeaderColor && mapService.project(assignment) > 0) {
										var headerColor = mapService.headerColor(assignment); // could be rgb or idx
										if (_.isNumber(headerColor)) {
											return d3.interpolateRainbow(headerColor);
										} else {
											return headerColor;
										}
									} else {
										return 'transparent';
									}
								})
								.attr('display', function () {
									return !useTaggingSystem ? 'block' : 'none';
								})
								.attr('height', 5);

							assignmentGs.select('rect.assignmentHeaderColor')
								.attr('x', function (d) {
									return calendarScale(d._startDateInMs) + 1;
								})
								.attr('y', function (d) {
									return getAssignmentYPos(selection.datum(), d);
								})
								.attr('width', function (d) {
									var result = getAssignmentXWidth(d) - 2;
									if (result > 0) {
										return result;
									} else {
										return 0;
									}
								})

							newassignmentGs.select('text.modifiedAssignment')
								.attr('y', function (d) {
									return getAssignmentYPos(selection.datum(), d);
								})
								.attr('x', function (d) {
									return calendarScale(d._startDateInMs);
								})
								.attr('dx', function (d) {
									return (getAssignmentXWidth(d) - xMargin);
								})
								.text(function (d) {
									if (d.pBoardModified) {
										return '*';
									}
								})
								.attr('width', function (d) {
									return getAssignmentXWidth(d) - (xMargin * 2);
								})
								.attr('clip-path', function (d) {
									return 'url(#clip' + d.Id + ')';
								})
								.attr('dy', function (d) {
									return firstTextLineY(d) + (textLineHeight(d));
								})
								.attr('font-size', function (d) {
									return (textLineHeight(d) * 2.5) + 'px';
								})
								.attr('display', function (d) {
									return (d.pBoardModified && !useTaggingSystem) ? 'block' : 'none';
								})
							.style('text-anchor', 'end')
							.style('fill', 'red')
							.style('stroke', 'white')
							.style('stroke-width', '2px')
							.style('paint-order', 'stroke');

							assignmentGs.select('text.modifiedAssignment')
								.attr('x', function (d) {
									return calendarScale(d._startDateInMs);
								})
								.attr('y', function (d) {
									return getAssignmentYPos(selection.datum(), d);
								})
								.attr('dx', function (d) {
									return (getAssignmentXWidth(d) - xMargin);
								})
								.attr('clip-path', function (d) {
									return 'url(#clip' + getAssignmentXWidth(d) + ')';
								})

							newassignmentGs.select('image.validation')
								.attr('x', function (d) {
									var marginRight = getAssignmentIconSize(selection.datum(), d) + 5;
									if (d.pBoardModified) {
										marginRight = getAssignmentIconSize(selection.datum(), d) + 15;
									}

									return (calendarScale(d._startDateInMs) + (getAssignmentXWidth(d)) - marginRight);
								})
								.attr('y', function (d) {
									return getAssignmentYPos(selection.datum(), d) + 10;
								})
								.attr('width', function (d) {
									return getAssignmentIconSize(selection.datum(), d) + 'px';
								})
								.attr('height', function (d) {
									return getAssignmentIconSize(selection.datum(), d) + 'px';
								})
								.attr('display', function (d) {
									return (!d.isValid && !useTaggingSystem) ? 'block' : 'none';
								})
								.attr('xlink:href', globals.appBaseUrl + 'cloud.style/content/images/tlb-icons.svg#ico-validation-error');
							}

							assignmentGs.select('image.validation')
							.attr('x', function (d) {
								var marginRight = getAssignmentIconSize(selection.datum(), d) + 5;
								if (d.pBoardModified) {
									marginRight = getAssignmentIconSize(selection.datum(), d) + 15;
								}

								return (calendarScale(d._startDateInMs) + (getAssignmentXWidth(d)) - marginRight);
							})
							.attr('y', function (d) {
								return getAssignmentYPos(selection.datum(), d) + 10;
							})

						}

					};

					// public properties and functions
					_assignmentItems.calendarScale = function (cs) {
						if (!arguments.length) {
							return calendarScale;
						}
						calendarScale = cs;
						return this;
					};

					_assignmentItems.supplierScale = function (rs) {
						if (!arguments.length) {
							return supplierScale;
						}
						supplierScale = rs;
						return this;
					};

					_assignmentItems.dragHandler = function (dh) {
						if (!arguments.length) {
							return dragHandler;
						}
						dragHandler = dh;
						return this;
					};

					_assignmentItems.clickEvent = function (ch) {
						if (!arguments.length) {
							return clickEvent;
						}
						clickEvent = ch;
						return this;
					};

					_assignmentItems.doubleClickEvent = function (ch) {
						if (!arguments.length) {
							return doubleClickEvent;
						}
						doubleClickEvent = ch;
						return this;
					};

					_assignmentItems.assignmentStartDragHandler = function (dh) {
						if (!arguments.length) {
							return assignmentStartDragHandler;
						}
						assignmentStartDragHandler = dh;
						return this;
					};

					_assignmentItems.assignmentEndDragHandler = function (dh) {
						if (!arguments.length) {
							return assignmentEndDragHandler;
						}
						assignmentEndDragHandler = dh;
						return this;
					};

					_assignmentItems.showHeaderColor = function (bShow) {
						if (!arguments.length) {
							return showHeaderColor;
						}
						showHeaderColor = bShow;
						return this;
					};

					_assignmentItems.showSameAssignments = function (bShow) {
						if (!arguments.length) {
							return showSameAssignments;
						}
						showSameAssignments = bShow;
						return this;
					};

					_assignmentItems.showStatusIcon = function (bShow) {
						if (!arguments.length) {
							return showStatusIcon;
						}
						showStatusIcon = bShow;
						return this;
					};

					_assignmentItems.showInTransportIcon = function (showInTransportIndicator) {
						if (!arguments.length) {
							return showInTransportIcon;
						}
						showInTransportIcon = showInTransportIndicator;
						return this;
					};

					_assignmentItems.backgroundColorConfig = function (bShow) {
						if (!arguments.length) {
							return backgroundColorConfig;
						}
						backgroundColorConfig = bShow;
						return this;
					};

					_assignmentItems.statusIconItems = function (sii) {
						if (!arguments.length) {
							return statusIconItems;
						}
						statusIconItems = sii;
						allStausIconItems = Object.fromEntries(statusIconItems.map(icon => [icon.Id, icon]));
						return this;
					};

					_assignmentItems.showTypeIcon = function (bShow) {
						if (!arguments.length) {
							return showTypeIcon;
						}
						showTypeIcon = bShow;
						return this;
					};

					_assignmentItems.showMainText = function (bShow) {
						if (!arguments.length) {
							return showMainText;
						}
						showMainText = bShow;
						return this;
					};

					_assignmentItems.showInfo1Text = function (bShow) {
						if (!arguments.length) {
							return showInfo1Text;
						}
						showInfo1Text = bShow;
						return this;
					};

					_assignmentItems.showInfo2Text = function (bShow) {
						if (!arguments.length) {
							return showInfo2Text;
						}
						showInfo2Text = bShow;
						return this;
					};

					_assignmentItems.showInfo3Text = function (bShow) {
						if (!arguments.length) {
							return showInfo3Text;
						}
						showInfo3Text = bShow;
						return this;
					};

					_assignmentItems.mainInfoLabel = function (bShow) {
						if (!arguments.length) {
							return mainInfoLabel;
						}
						mainInfoLabel = bShow;
						return this;
					};

					_assignmentItems.info1Label = function (bShow) {
						if (!arguments.length) {
							return info1Label;
						}
						info1Label = bShow;
						return this;
					};

					_assignmentItems.info2Label = function (bShow) {
						if (!arguments.length) {
							return info2Label;
						}
						info2Label = bShow;
						return this;
					};

					_assignmentItems.info3Label = function (bShow) {
						if (!arguments.length) {
							return info3Label;
						}
						info3Label = bShow;
						return this;
					};

					_assignmentItems.typeIconItems = function (tii) {
						if (!arguments.length) {
							return typeIconItems;
						}
						typeIconItems = tii;
						return this;
					};

					_assignmentItems.mapService = function (service) {
						if (!arguments.length) {
							return mapService;
						}
						mapService = service;
						return this;
					};
					_assignmentItems.assignmentDataService = function (service) {
						if (!arguments.length) {
							return assignmentDataService;
						}
						assignmentDataService = service;
						return this;
					};

					_assignmentItems.assignments = function (service) {
						if (!arguments.length) {
							return assignments;
						}
						assignments = service;
						return this;
					};

					_assignmentItems.draggingAssignmentSupplier = function (assignment) {
						if (!arguments.length) {
							return draggingAssignmentSupplier;
						}
						lastDraggingAssignmentSupplier = draggingAssignmentSupplier;
						draggingAssignmentSupplier = assignment;
						return this;
					};

					_assignmentItems.draggingAssignment = function (assignment) {
						if (!arguments.length) {
							return draggingAssignment;
						}
						draggingAssignment = assignment;
						return this;
					};

					_assignmentItems.isMultiSelect = function (ims) {
						if (!arguments.length) {
							return isMultiSelect;
						}
						isMultiSelect = ims;
						return this;
					};

					_assignmentItems.assignmentCollection = function (ac) {
						if (!arguments.length) {
							return assignmentCollection;
						}
						assignmentCollection = ac;
						return this;
					};

					_assignmentItems.aggregationHeight = function (height) {
						if (!arguments.length) {
							return aggregationHeight;
						}
						aggregationHeight = height;
						return this;
					};

					_assignmentItems.useTaggingSystem = function (ts) {
						if (!arguments.length) {
							return useTaggingSystem;
						}
						useTaggingSystem = ts;
						return this;
					};

					_assignmentItems.calendarDateStart = function (cds) {
						if (!arguments.length) {
							return calendarDateStart;
						}
						calendarDateStart = cds;
						return this;
					};

					_assignmentItems.calendarDateEnd = function (cde) {
						if (!arguments.length) {
							return calendarDateEnd;
						}
						calendarDateEnd = cde;
						return this;
					};

					_assignmentItems.containerDimensions = function (containerDimensionsFn) {
						if (!arguments.length) {
							return containerDimensions;
						}
						containerDimensions = containerDimensionsFn;
						return this;
					};

					_assignmentItems.supplierScrollValue = function (supplierScroll) {
						if (!arguments.length) {
							return supplierScrollValue;
						}
						supplierScrollValue = supplierScroll;
						return this;
					};

					return _assignmentItems;
				},

				aggregateItems: function aggregateItems() {
					var supplierScale, calendarScale, aggregates, mapService, lineHeight = 20, xMargin = 3,
						trafficLightWidth = 10,
						aggregationHeight = 20,
						clickEvent, aggregationTrafficLightsConfig;

					function getAggregateYPos(aggregation) {
						var supplierIdx = supplierScale.verticalIndex().get(aggregation.reference);
						if (_.isUndefined(supplierIdx)) {
							return 0;
						} else {
							return supplierScale.headerLineHeight() + (supplierIdx * supplierScale.lineHeight()) + (supplierScale.lineHeight() - aggregationHeight);
						}
					}

					function getAggregationXWidth(d) {
						return Math.max(15, calendarScale(d.endDate) - calendarScale(d.startDate));
					}

					function firstTextLineY() {
						return getMin([25, getMax([10, (aggregationHeight / 5) + 10])]);
					}

					var _aggregateItems = function (selection) {
						var aggregation = selection.selectAll('g.aggregation').data(aggregates);
						aggregation.exit().remove();

						var newAggregations = aggregation.enter()
							.append('g')
							.classed('aggregation', true);

						newAggregations.append('rect')
							.classed('background', true);

						newAggregations.append('rect')
							.classed('traffic-light', true);

						newAggregations.append('text')
							.classed('aggregation', true)
							.append('tspan')
							.classed('aggregation-text', true);

						var clip = newAggregations.append('clipPath')
							.attr('id', function (d) {
								return 'aggregationClipPath' + d.id;
							});

						clip.append('rect')
							.classed('aggregation-clip-path', true);

						var combinedAggregations = newAggregations.merge(aggregation);

						combinedAggregations
							.attr('x', function (d) {
								return calendarScale(d.startDate);
							})
							.attr('y', function (d) {
								return getAggregateYPos(d);
							});

						combinedAggregations.select('rect.background')
							.on('click', function (d) {
								clickEvent(d, 'enter');
							})
							.attr('x', function (d) {
								return calendarScale(d.startDate);
							})
							.attr('y', function (d) {
								return getAggregateYPos(d);
							})
							.attr('height', function (d) {
								return aggregationHeight;
							})
							.attr('width', function (d) {
								return getAggregationXWidth(d);
							});

						combinedAggregations.select('rect.aggregation-clip-path')
							.attr('x', function (d) {
								return calendarScale(d.startDate);
							})
							.attr('y', function (d) {
								return getAggregateYPos(d);
							})
							.attr('height', function (d) {
								return aggregationHeight;
							})
							.attr('width', function (d) {
								return getAggregationXWidth(d);
							})
							.style('pointer-events', 'none');

						combinedAggregations.select('rect.traffic-light')
							.attr('x', function (d) {
								return calendarScale(d.startDate);
							})
							.attr('y', function (d) {
								return getAggregateYPos(d);
							})
							.attr('height', function (d) {
								return aggregationHeight;
							})
							.attr('width', function (d) {
								return trafficLightWidth + 'px';
							})
							.style('pointer-events', 'none')
							.style('fill', function (d) {
								return d.color;
							});

						combinedAggregations.select('text.aggregation')
							.attr('x', function (d) {
								return calendarScale(d.startDate) + trafficLightWidth;
							})
							.attr('y', function (d) {
								return getAggregateYPos(d);
							})
							.attr('width', function (d) {
								return getAggregationXWidth(d) - (xMargin * 2);
							})
							.attr('dy', function (d) {
								return firstTextLineY(d) - 1;
							})
							.attr('dx', function (d) {
								return xMargin;
							})
							.style('pointer-events', 'none');

						combinedAggregations.select('tspan.aggregation-text')
							.attr('x', function (d) {
								return calendarScale(d.startDate) + trafficLightWidth;
							})
							.attr('y', function (d) {
								return getAggregateYPos(d);
							})
							.attr('dy', function (d) {
								return firstTextLineY(d) - 1;
							})
							.attr('dx', function (d) {
								return xMargin;
							})
							.attr('clip-path', function (d) {
								return 'url(#aggregationClipPath' + d.id + ')';
							})
							.attr('font-size', '10px')
							.attr('font-weight', 'bold')
							.style('pointer-events', 'none')
							.text(function (d) {
								return (d.sum / d.displayFactor).toFixed(2) + ' ' + d.uomDescription;
							});
					};

					// public properties and functions
					_aggregateItems.calendarScale = function (cs) {
						if (!arguments.length) {
							return calendarScale;
						}
						calendarScale = cs;
						return this;
					};

					_aggregateItems.supplierScale = function (ss) {
						if (!arguments.length) {
							return supplierScale;
						}
						supplierScale = ss;
						return this;
					};

					_aggregateItems.aggregates = function (a) {
						if (!arguments.length) {
							return aggregates;
						}
						aggregates = a;
						return this;
					};

					_aggregateItems.mapService = function (service) {
						if (!arguments.length) {
							return mapService;
						}
						mapService = service;
						return this;
					};

					_aggregateItems.clickEvent = function (event) {
						if (!arguments.length) {
							return clickEvent;
						}
						clickEvent = event;
						return this;
					};

					_aggregateItems.aggregationHeight = function (height) {
						if (!arguments.length) {
							return aggregationHeight;
						}
						aggregationHeight = height;
						return this;
					};

					_aggregateItems.aggregationTrafficLightsConfig = function (config) {
						if (!arguments.length) {
							return aggregationTrafficLightsConfig;
						}
						aggregationTrafficLightsConfig = config;
						return this;
					};

					return _aggregateItems;
				},
				aggregateSumItems: function aggregateSumItems() {
					var calendarScale, mapService, sumAggregates, clickEvent, sumHeight, fontSize = 10, statusBarHeight = 17, xMargin = 5;
					let textLines, aggregationTrafficLightsConfig;

					function getAggregationXWidth(d) {
						return Math.max(15, calendarScale(d.endDate) - calendarScale(d.startDate));
					}

					function getSumAggregationYPos() {
						return sumHeight * -1 - statusBarHeight;
					}

					function getBaseTextLineYPosition() {
						return ((sumHeight + statusBarHeight - fontSize / 2) - sumHeight / 2);
					}

					var _aggregateSumItems = function (selection) {
						var sumAggregations = selection.selectAll('g.aggregation').data(sumAggregates);
						sumAggregations.exit().remove();

						var newSumAggregations = sumAggregations.enter()
							.append('g')
							.classed('aggregation', true);

						newSumAggregations.append('rect')
							.classed('background', true);

						newSumAggregations.append('rect')
							.classed('traffic-light', true);

						let sumAggregationText = newSumAggregations.append('text');
						sumAggregationText
							.append('tspan')
							.classed('aggregation aggregation-text line-1', true);

						sumAggregationText
							.append('tspan')
							.classed('aggregation aggregation-text line-2', true);

						sumAggregationText
							.append('tspan')
							.classed('aggregation aggregation-text line-3', true);

						var clip = newSumAggregations.append('clipPath');

						clip.append('rect')
							.classed('aggregation-clip-path', true);

						var combinedSumAggregations = newSumAggregations.merge(sumAggregations);

						combinedSumAggregations
							.attr('x', function (d) {
								return calendarScale(d.startDate);
							})
							.attr('y', function (d) {
								return 0;
							});

						combinedSumAggregations.select('rect.background')
							.on('click', function (d) {
								clickEvent(d, 'enter');
							})
							.attr('x', function (d) {
								return calendarScale(d.startDate);
							})
							.attr('y', function (d) {
								return getSumAggregationYPos();
							})
							.attr('height', function (d) {
								return sumHeight;
							})
							.attr('width', function (d) {
								return getAggregationXWidth(d);
							});

						combinedSumAggregations.select('rect.traffic-light')
							.attr('x', function (d) {
								return calendarScale(d.startDate);
							})
							.attr('y', function (d) {
								return getSumAggregationYPos(d);
							})
							.attr('height', function (d) {
								return 5;
							})
							.attr('width', function (d) {
								return getAggregationXWidth(d);
							})
							.style('pointer-events', 'none')
							.style('fill', function (d) {
								return d.color;
							});

						combinedSumAggregations.select('clipPath')
							.attr('id', function (d) {
								return 'aggregationSumClipPath' + d.id;
							});

						combinedSumAggregations.select('rect.aggregation-clip-path')
							.attr('x', function (d) {
								return calendarScale(d.startDate);
							})
							.attr('y', function (d) {
								return getSumAggregationYPos();
							})
							.attr('height', sumHeight)
							.attr('width', function (d) {
								return getAggregationXWidth(d);
							})
							.style('pointer-events', 'none');

						combinedSumAggregations.select('tspan.aggregation-text.line-1')
							.attr('x', function (d) {
								return calendarScale(d.startDate) + xMargin;
							})
							.attr('y', function (d) {
								return getBaseTextLineYPosition() * -1 - 10;
							})
							.attr('clip-path', function (d) {
								return 'url(#aggregationSumClipPath' + d.id + ')';
							})
							.attr('font-size', fontSize + 'px')
							.attr('font-weight', 'bold')
							.style('pointer-events', 'none')
							.text(function (d) {
								return platformPlanningBoardAggregationService.getAggregationValue(d, textLines.line1.value, mapService);
							});

						combinedSumAggregations.select('tspan.aggregation-text.line-2')
							.attr('x', function (d) {
								return calendarScale(d.startDate) + xMargin;
							})
							.attr('y', function (d) {
								return getBaseTextLineYPosition() * -1;
							})
							.attr('clip-path', function (d) {
								return 'url(#aggregationSumClipPath' + d.id + ')';
							})
							.attr('font-size', fontSize + 'px')
							.attr('font-weight', 'bold')
							.style('pointer-events', 'none')
							.text(function (d) {
								return platformPlanningBoardAggregationService.getAggregationValue(d, textLines.line2.value, mapService);
							});

						combinedSumAggregations.select('tspan.aggregation-text.line-3')
							.attr('x', function (d) {
								return calendarScale(d.startDate) + xMargin;
							})
							.attr('y', function (d) {
								return getBaseTextLineYPosition() * -1 + 10;
							})
							.attr('clip-path', function (d) {
								return 'url(#aggregationSumClipPath' + d.id + ')';
							})
							.attr('font-size', fontSize + 'px')
							.attr('font-weight', 'bold')
							.style('pointer-events', 'none')
							.text(function (d) {
								return platformPlanningBoardAggregationService.getAggregationValue(d, textLines.line3.value, mapService);
							});
					};

					// public properties and functions
					_aggregateSumItems.calendarScale = function (cs) {
						if (!arguments.length) {
							return calendarScale;
						}
						calendarScale = cs;
						return this;
					};

					_aggregateSumItems.mapService = function (service) {
						if (!arguments.length) {
							return mapService;
						}
						mapService = service;
						return this;
					};

					_aggregateSumItems.sumAggregates = function (a) {
						if (!arguments.length) {
							return sumAggregates;
						}
						sumAggregates = a;
						return this;
					};

					_aggregateSumItems.clickEvent = function (event) {
						if (!arguments.length) {
							return clickEvent;
						}
						clickEvent = event;
						return this;
					};

					_aggregateSumItems.sumHeight = function (h) {
						if (!arguments.length) {
							return sumHeight;
						}
						sumHeight = h;
						return this;
					};

					_aggregateSumItems.textLines = function (l) {
						if (!arguments.length) {
							return textLines;
						}
						textLines = l;
						return this;
					};

					_aggregateSumItems.aggregationTrafficLightsConfig = function (config) {
						if (!arguments.length) {
							return aggregationTrafficLightsConfig;
						}
						aggregationTrafficLightsConfig = config;
						return this;
					};

					return _aggregateSumItems;
				},
				supplierScale: function supplierScale() {
					// private 'static' stuff (functions and members)
					var verticalIndex, lineHeight = 0, headerLineHeight = 0, mapService;
					let verticalIndexObj = {};
					var _supplierScale = function (assignment, origin) {
						var result = -100;
						// ask grid for y-value resource(assignment.resource-id) depending on origin
						var idx = verticalIndexObj[mapService.supplier(assignment)];
						if (_.isNumber(idx)) {
							result = headerLineHeight + idx * lineHeight;
							if (origin === 'bottom') {
								result += lineHeight; // added and divided by collision count
							}
						}
						return result;
					};

					// public properties and functions
					_supplierScale.supplierIdForYpx = function (yPx) {
						var assignmentId = 0;
						verticalIndex.forEach(function (value, key) {
							var top = headerLineHeight + value * lineHeight;
							if (top <= yPx && yPx <= (top + lineHeight)) {
								assignmentId = key;
							}
						});
						return assignmentId;
					};

					_supplierScale.verticalIndex = function (vi) {
						if (!arguments.length) {
							return verticalIndex;
						}
						verticalIndex = vi;
						verticalIndexObj = Object.fromEntries(verticalIndex.entries());
						return this;
					};

					_supplierScale.lineHeight = function (lh) {
						if (!arguments.length) {
							return lineHeight;
						}
						lineHeight = lh;
						return this;
					};

					_supplierScale.headerLineHeight = function (hlh) {
						if (!arguments.length) {
							return headerLineHeight;
						}
						headerLineHeight = hlh;
						return this;
					};

					_supplierScale.mapService = function (service) {
						if (!arguments.length) {
							return mapService;
						}
						mapService = service;
						return this;
					};

					_supplierScale.verticalIndexObjReadOnly = () => {
						return verticalIndexObj;
					}

					return _supplierScale;

				}
			};

		}]
	);
})();
