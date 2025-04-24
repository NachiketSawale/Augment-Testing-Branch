(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.invoice').factory('procurementInvoiceWizardImportService',
		['$q', '$translate', '$http', 'platformTranslateService', 'platformModalService',
			'procurementInvoiceWizardImportResultService', 'PlatformMessenger',
			function ($q, $translate, $http, platformTranslateService, platformModalService,
				procurementInvoiceWizardImportResultService, PlatformMessenger) {
				var service = {};

				var dialogConfig = {
					title: $translate.instant('procurement.invoice.wizard.invoice.import.headerText'),
					resizeable: true,
					dataItems: [],
					bodyTextKey: $translate.instant('procurement.invoice.wizard.invoice.import.chooseItems'),
					headerTextKey: 'procurement.invoice.title.importInvoiceTitle',
					OKBtnText: 'Import',
					templateUrl: globals.appBaseUrl + 'procurement.invoice/partials/invoice-import-file-list-dialog.html',
					headerTemplateUrl: 'modaldialog/modaldialog-header-template.html',
					cancelBtnText: 'cloud.common.cancel',
					OKBtnRequirement: false,
					gridConfiguration: {
						uuid: 'C305AD78C0ED489CAC74DE0B8C35183B',
						version: '0.2.4',
						columns: [
							{
								id: 'FileType',
								field: 'FileType',
								name: 'FileType',
								name$tr$: 'procurement.invoice.entityXmlFileType',
								width: 75
							}, {
								id: 'FolderName',
								field: 'FolderName',
								name: 'FolderName',
								name$tr$: 'procurement.invoice.entityXmlFolderName',
								width: 75
							},{
								id: 'Description',
								field: 'Description',
								name: 'FileName',
								name$tr$: 'procurement.invoice.entityXmlFile',
								width: 175
							}, {
								id: 'Status',
								field: 'Status',
								name: 'Status',
								name$tr$: 'procurement.invoice.importFileStatus',
								width: 145
							}
						]
					},
					allowMultiple: true,
					dialogLoading: true,
					loadingInfo: 'Is Loading Files...',
					handleOK: function handleOK(result, param) {
						procurementInvoiceWizardImportResultService.handleResult(result, param);
					}
				};

				service.execute = function (param) {
					// noinspection JSCheckFunctionSignatures
					$http.post(globals.webApiBaseUrl + 'procurement/invoice/getsharefiles').then(function (items) {
						if (items.data && items.data.length > 0) {
							var dates = [];
							var IdIndex = 0;
							var alreadyImported = $translate.instant('procurement.invoice.alreadyImported'),
								newImported = $translate.instant('procurement.invoice.newImported');
							angular.forEach(items.data, function (item) {
								dates.push(
									{
										Id: IdIndex,
										Description: item.FileName,
										Status: item.IsErrorFile ? alreadyImported : newImported,
										IsErrorFile: item.IsErrorFile,
										IsLocatedInCompanyFolder: item.IsLocatedInCompanyFolder,
										FolderName: item.FolderName,
										FileType: item.FileType,
									});
								IdIndex = IdIndex + 1;
							});

							dialogConfig.dataItems = dates;
							platformTranslateService.translateGridConfig(dialogConfig.gridConfiguration);
							platformModalService.showDialog(dialogConfig).then(function (result) {
								if (result.isOK) {
									if (dialogConfig.handleOK) {
										dialogConfig.handleOK(result.data, param);
									}
								} else {
									if (dialogConfig.handleCancel) {
										dialogConfig.handleCancel(result);
									}
								}
							});
						}
					});
				};

				service.checkAllItems = function (newValue) {
					angular.forEach(dialogConfig.dataItems, function (item) {
						item.IsChecked = newValue;
					});
					return true;
				};

				service.isOKBtnRequirement = function () {
					for (var i = 0; i < dialogConfig.dataItems.length; i++) {
						var item = dialogConfig.dataItems[i];
						if (item && item.IsChecked === true) {
							return true;
						}
					}
					return false;
				};

				service.refreshEntity = new PlatformMessenger();

				service.getDataItems = function getDataItems() {
					return $q.when(dialogConfig.dataItems);
				};

				service.getSelectedItems = function getSelectedItems() {
					return _.filter(dialogConfig.dataItems, {IsChecked: true});
				};

				service.getGridConfiguration = function getGridConfiguration() {
					return dialogConfig.gridConfiguration;
				};

				return service;
			}]);

})(angular);