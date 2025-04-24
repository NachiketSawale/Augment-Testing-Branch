(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var modName = 'procurement.invoice',
		cloudCommonModule = 'cloud.common',
		procurementCommon = 'procurement.common',
		controllingStructureModule = 'controlling.structure',
		basicsCommonModule = 'basics.common';

	angular.module(modName).factory('procurementInvoiceLayout',
		['$injector', 'basicsLookupdataConfigGenerator', 'platformLayoutHelperService', function ($injector, basicsLookupdataConfigGenerator, platformLayoutHelperService) {

			var detailReconciliationColumns = [
					['reconciliationTitle', 'amount1', 'cloud.common.entityAmount', 'AmountNet', 'AmountNetReconciliation',
						'AmountVatReconciliation', 'AmountGrossReconciliation'],
					['amount1', 'fromPES', 'procurement.invoice.header.fromPES', 'AmountNetPes', 'AmountNetPes',
						'AmountVatPes', 'AmountGrossPes'],
					['fromPES', 'fromContract', 'procurement.invoice.header.fromContract', 'AmountNetContract',
						'AmountNetContract', 'AmountVatContract', 'AmountGrossContract'],
					['fromContract', 'fromOther', 'procurement.invoice.header.fromOther', 'AmountNetOther',
						'AmountNetOther', 'AmountVatOther', 'AmountGrossOther'],
					['fromOther', 'fromBillingSchemaNet', 'procurement.invoice.header.fromBillingSchema',
						'FromBillingSchemaNet', 'FromBillingSchemaNet', 'FromBillingSchemaVat', 'FromBillingSchemaGross'],
					['fromBillingSchemaNet', 'rejection', 'procurement.invoice.header.rejections', 'AmountNetReject', 'AmountNetReject', 'AmountVatReject', 'AmountGrossReject'],
					['rejection', 'balance', 'procurement.invoice.header.balance', 'AmountNetBalance', 'AmountNetBalance', 'AmountVatBalance', 'AmountGrossBalance']
				],
				detailReconciliationOcColumns = [
					['reconciliationTitleOc', 'amount1Oc', 'cloud.common.entityAmount', 'AmountNetOc',
						'AmountNetOcReconciliation', 'AmountVatOcReconciliation', 'AmountGrossOcReconciliation'],
					['amount1Oc', 'fromPESOc', 'procurement.invoice.header.fromPES', 'AmountNetPesOc',
						'AmountNetPesOc', 'AmountVatPesOc', 'AmountGrossPesOc'],
					['fromPESOc', 'fromContractOc', 'procurement.invoice.header.fromContract', 'AmountNetContractOc',
						'AmountNetContractOc', 'AmountVatContractOc', 'AmountGrossContractOc'],
					['fromContractOc', 'fromOtherOc', 'procurement.invoice.header.fromOther', 'AmountNetOtherOc',
						'AmountNetOtherOc', 'AmountVatOtherOc', 'AmountGrossOtherOc'],
					['fromOtherOc', 'fromBillingSchemaOc', 'procurement.invoice.header.fromBillingSchema', 'FromBillingSchemaNetOc',
						'FromBillingSchemaNetOc', 'FromBillingSchemaVatOc', 'FromBillingSchemaGrossOc'],
					['fromBillingSchemaOc', 'rejectionOc', 'procurement.invoice.header.rejections', 'AmountNetRejectOc',
						'AmountNetRejectOc', 'AmountVatRejectOc', 'AmountGrossRejectOc'],
					['rejectionOc', 'balanceOc', 'procurement.invoice.header.balance', 'AmountNetBalanceOc',
						'AmountNetBalanceOc', 'AmountVatBalanceOc', 'AmountGrossBalanceOc']
				];

			// todo: pass a obj into
			/* jshint -W072 */ // really need so many parameters
			function generateReconciliationRow(afterId, rid, label, model, netField, vatField, grossField) {
				return {
					afterId: afterId,
					'rid': rid,
					'gid': 'reconciliation',
					'type': 'directive',
					'directive': 'platform-composite-input',
					'label$tr$': label,
					'model': model,
					'options': {
						'rows': [
							{
								readonly: true,
								'type': 'money',
								'model': netField,
								'cssLayout': 'invoice-composite xs-4 sm-4 md-4 lg-4'
							},
							{
								readonly: true,
								'type': 'money',
								'model': vatField,
								'cssLayout': 'invoice-composite xs-4 sm-4 md-4 lg-4'
							},
							{
								readonly: true,
								'type': 'money',
								'model': grossField,
								'cssLayout': 'invoice-composite xs-4 sm-4 md-4 lg-4'
							}]
					}
				};
			}

			function generateDetailReconciliationConfig() {
				var config = [],
					i = 0;
				for (; i < detailReconciliationColumns.length; i++) {
					config.push(generateReconciliationRow.apply(null, detailReconciliationColumns[i]));
				}
				return config;
			}

			// todo: pass a obj into
			/* jshint -W072 */ // really need so many parameters
			function generateReconciliationOcRow(afterId, rid, label, model, netField, vatField, grossField) {
				return {
					afterId: afterId,
					'rid': rid,
					'gid': 'reconciliationOc',
					'type': 'directive',
					'directive': 'platform-composite-input',
					'label$tr$': label,
					'model': model,
					'options': {
						'rows': [
							{
								readonly: true,
								'type': 'money',
								'model': netField,
								'cssLayout': 'invoice-composite xs-4 sm-4 md-4 lg-4'
							},
							{
								readonly: true,
								'type': 'money',
								'model': vatField,
								'cssLayout': 'invoice-composite xs-4 sm-4 md-4 lg-4'
							},
							{
								readonly: true,
								'type': 'money',
								'model': grossField,
								'cssLayout': 'invoice-composite xs-4 sm-4 md-4 lg-4'
							}]
					}
				};
			}

			function generateDetailReconciliationOcConfig() {
				var config = [],
					i = 0;
				for (; i < detailReconciliationOcColumns.length; i++) {
					config.push(generateReconciliationOcRow.apply(null, detailReconciliationOcColumns[i]));
				}
				return config;
			}

			var config = {
				'fid': 'procurement.invoice.detail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['id', 'invstatusfk', 'code', 'prcconfigurationfk', 'progressid', 'description', 'invtypefk','companyiccreditorfk','bilheadericfk',
							'billingschemafk', 'companydeferaltypefk', 'datedeferalstart', 'bankfk', 'documentno', 'salestaxmethodfk', 'rejectionremark']
					},
					{
						'gid': 'businessPartner',
						'attributes': ['businesspartnerfk','contactfk', 'subsidiaryfk', 'supplierfk', 'dateinvoiced',
							'reference', 'datereceived', 'dateposted', 'datedelivered', 'datedeliveredfrom', 'referencestructured', 'bpdbanktypefk','businesspostinggroupfk'
						]
					},
					{
						'gid': 'amount',
						'attributes': ['currencyfk', 'amountgross', 'amountnet', 'exchangerate',
							'amountgrossoc', 'amountnetoc', 'taxcodefk', 'bpdvatgroupfk', 'frombillingschemafinaltotal', 'frombillingschemafinaltotaloc'
						]
					},
					{
						'gid': 'workflow',
						'attributes': ['invgroupfk', 'clerkprcfk', 'clerkreqfk', 'clerkwfefk']
					},
					{
						'gid': 'allocation',
						'attributes': ['projectfk', 'projectstatusfk', 'prcpackagefk',
							'prcstructurefk', 'controllingunitfk', 'reconcilationhint', 'pesheaderfk',
							'conheaderfk', 'totalperformednet', 'totalperformedgross',
							'userdefinedmoney01', 'userdefinedmoney02', 'userdefinedmoney03', 'userdefinedmoney04', 'userdefinedmoney05',
							'userdefineddate01', 'userdefineddate02', 'userdefineddate03']
					},
					{
						'gid': 'paymentTerms',
						'attributes': ['paymenttermfk', 'datediscount', 'amountdiscountbasis', 'amountdiscountbasisoc',
							'amountdiscount', 'amountdiscountoc', 'datenetpayable', 'paymenthint', 'percentdiscount', 'frompaymenttotalpayment', 'frompaymenttotalpaymentdiscount', 'baspaymentmethodfk']
					},
					{
						'gid': 'reconciliation',
						'attributes': []
					},
					{
						'gid': 'reconciliationOc',
						'attributes': []
					},
					{
						'gid': 'other',
						'attributes': ['remark', 'userdefined1', 'userdefined2',
							'userdefined3', 'userdefined4', 'userdefined5']
					}, {
						'gid': 'AccountAssignment',
						'attributes': ['basaccassignbusinessfk', 'basaccassigncontrolfk', 'basaccassignaccountfk', 'basaccassigncontypefk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [modName, 'basics.clerk', procurementCommon, basicsCommonModule, cloudCommonModule,controllingStructureModule,'procurement.contract','businesspartner.main'],
					'extraWords': {
						moduleName: {
							location: modName,
							identifier: 'moduleName',
							initial: 'Invoice'
						},
						businessPartner: {
							location: cloudCommonModule,
							identifier: 'entityBusinessPartner',
							initial: 'Business Partner'
						},
						amount: {location: modName, identifier: 'group.amount', initial: 'Amount'},
						allocation: {location: modName, identifier: 'group.allocation', initial: 'Allocation'},
						workflow: {location: modName, identifier: 'group.workflow', initial: 'Workflow'},
						paymentTerms: {location: modName, identifier: 'group.paymentTerms', initial: 'Payment Terms'},
						reconciliation: {
							location: modName,
							identifier: 'group.reconciliation',
							initial: 'Reconciliation'
						},
						reconciliationOc: {
							location: modName,
							identifier: 'group.reconciliationOc',
							initial: 'Reconciliation(OC)'
						},
						other: {location: modName, identifier: 'group.other', initial: 'Other'},
						InvStatusFk: {location: modName, identifier: 'header.invStatusFk', initial: 'InvStatusFk'},
						Code: {location: modName, identifier: 'header.code', initial: 'Entry No'},
						CompanyDeferalTypeFk: {location: modName, identifier: 'header.deferraltype', initial: 'Deferral Type'},
						CompanyIcCreditorFk: {location: modName, identifier: 'iCCompanySupplier', initial: 'IC Company Supplier'},
						BilHeaderIcFk: {location: modName, identifier: 'iCBillNo', initial: 'IC Bill No'},
						RubricCategoryFk: {
							location: modName,
							identifier: 'header.rubricCategory',
							initial: 'Rubric Category'
						},
						PrcConfigurationFk: {
							location: modName,
							identifier: 'header.configuration',
							initial: 'Configuration'
						},
						ProgressId: {location: modName, identifier: 'header.progressid', initial: 'Progressid'},
						Description: {location: modName, identifier: 'header.description', initial: 'Narrative'},
						InvTypeFk: {location: cloudCommonModule, identifier: 'entityType', initial: 'Type'},
						BillingSchemaFk: {
							location: cloudCommonModule,
							identifier: 'entityBillingSchema',
							initial: 'Billing Schema'
						},
						BusinessPartnerFk: {
							location: modName,
							identifier: 'header.entityBusinessPartner',
							initial: 'Business Partner'
						},
						ContactFk: {
							location: 'procurement.contract',
							identifier: 'ConHeaderContact',
							initial: 'Contact'
						},
						SubsidiaryFk: {
							location: cloudCommonModule,
							identifier: 'entitySubsidiary',
							initial: 'Subsidiary'
						},
						SupplierFk: {location: cloudCommonModule, identifier: 'entitySupplier', initial: 'Supplier'},
						DateInvoiced: {location: modName, identifier: 'header.dateInvoiced', initial: 'Date'},
						Reference: {location: modName, identifier: 'header.reference', initial: 'Reference'},
						DateReceived: {location: modName, identifier: 'header.dateReceived', initial: 'Received'},
						DatePosted: {location: modName, identifier: 'header.datePosted', initial: 'Posting Date'},
						CurrencyFk: {location: cloudCommonModule, identifier: 'entityCurrency', initial: 'Currency'},
						AmountGross: {location: modName, identifier: 'header.amountGross', initial: 'Amount(Gross)'},
						AmountNet: {location: modName, identifier: 'header.amountNet', initial: 'Amount(Net)'},
						ExchangeRate: {'location': cloudCommonModule, 'identifier': 'entityRate', 'initial': 'Rate'},
						AmountGrossOc: {
							'location': modName,
							'identifier': 'header.amountGrossOC',
							'initial': 'Amount(Gross OC)'
						},
						AmountNetOc: {
							'location': modName,
							'identifier': 'header.amountNetOC',
							'initial': 'Amount(Net OC)'
						},
						TaxCodeFk: {
							'location': cloudCommonModule,
							'identifier': 'entityTaxCode',
							'initial': 'Tax Code'
						},
						InvGroupFk: {location: cloudCommonModule, identifier: 'entityGroup', initial: 'Group'},
						ClerkPrcFk: {
							location: cloudCommonModule,
							identifier: 'entityResponsible',
							initial: 'Responsible'
						},
						ClerkReqFk: {
							location: modName,
							identifier: 'header.requisitionOwner',
							initial: 'Requisition Owner'
						},
						ClerkWfeFk: {
							location: modName,
							identifier: 'header.currentResponsible',
							initial: 'Current Responsible'
						},
						ProjectFk: {location: cloudCommonModule, identifier: 'entityProjectNo', initial: 'Project No.'},
						ProjectStatusFk: {
							'location': procurementCommon,
							'identifier': 'projectStatus',
							'initial': 'Project Status'
						},
						PrcPackageFk: {
							'location': cloudCommonModule,
							'identifier': 'entityPackage',
							'initial': 'Package'
						},
						PrcStructureFk: {
							location: basicsCommonModule,
							identifier: 'entityPrcStructureFk',
							initial: 'Procurement Structure'
						},
						ControllingUnitFk: {
							location: cloudCommonModule,
							identifier: 'entityControllingUnit',
							initial: 'Controlling Unit'
						},
						ReconcilationHint: {
							location: modName,
							identifier: 'header.reconcilationHint',
							initial: 'Hint'
						},
						PesHeaderFk: {
							location: modName,
							identifier: 'header.pes',
							initial: 'PES'
						},
						ConHeaderFk: {
							location: modName,
							identifier: 'header.contract',
							initial: 'Contract'
						},
						ContractTotal: {
							location: modName,
							identifier: 'header.contractTotal',
							initial: 'Contract Total'
						},
						ContractChangeOrder: {
							location: modName,
							identifier: 'header.contractChangeOrder',
							initial: 'Contract Change Order'
						},
						TotalPerformedNet: {
							location: modName,
							identifier: 'header.totalPerformedNet',
							initial: 'Total Performed Net'
						},
						TotalPerformedGross: {
							location: modName,
							identifier: 'header.totalPerformedGross',
							initial: 'Total Performed Gross'
						},
						PaymentTermFk: {
							location: modName,
							identifier: 'header.paymentTerm',
							initial: 'Payment Term'
						},
						DateDiscount: {
							location: modName,
							identifier: 'header.discountDate',
							initial: 'Discount Date'
						},
						AmountDiscountBasis: {
							location: modName,
							identifier: 'header.discountBasis',
							initial: 'Discount Basis'
						},
						AmountDiscountBasisOc: {
							location: modName,
							identifier: 'header.discountBasisOc',
							initial: 'Discount Basis(OC)'
						},
						AmountDiscount: {
							location: modName,
							identifier: 'header.discountAmount',
							initial: 'Discount Amount'
						},
						AmountDiscountOc: {
							location: modName,
							identifier: 'header.discountAmountOc',
							initial: 'Discount Amount(OC)'
						},
						DateNetPayable: {
							location: modName,
							identifier: 'header.netPayable',
							initial: 'Net Payable'
						},
						PaymentHint: {
							location: modName,
							identifier: 'header.paymentHint',
							initial: 'Payment Hint'
						},
						PercentDiscount: {
							location: modName,
							identifier: 'header.percentDiscount',
							initial: 'Payment Discount'
						},
						'Remark': {
							location: cloudCommonModule,
							identifier: 'entityRemark',
							initial: 'Remark'
						},
						'Userdefined1': {
							location: cloudCommonModule,
							identifier: 'entityUserDefined',
							initial: 'entityUserDefined',
							param: {'p_0': '1'}
						},
						'Userdefined2': {
							location: cloudCommonModule,
							identifier: 'entityUserDefined',
							initial: 'entityUserDefined',
							param: {'p_0': '2'}
						},
						'Userdefined3': {
							location: cloudCommonModule,
							identifier: 'entityUserDefined',
							initial: 'entityUserDefined',
							param: {'p_0': '3'}
						},
						'Userdefined4': {
							location: cloudCommonModule,
							identifier: 'entityUserDefined',
							initial: 'entityUserDefined',
							param: {'p_0': '4'}
						},
						'Userdefined5': {
							location: cloudCommonModule,
							identifier: 'entityUserDefined',
							initial: 'entityUserDefined',
							param: {'p_0': '5'}
						},
						'UserDefinedMoney01': {
							location: cloudCommonModule,
							identifier: 'entityUserDefinedMoney',
							initial: 'entityUserDefinedMoney',
							param: {'p_0': '1'}
						},
						'UserDefinedMoney02': {
							location: cloudCommonModule,
							identifier: 'entityUserDefinedMoney',
							initial: 'entityUserDefinedMoney',
							param: {'p_0': '2'}
						},
						'UserDefinedMoney03': {
							location: cloudCommonModule,
							identifier: 'entityUserDefinedMoney',
							initial: 'entityUserDefinedMoney',
							param: {'p_0': '3'}
						},
						'UserDefinedMoney04': {
							location: cloudCommonModule,
							identifier: 'entityUserDefinedMoney',
							initial: 'entityUserDefinedMoney',
							param: {'p_0': '4'}
						},
						'UserDefinedMoney05': {
							location: cloudCommonModule,
							identifier: 'entityUserDefinedMoney',
							initial: 'entityUserDefinedMoney',
							param: {'p_0': '5'}
						},
						'UserDefinedDate01': {
							location: cloudCommonModule,
							identifier: 'entityUserDefinedDate',
							initial: 'entityUserDefinedDate',
							param: {'p_0': '1'}
						},
						'UserDefinedDate02': {
							location: cloudCommonModule,
							identifier: 'entityUserDefinedDate',
							initial: 'entityUserDefinedDate',
							param: {'p_0': '2'}
						},
						'UserDefinedDate03': {
							location: cloudCommonModule,
							identifier: 'entityUserDefinedDate',
							initial: 'entityUserDefinedDate',
							param: {'p_0': '3'}
						},
						'DateDelivered': {
							location: modName,
							identifier: 'header.dateDelivered',
							initial: 'Date Delivered'
						},
						'DateDeliveredFrom': {
							location: modName,
							identifier: 'header.dateDeliveredFrom',
							initial: 'Date Delivered From'
						},
						'ReferenceStructured': {
							location: modName,
							identifier: 'header.referenceStructured',
							initial: 'Reference Structured'
						},
						'FromBillingSchemaFinalTotal': {
							location: modName,
							identifier: 'header.fromBillingSchemaFinalTotal',
							initial: 'From Billing Schema(Final Total)'
						},
						'FromBillingSchemaFinalTotalOc': {
							location: modName,
							identifier: 'header.fromBillingSchemaFinalTotalOc',
							initial: 'From Billing Schema(Final Total OC)'
						},
						'FromPaymentTotalPayment': {
							location: modName,
							identifier: 'header.fromPaymentTotalPayment',
							initial: 'Total Payment'
						},
						'FromPaymentTotalPaymentDiscount': {
							location: modName,
							identifier: 'header.fromPaymentTotalPaymentDiscount',
							initial: 'Total Payment Discount'
						},
						'DateDeferalStart': {
							location: modName,
							identifier: 'header.dateDeferralStart',
							initial: 'Date Deferral Start'
						},
						'BpdVatGroupFk': {
							location: procurementCommon,
							identifier: 'entityVatGroup',
							initial: 'Vat Group'
						},
						'BasPaymentMethodFk': {
							location: modName,
							identifier: 'header.paymentMethodEntity',
							initial: 'Payment Method'
						},
						'BpdBankTypeFk': {
							location: modName,
							identifier: 'header.bankType',
							initial: 'Bank Type'
						},
						BusinessPostingGroupFk: {
							location: 'businesspartner.main',
							identifier: 'businessPostingGroup',
							initial: 'Business Posting Group'
						},
						'BankFk': {
							location: cloudCommonModule,
							identifier: 'entityBankName',
							initial: 'Bank'
						},
						'AccountAssignment': {location: procurementCommon, identifier: 'accassign.AccountAssignment', initial: 'Account Assignment'},
						'BasAccassignBusinessFk': {location: procurementCommon, identifier: 'accassign.BusinessArea', initial: 'Business Area'},
						'BasAccassignControlFk': {location: procurementCommon, identifier: 'accassign.ControllingArea', initial: 'Controlling Area'},
						'BasAccassignAccountFk': {location: procurementCommon, identifier: 'accassign.AccountingArea', initial: 'Accounting Area'},
						'BasAccassignConTypeFk': {location: procurementCommon, identifier: 'accassign.ContractType', initial: 'Contract Type'},
						'DocumentNo': {location: modName, identifier: 'entityDocumentNo', initial: 'Document No.'},
						'SalesTaxMethodFk': {location: procurementCommon, identifier: 'entitySalesTaxMethodFk', initial: 'Sales Tax Method'},
						'RejectionRemark': {location: modName, identifier: 'accassign.RejectionRemark', initial: 'Rejection Remark'},
					}
				},
				'overloads': {
					'id': {
						'readonly': true
					},
					'referencestructured': {
						'grid': {
							editor: 'directive',
							editorOptions: {
								directive: 'invoice-reference-structured-input'
							},
							formatter: 'description'
						},
						'detail': {
							'type': 'directive',
							'directive': 'invoice-reference-structured-input',
							'model': 'ReferenceStructured'
						}
					},
					'invstatusfk': {
						readonly: true,
						'detail': {
							'type': 'directive',
							'directive': 'procurement-invoice-status-lookup',
							'options': {
								imageSelector: 'platformStatusIconService'
							}
						},
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'InvStatus',
								displayMember: 'DescriptionInfo.Translated',
								imageSelector: 'platformStatusIconService'
							}
						}
					},
					'code': {
						'mandatory': true,
						detail: {
							label: 'Entry No',
							label$tr$: 'procurement.invoice.header.code'
						},
						grid: {
							name: 'Entry No',
							name$tr$: 'procurement.invoice.header.code'
						}
					},
					'description': {
						detail: {
							label: 'Narrative',
							label$tr$: 'procurement.invoice.header.description'
						},
						grid: {
							name: 'Narrative',
							name$tr$: 'procurement.invoice.header.description'
						}
					},
					/* 'rubriccategoryfk': {
                     'detail': {
                     'type': 'directive',
                     'directive': 'basics-lookupdata-rubric-category-combo-box',
                     'options': {
                     'filterKey': 'prc-invoice-rubric-category-filter'
                     }
                     },
                     'grid': {
                     editor: 'lookup',
                     editorOptions: {
                     lookupOptions: {
                     filterKey: 'prc-invoice-rubric-category-filter'
                     },
                     lookupDirective: 'basics-lookupdata-rubric-category-combo-box'
                     },
                     formatter: 'lookup',
                     formatterOptions: {
                     lookupType: 'rubriccategory',
                     displayMember: 'Description'
                     }
                     }
                     }, */
					'companydeferaltypefk': {
						detail: {
							'type': 'directive',
							'directive': 'basics-company-deferaltype-lookup',
							'options': {
								filterKey: 'deferal-type-filter'
							}
						},
						grid: {
							editor: 'lookup',
							'editorOptions': {
								'directive': 'basics-company-deferaltype-lookup',
								'lookupOptions': {
									'filterKey': 'deferal-type-filter'
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'companydeferaltype',
								displayMember: 'DescriptionInfo.Description'
							},
							'width': 150
						}
					},
					'companyiccreditorfk': {
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
							options: {
								lookupDirective: 'basics-company-company-lookup',
								descriptionMember: 'CompanyName',
								lookupOptions: {}
							}
						},
						readonly: true
					},
					'bilheadericfk': {
						'readonly': 'true',
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'sales-common-bill-dialog'
							},
							width: 125,
							formatter: 'lookup',
							'formatterOptions': {
								'lookupType': 'SalesBilling',
								'displayMember': 'BillNo'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'sales-common-bill-dialog',
								'descriptionMember': 'DescriptionInfo.Translated'
							}
						}
					},
					'prcconfigurationfk': {
						detail: {
							'type': 'directive',
							'directive': 'basics-configuration-configuration-combobox',
							'options': {
								filterKey: 'prc-invoice-configuration-filter'
							}
						},
						grid: {
							'editorOptions': {
								'directive': 'basics-configuration-configuration-combobox',
								'lookupOptions': {
									'filterKey': 'prc-invoice-configuration-filter'
								}
							},
							'formatterOptions': {
								'lookupType': 'prcConfiguration',
								'displayMember': 'DescriptionInfo.Translated'
							},
							'width': 150
						}
					},
					'invtypefk': {
						'detail': {
							'type': 'directive',
							'directive': 'procurement-invoice-type-lookup',
							'options': {
								filterKey: 'prc-invoice-invType-filter'
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'procurement-invoice-type-lookup',
								'lookupOptions': {
									'filterKey': 'prc-invoice-invType-filter'
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'InvType',
								displayMember: 'DescriptionInfo.Translated'
							},
							width: 100
						}
					},
					'billingschemafk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'procurement-configuration-billing-schema-combobox',
								'lookupOptions': {
									'filterKey': 'prc-invoice-billing-schema-filter'
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'PrcConfig2BSchema',
								'displayMember': 'DescriptionInfo.Translated'
							},
							name$tr$: 'cloud.common.entityBillingSchema',
							'width': 80
						},
						'detail': {
							'label$tr$': 'cloud.common.entityBillingSchema',
							'type': 'directive',
							'directive': 'procurement-configuration-billing-schema-Combobox',
							'options': {
								filterKey: 'prc-invoice-billing-schema-filter'
							}
						}
					},
					'businesspartnerfk': {
						navigator: {
							moduleName: 'businesspartner.main'
						},
						'detail': {
							'type': 'directive',
							// 'directive': 'business-partner-main-business-partner-dialog',
							'directive': 'filter-business-partner-dialog-lookup',
							'options': {
								filterKey: 'prc-invoice-business-partner-filter',
								'IsShowBranch': true,
								'mainService': 'procurementInvoiceHeaderDataService',
								'validationService': 'invoiceHeaderElementValidationService',
								'BusinessPartnerField': 'BusinesspartnerFk',
								'SubsidiaryField': 'SubsidiaryFk',
								'SupplierField': 'SupplierFk',
								'ContactField': 'ContactFk',
								'PaymentMethodField': 'BasPaymentMethodFk'
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								// 'directive': 'business-partner-main-business-partner-dialog',
								'directive': 'filter-business-partner-dialog-lookup',
								lookupOptions: {
									filterKey: 'prc-invoice-business-partner-filter',
									'IsShowBranch': true,
									'mainService': 'procurementInvoiceHeaderDataService',
									'validationService': 'invoiceHeaderElementValidationService',
									'BusinessPartnerField': 'BusinesspartnerFk',
									'SubsidiaryField': 'SubsidiaryFk',
									'SupplierField': 'SupplierFk',
									'ContactField': 'ContactFk',
									'PaymentMethodField': 'BasPaymentMethodFk'
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'BusinessPartner',
								displayMember: 'BusinessPartnerName1'
							},
							width: 130
						}
					},
					'contactfk': {
						mandatory: true,
						navigator: {
							moduleName: 'businesspartner.contact'
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'business-partner-main-contact-dialog',
								'lookupOptions': {'filterKey': 'prc-con-contact-filter', 'showClearButton': true}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'Contact', 'displayMember': 'FullName'},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'business-partner-main-contact-dialog',
							'options': {
								'filterKey': 'prc-con-contact-filter', 'showClearButton': true
							}
						}
					},
					'subsidiaryfk': {
						'detail': {
							'type': 'directive',
							'directive': 'business-partner-main-subsidiary-lookup',
							'options': {
								filterKey: 'prc-invoice-subsidiary-filter',
								showClearButton: true,
								displayMember: 'AddressLine'
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-subsidiary-lookup',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'prc-invoice-subsidiary-filter',
									displayMember: 'AddressLine'
								}
							},
							width: 200,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'subsidiary',
								displayMember: 'AddressLine'
							}
						}
					},
					'supplierfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'business-partner-main-supplier-lookup',
								descriptionMember: 'Description',
								lookupOptions: {
									filterKey: 'prc-invoice-supplier-filter',
									showClearButton: true
								}
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-supplier-lookup',
								lookupOptions: {
									filterKey: 'prc-invoice-supplier-filter',
									showClearButton: true
								}
							},
							width: 125,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'supplier',
								displayMember: 'Code'
							}
						}
					},
					'currencyfk': {
						grid: {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'prc-Common-Basics-Currency-Lookup',
								'displayMember': 'Currency',
								'lookupOptions': {
									'filterKey': 'bas-currency-conversion-filter'
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'BasCurrency',
								'displayMember': 'Currency'
							},
							'width': 100
						},
						detail: {
							'type': 'directive',
							'directive': 'prc-Common-Basics-Currency-Lookup',
							'options': {
								'lookupType': 'BasCurrency',
								'filterKey': 'bas-currency-conversion-filter'
							}
						}
					},
					'dateinvoiced': {
						'mandatory': true
					},
					'taxcodefk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'basics-master-data-context-tax-code-lookup',
								descriptionMember: 'DescriptionInfo.Translated'
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-master-data-context-tax-code-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'TaxCode',
								displayMember: 'Code'
							},
							width: 100
						}
					},
					// 'invgroupfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('procurement.invoice.invgroup'),
					'invgroupfk': {
						'detail': {
							'type': 'directive',
							'directive': 'invoice-group-lookup',
							'options': {
								showClearButton: false
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'invoice-group-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'InvGroup',
								displayMember: 'DescriptionInfo.Translated'
							}
						}
					},
					'clerkprcfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true
								}
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'cloud-clerk-clerk-dialog',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Clerk',
								displayMember: 'Code'
							},
							width: 145
						}
					},
					'clerkreqfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true
								}
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'cloud-clerk-clerk-dialog',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Clerk',
								displayMember: 'Code'
							},
							width: 145
						}
					},
					'clerkwfefk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true
								}
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'cloud-clerk-clerk-dialog',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Clerk',
								displayMember: 'Code'
							},
							width: 145
						}
					},
					'projectfk': platformLayoutHelperService.provideProjectLookupOverload('prc-invoice-header-project-filter'),
					'projectstatusfk': {
						'readonly': true,
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								'displayMember': 'Description',
								'imageSelector': 'platformStatusIconService',
								'lookupModuleQualifier': 'project.main.status',
								'lookupSimpleLookup': true,
								'valueMember': 'Id'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': ' basics-lookupdata-simple ',
							'options': {
								'lookupType': 'project.main.status',
								'eagerLoad': true,
								'valueMember': 'Id',
								'displayMember': 'Description',
								'filter': {showIcon: true},
								'imageSelector': 'platformStatusIconService',
								'lookupModuleQualifier': 'project.main.status'
							}
						}
					},
					'prcpackagefk': {
						navigator: {
							moduleName: 'procurement.package',
							registerService: 'procurementPackageDataService'
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'procurement-common-package-lookup',
								'lookupOptions': {'filterKey': 'prc-invoice-package-filter', 'showClearButton': true}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'PrcPackage', 'displayMember': 'Code'},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'procurement-common-package-lookup',
								'descriptionMember': 'Description',
								'lookupOptions': {'showClearButton': true, 'filterKey': 'prc-invoice-package-filter'}
							}
						}
					},
					'prcstructurefk': {
						navigator: {
							moduleName: 'basics.procurementstructure'
							// registerService: 'basicsProcurementStructureService'
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								// lookupDirective: 'basics-procurementstructure-structure-dialog',
								lookupDirective: 'procurement-invoice-prc-structure-dialog',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									showClearButton: true
								}
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true
								},
								directive: 'procurement-invoice-prc-structure-dialog'
								// directive: 'basics-procurementstructure-structure-dialog'
							},
							width: 150,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Prcstructure',
								displayMember: 'Code'
							}
						}
					},
					/*
                    'progressid':{
                     'grid': {
                       formatter: 'money'
                      },
                     'detail': {
                       'type': 'money'
                     }
                     }, */
					'pesheaderfk': {
						navigator: {
							moduleName: 'procurement.pes'
						},
						'detail': {
							'label$tr$': 'procurement.invoice.header.pes',
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'procurement-invoice-pes-lookup',
								descriptionMember: 'Description',
								'lookupOptions': {
									'filterKey': 'prc-invoice-pes-header-filter',
									'showClearButton': true
								}
							}
						},
						'grid': {
							name$tr$: 'procurement.invoice.header.pes',
							editor: 'lookup',
							editorOptions: {
								directive: 'procurement-invoice-pes-lookup',
								'lookupOptions': {
									'filterKey': 'prc-invoice-pes-header-filter',
									'showClearButton': true
								}
							},
							width: 150,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'InvoicePes',
								displayMember: 'Code',
								navigator: {
									moduleName: 'procurement.pes'
								}
							}
						}
					},
					'conheaderfk': {
						navigator: {
							moduleName: 'procurement.contract',
							registerService: 'procurementContractHeaderDataService'
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'prc-con-header-dialog',
								'lookupOptions': {
									'filterKey': 'prc-invoice-con-header-filter',
									'showClearButton': true,
									'title': {name: 'cloud.common.dialogTitleContract'}
								}
							},
							width: 150,
							formatter: 'lookup',
							'formatterOptions': {
								lookupType: 'ConHeaderView',
								displayMember: 'Code',
								navigator: {
									moduleName: 'procurement.contract',
									registerService: 'procurementContractHeaderDataService'
								}
							}
						},
						'detail': {
							// 'id':'conheadertest',
							// 'rid':'conheadertest',
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'prc-con-header-dialog',
								descriptionMember: 'Description',
								'lookupOptions': {
									'filterKey': 'prc-invoice-con-header-filter',
									'showClearButton': true,
									'title': {name: 'cloud.common.dialogTitleContract'}
								}
							}
						}
					},
					'controllingunitfk': {
						navigator: {
							moduleName: 'controlling.structure'
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								// 'directive': 'basics-master-data-context-controlling-unit-lookup',
								'lookupDirective': 'controlling-structure-dialog-lookup',
								'lookupOptions': {
									'filterKey': 'prc-con-controlling-by-prj-filter',
									'showClearButton': true,
									considerPlanningElement: true,
									selectableCallback: function (dataItem) {
										var headerService = $injector.get('procurementInvoiceHeaderDataService');
										return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, headerService);
									}
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'ControllingUnit', 'displayMember': 'Code'
							},
							'width': 80
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								// 'lookupDirective': 'basics-master-data-context-controlling-unit-lookup',
								'lookupDirective': 'controlling-structure-dialog-lookup',
								'descriptionMember': 'DescriptionInfo.Translated',
								'lookupOptions': {
									'filterKey': 'prc-con-controlling-by-prj-filter',
									'showClearButton': true,
									considerPlanningElement: true,
									selectableCallback: function (dataItem) {
										var headerService = $injector.get('procurementInvoiceHeaderDataService');
										return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, headerService);
									}
								}
							}
						}
					},
					'paymenttermfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'basics-lookupdata-payment-term-lookup',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true
								}
							}
						},
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PaymentTerm',
								displayMember: 'Code'
							},
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {showClearButton: true},
								directive: 'basics-lookupdata-payment-term-lookup'
							},
							width: 150
						}
					},
					'paymenthint': {
						'detail': {
							'type': 'directive',
							'directive': 'qto-limit-input',
							'options': {
								validKeys: {
									regular: '^[A-Za-z]{0,3}$'
								}
							},
							'validator': 'validatePaymentHint'
						},
						'grid': {
							formatter: 'description',
							editor: 'directive',
							editorOptions: {
								directive: 'qto-limit-input',
								validKeys: {
									regular: '^[A-Za-z]{0,3}$'
								}
							},
							'validator': 'validatePaymentHint',
							width: 120
						}
					},
					'exchangerate': {
						'grid': {
							'editor': 'directive',
							'editorOptions': {
								'directive': 'procurement-common-exchangerate-input'
							},
							'formatter': 'exchangerate'
						},
						'detail': {
							'type': 'directive',
							'directive': 'procurement-common-exchangerate-input'
						}
					},
					'frombillingschemafinaltotal': {readonly: true},
					'frombillingschemafinaltotaloc': {readonly: true},
					'frompaymenttotalpayment': {readonly: true},
					'frompaymenttotalpaymentdiscount': {readonly: true},
					'bpdvatgroupfk': {
						detail: {
							'type': 'directive',
							'directive': 'business-partner-vat-group-lookup',
							'options': {
								showClearButton: true,
								displayMember: 'DescriptionInfo.Translated'
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-vat-group-lookup',
								lookupOptions: {
									displayMember: 'DescriptionInfo.Translated',
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								displayMember: 'DescriptionInfo.Translated',
								lookupType: 'VatGroup'
							}
						}
					},
					'baspaymentmethodfk': {
						detail: basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.lookup.paymentmethod', null, null, false, {}),
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-lookupdata-simple',
								lookupOptions: {
									displayMember: 'Description',
									lookupModuleQualifier: 'basics.lookup.paymentmethod',
									lookupType: 'basics.lookup.paymentmethod',
									showClearButton: true,
									valueMember: 'Id'
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								displayMember: 'Description',
								lookupModuleQualifier: 'basics.lookup.paymentmethod',
								lookupType: 'basics.lookup.paymentmethod',
								lookupSimpleLookup: true,
								valueMember: 'Id'
							}
						}
					},
					'bpdbanktypefk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.banktype', 'Description'),
					'businesspostinggroupfk': {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-business-posting-group-combobox',
								lookupOptions: {
									filterKey: 'invoice-company-businesspostinggroup-filter'
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								displayMember: 'DescriptionInfo.Translated',
								lookupType: 'BusinessPostingGroup'
							}
						},
						detail: {
							type: 'directive',
							directive: 'business-partner-business-posting-group-combobox',
							options: {
								filterKey: 'invoice-company-businesspostinggroup-filter'
							}
						}
					},
					bankfk: {
						'detail': {
							'type': 'directive',
							'directive': 'business-partner-main-bank-lookup',
							'options': {
								filterKey: 'prc-invoice-bank-filter',
								displayMember: 'IbanNameOrBicAccountName'
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-bank-lookup',
								lookupOptions: {
									filterKey: 'prc-invoice-bank-filter',
									displayMember: 'IbanNameOrBicAccountName'
								}
							},
							width: 200,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'businesspartner.main.bank',
								displayMember: 'IbanNameOrBicAccountName'
							}
						}
					},
					'basaccassignbusinessfk': basicsLookupdataConfigGenerator.provideElaboratedLookupConfig('prc-common-accassign-business-lookup', 'BasAccassignBusiness', 'Code'),
					'basaccassigncontrolfk': basicsLookupdataConfigGenerator.provideElaboratedLookupConfig('prc-common-accassign-control-lookup', 'BasAccassignControl', 'Code'),
					'basaccassignaccountfk': basicsLookupdataConfigGenerator.provideElaboratedLookupConfig('prc-common-accassign-account-lookup', 'BasAccassignAccount', 'Code'),
					'basaccassigncontypefk': basicsLookupdataConfigGenerator.provideElaboratedLookupConfig('prc-common-accassign-contract-type-lookup', 'BasAccassignConType', 'Code'),
					'documentno': {readonly: true},
					'salestaxmethodfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.salestaxmethod', 'Description'),
				},
				'addition': {
					grid: [
						{
							lookupDisplayColumn: true,
							field: 'SupplierFk',
							name$tr$: 'cloud.common.entitySupplierDescription',
							width: 125
						},
						{
							'lookupDisplayColumn': true,
							'field': 'TaxCodeFk',
							'displayMember': 'DescriptionInfo.Translated',
							'name$tr$': 'cloud.common.entityTaxCodeDescription',
							'width': 150
						},
						{
							sortable: true,
							lookupDisplayColumn: true,
							field: 'ClerkPrcFk',
							name$tr$: 'cloud.common.entityResponsibleDescription',
							width: 145
						},
						{
							sortable: true,
							lookupDisplayColumn: true,
							field: 'ClerkReqFk',
							name$tr$: 'procurement.invoice.header.reqOwnerDes',
							width: 145
						},
						{
							sortable: true,
							lookupDisplayColumn: true,
							field: 'ClerkWfeFk',
							name$tr$: 'procurement.invoice.header.curResponsibleDes',
							width: 145
						},
						{
							lookupDisplayColumn: true,
							field: 'PrcPackageFk',
							name$tr$: 'cloud.common.entityPackageDescription',
							width: 145
						},
						{
							lookupDisplayColumn: true,
							field: 'PrcStructureFk',
							name$tr$: 'cloud.common.entityStructureDescription',
							displayMember: 'DescriptionInfo.Translated',
							width: 145
						},
						{
							'lookupDisplayColumn': true,
							'field': 'ControllingUnitFk',
							'displayMember': 'DescriptionInfo.Translated',
							'name$tr$': 'cloud.common.entityControllingUnitDesc',
							'width': 150
						},
						{
							'lookupDisplayColumn': true,
							'field': 'PesHeaderFk',
							'name$tr$': 'procurement.invoice.header.pesHeaderDes',
							'width': 180
						},
						{
							'lookupDisplayColumn': true,
							'field': 'ConHeaderFk',
							'id': 'conHeaderFk',
							'name$tr$': 'procurement.invoice.header.conHeaderDes',
							'width': 180
						},
						{
							id: 'contractTotal',
							afterId: 'conHeaderFk',
							formatter: 'money',
							readonly: true,
							'field': 'ContractTotal',
							'name$tr$': 'procurement.invoice.header.contractTotal',
							'width': 180
						},
						{

							id: 'contractChangeOrder',
							afterId: 'contractTotal',
							formatter: 'money',
							readonly: true,
							'field': 'ContractChangeOrder',
							'name$tr$': 'procurement.invoice.header.contractChangeOrder',
							'width': 180
						},
						{

							id: 'contractTotalInvoice',
							formatter: 'money',
							readonly: true,
							'field': 'Invoiced',
							'name$tr$': 'procurement.invoice.header.ContractTotalInvoice',
							'width': 180
						},
						{

							id: 'contractInvoicePercent',
							formatter: 'description',
							readonly: true,
							'field': 'Percent',
							'name$tr$': 'procurement.invoice.header.ContractTotalPercent',
							'width': 180
						},
						{
							id: 'contractTotalGross',
							afterId: 'contractInvoicePercent',
							formatter: 'money',
							readonly: true,
							'field': 'ContractTotalGross',
							'name$tr$': 'procurement.invoice.header.contractTotalGross',
							'width': 180
						},
						{

							id: 'contractChangeOrderGross',
							afterId: 'contractTotalGross',
							formatter: 'money',
							readonly: true,
							'field': 'ContractChangeOrderGross',
							'name$tr$': 'procurement.invoice.header.contractChangeOrder',
							'width': 180
						},
						{

							id: 'InvoicedGross',
							formatter: 'money',
							readonly: true,
							'field': 'InvoicedGross',
							'name$tr$': 'procurement.invoice.header.invoicedGross',
							'width': 180
						},
						{

							id: 'contractInvoiceGrossPercent',
							formatter: 'description',
							readonly: true,
							'field': 'GrossPercent',
							'name$tr$': 'procurement.invoice.header.contractTotalGrossPercent',
							'width': 180
						},
						{

							id: 'contractOrderDate',
							formatter: 'date',
							readonly: true,
							'field': 'ContractOrderDate',
							'name$tr$': 'procurement.invoice.header.contractOrderDate',
							'width': 180
						},
						{

							id: 'contractStatus',
							formatter: 'lookup',
							'formatterOptions': {
								lookupType: 'ConStatus',
								displayMember: 'DescriptionInfo.Translated'
							},
							readonly: true,
							'field': 'ConStatusFk',
							'name$tr$': 'procurement.invoice.header.contractStatus',
							'width': 180
						},
						{
							'lookupDisplayColumn': true,
							'field': 'PaymentTermFk',
							'name$tr$': 'procurement.invoice.header.paymentTermDes',
							'width': 180
						},
						{
							afterId: 'datenetpayable',
							id: 'amountNetPes',
							formatter: 'money',
							readonly: true,
							'field': 'AmountNetPes',
							'name$tr$': 'procurement.invoice.header.amountNetPES',
							'width': 180
						},
						{
							afterId: 'amountNetPes',
							id: 'amountVatPes',
							formatter: 'money',
							readonly: true,
							'field': 'AmountVatPes',
							'name$tr$': 'procurement.invoice.header.amountVatPES',
							'width': 180
						},
						{
							afterId: 'amountVatPes',
							id: 'amountGrossPes',
							formatter: 'money',
							readonly: true,
							'field': 'AmountGrossPes',
							'name$tr$': 'procurement.invoice.header.amountGrossPES',
							'width': 180
						},
						{
							afterId: 'amountGrossPes',
							id: 'amountNetPesOc',
							formatter: 'money',
							readonly: true,
							'field': 'AmountNetPesOc',
							'name$tr$': 'procurement.invoice.header.amountNetPESOc',
							'width': 180
						},
						{
							afterId: 'amountNetPesOc',
							id: 'amountVatPesOc',
							formatter: 'money',
							readonly: true,
							'field': 'AmountVatPesOc',
							'name$tr$': 'procurement.invoice.header.amountVatPESOc',
							'width': 180
						},
						{
							afterId: 'amountVatPesOc',
							id: 'amountGrossPesOc',
							formatter: 'money',
							readonly: true,
							'field': 'AmountGrossPesOc',
							'name$tr$': 'procurement.invoice.header.amountGrossPESOc',
							'width': 180
						},
						{
							afterId: 'amountGrossPesOc',
							id: 'amountNetContract',
							formatter: 'money',
							readonly: true,
							'field': 'AmountNetContract',
							'name$tr$': 'procurement.invoice.header.amountNetContract',
							'width': 180
						},
						{
							afterId: 'amountNetContract',
							id: 'amountVatContract',
							formatter: 'money',
							readonly: true,
							'field': 'AmountVatContract',
							'name$tr$': 'procurement.invoice.header.amountVatContract',
							'width': 180
						},
						{
							afterId: 'amountVatContract',
							id: 'amountGrossContract',
							formatter: 'money',
							readonly: true,
							'field': 'AmountGrossContract',
							'name$tr$': 'procurement.invoice.header.amountGrossContract',
							'width': 180
						},
						{
							afterId: 'amountGrossContract',
							id: 'amountNetContractOc',
							formatter: 'money',
							readonly: true,
							'field': 'AmountNetContractOc',
							'name$tr$': 'procurement.invoice.header.amountNetContractOc',
							'width': 180
						},
						{
							afterId: 'amountNetContractOc',
							id: 'amountVatContractOc',
							formatter: 'money',
							readonly: true,
							'field': 'AmountVatContractOc',
							'name$tr$': 'procurement.invoice.header.amountVatContractOc',
							'width': 180
						},
						{
							afterId: 'amountVatContractOc',
							id: 'amountGrossContractOc',
							formatter: 'money',
							readonly: true,
							'field': 'AmountGrossContractOc',
							'name$tr$': 'procurement.invoice.header.amountGrossContractOc',
							'width': 180
						},
						{
							afterId: 'amountGrossContractOc',
							id: 'amountNetOther',
							formatter: 'money',
							readonly: true,
							'field': 'AmountNetOther',
							'name$tr$': 'procurement.invoice.header.amountNetOther',
							'width': 180
						},
						{
							afterId: 'amountNetOther',
							id: 'amountVatOther',
							formatter: 'money',
							readonly: true,
							'field': 'AmountVatOther',
							'name$tr$': 'procurement.invoice.header.amountVatOther',
							'width': 180
						},
						{
							afterId: 'amountVatOther',
							id: 'amountGrossOther',
							formatter: 'money',
							readonly: true,
							'field': 'AmountGrossOther',
							'name$tr$': 'procurement.invoice.header.amountGrossOther',
							'width': 180
						},
						{
							afterId: 'amountGrossOther',
							id: 'amountNetOtherOc',
							formatter: 'money',
							readonly: true,
							'field': 'AmountNetOtherOc',
							'name$tr$': 'procurement.invoice.header.amountNetOtherOc',
							'width': 180
						},
						{
							afterId: 'amountNetOtherOc',
							id: 'amountVatOtherOc',
							formatter: 'money',
							readonly: true,
							'field': 'AmountVatOtherOc',
							'name$tr$': 'procurement.invoice.header.amountVatOtherOc',
							'width': 180
						},
						{
							afterId: 'amountVatOtherOc',
							id: 'amountGrossOtherOc',
							formatter: 'money',
							readonly: true,
							'field': 'AmountGrossOtherOc',
							'name$tr$': 'procurement.invoice.header.amountGrossOtherOc',
							'width': 180
						},
						{
							afterId: 'amountGrossOtherOc',
							id: 'fromBillingSchemaNet',
							formatter: 'money',
							readonly: true,
							'field': 'FromBillingSchemaNet',
							'name$tr$': 'procurement.invoice.header.fromBillingSchemaNet',
							'width': 180
						},
						{
							afterId: 'amountNetReject',
							id: 'fromBillingSchemaVat',
							formatter: 'money',
							readonly: true,
							'field': 'FromBillingSchemaVat',
							'name$tr$': 'procurement.invoice.header.fromBillingSchemaVat',
							'width': 180
						},
						{
							afterId: 'fromBillingSchemaVat',
							id: 'fromBillingSchemaGross',
							formatter: 'money',
							readonly: true,
							'field': 'FromBillingSchemaGross',
							'name$tr$': 'procurement.invoice.header.fromBillingSchemaGross',
							'width': 180
						},
						{
							afterId: 'fromBillingSchemaGross',
							id: 'fromBillingSchemaNetOc',
							formatter: 'money',
							readonly: true,
							'field': 'FromBillingSchemaNetOc',
							'name$tr$': 'procurement.invoice.header.fromBillingSchemaNetOc',
							'width': 180
						},
						{
							afterId: 'fromBillingSchemaNetOc',
							id: 'fromBillingSchemaVatOc',
							formatter: 'money',
							readonly: true,
							'field': 'FromBillingSchemaVatOc',
							'name$tr$': 'procurement.invoice.header.fromBillingSchemaVatOc',
							'width': 180
						},
						{
							afterId: 'fromBillingSchemaVatOc',
							id: 'fromBillingSchemaGrossOc',
							formatter: 'money',
							readonly: true,
							'field': 'FromBillingSchemaGrossOc',
							'name$tr$': 'procurement.invoice.header.fromBillingSchemaGrossOc',
							'width': 180
						},
						{
							afterId: 'fromBillingSchemaGrossOc',
							id: 'amountNetReject',
							formatter: 'money',
							readonly: true,
							'field': 'AmountNetReject',
							'name$tr$': 'procurement.invoice.header.amountNetReject',
							'width': 180
						},
						{
							afterId: 'amountNetReject',
							id: 'amountVatReject',
							formatter: 'money',
							readonly: true,
							'field': 'AmountVatReject',
							'name$tr$': 'procurement.invoice.header.amountVatReject',
							'width': 180
						},
						{
							afterId: 'amountVatReject',
							id: 'amountGrossReject',
							formatter: 'money',
							readonly: true,
							'field': 'AmountGrossReject',
							'name$tr$': 'procurement.invoice.header.amountGrossReject',
							'width': 180
						},
						{
							afterId: 'amountGrossReject',
							id: 'amountNetRejectOc',
							formatter: 'money',
							readonly: true,
							'field': 'AmountNetRejectOc',
							'name$tr$': 'procurement.invoice.header.amountNetRejectOc',
							'width': 180
						},
						{
							afterId: 'amountNetRejectOc',
							id: 'amountVatRejectOc',
							formatter: 'money',
							readonly: true,
							'field': 'AmountVatRejectOc',
							'name$tr$': 'procurement.invoice.header.amountVatRejectOc',
							'width': 180
						},
						{
							afterId: 'amountVatRejectOc',
							id: 'amountGrossRejectOc',
							formatter: 'money',
							readonly: true,
							'field': 'AmountGrossRejectOc',
							'name$tr$': 'procurement.invoice.header.amountGrossRejectOc',
							'width': 180
						},
						{
							afterId: 'amountGrossRejectOc',
							id: 'amountNetBalance',
							formatter: 'money',
							readonly: true,
							'field': 'AmountNetBalance',
							'name$tr$': 'procurement.invoice.header.amountNetBalance',
							'width': 180
						},
						{
							afterId: 'amountNetBalance',
							id: 'amountVatBalance',
							formatter: 'money',
							readonly: true,
							'field': 'AmountVatBalance',
							'name$tr$': 'procurement.invoice.header.amountVatBalance',
							'width': 180
						},
						{
							afterId: 'amountVatBalance',
							id: 'amountGrossBalance',
							formatter: 'money',
							readonly: true,
							'field': 'AmountGrossBalance',
							'name$tr$': 'procurement.invoice.header.amountGrossBalance',
							'width': 180
						},
						{
							afterId: 'amountGrossBalance',
							id: 'amountNetBalanceOc',
							formatter: 'money',
							readonly: true,
							'field': 'AmountNetBalanceOc',
							'name$tr$': 'procurement.invoice.header.amountNetBalanceOc',
							'width': 180
						},
						{
							afterId: 'amountNetBalanceOc',
							id: 'amountVatBalanceOc',
							formatter: 'money',
							readonly: true,
							'field': 'AmountVatBalanceOc',
							'name$tr$': 'procurement.invoice.header.amountVatBalanceOc',
							'width': 180
						},
						{
							afterId: 'amountVatBalanceOc',
							id: 'amountGrossBalanceOc',
							formatter: 'money',
							readonly: true,
							'field': 'AmountGrossBalanceOc',
							'name$tr$': 'procurement.invoice.header.amountGrossBalanceOc',
							'width': 180
						},
						{
							id: 'SupplierStatus',
							field: 'SupplierFk',
							name: 'Supplier Status',
							name$tr$: 'procurement.invoice.header.supplierStatus',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Supplier',
								displayMember: 'SupplierStatusDescriptionInfo.Translated',
								imageSelector: 'platformStatusIconService'
							},
							width: 125,
							readOnly: true
						},
						{
							id: 'BusinessPartnerStatus',
							field: 'BusinessPartnerFk',
							name: 'BusinessPartner Status',
							name$tr$: 'procurement.invoice.header.businessPartnerStatus',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'BusinessPartner',
								displayMember: 'StatusDescriptionTranslateInfo.Translated',
								imageSelector: 'platformStatusIconService'
							},
							width: 125,
							readOnly: true
						}, {
							readOnly: true,
							width: 150,
							formatter: 'lookup',
							id: 'CallOffMainContractFk',
							field: 'CallOffMainContractFk',
							name: 'Call Offs Main Contract',
							name$tr$: 'procurement.common.callOffMainContract',
							formatterOptions: {
								lookupType: 'ConHeaderView',
								displayMember: 'Code'
							},
							navigator: {
								moduleName: 'procurement.contract',
								registerService: 'procurementContractHeaderDataService'
							}
						}, {
							id: 'CallOffMainContractDes',
							formatter: 'text',
							field: 'CallOffMainContractDes',
							name: 'Call Offs Main Contract Description',
							name$tr$: 'procurement.common.callOffMainContractDes',
							width: 150
						}, {
							lookupDisplayColumn: true,
							field: 'PrcPackageFk',
							displayMember: 'TextInfo',
							name$tr$: 'procurement.common.entityPackageTextInfo',
							width: 125
						}, {
							'lookupDisplayColumn': true,
							'id': 'CompanyIcCreditorName',
							'field': 'CompanyIcCreditorFk',
							'displayMember': 'CompanyName',
							'name$tr$': 'procurement.invoice.iCCompanySupplierName',
							'width': 150
						}
					],
					detail: [
						{
							gid: 'businessPartner',
							rid: 'BusinessPartnerFk',
							afterId: 'businesspartnerfk',
							model: 'BusinessPartnerFk',
							type: 'directive',
							label: 'Business Partner Status',
							label$tr$: 'procurement.invoice.header.businessPartnerStatus',
							directive: 'business-partner-main-business-partner-dialog-without-teams',
							options: {
								readOnly: true,
								lookupType: 'BusinessPartner',
								displayMember: 'StatusDescriptionTranslateInfo.Translated',
								imageSelector: 'platformStatusIconService'
							},
							readOnly: true
						},
						{
							gid: 'businessPartner',
							rid: 'SupplierFk',
							afterId: 'supplierfk',
							model: 'SupplierFk',
							type: 'directive',
							label: 'Supplier Status',
							sortOrder: 2,
							label$tr$: 'procurement.invoice.header.supplierStatus',
							directive: 'business-partner-main-supplier-lookup',
							options: {
								readOnly: true,
								lookupType: 'Supplier',
								displayMember: 'SupplierStatusDescriptionInfo.Translated',
								imageSelector: 'platformStatusIconService'
							},
							readOnly: true
						},
						{
							'gid': 'allocation',
							'rid': 'contractCo',
							sortOrder: 8,
							'afterId': 'conheaderfk',
							'label': 'Contract Total/Co',
							'label$tr$': 'procurement.invoice.header.contractTotalOc',
							'model': 'ContractTotalCo',
							'type': 'directive',
							'directive': 'platform-composite-input',
							'options': {
								'rows': [{
									'type': 'money',
									'model': 'ContractTotal',
									readonly: true,
									'cssLayout': 'xs-6 sm-6 md-6 lg-6'
								}, {
									'type': 'money',
									'model': 'ContractChangeOrder',
									readonly: true,
									'cssLayout': 'xs-6 sm-6 md-6 lg-6',
									'validate': false
								}]
							}
						},
						{
							'gid': 'allocation',
							'rid': 'contractInvoice',
							sortOrder: 8,
							'afterId': 'contractCo',
							'label': 'Contract Total/Invoiced/%',
							'label$tr$': 'procurement.invoice.header.contractTotalInvoicePercent',
							'model': 'ContractTotalInvoice',
							'type': 'directive',
							'directive': 'platform-composite-input',
							'options': {
								'rows': [{
									'type': 'money',
									'model': 'ContractTotal',
									readonly: true,
									'directive': 'procurement-invoice-label-in-form-row',
									'cssLayout': 'xs-4 sm-4 md-4 lg-4'
								}, {
									'type': 'money',
									'model': 'Invoiced',
									readonly: true,
									'directive': 'procurement-invoice-label-in-form-row',
									'cssLayout': 'xs-4 sm-4 md-4 lg-4'
								}, {
									'type': 'description',
									'model': 'Percent',
									readonly: true,
									'directive': 'procurement-invoice-label-in-form-row',
									'cssLayout': 'xs-4 sm-4 md-4 lg-4'
								}]
							}
						},
						{
							'gid': 'allocation',
							'rid': 'contractGrossCo',
							sortOrder: 8,
							'afterId': 'contractInvoice',
							'label': 'Contract Gross/Co Gross',
							'label$tr$': 'procurement.invoice.header.contractTotalGrossOc',
							'model': 'ContractTotalGrossCo',
							'type': 'directive',
							'directive': 'platform-composite-input',
							'options': {
								'rows': [{
									'type': 'money',
									'model': 'ContractTotalGross',
									readonly: true,
									'cssLayout': 'xs-6 sm-6 md-6 lg-6'
								}, {
									'type': 'money',
									'model': 'ContractChangeOrderGross',
									readonly: true,
									'cssLayout': 'xs-6 sm-6 md-6 lg-6',
									'validate': false
								}]
							}
						},
						{
							'gid': 'allocation',
							'rid': 'contractInvoiceGross',
							sortOrder: 8,
							'afterId': 'contractGrossCo',
							'label': 'Contract Gross/Invoiced Gross/%',
							'label$tr$': 'procurement.invoice.header.contractTotalInvoiceGrossPercent',
							'model': 'ContractTotalInvoiceGross',
							'type': 'directive',
							'directive': 'platform-composite-input',
							'options': {
								'rows': [{
									'type': 'money',
									'model': 'ContractTotalGross',
									readonly: true,
									'directive': 'procurement-invoice-label-in-form-row',
									'cssLayout': 'xs-4 sm-4 md-4 lg-4'
								}, {
									'type': 'money',
									'model': 'InvoicedGross',
									readonly: true,
									'directive': 'procurement-invoice-label-in-form-row',
									'cssLayout': 'xs-4 sm-4 md-4 lg-4'
								}, {
									'type': 'description',
									'model': 'GrossPercent',
									readonly: true,
									'directive': 'procurement-invoice-label-in-form-row',
									'cssLayout': 'xs-4 sm-4 md-4 lg-4'
								}]
							}
						},
						{
							'gid': 'allocation',
							'rid': 'contracttotal',
							sortOrder: 8,
							'afterId': 'contractInvoiceGross',
							'label': 'Contract from/Status',
							'label$tr$': 'procurement.invoice.header.orderDateStatus',
							'model': 'orderDateStatus',
							'type': 'directive',
							readonly: true,
							'directive': 'platform-composite-input',
							'options': {
								'rows': [{
									'type': 'date',
									'model': 'ContractOrderDate',
									readonly: true,
									'cssLayout': 'xs-6 sm-6 md-6 lg-6'
								}, {
									'type': 'directive',
									'directive': 'procurement-invoice-contract-status-combobox',
									readonly: true,
									'formatter': 'lookup',
									'formatterOptions': {
										lookupType: 'ConStatus',
										displayMember: 'DescriptionInfo.Translated'
									},
									'model': 'ConStatusFk',
									'cssLayout': 'xs-6 sm-6 md-6 lg-6'
								}]
							}
						},
						{
							'rid': 'reconciliationTitle',
							'gid': 'reconciliation',
							'type': 'directive',
							'directive': 'platform-composite-input',
							'label': ' ',
							'model': 'AmountNet',
							'options': {
								'rows': [{
									'type': 'directive',
									'directive': 'procurement-invoice-label-in-form-row',
									'cssLayout': 'xs-4 sm-4 md-4 lg-4',
									'options': {label: 'procurement.invoice.entityNet'}
								}, {
									'type': 'directive',
									'directive': 'procurement-invoice-label-in-form-row',
									'cssLayout': 'xs-4 sm-4 md-4 lg-4',
									'options': {label: 'procurement.invoice.entityVAT'}
								}, {
									'type': 'directive',
									'directive': 'procurement-invoice-label-in-form-row',
									'cssLayout': 'xs-4 sm-4 md-4 lg-4',
									'options': {label: 'procurement.invoice.entityGross'}
								}]
							}
						},
						{
							'rid': 'reconciliationTitleOc',
							'gid': 'reconciliationOc',
							'type': 'directive',
							'directive': 'platform-composite-input',
							'label': ' ',
							'model': 'AmountNetOc',
							'options': {
								'rows': [{
									'type': 'directive',
									'directive': 'procurement-invoice-label-in-form-row',
									'cssLayout': 'xs-4 sm-4 md-4 lg-4',
									'options': {label: 'procurement.invoice.entityNetOc'}
								}, {
									'type': 'directive',
									'directive': 'procurement-invoice-label-in-form-row',
									'cssLayout': 'xs-4 sm-4 md-4 lg-4',
									'options': {label: 'procurement.invoice.entityVATOc'}
								}, {
									'type': 'directive',
									'directive': 'procurement-invoice-label-in-form-row',
									'cssLayout': 'xs-4 sm-4 md-4 lg-4',
									'options': {label: 'procurement.invoice.entityGrossOc'}
								}]
							}
						},
						{
							'gid': 'allocation',
							'rid': 'callOffMainContract',
							'afterId': 'conHeaderFk',
							'label': 'Call Offs Main Contract',
							'label$tr$': 'procurement.common.callOffMainContract',
							'model': 'CallOffMainContractFk',
							'type': 'directive',
							'directive': 'platform-composite-input',
							'navigator': {
								moduleName: 'procurement.contract',
								registerService: 'procurementContractHeaderDataService'
							},
							'options': {
								'rows': [{
									'type': 'code',
									'model': 'CallOffMainContract',
									readonly: true,
									'cssLayout': 'xs-4 sm-4 md-4 lg-4'
								}, {
									'type': 'description',
									'model': 'CallOffMainContractDes',
									readonly: true,
									'cssLayout': 'xs-8 sm-8 md-8 lg-8',
									'validate': false
								}]
							}
						}, {
							'afterId': 'PrcPackageFk',
							'gid': 'allocation',
							'rid': 'TextInfo',
							'label': 'Package Text Info',
							'label$tr$': 'procurement.common.entityPackageTextInfo',
							'model': 'PrcPackageFk',
							'type': 'directive',
							'directive': 'procurement-common-package-lookup',
							'readonly': true,
							'options': {
								'displayMember': 'TextInfo'
							}
						}
					]
				}
			};

			config.addition.detail = config.addition.detail.concat(generateDetailReconciliationConfig());

			config.addition.detail = config.addition.detail.concat(generateDetailReconciliationOcConfig());

			var basicsClerkFormatService = $injector.get('basicsClerkFormatService');
			config.overloads.clerkreqfk.grid.formatter = basicsClerkFormatService.formatClerk;
			config.overloads.clerkprcfk.grid.formatter = basicsClerkFormatService.formatClerk;
			config.overloads.clerkwfefk.grid.formatter = basicsClerkFormatService.formatClerk;
			return config;
		}]);

	angular.module(modName).factory('procurementInvoiceUIStandardService',
		['platformUIStandardConfigService', 'procurementInvoiceTranslationService',
			'procurementInvoiceLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'InvHeaderDto',
					moduleSubModule: 'Procurement.Invoice'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;
				const entityInformation = { module: angular.module( 'procurement.invoice'), moduleName: 'Procurement.Invoice', entity: 'InvHeader' };
				var service = new BaseService(layout, domainSchema, translationService,entityInformation);

				platformUIStandardExtentService.extend(service, layout.addition, domainSchema);

				return service;
			}
		]);
	// businesspartnerCertificateActualCertificateListController
	angular.module(modName).factory('procurementInvoiceCertificateActualUIStandardService',
		['businesspartnerCertificateCertificateContainerServiceFactory', 'platformSchemaService', 'platformUIStandardConfigService', 'procurementInvoiceHeaderDataService',
			'procurementInvoiceTranslationService', 'businesspartnerCertificateToContractLayout',
			function (serviceFactory, platformSchemaService, UIStandardConfigService, parentService, translationService, certificateToContractLayout) {

				// certificate ui standard service
				var domains = platformSchemaService.getSchemaFromCache({
					typeName: 'CertificateDto',
					moduleSubModule: 'BusinessPartner.Certificate'
				}).properties;

				return new UIStandardConfigService(certificateToContractLayout, domains, translationService);
			}]);
})();
