
(function (angular) {
	'use strict';

	// DEV-14495
	const moduleName = 'documents.project';
	angular.module(moduleName).factory('documentProjectDownloadErrorDialogService',
		['$translate', '$http', '$q', 'basicsPermissionServiceFactory', 'platformModalService',
			function ($translate, $http, $q, basicsPermissionServiceFactory, platformModalService) {

				const documentProjectPermissionService = basicsPermissionServiceFactory.getService('documentProjectPermissionDescriptor');
				let service = {
					permissionDescriptor: '4eaa47c530984b87853c6f2e4e4fc67e'
				};
				service.canDownload = function (selectItems) {
					const defer = $q.defer();
					const noFiles = hasFileArchiveDoc(selectItems);
					const filterItems = selectItems.filter(function (item) {
						return !!item.FileArchiveDocFk;
					});
					hasFile(filterItems).then(function (res) {
						res.forEach(function (item) {
							const findItem = selectItems.find(e => e.FileArchiveDocFk === item.FileArchiveDocId);
							if (findItem && item.Reason && item.Reason.length > 0) {
								let dto = convertDto(findItem);
								dto.Reason = item.Reason;
								noFiles.push(dto);
							}
						});
						if (noFiles.find(e => e.Reason !== null)) {
							service.showDialog(noFiles);
							defer.resolve(true);
						} else {
							defer.resolve(false);
						}
					});
					return defer.promise;
				}
				service.showDialog = function (entities) {
					platformModalService.showDialog({
						headerText: $translate.instant('basics.common.taskBar.warning'),
						templateUrl: globals.appBaseUrl + 'documents.project/partials/file-download-error.html',
						width: 800,
						height: 800,
						resizeable: true,
						params: entities
					});
				}

				function convertDto(item, reason) {
					return {
						Id: item.Id,
						FileArchiveDocFk: item.FileArchiveDocFk,
						OriginFileName: item.OriginFileName,
						Code: item.Code,
						Description: item.Description,
						Reason: reason ? $translate.instant(reason) : null,
					};
				}

				function hasFileArchiveDoc(selectItems) {
					const noFiles = selectItems.filter(function (item) {
						return !(item.FileArchiveDocFk || item.ArchiveElementId || item.DatengutFileId);
					});
					return noFiles.map(item => {
						return convertDto(item, 'documents.project.downloadNoFile');
					});
				}

				function hasFile(selectItems) {
					const fileDocIds = selectItems.map(function (item) {
						return item.FileArchiveDocFk;
					});
					const defer = $q.defer();
					$http.post(globals.webApiBaseUrl + 'basics/common/document/hasfile', fileDocIds).then(function (result) {
						const response = result.data ? result.data : result;
						defer.resolve(response);
					});
					return defer.promise;
				}

				return service;
			}
		]);

})(angular);