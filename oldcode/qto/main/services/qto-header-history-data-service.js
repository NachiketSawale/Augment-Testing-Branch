/**
 * Created by lvy on 8/5/2019.
 */
(function (angular) {
	/* global  globals, _ */
	'use strict';

	var moduleName = 'qto.main';
	angular.module(moduleName).factory('qtoHeaderHistoryDataService',
		['platformDataServiceFactory', 'platformPermissionService', 'qtoMainHeaderDataService', 'basicsCommonFileDownloadService', '$q', '$http', 'cxService',
			function (dataServiceFactory, platformPermissionService, parentService, basicsCommonFileDownloadService, $q, $http, cxService) {
				var serviceOptions = {
					flatLeafItem: {
						serviceName: 'qtoHeaderHistoryDataService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'procurement/common/postconhistory/',
							initReadData: initReadData
						},
						presenter: {
							list: {
								incorporateDataRead: incorporateDataRead
							}
						},
						entityRole: {
							leaf: {
								itemName: 'PrcPostconHistory',
								parentService: parentService
							}
						},
						actions: {
							delete: false,
							create: false
						}
					}
				};
				var serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
				var service = serviceContainer.service;

				function incorporateDataRead(readData, data) {
					return data.handleReadSucceeded(readData ? readData : [], data);
				}

				function initReadData(readData) {
					var parentSelected = parentService.getSelected();
					var pesId = '', qtoId = '', invoiceId = '', contractId = '';
					qtoId = parentSelected.Id;
					readData.filter += '?pesId' + pesId + '&qtoId=' + qtoId + '&invoiceId=' + invoiceId + '&contractId=' + contractId;
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

				function canPreview() {
					var currentItem = service.getSelected();
					if (currentItem) {
						return (!!currentItem.OriginFileName || 1000 === currentItem.DocumentTypeFk || null !== currentItem.Url && currentItem.Url.length > 0) && platformPermissionService.hasRead('4eaa47c530984b87853c6f2e4e4fc67e');
					}
					return false;
				}

				function getPreviewConfig(defaultEntity) {
					var deffered = $q.defer();
					var currentItem = service.getSelected();
					if (defaultEntity !== undefined) {
						currentItem = defaultEntity;
					}
					var fileArchiveDocId = currentItem.FileArchiveDocFk;

					if (currentItem.Url) {
						if (currentItem.Url.indexOf('itwocx') > -1) {
							cxService.LoginCx().then(function (backdata) {
								var key = backdata.key;
								var url = currentItem.Url + '?k=' + key;
								deffered.resolve({
									Url: url,
									title: ''
								});
							});
						} else {
							deffered.resolve({
								Url: currentItem.Url,
								title: ''
							});
						}
					} else {
						if (fileArchiveDocId) {
							$http.get(globals.webApiBaseUrl + 'basics/common/document/preview?fileArchiveDocId=' + fileArchiveDocId).then(function (result) {
								deffered.resolve({
									src: result.data,
									documentType: currentItem.DocumentTypeFk,
									title: currentItem.OriginFileName
								});
							});
						}
					}
					return deffered.promise;
				}

				service.canDownloadFiles = canDownloadFiles;
				service.downloadFiles = downloadFiles;
				service.canPreview = canPreview;
				service.getPreviewConfig = getPreviewConfig;
				return service;
			}]);
})(angular);