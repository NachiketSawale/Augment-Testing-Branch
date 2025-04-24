(function (angular) {
	'use strict';

	/*
	 ** model.wdeviewer module is created.
	 */
	var moduleName = 'model.wdeviewer';
	var languageModuleName = 'cloud.common';

	angular.module(moduleName, [languageModuleName, 'platform', 'basics.common']);

	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider', '$stateProvider',
		function (mainViewServiceProvider, $stateProvider) {

			var options = {
				'moduleName': moduleName
			};

			mainViewServiceProvider.registerModule(options);

			let globalResolveDone = false;

			mainViewServiceProvider.globalResolves({
				modelWdeViewerLoadSystemOption: ['modelWdeViewerWdeService', function(modelWdeViewerWdeService) {
					if (!globalResolveDone) {
						globalResolveDone = true;
						return modelWdeViewerWdeService.loadSystemOption();
					}

					return true;
				}]
			});

			$stateProvider.state('wdeviewer', {
				url: '/wdeviewer?company&roleid&docid',
				templateUrl: function () {
					return globals.appBaseUrl + 'model.wdeviewer/templates/ige-preview.html';
				},
				controller: 'modelWdeViewerIgePreviewController',
				resolve: {
					navigatetState: ['platformLogonService', '$stateParams', function (logonService, $stateParams) {
						console.log('navigate state called ...resolving...');
						var navInfo = $stateParams;
						return logonService.checkCompany(true, navInfo ? navInfo.company : undefined, navInfo ? navInfo.roleid : undefined);
					}],
					registerTranslation: ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName]);
					}]
				}
			});

			$stateProvider.state('gotoview', {
				url: '/gotoview?company&roleid&modulename&key',
				templateUrl: function () {
					return globals.appBaseUrl + 'model.wdeviewer/templates/wde-preview.html';
				},
				controller: 'modelWdePreviewGotoController',
				resolve: {
					navigatetState: ['platformLogonService', '$stateParams', function (logonService, $stateParams) {
						var navInfo = $stateParams;
						return logonService.checkCompany(true, navInfo ? navInfo.company : undefined, navInfo ? navInfo.roleid : undefined);
					}],
					registerTranslation: ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName]);
					}]
				}
			});

			$stateProvider.state('editorpreview', {
				url: '/editorpreview?company&roleid&docid',
				templateUrl: function () {
					return globals.appBaseUrl + 'basics.common/templates/drawing/preview-editor-dialog.html';
				},
				controller: 'basicsCommonEditorPreviewController',
				resolve: {
					navigatetState: ['platformLogonService', '$stateParams', function (logonService, $stateParams) {
						var navInfo = $stateParams;
						return logonService.checkCompany(true, navInfo ? navInfo.company : undefined, navInfo ? navInfo.roleid : undefined);
					}],
					registerTranslation: ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName]);
					}]
				}
			});

			$stateProvider.state('editormsgpreview', {
				url: '/editormsgpreview?company&roleid&docid',
				templateUrl: function () {
					return globals.appBaseUrl + 'basics.common/templates/drawing/preview-editor-dialog.html';
				},
				// template: '<div>{{ editorContent }}</div>',
				controller: 'basicsCommonEditorMsgPreviewController',
				resolve: {
					navigatetState: ['platformLogonService', '$stateParams', function (logonService, $stateParams) {
						var navInfo = $stateParams;
						return logonService.checkCompany(true, navInfo ? navInfo.company : undefined, navInfo ? navInfo.roleid : undefined);
					}],
					registerTranslation: ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName]);
					}]
				}
			});
		}

	]);

})(angular);
