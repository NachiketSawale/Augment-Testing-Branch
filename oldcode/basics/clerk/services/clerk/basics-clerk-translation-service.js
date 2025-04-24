/**
 * Created by baf on 04.09.2014.
 */

(function (angular) {
	'use strict';

	const basicsClerkModule = 'basics.clerk';
	const basicsCommonModule = 'basics.common';
	const cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name basicsClerkTranslationService
	 * @description provides translation for basics clerk module
	 */
	/* jshint -W106 */ // Variable name is according usage in translation json
	angular.module(basicsClerkModule).factory('basicsClerkTranslationService', ['platformTranslationUtilitiesService',

		function (platformTranslationUtilitiesService) {
			let service = {};

			let data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [basicsClerkModule, cloudCommonModule, basicsCommonModule]
			};

			data.words = {
				listRoleTitle: {location: basicsClerkModule, identifier: 'listRoleTitle', initial: 'Roles'},
				detailRoleTitle: {location: basicsClerkModule, identifier: 'detailRoleTitle', initial: 'Details Role'},
				listAbsenceTitle: {location: basicsClerkModule, identifier: 'listAbsenceTitle', initial: 'Absences'},
				basicData: { location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data' },
				baseGroup: {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'},
				Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
				Description: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},
				AbsenceFrom: {location: basicsClerkModule, identifier: 'absencefrom', initial: 'Absence From'},
				AbsenceTo: {location: basicsClerkModule, identifier: 'absenceto', initial: 'Absence To'},
				FamilyName: {location: basicsClerkModule, identifier: 'entityFamilyName', initial: 'Family Name'},
				FirstName: {location: basicsClerkModule, identifier: 'entityFirstName', initial: 'First Name'},
				TitleFk: {location: basicsClerkModule, identifier: 'entityTitleFk', initial: 'Title'},
				UserFk: {location: basicsClerkModule, identifier: 'entityUserFk', initial: 'User'},
				CompanyFk: {location: cloudCommonModule, identifier: 'entityCompany', initial: 'Company'},
				Title: {location: basicsClerkModule, identifier: 'entityTitle', initial: 'Title'},
				Department: {location: cloudCommonModule, identifier: 'entityDepartment', initial: 'Department'},
				Signature: {location: basicsClerkModule, identifier: 'entitySignature', initial: 'Signature'},

				BlobsFooterFk: {location: basicsClerkModule, identifier: 'entityBlobsFooterFk', initial: 'Blobs Footer'},
				BlobsEmailfooterFk: {
					location: basicsClerkModule,
					identifier: 'entityBlobsEmailfooterFk',
					initial: 'Blobs Emailfooter'
				},
				Birthdate: {location: basicsClerkModule, identifier: 'entityBirthdate', initial: 'Birthdate'},
				WorkflowType: {location: basicsClerkModule, identifier: 'entityWorkflowType', initial: 'WorkflowType'},
				NotificationEmails: {
					location: basicsClerkModule,
					identifier: 'entityNotificationEmails',
					initial: 'Notification Emails'
				},
				EscalationEmails: {
					location: basicsClerkModule,
					identifier: 'entityEscalationEmails',
					initial: 'Escalation Emails'
				},
				EscalationTo: {location: basicsClerkModule, identifier: 'entityEscalationTo', initial: 'Escalation To'},
				ClerkProxyFk: {location: basicsClerkModule, identifier: 'entityClerkProxyFk', initial: 'Clerk Proxy'},
				Remark: {location: cloudCommonModule, identifier: 'DocumentBackup_Remark', initial: 'Remark'},
				BlobsPhotoFk: {location: basicsClerkModule, identifier: 'entityBlobsPhotoFk', initial: 'BlobsPhotoFk'},
				IsLive: {location: cloudCommonModule, identifier: 'entityIsLive', initial: 'IsLive'},
				SearchPattern: {location: cloudCommonModule, identifier: 'entitySearchPattern', initial: 'SearchPattern'},
				entityAbsence: {location: basicsClerkModule, identifier: 'entityAbsence', initial: 'Absence'},
				detailClerkAbsenceTitle: {location: basicsClerkModule, identifier: 'detailClerkAbsenceTitle', initial: 'Details Absence'},
				ClerkGroupFk: {location: basicsClerkModule, identifier: 'entityClerkGroup', initial: 'Clerk Group'},
				Settings: { location: basicsCommonModule, identifier: 'settings', initial: 'Settings'},
				TxUser :{ location: basicsClerkModule, identifier: 'entityTxUser', initial: 'iTWOtx Login User'},
				TxPw :{ location: basicsClerkModule, identifier: 'entityTxPw', initial: 'iTWOtx Login Password'},
				CommentText: { location: cloudCommonModule, identifier: 'entityComment', initial: 'Comments'},
				Clerk2Fk: { location: cloudCommonModule, identifier: 'entityClerk', initial: 'Clerk'},
				ClerkRoleFk: { location: cloudCommonModule, identifier: 'entityClerkRole', initial: 'Clerk Role'},
				DocumentTypeFk: {location: basicsClerkModule, identifier: 'documnetType', initial: 'Type'},
				ClerkDocumentTypeFk: {location: basicsClerkModule, identifier: 'clerkdocumenttype', initial: 'Clerk Document Type'},
				OriginFileName: {location: basicsClerkModule, identifier: 'originfilename', initial: 'Origin File Name'},
				DocumentDate: {location: basicsClerkModule, identifier: 'documentdate', initial: 'Date'},
				ProjectFk: { location: cloudCommonModule, identifier: 'entityProject', initial: 'Project' },
				baseMember: { location: basicsClerkModule, identifier: 'baseMember', initial: 'Member' },
				ProcurementOrganization: { location: basicsClerkModule, identifier: 'procurementOrganization', initial: 'Procurement Organization' },
				ProcurementGroup: { location: basicsClerkModule, identifier: 'procurementGroup', initial: 'Procurement Group' },
				ClerkSuperiorFk: { location: basicsClerkModule, identifier: 'clerkSuperior', initial: 'Clerk Superior' },
				ClerkRoleDefValTypeFk: { location: basicsClerkModule, identifier: 'clerkRoleDefValType', initial: 'Clerk Role Default Value Type' },
				IsClerkGroup: { location: basicsClerkModule, identifier: 'isClerkGroup' }
			};

			// Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addClerkContainerTranslations(data.words);
			platformTranslationUtilitiesService.addTeleComTranslation(data.words);
			platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'Userdefined');
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);

			// Convert word list into a format used by platform translation service
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			// Prepare interface of service and load translations
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.loadModuleTranslation(data);
			platformTranslationUtilitiesService.registerModules(data);

			return service;
		}
	]);
})(angular);
