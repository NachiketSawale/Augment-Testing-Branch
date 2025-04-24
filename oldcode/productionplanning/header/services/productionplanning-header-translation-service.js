/**
 * Created by zwz on 9/29/2019.
 */

(function (angular) {
	'use strict';

	var currentModule = 'productionplanning.header';
	var cloudCommonModule = 'cloud.common';
	var basicsCommonModule = 'basics.common';
	let basicsSiteModule = 'basics.site';
	var basicsCustomizeModule = 'basics.customize';
	var ppsCommonModule = 'productionplanning.common';
	var ppsEngModule = 'productionplanning.engineering';
	var ppsItemModule = 'productionplanning.item';
	var projectModule = 'project.main';
	var logisticJobModule = 'logistic.job';
	var modelViewerModule = 'model.viewer';
	var bizPartnerModule = 'businesspartner.main';
	var ppsDrawingModule = 'productionplanning.drawing';

	/**
	 * @ngdoc service
	 * @name productionplanningHeaderTranslationService
	 * @description provides translation for PPS Header module
	 */
	angular.module(currentModule).factory('productionplanningHeaderTranslationService', TranslationService);

	TranslationService.$inject = ['platformTranslationUtilitiesService'];

	function TranslationService(platformTranslationUtilitiesService) {
		var service = {};

		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [currentModule, cloudCommonModule, basicsCommonModule, basicsCustomizeModule, basicsSiteModule,
				ppsCommonModule, ppsEngModule, ppsItemModule, projectModule, logisticJobModule, modelViewerModule, bizPartnerModule, ppsDrawingModule]
		};

		data.words = {
			// cloud common module
			baseGroup: {location: cloudCommonModule, identifier: 'entityProperties', initial: '*Basic Data'},
			Code: {location: cloudCommonModule, identifier: 'entityCode', initial: '*Code'},
			CommentText:{ location: cloudCommonModule, identifier: 'entityComment', initial: '*Comments' },
			DescriptionInfo: {location: cloudCommonModule, identifier: 'entityDescription', initial: '*Description'},
			Remarks: {location: cloudCommonModule, identifier: 'entityRemark', initial: '* Remarks'},
			BusinessPartnerFk:{ location: cloudCommonModule, identifier: 'entityBusinessPartner', initial: 'Business Partner' },
			TelephoneNumberFk: {location: cloudCommonModule, identifier: 'TelephoneDialogPhoneNumber', initial: '*Telephone Number'},
			TelephoneNumber2Fk: {location: bizPartnerModule, identifier: 'telephoneNumber2', initial: '*Other Tel.'},
			TelephoneNumberMobileFk: {location: cloudCommonModule, identifier: 'mobile', initial: '*Telephone Mobil'},
			TelephoneNumberString: {location: cloudCommonModule, identifier: 'TelephoneDialogPhoneNumber', initial: '*Telephone Number'},
			TelephoneNumber2String: {location: bizPartnerModule, identifier: 'telephoneNumber2', initial: '*Other Tel.'},
			TelephoneNumberMobileString: {location: cloudCommonModule, identifier: 'mobile', initial: '*Telephone Mobil'},
			Email: {location: cloudCommonModule, identifier: 'email', initial: '*Email'},
			// basics common module
			ClerkRoleFk: {location: basicsCommonModule, identifier: 'entityClerkRole', initial: '*Clerk Role'},
			ClerkFk: {location: basicsCommonModule, identifier: 'entityClerk', initial: '*Clerk'},
			ValidFrom: {location: basicsCommonModule, identifier: 'entityValidFrom', initial: '*Valid From'},
			ValidTo: {location: basicsCommonModule, identifier: 'entityValidTo', initial: '*Valid To'},

			// basics customize module
			HeaderFk: { location: basicsCustomizeModule, identifier: 'headerFk', initial: '*Header' },
			LgmJobFk: { location: basicsCustomizeModule, identifier: 'jobfk', initial: '*Job' },
			Color: { location: basicsCustomizeModule, identifier: 'colour', initial: '*Color' },

			// current module
			RoleFk:{ location: currentModule, identifier: 'entityRoleFk', initial: '*Role' },
			ContactFk:{ location: currentModule, identifier: 'entityContactFk', initial: '*Contact' },
			ContactRoleTypeFk:{ location: currentModule, identifier: 'entityContactRoleTypeFk', initial: '*Contact Role Type' },
			Header2BpFk:{ location: currentModule, identifier: 'entityHeader2BpFk', initial: '*PPS Header Business Partner' },
			SubsidiaryFk: { location: currentModule, identifier: 'entitySubsidiaryFk', initial: '*Subsidiary' },
			HeaderTypeFk: { location: currentModule, identifier: 'entityHeaderTypeFk', initial: '*Production Planning Type' },
			Probability: { location: currentModule, identifier: 'entityProbability', initial: '*Probability' },
			Threshold: { location: currentModule, identifier: 'entityThreshold', initial: '*Threshold' },
			// pps common module
			header: { location: ppsCommonModule, identifier: 'header.headerTitle', initial: 'Header' },
			production: { location: ppsCommonModule, identifier: 'header.production', initial: 'Production' },
			BasFilearchivedocFk: { location: ppsCommonModule, identifier: 'header.basFilearchivedocFk', initial: 'File archive doc' },
			BasClerkPrpFk: { location: ppsCommonModule, identifier: 'header.basClerkPrpFk', initial: 'Preparation Clerk' },
			EstHeaderFk: { location: ppsCommonModule, identifier: 'estHeaderFk', initial: 'Estimate Header' },
			OrdHeaderFk: { location: ppsCommonModule, identifier: 'ordHeaderFk', initial: 'Order Header' },
			MdlModelFk: { location: ppsCommonModule, identifier: 'header.mdlModelFk', initial: 'Model' },
			HeaderGroupFk: { location: ppsCommonModule, identifier: 'header.headerGroupFk', initial: 'PPS Group' },
			BasSiteFk: { location: ppsCommonModule, identifier: 'header.basSiteFk', initial: 'Site' },
			HeaderStatusFk: { location: ppsCommonModule, identifier: 'header.headerStatusFk', initial: 'Status' },
			PrjLocationFk: { location: ppsCommonModule, identifier: 'prjLocationFk', initial: 'Location' },
			PrjProjectFk: { location: ppsCommonModule, identifier: 'prjProjectFk', initial: 'Project No' },
			IsActive: { location: ppsCommonModule, identifier: 'header.isActive', initial: 'Is Active' },
			IsLive: { location: ppsCommonModule, identifier: 'header.isLive', initial: 'Is Live' },
			EngDrawingFk: { location: ppsCommonModule, identifier: 'header.masterDrawingFk', initial: '*Master Drawing' },
			// engineering module
			EngHeaderFk: {location: ppsEngModule, identifier: 'entityEngHeader', initial: '*Engineering Header'},
			From: { location: ppsCommonModule, identifier: 'from', initial: '*From'  },
			DocumentTypeFk: {location: basicsCustomizeModule, identifier: 'documenttype', initial: '*Document Type'},
			Description: {location: cloudCommonModule, identifier: 'entityDescription', initial: '*Description'},
			Barcode: {location: logisticJobModule, identifier: 'entityBarcode', initial: '*Barcode'},
			Revision: {location: ppsCommonModule, identifier: 'document.revision.revision', initial: '*Revision'}
		};

		//Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'Userdefined');

		//Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		//Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);

		return service;
	}
})(angular);
