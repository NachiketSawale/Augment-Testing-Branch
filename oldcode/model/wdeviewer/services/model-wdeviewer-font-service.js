(function (angular){
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).factory('modelWdeViewerFontService', ['$http', '$translate', 'platformWizardDialogService',
		function ($http, $translate, platformWizardDialogService) {
			var service = {};

			service.showUploadDialog = function () {
				const creationData = {};
				const wzConfig = {
					title: $translate.instant('model.wdeviewer.font.title'),
					steps: [
						{
							id: 'upload.prepare',
							disallowNext: true,
							canFinish: false,
							form: {
								fid: 'model.wdeviewer.uploadFont',
								showGrouping: false,
								skipPermissionsCheck: true,
								groups: [{
									gid: 'baseGroup'
								}],
								rows: [
									{
										gid: 'baseGroup',
										rid: 'file',
										label: 'Font Files',
										label$tr$: 'model.wdeviewer.font.label',
										model: 'fontFiles',
										type: 'fileselect',
										options: {
											maxSize: '8MB',
											// fileFilter: '.shx',
											multiSelect: true,
											retrieveFile: true
										}
									}
								]
							},
							watches: [{
								expression: 'fontFiles',
								fn: function (changeInfo) {
									changeInfo.wizard.steps[0].disallowNext = !changeInfo.newValue;
								}
							}]
						}, {
							id: 'upload.execute',
							disallowBack: true,
							disallowNext: true,
							canFinish: false,
							loadingMessage: 'Importing Fonts'
						}
					],
					onChangeStep: function (stepInfo) {
						if (stepInfo.step.id === 'upload.execute') {
							uploadFont(stepInfo.step);
						}
					}
				};

				function uploadFont(step) {
					let data = new FormData();

					creationData.fontFiles.forEach(function (item) {
						data.append('files', item.file);
					});

					$http.post(globals.webApiBaseUrl + 'model/wdeviewer/font/upload', data, {
						transformRequest: angular.identity,
						headers: {'Content-Type': undefined}
					}).then(function (res) {
						step.loadingMessage = undefined;
						step.message = res.data;
						step.canFinish = true;
					});
				}

				platformWizardDialogService.translateWizardConfig(wzConfig);

				return platformWizardDialogService.showDialog(wzConfig, creationData).then(function (result) {
					if (result.success) {

					}

					return null;
				});
			};

			return service;
		}
	]);

})(angular);