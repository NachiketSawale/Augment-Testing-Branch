/**
 * Created by reimer on 16.09.2014.
 */

(function (angular) {
	'use strict';

	var boqMainModule = 'boq.main';
	var boqProjectModule = 'boq.project';
	var cloudCommonModule = 'cloud.common';
	var basicsMaterialModule = 'basics.material';
	var basicsCustomizeModule = 'basics.customize';
	var businesspartnerMainModule = 'businesspartner.main';
	var estimateMainModule = 'estimate.main';
	var estimateRuleModule = 'estimate.rule';
	var estimateParameterModule = 'estimate.parameter';
	var estimateAssemblyModule = 'estimate.assemblies';
	var qtoMainModule = 'qto.main';
	var projectMainModule = 'project.main';
	var objectMainModule = 'object.main';
	var salesCommonModule = 'sales.common';

	// Allows to register the properties of the oenorm DTOs at the translation serice. Asumes the convention that propertyname of a DTO and the key in en.json are identically.
	angular.module(boqMainModule).factory('boqMainOenTranslationService', ['_',
		function(_) {
			var service = {};
			var translationWords = {};

			service.register = function(schema, groupIds) {
				const oenKeyPart = 'oen.dto' + _.replace(schema.schema, 'RIB.Visual.Boq.Main.ServiceFacade.WebApi', '') + '.';
				for (var property in schema.properties) {
					translationWords[property] = { location:boqMainModule, identifier:oenKeyPart+property, initial:'' };
				}

				_.forEach(groupIds, function(groupId) {
					translationWords[groupId] = { location:boqMainModule, identifier:groupId, initial:'' };
				});
			};

			service.getTranslationWords = function() {
				return translationWords;
			};

			return service;
		}
	]);

	/**
	 * @ngdoc service
	 * @name boqMainTranslationService
	 * @description provides translation for boq main module
	 */
	/* jshint -W106 */ // Variable name is according usage in translation json
	angular.module(boqMainModule).service('boqMainTranslationService', ['platformUIBaseTranslationService', 'platformTranslateService', 'boqMainOenTranslationService',

		function (platformUIBaseTranslationService, platformTranslateService, boqMainOenTranslationService) {

			var self = this;

			var words = {
				BilledQuantity: {location: boqMainModule, identifier: 'BilledQuantity', initial: 'Billed Quantity'},
				InstalledQuantity: {
					location: boqMainModule,
					identifier: 'InstalledQuantity',
					initial: 'Installed Quantity'
				},
				BasCurrencyFk: {location: cloudCommonModule, identifier: 'entityCurrency', initial: 'Currency'},
				BasItemType85Fk: {location: boqMainModule, identifier: 'ItemType85Fk', initial: 'Alternative Bid'},

				BoqRootItemReference: {location: boqMainModule, identifier: 'BoqRootItemReference', initial: 'BoQ root item reference'},

				CostFactor1: {location: estimateMainModule, identifier: 'costFactor1', initial: 'Cost Factor 1'},
				CostFactor2: {location: estimateMainModule, identifier: 'costFactor2', initial: 'Cost Factor 2'},
				CostFactorDetail1: {
					location: estimateMainModule,
					identifier: 'costFactorDetail1',
					initial: 'Cost Factor Detail 1'
				},
				CostFactorDetail2: {
					location: estimateMainModule,
					identifier: 'costFactorDetail2',
					initial: 'Cost Factor Detail 2'
				},
				CostTotal: {location: estimateMainModule, identifier: 'costTotal', initial: 'Cost Total'},
				CostUnit: {location: estimateMainModule, identifier: 'costUnit', initial: 'Cost Unit'},
				CostUnitTarget: {location: estimateMainModule, identifier: 'costUnitTarget', initial: 'Cost Unit Target'},

				EstLineItemFk: {location: boqMainModule, identifier: 'EstLineItemFk', initial: 'Assembly Code'},
				EstAssemblyCatFk: {location: boqMainModule, identifier: 'EstAssemblyCatFk', initial: 'Assembly Category'},
				EstCostRiskFk: {location: estimateMainModule, identifier: 'estCostRiskFk', initial: 'Cost Risk'},

				HoursTotal: {location: estimateMainModule, identifier: 'hoursTotal', initial: 'Hours Total'},
				HoursUnit: {location: estimateMainModule, identifier: 'hoursUnit', initial: 'Hours Unit'},
				HoursUnitTarget: {
					location: estimateMainModule,
					identifier: 'hoursUnitTarget',
					initial: 'Hours Unit Target'
				},

				userDefTextGroup: {location: cloudCommonModule, identifier: 'UserdefTexts', initial: 'Userdefined Texts'},
				UserDefined: {location: cloudCommonModule, identifier: 'UserdefTexts', initial: 'User Defined Text'},
				Userdefined1: {
					location: cloudCommonModule,
					identifier: 'entityUserDefined',
					param: {p_0: '1'},
					initial: 'User Defined 1'
				},
				Userdefined2: {
					location: cloudCommonModule,
					identifier: 'entityUserDefined',
					param: {p_0: '2'},
					initial: 'User Defined 2'
				},
				Userdefined3: {
					location: cloudCommonModule,
					identifier: 'entityUserDefined',
					param: {p_0: '3'},
					initial: 'User Defined 3'
				},
				Userdefined4: {
					location: cloudCommonModule,
					identifier: 'entityUserDefined',
					param: {p_0: '4'},
					initial: 'User Defined 4'
				},
				Userdefined5: {
					location: cloudCommonModule,
					identifier: 'entityUserDefined',
					param: {p_0: '5'},
					initial: 'User Defined 5'
				},
				MdcTaxCodeFk: {location: cloudCommonModule, identifier: 'entityTaxCode', initial: 'entityTaxCode'},
				PrjLocationFk: {location: estimateMainModule, identifier: 'prjLocationFk', initial: 'Location'},
				ProductivityFactor: {
					location: estimateMainModule,
					identifier: 'productivityFactor',
					initial: 'Productivity Factor'
				},

				QuantityDetail:    { location: boqMainModule, identifier: 'QuantityDetail',    initial: '' },
				QuantityAdjDetail: { location: boqMainModule, identifier: 'QuantityAdjDetail', initial: '' },
				QuantityFactor1: {location: estimateMainModule, identifier: 'quantityFactor1', initial: 'QuantityFactor1'},
				QuantityFactor2: {
					location: estimateMainModule,
					identifier: 'quantityFactor2',
					initial: 'Quantity Factor 2'
				},
				QuantityFactor3: {
					location: estimateMainModule,
					identifier: 'quantityFactor3',
					initial: 'Quantity Factor 3'
				},
				QuantityFactor4: {
					location: estimateMainModule,
					identifier: 'quantityFactor4',
					initial: 'Quantity Factor 4'
				},
				QuantityFactorDetail1: {
					location: estimateMainModule,
					identifier: 'quantityFactorDetail1',
					initial: 'Quantity Factor Detail 1'
				},
				QuantityFactorDetail2: {
					location: estimateMainModule,
					identifier: 'quantityFactorDetail2',
					initial: 'Quantity Factor Detail 2'
				},
				QuantityTotal: {location: estimateMainModule, identifier: 'quantityTotal', initial: 'Quantity Total'},
				QuantityUnitTarget: {
					location: estimateMainModule,
					identifier: 'quantityUnitTarget',
					initial: 'Quantity Unit Target'
				},
				CosMatchText: {location: estimateMainModule, identifier: 'cosMatchText', initial: 'COS Match Text'},

				MdcControllingUnitFk: {
					location: estimateMainModule,
					identifier: 'mdcControllingUnitFk',
					initial: 'Controlling Unit'
				},
				MdcCostCodeFk: {location: estimateMainModule, identifier: 'mdcCostCodeFk', initial: 'CostCode'},
				MdcMaterialFk: {location: estimateMainModule, identifier: 'mdcMaterialFk', initial: 'Material'},

				BoqRevenueTypeFk: {location: boqMainModule, identifier: 'BoqRevenueTypeFk', initial:'Revenue Type'},
				RevenuePercentage: {location: boqMainModule, identifier: 'RevenuePercentage', initial:'Revenue Percentage'},

				EstParameterGroupFk: {
					location: basicsCustomizeModule,
					identifier: 'estparametergroup',
					initial: 'Parameter Group'
				},
				ParameterValue: {location: basicsCustomizeModule, identifier: 'parametervalue', initial: 'Parameter Value'},
				DefaultValue: {location: estimateParameterModule, identifier: 'defaultValue', initial: 'Default Value'},
				ValueDetail: {location: estimateParameterModule, identifier: 'valueDetail', initial: 'Value Detail'},
				IsLookup: {location: estimateParameterModule, identifier: 'isLookup', initial: 'Is Lookup'},
				estruleparamvaluefk: {
					location: estimateParameterModule,
					identifier: 'estruleparamvaluefk',
					initial: 'Item Value'
				},
				valuetype: {location: estimateParameterModule, identifier: 'valueType', initial: 'Value Type'},
				// detailParamDialogHeader:{ location: estimateMainModule, identifier: 'detailParamDialogHeader', initial: 'Parameters' },

				WorkContentInfo: {location: boqMainModule, identifier: 'WorkContentInfo', initial: 'Work Content'},
				Wic2AssemblyQuantity: {
					location: boqMainModule,
					identifier: 'Wic2AssemblyQuantity',
					initial: 'Takeover Quantity'
				},
				WicEstAssembly2WicFlagFk: {
					location: boqMainModule,
					identifier: 'WicEstAssembly2WicFlagFk',
					initial: 'Takeover Mode'
				},
				Assignments: {location: boqMainModule, identifier: 'Assignments', initial: 'Assignments'},
				Rule: {location: boqMainModule, identifier: 'Rule', initial: 'Rule'},
				Param: {location: boqMainModule, identifier: 'Param', initial: 'Param'},
				RuleFormula: {location: boqMainModule, identifier: 'RuleFormula', initial: 'RuleFormula'},
				RuleFormulaDesc: {location: boqMainModule, identifier: 'RuleFormulaDesc', initial: 'RuleFormulaDesc'},
				ruleAndParam: {location: boqMainModule, identifier: 'ruleAndParam', initial: 'Rule/Parameter'},
				DivisionTypeAssignment: {
					location: boqMainModule,
					identifier: 'DivisionTypeAssignment',
					initial: 'Division Type Assignment'
				},
				Total: {location: boqMainModule, identifier: 'Total', initial: 'Total'},
				CommentText: {location: boqMainModule, identifier: 'CommentText', initial: 'Comment'},
				Stlno: {location: boqMainModule, identifier: 'Stlno', initial: 'Stlno'},
				ItemInfo: {location: boqMainModule, identifier: 'ItemInfo', initial: 'Item Info'},
				itemInfoBidderTextComplements: {
					location: boqMainModule,
					identifier: 'itemInfoBidderTextComplements',
					initial: 'TB'
				},
				itemInfoOwnerTextComplements: {
					location: boqMainModule,
					identifier: 'itemInfoOwnerTextComplements',
					initial: 'TO'
				},
				PrcPriceConditionFk: {
					location: cloudCommonModule,
					identifier: 'entityPriceCondition',
					initial: 'entityPriceCondition'
				},
				ExtraIncrement: {location: boqMainModule, identifier: 'ExtraIncrement', initial: 'Extra Increment'},
				PreEscalation: {location: boqMainModule, identifier: 'PreEscalation', initial: 'Pre Escalation'},
				PreEscalationOc: {location: boqMainModule, identifier: 'PreEscalationOc', initial: 'Pre Escalation OC'},
				PreEscalationTotal: {
					location: boqMainModule,
					identifier: 'PreEscalationTotal',
					initial: 'Pre Escalation Total'
				},
				ExtraIncrementOc: {location: boqMainModule, identifier: 'ExtraIncrementOc', initial: 'Extra Increment OC'},
				ExtraPrevious: {location: boqMainModule, identifier: 'ExtraPrevious', initial: 'Extra Previous'},
				ExtraTotal: {location: boqMainModule, identifier: 'ExtraTotal', initial: 'Extra Total'},
				SurchargeFactor: {location: boqMainModule, identifier: 'SurchargeFactor', initial: 'Surcharge Factor'},
				DeliveryDate: {location: boqMainModule, identifier: 'DeliveryDate', initial: '*Delivery* Date'},
				OriginFileName: {location: cloudCommonModule, identifier: 'documentOriginFileName'},
				DocumentTypeFk: {location: cloudCommonModule, identifier: 'entityType'},
				Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
				Description: {location: cloudCommonModule, identifier: 'entityDesc', initial: 'Description'},
				Comment: {location: cloudCommonModule, identifier: 'entityComment', initial: 'Comment'},
				Remark: {location: cloudCommonModule, identifier: 'entityRemark', initial: 'Remark'},
				CustomerFk: {location: objectMainModule, identifier: 'entityCustomerFk', initial: 'Customer'},
				BusinesspartnerFk: {
					location: projectMainModule,
					identifier: 'entityBusinesspartnerFk',
					initial: 'Business Partner'
				},
				SubsidiaryFk: {location: projectMainModule, identifier: 'entitySubsidiary', initial: 'Subsidiary'},

				F: {location: boqMainModule, identifier: 'f', initial: 'F'},
				ContractCode: {location: boqMainModule, identifier: 'contractCode', initial: 'Contract Code'},
				Price: {location: boqMainModule, identifier: 'price', initial: 'Unit Price'},
				TotalQuantity: { location: cloudCommonModule, identifier: 'entityTotal' },
				ClerkRoleFk : { location: boqProjectModule, identifier: 'clerkRoleFk', initial: 'Role' },
				ClerkFk : { location: boqProjectModule, identifier: 'clerkFk', initial: 'Clerk' },

				Approach : { location: boqMainModule, identifier: 'approach', initial: 'Approach' },
				ProjectBillToFk: { location: boqMainModule, identifier: 'ProjectBillToFk', initial: 'Project Bill-To' },
				BoqItemFk: { location: boqMainModule, identifier: 'boqItemFk', initial: '*BoqItem'},
			};


			var myStrings = {
				'CommentText': 'Comment',
				'Reference': 'Reference No.',
				'Reference2': 'Reference No. 2',
				'ExternalCode': 'External Code',
				'BaseBoqReference': 'Base BoQ Reference No.',
				'DesignDescriptionNo': 'Design/Sub-Description No.',
				'WicNumber': 'WIC No.',
				'BasUomFk': 'UoM',
				'BriefInfo': 'Outline Specification',
				'BoqItemFlagFk': 'BoQ Item Flag',
				'BasItemTypeFk': 'Item Type Stand/Opt',
				'BasItemType2Fk': 'Item Type Base/Alt ',
				'AAN': 'AAN',
				'AGN': 'AGN',
				'Factor': 'Factor',
				'FactorDetail': 'Factor Detail',
				'Quantity': 'Quantity',
				'QuantityDetail': 'Quantity Detail',
				'QuantityAdj': 'AQ-Quantity',
				'QuantityAdjDetail': 'AQ-Quantity Detail',
				'QuantitySplit': 'Quantity Split',
				'QuantityTarget': 'Quantity Target',
				'ExWipIsFinalQuantity': '',
				'ExWipQuantity': '',
				'ExWipExpectedRevenue': '',
				'HoursUnit': 'Hrs/Unit',
				'Hours': 'Hours',
				'Cost': 'Cost',
				'Correction': 'Correction',
				'Price': 'Unit Rate',
				'CostOc': 'Cost OC',
				'CorrectionOc': 'Correction OC',
				'PriceOc': 'Unit Rate OC',
				'DiscountPercent': 'Discount % UR',
				'DiscountedUnitprice': 'Corrected UR',
				'DiscountedPrice': 'Discounted Price',
				'Finalprice': 'Final Price',
				'LumpsumPrice': 'Lumpsum Price',
				'DiscountedUnitpriceOc': 'Corrected UR OC',
				'DiscountedPriceOc': 'Discounted Price OC',
				'FinalpriceOc': 'Final Price OC',
				'LumpsumPriceOc': 'Lumpsum Price OC',
				'IsUrb': 'UR Breakdown',
				'Urb1': 'UR Breakdown 1',
				'Urb2': 'UR Breakdown 2',
				'Urb3': 'UR Breakdown 3',
				'Urb4': 'UR Breakdown 4',
				'Urb5': 'UR Breakdown 5',
				'Urb6': 'UR Breakdown 6',
				'Urb1Oc': 'UR Breakdown 1 OC',
				'Urb2Oc': 'UR Breakdown 2 OC',
				'Urb3Oc': 'UR Breakdown 3 OC',
				'Urb4Oc': 'UR Breakdown 4 OC',
				'Urb5Oc': 'UR Breakdown 5 OC',
				'Urb6Oc': 'UR Breakdown 6 OC',
				'UnitRateFrom': 'UR from',
				'UnitRateTo': 'UR to',
				'Discount': 'Discount abs. IT',
				'UnitRateFromOc': 'UR from OC',
				'UnitRateToOc': 'UR to OC',
				'DiscountOc': 'Discount abs. IT OC',
				'DiscountPercentIt': 'Discount % IT',
				'DiscountText': 'Discount Comment',
				'Finaldiscount': 'Final Discount',
				'FinaldiscountOc': 'Final Discount OC',
				'IsLumpsum': 'Lump Sum',
				'BoqItemReferenceFk': 'Reference to',
				'IsDisabled': 'Disabled',
				'IsNotApplicable': 'N/A',
				'IsLeadDescription': 'Lead Description',
				'IsKeyitem': 'Key Item',
				'IsDaywork': 'DW/T+M Item',
				'IsSurcharged': 'Surcharged',
				'IsFreeQuantity': 'Free Quantity',
				'IsFixed': 'Fixed',
				'IsUrFromSd': 'UR from Sub-Description',
				'IsNoMarkup': 'No Markup',
				'IsCostItem': 'Cost Item',
				'ExternalUom': 'External UoM',
				'SelectMarkup': 'Select',
				'BasicData': 'Basic Data',
				'ItemFlag': 'BoQ Item Flag',
				'ItemType': 'Item Type/ Base / Alternative',
				'FactorItem': 'Factor',
				'QuantityPrice': 'Quantity/Price',
				'UrBreakdown': 'UR Breakdown',
				'UrFromTo': 'UR from/to',
				'DiscountLumpSum': 'Discount/Lumpsum Div/BoQ',
				'AdditionsBoq': 'Additions BoQ',
				'AdditionsEstimate': 'Additions Estimate',
				'PrcItemEvaluationFk': 'Procurement Item Evaluation',
				'PrcStructureFk': 'Procurement Structure',
				'ExSalesTaxGroupFk': '',
				'CommentContractor': 'Comment Contractor',
				'CommentClient': 'Comment Client',
				'MasterDataAssignments': 'Master Data Assignments',
				'TotalQuantity': 'Total Quantity',
				'TotalQuantityAccepted': 'Total Quantity (Approved)',
				'TotalIQAccepted': 'Total IQ (Approved)',
				'TotalPrice': 'Total Price',
				'TotalPriceOc': '',
				'TotalHours': 'Total Hours',
				'PrevQuantity': '',
				'PrevRejectedQuantity': 'Previous Rejected Quantity',
				'TotalRejectedQuantity': 'Total Rejected Quantity',
				'OrdQuantity': 'Contract Quantity',
				'RemQuantity': 'Remaining Quantity',
				'BilledQuantity': 'Billed Quantity',
				'InstalledQuantity': 'Installed Quantity',
				'BoqLineTypeFk': 'BoQ Line Type',
				'BoqDivisionTypeFk': 'Division Type',
				'ComplType': 'Type',
				'ComplCaption': 'Introduction',
				'ComplBody': 'Text',
				'ComplTail': 'Subsequent Text',
				'Sorting': 'No.',
				'BpdAgreementFk': 'Agreement',
				'QuantityPriceSurchargeOnly': 'Quantity/Price (surcharge only)',
				'ReferenceTo': 'Reference to',
				'NIC': 'New input controls',
				'CharacteristicContent': 'Characteristic / Content',
				'PrjCharacter': 'Project Characteristic',
				'WorkContent': 'Work Content',
				'_selected': 'Choice',
				'Assignments': 'Assignments',
				'Total': 'Total',
				'QuantitySplitTotal': 'Total',
				'Stlno': 'Stlno',
				'BasItemStatusFk': 'Item Status',
				'StatusComment': 'Status Comment',
				'QuantityMax': 'Maximum Quantity',
				'Pricegross': 'Corrected UR (Gross)',
				'PricegrossOc': 'Corrected UR (Gross OC)',
				'Finalgross': 'Final Price (Gross)',
				'FinalgrossOc': 'Final Price (Gross OC)',
				'ItemTotal': 'Item Total',
				'ItemTotalOc': 'Item Total OC',
				'ItemInfo': 'Item Info',
				'itemInfoBidderTextComplements': 'TB',
				'itemInfoOwnerTextComplements': 'TO',
				'PercentageQuantity': 'Percentage Quantity',
				'CumulativePercentage': 'Cumulative Percentage',
				'ItemTotalEditable': 'Item Total Editable',
				'ItemTotalEditableOc': 'Item Total Editable (OC)',
				'PrjBillToId': 'Schlüssel',
				'BoqStatusFk': 'BoQ Status',
				'BackupDescription': '',
				'BackupComment': '',
				'BackupNumber': '',
				'NotSubmitted': 'Not Submitted',
				'Included': 'Included',
				'CopyInfo': 'Copy Info',
				'CalculateQuantitySplitting': 'Calculate Quantity Splitting',
				'DeliveryDate': 'DeliveryDate',
				'QuantityPortion': 'Quantity Portion (in %)',
				'BudgetOnBoq': 'Budget',
				'PrjChange': 'Project Change',
				'IsGCBoq': 'GC BoQ',
				'BudgetPerUnit': 'Budget/Unit',
				'BudgetTotal': 'Budget Total',
				'BudgetFixedUnit': 'Fixed Budget/Unit',
				'BudgetFixedTotal': 'Fixed Budget Total',
				'BudgetDifference': 'Budget Difference',
				'PrjChangeFk': '',
				'PrjChangeId': '',
				'PrjChangeStatusFk': '',
				'PrjChangeStatusId': '',
				'PrjChangeStatusFactorByReason': 'Factor By Reason',
				'PrjChangeStatusFactorByAmount': 'Factor By Amount',
				'RecordingLevel': 'Recording Level',
				'UseSubQuantityPrice': '',
				'BoqRevenueTypeFk': 'Revenue Type',
				'RevenuePercentage': 'Revenue Percentage',
				'Number': '',
				'DescriptionDe': '',
				'DescriptionFr': '',
				'DescriptionIt': '',
				'DescriptionMutableDe': '',
				'DescriptionMutableFr': '',
				'DescriptionMutableIt': '',
				'ContractorTextDe': '',
				'ContractorTextFr': '',
				'ContractorTextIt': '',
				'EntryStartCtDe': '',
				'EntryStartCtFr': '',
				'EntryStartCtIt': '',
				'EntryStartRowCtDe': '',
				'EntryStartRowCtFr': '',
				'EntryStartRowCtIt': '',
				'HintDe': '',
				'HintFr': '',
				'HintIt': '',
				'Grp': '',
				'PublicationCode': '',
				'EcoDevisMark': '',
				'PrdProductFk': '',
				'DocOwner': '',
				'Level': '',
				'CrbPriceconditionFk': '',
				'CrbPriceconditionTypeFk': '',
				'IsConsidered': '',
				'CalculationType': '',
				'ReferenceAmount': '',
				'TaxCodeFk': '',
				'ConditionPercentage': '',
				'ConditionAmount': '',
				'CalculationAmount': '',
				'CostgroupKagFk': '',
				'CostgroupOglFk': '',
				'CostgroupEtFk': '',
				'CostgroupEglFk': '',
				'CostgroupNglFk': '',
				'CostgroupRglFk': '',
				'CostgroupVgrFk': '',
				'PaymentTerm': '',
				'PaymentTermFk': '',
				'GroupNumber': '',
				'LineNumber': '',
				'Formula': '',
				'BoqItemPreliminaryFk': '',
				'IsFixedPrice': 'Fixed Price',
				'DispatchRecordNumber': '',
				'DispatchRecordQuantity': '',
				'DispatchRecordDateEffective': '',
				'DispatchRecordHeaderCode': '',
				'DispatchRecordHeaderDescr': '',
				'DispatchRecordProductCode': '',
				'DispatchRecordProductDescr': '',
				'Userdefiend1': '',
				'ExSalesRejectedQuantity': '',
				'VobDirectCostPerUnit': '',
				'VobDirectCostPerUnitOc': '',
				'VobIsIndirectCostBalancing': '',
				'VobIsSpecialIndirectCostBalancing': '',
				'Description':'',
				'Performance': '',
				'Margin': '',
				'Approach':'Approach',
				'BidCode':'Bid Code',
				'ProjectBillToFk': 'Project Bill-To',
				'EngDrwCompTypeFk':'Component Type',
				'MdcMaterialCostCodeProductFk':'Component Result',
				'ProductComponentQuantity':'Component Quantity',
				'ProductComponentUomFk':'Component Uom',
			};

			// Add myStrings to words
			for (var key in myStrings) {
				words[key] = {location: boqMainModule, identifier: key, initial: myStrings[key]};
			}

			var boqMainTranslations = {
				translationInfos: {
					'extraModules': [boqMainModule, boqProjectModule, cloudCommonModule, basicsMaterialModule, basicsCustomizeModule, businesspartnerMainModule,
						estimateMainModule, estimateRuleModule, estimateParameterModule, estimateAssemblyModule, qtoMainModule, projectMainModule, objectMainModule,
						salesCommonModule],
					'extraWords': words
				}
			};

			var translationService = {
				// overload: special handling of e.g. 'BoqRootItem.Reference'
				getTranslationInformation: function getTranslationInformation(key) {
					var information = translationService.words[key];
					if (!information) {
						var oenTranslationWords = boqMainOenTranslationService.getTranslationWords();
						information = oenTranslationWords[key];
					}
					if (!information) {
						// Remove prefix from key that's supposed to be separated by a dot and check again.
						key = key.substring(key.indexOf('.') + 1);
						information = translationService.words[key];
					}
					return information;
				}
			};

			self.translateGridConfig = function (gridColumns) {
				platformTranslateService.translateGridConfig(gridColumns);
			};

			self.translateFormContainerOptions = function (formContainerOptions) {
				platformTranslateService.translateFormContainerOptions(formContainerOptions);
			};

			platformUIBaseTranslationService.call(this, [boqMainTranslations], translationService);
		}
	]);

})(angular);
