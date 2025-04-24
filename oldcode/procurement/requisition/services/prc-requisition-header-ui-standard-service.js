/**
 * Created by lnb on 4/14/2015.
 */
/* globals moment */
(function (angular, moment) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	var modName = 'procurement.requisition',
		prcCommonModule = 'procurement.common',
		cloudCommonModule = 'cloud.common',
		mod = angular.module(modName);
	const procurementPackageModule = 'procurement.package';
	const procurementRfqModule = 'procurement.rfq';

	mod.factory('procurementRequisitionHeaderLayout', [
		'basicsLookupdataConfigGenerator',
		'procurementRequisitionHeaderDataService',
		'basicsCommonComplexFormatter',
		'platformDomainService',
		'basicsLookupdataLookupDescriptorService', '$injector', 'platformLayoutHelperService',
		function (basicsLookupdataConfigGenerator,
			procurementRequisitionHeaderDataService,
			basicsCommonComplexFormatter,
			platformDomainService,
			basicsLookupdataLookupDescriptorService, $injector, platformLayoutHelperService) {

			function getProjectChangeLookupOptions() {
				return {
					showClearButton: true,
					createOptions: {
						typeOptions: {
							isProcurement: true,
							isChangeOrder: true
						}
					},
					filterOptions: {
						serverKey: 'project-change-lookup-for-procurement-common-filter',
						serverSide: true,
						fn: function (dataContext) {
							return {
								ProjectFk: dataContext.ProjectFk || 0,
								IsProcurement : true
							};
						}
					}
				};
			}
			var config = {
				'fid': 'requisition.header.detail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'change': 'change',
				'translationInfos': {
					'extraModules': [modName, prcCommonModule, 'boq.main','controlling.structure',
						'basics.material', 'procurement.ticketsystem', 'basics.clerk', 'businesspartner.main', 'basics.common', procurementPackageModule, procurementRfqModule ],
					'extraWords': {
						'moduleName': {
							'location': 'procurement.requisition',
							'identifier': 'moduleName',
							'initial': 'Requisition'
						},
						'HeaderGroupHeader': {
							'location': modName,
							'identifier': 'headerForm.headerGroupHeader',
							'initial': 'Header'
						},
						'HeaderGroupDesiredSupplier': {
							'location': modName,
							'identifier': 'headerForm.headerGroupDesiredSupplier',
							'initial': 'headerGroupDesiredSupplier'
						},
						'HeaderGroupDeliveryRequirements': {
							'location': modName,
							'identifier': 'headerForm.headerGroupDeliveryRequirements',
							'initial': 'Delivery Requirements'
						},
						'HeaderGroupUserDefinedFields': {
							'location': modName,
							'identifier': 'headerForm.headerGroupUserDefinedFields',
							'initial': 'headerGroupUserDefinedFields'
						},

						'ReqStatusFk': {
							'location': cloudCommonModule,
							'identifier': 'entityState',
							'initial': 'entityState'
						},
						'ProjectFk': {
							'location': cloudCommonModule,
							'identifier': 'entityProjectNo',
							'initial': 'entityProjectNo'
						},
						'ProjectStatusFk': {
							'location': prcCommonModule,
							'identifier': 'projectStatus',
							'initial': 'Project Status'
						},
						'PackageFk': {
							'location': cloudCommonModule,
							'identifier': 'entityPackage',
							'initial': 'entityPackage'
						},
						'TaxCodeFk': {
							'location': cloudCommonModule,
							'identifier': 'entityTaxCode',
							'initial': 'entityTaxCode'
						},
						'ClerkPrcFk': {
							'location': cloudCommonModule,
							'identifier': 'entityResponsible',
							'initial': 'entityResponsible'
						},
						'ClerkReqFk': {
							'location': cloudCommonModule,
							'identifier': 'entityRequisitionOwner',
							'initial': 'entityRequisitionOwner'
						},
						'BasCurrencyFk': {
							'location': cloudCommonModule,
							'identifier': 'entityCurrency',
							'initial': 'entityCurrency'
						},
						'ExchangeRate': {
							'location': cloudCommonModule,
							'identifier': 'entityRate',
							'initial': 'entityRate'
						},
						'ProjectChangeFk': {
							'location': modName,
							'identifier': 'entityChangeOrder',
							'initial': 'Change Order'
						},
						'Code': {
							'location': modName,
							'identifier': 'code',
							'initial': 'code'
						},
						'ReqHeaderFk': {
							'location': modName,
							'identifier': 'headerGrid.reqheaderBasisRequisition',
							'initial': 'Basis Requisition'
						},
						'MaterialCatalogFk': {
							'location': modName,
							'identifier': 'headerGrid.reqFrameworkMaterialCatalog',
							'initial': 'Framework Material Catalog'
						},
						'DateReceived': {
							'location': cloudCommonModule,
							'identifier': 'entityReceived',
							'initial': 'entityReceived'
						},
						'DateCanceled': {
							'location': cloudCommonModule,
							'identifier': 'entityCancelled',
							'initial': 'entityCancelled'
						},
						'DateRequired': {
							'location': cloudCommonModule,
							'identifier': 'entityRequired',
							'initial': 'entityRequired'
						},
						'ReqTypeFk': {
							'location': cloudCommonModule,
							'identifier': 'entityType',
							'initial': 'entityType'
						},
						'ControllingUnitFk': {
							'location': cloudCommonModule,
							'identifier': 'entityControllingUnitCode',
							'initial': 'entityControllingUnitCode'
						},
						'BasPaymentTermFiFk': {
							'location': cloudCommonModule,
							'identifier': 'entityPaymentTermFI',
							'initial': 'entityPaymentTermFI'
						},
						'BasPaymentTermPaFk': {
							'location': cloudCommonModule,
							'identifier': 'entityPaymentTermPA',
							'initial': 'entityPaymentTermPA'
						},
						'BasPaymentTermAdFk': {
							'location': cloudCommonModule,
							'identifier': 'entityPaymentTermAD',
							'initial': 'Payment Term (AD)'
						},
						'PrcAwardmethodFk': {
							'location': cloudCommonModule,
							'identifier': 'entityAwardMethod',
							'initial': 'entityAwardMethod'
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
							'identifier': 'entitySupplier',
							'initial': 'entitySupplier'
						},
						'IncotermFk': {
							'location': modName,
							'identifier': 'headerForm.reqheaderIncoterms',
							'initial': 'Incoterms'
						},
						'AddressEntity': {
							'location': cloudCommonModule,
							'identifier': 'entityDeliveryAddress',
							'initial': 'entityDeliveryAddress'
						},
						'Remark': {
							'location': cloudCommonModule,
							'identifier': 'entityRemark',
							'initial': 'entityRemark'
						},
						'PrcContracttypeFk': {
							'location': modName,
							'identifier': 'headerGrid.reqheaderContractType',
							'initial': 'Contract Type'
						},
						'UserDefined1': {
							'location': cloudCommonModule,
							'identifier': 'entityUserDefined',
							'initial': 'entityUserDefined',
							param: {'p_0': '1'}
						},
						'UserDefined2': {
							'location': cloudCommonModule,
							'identifier': 'entityUserDefined',
							'initial': 'entityUserDefined',
							param: {'p_0': '2'}
						},
						'UserDefined3': {
							'location': cloudCommonModule,
							'identifier': 'entityUserDefined',
							'initial': 'entityUserDefined',
							param: {'p_0': '3'}
						},
						'UserDefined4': {
							'location': cloudCommonModule,
							'identifier': 'entityUserDefined',
							'initial': 'entityUserDefined',
							param: {'p_0': '4'}
						},
						'UserDefined5': {
							'location': cloudCommonModule,
							'identifier': 'entityUserDefined',
							'initial': 'entityUserDefined',
							param: {'p_0': '5'}
						},
						'Description': {
							'location': modName,
							'identifier': 'requisitionName',
							'initial': 'requisitionName'
						},
						'TotalLeadTime': {
							'location': prcCommonModule,
							'identifier': 'totalLeadTime',
							'initial': 'Total Lead Time'
						},
						'DateEffective': {
							'location': 'basics.common',
							'identifier': 'dateEffective',
							'initial': 'Date Effective'
						},
						'DateDelivery': {
							location: 'basics.common',
							identifier: 'dateDelivered',
							initial: 'Date Delivered'
						},
						'BpdVatGroupFk': {location: prcCommonModule, identifier: 'entityVatGroup', initial: 'Vat Group'},
						'RfqCode': {
							'location': modName,
							'identifier': 'headerGrid.rfqCode',
							'initial': 'RFQ Code'
						},
						'RfqDescription': {
							'location': modName,
							'identifier': 'headerGrid.rfqDescription',
							'initial': 'RFQ Description'
						},
						'OverallDiscount': {
							'location': prcCommonModule,
							'identifier': 'entityOverallDiscount',
							'initial': 'Overall Discount'
						},
						'OverallDiscountOc': {
							'location': prcCommonModule,
							'identifier': 'entityOverallDiscountOc',
							'initial': 'Overall Discount (OC) '
						},
						'OverallDiscountPercent': {
							'location': prcCommonModule,
							'identifier': 'entityOverallDiscountPercent',
							'initial': 'Overall Discount Percent'
						},
						'DeadlineDate': {
							'location': cloudCommonModule,
							'identifier': 'entityDeadline',
							'initial': 'Deadline'
						},
						'DeadlineTime': {
							'location': cloudCommonModule,
							'identifier': 'entityTime',
							'initial': 'Time'
						},
						'SubmissionRequirement': {
							'location': prcCommonModule,
							'identifier': 'submissionRequirement',
							'initial': 'Submission Requirements'
						},
						'SalesTaxMethodFk': {
							'location': prcCommonModule,
							'identifier': 'entitySalesTaxMethodFk',
							'initial': 'Sales Tax Method'
						},
						'DatePriceFixing': {
							'location': modName,
							'identifier': 'entityDatePriceFixing',
							'initial': 'Date Price Fixing'
						},
						'BoqWicCatFk': {
							'location': prcCommonModule,
							'identifier': 'entityFwBoqWicCatFk',
							'initial': 'Framework WIC Group'
						},
						'BoqWicCatBoqFk': {
							'location': prcCommonModule,
							'identifier': 'entityFwBoqWicCatBoqFk',
							'initial': 'Framework WIC BoQ'
						},
						'PlannedStart': {
							'location': procurementPackageModule,
							'identifier': 'entityPlannedStart',
							'initial': 'Planned Start'
						},
						'PlannedEnd': {
							'location': procurementPackageModule,
							'identifier': 'entityPlannedEnd',
							'initial': 'Planned End'
						},
						'DateRequested': {
							'location': procurementPackageModule,
							'identifier': 'dateRequested',
							'initial': 'Publication Date'
						},
						'DateAwardDeadline': {
							'location': procurementPackageModule,
							'identifier': 'dateAwardDeadline',
							'initial': 'Award Deadline'
						}
					}
				},
				'groups': [
					{
						'gid': 'HeaderGroupHeader',
						'attributes': ['id', 'reqstatusfk', 'projectfk', 'projectstatusfk', 'packagefk', 'taxcodefk', 'bpdvatgroupfk', 'clerkprcfk', 'clerkreqfk', 'bascurrencyfk',
							'exchangerate', 'projectchangefk', 'code', 'reqheaderfk', 'materialcatalogfk', 'datereceived', 'datecanceled',
							'daterequired', 'reqtypefk', 'controllingunitfk', 'baspaymenttermfifk', 'baspaymenttermpafk', 'baspaymenttermadfk', 'prcawardmethodfk', 'totalleadtime', 'dateeffective',
							'datedelivery', 'rfqcode', 'rfqdescription', 'overalldiscount', 'overalldiscountoc', 'overalldiscountpercent', 'salestaxmethodfk','datepricefixing', 'boqwiccatfk', 'boqwiccatboqfk',
						     'plannedstart', 'plannedend', 'dateawarddeadline', 'daterequested',]
					}, {
						'gid': 'HeaderGroupDesiredSupplier',
						'attributes': ['businesspartnerfk', 'subsidiaryfk', 'supplierfk']
					}, {
						'gid': 'HeaderGroupDeliveryRequirements',
						'attributes': ['incotermfk', 'addressentity', 'remark', 'prccontracttypefk']
					}, {
						'gid': 'HeaderGroupUserDefinedFields',
						'attributes': ['userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5']
					}, {
						'gid': 'SubmissionRequirement', 'attributes': ['deadlinedate', 'deadlinetime']
					}, {'gid': 'entityHistory', 'isHistory': true}
				],
				'overloads': {
					'id': {
						'readonly': true
					},
					'code': {
						detail: {
							'type': 'directive',
							'directive': 'platform-composite-input',
							'label$tr$': 'procurement.requisition.code',
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
					'reqstatusfk': {
						'grid': {
							'editor': '',
							'editorOptions': null,
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'reqStatus',
								displayMember: 'Description',
								imageSelector: 'platformStatusIconService'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'procurement-requisition-header-status-combobox',
							'options': {
								readOnly: true
							}
						}
					},
					'projectfk': platformLayoutHelperService.provideProjectLookupOverload('prc-req-header-project-filter'),
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
								'lookupOptions': {
									'filterKey': 'procurement-requisition-header-package-filter',
									'showClearButton': true
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'PrcPackage', 'displayMember': 'Code'},
							'width': 125
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'procurement-common-package-lookup',
								'descriptionMember': 'Description',
								'lookupOptions': {
									'initValueField': 'PackageCode',
									'showClearButton': true,
									'filterKey': 'procurement-requisition-header-package-filter'
								}
							}
						}
					},
					'taxcodefk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {'directive': 'basics-master-data-context-tax-code-lookup'},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'TaxCode', 'displayMember': 'Code'},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'basics-master-data-context-tax-code-lookup',
								'descriptionField': 'TaxCodeDescription',
								'descriptionMember': 'DescriptionInfo.Translated',
								'lookupOptions': {'initValueField': 'TaxCode'}
							}
						}
					},
					'clerkprcfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'cloud-clerk-clerk-dialog',
								'lookupOptions': {
									'showClearButton': true
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'clerk', 'displayMember': 'Code'},
							'width': 140
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'cloud-clerk-clerk-dialog',
								'descriptionField': 'ClerkPrcDescription',
								'descriptionMember': 'Description',
								'lookupOptions': {
									'initValueField': 'ClerkPrcCode',
									'showClearButton': true
								}
							}
						}
					},
					'clerkreqfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'cloud-clerk-clerk-dialog',
								'lookupOptions': {
									'showClearButton': true
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'clerk', 'displayMember': 'Code'},
							'width': 140
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'cloud-clerk-clerk-dialog',
								'descriptionField': 'ClerkReqDescription',
								'descriptionMember': 'Description',
								'lookupOptions': {
									'initValueField': 'ClerkReqCode',
									'showClearButton': true
								}
							}
						}
					},
					'baspaymenttermfifk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'lookupOptions': {'showClearButton': true},
								'directive': 'basics-lookupdata-payment-term-lookup'
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'PaymentTerm', 'displayMember': 'Code'},
							'width': 140
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'basics-lookupdata-payment-term-lookup',
								'descriptionMember': 'Description',
								'lookupOptions': {'initValueField': 'PaymentTermFiCode', 'showClearButton': true}
							}
						}
					},
					'baspaymenttermpafk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'lookupOptions': {'showClearButton': true},
								'directive': 'basics-lookupdata-payment-term-lookup'
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'PaymentTerm', 'displayMember': 'Code'},
							'width': 140
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'basics-lookupdata-payment-term-lookup',
								'descriptionMember': 'Description',
								'lookupOptions': {'initValueField': 'PaymentTermPaCode', 'showClearButton': true}
							}
						}
					},
					'baspaymenttermadfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'lookupOptions': {'showClearButton': true},
								'directive': 'basics-lookupdata-payment-term-lookup'
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'PaymentTerm', 'displayMember': 'Code'},
							'width': 140
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'basics-lookupdata-payment-term-lookup',
								'descriptionMember': 'Description',
								'lookupOptions': {'initValueField': 'PaymentTermAdCode', 'showClearButton': true}
							}
						}
					},
					'prcawardmethodfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {'directive': 'basics-procurement-configuration-award-method-combobox'},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'PrcAwardMethod', 'displayMember': 'Description'}
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-procurement-configuration-award-method-combobox',
							'options': {'initValueField': 'AwardMethodDescription'}
						}
					},
					'bascurrencyfk': {
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
					'projectchangefk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'project-change-dialog',
								descriptionMember: 'Description',
								lookupOptions: getProjectChangeLookupOptions()
							}
						},
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
					'reqheaderfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'procurement-requisition-lookup-dialog',
								'lookupOptions': {
									'showClearButton': true,
									'filterKey': 'prc-req-header-filter',
									'dialogOptions': {
										'alerts': [{
											theme: 'info',
											message: 'Setting basis requisition will overwrite quite a lot of related fields',
											message$tr$: 'procurement.common.reqHeaderUpdateInfo'
										}]
									}
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'reqheaderlookupview', 'displayMember': 'Code'},
							'width': 125
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'procurement-requisition-lookup-dialog',
								'descriptionField': 'Description',
								'descriptionMember': 'Description',
								'lookupOptions': {
									'initValueField': 'HeaderForeignCode',
									'filterKey': 'prc-req-header-filter',
									'showClearButton': true,
									'dialogOptions': {
										'alerts': [{
											theme: 'info',
											message: 'Setting basis requisition will overwrite quite a lot of related fields',
											message$tr$: 'procurement.common.reqHeaderUpdateInfo'
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
									'filterKey': 'procurement-req-material-filter',
									'showClearButton': true,
									'title': {
										'name': 'Framework Material Catalog Search Dialog',
										'name$tr$': 'procurement.requisition.frameworkMaterialCatalogSearchDialog'
									}
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'MaterialCatalog', 'displayMember': 'Code'},
							'width': 125
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'basics-material-material-catalog-lookup',
								'descriptionField': 'MaterialCatalogDescription',
								'descriptionMember': 'DescriptionInfo.Translated',
								'lookupOptions': {
									'initValueField': 'MaterialCatalogCode',
									'showClearButton': true,
									'filterKey': 'procurement-req-material-filter',
									'title': {
										'name': 'Framework Material Catalog Search Dialog',
										'name$tr$': 'procurement.contract.frameworkMaterialCatalogSearchDialog'
									}
								}
							}
						}
					},
					'reqtypefk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {'directive': 'prc-req-header-requisition-type-combobox'},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'ReqType', 'displayMember': 'Description'},
							'width': 145
						},
						'detail': {
							'type': 'directive',
							'directive': 'prc-req-header-requisition-type-combobox',
							'options': {'initValueField': 'TypeDescription'}
						}
					},
					'controllingunitfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								// 'directive': 'basics-master-data-context-controlling-unit-lookup',
								'lookupDirective': 'controlling-structure-dialog-lookup',
								'lookupOptions': {
									'filterKey': 'prc-req-controlling-unit-filter',
									'showClearButton': true,
									considerPlanningElement: true,
									selectableCallback: function (dataItem) {
										return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, procurementRequisitionHeaderDataService);
									}
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'Controllingunit', 'displayMember': 'Code'},
							'width': 140
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								// 'lookupDirective': 'basics-master-data-context-controlling-unit-lookup',
								'lookupDirective': 'controlling-structure-dialog-lookup',
								'descriptionField': 'ControllingunitDescription',
								'descriptionMember': 'DescriptionInfo.Translated',
								'lookupOptions': {
									'filterKey': 'prc-req-controlling-unit-filter',
									'initValueField': 'ControllingunitCode',
									'showClearButton': true,
									considerPlanningElement: true,
									selectableCallback: function (dataItem) {
										return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, procurementRequisitionHeaderDataService);
									}
								}
							}
						}
					},
					'businesspartnerfk': {
						'navigator': {
							moduleName: 'businesspartner.main'
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								// 'directive': 'business-partner-main-business-partner-dialog'
								'directive': 'filter-business-partner-dialog-lookup',
								'lookupOptions': {
									'showClearButton': true,
									'IsShowBranch': true,
									'mainService': 'procurementRequisitionHeaderDataService',
									'BusinessPartnerField': 'BusinesspartnerFk',
									'SubsidiaryField': 'SubsidiaryFk',
									'SupplierField': 'SupplierFk',
									'PaymentTermFiField': 'BasPaymentTermFiFk',
									'PaymentTermPaField': 'BasPaymentTermPaFk'
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'BusinessPartner',
								'displayMember': 'BusinessPartnerName1'
							},
							'width': 130
						},
						'detail': {
							'type': 'directive',
							// 'directive': 'business-partner-main-business-partner-dialog'
							'directive': 'filter-business-partner-dialog-lookup',
							'options': {
								'showClearButton': true,
								'IsShowBranch': true,
								'mainService': 'procurementRequisitionHeaderDataService',
								'BusinessPartnerField': 'BusinesspartnerFk',
								'SubsidiaryField': 'SubsidiaryFk',
								'SupplierField': 'SupplierFk',
								'paymentTermFiField': 'BasPaymentTermFiFk',
								'paymentTermPaField': 'BasPaymentTermPaFk'
							}
						}
					},
					'subsidiaryfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'business-partner-main-subsidiary-lookup',
								'lookupOptions': {
									'showClearButton': true,
									'filterKey': 'prc-req-header-businesspartner-subsidiary-filter',
									'displayMember': 'AddressLine'
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'Subsidiary', 'displayMember': 'AddressLine'},
							'width': 125
						},
						'detail': {
							'type': 'directive',
							'directive': 'business-partner-main-subsidiary-lookup',
							'options': {
								'initValueField': 'SubsidiaryAddress',
								'filterKey': 'prc-req-header-businesspartner-subsidiary-filter',
								'showClearButton': true,
								'displayMember': 'AddressLine'
							}
						}
					},
					'supplierfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'business-partner-main-supplier-lookup',
								'lookupOptions': {
									'filterKey': 'prc-req-header-businesspartner-supplier-filter',
									'showClearButton': true
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'supplier', 'displayMember': 'Code'},
							'width': 125
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'business-partner-main-supplier-lookup',
								'descriptionField': 'SupplierDescription',
								'descriptionMember': 'Description',
								'lookupOptions': {
									'filterKey': 'prc-req-header-businesspartner-supplier-filter',
									'showClearButton': true
								}
							}
						}
					},
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
								lookupOptions: {showClearButton: true},
								directive: 'basics-lookupdata-incoterm-combobox'
							},
							width: 125,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'prcincoterm',
								displayMember: 'Code'
							}
						}
					},
					'prccontracttypefk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {'directive': 'basics-procurement-configuration-contract-type-combobox'},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'PrcContractType', 'displayMember': 'Description'}
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-procurement-configuration-contract-type-combobox',
							'options': {'initValueField': 'ContractTypeDescription'}
						}
					},
					'prjcontracttypefk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {'directive': 'basics-procurement-configuration-prj-contract-type-combobox'},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'prjcontracttype', 'displayMember': 'Description'}
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-procurement-configuration-prj-contract-type-combobox',
							'options': {'initValueField': 'ContractTypeDescription'}
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
									'showClearButton': true
								}
							},
							'formatter': basicsCommonComplexFormatter,
							'formatterOptions': {'displayMember': 'AddressLine'},
							'width': 125
						},
						'detail': {
							'type': 'directive',
							'directive': 'procurement-common-address-complex-control',
							'options': {
								'titleField': 'cloud.common.entityDeliveryAddress',
								'foreignKey': 'AddressFk',
								'showClearButton': true
							}
						}
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
					'totalleadtime': {
						'readonly': true
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
								procurementRequisitionHeaderDataService.cellChange(item, field);
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
					'rfqcode': {
						'readonly': true,
						'grid': {
							formatter: function (row, cell, value) {
								if (value !== null && value !== undefined) {
									var valueList = value.split(',');
									if (valueList.length > 1) {
										return '*';
									}
									return valueList;
								} else {
									return '';
								}

							}
						}
					},
					'rfqdescription': {
						'readonly': true
					},
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
									'filterKey': 'prc-req-wic-cat-boq-filter'
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
									'filterKey': 'prc-req-wic-cat-boq-filter'
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
				},
				'addition': {
					'grid': [
						{
							'afterId': 'code',
							id: 'description',
							field: 'Description',
							name$tr$: 'procurement.requisition.requisitionName',
							editor: 'description',
							formatter: 'description',
							grouping: {
								title: 'procurement.requisition.requisitionName',
								getter: 'Description',
								aggregators: [],
								aggregateCollapsed: true
							},
							width: 150
						}, {
							'afterId': 'description',
							'id': 'configuration',
							'field': 'PrcHeaderEntity.ConfigurationFk',
							'name': 'Configuration',
							'name$tr$': 'procurement.requisition.headerGrid.reqheaderPrcConfiguration',
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-configuration-configuration-combobox',
								'lookupField': 'PrcHeaderEntity.ConfigurationFk',
								'lookupOptions': {'filterKey': 'prc-req-configuration-filter'}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'PrcConfiguration', 'displayMember': 'DescriptionInfo.Translated'},
							'width': 135,
							'grouping': {
								'title': 'procurement.requisition.headerGrid.reqheaderPrcConfiguration',
								'getter': 'PrcHeaderEntity.ConfigurationFk',
								'aggregators': [],
								'aggregateCollapsed': true
							}
						}, {
							'lookupDisplayColumn': true,
							'field': 'PackageFk',
							'displayMember': 'Description',
							'name$tr$': 'cloud.common.entityPackageDescription',
							'width': 125
						}, {
							'field': 'PackageFk',
							'name$tr$': 'procurement.common.packageDuration',
							'width': 125,
							'formatter': function (row, cell, value) {
								var dataItem = basicsLookupdataLookupDescriptorService.getLookupItem('PrcPackage', value);
								return formatPackageDuration(dataItem);
							}
						}, {
							'navigator': {
								moduleName: 'basics.procurementstructure'// ,
								// registerService: 'basicsProcurementStructureService'
							},
							'afterId': 'PackageFkDescription',
							'id': 'structure',
							'field': 'PrcHeaderEntity.StructureFk',
							'name$tr$': 'cloud.common.entityStructureCode',
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-procurementstructure-structure-dialog',
								'lookupOptions': {'showClearButton': true}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'prcstructure',
								'displayMember': 'Code'
							},
							'width': 100,
							'grouping': {
								'title': 'cloud.common.entityStructureCode',
								'getter': 'PrcHeaderEntity.StructureFk',
								'aggregators': [],
								'aggregateCollapsed': true
							}
						}, {
							'afterId': 'structure',
							'id': 'structureDescription',
							'field': 'PrcHeaderEntity.StructureFk',
							'name$tr$': 'cloud.common.entityStructureDescription',
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'prcstructure',
								'displayMember': 'DescriptionInfo.Translated'
							},
							'width': 150,
							'grouping': {
								'title': 'cloud.common.entityStructureDescription',
								'getter': 'PrcHeaderEntity.StructureFk',
								'aggregators': [],
								'aggregateCollapsed': true
							}
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
							'name$tr$': 'cloud.common.entityResponsibleDescription',
							'width': 140
						}, {
							'lookupDisplayColumn': true,
							'field': 'ClerkReqFk',
							'displayMember': 'Description',
							'name$tr$': 'cloud.common.entityRequisitionOwnerDescription',
							'width': 140
						}, {
							'lookupDisplayColumn': true,
							'field': 'BasPaymentTermFiFk',
							'displayMember': 'Description',
							'name$tr$': 'cloud.common.entityPaymentTermFiDescription',
							'width': 140
						}, {
							'lookupDisplayColumn': true,
							'field': 'BasPaymentTermPaFk',
							'displayMember': 'Description',
							'name$tr$': 'cloud.common.entityPaymentTermPaDescription',
							'width': 140
						}, {
							'lookupDisplayColumn': true,
							'field': 'BasPaymentTermAdFk',
							'displayMember': 'Description',
							'name$tr$': 'cloud.common.entityPaymentTermAdDescription',
							'width': 140
						}, {
							'lookupDisplayColumn': true,
							'field': 'ProjectChangeFk',
							'displayMember': 'Description',
							'name$tr$': 'procurement.common.projectChangeDescription',
							'width': 155
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
							'width': 120
						}, {
							'lookupDisplayColumn': true,
							'field': 'ReqHeaderFk',
							'displayMember': 'Description',
							'name$tr$': 'procurement.requisition.headerGrid.reqheaderBasisRequisitionDescription',
							'width': 125
						}, {
							'lookupDisplayColumn': true,
							'field': 'MaterialCatalogFk',
							'displayMember': 'DescriptionInfo.Translated',
							'name$tr$': 'procurement.common.FrameworkContractDescription',
							'width': 155
						}, {
							'lookupDisplayColumn': true,
							'field': 'ControllingUnitFk',
							'displayMember': 'DescriptionInfo.Translated',
							'name$tr$': 'cloud.common.entityControllingUnitDesc',
							'width': 140
						}, {
							'afterId': 'ControllingUnitFkDescription',
							'id': 'strategy',
							'field': 'PrcHeaderEntity.StrategyFk',
							'name': 'Strategy',
							'name$tr$': 'procurement.requisition.headerGrid.reqheaderStrategy',
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'procurement-common-strategy-combobox',
								'lookupOptions': {'filterKey': 'prc-req-header-strategy-filter'}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'prcconfig2strategy', 'displayMember': 'Description'},
							'width': 85,
							'grouping': {
								'title': 'procurement.requisition.headerGrid.reqheaderStrategy',
								'getter': 'PrcHeaderEntity.StrategyFk',
								'aggregators': [],
								'aggregateCollapsed': true
							}
						}, {
							'lookupDisplayColumn': true,
							'field': 'SupplierFk',
							'displayMember': 'Description',
							'name$tr$': 'cloud.common.entitySupplierDescription',
							'width': 125
						}, {
							'lookupDisplayColumn': true,
							'field': 'PackageFk',
							'displayMember': 'TextInfo',
							'name$tr$': 'procurement.common.entityPackageTextInfo',
							'width': 125
						}],
					'detail': [
						{
							'afterId': 'code',
							'gid': 'HeaderGroupHeader',
							'rid': 'PrcHeaderEntity.ConfigurationFk',
							'label': 'Configuration',
							'label$tr$': 'procurement.requisition.headerGrid.reqheaderPrcConfiguration',
							'type': 'directive',
							'model': 'PrcHeaderEntity.ConfigurationFk',
							'directive': 'basics-configuration-configuration-combobox',
							'options': {
								filterKey: 'prc-req-configuration-filter',
								initValueField: 'ConfigurationDescription'// , readOnly: true
							}
						}, {
							'navigator': {
								moduleName: 'basics.procurementstructure'// ,
								// registerService: 'basicsProcurementStructureService'
							},
							'afterId': 'PackageFk',
							'gid': 'HeaderGroupHeader',
							'rid': 'PrcHeaderEntity.StructureFk',
							'label': 'Procurement Structure',
							'label$tr$': 'basics.common.entityPrcStructureFk',
							'model': 'PrcHeaderEntity.StructureFk',
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'basics-procurementstructure-structure-dialog',
								descriptionField: 'StructureDescription',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									initValueField: 'StructureCode',
									showClearButton: true
								}
							}
						}, {
							'afterId': 'StructureFk',
							'gid': 'HeaderGroupHeader',
							'rid': 'PrcHeaderEntity.StrategyFk',
							'label': 'Strategy',
							'label$tr$': 'cloud.common.EntityStrategy',
							'type': 'directive',
							'model': 'PrcHeaderEntity.StrategyFk',
							'directive': 'procurement-common-strategy-combobox',
							'options': {filterKey: 'prc-req-header-strategy-filter'}
						}, {
							'afterId': 'TaxCodeFk',
							'gid': 'HeaderGroupHeader',
							'rid': 'PackageDuration',
							'label': 'Package Duration',
							'label$tr$': 'procurement.common.packageDuration',
							'model': 'PackageFk',
							'type': 'directive',
							'directive': 'procurement-common-package-lookup',
							'options': {
								'formatter': function (value, displayItem) {
									return formatPackageDuration(displayItem);
								}
							},
							'readonly': true
						}, {
							'afterId': 'PackageDuration',
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
							'afterId': 'ProjectChangeFk',
							'rid': 'ProjectChangeType',
							'gid': 'HeaderGroupHeader',
							'model': 'ProjectChangeFk',
							'label': 'Change Type',
							'label$tr$': 'project.main.entityChangeType',
							'type': 'directive',
							'directive': 'project-change-dialog',
							'readonly': true,
							'options': {
								'displayMember': 'ProjectChangeType'
							}
						}]
				}
			};

			function formatPackageDuration(dataItem) {
				if (!dataItem) {
					return '';
				}

				var dateStart = '';
				var dateEnd = '';

				if (dataItem.ActualStart) {
					dateStart = formatDate(dataItem.ActualStart);
				} else if (dataItem.PlannedStart) {
					dateStart = formatDate(dataItem.PlannedStart);
				}

				if (dataItem.ActualEnd) {
					dateEnd = formatDate(dataItem.ActualEnd);
				} else if (dataItem.PlannedEnd) {
					dateEnd = formatDate(dataItem.PlannedEnd);
				}

				return dateStart + ' - ' + dateEnd;
			}

			function formatDate(value) {
				var domainInfo = platformDomainService.loadDomain('date');

				if (_.isString(value)) {
					if (domainInfo.datatype.indexOf('utc') !== -1) {
						value = moment.utc(value);
					} else {
						value = moment(value);
					}
				}

				if (!value) {
					return '';
				}

				return value.isValid() ? value.format(domainInfo.format || 'L') : '';
			}

			var basicsClerkFormatService = $injector.get('basicsClerkFormatService');
			config.overloads.clerkreqfk.grid.formatter = basicsClerkFormatService.formatClerk;
			config.overloads.clerkprcfk.grid.formatter = basicsClerkFormatService.formatClerk;

			return config;
		}]);

	mod.factory('procurementRequisitionHeaderUIStandardService',
		['platformUIStandardConfigService', 'procurementRequisitionTranslationService',
			'procurementRequisitionHeaderLayout', 'platformSchemaService', 'platformUIStandardExtentService',
			'platformModuleEntityCreationConfigurationService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService,
					  platformModuleEntityCreationConfigurationService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'ReqHeaderDto',
					moduleSubModule: 'Procurement.Requisition'
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

				const entityInformation = { module: mod, moduleName: 'Procurement.Requisition', entity: 'ReqHeader' };
				var service = new BaseService(layout, domainSchema, translationService, entityInformation);

				platformUIStandardExtentService.extend(service, layout.addition, domainSchema);

				let conf = platformModuleEntityCreationConfigurationService.getEntity(modName, entityInformation.entity);
				if (conf) {
					let dialogColumns = conf.ColumnsForCreateDialog;
					if (dialogColumns.length > 0) {

						let addressCol = _.find(dialogColumns, function (col) {
							return col.PropertyName === 'AddressFk';
						});

						let prcHeaderCol = _.find(dialogColumns, function (col) {
							return col.PropertyName === 'PrcHeaderFk';
						});

						let rows = service.getStandardConfigForDetailView().rows || [];
						let columns = service.getStandardConfigForListView().columns || [];

						if (addressCol) {
							let addressRow = _.find(rows, {model: 'AddressEntity'});
							let addressColumn = _.find(columns, { field: 'AddressEntity' });
							if (addressCol.IsReadonly === 'true') {
								if (addressRow) {
									addressRow.readonly = true;
								}
								if (addressColumn) {
									addressColumn.editor = null;
									addressColumn.editorOptions = null;
								}
							}
							if (addressCol.IsMandatory === 'true') {
								if (addressRow) {
									addressRow.required = true;
								}
								if (addressColumn) {
									addressColumn.required = true;
								}
							}
						}

						if (prcHeaderCol) {
							_.forEach(rows, function (row) {
								if (!row.model) {
									return;
								}
								let models = row.model.split('.');
								if (models.length < 2 || models[0] !== 'PrcHeaderEntity' || models[1] !== 'ConfigurationFk') {
									return;
								}
								if (prcHeaderCol.IsReadonly === 'true') {
									row.readonly = true;
								}
								if (prcHeaderCol.IsMandatory === 'true') {
									row.required = true;
								}
							});
							_.forEach(columns, function (col) {
								if (!col.field) {
									return;
								}
								let fields = col.field.split('.');
								if (fields.length < 2 || fields[0] !== 'PrcHeaderEntity' || fields[1] !== 'ConfigurationFk') {
									return;
								}
								if (prcHeaderCol.IsReadonly === 'true') {
									col.editor = null;
									col.editorOptions = null;
								}
							});
						}

						_.forEach(columns, function (col) {
							let dlgCol = _.find(dialogColumns, { PropertyName: col.field });
							if (dlgCol && dlgCol.IsReadonly === 'true') {
								col.editor = null;
								col.editorOptions = null;
							}
						});
					}
				}

				return service;

			}
		]);

})(angular, moment);
