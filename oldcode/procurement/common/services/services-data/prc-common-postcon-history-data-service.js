/**
 * Created by lvy on 8/2/2019.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	var moduleName = 'procurement.common';
	angular.module(moduleName).factory('procurementCommonPostconHistoryDataService',
		['procurementCommonDataServiceFactory', 'platformPermissionService', 'basicsCommonFileDownloadService', '$q', '$http','cxService','procurementContextService',
			function (dataServiceFactory, platformPermissionService, basicsCommonFileDownloadService, $q, $http,cxService, moduleContext) {
				var constructorFn = function (parentService) {
					var module = parentService.getModule();
					var serviceOptions = {
						flatLeafItem: {
							serviceName: 'procurementCommonPostconHistoryDataService',
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
					service.canDownloadFiles = canDownloadFiles;
					service.downloadFiles = downloadFiles;
					service.canPreview = canPreview;
					service.getPreviewConfig = getPreviewConfig;
					return service;

					function incorporateDataRead(readData, data){
						return data.handleReadSucceeded(readData ? readData : [], data, true);
					}
					function initReadData(readData) {
						var parentSelected = parentService.getSelected();
						var pesId = '', qtoId = '', invoiceId = '', contractId = '';
						if (module) {
							if (module.name === 'procurement.pes') {
								pesId = parentSelected.Id;
							}
							else if (module.name === 'procurement.invoice') {
								invoiceId = parentSelected.Id;
							}
							else if (module.name === 'procurement.contract') {
								contractId = parentSelected.Id;
							}
							readData.filter +='?pesId='+pesId+'&qtoId='+qtoId+'&invoiceId='+invoiceId+'&contractId='+contractId;
						}
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
						if(defaultEntity !== undefined){
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
							}
							else {
								deffered.resolve({
									Url: currentItem.Url,
									title: ''
								});
							}
						}
						else {
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
				};
				return dataServiceFactory.createService(constructorFn, 'procurementCommonPostconHistoryDataService');
			}]);
})(angular);