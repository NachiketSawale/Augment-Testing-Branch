/* global d3 */
(function (angular) {
	'use strict';

	angular.module('platform').service('platformPlanningBoardUpdateService', PlatformPlanningBoardUpdateService);

	PlatformPlanningBoardUpdateService.$inject = ['_', 'moment',
		'platformPlanningBoardLevelOfDetailService',
		'platformPlanningBoardValidationService',
		'platformPlanningBoardAggregationService',
		'platformPlanningBoardCollisionService',
		'platformPlanningBoardFooterComponents',
		'platfromPlanningBoardAssignmentComponentConstants',
		'platformPlanningBoardAssignmentGroupingService'];

	function PlatformPlanningBoardUpdateService(_, moment,
		platformPlanningBoardLevelOfDetailService,
		platformPlanningBoardValidationService,
		platformPlanningBoardAggregationService,
		platformPlanningBoardCollisionService,
		platformPlanningBoardFooterComponents,
		platfromPlanningBoardAssignmentComponentConstants,
		platformPlanningBoardAssignmentGroupingService) {

		// region Global variables

		var service = this;

		// endregion

		// region Public methods

		/**
		 * @ngdoc function
		 * @name resize
		 * @description Resize planningboard components.
		 *
		 * @param {Object} resizeData
		 */
		service.resize = function resize(resizeData) {
			resizeData.calendarlineobject.height(resizeData.transY);
			resizeData.timeScale.range([0, resizeData.panelWidth]);
			resizeData.assignmentItems.calendarScale(resizeData.timeScale);
			resizeData.assignmentCollections.calendarScale(resizeData.timeScale);
			resizeData.assignmentGroups.calendarScale(resizeData.timeScale);
			resizeData.aggregateItems.calendarScale(resizeData.timeScale);
			resizeData.timeaxis.scale(resizeData.timeScale);
			resizeData.layers.linesAxis.attr('transform', `translate(0, ${resizeData.transY})`);
		};

		/**
		 * @ngdoc function
		 * @name updateLanes
		 * @description Update planningboard calendar lanes.
		 *
		 * @param {Object} updateLanesData
		 */
		service.updateLanes = function updateLanes(updateLanesData) {
			if (updateLanesData.laneLayer) {
				var lanes = updateLanesData.laneLayer.selectAll('.lanes').data([...updateLanesData.verticalIndex.values()]);
				updateLanesData.lanesComponent.panelWidth(updateLanesData.panelWidth);

				lanes.call(updateLanesData.lanesComponent);
			}
		};

		/**
		 * @ngdoc function
		 * @name updateScale
		 * @description
		 *
		 * @param {Object} scope
		 * @param {Object} updateScaleData
		 */
		service.updateScale = function updateScale(scope, updateScaleData) {
			if (_.isObject(updateScaleData.timeScale)) {
				updateScaleData.timeScale.domain([updateScaleData.dataService.getDateStart(), updateScaleData.dataService.getDateEnd()]).range([0, updateScaleData.panelWidth]); // estimated container width between splitters
			}
			if (_.isObject(updateScaleData.supplierScale)) {
				updateScaleData.supplierScale.lineHeight(updateScaleData.dataService.rowHeight());//.verticalIndex(scope.verticalIndex);
			}
			if (_.isObject(updateScaleData.assignmentCollections)) {
				updateScaleData.assignmentCollections.calendarScale(updateScaleData.timeScale).supplierScale(updateScaleData.supplierScale);
				updateScaleData.assignmentCollections.calendarDateEnd(updateScaleData.dataService.getDateEnd());
				updateScaleData.assignmentCollections.calendarDateStart(updateScaleData.dataService.getDateStart());
			}
			if (_.isObject(updateScaleData.assignmentItems)) {
				updateScaleData.assignmentItems.calendarScale(updateScaleData.timeScale).supplierScale(updateScaleData.supplierScale);
				updateScaleData.assignmentItems.calendarDateEnd(updateScaleData.dataService.getDateEnd());
				updateScaleData.assignmentItems.calendarDateStart(updateScaleData.dataService.getDateStart());
			}
			if (_.isObject(updateScaleData.assignmentCollections)) {
				updateScaleData.aggregateItems.calendarScale(updateScaleData.timeScale).supplierScale(updateScaleData.supplierScale);
			}

			if (_.isObject(updateScaleData.tagItems)) {
				updateScaleData.tagItems.calendarDateEnd(updateScaleData.dataService.getDateEnd());
				updateScaleData.tagItems.calendarDateStart(updateScaleData.dataService.getDateStart());
			}
		};

		/**
		 * @ngdoc function
		 * @name updateBackgrounds
		 * @description
		 *
		 * @param {Object} scope
		 * @param {Object} updateBackgroundsData
		 */
		service.updateBackgrounds = function updateBackgrounds(scope, updateBackgroundsData) {
			let backgroundsArrByCalendar = new Map();
			let startDateMs = updateBackgroundsData.dataService.getDateStart().toDate().getTime();
			let endDateMs = updateBackgroundsData.dataService.getDateEnd().toDate().getTime();
				updateBackgroundsData.supplierCalendar.forEach(calendar => {
					let backgroundsArr = [];
					calendar.WeekDays.forEach(function f(weekday) {
							let days = [];
								switch (weekday.WeekdayIndex) {
									case 1:
										days = d3.utcSundays(moment(updateBackgroundsData.dataService.getDateStart()).add(-1, 'day'), moment(updateBackgroundsData.dataService.getDateEnd()), 1);
										break;
									case 2:
										days = d3.utcMondays(moment(updateBackgroundsData.dataService.getDateStart()).add(-1, 'day'), moment(updateBackgroundsData.dataService.getDateEnd()), 1);
										break;
									case 3:
										days = d3.utcTuesdays(moment(updateBackgroundsData.dataService.getDateStart()).add(-1, 'day'), moment(updateBackgroundsData.dataService.getDateEnd()), 1);
										break;
									case 4:
										days = d3.utcWednesdays(moment(updateBackgroundsData.dataService.getDateStart()).add(-1, 'day'), moment(updateBackgroundsData.dataService.getDateEnd()), 1);
										break;
									case 5:
										days = d3.utcThursdays(moment(updateBackgroundsData.dataService.getDateStart()).add(-1, 'day'), moment(updateBackgroundsData.dataService.getDateEnd()), 1);
										break;
									case 6:
										days = d3.utcFridays(moment(updateBackgroundsData.dataService.getDateStart()).add(-1, 'day'), moment(updateBackgroundsData.dataService.getDateEnd()), 1);
										break;
									case 7:
										days = d3.utcSaturdays(moment(updateBackgroundsData.dataService.getDateStart()).add(-1, 'day'), moment(updateBackgroundsData.dataService.getDateEnd()), 1);
										break;
								}

								days.forEach(function f(day) {
									let dayInMs = day.getTime();
									if(dayInMs > startDateMs && dayInMs < endDateMs) {
										backgroundsArr.push({
											type: weekday.IsWeekend ? 'weekend' : 'weekday',
											day: moment(day).utc(),
											dayMs: dayInMs,
											bgColor: updateBackgroundsData.parseDecToRgba(weekday.BackgroundColor),
											calendarId: calendar.CalendarId,
										});
									}
								});
					});

					// add today
					const today = moment().utc().startOf('day');
					const todayInMs = today.toDate().getTime();
					if(todayInMs > startDateMs && todayInMs < endDateMs) {
						backgroundsArr.push({
							type: 'today',
							day: today,
							dayMs: todayInMs,
							bgColor: 'rgb(99,99,221)',
							calendarId: calendar.CalendarId,
						});
					}

					// add exDays
					calendar.ExceptionDays.forEach(function f(day) {
						let dayInMs = day.ExceptDate.toDate().getTime();
						if(dayInMs > startDateMs && dayInMs < endDateMs) {
						backgroundsArr.push({
							type: 'exday',
							day: day.ExceptDate,
							dayMs: dayInMs,
							info: day.DescriptionInfo.Translated,
							bgColor: updateBackgroundsData.parseDecToRgba(day.BackgroundColor),
							calendarId: calendar.CalendarId,
						});
					}
					});
					backgroundsArrByCalendar.set(calendar.CalendarId, backgroundsArr);
				})

			if (updateBackgroundsData.backgroundLayer && updateBackgroundsData.backgroundComponent) {
				let supplierBackgrounds = new Map();
				const supplierConfigMappingService = updateBackgroundsData.dataService.getSupplierConfig().mappingService;
				if(supplierConfigMappingService && supplierConfigMappingService.calendar && _.isFunction(supplierConfigMappingService.calendar)) {
					updateBackgroundsData.dataService.supplierDataService.getList().map(supplier => supplierBackgrounds.set(supplier.Id, backgroundsArrByCalendar.get(updateBackgroundsData.dataService.getSupplierConfig().mappingService.calendar(supplier))));
				} else {
					const backgroundsArrByCalendarValues = [...backgroundsArrByCalendar.values()][0];
					updateBackgroundsData.dataService.supplierDataService.getList().map(supplier => supplierBackgrounds.set(supplier.Id, backgroundsArrByCalendarValues));
				}

				updateBackgroundsData.backgroundComponent
					.supplierScale(updateBackgroundsData.supplierScale)
					.bgExceptionDayClickHandler(updateBackgroundsData.bgExceptionDayClickHandler)
					.timeScale(updateBackgroundsData.timeScale)
					.verticalIndexSize(scope.verticalIndex.size)
					.startDate(updateBackgroundsData.dataService.getDateStart())
					.endDate(updateBackgroundsData.dataService.getDateEnd())
					.supplierScrollValue(updateBackgroundsData.supplierScrollValue)
					.supplierBackgrounds(supplierBackgrounds)
					.supplierScaleScopeVerticalIndex(scope.verticalIndex)
				updateBackgroundsData.backgroundLayer.call(updateBackgroundsData.backgroundComponent);
			}

			// return backgroundComponent;
			// background for header // todo: this feature must be implemented in chartbase
			// if (scope.showHeaderBackground) {
			// 	service.backgroundHeaderComponent = pBoardComp.backgroundHeader()
			// 		.startDate(scope.getDateStart())
			// 		.heExceptionDayClickHandler(heExceptionDayClickHandler)
			// 		.timeScale(timeScale);
			//
			// } else if (!scope.showHeaderBackground) {
			// 	layers.headerBottomAxis.selectAll('.backgrounds').remove();
			// }
		};

		/**
		 * @ngdoc function
		 * @name updateFooterBackground
		 * @description
		 *
		 * @param {object} footerContentLayer
		 * @param {int} panelWidth
		 * @param {int} footerHeight
		 */
		service.updateFooterBackground = function updateFooterBackground(footerContentLayer, panelWidth, footerHeight) {
			var footerBackground = platformPlanningBoardFooterComponents.footerBackground()
				.panelWidth(panelWidth)
				.footerHeight(footerHeight);

			if(footerContentLayer){
				footerContentLayer.call(footerBackground);
			}
		};

		/**
		 * @ngdoc function
		 * @name updateStatusPanel
		 * @description
		 *
		 * @param {int} panelWidth
		 */
		service.updateStatusPanel = function updateStatusPanel(panelWidth) {
			$('#statusPanel').css('width', panelWidth);
		};

		/**
		 * @ngdoc function
		 * @name updateTimeScaleTicks
		 * @description
		 *
		 * @param {int} sizeY
		 * @param {Object} supplierScale
		 * @param {Object} timeScale
		 * @param {Object} timeaxis
		 * @returns {Object} dayLinesAxis
		 */
		service.updateTimeScaleTicks = function updateTimeScaleTicks(sizeY, supplierScale, timeScale, timeaxis) {
			// lines / axis in scrollable area
			var dayLineTickValues = timeaxis.tickvalues();

			// return dayLineAxis
			return d3.axisTop(timeScale)
				.tickValues(dayLineTickValues)
				.tickFormat(function () {
					return '';
				})
				.tickSize(sizeY);
		};

		/**
		 * @ngdoc function
		 * @name updatePanelWidthDependencies
		 * @description
		 *
		 * @param {Object} layers
		 * @param {int} panelWidth
		 */
		service.updatePanelWidthDependencies = function updatePanelWidthDependencies(layers, panelWidth) {
			if (layers.headerContent) {
				layers.headerContent.selectAll('rect').style('width', panelWidth);
			}
		};

		/**
		 * @ngdoc function
		 * @name updatePlanningBoardCanvasSize
		 * @description
		 *
		 * @param {int} curDimensionHeight
		 * @param {Object} viewPort
		 * @param {Object} pBoardCanvas
		 * @param {Object} dragSel
		 */
		service.updatePlanningBoardCanvasSize = function updatePlanningBoardCanvasSize(curDimensionHeight, viewPort, pBoardCanvas, dragSel, footerContent) {
			viewPort.style('height', curDimensionHeight);
			pBoardCanvas.style('height', curDimensionHeight);
			dragSel.style('height', curDimensionHeight);
			footerContent.attr('transform', 'translate(0,' + curDimensionHeight + ')');
		};

		/**
		 * @ngdoc function
		 * @name updateAggregations
		 * @description
		 * Update aggregations in planningboard.
		 * @param {Object} scope
		 * @param {Object} aggregationData
		 */
		service.updateAggregations = function updateAggregations(scope, aggregationData) {
			// create and show aggregation
			if (aggregationData.dataService.showAggregations() || aggregationData.dataService.showSumAggregations()) {
				platformPlanningBoardAggregationService.setMapService(aggregationData.dataService.getAssignmentConfig().mappingService, aggregationData.dataService);
				platformPlanningBoardAggregationService.updateAssignmentAggregations(
					aggregationData.dataService.assignments,
					aggregationData.timeaxis.tickvalues(),
					aggregationData.dataService.useMinAggregation(),
					aggregationData.dataService.minAggregationLevel(),
					aggregationData.dataService.showSumAggregations(),
					aggregationData.dataService.getAssignmentConfig().dataService.getServiceName(),
					aggregationData.dataService.getAssignmentConfig().mappingService);
			}

			if (aggregationData.dataService.showAggregations()) {
				let aggregates = platformPlanningBoardAggregationService.getAssignmentAggregations(aggregationData.dataService.getAssignmentConfig().mappingService);
				aggregationData.aggregateItems.aggregates(aggregates);
			}

			if (aggregationData.dataService.showSumAggregations()) {
				let sumAggregates = platformPlanningBoardAggregationService.getSumAggregations(aggregationData.dataService.getAssignmentConfig().mappingService);
				aggregationData.aggregateSumItems.sumAggregates(sumAggregates);
			}
		};

		/**
		 * @ngdoc function
		 * @name updateData
		 * @description
		 *
		 * @param {Object} scope
		 * @param {Object} updateDataData
		 */
		service.updateData = function updateData(scope, updateDataData) {
			updateDataData.calendarlineobject.tickvalues(updateDataData.timeaxis.tickvalues()).maintickvalues(updateDataData.timeaxis.maintickvalues());
			if (_.isObject(updateDataData.layers) && _.isObject(updateDataData.layers.assignments)
			 //&& !updateDataData.isCalendarDragging
			) {
				var mapServ = updateDataData.dataService.getAssignmentConfig().mappingService;
				var assignmentsArray = [];
				let assignmentsArrayWithCollected = [];

				let assignmentIsDragging = !!([...updateDataData.dataService.assignments.values()]).find(assigment => assigment.isDragging);

				const needsCollisionsUpdate = !updateDataData.isCalendarDragging ||
					updateDataData.settingsChanged ||
					assignmentIsDragging;

				platformPlanningBoardLevelOfDetailService.setMapService(mapServ);
				platformPlanningBoardLevelOfDetailService.clearAssignmentCollections(mapServ);
				platformPlanningBoardValidationService.setSuppliers(updateDataData.dataService.suppliers);

				let previouslySelectedAssingments = new Set(updateDataData.dataService.assignmentDataService.getSelectedEntities().map(selectedAssignment => mapServ.id(selectedAssignment)));

				const calendarSecondsDiff = updateDataData.dataService.getDateEnd().diff(updateDataData.dataService.getDateStart(), 'seconds');

				updateDataData.dataService.assignments.forEach(function f(assignment) {

					if (assignment.isDragging || _.isUndefined(assignment.invalidItems)) {
						if (updateDataData.dataService.getSupplierConfig().mappingService && updateDataData.dataService.validateAssignments()) {
							var supplierId = mapServ.supplier(assignment);
							var validationResult = platformPlanningBoardValidationService.validateEntityAgainstSupplier(assignment, 'assignment', supplierId);
							assignment.isValid = validationResult.isValid;
							assignment.invalidItems = validationResult.invalidItems;
						} else {
							assignment.isValid = true;
							assignment.invalidItems = [];
						}
					}


					assignment.Disabled = (updateDataData.dataService.planningBoardMode.actionType === 'createAssignment');
					if (previouslySelectedAssingments.length > 0) {
						assignment.selectedFlag = previouslySelectedAssingments.has(mapServ.id(assignment));
					}

					let assignmentFromDate = mapServ.from(assignment).toDate();
					assignment._startDateInMs = assignmentFromDate.getTime();
					assignment._endDateInMs = mapServ.to(assignment).toDate().getTime();
					let assignmentTickStart;

					const tickValuesArray = updateDataData.timeaxis.tickvalues();
					if (tickValuesArray.length > 0) {
						const startOnTick = updateDataData.timeaxis.tickvalues().find(x => x.getTime() === assignment._startDateInMs);
						if (startOnTick) {
							assignmentTickStart = assignmentFromDate;
						} else {
							const firstAfterFromDate = tickValuesArray.find(x => x.getTime() > assignment._startDateInMs);

							let value = 0;
							if (tickValuesArray.indexOf(firstAfterFromDate) === tickValuesArray.length - 1) {
								value = tickValuesArray.indexOf(firstAfterFromDate);
							} else if (tickValuesArray.indexOf(firstAfterFromDate) > 0) {
								value = tickValuesArray[tickValuesArray.indexOf(firstAfterFromDate) - 1];
							} else {
								value = assignmentFromDate;
							}

							assignmentTickStart = value;
						}

						if (updateDataData.settingsChanged) {
							assignment.isVerticallyCollected = false;
						}

						// check level of detail except for current dragging assignment
						if (!platformPlanningBoardLevelOfDetailService.isCollected(assignment, calendarSecondsDiff, assignmentTickStart, updateDataData.panelWidth, mapServ)) {
							assignmentsArray.push(assignment);
						}
						assignmentsArrayWithCollected.push(assignment);
					} else {
						assignmentsArray.push(assignment);
						assignmentsArrayWithCollected.push(assignment);
					}
				});

				var assignmentDiff = _.difference(assignmentsArray, updateDataData.oldAssignmentArr);
				updateDataData.oldAssignmentArr = assignmentsArray;
				if (updateDataData.dataService.planningBoardMode.actionType !== 'grouping') {
					if (needsCollisionsUpdate ||
						assignmentDiff.length > 0) {

						service.settingsChanged = false;
						let updateCollisionsDataObj = {
							mapServ: mapServ,
							arr: assignmentsArray,
							arrWithCollected: assignmentsArrayWithCollected,
							calendarSecondsDiff: calendarSecondsDiff,
							panelWidth: updateDataData.panelWidth,
							dataService: updateDataData.dataService,
							tickvalues: updateDataData.timeaxis.tickvalues()
						};
						updateAssignmentCollisions(scope, updateCollisionsDataObj);
					}
					assignmentsArray = assignmentsArray.filter(assigment => !assigment.isVerticallyCollected);
					updateDataData.assignmentCollections.assignments(platformPlanningBoardLevelOfDetailService.getAssignmentCollections(mapServ));
				}

				service.updateAssignmentsFilter(scope, assignmentsArrayWithCollected, updateDataData.dataService);
				service.updateAssignmentStatus({
					scope: scope,
					assignmentAvailableStatusItems: updateDataData.assignmentAvailableStatusItems,
					arr: assignmentsArray,
					layers: updateDataData.layers,
					draw: updateDataData.draw,
					dataService: updateDataData.dataService
				});
			}
			return updateDataData.oldAssignmentArr
		};

		service.updateHighlightAssignments = function updateHighlightAssignments(updateData) {
			if (updateData.dataService.getAssignmentConfig().dataService.isHighlightAssignments) {
				let assigments = updateData.dataService.assignments;
				if (assigments.size > 0) {
					const assignmentMappingServ = updateData.dataService.getAssignmentConfig().mappingService;
					if (_.isFunction(assignmentMappingServ.filteredAssignmentsOnProductionSet)) {
						let highlightAssignmentKeys = assignmentMappingServ.filteredAssignmentsOnProductionSet(assigments);
						if (highlightAssignmentKeys.length > 0) {
							highlightAssignmentKeys.forEach(function f(key) {
								let defs = d3.select('.planningboard svg').append('defs');
								//Filter for the outside glow
								let filter = defs.append('filter').attr('id', 'glow');
								filter.append('feGaussianBlur').attr('stdDeviation', '10').attr('result', 'coloredBlur');
								let feMerge = filter.append('feMerge');
								feMerge.append('feMergeNode').attr('in', 'coloredBlur');
								feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
								let iterations = 0;
								let highlightAssignmentItems = updateData.layers.assignments.selectAll('g.assignment-item').filter(assignment => assignment.Id === key);
								function highlight() {
									highlightAssignmentItems
										.transition()
										.duration(1000)
										.attr('stroke-width', '5px')
										.style('filter', 'url(#glow)')
										.ease(d3.easeLinear)
										.transition()
										.duration(1000)
										.attr('stroke-width', '1px')
										.on('end', function () {
											iterations++;
											if (iterations < 2) {
												highlight(); // Repeat the animation only twice
											}
										});

								}
								highlight();
							});
						}
					}
				}
			} else {
				updateData.layers.assignments.selectAll('g.assignment-item').attr('stroke-width', '1px').attr('stroke-opacity', 1).style('filter', '');
			}
		};

		function getAssignmentsNumberInRow(dataService) {
			let assignmentsNumberInRow = 1;
			let maxFontHeight = platfromPlanningBoardAssignmentComponentConstants.maxFontSizeInfoText;
			let spaceBetweenTextLines = platfromPlanningBoardAssignmentComponentConstants.maxSpaceInfoTexts;
			let textLinesHeight = maxFontHeight + spaceBetweenTextLines;
			if (dataService.useFixedAssignmentHeight()) {
				let multipleLine = 1;
				switch (dataService.useFixedAssignmentHeight()) {
					case dataService.showInfo3Text():
						multipleLine = 4;
						break;
					case dataService.showInfo2Text():
						multipleLine = 3;
						break;
					case dataService.showInfo1Text():
						multipleLine = 2;
						break;
					default:
						break;
				}
				assignmentsNumberInRow = Math.ceil(dataService.rowHeightAssignments() / (textLinesHeight * multipleLine));
			}
			return assignmentsNumberInRow;
		}

		service.isJson = function isJson(str) {
			str = typeof str !== 'string' ? JSON.stringify(str) : str;
			if (str.startsWith('{')) {
				try {
					str = JSON.parse(str);
				} catch (e) {
					return false;
				}
				if (typeof str === 'object' && str !== null && Object.keys(str).length > 0) {
					return true;
				}
			}
			return false;
		};

		/**
		 * @ngdoc function
		 * @name updateAssignmentsFilter
		 * @description Updates the assignments according to a searchString
		 *
		 * @param scope
		 * @param assigmentsArray
		 * @return {*[]}
		 */
		service.updateAssignmentsFilter = (scope, assigmentsArray, dataService) => {
			const filteredAssignments = [];
			if (dataService.planningBoardMode.actionType !== 'createAssignment' && assigmentsArray.length > 0) {
				let filterFields = [];

				// add visible info text lines to search fields
				getFieldSearchString(dataService.showMainText(), dataService.mainInfoLabel(), filterFields);
				getFieldSearchString(dataService.showInfo1Text(), dataService.info1Label(), filterFields);
				getFieldSearchString(dataService.showInfo2Text(), dataService.info2Label(), filterFields);
				getFieldSearchString(dataService.showInfo3Text(), dataService.info3Label(), filterFields);

				// add extra custom search fields from mapping service of assignment
				if (_.isFunction(dataService.getAssignmentConfig().mappingService.getFilterFields)) {
					filterFields = _.uniq([...filterFields, ...dataService.getAssignmentConfig().mappingService.getFilterFields()]);
				}

				if (filterFields.length === 0) {
					// default search fields
					filterFields = ['Code', 'Description'];
				}

				// filter assignments according to filtered supplier list
				const shownSupplierIds = new Map(dataService.getSupplierConfig().dataService.getList().map(supplier => [supplier.Id, supplier]));
				const assigmentsArrayForShownSuppliers = assigmentsArray.filter(assignment => !_.isUndefined(shownSupplierIds.get(dataService.getAssignmentConfig().mappingService.supplier(assignment))));

				if (_.isObject(assigmentsArrayForShownSuppliers) && !_.isUndefined(scope.searchString) && _.isString(scope.searchString)) {
					assigmentsArrayForShownSuppliers.forEach((assigment) => assigment.Disabled = scope.searchString.length > 0);

					if (scope.searchString.length > 0) {
						filterFields.forEach((filterField) => {
							assigmentsArrayForShownSuppliers.forEach((assigment) => {
								if (assigment[filterField] && (assigment[filterField]).toString().toUpperCase().includes(scope.searchString.toUpperCase())) {
									assigment.Disabled = false;
									if (filteredAssignments.indexOf(assigment) === -1) {
										filteredAssignments.push(assigment);
									}
								}
							});
						});
					}
				}
			}

			filteredAssignments.sort((a, b) => dataService.getAssignmentConfig().mappingService.from(a).toDate() - dataService.getAssignmentConfig().mappingService.from(b).toDate());

			function getFieldSearchString(isShowInfoText, infoTextLabel, filterFieldsArr) {
				if (!(isShowInfoText && infoTextLabel !== '' && filterFieldsArr.indexOf(infoTextLabel) === -1)) {
					return;
				}

				if (service.isJson(infoTextLabel)) {
					let infoObject = JSON.parse(infoTextLabel);
					for (let key in infoObject) {
						if (Array.isArray(infoObject[key])) {
							infoObject[key].forEach(function (element) {
								if (element.match(/\{|\}/gi)) {
									element = element.replace(/\{|\}/gi, '');
									filterFieldsArr.push(element);
								}
							});
						}
					}
				} else {
					filterFieldsArr.push(infoTextLabel);
				}
			}

			return filteredAssignments;
		};

		/**
		 * @ngdoc function
		 * @name updateAssignmentStatus
		 * @description Updates assignments component according to its status and the active planning board mode
		 *
		 * @param updateDataData
		 */
		service.updateAssignmentStatus = (updateData) => {
			// check and set avaible status depending on planningboardMode
			if (updateData.dataService.planningBoardMode) {
				switch (updateData.dataService.planningBoardMode.actionType) {
					case 'setStatus':
						var pbModeId = parseInt(_.split(updateData.dataService.planningBoardMode.id, '_')[1]);
						if (!_.isUndefined(pbModeId)) {
							updateData.arr.forEach(entity => {
								if (updateData.assignmentAvailableStatusItems.has(entity.StatusFrom)) {
									let foundAvailableStati = updateData.assignmentAvailableStatusItems.get(entity.StatusFrom);
									if (!foundAvailableStati.includes(pbModeId)) {
										entity.Disabled = true;
									}
								}
							})
						}

						updateData.layers.assignmentTags.datum(updateData.arr);
						updateData.layers.assignments.datum(updateData.arr);
						updateData.layers.assignments.selectAll('g.assignment-item').classed('disabled', false);
						updateData.draw();
						break;
					case 'createAssignment':
						updateData.layers.assignmentTags.datum(updateData.arr);
						updateData.layers.assignments.datum(updateData.arr);
						updateData.draw();
						break;
					default:
						updateData.layers.assignmentTags.datum(updateData.arr);
						updateData.layers.assignments.datum(updateData.arr);
						updateData.layers.assignments.selectAll('g.assignment-item').classed('disabled', false);
						break;
				}
			}
		};

		service.updateAssignmentGrouping = (updateData) => {
			if (updateData.planningBoardMode.actionType === 'grouping') {
				return platformPlanningBoardAssignmentGroupingService.updateAssignmentGrouping(updateData.timeaxis, updateData.timeScale, updateData.supplierScale, updateData.planningBoardDataService);
			}
		};

		/**
		 * @ngdoc function
		 * @name updateAssignmentCollisions
		 * @description Updates the assignment collisions depending on the 'minimal assignment height' setting
		 *
		 * @param {Object} scope
		 * @param {Object} updateData
		 * @example service.updateAssignmentCollisions(scope, {mapServ: mappingService, arr: assignmentsArray, calendarSecondsDiff: calendarSecondsDiff, panelWidth: panelWidth});
		 */
		function updateAssignmentCollisions(scope, updateData) {
			let toUpdate = updateData.arrWithCollected;//.filter(assignment => assignment._startDateInMs <= updateData.tickvalues.at(-1).getTime() && assignment._endDateInMs >= updateData.tickvalues.at(0).getTime());
			let draggedAssignment = toUpdate.find(assigment => assigment.isDragging);

			if (draggedAssignment) {
				const diffTicks = updateData.tickvalues.at(1).getTime() - updateData.tickvalues.at(0).getTime()
				const startTimeDragged = updateData.mapServ.from(draggedAssignment).toDate().getTime() - diffTicks;
				const endTimeDragged = updateData.mapServ.to(draggedAssignment).toDate().getTime() + diffTicks;

				//toUpdate = [...toUpdate, ...updateData.arrWithCollected.filter(assignment => {
				toUpdate = new Set([draggedAssignment, ...updateData.arrWithCollected.filter(assignment => {
					const assignmentId = updateData.mapServ.id(assignment);
					const ofSameSupplier = updateData.mapServ.supplier(assignment) === updateData.mapServ.supplier(draggedAssignment) && updateData.mapServ.from(assignment).toDate() < updateData.tickvalues.at(-1) && updateData.mapServ.to(assignment).toDate() > updateData.tickvalues.at(0);
					let ofSameSupplierAndColliding = false;
					let wasColliding = false;

					if (ofSameSupplier) {
						ofSameSupplierAndColliding = (updateData.mapServ.from(assignment).toDate().getTime() >= startTimeDragged && updateData.mapServ.to(assignment).toDate().getTime() <= endTimeDragged) ||
						(updateData.mapServ.from(assignment).toDate().getTime() < startTimeDragged && updateData.mapServ.to(assignment).toDate().getTime() > endTimeDragged);
					}

					if (draggedAssignment.collisions
						&& draggedAssignment.collisions.length > 1
						&& updateData.mapServ.id(draggedAssignment) !== assignmentId) {

						wasColliding = draggedAssignment.collisions.includes(assignmentId);
					}

					return ofSameSupplier
					//|| ofSameSupplierAndColliding
					|| wasColliding;
				})]);

				toUpdate = [...toUpdate.values()];
			}

			toUpdate.forEach(assignment => assignment.isVerticallyCollected = false);

			var groupedItems = _.groupBy(toUpdate, function (assignment) {
				if (_.isFunction(updateData.mapServ.layer) && updateData.mapServ.layer(assignment).length > 0) {
					return 'layer-' + updateData.mapServ.layer(assignment) + updateData.mapServ.supplier(assignment); // grouping on every layer
				}
				return (updateData.mapServ.forMaintenance(assignment)) ? 'maintenance' + updateData.mapServ.supplier(assignment) : updateData.mapServ.supplier(assignment); // maintenance id no system type!!!
			});
			const assignmentsNumberInRow = getAssignmentsNumberInRow(updateData.dataService);
			let indexOfDraggedAssignment = -1;
			let draggedGroupAssignment;
			let assignmentToMove;
			if (groupedItems) {
				_.forEach(groupedItems, function (group) {
					draggedGroupAssignment = group.find(elem => elem === draggedAssignment);
					if (draggedGroupAssignment && updateData.dataService.useFixedAssignmentHeight()) {
						indexOfDraggedAssignment = group.indexOf(draggedGroupAssignment);
						if (indexOfDraggedAssignment !== -1 && indexOfDraggedAssignment + 1 > assignmentsNumberInRow) {
							assignmentToMove = group.splice(indexOfDraggedAssignment, 1).at(0);
							group.splice(assignmentsNumberInRow - 1, 0, assignmentToMove);
						}
					}
					platformPlanningBoardCollisionService.setMapService(updateData.mapServ);
					platformPlanningBoardCollisionService.clearAll(updateData.mapServ);
					platformPlanningBoardCollisionService.setMaxHeight(updateData.dataService.rowHeightAssignments(), updateData.mapServ);
					platformPlanningBoardCollisionService.setUseFixedAssignmentHeight(updateData.dataService.useFixedAssignmentHeight(), updateData.mapServ);
					platformPlanningBoardCollisionService.setAssignmentsNumberInRow(assignmentsNumberInRow, updateData.mapServ);
					platformPlanningBoardCollisionService.setDefaultItemValues(group, updateData.mapServ);
					platformPlanningBoardCollisionService.addItems(group, updateData.mapServ);
					group.forEach(item => {
						let assignmentTickStart = updateData.mapServ.from(item).toDate();
						platformPlanningBoardLevelOfDetailService.isCollected(item, updateData.calendarSecondsDiff, assignmentTickStart, updateData.panelWidth, updateData.mapServ);
					});
				});
			}
		}

		// endregion
	}

})(angular);