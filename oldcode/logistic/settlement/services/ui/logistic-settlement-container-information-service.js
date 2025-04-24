/**
 * Created by baf on 14.03.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc service
	 * @name logisticSettlementContainerInformationService
	 * @description provides information on container used in logistic settlement module
	 */
	angular.module(moduleName).service('logisticSettlementContainerInformationService', LogisticSettlementContainerInformationService);

	LogisticSettlementContainerInformationService.$inject = ['_', '$injector', 'platformLayoutHelperService', 'basicsLookupdataConfigGenerator',
		'basicsLookupdataLookupFilterService', 'logisticCommonLayoutOverloadService', 'logisticSettlementConstantValues', 'resourceWotLookupConfigGenerator',
		'basicsLookupdataConfigGeneratorExtension', 'resourceCommonLayoutHelperService', 'platformContextService', 'logisticSettlementDataService','logisticCommonDragDropService'];

	function LogisticSettlementContainerInformationService(_, $injector, platformLayoutHelperService, basicsLookupdataConfigGenerator,
		basicsLookupdataLookupFilterService, logisticCommonLayoutOverloadService, logisticSettlementConstantValues, resourceWotLookupConfigGenerator,
		basicsLookupdataConfigGeneratorExtension, resourceCommonLayoutHelperService, platformContextService, logisticSettlementDataService, logisticCommonDragDropService) {
		var self = this;
		var guids = logisticSettlementConstantValues.uuid.container;

		var filters = [
			{
				key: 'logistic-settlement-rubric-category-by-rubric-filter',
				fn: function filterCategoryByRubric(item) {
					return item.RubricFk === 36;
				}
			},
			{
				key: 'lgm-settlement-controllingunit-project-context-filter',
				serverKey: 'lgm.settlement.controllingunit.project.context.filter',
				serverSide: true,
				fn: function (item) {
					// If SettlementFk is set, then it is a child container => Controlling Unit lookup in Settlement Item Container
					if (item.hasOwnProperty('SettlementFk')) {
						var parent = logisticSettlementDataService.getSelected();
						return {
							ByStructure: true,
							ExtraFilter: false,
							CompanyFk: parent ? parent.CompanyRecipientFk : null,
							PrjProjectFk: parent ? parent.ProjectFk : null,
							FilterKey: 'lgm.settlement.controllingunit.project.context.filter',
							IsProjectReadonly: function (parent) {
								return logisticSettlementDataService.isRevision(parent);
							},
							IsCompanyReadonly: function (parent) {
								return logisticSettlementDataService.isRevision(parent);
							},
						};
					}
					else {
						//Settlement (Header) Main Container => Controlling Unit lookup
						return {
							ByStructure: true,
							ExtraFilter: false,
							CompanyFk: item ? item.CompanyRecipientFk : null,
							PrjProjectFk: item ? item.ProjectFk : null,
							FilterKey: 'lgm.settlement.controllingunit.project.context.filter',
						};
					}
				}
			},
			{
				key: 'lgm-settlement-controllingunit-revenue-project-context-filter',
				serverKey: 'lgm.settlement.controllingunit.project.context.filter',
				serverSide: true,
				fn: function (item) {
					// Settlement Item Container => Controlling UnitRevenue lookup
					return {
						ByStructure: true,
						ExtraFilter: false,
						PrjProjectFk: item ? item.ProjectRevenueFk : null,
						CompanyFk: platformContextService.getContext().clientId,
						FilterKey: 'lgm.settlement.controllingunit.project.context.filter'
					};
				}
			},
			{
				key: 'logistic-settlement-rubric-category-lookup-filter',
				serverKey: 'rubric-category-by-rubric-company-lookup-filter',
				serverSide: true,
				fn: function () {
					return { Rubric: 36 };//36 is rubric for logistic invoice.
				}
			}
		];
		basicsLookupdataLookupFilterService.registerFilter(filters);

		function getDivisionId(item) {
			var divisionId;
			if (item && item.DivisionFk) {
				divisionId = item.DivisionFk;
			} else {
				var selectedItem = $injector.get('logisticSettlementDataService').getSelected();
				if (selectedItem && selectedItem.DivisionFk) {
					divisionId = selectedItem.DivisionFk;
				}
			}
			return divisionId;
		}

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = null;
			switch (guid) {
				case guids.settlementList: // logisticSettlementListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getLogisticSettlementServiceInfos(), self.getLogisticSettlementLayout);
					config.listConfig = { initCalled: false, columns: [], dragDropService: logisticCommonDragDropService, type: 'logistic.settlement' };
					break;
				case guids.settlementDetail: // logisticSettlementDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getLogisticSettlementServiceInfos(), self.getLogisticSettlementLayout);
					break;
				case guids.itemList: // logisticSettlementItemListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getLogisticSettlementItemServiceInfos(), self.getLogisticSettlementItemLayout);
					break;
				case guids.itemDetail: // logisticSettlementItemDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getLogisticSettlementItemServiceInfos(), self.getLogisticSettlementItemLayout);
					break;
				case guids.billingSchemaList: // billingSchemaListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getBillingSchemaServiceInfo(), self.getBillingSchemaLayout);
					break;
				case guids.billingSchemaDetail: // billingSchemaDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getBillingSchemaServiceInfo(), self.getBillingSchemaLayout);
					break;
				case guids.transactionList: // transactionListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getTransactionServiceInfo(), self.getTransactionLayout);
					break;
				case guids.transactionDetail: // transactionDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getTransactionServiceInfo(), self.getTransactionLayout);
					break;
				case guids.validationList: // validationListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getValidationServiceInfo(), self.getValidationLayout);
					break;
				case guids.validationDetail: // validationDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getValidationServiceInfo(), self.getValidationLayout);
					break;
				case guids.batchList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getBatchServiceInfo(), self.getBatchLayout);
					break;
				case guids.batchDetail:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getBatchServiceInfo(), self.getBatchLayout);
					break;
				case guids.batchValidationList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getBatchValidationServiceInfo(), self.getBatchValidationLayout);
					break;
				case guids.batchValidationDetail:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getBatchValidationServiceInfo(), self.getBatchValidationLayout);
					break;
				case guids.settledProjectChangeItemList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getSettledProjectChangeItemServiceInfo());
					break;
				case guids.settledProjectChangeItemDetail:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getSettledProjectChangeItemServiceInfo());
					break;
				case guids.postedDispHeaderUnsettledList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getPostedDispHeaderUnsettledServiceInfo());
					break;
				case guids.postedDispHeaderUnsettledDetail:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getPostedDispHeaderUnsettledServiceInfo());
					break;
				case guids.settlementClaimList: // settlementClaimListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getSettlementClaimServiceInfo(), self.getSettlementClaimLayout);
					break;
				case guids.settlementClaimDetail: // settlementClaimDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getSettlementClaimServiceInfo(), self.getSettlementClaimLayout);
					break;
				case guids.jobsWithNegativeQuantityForBulkList: // logisticSettlementJobsNegativeQuantityBulkListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getJobsNegativeQuantityBulkServiceInfo(), self.getJobsNegativeQuantityBulkLayout);
					break;
				case guids.jobsWithNegativeQuantityForBulkDetail: // logisticSettlementJobsNegativeQuantityBulkDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getJobsNegativeQuantityBulkServiceInfo(), self.getJobsNegativeQuantityBulkLayout);
					break;
			}
			return config;
		};

		this.getLogisticSettlementServiceInfos = function getLogisticSettlementServiceInfos() {
			return {
				standardConfigurationService: 'logisticSettlementLayoutService',
				dataServiceName: 'logisticSettlementDataService',
				validationServiceName: 'logisticSettlementValidationService'
			};
		};

		this.getLogisticSettlementLayout = function getLogisticSettlementLayout() {
			var res = platformLayoutHelperService.getFiveGroupsBaseLayout('1.0.0', 'logistic.settlement',
				['settlementtypefk', 'rubriccategoryfk', 'settlementno', 'companyfk', 'projectfk', 'languagefk', 'settlementstatusfk', 'settlementdate',
					'settlementtargetno', 'companyrecipientfk', 'vouchertypefk', 'invoicetypefk', 'currencyfk', 'exchangerate', 'remark', 'commenttext',
					'controllingunitfk', 'bookingtext', 'changefk', 'batchinformation', 'pricetotalqty', 'pricetotalorigcurqty', 'supplierfk', 'postingdate', 'companyresponsiblefk'], {
					gid: 'business',
					attributes: ['clerkfk', 'businesspartnerfk', 'subsidiaryfk', 'customerfk']
				}, {
					gid: 'billing',
					attributes: ['billingschemamasterfk', 'taxcodefk', 'vatgroupfk', 'paymenttermfk', 'jobtypefk', 'performedfrom', 'performedto']
				}, {
					gid: 'cancellation',
					attributes: ['iscanceled', 'cancellationno', 'cancellationreason', 'cancellationdate']
				}, platformLayoutHelperService.getUserDefinedTextGroup(5, 'userdefinedtext', 'userdefinedtext', '0'));

			res.overloads = platformLayoutHelperService.getOverloads(['settlementtypefk', 'rubriccategoryfk', 'companyfk', 'projectfk',
				'languagefk', 'settlementstatusfk', 'companyrecipientfk', 'vouchertypefk', 'invoicetypefk',
				'currencyfk', 'clerkfk', 'subsidiaryfk', 'customerfk', 'billingschemamasterfk', 'taxcodefk',
				'paymenttermfk', 'jobtypefk', 'controllingunitfk', 'changefk', 'vatgroupfk', 'supplierfk', 'companyresponsiblefk'], self);

			res.overloads.batchinformation = {readonly: true};
			res.overloads.pricetotalqty = {readonly: true};
			res.overloads.pricetotalorigcurqty = { readonly: true };
			res.overloads.businesspartnerfk = self.getBusinessPartnerLookup('logisticSettlementDataService');

			return res;
		};

		this.getLogisticSettlementItemServiceInfos = function getLogisticSettlementItemServiceInfos() {
			return {
				standardConfigurationService: 'logisticSettlementItemLayoutService',
				dataServiceName: 'logisticSettlementItemDataService',
				validationServiceName: 'logisticSettlementItemValidationService'
			};
		};

		function getSettlementItemBaseProperties(all) {
			if(all) {
				return ['itemno', 'settlementitemtypefk', 'dispatchheaderfk', 'dispatchrecordfk', 'quantity', 'uomfk', 'workoperationtypefk',
					'controllingunitfk', 'controllingunitrevenuefk', 'taxcodefk', 'procurementstructurefk', 'settledfrom', 'settledto',
					'recordtype', 'article', 'articledescription', 'quantitymultiplier','performingjobfk','receivingjobfk','performingjobgroupfk','receivingjobgroupfk','billingjobfk', 'billedjobfk', 'jobperformingfk',
					'jobreceivingfk', 'plantsupplierfk', 'plantsupplyitemfk', 'projectchangefk', 'projectchangestatusfk', 'departurratingmultiplier', 'claimexist'];
			}
			return ['itemno', 'settlementitemtypefk', 'dispatchheaderfk', 'dispatchrecordfk', 'quantity', 'uomfk', 'workoperationtypefk',
				'controllingunitfk', 'controllingunitrevenuefk', 'taxcodefk', 'procurementstructurefk', 'settledfrom', 'settledto',
				'article', 'articledescription', 'quantitymultiplier','performingjobfk','receivingjobfk','performingjobgroupfk','receivingjobgroupfk','billingjobfk', 'billedjobfk', 'jobperformingfk',
				'jobreceivingfk', 'plantsupplierfk', 'plantsupplyitemfk', 'projectchangefk', 'projectchangestatusfk', 'departurratingmultiplier', 'claimexist'];
		}

		function getSettlementItemAdditionalGroups() {
			return [{
				gid: 'prices',
				attributes: ['price', 'priceportion1', 'priceportion2', 'priceportion3', 'priceportion4', 'priceportion5', 'priceportion6', 'pricetotal', 'pricetotalqty']
			}, {
				gid: 'pricesorigcur',
				attributes: ['priceorigcur', 'priceorigcur1', 'priceorigcur2', 'priceorigcur3', 'priceorigcur4', 'priceorigcur5', 'priceorigcur6', 'pricetotalorigcur', 'pricetotalorigcurqty']
			},
			platformLayoutHelperService.getUserDefinedTextGroup(5, 'userdefinedtext', 'userdefinedtext', '0'),
			platformLayoutHelperService.getUserDefinedNumberGroup(5, 'userdefinednumber', 'userdefinednumber', '0'),
			platformLayoutHelperService.getUserDefinedDateGroup(5, 'userdefineddate', 'userdefineddate', '0')];
		}

		function getSettlementItemLookupForeignKeys() {
			return ['settlementitemtypefk', 'dispatchrecordfk', 'dispatchheaderfk', 'uomfk', 'workoperationtypefk', 'controllingunitfk', 'controllinggroupsetfk',
				'controllingunitrevenuefk', 'taxcodefk', 'procurementstructurefk','performingjobfk','receivingjobfk','performingjobgroupfk','receivingjobgroupfk',
				'billingjobfk', 'billedjobfk', 'jobperformingfk', 'jobreceivingfk','plantsupplierfk', 'plantsupplyitemfk', 'projectchangefk', 'projectchangestatusfk'
			];
		}

		this.getLogisticSettlementItemLayout = function getLogisticSettlementItemLayout() {
			var res = platformLayoutHelperService.getMultipleGroupsBaseLayout('1.0.0', 'logistic.settlement.item',
				getSettlementItemBaseProperties(true), getSettlementItemAdditionalGroups());

			res.overloads = platformLayoutHelperService.getOverloads(getSettlementItemLookupForeignKeys(), self);

			res.overloads.recordtype = {readonly: true};
			res.overloads.article = {readonly: true};
			res.overloads.articledescription = {readonly: true};
			res.overloads.settledfrom = {readonly: true};
			res.overloads.settledto = {readonly: true};
			res.overloads.pricetotal = {readonly: true};
			res.overloads.pricetotalqty = {readonly: true};
			res.overloads.pricetotalorigcur = {readonly: true};
			res.overloads.pricetotalorigcurqty = {readonly: true};
			res.overloads.claimexist = {readonly: true};

			return res;
		};

		function getSettledProjectChangeItemLayoutAdditionalGroups() {
			var itemGroups = getSettlementItemAdditionalGroups();

			itemGroups.push({
				gid: 'settlement',
				attributes: ['settlementno','projectfk','supplierfk','customerfk','businesspartnerfk','subsidiaryfk','companyfk','companyrecipientfk','clerkfk','pricetotalquantitysettled','pricetotalquantitysettledoriginalcurrency']
			});

			return itemGroups;
		}

		function getSettledProjectChangeItemLayoutForeignKeys() {
			var foreignKeys = getSettlementItemLookupForeignKeys();

			foreignKeys.push('projectfk','supplierfk','customerfk','businesspartnerfk','subsidiaryfk','companyfk','companyrecipientfk','clerkfk');

			return foreignKeys;
		}

		this.getSettledProjectChangeItemServiceInfo = function getSettledProjectChangeItemServiceInfo() {
			return {
				standardConfigurationService: 'logisticSettledProjectChangeItemLayoutService',
				dataServiceName: 'logisticSettledProjectChangeItemDataService'
			};
		};

		this.getSettledProjectChangeItemLayout = function getSettledProjectChangeItemLayout() {
			var res = platformLayoutHelperService.getMultipleGroupsBaseLayout('1.0.0', 'logistic.settlement.settledprojectchangeitem',
				getSettlementItemBaseProperties(false), getSettledProjectChangeItemLayoutAdditionalGroups());

			res.overloads = platformLayoutHelperService.getOverloads(getSettledProjectChangeItemLayoutForeignKeys(), self);

			res.overloads.article = {readonly: true};
			res.overloads.articledescription = {readonly: true};
			res.overloads.settledfrom = {readonly: true};
			res.overloads.settledto = {readonly: true};
			res.overloads.pricetotal = {readonly: true};
			res.overloads.pricetotalqty = {readonly: true};
			res.overloads.pricetotalorigcur = {readonly: true};
			res.overloads.pricetotalorigcurqty = {readonly: true};

			return res;
		};

		this.getPostedDispHeaderUnsettledServiceInfo = function getPostedDispHeaderUnsettledServiceInfo() {
			return {
				standardConfigurationService: 'logisticPostedDispHeaderUnsettledLayoutService',
				dataServiceName: 'logisticPostedDispHeaderUnsettledDataService'
			};
		};

		this.getPostedDispHeaderUnsettledLayout = function getPostedDispHeaderUnsettledLayout() {
			let res = platformLayoutHelperService.getTwoGroupsBaseLayout('1.0.0', 'logistic.settlement.postedDispHeaderNotSettled', [
				'id',
				'code',
				'dispatchstatusfk',
				'datedocumented',
				'dateeffective'
			]);
			res.overloads = platformLayoutHelperService.getOverloads(['id','dispatchstatusfk'], self);
			return res;
		};


		this.getBillingSchemaServiceInfo = function getBillingSchemaServiceInfo() {
			return {
				standardConfigurationService: 'logisticSettlementBillingSchemaLayoutService',
				dataServiceName: 'logisticSettlementBillingSchemaDataService',
				validationServiceName: 'logisticSettlementBillingSchemaValidationService'
			};
		};

		this.getBillingSchemaLayout = function getBillingSchemaLayout() {
			var res = platformLayoutHelperService.getFourGroupsBaseLayout('1.0.0', 'logistic.settlement.billing.schema',
				['billingschemafk', 'sorting', 'billinglinetypefk', 'generalstypefk', 'value', 'result', 'resultoc',
					'iseditable', 'group1', 'group2', 'description', 'description2', 'isturnover', 'taxcodefk',
					'finaltotal', 'hascontrollingunit', 'controllingunitfk', 'billingschemaaafk',
					'billingschemataxfk', 'coderetention', 'paymenttermfk', 'formula'], {
					gid: 'accountingInfo',
					attributes: ['accountno', 'offsetaccountno', 'credfactor', 'debfactor', 'credlinetypefk', 'deblinetypefk']
				}, {
					gid: 'printingInfo',
					attributes: ['isprinted', 'isbold', 'isitalic', 'isunderline', 'isprintedzero']
				}, platformLayoutHelperService.getUserDefinedTextGroup(3, null, 'userdefined', '0')
			);
			res.overloads = platformLayoutHelperService.getOverloads(['billingschemafk', 'billinglinetypefk', 'generalstypefk', 'taxcodefk',
				'controllingunitfk', 'billingschemaaafk', 'billingschemataxfk', 'paymenttermfk', 'credlinetypefk',
				'deblinetypefk'], self);

			return res;
		};

		this.getTransactionServiceInfo = function getTransactionServiceInfo() {
			return {
				standardConfigurationService: 'logisticSettlementTransactionLayoutService',
				dataServiceName: 'logisticSettlementTransactionDataService',
				validationServiceName: 'logisticSettlementTransactionValidationService'
			};
		};

		this.getTransactionLayout = function getTransactionLayout() {
			var res = platformLayoutHelperService.getThreeGroupsBaseLayout('1.0.0', 'logistic.settlement.transaction',
				['documenttype', 'linetype', 'currency', 'vouchernumber', 'voucherdate', 'postingnarritive', 'postingdate', 'netduedate', 'discountduedate',
					'discountamount', 'debtor', 'debtorgroup', 'businesspostinggroup', 'accountreceiveable', 'nominalaccount', 'amount', 'quantity', 'isdebit',
					'vatamount', 'vatcode', 'isprogress', 'ordernumber', 'amountauthorized', 'documentno', 'creditor', 'creditorgroup', 'transactiontypefk',
					'externalnumber', 'externaldate', 'businesspostinggroupcreditor', 'accountpayable', 'controllinggroupsetfk', 'companyfk', 'uom', 'taxcodefk', 'vatgroupfk', 'taxcodematrixfk'], {
					gid: 'controllingAssignments',
					attributes: ['controllingunitcode',
						'controllingunitassign01', 'controllingunitassigntext01', 'controllingunitassign02', 'controllingunitassigntext02',
						'controllingunitassign03', 'controllingunitassigntext03', 'controllingunitassign04', 'controllingunitassigntext04',
						'controllingunitassign05', 'controllingunitassigntext05', 'controllingunitassign06', 'controllingunitassigntext06',
						'controllingunitassign07', 'controllingunitassigntext07', 'controllingunitassign08', 'controllingunitassigntext08',
						'controllingunitassign09', 'controllingunitassigntext09', 'controllingunitassign10', 'controllingunitassigntext10']
				}, {
					gid: 'financialInfo',
					attributes: ['issuccess', 'transactionid', 'handoverid', 'returnvalue', 'lineno', 'nominaldimension1', 'nominaldimension2', 'nominaldimension3',
						'postingtype', 'assetno', 'coderetention', 'paymenttermfk']
				});
			res.overloads = platformLayoutHelperService.getOverloads(['paymenttermfk', 'documentno', 'controllinggroupsetfk', 'transactiontypefk', 'companyfk', 'taxcodefk', 'vatgroupfk', 'vouchertypefk', 'taxcodematrixfk'], self);

			return res;
		};

		this.getValidationServiceInfo = function getValidationServiceInfo() {
			return {
				standardConfigurationService: 'logisticSettlementValidationLayoutService',
				dataServiceName: 'logisticSettlementValidationDataService',
				validationServiceName: 'logisticSettlementValidationValidationService'
			};
		};

		this.getValidationLayout = function getValidationLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.settlement.validation',
				['messageseverityfk', 'message']);
			res.overloads = platformLayoutHelperService.getOverloads(['messageseverityfk', 'message'], self);

			return res;
		};

		this.getBatchServiceInfo = function getBatchServiceInfo() {
			return {
				standardConfigurationService: 'logisticSettlementBatchLayoutService',
				dataServiceName: 'logisticSettlementBatchDataService',
				validationServiceName: 'logisticSettlementBatchValidationService'
			};
		};

		this.getBatchLayout = function getBatchLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.settlement.batch',
				['equipmentdivisionfk', 'fromdate', 'todate', 'istestrun', 'commenttext', 'started', 'finished']);
			res.overloads = platformLayoutHelperService.getOverloads(['equipmentdivisionfk'], self);
			res.overloads.fromdate = {readonly: true};
			res.overloads.todate = {readonly: true};
			res.overloads.istestrun = {readonly: true};
			res.overloads.commenttext = {readonly: true};
			res.overloads.started = {readonly: true};
			res.overloads.finished = {readonly: true};

			return res;
		};

		this.getBatchValidationServiceInfo = function getBatchValidationServiceInfo() {
			return {
				standardConfigurationService: 'logisticSettlementBatchValidationLayoutService',
				dataServiceName: 'logisticSettlementBatchValidationDataService',
				validationServiceName: 'logisticSettlementBatchValidationValidationService'
			};
		};

		this.getBatchValidationLayout = function getBatchValidationLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.settlement.batchvalidation',
				['messageseverityfk', 'message']);
			res.overloads = platformLayoutHelperService.getOverloads(['messageseverityfk', 'message'], self);

			return res;
		};

		this.getSettlementClaimServiceInfo = function getSettlementClaimServiceInfo() {
			return {
				standardConfigurationService: 'logisticSettlementClaimLayoutService',
				dataServiceName: 'logisticSettlementClaimDataService',
				validationServiceName: 'logisticSettlementClaimValidationService'
			};
		};

		this.getSettlementClaimLayout = function getSettlementClaimLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.settlement.settlementclaim',
				[
					'settlementnumber',
					'settlementitemnumber',
					'settlementitemtypefk',
					'dispatchheaderfk',
					'dispheadercode',
					'dispatchrecordfk',
					'disprecordarticlecode',
					'claimreasonfk',
					'jobclaimfk',
					'commenttext',
					'workoperationtypefk',
					'ishire',
					'expectedeffectivedate',
					'expectedquantity',
					'expectedworkoperationtypefk',
					'expectedishire',
					'expecteduomfk',
					'previoussettlementexist',
					'claimstatusfk',
					'claimmethodfk',
					'instructiontext',
					'providedwizard',
					'clerkownerfk',
					'clerkresponsiblefk',
					'islive'
				]

			);

			res.overloads = platformLayoutHelperService.getOverloads(
				['settlementitemtypefk',
					'claimreasonfk',
					'expecteduomfk',
					'claimstatusfk',
					'claimmethodfk',
					'clerkownerfk',
					'clerkresponsiblefk'], self);

			res.addAdditionalColumns = true;
			res.overloads.settlementnumber = {readonly: true};
			res.overloads.settlementitemnumber = {readonly: true};
			res.overloads.dispatchheaderfk = {
				readonly: true,
				navigator: {
					moduleName: 'logistic.dispatching'
				}};
			res.overloads.dispheadercode = {readonly: true};
			res.overloads.dispatchrecordfk = {readonly: true};
			res.overloads.disprecordarticlecode = {readonly: true};
			res.overloads.jobclaimfk = {
				readonly: true,
				navigator: {
					moduleName: 'logistic.job'
				}};
			res.overloads.workoperationtypefk = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'resourceWorkOperationTypeLookupDataService',
				readonly: true
			});
			res.overloads.ishire = {readonly: true};
			res.overloads.expectedworkoperationtypefk = getWorkOperationTypeOverload();
			res.overloads.expectedishire = {readonly: true};
			res.overloads.previoussettlementexist = {readonly: true};
			res.overloads.instructiontext = {readonly: true};
			res.overloads.providedwizard = {readonly: true};

			return res;
		};

		this.getJobsNegativeQuantityBulkServiceInfo = function getJobsNegativeQuantityBulkServiceInfo() {
			return {
				standardConfigurationService: 'logisticSettlementJobsNegativeQuantityBulkLayoutService',
				dataServiceName: 'logisticSettlementJobsNegativeQuantityBulkDataService'
			};
		};

		this.getJobsNegativeQuantityBulkLayout  = function getJobsNegativeQuantityBulkLayout() {
			var res = platformLayoutHelperService.getMultipleGroupsBaseLayoutWithoutHistory('1.0.0', 'logistic.settlement.jobsNegativeQuantityBulk',
				[
					'companycode',
					'jobfk',
					'plantcode',
					'plantdescription',
					'workoperationtypefk',
					'projectno',
					'projectname',
					'locationquantity'
				]);

			res.overloads = {
				'workoperationtypefk' : getWorkOperationTypeOverload()
			};

			res.addAdditionalColumns = false;
			res.overloads.workoperationtypefk.readonly = true;
			res.overloads.jobfk = platformLayoutHelperService.provideJobLookupReadOnlyOverload();
			res.overloads.jobfk.navigator = {moduleName: 'logistic.job'};
			res.overloads.plantcode = {readonly: true};
			res.overloads.plantdescription = {readonly: true};
			res.overloads.companycode = {readonly: true};
			res.overloads.projectno = {readonly: true};
			res.overloads.projectname = {readonly: true};
			res.overloads.locationquantity = {readonly: true};

			return res;
		};

		this.getSettlementStructVLayout  = function getSettlementStructVLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'logistic.settlement.settlementstructure',
				['companyfk', 'projectfk', 'companyresponsiblefk', 'settlementtypefk', 'settlementstatusfk', 'customerfk', 'supplierfk', 'businesspartnerfk',
					'clerkfk', 'jobtypefk', 'performedfrom', 'performedto', 'rubriccategoryfk', 'istestrun',
					'batchrunstarteddate', 'batchfromdate', 'batchtodate', 'pricetotalqty', 'pricetotalorigcurqty', 'pricetotalqtyplant', 'pricetotalqtyocplant',
					'pricetotalqtysundry', 'pricetotalqtyocsundry', 'pricetotalqtymaterial', 'pricetotalqtyocmaterial']);

			res.overloads = platformLayoutHelperService.getOverloads(['settlementtypefk', 'rubriccategoryfk', 'companyfk', 'projectfk',
				'settlementstatusfk', 'clerkfk', 'customerfk',  'jobtypefk', 'supplierfk'], self);

			return res;
		};

		function getWorkOperationTypeOverload(){
			return resourceWotLookupConfigGenerator.provideWotLookupOverloadFilteredByPlantType(true,null,true);
		}

		function getBillingSchemaMasterOverload() {
			return {
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'basics-billing-schema-billing-schema-combobox',
						lookupOptions: {
							showClearButton: false
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'BillingSchema',
						displayMember: 'Description'
					},
					width: 125
				},
				detail: {
					type: 'directive',
					directive: 'basics-billing-schema-billing-schema-combobox',
					options: {
						descriptionMember: 'Description',
						showClearButton: false
					}
				}
			};
		}

		function getBillingSchemaOverload() {
			return basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'logisticSettlementBillingSchemaLookupService'
			});
		}

		function getBillingSchemaDetailOverload() {
			return {
				detail: {
					type: 'directive',
					directive: 'basics-billing-schema-billing-schema-detail-lookup',
					options: {
						lookupOptions: {
							showClearButton: true
						}
					}
				},
				grid: {
					editor: 'lookup',
					editorOptions: {
						lookupOptions: {
							showClearButton: true
						},
						directive: 'basics-billing-schema-billing-schema-detail-lookup'
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'BillingSchemaDetail',
						displayMember: 'Description'
					}
				}
			};
		}

		function getChangeLookupOverload() {

			var lookupOptions = {
				showClearButton: true,
				filterOptions: {
					serverKey: 'project-change-lookup-for-logistic-settlement-filter',
					serverSide: true,
					fn: function (dataContext) {
						return {
							ProjectFk: dataContext.ProjectFk
						};
					}
				}
			};

			return {
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'project-change-dialog',
						descriptionMember: 'Description',
						lookupOptions: lookupOptions
					}
				},
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'project-change-dialog',
						lookupOptions: lookupOptions
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'projectchange',
						displayMember: 'Code'
					},
					width: 130
				}
			};
		}

		function getProjectChangeLookupOverload() {
			let lookupOptions = {
				additionalColumns: true,
				showClearButton: true,
				addGridColumns: [{
					id: 'description',
					field: 'Description',
					name: 'Description',
					name$tr$: 'cloud.common.entityDescription',
					formatter: 'description'
				}]
			};

			return {
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'project-change-dialog',
						descriptionMember: 'Description',
						lookupOptions: lookupOptions
					}
				},
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'project-change-dialog',
						lookupOptions: lookupOptions
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'projectchange',
						displayMember: 'Code'
					},
					width: 130
				},
				readonly: true
			};
		}

		this.getBusinessPartnerLookup = function getBusinessPartnerLookup(dataServiceName) {
			let ovl = platformLayoutHelperService.provideBusinessPartnerLookupOverload();
			// detail
			ovl.detail.options.IsShowBranch = true;
			ovl.detail.options.mainService = dataServiceName;
			ovl.detail.options.BusinessPartnerField = 'BusinessPartnerFk';
			ovl.detail.options.SubsidiaryField = 'SubsidiaryFk';

			// grid
			ovl.grid.editorOptions.lookupOptions.IsShowBranch = true;
			ovl.grid.editorOptions.lookupOptions.mainService = dataServiceName;
			ovl.grid.editorOptions.lookupOptions.BusinessPartnerField = 'BusinessPartnerFk';
			ovl.grid.editorOptions.lookupOptions.SubsidiaryField = 'SubsidiaryFk';

			return ovl;
		};

		this.getOverload = function getOverloads(overload) {
			var ovl = null;

			switch (overload) {
				case 'billinglinetypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.billinglinetype');
					break;
				case 'id':
					ovl = logisticCommonLayoutOverloadService.getDispatchHeaderLookupOverload('DispatchHeaderFk', true);
					break;
				case 'dispatchstatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.dispatchstatus', null, {
						customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
						field: 'RubricCategoryFk',
						showIcon: true
					});
					break;
				case 'billingschemafk':
					ovl = getBillingSchemaOverload();
					break;
				case 'billingschemaaafk':
					ovl = getBillingSchemaOverload();
					break;
				case 'billingschemamasterfk':
					ovl = getBillingSchemaMasterOverload();
					break;
				case 'billingschemataxfk':
					ovl = getBillingSchemaOverload();
					break;
				case 'billingschemadetailfk':
					ovl = getBillingSchemaDetailOverload();
					break;
				case 'credlinetypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.creditorlinetype');
					break;
				case 'currencyfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideCurrencyLookupSpecification());
					break;
				case 'deblinetypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.debitorlinetype');
					break;
				case 'equipmentdivisionfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.equipmentdivision');
					break;
				case 'generalstypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.generaltype');
					break;
				case 'invoicetypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.billinvoicetype');
					break;
				case 'jobtypefk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCustomLogisticJobTypeLookupDataService'
					});
					break;
				case 'message':
					ovl = {readonly: true};
					break;
				case 'projectchangestatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.projectchangestatus', null, {
						showIcon: true,
						field: 'RubricCategoryFk',
						customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK'});
					break;
				case 'messageseverityfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.messageseverity');
					break;
				case 'rubriccategoryfk':
					ovl = {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
								lookupOptions: {
									filterKey: 'logistic-settlement-rubric-category-lookup-filter',
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {'lookupType': 'RubricCategoryByRubricAndCompany', 'displayMember': 'Description'},
							width: 125
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
								descriptionMember: 'Description',
								lookupOptions: {
									filterKey: 'logistic-settlement-rubric-category-lookup-filter',
									showClearButton: true
								}
							}
						}
					};
					break;
				case 'settlementstatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.logisticssettlementstatus', null, {
						customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
						field: 'RubricCategoryFk',
						showIcon: true
					});
					break;
				case 'taxcodefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.taxcode.taxcode');
					break;
				case 'taxcodematrixfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName:'basicsCustomTaxCodeMatrixLookupDataService',
						enableCache: true
					});
					break;
				case 'uomfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideUoMLookupSpecification());
					break;
				case 'vouchertypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.vouchertype');
					break;
				case 'projectfk':
					ovl = platformLayoutHelperService.provideProjectLookupOverload();
					break;
				case 'companyfk':
					ovl = platformLayoutHelperService.provideCompanyLookupOverload();
					break;
				case 'companyrecipientfk':
					ovl = platformLayoutHelperService.provideCompanyLookupOverload();
					break;
				case 'clerkfk':
					ovl = platformLayoutHelperService.provideClerkLookupOverload();
					break;
				case 'languagefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.language');
					break;
				case 'paymenttermfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.paymentterm');
					break;
				case 'jobperformingfk':
					ovl = platformLayoutHelperService.provideJobLookupOverload();
					break;
				case 'jobreceivingfk':
					ovl = platformLayoutHelperService.provideJobLookupOverload();
					break;
				case 'subsidiaryfk':
					ovl = {
						detail: {
							type: 'directive',
							directive: 'business-partner-main-subsidiary-lookup',
							options: {
								initValueField: 'SubsidiaryAddress',
								filterKey: 'logistic-settlement-subsidiary-filter',
								showClearButton: true,
								displayMember: 'AddressLine'
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-subsidiary-lookup',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'logistic-settlement-subsidiary-filter',
									displayMember: 'AddressLine'
								}
							},
							width: 125,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Subsidiary',
								displayMember: 'AddressLine'
							}
						}
					};
					break;
				case 'customerfk':
					ovl = {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-customer-lookup',
								lookupOptions: {
									filterKey: 'logistic-settlement-customer-filter',
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {'lookupType': 'customer', 'displayMember': 'Code'},
							width: 125
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'business-partner-main-customer-lookup',
								descriptionField: 'CustomerDescription',
								descriptionMember: 'Description',
								lookupOptions: {
									filterKey: 'logistic-settlement-customer-filter',
									showClearButton: true
								}
							}
						}
					};
					break;

				case 'controllingunitfk':
					ovl = resourceCommonLayoutHelperService.provideControllingUnitOverload(true, 'lgm-settlement-controllingunit-project-context-filter');
					break;
				case 'controllingunitrevenuefk':
					ovl = resourceCommonLayoutHelperService.provideControllingUnitOverload(true, 'lgm-settlement-controllingunit-revenue-project-context-filter');
					break;
				case 'changefk':
					ovl = getChangeLookupOverload();
					break;
				case 'dispatchrecordfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'logisticDispatchingRecordLookupDataService',

						filter: function (item) {
							var readData = {};
							if (item) {

								if (item.DispatchHeaderFk) {
									readData.PKey1 = item.DispatchHeaderFk;
								}
								readData.PKey3 = getDivisionId(item);
							}

							return readData;
						}
					});
					break;
				case 'projectchangefk':
					ovl = getProjectChangeLookupOverload();
					break;
				case 'dispatchheaderfk':
					ovl = logisticCommonLayoutOverloadService.getDispatchHeaderLookupOverload('DispatchHeaderFk', true);
					break;
				case 'procurementstructurefk':
					ovl = {
						navigator: {
							moduleName: 'basics.procurementstructure'
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-procurementstructure-structure-dialog',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'prcstructure',
								displayMember: 'Code'
							}
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-procurementstructure-structure-dialog',
								descriptionField: 'StructureDescription',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									initValueField: 'StructureCode',
									showClearButton: true
								}
							}
						}
					};
					break;
				case 'settlementitemtypefk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.logisticssettlementitemtype');
					break;
				case 'settlementtypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.logisticssettlementtype');
					break;
				case 'workoperationtypefk':
					ovl = resourceWotLookupConfigGenerator.provideWotLookupOverloadFilteredByPlant(true);
					break;
				case 'documentno':
					ovl = {readonly: true};
					break;
				case 'vatgroupfk':
					ovl = basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('basics.customize.vatgroup', null, {showClearButton: true});
					break;
				case 'supplierfk':
					ovl = platformLayoutHelperService.provideBusinessPartnerSupplierLookupOverload();
					break;
				case 'controllinggroupsetfk':
					ovl = {readonly: true};
					break;
				case 'transactiontypefk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.transactiontype');
					break;
				case'performingjobfk':
					ovl = platformLayoutHelperService.provideJobLookupReadOnlyOverload();
					break;
				case'receivingjobfk':
					ovl = platformLayoutHelperService.provideJobLookupReadOnlyOverload();
					break;
				case 'performingjobgroupfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.jobgroup');
					break;
				case 'receivingjobgroupfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.jobgroup');
					break;
				case 'billingjobfk':
					ovl = platformLayoutHelperService.provideJobLookupOverload();
					break;
				case 'billedjobfk':
					ovl = platformLayoutHelperService.provideJobLookupOverload();
					break;
				case 'plantsupplierfk':
					ovl =  basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'plantSupplierLookupDataService'
					});
					break;
				case 'plantsupplyitemfk':
					ovl =  basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'plantSupplierItemLookupDataService',
						filter: function (item) {
							if (item && item.PlantSupplierFk) {
								return item.PlantSupplierFk;
							}
						}
					});
					break;
				case 'settlementfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.logisticssettlement');
					break;
				case 'settlementitemfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.logisticssettlement');
					break;
				case 'claimreasonfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.logisticsclaimreason','');
					break;
				case 'expectedworkoperationtypefk':
					ovl = resourceWotLookupConfigGenerator.provideWotLookupOverloadFilteredByPlant(true);
					break;
				case 'expecteduomfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideUoMReadOnlyLookupSpecification());
					break;
				case 'claimstatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.logisticsclaimstatus');
					break;
				case 'claimmethodfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.logisticsclaimmethod');
					break;
				case 'clerkownerfk':
					ovl = platformLayoutHelperService.provideClerkLookupOverload();
					break;
				case 'clerkresponsiblefk':
					ovl = platformLayoutHelperService.provideClerkLookupOverload();
					break;
				case 'companyresponsiblefk': ovl = {
					 grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-company-company-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'company',
							displayMember: 'Code'
						},
						width: 140
					},
					 detail: {
						 type: 'directive',
						 directive: 'basics-lookupdata-lookup-composite',
						 model: 'CompanyResponsibleFk',
						 options: {
							lookupDirective: 'basics-company-company-lookup',
							descriptionMember: 'CompanyName'
						},
						 change: 'formOptions.onPropertyChanged'
					}
				};	break;
			}

			return ovl;
		};
	}

})(angular);
