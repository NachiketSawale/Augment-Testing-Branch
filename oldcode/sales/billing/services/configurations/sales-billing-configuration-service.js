/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {


	'use strict';
	var moduleName = 'sales.billing';

	// TODO: check to move to separate file
	angular.module(moduleName).value('salesBillingInvoiceTypeLookupOptions', {
		lookupModuleQualifier: 'billing.invoicetype',
		displayMember: 'Description',
		valueMember: 'Id',
		filter: {customBoolProperty: 'ISLUMPSUM'}
	});
	angular.module(moduleName).value('salesBillingBillTypeLookupOptions', {
		lookupModuleQualifier: 'basics.customize.billtype',
		displayMember: 'Description',
		valueMember: 'Id',
		filter: {customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK', customBoolProperty: 'ISPROGRESS'}
	});

	angular.module(moduleName).factory('salesBillingConfigurationService', ['_', '$injector', '$translate', 'platformUIStandardConfigService', 'platformUIStandardExtentService', 'salesCommonLookupConfigsService', 'salesBillingTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator', 'salesBillingService', 'platformModuleNavigationService', 'basicsLookupdataConfigGeneratorExtension',
		function (_, $injector, $translate, platformUIStandardConfigService, platformUIStandardExtentService, salesCommonLookupConfigsService, salesBillingTranslationService, platformSchemaService, basicsLookupdataConfigGenerator, salesBillingService, naviService, basicsLookupdataConfigGeneratorExtension) {

			function getProjectChangeLookupOptions() {
				return {
					showClearButton: true,
					filterOptions: {
						serverKey: 'sales-contract-project-change-common-filter',
						serverSide: true,
						fn: function () {
							return {
								ProjectFk: salesBillingService.getSelected() ?
									salesBillingService.getSelected().ProjectFk : 0
							};
						}
					}
				};
			}

			var detailsOverload = {
					'readonly': true,
					'grid': {
						formatter: function (row, cell, value) {
							return angular.uppercase(value);
						}
					}
				},
				getEstQtyRel = {
					'readonly': true,
					'grid': {
						formatter: 'imageselect',
						formatterOptions: {
							serviceName: 'basicsEstimateQuantityRelationIconService'
						}
					}
				};

			var billingDetailLayout = {
				'fid': 'sales.billing.bids.detailform',
				'version': '0.9.0',
				'change':'change',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': [
							'typefk', 'rubriccategoryfk', 'configurationfk', 'companyresponsiblefk', 'companyicdebtorfk','billingschemafk', 'projectfk',
							'languagefk', 'bilstatusfk', 'billdate', 'dateposted', 'billno', 'consecutivebillno', 'progressinvoiceno', 'referencestructured', 'invoicetypefk',
							'descriptioninfo', 'currencyfk', 'exchangerate', 'banktypefk', 'bankfk', 'clerkfk', 'contracttypefk', 'ordconditionfk',
							'amountnet', 'amountgross', 'amountnetoc', 'amountgrossoc',
							'iscanceled', 'cancellationno', 'cancellationreason', 'cancellationdate',
							'bookingtext', 'ordheaderfk', 'previousbillfk', 'relatedbillheaderfk', 'objunitfk', 'controllingunitfk', 'prcstructurefk', 'dateeffective', 'documentno','bassalestaxmethodfk','isnotaccrual'
						]
					},
					{
						'gid': 'customerData',
						'attributes': [
							'businesspartnerfk', 'subsidiaryfk', 'customerfk', 'contactfk',
							'businesspartnerbilltofk', 'subsidiarybilltofk', 'customerbilltofk', 'contactbilltofk'
						]
					},
					{
						'gid': 'paymentData',
						'attributes': [
							'datediscount', 'datenetpayable', 'paymenttermfk',
							'taxcodefk', 'vatgroupfk',
							'amounttotal', 'discountamounttotal', 'paymentschedulecode'
						]
					},
					{
						'gid': 'datesData',
						'attributes': [
							'performedfrom', 'performedto'
						]
					},
					{
						'gid': 'otherData',
						'attributes': [
							'prjchangefk', 'prjchangestatusfk', 'remark', 'commenttext'
						]
					},
					{
						'gid': 'userDefText',
						'isUserDefText': true,
						'attributes': ['userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5']
					},
					{
						'gid': 'userDefDates',
						'attributes': ['userdefineddate01', 'userdefineddate02', 'userdefineddate03', 'userdefineddate04', 'userdefineddate05']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],

				'overloads': {
					typefk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.billtype', null, {customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK', customBoolProperty: 'ISPROGRESS'}),
					bilstatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.billstatus', null, {
						showIcon: true
					}),
					estimationcode: {
						readonly: true
					},
					estimationdescription: {
						readonly: true
					},
					'billno': {
						readonly: true,
						mandatory: true,
						searchable: true,
						navigator: {
							moduleName: 'sales.billing',
							registerService: 'salesBillingService'
						},
						requiredInErrorHandling: true // Code will be displayed by default, but we have a different name here.
					},
					consecutivebillno: {
						readonly: true
					},
					progressinvoiceno: {
						readonly: true
					},
					referencestructured: {
						'grid': {
							editor: 'directive',
							editorOptions: {
								directive: 'invoice-reference-structured-input' // TODO: 100849 replace?
							},
							formatter: 'description'
						},
						'detail': {
							'type': 'directive',
							'directive': 'invoice-reference-structured-input', // TODO: 100849 replace?
							'model': 'ReferenceStructured'
						}
					},
					invoicetypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('billing.invoicetype', null, {customBoolProperty: 'ISLUMPSUM'}),
					ordheaderfk: {
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'sales-common-contract-dialog',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									filterKey: 'sales-billing-contract-filter',
									showClearButton: true,
									events: [{
										name: 'onSelectedItemChanged',
										handler: function onSelectedItemChangedHandler(e, args) {
											if (args && args.entity) {
												args.entity.PrcStructureFk = args.selectedItem !== null ? args.selectedItem.PrcStructureFk : null;
												args.entity.ControllingUnitFk = args.selectedItem !== null ? args.selectedItem.ControllingUnitFk : null;
												args.entity.ContractCurrencyFk = args.selectedItem !== null ? args.selectedItem.CurrencyFk : null;
											}
										}
									}]
								}
							}
						},
						grid: {
							editor: 'lookup',
							directive: 'basics-lookupdata-lookup-composite',
							editorOptions: {
								lookupDirective: 'sales-common-contract-dialog',
								lookupOptions: {
									filterKey: 'sales-billing-contract-filter',
									showClearButton: true,
									events: [{
										name: 'onSelectedItemChanged',
										handler: function onSelectedItemChangedHandler(e, args) {
											if (args && args.entity) {
												args.entity.PrcStructureFk = args.selectedItem !== null ? args.selectedItem.PrcStructureFk : null;
												args.entity.ControllingUnitFk = args.selectedItem !== null ? args.selectedItem.ControllingUnitFk : null;
												args.entity.ContractCurrencyFk = args.selectedItem !== null ? args.selectedItem.CurrencyFk : null;
											}
										}
									}]
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'SalesContract',
								displayMember: 'Code'
							}
						}
					},
					previousbillfk: {
						// TODO: see 106457 (at the momemt navigator will be not
						// displayed because it's a jump into the same module)
						navigator: {
							moduleName: 'sales.billing'
						},
						readonly: true,
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'sales-common-bill-dialog-v2',
								lookupOptions: {
									addGridColumns: [{
										id: 'Description',
										field: 'DescriptionInfo',
										name: 'Description',
										formatter: 'translation',
										name$tr$: 'cloud.common.entityDescription'
									}],
									additionalColumns: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'SalesBillingV2',
								displayMember: 'BillNo'
							}
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'sales-common-bill-dialog-v2',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {}
							}
						}
					},
					relatedbillheaderfk: {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'sales-common-bill-dialog-v2',
								lookupOptions: {
									filterKey: 'sales-billing-relatedbill-filter-by-server',
									addGridColumns: [{
										id: 'Description',
										field: 'DescriptionInfo',
										name: 'Description',
										formatter: 'translation',
										name$tr$: 'cloud.common.entityDescription'
									}],
									additionalColumns: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'SalesBillingV2',
								displayMember: 'BillNo'
							}
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'sales-common-bill-dialog-v2',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									filterKey: 'sales-billing-relatedbill-filter-by-server'
								}
							}
						}
					},
					'taxcodefk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'basics-master-data-context-tax-code-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									showClearButton: true
								}
							},
							'change': 'formOptions.onPropertyChanged'
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {showClearButton: true},
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
					'amountnet': {
						readonly: true
					},
					'amountnetoc': {
						readonly: true
					},
					'amountgross': {
						readonly: true
					},
					'amountgrossoc': {
						readonly: true
					},
					'amounttotal':{
						readonly: true
					},
					'discountamounttotal': {
						readonly: true
					},
					ordconditionfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.ordercondition'),
					banktypefk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.banktype', 'Description'),
					bankfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'businessPartnerMainBankLookupDataService',
						additionalColumns: false,
						dispMember: 'IbanNameOrBicAccountName',
						isComposite: false,
						filter: function (/* item */) {
							// TODO: #105999: prevent request if no business partner is set!
							return $injector.get('salesCommonContextService').getCompany().BusinessPartnerFk || -1;
						}
					}),
					contactfk: {
						detail: {
							type: 'directive',
							directive: 'business-partner-main-filtered-contact-combobox',
							options: {
								initValueField: 'FamilyName',
								filterKey: 'sales-billing-contact-by-bizpartner-server-filter',
								showClearButton: true
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-filtered-contact-combobox',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'sales-billing-contact-by-bizpartner-server-filter'
								}
							},
							width: 125,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'contact',
								displayMember: 'FamilyName'
							}
						}
					},
					documentno: {readonly:true},
					paymenttermfk: {
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-lookupdata-payment-term-lookup',
								descriptionMember: 'Description'
							}
						},
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PaymentTerm',
								displayMember: 'Code'
							},
							editor: 'lookup',
							editorOptions: {directive: 'basics-lookupdata-payment-term-lookup'}
						}
					},
					paymentschedulecode: {
						// 'formatter': function (row, cell, value, columnDef, dataContext) {
						// if(!value){
						// return '';
						// }
						// return $injector.get('salesBillingPaymentScheduleDialogService').getPaymentScheduleFormat(dataContext, columnDef, value);
						// },
						// readonly: true
						editor: null,
						navigator: {
							moduleName: $translate.instant('sales.billing.paymentSchedule'),
							navFunc: function (item, triggerEntity){
								let navigator = naviService.getNavigator('sales.contract-paymentSchedule');
								let salesContractDataService = $injector.get('salesContractService'),
									selectedContract = salesContractDataService.getSelected();
								if(!selectedContract || selectedContract.Id !== triggerEntity.OrdHeaderFk){
									salesContractDataService.deselect();
									salesContractDataService.load().then(function (){
										salesContractDataService.setSelected(salesContractDataService.getItemById(triggerEntity.OrdHeaderFk));

										$injector.get('$timeout')(function () {
											naviService.navigate(navigator, item, triggerEntity);
										}, 300);
									});
								}else{
									naviService.navigate(navigator, item, triggerEntity);
								}
							},
							hide: function (entity){
								return !entity.PaymentScheduleCode;
							}
						}
					},
					'businesspartnerfk': $injector.get('salesCommonLookupConfigsService').BusinessPartnerLookupConfig('salesBillingService'),
					prjchangefk: {
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'project-change-dialog',
								descriptionMember: 'Description',
								lookupOptions: getProjectChangeLookupOptions()
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'project-change-dialog',
								lookupOptions: getProjectChangeLookupOptions()
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'projectchange',
								displayMember: 'Code'
							},
							width: 130
						}
					}
				}
			};

			var getSalesBillingEstLineItemLayout = function () {
				return {
					'fid': 'estimate.main.lineItem.detailform',
					'version': '1.0.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['statusoflineitemassignedtopackage', 'info', 'projectno', 'projectname', 'estimationcode', 'estimationdescription', 'rule', 'param', 'code', 'estassemblyfk', 'descriptioninfo',
								'estlineitemfk', 'quantitytargetdetail', 'quantitytarget', 'wqquantitytarget',
								'basuomtargetfk', 'quantitydetail', 'quantity', 'basuomfk', 'externalcode', 'quantityfactordetail1', 'quantityfactor1', 'quantityfactordetail2', 'quantityfactor2', 'quantityfactor3', 'quantityfactor4',
								'productivityfactordetail', 'productivityfactor', 'quantityunittarget', 'quantitytotal', 'costunit', 'costfactordetail1', 'costfactor1', 'costfactordetail2', 'costfactor2', 'costunittarget',
								'costtotal', 'hoursunit', 'hoursunittarget', 'hourstotal', 'estcostriskfk', 'mdccontrollingunitfk', 'boqrootref', 'boqitemfk', 'psdactivityschedule', 'psdactivityfk', 'mdcworkcategoryfk',
								'mdcassetmasterfk', 'prjlocationfk', 'prcstructurefk', 'estqtyrelboqfk', 'estqtyrelactfk', 'estqtyrelgtufk', 'estqtytelaotfk', 'prjchangefk', 'islumpsum', 'isdisabled', 'isgc', 'commenttext',
								'entcostunit', 'entcostunittarget', 'entcosttotal', 'enthoursunit', 'enthoursunittarget', 'enthourstotal',
								'drucostunit', 'drucostunittarget', 'drucosttotal', 'druhoursunit', 'druhoursunittarget', 'druhourstotal',
								'dircostunit', 'dircostunittarget', 'dircosttotal', 'dirhoursunit', 'dirhoursunittarget', 'dirhourstotal',
								'indcostunit', 'indcostunittarget', 'indcosttotal', 'indhoursunit', 'indhoursunittarget', 'indhourstotal',
								'cosinstancecode', 'cosinstancedescription', 'cosmasterheadercode', 'cosmasterheaderdescription', 'fromdate', 'todate',
								'sortcode01fk', 'sortcode02fk', 'sortcode03fk', 'sortcode04fk', 'sortcode05fk', 'sortcode06fk', 'sortcode07fk', 'sortcode08fk', 'sortcode09fk', 'sortcode10fk', 'lipreviousquantity', 'liquantity', 'libilledquantity', 'litotalquantity', 'lipercentagequantity', 'licumulativepercentage']
						},
						{
							'gid': 'userDefText',
							'isUserDefText': true,
							'attributes': ['userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5']

						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					// TODO: rename
					'overloads': {
						statusoflineitemassignedtopackage: {
							readonly: true,
							grid: {
								field: 'statusImage',
								formatter: 'image',
								formatterOptions: {
									imageSelector: 'salesCommonLineItemStatusProcessor',
									tooltip: true
								}
							}
						},
						'info': {
							'readonly': true,
							'grid': {
								field: 'image',
								formatter: 'image',
								formatterOptions: {
									imageSelector: 'estimateMainLineItemImageProcessor'
								}
							}
						},
						'quantitydetail': detailsOverload,
						'quantitytargetdetail': detailsOverload,
						'quantityfactordetail1': detailsOverload,
						'quantityfactordetail2': detailsOverload,
						'productivityfactordetail': detailsOverload,
						'costfactordetail1': detailsOverload,
						'costfactordetail2': detailsOverload,
						'projectno': {
							readonly: true
						},
						'projectname': {
							readonly: true
						},
						estimationcode: {
							readonly: true
						},
						estimationdescription: {
							readonly: true
						},
						'rule': {
							'readonly': true,
							'grid': {
								isTransient: true,
								formatter: 'imageselect',
								formatterOptions: {
									dataServiceName: 'estimateRuleFormatterService',
									dataServiceMethod: 'getItemByRuleAsync',
									itemServiceName: 'estimateMainService',
									itemName: 'EstLineItems',
									serviceName: 'basicsCustomizeRuleIconService'
								}
							}
						},
						'param': {
							'readonly': true,
							'grid': {
								isTransient: true,
								formatter: 'imageselect',
								formatterOptions: {
									dataServiceName: 'estimateParameterFormatterService',
									dataServiceMethod: 'getItemByParamAsync',
									itemServiceName: 'estimateMainService',
									itemName: 'EstLineItems',
									serviceName: 'estimateParameterFormatterService'
								}
							}
						},
						'code': {
							'mandatory': true,
							'searchable': true,
							'navigator': {
								moduleName: $translate.instant(moduleName + '.estimateLineItemGridContainerTitle'),
								navFunc: function (item, triggerField) {

									var navigator = naviService.getNavigator('estimate.main-line-item');
									var salesBillingService = $injector.get('salesBillingService');
									var projectId = salesBillingService.getSelected().ProjectFk;

									angular.extend(triggerField, {
										ProjectContextId: projectId
									});

									naviService.navigate(navigator, item, triggerField);
								}
							},
							'readonly': true
						},

						// TODO, this changes according to Estimate.Main
						// 'estlineitemfk': basicsLookupdataConfigGenerator.provideTreeDataServiceLookupConfig({
						//  dataServiceName: 'estLineItemRefLookupDataService',
						//  valMember: 'Id',
						//  dispMember: 'Code',
						//  filter: function (item) {
						//      var estHeaderId = item && item.EstHeaderFk ? item.EstHeaderFk :procurementPackageDataService.getSelected().EstHeaderFk;
						//      var id = item && item.Id ? item.Id  : procurementPackageDataService.getSelected().Id;
						//      return estHeaderId + '&id=' + id;
						//  }
						// }),
						'estlineitemfk': {
							'readonly': true,
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-main-est-line-item-lookup-dialog',
									lookupOptions: {
										'displayMember': 'Code'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'estlineitemlookup',
									displayMember: 'Code'
								}
							},
							'detail': {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'estimate-main-est-line-item-lookup-dialog',
									descriptionMember: 'DescriptionInfo.Translated'
								}
							}
						},

						estassemblyfk: {
							// TODO, I will test this navigator works or not later
							navigator: {
								moduleName: 'estimate.assemblies'
							},
							'readonly': true,
							grid: {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'estassemblyfk',
									displayMember: 'Code'
								}
							}
						},

						'basuomtargetfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							'readonly': true,
							dataServiceName: 'basicsUnitLookupDataService',
							cacheEnable: true
						}, {required: false}),

						'basuomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							'readonly': true,
							dataServiceName: 'basicsUnitLookupDataService',
							cacheEnable: true
						}),

						'estcostriskfk': basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('estimate.lookup.costrisk', 'Description', {showClearButton: true}),
						'externalcode': detailsOverload,
						'mdccontrollingunitfk': {
							navigator: {
								moduleName: 'controlling.structure'
							},
							'readonly': true,
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Controllingunit',
									displayMember: 'Code'
								}
							}
						},

						'boqitemfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'salesWipBoqLookupDataService',
							// displayMember: 'Reference',
							isComposite: true,
							desMember: 'BriefInfo.Translated',
							dispMember: 'Reference',
							cacheEnable: true,
							'readonly': true,
							filter: function (item) {
								return item.BoqHeaderFk;
							}
						}),

						'boqrootref': {
							'readonly': true,
							'grid': {
								field: 'BoqHeaderFk',
								formatter: 'lookup',
								formatterOptions: {
									displayMember: 'Reference',
									dataServiceName: 'salesWipBoqRootLookupDataService',
									dataServiceMethod: 'getItemByIdAsync'
								}
							}
						},

						'psdactivityschedule': {
							'navigator': {
								moduleName: 'scheduling.main'
							},
							'readonly': true,
							'grid': {
								field: 'PsdActivityFk',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'estlineitemactivity',
									displayMember: 'Code',
									dataServiceName: 'estimateMainActivityScheduleLookupService'
								}
							}
						},

						'psdactivityfk': {
							'navigator': {
								moduleName: 'scheduling.main'
							},
							'readonly': true,
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'estlineitemactivity',
									displayMember: 'Code',
									dataServiceName: 'estimateMainActivityLookupService'
								}
							}
						},
						'prjlocationfk': {
							navigator: {
								moduleName: 'project.main-location'
							},
							'readonly': true,
							'grid': {
								'formatter': 'lookup',
								'formatterOptions': {
									'lookupType': 'ProjectLocation',
									'displayMember': 'Code'
								}
							}
						},

						'mdcworkcategoryfk': {
							'readonly': true,
							'grid': {
								'formatter': 'lookup',
								'formatterOptions': {
									'lookupType': 'WorkCategory',
									'displayMember': 'Code'
								}
							}
						},

						'mdcassetmasterfk': {
							'readonly': true,
							'grid': {
								'formatter': 'lookup',
								'formatterOptions': {
									'lookupType': 'AssertMaster',
									'displayMember': 'Code'
								}
							}
						},

						'prcstructurefk': {
							navigator: {
								moduleName: 'basics.procurementstructure'
							},
							'readonly': true,
							'grid': {
								'formatter': 'lookup',
								'formatterOptions': {
									'lookupType': 'prcstructure',
									'displayMember': 'Code'
								}
							}
						},
						'prjchangefk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'project-change-dialog',
									lookupOptions: getProjectChangeLookupOptions()
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'projectchange',
									displayMember: 'Code'
								},
								width: 130
							}
						},
						'estqtyrelboqfk': angular.copy(getEstQtyRel),
						'estqtyrelactfk': angular.copy(getEstQtyRel),
						'estqtyrelgtufk': angular.copy(getEstQtyRel),
						'estqtytelaotfk': angular.copy(getEstQtyRel),
						cosinstancecode: {
							readonly: true,
							navigator: {
								moduleName: 'constructionsystem.main'
							}
						},
						cosmasterheaderdescription: {
							readonly: true
						},
						cosmasterheadercode: {
							readonly: true,
							navigator: {
								moduleName: 'constructionsystem.master'
							}
						},
						cosinstancedescription: {
							readonly: true
						},
						'fromdate': {
							'readonly': true,
							formatter: 'dateutc'
						},
						'todate': {
							'readonly': true,
							formatter: 'dateutc'
						},
						'sortcode01fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode01LookupDataService',
							showClearButton: true,
							filter: function () {
								return salesBillingService.getSelectedProjectId();
							}
						}),
						'sortcode02fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode02LookupDataService',
							showClearButton: true,
							filter: function () {
								return salesBillingService.getSelectedProjectId();
							}
						}),
						'sortcode03fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode03LookupDataService',
							showClearButton: true,
							filter: function () {
								return salesBillingService.getSelectedProjectId();
							}
						}),
						'sortcode04fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode04LookupDataService',
							showClearButton: true,
							filter: function () {
								return salesBillingService.getSelectedProjectId();
							}
						}),
						'sortcode05fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode05LookupDataService',
							showClearButton: true,
							filter: function () {
								return salesBillingService.getSelectedProjectId();
							}
						}),
						'sortcode06fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode06LookupDataService',
							showClearButton: true,
							filter: function () {
								return salesBillingService.getSelectedProjectId();
							}
						}),
						'sortcode07fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode07LookupDataService',
							showClearButton: true,
							filter: function () {
								return salesBillingService.getSelectedProjectId();
							}
						}),
						'sortcode08fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode08LookupDataService',
							showClearButton: true,
							filter: function () {
								return salesBillingService.getSelectedProjectId();
							}
						}),
						'sortcode09fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode09LookupDataService',
							showClearButton: true,
							filter: function () {
								return salesBillingService.getSelectedProjectId();
							}
						}),
						'sortcode10fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode10LookupDataService',
							showClearButton: true,
							filter: function () {
								return salesBillingService.getSelectedProjectId();
							}
						})
					},
					'addition': {
						'grid': [
							{
								'lookupDisplayColumn': true,
								'field': 'PrjChangeFk',
								'displayMember': 'Description',
								'name$tr$': 'procurement.common.reqheaderChangeRequestDescription',
								'width': 155
							}
						]
					}
				};
			};

			salesCommonLookupConfigsService.addCommonLookupsToLayout(billingDetailLayout);
			salesCommonLookupConfigsService.registerCommonFilters();

			// in billing customer is mandatory, so we have to remove the showClearButton (override config from common lookups)
			/* _.set(billingDetailLayout, 'overloads.businesspartnerfk.grid.editorOptions.lookupOptions.showClearButton', false);
			_.set(billingDetailLayout, 'overloads.businesspartnerfk.detail.options.lookupOptions.showClearButton', false);
			_.set(billingDetailLayout, 'overloads.customerfk.grid.editorOptions.lookupOptions.showClearButton', false);
			_.set(billingDetailLayout, 'overloads.customerfk.detail.options.lookupOptions.showClearButton', false); */

			var BaseService = platformUIStandardConfigService;

			var salesBillingHeaderDomainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'BilHeaderDto',
				moduleSubModule: 'Sales.Billing'
			});

			if (salesBillingHeaderDomainSchema) {
				salesBillingHeaderDomainSchema = salesBillingHeaderDomainSchema.properties;
				salesCommonLookupConfigsService.addCommonDomainSchemaProps(salesBillingHeaderDomainSchema);
			}

			function SalesBillingUIStandardService(layout, scheme, translateService, entityInfo) {
				BaseService.call(this, layout, scheme, translateService, entityInfo);
			}

			var entityInformation = {module: angular.module('sales.billing'), moduleName: 'Sales.Billing', entity: 'BilHeader'};
			SalesBillingUIStandardService.prototype = Object.create(BaseService.prototype);
			SalesBillingUIStandardService.prototype.constructor = SalesBillingUIStandardService;
			var service = new BaseService(billingDetailLayout, salesBillingHeaderDomainSchema, salesBillingTranslationService, entityInformation);

			billingDetailLayout.overloads.customerfk.grid.editorOptions.lookupOptions.showClearButton = true;
			billingDetailLayout.overloads.customerfk.grid.editorOptions.showClearButton = true;
			billingDetailLayout.overloads.customerfk.detail.options.lookupOptions.showClearButton = true;
			billingDetailLayout.overloads.customerfk.detail.options.showClearButton = true;

			// TODO: #144627 refactor+simplify
			billingDetailLayout.overloads.rubriccategoryfk.grid.editorOptions.lookupOptions.filterKey = 'sales-billing-rubric-category-by-rubric-filter';
			billingDetailLayout.overloads.rubriccategoryfk.detail.options.lookupOptions.filterKey = 'sales-billing-rubric-category-by-rubric-filter';

			platformUIStandardExtentService.extend(service, salesCommonLookupConfigsService.getAdditionalGridColumnsFor(['projectfk', 'prcstructurefk','companyicdebtorfk']), salesBillingHeaderDomainSchema);
			platformUIStandardExtentService.extend(service, billingDetailLayout.addition, salesBillingHeaderDomainSchema); // for PrcStructureFk // TODO: check merge with getAdditional* above

			// re-use the layout configuration somewhere else (e.g. in the wip module)
			service.getLayoutDetailConfiguration = function getLayoutDetailConfiguration() {
				return _.cloneDeep(billingDetailLayout);
			};

			service.getSalesBillingEstLineItemLayout = getSalesBillingEstLineItemLayout;

			return service;
		}
	]);
})();
