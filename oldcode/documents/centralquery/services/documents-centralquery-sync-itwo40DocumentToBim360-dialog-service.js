/**
 * Created by deh on 2020/06/10
 */
(function (angular) {
	'use strict';
	var moduleName = 'documents.centralquery';
	var projectMainModule = angular.module(moduleName);

	/**
     * @ngdoc service
     * @name documentsCentralquerySyncITwo40DocumentToBim360DialogService
     * @function
     *
     */
	/* jshint -W072 */ // many parameters because of dependency injection
	projectMainModule.service('documentsCentralquerySyncITwo40DocumentToBim360DialogService', documentsCentralquerySyncITwo40DocumentToBim360DialogService);

	documentsCentralquerySyncITwo40DocumentToBim360DialogService.$inject = ['globals','$q', '$injector', '$translate', '$http', '$interval', '$window',
		'platformTranslateService', 'platformModalFormConfigService',
		'platformModalService'];

	function documentsCentralquerySyncITwo40DocumentToBim360DialogService(globals,$q, $injector, $translate, $http, $interval, $window,
		platformTranslateService, platformModalFormConfigService,
		platformModalService) {
		var services = {};
		var formConfig = {
			fid: 'documents.centralquery.iTwo40DocumentsToBim360',
			version: '0.2.4',
			showGrouping: false,
			groups: [
				{
					gid: 'baseGroup',
					// attributes
					attributes: ['ProjectName']
				}
			],
			rows: [
				// configuration UI
				{
					gid: 'baseGroup',
					rid: 'ProjectName',
					model: 'ProjectName',
					label$tr$: 'project.main.projectName',
					type: 'description',
					sortOrder: 1,
					readonly: true
				}
			]
		};

		var dialogConfig = {
			templateUrl: globals.appBaseUrl + 'documents.centralquery/templates/bim360/documents-centralquery-itwo40toBim360-dialog-service.html',
			backdrop: false,
			height: '600px',
			width: '1024px',
			resizeable: true
		};

		services.getFormConfig = function getFormConfig() {
			return formConfig;
		};

		services.showPostDialog = function showPostDialog() {
			// var modalSyncDefectConfig = getDialogConfig();
			platformModalService.showDialog(dialogConfig);
			// cloudDeskBim360Service.showDialog(modalSyncDefectConfig) ;
		};

		return services;
	}
})(angular);
