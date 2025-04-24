(function (angular) {
	'use strict';

	var objectMainModule = 'object.main';
	var cloudCommonModule = 'cloud.common';
	var schedulingMainModule = 'scheduling.main';
	var basicsCustomizeModule = 'basics.customize';
	var salesBidModule ='sales.bid';
	var salesBillModule ='sales.billing';
	var salesCommonModule='sales.common';
	var projectModule = 'project.main';
	var basicsCompanyModule = 'basics.company';

	/**
	 * @ngdoc service
	 * @name objectMainTranslationService
	 * @description provides translation for object Main module
	 */
	angular.module(objectMainModule).factory('objectMainTranslationService', ['platformTranslationUtilitiesService',

		function (platformTranslationUtilitiesService) {
			var service = {};
			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [objectMainModule, cloudCommonModule, schedulingMainModule, basicsCustomizeModule, salesBidModule, salesCommonModule, salesBillModule, projectModule, basicsCompanyModule]
			};

			data.words = {
				ProjectFk: { location: cloudCommonModule, identifier: 'entityProject', initial: 'Project' },
				PriceListFk: { location: objectMainModule, identifier: 'entityPriceList', initial: 'Price List' },
				ObjectTypeFk: { location: objectMainModule, identifier: 'entityObjectType', initial: 'Object Type' },
				Remark01: { location: objectMainModule, identifier: 'entityRemark1', initial: 'Remark 1' },
				Remark02: { location: objectMainModule, identifier: 'entityRemark2', initial: 'Remark 2' },
				HeaderFk: { location: objectMainModule, identifier: 'objectHeader', initial: 'Real Estate' },
				LevelTypeFk: { location: objectMainModule, identifier: 'objectLevelType', initial: 'Level Type' },
				LocationFk: { location: schedulingMainModule, identifier: 'location', initial: 'Location' },
				UnitStatusFk: { location: basicsCustomizeModule, identifier: 'objectunitstatus', initial: 'Object Unit Status' },
				IsContainer: { location: objectMainModule, identifier: 'entityIsContainer', initial: 'Is Container' },
				UnitFk: { location: objectMainModule, identifier: 'entityUnitFk', initial: 'Unit' },
				UnitSubTypeFk: { location: objectMainModule, identifier: 'entityUnitSubTypeFk', initial: 'Unit Sub Type' },
				UnitTypeSpecFk: { location: objectMainModule, identifier: 'entityUnitTypeSpecFk', initial: 'Unit Type Spec' },
				UnitKindFk: { location: objectMainModule, identifier: 'entityUnitKindFk', initial: 'UnitKind' },
				UnitCategoryFk: { location: objectMainModule, identifier: 'entityUnitCategoryFk', initial: 'Unit Category' },
				LevelFk: { location: objectMainModule, identifier: 'objectLevel', initial: 'Level' },
				Remark03: { location: objectMainModule, identifier: 'entityRemark3', initial: 'Remark 3' },
				Remark04: { location: objectMainModule, identifier: 'entityRemark4', initial: 'Remark 4' },
				Remark05: { location: objectMainModule, identifier: 'entityRemark5', initial: 'Remark 5' },
				ControllingUnitFk: { location: schedulingMainModule, identifier: 'controllingunit', initial: 'Controlling Unit'},
				Parking: { location: objectMainModule, identifier: 'entityParking', initial: 'Parking' },
				Portion: { location: objectMainModule, identifier: 'entityPortion', initial: 'Portion' },
				UnitNumber: { location: objectMainModule, identifier: 'entityUnitNumber', initial: 'UnitNumber' },
				Situation: { location: objectMainModule, identifier: 'entitySituation', initial: 'Situation' },
				FloorSpace: { location: objectMainModule, identifier: 'entityFloorSpace', initial: 'FloorSpace' },
				Price: { location: objectMainModule, identifier: 'entityPrice', initial: 'Price' },
				BusinessPartner01Fk: { location: objectMainModule, identifier: 'entityBusinessPartner01Fk', initial: 'Business Partner Estate Agent' },
				Subsidiary01Fk: { location: objectMainModule, identifier: 'entitySubsidiary01Fk', initial: 'Subsidiary Estate Agent' },
				Customer01Fk: { location: objectMainModule, identifier: 'entityCustomer01Fk', initial: 'Customer Estate Agent' },
				Contact01Fk: { location: objectMainModule, identifier: 'entityContact01Fk', initial: 'Contact Estate Agent' },
				BusinessPartner02Fk: { location: objectMainModule, identifier: 'entityBusinessPartner02Fk', initial: 'Business Partner Client' },
				Subsidiary02Fk: { location: objectMainModule, identifier: 'entitySubsidiary02Fk', initial: 'Subsidiary Client' },
				Customer02Fk: { location: objectMainModule, identifier: 'entityCustomer02Fk', initial: 'Customer Client'},
				Contact02Fk: { location: objectMainModule, identifier: 'entityContact02Fk', initial: 'Contact Client' },
				BusinessPartner03Fk: { location: objectMainModule, identifier: 'entityBusinessPartner03Fk', initial: 'Business Partner Notary' },
				Subsidiary03Fk: { location: objectMainModule, identifier: 'entitySubsidiary03Fk', initial: 'Subsidiary Notary' },
				Customer03Fk: { location: objectMainModule, identifier: 'entityCustomer03Fk', initial: 'Customer Notary' },
				Contact03Fk: { location: objectMainModule, identifier: 'entityContact03Fk', initial: 'Contact Notary' },
				BusinessPartner04Fk: { location: objectMainModule, identifier: 'entityBusinessPartner04Fk', initial: 'Business Partner Trustee' },
				Subsidiary04Fk: { location: objectMainModule, identifier: 'entitySubsidiary04Fk', initial: 'Subsidiary Trustee' },
				Customer04Fk: { location: objectMainModule, identifier: 'entityCustomer04Fk', initial: 'Customer Trustee' },
				Contact04Fk: { location: objectMainModule, identifier: 'entityContact04Fk', initial: 'Contact Trustee' },
				BusinessPartner05Fk: { location: objectMainModule, identifier: 'entityBusinessPartner05Fk', initial: 'Business Partner Renter' },
				Subsidiary05Fk: { location: objectMainModule, identifier: 'entitySubsidiary05Fk', initial: 'Subsidiary Renter' },
				Customer05Fk: { location: objectMainModule, identifier: 'entityCustomer05Fk', initial: 'Customer Renter' },
				Contact05Fk: { location: objectMainModule, identifier: 'entityContact05Fk', initial: 'Contact Renter' },
				ClerkSalFk: { location: objectMainModule, identifier: 'entityClerkSalFk', initial: 'Clerk Sal' },
				ClerkTecFk: { location: objectMainModule, identifier: 'entityClerkTecFk', initial: 'Clerk Tec ' },
				AreaTypeFk:{ location: objectMainModule, identifier: 'entityAreaTypeFk', initial: 'Area Type' },
				Quantity:{ location: objectMainModule, identifier: 'entityQuantity', initial: 'Quantity' },
				UomFk: { location: cloudCommonModule, identifier: 'entityUoM', initial: 'Uom' },
				CommentText: { location: cloudCommonModule, identifier: 'entityComment', initial: 'Comment Text' },
				BusinessPartnerFk: { location: objectMainModule, identifier: 'entityBusinessPartnerFk', initial: 'Business Partner' },
				SubsidiaryFk: { location: objectMainModule, identifier: 'entitySubsidiaryFk', initial: 'Subsidiary' },
				ContactFk: { location: objectMainModule, identifier: 'entityContactFk', initial: 'Contact' },
				InterestFk:{ location: objectMainModule, identifier: 'entityInterestFk', initial: 'Interest' },
				DateOfContact:{ location: objectMainModule, identifier: 'entityDateOfContact', initial: 'Date Of Contact' },
				ProspectStatusFk:{ location: objectMainModule, identifier: 'entityProspectStatus', initial: 'Prospect Status' },
				TargetAmount:{ location: objectMainModule, identifier: 'entityTargetAmount', initial: 'Target Amount' },
				BusinessPartnerEaFk:{ location: objectMainModule, identifier: 'entityBusinessPartnerEaFk', initial: 'Business Partner Ea' },
				SubsidiaryEaFk:{ location: objectMainModule, identifier: 'entitySubsidiaryEaFk', initial: 'Interest' },
				CustomerEaFk:{ location: objectMainModule, identifier: 'entityCustomerEaFk', initial: 'Interest' },
				ContactEaFk:{ location: objectMainModule, identifier: 'entityContactEaFk', initial: 'Interest' },
				Remark: { location: cloudCommonModule, identifier: 'entityRemark', initial: 'Remark' },
				ProspectFk:{ location: objectMainModule, identifier: 'entityProspectFk', initial: 'Prospect' },
				Date: { location: cloudCommonModule, identifier: 'entityDate', initial: 'Date' },
				Barcode:{ location: objectMainModule, identifier: 'entityBarcode', initial: 'Barcode'},
				FileArchiveDocFk:{location: objectMainModule, identifier: 'entityFileArchiveDocFk', initial: 'File Archive Doc'},
				PriceListDetailFk: {location: objectMainModule, identifier: 'entityPriceListDetailFk', initial: 'Price List Detail'},
				Specification: { location: schedulingMainModule, identifier: 'entitySpecification', initial: 'Specification' },
				UnitPrice: { location: basicsCustomizeModule, identifier: 'unitprice', initial: 'Unit Price' },
				ActivityTypeFk: { location: cloudCommonModule, identifier: 'entityType', initial: 'Type' },
				Location: { location: schedulingMainModule, identifier: 'location', initial: 'Location' },
				DocumentTypeFk:{ location: objectMainModule, identifier: 'entityDocumentTypeFk', initial: 'Document Type' },
				UnitDocumentTypeFk:{ location: objectMainModule, identifier: 'entityUnitDocumentTypeFk', initial: 'Unit Document Type' },
				PriceTypeFk:{ location: objectMainModule, identifier: 'entityPriceTypeFk', initial: 'Price Type'},
				AppointmentTime: { location: objectMainModule, identifier: 'entityAppointmentTime', initial: 'Appointment Time'},
				CustomerFk: { location: objectMainModule, identifier: 'entityCustomerFk', initial: 'Customer'},
				BlobsFk: { location: objectMainModule, identifier: 'entityBlobsFk', initial: 'Blobs'},
				Description: { location: objectMainModule, identifier: 'entityDescriptionFk', initial: 'Description'},
				remarkGroup: {location: objectMainModule, identifier: 'remarkGroup', initial: 'Base Group'},
				estateAgentGroup: {location: objectMainModule, identifier: 'estateAgentGroup', initial: 'Estate Agent'},
				clientGroup: {location: objectMainModule, identifier: 'clientGroup', initial: 'Client'},
				notaryGroup: {location: objectMainModule, identifier: 'notaryGroup', initial: 'Notary'},
				trusteeGroup: {location: objectMainModule, identifier: 'trusteeGroup', initial: 'Trustee'},
				renterGroup: {location: objectMainModule, identifier: 'renterGroup', initial: 'Renter'},
				userDefinedMoneyGroup: {location: objectMainModule, identifier: 'userDefinedMoneyGroup', initial: 'User Defined Money'},
				DateGroup: {location: objectMainModule, identifier: 'dateGroup', initial: 'Date'},
				userDefinedTextGroup: {location: objectMainModule, identifier: 'userDefinedTextGroup', initial: 'User Defined Text'},
				IsParkingSpace: {location: objectMainModule, identifier: 'entityIsParkingSpace', initial: 'Is Parking Space'},
				PriceExtra: {location: objectMainModule, identifier: 'entityPriceExtra', initial: 'Price Extra'},
				DateReserved: {location: objectMainModule, identifier: 'entityDateReserved', initial: 'Date Reserved'},
				DateFundingConfirmed: {location: objectMainModule, identifier: 'entityDateFundingConfirmed', initial: 'Date Funding Confirmed'},
				DateContract: {location: objectMainModule, identifier: 'entityDateContract', initial: 'Date Contract'},
				ContractNo: {location: objectMainModule, identifier: 'entityContractNo', initial: 'Contract No'},
				DateWelcomePackage: {location: objectMainModule, identifier: 'entityDateWelcomePackage', initial: 'Date Welcome Package'},
				DateConsulting: {location: objectMainModule, identifier: 'entityDateConsulting', initial: 'Date Consulting'},
				DateMaturity: {location: objectMainModule, identifier: 'entityDateMaturity', initial: 'Date Maturity'},
				DateRegister: {location: objectMainModule, identifier: 'entityDateRegister', initial: 'Date Register'},
				DateHandover: {location: objectMainModule, identifier: 'entityDateHandover', initial: 'Date Handover'},
				HasNoDefects: {location: objectMainModule, identifier: 'entityHasNoDefects', initial: 'Has No Defects'},
				IsInvestor: {location: objectMainModule, identifier: 'entityIsInvestor', initial: 'Is Investor'},
				DateLatestModification: {location: objectMainModule, identifier: 'entityDateLatestModification', initial: 'Date Latest Modification'},
				ClerkExtFk: {location: objectMainModule, identifier: 'entityClerkExtFk', initial: 'Clerk Ext'},
				InstallmentAgreementFk: {location: objectMainModule, identifier: 'entityInstallmentAgreementFk', initial: 'Installment Agreement'},
				CurrentInstallment: {location: objectMainModule, identifier: 'entityCurrentInstallment', initial: 'Next Installment'},
				TaxCodeFk: {location: objectMainModule, identifier: 'entityTaxCodeFk', initial: 'Tax Code'},
				UserDefinedMoney01: {location: objectMainModule, identifier: 'entityUserDefinedMoney01', initial: 'User Defined Money 01'},
				UserDefinedMoney02: {location: objectMainModule, identifier: 'entityUserDefinedMoney02', initial: 'User Defined Money 02'},
				UserDefinedMoney03: {location: objectMainModule, identifier: 'entityUserDefinedMoney03', initial: 'User Defined Money 03'},
				UserDefinedMoney04: {location: objectMainModule, identifier: 'entityUserDefinedMoney04', initial: 'User Defined Money 04'},
				UserDefinedMoney05: {location: objectMainModule, identifier: 'entityUserDefinedMoney05', initial: 'User Defined Money 05'},
				UnitParkingSpaceFk: {location: objectMainModule, identifier: 'entityUnitParkingSpaceFk', initial: 'Unit Parking Space'},
				MeterTypeFk: {location: objectMainModule, identifier: 'entityMeterTypeFk', initial: 'Meter Type Fk'},
				MeterNo: {location: objectMainModule, identifier: 'entityMeterNo', initial: 'Meter No'},
				MeterReading: {location: objectMainModule, identifier: 'entityMeterReading', initial: 'Meter Reading'},
				DateRead: {location: objectMainModule, identifier: 'entityDateRead', initial: 'Date Read'},
				OriginFileName:{location: cloudCommonModule, identifier: 'documentOriginFileName', initial: 'Document Origin File Name' },
				PriceParkingSpace: {location: objectMainModule, identifier: 'entityPriceParkingSpace', initial: 'Price Parking Space' },
				TotalCost: {location: objectMainModule, identifier: 'entityTotalCost', initial: 'TotalCost' },
				SpecialPitches: {location: objectMainModule, identifier: 'entitySpecialPitches', initial: 'Special Pitches' },
				Unit2ObjUnitString: {location: objectMainModule, identifier: 'entityUnit2ObjUnitString', initial: 'Parking Lots' },
				PricesDetailed: {location: objectMainModule, identifier: 'entityPricesDetailed', initial: 'Prices Detailed' },
				basicData: {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'},
				BillCreationDate: {location: cloudCommonModule, identifier: 'entityBillCreationDate', initial: 'Bill Creation Date'},
				Description1: {location: cloudCommonModule, identifier: 'entityDescription1', initial: 'Description 1'},
				Description2: {location: cloudCommonModule, identifier: 'entityDescription2', initial: 'Description 2'},
				DueDate: {location: cloudCommonModule, identifier: 'entityDueDate', initial: 'Due Date'},
				InstallmentAgreementStateFk: {location: cloudCommonModule, identifier: 'entityInstallmentAgreementStateFk', initial: 'Installment Agreement State'},
				InstallmentFk: {location: cloudCommonModule, identifier: 'entityInstallmentFk', initial: 'Installment'},
				InstallmentPercent: {location: cloudCommonModule, identifier: 'entityInstallmentPercent', initial: 'Installment Percent'},
				UnitTypeFk: {location: cloudCommonModule, identifier: 'entityUnitTypeFk', initial: 'Unit Type'},
				RubricCategoryFk: { location: cloudCommonModule, identifier: 'entityBasRubricCategoryFk', initial: 'Rubric Category' },
				AddressFk: { location: basicsCompanyModule, identifier: 'entityAddress', initial: 'Address' },
				CountryFk: { location: cloudCommonModule, identifier: 'entityCountry', initial: 'Country' }
			};

			//Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);

			//Convert word list into a format used by platform translation service
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			//Prepare interface of service and load translations
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefinedText', '0');
			platformTranslationUtilitiesService.loadModuleTranslation(data);
			platformTranslationUtilitiesService.registerModules(data);

			return service;
		}
	]);
})(angular);
