/**
 * Created by hzh on 2020/05/08
 */
/* global , globals */
(function (angular) {
	'use strict';
	var moduleName = 'defect.main';
	var defectMainModule = angular.module(moduleName);

	/**
     * @ngdoc service
     * @name defectMainSyncIssueToDefectDialogService
     * @function
     *
     */
	/* jshint -W072 */ // many parameters because of dependency injection
	defectMainModule.service('defectMainSyncIssueToDefectDialogService', defectMainSyncIssueToDefectDialogService);

	defectMainSyncIssueToDefectDialogService.$inject = ['$q', '$injector', '$translate', '$http', '$interval', '$window',
		'platformTranslateService', 'platformModalFormConfigService',
		'platformModalService'];

	function defectMainSyncIssueToDefectDialogService($q, $injector, $translate, $http, $interval, $window,
		platformTranslateService, platformModalFormConfigService,
		platformModalService ) {


		var services = {};
		var formConfig = {
			fid: 'defect.main.syncIssue2Defect',
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
			templateUrl: globals.appBaseUrl + 'defect.main/templates/bim360/defect-main-issue2defect-dialog-service.html',
			backdrop: false,
			resizeable: true
		};

		services.getFormConfig = function getFormConfig() {
			return formConfig;
		};

		services.showPostDialog = function showPostDialog() {
			platformModalService.showDialog(dialogConfig);
			// cloudDeskBim360Service.showDialog(modalSyncDefectConfig) ;
		};

		return services;
	}
})(angular);
