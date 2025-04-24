/**
 * Created by lvy on 4/2/2019.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	var moduleName = 'procurement.rfq';
	angular.module(moduleName).factory('procurementRfqSendHistoryService',
		['platformDataServiceFactory', 'procurementRfqMainService', 'basicsCommonFileDownloadService', 'platformPermissionService','ServiceDataProcessDatesExtension',
			function (platformDataServiceFactory, procurementRfqMainService, basicsCommonFileDownloadService, platformPermissionService,ServiceDataProcessDatesExtension) {

				var serviceOption = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'procurementRfqSendHistoryService',
						entityNameTranslationID: 'procurement.rfq.prcRfqSendHistoryContainerGridTitle',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'procurement/rfq/sendhistory/',
							endRead: 'list',
							initReadData: initReadData
						},
						dataProcessor: [new ServiceDataProcessDatesExtension(['DateSent'])],
						presenter: {
							list: {
								incorporateDataRead: incorporateDataRead
							}
						},
						entityRole: {
							leaf: {
								itemName: 'RfqSendHistory',
								parentService: procurementRfqMainService,
								doesRequireLoadAlways: true
							}
						},
						actions: {
							delete: false, create: false
						}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
				var service = serviceContainer.service;

				function initReadData(readData) {
					readData.filter = '?rfqId=' + procurementRfqMainService.getSelected().Id;
				}

				function incorporateDataRead(readData, data){
					return data.handleReadSucceeded(readData ? readData : [], data);
				}

				function downloadFiles() {
					var selectedDocumentDtos = service.getSelectedEntities();
					if (selectedDocumentDtos.length >= 2) {
						var docIdArray = _.map(selectedDocumentDtos, function (item) {
							return item.FileArchiveDocFk;
						});
						basicsCommonFileDownloadService.download(docIdArray);
					} else {
						basicsCommonFileDownloadService.download(selectedDocumentDtos[0].FileArchiveDocFk);
					}
				}
				function canDownloadFiles() {
					var currentItem = service.getSelected();
					if (currentItem) {
						return (!!currentItem.OriginFileName && 1000 !== currentItem.DocumentTypeFk) && platformPermissionService.hasRead('4eaa47c530984b87853c6f2e4e4fc67e');
					}
					return false;
				}

				service.canDownloadFiles = canDownloadFiles;
				service.downloadFiles = downloadFiles;

				return service;

			}
		]);
})(angular);