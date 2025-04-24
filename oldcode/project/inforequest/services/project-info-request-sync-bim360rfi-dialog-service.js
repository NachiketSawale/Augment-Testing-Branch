/**
 * Created by deh on 2020/06/10
 */
(function (angular) {
	'use strict';
	var moduleName = 'project.inforequest';
	var projectMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name projectInfoRequestSyncBim360RfiDialogService
	 * @function
	 *
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	projectMainModule.service('projectInfoRequestSyncBim360RfiDialogService', ProjectInfoRequestSyncBim360RfiDialogService);

	ProjectInfoRequestSyncBim360RfiDialogService.$inject = ['$q', '$injector', '$translate', '$http', '$interval', '$window',
		'platformTranslateService', 'platformModalFormConfigService',
		'platformModalService', 'basicsLookupdataLookupDescriptorService', 'cloudDeskBim360Service'];

	function ProjectInfoRequestSyncBim360RfiDialogService($q, $injector, $translate, $http, $interval, $window,
	                                                      platformTranslateService, platformModalFormConfigService,
	                                                      platformModalService, basicsLookupdataLookupDescriptorService,
	                                                      cloudDeskBim360Service) {
		var services = {};
		var formConfig = {
			fid: 'project.inforequest.syncRFIs2Defect',
			version: '0.2.4',
			showGrouping: false,
			groups: [
				{
					gid: 'baseGroup',
					// TODO attributes
					attributes: ['ProjectName']
				}
			],
			rows: [
				// TODO configuration UI
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
			templateUrl: globals.appBaseUrl + 'project.inforequest/templates/bim360/project-inforequest-sync-rfi-dialog-service.html',
			backdrop: false,
			resizeable: true
		};

		function getDialogConfig() {
			var modalSyncDefectConfig = {
				title: $translate.instant('project.inforequest.bim360RFIs.syncRFITitle'),
				resizeable: true,
				dataItem: {
					ProjectName: '',
				},
				formConfiguration: formConfig,
				handleOK: function handleOK(result) {
				}
			};

			modalSyncDefectConfig.dialogOptions = {
				disableOkButton: function () {
					// TODO
					// when return false : button ok is disabled
				}
			};

			return modalSyncDefectConfig;
		}

		function showDialog(modalSyncDefectConfig) {
			platformTranslateService.translateFormConfig(modalSyncDefectConfig.formConfiguration);

			platformModalFormConfigService.showDialog(modalSyncDefectConfig);
		}

		function requestProjectCreationData(modalSyncDefectConfig) {
			showDialog(modalSyncDefectConfig);
		}

		this.getFormConfig = function getFormConfig() {
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
