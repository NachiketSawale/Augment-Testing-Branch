/**
 * Created by sprotte on 04.08.2015.
 */
/* jshint -W072 */
angular.module('scheduling.main').controller('schedulingMainLobPrintSettingsController', ['_', '$scope', '$injector', '$timeout', '$translate', '$modalInstance', 'schedulingMainPrintingProviderService', 'schedulingMainChartSettingsService', 'schedulingMainLobService', function Controller(_, $scope, $injector, $timeout, t, $modalInstance, printing, settingsservice, ls) {
	'use strict';
	let headeritems = [];
	let footeritems = [];

	$scope.modalOptions = {
		headerText: t.instant('scheduling.main.printing.reportOptions'),
		actionButtonText: t.instant('cloud.common.ok'),
		ok: OK,
		closeButtonText: t.instant('cloud.common.cancel'),
		cancel: cancel,
		width: '700px'
	};

	var localreports = $injector.get('schedulingMainChartprintLookupService').getListSync(({
		lookupType: 'schedulingMainChartprintLookupService',
		displayMember: 'NameInfo.Translated'
	}));
	// Paper size
	$scope.papersize = settings().printing.papersize;
	$scope.settings = {};
	$scope.settings.papersizeOpt = {
		valueMember: 'Id',
		displayMember: 'NameInfo.Translated',
		inputDomain: 'description'
	};
	var papersizes;
	$injector.get('schedulingMainPapersizeLookupService').getList(({
		lookupType: 'schedulingMainPapersizeLookupService',
		displayMember: 'NameInfo.Translated'
	})).then(function (result) {
		var isLiveResult = _.filter(result, function (candidate) {
			return candidate.IsLive;
		});
		papersizes = _.sortBy(isLiveResult, 'Sorting');
		$scope.settings.papersizeOpt.items = papersizes;
		$scope.settings.papersize = settings().printing.papersize;
		$scope.settings.changePapersizeOpt(true);
	});

	function settings() {
		return settingsservice.getLobsettings(ls.lastContainerID);
	}

	$scope.settings.reportHeaderId = settings().printing.reportHeaderId;
	$scope.settings.reportFooterId = settings().printing.reportFooterId;

	$scope.footerOptions = {
		displayMember: 'NameInfo.Translated',
		valueMember: 'ReportFk',
		items: footeritems
	};
	setFooterOptions();
	$scope.settings.footerId = settings().printing.footerId;

	$scope.settings.changePapersizeOpt = function () {
		settings().printing.papersize = this.papersize;
		var selectedpaper = _.find(papersizes, {
			Id: this.papersize
		});

		if (!_.isNil(selectedpaper)) {
			settings().printing.pagewidth = selectedpaper.Width;
			settings().printing.pageheight = selectedpaper.Height;
			setHeaderOptions();
			setFooterOptions();
		}
		headerChanged(); // to throw out headers / footers that don't match the new paper size
		footerChanged();
	};

	// Paper orientation
	$scope.settings.orientation = settings().printing.orientation === 'portrait';

	$scope.settings.orientationOpt = {
		displayMember: 'description',
		valueMember: 'value',
		items: [{
			value: true,
			description: t.instant('scheduling.main.printing.pagePortrait')
		}, {
			value: false,
			description: t.instant('scheduling.main.printing.pageLandscape')
		}]
	};

	$scope.settings.changeOrientationOpt = function (show) {
		settings().printing.orientation = show ? 'portrait' : 'landscape';
		setHeaderOptions();
		setFooterOptions();
	};

	// ScaleX
	$scope.settings.spanX = settings().printing.spanX;
	$scope.settings.changeSpanX = function () {
		if (_.isNumber($scope.settings.spanX)) {
			if ($scope.settings.spanX > 10) {
				$scope.settings.spanX = 10;
			}

			settings().printing.spanX = Math.round($scope.settings.spanX);
		}
	};

	// Headline1
	$scope.settings.headline1 = printing.header1;
	$scope.settings.changeHeadline1 = function () {
		printing.header1 = $scope.settings.headline1;
	};

	// Headline2
	$scope.settings.headline2 = printing.header2;
	$scope.settings.changeHeadline2 = function () {
		printing.header2 = $scope.settings.headline2;
	};

	// Use report range
	$scope.settings.useReportRange = settings().printing.useReportRange;
	$scope.settings.useReportRangeOpt = {
		ctrlId: 'useReportRange',
		labelText: t.instant('scheduling.main.printing.useReportRange')
	};
	$scope.settings.changeUseReportRange = function () {
		settings().printing.useReportRange = $scope.settings.useReportRange;
	};

	// Report range start
	$scope.settings.reportRangeStart = settings().printing.reportRangeStart;
	$scope.settings.changeUseReportStart = function () {
		settings().printing.reportRangeStart = $scope.settings.reportRangeStart;
	};

	// Report range end
	$scope.settings.reportRangeEnd = settings().printing.reportRangeEnd;
	$scope.settings.changeUseReportEnd = function () {
		settings().printing.reportRangeEnd = $scope.settings.reportRangeEnd;
	};

	// Show legend
	$scope.settings.showLegend = settings().printing.showLegend;
	$scope.settings.showLegendOpt = {
		ctrlId: 'showLegend',
		labelText: t.instant('scheduling.main.printing.showLegend')
	};
	$scope.settings.changeShowLegend = function () {
		settings().printing.showLegend = $scope.settings.showLegend;
	};

	// Show report header
	$scope.settings.showReportHeader = settings().printing.showReportHeader;
	$scope.settings.showReportHeaderOpt = {
		ctrlId: 'showReportHeader',
		labelText: t.instant('scheduling.main.printing.showReportHeader')
	};
	$scope.settings.changeShowReportHeader = function () {
		settings().printing.showReportHeader = $scope.settings.showReportHeader;
	};

	// Controller for header and footer
	$scope.headerOptions = {
		displayMember: 'NameInfo.Translated',
		valueMember: 'Id',
		items: headeritems
	};
	setHeaderOptions();
	$scope.settings.reportHeaderId = settings().printing.reportHeaderId;

	function setHeaderOptions() {
		var items = [{
			NameInfo: {
				Translated: t.instant('scheduling.main.printing.noHeader')
			},
			Id: -1
		}]
			.concat(localreports.filter(function (item) {
				return item.Isheader && item.Isorientationlandscape === (settings().printing.orientation === 'landscape') &&
					item.PapersizeFk === $scope.settings.papersize;
			}));
		headeritems.length = 0;
		_.forEach(items, function (item) {
			headeritems.push(item);
		});
	}

	$scope.footerOptions = {
		displayMember: 'NameInfo.Translated',
		valueMember: 'Id',
		items: footeritems
	};
	setFooterOptions();
	$scope.settings.reportFooterId = settings().printing.reportFooterId;

	function setFooterOptions() {
		var items = [{
			NameInfo: {
				Translated: t.instant('scheduling.main.printing.noFooter')
			},
			Id: -1
		}]
			.concat(localreports.filter(function (item) {
				return !item.Isheader && item.Isorientationlandscape === (settings().printing.orientation === 'landscape') &&
					item.PapersizeFk === $scope.settings.papersize;
			}));
		footeritems.length = 0;
		_.forEach(items, function (item) {
			footeritems.push(item);
		});
	}

	// transfer page orientation and size based on header selection
	$scope.settings.headerChanged = headerChanged;
	function headerChanged() {
		settings().printing.reportHeaderId = $scope.settings.reportHeaderId;
		// lookup report name
		const localreport = _.find(localreports, {
			Id: settings().printing.reportHeaderId,
			PapersizeFk: settings().printing.papersize
		});
		if (localreports && localreport) {
			settings().printing.reportHeaderId = localreport.Id;
			settings().printing.reportHeaderHeight = localreport.Height;
			settings().printing.reportHeaderFk = localreport.ReportFk;
		} else if (localreports && !localreport) {
			const localreport2 = localreports.filter(function (item) {
				return item.Isheader && item.Isorientationlandscape === (settings().printing.orientation === 'landscape') &&
					item.PapersizeFk === $scope.settings.papersize;
			})
			if (localreport2.length > 0 && $scope.settings.reportHeaderId !== -1) {
				$scope.settings.reportHeaderId = localreport2[0].Id;
				settings().printing.reportHeaderId = localreport2[0].Id;
				settings().printing.reportHeaderHeight = localreport2[0].Height;
				settings().printing.reportHeaderFk = localreport2[0].ReportFk;
			}
		}
	}

	// transfer page orientation and size based on header selection
	$scope.settings.footerChanged = footerChanged;
	footerChanged(); // run it once to set dropdown
	function footerChanged() {
		settings().printing.reportFooterId = $scope.settings.reportFooterId;
		// lookup report name
		const localreport = _.find(localreports, {
			Id: settings().printing.reportFooterId,
			PapersizeFk: settings().printing.papersize
		});
		if (localreports && localreport) {
			settings().printing.reportFooterId = localreport.Id;
			settings().printing.reportFooterHeight = localreport.Height;
			settings().printing.reportFooterFk = localreport.ReportFk;
		} else if (localreports && !localreport) {
			const localreport2 = localreports.filter(function (item) {
				return !item.Isheader && item.Isorientationlandscape === (settings().printing.orientation === 'landscape') &&
					item.PapersizeFk === $scope.settings.papersize;
			})
			if (localreport2.length > 0 && $scope.settings.reportFooterId !== -1) {
				$scope.settings.reportFooterId = localreport2[0].Id;
				settings().printing.reportFooterId = localreport2[0].Id;
				settings().printing.reportFooterHeight = localreport2[0].Height;
				settings().printing.reportFooterFk = localreport2[0].ReportFk;
			}
		}
	}

	headerChanged();$timeout(headerChanged,10); // run it once to set dropdown
	footerChanged();$timeout(footerChanged,10);

	// Show header only on first page
	$scope.settings.reportHeaderOnlyFirst = settings().printing.reportHeaderOnlyFirst;
	$scope.settings.reportHeaderOnlyFirstOpt = {
		ctrlId: 'reportHeaderOnlyFirst',
		labelText: t.instant('scheduling.main.printing.reportHeaderOnlyFirst')
	};
	$scope.settings.changeReportHeaderOnlyFirst = function () {
		settings().printing.reportHeaderOnlyFirst = $scope.settings.reportHeaderOnlyFirst;
	};

	// Show footer only on last page
	$scope.settings.reportFooterOnlyLast = settings().printing.reportFooterOnlyLast;
	$scope.settings.reportFooterOnlyLastOpt = {
		ctrlId: 'reportFooterOnlyLast',
		labelText: t.instant('scheduling.main.printing.reportFooterOnlyLast')
	};
	$scope.settings.changeReportFooterOnlyLast = function () {
		settings().printing.reportFooterOnlyLast = $scope.settings.reportFooterOnlyLast;
	};

	function OK() {
		// from report id to report template string

		// generate print data
		ls.preparePrintData(ls.lastContainerID, true, true).then(function (data) {
			settingsservice.saveSettings(ls.lastContainerID);
			printing.data = data;
			// execute print command
			// printing.generatePDF();
			printing.downloadPDF().then(function (item) {
				$modalInstance.close({
					ok: true
				});
				$injector.get('$window').open(item.data, '_blank');
			});
		});
	}

	function cancel() {
		// we write back some dialog settings but do not actually print
		ls.preparePrintData(ls.lastContainerID, true, true).then(function () {
			$modalInstance.close({
				cancel: true
			});
		});
	}
}]);
