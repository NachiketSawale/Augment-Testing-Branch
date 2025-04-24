/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global _ */

(function (angular) {

	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainCostCodeChartController
	 * @function
	 * @description
	 * Controller for the  list view of Cost Code entities.
	 **/
	angular.module(moduleName).controller('estimateMainCostCodeChartController',
		['$q', '$scope', '$http', 'platformGridControllerService', 'estimateMainCostCodeChartDataService', 'estimateMainUICostCodeChartConfigurationService', 'estimateMainCostCodeChartValidationService', 'platformGridAPI',
			'modelSimulationMasterService', 'estimateMainCostCodeResourceService', 'estimateMainSimulationChartBasicService', 'estimateMainSimulationBasicService', 'platformDatavisService',
			'platformDatavisOrthogonalChartService', 'estimateMainCostCodeChartDialogMainService',
			'modelSimulationTimelineRequestService', 'platformModalService', 'modelSimulationFixedModuleConfigurationService',
			function ($q, $scope, $http, platformGridControllerService, estimateMainCostCodeChartDataService, estimateMainUICostCodeChartConfigurationService, estimateMainCostCodeChartValidationService, platformGridAPI,
				modelSimulationMasterService, estimateMainCostCodeResourceService, estimateMainSimulationChartBasicService, estimateMainSimulationBasicService, platformDatavisService,
				platformDatavisOrthogonalChartService, estimateMainCostCodeChartDialogMainService, modelSimulationTimelineRequestService, platformModalService, modelSimulationFixedModuleConfigurationService
			) {

				let visLink = platformDatavisService.initDatavisContainerController($scope, platformDatavisOrthogonalChartService, estimateMainSimulationChartBasicService.computeData());

				let updateData = function updateData(graphData) {
					visLink.setData(graphData);
				};

				let updateZoom = function updateZoom () {
					let timeRange = modelSimulationMasterService.getZoomedTimerange();
					estimateMainSimulationChartBasicService.setDateZoom(timeRange);
					let graphData = estimateMainSimulationChartBasicService.getGraphFromCash();
					if (graphData !== null){
						updateData(graphData);
					}
				};

				let updateGraphFull = function updateGraphFull (){
					let timeLine = estimateMainCostCodeResourceService.getDefaultTimelineRequest();
					let costCurves = estimateMainCostCodeResourceService.getCurveDtos();

					if(!_.isEmpty(timeLine) && !_.isEmpty(costCurves)){
						estimateMainCostCodeResourceService.getTimeSeriesDataByCostCode().then(function (responseData) {
							let graphData = estimateMainSimulationChartBasicService.computeData(responseData);
							updateData(graphData);
						});
					}
				};

				let updateGraphLocally = function updateGraphLocally (){
					let timeRange = modelSimulationMasterService.getZoomedTimerange();
					estimateMainSimulationChartBasicService.setDateZoom(timeRange);
					let graphData = estimateMainSimulationChartBasicService.getGraphFromCash();
					if (graphData !== null){
						updateData(graphData);
					}
				};

				let chartGenerator = function () { // jshint ignore:line
					let timeLine = estimateMainCostCodeResourceService.getDefaultTimelineRequest();
					let costCurves = estimateMainCostCodeResourceService.getCurveDtos();

					if(_.isEmpty(timeLine) || _.isEmpty(costCurves)){
						platformModalService.showMsgBox('model.simulation.noEvents', 'model.simulation.noEventsTitle', 'info');
						return $q.when([]);
					}

					let emptyGraph = estimateMainSimulationChartBasicService.computeData([]);
					updateData(emptyGraph);

					estimateMainCostCodeResourceService.getTimeSeriesDataByCostCode().then(function (responseData) {
						let graphData = estimateMainSimulationChartBasicService.computeData(responseData);
						updateData(graphData);
					});
				};

				// TODO: graph visualization

				// modelSimulationMasterService.onCurrentTimeChanged.register(estimateMainSimulationChartBasicService.update);

				function timelineChanged() {
					updateGraphFull();
				}

				modelSimulationMasterService.registerTimelineReplaced(timelineChanged);

				// end of graph visualization

				let handleOK = function handleOK(chartSettingsDialogsResponse) {
					estimateMainCostCodeResourceService.setCurvesConfig(chartSettingsDialogsResponse);
					chartGenerator();
				};

				// menu for the time line data selection.
				let timelineSelector = modelSimulationTimelineRequestService.createSelectionMenu({
					dropdown: true,
					updateMenu: function () {
						if ($scope.tools) {
							$scope.tools.update();
						}
					}

				});

				timelineSelector.registerSelectionChanged(function onRequestSelected() {
					estimateMainCostCodeResourceService.setDefaultTimelineRequest(timelineSelector.getSelection());
					if (estimateMainCostCodeResourceService.getCurveDtos().length > 0)
					{
						chartGenerator();
					}
					else{
						estimateMainCostCodeChartDialogMainService.showDialog(handleOK);
					}

				});

				let recalculate = function recalculate () {
					chartGenerator();
				};

				let toggleCouple2Timeline = function toggleCouple2Timeline (){
					if (!estimateMainSimulationChartBasicService.isCoupled2Timeline()){
						modelSimulationMasterService.registerZoomedTimerangeChanged(updateZoom);
						updateZoom();
						estimateMainSimulationChartBasicService.setCoupled2Timeline();
					}
					else{
						modelSimulationMasterService.unregisterZoomedTimerangeChanged(updateZoom);
						estimateMainSimulationChartBasicService.setDateZoom(undefined);
						let graphData = estimateMainSimulationChartBasicService.getGraphFromCash();
						if (graphData !== null){
							updateData(graphData);
						}
						estimateMainSimulationChartBasicService.unSetCoupled2Timeline();
					}
				};

				$scope.recalculate = recalculate;

				$scope.checkValidator = estimateMainCostCodeChartDialogMainService.checkValidator;

				let toolItems = {};
				let toolbarCalculationSettingsItems = [
					{
						id: 'chart-recalculate',
						caption: 'estimate.main.simulationChart.toolbar.recalculateCaption',
						iconClass: 'control-icons ico-recalculate',
						type: 'item',
						sort: 100,
						fn: recalculate,
						disabled: function () {
						}
					},
					timelineSelector.menuItem,
					{
						id: 'chart-settings',
						caption: 'estimate.main.simulationChart.toolbar.settings',
						iconClass: 'tlb-icons ico-settings',
						type: 'item',
						sort: 100,
						fn: function () {
							estimateMainCostCodeChartDialogMainService.showDialog(handleOK);
						},
						disabled: function () {
						}
					}
				];

				let toolbarDrawingSettingsItems = [
					{
						id: 'chart-couple2Timeline',
						caption: 'estimate.main.simulationChart.toolbar.couple2TimelineCaption',
						iconClass: 'tlb-icons ico-couple2timeline',
						type: 'check',
						value: estimateMainSimulationChartBasicService.isCoupled2Timeline(),
						sort: 100,
						fn: toggleCouple2Timeline,
						disabled: function () {
						}
					},
					{
						id: 'toggle-markers',
						caption: 'estimate.main.simulationChart.toolbar.toggleMarkersCaption',
						type: 'check',
						value: estimateMainSimulationChartBasicService.areMarkersOn(),
						iconClass: 'tlb-icons ico-marker',
						fn: function (){
							estimateMainSimulationChartBasicService.toggelMarkers();
							this.value = estimateMainSimulationChartBasicService.areMarkersOn();
							let graphData = estimateMainSimulationChartBasicService.getGraphFromCash();
							if (graphData !== null){
								updateData(graphData);
							}
						}
					},
					{
						id: 'toggle-labels',
						caption: 'estimate.main.simulationChart.toolbar.toggleLabelsCaption',
						type: 'check',
						value: estimateMainSimulationChartBasicService.areLabelsOn(),
						iconClass: 'control-icons ico-text',
						fn: function (){
							estimateMainSimulationChartBasicService.toggelLabels();
							estimateMainSimulationChartBasicService.areLabelsOn();
							let graphData = estimateMainSimulationChartBasicService.getGraphFromCash();
							if (graphData !== null){
								updateData(graphData);
							}
						}
					}
				];

				let toolbar = [
					{
						id: 'draw',
						type: 'sublist',
						caption: 'test3',
						list: {
							cssClass: 'tools',
							items: toolbarDrawingSettingsItems
						}
					},{
						id: 'calc',
						type: 'sublist',
						caption: 'test1',
						list: {
							cssClass: 'tools',
							items: toolbarCalculationSettingsItems
						}
					}
				];

				toolItems = {
					cssClass: 'tools',
					showImages: true,
					showTitles: true,
					items: toolbar
				};

				$scope.setTools(toolItems, false);

				modelSimulationMasterService.onCurrentTimeChanged.register(updateGraphLocally);
				modelSimulationFixedModuleConfigurationService.updateProjectSelectionSource();

				$scope.tools.update();
				// container toolbar

				// un-register on destroy
				$scope.$on('$destroy', function () {
					// Graph Visualization
					modelSimulationMasterService.onCurrentTimeChanged.unregister(updateGraphLocally);
					// modelSimulationMasterService.onCurrentTimeChanged.unregister(estimateMainSimulationChartBasicService.update);
					modelSimulationMasterService.unregisterTimelineReplaced(timelineChanged);
					modelSimulationMasterService.unregisterZoomedTimerangeChanged(updateZoom);
					estimateMainCostCodeChartDialogMainService.deleteCostCodeCache();
					estimateMainSimulationChartBasicService.clearCaches();

					timelineSelector.destroy();
				});
			}
		]);
})(angular);
