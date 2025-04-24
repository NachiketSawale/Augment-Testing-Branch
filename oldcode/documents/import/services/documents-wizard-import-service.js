(function (angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('documents.import').factory('documentsImportWizardImportService',
		[
			'globals',
			'_',
			'$q',
			'$translate',
			'$http',
			'platformTranslateService',
			'platformModalService',
			'PlatformMessenger',
			function (globals,_,$q,
				$translate,
				$http,
				platformTranslateService,
				platformModalService,
				PlatformMessenger) {

				var service = {};
				var dialogConfig = {
					title: $translate.instant('documents.import.wizard.importDialogHeaderText'),
					dataItems: [],
					OKBtnText: 'cloud.common.taskBarImport',
					templateUrl: globals.appBaseUrl + 'documents.import/partials/documents-import-file-list-dialog.html',
					backdrop: false,
					cancelBtnText: 'cloud.common.cancel',
					OKBtnRequirement: false,
					gridConfiguration: {
						uuid: '17D385FB736A41BDA8F4FD3E0F96794E',
						version: '0.2.4',
						columns: [
							{
								id: 'Description',
								field: 'Description',
								name: 'FileName',
								name$tr$: 'procurement.invoice.entityXmlFile',
								width: 500
							}
						]
					},
					allowMultiple: true,
					dialogLoading: true,
					loadingInfo: 'Is Importing...',
					handleOK: function handleOK(result) {
						var fileNames = [];
						if (result) {
							angular.forEach(result, function (item) {
								fileNames.push(item.Description);
							});
						}
						$http.post(globals.webApiBaseUrl + 'documents/documentsimport/import', fileNames).then(function (res) {
							if (res && res.data) {
								service.importTaskCreateComplete.fire(res.data);
							}
						});
					}
				};
				var errorDialogConfig = {
					headerTextKey: $translate.instant('documents.import.error'),
					showCancelButton: true,
					iconClass: 'error'
				};
				service.execute = function () {
					// todo: latter delete the testItems
					$http.post(globals.webApiBaseUrl + 'documents/documentsimport/getsharexml').then(function (items) {
						if (items.data) {
							if (items.data.ErrorMessage) {
								errorDialogConfig.bodyTextKey = items.data.ErrorMessage;
								platformModalService.showDialog(errorDialogConfig);
							} else {
								var dates = [];
								var IdIndex = 0;
								angular.forEach(items.data.XmlList, function (item) {
									dates.push({Id: IdIndex, Description: item});
									IdIndex = IdIndex + 1;
								});
								dialogConfig.dataItems = dates;
								platformTranslateService.translateGridConfig(dialogConfig.gridConfiguration);

								platformModalService.showDialog(dialogConfig).then(function (result) {
									if (result.isOK) {
										if (dialogConfig.handleOK) {
											dialogConfig.handleOK(result.data);
										}
									} else {
										if (dialogConfig.handleCancel) {
											dialogConfig.handleCancel(result);
										}
									}
								});
							}

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
				service.importTaskCreateComplete = new PlatformMessenger();

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