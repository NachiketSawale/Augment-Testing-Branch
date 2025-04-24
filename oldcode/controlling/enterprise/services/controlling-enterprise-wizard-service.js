/**
 * Created by janas on 29.05.2020.
 */

(function (angular) {
	'use strict';
	var moduleName = 'controlling.enterprise';
	/**
	 * @ngdoc factory
	 * @name controlling.enterprise.services:controllingEnterpriseWizardService
	 * @description
	 * Provides wizard configuration and implementation of all controlling enterprise wizards
	 */
	angular.module(moduleName).factory('controllingEnterpriseWizardService',
		['globals', 'platformModalFormConfigService', 'platformTranslateService', '$translate', '$http', 'platformSidebarWizardCommonTasksService',
			function (globals, platformModalFormConfigService, platformTranslateService, $translate, $http, platformSidebarWizardCommonTasksService) {

				var service = {};

				service.syncUser = function syncUser() {
					var title = 'controlling.enterprise.syncUsers';

					var dataItem = {
						userId: null,
						projectNo: ''
					};

					var modalUserSyncConfig = {
						title: $translate.instant(title),
						dataItem: dataItem,
						formConfiguration: {
							fid: 'controlling.enterprise.userSync',
							version: '0.1.0',
							showGrouping: false,
							groups: [{
								gid: 'baseGroup',
								attributes: ['userid', 'projectno']
							}],
							rows: [{
								gid: 'baseGroup',
								rid: 'description',
								model: 'userId',
								sortOrder: 1,
								label: 'User Id',
								label$tr$: 'controlling.enterprise.user',
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'usermanagement-user-user-dialog',
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: true
									}
								}
							},
							{
								gid: 'baseGroup',
								rid: 'projectfk',
								model: 'ProjectFk',
								sortOrder: 2,
								label: 'Project Name',
								label$tr$: 'cloud.common.entityProjectName',
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'basics-lookup-data-project-project-dialog',
									descriptionMember: 'ProjectName',
									lookupOptions: {
										initValueField: 'ProjectNo',
										showClearButton: true,
									}
								}
							}]
						},
						dialogOptions: {
							disableOkButton: function disableOkButton() {
								return false;
							}
						},
						handleOK: function handleOK(result) {
							var userId = result.data.userId;
							var projectNo = result.data.projectNo;
							var syncAll = userId === null && projectNo === '';

							var baseUrl = globals.webApiBaseUrl + 'controlling/enterprise/accessrights/';
							var promise = syncAll ? $http.post(baseUrl + 'syncallusers') : $http.post(baseUrl + 'syncuser', {
								UserId: userId,
								ProjectNo: projectNo
							});
							promise.then(function (/* response */) {
								platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(title);
							});
						}
					};

					platformTranslateService.translateFormConfig(modalUserSyncConfig.formConfiguration);

					platformModalFormConfigService.showDialog(modalUserSyncConfig);
				};

				return service;
			}
		]);
})(angular);
