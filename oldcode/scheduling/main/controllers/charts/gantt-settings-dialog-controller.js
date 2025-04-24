/* global globals */
/**
 * Created by sprotte on 27.02.2015.
 */
/* jshint -W072 */
angular.module('scheduling.main').controller('schedulingMainSettingsDialogController', ['_', '$scope', '$injector', '$timeout',
	'schedulingMainChartSettingsService', '$sce', '$translate', '$modalInstance', 'schedulingMainGANTTService',
	'schedulingMainActivityLookupService', 'platformGridAPI',
	function Controller(_, $scope, $injector, $timeout,
		settingsservice, $sce, t, $modalInstance, gs, activitylookupservice, platformGridAPI) {
		'use strict';
		var shouldReload = false;
		$scope.modalOptions = {
			actionButtonText: t.instant('cloud.common.ok'),
			ok: OK,
			closeButtonText: t.instant('cloud.common.cancel'),
			cancel: cancel,
			onTabSelect: onTabSelect,
			headerText: t.instant('scheduling.main.chart-settings.headerGANTT'),
			tabVersions: t.instant('scheduling.main.chart-settings.tab-Versions'),
			tabSetting: t.instant('scheduling.main.chart-settings.tab-Setting'),
			tabProgress: t.instant('scheduling.main.chart-settings.tab-Progress'),
			tabBarInformation: t.instant('scheduling.main.barInformation.barInformation')
		};

		setupTabs();
		setupMoreDropdowns();
		setupVersionTab();
		setupProgresslineTab();
		setupBarinformationTab();

		function settings() {
			return settingsservice.getGANTTsettings(gs.lastContainerID);
		}

		function templatemap() {
			return settingsservice.getTemplatemap(gs.lastContainerID);
		}

		function setupTabs() {
			$scope.tabs = [{
				title: $scope.modalOptions.tabSetting,
				content: globals.appBaseUrl + 'scheduling.main/templates/chartsettings/tab-settings.html',
				active: true
			}, {
				title: $scope.modalOptions.tabVersions,
				content: globals.appBaseUrl + 'scheduling.main/templates/chartsettings/tab-versions.html',
				gridid: 'A4442063CF6743F59201CCB5B864ED6C', // Please do not copy and paste this UUID,
				reloadTab: true
			}, {
				title: $scope.modalOptions.tabProgress,
				content: globals.appBaseUrl + 'scheduling.main/templates/chartsettings/tab-progress.html',
				reloadTab: true
			}, {
				title: $scope.modalOptions.tabBarInformation,
				content: globals.appBaseUrl + 'scheduling.main/templates/chartsettings/tab-barinformation.html',
				reloadTab: true
			}];
		}

		function OK() {
			settingsservice.saveSettings(gs.lastContainerID);
			if (shouldReload) {
				gs.load(gs.lastContainerID)
					.then(gs.loadBaselines(gs.lastContainerID))
					.then(gs.update); // we only load if we changed more than just settings.
				// trigger window resize for some additional layout updates
				gs.forceLayoutUpdate.fire();
			} else {
				gs.update();
				// trigger window resize for some additional layout updates
				gs.forceLayoutUpdate.fire();
			}
			$modalInstance.close({
				ok: true
			});
		}

		function onTabSelect(tab) {
			if (tab.reloadTab) {
				shouldReload = true;
			}
		}

		function cancel() {
			// gs.lastContainerID = null;
			$modalInstance.close({
				cancel: true
			});
		}

		function setupMoreDropdowns() {
			$scope.settings = {};

			// Relationships
			$scope.settings.showRelationships = settings().showRelationships;
			$scope.settings.showRelationshipsOpt = {
				ctrlId: 'showRelationships',
				labelText: t.instant('scheduling.main.chart-settings.showRelationships')
			};
			$scope.settings.changeShowRelationships = function () {
				settings().showRelationships = $scope.settings.showRelationships;
			};

			// Simple Relationships
			$scope.settings.showSeparatedRelationships = settings().showSeparatedRelationships;
			$scope.settings.showSeparatedRelationshipsOpt = {
				ctrlId: 'showSeparatedRelationships',
				labelText: t.instant('scheduling.main.chart-settings.showSeparatedRelationships')
			};
			$scope.settings.changeshowSeparatedRelationships = function () {
				settings().showSeparatedRelationships = $scope.settings.showSeparatedRelationships;
			};

			// Events
			$scope.settings.showEvents = settings().showEvents;
			$scope.settings.showEventsOpt = {
				ctrlId: 'showEvents',
				labelText: t.instant('scheduling.main.chart-settings.showEvents')
			};
			$scope.settings.changeShowEvents = function () {
				settings().showEvents = $scope.settings.showEvents;
			};

			// CriticalPath
			$scope.settings.showCritical = settings().showCritical;
			$scope.settings.showCriticalOpt = {
				ctrlId: 'showCritical',
				labelText: t.instant('scheduling.main.chart-settings.showCritical')
			};
			$scope.settings.changeShowCritical = function () {
				settings().showCritical = $scope.settings.showCritical;
			};

			// Timelines
			$scope.settings.showTimelines = settings().showTimelines;
			$scope.settings.showTimelinesOpt = {
				ctrlId: 'showTimelines',
				labelText: t.instant('scheduling.main.chart-settings.showTimelines')
			};
			$scope.settings.changeShowTimelines = function () {
				settings().showTimelines = $scope.settings.showTimelines;
			};

			// Weekends days
			$scope.settings.showWeekends = settings().showWeekends;
			$scope.settings.showWeekendsOpt = {
				ctrlId: 'showWeekends',
				labelText: t.instant('scheduling.main.chart-settings.showWeekends')
			};
			$scope.settings.changeShowWeekends = function () {
				settings().showWeekends = $scope.settings.showWeekends;
			};

			// Exception days
			$scope.settings.showHolidays = settings().showHolidays;
			$scope.settings.showHolidaysOpt = {
				ctrlId: 'showHolidays',
				labelText: t.instant('scheduling.main.chart-settings.showHolidays')
			};
			$scope.settings.changeShowHolidays = function () {
				settings().showHolidays = $scope.settings.showHolidays;
			};

			// Vertical lines
			$scope.settings.showVerticalLines = settings().showVerticalLines;
			$scope.settings.showVerticalLinesOpt = {
				ctrlId: 'showVerticalLines',
				labelText: t.instant('scheduling.main.chart-settings.showVerticalLines')
			};
			$scope.settings.changeShowVerticalLines = function () {
				settings().showVerticalLines = $scope.settings.showVerticalLines;
			};

			// Today-line
			$scope.settings.showToday = settings().verticalLines[0];
			$scope.settings.showTodayOpt = {
				ctrlId: 'showToday',
				labelText: t.instant('scheduling.main.chart-settings.showToday')
			};
			$scope.settings.changeShowToday = function () {
				settings().verticalLines[0] = $scope.settings.showToday;
			};

			// Beginning of week
			$scope.settings.showWeek = settings().verticalLines[1];
			$scope.settings.showWeekOpt = {
				ctrlId: 'showWeek',
				labelText: t.instant('scheduling.main.chart-settings.showWeek')
			};
			$scope.settings.changeShowWeek = function () {
				settings().verticalLines[1] = $scope.settings.showWeek;
			};

			// Beginning of months
			$scope.settings.showMonth = settings().verticalLines[2];
			$scope.settings.showMonthOpt = {
				ctrlId: 'showMonth',
				labelText: t.instant('scheduling.main.chart-settings.showMonth')
			};
			$scope.settings.changeShowMonth = function () {
				settings().verticalLines[2] = $scope.settings.showMonth;
			};

			// Timeaxis on bottom
			$scope.settings.showBottomTimeaxis = settings().timescalePosition === 'both';
			$scope.settings.showBottomTimeaxisOpt = {
				ctrlId: 'showBottomTimeaxis',
				labelText: t.instant('scheduling.main.chart-settings.showBottomTimeaxis')
			};
			$scope.settings.changeShowBottomTimeaxis = function () {
				settings().timescalePosition = $scope.settings.showBottomTimeaxis ? 'both' : 'top';
			};

			// Show note icon for activities that have some note text
			$scope.settings.showNoteIcon = settings().showNoteIcon;
			$scope.settings.showNoteIconOpt = {
				ctrlId: 'showNoteIcon',
				labelText: t.instant('scheduling.main.chart-settings.showNoteIcon')
			};
			$scope.settings.changeShowNoteIcon = function () {
				settings().showNoteIcon = $scope.settings.showNoteIcon;
			};
			// Show hammock visualization
			$scope.settings.showHammock = !!settings().showHammock;
			$scope.settings.showHammockOpt = {
				ctrlId: 'showHammock',
				labelText: t.instant('scheduling.main.chart-settings.showHammock')
			};
			$scope.settings.changeShowHammock = function () {
				settings().showHammock = $scope.settings.showHammock;
			};

			// Show current baselines in version dialog
			$scope.settings.showCurrentBaseline = settings().showCurrentBaseline;
			$scope.settings.showCurrentBaselineOpt = {
				ctrlId: 'showCurrentBaseline',
				labelText: t.instant('scheduling.main.chart-settings.offerCurrentBaselineEntries')
			};
			$scope.settings.changeShowCurrentBaseline = function () {
				if (settings().showCurrentBaseline !== $scope.settings.showCurrentBaseline) {
					settings().showCurrentBaseline = $scope.settings.showCurrentBaseline;
					settingsservice.updateBaselinetemplates(settingsservice.baselines, gs.lastContainerID);
					refreshVersionGrid();
				}
			};

			// Show planned baselines in version dialog
			$scope.settings.showPlannedBaseline = settings().showPlannedBaseline;
			$scope.settings.showPlannedBaselineOpt = {
				ctrlId: 'showPlannedBaseline',
				labelText: t.instant('scheduling.main.chart-settings.offerPlannedBaselineEntries')
			};
			$scope.settings.changeShowPlannedBaseline = function () {
				if (settings().showPlannedBaseline !== $scope.settings.showPlannedBaseline) {
					settings().showPlannedBaseline = $scope.settings.showPlannedBaseline;
					settingsservice.updateBaselinetemplates(settingsservice.baselines, gs.lastContainerID);
					refreshVersionGrid();
				}
			};
		}

		function setupVersionTab() {
			var grid;
			$scope.versionGrid = {
				state: $scope.tabs[1].gridid,
				domains: {
					'layer': {
						'datatype': 'number',
						'regex': '^[\\d]{1,2}$',
						'defaultvalue': 1
					}
				}
			};
			// Check if grid existId
			grid = platformGridAPI.grids.element('id', $scope.tabs[1].gridid);
			if (!grid) {
				platformGridAPI.grids.config({
					data: templatemap(),
					columns: [{
						id: 'visible',
						domain: 'boolean',
						formatter: 'boolean',
						editor: 'boolean',
						field: 'visible',
						name: t.instant('scheduling.main.chart-settings.show'),
						width: 35
					}, {
						id: 'category',
						domain: 'description',
						field: 'category',
						name: t.instant('scheduling.main.chart-settings.category'),
						formatter: 'description',
						width: 70,
						// cssClass: 'font-bold'
					}, {
						id: 'version',
						domain: 'description',
						field: 'versionname',
						name: t.instant('scheduling.main.chart-settings.version'),
						formatter: 'description',
						width: 120
					}, {
						id: 'template',
						domain: 'select',
						editor: 'select',
						editorOptions: {
							items: settingsservice.templates,
							serviceName: 'schedulingMainChartSettingsService',
							serviceMethod: 'getTemplates',
							valueMember: 'id',
							displayMember: 'name'
						},
						formatter: 'select',
						field: 'templatekey',
						name: t.instant('scheduling.main.chart-settings.template'),
						width: 160
					}, {
						id: 'layer',
						domain: 'integer',
						field: 'layer',
						name: t.instant('scheduling.main.chart-settings.layer'),
						editor: 'integer',
						formatter: 'integer',
						width: 40
					}, {
						id: 'overrideColors',
						domain: 'boolean',
						formatter: 'boolean',
						editor: 'boolean',
						field: 'overrideColors',
						name: t.instant('scheduling.main.chart-settings.overrideColors'),
						width: 150
					}, ],
					id: $scope.tabs[1].gridid,
					options: {
						tree: false,
						showFooter: false
					}
				});
			}

			$scope.$on('$destroy', function cleanupHandlers() {
				settingsservice.baselinesChanged.unregister(refreshVersionGrid);
				// stop recycling of GRID
				platformGridAPI.grids.unregister($scope.tabs[1].gridid);
			});

			// we will now need to react to settings service's baselinesChanged event and re-initialize
			// the version tab.
			settingsservice.baselinesChanged.register(refreshVersionGrid);

			settingsservice.loadBaselines(gs.lastContainerID); // now we trigger the initial loading of baselines
		}

		function gridIsReady(gridid) {
			var localgrid;
			var result = false;
			if (platformGridAPI.grids.exist(gridid)) {
				localgrid = platformGridAPI.grids.element('id', gridid);
				if (localgrid.instance && localgrid.dataView) {
					result = true;
				}
			}

			return result;
		}

		function setupProgresslineTab() {
			$scope.pl = {
				pglobal: {
					ctrlId: 'pglobal',
					labelText: t.instant('scheduling.main.chart-settings.showProgresslines')
				},
				p1: {
					ctrlId: 'p1',
					labelText: t.instant('scheduling.main.chart-settings.showProgressline') + ' 1'
				},
				p2: {
					ctrlId: 'p2',
					labelText: t.instant('scheduling.main.chart-settings.showProgressline') + ' 2'
				},
				p3: {
					ctrlId: 'p3',
					labelText: t.instant('scheduling.main.chart-settings.showProgressline') + ' 3'
				},
				p4: {
					ctrlId: 'p4',
					labelText: t.instant('scheduling.main.chart-settings.showProgressline') + ' 4'
				},
				p5: {
					ctrlId: 'p4',
					labelText: t.instant('scheduling.main.chart-settings.showProgressline') + ' 5'
				}
			};
			$scope.settings.showProgresslines = settings().showProgresslines;
			$scope.colorOpt = {
				items: [{
					name: '#BFDDF2',
					id: 1,
					text: t.instant('scheduling.main.colors.ico-color-blue-light'),
					res: 'control-icons ico-color-blue-light'
				}, {
					name: '#7FB2D7',
					id: 2,
					text: t.instant('scheduling.main.colors.ico-color-blue-dark'),
					res: 'control-icons ico-color-blue-dark'
				}, {
					name: '#E1BEE7',
					id: 3,
					text: t.instant('scheduling.main.colors.ico-color-purple-light'),
					res: 'control-icons ico-color-purple-light'
				}, {
					name: '#BA68C8',
					id: 4,
					text: t.instant('scheduling.main.colors.ico-color-purple-dark'),
					res: 'control-icons ico-color-purple-dark'
				}, {
					name: '#C5CAE9',
					id: 5,
					text: t.instant('scheduling.main.colors.ico-color-indigo-light'),
					res: 'control-icons ico-color-indigo-light'
				}, {
					name: '#7986CB',
					id: 6,
					text: t.instant('scheduling.main.colors.ico-color-indigo-dark'),
					res: 'control-icons ico-color-indigo-dark'
				}, {
					name: '#B2EBF2',
					id: 7,
					text: t.instant('scheduling.main.colors.ico-color-cyan-light'),
					res: 'control-icons ico-color-cyan-light'
				}, {
					name: '#4DD0E1',
					id: 8,
					text: t.instant('scheduling.main.colors.ico-color-cyan-dark'),
					res: 'control-icons ico-color-cyan-dark'
				}, {
					name: '#C8E6C9',
					id: 9,
					text: t.instant('scheduling.main.colors.ico-color-green-light'),
					res: 'control-icons ico-color-green-light'
				}, {
					name: '#81C784',
					id: 10,
					text: t.instant('scheduling.main.colors.ico-color-green-dark'),
					res: 'control-icons ico-color-green-dark'
				}, {
					name: '#FFE0B2',
					id: 11,
					text: t.instant('scheduling.main.colors.ico-color-orange-light'),
					res: 'control-icons ico-color-orange-light'
				}, {
					name: '#FFB74D',
					id: 12,
					text: t.instant('scheduling.main.colors.ico-color-orange-dark'),
					res: 'control-icons ico-color-orange-dark'
				}, {
					name: '#E0E0E0',
					id: 13,
					text: t.instant('scheduling.main.colors.ico-color-grey-light'),
					res: 'control-icons ico-color-grey-light'
				}, {
					name: '#BDBDBD',
					id: 14,
					text: t.instant('scheduling.main.colors.ico-color-grey-dark'),
					res: 'control-icons ico-color-grey-dark'
				}, {
					name: '#000000',
					id: 15,
					text: t.instant('scheduling.main.colors.ico-color-black'),
					res: 'control-icons ico-color-black'
				}, {
					name: '#FF0000',
					id: 16,
					text: t.instant('scheduling.main.colors.ico-color-red'),
					res: 'control-icons ico-color-red'
				}],
				useLocalIcons: true,
				valueMember: 'name',
				displayMember: 'text',
				inputDomain: 'description',
				popupCssClass: 'img-40-20'
			};

			var progresslines = settingsservice.getProgresslines(gs.lastContainerID);
			_.forEach(progresslines, function (pl, i) {
				var result = _.find($scope.colorOpt.items, {
					'name': settings().progresslinecolors[i]
				});
				if (result) {
					pl.colorid = result.id;
					pl.color = settings().progresslinecolors[i];
				}
			});
			$scope.pl.progresslines = progresslines;

			$scope.pl.selectedColorChanged = function selectedColorChanged(itemid) {
				var colorid = $scope.pl.progresslines[itemid].colorid;
				var coloritem = _.find($scope.colorOpt.items, {
					'id': colorid
				});
				$scope.pl.progresslines[itemid].color = coloritem.name;
				settings().progresslinecolors[itemid] = coloritem.name;
			};
			$scope.pl.changeShowProgresslines = function () {
				settings().showProgresslines = $scope.settings.showProgresslines;

				// trigger rebuilding of tabs
				// trigger recalculation of property
				settingsservice.updateProgresstemplates(gs.lastContainerID);
				refreshVersionGrid();
			};
		}

		function refreshVersionGrid() {
			var grid;
			if (gridIsReady($scope.tabs[1].gridid)) {
				// get grid
				grid = platformGridAPI.grids.element('id', $scope.tabs[1].gridid);
				// we need to call setitems again because the templatemap property gives back a NEW array destroying the reference to the old array
				grid.dataView.setItems(templatemap());
				// this line will trigger the formatters again
				platformGridAPI.grids.invalidate($scope.tabs[1].gridid);
				platformGridAPI.grids.refresh($scope.tabs[1].gridid);
			}
		}

		function setupBarinformationTab() {
			var emptyelement = {
				description: '',
				id: -1
			};

			$scope.entity1 = _.find(activitylookupservice.instantList(), {
				id: settings().barinformation[0].left
			});
			$scope.entity2 = _.find(activitylookupservice.instantList(), {
				id: settings().barinformation[0].middle
			});
			$scope.entity3 = _.find(activitylookupservice.instantList(), {
				id: settings().barinformation[0].right
			});

			$scope.entity4 = _.find(activitylookupservice.instantList(), {
				id: settings().barinformation[1].left
			});
			$scope.entity5 = _.find(activitylookupservice.instantList(), {
				id: settings().barinformation[1].middle
			});
			$scope.entity6 = _.find(activitylookupservice.instantList(), {
				id: settings().barinformation[1].right
			});

			$scope.entity7 = _.find(activitylookupservice.instantList(), {
				id: settings().barinformation[2].left
			});
			$scope.entity8 = _.find(activitylookupservice.instantList(), {
				id: settings().barinformation[2].middle
			});
			$scope.entity9 = _.find(activitylookupservice.instantList(), {
				id: settings().barinformation[2].right
			});

			$scope.entity10 = _.find(activitylookupservice.instantList(), {
				id: settings().barinformation[3].left
			});
			$scope.entity11 = _.find(activitylookupservice.instantList(), {
				id: settings().barinformation[3].middle
			});
			$scope.entity12 = _.find(activitylookupservice.instantList(), {
				id: settings().barinformation[3].right
			});

			$scope.entity1 = $scope.entity1 || emptyelement;
			$scope.entity2 = $scope.entity2 || emptyelement;
			$scope.entity3 = $scope.entity3 || emptyelement;
			$scope.entity4 = $scope.entity4 || emptyelement;
			$scope.entity5 = $scope.entity5 || emptyelement;
			$scope.entity6 = $scope.entity6 || emptyelement;
			$scope.entity7 = $scope.entity7 || emptyelement;
			$scope.entity8 = $scope.entity8 || emptyelement;
			$scope.entity9 = $scope.entity9 || emptyelement;
			$scope.entity10 = $scope.entity10 || emptyelement;
			$scope.entity11 = $scope.entity11 || emptyelement;
			$scope.entity12 = $scope.entity12 || emptyelement;

			$scope.showBarInformation = settings().showBarInformation;

			$scope.barinfoOptions = {
				ctrlId: 'showBarInformation',
				labelText: t.instant('scheduling.main.barInformation.showBarInformation.show')
			};

			$scope.changeShowBarInformation = function () {
				settings().showBarInformation = this.showBarInformation;
			};

			$scope.activityLookupOptions = {
				displayMember: 'description',
				valueMember: 'id',
				items: [emptyelement].concat(_.sortBy(activitylookupservice.instantList(), [function (el) {
					return _.toLower(el.description);
				}]))
			};

			$scope.entity1Changed = function () {
				$scope.entity1 = this.entity1;
				settings().barinformation[0].left = this.entity1.id;
			};

			$scope.entity2Changed = function () {
				$scope.entity2 = this.entity2;
				settings().barinformation[0].middle = this.entity2.id;
			};

			$scope.entity3Changed = function () {
				$scope.entity3 = this.entity3;
				settings().barinformation[0].right = this.entity3.id;
			};

			$scope.entity4Changed = function () {
				$scope.entity4 = this.entity4;
				settings().barinformation[1].left = this.entity4.id;
			};

			$scope.entity5Changed = function () {
				$scope.entity5 = this.entity5;
				settings().barinformation[1].middle = this.entity5.id;
			};

			$scope.entity6Changed = function () {
				$scope.entity6 = this.entity6;
				settings().barinformation[1].right = this.entity6.id;
			};

			$scope.entity7Changed = function () {
				$scope.entity7 = this.entity7;
				settings().barinformation[2].left = this.entity7.id;
			};

			$scope.entity8Changed = function () {
				$scope.entity8 = this.entity8;
				settings().barinformation[2].middle = this.entity8.id;
			};

			$scope.entity9Changed = function () {
				$scope.entity9 = this.entity9;
				settings().barinformation[2].right = this.entity9.id;
			};

			$scope.entity10Changed = function () {
				$scope.entity10 = this.entity10;
				settings().barinformation[3].left = this.entity10.id;
			};

			$scope.entity11Changed = function () {
				$scope.entity11 = this.entity11;
				settings().barinformation[3].middle = this.entity11.id;
			};

			$scope.entity12Changed = function () {
				$scope.entity12 = this.entity12;
				settings().barinformation[3].right = this.entity12.id;
			};
		}
	}
]);