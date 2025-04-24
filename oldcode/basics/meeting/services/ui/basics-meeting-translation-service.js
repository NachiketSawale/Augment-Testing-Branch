/*
 * $Id: basics-meeting-translation-service.js 21319 2021-12-07 07:56:57Z xua $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let basicsMeetingModule = 'basics.meeting';
	let basicsClerkModule = 'basics.clerk';
	let basicsCommonModule = 'basics.common';
	let cloudCommonModule = 'cloud.common';
	let docProjectModule = 'documents.project';
	let prcCommonModule = 'procurement.common';

	/**
	 * @ngdoc service
	 * @name basicsMeetingTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(basicsMeetingModule).service('basicsMeetingTranslationService', BasicsMeetingTranslationService);

	BasicsMeetingTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function BasicsMeetingTranslationService(platformTranslationUtilitiesService) {
		let service = this;
		let data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [basicsMeetingModule, basicsClerkModule, basicsCommonModule, cloudCommonModule, docProjectModule, prcCommonModule]
		};

		data.words = {
			basicData: {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'},
			Id: {location: cloudCommonModule, identifier: 'entityId', initial: 'Id'},
			Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
			Title: {location: basicsMeetingModule, identifier: 'title', initial: 'Title'},
			MtgStatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: 'Status'},
			MtgTypeFk: {location: cloudCommonModule, identifier: 'entityType', initial: 'Type'},
			IsHighImportance: {location: basicsMeetingModule, identifier: 'isHighImportance', initial: 'Importance'},
			DateReceived: {location: basicsMeetingModule, identifier: 'dateReceived', initial: 'Date Received'},
			StartTime: {location: basicsMeetingModule, identifier: 'startTime', initial: 'Start Time'},
			FinishTime: {location: basicsMeetingModule, identifier: 'endTime', initial: 'End Time'},
			Location: {location: cloudCommonModule, identifier: 'AddressTokenDesc_Location', initial: 'Location'},
			ClerkRspFk: {location: basicsMeetingModule, identifier: 'entityMeetingResp', initial: 'Responsible'},
			ClerkOwnerFk: {location: basicsMeetingModule, identifier: 'entityMeetingOwner', initial: 'Meeting Owner'},
			MtgUrl: {location: basicsMeetingModule, identifier: 'meetingUrl', initial: 'Meeting Url'},
			ProjectFk: { location: cloudCommonModule, identifier: 'entityProject', initial: 'Project' },
			RfqHeaderFk: {location: basicsMeetingModule, identifier: 'entityRfqHeaderCode', initial: 'RfQ'},
			QtnHeaderFk: {location: basicsMeetingModule, identifier: 'entityQtnHeader', initial: 'Quote'},
			PrjInfoRequestFk: {location: basicsMeetingModule, identifier: 'entityRFIHeaderCode', initial: 'RFI'},
			CheckListFk: {location: basicsMeetingModule, identifier: 'entityCheckList', initial: 'Check List'},
			DefectFk: {location: basicsMeetingModule, identifier: 'entityDefectCode', initial: 'Defect'},
			BidHeaderFk: {location: docProjectModule, identifier: 'entityBidHeaderFk', initial: 'Bid'},
			AttendeeStatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: 'Status'},
			ClerkFk:  {location: basicsMeetingModule, identifier: 'entityClerk', initial: 'Clerk'},
			BusinessPartnerFk:  {location: cloudCommonModule, identifier: 'entityBusinessPartner', initial: 'Business Partner'},
			SubsidiaryFk:  {location: cloudCommonModule, identifier: 'entitySubsidiary', initial: 'Subsidiary'},
			ContactFk:  {location: basicsMeetingModule, identifier: 'entityBpdContact', initial: 'Contact'},
			IsOptional: {location: basicsMeetingModule, identifier: 'isOptional', initial: 'Is Optional'},
			Recurrence: {location: basicsMeetingModule, identifier: 'recurrenceTitle', initial: 'Recurrence'},
			DocumentTypeFk: {location: prcCommonModule, identifier: 'documentType', initial: 'Document Type'},
			DocumentDate: {location: cloudCommonModule, identifier: 'entityDate', initial: 'Document Date'},
			OriginFileName: {location: prcCommonModule, identifier: 'documentOriginFileName', initial: 'Origin File Name'},
			Description: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},
			Role: {location: basicsMeetingModule, identifier: 'role', initial: 'Role'},
			FirstName: {location: basicsClerkModule, identifier: 'entityFirstName', initial: 'First Name'},
			FamilyName: {location: basicsClerkModule, identifier: 'entityFamilyName', initial: 'Family Name'},
			Department: {location: cloudCommonModule, identifier: 'entityDepartment', initial: 'Department'},
			Email: {location: cloudCommonModule, identifier: 'email', initial: 'Email'},
			TelephoneNumberFk: {location: cloudCommonModule, identifier: 'TelephoneDialogPhoneNumber', initial: 'Phone Number'},
			TelephoneMobilFk: {location: cloudCommonModule, identifier: 'mobile', initial: 'Mobile'}
		};

		// Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'Userdefined');

		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);
