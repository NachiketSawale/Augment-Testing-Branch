(function(){
	/* global globals */
	'use strict';

	let moduleName = 'basics.common';
	angular.module(moduleName).factory('basicsCommonChartConfigCommService', ['platformDialogService','$translate',
		function (platformDialogService, $translate){
			let service = {};

			service.showDialog = function (dialogOptions){
				dialogOptions = dialogOptions || {};
				const dlgConfig = {
					width: dialogOptions.width || '1000px',
					resizeable: dialogOptions.resizeable,
					height: dialogOptions.height || '500px',
					headerText: dialogOptions.dialogTitle || $translate.instant('basics.common.chartConfig.windowTitle'),
					bodyTemplateUrl: globals.appBaseUrl + 'basics.common/templates/chart-config.html',
					backdrop: dialogOptions.backdrop,
					showOkButton: true,
					showCancelButton: true,
					value: dialogOptions,
				};

				return platformDialogService.showDialog(dlgConfig).then(function (result){
					return result;
				});
			};

			return service;
		}
	]);
})();