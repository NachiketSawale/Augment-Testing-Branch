/**
 * Created by lal on 2018-06-06.
 */
(function (angular) {
	'use strict';

	/* globals powerbi, $, _ */
	/**
	 * @name mtwoControlTowerVisualizationViewController
	 * @function
	 */
	var moduleName = 'mtwo.controltower';
	var ControlTowerModule = angular.module(moduleName);

	ControlTowerModule.controller('mtwoControlTowerVisualizationViewController', MtwoControlTowerViewController);
	MtwoControlTowerViewController.$inject = ['$scope', '$translate', 'mtwoControlTowerMainService', 'mtwoControlTowerReportsService', 'platformModalService', 'platformGridControllerService',
		'mtwoControlTowerUIStandardService', 'mtwoControlTowerValidationService', 'mtwoControlTowerProReportsDataService', 'mtwoControlTowerProDashboardService'];

	function MtwoControlTowerViewController($scope, $translate, mtwoControlTowerMainService, mtwoControlTowerReportsService, platformModalService, platformGridControllerService,
		mtwoControlTowerUIStandardService, mtwoControlTowerValidationService, mtwoControlTowerProReportsDataService, mtwoControlTowerProDashboardService) {

		function loadReport(selectedItem) {
			if (typeof (selectedItem) === 'undefined') {
				return;
			}
			
			if (selectedItem.AccessToken === '') {
				platformModalService.showMsgBox('mtwo.controltower.errorDialog.ErrorInfo.TokenNull', 'mtwo.controltower.errorDialog.ErrorInfo.header', 'error');
				return;
			}

			// powerbi shower area
			var models = window['powerbi-client'].models;
			var config = {};

			// add config for ControlTower
			config.id = selectedItem.Itemid;

			config.accessToken = selectedItem.AccessToken;
			config.pageView = 'fitToWidth';
			config.embedUrl = selectedItem.Embedurl;

			if (selectedItem.Itemtype === 2) {
				config.type = 'report';
				config.TokenType = models.TokenType.Embed;
				config.permissions = models.Permissions.All;
				config.viewMode = models.ViewMode.View;
				config.settings = {
					filterPaneEnabled: false,
					navContentPanaEnabled: false
				};
			} else if (selectedItem.Itemtype === 1) {
				config.type = 'dashboard';
			}

			var reportContainer = document.getElementById('visualization-view');
			powerbi.reset(reportContainer);
			powerbi.embed(reportContainer, config);
			$scope.tools.refresh();
		}

		mtwoControlTowerMainService.onRowChange.register(loadReport);
		mtwoControlTowerReportsService.onRowChange.register(loadReport);
		mtwoControlTowerProReportsDataService.onRowChange.register(loadReport);
		mtwoControlTowerProDashboardService.onRowChange.register(loadReport);

		var myGridConfig = {
			initCalled: false, columns: [], isFlatList: true
		};

		platformGridControllerService.initListController($scope, mtwoControlTowerUIStandardService, mtwoControlTowerReportsService, mtwoControlTowerValidationService, myGridConfig);

		var Viewtools = [
			{
				id: 't2002',
				sort: 2002,
				caption: $translate.instant('mtwo.controltower.reload'),
				type: 'item',
				iconClass: 'tlb-icons ico-reset', // add the icon for update the data from powerbi wervice.
				disabled: function () {
					var embedContainer = $('#visualization-view')[0];
					if (typeof (embedContainer.powerBiEmbed) !== 'undefined') {
						if (embedContainer.powerBiEmbed.embeType === 'report') {
							return false;
						}

					}
					return true;
				},
				fn: function ReloadPowerBI() {

					var embedContainer = $('#visualization-view')[0];
					if (powerbi.embeds.length > 0) {
						// Get a reference to the embedded report.
						var report = powerbi.get(embedContainer);
						if (typeof (report) !== 'undefined' && report !== '') {
							// Displays the report in full screen mode.
							report.refresh();
							report.reload();
						}
					}
				}
			},
			{
				id: 't2006',
				sort: 2006,
				caption: $translate.instant('mtwo.controltower.print'),
				type: 'item',
				iconClass: 'tlb-icons ico-print', // add the icon for print the data from powerbi wervice.
				disabled: function () {
					var embedContainer = $('#visualization-view')[0];
					if (typeof (embedContainer.powerBiEmbed) !== 'undefined') {
						if (embedContainer.powerBiEmbed.embeType === 'report') {
							return false;
						}

					}
					return true;
				},
				fn: function printPowerBI() {

					var embedContainer = $('#visualization-view')[0];
					if (powerbi.embeds.length > 0) {
						// Get a reference to the embedded report.
						var report = powerbi.get(embedContainer);
						if (typeof (report) !== 'undefined' && report !== '') {
							// Displays the report in full screen mode.
							report.print();
						}
					}
				}
			},
			{
				id: 't2003',
				sort: 2003,
				caption: $translate.instant('mtwo.controltower.fullScreen'),
				type: 'item',
				iconClass: 'tlb-icons ico-maximized', // add the icon for maximize the data from powerbi wervice.
				disabled: false,
				fn: function FullScreenPowerBI() {
					var embedContainer = $('#visualization-view')[0];
					if (powerbi.embeds.length > 0) {
						// Get a reference to the embedded report.
						var report = powerbi.get(embedContainer);
						if (typeof (report) !== 'undefined' && report !== '') {
							// Displays the report in full screen mode.
							report.fullscreen();
						}
					}
				}
			}
		];

		platformGridControllerService.addTools(Viewtools);

		var createBtnIdx = _.findIndex($scope.tools.items, function (item) {
			return item.id === 't109';
		});

		$scope.tools.items.splice(createBtnIdx, 1);

		var deleteBtnIdx = _.findIndex($scope.tools.items, function (item) {
			return item.id === 't1';
		});

		$scope.tools.items.splice(deleteBtnIdx, 1);

		deleteBtnIdx = _.findIndex($scope.tools.items, function (item) {
			return item.id === 't111';
		});

		$scope.tools.items.splice(deleteBtnIdx, 1);

		deleteBtnIdx = _.findIndex($scope.tools.items, function (item) {
			return item.id === 't12';
		});

		$scope.tools.items.splice(deleteBtnIdx, 1);

		deleteBtnIdx = _.findIndex($scope.tools.items, function (item) {
			return item.id === 't14';
		});

		$scope.tools.items.splice(deleteBtnIdx, 1);

		deleteBtnIdx = _.findIndex($scope.tools.items, function (item) {
			return item.id === 'gridSearchColumn';
		});

		$scope.tools.items.splice(deleteBtnIdx, 1);

		deleteBtnIdx = _.findIndex($scope.tools.items, function (item) {
			return item.id === 'gridSearchAll';
		});

		$scope.tools.items.splice(deleteBtnIdx, 1);

		$scope.$on('$destroy', function () {
			mtwoControlTowerMainService.onRowChange.unregister(loadReport);
			mtwoControlTowerReportsService.onRowChange.unregister(loadReport);
			mtwoControlTowerProReportsDataService.onRowChange.unregister(loadReport);
			mtwoControlTowerProDashboardService.onRowChange.unregister(loadReport);
		});
	}
})(angular);
