/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.rfq';

	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc service
	 * @name procurementRfqTranslationService
	 *
	 * @description provides translation for procurement rfq module
	 */
	angular.module(moduleName).factory('procurementRfqTranslationService', [
		'platformTranslateService', 'platformTranslationUtilitiesService', '$q',
		'modelViewerTranslationModules',

		function (platformTranslateService, platformTranslationUtilitiesService, $q,
			modelViewerTranslationModules) {

			var cloudCommonModule = 'cloud.common';
			var basicsCommonModule = 'basics.common';
			var basicsClerkModule = 'basics.common';
			var buisnesspartnerMainModule = 'businesspartner.main';
			var procurementCommonModule = 'procurement.common';
			var procurementRequisitionModule = 'procurement.requisition';
			var procurementRfqModule = 'procurement.rfq';
			var documentsProjectModule = 'documents.project';
			var procurementPackageModule = 'procurement.package';
			var boqMainModule = 'boq.main';
			var modelWdeViewerModule = 'model.wdeviewer';
			var basicsCustomizeModule = 'basics.customize';
			var service = {instant: platformTranslateService.instant};
			var basicsMeetingModule = 'basics.meeting';
			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [
					cloudCommonModule, basicsCommonModule, basicsClerkModule, buisnesspartnerMainModule,
					procurementCommonModule, procurementRequisitionModule, procurementRfqModule, documentsProjectModule, procurementPackageModule, boqMainModule,
					modelWdeViewerModule, basicsCustomizeModule, basicsMeetingModule
				].concat(modelViewerTranslationModules)
			};

			data.words = {
				Id: {location: cloudCommonModule, identifier: 'entityId', initial: 'Id'},
				// Header group
				supplierGroup: {location: procurementRfqModule, identifier: 'headerGroupDesiredSupplier', initial: 'Submission Requirements'},
				deliveryRequirementsGroup: {location: procurementRfqModule, identifier: 'headerGroupDeliveryRequirements', initial: 'Delivery Requirements'},

				// Bidder group
				businesspartnerGroup: {location: procurementRfqModule, identifier: 'businessPartnerGroupBusinessPartner', initial: 'BusinessPartner'},
				contactGroup: {location: procurementRfqModule, identifier: 'businessPartnerGroupContact', initial: 'Delivery Requirements'},

				// Header properties
				RfqStatusFk: {location: cloudCommonModule, identifier: 'entityState', initial: 'Status'},
				Code: {location: procurementRfqModule, identifier: 'code', initial: 'RfQ Code'},
				DateRequested: {location: procurementPackageModule, identifier: 'dateRequested', initial: 'Publication Date'},
				PlannedStart: {'location': procurementPackageModule, 'identifier': 'entityPlannedStart', 'initial': 'Planned Start'},
				PlannedEnd: {'location': procurementPackageModule, 'identifier': 'entityPlannedEnd', 'initial': 'Planned End'},
				DateReceived: {location: cloudCommonModule, identifier: 'entityReceived', initial: 'Cancelled'},
				DateCanceled: {location: cloudCommonModule, identifier: 'entityCancelled', initial: 'RFQ Header Code'},
				ProjectFk: {location: cloudCommonModule, identifier: 'entityProjectNo', initial: 'Project No.'},
				ProjectFk$ProjectName: {location: cloudCommonModule, identifier: 'entityProjectName', initial: 'Project Name'},
				ClerkPrcFk: {location: cloudCommonModule, identifier: 'entityResponsible', initial: 'Responsible'},
				ClerkPrcFk$Description: {location: cloudCommonModule, identifier: 'entityResponsibleDescription', initial: 'Responsible Description'},
				ClerkReqFk: {location: cloudCommonModule, identifier: 'entityRequisitionOwner', initial: 'Requisition Owner'},
				ClerkReqFk$Description: {location: cloudCommonModule, identifier: 'entityRequisitionOwnerDescription', initial: 'Requisition Owner Description'},
				PaymentTermFiFk: {location: cloudCommonModule, identifier: 'entityPaymentTermFI', initial: 'Payment Term (FI)'},
				PaymentTermFiFk$Description: {location: cloudCommonModule, identifier: 'entityPaymentTermFiDescription', initial: 'Payment Term (FI) Description'},
				PaymentTermPaFk: {location: cloudCommonModule, identifier: 'entityPaymentTermPA', initial: 'Payment Term (PA)'},
				PaymentTermPaFk$Description: {location: cloudCommonModule, identifier: 'entityPaymentTermPaDescription', initial: 'Payment Term (PA) Description'},
				PaymentTermAdFk: {location: cloudCommonModule, identifier: 'entityPaymentTermAD', initial: 'Payment Term (AD)'},
				PaymentTermAdFk$Description: {location: cloudCommonModule, identifier: 'entityPaymentTermAdDescription', initial: 'Payment Term (AD) Description'},
				CurrencyFk: {location: cloudCommonModule, identifier: 'entityCurrency', initial: 'Currency'},
				RfqTypeFk: {location: cloudCommonModule, identifier: 'entityType', initial: 'Type'},
				PrcContractTypeFk: {location: procurementRfqModule, identifier: 'headerPrcContractType', initial: 'Contract Type'},
				PrcAwardMethodFk: {location: cloudCommonModule, identifier: 'entityAwardMethod', initial: 'Award Method'},
				PrcConfigurationFk: {location: procurementRfqModule, identifier: 'headerConfiguration', initial: 'Configuration'},
				PrcStrategyFk: {location: procurementRfqModule, identifier: 'headerStrategy', initial: 'Strategy'},
				DateDelivery: {location: basicsCommonModule, identifier: 'dateDelivered', initial: 'Date Delivered'},
				AwardReference: {location: procurementRfqModule, identifier: 'headerAwardReference', initial: 'Award Reference'},
				DateQuoteDeadline: {location: cloudCommonModule, identifier: 'entityDeadline', initial: 'Deadline'},
				TimeQuoteDeadline: {location: cloudCommonModule, identifier: 'entityTime', initial: 'Time'},
				LocaQuoteDeadline: {location: procurementRfqModule, identifier: 'headerLocalQuoteDeadline', initial: 'Local'},
				DateAwardDeadline: {location: procurementPackageModule, identifier: 'dateAwardDeadline', initial: 'Award Deadline'},
				RfqHeaderFk: {location: procurementRfqModule, identifier: 'headerRfqCode', initial: 'Basis RfQ'},
				RfqHeaderDescription: {location: procurementRfqModule, identifier: 'headerRfqDescription', initial: 'Basis RfQ Description'},
				EvaluationSchemaFk: {location: buisnesspartnerMainModule, identifier: 'entityEvaluationSchemaFk', initial: 'Evaluation Schema'},
				BillingSchemaFk: {location: cloudCommonModule, identifier: 'entityBillingSchema', initial: 'Billing Schema'},
				DatePriceFixing: {location: procurementRequisitionModule, identifier: 'entityDatePriceFixing', initial: 'Date Price Fixing'},

				// Bidder properties
				FirstQuoteFrom: {location: procurementRfqModule, identifier: 'rfqBusinessPartnerFirstQuoteFrom', initial: 'First Quote From'},
				BusinessPartnerFk: {location: procurementRfqModule, identifier: 'rfqBusinessPartnerBPName1', initial: 'Company Name'},
				SubsidiaryFk: {'location': cloudCommonModule, 'identifier': 'entitySubsidiary', 'initial': 'Subsidiary'},
				SupplierFk: {location: procurementRfqModule, identifier: 'rfqBusinessPartnerSupplierCode', initial: 'Supplier Code'},
				ContactFk: {location: procurementRfqModule, identifier: 'rfqBusinessPartnerContactLastName', initial: 'Contact Last Name'},
				PrcCommunicationChannelFk: {location: procurementRfqModule, identifier: 'rfqBusinessPartnerPrcCommunicationChannel', initial: 'Communication Channel'},
				RfqBusinesspartnerStatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: 'Status'},
				DateRejected: {location: cloudCommonModule, identifier: 'entityDateRejected', initial: 'Rejected'},
				RfqRejectionReasonFk: {location: procurementRfqModule, identifier: 'rfqBusinessPartnerRfqRejectionReason', initial: 'Rejection Reason'},
				ExtendedDate: {location: procurementRfqModule, identifier: 'entityExtendedDate', initial: 'ExtendedDate'},
				CompanyCC: {location: procurementRfqModule, identifier: 'wizard.businessPartner.CompanyEmailCC'},
				BidderContactCC: {location: procurementRfqModule, identifier: 'wizard.businessPartner.BidderContactCC'},
				BranchCC: {location: procurementRfqModule, identifier: 'wizard.businessPartner.BranchCC', initial: 'CC Branch'},
				BranchEmail: {location: procurementRfqModule, identifier: 'wizard.businessPartner.BranchEmail', initial: 'Branch E-mail'},

				// Requisition properties
				ReqHeaderFk: {location: procurementRfqModule, identifier: 'requisitionCode', initial: 'Requisition Code'},
				PackageFk: {location: cloudCommonModule, identifier: 'entityPackageCode', initial: 'Package Code'},

				// Total properties
				TotalTypeFk: {location: procurementCommonModule, identifier: 'reqTotalTotalTypeFk', initial: 'Type'},
				ValueNet: {location: procurementCommonModule, identifier: 'reqTotalValueNet', initial: 'Net Value'},
				ValueTax: {location: procurementCommonModule, identifier: 'reqTotalValueTax', initial: 'VAT'},
				Gross: {location: procurementCommonModule, identifier: 'reqTotalGross', initial: 'Gross'},
				ValueNetOc: {location: procurementCommonModule, identifier: 'reqTotalValueNetOc', initial: 'Net Value (Currency)'},
				ValueTaxOc: {location: procurementCommonModule, identifier: 'reqTotalValueTaxOc', initial: 'VAT (Currency)'},
				GrossOc: {location: procurementCommonModule, identifier: 'reqTotalGrossOC', initial: 'Gross (Currency)'},
				CommentText: {location: cloudCommonModule, identifier: 'entityComment', initial: 'Comments'},
				ExchangeRate: {location: cloudCommonModule, identifier: 'entityRate', initial: 'entityRate'},

				// user defined
				userDefinedGroup: {'location': procurementPackageModule, 'identifier': 'entityUserDefined', 'initial': 'UserDefined'},
				UserDefined1: {'location': cloudCommonModule, 'identifier': 'entityUserDefined', 'initial': 'User Defined 1', param: {'p_0': '1'}},
				UserDefined2: {'location': cloudCommonModule, 'identifier': 'entityUserDefined', 'initial': 'User Defined 2', param: {'p_0': '2'}},
				UserDefined3: {'location': cloudCommonModule, 'identifier': 'entityUserDefined', 'initial': 'User Defined 3', param: {'p_0': '3'}},
				UserDefined4: {'location': cloudCommonModule, 'identifier': 'entityUserDefined', 'initial': 'User Defined 4', param: {'p_0': '4'}},
				UserDefined5: {'location': cloudCommonModule, 'identifier': 'entityUserDefined', 'initial': 'User Defined 5', param: {'p_0': '5'}},

				PrcTexttypeFk: {'location': procurementCommonModule, 'identifier': 'headerText.prcTextType', 'initial': 'Text Type'},
				IsProject: {'location': procurementCommonModule, 'identifier': 'headerText.isProject', 'initial': 'Is Project'},
				TextModuleTypeFk: {location: basicsCustomizeModule, identifier: 'textmoduletype', initial: 'Text Module Type'},
				PrjDocumentFk: {'location': procurementRfqModule, 'identifier': 'entityPrjDocument', 'initial': 'Document'},
				RfqBpStatusPreFk: {'location': procurementRfqModule, 'identifier': 'entityRfqBpStatusPre', 'initial': 'Status Bidder Pre'},
				RfqBpStatusPostFk: {'location': procurementRfqModule, 'identifier': 'entityRfqBpStatusPost', 'initial': 'Status Bidder Post'},
				Protocol: {'location': procurementRfqModule, 'identifier': 'entityProtocol', 'initial': 'Protocol'},
				Comments: {location: cloudCommonModule, identifier: 'entityComment', initial: 'Comments'},
				ProjectStatusFk: {location: procurementCommonModule, identifier: 'projectStatus', initial: 'Project Status'},

				packageGroup: {location: procurementRfqModule, identifier: 'packageGroup', initial: 'Package Group'},
				PackageNumber: {location: procurementRfqModule, identifier: 'packageNumber', initial: 'Package Number'},
				PackageDescription: {location: cloudCommonModule, identifier: 'entityPackageDescription', initial: 'Package Description'},
				AssetMasterCode: {location: procurementRfqModule, identifier: 'assetMasterCode', initial: 'Asset Master Code'},
				AssetMasterDescription: {location: procurementPackageModule, identifier: 'entityAssetMasterDescription', initial: 'Asset Master Description'},
				PackageDeliveryAddress: {location: procurementRfqModule, identifier: 'packageDeliveryAddress', initial: 'Package Delivery Address'},
				Selected: {location: procurementRfqModule, identifier: 'selected', initial: 'Selected'},
				setting: {location: moduleName, identifier: 'bidder.setting.detailform'},
				ClerkEmailBcc: {
					location: moduleName,
					identifier: 'rfqBidderSetting.clerkEmailBcc',
					initial: 'Clerk Email Bcc',
					tooltipIdentifier: 'rfqBidderSetting.clerkEmailBccTooltip'
				},
				SendWithOwnMailAddress: {location: moduleName, identifier: 'rfqBidderSetting.sendWithOwnMailAddress', initial: 'Send with own Mailaddress', tooltipIdentifier: 'rfqBidderSetting.sendWithOwnMailAddressTooltip'},
				GenerateSafeLink: {location: moduleName, identifier: 'rfqBidderSetting.generateSafeLink', initial: 'Generate Safe Link', tooltipIdentifier: 'rfqBidderSetting.generateSafeLinkTooltip'},
				DisableDataFormatExport: {location: moduleName, identifier: 'rfqBidderSetting.disableDataFormatExport', initial: 'Disable Data Format Export', tooltipIdentifier: 'rfqBidderSetting.disableDataFormatExportTooltip'},
				ReplyToClerk: {location: moduleName, identifier: 'rfqBidderSetting.replyToClerk', initial: 'Reply to Clerk', tooltipIdentifier: 'rfqBidderSetting.replyToClerkTooltip'},
				DisableZipping: {location: moduleName, identifier: 'rfqBidderSetting.disableZipping', initial: 'Disable Zipping', tooltipIdentifier: 'rfqBidderSetting.disableZippingTooltip'},
				LinkAndAttachment: {location: moduleName, identifier: 'rfqBidderSetting.linkAndAttachment', initial: 'Link and Attachment', tooltipIdentifier: 'rfqBidderSetting.linkAndAttachmentTooltip'},
				FileNameFromDescription: {location: moduleName, identifier: 'rfqBidderSetting.fileNameFromDescription', initial: 'Use Description for File Name', tooltipIdentifier: 'rfqBidderSetting.fileNameFromDescriptionTooltip'},
				AdditionalEmailForBCC: {location: moduleName, identifier: 'rfqBidderSetting.additionalEmailForBCC', initial: 'Additional Email for BCC', tooltipIdentifier: 'rfqBidderSetting.AdditionalEmailForBCCTooltip'},
				UseAccessTokenForSafeLink: {location: moduleName, identifier: 'rfqBidderSetting.useAccessTokenForSafeLink', initial: 'Use Access Token for Safe Link', tooltipIdentifier: 'rfqBidderSetting.UseAccessTokenForSafeLinkTooltip'},
				SafeLinkLifetime: {location: moduleName, identifier: 'rfqBidderSetting.safeLinkLifetime', initial: 'Safe Link Lifetime (h)', tooltipIdentifier: 'rfqBidderSetting.SafeLinkLifetimeTooltip'},
				DataFormat: {location: moduleName, identifier: 'dataFormatSetting.dataFormat', initial: 'Data Format'},
				DocumentType: {location: moduleName, identifier: 'documentForSendRfq.type', initial: 'Type'},
				DocumentStatusFk: {location: moduleName, identifier: 'documentForSendRfq.status', initial: 'Status'},
				DocumentDescription: {location: moduleName, identifier: 'documentForSendRfq.description', initial: 'Description'},
				DocumentOriginalFileName: {location: moduleName, identifier: 'documentForSendRfq.originalFileName', initial: 'Original File Name'},
				RequisitionDescription: {location: moduleName, identifier: 'sendRfqBoq.requisitionDescription', initial: 'Requisition'},
				ItemCount: {location: moduleName, identifier: 'sendRfqBoq.itemCount', initial: 'BoQ Item Count'},
				basicData: {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'},
				PackageTextInfo: {location: procurementCommonModule, identifier: 'entityPackageTextInfo', initial: 'Package Text Info'},
				ContactHasPortalUser: {location: moduleName, identifier: 'rfqBusinessPartnerContactHasPortalUser', initial: 'Contact has Portal-User'},
				PrcStructureCode: {location: cloudCommonModule, identifier: 'entityStructureCode', initial: 'Structure Code'},
				PrcStructureDescription: {location: cloudCommonModule, identifier: 'entityStructureDescription', initial: 'Structure Description'},
				Recipient: {location: moduleName, identifier: 'Recipient', initial: 'Email'},
				Subject: {location: moduleName, identifier: 'Subject', initial: 'Subject'},
				DateSent: {location: moduleName, identifier: 'DateSent ', initial: 'Date Sent'},
				EmailLink: {location: moduleName, identifier: 'EmailLink', initial: 'Email Link'},
				Sender: {location: moduleName, identifier: 'Sender', initial: 'Sender Account'},

			};

			// translate common properties
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);
			// platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefined');

			// Convert word list into a format used by platform translation service
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			// Prepare interface of service and load translations
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.loadModuleTranslation(data);
			platformTranslationUtilitiesService.registerModules(data);

			// for container information service use   module container lookup
			service.loadTranslations = function loadTranslations() {
				return $q.when(false);
			};

			return service;
		}
	]);
})(angular);
