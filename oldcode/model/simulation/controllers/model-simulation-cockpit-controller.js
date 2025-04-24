/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc controller
	 * @name model.simulation.controller:modelSimulationCockpitController
	 * @description Controller for the simulation cockpit container.
	 */
	angular.module('model.simulation').controller('modelSimulationCockpitController', modelSimulationCockpitController);

	modelSimulationCockpitController.$inject = ['$scope', 'moment', '$translate',
		'modelSimulationMasterService', 'platformModalService', 'projectMainProjectSelectionService',
		'modelViewerFixedModuleConfigurationService', 'modelSimulationFixedModuleConfigurationService',
		'modelSimulationTimelineLoadingService'];

	function modelSimulationCockpitController($scope, moment, $translate, modelSimulationMasterService, platformModalService,
		projectMainProjectSelectionService, modelViewerFixedModuleConfigurationService,
		modelSimulationFixedModuleConfigurationService, modelSimulationTimelineLoadingService) {

		modelSimulationFixedModuleConfigurationService.updateProjectSelectionSource();

		modelViewerFixedModuleConfigurationService.updateModelSelectionSource();

		const simState = {
			loaded: false,
			playing: false
		};

		$scope.setState = function (isLoaded, isPlaying) {
			$scope.$evalAsync(function () {
				simState.loaded = isLoaded;
				simState.playing = isPlaying;
				$scope.tools.update();
			});
		};

		$scope.isSimulationLoaded = function () {
			return simState.loaded;
		};

		$scope.isSimulationPlaying = function () {
			return $scope.isSimulationLoaded() && simState.playing;
		};

		$scope.isSelectionReady = false;

		function updateSelectionReady() {
			$scope.$evalAsync(function () {
				$scope.isSelectionReady = projectMainProjectSelectionService.getSelectedProjectId();
				$scope.tools.update();
			});
		}

		projectMainProjectSelectionService.onSelectedProjectChanged.register(updateSelectionReady);

		function loadedSimulationsChanged() {
			modelSimulationMasterService.pause();
			if (modelSimulationMasterService.isTimelineReady()) {
				$scope.setState(true, false);
				$scope.$evalAsync(function () {
					$scope.timerange = modelSimulationMasterService.getTimerange();
				});
			} else {
				$scope.setState(false, false);
			}
		}

		modelSimulationMasterService.registerTimelineListChanged(loadedSimulationsChanged);

		function startLoad() {
			$scope.setState(false, false);
		}

		modelSimulationTimelineLoadingService.registerStartLoad(startLoad);
		modelSimulationTimelineLoadingService.unregisterStartLoad(startLoad);

		const toolItems = [{
			id: 'open',
			caption: 'model.simulation.open',
			iconClass: 'tlb-icons ico-open1',
			type: 'item',
			sort: 100,
			fn: function () {
				modelSimulationTimelineLoadingService.loadTimeline();
			},
			disabled: function () {
				return !$scope.isSelectionReady;
			}
		}, {
			id: 'animationControl',
			caption: 'model.simulation.animationControl',
			type: 'sublist',
			list: {
				showTitles: true,
				items: [{
					id: 'play',
					caption: 'model.simulation.play',
					iconClass: 'tlb-icons ico-play',
					type: 'item',
					sort: 200,
					fn: function () {
						modelSimulationMasterService.play();
						$scope.setState(true, true);
					},
					disabled: function () {
						return !$scope.isSimulationLoaded();
					}
				}, {
					id: 'pause',
					caption: 'model.simulation.pause',
					iconClass: 'tlb-icons ico-break',
					type: 'item',
					sort: 300,
					fn: function () {
						modelSimulationMasterService.pause();
						$scope.setState(true, false);
					},
					disabled: function () {
						return !$scope.isSimulationPlaying();
					}
				}, {
					id: 'stop',
					caption: 'model.simulation.stop',
					iconClass: 'tlb-icons ico-stop',
					type: 'item',
					sort: 400,
					fn: function () {
						modelSimulationMasterService.pause();
						modelSimulationMasterService.rewind();
					},
					disabled: function () {
						return !$scope.isSimulationLoaded();
					}
				}]
			}
		}, {
			id: 'simulationSpeed',
			caption: 'model.simulation.simulationSpeed',
			type: 'sublist',
			list: {
				showTitles: true,
				items: [{
					id: 'slow',
					caption: 'model.simulation.slower',
					iconClass: 'tlb-icons ico-slow',
					type: 'item',
					sort: 500,
					fn: function () {
						modelSimulationMasterService.setCurrentSimulationSpeed(modelSimulationMasterService.getCurrentSimulationSpeed() - 1);
						$scope.tools.update();
					},
					disabled: function () {
						return !$scope.isSimulationLoaded() || (modelSimulationMasterService.getCurrentSimulationSpeed() <= modelSimulationMasterService.getMinSimulationSpeed());
					}
				}, {
					id: 'fast',
					caption: 'model.simulation.faster',
					iconClass: 'tlb-icons ico-fast',
					type: 'item',
					sort: 600,
					fn: function () {
						modelSimulationMasterService.setCurrentSimulationSpeed(modelSimulationMasterService.getCurrentSimulationSpeed() + 1);
						$scope.tools.update();
					},
					disabled: function () {
						return !$scope.isSimulationLoaded() || (modelSimulationMasterService.getCurrentSimulationSpeed() >= modelSimulationMasterService.getMaxSimulationSpeed());
					}
				}]
			}
		}];
		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools'
		});
		$scope.tools.items = toolItems;
		$scope.tools.update();

		$scope.navBar = {
			isDisabled: function () {
				return !$scope.isSimulationLoaded();
			},
			monthBackText: $translate.instant('model.simulation.monthBack'),
			monthForwardText: $translate.instant('model.simulation.monthForward'),
			weekBackText: $translate.instant('model.simulation.weekBack'),
			weekForwardText: $translate.instant('model.simulation.weekForward'),
			dayBackText: $translate.instant('model.simulation.dayBack'),
			dayForwardText: $translate.instant('model.simulation.dayForward'),
			goToTimeText: $translate.instant('model.simulation.goTo'),
			moveRelative: function (count, unit) {
				const time = modelSimulationMasterService.getCurrentTime();
				time.add(count, unit);
				modelSimulationMasterService.moveToTime(time);
			},
			moveAbsolute: function () {
				const optionsDialogConfig = {
					width: '600px',
					resizeable: true,
					headerTextKey: $translate.instant('model.simulation.goToTitle'),
					bodyTemplateUrl: globals.appBaseUrl + 'model.simulation/partials/model-simulation-datetime-dialog-template.html',
					backdrop: true,
					showOkButton: true,
					showCancelButton: true,
					dataItem: {
						time: modelSimulationMasterService.getCurrentTime()
					}
				};
				platformModalService.showDialog(optionsDialogConfig).then(function (result) {
					if (result.ok) {
						modelSimulationMasterService.moveToTime(moment(optionsDialogConfig.dataItem.time));
					}
				});
			}
		};

		function updateAnimationState() {
			if (simState.loaded) {
				const animState = modelSimulationMasterService.getAnimationState();
				$scope.setState(true, animState.isRunning);
			}
		}

		modelSimulationMasterService.onStartStopAnimation.register(updateAnimationState);

		$scope.$evalAsync(function () {
			if (modelSimulationMasterService.isTimelineReady()) {
				const animState = modelSimulationMasterService.getAnimationState();
				$scope.setState(true, animState.isRunning);
				$scope.timerange = modelSimulationMasterService.getTimerange();
			}
		});

		function updateCurrentTime() {
			$scope.$evalAsync(function () {
				if (modelSimulationMasterService.isTimelineReady()) {
					$scope.navBar.currentDateText = modelSimulationMasterService.getCurrentTime().format('LL');
				} else {
					$scope.navBar.currentDateText = $translate.instant('model.simulation.noData');
				}
			});
		}

		updateCurrentTime();
		modelSimulationMasterService.onCurrentTimeChanged.register(updateCurrentTime);

		updateSelectionReady();

		$scope.$on('$destroy', function () {
			modelSimulationMasterService.unregisterTimelineListChanged(loadedSimulationsChanged);
			modelSimulationMasterService.onCurrentTimeChanged.unregister(updateCurrentTime);
			projectMainProjectSelectionService.onSelectedProjectChanged.unregister(updateSelectionReady);
			modelSimulationMasterService.onStartStopAnimation.unregister(updateAnimationState);
		});
	}
})(angular);
