/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var procurementQuoteModule = 'procurement.quote';

	/**
	 * @ngdoc service
	 * @name basicsCompanyTranslationService
	 * @description provides translation for basics company module
	 */
	angular.module(procurementQuoteModule).factory('procurementQuoteTranslationService', ['$q','platformTranslationUtilitiesService', 'procurementCommonTranslationService', 'businesspartnerCertificateToQuoteLayout',
		'modelViewerTranslationModules',

		function ($q,platformTranslationUtilitiesService,procurementCommonTranslationService, businesspartnerCertificateToQuoteLayout,
			modelViewerTranslationModules) {

			var service = {};

			var cloudCommonModule = 'cloud.common';
			var procurementCommonModule = 'procurement.common';
			var boqMainModule = 'boq.main';
			var basicsCommonModule = 'basics.common';
			var certificateModule = 'businesspartner.certificate';
			var modelWdeViewerModule = 'model.wdeviewer';
			var buisnessPartnerMainModule = 'businesspartner.main';
			var procurementRfqModule = 'procurement.rfq';
			var procurementPackageModule = 'procurement.package';
			var controllingStructureModule = 'controlling.structure';
			var basicsMeetingModule = 'basics.meeting';
			const procurementContractModule = 'procurement.contract'
			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [cloudCommonModule, procurementCommonModule, boqMainModule,
					'businesspartner.main','basics.unit','basics.clerk','procurement.requisition',
					'procurement.rfq', procurementQuoteModule, 'procurement.ticketsystem',
					'basics.material','basics.materialcatalog', 'documents.project', certificateModule,
					modelWdeViewerModule,'basics.common',
					procurementRfqModule, procurementPackageModule, controllingStructureModule, basicsMeetingModule
				].concat(modelViewerTranslationModules)
			};

			// /Words for Detail
			data.words = {
				Id:{ location: cloudCommonModule, identifier: 'entityId', initial: 'Id' },
				// Groups
				supplierGroup:{ location: procurementQuoteModule, identifier: 'headerFormGroupSupplier', initial: 'Bidder' },
				deliveryGroup:{ location: procurementQuoteModule, identifier: 'headerFormGroupDeliveryRequirements', initial: 'Delivery Requirements' },

				// Common
				DateRequired:{ location: cloudCommonModule, identifier: 'entityRequired', initial: 'Required' },
				ProjectFk:{ location: cloudCommonModule, identifier: 'entityProjectNo', initial: 'Project No.' },
				ProjectName:{ location: cloudCommonModule, identifier: 'entityProjectName', initial: 'Project Name' },
				ClerkReqFk:{ location: cloudCommonModule, identifier: 'entityRequisitionOwner', initial: 'Requisition Owner' },
				ClerkReqDescription:{ location: cloudCommonModule, identifier: 'entityRequisitionOwnerDescription', initial: 'Requisition Owner Description' },

				// Header
				StatusFk:{ location: cloudCommonModule, identifier: 'entityState', initial: 'Status' },
				DateQuoted:{ location: procurementQuoteModule, identifier: 'headerDateQuoted', initial: 'Quote' },
				DateReceived:{ location: cloudCommonModule, identifier: 'entityReceived', initial: 'Receive' },
				RfqHeaderFk:{ location: procurementQuoteModule, identifier: 'headerRfqHeaderCode', initial: 'RFQ Header Code' },
				RfqHeaderDescription:{ location: procurementQuoteModule, identifier: 'headerRfqHeaderDescription', initial: 'RFQ Header Description' },
				ClerkPrcFk:{ location: cloudCommonModule, identifier: 'entityResponsible', initial: 'Responsible' },
				ClerkPrcDescription:{ location: cloudCommonModule, identifier: 'entityResponsibleDescription', initial: 'Description' },
				PaymentTermFiFk:{ location: cloudCommonModule, identifier: 'entityPaymentTermFI', initial: 'Payment Term(FI)' },
				PaymentTermFiDescription:{ location: cloudCommonModule, identifier: 'entityPaymentTermFiDescription', initial: 'Payment Term Fi Description' },
				PaymentTermPaFk:{ location: cloudCommonModule, identifier: 'entityPaymentTermPA', initial: 'Payment Term(PA)' },
				PaymentTermPaDescription:{ location: cloudCommonModule, identifier: 'entityPaymentTermPaDescription', initial: 'Payment Term Pa Description' },
				PaymentTermAdFk:{ location: cloudCommonModule, identifier: 'entityPaymentTermAD', initial: 'Payment Term(AD)' },
				PaymentTermAdDescription:{ location: cloudCommonModule, identifier: 'entityPaymentTermAdDescription', initial: 'Payment Term Ad Description' },
				CurrencyFk:{ location: cloudCommonModule, identifier: 'entityCurrency', initial: 'Currency' },
				ExchangeRate:{ location: cloudCommonModule, identifier: 'entityRate', initial: 'Rate' },
				TypeFk:{ location: cloudCommonModule, identifier: 'entityType', initial: 'Type' },
				QuoteVersion:{ location: procurementQuoteModule, identifier: 'headerVersion', initial: 'Version' },
				BusinessPartnerFk:{ location: cloudCommonModule, identifier: 'entityBusinessPartner', initial: 'Business Partner' },
				SubsidiaryFk:{ location: cloudCommonModule, identifier: 'entitySubsidiary', initial: 'Subsidiary' },
				SupplierFk:{ location: cloudCommonModule, identifier: 'entitySupplierCode', initial: 'Supplier' },
				ContactFk:{ location: procurementContractModule, identifier: 'ConHeaderContact', initial: 'Contact' },
				SupplierDescription:{ location: cloudCommonModule, identifier: 'entitySupplierDescription', initial: 'Supplier Description' },
				IncotermFk:{ location: cloudCommonModule, identifier: 'entityIncoterms', initial: 'Incoterms' },
				IncotermDescription:{ location: cloudCommonModule, identifier: 'entityIncotermDescription', initial: 'Incoterms Description' },
				DatePricefixing: { location: procurementQuoteModule, identifier: 'headerDataPricefixing', initial: 'Data Pricefixing' },
				IsValidated:{ location: procurementQuoteModule, identifier: 'headerValidated', initial: 'Validated' },
				IsExcluded:{ location: procurementQuoteModule, identifier: 'headerExcluded', initial: 'Excluded' },
				IsShortlisted:{ location: procurementQuoteModule, identifier: 'headerShortlisted', initial: 'Shortlisted' },
				EvaluationFk:{ location: procurementQuoteModule, identifier: 'headerEvaluation', initial: 'Evaluation' },
				EvaluationDto:{ location: procurementQuoteModule, identifier: 'headerEvaluation', initial: 'Evaluation' },
				QtnHeaderFk:{ location: procurementQuoteModule, identifier: 'headerQuoteHeaderCode', initial: 'Basis Quote' },
				QtnHeaderDescription:{ location: procurementQuoteModule, identifier: 'headerQuoteHeaderDescription', initial: 'Basis Quote Description' },
				DateDelivery:{location: basicsCommonModule, identifier: 'dateDelivered', initial: 'Date Delivered'},
				ExternalCode:{location: procurementQuoteModule, identifier: 'headerExternalCode', initial: 'External Code'},
				UserDefinedDate01: { location: procurementQuoteModule, identifier: 'entityUserDefinedDate', param: { p_0: '1' }, initial: 'User Defined Date 1' },
				StructureFk: {location: cloudCommonModule, identifier: 'entityStructureCode', initial: 'Structure Code'},
				PrcStructureCode: {location: cloudCommonModule, identifier: 'entityStructureCode', initial: 'Structure Code'},
				PrcStructureDescription: {location: cloudCommonModule, identifier: 'entityStructureDescription', initial: 'Structure Description'},
				VariantCode : {location: procurementQuoteModule, identifier: 'entityVariantCode', initial: 'Variant Code'},
				VariantDescription : {location: procurementQuoteModule, identifier: 'entityVariantDescription', initial: 'Variant Description'},
				ValueNetFinal: {location: procurementQuoteModule, identifier: 'netFinal', initial: 'Net Final'},
				TotalGroup: {location: procurementQuoteModule, identifier: 'totalGroup', initial: 'Total'},
				DateAwardDeadline: {location: procurementPackageModule, identifier: 'dateAwardDeadline', initial: 'Award Deadline'},
				DeadlineDate: {location: cloudCommonModule, identifier: 'entityDeadline', initial: 'Deadline'},
				DeadlineTime: {location: cloudCommonModule, identifier: 'entityTime', initial: 'Time'},
				SubmissionRequirement: {location: procurementCommonModule, identifier: 'submissionRequirement', initial: 'Submission Requirements'},

				// Total
				TotalTypeFk:{ location: procurementCommonModule, identifier: 'reqTotalTotalTypeFk', initial: 'Type' },
				ValueNet:{ location: procurementCommonModule, identifier: 'reqTotalValueNet', initial: 'Net Value' },
				ValueTax:{ location: procurementCommonModule, identifier: 'reqTotalValueTax', initial: 'VAT' },
				Gross:{ location: procurementCommonModule, identifier: 'reqTotalGross', initial: 'Gross of VAT'},
				ValueNetOc: {location: procurementCommonModule, identifier: 'reqTotalValueNetOc', initial: 'Net Value (Currency)'},
				ValueTaxOc: {location: procurementCommonModule, identifier: 'reqTotalValueTaxOc', initial: 'VAT (Currency)'},
				GrossOc: {location: procurementCommonModule, identifier: 'reqTotalGrossOC', initial: 'Gross (Currency)'},
				CommentText: {location: procurementCommonModule, identifier: 'reqTotalCommentText', initial: 'Comment'},

				// Requisition
				ReqHeaderFk:{ location: cloudCommonModule, identifier: 'entityState', initial: 'State' }, Status:{ location: cloudCommonModule, identifier: 'entityState', initial: 'State' },
				CompanyName:{ location: cloudCommonModule, identifier: 'entityCompany', initial: 'Company' },
				PackageFk:{ location: cloudCommonModule, identifier: 'entityPackageCode', initial: 'Package Code' },
				PackageDescription:{ location: cloudCommonModule, identifier: 'entityPackageDescription', initial: 'Package Description' },
				ControllingunitFk:{ location: cloudCommonModule, identifier: 'entityControllingUnitCode', initial: 'Controlling Unit Code' },
				ControllingunitDescription:{ location: cloudCommonModule, identifier: 'entityControllingUnitDesc', initial: 'Controlling Unit Description' },
				AddressLine:{ location: cloudCommonModule, identifier: 'entityDeliveryAddress', initial: 'Delivery Address' },

				// QuoteItem
				IsSelected:{location: procurementQuoteModule, identifier: 'isSelected', initial: 'Is Selected'},
				PrcItemstatusFk:{ location: cloudCommonModule, identifier: 'entityStatus', initial: 'Status' },
				Itemno:{ location: procurementQuoteModule, identifier: 'itemItemNo', initial: 'Item No.' },
				MdcMaterialFk:{ location: procurementQuoteModule, identifier: 'itemMaterialNo', initial: 'MdcMaterial' },
				Description1:{ location: procurementQuoteModule, identifier: 'itemDescription1', initial: 'Description 1' },
				Description2:{ location: procurementQuoteModule, identifier: 'itemDescription2', initial: 'Description ' },
				Specification:{ location: procurementQuoteModule, identifier: 'itemSpecification', initial: 'Required' },
				BasUomFk:{ location: procurementQuoteModule, identifier: 'itemUoM', initial: 'UoM' },
				Onhire:{ location: procurementQuoteModule, identifier: 'itemOnHireDate', initial: 'OnHire' },
				Offhire:{ location: procurementQuoteModule, identifier: 'itemOffHireDate', initial: 'Offhire' },
				PriceExtra:{ location: procurementQuoteModule, identifier: 'itemPriceExtras', initial: 'PriceExtras' },
				PriceExtraOc:{ location: procurementCommonModule, identifier: 'prcItemPriceExtrasCurrency', initial: 'Price Extras Currency' },
				Price:{ location: procurementQuoteModule, identifier: 'itemPrice', initial: 'Price' },
				PriceOc:{ location: procurementCommonModule, identifier: 'prcItemPriceCurrency', initial: 'Price Currency' },
				Total:{ location: cloudCommonModule, identifier: 'entityTotal', initial: 'Total' },
				TotalCurrency:{ location: procurementCommonModule, identifier: 'prcItemTotalCurrency', initial: 'Total Currency' },
				TotalPrice:{ location: procurementQuoteModule, identifier: 'itemTotalPrice', initial: 'Total Price' },
				TotalPriceCurrency:{ location: procurementCommonModule, identifier: 'prcItemTotalPriceCurrency', initial: 'Total Price Currency' },
				PrcPriceconditionFk:{ location: procurementQuoteModule, identifier: 'itemPriceCondition', initial: 'Price Condition' },
				PriceUnit:{ location: procurementQuoteModule, identifier: 'itemPriceUnit', initial: 'Price Unit' },
				BasUomPriceUnitFk:{ location: procurementQuoteModule, identifier: 'itemPriceUnitUom', initial: 'Uom Price Unit' },
				FactorPriceUnit:{ location: cloudCommonModule, identifier: 'entityFactor', initial: 'Factor' },
				Batchno:{ location: procurementCommonModule, identifier: 'prcItemBatchno', initial: 'Batch No.' },
				QuantityAskedfor:{ location: procurementCommonModule, identifier: 'prcItemQuantityAskedfor', initial: 'Quantity Asked For' },
				QuantityDelivered:{ location: procurementCommonModule, identifier: 'prcItemQuantityDelivered', initial: 'Quantity Delivered' },
				Address:{ location: procurementQuoteModule, identifier: 'itemDeliveryAddress', initial: 'BasAddress' },
				TotalLeadTime: {location: procurementCommonModule, identifier: 'totalLeadTime', initial: 'Total Lead Time'},
				BillingSchemaFk: {location: procurementCommonModule, identifier: 'billingSchema', initial: 'Billing Schema'},
				basicData: {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'},
				EvaluationSchemaFk: {location: buisnessPartnerMainModule, identifier: 'entityEvaluationSchemaFk', initial: 'Evaluation Schema'},
				DateEffective:{location: 'basics.common', identifier: 'dateEffective', initial: 'Date Effective'},
				BpdVatGroupFk: {location: procurementCommonModule, identifier: 'entityVatGroup', initial: 'Vat Group'},
				ProjectStatusFk: {location: procurementCommonModule, identifier: 'projectStatus', initial: 'Project Status'},
				OverallDiscount: {location: procurementCommonModule,identifier: 'entityOverallDiscount',initial: 'Overall Discount'},
				OverallDiscountOc: {location: procurementCommonModule, identifier: 'entityOverallDiscountOc', initial: 'Overall Discount (OC) '},
				OverallDiscountPercent: {location: procurementCommonModule, identifier: 'entityOverallDiscountPercent', initial: 'Overall Discount Percent'},
				BillingSchemaFinal:{location:procurementCommonModule,identifier:'billingSchemaFinal',initial:'Billing Schema Final'},

				packageGroup: {location: procurementRfqModule, identifier: 'packageGroup', initial: 'Package Group'},
				PackageNumber: {location: procurementRfqModule, identifier: 'packageNumber', initial: 'Package Number'},
				AssetMasterCode: {location: procurementRfqModule, identifier: 'assetMasterCode', initial: 'Asset Master Code'},
				AssetMasterDescription: {location: procurementPackageModule, identifier: 'entityAssetMasterDescription', initial: 'Asset Master Description'},
				PackageDeliveryAddress: {location: procurementRfqModule, identifier: 'packageDeliveryAddress', initial: 'Package Delivery Address'},
				PackageTextInfo: {location: procurementCommonModule, identifier: 'entityPackageTextInfo', initial: 'Package Text Info'},
				SalesTaxMethodFk: {location: procurementCommonModule, identifier: 'entitySalesTaxMethodFk', initial: 'Sales Tax Method'},
				ExtendedDate: {location: procurementRfqModule, identifier: 'entityExtendedDate', initial: 'Extended Date'},
				PrcContractTypeFk: {location: procurementRfqModule, identifier: 'headerPrcContractType', initial: 'Contract Type'},
				PrcAwardMethodFk: {location: cloudCommonModule, identifier: 'entityAwardMethod', initial: 'Award Method'},
				PrcConfigurationFk: {location: procurementRfqModule, identifier: 'headerConfiguration', initial: 'Configuration'},
				itemGroup: {location: procurementQuoteModule, identifier: 'itemsGridTitle', initial: 'Items'},
				Co2ProjectTotal: {location: procurementCommonModule, identifier: 'entityCo2ProjectTotal', initial: 'CO2/kg (Project Total)'},
				Co2SourceTotal: {location: procurementCommonModule, identifier: 'entityCo2SourceTotal', initial: 'CO2/kg (Source Total)'},
				AmountDiscountBasis: {location: procurementQuoteModule, identifier: 'entityAmountDiscountBasis', initial: 'Amount Discount Basis'},
				AmountDiscountBasisOc: {location: procurementQuoteModule, identifier: 'entityAmountDiscountBasisOc', initial: 'Amount Discount Basis Oc'},
				PercentDiscount: {location: procurementQuoteModule, identifier: 'entityPercentDiscount', initial: 'Percent Discount'},
				AmountDiscount: {location: procurementQuoteModule, identifier: 'entityAmountDiscount', initial: 'Amount Discount'},
				AmountDiscountOc: {location: procurementQuoteModule, identifier: 'entityAmountDiscountOc', initial: 'Amount Discount Oc'}
			};

			// Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);

			// note: upperCase/ lowerCase (UserDefined vs Userdefined)
			platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefined');
			platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'Userdefined');

			// add Certificate Layout
			angular.extend(data.words, businesspartnerCertificateToQuoteLayout.translationInfos.extraWords);

			// Convert word list into a format used by platform translation service
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			// Prepare interface of service and load translations
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.loadModuleTranslation(data);
			platformTranslationUtilitiesService.registerModules(data);

			procurementCommonTranslationService.addWordsForCallOfAgreement(data.words, data.allUsedModules);
			procurementCommonTranslationService.addWordsForMandatoryDeadlines(data.words, data.allUsedModules);
			procurementCommonTranslationService.addWordsForAccountAssignment(data.words, data.allUsedModules);

			// for container information service use   module container lookup
			service.loadTranslations = function loadTranslations() {
				return $q.when(false);
			};

			return service;
		}
	]);
})(angular);
