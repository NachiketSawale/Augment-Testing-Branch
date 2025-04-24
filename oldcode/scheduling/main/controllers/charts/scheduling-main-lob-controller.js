/* global moment */
/**
 * Created by sprotte on 06.02.2015.
 */
angular.module('scheduling.main').controller('schedulingMainLobController', ['$scope', '$translate', 'schedulingMainLobService', 'schedulingMainPrintingProviderService',
	function ($scope, t, ls, printing) {
		'use strict';

		var lobTools, containerScope;

		containerScope = $scope.$parent;
		while (containerScope && !Object.prototype.hasOwnProperty.call(containerScope, 'setTools')) {
			containerScope = containerScope.$parent;
		}

		lobTools = [{
			id: 'showSettings',
			caption: t.instant('scheduling.main.showSettingsTip'),
			type: 'item',
			iconClass: 'tlb-icons ico-settings-doc',
			fn: function () {
				ls.showSettings(containerScope.containerID);
			},
			disabled: activeCommand
		},
		{
			id: 'print',
			caption: t.instant('scheduling.main.printTip'),
			type: 'item',
			iconClass: 'tlb-icons ico-print',
			disabled: activeCommand,
			fn: function () {
				// trigger generating print data
				var filename = 'LoB.pdf';
				if (ls.schedule) {
					filename = ls.schedule.Code + '.pdf';
					printing.header1 = t.instant('scheduling.main.printing.project') + ': ' + ls.project.ProjectNo + ' ' +
							ls.project.ProjectName;
					printing.header2 = t.instant('scheduling.main.schedule') + ': ' + ls.schedule.Code + ' ' +
							ls.schedule.DescriptionInfo.Description;
				} else {
					printing.header1 = t.instant('scheduling.main.printing.scheduleCollection');
				}
				printing.header = printing.header1 + ' / ' + printing.header2;
				printing.filename = filename;
				printing.footer = t.instant('scheduling.main.printing.date') + ': ' + moment.utc().format('LL');
				printing.charttype = 'lob';
				printing.logo = ls.logo;
				ls.showPrintSettings(containerScope.containerID);
			}
		},
		{
			id: 'zoomMode',
			caption: 'scheduling.main.zoomMode',
			type: 'sublist',
			list: {
				cssClass: 'radio-group',
				activeValue: 'horizontal',
				showTitles: true,
				items: [{
					id: 'toggleVertical',
					caption: 'scheduling.main.toggleVertical',
					type: 'radio',
					value: 'vertical',
					iconClass: 'tlb-icons ico-zoom-vertical',
					fn: function () {
						containerScope.verticalMode();
					},
					disabled: activeCommand
				},
				{
					id: 'toggleHorizontal',
					caption: 'scheduling.main.toggleHorizontal',
					type: 'radio',
					value: 'horizontal',
					iconClass: 'tlb-icons ico-zoom-horizontal',
					fn: function () {
						containerScope.horizontalMode();
					},
					disabled: activeCommand
				}
				]
			}
		},
		{
			id: 'zoomFull',
			caption: 'scheduling.main.zoomFull',
			type: 'item',
			iconClass: 'tlb-icons ico-zoom-100',
			fn: function () {
				containerScope.resetZoom();
			},
			disabled: activeCommand
		},
		{
			id: 'zoomIn',
			caption: 'scheduling.main.zoomIn',
			type: 'item',
			iconClass: 'tlb-icons ico-zoom-in',
			fn: function () {
				containerScope.zoomIn();
			},
			disabled: activeCommand
		},
		{
			id: 'zoomOut',
			caption: 'scheduling.main.zoomOut',
			type: 'item',
			iconClass: 'tlb-icons ico-zoom-out',
			fn: function () {
				containerScope.zoomOut();
			},
			disabled: activeCommand
		}
		];

		containerScope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: lobTools
		});

		ls.dataUpdated.register(updateToolbars);

		function updateToolbars() {
			containerScope.tools.update();
		}

		function activeCommand() {
			return !ls.getSettings(containerScope.containerID) || !ls.hasLocations;
		}

		$scope.$on('$destroy', function cleanupHandlers() {
			ls.dataUpdated.unregister(updateToolbars);
		});

	}
]);
