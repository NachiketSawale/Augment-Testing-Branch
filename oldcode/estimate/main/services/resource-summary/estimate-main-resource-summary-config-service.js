/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals */
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainResourceSummaryConfigService',
		['$injector', '$translate', 'platformModalService', 'platformMasterDetailDialogService', 'basicsCommonConfigLocationListService', 'estimateMainResourceSummaryConfigDataService',
			function ($injector, $translate, platformModalService, platformMasterDetailDialogService, basicsCommonConfigLocationListService, odsService) {

				let service = {};



				service.showModelDialog = function (dialogOptions) {
					let dlgConfig = {
						width: dialogOptions.width || '700px',
						resizeable: dialogOptions.resizeable,
						height: dialogOptions.height || '450px',
						headerTextKey: dialogOptions.dialogTitle,
						bodyTemplateUrl: globals.appBaseUrl + 'estimate.main/templates/resource-summary/estimate-main-master-detail-dialog-body-template.html',
						backdrop: dialogOptions.backdrop,
						showOkButton: true,
						showCancelButton: true
					};

					if (dialogOptions.footerTemplateUrl) {
						dlgConfig.footerTemplateUrl = dialogOptions.footerTemplateUrl;
					}

					if (dialogOptions.headerTemplateUrl) {
						dlgConfig.headerTemplateUrl = dialogOptions.headerTemplateUrl;
					}

					return platformModalService.showDialog(dlgConfig);
				};

				service.showDialog = function() {
					odsService.loadData().then(function () {
						let dlgOptions = {
							dialogTitle: 'estimate.main.summaryConfig.dialogTitle',
							resizeable: true,
							height:'max',
							backdrop: 'static',
							itemDisplayMember: 'name'
						};

						return service.showModelDialog(dlgOptions).then(function (result) {
							if (result.ok) {
								odsService.saveData().then(function (result) {
									if(result){
										odsService.onAfterSaved.fire(true);

										// Refresh the resource summary grid data after saving
										$injector.get('estimateResourcesSummaryService').refresh();
									}
								});
							}
						}, function(){
							// if it is cancelled, reset the settings
							// reload config again
							odsService.clearData();
							odsService.loadData();
						});
					});
				};

				return service;
			}]);

})();
