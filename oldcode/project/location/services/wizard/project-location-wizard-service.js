(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'project.location';

	angular.module(moduleName).service('projectLocationWizardService', ProjectLocationWizardService);

	ProjectLocationWizardService.$inject = ['_', '$rootScope', '$injector', '$http', '$translate',
		'platformCreateUuid', 'platformModalService', 'platformSidebarWizardCommonTasksService',
		'projectMainService', 'projectLocationMainService'];

	function ProjectLocationWizardService(_, $rootScope, $injector, $http, $translate,
		platformCreateUuid, platformModalService, platformSidebarWizardCommonTasksService,
		projectMainService, projectLocationMainService) {
		const self = this;

		this.doFileImport = function doLocationXmlFileImport(importOptions) {
			const fileUpload = angular.element('<input type="file" accept=".xml"/>');

			if (importOptions.projectId !== 0 && fileUpload) {
				fileUpload.bind('change', function () {
					let file = fileUpload[0].files[0];
					if (file !== undefined) {
						if (file.name.substr(file.name.lastIndexOf('.')).toLowerCase() !== '.xml') {
							platformModalService.showErrorBox('project.location.importLocationsWrongFileType', importOptions.header);
						} else {
							let basicsCommonSimpleUploadService = $injector.get('basicsCommonSimpleUploadService');
							basicsCommonSimpleUploadService.uploadFile(file, {
								basePath: 'project/location/import/',
								chunkSize: 1024 * 1024 * 10,
								customRequest: {
									ProjectId: importOptions.projectId,
									ImportType: importOptions.type
								}
							}).then(function (success) {
								if(success.Error) {
									let modalOptions = {
										headerText: importOptions.header,
										bodyText: success.Error,
										iconClass: 'ico-warning'
									};
									platformModalService.showDialog(modalOptions);
								} else {
									platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(importOptions.header);
									projectLocationMainService.setTree(success.Result);
								}
							});
						}
					}
				}).bind('destroy', function () {
					fileUpload.unbind('change');
				});
				fileUpload.click();
			}
		};

		this.importProjectLocationsInBaselineFormat = function importProjectLocationsInBaselineFormat() {
			if (projectMainService.getSelected() !== null) {
				const projectId = projectMainService.getSelected().Id;

				self.doFileImport({
					projectId: projectId,
					type: 1,
					header: 'project.location.importFromBaseline'
				});
			} else {
				let modalOptions = {
					headerText: $translate.instant('project.location.importFromBaseline'),
					bodyText: $translate.instant('project.main.noCurrentSelection'),
					iconClass: 'ico-info'
				};

				platformModalService.showDialog(modalOptions);
			}

		};

		this.importProjectLocationsIn40Format = function importProjectLocationsIn40Format() {
			if (projectMainService.getSelected() !== null) {
				const projectId = projectMainService.getSelected().Id;

				self.doFileImport({
					projectId: projectId,
					type: 2,
					header: 'project.location.importFrom40'
				});
			} else {
				let modalOptions = {
					headerText: $translate.instant('project.location.importFrom40'),
					bodyText: $translate.instant('project.main.noCurrentSelection'),
					iconClass: 'ico-info'
				};

				platformModalService.showDialog(modalOptions);
			}
		};

		this.exportProjectLocationsIn40Format = function exportProjectLocationsIn40Format() {
			if (projectMainService.getSelected() !== null) {
				const projectId = projectMainService.getSelected().Id;

				// $rootScope.$broadcast('asyncInProgress', true);
				return $http.get(globals.webApiBaseUrl + 'project/location/export/xml?projectId=' + projectId)
					.then(function (response) {

						// $rootScope.$broadcast('asyncInProgress', false);

						let template = '<a id="downloadLink" href="" download="" style="visibility: hidden;"></a>';
						let markup = angular.element(document.querySelector('#sidebar-wrapper'));
						markup.append(template);

						let link = angular.element(document.querySelector('#downloadLink'));
						if (link !== undefined && link.length > 0 && projectId > 0) {
							link[0].href = response.data;
							let content = response.headers()['content-disposition'];
							link[0].download = content.substr(content.indexOf('filename=') + 9);
							link[0].click();
						}

					}, function () {
						// $rootScope.$broadcast('asyncInProgress', false);
					});
			} else {
				let modalOptions = {
					headerText: $translate.instant('project.location.exportIn40Format'),
					bodyText: $translate.instant('project.main.noCurrentSelection'),
					iconClass: 'ico-info'
				};

				return platformModalService.showDialog(modalOptions);
			}
		};

	}
})(angular);
