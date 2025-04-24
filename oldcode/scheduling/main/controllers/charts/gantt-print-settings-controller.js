/**
 * Created by sprotte on 04.08.2015.
 */
/* jshint -W072 */
angular.module('scheduling.main').controller('schedulingMainGanttPrintSettingsController', ['_', '$injector', '$scope', '$timeout', '$translate', '$modalInstance',
	'schedulingMainPrintingProviderService', 'schedulingMainChartSettingsService',
	'schedulingMainGANTTService', 'platformModalService', 'platformGridAPI',
	function Controller(_, $injector, $scope, $timeout, t, $modalInstance, printing, settingsservice, gs, platformModalService, platformGridAPI) {
		/* global globals */
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
			return settingsservice.getGANTTsettings(gs.lastContainerID);
		}

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
			printing.header = $scope.settings.headline1 + ' / ' + $scope.settings.headline2;
		};

		// Headline2
		$scope.settings.headline2 = printing.header2;
		$scope.settings.changeHeadline2 = function () {
			printing.header2 = $scope.settings.headline2;
			printing.header = $scope.settings.headline1 + ' / ' + $scope.settings.headline2;
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

		// Show table
		$scope.settings.showTable = settings().printing.showTable;
		$scope.settings.showTableOpt = {
			ctrlId: 'showTable',
			labelText: t.instant('scheduling.main.printing.showTable')
		};
		$scope.settings.changeShowTable = function () {
			settings().printing.showTable = $scope.settings.showTable;
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
		headerChanged(); // run it once to set dropdown
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

		// Number of table columns
		if (_.isUndefined(settings().printing.noOfColumns)) {
			settings().printing.noOfColumns = settings().printing.showTable ? settings().printing.columns.length : 0;
		}

		function OK() {
			// from report id to report template string

			// generate print data
			gs.preparePrintData(gs.lastContainerID, true, true).then(function (data) {
				settingsservice.saveSettings(gs.lastContainerID);
				printing.data = data;
				// execute print command
				if (checkIsTherePrint(data)) {
					// printing.generatePDF();
					printing.downloadPDF().then(function (item) {
						// gs.lastContainerID = null;
						$modalInstance.close({
							ok: true
						});
						$injector.get('$window').open(item.data, '_blank');
					});
				} else {
					platformModalService.showMsgBox('scheduling.main.printing.noactivities', 'basics.common.alert.warning', 'warning');
				}
			});
		}

		function checkIsTherePrint(mydata) {
			// 1st check if there are any activities. can't happen that there are none because print button would be disabled, but check anyway.
			if (mydata.activities.length === 0) {
				return false;
			}
			// if report range is turned off go ahead and print
			if (!mydata.settings.useReportRange) {
				return true;
			}

			var start = mydata.settings.reportRangeStart;
			var end = mydata.settings.reportRangeEnd;
			// if report range start is after report range end we show no results
			if (end.isBefore(start)) {
				return false;
			}

			// round up end date to end of day
			end.endOf('d');

			var countinbetween = false,
				currentitem, condition = false;

			// using simple for loop so we can break early we check inside report period
			for (var i = mydata.activitiesByTemplate[0].length - 1; i >= 0; i--) {
				currentitem = mydata.activitiesByTemplate[0][i];

				if (!currentitem.$isGrouping) {
					condition = currentitem.start.isBefore(start) && currentitem.end.isAfter(end);
					if (condition) {
						countinbetween = true;
						break;
					}

					condition = (currentitem.start.isSame(start) || currentitem.start.isAfter(start)) &&
						(currentitem.start.isSame(end) || currentitem.start.isBefore(end));

					if (condition) {
						countinbetween = true;
						break;
					}

					condition = (currentitem.end.isSame(start) || currentitem.end.isAfter(start)) &&
						(currentitem.end.isSame(end) || currentitem.end.isBefore(end));

					if (condition) {
						countinbetween = true;
						break;
					}
				}
			}

			return countinbetween;
		}

		function cancel() {
			// we write back some dialog settings but do not actually print
			gs.preparePrintData(gs.lastContainerID, true, true).then(function () {
				$modalInstance.close({
					cancel: true
				});
			});
		}

		setupTabs();
		setupColumnsTab();

		function setupTabs() {
			$scope.tabs = [{
				title: t.instant('scheduling.main.printing.pageLayout'),
				content: globals.appBaseUrl + 'scheduling.main/templates/chartsettings/tab-pagelayout.html',
				active: true
			}, {
				title: t.instant('scheduling.main.printing.reportSetting'),
				content: globals.appBaseUrl + 'scheduling.main/templates/chartsettings/tab-headers.html',
				gridid: '5DAB101401D547ABBE609FC7FFF608AB', // Please do not copy and paste this UUID,
				reloadTab: false
			}, {
				title: t.instant('scheduling.main.printing.columnSetting'),
				content: globals.appBaseUrl + 'scheduling.main/templates/chartsettings/tab-columns.html',
				reloadTab: false,
			}];
		}

		function setupColumnsTab() {
			// get columns data via existing grid id

			// add pre-defined columns definition
			$scope.availableGridConfig = {
				columns: [{
					id: 'fieldName',
					formatter: 'description',
					name: 'Label name',
					name$tr$: 'cloud.desktop.formConfigLabelName',
					field: 'name',
					width: 200,
					sortable: true,
					searchable: true
				}],
				data: [],
				id: '7f9ce36793dc4da59384320c2f7db1af',
				lazyInit: true,
				options: {
					tree: false,
					indicator: true,
					allowRowDrag: false,
					idProperty: 'id',
					parentProp: 'parentId',
					childProp: 'children',
					skipPermissionCheck: true,
					showMainTopPanel: true
				}
			};

			$scope.visibleGridConfig = {
				columns: [{
					id: 'fieldName',
					formatter: 'description',
					name: 'Label name',
					name$tr$: 'cloud.desktop.formConfigLabelName',
					field: 'name',
					width: 200,
					sortable: false,
					searchable: true
				}, {
					id: 'width',
					formatter: function (row, cell, value, columnDef, dataContext) {
						var totalValue = value;
						if (dataContext.isOverSize && dataContext.fieldLeft !== null) {
							return '<span style="color: red;">' + totalValue + '(' + Math.floor(_.toNumber(dataContext.fieldLeft)) + ')' + '</span>';
						} else if (dataContext.isOverSize && dataContext.fieldLeft === null) {
							return '<span style="color: red;">' + totalValue + '</span>';
						}
						return totalValue;
					},
					name: 'Width',
					name$tr$: 'cloud.desktop.gridWidthHeader',
					field: '_width',
					width: 50,
					cssClass: 'cell-right',
					editor: 'integer',
					focusable: true
				}],
				data: [],
				id: '0dc2c7cf21184c39b837241c9063cf32',
				lazyInit: true,
				options: {
					tree: false,
					indicator: true,
					allowRowDrag: false,
					idProperty: 'id',
					parentProp: 'parentId',
					childProp: 'children',
					skipPermissionCheck: true,
					showMainTopPanel: true
				}
			};

			$scope.$on('$destroy', function cleanupHandlers() {
				// stop recycling of GRID
				platformGridAPI.grids.unregister($scope.availableGridConfig.id);
				platformGridAPI.grids.unregister($scope.visibleGridConfig.id);
			});

			platformGridAPI.grids.config($scope.availableGridConfig);
			platformGridAPI.grids.config($scope.visibleGridConfig);
			$scope.availableGridData = {
				state: $scope.availableGridConfig.id
			};
			$scope.visibleGridData = {
				state: $scope.visibleGridConfig.id
			};

			loadGridData();
		}

		function loadGridData() {
			var columns = settings().printing.columns;
			var info = $injector.get('schedulingMainContainerInformationService').getContainerInfoByGuid('13120439D96C47369C5C24A2DF29238D');
			var filtered = _.intersectionWith(info.layout.columns, columns, function (a, b) {
				return a.id === b; // was field
			});
			columns.forEach(function (element, index) {
				var myindex = index;
				var result = _.find(info.layout.columns, {
					'id': element // was field
				});
				if (result) {
					result._sortIndex = myindex;
					result._width = settings().printing.columnwidths[index];
				}
			});
			var filteredAndSorted = _.sortBy(filtered, '_sortIndex');
			platformGridAPI.items.data($scope.availableGridConfig.id, _.difference(info.layout.columns, filtered));
			platformGridAPI.items.data($scope.visibleGridConfig.id, filteredAndSorted);
		}

		initToolbar();

		function initToolbar() {
			$scope.tools = $injector.get('platformGridConfigService').initToolBar($scope.visibleGridConfig.id);
			_.forEach($scope.tools.items, function (item) {
				item.disabled = function () {
					var rightGrid = platformGridAPI.grids.element('id', $scope.visibleGridConfig.id).instance;
					if (!rightGrid) {
						return true;
					}
					return !settings() || rightGrid.getSelectedRows().length === 0 || settings().printing.columns.length < 2;
				};
				item.fn = function () {
					switch (item.id) {
						case 'moveUp':
							moveItem('up', true);
							break;
						case 'moveTop':
							moveItem('top', true);
							break;
						case 'moveDown':
							moveItem('down', true);
							break;
						case 'moveBottom':
							moveItem('bottom', true);
							break;
					}
					platformGridAPI.grids.refresh($scope.visibleGridConfig.id);
				};
			});
		}

		$scope.moveItem = moveItem;

		function moveItem(direction, multiple) {
			// es wird UNTER das selecteditem rechts geschoben
			var leftGrid = platformGridAPI.grids.element('id', $scope.availableGridConfig.id).instance;
			var rightGrid = platformGridAPI.grids.element('id', $scope.visibleGridConfig.id).instance;
			var selectedLeft = multiple ? leftGrid.getSelectedRows() : _.slice(leftGrid.getSelectedRows(), 0, 1);
			var selectedRight = multiple ? rightGrid.getSelectedRows() : _.slice(rightGrid.getSelectedRows(), 0, 1);

			selectedLeft = selectedLeft.map(function (row) {
				return leftGrid.getDataItem(row);
			});

			var selectedRightItem = selectedRight.map(function (row) {
				return rightGrid.getDataItem(row);
			});

			var columns = settings().printing.columns;
			var sortedcolumns = [];
			var oldselection = [];
			_.forEach(columns, function (column, i) {
				sortedcolumns.push({
					code: column,
					_sortIndex: (i + 1) * 10 + 1000,
					_width: settings().printing.columnwidths[i]
				});
			});
			// get grid instance
			// get selected items
			// refresh grid
			var firstitemindex;
			switch (direction) {
				case 'top':
					_.forEach(selectedRight, function (item, index) {
						oldselection.push(rightGrid.getDataItem(item).id);
						sortedcolumns[item]._sortIndex = index;
					});
					break;
				case 'bottom':
					_.forEach(selectedRight, function (item, index) {
						oldselection.push(rightGrid.getDataItem(item).id);
						sortedcolumns[item]._sortIndex = index + 2000;
					});
					break;
				case 'up':
					_.forEach(selectedRight, function (item, index) {
						oldselection.push(rightGrid.getDataItem(item).id);
						if (index === 0) {
							firstitemindex = sortedcolumns[item]._sortIndex -= 15;
						}
						sortedcolumns[item]._sortIndex = firstitemindex + index;
					});
					break;
				case 'down':
					_.forEach(selectedRight, function (item, index) {
						oldselection.push(rightGrid.getDataItem(item).id);
						if (index === 0) {
							firstitemindex = sortedcolumns[item]._sortIndex += 15;
						}
						sortedcolumns[item]._sortIndex = firstitemindex - index;
					});
					break;
				case 'left':
					_.forEach(selectedRightItem, function (item) {
						_.pull(sortedcolumns, _.find(sortedcolumns, {
							code: item.id
						}));
					});
					break;
				case 'right':
					_.forEach(selectedLeft, function (item, index) {
						sortedcolumns.push({
							code: item.id, // was field
							_sortindex: 2000 + index,
							_width: item._width || 100
						});
					});
					break;
				case 'allleft':
					sortedcolumns.length = 0;
					break;
				case 'allright':
					var allleftrows = leftGrid.getData().getRows();
					_.forEach(allleftrows, function (item, index) {
						sortedcolumns.push({
							code: item.id, // was field
							_sortindex: 2000 + index,
							_width: item._width || 100
						});
					});
					break;
			}
			sortedcolumns = _.sortBy(sortedcolumns, '_sortIndex');
			_.forEach(sortedcolumns, function (item, index) {
				item.sortIndex = (index + 1) * 10 + 1000;
			});

			settings().printing.columns = _.map(sortedcolumns, 'code');
			settings().printing.columnwidths = _.map(sortedcolumns, '_width');
			loadGridData();
			var newselection = [];
			_.forEach(oldselection, function (id) {
				newselection.push(_.findIndex(rightGrid.getData().getRows(), {
					id: id
				}));
			});
			rightGrid.setSelectedRows(newselection);
		}
	}
]);
