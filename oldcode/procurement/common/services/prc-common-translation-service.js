(function (angular) {
	'use strict';
	var procurementCommonModule = 'procurement.common';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module(procurementCommonModule).factory('procurementCommonTranslationService', ['platformUIBaseTranslationService',
		'procurementCommonMilestoneLayout', 'procurementCommonGeneralsLayout', 'procurementCommonCertificateLayout',
		'procurementCommonSubcontractorLayout', 'procurementCommonItemLayout', 'procurementCommonTotalLayout',
		'procurementCommonHeaderTextLayout', 'procurementCommonItemTextLayout', 'procurementCommonItemdeliveryLayout',
		'procurementCommonContactLayout', 'procurementCommonDocumentLayout', 'procurementCommonOverviewLayout', 'procurementCommonPaymentScheduleLayout',
		'procurementCommonSuggestedBiddersLayout', 'procurementCommonPostconHistoryLayout', 'basicsMaterialScopeTranslationInfoService', 'prcItemScopeTranslationInfoService',
		'procurementCommonWarrantyLayout', 'procurementPackage2ExtBidderLayout', 'procurementCommonSalesTaxLayoutService', 'procurementCommonItem2PlantLayout',
		function (PlatformUIBaseTranslationService, procurementCommonMilestoneLayout, procurementCommonGeneralsLayout,
			procurementCommonCertificateLayout, procurementCommonSubcontractorLayout, procurementCommonItemLayout,
			procurementCommonTotalLayout, procurementCommonHeaderTextLayout, procurementCommonItemTextLayout,
			procurementCommonItemdeliveryLayout, procurementCommonContactLayout, procurementCommonDocumentLayout,
			procurementCommonOverviewLayout, procurementCommonPaymentScheduleLayout, procurementCommonBiddersLayout, procurementCommonPostconHistoryLayout,
			basicsMaterialScopeTranslationInfoService, prcItemScopeTranslationInfoService, procurementCommonWarrantyLayout, procurementPackage2ExtBidderLayout,
			procurementCommonSalesTaxLayoutService, procurementCommonItem2PlantLayout) {

			var callOffAgreementWords = {
				CallOffAgreement: {location: procurementCommonModule, identifier: 'entityCallOffAgreement', initial: 'Call Off Agreement'},
				LeadTime: {location: procurementCommonModule, identifier: 'entityLeadTime', initial: 'Supplier Lead Time'},
				EarliestStart: {location: procurementCommonModule, identifier: 'entityEarliestStart', initial: 'Earliest Start'},
				LatestStart: {location: procurementCommonModule, identifier: 'entityLatestStart', initial: 'Latest Start'},
				ExecutionDuration: {location: procurementCommonModule, identifier: 'entityExecutionDuration', initial: 'Execution Duration'},
				ContractPenalty: {location: procurementCommonModule, identifier: 'entityContractPenalty', initial: 'Contract Penalty'}
			};

			var mandatoryDeadlineWords = {
				IndividualPerformance: {location: procurementCommonModule, identifier: 'entityIndividualPerformance', initial: 'Individual Performance'},
				Start: {location: procurementCommonModule, identifier: 'entityStart', initial: 'Start'},
				End: {location: procurementCommonModule, identifier: 'entityEnd', initial: 'End'}
			};

			var contractModuleName = 'procurement.contract';
			var accountAssignmentWords = {
				ItemNO: {location: contractModuleName, identifier: 'EntityItemNO', initial: 'Item'},
				BreakdownPercent: {
					location: contractModuleName,
					identifier: 'EntityBreakdownPercent',
					initial: 'Breakdown in %'
				},
				BreakdownAmount: {
					location: contractModuleName,
					identifier: 'EntityBreakdownAmount',
					initial: 'Breakdown Amount'
				},
				BasCompanyYearFk: {
					location: contractModuleName,
					identifier: 'EntityBasCompanyYearFk',
					initial: 'Budget Year'
				},
				MdcControllingUnitFk: {
					location: contractModuleName,
					identifier: 'EntityMdcControllingUnitFk',
					initial: 'Controlling Unit'
				},
				//Different names appear
				MdcControllingunitFk: {
					location: contractModuleName,
					identifier: 'EntityMdcControllingUnitFk',
					initial: 'Controlling Unit'
				},
				MdcTaxCodeFk: {
					location: 'cloud.common',
					identifier: 'entityTaxCode',
					initial: 'Tax Code'
				},
				PsdScheduleFk: {
					location: contractModuleName,
					identifier: 'EntityPsdScheduleFk',
					initial: 'Schedule'
				},
				PsdActivityFk: {
					location: contractModuleName,
					identifier: 'EntityPsdActivityFk',
					initial: 'Activity'
				},
				BreakdownAmountOc: {
					location: procurementCommonModule,
					identifier: 'BreakdownAmountOc',
					initial: 'Breakdown Amount(Oc)'
				},
				ConCrewFk: {
					location: contractModuleName,
					identifier: 'EntityConCrewFk',
					initial: 'Crew'
				},
				Description: {
					location: procurementCommonModule,
					identifier: 'accassign.AccountDescription',
					initial: 'Item Description'
				},
				Quantity: {
					location: procurementCommonModule,
					identifier: 'accassign.ContractedQuantity',
					initial: 'Contracted Quantity'
				},
				BasUomFk: {
					location: procurementCommonModule,
					identifier: 'accassign.BasUom',
					initial: 'UoM'
				},
				DateDelivery: {
					location: procurementCommonModule,
					identifier: 'accassign.DateDelivery',
					initial: 'Delivery Date'
				},
				BasAccAssignItemTypeFk: {
					location: procurementCommonModule,
					identifier: 'accassign.ConAccountItemType',
					initial: 'Item Type'
				},
				BasAccountFk: {
					location: procurementCommonModule,
					identifier: 'accassign.BasAccount',
					initial: 'Account'
				},
				AccountAssignment01: {
					location: procurementCommonModule,
					identifier: 'accassign.AccountAssignment01',
					initial: 'Banf'
				},
				AccountAssignment02: {
					location: procurementCommonModule,
					identifier: 'accassign.AccountAssignment02',
					initial: 'Netzplan'
				},
				IsDelete: {
					location: procurementCommonModule,
					identifier: 'accassign.AccIsDelete',
					initial: 'Is Delete'
				},
				IsFinalInvoice: {
					location: procurementCommonModule,
					identifier: 'accassign.AccIsFinalInvoice',
					initial: 'Is Final Invoice'
				},
				BasAccAssignMatGroupFk: {
					location: procurementCommonModule,
					identifier: 'accassign.ConAccountMaterialGroup',
					initial: 'Material Group'
				},
				AccountAssignment03: {
					location: procurementCommonModule,
					identifier: 'accassign.AccountAssignment03',
					initial: 'Vorgangsnr'
				},
				BasAccAssignAccTypeFk: {
					location: procurementCommonModule,
					identifier: 'accassign.AccountAssignAccType',
					initial: 'Material Group'
				},
				BasAccAssignFactoryFk: {
					location: procurementCommonModule,
					identifier: 'accassign.AccountAssignFactory',
					initial: 'Material Group'
				},
				Version: {
					location: procurementCommonModule,
					identifier: 'accassign.Version',
					initial: 'Version'
				}
			};

			var crewWords = {
				BpdContactFk: {location: contractModuleName, identifier: 'entityBpdContactFk', initial: 'Contact'},
				Sorting: {location: contractModuleName, identifier: 'entitySorting', initial: 'Sorting'},
				IsDefault: {location: contractModuleName, identifier: 'entityIsDefault', initial: 'Is Default'},
				IsLive: {location: contractModuleName, identifier: 'entityIsLive', initial: 'Is Live'},
				UserDefined1: {location: contractModuleName, identifier: 'entityUserDefined1', initial: 'User Defined 1'},
				UserDefined2: {location: contractModuleName, identifier: 'entityUserDefined2', initial: 'User Defined 2'},
				UserDefined3: {location: contractModuleName, identifier: 'entityUserDefined3', initial: 'User Defined 3'},
				UserDefined4: {location: contractModuleName, identifier: 'entityUserDefined4', initial: 'User Defined 4'},
				UserDefined5: {location: contractModuleName, identifier: 'entityUserDefined5', initial: 'User Defined 5'}
			};

			function doGetCallOffAgreementLayout() {
				var cloudCommonModule = 'cloud.common';
				var salesCommonModName = 'sales.common';
				var usedWords = {};
				_.extend(usedWords, callOffAgreementWords);

				usedWords.baseGroup = {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'};
				usedWords.historyGroup = {location: cloudCommonModule, identifier: 'entityHistory', initial: 'History'};

				return {
					translationInfos: {
						extraModules: [procurementCommonModule, cloudCommonModule, salesCommonModName],
						extraWords: usedWords
					}
				};
			}

			function doGetMandatoryDeadlineLayout() {
				var cloudCommonModule = 'cloud.common';
				var basicsCompanyModule = 'basics.company';
				var usedWords = {};
				_.extend(usedWords, mandatoryDeadlineWords);
				usedWords.baseGroup = {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'};
				usedWords.historyGroup = {location: cloudCommonModule, identifier: 'entityHistory', initial: 'History'};

				return {
					translationInfos: {
						extraModules: [procurementCommonModule, cloudCommonModule, basicsCompanyModule],
						extraWords: usedWords
					}
				};
			}

			function doGetAccountAssignmentLayout() {
				var cloudCommonModule = 'cloud.common';
				var usedWords = {};
				_.extend(usedWords, accountAssignmentWords);

				usedWords.baseGroup = {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'};
				usedWords.historyGroup = {location: cloudCommonModule, identifier: 'entityHistory', initial: 'History'};

				return {
					translationInfos: {
						extraModules: [contractModuleName, cloudCommonModule],
						extraWords: usedWords
					}
				};
			}

			function doGetCrewLayout() {
				var cloudCommonModule = 'cloud.common';
				var usedWords = {};
				_.extend(usedWords, crewWords);

				usedWords.baseGroup = {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'};
				usedWords.historyGroup = {location: cloudCommonModule, identifier: 'entityHistory', initial: 'History'};

				return {
					translationInfos: {
						extraModules: [contractModuleName, cloudCommonModule],
						extraWords: usedWords
					}
				};
			}

			function MyTranslationService(layout) {
				PlatformUIBaseTranslationService.call(this, layout);
			}

			MyTranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
			MyTranslationService.prototype.constructor = MyTranslationService;

			var srv = new MyTranslationService(
				[procurementCommonMilestoneLayout, procurementCommonGeneralsLayout,
					procurementCommonCertificateLayout, procurementCommonSubcontractorLayout,
					procurementCommonItemLayout, procurementCommonTotalLayout,
					procurementCommonItemdeliveryLayout, procurementCommonContactLayout,
					procurementCommonDocumentLayout, procurementCommonHeaderTextLayout,
					procurementCommonItemTextLayout, procurementCommonOverviewLayout,
					procurementCommonPaymentScheduleLayout, procurementCommonBiddersLayout, procurementPackage2ExtBidderLayout, doGetCallOffAgreementLayout(),// TODO ADD procurementCommonBiddersLayout
					doGetMandatoryDeadlineLayout(), doGetAccountAssignmentLayout(), doGetCrewLayout(), basicsMaterialScopeTranslationInfoService, prcItemScopeTranslationInfoService, procurementCommonPostconHistoryLayout, procurementCommonWarrantyLayout,
					procurementCommonSalesTaxLayoutService, procurementCommonItem2PlantLayout
				]
			);

			srv.getCallOffAgreementLayout = doGetCallOffAgreementLayout;
			srv.getMandatoryDeadlineLayout = doGetMandatoryDeadlineLayout;
			srv.getAccountAssignmentLayout = doGetAccountAssignmentLayout;
			srv.getCrewLayout = doGetCrewLayout;

			srv.addWordsForCallOfAgreement = function addWordsForCallOfAgreement(words, modules) {
				_.extend(words, callOffAgreementWords);

				if (modules && _.isArray(modules)) {
					modules.push(procurementCommonModule);
				}
			};

			srv.addWordsForMandatoryDeadlines = function addWordsForMandatoryDeadlines(words, modules) {
				_.extend(words, mandatoryDeadlineWords);

				if (modules && _.isArray(modules)) {
					modules.push(procurementCommonModule);
				}
			};

			srv.addWordsForAccountAssignment = function addWordsForAccountAssignment(words, modules) {
				_.extend(words, accountAssignmentWords);

				if (modules && _.isArray(modules)) {
					modules.push(contractModuleName);
				}
			};

			srv.addWordsForCrew = function addWordsForCrew(words, modules) {
				_.extend(words, crewWords);

				if (modules && _.isArray(modules)) {
					modules.push(contractModuleName);
				}
			};

			return srv;

		}

	]);

})(angular);