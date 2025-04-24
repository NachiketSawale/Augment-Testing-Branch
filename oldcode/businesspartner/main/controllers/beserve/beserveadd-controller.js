/**
 *
 *
 @ngdoc controller
 * @name cloudSettingsDialogController
 * @function
 *
 * @description
 * Controller for the Document Properties Structure Details view.
 */
/* jshint -W072 */ // many parameters because of dependency injection
// eslint-disable-next-line no-redeclare
/* global angular,$ */
angular.module('businesspartner.main').controller('businesspartnerMainBeserveAddController', businesspartnerMainBeserveAddController);

businesspartnerMainBeserveAddController.$inject =
	['$scope', '$timeout', '$modalInstance', 'platformGridAPI', 'platformTranslateService', '$translate',
		'businesspartnerMainBeserveService', 'businesspartnerMainBeserveAddGridCfg','_', 'businesspartnerMainBeserveAddIconService'];

function businesspartnerMainBeserveAddController($scope, $timeout, $modalInstance, platformGridAPI, platformTranslateService, $translate,
	crefoService, businesspartnerMainBeserveAddGridCfg,_, businesspartnerMainBeserveAddIconService) {

	'use strict';

	function recordCount() {
		if ($scope.data && $scope.data.length > 0) {
			return ' (' + $scope.data.length + ')';
		}
		return '';
	}

	/**
	 * selfexplaining....
	 */
	function setFocusToOnStartSearch() {
		// must run in new digest cycle, otherwise focus not working, we delay it slightly to be sure focus
		// move to this input field
		$timeout(function () {
			let elem = $('#onCrefoStartFocus');
			if (elem) {
				elem.focus();
			}
		}, 500);
	}

	/**
	 * selfexplaining....
	 * we do not need timeout at this point.
	 */
	function setFocusToExecuteSearch() {
		// move to this input field
		let elem = $('#onExecuteStartFocus');
		if (elem) {
			elem.focus();
		}
	}

	function onSearch() {
		if ($scope.crefoOption.loading) {
			return false;
		}
		console.log('onSearch started...');

		// platformGridAPI.grids.commitEdit($scope.gridId);
		setFocusToExecuteSearch();

		setLoadingText(1);
		// console.log('onSearch() ', $scope.crefoOption.searchParams);
		crefoSearch($scope.crefoOption.searchParams);

		if ($scope.crefoOption.keepfilter) {
			crefoService.setLastSearchfilter($scope.crefoOption.searchParams);
		} else {
			crefoService.clearCrefoFilter();
		}

	}

	function onClear() {
		// console.log('Clear search pattern ...');
		setFocusToOnStartSearch();
		$scope.crefoOption.searchParams.clear();
		$scope.data = [];
		updateGrid();
	}

	function closeDialogIfTrue(flag) {
		if (flag === true) {
			$modalInstance.close({ok: true});
		}
	}

	function onOk() {

		function setLoadingCallback(flag) {
			$scope.crefoOption.loading = flag;
		}

		let selectedItem = crefoService.getSelectItemById($scope.crefoOption.selectedItemId);
		if (selectedItem) {
			if (selectedItem.resulttype === 2 /* assigned */) {
				crefoService.askNavigateDialog(selectedItem).then(function (result) {
					closeDialogIfTrue(result);
				});
			} else {
				setLoadingText(2);
				crefoService.crefoBuySelectedItem(selectedItem, setLoadingCallback).then(function (result) {
					closeDialogIfTrue(result);
				});
			}
		}
	}

	function onCancel() {
		crefoService.resetService();
		$modalInstance.dismiss({ok: false});
	}

	/**
	 * check
	 * @returns {boolean}
	 */
	function onCanApply() {
		return ($scope.crefoOption.selectedItemId >= 0);
	}

	/**
	 * Start Search via the creditreform api service. input is searchPattern.
	 * @param param  the searchpattern
	 */
	function crefoSearch(param) {
		$scope.data = [];
		updateGrid();
		$scope.crefoOption.loading = true;
		$scope.crefoOption.noresult = false;
		$scope.crefoOption.resultMessage = null;
		crefoService.crefoReadbySearch(param).then(function (response) {
			$scope.crefoOption.loading = false;
			/** @namespace response.resultcode */
			// noinspection JSValidateTypes
			if (response.resultcode === 200) {
				let data = response.resultdata;
				let id = 1;
				if (_.isArray(data)) {
					_.forEach(data, function (item) {
						item.id = id++;
					});
					$scope.data = data;
				}
				updateGrid();
			} else {
				/** @namespace response.resultmessage */
				$scope.crefoOption.resultMessage = platformTranslateService.instantviaTemplate('businesspartner.main.crefodlg.searcherrormsg', {
					code: response.resultcode,
					msg: response.resultmessage
				});
			}

		}, function (/* reason */) {
			// console.log('crefoReadbySearch failed', reason);
			$scope.crefoOption.loading = false;
		});

		return true;
	}

	// noinspection JSUnusedLocalSymbols
	function onSelectedRowsChanged(e, arg) {
		// let selectedItem = ''; //arg.grid.getDataItem(arg.rows[0]);
		// console.log('onSelectedRowsChanged: ', e, arg, selectedItem);
		$scope.crefoOption.selectedItemId = arg.rows[0];
		$timeout(function () {
			$scope.$apply();
		}, 0);
	}

	function onGridClick() { // jshint ignore:line
		// console.log('onGridClick: ', e, arg);
	}

	// noinspection JSUnusedLocalSymbols
	function onGridDblClick() {// jshint ignore:line
		// console.log('onGridDblClick: ', e, arg);
		onOk();
	}

	function updateGrid() {
		$scope.crefoOption.noresult = $scope.data.length === 0;
		platformGridAPI.items.data($scope.gridId, $scope.data);
	}

	/**
	 *
	 * @param flag
	 */
	function setLoadingText(flag) {
		switch (flag) {
			case 1:
				$scope.crefoOption.searchStarted = $translate.instant('businesspartner.main.crefodlg.searchloading');
				break;
			case 2:
				$scope.crefoOption.searchStarted = $translate.instant('businesspartner.main.crefodlg.takeoverloading');
				break;
			case 3:
				$scope.crefoOption.searchStarted = $translate.instant('businesspartner.main.crefodlg.takeoverorcreatennewloading');
				break;
			default:
				$scope.crefoOption.searchStarted = '';
				break;
		}
	}

	$scope.crefoOption = {
		keepfilter: _.isObject(crefoService.getLastSearchfilter()),
		selectedItemId: null,
		loading: false,
		noresult: true,
		searchIdle: $translate.instant('businesspartner.main.crefodlg.searchidle'),
		searchStarted: '',
		resultMessage: null,
		searchParams: new crefoService.CrefoSearchParams(crefoService.getLastSearchfilter()),
		keepFilterChk: {
			ctrlId: 'keepFilterChk',
			labelText: $translate.instant('businesspartner.main.crefodlg.keepfilter')
		},

		recordCount: recordCount,
		onSearch: onSearch,
		onClear: onClear,
		onOk: onOk,
		onCancel: onCancel,
		canApply: onCanApply
	};

	$scope.modalOptions = {
		headerText: $translate.instant('businesspartner.main.crefodlg.title'),
		cancel: onCancel
	};

	let copyPasteDropdownItems = [
		{
			id: 't100',
			sort: 100,
			type: 'check',
			caption: 'cloud.common.exportArea',
			fn: function () {
				platformGridAPI.grids.setAllowCopySelection($scope.gridId, this.value);
			}
		},
		{
			id: 't200',
			sort: 200,
			caption: 'cloud.common.exportCopy',
			type: 'item',
			fn: function () {
				platformGridAPI.grids.copySelection($scope.gridId);
			},
			disabled: function () {
				return $scope.crefoOption.selectedItemId === null || $scope.crefoOption.selectedItemId === undefined;
			}
		},
		{
			id: 't400',
			sort: 500,
			caption: 'cloud.common.exportWithHeader',
			type: 'check',
			fn: function () {
				platformGridAPI.grids.setCopyWithHeader($scope.gridId, this.value);
			}
		}
	];
	$scope.beserveTools = {
		showImages: true,
		showTitles: true,
		cssClass: 'tools',
		items: [
			{
				id: 't199',
				caption: 'cloud.common.exportClipboard',
				sort: 199,
				type: 'dropdown-btn',
				icoClass: 'tlb-icons ico-clipboard',
				cssClass: 'tlb-icons ico-clipboard',
				showTitles: false,
				list: {
					showImages: false,
					cssClass: 'dropdown-menu-right',
					items: copyPasteDropdownItems
				}
			}
		]
	};

	/**
	 *
	 */
	function setupResultGrid() {

		$scope.gridId = 'BF8D287F-4774-4A53-88A7-BAB0B449A8B6';
		$scope.gridData = {
			state: $scope.gridId
		};

		let columns = angular.copy(businesspartnerMainBeserveAddGridCfg);
		let requestTypeCol = _.find(columns, {id: 'resulttype'});
		if (requestTypeCol) {
			requestTypeCol.formatter = requestTypeFormatter;
			requestTypeCol.formatterOptions = null;
		}

		function requestTypeFormatter(row, cell, value, columnDef, dataContext) {
			if (!value) {
				return '';
			}

			let url = businesspartnerMainBeserveAddIconService.select(dataContext);
			let tooltip = businesspartnerMainBeserveAddIconService.selectTooltip(dataContext);
			if (dataContext.message) {
				tooltip += '\n' + dataContext.message;
			}
			return '<img src="' + url + '" title="' + tooltip + '">';
		}
		if (!columns.isTranslated) {
			platformTranslateService.translateGridConfig(columns);
			columns.isTranslated = true;
		}
		// make full readonly
		_.each(columns, function (item) {
			if (item?.editor) {
				item.editor = null;
			}
		});

		$scope.data = [];
		$scope.alarmConfig = undefined;

		if (!platformGridAPI.grids.exist($scope.gridId)) {
			let grid = {
				columns: columns,
				data: $scope.data, // generatePreviewService.getTree(),
				id: $scope.gridId, lazyInit: true,
				options: {tree: false, indicator: true, idProperty: 'id', enableCopyPasteExcel: true}
			};

			platformGridAPI.grids.config(grid);
		} else {
			platformGridAPI.columns.configuration($scope.gridId, columns);
		}

		function onCopyCompleteHandler() {
			$scope.alarmConfig = {
				info$tr$: 'cloud.common.copyToClipboardSucess',
				cssClass: 'test'
			};
			$timeout(function () {
				$scope.alarmConfig = undefined;
			}, 2000);
		}

		// install events for grid navigation handling
		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
		platformGridAPI.events.register($scope.gridId, 'onClick', onGridClick);
		platformGridAPI.events.register($scope.gridId, 'onDblClick', onGridDblClick);
		platformGridAPI.events.register($scope.gridId, 'onCopyComplete', onCopyCompleteHandler);

		$scope.$on('$destroy', function () {
			if (platformGridAPI.grids.exist($scope.gridId)) {
				platformGridAPI.grids.unregister($scope.gridId);
			}
		});
	}

	setupResultGrid();
	// setFocusToOnStartSearch();

	// un-register on destroy
	$scope.$on('$destroy', function () {
	});
}
