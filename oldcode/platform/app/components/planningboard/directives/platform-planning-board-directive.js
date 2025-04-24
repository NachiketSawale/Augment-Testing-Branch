/* eslint-disable indent */

/* global d3 */
angular.module('platform').directive('platformPlanningBoardDirective', ['_', '$injector', '$timeout', '$translate', 'moment',
	'platformMasterDetailDialogService',
	'planningBoardComponents',
	'planningBoardAssignmentTagComponent',
	'planningBoardBaseComponent',
	'platformGridAPI',
	'platformDragdropService',
	'platformPlanningBoardConfigService',
	'platformPlanningBoardCollisionService',
	'cloudDesktopSvgIconService',
	'platformPlanningBoardStatusService',
	'platformPlanningBoardLevelOfDetailService',
	'platformPlanningBoardValidationService',
	'platformPlanningBoardAggregationService',
	'basicsLookupdataPopupService',
	'platformPlanningBoardUpdateService',
	'platformPlanningBoardDataService',
	'basicsCommonDrawingUtilitiesService',
	'planningBoardTooltipComponent',
	'chartService',
	'planningBoardLineComponent',
	'platfromPlanningBoardCalendarService',
	'platformDateshiftPlanningboardHelperService',
	'$q',
	function (_, $injector, $timeout, $translate, moment,
		platformMasterDetailDialogService,
		pBoardComp,
		pBoardAssignmentTagComp,
		planningBoardBaseComponent,
		platformGridAPI,
		platformDragdropService,
		platformPlanningBoardConfigService,
		platformPlanningBoardCollisionService,
		cloudDesktopSvgIconService,
		platformPlanningBoardStatusService,
		platformPlanningBoardLevelOfDetailService,
		platformPlanningBoardValidationService,
		platformPlanningBoardAggregationService,
		basicsLookupdataPopupService,
		platformPlanningBoardUpdateService,
		platformPlanningBoardDataService,
		basicsCommonDrawingUtilitiesService,
		planningBoardTooltipComponent,
		chartService,
		planningBoardLineComponent,
		platfromPlanningBoardCalendarService,
		platformDateshiftPlanningboardHelperService,
		$q) {
		'use strict';

		return {
			priority: 10,
			link: link,
			restrict: 'A',
			scope: false,
			templateUrl: globals.appBaseUrl + 'app/components/planningboard/partials/platform-planning-board-partial.html'
		};

		function link($scope, element) {

			let planningBoardDataService = platformPlanningBoardDataService.getPlanningBoardDataServiceByUUID($scope.getContainerUUID());

			let root, viewPort, grid, layers = {}, unregister = [],
				dragSel, dragSVG, pBoardCanvas,
				calendarlineobject,
				dayLinesAxis, footerDayLinesAxis,
				timeScale, supplierScale,
				backgroundLayer, bgPreviewLayer, hePreviewLayer, lanesComponent, toolTipBackgroundComponent,
				aggregateItems, aggregateSumItems,
				laneLayer, assignmentItems, backgroundComponent, backgroundHeaderComponent, selectedAssignments = [], assignmentGroups, assignmentGroupTooltips,
				assignmentDragStartX, assignmentDragStartY, assignmentCollection, assignmentCollections, assignmentMaxLoadLines,
				calendarDrag, assignmentFullDrag, assignmentStartDrag, assignmentEndDrag, zoom, tagItems, oldAssignmentArr = [], demandInfo, demandDragView, oldDeltaY = 0, conflictAssignments = [],
				lastClickedDay;
			let canOpenTimeout = $timeout();
			let canOpen = true;
			let timerRunning = false;
			let isDoubleClick = false;
			let indicatorAreas, indicatorAreaComponent;
			let firstMouseEnter = false;
			let settingsChanged = false;
			let panelWidth = getParentPanelWidth(); // GJ 2017 12 01;
			let panelHeight = getParentPanelHeight();
			let oldD3ZoomVal = 0;
			let isCalendarDragging = false;
			let supplierChanged = false;
			let isCalendarClicked = false;
			let selectedDemandIndex = 0;
			let timeaxis;
			let chart = $injector.get('chartbase');
			let CalDragTimeOut = 0;
			let OnScrollDrawTimeOut = 0;
			let lastAmountOfStepsX = 0;
			let defaultHeaderlineHeight = 63;
			let footerHeight = $scope.defaultFooterHeight;
			let containerScope;
			let startDragX = 0;
			let startDragY = 0;
			let calculatedCurrentSizeY = calculateCurrentSizeY();
			let containerDimensions = {};
			let supplierContainerScrollBar = null;
			setupTools();

			let radius = 5;
			let oldXMoment = _.noop(), // reset on drag start
				dragStartBarValues = _.noop(),
				moveMode = 'day'; // default moveMode

			let popupInstance = _.noop();
			$scope.pbPopup = []; // popup options
			let aggregationHeight = (planningBoardDataService.showAggregations()) ? planningBoardDataService.defaultAggregationHeight() : 0;

			let adjustCircleObj = {
				zoomLevel: 'day',
				zoomLevelSeconds: 86400,
				movedUnits: 0,
				move: function move(element, movedX, circle, zl) {
					if (zl === 'auto' || _.isUndefined(zl)) {
						this.zoomLevel = chartService.getZoomLevel(timeaxis);
					} else {
						this.zoomLevel = zl;
					}

					let movedXMoment;

					switch (this.zoomLevel) {
						case 'hour':
							movedXMoment = moment(timeScale.invert(movedX)).utc().set({
								minute: 0,
								second: 0,
								millisecond: 0
							});
							this.zoomLevelSeconds = 3600;
							break;
						case 'day':
							movedXMoment = moment(timeScale.invert(movedX)).utc().set({
								hour: 0,
								minute: 0,
								second: 0,
								millisecond: 0
							});
							this.zoomLevelSeconds = 86400;
							break;
						case 'week':
							movedXMoment = moment(timeScale.invert(movedX)).utc().set({
								hour: 0,
								minute: 0,
								second: 0,
								millisecond: 0
							});
							break;
						default:
							console.warn('No definitions for [' + this.zoomLevel + '] this zoom level.');
							break;
					}

					if ((_.isUndefined(oldXMoment) || !_.isUndefined(oldXMoment) && !movedXMoment.isSame(oldXMoment, this.zoomLevel)) &&
						((circle === 'min' && moment(movedXMoment).diff(dragStartBarValues.barEnd, 's') < 0) ||
							circle === 'max' && moment(movedXMoment).diff(dragStartBarValues.barStart, 's') >= 0 ||
							circle === 'mid')) {

						if (_.isUndefined(oldXMoment)) {
							oldXMoment = moment(movedXMoment);
						}

						let movedDiff = movedXMoment.diff(oldXMoment, 'seconds');
						oldXMoment = moment(movedXMoment);
						if (movedDiff > 0) {
							if (this.zoomLevel === 'week') {
								this.movedUnits++;
							} else {
								this.movedUnits += Math.ceil(movedDiff / this.zoomLevelSeconds);
							}
						} else {
							if (this.zoomLevel === 'week') {
								this.movedUnits--;
							} else {
								this.movedUnits += Math.floor(movedDiff / this.zoomLevelSeconds);
							}
						}

						switch (this.zoomLevel) {
							case 'hour':
								if (circle === 'max') {
									movedXMoment.set({
										minutes: dragStartBarValues.barEnd.format('mm'),
										seconds: dragStartBarValues.barEnd.format('ss')
									});
								} else if (circle === 'min') {
									movedXMoment.set({
										minutes: dragStartBarValues.barStart.format('mm'),
										seconds: dragStartBarValues.barStart.format('ss')
									});
								}
								break;
							case 'day':
								this.setStartBarValues(movedXMoment, circle);
								break;
							case 'week':
								this.setStartBarValues(movedXMoment, circle);
								movedXMoment.day(dragStartBarValues.barStart.day());
								break;
						}

						element.circle = circle;
						this.setBarDates(element, movedXMoment, movedDiff, circle);
						// draw(element);//onMoving(element);
					}
				},
				setBarDates: function setBarDates(element, movedXMoment, movedDiff, circle) {
					if (movedDiff !== 0) {
						switch (circle) {
							case 'min':
								if (!_.isNil(planningBoardDataService.getDateshiftConfig())) {
									planningBoardDataService.getAssignmentConfig().mappingService.dateShift({
										startMoment: movedXMoment,
										endMoment: dragStartBarValues.barEnd,
										el: element,
										dateShiftConfig: planningBoardDataService.getDateshiftConfig(),
										dataService: planningBoardDataService
									});
								} else {
									planningBoardDataService.getAssignmentConfig().mappingService.from(element, moment(movedXMoment));
									planningBoardDataService.getAssignmentConfig().mappingService.to(element, moment(dragStartBarValues.barEnd));
								}
								break;
							case 'max':
								if (!_.isNil(planningBoardDataService.getDateshiftConfig())) {
									planningBoardDataService.getAssignmentConfig().mappingService.dateShift({
										startMoment: dragStartBarValues.barStart,
										endMoment: movedXMoment,
										el: element,
										dateShiftConfig: planningBoardDataService.getDateshiftConfig(),
										dataService: planningBoardDataService
									});
								} else {
									planningBoardDataService.getAssignmentConfig().mappingService.from(element, moment(dragStartBarValues.barStart));
									planningBoardDataService.getAssignmentConfig().mappingService.to(element, moment(movedXMoment));
								}
								break;
							case 'mid':
								if (!_.isNil(planningBoardDataService.getDateshiftConfig())) {
									planningBoardDataService.getAssignmentConfig().mappingService.dateShift({
										el: element, // needed for single shift
										startMoment: moment(dragStartBarValues.barStart).add(this.movedUnits, this.zoomLevel),
										endMoment: moment(dragStartBarValues.barEnd).add(this.movedUnits, this.zoomLevel),
										dateShiftConfig: planningBoardDataService.getDateshiftConfig(),
										dataService: planningBoardDataService,

										selectedAssignments: selectedAssignments, // needed for multishift
										type: circle,
										durationOfMove: moment.duration(this.movedUnits, this.zoomLevel)
									});
								} else {
									planningBoardDataService.getAssignmentConfig().mappingService.from(element, moment(dragStartBarValues.barStart).add(this.movedUnits, this.zoomLevel));
									planningBoardDataService.getAssignmentConfig().mappingService.to(element, moment(dragStartBarValues.barEnd).add(this.movedUnits, this.zoomLevel));
								}
								break;
						}
					} else {
						return false;
					}
				},
				setStartBarValues: function setStartBarValues(movedXMoment, circle) {
					if (circle === 'max') {
						movedXMoment.set({
							hour: dragStartBarValues.barEnd.format('HH'),
							minutes: dragStartBarValues.barEnd.format('mm'),
							seconds: dragStartBarValues.barEnd.format('ss')
						});
					} else if (circle === 'min') {
						movedXMoment.set({
							hour: dragStartBarValues.barStart.format('HH'),
							minutes: dragStartBarValues.barStart.format('mm'),
							seconds: dragStartBarValues.barStart.format('ss')
						});
					}
				}
			};

			function onSettingsChange(settingsList, containerUUID) {
				if ($('.cid_' + containerUUID).find('.planningboardMain.' + $scope.getContainerUUID()).length > 0) {
					settingsChanged = true;



					const rowHeight = planningBoardDataService.rowHeight();
					// adapt assignment row heights when aggregations are visible
					if (planningBoardDataService.showAggregations()) {
						aggregationHeight = planningBoardDataService.defaultAggregationHeight();
						planningBoardDataService.getPlanningBoardSettingsList()[0].rowHeightAssignments = rowHeight - aggregationHeight;
					} else {
						aggregationHeight = 0;
					}
					if (!_.isNil(supplierScale)) {
						supplierScale.lineHeight(rowHeight);
					}
					setup();
					updateAll();
				}
			}

			platformPlanningBoardConfigService.registerOnSettingsChanged(onSettingsChange);

			let verticalScrollOffset = 0;

			let supplierScrollValue = 0;

			// init(); manual init runs too early

			function init() {
				// self-unsubscribe (only run once)
				$scope.unregisterDataUpdated(init);
				$scope.registerDataUpdated(update);


				// set mapping services
				platformPlanningBoardCollisionService.setMapService(planningBoardDataService.getAssignmentConfig().mappingService);
				platformPlanningBoardLevelOfDetailService.setMapService(planningBoardDataService.getAssignmentConfig().mappingService);

				platformPlanningBoardAggregationService.setMapService(planningBoardDataService.getAssignmentConfig().mappingService, planningBoardDataService);
				if (planningBoardDataService.getAssignmentConfig().dataService.capacityPerDay) {
					platformPlanningBoardAggregationService.updateCapacities(planningBoardDataService.getAssignmentConfig().dataService.capacityPerDay, planningBoardDataService.getAssignmentConfig().mappingService);
				}

				platformPlanningBoardValidationService.assignmentMapService(planningBoardDataService.getAssignmentConfig().mappingService);
				if (planningBoardDataService.getDemandConfig() && planningBoardDataService.getDemandConfig().mappingService) {
					platformPlanningBoardValidationService.demandMapService(planningBoardDataService.getDemandConfig().mappingService);
				}

				if (planningBoardDataService.getSupplierConfig() && planningBoardDataService.getSupplierConfig().mappingService) {
					platformPlanningBoardValidationService.supplierMapService(planningBoardDataService.getSupplierConfig().mappingService);
				}

				unRegister();
				setup(); // setup drawing and handlers;
				update(); // initial update; later updates via handler;
				$scope.verticalIndex = new Map(planningBoardDataService.getSupplierConfig().dataService.getList().map((obj, index) => [obj.Id, index]));
				// call adaptheader initially to show column search correctly after tab change
				adaptHeaders();
			}

			/**
			 * @description Corrects the position of the grid filters in planning board
			 *
			 * @param {*} event
			 */
			function placeholderHeightCorrection(event, gridId, containerUUID) {
				if ($('.cid_' + containerUUID).find('.planningboardMain.' + $scope.getContainerUUID()).length > 0) {
					let phHeight = 0;
					const fitlerPlaceholderElem = $('.cid_' + containerUUID).find('.planningboardMain.' + $scope.getContainerUUID()).find('.filterPlaceholder');
					switch (planningBoardDataService.activeSearchMode) {
						case 'searchBoth':
							phHeight = 28;
							break;
						default:
							phHeight = 36;
							break;
					}
					fitlerPlaceholderElem.css('height', phHeight + 'px');
				}
				resize();
			}

			const searchBothFilterKeyupEventListener = $scope.$on('searchBothFilterKeyup', updateAssignmentsFilter);
			const placeholderHeightCorrectionEventListener = $scope.$on('placeholderHeightCorrection', placeholderHeightCorrection);
			const selectAssignmentsEventListener = $scope.$on('selectAssignmentOnFilterChanged', selectAssignmentOnFilterChanged);

			$scope.$on('$destroy', function cleanupHandlers() {
				_.over(unregister)();
				unregister = null;
				$scope.unregisterDataUpdated(update);
				unRegister();
				// unregisterResizeEvents();
				platformPlanningBoardConfigService.unregisterOnSettingsChanged(onSettingsChange);
				searchBothFilterKeyupEventListener();
				placeholderHeightCorrectionEventListener();
				selectAssignmentsEventListener();
			});

			unregister.push($scope.$watch(
				function () {
					return {
						width: element[0].offsetWidth,
						height: element[0].offsetHeight
					};
				},
				function () {
					let currentWidth = element[0].offsetWidth;
					let currentHeight = element[0].offsetHeight;
					if (currentWidth !== panelWidth || currentHeight !== panelWidth) {
						containerDimensions.width = panelWidth = currentWidth;
						containerDimensions.height = panelHeight = currentHeight;
						updatePanelWidthDependencies();
						if (supplierScale) {
							updateAll();
						}
					}
				},
				true
			));

			$scope.status = '';

			$scope.registerDataUpdated(init);

			function onScroll(e, elem) {
				if ($('.planningboardMain.' + $scope.getContainerUUID()).find(elem.grid.getContainer()[0]).length > 0) {
					supplierScrollValue = arguments[1].scrollTop;
					verticalScrollOffset = -supplierScrollValue; // for possible initial offset
					assignmentCollections.supplierScrollValue(supplierScrollValue);
					assignmentItems.supplierScrollValue(supplierScrollValue);
					tagItems.supplierScrollValue(supplierScrollValue);
					let customVerticalIndex = setVisibleVerticalIndex(elem.grid, $scope);
					supplierScale.verticalIndex(customVerticalIndex);
					$('.planningboardMain.' + $scope.getContainerUUID() + ' g.scrollContent')[0].setAttribute('transform', 'translate(0, ' + verticalScrollOffset + ')');
					clearTimeout(OnScrollDrawTimeOut);
					OnScrollDrawTimeOut = setTimeout(update, 5);
				}
			}

			function onScrollEndUpdate () {
				update();
			}

			function setVisibleVerticalIndex(grid, $scope) {
				const indexToSupplierIdMap = indexToSupplierId($scope.getFilteredItems(planningBoardDataService.getSupplierConfig().uuid));

				let visibleSupplierIndices = [];
				if (_.isFunction(grid.getRenderedRange) && grid.getRenderedRange().bottom >= 0) {
					for (let i = grid.getRenderedRange().top; i < grid.getRenderedRange().bottom; i++) {
						visibleSupplierIndices.push(i);
					}
				}
				else {
					// if getRenderedRange isn't available set all suppliers as fallback
					planningBoardDataService.getSupplierConfig().dataService.getList().forEach((obj, index) => visibleSupplierIndices.push(index));
				}

				// workaround for issue in framework - count of rendered suppliers is at some point always less by 1 than in reality
				let addidionalIndex = 0;

				if (!_.isUndefined(visibleSupplierIndices.at(-1))) {
					addidionalIndex = visibleSupplierIndices.at(-1) + 1;
				}

				if (indexToSupplierIdMap.has(addidionalIndex)) {
					visibleSupplierIndices.push(addidionalIndex);
				}
				// end workaround - can be deleted when framework issue solved (should not cause any performance or any other issues)

				const customVerticalIndex = new Map(visibleSupplierIndices.map(index => [indexToSupplierIdMap.get(index), index]));
				return customVerticalIndex;
			}

			function indexToSupplierId(map) {
				const inversed = new Map();
				map.forEach((vv, kk) => {
				  inversed.set(vv, kk);
				});
				return inversed;
			};

			function onSortOrFilter(e, elem) {
				$timeout(function () {
					$scope.verticalIndex = $scope.getFilteredItems(planningBoardDataService.getSupplierConfig().uuid);
					if (elem && elem.grid) {
						supplierScale.verticalIndex(setVisibleVerticalIndex(elem.grid.instance, $scope));
					} else {
						supplierScale.verticalIndex($scope.verticalIndex);
					}

					calendarlineobject.height(calculatedCurrentSizeY);
					updateAll();
				});
			}

			function onSupplierGridRowCountChanged() {
				if (!supplierChanged) {
					supplierChanged = true;
					if(grid) {
						onSortOrFilter(null, {grid: grid});
					} else {
						onSortOrFilter();
					}
					// updatePlanningBoardCanvasSize();
				}

				setTimeout(function () {
					supplierChanged = false;
				}, 100);
			}

			let demandDragStart = function (e) {
				if (e.isDragging) {
					if (e.draggedData && e.draggedData.sourceGrid && e.draggedData.sourceGrid.data[0] && $('.cid_' + e.sourceId).find('.planningboardMain.' + $scope.getContainerUUID()).length > 0) {
						let demand = e.draggedData.sourceGrid.data[0];
						demandInfo = demand;
						demandInfo.height = supplierScale.lineHeight();
						let mapServ = planningBoardDataService.getDemandConfig().mappingService;
						platformDragdropService.setDraggedText(mapServ.dragInformation(demand));
						let topY = supplierScale.headerLineHeight();
						let bottomY = supplierScale.headerLineHeight() + $scope.verticalIndex.size * supplierScale.lineHeight();
						if (_.isNumber(mapServ.supplier(demand))) {
							let assignment = mapServ.supplierObj(demand);
							let assignmentTopY = supplierScale(assignment, 'top');
							let assignmentBottomY = supplierScale(assignment, 'bottom');
							if (_.isNumber(assignmentTopY) && assignmentTopY > 0 && _.isNumber(assignmentBottomY) && assignmentBottomY > 0) {
								topY = assignmentTopY;
								bottomY = assignmentBottomY;
							}
						}
						removeToolTip();
						bgPreviewLayer.append('rect')
							.classed('dateRangePreview', true)
							.attr('x', timeScale(mapServ.from(demand).utc()))
							.attr('y', topY)
							.attr('width', Math.max(10, timeScale(mapServ.to(demand).utc()) - timeScale(mapServ.from(demand).utc())))
							.attr('height', bottomY - topY)
							.attr('pointer-events', 'none'); // otherwise drop will be triggered from wrong html element!
					}
				} else {
					removeToolTip();
				}
			};

			function unRegister() {
				platformDragdropService.unregisterDragStateChanged(demandDragStart);
				$scope.unregisterDataUpdated(updateAll);
				$scope.unregisterDataUpdated(init);
				platformGridAPI.events.unregister(planningBoardDataService.getSupplierConfig().uuid, 'onScroll', onScroll);
				platformGridAPI.events.unregister(planningBoardDataService.getSupplierConfig().uuid, 'onScrollEnd', onScrollEndUpdate);
				platformGridAPI.events.unregister(planningBoardDataService.getSupplierConfig().uuid, 'onSort', onSortOrFilter);
				platformGridAPI.events.unregister(planningBoardDataService.getSupplierConfig().uuid, 'onHeaderToggled', adaptHeaders);
				platformGridAPI.events.unregister(planningBoardDataService.getSupplierConfig().uuid, 'onRowCountChanged', onSupplierGridRowCountChanged);
				platformGridAPI.events.unregister(planningBoardDataService.getSupplierConfig().uuid, 'onFilterChanged', onSupplierGridRowCountChanged);
			}

			function setup() {
				platformDragdropService.registerDragStateChanged(demandDragStart);

				setupDrawing();

				// $scope.registerDataUpdated(updateAll); // updateAll ??

				platformGridAPI.events.register(planningBoardDataService.getSupplierConfig().uuid, 'onScroll', onScroll);
				platformGridAPI.events.register(planningBoardDataService.getSupplierConfig().uuid, 'onScrollEnd', onScrollEndUpdate);
				platformGridAPI.events.register(planningBoardDataService.getSupplierConfig().uuid, 'onSort', onSortOrFilter);
				platformGridAPI.events.register(planningBoardDataService.getSupplierConfig().uuid, 'onHeaderToggled', adaptHeaders);
				// register on supplier to watch supplier AND demand grid - both handled combined!!
				platformGridAPI.events.register(planningBoardDataService.getSupplierConfig().uuid, 'onRowCountChanged', onSupplierGridRowCountChanged);
				platformGridAPI.events.register(planningBoardDataService.getSupplierConfig().uuid, 'onFilterChanged', onSupplierGridRowCountChanged);
				$scope.onContentResized(updatePlanningBoardCanvasSize);
				updatePlanningBoardCanvasSize();
			}

			function adaptHeaders() {
				$timeout(function () {
					let isColumfilterVisible = platformGridAPI.grids.getGridState(planningBoardDataService.getSupplierConfig().uuid, true).showFilterRow;
					$scope.columnSearchToolbarIcon.value = isColumfilterVisible;
					containerScope.tools.update();
					const gridElem = platformGridAPI.grids.element('id', planningBoardDataService.getSupplierConfig().uuid);
					const columnFilterInfoPanelHeight = gridElem  && gridElem.instance ? gridElem.instance.getHelperInfoRow()[0].getBoundingClientRect().height : 0;
					$scope.filterRowHeight = platformGridAPI.filters.getFilterRowProperties().height + columnFilterInfoPanelHeight;
					supplierScale.headerLineHeight(defaultHeaderlineHeight + (isColumfilterVisible ? $scope.filterRowHeight : 0));

					// reassign modified supplierScale to all consumers
					assignmentCollection.supplierScale(supplierScale);
					assignmentItems.supplierScale(supplierScale);
					assignmentCollection.supplierScale(supplierScale);
					indicatorAreaComponent.supplierScale(supplierScale);
					lanesComponent.supplierScale(supplierScale);
					aggregateItems.supplierScale(supplierScale);
					backgroundComponent.supplierScale(supplierScale);
					tagItems.supplierScale(supplierScale);

					$scope.$broadcast('showFilterPanel', _.isEqual(planningBoardDataService.activeSearchMode, 'searchBoth'), $scope.getContainerUUID());
					placeholderHeightCorrection(null, null, $scope.getContainerUUID());
					updatePlanningBoardCanvasSize();
					resize();
					update(false, true);// set this firstFlag for redrawOnly = false second flag (isHighlight) true if change the selection of grid data.
				}, 10);
			}

			function setupDrawing() {
				root = d3.select(element[0]);

				if (planningBoardDataService.getDateshiftConfig() && planningBoardDataService.getAssignmentConfig().mappingService.dateShift) {
					root.on('click', function () {
						platformDateshiftPlanningboardHelperService.resetMultishift(planningBoardDataService.getDateshiftConfig().dataService);
					});
				}


				viewPort = root.select('div.viewport');
				pBoardCanvas = root.select('div.planningboardCanvas');

				let svgDefs = viewPort.select('defs');
				if (svgDefs.empty()) {
					svgDefs = viewPort.append('defs');
				}
				svgDefs.selectAll('*').remove();

				let assignmentMapping = planningBoardDataService.getAssignmentConfig().mappingService;

				if (planningBoardDataService.assignmentTypeItems.length === 0) {
					// load async
					assignmentMapping.getTypeService().getAssignmentType().then(function (types) {
						let typeIcons = assignmentMapping.getTypeService().getAssignmentTypeIcons(types);
						cloudDesktopSvgIconService.appendIconDefs('type-icons', typeIcons, '', svgDefs);
					});
				}
				else {
					let typeIcons = assignmentMapping.getTypeService().getAssignmentTypeIcons(planningBoardDataService.assignmentTypeItems);
					cloudDesktopSvgIconService.appendIconDefs('type-icons', typeIcons, '', svgDefs);
				}

				if (planningBoardDataService.assignmentStatusItems.length === 0) {
					// load async
					assignmentMapping.getStatusService().getAssignmentStatus().then(function (status) {
						let statusIcons = assignmentMapping.getStatusService().getAssignmentStatusIcons(status);
						cloudDesktopSvgIconService.appendIconDefs('status-icons', statusIcons, '', svgDefs);
					});
				} else {
					let statusIcons = assignmentMapping.getStatusService().getAssignmentStatusIcons(planningBoardDataService.assignmentStatusItems);
					cloudDesktopSvgIconService.appendIconDefs('status-icons', statusIcons, '', svgDefs);
				}

				dragSel = root.select('svg.planningboard');
				dragSVG = dragSel.node();
				backgroundLayer = root.select('svg.planningboard g.background');
				bgPreviewLayer = root.select('svg.planningboard g.scPreview');
				hePreviewLayer = root.select('svg.planningboard g.hcPreview');
				laneLayer = root.select('svg.planningboard g.lanes');
				layers.headerContent = root.select('g.headerContent');
				layers.calendarLine = root.select('g.calendarLine');
				layers.linesAxis = root.select('g.dayLinesAxis');
				layers.assignments = root.select('g.assignments');
				layers.aggregationContainer = root.select('g.aggregation-container');
				layers.aggregationSumContainer = root.select('g.aggregation-sum-container');
				layers.assignmentTags = root.select('g.tag-container');

				layers.footerContent = root.select('g.footer-content');
				layers.footerLinesAxis = root.select('g.footer-content g.dayLinesAxis');
				layers.assignmentBaseContainer = root.select('g.assignment-preview-container');
				layers.assignmentGroups = root.select('g.assignment-group-container');
				layers.assignmentGroupTooltips = root.select('g.assignment-tooltip-container');
				layers.assignmentGroupMaxLoadLine = root.select('g.assignment-group-max-load-indicator-container');

				dragSVG.ddTarget = {};
				dragSVG.ddTarget = new platformDragdropService.DragdropTarget(platformDragdropService.dragAreas.main, _.uniqueId('assignment'));
				dragSVG.ddTarget.canDrop = function (info) {
					if (planningBoardDataService.planningBoardMode.actionType === 'setStatus'
						|| planningBoardDataService.planningBoardMode.actionType === 'grouping') {
						demandInfo = null;
						return false;
					}
					if (info.draggedData && info.draggedData) {
						if ($scope.validateAssignments && event.offsetY && info.draggedData.sourceGrid.data[0]) {
							return validateDraggingDemand(info.draggedData.sourceGrid.data[0], event.offsetY);
						} else {
							return true;
						}
					}
				};
				dragSVG.ddTarget.drop = function (info) {
					removeIndicators();
					demandDragEnd(info);
				};
				dragSel.on('mouseenter', function () {
					firstMouseEnter = true;
					platformDragdropService.mouseEnter(this.ddTarget, {});
					if (demandInfo && $scope.showDemandPreview && supplierScale.supplierIdForYpx(d3.event.offsetY + supplierScrollValue) > 0) {
						appendDemandPreview();
					}
				});
				dragSel.on('mouseleave', function () {
					firstMouseEnter = false;
					removeIndicators();
				});

				dragSel.on('mousemove', function () {
					firstMouseEnter = false;
					if (demandInfo && demandInfo.isDragging && $scope.showDemandPreview && supplierScale.supplierIdForYpx(d3.event.offsetY + supplierScrollValue) > 0) {
						moveDemandPreview();
					}
				});

				calendarDrag = d3.drag()
					.on('start', calendarDragStart)
					.on('drag', calendarDragging)
					.on('end', calendarDragEnd);

				zoom = d3.zoom().on('zoom', onMouseZoom);
				viewPort.call(calendarDrag)
					.call(zoom)
					.on('click', function () {
						if (isCalendarClicked) {
							calendarClicked();
							isCalendarClicked = false;
							if (d3.event.srcElement.classList.contains('planningboard')) {
								planningBoardDataService.assignmentDataService.setSelected(null, []);
								deselectAssignmentComponents(false);
								update();
							}
						}
					});

				assignmentFullDrag = d3.drag()
					.on('start', assigmentFullDragStart) // triggers click event too
					.on('drag', assignmentDragging)
					.on('end', assignmentDragEnd);
				assignmentStartDrag = d3.drag()
					.on('start', assignmentStartDragStart) // triggers click event too
					.on('drag', assignmentDragging)
					.on('end', assignmentDragEnd);
				assignmentEndDrag = d3.drag()
					.on('start', assignmentEndDragStart) // triggers click event too
					.on('drag', assignmentDragging)
					.on('end', assignmentDragEnd);

				timeScale = d3.scaleUtc().domain([planningBoardDataService.getDateStart(), planningBoardDataService.getDateEnd()]).range([0, panelWidth]);
				timeaxis = chart.timeaxis().scale(timeScale);/* .translations({
					weekAbbreviation: gs.translations['scheduling.main.calendar.weekAbbreviation'],
					weekNumberFormat: gs.translations['scheduling.main.calendar.weekNumberFormat']
				}); */
				planningBoardDataService.setTimeAxis(timeaxis);
				layers.headerContent.call(timeaxis); // refresh timeaxis tickvalues
				let sizeY = calculatedCurrentSizeY;

				let verticalIndexForSupplierScaleInit = $scope.verticalIndex;

				// get cached reference to supplier grid
				if (grid && grid.instance) {
					verticalIndexForSupplierScaleInit = setVisibleVerticalIndex(grid.instance, $scope);
				}

				calendarlineobject = chart.calendarlines().scale(timeScale).tickvalues(timeaxis.tickvalues()).maintickvalues(timeaxis.maintickvalues()).showVerticalLines(true).height(sizeY);
				supplierScale = pBoardComp.supplierScale()
					.lineHeight(planningBoardDataService.rowHeight())
					.headerLineHeight(defaultHeaderlineHeight)
					.verticalIndex(verticalIndexForSupplierScaleInit)
					.mapService(planningBoardDataService.getAssignmentConfig().mappingService);

				assignmentCollection = pBoardComp.assignmentCollection()
					.calendarScale(timeScale)
					.supplierScale(supplierScale)
					.mapService(planningBoardDataService.getAssignmentConfig().mappingService)
					.collectionConfig(planningBoardDataService.collectionConfig());

				assignmentItems = pBoardComp.assignmentItems()
					.calendarScale(timeScale)
					.supplierScale(supplierScale)
					.assignmentCollection(assignmentCollection)
					.dragHandler(assignmentFullDrag)
					.clickEvent(onAssignmentClick)
					.doubleClickEvent(onAssignmentDoubleClick)
					.assignmentStartDragHandler(assignmentStartDrag)
					.assignmentEndDragHandler(assignmentEndDrag)
					.showHeaderColor(planningBoardDataService.showHeaderColor())
					.showSameAssignments(planningBoardDataService.showSameAssignments())
					.showStatusIcon(planningBoardDataService.showStatusIcon())
					.showInTransportIcon(planningBoardDataService.showInTransportIcon())
					.backgroundColorConfig(planningBoardDataService.backgroundColorConfig())
					.statusIconItems(planningBoardDataService.assignmentStatusItems)
					.showTypeIcon(planningBoardDataService.showTypeIcon())
					.showMainText(planningBoardDataService.showMainText())
					.showInfo1Text(planningBoardDataService.showInfo1Text())
					.showInfo2Text(planningBoardDataService.showInfo2Text())
					.showInfo3Text(planningBoardDataService.showInfo3Text())
					.mainInfoLabel(planningBoardDataService.mainInfoLabel())
					.info1Label(planningBoardDataService.info1Label())
					.info2Label(planningBoardDataService.info2Label())
					.info3Label(planningBoardDataService.info3Label())
					.typeIconItems(planningBoardDataService.assignmentTypeItems)
					.mapService(planningBoardDataService.getAssignmentConfig().mappingService)
					.assignmentDataService(planningBoardDataService.getAssignmentConfig().dataService)
					.assignments(planningBoardDataService.assignments)
					.draggingAssignmentSupplier(false)
					.isMultiSelect(false)
					.aggregationHeight(aggregationHeight)
					.useTaggingSystem(planningBoardDataService.useTaggingSystem())
					.calendarDateStart(planningBoardDataService.getDateStart())
					.calendarDateEnd(planningBoardDataService.getDateEnd())
					.containerDimensions(getCurrentDimensions)
					.supplierScrollValue(supplierScrollValue);

				assignmentCollections = pBoardComp.assignmentCollection()
					.calendarScale(timeScale)
					.supplierScale(supplierScale)
					.mapService(planningBoardDataService.getAssignmentConfig().mappingService)
					.collectionConfig(planningBoardDataService.collectionConfig())
					.assignments([])
					.supplierScrollValue(supplierScrollValue)
					.calendarDateStart(planningBoardDataService.getDateStart())
					.calendarDateEnd(planningBoardDataService.getDateEnd());

				indicatorAreaComponent = pBoardComp.indicatorAreas()
					.supplierScale(supplierScale)
					.calendarScale(timeScale)
					.indicatorY(false)
					.startDate(false)
					.endDate(false)
					.mapService(planningBoardDataService.getSupplierConfig().mappingService);

				lanesComponent = pBoardComp.lanes()
					.supplierScale(supplierScale)
					.panelWidth(panelWidth);

				aggregateItems = pBoardComp.aggregateItems()
					.supplierScale(supplierScale)
					.clickEvent(onAggregationClick)
					.calendarScale(timeScale)
					.mapService(planningBoardDataService.getAssignmentConfig().mappingService)
					.aggregationHeight(aggregationHeight)
					.aggregationTrafficLightsConfig(planningBoardDataService.aggregationTrafficLightsConfig())
					.aggregates([]);

				aggregateSumItems = pBoardComp.aggregateSumItems()
					.calendarScale(timeScale)
					.mapService(planningBoardDataService.getAssignmentConfig().mappingService)
					.clickEvent(onAggregationClick)
					.sumAggregates([])
					.sumHeight(footerHeight)
					.textLines({
						'line1': planningBoardDataService.sumAggregationLine1(),
						'line2': planningBoardDataService.sumAggregationLine2(),
						'line3': planningBoardDataService.sumAggregationLine3()
					})
					.aggregationTrafficLightsConfig(planningBoardDataService.aggregationTrafficLightsConfig());

				tagItems = pBoardAssignmentTagComp.assignmentTags()
					.supplierScale(supplierScale)
					.calendarScale(timeScale)
					.mapService(planningBoardDataService.getAssignmentConfig().mappingService)
					.tagConfig(planningBoardDataService.tagConfig())
					.statusIconItems(planningBoardDataService.assignmentStatusItems)
					.typeIconItems(planningBoardDataService.assignmentTypeItems)
					.showSameAssignments(planningBoardDataService.showSameAssignments())
					.useFilter(false)
					.calendarDateStart(planningBoardDataService.getDateStart())
					.calendarDateEnd(planningBoardDataService.getDateEnd())
					.clickEvent((assignment) => {
						onAssignmentClick(assignment);
						layers.assignments.call(assignmentItems, 'click');
					})
					.dragHandler(assignmentFullDrag)
					.containerDimensions(getCurrentDimensions)
					.supplierScrollValue(supplierScrollValue)
					.getCurrentZoomUnit(function () {
						const tickvalues = timeaxis.tickvalues();
						const tickDiffSeconds = (tickvalues[1] - tickvalues[0]) / 1000;//'seconds';
						let zoomLevel;

						if (tickDiffSeconds < 86400) {
							zoomLevel = 'hour';
						} else if (tickDiffSeconds >= 86400 && tickDiffSeconds < 604800) {
							zoomLevel = 'day';
						} else if (tickDiffSeconds >= 604800 < tickDiffSeconds < 2592000) {
							zoomLevel = 'week';
						} else if (tickDiffSeconds >= 2592000 < tickDiffSeconds < 31536000) {
							zoomLevel = 'month';
						} else if (tickDiffSeconds >= 31536000) {
							zoomLevel = 'year';
						}

						return zoomLevel;
					});

				backgroundComponent = pBoardComp.backgrounds()
					.supplierScale(supplierScale)
					.bgExceptionDayClickHandler(bgExceptionDayClickHandler)
					.timeScale(timeScale)
					.containerDimensions(getCurrentDimensions)
					.supplierScrollValue(supplierScrollValue);

				assignmentGroups = planningBoardBaseComponent.baseAssignment()
					.supplierScale(supplierScale)
					.calendarScale(timeScale)
					.mapService(planningBoardDataService.getAssignmentConfig().mappingService)
					.timeScale(timeScale)
					.supplierScrollValue(supplierScrollValue)
					.onHover(function (d) {
						assignmentGroupTooltips.assignments(d.reservations);
						assignmentGroupTooltips.supplierScrollValue(supplierScrollValue);
						if (d3 && d3.event && d3.event.offsetX) {
							assignmentGroupTooltips.positionX(d3.event.offsetX + 10);
						}
						layers.assignmentGroupTooltips.call(assignmentGroupTooltips);
						layers.assignmentGroupTooltips.transition()
							.duration(100)
							.style('opacity', 0.9);
					})
					.onMouseOut(function (d) {
						layers.assignmentGroupTooltips.transition()
							.duration(100)
							.style('opacity', 0);
						const tooltipDiv = layers.assignmentGroupTooltips.selectAll('rect');
						const tooltipDiv2 = layers.assignmentGroupTooltips.selectAll('text');
						tooltipDiv.remove();
						tooltipDiv2.remove();
					});

				demandDragView = planningBoardBaseComponent.baseAssignment()
					.supplierScale(supplierScale)
					.calendarScale(timeScale)
					.mapService(planningBoardDataService.getDemandConfig() && planningBoardDataService.getDemandConfig().mappingService)
					.timeScale(timeScale)
					.supplierScrollValue(supplierScrollValue)
					.deactivatePointerEvents(true);

				assignmentGroupTooltips = planningBoardTooltipComponent.tooltip()
					.supplierScale(supplierScale)
					.calendarScale(timeScale)
					.mapService(planningBoardDataService.getAssignmentConfig().mappingService)
					.supplierScrollValue(supplierScrollValue);

				assignmentMaxLoadLines = planningBoardLineComponent.line()
					.supplierScale(supplierScale)
					.calendarScale(timeScale)
					.mapService(planningBoardDataService.getAssignmentConfig().mappingService)
					.timeScale(timeScale);

				addEventListenerToHeader();
				updateTimeScaleTicks();

				resize();
				setupTools();

				/**********************
				 *** CALENDAR EVENTS ***
				 **********************/

				let startCalDragX = 0,
					startCalDragY = 0,
					startCalDragDateStart, startCalDragDateEnd;

				function calendarDragStart() {
					if (planningBoardDataService.isCalendarLocked()) {
						return false;
					}

					isCalendarClicked = true;
					bgExceptionDayClickHandler();
					d3.event.sourceEvent.stopPropagation();
					d3.event.sourceEvent.preventDefault();
					startCalDragX = d3.event.x;
					startCalDragY = d3.event.y;
					startCalDragDateStart = moment(planningBoardDataService.getDateStart());
					startCalDragDateEnd = moment(planningBoardDataService.getDateEnd());

					if (planningBoardDataService.planningBoardMode && planningBoardDataService.planningBoardMode.actionType === 'createAssignment') {
						let supplierId = supplierScale.supplierIdForYpx(d3.event.sourceEvent.offsetY + supplierScrollValue);
						let supplierIdx = supplierScale.verticalIndex().get(supplierId);

						let indicatorY = supplierScale.headerLineHeight() + supplierIdx * supplierScale.lineHeight();
						indicatorAreas = layers.assignments.selectAll('.indicator-area').data([{
							'Scale': 10
						}]);
						indicatorAreaComponent.indicatorY(indicatorY);
					}
				}

				function calendarDragging() {
					if (planningBoardDataService.isCalendarLocked()) {
						return false;
					}

					if (d3.event.dx !== 0 || d3.event.dy !== 0) {
						isCalendarClicked = false;
						isCalendarDragging = true;
						let currentX = d3.event.x;
						let stepX = timeScale(moment(planningBoardDataService.getDateStart()).add($scope.getTimeScaleHoursX(), 'hour').utc());
						let offsetX = startCalDragX - currentX;
						let stepCountX = parseInt(offsetX / stepX);
						let newStart = moment(startCalDragDateStart);
						let newEnd = moment(startCalDragDateEnd);
						newStart = newStart.add(stepCountX * $scope.getTimeScaleHoursX(), 'hour');
						newEnd = newEnd.add(stepCountX * $scope.getTimeScaleHoursX(), 'hour');

						if (planningBoardDataService.planningBoardMode && planningBoardDataService.planningBoardMode.actionType === 'createAssignment') {
							removeIndicators();
							// create assignment
							newStart = moment(startCalDragDateStart);
							newStart = newStart.add(parseInt(startCalDragX / stepX) * $scope.getTimeScaleHoursX(), 'hour');
							newEnd = moment(startCalDragDateStart);
							newEnd = newEnd.add(parseInt(currentX / stepX) * $scope.getTimeScaleHoursX(), 'hour');
							indicatorAreaComponent.startDate(newStart);
							indicatorAreaComponent.endDate(newEnd);
							indicatorAreas.call(indicatorAreaComponent);
						} else {
							$scope.getDateStart(newStart);
							planningBoardDataService.getDateEnd(newEnd);
							timeScale.domain([newStart, newEnd]).range([0, panelWidth]);
							timeaxis.scale(timeScale);
							pBoardComp.assignmentItems().calendarScale(timeScale);
							pBoardComp.backgrounds().startDate(newStart);
							// update() on calendar step changed
							if (stepCountX !== lastAmountOfStepsX) {
								lastAmountOfStepsX = stepCountX;
								update();
							}
							clearTimeout(CalDragTimeOut);
							CalDragTimeOut = setTimeout($scope.loadRest, 500);
						}
					}
				}

				function calendarDragEnd() {
					if (planningBoardDataService.isCalendarLocked()) {
						return false;
					}

					removeIndicators();
					if (!isCalendarClicked && (planningBoardDataService.planningBoardMode && planningBoardDataService.planningBoardMode.actionType === 'createAssignment')) {
						let currentX = d3.event.x;
						let stepX = timeScale(moment(planningBoardDataService.getDateStart()).add($scope.getTimeScaleHoursX(), 'hour').utc());
						// let offsetX = startCalDragX - currentX;
						// let stepCountX = parseInt(offsetX / stepX);
						let newStart = moment(startCalDragDateStart);
						newStart = newStart.add(parseInt(startCalDragX / stepX) * $scope.getTimeScaleHoursX(), 'hour');
						let newEnd = moment(startCalDragDateStart);
						newEnd = newEnd.add(parseInt(currentX / stepX) * $scope.getTimeScaleHoursX(), 'hour');

						let sDemand = _getSelectedDemand();
						if(sDemand){

							let creationData = {
								info: null,
								demand: sDemand,
								offsetY: startCalDragY,
								from: newStart,
								to: newEnd,
								offsetX: startCalDragX
							};
							let assignmentMappingService = planningBoardDataService.getAssignmentConfig().mappingService;

							if (_.isFunction(assignmentMappingService.intersectSequence) && _.isFunction(assignmentMappingService.showIntersectSequenceDialog)) {

								let dataForDialog = {
									creationData: creationData,
									planningBoardDate: moment(timeScale.invert(creationData.offsetX)).utc(),
									sequenceData: planningBoardDataService.getDateshiftConfig().dateShiftHelperService.getSequenceData(planningBoardDataService.getDateshiftConfig().dataService.getServiceName()),
									supplierOffsetY: creationData.offsetY,
									supplierId: supplierScale.supplierIdForYpx(creationData.offsetY + supplierScrollValue),
									items: planningBoardDataService.assignments,
									createAssignment: _createAssignment,
									calendarData: planningBoardDataService.getDateshiftConfig().dateShiftHelperService.getCalendarData(planningBoardDataService.getDateshiftConfig().dataService.getServiceName())

								};
								assignmentMappingService.showIntersectSequenceDialog(dataForDialog);

							} else {
								_createAssignment(creationData);
							}
						}
					}

					lastAmountOfStepsX = 0;
					isCalendarDragging = false;
				}

				function calendarClicked() {
					if (planningBoardDataService.planningBoardMode && planningBoardDataService.planningBoardMode.actionType === 'createAssignment') {
						let currentX = d3.event.x;
						let stepX = timeScale(moment(planningBoardDataService.getDateStart()).add($scope.getTimeScaleHoursX(), 'hour').utc());
						let offsetX = startCalDragX - currentX;
						let stepCountX = parseInt(offsetX / stepX);
						let newStart = moment(startCalDragDateStart);
						newStart = newStart.add(stepCountX * $scope.getTimeScaleHoursX(), 'hour');

						let sDemand = _getSelectedDemand();
						if(sDemand){
							let creationData = {
								info: d3,
								demand: sDemand,
								offsetY: null,
								from: null,
								to: null
							};
							let assignmentMappingService = planningBoardDataService.getAssignmentConfig().mappingService;

							if (_.isFunction(assignmentMappingService.intersectSequence) && _.isFunction(assignmentMappingService.showIntersectSequenceDialog)) {

								let dataForDialog = {
									creationData: creationData,
									planningBoardDate: moment(timeScale.invert(creationData.info.event.offsetX)).utc(),
									sequenceData: planningBoardDataService.getDateshiftConfig().dateShiftHelperService.getSequenceData(planningBoardDataService.getDateshiftConfig().dataService.getServiceName()),
									supplierOffsetY: creationData.info.event.offsetY,
									supplierId: supplierScale.supplierIdForYpx(creationData.info.event.offsetY + supplierScrollValue),
									items: planningBoardDataService.assignments,
									createAssignment: _createAssignment,
									calendarData: planningBoardDataService.getDateshiftConfig().dateShiftHelperService.getCalendarData(planningBoardDataService.getDateshiftConfig().dataService.getServiceName())

								};
								assignmentMappingService.showIntersectSequenceDialog(dataForDialog);

							} else {
								_createAssignment(creationData);
							}
						}
					}
				}

				//
				// **** ZOOM EVENTS ****
				//

				let zoomTimeOut = 0;
				let currentZoomLevelTimeOut = 0;

				function onMouseZoom() {
					if (planningBoardDataService.isCalendarLocked()) {
						return false;
					}

					if (d3.event.sourceEvent) {
						removeToolTip();
						let d3ZoomVal = 0;
						// smooth down spinning mousewheel
						d3ZoomVal = d3.event.transform.y;
						if (Math.abs(d3ZoomVal) < 150) {
							let prop = d3.event.sourceEvent.offsetX / panelWidth;
							let zoomStep = (d3ZoomVal > 0 ? 4 : -6) * $scope.getTimeScaleHoursX();
							let type = 'hour';
							let newStart = moment(planningBoardDataService.getDateStart()).subtract(zoomStep * prop, type);
							let newEnd = moment(planningBoardDataService.getDateEnd()).add(zoomStep * (1 - prop), type);
							if (newEnd.diff(newStart, 'days') >= 1) {
								if ($scope.snapToDays && newEnd.diff(newStart, 'days') >= 14) {
									type = 'day';
									newStart = newStart.startOf(type);
									newEnd = newEnd.startOf(type).add(1, type);
								}
								$scope.getDateStart(newStart);
								planningBoardDataService.getDateEnd(newEnd);
								// reload data but kill previous to reload only once!!
								clearTimeout(zoomTimeOut);
								// zoomTimeOut = setTimeout($scope.loadRest, 500);
								if (d3ZoomVal > 0) {
									zoomTimeOut = setTimeout($scope.loadRest, 500);
								}
								timeScale.domain([newStart, newEnd]).range([0, panelWidth]);
								timeaxis.scale(timeScale);
								pBoardComp.assignmentItems().calendarScale(timeScale);
								pBoardComp.backgrounds().startDate(newStart);
								update();
							}
							planningBoardDataService.setCurrentZoomLevel(newStart, newEnd);
							// save new zoom level on scroll if saveLastZoom in planning board settings dialog is activated
							if (!_.isUndefined($scope.saveLastZoom) && $scope.saveLastZoom) {
								clearTimeout(currentZoomLevelTimeOut);
								currentZoomLevelTimeOut = setTimeout(planningBoardDataService.saveCurrentZoomLevel, 500);
							}
						}
						d3.event.transform.y = 0;
					}
				}

				//
				// **** ASSIGNMENT EVENTS ***
				//

				let editMode = 'fullAssignment';

				function assigmentFullDragStart(assignment) {
					editMode = 'fullAssignment';
					assignmentDragStartAll(assignment);
				}

				function assignmentStartDragStart(assignment) {
					editMode = 'assignmentStart';
					assignmentDragStartAll(assignment);
				}

				function assignmentEndDragStart(assignment) {
					editMode = 'assignmentEnd';
					assignmentDragStartAll(assignment);
				}

				let accessRightMsgShown = false;

				function assignmentDragStartAll(assignment) {
					let mapServ = planningBoardDataService.getAssignmentConfig().mappingService;
					if (_.isFunction(mapServ.isReadOnly) && mapServ.isReadOnly(assignment)) {
						return false;
					}
					if (_.isFunction(mapServ.getWriteAccessRight) && !mapServ.getWriteAccessRight(planningBoardDataService)) {
						accessRightMsgShown = false;
					}

					oldXMoment = _.noop();
					adjustCircleObj.movedUnits = 0;
					if (!_.isUndefined(assignment)) {
						dragStartBarValues = {
							barStart: moment(mapServ.from(assignment)),
							barEnd: moment(mapServ.to(assignment))
						};
					}

					d3.event.sourceEvent.stopPropagation();
					d3.event.sourceEvent.preventDefault();

					assignmentDragStartX = d3.event.x;
					assignmentDragStartY = d3.event.y;

					selectedAssignments.length = 0;
					selectedAssignments.push(_.clone(assignment));
					$scope.assignments.forEach(function f(assignment) {
						if (assignment.selectedFlag && !assignment.activeFlag) {
							selectedAssignments.push(_.clone(assignment));
						}
					});

					assignment.isDragging = true;
				}

				function assignmentDragging(assignment) {
					let clonedAssignment = _.cloneDeep(assignment);
					let mapServ = planningBoardDataService.getAssignmentConfig().mappingService;
					let isMultiSelect = (d3.event.sourceEvent && d3.event.sourceEvent.ctrlKey);

					if (planningBoardDataService.planningBoardMode && planningBoardDataService.planningBoardMode.events && !planningBoardDataService.planningBoardMode.events.drag) {
						return false;
					}

					if (_.isFunction(mapServ.isReadOnly) && selectedAssignments.some(selAssignment => mapServ.isReadOnly(selAssignment))) {
						return false;
					}

					if (_.isFunction(mapServ.isDraggable) && (!mapServ.isDraggable(assignment, selectedAssignments, planningBoardDataService.getDateshiftConfig()))) {
						return false;
					}

					if (!_.isUndefined(popupInstance)) {
						popupInstance.close();
					}


					if (_.isFunction(mapServ.canDragHorizontally) && !mapServ.canDragHorizontally()) {
						d3.event.x = 0;
					}

					if (_.isFunction(mapServ.getWriteAccessRight) && !mapServ.getWriteAccessRight(planningBoardDataService)) {
						if (!accessRightMsgShown) {
							accessRightMsgShown = true;
							let message = 'Your application/object role does not have write permission';//TODO: DEV-32181 - Default Dialog feature will be implemented by future then we will use that.$translate.instant('platform.planningboard.pbNotHaveWriteAcessrightErrMsg');
							showToastMessage(message);

						}
						return false;
					}


					let draggedAssignment = selectedAssignments.find(selectedAssignment => mapServ.id(selectedAssignment) === mapServ.id(assignment));

					// y axis drag
					let currentY = d3.event.y;
					let originalYtop = supplierScale(draggedAssignment, 'top');
					let newY = originalYtop;

					let assignmentSupplierHasChanged = supplierScale(draggedAssignment, 'top') > currentY && supplierScale(draggedAssignment, 'bottom') > currentY
						|| supplierScale(draggedAssignment, 'top') < currentY && supplierScale(draggedAssignment, 'bottom') < currentY;

					if (_.isFunction(mapServ.canDragVertically) && !mapServ.canDragVertically(assignment, selectedAssignments, planningBoardDataService.getDateshiftConfig())) {
						assignmentDragStartY = 0;
					} else {
						if (assignmentSupplierHasChanged) { // dragged to other supplier
							newY = currentY;
						}
					}


					let resId = supplierScale.supplierIdForYpx(newY);

					assignmentItems.isMultiSelect(isMultiSelect);

					if (!isMultiSelect) {
						singleAssignmentDragging(assignment, mapServ, resId, assignmentSupplierHasChanged);
					} else {
						if (!assignment.selectedFlag) {
							assignment.activeFlag = true;
							assignment.selectedFlag = true;
							$scope.addToSelectedAssignment(assignment);
						}
						multipleAssignmentDragging(assignment, mapServ, resId, assignmentSupplierHasChanged);
					}

					let assignmentMomentHasChanged = (!mapServ.from(clonedAssignment).isSame(mapServ.from(draggedAssignment)) || !mapServ.to(clonedAssignment).isSame(mapServ.to(draggedAssignment)));

					// only draw if assignment position has changed or supplier has changed
					if (assignmentMomentHasChanged || assignmentSupplierHasChanged) {
						mapServ.from(draggedAssignment, mapServ.from(clonedAssignment));
						mapServ.to(draggedAssignment, mapServ.to(clonedAssignment));
						assignmentItems.draggingAssignmentSupplier(mapServ.supplier(draggedAssignment));
						assignmentItems.draggingAssignment(draggedAssignment);
						updateData();
						updateAggregations();
						$scope.updateAssignment(draggedAssignment);
						draw('drag');
						updateDayLinesPosition();
					}
				}

				function multipleAssignmentDragging(assignment, mapServ, resourceIdOfDragged, assignmentSupplierHasChanged) {
					let from = mapServ.from(assignment),
						to = mapServ.to(assignment);
					// clean seconds due to unexact pixel scale
					from.seconds = 0;
					to.seconds = 0;

					let validationResultDragging = { isValid: true };
					let selectedAssignmentIds = selectedAssignments.map(selectedAssignment => mapServ.id(selectedAssignment));

					if (d3.event.dx !== 0 && _.isFunction(mapServ.canMultiShiftAssignment) && mapServ.canMultiShiftAssignment(selectedAssignments)) {
						if (!planningBoardDataService.getDateshiftConfig()) {

							moveAssigmentInXAxis(assignment, d3, $scope.activeMoveMode);

							let minsDiffFrom = from.diff(mapServ.from(selectedAssignments[0]), 'minutes');
							let minsDiffTo = to.diff(mapServ.to(selectedAssignments[0]), 'minutes');
							Array.from(planningBoardDataService.assignments.values())
								.filter(assignmentElement => assignmentElement.selectedFlag && !assignmentElement.activeFlag && selectedAssignmentIds.includes(mapServ.id(assignmentElement)))
								.forEach(assignmentElement => {
									selectedAssignments.forEach((selectedAssignment, idx) => {
										if (idx !== 0 && mapServ.id(selectedAssignment) === mapServ.id(assignmentElement)) {
											let newTo = moment(mapServ.to(selectedAssignment)).add(minsDiffTo, 'minutes');
											mapServ.to(assignmentElement, newTo);
											let newFrom = moment(mapServ.from(selectedAssignment)).add(minsDiffFrom, 'minutes');
											mapServ.from(assignmentElement, newFrom);
										}
									});
								});
						} else {
							moveAssigmentInXAxis(assignment, d3, $scope.activeMoveMode);
						}
					}

					if (assignmentSupplierHasChanged && assignmentDragStartY > 0 && _.isFunction(mapServ.canMultiShiftAssignment) && mapServ.canMultiShiftAssignment(selectedAssignments)) {
						selectedAssignments.forEach(selectedAssignment => {
							if (_.find(planningBoardDataService.demands, { Id: mapServ.demand(selectedAssignment) })) {
								validationResultDragging = platformPlanningBoardValidationService.validateEntityAgainstSupplier(
									_.find(planningBoardDataService.demands, { Id: mapServ.demand(selectedAssignment) }),
									'demand',
									resourceIdOfDragged
								);
							}
							if (resourceIdOfDragged > 0 && validationResultDragging.isValid) {
								mapServ.supplier(planningBoardDataService.assignments.get(selectedAssignment.Id), resourceIdOfDragged);
								mapServ.supplier(selectedAssignment, resourceIdOfDragged);
							}
						});
					}

					if (assignmentSupplierHasChanged && _.isFunction(mapServ.onSupplierChanged)) {
						selectedAssignments.forEach(selectedAssignment => mapServ.onSupplierChanged(planningBoardDataService.assignments.get(selectedAssignment.Id), planningBoardDataService));
					}
				}

				function singleAssignmentDragging(assignment, mapServ, resourceIdOfDragged, assignmentSupplierHasChanged) {
					if (_.isFunction(mapServ.isReadOnly) && mapServ.isReadOnly(assignment)) {
						return false;
					}
					// draw indicator areas
					if (editMode === 'fullAssignment' && _.find($scope.demands, { Id: mapServ.demand(assignment) })) {
						drawIndicatorArea(_.find($scope.demands, { Id: mapServ.demand(assignment) }), d3.event);
					}

					moveAssigmentInXAxis(assignment, d3, $scope.activeMoveMode);

					let validationResultDragging = { isValid: true };

					if (_.find(planningBoardDataService.demands, { Id: mapServ.demand(assignment) })) {
						validationResultDragging = platformPlanningBoardValidationService.validateEntityAgainstSupplier(
							_.find(planningBoardDataService.demands, { Id: mapServ.demand(assignment) }),
							'demand',
							resourceIdOfDragged
						);
					}
					if (resourceIdOfDragged > 0 && validationResultDragging.isValid) {
						mapServ.supplier(assignment, resourceIdOfDragged);
					}

					if (assignmentSupplierHasChanged && _.isFunction(mapServ.onSupplierChanged)) {
						mapServ.onSupplierChanged(assignment, planningBoardDataService);
					}
				}

				function validateMovedXPosition(assignmentToMove, d3, editMode, activeMoveMode) {
					let movedX = d3.event.x;
					let rangeStart = timeScale.range()[0];
					let rangeEnd = timeScale.range()[1];
					let mapServ = planningBoardDataService.getAssignmentConfig().mappingService;
					let rangeMid = 0;

					movedX = movedX < rangeStart + radius ? rangeStart + radius : movedX; // x-limits
					movedX = movedX > rangeEnd - radius ? rangeEnd - radius : movedX;


					if (editMode === 'assignmentStart' && movedX < timeScale.range([rangeStart, rangeEnd])(mapServ.from(assignmentToMove)) // mouse cursor before start of assignment
						|| editMode === 'assignmentEnd' && movedX > timeScale.range([rangeStart, rangeEnd])(mapServ.from(assignmentToMove))) { // mouse cursor after end of assignment

						let newPlannedStart = moment(mapServ.from(assignmentToMove)).subtract(1, activeMoveMode); // find start of the date one unit before
						rangeMid = (timeScale.rangeRound([rangeStart, rangeEnd])(mapServ.from(assignmentToMove)) - timeScale.rangeRound([rangeStart, rangeEnd])(newPlannedStart)) / 2; // find half of one range
					}

					return movedX + rangeMid; // rangeMid > 0 ? move "mouse cursor" by half of the step to the right : return current mouse position

				}

				function moveAssigmentInXAxis(assignmentToMove, d3, activeMoveMode) {
					// x axsis drag
					if (d3.event.dx !== 0) {
						// only move if x is greater than 0
						// only move if x is greater than 0
						let type = 'mid';
						switch (editMode) {
							case 'fullAssignment':
								type = 'mid';
								break;
							case 'assignmentStart':
								type = 'min';
								break;
							case 'assignmentEnd':
								type = 'max';
								break;
						}
						let movedX = validateMovedXPosition(assignmentToMove, d3, editMode, activeMoveMode);
						adjustCircleObj.move(assignmentToMove, movedX, type, activeMoveMode);
					}

					return assignmentToMove;
				}

				function onAssignmentClick(assignmentItem) {
					if (_.isUndefined(planningBoardDataService.planningBoardMode)) {
						planningBoardDataService.planningBoardMode = {
							'actionType': 'setDefault'
						};
					}

					let toStatusId = 0;

					switch (planningBoardDataService.planningBoardMode.actionType) {

						case 'setStatus':
							setAssignmentStatusChanged(assignmentItem, false);
							break;
						case 'createAssignment':
							calendarClicked();
							break;
						default:
							// refresh toolbar only works for grids
							// we have to start new digest cycle manually
							$scope.$apply();
							defaultAssignmentClick(assignmentItem);
							break;
					}
				}

				function defaultAssignmentClick(assignmentItem) {
					planningBoardDataService.loadVirtualForSelected(assignmentItem);
					let isMultiSelect = (d3.event && d3.event.ctrlKey);
					assignmentItems.isMultiSelect(isMultiSelect);

					if (planningBoardDataService.useTaggingSystem() && !isMultiSelect) {
						openAssignmentPopup(assignmentItem);
					}

					deselectAssignmentComponents(isMultiSelect);

					let mapServ = planningBoardDataService.getAssignmentConfig().mappingService;
					let isAlreadySelected = assignmentItem && assignmentItem.selectedFlag;


					$scope.status = '';
					if (assignmentItem) {
						if (isAlreadySelected && isMultiSelect) {
							assignmentItem.activeFlag = false;
							assignmentItem.selectedFlag = false;
						}
						else {
							assignmentItem.activeFlag = true;
							assignmentItem.selectedFlag = true;
						}
						$scope.assignments.forEach(function f(assignment) {
							// reset same projects flag
							assignment.areRelated = mapServ.areRelated(assignmentItem, assignment);
						});
						$scope.status = mapServ.statusPanelText(assignmentItem);
					}

					if (isMultiSelect) {
						$scope.addToSelectedAssignment(assignmentItem);
					} else {
						$scope.setSelectedAssignment(assignmentItem);
					}
				}

				function getFormConfigForShowingAssignment(assignmentItem) {
					const mapServ = planningBoardDataService.getAssignmentConfig().mappingService;
					if (_.isFunction(mapServ.getAssignmentModalFormConfig)) {
						return mapServ.getAssignmentModalFormConfig(assignmentItem);
					}

					const defaultConfig = {
						fid: 'example',
						version: '1.0.0',
						showGrouping: true,
						groups: [{
							gid: 'default',
							header: 'Details',
							isOpen: true
						}],
						rows: []
					};

					if (assignmentItem.Description) {
						defaultConfig.rows.push({
							gid: 'default',
							rid: 'description',
							label: '*Description',
							type: 'description',
							model: 'Description'
						});
					}

					if (assignmentItem.Comment) {
						defaultConfig.rows.push({
							gid: 'default',
							rid: 'comment',
							label: '*Comment',
							type: 'comment',
							model: 'Comment',
							domain: 'comment'
						});
					}

					if (assignmentItem.Code) {
						defaultConfig.rows.push({
							gid: 'default',
							rid: 'code',
							label: '*Code',
							type: 'description',
							model: 'Code',
							domain: 'description'
						});
					}

					return defaultConfig;
				}

				function updateAssignmentProperties(assignmentToUpdate, changedObject) {
					const properties = Object.getOwnPropertyNames(assignmentToUpdate);
					properties.forEach(prop => {
						assignmentToUpdate[prop] = changedObject[prop];
					});

					$scope.updateAssignment(assignmentToUpdate);
				}

				function updateAssignmentPropertiesOfDialog(assignmentItem, result) {
					if (!_.isEmpty(result)) {
						let mapServ = planningBoardDataService.getAssignmentConfig().mappingService;
						let assignmentToUpdate = $scope.assignments.get(result.Id);
						let circle = 'mid';
						if (!(mapServ.from(assignmentToUpdate)).isSame(mapServ.from(result))) {
							circle = 'min';
						} else if (!(mapServ.to(assignmentToUpdate)).isSame(mapServ.to(result))) {
							circle = 'max';
						}

						updateAssignmentProperties(assignmentItem, result);
						updateAssignmentProperties(assignmentToUpdate, assignmentItem);
						updateAssignmentProperties(assignmentToUpdate, assignmentItem);

						if (_.isFunction(planningBoardDataService.getAssignmentConfig().mappingService.dateShift) && planningBoardDataService.getDateshiftConfig() !== null) {
							planningBoardDataService.getAssignmentConfig().mappingService.dateShift({
								startMoment: mapServ.from(assignmentToUpdate),
								endMoment: mapServ.to(assignmentToUpdate),
								el: assignmentToUpdate,
								type: circle,
								dateShiftConfig: planningBoardDataService.getDateshiftConfig(),
								dataService: planningBoardDataService
							});
						}

						if (_.isFunction(planningBoardDataService.getAssignmentConfig().mappingService.assignmentChanged) && planningBoardDataService.getDateshiftConfig() !== null) {
							planningBoardDataService.getAssignmentConfig().mappingService.assignmentChanged({
								el: assignmentToUpdate,
								dateShiftConfig: planningBoardDataService.getDateshiftConfig(),
								dataService: planningBoardDataService
							});
						}
						Object.assign(result, assignmentToUpdate);
						deselectAssignmentComponents(false);
						planningBoardDataService.assignmentDataService.setSelected(result);
						// reset dateshift data on assignment selection change
						if (!_.isNil(planningBoardDataService.getDateshiftConfig()) && !assignmentItem.selectedFlag) {
							planningBoardDataService.getDateshiftConfig().dateShiftHelperService.resetDateshift();
						}

						update();
					}
				}

				function onAssignmentDoubleClick(assignmentItem) {
					let mapServ = planningBoardDataService.getAssignmentConfig().mappingService;
					planningBoardDataService.loadVirtualForSelected(assignmentItem);
					let originalAssignmentState = _.cloneDeep(assignmentItem);
					isDoubleClick = true;
					if (!_.isUndefined(popupInstance)) {
						popupInstance.close();
					}
					if (assignmentItem) {
						let dialogOptions = {
							dialogTitle: 'platform.planningboard.editAssignment',
							title: 'Edit Assignment',
							items: [],
							resizeable: true
						};

						if (planningBoardDataService.getAssignmentConfig().uiStandardService && planningBoardDataService.getAssignmentConfig().dataServiceForDetail) {
							createOptionsForCustomDetailDialog(dialogOptions, assignmentItem);
						} else {
							dialogOptions.items.push(
								{
									Name: $translate.instant('platform.planningboard.assignment'),
									form: getFormConfigForShowingAssignment(assignmentItem),
								});
							dialogOptions.items.find(item => item.Name === $translate.instant('platform.planningboard.assignment')).form.rows.forEach(row => {
								row.change = function (entity) {
									updateAssignmentPropertiesOfDialog(assignmentItem, entity);
								};
							});
						}
						if (_.isFunction(planningBoardDataService.getAssignmentConfig().mappingService.getCustomSettings)) {
							const customSettings = planningBoardDataService.getAssignmentConfig().mappingService.getCustomSettings();
							if (customSettings) {
								dialogOptions.items = dialogOptions.items.concat(customSettings);
							}
						}

						Object.assign(dialogOptions.items[0], assignmentItem);

						if (_.isFunction(mapServ.getWriteAccessRight) && !mapServ.getWriteAccessRight(planningBoardDataService)) {
							setReadOnlyEditAssignmentDialog(dialogOptions)
						}
						platformMasterDetailDialogService.showDialog(dialogOptions)
							.then()
							.catch((result) => {
								if (result === 'cancel' && !planningBoardDataService.getDateshiftConfig()) {
									updateAssignmentPropertiesOfDialog(assignmentItem, originalAssignmentState);
								}

							}).finally(() => {
								isDoubleClick = false;
							});
					}
				}

				function createOptionsForCustomDetailDialog(dialogOptions, assignmentItem) {
					dialogOptions.items.push({
						Name: $translate.instant('platform.planningboard.assignment'),
						form: {
							fid: 'assignmentDetail',
							version: '1.0.0',
							showGrouping: false,
							groups: [
								{
									gid: 'assignmentDetail',
									header: 'Assignment Detail',
									isOpen: true,
									visible: true,
									sortOrder: 1
								}
							],
							rows: [

								{
									gid: 'assignmentDetail',
									rid: 'assignmentDetailRow',
									visible: true,
									sortOrder: 1,
									readonly: false,
									type: 'directive',
									directive: 'platform-planning-board-edit-assignment-dialog-directive',
									options: {
										uiStandardService: planningBoardDataService.getAssignmentConfig().uiStandardService,
										dataServiceForDetail: planningBoardDataService.getAssignmentConfig().dataServiceForDetail,
										dataService: planningBoardDataService
									}
								}
							]
						}
					});

					const detailView = planningBoardDataService.getAssignmentConfig().uiStandardService.getStandardConfigForDetailView();
					const detailDataService = planningBoardDataService.getAssignmentConfig().dataServiceForDetail;

					detailView.rows.forEach(row => {
						row.change = function (entity, field) {
							if (detailDataService.handleFieldChanged) {
								detailDataService.handleFieldChanged(entity, field);
							}
							updateAssignmentPropertiesOfDialog(assignmentItem, entity);
						};
					});
				}

				function setReadOnlyEditAssignmentDialog(dialogOptions){

					const assignmentConfig = planningBoardDataService.getAssignmentConfig();
					const detailView = assignmentConfig.uiStandardService?.getStandardConfigForDetailView();

					let rows = detailView ? detailView.rows : dialogOptions.items[0].form?.rows;
					if (rows) {
						rows.forEach(row => row.readonly = true);
					}

				}

				function assignmentDragEnd(assignment) {
					let mapServ = planningBoardDataService.getAssignmentConfig().mappingService;
					let d3Clone = _.cloneDeep(d3);
					let isMultiSelect = (d3.event.sourceEvent && d3.event.sourceEvent.ctrlKey);
					let assignmentChanged = !!assignment.pBoardModified;

					if (isMultiSelect) {
						selectedAssignments[0].selectedFlag = assignment.selectedFlag;
					}

					if (planningBoardDataService.getDateshiftConfig() && assignmentChanged) {
						// needs to update the sequence data
						if (planningBoardDataService.getDateshiftConfig().dataService.hasOwnProperty('isDateshiftDeactivated') && !planningBoardDataService.getDateshiftConfig().dataService.isDateshiftDeactivated) {
							planningBoardDataService.getDateshiftConfig().dateShiftHelperService.updateSequenceData(planningBoardDataService.getDateshiftConfig().dataService.getServiceName());
						}
					}

					if (_.isFunction(mapServ.isReadOnly) && mapServ.isReadOnly(assignment)) {
						return false;
					}

					if (_.isFunction(mapServ.onDrop) && assignmentChanged) {
						// only call onDrop after real drag and drop happened
						mapServ.onDrop(assignment, isMultiSelect ? selectedAssignments : [], planningBoardDataService).then((result) => {
							if (planningBoardDataService.getDateshiftConfig() && assignmentChanged) {
								// needs to update the sequence data
								planningBoardDataService.getDateshiftConfig().dateShiftHelperService.updateSequenceData(planningBoardDataService.getDateshiftConfig().dataService.getServiceName());
							}
							postAssignmentDragEnd(assignment, d3Clone);
						});

					} else {
						// will be called also on click only
						postAssignmentDragEnd(assignment, d3Clone);
					}
				}

				function postAssignmentDragEnd(assignment, d3) {
					let assignmentFromSelected = selectedAssignments.find(sA => sA.Id === assignment.Id);
					let mapServ = planningBoardDataService.getAssignmentConfig().mappingService;
					assignment.isDragging = assignmentFromSelected.isDragging = false;
					assignmentItems.draggingAssignmentSupplier(false);

					const onlyClicked = mapServ.from(selectedAssignments[0]).isSame(mapServ.from(assignment)) && mapServ.to(selectedAssignments[0]).isSame(mapServ.to(assignment)) && mapServ.supplier(selectedAssignments[0]) === mapServ.supplier(assignment);

					if (assignmentDragStartX === d3.event.x && assignmentDragStartY === d3.event.y) {
						layers.assignments.selectAll('g.assignment-item').classed('ourActiveClass', false);
					} else {
						if (!onlyClicked) {
							$scope.updateAssignment(assignmentFromSelected);

							$scope.assignments.forEach(function f(assignment) {
								if (assignment.selectedFlag && !assignment.activeFlag) {
									$scope.updateAssignment(assignmentFromSelected);
								}
							});
							//layers.assignments.call(assignmentItems, 'click'); // maybe remove this part -> will be handled in update
						}
						conflictAssignments = [];
					}
					if (!onlyClicked) {
						editMode = 'fullAssignment';
						tagItems.useFilter(false);
						resetIndicatorArea();
						update();
					} else {
						layers.assignments.call(assignmentItems);
					}
				}

				function demandDragEnd(info) {
					layers.assignmentBaseContainer.selectAll('*').remove();
					let assignmentMappingService = planningBoardDataService.getAssignmentConfig().mappingService;
					demandInfo = null;
					if (info.draggedData.sourceGrid.data.length > 0) {
						let creationData = {
							info: info,
							demand: info.draggedData.sourceGrid.data[0],
							offsetY: null,
							from: null,
							to: null
						};
						if (_.isFunction(assignmentMappingService.intersectSequence) && _.isFunction(assignmentMappingService.showIntersectSequenceDialog)) {

							let dataForDialog = {
								creationData: creationData,
								planningBoardDate: moment(timeScale.invert(info.event.offsetX)).utc(),
								sequenceData: planningBoardDataService.getDateshiftConfig().dateShiftHelperService.getSequenceData(planningBoardDataService.getDateshiftConfig().dataService.getServiceName()),
								supplierOffsetY: creationData.info.event.offsetY,
								supplierId: supplierScale.supplierIdForYpx(creationData.info.event.offsetY + supplierScrollValue),
								items: planningBoardDataService.assignments,
								createAssignment: _createAssignment,
								calendarData: planningBoardDataService.getDateshiftConfig().dateShiftHelperService.getCalendarData(planningBoardDataService.getDateshiftConfig().dataService.getServiceName())
							};
							assignmentMappingService.showIntersectSequenceDialog(dataForDialog);

						} else {
							_createAssignment(creationData);
						}

					}
				}
			}

			function onAggregationClick(d) {
				openAggregationPopup(d);
			}

			//
			// *** DRAGGING DEMAND PREVIEW FUNCTIONS ***
			//

			function appendDemandPreview() {
				demandInfo.isDragging = true;
				demandDragView.supplierScrollValue(supplierScrollValue);
				demandDragView.assignments([demandInfo]);
				layers.assignmentBaseContainer.call(demandDragView);
			}

			function moveDemandPreview() {
				layers.assignmentBaseContainer.call(demandDragView);
			}

			function updateAssignmentGrouping() {
				if (planningBoardDataService.planningBoardMode.actionType === 'grouping' && _.isFunction(planningBoardDataService.getAssignmentConfig().mappingService.grouping)) {
					const groups = platformPlanningBoardUpdateService.updateAssignmentGrouping(
						{
							timeaxis: timeaxis,
							timeScale: timeScale,
							supplierScale: supplierScale,
							planningBoardDataService: planningBoardDataService,
							planningBoardMode: planningBoardDataService.planningBoardMode
						}
					);
					updateGroupLineComponents(groups);
					assignmentGroups.assignments(groups.groupViews);
				}
			}

			function updateGroupLineComponents(groups) {
				const maxLoadColor = basicsCommonDrawingUtilitiesService.decToHexColor(planningBoardDataService.aggregationTrafficLightsConfig()['maxload']);
				assignmentMaxLoadLines.assignments(groups.maxCapacityLineViews);
				assignmentMaxLoadLines.lineColor(maxLoadColor);
			}


			//
			// **** HELPER FUNCTIONS ***
			//

			function getParentPanelWidth() {
				return element[0].offsetWidth;
			}

			function getParentPanelHeight() {
				return element[0].offsetHeight;
			}

			function setupTools() {
				containerScope = $scope.$parent;
				while (containerScope && !containerScope.hasOwnProperty('setTools')) {
					containerScope = containerScope.$parent;
				}
			}

			function gridIsReady(gridid) {
				let localgrid;
				grid = null;
				if (platformGridAPI.grids.exist(gridid)) {
					localgrid = platformGridAPI.grids.element('id', gridid);
					if (localgrid.instance && localgrid.dataView) {
						grid = localgrid;
						return true;
					}
				}
				return false;
			}

			function deselectAssignmentComponents(isMultiSelect) {
				$scope.assignments.forEach((assignment) => {
					assignment.activeFlag = false;
					if (!isMultiSelect) {
						assignment.selectedFlag = false;
						assignment.areRelated = false;
					}
				});
			}

			// region update
			function updateAll() {
				resize();
				updatePlanningBoardCanvasSize();
				update();
			}


			function updateAssignmentsFilter(event, elem) {
				if ($('.planningboardMain.' + $scope.getContainerUUID()).find(elem).length > 0) {
					$scope.searchString = elem.value;
					let filteredAssignments = platformPlanningBoardUpdateService.updateAssignmentsFilter($scope, Array.from(planningBoardDataService.assignments.values()), planningBoardDataService);
					let assignmentInitSelect = _.sortBy(filteredAssignments, [function (a) { return Math.abs(planningBoardDataService.getDateStart().diff(planningBoardDataService.getAssignmentConfig().mappingService.from(a))); }])[0];
					$scope.$broadcast('assignmentFilterChanged', assignmentInitSelect, filteredAssignments, $scope.getContainerUUID());
					selectAssignmentOnFilterChanged({}, assignmentInitSelect, null, true);
				}
			}


			function selectAssignmentOnFilterChanged(e, assignmentToSelect, elem, initialSelect) {
				if (elem && $('.planningboardMain.' + $scope.getContainerUUID()).find(elem).length > 0 || initialSelect) {
					const assignmentMappingServ = planningBoardDataService.getAssignmentConfig().mappingService;
					const supplierDataServ = planningBoardDataService.getSupplierConfig().dataService;
					deselectAssignmentComponents(false);

					if (assignmentToSelect && $scope.assignments.get(assignmentToSelect.Id)) {
						assignmentToSelect = $scope.assignments.get(assignmentToSelect.Id);
						assignmentToSelect.activeFlag = true;
						assignmentToSelect.selectedFlag = true;

						if (assignmentMappingServ.from(assignmentToSelect) && !initialSelect) {
							planningBoardDataService.calendarSnapToDate(assignmentMappingServ.from(assignmentToSelect));
							const supplierOfSelected = supplierDataServ.getItemById(assignmentMappingServ.supplier(assignmentToSelect));
							platformGridAPI.rows.scrollIntoViewByItem(planningBoardDataService.getSupplierConfig().uuid, supplierOfSelected, false);
						}
					}

					platformPlanningBoardUpdateService.updateAssignmentStatus({
						scope: $scope,
						assignmentAvailableStatusItems: planningBoardDataService.assignmentAvailableStatusItems,
						arr: layers.assignments.data()[0],
						layers: layers,
						draw: draw,
						dataService: planningBoardDataService
					});
					if (!planningBoardDataService.planningBoardMode || planningBoardDataService.planningBoardMode && (planningBoardDataService.planningBoardMode.actionType !== 'setStatus' || planningBoardDataService.planningBoardMode.actionType !== 'createAssignment')) {
						draw('all');
					}
				}
			}


			function update(redrawOnly, isHighlight) {
				if (d3.event && hasStepChanged(d3) || !d3.event) {
						const suppCalendar = platfromPlanningBoardCalendarService.getCachedCalendars(planningBoardDataService.getSupplierConfig().uuid);
						calculatedCurrentSizeY = calculateCurrentSizeY();
						updateAssignmentStatusItems();
						updateAssignmentTypeItems();
						updateScale();
						updateData();
						updateAggregations();
						updateLanes();
						updateBackgrounds(suppCalendar);
						updateStatusPanel();
						updateTimeScaleTicks();
						updateAssignmentGrouping();
						draw(isCalendarDragging ? 'drag' : null);
						updateHighlightAssignments(d3, isHighlight);
						updateDayLinesPosition();
				}
			}

			function updateDayLinesPosition() {
				// adapt to scroll value
				if (layers.linesAxis) {
					layers.linesAxis.selectAll('.tick').nodes().forEach(tickElem => {
						let parsedTransformAttr = tickElem.attributes['transform'].value.slice(tickElem.attributes['transform'].value.indexOf('(') + 1, tickElem.attributes['transform'].value.indexOf(','));
						tickElem.attributes['transform'].value = `translate(${parsedTransformAttr}, ${supplierScrollValue})`;
					});

					let domainTransformArrt = layers.linesAxis.select('.domain').nodes()[0].attributes['transform'];
					let parsedTransformAttr = domainTransformArrt.value.slice(domainTransformArrt.value.indexOf('(') + 1, domainTransformArrt.value.indexOf(','));
					domainTransformArrt.value = `translate(${parsedTransformAttr}, ${supplierScrollValue})`;
				}
			}

			function updateAssignmentStatusItems() {
				planningBoardDataService.assignmentStatusItems = planningBoardDataService.assignmentStatusItems || [];
				if (assignmentItems && assignmentItems.statusIconItems) {
					assignmentItems.statusIconItems(planningBoardDataService.assignmentStatusItems);
				}
			}

			function updateAssignmentTypeItems() {
				if (assignmentItems) {
					assignmentItems.typeIconItems(planningBoardDataService.assignmentTypeItems || []);
					tagItems.typeIconItems(planningBoardDataService.assignmentTypeItems || []);
				}
			}

			function resize() {
				if (!_.isUndefined(supplierScale)) {
					let resizeData = {
						transY: (supplierScale.headerLineHeight() + calculatedCurrentSizeY),
						calendarlineobject: calendarlineobject,
						timeScale: timeScale,
						panelWidth: panelWidth,
						assignmentItems: assignmentItems,
						assignmentCollections: assignmentCollections,
						assignmentGroups: assignmentGroups,
						aggregateItems: aggregateItems,
						timeaxis: timeaxis,
						layers: layers,
						dataService: planningBoardDataService,
						supplierScrollValue: supplierScrollValue
					};
					platformPlanningBoardUpdateService.resize(resizeData);
				}

				if (gridIsReady(planningBoardDataService.getSupplierConfig().uuid) && planningBoardDataService.useFlexibleRowHeight()) {
					let currentSupplierGridConfig = _.cloneDeep(platformGridAPI.grids.getGridState(planningBoardDataService.getSupplierConfig().uuid));
					currentSupplierGridConfig.rowHeight = planningBoardDataService.getRowHeightFromSettings();
					platformGridAPI.grids.setOptions(planningBoardDataService.getSupplierConfig().uuid, currentSupplierGridConfig);
				}
			}

			function updateStatusPanel() {
				platformPlanningBoardUpdateService.updateStatusPanel(panelWidth);
			}

			function updateScale() {
				let updateScaleData = {
					panelWidth: panelWidth,
					timeScale: timeScale,
					supplierScale: supplierScale,
					assignmentCollections: assignmentCollections,
					assignmentItems: assignmentItems,
					aggregateItems: aggregateItems,
					timeaxis: timeaxis,
					layers: layers,
					tagItems: tagItems,
					dataService: planningBoardDataService
				};
				platformPlanningBoardUpdateService.updateScale($scope, updateScaleData);
			}

			function updateData() {
				if (!_.isUndefined(timeaxis)) {
					let updateDataData = {
						calendarlineobject: calendarlineobject,
						timeaxis: timeaxis,
						layers: layers,
						isCalendarDragging: isCalendarDragging,
						assignmentCollections: assignmentCollections,
						settingsChanged: settingsChanged,
						draw: draw,
						oldAssignmentArr: oldAssignmentArr,
						panelWidth: panelWidth,
						assignmentItems: assignmentItems,
						assignmentAvailableStatusItems: planningBoardDataService.assignmentAvailableStatusItems,
						dataService: planningBoardDataService,
						visibleRange: {
							start: moment(timeaxis.tickvalues()[0]),
							end: moment(timeaxis.tickvalues().at(-1))
						}
					};
					oldAssignmentArr = platformPlanningBoardUpdateService.updateData($scope, updateDataData);
					settingsChanged = false;
				}
			}

			function updateAggregations() {
				if (!_.isUndefined(timeaxis)) {
					let updateAggregationData = {
						timeaxis: timeaxis,
						aggregateItems: aggregateItems,
						aggregateSumItems: aggregateSumItems,
						dataService: planningBoardDataService
					};
					platformPlanningBoardUpdateService.updateAggregations($scope, updateAggregationData);
				}
			}

			function updateLanes() {
				if (_.isObject($scope.verticalIndex)) {
					let updateLanesData = {
						verticalIndex: $scope.verticalIndex,
						laneLayer: laneLayer,
						lanesComponent: lanesComponent,
						panelWidth: panelWidth,
						supplierScrollValue: supplierScrollValue,
						containerDimensions: getCurrentDimensions,
						supplierScale: supplierScale
					};
					platformPlanningBoardUpdateService.updateLanes(updateLanesData);
				}
			}

			function getCurrentDimensions() {
				if (_.isUndefined(containerDimensions.width) || _.isUndefined(containerDimensions.height)) {
					containerDimensions = document.getElementsByClassName('planningboardMain ' + $scope.getContainerUUID()).planningboardMain.getBoundingClientRect();
				}
				return {
					height: containerDimensions.height,
					width: containerDimensions.width
				}
			}

			function updateBackgrounds(calendars) {
				if (_.isObject($scope.getDateStart) && grid && grid.instance) {
					let updateBackgroundsData = {
							backgroundComponent: backgroundComponent,
							backgroundLayer: backgroundLayer,
							timeScale: timeScale,
							supplierScale: supplierScale,
							supplierScaleCustomVerticalIndex: supplierScale.verticalIndex(),
							parseDecToRgba: basicsCommonDrawingUtilitiesService.intToRgbColor,
							bgExceptionDayClickHandler: bgExceptionDayClickHandler,
							// heExceptionDayClickHandler: heExceptionDayClickHandler
							dataService: planningBoardDataService,
							supplierScrollValue: supplierScrollValue,
							supplierCalendar: calendars
						};
					platformPlanningBoardUpdateService.updateBackgrounds($scope, updateBackgroundsData);
					platformPlanningBoardUpdateService.updateFooterBackground(layers.footerContent, panelWidth, footerHeight);
				}
				// backgroundHeaderComponent = platformPlanningBoardUpdateService.backgroundHeaderComponent; // todo: this feature must be implemented in chartbase
			}

			function updateTimeScaleTicks() {
				if (planningBoardDataService.getDateEnd) {
					let dayLineHeight = $scope.verticalIndex.size * supplierScale.lineHeight();
					dayLinesAxis = platformPlanningBoardUpdateService.updateTimeScaleTicks(dayLineHeight, supplierScale, timeScale, timeaxis);
					footerDayLinesAxis = platformPlanningBoardUpdateService.updateTimeScaleTicks(footerHeight, supplierScale, timeScale, timeaxis);
				}
			}

			function updatePlanningBoardCanvasSize() {
				if (gridIsReady(planningBoardDataService.getSupplierConfig().uuid) && _.isFunction($scope.getCurrentDimensions) &&
					!_.isUndefined(viewPort) && !_.isUndefined(pBoardCanvas) && !_.isUndefined(dragSel)) {
					platformPlanningBoardUpdateService.updatePlanningBoardCanvasSize($scope.getCurrentDimensions().height - (_.isEqual(planningBoardDataService.activeSearchMode, 'searchBoth') ? 27 : 0), viewPort, pBoardCanvas, dragSel, layers.footerContent);

					$('.planningboardMain.' + $scope.getContainerUUID()).find('.filterInput').css('width', panelWidth - 66 + 'px');
				}
				updateScale();
			}

			function updatePanelWidthDependencies() {
				platformPlanningBoardUpdateService.updatePanelWidthDependencies(layers, panelWidth);
			}

			function updateHighlightAssignments(d3, isHighlight) {

				if (d3.event === null && isHighlight) {
					const updateHighlightAssignmentData = {
						layers: layers,
						dataService: planningBoardDataService
					};
					platformPlanningBoardUpdateService.updateHighlightAssignments(updateHighlightAssignmentData);
				}

			}

			function draw(actionType) {
				let sizeY = 0;
				let transXH2 = 25;
				let transXH3 = 15;
				let hourDiff;

				layers.headerContent.call(timeaxis);
				calendarlineobject.height(calculatedCurrentSizeY + supplierScale.headerLineHeight() + calculatedCurrentSizeY / 4);
				calendarlineobject.offset(supplierScrollValue - calculatedCurrentSizeY / 4);
				layers.calendarLine.call(calendarlineobject);
				if (planningBoardDataService.getDateEnd) {
					let tickStart = moment(planningBoardDataService.getDateStart());
					let tickEnd = moment(planningBoardDataService.getDateEnd());
					hourDiff = tickEnd.diff(tickStart, 'hour');
					if (hourDiff < 36) {
						transXH3 = 25;
					}
					if (hourDiff < 48) {
						transXH2 = 35;
					}
				}

				if (_.isObject(layers.linesAxis)) {
					layers.linesAxis.call(dayLinesAxis);
					layers.linesAxis.select('path.domain').attr('transform', 'translate(0, -' + (sizeY) + ')');
				}
				if (_.isObject(layers.footerLinesAxis)) {
					if (planningBoardDataService.showSumAggregations()) {
						layers.footerLinesAxis.call(footerDayLinesAxis);
					} else {
						layers.footerContent.select('rect.footer-background').attr('height', 0);
						layers.footerLinesAxis.selectAll('*').remove();
					}
				}

				if (planningBoardDataService.planningBoardMode.actionType !== 'grouping') {
					if (_.isObject(layers.assignments)) {
						layers.assignments.call(assignmentItems, actionType);
						if (planningBoardDataService.useTaggingSystem()) {
							layers.assignmentTags.call(tagItems);
						} else {
							// clear tagging elements
							layers.assignmentTags.selectAll('*').remove();
						}

						layers.assignments.call(assignmentCollections);
						layers.assignmentGroups.selectAll('*').remove();
						layers.assignmentGroupMaxLoadLine.selectAll('*').remove();
					}
				} else {
					if (_.isObject(layers.assignmentGroups)) {
						layers.assignmentTags.selectAll('*').remove();
						layers.assignmentBaseContainer.selectAll('*').remove();
						layers.assignments.selectAll('g.assignment-item').remove();
						layers.assignments.selectAll('g.collection').remove();
						layers.assignmentGroups.call(assignmentGroups);
						layers.assignmentGroupMaxLoadLine.call(assignmentMaxLoadLines);
					}
				}

				if (planningBoardDataService.showAggregations()) {
					layers.aggregationContainer.call(aggregateItems);
				} else {
					// clear aggregations
					layers.aggregationContainer.selectAll('g.aggregation').remove();
				}
				if (planningBoardDataService.showSumAggregations()) {
					layers.aggregationSumContainer.call(aggregateSumItems);
				} else {
					// clear sum aggregations
					layers.aggregationSumContainer.selectAll('g.aggregation').remove();
				}
			}

			// endregion

			let toolTipTimeOut = 0;

			function removeToolTip() {
				bgPreviewLayer.selectAll('*').remove();
				hePreviewLayer.selectAll('*').remove();
			}

			function removeIndicators() {
				layers.assignments.selectAll('.indicator-area').remove();
				platformDragdropService.mouseLeave({});
				if (demandInfo && demandInfo.isDragging) {
					layers.assignmentBaseContainer.selectAll('rect.base-assignment').remove();
					demandInfo = null;
				}

			}

			/* DEPRECATED
			* can be deleted later saa.mik 03.03.2021
			function heExceptionDayClickHandler(day) {
				let offset = 0;
				exceptionDayClickHandler(day, hePreviewLayer, offset);
			}
			 */

			function bgExceptionDayClickHandler(day) {
				exceptionDayClickHandler(day, bgPreviewLayer, verticalScrollOffset);
			}

			function needRemoveTooltip(day) {
				if (day) {
					let needTooltipRemove = lastClickedDay !== day || day.type === 'today';

					if (!needTooltipRemove) {
						needTooltipRemove = toolTipBackgroundComponent.day().day && day.day && toolTipBackgroundComponent.day().day.isSame(day.day);
					}

					return needTooltipRemove;
				}
				return false;
			}

			function exceptionDayClickHandler(day, layer, offset) {
				const canEditCalendar = planningBoardDataService.getAssignmentConfig().mappingService.canEditCalendar && planningBoardDataService.getAssignmentConfig().mappingService.canEditCalendar();
				if (!canEditCalendar || needRemoveTooltip(day)) {
					removeToolTip();
				}

				if (day) {
					lastClickedDay = day;
					let infoMsg = day.day.format('L');
					infoMsg += day.info ? ' - ' + day.info : '';

					toolTipBackgroundComponent = pBoardComp.toolTipBackground()
						.timeScale(timeScale)
						.offset(offset)
						.day(day)
						.infoMsg(infoMsg);

					if (canEditCalendar) {
						toolTipBackgroundComponent.onDblClickFn(() => {
							if (day.type !== 'today') {
								platfromPlanningBoardCalendarService.openCalendarDayEditDialog(day, planningBoardDataService);
							}
							removeToolTip();
						});
					}

					layer.call(toolTipBackgroundComponent);

					clearTimeout(toolTipTimeOut);
					toolTipTimeOut = setTimeout(removeToolTip, 1500);
				}
			}

			function validateDraggingDemand(draggingDemand, offsetY) {
				// set mapping services for currently used planning board data service
				platformPlanningBoardValidationService.supplierMapService(planningBoardDataService.getSupplierConfig().mappingService);
				platformPlanningBoardValidationService.assignmentMapService(planningBoardDataService.getAssignmentConfig().mappingService);
				platformPlanningBoardValidationService.demandMapService(planningBoardDataService.getDemandConfig().mappingService);

				// check validation on demand drag
				let supplierId = supplierScale.supplierIdForYpx(offsetY + supplierScrollValue);
				let pbGridDefaultSettingValue = planningBoardDataService.gridSettings.validateDemandAgainstSuppliers();
				let validationResultDragging = platformPlanningBoardValidationService.validateEntityAgainstSupplier(draggingDemand, 'demand', supplierId, pbGridDefaultSettingValue);
				let dragText = $translate.instant('platform.planningboard.missingSkill') + ': ';
				if (validationResultDragging.invalidItems && validationResultDragging.invalidItems.length > 0) {
					_.forEach(validationResultDragging.invalidItems, function (val) {
						dragText += val.DescriptionInfo.Description + ', ';
					});
					dragText = dragText.slice(0, -2);
				} else {
					if (draggingDemand.Description !== undefined) {
						dragText = draggingDemand.Description;
					} else {
						dragText = draggingDemand.Code;

					}

				}
				platformDragdropService.setDraggedText(dragText);
				if (firstMouseEnter) {
					drawIndicatorArea(draggingDemand, event);
				}

				return validationResultDragging.isValid;
			}

			function drawIndicatorArea(draggingDemand, event) {
				// set indicator area on invalid supplier
				let visibleSuppliers = platformGridAPI.grids.element('id', planningBoardDataService.getSupplierConfig().uuid).dataView.getItems();
				let validSupplierList = platformPlanningBoardValidationService.validateSelectedAgainstList(draggingDemand, visibleSuppliers, 'demand', 'supplier');
				let supplierIdx = supplierScale.verticalIndex().get(supplierScale.supplierIdForYpx(event.offsetY + supplierScrollValue));

				indicatorAreaComponent
					.startDate(planningBoardDataService.getDateStart())
					.endDate(planningBoardDataService.getDateEnd())
					.indicatorY(false);
				// if isMandatory required but not provided - error - red background in supplier grid
				let invalidSupplierList = _.difference(visibleSuppliers, validSupplierList);
				_.forEach(invalidSupplierList, function (invalidSupplier) {
					let validationResultDemand = platformPlanningBoardValidationService.validateEntityAgainstSupplier(
						draggingDemand,
						'demand',
						planningBoardDataService.getSupplierConfig().mappingService.id(invalidSupplier)
					);
					if (!_.isUndefined(validationResultDemand.invalidItems) && validationResultDemand.invalidItems.length > 0) {
						let mandatoryIndex = _.findIndex(validationResultDemand.invalidItems, function (result) {
							return planningBoardDataService.getSupplierConfig().mappingService.isMandatory(result);
						});

						if (mandatoryIndex > -1) {
							invalidSupplier.indicationAreaType = 'error';
						}
					}
				});


				let arraySupIds = [];
				platformGridAPI.grids.element('id', planningBoardDataService.getSupplierConfig().uuid).instance.getRenderedRowIds().forEach(id => {
					arraySupIds.push(platformGridAPI.grids.element('id', planningBoardDataService.getSupplierConfig().uuid).dataView.getItemByIdx(id).Id);
				});
				validSupplierList = validSupplierList.filter(validSupplier => arraySupIds.includes(validSupplier.Id));
				// if !isMandatory required but not provided - warning - yellow background in supplier grid
				_.forEach(validSupplierList, function (validSupplier) {
					let validationResultDemand = platformPlanningBoardValidationService.validateEntityAgainstSupplier(
						draggingDemand,
						'demand',
						planningBoardDataService.getSupplierConfig().mappingService.id(validSupplier)
					);
					if (!_.isUndefined(validationResultDemand.invalidItems) && validationResultDemand.invalidItems.length > 0) {
						validSupplier.indicationAreaType = 'warning';
						invalidSupplierList.push(validSupplier);
					}
				});

				indicatorAreas = layers.assignments.selectAll('.indicator-area').data(invalidSupplierList);
				indicatorAreas.call(indicatorAreaComponent);
			}

			function resetIndicatorArea() {
				let indicatorAreas = layers.assignments.selectAll('.indicator-area').data([]);
				indicatorAreas.call(indicatorAreaComponent);
			}

			function _createAssignment(creationData) {
				layers.assignmentBaseContainer.selectAll('rect.base-assignment').remove();
				let supplierOffsetY = creationData.offsetY || creationData.info.event.offsetY;
				let supplierId = supplierScale.supplierIdForYpx(supplierOffsetY + supplierScrollValue); // info.event.offsetY
				if (supplierId > 0) {
					let demandMapService = planningBoardDataService.getDemandConfig().mappingService;
					let demands = [];
					if (_.isFunction(demandMapService.getDemandList)) {
						demands = demandMapService.getDemandList(creationData.demand);
					} else {
						demands.push(creationData.demand);
					}
					if (_.isNull(creationData.from)) {
						let offsetX = creationData.offsetX || creationData.info.event.offsetX;
						creationData.from = moment(timeScale.invert(offsetX)).utc();
					}

					const modeToolsFromScope = $scope.dateShiftModeTools || $scope.$parent.dateShiftModeTools;
					const dsModeTools = modeToolsFromScope?.length > 0 ? modeToolsFromScope[0].list : null;
					const originalDSMode = dsModeTools ? dsModeTools.activeValue : null;

					if (planningBoardDataService.getDateshiftConfig() && dsModeTools?.items) {
						dsModeTools.items.find(tool => tool.value === 'fullPush').fn();
					}

					// supplierId temporarily as property
					planningBoardDataService.createAssignment(demands, supplierId, creationData).then(result => {
						if (planningBoardDataService.getDateshiftConfig() && !!originalDSMode) {
							dsModeTools.items.find(tool => tool.value === originalDSMode).fn();
						}
					});

					if (_.isNull(creationData.from) && planningBoardDataService.useDemandTimesForReservation()) {
						planningBoardDataService.calendarSnapToDate(creationData.from);
					}
				}
			}

			function _getSelectedDemand() {
				let selectedDemand = platformGridAPI.rows.selection({
					gridId: planningBoardDataService.getDemandConfig().uuid
				});

				if (_.isUndefined(selectedDemand)) {
					let timer = 3000;
					let message = $translate.instant('platform.planningboard.selectDemandMsg');
					showToastMessage(message, timer)
				}

				return selectedDemand;
			}

			function showToastMessage(message, timer = 3000){

				//let timer = 3000;
				const toastTemplate = `
				<div class="alarm-overlay ds-message">
					<div class="alert" role="alert" style="text-align:center">
						${message}
						<p class="timer">(${timer / 1000}s)</p>
					</div>
				</div>
				`;

				let toastElem = ((new DOMParser).parseFromString(toastTemplate, 'text/html')).getElementsByClassName('alarm-overlay')[0];
				let timerElem = toastElem.getElementsByClassName('timer')[0];


				let activeElem =  document.getElementsByTagName('body')[0];
				activeElem.appendChild(toastElem);

				// Set up a countdown timer to update the timer display every second
				let timerInterval = setInterval(() => {
					timer -= 1000;
					timerElem.innerHTML = `(${timer / 1000}s)`;
				}, 1000);

				// Remove the toast and clear the interval after the timer runs out
				setTimeout(() => {
				clearInterval(timerInterval);
					toastElem.remove();
				}, timer);

			}

			function openAssignmentPopup(d) {
				$scope.isSumAggrigationPopup = false;
				let assignmentMapServ = planningBoardDataService.getAssignmentConfig().mappingService;
				let supplierMapServ = planningBoardDataService.getSupplierConfig().mappingService;
				// reset pbPopup
				$scope.pbPopup = [];

				// build pbPopup to display values in popup
				$scope.pbPopup.headline = $translate.instant('platform.planningboard.assignment') + ' - ' + assignmentMapServ.description(d);
				$scope.pbPopup.from = moment(assignmentMapServ.from(d)).format('MMM DD YYYY, HH:mm');
				$scope.pbPopup.to = moment(assignmentMapServ.to(d)).format('MMM DD YYYY, HH:mm');

				$scope.pbPopup.items = [];

				if (planningBoardDataService.showMainText() && planningBoardDataService.mainInfoLabel() !== '') {
					if (platformPlanningBoardUpdateService.isJson(planningBoardDataService.mainInfoLabel())) {
						$scope.pbPopup.items.push({
							'label': pBoardComp.textLine(d, planningBoardDataService.mainInfoLabel(), true, assignmentMapServ),
							'value': ''
						});
					} else {
						$scope.pbPopup.items.push({
							'label': _.get(d, planningBoardDataService.mainInfoLabel()),
							'value': ''
						});
					}

				}

				if (planningBoardDataService.showInfo1Text() && planningBoardDataService.info1Label() !== '') {

					if (platformPlanningBoardUpdateService.isJson(planningBoardDataService.info1Label())) {
						$scope.pbPopup.items.push({
							'label': pBoardComp.textLine(d, planningBoardDataService.info1Label(), false, assignmentMapServ),
							'value': ''
						});
					} else {
						$scope.pbPopup.items.push({
							'label': _.get(d, planningBoardDataService.info1Label()),
							'value': ''
						});
					}

				}

				if (planningBoardDataService.showInfo2Text() && planningBoardDataService.info2Label() !== '') {
					if (platformPlanningBoardUpdateService.isJson(planningBoardDataService.info2Label())) {
						$scope.pbPopup.items.push({
							'label': pBoardComp.textLine(d, planningBoardDataService.info2Label(), false, assignmentMapServ),
							'value': ''
						});
					} else {
						$scope.pbPopup.items.push({
							'label': _.get(d, planningBoardDataService.info2Label()),
							'value': ''
						});
					}
				}

				if (planningBoardDataService.showInfo3Text() && planningBoardDataService.info3Label() !== '') {
					if (platformPlanningBoardUpdateService.isJson(planningBoardDataService.info3Label())) {
						$scope.pbPopup.items.push({
							'label': pBoardComp.textLine(d, planningBoardDataService.info3Label(), false, assignmentMapServ),
							'value': ''
						});
					} else {
						$scope.pbPopup.items.push({
							'label': _.get(d, planningBoardDataService.info3Label()),
							'value': ''
						});
					}
				}

				_.forEach(planningBoardDataService.tagConfig(), function (tag) {
					let projectColor = 0;
					let validationColor = '';
					let ppsHeaderColor = 0;
					if (tag.visible) {
						switch (tag.id) {
							case 'project':
								projectColor = assignmentMapServ.headerColor(d); // could be rgb or idx
								if (_.isNumber(projectColor)) {
									projectColor = d3.interpolateRainbow(projectColor);
								} else {
									projectColor = basicsCommonDrawingUtilitiesService.intToRgbColor(tag.color);
									projectColor = 'rgba(' + projectColor.r + ',' + projectColor.g + ',' + projectColor.b + ',' + projectColor.opacity + ')';

								}

								$scope.pbPopup.items.push({
									'color': projectColor,
									'label': tag.name,
									'value': (_.isFunction(assignmentMapServ.projectName)) ? assignmentMapServ.projectName(d) : ''
								});
								break;
							case 'status':
								if (_.isFunction(assignmentMapServ.status)) {
									let statusId = assignmentMapServ.status(d);
									if (statusId) {
										let statusColor = '';
										let statusDescription = '';
										planningBoardDataService.assignmentStatusItems.forEach(function (asi) {
											if (asi.Id === statusId && asi.BackgroundColor) {
												statusColor = basicsCommonDrawingUtilitiesService.intToRgbColor(asi.BackgroundColor);
												statusColor = 'rgba(' + statusColor.r + ',' + statusColor.g + ',' + statusColor.b + ',' + statusColor.opacity + ')';

											}
											if (statusColor === '' && tag.color) {
												statusColor = basicsCommonDrawingUtilitiesService.intToRgbColor(tag.color);
												statusColor = 'rgba(' + statusColor.r + ',' + statusColor.g + ',' + statusColor.b + ',' + statusColor.opacity + ')';

											}
											if (asi.Id === statusId && asi.Description) {
												statusDescription = asi.Description;
											}
										});

										let statusLabel = $translate.instant('platform.planningboard.status');
										$scope.pbPopup.items.push({
											'color': statusColor,
											'label': statusLabel,
											'value': statusDescription
										});
									}
								}
								break;
							case 'type':
								if (_.isFunction(assignmentMapServ.type)) {
									let typeId = assignmentMapServ.type(d);
									if (typeId) {
										let typeColor = '';
										let typeDescription = '';
										planningBoardDataService.assignmentTypeItems.forEach(function (ati) {
											if (ati.Id === typeId && ati.BackgroundColor) {
												typeColor = basicsCommonDrawingUtilitiesService.intToRgbColor(ati.BackgroundColor);
											}
											if (typeColor === '' && tag.color) {
												typeColor = basicsCommonDrawingUtilitiesService.intToRgbColor(tag.color);
											}
											if (ati.Id === typeId && ati.Description) {
												typeDescription = ati.Description;
											}
										});

										let typeLabel = $translate.instant('platform.planningboard.type');
										$scope.pbPopup.items.push({
											'color': typeColor,
											'label': typeLabel,
											'value': typeDescription
										});
									}
								}
								break;
							case 'validation':
								validationColor = '';
								if (d.isValid && d.invalidItems.length > 0) {
									validationColor = 'rgb(205,133,25)';
								} else if (d.isValid) {
									validationColor = 'rgb(66,205,25)';
								} else {
									validationColor = 'rgb(201,34,34)';
								}

								$scope.pbPopup.items.push({
									'color': validationColor,
									'label': tag.name
								});

								if (d.invalidItems.length > 0) {
									_.forEach(d.invalidItems, function (item) {
										let itemColor = '';
										if (_.isFunction(supplierMapServ.isMandatory) && supplierMapServ.isMandatory(item)) {
											itemColor = 'rgb(201,34,34)';
										} else {
											itemColor = 'rgb(205,133,25)';
										}
										$scope.pbPopup.items.push({
											'color': itemColor,
											'label': item.DescriptionInfo.Description
										});
									});
								}
								break;
							case 'ppsHeader':
								if (_.isFunction(assignmentMapServ.ppsHeaderColor) && assignmentMapServ.ppsHeaderColor(d)) {
									ppsHeaderColor = assignmentMapServ.ppsHeaderColor(d);
									if (_.isNumber(ppsHeaderColor)) {
										ppsHeaderColor = basicsCommonDrawingUtilitiesService.intToRgbColor(ppsHeaderColor);
										ppsHeaderColor = 'rgba(' + ppsHeaderColor.r + ',' + ppsHeaderColor.g + ',' + ppsHeaderColor.b + ',' + ppsHeaderColor.opacity + ')';
									}

									$scope.pbPopup.items.push({
										'color': ppsHeaderColor,
										'label': tag.name
									});
								}
								break;
							default:
								$scope.pbPopup.items.push({
									'label': tag.name,
									'value': ''
								});
								break;
						}
					}
				});

				let dialogClickPosition = setDialogClickPosition();

				let popupOptions = {
					scope: $scope,
					hasDefaultWidth: false,
					templateUrl: globals.appBaseUrl + 'app/components/planningboard/partials/platform-planning-board-popup-partial.html',
					focusedElement: dialogClickPosition,
					plainMode: true
				};

				// close popup instance
				if (!_.isUndefined(popupInstance)) {
					popupInstance.close();
				}

				// within 200ms block showing new popups
				if (!timerRunning) {
					timerRunning = true;
					canOpenTimeout = $timeout(() => {
						canOpen = true;
						timerRunning = false;
					}, 200);
				}

				if (canOpen) {
					popupInstance = basicsLookupdataPopupService.showPopup(popupOptions);
					canOpen = false;
				}

				popupInstance.opened.then((instance) => {
					const el = document.querySelector('.popup-container');
					if (el !== null) {
						el.style.margin = '3px';
					}
					if (isDoubleClick) {
						instance.close();
					}
				});
			}

			function openAggregationPopup(d) {
				// reset pbPopup
				$scope.pbPopup = [];
				let mapService = planningBoardDataService.getAssignmentConfig().mappingService;

				// build pbPopup to display values in popup
				$scope.pbPopup.headline = $translate.instant('platform.planningboard.aggregation');
				$scope.pbPopup.from = moment(d.startDate).format('MMM DD YYYY');
				$scope.pbPopup.to = moment(d.endDate).format('MMM DD YYYY');

				// todo: refactor without the usage of aggregateType, sub types must be added differently
				if (!_.isFunction(mapService.aggregateType)) {
					$scope.pbPopup.items = [];
					if (planningBoardDataService.sumAggregationLine1() !== '') {
						const getSumAggregationLine1Caption = planningBoardDataService.sumAggregationLine1().caption;
						const getSumAggregationLine1Id = planningBoardDataService.sumAggregationLine1().id;

						const sumAggregationLine1Prop = getAggregationPopupProperties(getSumAggregationLine1Caption, getSumAggregationLine1Id);
						$scope.pbPopup.items.push({
							'label': sumAggregationLine1Prop.caption,
							'value': platformPlanningBoardAggregationService.getAggregationValue(d, planningBoardDataService.sumAggregationLine1().value, mapService)
						});
					}

					if (planningBoardDataService.sumAggregationLine2() !== '') {
						const getSumAggregationLine2Caption = planningBoardDataService.sumAggregationLine2().caption;
						const getSumAggregationLine2Id = planningBoardDataService.sumAggregationLine2().id;

						const sumAggregationLine2Prop = getAggregationPopupProperties(getSumAggregationLine2Caption, getSumAggregationLine2Id);
						$scope.pbPopup.items.push({
							'label': sumAggregationLine2Prop.caption,
							'value': platformPlanningBoardAggregationService.getAggregationValue(d, planningBoardDataService.sumAggregationLine2().value, mapService)
						});
					}

					if (planningBoardDataService.sumAggregationLine3() !== '') {
						const getSumAggregationLine3Caption = planningBoardDataService.sumAggregationLine3().caption;
						const getSumAggregationLine3Id = planningBoardDataService.sumAggregationLine3().id;
						const sumAggregationLine3Prop = getAggregationPopupProperties(getSumAggregationLine3Caption, getSumAggregationLine3Id);
						$scope.pbPopup.items.push({
							'label': sumAggregationLine3Prop.caption,
							'value': platformPlanningBoardAggregationService.getAggregationValue(d, planningBoardDataService.sumAggregationLine3().value, mapService)
						});
					}

				} else {
					if (d.aggregates && d.aggregates.length > 0) {
						$scope.pbPopup.items = [];
					}
					$scope.pbPopup.sumItem = [];
					_.forEach(d.aggregates, function (aggregate) {
						$scope.pbPopup.items.push({
							'label': aggregate.reference,
							'value': (aggregate.sum / aggregate.displayFactor).toFixed(2) + ' ' + aggregate.uomDescription
						});

						if (aggregate.sum > 0) {
							$scope.pbPopup.sumItem.label = $translate.instant('platform.planningboard.total');
							$scope.pbPopup.sumItem.value = (d.sum / d.displayFactor).toFixed(2) + ' ' + d.uomDescription;
						}

					});
				}

				let dialogClickPosition = setDialogClickPosition();
				$scope.isSumAggrigationPopup = true;
				let popupOptions = {
					scope: $scope,
					hasDefaultWidth: false,
					templateUrl: globals.appBaseUrl + 'app/components/planningboard/partials/platform-planning-board-popup-partial.html',
					focusedElement: dialogClickPosition,
					plainMode: true
				};

				// close popup instance
				if (!_.isUndefined(popupInstance)) {
					popupInstance.close();
				}
				popupInstance = basicsLookupdataPopupService.showPopup(popupOptions);
			}

			function getAggregationPopupProperties(columnName, Id) {
				let mapServ = planningBoardDataService.getAssignmentConfig().mappingService;
				if (_.isFunction(mapServ.getAssignmentModalFormConfig)) {
					const translationInfo = mapServ.getAssignmentModalFormConfig().rows;
					const translationFallbackString = translationInfo ? translationInfo.find(info => info.model === Id) : null;
					const translationFallback = translationFallbackString ? translationFallbackString.label$tr$ : null;

					return {
						value: columnName,
						id: columnName,
						caption: $translate.instant(translationFallback) || columnName
					};
				} else {
					return {
						value: columnName,
						id: columnName,
						caption: columnName
					};
				}

			}
			function setDialogClickPosition() {
				let dialogClickPosition = $('.planningboardMain.' + $scope.getContainerUUID()).find('.dialog-click-position');
				dialogClickPosition.remove();
				dialogClickPosition = $('<div class="dialog-click-position" style="pointer-events: none; position: absolute; top: ' + d3.event.offsetY + 'px; left: ' + d3.event.offsetX + 'px; height: 1px; width: 1px;"></div>');
				$('.planningboardMain.' + $scope.getContainerUUID()).find('.planningboardCanvas').append(dialogClickPosition);
				return dialogClickPosition;
			}

			function addEventListenerToHeader() {
				element.find('.headerContent')[0].addEventListener('click', (e) => {
					if (planningBoardDataService.planningBoardMode.actionType === 'setStatus') {
						const dateByEventOffset = moment(timeScale.invert(e.offsetX)).utc();

						const assignmnetMappingService = planningBoardDataService.getAssignmentConfig().mappingService;

						let endBound = moment(dateByEventOffset).endOf('hour');
						let startBound = moment(dateByEventOffset).startOf('hour');
						timeaxis.tickvalues().forEach((tick, index) => {
							if (index > 0 && dateByEventOffset.isBetween(timeaxis.tickvalues()[index - 1], tick)) {
								startBound = moment(timeaxis.tickvalues()[index - 1]).utc();
								endBound = moment(tick).utc();
							}
						});

						if (planningBoardDataService.assignments.size > 0) {
							const assignmentsArray = Array.from(planningBoardDataService.assignments.values());
							const assignmentsInBounds = assignmentsArray.filter(assignment => !assignment.Disabled && assignmnetMappingService.from(assignment).isBefore(endBound) && assignmnetMappingService.to(assignment).isAfter(startBound));
							assignmentsInBounds.forEach(assignmentItem => {
								setAssignmentStatusChanged(assignmentItem, true);
							});
						}
						$q.when().then(() => draw('setStatus'));
					}
				});
			}

			function hasStepChanged(d3) {
				let currentX = d3.event.x;
				let currentY = d3.event.y;

				let stepX = timeScale(moment(planningBoardDataService.getDateStart()).add($scope.getTimeScaleHoursX(), 'hour').utc());
				let offsetX = startDragX - currentX;
				let stepCountX = parseInt(Math.abs(offsetX) / stepX);

				let offsetY = startDragY - currentY;

				if ((stepCountX > 0 && stepCountX !== lastAmountOfStepsX) || offsetY !== 0) {

					startDragX = currentX;
					lastAmountOfStepsX = stepCountX;

					startDragY = currentY;

					return true;
				} else {
					return false;
				}
			}

			function calculateCurrentSizeY() {
				return $scope.verticalIndex.size * planningBoardDataService.rowHeight() < $scope.getCurrentDimensions().height ? $scope.verticalIndex.size * planningBoardDataService.rowHeight() : $scope.getCurrentDimensions().height;
			}

			function setAssignmentStatusChanged(assignmentItem, skipDraw) {

				const assignmnetMappingService = planningBoardDataService.getAssignmentConfig().mappingService;
				let toStatusId = +(planningBoardDataService.planningBoardMode.id.split('_')[1]);

				if (_.isUndefined(assignmentItem.originalStatusFrom)) {
					assignmentItem.originalStatusFrom = assignmentItem[assignmnetMappingService.statusKey()];
				}

				// when clicked second time - set the previous status
				if (assignmentItem[assignmnetMappingService.statusKey()] === toStatusId) {
					toStatusId = assignmentItem.originalStatusFrom;
				}

				assignmentItem[assignmnetMappingService.statusKey()] = toStatusId;
				$scope.updateAssignment(assignmentItem);
				platformPlanningBoardStatusService.setAssignmentStatusChanged(assignmentItem, toStatusId, assignmnetMappingService);
				if(!skipDraw) {
					draw();
				}
			}


		}
	}
]);
