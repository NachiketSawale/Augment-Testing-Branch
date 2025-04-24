(function (angular) {
	'use strict';
	var moduleName = 'documents.project';
	angular.module(moduleName).factory('documentsProjectWizardService',
		['globals','$translate', '$http', 'platformModalService', 'documentsProjectDocumentModuleContext', 'documentsProjectDocumentDataService',
			function (globals,$translate, $http, platformModalService, documentsProjectDocumentModuleContext, documentsProjectDocumentDataService) {
				var service = {};
				service.linkCx = function () {
					var projectMainService = documentsProjectDocumentModuleContext.getConfig().parentService;
					var selectedProject = projectMainService.getSelected();
					if (selectedProject) {
						projectMainService.updateAndExecute(function () {
							var modalOptions = {
								templateUrl: globals.appBaseUrl + 'documents.project/partials/cx-iframe.html',
								width: '600px',
								height: '460px',
								resizeable: false
							};
							platformModalService.showDialog(modalOptions).then(function () {

							});
						});
					} else {
						var modalOptions = {
							bodyText: $translate.instant('cloud.common.noCurrentSelection'),
							iconClass: 'ico-info'
						};
						platformModalService.showDialog(modalOptions);
					}
				};

				function showCxDialog(selectDocument) {
					var chkFileValue = [];
					var FileArchiveDocFk = selectDocument.FileArchiveDocFk;
					$http.get(globals.webApiBaseUrl + 'basics/common/document/fileArchiveName?fileArchiveDocId=' + FileArchiveDocFk).then(function (result) {
						if (result.data) {
							chkFileValue.push({
								cxDocId: 0,
								rev: selectDocument.Revision,
								name: selectDocument.OriginFileName,
								docId: selectDocument.Id,
								physicalname: result.data
							});
							var modalOptions = {
								templateUrl: globals.appBaseUrl + 'documents.project/partials/cx-upload.html',
								width: '600px',
								height: '460px',
								resizeable: false,
								value: chkFileValue
							};
							platformModalService.showDialog(modalOptions).then(function () {
							});

						}

					});
				}

				service.uploadCx = function () {
					var mainService = documentsProjectDocumentModuleContext.getConfig().parentService;
					// fireItemModified
					var documentService = documentsProjectDocumentDataService.getService(documentsProjectDocumentModuleContext.getConfig());
					var selectDocument = documentService.getSelected();
					mainService.update().then(function () {
						documentService.update();
					});
					if (selectDocument) {
						if (selectDocument.Url) {
							var modalOptions = {
								bodyText: 'Already publish to cx',
								iconClass: 'ico-info'
							};
							platformModalService.showDialog(modalOptions);
						} else {
							if (selectDocument.OriginFileName) {

								showCxDialog(selectDocument);

							} else {
								platformModalService.showDialog({
									templateUrl: globals.appBaseUrl + moduleName + '/partials/file-handler-lookup.html',
									backdrop: false
								}).then(function () {
									if (selectDocument.OriginFileName) {
										showCxDialog(selectDocument);
									}

								});
							}
						}
					} else {
						var noSelectModalOptions = {
							bodyText: $translate.instant('cloud.common.noCurrentSelection'),
							iconClass: 'ico-info'
						};
						platformModalService.showDialog(noSelectModalOptions);
					}

				};

				return service;
			}
		]);

})(angular);
