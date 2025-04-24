/**
 * Created by zwz on 01/06/2023.
 */
(function () {
	'use strict';
	/* global globals, _ */

	const moduleName = 'productionplanning.item';
	angular.module(moduleName).service('productionplanningActualTimeRecordingWizardHandler', Handler);
	Handler.$inject = ['$http', '$q', '$translate', 'platformModalService', 'platformSidebarWizardCommonTasksService'];

	function Handler($http, $q, $translate, platformModalService, platformSidebarWizardCommonTasksService) {

		function showDialog(date, siteId, timeSymbolId) {
			let modalCreateConfig = {
				width: '80%',
				height: 'max',
				resizeable: true,
				templateUrl: globals.appBaseUrl + 'productionplanning.item/templates/pps-act-time-recording-wizard-dialog.html',
				controller: 'productionplanningActualTimeRecordingWizardController',
				resolve: {
					$options: function () {
						return {
							date,
							siteId,
							timeSymbolId,
						};
					}
				}
			};
			platformModalService.showDialog(modalCreateConfig);
		}

		this.doActualTimeRecording = function (itemDataService, wizParam) {
			let selectedItem = itemDataService.getSelected();
			// // if no selection, show NoSelection error.
			// if (!platformSidebarWizardCommonTasksService.assertSelection(selectedItem)) {
			// 	return;
			// }
			// if not time symbol id, show error
			const timeSymbolId = parseInt(wizParam.TimeSymbolId, 10);
			if (!Number.isInteger(timeSymbolId) || timeSymbolId < 1) {
				platformSidebarWizardCommonTasksService.showErrorNoSelection('cloud.common.errorDialogTitle',
					$translate.instant('productionplanning.item.wizard.actualTimeRecording.timeSymbolIdNotSet'));
				return;
			}

			let date = _.isNil(selectedItem) || _.isNil(selectedItem.ProductionStart) ? Date.now(): selectedItem.ProductionStart;
			let siteId = _.isNil(selectedItem) ? -1: selectedItem.SiteFk;
			showDialog(date, siteId, timeSymbolId);
		};
	}
})();