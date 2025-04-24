/**
 * Created by sprotte on 06.02.2015.
 */
angular.module('scheduling.main').controller('schedulingMainGANTTController', ['$scope', 'schedulingMainGANTTService', 'schedulingMainService', 'platformPermissionService', 'schedulingMainPrintingProviderService',
	function($scope, gs, activityservice, platformPermissionService, printing) {
		'use strict';

		var ganttTools, containerScope;

		containerScope = $scope.$parent;
		while (containerScope && !Object.prototype.hasOwnProperty.call(containerScope, 'setTools')) {
			containerScope = containerScope.$parent;
		}

		ganttTools = [{
			id: 'drawActivity',
			caption: 'scheduling.main.addNewTip',
			type: 'check',
			iconClass: 'tlb-icons ico-draw',
			fn: function() {
				containerScope.tools.update(); // refresh toolbar button
				containerScope.toggleDrawActivity(this);
			},
			disabled: function() {
				// Permission check
				if (!platformPermissionService.hasCreate(containerScope.getContainerUUID().toLowerCase())) {
					return true;
				}

				return !gs.getSettings(containerScope.containerID) || !gs.getActivities(containerScope.containerID);
			}
		}, {
			id: 'addHammockActivity',
			caption: 'scheduling.main.addHammockActivity',
			type: 'check',
			iconClass: 'control-icons ico-hammock',
			fn: function() {
				containerScope.tools.update(); // refresh toolbar button
				containerScope.toggleHammockMode(this);
			},
			disabled: function() {
				// Permission check
				if (!platformPermissionService.hasWrite(containerScope.getContainerUUID().toLowerCase())) {
					return true;
				}

				return gs.getHammocks().length === 0;
			}
		}, {
			id: 'showSettings',
			caption: 'scheduling.main.showSettingsTip',
			type: 'item',
			iconClass: 'tlb-icons ico-settings-doc',
			fn: function() {
				containerScope.turnoffTooltips();
				gs.showSettings(containerScope.containerID);
			},
			disabled: disabledCommand
		}, {
			id: 'print',
			caption: 'scheduling.main.printTip',
			type: 'item',
			iconClass: 'tlb-icons ico-print',
			disabled: disabledPrint,
			fn: function() {
				containerScope.turnoffTooltips();
				printing.charttype = 'gantt';
				gs.showPrintSettings(containerScope.containerID);
			}
		}, {
			id: 'zoomFull',
			caption: 'scheduling.main.zoomFull',
			type: 'item',
			iconClass: 'tlb-icons ico-zoom-100',
			disabled: disabledCommand,
			fn: function() {
				containerScope.resetZoom();
			}
		}, {
			id: 'zoomIn',
			caption: 'scheduling.main.zoomIn',
			type: 'item',
			iconClass: 'tlb-icons ico-zoom-in',
			disabled: disabledCommand,
			fn: function() {
				containerScope.zoomIn();
			}
		}, {
			id: 'zoomOut',
			caption: 'scheduling.main.zoomOut',
			type: 'item',
			iconClass: 'tlb-icons ico-zoom-out',
			disabled: disabledCommand,
			fn: function() {
				containerScope.zoomOut();
			}
		}, {
			id: 'templates',
			caption: 'scheduling.main.templates',
			type: 'item',
			permission: 'fb9a635fb69e4867aad35776725fb24d#e',
			iconClass: 'tlb-icons ico-template-config',
			disabled: disabledCommand,
			fn: function() {
				gs.showTemplates(containerScope.containerID);
			}
		}];

		containerScope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: ganttTools
		});

		gs.dataUpdated.register(updateToolbars);

		function updateToolbars() {
			containerScope.tools.update();
		}

		function disabledCommand() {
			return !gs.getSettings(containerScope.containerID) || !gs.getActivities(containerScope.containerID);
		}

		function disabledPrint() {
			var cannotprint = !(gs.getSettings(containerScope.containerID) && gs.getActivities(containerScope.containerID) && gs.activities.length > 0);
			return cannotprint;
		}

		$scope.$on('$destroy', function cleanupHandlers() {
			gs.dataUpdated.unregister(updateToolbars);
		});

	}
]);