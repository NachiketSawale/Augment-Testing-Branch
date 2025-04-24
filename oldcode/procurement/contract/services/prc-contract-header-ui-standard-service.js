/**
 * Created by lnb on 4/14/2015.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	var modName = 'procurement.contract',
		prcCommonModule = 'procurement.common',
		prcPackageModule = 'procurement.package',
		cloudCommonModule = 'cloud.common',
		prcConfigModule = 'basics.procurementconfiguration',
		mod = angular.module(modName);

	mod.factory('procurementContractHeaderLayout', ['$injector', 'basicsLookupdataConfigGenerator', 'procurementContractHeaderDataService', 'basicsCommonComplexFormatter', '$translate', 'platformGridDomainService', 'platformLayoutHelperService', 'cloudDesktopNavigationPermissionService','basicsLookupdataLookupDescriptorService',
		function ($injector, basicsLookupdataConfigGenerator, procurementContractHeaderDataService, basicsCommonComplexFormatter, $translate, platformGridDomainService, platformLayoutHelperService, navigationPermissionService, basicsLookupdataLookupDescriptorService) {

			function getChangeOrderLookupOptions() {
				return {
					showClearButton: true,
					createOptions: {
						typeOptions: {
							isProcurement: true,
							isChangeOrder: true
						},
						handleCreateSuccessAsync: function ($injector, createItem, entity) {
							var $q = $injector.get('$q');

							var configLookup = null;
							var lookupTarget = null;
							if (entity.PrcHeaderEntity && entity.PrcHeaderEntity.ConfigurationFk) {
								var configLookupSet = basicsLookupdataLookupDescriptorService.getData('prcConfiguration');
								if (configLookupSet && configLookupSet[entity.PrcHeaderEntity.ConfigurationFk]) {
									configLookup = configLookupSet[entity.PrcHeaderEntity.ConfigurationFk];
									var headerLookupSet = basicsLookupdataLookupDescriptorService.getData('prcconfigheader');
									if (headerLookupSet) {
										lookupTarget = headerLookupSet[configLookup.PrcConfigHeaderFk];
									}
								}
							}
							if (createItem) {
								entity.ProjectChangeFk = createItem.Id;
								entity.ProjectChangeCode = createItem.Code;
								entity.ProjectChangeDescription = createItem.Description;
								procurementContractHeaderDataService.markCurrentItemAsModified();
							}
							if (configLookup) {
								if (lookupTarget) {
									if (lookupTarget.IsChangeFromMainContract) {
										createItem.ContractHeaderFk = entity.ContractHeaderFk;
									}
									return $q.when(true);
								} else {
									return $injector.get('basicsLookupdataLookupDataService').getItemByKey('prcconfigheader', configLookup.PrcConfigHeaderFk).then(function (lookupTarget) {
										if (lookupTarget.IsChangeFromMainContract) {
											createItem.ContractHeaderFk = entity.ContractHeaderFk;
										}
										return true;
									});
								}
							}
							return $q.when(true);
						}
					},
					filterOptions: {
						serverKey: 'project-change-lookup-for-contract-filter',
						serverSide: true,
						fn: function (dataContext) {
							return {
								ProjectFk: dataContext.ProjectFk,
								PrcHeaderConfigurationFk: dataContext.PrcHeaderEntity ? dataContext.PrcHeaderEntity.ConfigurationFk : null,
								ContractHeaderFk: dataContext.ContractHeaderFk,
								IsProcurement: true,
								IsChangeOrder: true
							};
						}
					},
					IsChangeOrder: true
				};
			}

			var config;
			config = {
				'fid': 'contract.header.detail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'change': 'change',
				'translationInfos': {
					'extraModules': [modName, prcCommonModule, prcConfigModule, 'boq.main',
						'basics.material', 'procurement.ticketsystem', 'basics.common', prcPackageModule
					],
					'extraWords': {
						'moduleName': {
							'location': 'procurement.contract',
							'identifier': 'moduleName',
							'initial': 'Contract'
						},
						'HeaderGroupHeader': {
							'location': cloudCommonModule,
							'identifier': 'entityProperties',
							'initial': 'Basic Data'
						},
						'HeaderGroupDesiredSupplier': {
							'location': modName,
							'identifier': 'HeaderGroupDesiredSupplier',
							// 'initial': 'Suggested Suppliers'
							'initial': 'Contractor'
						},
						'HeaderGroupOther': {
							'location': modName,
							'identifier': 'HeaderGroupOther',
							'initial': 'Others'
						},
						'HeaderGroupInformation': {
							'location': modName,
							'identifier': 'HeaderGroupInformation',
							'initial': 'Information'
						},
						'HeaderGroupPenality': {
							'location': modName,
							'identifier': 'HeaderGroupPenality',
							'initial': 'Penality'
						},
						'PurchaseOrders': {
							'location': modName,
							'identifier': 'purchaseOrders.entityPurchaseOrders',
							'initial': 'Purchase Orders'
						},
						'Code': {
							'location': cloudCommonModule,
							'identifier': 'entityReferenceCode',
							'initial': 'Reference Code'
						},
						'ConStatusFk': {
							'location': cloudCommonModule,
							'identifier': 'entityStatus',
							'initial': 'Status'
						},
						'ProjectFk': {
							'location': cloudCommonModule,
							'identifier': 'entityProjectNo',
							'initial': 'Project No'
						},
						'ProjectStatusFk': {
							'location': prcCommonModule,
							'identifier': 'projectStatus',
							'initial': 'Project Status'
						},
						'PackageFk': {
							'location': cloudCommonModule,
							'identifier': 'entityPackageCode',
							'initial': 'entityPackageCode'
						},
						'ReqHeaderFk': {
							'location': modName,
							'identifier': 'entityReqHeader',
							'initial': 'Requisition'
						},
						'TaxCodeFk': {
							'location': cloudCommonModule,
							'identifier': 'entityTaxCode',
							'initial': 'entityTaxCode'
						},
						'ClerkPrcFk': {
							'location': modName,
							'identifier': 'ConHeaderProcurementOwnerCode',
							'initial': 'Procurement Owner'
						},
						'ClerkReqFk': {
							'location': modName,
							'identifier': 'ConHeaderRequisitionOwnerCode',
							'initial': 'Requisition Owner'
						},
						'BasCurrencyFk': {
							'location': cloudCommonModule,
							'identifier': 'entityCurrency',
							'initial': 'Currency'
						},
						'ExchangeRate': {
							'location': cloudCommonModule,
							'identifier': 'entityRate',
							'initial': 'Exchange Rate'
						},
						'ProjectChangeFk': {
							'location': modName,
							'identifier': 'entityChangeOrder',
							'initial': 'Change Order'
						},
						'ContractHeaderFk': {
							'location': modName,
							'identifier': 'ConHeaderBasisContract',
							'initial': 'Basis Contract'
						},
						'MaterialCatalogFk': {
							'location': modName,
							'identifier': 'conFrameworkMaterialCatalog',
							'initial': 'Framework Material Catalog'
						},
						'PaymentTermFiFk': {
							'location': cloudCommonModule,
							'identifier': 'entityPaymentTermFI',
							'initial': 'entityPaymentTermFI'
						},
						'PaymentTermPaFk': {
							'location': cloudCommonModule,
							'identifier': 'entityPaymentTermPA',
							'initial': 'entityPaymentTermPA'
						},
						'PaymentTermAdFk': {
							'location': cloudCommonModule,
							'identifier': 'entityPaymentTermAD',
							'initial': 'Payment Term (AD)'
						},
						'DateOrdered': {
							'location': modName,
							'identifier': 'ConHeaderDateOrdered',
							'initial': 'ConHeaderDateOrdered'
						},
						'DateReported': {
							'location': modName,
							'identifier': 'ConHeaderDateReported',
							'initial': 'ConHeaderDateReported'
						},
						'DateCanceled': {
							'location': modName,
							'identifier': 'ConHeaderDateCancelled',
							'initial': 'ConHeaderDateCancelled'
						},
						'DateDelivery': {
							'location': modName,
							'identifier': 'ConHeaderDateDelivery',
							'initial': 'ConHeaderDateDelivery'
						},
						'DateCallofffrom': {
							'location': modName,
							'identifier': 'ConHeaderDateCallOffFrom',
							'initial': 'ConHeaderDateCallOffFrom'
						},
						'DateCalloffto': {
							'location': modName,
							'identifier': 'ConHeaderDateCallOffTo',
							'initial': 'ConHeaderDateCallOffTo'
						},
						'ConTypeFk': {
							'location': cloudCommonModule,
							'identifier': 'entityType',
							'initial': 'entityType'
						},
						'AwardmethodFk': {
							'location': cloudCommonModule,
							'identifier': 'entityAwardMethod',
							'initial': 'entityAwardMethod'
						},
						'ContracttypeFk': {
							'location': modName,
							'identifier': 'ConHeaderContractType',
							'initial': 'ConHeaderContractType'
						},
						'ControllingUnitFk': {
							'location': cloudCommonModule,
							'identifier': 'entityControllingUnitCode',
							'initial': 'entityControllingUnitCode'
						},
						'BillingSchemaFk': {
							location: cloudCommonModule,
							identifier: 'entityBillingSchema',
							initial: 'Billing Schema'
						},
						'BusinessPartnerFk': {
							'location': cloudCommonModule,
							'identifier': 'entityBusinessPartner',
							'initial': 'entityBusinessPartner'
						},
						'SubsidiaryFk': {
							'location': cloudCommonModule,
							'identifier': 'entitySubsidiary',
							'initial': 'entitySubsidiary'
						},
						'SupplierFk': {
							'location': cloudCommonModule,
							'identifier': 'entitySupplierCode',
							'initial': 'entitySupplierCode'
						},
						'ContactFk': {
							'location': modName,
							'identifier': 'ConHeaderContact',
							'initial': 'Contact'
						},
						'BusinessPartner2Fk': {
							'location': cloudCommonModule,
							'identifier': 'entityBusinessPartner2',
							'initial': 'entityBusinessPartner2'
						},
						'Subsidiary2Fk': {
							'location': cloudCommonModule,
							'identifier': 'entitySubsidiary2',
							'initial': 'entitySubsidiary2'
						},
						'Supplier2Fk': {
							'location': cloudCommonModule,
							'identifier': 'entitySupplier2Code',
							'initial': 'entitySupplier2Code'
						},
						'Contact2Fk': {
							'location': modName,
							'identifier': 'ConHeaderContact2',
							'initial': 'Contact2'
						},
						'BusinessPartnerAgentFk': {
							'location': cloudCommonModule,
							'identifier': 'entityBusinessPartnerAgent',
							'initial': 'entityBusinessPartnerAgent'
						},
						'IncotermFk': {
							'location': cloudCommonModule,
							'identifier': 'entityIncoterms',
							'initial': 'entityIncoterms'
						},
						'CompanyInvoiceFk': {
							'location': modName,
							'identifier': 'ConHeaderCompanyInvoicedCode',
							'initial': 'ConHeaderCompanyInvoicedCode'
						},
						'AddressEntity': {
							'location': cloudCommonModule,
							'identifier': 'entityDeliveryAddress',
							'initial': 'entityDeliveryAddress'
						},
						'CodeQuotation': {
							'location': modName,
							'identifier': 'ConHeaderCodeQuotation',
							'initial': 'ConHeaderCodeQuotation'
						},
						'Remark': {
							'location': cloudCommonModule,
							'identifier': 'entityRemark',
							'initial': 'entityRemark'
						},
						'Userdefined1': {
							'location': cloudCommonModule,
							'identifier': 'entityUserDefined',
							'initial': 'entityUserDefined',
							param: {'p_0': '1'}
						},
						'Userdefined2': {
							'location': cloudCommonModule,
							'identifier': 'entityUserDefined',
							'initial': 'entityUserDefined',
							param: {'p_0': '2'}
						},
						'Userdefined3': {
							'location': cloudCommonModule,
							'identifier': 'entityUserDefined',
							'initial': 'entityUserDefined',
							param: {'p_0': '3'}
						},
						'Userdefined4': {
							'location': cloudCommonModule,
							'identifier': 'entityUserDefined',
							'initial': 'entityUserDefined',
							param: {'p_0': '4'}
						},
						'Userdefined5': {
							'location': cloudCommonModule,
							'identifier': 'entityUserDefined',
							'initial': 'entityUserDefined',
							param: {'p_0': '5'}
						},
						'Description': {
							'location': cloudCommonModule,
							'identifier': 'entityReferenceName',
							'initial': 'entityReferenceName'
						},
						'InsertedAt': {
							'location': cloudCommonModule,
							'identifier': 'entityInsertedAt',
							'initial': 'entityInsertedAt'
						},
						'UpdatedAt': {
							'location': cloudCommonModule,
							'identifier': 'entityUpdatedAt',
							'initial': 'entityUpdatedAt'
						},
						'ConfirmationCode': {
							'location': modName,
							'identifier': 'confirmationCode',
							'initial': 'confirmationCode'
						},
						'ConfirmationDate': {
							'location': modName,
							'identifier': 'confirmationDate',
							'initial': 'confirmationDate'
						},
						'ExternalCode': {
							'location': modName,
							'identifier': 'externalCode',
							'initial': 'externalCode'
						},
						'PrcCopyModeFk': {
							'location': modName,
							'identifier': 'entityPrcCopyModeFk',
							'initial': 'Copy Mode'
						},
						'DatePenalty': {
							'location': modName,
							'identifier': 'entityDatePenalty',
							'initial': 'Date Penalty'
						},
						'PenaltyPercentPerDay': {
							'location': modName,
							'identifier': 'entityPenaltyPercentPerDay',
							'initial': 'Penalty Percent Per Day'
						},
						'PenaltyPercentMax': {
							'location': modName,
							'identifier': 'entityPenaltyPercentMax',
							'initial': 'Penalty Percent Max'
						},
						'PenaltyComment': {
							'location': modName,
							'identifier': 'entityPenaltyComment',
							'initial': 'Penalty Comment'
						},
						'DateEffective': {
							'location': 'basics.common',
							'identifier': 'dateEffective',
							'initial': 'Date Effective'
						},
						'BpdVatGroupFk': {
							'location': prcCommonModule,
							'identifier': 'entityVatGroup',
							'initial': 'Vat Group'
						},
						'ProvingPeriod': {
							location: prcConfigModule,
							identifier: 'entityProvingPeriod',
							initial: 'Proving Period'
						},
						'ProvingDealdline': {
							location: prcConfigModule,
							identifier: 'entityProvingDealdline',
							initial: 'Proving Deadline'
						},
						'ApprovalPeriod': {
							location: prcConfigModule,
							identifier: 'entityApprovalPeriod',
							initial: 'Approval Period'
						},
						'ApprovalDealdline': {
							location: prcConfigModule,
							identifier: 'entityApprovalDealdline',
							initial: 'Approval Deadline'
						},
						'IsFreeItemsAllowed': {
							location: prcConfigModule,
							identifier: 'entityIsFreeItemsAllowed',
							initial: 'Is Free Items Allowed'
						},
						'MdcPriceListFk': {
							location: cloudCommonModule,
							identifier: 'entityMarketPrice',
							initial: 'Market Price'
						},
						'BankFk': {
							location: cloudCommonModule,
							identifier: 'entityBankName',
							initial: 'Bank'
						},
						'ExecutionStart': {
							location: modName,
							identifier: 'entityExecutionStart',
							initial: 'Bank'
						},
						'ExecutionEnd': {
							location: modName,
							identifier: 'entityExecutionEnd',
							initial: 'Bank'
						},
						'AccountAssignment': {location: prcCommonModule, identifier: 'accassign.AccountAssignment', initial: 'Account Assignment'},
						'BasAccassignBusinessFk': {location: prcCommonModule, identifier: 'accassign.BusinessArea', initial: 'Business Area'},
						'BasAccassignControlFk': {location: prcCommonModule, identifier: 'accassign.ControllingArea', initial: 'Controlling Area'},
						'BasAccassignAccountFk': {location: prcCommonModule, identifier: 'accassign.AccountingArea', initial: 'Accounting Area'},
						'BasAccassignConTypeFk': {location: prcCommonModule, identifier: 'accassign.ContractType', initial: 'Contract Type'},
						'OrdHeaderFk': {location: modName, identifier: 'entityOrdHeaderFk', initial: 'Sales Contract'},
						'OverallDiscount': {location: prcCommonModule, identifier: 'entityOverallDiscount', initial: 'Overall Discount'},
						'OverallDiscountOc': {location: prcCommonModule, identifier: 'entityOverallDiscountOc', initial: 'Overall Discount (OC) '},
						'OverallDiscountPercent': {location: prcCommonModule, identifier: 'entityOverallDiscountPercent', initial: 'Overall Discount Percent'},
						'TotalValue': {location: modName, identifier: 'total.totalValue', initial: 'Total'},
						'Net': {location: modName, identifier: 'total.net', initial: 'Net'},
						'NetOc': {location: modName, identifier: 'total.netOc', initial: 'NetOc'},
						'Vat': {location: modName, identifier: 'total.vat', initial: 'Vat'},
						'VatOc': {location: modName, identifier: 'total.vatOc', initial: 'VatOc'},
						'Gross': {location: modName, identifier: 'total.gross', initial: 'Gross'},
						'GrossOc': {location: modName, identifier: 'total.grossOc', initial: 'GrossOc'},
						'ChangeOrderValue': {location: modName, identifier: 'total.changeOrder', initial: 'Change Order'},
						'ChangeOrderNet': {location: modName, identifier: 'total.changeOrderNet', initial: 'Chg. Order Net'},
						'ChangeOrderNetOc': {location: modName, identifier: 'total.changeOrderNetOc', initial: 'Chg. Order NetOc'},
						'ChangeOrderVat': {location: modName, identifier: 'total.changeOrderVat', initial: 'Chg. Order Vat'},
						'ChangeOrderVatOc': {location: modName, identifier: 'total.changeOrderVatOc', initial: 'Chg. Order VatOc'},
						'ChangeOrderGross': {location: modName, identifier: 'total.changeOrderGross', initial: 'Chg. Order Gross'},
						'ChangeOrderGrossOc': {location: modName, identifier: 'total.changeOrderGrossOc', initial: 'Chg. Order GrossOc'},
						'CallOffValue': {location: modName, identifier: 'total.callOff', initial: 'Call Off'},
						'CallOffNet': {location: modName, identifier: 'total.callOffNet', initial: 'Call Off Net'},
						'CallOffNetOc': {location: modName, identifier: 'total.callOffNetOc', initial: 'Call Off NetOc'},
						'CallOffVat': {location: modName, identifier: 'total.callOffVat', initial: 'Call Off Vat'},
						'CallOffVatOc': {location: modName, identifier: 'total.callOffVatOc', initial: 'Call Off VatOc'},
						'CallOffGross': {location: modName, identifier: 'total.callOffGross', initial: 'Call Off Gross'},
						'CallOffGrossOc': {location: modName, identifier: 'total.callOffGrossOc', initial: 'Call Off GrossOc'},
						'GrandValue': {location: modName, identifier: 'total.grand', initial: 'Grand Total'},
						'GrandNet': {location: modName, identifier: 'total.grandNet', initial: 'Grand Net'},
						'GrandNetOc': {location: modName, identifier: 'total.grandNetOc', initial: 'Grand NetOc'},
						'GrandVat': {location: modName, identifier: 'total.grandVat', initial: 'Grand Vat'},
						'GrandVatOc': {location: modName, identifier: 'total.grandVatOc', initial: 'Grand VatOc'},
						'GrandGross': {location: modName, identifier: 'total.grandGross', initial: 'Grand Gross'},
						'GrandGrossOc': {location: modName, identifier: 'total.grandGrossOc', initial: 'Grand GrossOc'},
						'SalesTaxMethodFk': {location: prcCommonModule, identifier: 'entitySalesTaxMethodFk', initial: 'Sales Tax Method'},
						'ValidFrom': {location: prcCommonModule, identifier: 'entityValidFrom', initial: 'Valid From'},
						'ValidTo': {location: prcCommonModule, identifier: 'entityValidTo', initial: 'Valid To'},
						'BoqWicCatFk': {location: prcCommonModule, identifier: 'entityFwBoqWicCatFk', initial: 'Framework WIC Group'},
						'BoqWicCatBoqFk': {location: prcCommonModule, identifier: 'entityFwBoqWicCatBoqFk', initial: 'Framework WIC BoQ'},
						'IsFramework': {location: modName, identifier: 'conEntityIsFramework', initial: 'Is Framework'},
						'BaselinePath': {location: prcPackageModule, identifier: 'baselinePath', initial: 'Baseline Path'},
						'IsNotAccrualPrr':{location: modName, identifier: 'IsNotAccrualPrr', initial: 'Is Not Accrual'},
						'FrameworkConHeaderFk': {location: modName, identifier: 'frameworkConHeaderFk', initial: 'Framework Contract'},
					}
				},
				'groups': [
					{
						'gid': 'HeaderGroupHeader',
						'attributes': ['id', 'purchaseorders', 'code', 'constatusfk', 'projectfk', 'projectstatusfk', 'packagefk', 'reqheaderfk', 'taxcodefk', 'bpdvatgroupfk', 'clerkprcfk', 'clerkreqfk', 'bascurrencyfk', 'exchangerate', 'projectchangefk', 'contractheaderfk', 'materialcatalogfk', 'paymenttermfifk',
							'paymenttermpafk', 'paymenttermadfk', 'dateordered', 'datereported', 'datecanceled', 'datedelivery', 'datecallofffrom', 'datecalloffto', 'contypefk', 'awardmethodfk', 'contracttypefk', 'controllingunitfk', 'billingschemafk', 'confirmationcode', 'confirmationdate', 'externalcode',
							'prccopymodefk', 'dateeffective', 'provingperiod', 'provingdealdline', 'approvalperiod', 'approvaldealdline', 'isfreeitemsallowed',
							'mdcpricelistfk', 'bankfk', 'executionstart', 'executionend', 'ordheaderfk', 'overalldiscount', 'overalldiscountoc', 'overalldiscountpercent', 'salestaxmethodfk','validfrom','validto', 'boqwiccatfk', 'boqwiccatboqfk', 'isframework',
							'baselinepath','isnotaccrualprr', 'frameworkconheaderfk']
					}, {
						'gid': 'HeaderGroupDesiredSupplier',
						'attributes': ['businesspartnerfk', 'subsidiaryfk', 'supplierfk', 'contactfk', 'businesspartner2fk', 'subsidiary2fk', 'supplier2fk', 'contact2fk', 'businesspartneragentfk']
					}, {
						'gid': 'HeaderGroupOther',
						'attributes': ['incotermfk', 'companyinvoicefk','addressentity', 'codequotation']
					}, {
						'gid': 'HeaderGroupInformation',
						'attributes': ['remark', 'userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5']
					}, {
						'gid': 'HeaderGroupPenality',
						'attributes': ['datepenalty', 'penaltypercentperday', 'penaltypercentmax', 'penaltycomment']
					}, {
						'gid': 'AccountAssignment',
						'attributes': ['basaccassignbusinessfk', 'basaccassigncontrolfk', 'basaccassignaccountfk', 'basaccassigncontypefk']
					}, {
						'gid': 'TotalValue',
						'attributes': ['net', 'vat', 'gross', 'netoc', 'vatoc', 'grossoc']
					}, {
						'gid': 'ChangeOrderValue',
						'attributes': ['changeordernet', 'changeordervat', 'changeordergross', 'changeordernetoc', 'changeordervatoc', 'changeordergrossoc']
					}, {
						'gid': 'CallOffValue',
						'attributes': ['calloffnet', 'calloffvat', 'calloffgross', 'calloffnetoc', 'calloffvatoc', 'calloffgrossoc']
					}, {
						'gid': 'GrandValue',
						'attributes': ['grandnet', 'grandvat', 'grandgross', 'grandnetoc', 'grandvatoc', 'grandgrossoc']
					}, {'gid': 'entityHistory', 'isHistory': true}
				],
				'overloads': {
					'id': {
						'readonly': true
					},
					'purchaseorders': {
						'readonly': true,
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'PurchaseOrders',
								displayMember: 'Description'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'contract-header-purchase-orders-combobox',
							'options': {
								descriptionMember: 'Description'
							}
						}
					},
					'code': {
						detail: {
							'type': 'directive',
							'directive': 'platform-composite-input',
							'label$tr$': 'cloud.common.entityReference',
							'model': 'Code',// use for validator
							'options': {
								'rows': [{
									'type': 'code',
									'model': 'Code',
									'cssLayout': 'xs-12 sm-12 md-4 lg-4'
								}, {
									'type': 'description',
									'model': 'Description',
									'cssLayout': 'xs-12 sm-12 md-8 lg-8',
									'validate': false
								}]
							}
						}
					},
					'constatusfk': {
						'grid': {
							'editor': '',
							'editorOptions': null,
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'ConStatus',
								displayMember: 'DescriptionInfo.Translated',
								imageSelector: 'platformStatusIconService'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'procurement-contract-header-status-combobox',
							'options': {
								readOnly: true
							}
						}
					},
					'projectfk': platformLayoutHelperService.provideProjectLookupOverload('prc-con-header-project-filter'),
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
					'packagefk': {
						navigator: {
							moduleName: 'procurement.package',
							registerService: 'procurementPackageDataService'
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'procurement-common-package-lookup',
								'lookupOptions': {'filterKey': 'prc-con-package-filter', 'showClearButton': true}
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
								'lookupOptions': {'showClearButton': true, 'filterKey': 'prc-con-package-filter'}
							}
						}
					},
					'reqheaderfk': {
						'readonly': 'true',
						navigator: {
							moduleName: 'procurement.requisition',
							registerService: 'procurementRequisitionHeaderDataService'
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'procurement-common-req-header-lookup-view-dialog',
								'descriptionMember': 'Description'
							}
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'procurement-common-req-header-lookup-view-dialog'
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'ReqHeaderLookupView',
								'displayMember': 'Code'
							}
						}
					},
					'taxcodefk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {'directive': 'basics-master-data-context-tax-code-lookup'},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'TaxCode', 'displayMember': 'Code'},
							'width': 80
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'basics-master-data-context-tax-code-lookup',
								'descriptionMember': 'DescriptionInfo.Translated'
							}
						}
					},
					'clerkprcfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'cloud-clerk-clerk-dialog',
								'lookupOptions': {'showClearButton': true}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'clerk', 'displayMember': 'Code'},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'cloud-clerk-clerk-dialog',
								'descriptionMember': 'Description',
								'lookupOptions': {'showClearButton': true}
							}
						}
					},
					'clerkreqfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'cloud-clerk-clerk-dialog',
								'lookupOptions': {'showClearButton': true}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'clerk', 'displayMember': 'Code'},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'cloud-clerk-clerk-dialog',
								'descriptionMember': 'Description',
								'lookupOptions': {'showClearButton': true}
							}
						}
					},
					'bascurrencyfk': {
						'grid': {
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
						'detail': {
							'type': 'directive',
							'directive': 'prc-Common-Basics-Currency-Lookup',
							'options': {
								'lookupType': 'BasCurrency',
								'filterKey': 'bas-currency-conversion-filter'
							}
						}
					},
					'projectchangefk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'project-change-dialog',
								descriptionMember: 'Description',
								lookupOptions: getChangeOrderLookupOptions()
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'project-change-dialog',
								lookupOptions: getChangeOrderLookupOptions()
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'projectchange',
								displayMember: 'Code'
							},
							width: 130
						}
					},
					'contractheaderfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'prc-con-header-dialog',
								'lookupOptions': {
									'filterKey': 'prc-con-header-filter',
									'showClearButton': true,
									'dialogOptions': {
										'alerts': [{
											theme: 'info',
											message: 'Setting basis contract will overwrite quite a lot of related fields',
											message$tr$: 'procurement.common.contractHeaderUpdateInfo'
										}]
									}
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'conheaderview', 'displayMember': 'Code'},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'prc-con-header-dialog',
								'descriptionMember': 'Description',
								'lookupOptions': {
									'showClearButton': true,
									'filterKey': 'prc-con-header-filter',
									'dialogOptions': {
										'alerts': [{
											theme: 'info',
											message: 'Setting basis contract will overwrite quite a lot of related fields',
											message$tr$: 'procurement.common.contractHeaderUpdateInfo'
										}]
									}
								}
							}
						}
					},
					'materialcatalogfk': {
						navigator: {
							moduleName: 'basics.materialcatalog'
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-material-material-catalog-lookup',
								'lookupOptions': {
									'filterKey': 'prc-con-material-catalog-filter',
									'showClearButton': true,
									'title': {
										'name': 'Framework Material Catalog Search Dialog',
										'name$tr$': 'procurement.contract.frameworkMaterialCatalogSearchDialog'
									}
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'MaterialCatalog', 'displayMember': 'Code'},
							'width': 150
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'basics-material-material-catalog-lookup',
								'descriptionMember': 'DescriptionInfo.Translated',
								'lookupOptions': {
									'showClearButton': true,
									'filterKey': 'prc-con-material-catalog-filter',
									'title': {
										'name': 'Framework Material Catalog Search Dialog',
										'name$tr$': 'procurement.contract.frameworkMaterialCatalogSearchDialog'
									}
								}
							}
						}
					},
					'paymenttermfifk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-lookupdata-payment-term-lookup',
								'lookupOptions': {'displayMember': 'Code', 'showClearButton': true}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'PaymentTerm', 'displayMember': 'Code'},
							'width': 80
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'basics-lookupdata-payment-term-lookup',
								'descriptionMember': 'Description',
								'lookupOptions': {'showClearButton': true}
							}
						}
					},
					'paymenttermpafk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-lookupdata-payment-term-lookup',
								'lookupOptions': {'displayMember': 'Code', 'showClearButton': true}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'PaymentTerm', 'displayMember': 'Code'},
							'width': 80
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'basics-lookupdata-payment-term-lookup',
								'descriptionMember': 'Description',
								'lookupOptions': {'showClearButton': true}
							}
						}
					},
					'paymenttermadfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-lookupdata-payment-term-lookup',
								'lookupOptions': {'displayMember': 'Code', 'showClearButton': true}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'PaymentTerm', 'displayMember': 'Code'},
							'width': 80
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'basics-lookupdata-payment-term-lookup',
								'descriptionMember': 'Description',
								'lookupOptions': {'showClearButton': true}
							}
						}
					},
					'contypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('prc.common.contype', 'Description'),
					'awardmethodfk': basicsLookupdataConfigGenerator.provideElaboratedLookupConfig('basics-procurement-configuration-award-method-combobox', 'prcawardmethod', 'Description'),
					'contracttypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('prc.common.contracttype', 'Description'),
					'controllingunitfk': {
						'navigator': {
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
									selectableCallback: function(dataItem) {
										return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, procurementContractHeaderDataService);
									}
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'ControllingUnit', 'displayMember': 'Code'},
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
									selectableCallback: function(dataItem) {
										return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, procurementContractHeaderDataService);
									}
								}
							}
						}
					},
					'billingschemafk': {
						mandatory: true,
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'procurement-configuration-billing-schema-Combobox',
								'lookupOptions': {
									'filterKey': 'prc-con-billing-schema-filter'
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'billingschema',
								'displayMember': 'DescriptionInfo.Translated'
							},
							'width': 80
						},
						'detail': {
							'type': 'directive',
							'directive': 'procurement-configuration-billing-schema-Combobox',
							'options': {
								'filterKey': 'prc-con-billing-schema-filter'
							}
						}
					},
					'businesspartnerfk': {
						mandatory: true,
						navigator: {
							moduleName: 'businesspartner.main'
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								// 'directive': 'business-partner-main-business-partner-dialog'
								'directive': 'filter-business-partner-dialog-lookup',
								'lookupOptions': {
									'showClearButton': true,
									'filterKey': 'procurement-contract-businesspartner-businesspartner-filter',
									'approvalBPRequired': true,
									'IsShowBranch': true,
									'mainService':'procurementContractHeaderDataService',
									'BusinessPartnerField':'BusinessPartnerFk',
									'SubsidiaryField':'SubsidiaryFk',
									'SupplierField':'SupplierFk',
									'ContactField': 'ContactFk',
									'PaymentTermFiField':'PaymentTermFiFk',
									'PaymentTermPaField': 'PaymentTermPaFk'
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'BusinessPartner',
								'displayMember': 'BusinessPartnerName1'
							},
							'width': 150
						},
						'detail': {
							'type': 'directive',
							// 'directive': 'business-partner-main-business-partner-dialog'
							'directive': 'filter-business-partner-dialog-lookup',
							'options': {
								'displayMember': 'BusinessPartnerName1',
								'showClearButton': true,
								'filterKey': 'procurement-contract-businesspartner-businesspartner-filter',
								'approvalBPRequired': true,
								'IsShowBranch': true,
								'mainService':'procurementContractHeaderDataService',
								'BusinessPartnerField':'BusinesspartnerFk',
								'SubsidiaryField':'SubsidiaryFk',
								'SupplierField':'SupplierFk',
								'ContactField': 'ContactFk',
								'paymentTermFiField':'PaymentTermFiFk',
								'paymentTermPaField': 'PaymentTermPaFk'
							}
						}
					},
					'subsidiaryfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'business-partner-main-subsidiary-lookup',
								'lookupOptions': {'showClearButton': true, 'filterKey': 'prc-con-subsidiary-filter', 'displayMember': 'AddressLine'}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'subsidiary', 'displayMember': 'AddressLine'},
							'width': 180
						},
						'detail': {
							'type': 'directive',
							'directive': 'business-partner-main-subsidiary-lookup',
							'options': {
								'filterKey': 'prc-con-subsidiary-filter', 'showClearButton': true,
								'displayMember': 'AddressLine'
							}
						}
					},
					'supplierfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'business-partner-main-supplier-lookup',
								'lookupOptions': {'filterKey': 'prc-con-supplier-filter', 'showClearButton': true}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'Supplier', 'displayMember': 'Code'},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'business-partner-main-supplier-lookup',
								'descriptionMember': 'Description',
								'lookupOptions': {'filterKey': 'prc-con-supplier-filter', 'showClearButton': true}
							}
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
					'businesspartner2fk': {
						mandatory: true,
						navigator: {
							moduleName: 'businesspartner.main'
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								// 'directive': 'business-partner-main-business-partner-dialog'
								'directive': 'filter-business-partner-dialog-lookup',
								'lookupOptions': {
									'IsShowBranch': true,
									'mainService':'procurementContractHeaderDataService',
									'BusinessPartnerField':'Businesspartner2Fk',
									'SubsidiaryField':'Subsidiary2Fk',
									'SupplierField':'Supplier2Fk',
									'ContactField': 'Contact2Fk'
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'BusinessPartner',
								'displayMember': 'BusinessPartnerName1'
							},
							'width': 150
						},
						'detail': {
							'type': 'directive',
							// 'directive': 'business-partner-main-business-partner-dialog'
							'directive': 'filter-business-partner-dialog-lookup',
							'options': {
								'IsShowBranch': true,
								'mainService':'procurementContractHeaderDataService',
								'BusinessPartnerField':'Businesspartner2Fk',
								'SubsidiaryField':'Subsidiary2Fk',
								'SupplierField':'Supplier2Fk',
								'ContactField': 'Contact2Fk'
							}
						}
					},
					'subsidiary2fk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'business-partner-main-subsidiary-lookup',
								'lookupOptions': {'showClearButton': true, 'filterKey': 'prc-con-subsidiary2-filter', 'displayMember': 'AddressLine'}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'subsidiary', 'displayMember': 'AddressLine'},
							'width': 180
						},
						'detail': {
							'type': 'directive',
							'directive': 'business-partner-main-subsidiary-lookup',
							'options': {
								'filterKey': 'prc-con-subsidiary2-filter', 'showClearButton': true, 'displayMember': 'AddressLine'
							}
						}
					},
					'supplier2fk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'business-partner-main-supplier-lookup',
								'lookupOptions': {'filterKey': 'prc-con-supplier2-filter', 'showClearButton': true}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'Supplier', 'displayMember': 'Code'},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'business-partner-main-supplier-lookup',
								'descriptionMember': 'Description',
								'lookupOptions': {'filterKey': 'prc-con-supplier2-filter', 'showClearButton': true}
							}
						}
					},
					'contact2fk': {
						mandatory: true,
						navigator: {
							moduleName: 'businesspartner.contact'
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'business-partner-main-contact-dialog',
								'lookupOptions': {'filterKey': 'prc-con-contact2-filter', 'showClearButton': true}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'Contact', 'displayMember': 'FullName'},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'business-partner-main-contact-dialog',
							'options': {
								'filterKey': 'prc-con-contact2-filter', 'showClearButton': true
							}
						}
					},
					'businesspartneragentfk': {
						mandatory: true,
						navigator: {
							moduleName: 'businesspartner.main'
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								// 'directive': 'business-partner-main-business-partner-dialog'
								'directive': 'filter-business-partner-dialog-lookup',
								'lookupOptions': {
									showClearButton: true
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'BusinessPartner',
								'displayMember': 'BusinessPartnerName1'
							},
							'width': 150
						},
						'detail': {
							'type': 'directive',
							// 'directive': 'business-partner-main-business-partner-dialog'
							'directive': 'filter-business-partner-dialog-lookup',
							'options': {
								lookupOptions: {
									showClearButton: true
								}
							}
						}
					},
					/* 'incotermfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-lookupdata-incoterm-combobox',
								'lookupOptions': {'showClearButton': true}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'PrcIncoterm', 'displayMember': 'Description'},
							'width': 80
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-incoterm-combobox',
							'options': {'showClearButton': true}
						}
					}, */
					'incotermfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'basics-lookupdata-incoterm-combobox',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true
								}
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-lookupdata-incoterm-combobox',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'prcincoterm',
								displayMember: 'Code'
							}
						}
					},
					'companyinvoicefk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-company-company-lookup',
								'lookupOptions': {'showClearButton': true}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'Company', 'displayMember': 'Code'},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'basics-company-company-lookup',
								'descriptionMember': 'CompanyName',
								'lookupOptions': {'showClearButton': true}
							}
						}
					},
					'addressentity': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'procurement-common-address-complex-control',
								'lookupOptions': {
									'foreignKey': 'AddressFk',
									'titleField': 'cloud.common.entityDeliveryAddress',
									'showClearButton': true,
									'hideSeachButton':true,
									'mainService':'procurementContractHeaderDataService'
								}
							},
							'formatter': basicsCommonComplexFormatter,
							'formatterOptions': {'displayMember': 'AddressLine'},
							'width': 180
						},
						'detail': {
							'type': 'directive',
							'directive': 'procurement-common-address-complex-control',
							'options': {
								'titleField': 'cloud.common.entityDeliveryAddress',
								'foreignKey': 'AddressFk',
								'showClearButton': true,
								'hideSeachButton':true,
								'mainService':'procurementContractHeaderDataService'
							}
						}
					},
					// 'addressfk': {
					// detail: {
					// 'type': 'directive',
					// 'directive': 'procurement-contract-lookup-view-dialog',
					// 'options': {
					// 'descriptionMember': 'AddressLine',
					// filterKey: 'prc-con-address-filter',
					// considerPlanningElement: true,
					// formContainerOptions: getFormContainerOptions(),
					// title: {name: 'Assign Basis Contract', name$tr$: 'procurement.contract.contractLookup'}
					// }
					// },
					// grid: {
					// editor: 'lookup',
					// editorOptions: {
					// directive: 'procurement-contract-lookup-view-dialog',
					// lookupOptions: {
					// filterKey: 'prc-con-address-filter',
					// considerPlanningElement: true,
					// titleField: 'cloud.common.entityDeliveryAddress',
					// formContainerOptions: getFormContainerOptions()
					// }
					// },
					// formatter: 'lookup',
					// formatterOptions: {
					// lookupType: 'AddressLookupService',
					// displayMember: 'AddressLine'
					// }
					// }
					// },
					'codequotation': {
						navigator: {
							moduleName: 'procurement.quote',
							registerService: 'procurementQuoteHeaderDataService',
							targetIdProperty: 'CodeQuotation'
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'procurement-quote-header-lookup',
								'lookupOptions': {
									'filterKey': 'prc-con-quote-filter',
									// 'showClearButton': true,
									'isTextEditable': true
								}
							},
							formatter: function (row, cell, value, columnDef, dataContext) {
								let title = $translate.instant('procurement.contract.contractQuotationTooltip');
								let showValue = '';
								if (value) {
									showValue = value;
								}
								let colDef = _.cloneDeep(columnDef);
								let navigatorMarkup = platformGridDomainService.getNavigator(colDef, dataContext);
								if (navigatorMarkup && !navigationPermissionService.hasPermissionForModule('procurement.quote')) {
									navigatorMarkup = angular.element(navigatorMarkup).attr('disabled', true).appendTo('<div></div>').parent().html();
								}
								return '<div title=\'' + title + '\' style=\'height:100%;\'>' + showValue + navigatorMarkup + '</div>';// jshint ignore:line
							},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'procurement-quote-header-lookup',
							'options': {
								readonly: true,
								'filterKey': 'prc-con-quote-filter',
								// 'showClearButton': true,
								'isTextEditable': true,
								showCustomInputContent: true,
								formatter: function (row, cell, value, columnDef, dataContext) {
									var title = $translate.instant('procurement.contract.contractQuotationTooltip');
									var showValue = '';
									if (dataContext) {
										var value1 = dataContext.CodeQuotation;
										if (value1) {
											showValue = value1;
										}
									}
									return '<div title=\'' + title + '\' style=\'height:100%;\'>' + showValue + '</div>';// jshint ignore:line
								}
							}
						},
						readonly: true
					},
					datecanceled: {
						grid: {
							editor: null,
							type: ''
						},
						detail: {
							'readonly': true
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
					'prccopymodefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.copymode', 'Description'),
					'penaltycomment': {
						detail: {
							maxLength: 255
						},
						grid: {
							maxLength: 255
						}
					},
					'bpdvatgroupfk': {
						detail: {
							rid: 'bpdvatgroupfk',
							label: 'Vat Group',
							type: 'directive',
							model: 'BpdVatGroupFk',
							directive: 'business-partner-vat-group-lookup',
							options: {
								displayMember: 'DescriptionInfo.Translated',
								showClearButton: true
							},
							change: function (item, field) {
								procurementContractHeaderDataService.cellChange(item, field);
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
					mdcpricelistfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.pricelist'),
					bankfk: {
						'detail': {
							'type': 'directive',
							'directive': 'business-partner-main-bank-lookup',
							'options': {
								filterKey: 'prc-con-bank-filter',
								displayMember: 'IbanNameOrBicAccountName'
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-bank-lookup',
								lookupOptions: {
									filterKey: 'prc-con-bank-filter',
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
					'basaccassignbusinessfk': basicsLookupdataConfigGenerator.provideElaboratedLookupConfig('prc-common-accassign-business-lookup', 'basaccassignbusiness', 'Code'),
					'basaccassigncontrolfk': basicsLookupdataConfigGenerator.provideElaboratedLookupConfig('prc-common-accassign-control-lookup', 'basaccassigncontrol', 'Code'),
					'basaccassignaccountfk': basicsLookupdataConfigGenerator.provideElaboratedLookupConfig('prc-common-accassign-account-lookup', 'basaccassignaccount', 'Code'),
					'basaccassigncontypefk': basicsLookupdataConfigGenerator.provideElaboratedLookupConfig('prc-common-accassign-contract-type-lookup', 'BasAccassignConType', 'Code'),
					'ordheaderfk': {
						mandatory: true,
						navigator: {
							moduleName: 'sales.contract'
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'sales-common-contract-dialog',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									filterKey: 'prc-contract-sales-contract-filter',
									showClearButton: true
								}
							}
						},
						grid: {
							editor: 'lookup',
							directive: 'basics-lookupdata-lookup-composite',
							editorOptions: {
								lookupDirective: 'sales-common-contract-dialog',
								lookupOptions: {
									filterKey: 'prc-contract-sales-contract-filter',
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'SalesContract',
								displayMember: 'Code'
							}
						}
					},
					net: {'readonly': true},
					vat: {'readonly': true},
					gross: {'readonly': true},
					netoc: {'readonly': true},
					vatoc: {'readonly': true},
					grossoc: {'readonly': true},
					changeordernet: {'readonly': true},
					changeordervat: {'readonly': true},
					changeordergross: {'readonly': true},
					changeordernetoc: {'readonly': true},
					changeordervatoc: {'readonly': true},
					changeordergrossoc: {'readonly': true},
					calloffnet: {'readonly': true},
					calloffvat: {'readonly': true},
					calloffgross: {'readonly': true},
					calloffnetoc: {'readonly': true},
					calloffvatoc: {'readonly': true},
					calloffgrossoc: {'readonly': true},
					grandnet: {'readonly': true},
					grandvat: {'readonly': true},
					grandgross: {'readonly': true},
					grandnetoc: {'readonly': true},
					grandvatoc: {'readonly': true},
					grandgrossoc: {'readonly': true},
					baselinepath: {'readonly': true},
					'salestaxmethodfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.salestaxmethod', 'Description'),
					'boqwiccatfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						moduleQualifier: 'estimateAssembliesWicGroupLookupDataService',
						dataServiceName: 'estimateAssembliesWicGroupLookupDataService',
						enableCache: true,
						valMember: 'Id',
						dispMember: 'Code'
					},{
						name: 'Framework WIC Group',
						name$tr$: 'procurement.common.entityFwBoqWicCatFk',
						label: 'Framework WIC Group',
						label$tr$: 'procurement.common.entityFwBoqWicCatFk'
					}),
					'boqwiccatboqfk': {
						'navigator': {
							moduleName: 'boq.wic'
						},
						'detail' : {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'prc-common-wic-cat-boq-lookup',
								descriptionMember: 'BoqRootItem.BriefInfo.Translated',
								lookupOptions: {
									'filterKey': 'prc-con-wic-cat-boq-filter',
									disableDataCaching: true,
								}
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'prc-common-wic-cat-boq-lookup',
								'lookupOptions': {
									'additionalColumns': true,
									'displayMember': 'BoqRootItem.Reference',
									'descriptionMember': 'BoqRootItem.BriefInfo.Translated',
									'addGridColumns': [
										{
											id: 'briefinfo',
											field: 'BoqRootItem.BriefInfo.Translated',
											name: 'Description',
											formatter: 'description',
											width: 150,
											name$tr$: 'cloud.common.entityDescription'
										}
									],
									'filterKey': 'prc-con-wic-cat-boq-filter'
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PrcWicCatBoqs',
								displayMember: 'BoqRootItem.Reference',
								descriptionMember: 'BoqRootItem.BriefInfo.Translated',
								pKeyMaps: [{pkMember: 'BoqWicCatFk', fkMember: 'BoqWicCatFk'}]
							},
							width: 130
						}
					},
					'isframework': {
						'readonly': true,
						'width': 80
					},
					'frameworkconheaderfk': {
						navigator: {
							force: true,
							moduleName: 'procurement.contract',
							registerService: 'procurementContractHeaderDataService'
						},
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ConHeaderView',
								displayMember: 'Code'
							},
							editor: 'lookup',
							editorOptions: {
								directive: 'prc-con-header-dialog',
								lookupOptions: {
									additionalColumns: true,
									displayMember: 'Code',
									addGridColumns: [{
										id: 'Description',
										field: 'Description',
										name: 'Description',
										width: 300,
										formatter: 'description',
										name$tr$: 'cloud.common.entityDescription'
									}]
								}
							},
							width: 100
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'prc-con-header-dialog',
								descriptionMember: 'Description'
							}
						},
						readonly: true
					}
				},
				'addition': {
					'grid': [
						{
							'afterId': 'code',
							id: 'description',
							field: 'Description',
							name$tr$: 'cloud.common.entityReferenceName',
							editor: 'description',
							formatter: 'description',
							grouping: {
								title: 'cloud.common.entityReferenceName',
								getter: 'Description',
								aggregators: [],
								aggregateCollapsed: true
							},
							width: 150
						},
						{
							'afterId': 'description',
							'id': 'configurationfk',
							'field': 'PrcHeaderEntity.ConfigurationFk',
							'name$tr$': 'procurement.package.entityConfiguration',
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-configuration-configuration-combobox',
								'lookupOptions': {'filterKey': 'prc-con-configuration-filter'}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'prcConfiguration',
								'displayMember': 'DescriptionInfo.Translated'
							},
							'grouping': {
								'title': 'cloud.common.prcConfigurationDescription',
								'getter': 'PrcHeaderEntity.ConfigurationFk',
								'aggregators': [],
								'aggregateCollapsed': true
							},
							'width': 150
						},
						{
							'lookupDisplayColumn': true,
							'field': 'PackageFk',
							'displayMember': 'Description',
							'name$tr$': 'cloud.common.entityPackageDescription',
							'width': 120
						},
						{
							'afterId': 'PackageFkDescription',
							'id': 'structureCode',
							'field': 'PrcHeaderEntity.StructureFk',
							'name$tr$': 'basics.common.entityPrcStructureFk',
							'editor': 'lookup',
							'editorOptions': {
								// 'directive': 'basics-procurementstructure-structure-dialog',
								'directive': 'procurement-contract-prc-structure-dialog',
								'lookupOptions': {'filterKey': 'prc-req-structure-filter', 'showClearButton': true}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'PrcStructure',
								'displayMember': 'Code'
							},
							'width': 100,
							navigator: {
								moduleName: 'basics.procurementstructure'
							},
							'grouping': {
								'title': 'cloud.common.entityStructureCode',
								'getter': 'PrcHeaderEntity.StructureFk',
								'aggregators': [],
								'aggregateCollapsed': true
							}
						}, {
							'afterId': 'structureCode',
							'id': 'structureDescription',
							'field': 'PrcHeaderEntity.StructureFk',
							'name$tr$': 'cloud.common.entityStructureDescription',
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'PrcStructure',
								'displayMember': 'DescriptionInfo.Translated'
							},
							'grouping': {
								'title': 'cloud.common.entityStructureDescription',
								'getter': 'PrcHeaderEntity.StructureFk',
								'aggregators': [],
								'aggregateCollapsed': true
							},
							'width': 120
						}, {
							'lookupDisplayColumn': true,
							'field': 'TaxCodeFk',
							'displayMember': 'DescriptionInfo.Translated',
							'name$tr$': 'cloud.common.entityTaxCodeDescription',
							'width': 150
						}, {
							'lookupDisplayColumn': true,
							'field': 'ClerkPrcFk',
							'displayMember': 'Description',
							'name$tr$': 'procurement.contract.ConHeaderProcurementOwnerName',
							'width': 100
						}, {
							'lookupDisplayColumn': true,
							'field': 'ClerkReqFk',
							'displayMember': 'Description',
							'name$tr$': 'procurement.contract.ConHeaderRequisitionOwnerName',
							'width': 100
						}, {
							'lookupDisplayColumn': true,
							'field': 'ProjectChangeFk',
							'displayMember': 'Description',
							'name$tr$': 'procurement.common.reqheaderChangeRequestDescription',
							'width': 100
						}, {
							'afterId': 'ProjectChangeFk',
							'id': 'ProjectChangeType',
							'field': 'ProjectChangeFk',
							'name$tr$': 'project.main.entityChangeType',
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'ProjectChange',
								'displayMember': 'ProjectChangeType'
							},
							'width': 120,
							'grouping': {
								'title': 'project.main.entityChangeType',
								'getter': 'ProjectChangeFk',
								'aggregators': [],
								'aggregateCollapsed': true
							},
						},
						{
							'lookupDisplayColumn': true,
							'field': 'ContractHeaderFk',
							'displayMember': 'Description',
							'name$tr$': 'procurement.contract.ConHeaderBasisContractDescription',
							'width': 120
						}, {
							'lookupDisplayColumn': true,
							'field': 'MaterialCatalogFk',
							'displayMember': 'DescriptionInfo.Translated',
							'name$tr$': 'procurement.contract.conFrameworkMaterialCatalogDescription',
							'width': 150
						}, {
							'lookupDisplayColumn': true,
							'field': 'PaymentTermFiFk',
							'displayMember': 'Description',
							'name$tr$': 'cloud.common.entityPaymentTermFiDescription',
							'width': 180
						}, {
							'lookupDisplayColumn': true,
							'field': 'PaymentTermPaFk',
							'displayMember': 'Description',
							'name$tr$': 'cloud.common.entityPaymentTermPaDescription',
							'width': 180
						}, {
							'lookupDisplayColumn': true,
							'field': 'IncotermFk',
							'displayMember': 'Description',
							'name$tr$': 'cloud.common.entityIncotermCodeDescription',
							'width': 180
						}, {
							'lookupDisplayColumn': true,
							'field': 'PaymentTermAdFk',
							'displayMember': 'Description',
							'name$tr$': 'cloud.common.entityPaymentTermAdDescription',
							'width': 180
						}, {
							'lookupDisplayColumn': true,
							'field': 'ControllingUnitFk',
							'displayMember': 'DescriptionInfo.Translated',
							'name$tr$': 'cloud.common.entityControllingUnitDesc',
							'width': 100
						}, {
							afterId: 'structureDescription',
							'id': 'strategyDescription',
							'field': 'PrcHeaderEntity.StrategyFk',
							'name$tr$': 'cloud.common.EntityStrategy',
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'procurement-common-strategy-combobox',
								'lookupOptions': {'filterKey': 'prc-con-strategy-filter'}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'prcconfig2strategy', 'displayMember': 'Description'},
							'grouping': {
								'title': 'cloud.common.EntityStrategy',
								'getter': 'PrcHeaderEntity.StrategyFk',
								'aggregators': [],
								'aggregateCollapsed': true
							},
							'width': 100
						}, {
							'lookupDisplayColumn': true,
							'field': 'SupplierFk',
							'displayMember': 'Description',
							'name$tr$': 'cloud.common.entitySupplierDescription',
							'width': 150
						}, {
							'lookupDisplayColumn': true,
							'field': 'CompanyInvoiceFk',
							'displayMember': 'CompanyName',
							'name$tr$': 'procurement.contract.ConHeaderCompanyInvoicedCodeDescription',
							'width': 100
						},
						{
							'lookupDisplayColumn': true,
							'field': 'ReqHeaderFk',
							'displayMember': 'Description',
							'name$tr$': 'procurement.contract.entityReqHeaderDescription'
						}, {
							'lookupDisplayColumn': true,
							'field': 'PackageFk',
							'displayMember': 'TextInfo',
							'name$tr$': 'procurement.common.entityPackageTextInfo',
							'width': 125
						}, {
							'lookupDisplayColumn': true,
							'field': 'ControllingUnitFk',
							'displayMember': 'Budget',
							'lookupDomain': 'money',
							'name$tr$': 'procurement.contract.entityCuBudget',
							'width': 120
						}, {
							'field': 'ControllingUnitFk',
							'name$tr$': 'procurement.contract.entityCuEstimateCost',
							'formatter': function (row, cell, value, columnDef, entity) {
								if (value === null || entity.ControllingUnitFk === null) {
									return null;
								}
								const dataItem = basicsLookupdataLookupDescriptorService.getLookupItem('controllingunit', value);
								if (dataItem === null || dataItem === undefined || dataItem.EstimateCost === null) {
									return '0.00';
								}
								const cost = parseFloat(dataItem.EstimateCost);
								if (angular.isNumber(cost)) {
									return cost.toFixed(2);
								}
								return cost;
							},
							'width': 120,
							grouping: {
								title: 'procurement.contract.entityCuEstimateCost',
								getter: 'ControllingUnitFk',
								aggregators: [],
								aggregateCollapsed: true
							},
						},
						{
							'formatter': 'money',
							'field': 'BillingSchemaFinal',
							'name': 'Billing Schema Final',
							'name$tr$': 'procurement.common.billingSchemaFinal',
							'width': 150,
							readonly: true,
							grouping: {
								title: 'procurement.common.billingSchemaFinal',
								getter: 'BillingSchemaFinal',
								aggregators: [],
								aggregateCollapsed: true
							},
						},{
							'formatter': 'money',
							'field': 'BillingSchemaFinalOC',
							'name': 'Billing Schema Final OC',
							'name$tr$': 'procurement.common.billingSchemaFinalOc',
							'width': 150,
							readonly: true,
							grouping: {
								title: 'procurement.common.billingSchemaFinalOc',
								getter: 'BillingSchemaFinalOC',
								aggregators: [],
								aggregateCollapsed: true
							},
						}],
					'detail': [
						{
							afterId: 'code',
							'id': 'PrcHeaderEntity.ConfigurationFk',
							'rid': 'PrcHeaderEntity.ConfigurationFk',
							'gid': 'HeaderGroupHeader',
							'label$tr$': 'procurement.common.prcConfigurationDescription',
							'type': 'directive',
							'model': 'PrcHeaderEntity.ConfigurationFk',
							'directive': 'basics-configuration-configuration-combobox',
							'options': {
								filterKey: 'prc-con-configuration-filter'
							}
						}, {
							afterId: 'PackageFkDescription',
							'rid': 'PrcHeaderEntity.StructureFk',
							'gid': 'HeaderGroupHeader',
							'label$tr$': 'basics.common.entityPrcStructureFk',
							'model': 'PrcHeaderEntity.StructureFk',
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								// lookupDirective: 'basics-procurementstructure-structure-dialog',
								lookupDirective: 'procurement-contract-prc-structure-dialog',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'prc-req-structure-filter'
								}
							},
							navigator: {
								moduleName: 'basics.procurementstructure'
							}
						}, {
							afterId: 'ControllingUnitFkDescription',
							'rid': 'PrcHeaderEntity.StrategyFk',
							'gid': 'HeaderGroupHeader',
							'label$tr$': 'cloud.common.EntityStrategy',
							'model': 'PrcHeaderEntity.StrategyFk',
							'type': 'directive',
							'directive': 'procurement-common-strategy-combobox',
							'options': {
								lookupOptions: {
									filterKey: 'prc-con-strategy-filter'
								}
							}
						}, {
							'afterId': 'ProjectChangeFk',
							'rid': 'ProjectChangeType',
							'gid': 'HeaderGroupHeader',
							'model': 'ProjectChangeFk',
							'label$tr$': 'project.main.entityChangeType',
							'type': 'directive',
							'directive': 'project-change-dialog',
							'readonly': true,
							'options': {
								'displayMember': 'ProjectChangeType'
							}
						}, {
							'afterId': 'PackageFk',
							'gid': 'HeaderGroupHeader',
							'rid': 'TextInfo',
							'label': 'Package Text Info',
							'label$tr$': 'procurement.common.entityPackageTextInfo',
							'model': 'PackageFk',
							'type': 'directive',
							'directive': 'procurement-common-package-lookup',
							'readonly': true,
							'options': {
								'displayMember': 'TextInfo'
							}
						}, {
							'lookupDisplayColumn': true,
							'gid': 'HeaderGroupHeader',
							'rid': 'Budget',
							'label': 'Budget(CU)',
							'label$tr$': 'procurement.contract.entityCuBudget',
							'model': 'ControllingUnitFk',
							'type': 'directive',
							'directive': 'controlling-structure-dialog-lookup',
							'readonly': true,
							'options': {
								'displayMember': 'Budget',
								'formatter': function(e, item) {
									if (!item) return null;
									if (!item.Budget) return '0.00';
									let value = parseFloat(item.Budget);
									if (angular.isNumber(value)) {
										return value.toFixed(2);
									}
									return value;
								},
								'readOnly': true
							}
						}, {
							'lookupDisplayColumn': true,
							'gid': 'HeaderGroupHeader',
							'rid': 'EstimateCost',
							'label': 'Cost(CU)',
							'label$tr$': 'procurement.contract.entityCuEstimateCost',
							'model': 'ControllingUnitFk',
							'type': 'directive',
							'directive': 'controlling-structure-dialog-lookup',
							'options': {
								'displayMember': 'EstimateCost',
								'formatter': function(e, item) {
									if (!item) return null;
									if (!item.EstimateCost) return '0.00';
									let value = parseFloat(item.EstimateCost);
									if (angular.isNumber(value)) {
										return value.toFixed(2);
									}
									return value;
								},
								'readOnly': true
							}
						},
						{
							afterId: 'schemaFinal',
							rid: 'BillingSchemaFinal',
							gid: 'HeaderGroupHeader',
							model: 'BillingSchemaFinal',
							label: 'Billing Schema Final',
							label$tr$: 'procurement.common.billingSchemaFinal',
							type: 'money',
							readonly: true
						},{
							afterId: 'schemaFinalOc',
							rid: 'BillingSchemaFinalOC',
							gid: 'HeaderGroupHeader',
							model: 'BillingSchemaFinalOC',
							label: 'Billing Schema Final OC',
							label$tr$: 'procurement.common.billingSchemaFinalOc',
							type: 'money',
							readonly: true
						}]
				}
			};

			var basicsClerkFormatService = $injector.get('basicsClerkFormatService');
			config.overloads.clerkreqfk.grid.formatter = basicsClerkFormatService.formatClerk;
			config.overloads.clerkprcfk.grid.formatter = basicsClerkFormatService.formatClerk;

			return config;

			// eslint-disable-next-line no-unused-vars
		}]);

	mod.factory('procurementContractHeaderUIStandardService',
		['platformUIStandardConfigService', 'procurementContractTranslationService',
			'procurementContractHeaderLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'ConHeaderDto',
					moduleSubModule: 'Procurement.Contract'
				});
				if (domainSchema) {
					if (domainSchema.properties) {
						domainSchema.properties['PrcHeaderEntity.StrategyFk'] = {domain: 'integer'};
					}
					domainSchema = domainSchema.properties;
				}

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				//var service = new BaseService(layout, domainSchema, translationService);

				const entityInformation = { module: angular.module(modName), moduleName: 'Procurement.Contract', entity: 'ConHeader' };
				var service = new BaseService(layout, domainSchema, translationService, entityInformation);

				platformUIStandardExtentService.extend(service, layout.addition, domainSchema);
				return service;
			}
		]);
})(angular);