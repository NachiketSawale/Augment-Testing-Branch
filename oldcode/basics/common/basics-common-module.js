/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'basics.common';

	const appCloudCommon = angular.module(moduleName, ['ui.router', 'platform']);
	globals.modules.push(moduleName);

	/**
	 * @ngdoc module
	 * @name basics.common
	 * @description
	 * Module definition of the basics.common module
	 **/
	angular.module(moduleName).config(['mainViewServiceProvider', '$stateProvider',
		function (mainViewServiceProvider, $stateProvider) {
			let globalResolveDone = false;

			mainViewServiceProvider.globalResolves({
				basicsCommonLoadSchema: ['platformSchemaService', function (platformSchemaService) {
					if (!globalResolveDone) {
						globalResolveDone = true;

						return platformSchemaService.getSchemas([
							{
								typeName: 'MatrixBackgroundDto',
								moduleSubModule: 'Basics.Common'
							},
							{
								typeName: 'MatrixFontDto',
								moduleSubModule: 'Basics.Common'
							},
							{
								typeName: 'ExcelProfileDetailDto',
								moduleSubModule: 'Basics.Common'
							},{
								typeName: 'StatusHistoryDto',
								moduleSubModule: 'Basics.Common'
							}
						]);
					}

					return true;
				}]
			});

			$stateProvider.state('imgview', {
				url: '/imgview?company&roleid&docid',
				template: '<img-view></img-view>',
				resolve: {
					navigateState: ['platformLogonService', '$stateParams','platformModalService',
						function (logonService, $stateParams, platformModalService) {
							const navInfo = $stateParams;
							return logonService.checkCompany(true, navInfo ? navInfo.company : undefined, navInfo ? navInfo.roleid : undefined)
								.then((/* ok */) => true, (error) => platformModalService.showErrorBox(error.message, 'cloud.desktop.api.naverrtitle'));
						}],
					registerTranslation: ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName]);
					}],
					secureContextRole: ['platformContextService','navigateState','registerTranslation',
						(platformContextService) => {
							return platformContextService.isSecureClientRoleReady;
						}
					]
				}
			});



			$stateProvider.state('pdfview', {
				url: '/pdfview?company&roleid&docid',
				template: '<pdf-view></pdf-view>',
				resolve: {
					navigateState: ['platformLogonService', '$stateParams','platformModalService',
						function (logonService, $stateParams, platformModalService) {
							const navInfo = $stateParams;
							return logonService.checkCompany(true, navInfo ? navInfo.company : undefined, navInfo ? navInfo.roleid : undefined)
								.then((/* ok */) => true, (error) => platformModalService.showErrorBox(error.message, 'cloud.desktop.api.naverrtitle'));
						}],
					registerTranslation: ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName]);
					}],
					secureContextRole: ['platformContextService','navigateState','registerTranslation',
						(platformContextService) => {
							return platformContextService.isSecureClientRoleReady;
						}
					]
				}
			});

		}
	]);

	appCloudCommon.run(['$templateCache', 'platformSchemaService', function ($templateCache) {
		$templateCache.loadTemplateFile('basics.common/templates/upload-progress-bar.html');
		$templateCache.loadTemplateFile(globals.appBaseUrl + 'basics.common/templates/translation/translate-cell.html');
	}]);

})(angular);
