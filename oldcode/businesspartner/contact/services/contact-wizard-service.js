/**
 * Created by clv on 9/5/2017.
 */
(function (angular){

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	let moduleName = 'businesspartner.contact';
	angular.module(moduleName).factory('businesspartnerContactWizardService',businesspartnerContactWizardService);

	businesspartnerContactWizardService.$inject = ['$http', '$document', 'platformSidebarWizardCommonTasksService', 'businesspartnerContactDataService', 'businessPartnerContactUIStandardService',
		'businesspartnerContactPortalUserManagementService', 'platformModalService', 'businessPartnerAssignmentActivationService','$rootScope','businesspartnerMainHeaderDataService','mainViewService',
		'businesspartnerMainContactDataService','basicsCommonFileDownloadService',];
	function businesspartnerContactWizardService($http, $document, platformSidebarWizardCommonTasksService, businesspartnerContactDataService, businessPartnerContactUIStandardService,
		businesspartnerContactPortalUserManagementService, platformModalService, businessPartnerAssignmentActivationService,$rootScope,businesspartnerMainHeaderDataService,mainViewService
		,businesspartnerMainContactDataService,basicsCommonFileDownloadService){

		let service = {};

		function disableRecord() {
			return platformSidebarWizardCommonTasksService.provideDisableInstance(businesspartnerContactDataService, 'Disable Record',
				'cloud.common.disableRecord', 'FirstName', 'businesspartner.contact.disableDone', 'businesspartner.contact.alreadyDisabled',
				'firstName');
		}
		function enableRecord() {
			return platformSidebarWizardCommonTasksService.provideEnableInstance(businesspartnerContactDataService, 'Enable Record',
				'cloud.common.enableRecord', 'FirstName', 'businesspartner.contact.enableDone', 'businesspartner.contact.alreadyEnabled', 'firstName');
		}

		service.disableRecord = disableRecord().fn;
		service.enableRecord = enableRecord().fn;
		service.reactivateOrInactivatePortalUser = reactivateOrInactivatePortalUser;
		service.maintainingOrphanedPortalRequest = maintainingOrphanedPortalRequest;
		service.changeBpAssignmentStatus = changeBpAssignmentStatus;
		service.importVCF = importVCF;
		service.exportVCF = exportVCF;

		return service;

		// /////////////////
		function reactivateOrInactivatePortalUser() {
			businesspartnerContactPortalUserManagementService.reactivateOrInactivatePortalUser(businesspartnerContactDataService, businessPartnerContactUIStandardService)
				.then(function(run){
					if (run) {
						platformModalService.showMsgBox('businesspartner.contact.reOrInactivatePortalUserSucInfo', 'cloud.common.informationDialogHeader', 'ico-info');
						businesspartnerContactDataService.refresh();
					}
				});
		}

		function maintainingOrphanedPortalRequest() {
			businesspartnerContactPortalUserManagementService.maintainingOrphanedPortalRequest();
		}

		function changeBpAssignmentStatus(){
			businessPartnerAssignmentActivationService.showEditor();
		}
		function importVCF(){
			let selected=null;
			let isCurrentModule=mainViewService.getCurrentModuleName()===moduleName;
			if(!isCurrentModule)
			{
				selected= businesspartnerMainHeaderDataService.getSelected();
			}
			platformModalService.showDialog({
				templateUrl: globals.appBaseUrl + 'businesspartner.contact/templates/wizards/import-vcf.html',
				backdrop: false,
				data: selected

			}).then(function(response) {
				if (!response.isOK) {
					return;
				}
				if (!response.file) {
					return;
				}

				let file = response.file;
				let businessPartnerId=response.businessPartnerId;
				$rootScope.$broadcast('asyncInProgress', true);
				$http({
					method: 'POST',
					url: globals.webApiBaseUrl + 'businesspartner/contact/importfileinfo',
					headers: {
						'Content-Type': undefined
					},
					transformRequest: function (data) {
						let fd = new FormData();
						fd.append('businessPartnerId', businessPartnerId);
						if (data.file) {
							fd.append('file', data.file);
						}
						return fd;
					},
					data: {file: file}
				}).then(
					function (response) {
						$rootScope.$broadcast('asyncInProgress', false);
						let result = response.data;
						if (result !== null && result.FileName !== '' && result.FileName !== null) {
							let requestParam = {
								FileName: result.FileName,
								ContactDto: result.ContactDto,
								ContactPhotoToSave: result.ContactPhotoToSave
							};
							$http.post(globals.webApiBaseUrl + 'businesspartner/contact/importvcf', requestParam)
								// eslint-disable-next-line no-unused-vars
								.then(function (responseData) {
									if(!isCurrentModule)
									{
										businesspartnerMainHeaderDataService.refresh();
									}
									else
									{
										businesspartnerContactDataService.refresh();
									}
								});
						}
					},
					// eslint-disable-next-line no-unused-vars
					function (failure) {
						$rootScope.$broadcast('asyncInProgress', false);
					}
				);
			});
		}
		function exportVCF(){
			let isCurrentModule=mainViewService.getCurrentModuleName()===moduleName;
			let entity =null;
			if(isCurrentModule)
			{
				entity = businesspartnerContactDataService.getSelected();
			}
			else
			{
				entity = businesspartnerMainContactDataService.getSelected();
			}
			if (entity){
				$http.post(globals.webApiBaseUrl + 'businesspartner/contact/preparedownload?id=' + entity.Id)
					.then(function(response){
						if (response.data && response.data.FileName) {
							basicsCommonFileDownloadService.download(null, {
								FileName: response.data.FileName,
								Path: response.data.Path
							});
						}
					});

			}
			else {
				platformModalService.showMsgBox('businesspartner.contact.selectAContact', 'cloud.common.informationDialogHeader', 'ico-info');
			}
		}
	}

})(angular);