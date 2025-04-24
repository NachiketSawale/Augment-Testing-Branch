/**
 * Created by sprotte on 27.02.2015.
 */
/* jshint -W072 */
angular.module('scheduling.main').controller('schedulingMainLobSettingsDialogController', ['_', '$scope', 'schedulingMainChartSettingsService', '$translate', '$modalInstance', 'schedulingMainLobService', 'schedulingMainActivityLookupService', 'platformGridAPI', function Controller(_, $scope, settingsservice, t, $modalInstance, ls, activitylookupservice, platformGridAPI) {
	/* global globals */
	'use strict';
	$scope.modalOptions = {
		actionButtonText: t.instant('cloud.common.ok'),
		ok: OK,
		closeButtonText: t.instant('cloud.common.cancel'),
		cancel: cancel,
		headerText: t.instant('scheduling.main.chart-settings.headerLOB'),
		tabSetting: t.instant('scheduling.main.chart-settings.tab-Setting'),
		showOkButton: true,
		// showYesButton: false,
		// showNoButton: false,
		// showIgnoreButton: false,
		showCancelButton: true,
		// showRetryButton: false
	};
	$scope.tabs = [{
		title: $scope.modalOptions.tabSetting,
		content: globals.appBaseUrl + 'scheduling.main/templates/chartsettings/tab-lobsettings.html',
		disabled: false
	}, {
		title: t.instant('scheduling.main.chart-settings.locationSort'),
		content: globals.appBaseUrl + 'scheduling.main/templates/chartsettings/tab-lobsort.html',
		disabled: false
	}, {
		title: t.instant('scheduling.main.chart-settings.locationFilter'),
		content: globals.appBaseUrl + 'scheduling.main/templates/chartsettings/tab-lobfilter.html',
		gridid: '35089CF007B841B5AFCFB9E2989BB88F', // Please do not copy and paste this UUID,
		reloadTab: true
	}, {
		title: t.instant('scheduling.main.barInformation.barInformation'),
		content: globals.appBaseUrl + 'scheduling.main/templates/chartsettings/tab-lobbarinformation.html',
		reloadTab: true
	}];

	setupBarinformationTab();
	setupLobfilterTab();

	function settings() {
		return settingsservice.getLobsettings(ls.lastContainerID);
	}


	$scope.settings = {};

	$scope.settings.showCritical = settings().showCritical;

	$scope.settings.showCriticalOpt = {
		ctrlId: 'showCritical',
		labelText: t.instant('scheduling.main.showCritical')
	};

	$scope.settings.changeShowCritical = function () {
		settings().showCritical = $scope.settings.showCritical;
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

	// Timelines
	$scope.settings.showTimelines = settings().showTimelines;
	$scope.settings.showTimelinesOpt = {
		ctrlId: 'showTimelines',
		labelText: t.instant('scheduling.main.chart-settings.showTimelines')
	};
	$scope.settings.changeShowTimelines = function () {
		settings().showTimelines = $scope.settings.showTimelines;
	};

	// Progress
	$scope.settings.showProgress = settings().showProgress;
	$scope.settings.showProgressOpt = {
		ctrlId: 'showProgress',
		labelText: t.instant('scheduling.main.chart-settings.showProgress')
	};
	$scope.settings.changeShowProgress = function () {
		settings().showProgress = $scope.settings.showProgress;
	};

	// Location Connections
	$scope.settings.showLocationConnections = settings().showLocationConnections;
	$scope.settings.showLocationConnectionsOpt = {
		ctrlId: 'showLocationConnections',
		labelText: t.instant('scheduling.main.chart-settings.showLocationConnections')
	};
	$scope.settings.changeShowLocationConnections = function () {
		settings().showLocationConnections = $scope.settings.showLocationConnections;
	};

	$scope.sortOrderOpt = {
		'valueList': [{
			'title': t.instant('scheduling.main.chart-settings.locationSortOrderAsc'),
			'value': true
		}, {
			'title': t.instant('scheduling.main.chart-settings.locationSortOrderDesc'),
			'value': false
		}],
		'required': true
	};

	// // Sort order, Levels 1-4
	$scope.sortOrder = settings().sortOrder;

	// Timeaxis on top
	$scope.settings.showTopTimeaxis = settings().timescalePosition === 'both' || settings().timescalePosition === 'top';
	$scope.settings.showTopTimeaxisOpt = {
		ctrlId: 'showTopTimeaxis',
		labelText: t.instant('scheduling.main.chart-settings.showTopTimeaxis')
	};

	$scope.settings.changeShowTopTimeaxis = changeShowAxis;

	function changeShowAxis() {
		if ($scope.settings.showBottomTimeaxis && $scope.settings.showTopTimeaxis) {
			settings().timescalePosition = 'both';
		} else if ($scope.settings.showBottomTimeaxis && !$scope.settings.showTopTimeaxis) {
			settings().timescalePosition = 'bottom';
		} else if (!$scope.settings.showBottomTimeaxis && $scope.settings.showTopTimeaxis) {
			settings().timescalePosition = 'top';
		} else {
			settings().timescalePosition = 'none';
		}
	}

	// Vertical lines
	$scope.settings.showVerticalLines = settings().showVerticalLines;
	$scope.settings.showVerticalLinesOpt = {
		ctrlId: 'showVerticalLines',
		labelText: t.instant('scheduling.main.chart-settings.showVerticalLines')
	};
	$scope.settings.changeShowVerticalLines = function () {
		settings().showVerticalLines = $scope.settings.showVerticalLines;
	};

	// Timeaxis on bottom
	$scope.settings.showBottomTimeaxis = settings().timescalePosition === 'both' || settings().timescalePosition === 'bottom';
	$scope.settings.showBottomTimeaxisOpt = {
		ctrlId: 'showBottomTimeaxis',
		labelText: t.instant('scheduling.main.chart-settings.showBottomTimeaxis')
	};

	$scope.settings.changeShowBottomTimeaxis = changeShowAxis;

	function OK() {
		ls.setVisibleLocations(ls.lastContainerID, $scope.visibleLocations);
		settingsservice.saveSettings(ls.lastContainerID);
		// ls.lastContainerID = null;
		ls.forceLayoutUpdate.fire();
		ls.update();
		$modalInstance.close({
			ok: true
		});
	}

	function cancel() {
		$modalInstance.close({
			cancel: true
		});
	}

	// / TBD: try to get lookup to work and replace select control with lookup
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

		$scope.entity1 = $scope.entity1 || emptyelement;
		$scope.entity2 = $scope.entity2 || emptyelement;
		$scope.entity3 = $scope.entity3 || emptyelement;
		$scope.entity4 = $scope.entity4 || emptyelement;
		$scope.entity5 = $scope.entity5 || emptyelement;
		$scope.entity6 = $scope.entity6 || emptyelement;
		$scope.entity7 = $scope.entity7 || emptyelement;
		$scope.entity8 = $scope.entity8 || emptyelement;
		$scope.entity9 = $scope.entity9 || emptyelement;

		// Show bar information
		$scope.barinfoOptions = {
			ctrlId: 'showBarInformation',
			labelText: t.instant('scheduling.main.barInformation.showBarInformation.show')
		};

		$scope.showBarInformation = settings().showBarInformation === 'activity';

		$scope.changeShowBarInformation = function () {
			settings().showBarInformation = this.showBarInformation ? 'activity' : 'none';
		};

		$scope.activityLookupOptions = {
			displayMember: 'description',
			valueMember: 'id',
			items: [emptyelement].concat(activitylookupservice.instantList())
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
	}

	function setupLobfilterTab() {
		$scope.visibleLocations = ls.getVisibleLocations(ls.lastContainerID);
		var grid;
		$scope.lobfilterGrid = {
			state: $scope.tabs[2].gridid,
			domains: {
				'layer': {
					'datatype': 'number',
					'regex': '^[\\d]{1,2}$',
					'defaultvalue': 1
				}
			}
		};
		// Check if grid existId
		grid = platformGridAPI.grids.element('id', $scope.tabs[2].gridid);
		if (!grid) {
			platformGridAPI.grids.config({
				data: $scope.visibleLocations,
				columns: [{
					id: 'visible',
					domain: 'boolean',
					formatter: 'boolean',
					editor: 'boolean',
					field: 'visible',
					name: t.instant('scheduling.main.chart-settings.show'),
					width: 35
				}, {
					id: 'code',
					domain: 'code',
					field: 'Code',
					name: t.instant('scheduling.main.chart-settings.code'),
					formatter: 'code',
					width: 50,
					// cssClass: 'font-bold'
				},
				{
					id: 'description',
					domain: 'description',
					field: 'DescriptionInfo.Translated',
					name: t.instant('scheduling.main.chart-settings.description'),
					formatter: 'description',
					width: 70,
					// cssClass: 'font-bold'
				}
				],
				id: $scope.tabs[2].gridid,
				options: {
					tree: false,
					showFooter: false
				}
			});
		}
	}
}]);
