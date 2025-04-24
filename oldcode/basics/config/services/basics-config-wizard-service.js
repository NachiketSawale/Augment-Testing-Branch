/**
 * Created by Bhushan on 14.02.2018.
 */
(function () {
	'use strict';
	var moduleName = 'basics.config';
	angular.module(moduleName).factory('basicsConfigWizardService', basicsConfigWizardService);

	basicsConfigWizardService.$inject = ['$http', '$q', '$translate', '$injector', 'platformTranslateService', 'platformSidebarWizardConfigService', 'platformModalFormConfigService', 'platformSidebarWizardCommonTasksService', 'platformModalService'];

	function basicsConfigWizardService($http, $q, $translate, $injector, platformTranslateService, platformSidebarWizardConfigService, platformModalFormConfigService, platformSidebarWizardCommonTasksService, platformModalService) {

	    var service = {auditTrail:auditTrail};
		function auditTrail() {
			var title = 'basics.config.setAuditTrailTitle';
			var auditTrailConfig = {
				title: $translate.instant(title),
				dataItem: {
					selectedLevel: ''
				},
				formConfiguration: {
					fid: 'basics.config.setAuditTrailTitle',
					version: '0.1.1',
					showGrouping: false,
					groups: [
						{
							gid: 'baseGroup',
							attributes: ['selecteditem']
						}
					],
					'overloads': {},
					rows: [
						{
							gid: 'baseGroup',
							rid: 'SelectedItem',
							label: '',
							label$tr$: '',
							type: 'radio',
							model: 'selectedLevel',
							options: {
								labelMember: 'Description',
								valueMember: 'Value',
								groupName: 'auditTrailConfig',
								items: [
									{Id: 1, Description: $translate.instant('basics.config.createAll'), Value : 'CreateAll'},
									{Id: 2, Description: $translate.instant('basics.config.enableAll'), Value : 'EnableAll'},
									{Id: 3, Description: $translate.instant('basics.config.disableAll'), Value : 'DisableAll'},
									{Id: 4, Description: $translate.instant('basics.config.deleteAll'), Value : 'DeleteAll'}
								]}
						}
					]
				},
				handleOK: function handleOK(result) {
					function auditTrailMethod(val) {
						$http.post(globals.webApiBaseUrl + 'basics/audittrailconfig/wizard/audittrailtoggle?wizardOption=' + val)
							.then(function (response) {
								var message;
								if (result.data.selectedLevel === 'CreateAll') {
									message = $translate.instant('basics.config.createAll');
								}
								else if (result.data.selectedLevel === 'EnableAll') {
									message = $translate.instant('basics.config.enableAll');
								}
								else if (result.data.selectedLevel === 'DisableAll') {
									message = $translate.instant('basics.config.disableAll');
								}
								else if (result.data.selectedLevel === 'DeleteAll') {
									message = $translate.instant('basics.config.deleteAll');
								}

								message = message + ' ' + $translate.instant('basics.config.auditTrailSuccessMessageBody');

								if (response.data) {
									platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage('basics.config.auditTrailSuccessMessageDialogHeader', message, 'info');
								}
								else {
									platformModalService.showErrorBox('basics.config.auditTrailErrorMessageBody', 'basics.config.auditTrailErrorMessageDialogHeader');
								}
							},
							function (/* error */) {
							});
					}

					if (result && result.ok && result.data && result.data.selectedLevel !== '') {
						auditTrailMethod(result.data.selectedLevel);
					}
				}
			};
			platformTranslateService.translateFormConfig(auditTrailConfig.formConfiguration);
			auditTrailConfig.scope = platformSidebarWizardConfigService.getCurrentScope();
			platformModalFormConfigService.showDialog(auditTrailConfig);
		}
		return service;
	}
})();