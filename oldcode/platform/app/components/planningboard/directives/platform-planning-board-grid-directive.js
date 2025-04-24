angular.module('platform').directive('platformPlanningBoardGridDirective', ['_', 'platformGridAPI', 'moment', 'mainViewService', '$timeout', '$translate', '$q', 'platformPlanningBoardDataService',
	function (_, platformGridAPI, moment, mainViewService, $timeout, $translate, $q, platformPlanningBoardDataService) {
		/* global d3, $, globals */
		'use strict';
		return {
			priority: 10,
			link: link, restrict: 'A',
			scope: false,
			templateUrl: globals.appBaseUrl + 'app/components/planningboard/partials/platform-planning-board-grid.html'
		};

		function link($scope, element) {

			let planningBoardDataService = platformPlanningBoardDataService.getPlanningBoardDataServiceByUUID($scope.getContainerUUID());

			var panelWidth = getParentPanelWidth(); // GJ 2017 12 01;

			var splitterRootElement,
				splitter,
				splitterstate = {
					left: 25,
					mid: 50,
					right: 25,
					leftcollapsed: false,
					midcollapsed: false,
					rightcollapsed: false
				},
				lastSplitterstate = {};
			_.assign(splitterstate, mainViewService.customData($scope.supplierGridId, 'splitterstate'));
			makeSureNotAllSplitterAreCollapsed(splitterstate);

			_.assign(lastSplitterstate, splitterstate);


			$scope.filterPanelId = $scope.getContainerUUID();
			element[0].classList.add($scope.getContainerUUID());
			setupSplitter($scope.getContainerUUID());

			// container resize
			window.addEventListener('resize', onContainerResize); // workaround for bug in layout system.
			$scope.onContentResized(onContainerResize);
			resizeContainers();
			$timeout(resizeContainers, 250); // initial resize (TWICE). We always resize the grid twice. Timeout because we don't really know when the grid is finished with resizing
			planningBoardDataService.registerOnSettingsChanged(onSettingsChangedOrInit);
			onSettingsChangedOrInit();
			$scope.$on('$destroy', function cleanupHandlers() {
				unregisterResizeEvents();
				platformGridAPI.events.unregister($scope.supplierGridId, 'onHeaderToggled', onHeaderToggled);
			});

			$scope.$watch(
				function () {
					return {
						width: element[0].offsetWidth,
						//    height: element[0].height(),
					};
				},
				function () {
					var currentWidth = element[0].offsetWidth;
					if (currentWidth !== panelWidth) {
						panelWidth = currentWidth;
						// update();
					}
				},
				true
			);

			$scope.status = '';

			function saveSplitterState() {

				var leftpane = splitterRootElement.find('div.k-pane:first').width();
				var midpane = splitterRootElement.find('div.k-pane:nth-child(3)').width(); // center pane is elem(3) !!
				var rightpane = 0;
				if (!_.isNull(splitterRootElement.find('div#ui-layout-east').width()) && splitterRootElement.find('div#ui-layout-east').width() !== undefined) {
					rightpane = splitterRootElement.find('div.k-pane:last').width();
				}

				var fullWidth = leftpane + midpane + rightpane;

				/* 0 === leftpane ergibt true oder false, dies wird der jeweiligen Property zugeordnet */
				splitterstate.leftcollapsed = 0 === leftpane;
				splitterstate.midcollapsed = 0 === midpane;
				splitterstate.rightcollapsed = 0 === rightpane;

				if (!splitterstate.leftcollapsed) {
					splitterstate.left = Math.round(100 / fullWidth * leftpane, 0);
				}
				if (!splitterstate.midcollapsed) {
					splitterstate.mid = Math.round(100 / fullWidth * midpane, 0);
				}
				if (!splitterstate.rightcollapsed) {
					splitterstate.right = Math.round(100 / fullWidth * rightpane, 0);
				}

				makeSureNotAllSplitterAreCollapsed(splitterstate);

				if (!_.isEqual(splitterstate, lastSplitterstate)) {
					mainViewService.customData($scope.supplierGridId, 'splitterstate', splitterstate);
					_.assign(lastSplitterstate, splitterstate);
				}
			}
			var lastSearchPanelOpen = false;

			function onSettingsChangedOrInit(){
				// supplier grid will be destroyed on saving pb settings - the events must be registered anew
				platformGridAPI.events.register($scope.supplierGridId, 'onHeaderToggled', onHeaderToggled);
			}

			function onHeaderToggled(event, info) {
				var filterrow = info.grid.filterRowVisibility();
				if (!lastSearchPanelOpen && info.findpanel && filterrow) {
					info.grid.filterRowVisibility(false);
				}
				lastSearchPanelOpen = info.findpanel;
				$scope.$broadcast('placeholderHeightCorrection', info.grid.id, $scope.getContainerUUID());
				resizeContainers();
			}

			function resizeContainers() {
				function asynchResize(gridId) {
					var defer = $q.defer();

					setTimeout(function () {
						var container = splitterRootElement.find('#' + gridId);
						if ((splitterRootElement.find('#' + gridId)).length > 0) {
							defer.resolve(container);
						} else {
							asynchResize(gridId);
						}
					}, 100);

					return defer.promise;
				}

				function fetchElements(gridId) {
					var additionalHeight = 20;

					if (planningBoardDataService.showSumAggregations()) {
						additionalHeight += $scope.defaultFooterHeight;
					}
					if (!_.isEqual(planningBoardDataService.activeSearchMode, 'searchBoth')){
						additionalHeight += 17;
					}
					var gridContainer = splitterRootElement.find('#' + gridId);
					if (gridContainer.length > 0) {
						calculateResize(gridId, gridContainer, additionalHeight);
					} else {
						asynchResize(gridId).then(function (gridEl) {
							calculateResize(gridId, gridEl, additionalHeight);
						});
					}
				}

				function calculateResize(gridId, container, phHeight) {
					var dimensions = $scope.getCurrentDimensions();

					splitter.height(dimensions.height);

					var splitBars = splitter.find('.k-splitbar');
					splitBars.height(dimensions.height);

					var kPanes = splitter.find('.k-pane');
					kPanes.height(dimensions.height);

					var pbGrids = splitter.find('.planningboard-grid');
					pbGrids.height(dimensions.height - phHeight);

					platformGridAPI.grids.resize(gridId);
				}

				fetchElements($scope.supplierGridId);
				if (!_.isNil($scope.demandGridId)) {
					fetchElements($scope.demandGridId);
				}
			}

			function setupSplitter(uuid) {
				splitterRootElement = $('.' + uuid + '.planningboardMain');
				var panes = [
					{collapsible: true, size: splitterstate.left + '%', collapsed: splitterstate.leftcollapsed},
					{collapsible: true, size: splitterstate.mid + '%', collapsed: splitterstate.midcollapsed}
				];

				if (!_.isNil($scope.demandGridId)) {
					panes.push({
						collapsible: true,
						size: splitterstate.right + '%',
						collapsed: splitterstate.rightcollapsed
					});
				}

				splitter = splitterRootElement.find('div.planningboardSplitterRoot').kendoSplitter({
					panes: panes,
					orientation: 'horizontal' /* , // done by resize!!
                collapse: function (e) {
                    saveSplitterState();
                },
                expand: function (e) {
                    saveSplitterState();
                } */
				});
				splitter.data('kendoSplitter').bind('resize', onContainerResize);
				if (_.isNil($scope.demandGridId)) {
					splitter.data('kendoSplitter').remove('#ui-layout-east');
				}

				setTimeout(function () {
					// check searchbar
					const isSupplierGridTopPanelShown = platformGridAPI.filters.getFilterOptions($scope.supplierGridId).showMainTopPanel;
					if (isSupplierGridTopPanelShown) {
						if (!_.isNil($scope.demandGridId)) {
							platformGridAPI.filters.showSearch($scope.demandGridId, true);
						}
					}

					let filterOption = null;
					if (!_.isNil($scope.demandGridId)) {
						filterOption = platformGridAPI.filters.getFilterOptions($scope.demandGridId);
					}

					if (!_.isNil(filterOption) && filterOption.showMainTopPanel) {
						platformGridAPI.filters.showSearch($scope.supplierGridId, true);
					}

					planningBoardDataService.activeSearchMode = isSupplierGridTopPanelShown ? 'searchBoth' : '';

					resizeContainers();
				}, 500);

				registerResizeEvents();
			}

			function registerResizeEvents() {
				// TODO use D3 select instead of jQuery !!
				var splitter = $('#planningboardSplitter').data('kendoSplitter');
				splitter.bind('resize', onContainerResize);
			}

			function unregisterResizeEvents() {
				// TODO use D3 select instead of jQuery !!
				var splitter = $('#planningboardSplitter').data('kendoSplitter');
				if (_.isObject(splitter)) {
					splitter.unbind('resize', onContainerResize);
				}

				window.removeEventListener('resize', onContainerResize);
			}

			function onContainerResize() {
				panelWidth = getParentPanelWidth();
				// update();

				saveSplitterState();

				resizeContainers();
			}

			function getParentPanelWidth() {
				return element[0].offsetWidth;
			}

			function makeSureNotAllSplitterAreCollapsed(splitter) {
				// make sure at least one splitter is not collapsed, otherwise the board will be blank.
				if (splitter.leftcollapsed && splitter.midcollapsed && splitter.rightcollapsed) {
					splitter.leftcollapsed = false;
				}
			}
		}
	}]);
