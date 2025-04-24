/**
 * Created by lnb on 4/14/2015.
 */
(function (angular) {
	'use strict';


	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	var modName = 'procurement.package';
	var bpModleName = 'businesspartner.main';

	angular.module(modName).factory('procurementPackageLayout', ['basicsLookupdataConfigGenerator', 'basicsLookupdataLookupDescriptorService',
		'platformGridDomainService', 'platformObjectHelper', 'procurementPackageImageFormatter',
		'basicsCommonComplexFormatter', 'platformModuleNavigationService', '$injector', 'platformLayoutHelperService', 'procurementPackageDataService', 'cloudDesktopNavigationPermissionService',
		function (basicsLookupdataConfigGenerator, lookupDescriptorService,
			platformGridDomainService, platformObjectHelper, procurementPackageImageFormatter,
			basicsCommonComplexFormatter, naviservice, $injector, platformLayoutHelperService, procurementPackageDataService, navigationPermissionService) {
			// baselineupdate : localdate from baseline
			var config;
			config = {
				'fid': 'package.detail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'change': 'change',
				'groups': [
					{
						'gid': 'HeaderGroupHeader',
						'attributes': ['id', 'projectfk', 'projectstatusfk', 'companyfk', 'comcurrencycode', 'packagestatusfk', 'code', 'structurefk', 'configurationfk',
							'prccontracttypefk', 'currencyfk', 'exchangerate', 'reference', 'plannedstart', 'plannedend', 'actualstart', 'actualend',
							'quantity', 'uomfk', 'packagetypefk', 'clerkprcfk', 'clerkreqfk', 'taxcodefk', 'bpdvatgroupfk',
							'remark', 'remark2', 'remark3', 'schedulefk', 'activityfk', 'assetmasterfk', 'totalleadtime', 'baselinepath', 'baselineupdate', 'baselinephase', 'baselineupdatestatus',
							'dateeffective', 'datedelivery', 'mdccontrollingunitfk', 'overalldiscount', 'overalldiscountoc', 'overalldiscountpercent', 'textinfo', 'prccopymodefk', 'salestaxmethodfk',
						     'dateawarddeadline','daterequested']
					},
					{
						'gid': 'projectAddressGroup',
						'attributes': ['countryfk', 'addressentity', 'regionfk', 'telephonenumberfk', 'telephonetelefaxfk', 'telephonemobilefk', 'email']
					},
					{
						'gid': 'Event',
						'attributes': []
					},
					{
						'gid': 'Requisition',
						'attributes': ['requisitioncode', 'requisitionstatus']
					},
					{
						'gid': 'RfQ',
						'attributes': ['rfqcode', 'rfqstatus']
					},
					{
						'gid': 'Quote',
						'attributes': []
					},
					{
						'gid': 'Contract',
						'attributes': ['contractcode', 'businesspartnername', 'businesspartnersubsidiaryname', 'suppliernumber', 'contractstatus']
					},
					{
						'gid': 'ExternalResponsible',
						'attributes': ['businesspartnerfk', 'subsidiaryfk', 'supplierfk']
					},
					{
						'gid': 'Performance',
						'attributes': []
					},
					{
						'gid': 'Total',
						'attributes': []
					},
					{
						'gid': 'HeaderGroupUserDefinedFields',
						'attributes': ['userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5',
							'userdefineddate1', 'userdefineddate2', 'userdefineddate3', 'userdefineddate4', 'userdefineddate5']
					},
					{
						'gid': 'SubmissionRequirement',
						'attributes': ['deadlinedate', 'deadlinetime']
					},
					{'gid': 'entityHistory', 'isHistory': true}
				],
				'translationInfos': {
					'extraModules': [modName, bpModleName]  // it is needed.
				},
				'overloads': {
					'id': {
						'readonly': true
					},
					'comcurrencycode': {
						readonly: true,
						'detail': {
							'type': 'directive',
							'directive': 'platform-composite-input',
							'label$tr$': 'procurement.package.ComCurrencyCode',
							'model': 'comcurrencycode',// use for validator
							'options': {
								'rows': [{
									'type': 'code',
									'model': 'ComCurrencyCode',
									'cssLayout': 'xs-12 sm-12 md-4 lg-4',
									'readonly': true
								}, {
									'type': 'description',
									'model': 'ComCurrencyDes',
									'cssLayout': 'xs-12 sm-12 md-8 lg-8',
									'readonly': true
								}]
							}
						}
					},
					'code': {
						'navigator': {
							moduleName: 'itwo 5d material purchase or subcontractor package'
						},
						'detail': {
							'type': 'directive',
							'directive': 'platform-composite-input',
							'label$tr$': 'cloud.common.entityCode',
							'model': 'Code',// use for validator
							'options': {
								'rows': [{
									'type': 'code',
									'model': 'Code',
									'cssLayout': 'xs-12 sm-12 md-4 lg-4'
								}, {
									'type': 'description',
									'model': 'Description',
									'cssLayout': 'xs-12 sm-12 md-8 lg-8'
								}]
							}
						}
					},
					'projectfk': platformLayoutHelperService.provideProjectLookupOverload('procurement-package-header-project-filter', 'ProjectFk'),
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
					'companyfk': {
						'readonly': true,
						'grid': {
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
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'basics-company-company-lookup',
								descriptionMember: 'CompanyName'
							}
						}
					},
					'packagestatusfk': {
						'readonly': true,
						'grid': {
							'editor': '',
							'editorOptions': null,
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'PackageStatus',
								'displayMember': 'DescriptionInfo.Translated',
								'imageSelector': 'platformStatusIconService'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'procurement-package-status-combobox'
						}
					},
					'structurefk': {
						navigator: {
							moduleName: 'basics.procurementstructure'
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-procurementstructure-structure-dialog',
								'lookupOptions': {
									'showClearButton': true
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'prcstructure',
								'displayMember': 'Code'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'basics-procurementstructure-structure-dialog',
								'descriptionField': 'StructureDescription',
								'descriptionMember': 'DescriptionInfo.Translated',
								'lookupOptions': {
									'initValueField': 'StructureCode',
									'showClearButton': true
								}
							}
						}
					},
					'configurationfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-configuration-configuration-combobox',
								'lookupOptions': {
									'filterKey': 'procurement-package-configuration-filter'
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'PrcConfiguration',
								'displayMember': 'DescriptionInfo.Translated'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-configuration-configuration-combobox',
							'options': {
								'filterKey': 'procurement-package-configuration-filter'
							}
						}
					},
					'prccontracttypefk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-procurement-configuration-contract-type-combobox'
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-procurement-configuration-contract-type-combobox'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PrcContractType',
								displayMember: 'Description'
							}
						}
					},
					'prjcontracttypefk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-procurement-configuration-prj-contract-type-combobox'
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-procurement-configuration-prj-contract-type-combobox'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'prjcontracttype',
								displayMember: 'Description'
							}
						}
					},
					'currencyfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCurrencyLookupDataService',
						enableCache: true
					}),
					'uomfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-lookupdata-uom-lookup'
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'Uom',
								'displayMember': 'Unit'
							},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-uom-lookup'
						}
					},
					'packagetypefk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'procurement-package-type-combobox',
								'lookupOptions': {
									'showClearButton': true
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'PrcPackageType',
								'displayMember': 'DescriptionInfo.Translated'
							},
							'width': 140
						},
						'detail': {
							'type': 'directive',
							'directive': 'procurement-package-type-combobox',
							'options': {
								'showClearButton': true
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
							'formatterOptions': {
								'lookupType': 'clerk',
								'displayMember': 'Code'
							},
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
							'formatterOptions': {
								'lookupType': 'clerk',
								'displayMember': 'Code'
							},
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
					'taxcodefk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-master-data-context-tax-code-lookup'
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'TaxCode',
								'displayMember': 'Code'
							},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'basics-master-data-context-tax-code-lookup',
								'descriptionField': 'TaxCodeDescription',
								'descriptionMember': 'DescriptionInfo.Translated',
								'lookupOptions': {
									'initValueField': 'TaxCode'
								}
							}
						}
					},
					'schedulefk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'packageSchedulingLookupService',
						showClearButton: true,
						isComposite: true,
						desMember: 'DescriptionInfo.Translated',
						dispMember: 'Code',
						filter: function (item) {
							var prj;
							if (item) {
								prj = item.ProjectFk;
							}
							return prj;
						},
						'navigator': {
							moduleName: 'scheduling.main'
						}
					}),
					'activityfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'scheduling-main-activity-structure-lookup',
								'lookupOptions': {
									'filterKey': 'procurement-package-scheduling-activity-filter',
									'showClearButton': true
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'SchedulingActivity',
								'displayMember': 'Code'
							},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'scheduling-main-activity-structure-lookup',
								'descriptionMember': 'Description',
								'lookupOptions': {
									'filterKey': 'procurement-package-scheduling-activity-filter',
									'showClearButton': true
								}
							}
						}
					},
					'assetmasterfk': {
						'navigator': {
							moduleName: 'basics.assetmaster'
						},
						grid: {
							formatter: 'lookup',
							formatterOptions: {lookupType: 'AssertMaster', displayMember: 'Code'},
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-asset-master-dialog',
								lookupOptions: {
									'filterKey': 'basics-asset-master-filter',
									showClearButton: true,
									additionalColumns: true,
									displayMember: 'Code',
									addGridColumns: [{
										id: 'Description',
										field: 'DescriptionInfo',
										name: 'Description',
										width: 300,
										formatter: 'translation',
										name$tr$: 'cloud.common.entityDescription'
									}]
								}
							},
							width: 150
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-asset-master-dialog',
								'descriptionMember': 'DescriptionInfo.Translated',
								lookupOptions: {
									'showClearButton': true,
									'filterKey': 'basics-asset-master-filter'
								}
							}
						}
					},
					'requisitioncode': {
						'readonly': true,
						navigator: {
							moduleName: 'procurement.requisition'
						},
						'detail': {
							'type': 'directive',
							'directive': 'platform-composite-input',
							'model': 'RequisitionCode',// use for validator
							'options': {
								'rows': [{
									'type': 'code',
									'model': 'RequisitionCode',
									'cssLayout': 'xs-12 sm-12 md-4 lg-4',
									'readonly': true
								}, {
									'type': 'description',
									'model': 'RequisitionDescription',
									'cssLayout': 'xs-12 sm-12 md-8 lg-8',
									'validate': false,
									'readonly': true
								}]
							}
						}
					},
					'requisitionstatus': {
						'readonly': true,
						'grid': {
							'formatter': procurementPackageImageFormatter,
							'formatterOptions': {
								'imageSelector': 'platformStatusIconService',
								'complexField': 'Requisition2PackageData.ReqHeaderFk',
								'lookupType': 'ReqHeaderLookupView'
							},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'prc-package-status-image-directive',
							'options': {
								'displayMember': 'RequisitionStatus',
								'imageSelector': 'platformStatusIconService',
								'complexField': 'Requisition2PackageData.ReqHeaderFk',
								'lookupType': 'ReqHeaderLookupView'
							}
						}
					},
					'rfqcode': {
						'readonly': true,
						navigator: {
							moduleName: 'procurement.rfq'
						},
						'detail': {
							'type': 'directive',
							'directive': 'platform-composite-input',
							'model': 'RfqCode',// use for validator
							'options': {
								'rows': [{
									'type': 'code',
									'model': 'RfqCode',
									'cssLayout': 'xs-12 sm-12 md-4 lg-4',
									'readonly': true
								}, {
									'type': 'description',
									'model': 'RfqDescription',
									'cssLayout': 'xs-12 sm-12 md-8 lg-8',
									'validate': false,
									'readonly': true
								}]
							}
						}
					},
					'rfqstatus': {
						'readonly': true,
						'grid': {
							formatter: procurementPackageImageFormatter,
							formatterOptions: {
								'imageSelector': 'platformStatusIconService',
								'complexField': 'Rfq2PackageData.RfqHeaderFk',// this is for imageFormatter to get rfqHeaderfk
								'lookupType': 'RfqHeader'
							},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'prc-package-status-image-directive',
							'options': {
								'displayMember': 'RfqStatus',
								'imageSelector': 'platformStatusIconService',
								'complexField': 'Rfq2PackageData.RfqHeaderFk',
								'lookupType': 'RfqHeader'
							}
						}
					},
					'contractcode': {
						'readonly': true,
						navigator: {
							moduleName: 'procurement.contract'
						},
						'detail': {
							'type': 'directive',
							'directive': 'platform-composite-input',
							'model': 'ContractCode',// use for validator
							'options': {
								'rows': [{
									'type': 'code',
									'model': 'ContractCode',
									'cssLayout': 'xs-12 sm-12 md-4 lg-4',
									'readonly': true
								}, {
									'type': 'description',
									'model': 'ContractDescription',
									'cssLayout': 'xs-12 sm-12 md-8 lg-8',
									'validate': false,
									'readonly': true
								}]
							}
						}
					},
					'businesspartnername': {'readonly': true},
					'businesspartnersubsidiaryname': {'readonly': true},
					'suppliernumber': {'readonly': true},
					'totalleadtime': {'readonly': true},
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
									'mainService': 'procurementPackageDataService',
									'BusinessPartnerField': 'BusinesspartnerFk',
									'SubsidiaryField': 'SubsidiaryFk',
									'SupplierField': 'SupplierFk'
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
								'mainService': 'procurementPackageDataService',
								'BusinessPartnerField': 'BusinesspartnerFk',
								'SubsidiaryField': 'SubsidiaryFk',
								'SupplierField': 'SupplierFk'
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
									'filterKey': 'prc-package-businesspartner-subsidiary-filter',
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
								'filterKey': 'prc-package-businesspartner-subsidiary-filter',
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
									'filterKey': 'prc-package-businesspartner-supplier-filter',
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
									'filterKey': 'prc-package-businesspartner-supplier-filter',
									'showClearButton': true
								}
							}
						}
					},
					'contractstatus': {
						'readonly': true,
						'grid': {
							formatter: procurementPackageImageFormatter,
							formatterOptions: {
								'imageSelector': 'platformStatusIconService',
								'complexField': 'Contract2PackageData.ConHeaderFk',
								'lookupType': 'ConHeader'
							},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'prc-package-status-image-directive',
							'options': {
								'displayMember': 'ContractStatus',
								'imageSelector': 'platformStatusIconService',
								'complexField': 'Contract2PackageData.ConHeaderFk',
								'lookupType': 'ConHeader'
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
									'showClearButton': true
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
								'showClearButton': true
							}
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
					'baselinepath': {'readonly': true},
					'baselineupdate': {
						'readonly': true,
						'type': 'datetimeutc'
					},
					'baselinephase': {
						'readonly': true,
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'PackageBaselinePhaseLookup', 'displayMember': 'Description'},
						},
						'detail': {
							'type': 'directive',
							'directive': 'procurement-package-baseline-phase-lookup',
							'options': {'displayMember': 'Description'}
						}
					},
					'baselineupdatestatus': {
						'readonly': true
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
								procurementPackageDataService.cellChange(item, field);
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
					countryfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCountryLookupDataService',
						enableCache: true
					}),
					regionfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('project.main.region'),
					'telephonenumberfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-common-telephone-dialog',
							'model': 'TelephoneNumber',
							'options': {
								titleField: 'cloud.common.TelephoneDialogPhoneNumber',
								foreignKey: 'TelephoneNumberFk',
								showClearButton: true
							}
						}, 'grid': {
							'editor': 'lookup',
							'field': 'TelephoneNumber',
							'editorOptions': {
								'lookupDirective': 'basics-common-telephone-dialog',
								'lookupOptions': {
									foreignKey: 'TelephoneNumberFk',
									titleField: 'cloud.common.TelephoneDialogPhoneNumber'
								}
							},
							formatter: basicsCommonComplexFormatter,
							formatterOptions: {
								displayMember: 'Telephone',
								domainType: 'phone'
							}
						}
					},
					'telephonetelefaxfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-common-telephone-dialog',
							'model': 'TelephoneNumberTelefax',
							'options': {
								titleField: 'cloud.common.fax',
								foreignKey: 'TelephoneTelefaxFk',
								showClearButton: true
							}
						},
						'grid': {
							'editor': 'lookup',
							'field': 'TelephoneNumberTelefax',
							'editorOptions': {
								'lookupDirective': 'basics-common-telephone-dialog',
								'lookupOptions': {
									foreignKey: 'TelephoneTelefaxFk',
									titleField: 'cloud.common.fax'
								}
							},
							formatter: basicsCommonComplexFormatter,
							formatterOptions: {
								displayMember: 'Telephone',
								domainType: 'phone'
							}
						}
					},
					'telephonemobilefk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-common-telephone-dialog',
							'model': 'TelephoneMobil',
							'options': {
								titleField: 'cloud.common.mobile',
								foreignKey: 'TelephoneMobileFk',
								showClearButton: true
							}
						},
						'grid': {
							'editor': 'lookup',
							'field': 'TelephoneMobil',
							'editorOptions': {
								'lookupDirective': 'basics-common-telephone-dialog',
								'lookupOptions': {
									foreignKey: 'TelephoneMobileFk',
									titleField: 'cloud.common.mobile'
								}
							},
							formatter: basicsCommonComplexFormatter,
							formatterOptions: {
								displayMember: 'Telephone',
								domainType: 'phone'
							}
						}
					},
					'mdccontrollingunitfk': {
						navigator: {
							moduleName: 'controlling.structure'
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'lookupDirective': 'controlling-structure-dialog-lookup',
								'lookupOptions': {
									'filterKey': 'prc-con-controlling-by-prj-filter',
									'showClearButton': true,
									considerPlanningElement: true,
									selectableCallback: function (dataItem) {
										return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, procurementPackageDataService);
									}
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'ControllingUnit',
								'displayMember': 'Code'
							},
							'width': 80
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'controlling-structure-dialog-lookup',
								'descriptionMember': 'DescriptionInfo.Translated',
								'lookupOptions': {
									'filterKey': 'prc-con-controlling-by-prj-filter',
									'showClearButton': true,
									considerPlanningElement: true,
									selectableCallback: function (dataItem) {
										return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, procurementPackageDataService);
									}
								}
							}
						}
					},
					'prccopymodefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.copymode', 'Description', {
						filterKey: 'prc-package-copymode-filter'
					}),
					'salestaxmethodfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.salestaxmethod', 'Description'),
				},
				'addition': {
					'grid': [
						{
							'lookupDisplayColumn': true,
							'afterId': 'companyfk',
							'field': 'CompanyFk',
							'name': 'Company Name',
							'name$tr$': 'cloud.common.entityCompanyName',
							'displayMember': 'CompanyName',
							'width': 140
						},
						{
							'lookupDisplayColumn': true,
							'field': 'StructureFk',
							'displayMember': 'DescriptionInfo.Translated',
							'name$tr$': 'cloud.common.entityStructureDescription',
							'width': 120
						},
						{
							'lookupDisplayColumn': true,
							'field': 'ClerkPrcFk',
							'displayMember': 'Description',
							'name$tr$': 'cloud.common.entityResponsibleDescription',
							'width': 120
						},
						{
							'lookupDisplayColumn': true,
							'field': 'ClerkReqFk',
							'displayMember': 'Description',
							'name$tr$': 'cloud.common.entityRequisitionOwnerDescription',
							'width': 120
						},
						{
							'lookupDisplayColumn': true,
							'field': 'SupplierFk',
							'displayMember': 'Description',
							'name$tr$': 'cloud.common.entitySupplierDescription',
							'width': 125
						},
						{
							'afterId': 'comcurrencycode',
							'id': 'comcurrencydes',
							'field': 'ComCurrencyDes',
							'name$tr$': 'procurement.package.ComCurrencyDes',
							'formatter': 'description',
							'grouping': {
								'title': 'procurement.package.ComCurrencyDes',
								'getter': 'ComCurrencyDes',
								'aggregators': [],
								'aggregateCollapsed': true
							},
							'width': 150
						},
						{
							'afterId': 'code',
							'id': 'description',
							field: 'Description',
							'name$tr$': 'cloud.common.entityDescription',
							'editor': 'description',
							'formatter': 'description',
							'grouping': {
								'title': 'cloud.common.entityDescription',
								'getter': 'Description',
								'aggregators': [],
								'aggregateCollapsed': true
							},
							width: 150
						},
						{
							'afterId': 'requisitioncode',
							'id': 'RequisitionDescription',
							field: 'RequisitionDescription',
							'name': 'Requisition Description',
							'name$tr$': 'procurement.package.entityRequisition.description',
							'formatter': 'description',
							'grouping': {
								'title': 'Requisition Description',
								'title$tr$': 'procurement.package.entityRequisition.description',
								'getter': 'RequisitionDescription',
								'aggregators': [],
								'aggregateCollapsed': true
							},
							width: 150
						},
						{
							afterId: 'RequisitionDescription',
							id: 'NoOfRequisitions',
							field: 'Requisition2PackageData.Number',
							name: 'No. Of Requisitions',
							name$tr$: 'procurement.package.entityRequisition.number',
							formatter: 'description',
							grouping: {
								title: 'No. Of Requisitions',
								title$tr$: 'procurement.package.entityRequisition.number',
								getter: 'Requisition2PackageData.ReqHeaderFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							afterId: 'NoOfRequisitions',
							id: 'ReqDateRequired',
							field: 'Requisition2PackageData.MinDateRequired',
							name: 'Req Date Required',
							name$tr$: 'procurement.package.entityRequisition.minDateRequired',
							formatter: 'dateutc',
							grouping: {
								title: 'Req Date Required',
								title$tr$: 'procurement.package.entityRequisition.minDateRequired',
								getter: 'Requisition2PackageData.ReqHeaderFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							afterId: 'ReqDateRequired',
							id: 'ReqDateReceived',
							field: 'Requisition2PackageData.MinDateReceived',
							name: 'Req Date Received',
							name$tr$: 'procurement.package.entityRequisition.minDateReceived',
							formatter: 'dateutc',
							width: 120,
							grouping: {
								title: 'Req Date Received',
								title$tr$: 'procurement.package.entityRequisition.minDateReceived',
								getter: 'Requisition2PackageData.ReqHeaderFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							afterId: 'rfqcode',
							id: 'RfqDescription',
							field: 'RfqDescription',
							'name': 'Rfq Description',
							'name$tr$': 'procurement.package.entityRfQ.description',
							'formatter': 'description',
							'grouping': {
								'title': 'Rfq Description',
								'getter': 'RfqDescription',
								'aggregators': [],
								'aggregateCollapsed': true
							},
							width: 150
						},
						{
							afterId: 'RfqDescription',
							id: 'NoOfRfQs',
							field: 'Rfq2PackageData.Number',
							name: 'No. Of RfQs',
							name$tr$: 'procurement.package.entityRfQ.number',
							formatter: 'description',
							grouping: {
								title: 'No. Of RfQs',
								title$tr$: 'procurement.package.entityRfQ.number',
								getter: 'Rfq2PackageData.RfqHeaderFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							afterId: 'NoOfRfQs',
							id: 'RfQDateRequested',
							field: 'Rfq2PackageData.MinDateRequested',
							name: 'RfQ Date Requested',
							name$tr$: 'procurement.package.entityRfQ.minDateRequested',
							formatter: 'dateutc',
							grouping: {
								title: 'RfQ Date Requested',
								title$tr$: 'procurement.package.entityRfQ.minDateRequested',
								getter: 'Rfq2PackageData.RfqHeaderFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							afterId: 'RfQDateRequested',
							id: 'RfQDateQuoteDeadline',
							field: 'Rfq2PackageData.MinDateQuoteDeadline',
							name: 'RfQ Date Quote Deadline',
							name$tr$: 'procurement.package.entityRfQ.minDateQuoteDeadline',
							formatter: 'dateutc',
							grouping: {
								title: 'RfQ Date Quote Deadline',
								title$tr$: 'procurement.package.entityRfQ.minDateQuoteDeadline',
								getter: 'Rfq2PackageData.RfqHeaderFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							afterId: 'RfQDateQuoteDeadline',
							id: 'RfQDateAwardDeadline',
							field: 'Rfq2PackageData.MinDateAwardDeadline',
							name: 'RfQ Date Award Deadline',
							name$tr$: 'procurement.package.entityRfQ.minDateAwardDeadline',
							formatter: 'dateutc',
							grouping: {
								title: 'RfQ Date Award Deadline',
								title$tr$: 'procurement.package.entityRfQ.minDateAwardDeadline',
								getter: 'Rfq2PackageData.RfqHeaderFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							afterId: 'rfqstatus',
							id: 'NoOfQuotations',
							field: 'Quotation2PackageData.Number',
							name: 'No. Of Quote',
							name$tr$: 'procurement.package.entityQuote.number',
							formatter: 'description',
							navigator: {
								moduleName: 'procurement.quote'
							}
						},
						{
							afterId: 'NoOfQuotations',
							id: 'CheapestQuotation',
							field: 'Quotation2PackageData.MinTotal',
							name: 'Cheapest Quote',
							name$tr$: 'procurement.package.entityQuote.minTotal',
							formatter: 'money'
						},
						{
							afterId: 'CheapestQuotation',
							id: 'MostExpensiveQuotation',
							field: 'Quotation2PackageData.MaxTotal',
							name: 'Expensive Quote',
							name$tr$: 'procurement.package.entityQuote.maxTotal',
							formatter: 'money'
						},
						{
							afterId: 'MostExpensiveQuotation',
							id: 'FirstDelivered',
							field: 'Pes2PackageData.MinDateDelivered',
							name: 'First Delivered',
							name$tr$: 'procurement.package.entityPerformance.minDateDelivered',
							formatter: function (row, cell, value, columnDef, dataContext) { // jshint ignore:line
								// TODO because this field is complex type and use user defined formatter, can't get the value, and need format value
								let text = platformObjectHelper.getValue(dataContext, columnDef.field);
								if (columnDef && columnDef.navigator && text) {
									let navHtml = platformGridDomainService.getNavigator(columnDef, dataContext, columnDef.field);
									if (navHtml && !navigationPermissionService.hasPermissionForModule('procurement.pes')) {
										navHtml = angular.element(navHtml).attr('disabled', true).appendTo('<div></div>').parent().html();
									}
									text = text.format('L') + navHtml;
								}
								return text;
							},
							navigator: {
								moduleName: 'procurement.pes'
							}
						},
						{
							afterId: 'FirstDelivered',
							id: 'LastDelivered',
							field: 'Pes2PackageData.MaxDateDelivered',
							name: 'Last Delivered',
							name$tr$: 'procurement.package.entityPerformance.maxDateDelivered',
							formatter: function (row, cell, value, columnDef, dataContext) { // jshint ignore:line
								// TODO because this field is complex type and use user defined formatter, can't get the value
								let text = platformObjectHelper.getValue(dataContext, columnDef.field);
								if (columnDef && columnDef.navigator && text) {
									let navHtml = platformGridDomainService.getNavigator(columnDef, dataContext, columnDef.field);
									if (navHtml && !navigationPermissionService.hasPermissionForModule('procurement.pes')) {
										navHtml = angular.element(navHtml).attr('disabled', true).appendTo('<div></div>').parent().html();
									}
									text = text.format('L') + navHtml;
								}
								return text;
							},
							navigator: {
								moduleName: 'procurement.pes'
							}
						},
						{
							afterId: 'contractcode',
							id: 'ContractDescription',
							field: 'ContractDescription',
							'name': 'Contract Description',
							'name$tr$': 'procurement.package.entityContract.description',
							'formatter': 'description',
							'grouping': {
								'title': 'Contract Description',
								'getter': 'ContractDescription',
								'aggregators': [],
								'aggregateCollapsed': true
							},
							width: 150
						},
						{
							afterId: 'ContractDescription',
							id: 'NoOfContracts',
							field: 'Contract2PackageData.Number',
							name: 'No. Of Contracts',
							name$tr$: 'procurement.package.entityContract.number',
							formatter: 'description',
							grouping: {
								title: 'No. Of Contracts',
								title$tr$: 'procurement.package.entityContract.number',
								getter: 'Contract2PackageData.ConHeaderFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							afterId: 'suppliernumber',
							id: 'ContractDateOrdered',
							field: 'Contract2PackageData.MinDateOrdered',
							name: 'Contract Date Ordered',
							name$tr$: 'procurement.package.entityContract.minDateOrdered',
							formatter: 'dateutc',
							grouping: {
								title: 'Contract Date Ordered',
								title$tr$: 'procurement.package.entityContract.minDateOrdered',
								getter: 'Contract2PackageData.ConHeaderFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							afterId: 'ContractDateOrdered',
							id: 'ContractDateDelivery',
							field: 'Contract2PackageData.MinDateDelivery',
							name: 'Contract Date Delivery',
							name$tr$: 'procurement.package.entityContract.minDateDelivery',
							formatter: 'dateutc',
							grouping: {
								title: 'Contract Date Delivery',
								title$tr$: 'procurement.package.entityContract.minDateDelivery',
								getter: 'Contract2PackageData.ConHeaderFk',
								aggregators: [],
								aggregateCollapsed: true
							}
						},
						{
							'afterId': 'mdccontrollingunitfk',
							'id': 'mdccontrollingUnitDescription',
							'lookupDisplayColumn': true,
							'field': 'MdcControllingUnitFk',
							'displayMember': 'DescriptionInfo.Translated',
							'name$tr$': 'cloud.common.entityControllingUnitDesc',
							'sortable': true,
							'width': 150
						},
						{
							afterId: 'mdccontrollingUnitDescription',
							id: 'valuenet',
							field: 'Total.ValueNet',
							name: 'Net Total',
							name$tr$: 'procurement.package.entityTotalNetValue',
							formatter: 'money'
						},
						{
							afterId: 'valuenet',
							id: 'valuenetoc',
							field: 'Total.ValueNetOc',
							name: 'Net Total(Oc)',
							name$tr$: 'procurement.package.entityTotalNetValueOc',
							formatter: 'money'
						},
						{
							afterId: 'valuenetoc',
							id: 'grosstotal',
							field: 'Total.Gross',
							name: 'Gross Total',
							name$tr$: 'procurement.package.entityTotalGross',
							formatter: 'money'
						},
						{
							afterId: 'grosstoal',
							id: 'grosstotaloc',
							field: 'Total.GrossOc',
							name: 'Gross Total(Oc)',
							name$tr$: 'procurement.package.entityTotalGrossOc',
							formatter: 'money'
						}
					],
					'detail': [
						{
							'gid': 'Requisition',
							'rid': 'NoOfRequisitions',
							'label': 'No Of Requisitions',
							'label$tr$': 'procurement.package.entityRequisition.number',
							'model': 'Requisition2PackageData.Number',
							'type': 'description',
							'readonly': true
						},
						{
							'gid': 'Requisition',
							'rid': 'ReqDateRequired',
							'label': 'Req Date Required',
							'label$tr$': 'procurement.package.entityRequisition.minDateRequired',
							'type': 'dateutc',
							'model': 'Requisition2PackageData.MinDateRequired',
							'readonly': true
						},
						{
							'gid': 'Requisition',
							'rid': 'ReqDateReceived',
							'model': 'Requisition2PackageData.MinDateReceived',
							'label': 'Req Date Received',
							'label$tr$': 'procurement.package.entityRequisition.minDateReceived',
							'type': 'dateutc',
							'readonly': true
						},
						{
							'gid': 'RfQ',
							'rid': 'NumberOfRfQs',
							'label': 'Number Of RfQs',
							'label$tr$': 'procurement.package.entityRfQ.number',
							'type': 'description',
							'model': 'Rfq2PackageData.Number',
							'readonly': true
						},
						{
							'gid': 'RfQ',
							'rid': 'MinDateRequested',
							'model': 'Rfq2PackageData.MinDateRequested',
							'label': 'Min Date Requested',
							'label$tr$': 'procurement.package.entityRfQ.minDateRequested',
							'type': 'dateutc',
							'readonly': true
						},
						{
							'gid': 'RfQ',
							'rid': 'MinDateQuoteDeadline',
							'model': 'Rfq2PackageData.MinDateQuoteDeadline',
							'label': 'Min Date Quote Deadline',
							'label$tr$': 'procurement.package.entityRfQ.minDateQuoteDeadline',
							'type': 'dateutc',
							'readonly': true
						},
						{
							'gid': 'RfQ',
							'rid': 'MinDateAwardDeadline',
							'model': 'Rfq2PackageData.MinDateAwardDeadline',
							'label': 'Min Date Award Deadline',
							'label$tr$': 'procurement.package.entityRfQ.minDateAwardDeadline',
							'type': 'dateutc',
							'readonly': true
						},
						{
							'gid': 'Quote',
							'rid': 'NoOfQuotations',
							'model': 'Quotation2PackageData.Number',
							'label': 'No Of Quote',
							'label$tr$': 'procurement.package.entityQuote.number',
							'type': 'description',
							navigator: {
								moduleName: 'procurement.quote'
							},
							'readonly': true
						},
						{
							'gid': 'Quote',
							'rid': 'CheapestQuotation',
							'model': 'Quotation2PackageData.MinTotal',
							'label': 'Cheapest Quotation',
							'label$tr$': 'procurement.package.entityQuote.minTotal',
							'type': 'money',
							'readonly': true
						},
						{
							'gid': 'Quote',
							'rid': 'MostExpensiveQuotation',
							'model': 'Quotation2PackageData.MaxTotal',
							'label': 'Expensive Quote',
							'label$tr$': 'procurement.package.entityQuote.maxTotal',
							'type': 'money',
							'readonly': true
						},
						{
							'gid': 'Performance',
							'rid': 'FirstDelivered',
							'model': 'Pes2PackageData.MinDateDelivered',
							'label': 'First Delivered',
							'label$tr$': 'procurement.package.entityPerformance.minDateDelivered',
							'type': 'dateutc',
							navigator: {
								moduleName: 'procurement.pes'
							},
							'readonly': true
						},
						{
							'gid': 'Performance',
							'rid': 'LastDelivered',
							'model': 'Pes2PackageData.MaxDateDelivered',
							'label': 'Last Delivered',
							'label$tr$': 'procurement.package.entityPerformance.maxDateDelivered',
							'type': 'dateutc',
							navigator: {
								moduleName: 'procurement.pes'
							},
							'readonly': true
						},
						{
							'gid': 'Contract',
							'rid': 'NoOfContracts',
							'model': 'Contract2PackageData.Number',
							'label': 'No Of Contracts',
							'label$tr$': 'procurement.package.entityContract.number',
							'type': 'description',
							'readonly': true
						},
						{
							'gid': 'Contract',
							'rid': 'ContractDateOrdered',
							'model': 'Contract2PackageData.MinDateOrdered',
							'label': 'Contract Date Ordered',
							'label$tr$': 'procurement.package.entityContract.minDateOrdered',
							'type': 'dateutc',
							'readonly': true
						},
						{
							'gid': 'Contract',
							'rid': 'ContractDateDelivery',
							'model': 'Contract2PackageData.MinDateDelivery',
							'label': 'Contract Date Delivery',
							'label$tr$': 'procurement.package.entityContract.minDateDelivery',
							'type': 'dateutc',
							'readonly': true
						},
						{
							'gid': 'Total',
							'rid': 'valuenet',
							'model': 'Total.ValueNet',
							'label': 'Net Total',
							'label$tr$': 'procurement.package.entityTotalNetValue',
							'type': 'money',
							'readonly': true
						},
						{
							'gid': 'Total',
							'rid': 'valuenetoc',
							'model': 'Total.ValueNetOc',
							'label': 'Net Total(Oc)',
							'label$tr$': 'procurement.package.entityTotalNetValueOc',
							'type': 'money',
							'readonly': true
						},
						{
							'gid': 'Total',
							'rid': 'grosstotal',
							'model': 'Total.Gross',
							'label': 'Gross Total',
							'label$tr$': 'procurement.package.entityTotalGross',
							'type': 'money',
							'readonly': true
						},
						{
							'gid': 'Total',
							'rid': 'grosstotaloc',
							'model': 'Total.GrossOc',
							'label': 'Gross Total(Oc)',
							'label$tr$': 'procurement.package.entityTotalGrossOc',
							'type': 'money',
							'readonly': true
						}
					]
				}
			};

			var basicsClerkFormatService = $injector.get('basicsClerkFormatService');
			config.overloads.clerkreqfk.grid.formatter = basicsClerkFormatService.formatClerk;
			config.overloads.clerkprcfk.grid.formatter = basicsClerkFormatService.formatClerk;

			return config;
		}]);

	angular.module(modName).factory('procurementPackageUIStandardService',
		['platformUIStandardConfigService', 'procurementPackageTranslationService', 'procurementPackageLayout',
			'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout,
				platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PrcPackageDto',
					moduleSubModule: 'Procurement.Package'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				const entityInformation = { module: angular.module(modName), moduleName: 'Procurement.Package', entity: 'PrcPackage' };
				var service = new BaseService(layout, domainSchema, translationService, entityInformation);
				platformUIStandardExtentService.extend(service, layout.addition, domainSchema);

				return service;
			}
		]);

	angular.module(modName).factory('procurementPackageUIStandardExtendedService', [
		'procurementPackageUIStandardService', 'procurementPackageEventTypeDataCacheService', 'procurementPackageValidationService',
		function (uiStandardService, eventTypeDataCacheService, validationService) {
			var service = angular.copy(uiStandardService);
			var dynamicColumns = {}, mainEvents = [];

			service.extendExtraColumns = function () {
				mainEvents = _.sortBy(_.filter(eventTypeDataCacheService.getData(), function (item) {
					return item.IsMainEvent;
				}), 'Sorting');

				dynamicColumns = angular.copy(uiStandardService.getStandardConfigForListView());

				_.forEach(mainEvents, function (item) {
					var colExta = service.getExtraColumnsForEvents(item);
					Array.prototype.splice.apply(dynamicColumns.columns, [dynamicColumns.columns.length - 4, 0].concat(colExta));
				});
			};

			service.extendExtraRows = function () {

				// DEV-15701 cache the formConfig will cause the characteristic disappear when switch container's tabs.
				var dynamicRows = service.getStandardConfigForDetailView();

				const eventRow = _.find(dynamicRows.rows, function(item){
					return item.gid === 'Event';
				});

				// if event row is not found, add extra rows for main events
				if(!eventRow) {
					mainEvents = _.filter(eventTypeDataCacheService.getData(), function (item) {
						return item.IsMainEvent;
					});

					_.forEach(mainEvents, function (item) {
						var rowExta = service.getExtraRowsForEvents(item);
						Array.prototype.splice.apply(dynamicRows.rows, [dynamicRows.rows.length - 4, 0].concat(rowExta));
					});
				}
			};

			service.getStandardConfigForListView = function () {
				return dynamicColumns;
			};

			service.getExtraColumnsForEvents = function (item) {
				var info = item.DescriptionInfo.Translated + ' ';
				if (item.HasStartDate) {
					return [{
						id: 'RelevantStart' + item.Id,
						field: 'MainEvent' + item.Id + '.StartRelevant',
						name: info + 'Rel. Start',
						name$tr$: 'procurement.package.entityEvent.startRelevant',
						name$tr$param$: {'code': info},
						editor: 'dateutc',
						formatter: 'dateutc',
						validator: validationService.validateMainEventDto$StartRelevant,
						sortable: true,
						grouping: {
							title: info + 'Relevant Start',
							// title$tr$: 'procurement.package.entityContract.number',
							getter: 'MainEvent' + item.Id + '.StartRelevant',
							aggregators: [],
							aggregateCollapsed: true
						}
					}, {
						id: 'StartActual' + item.Id,
						field: 'MainEvent' + item.Id + '.StartActualBool',
						name: info + 'Is Act. Start',
						name$tr$: 'procurement.package.entityEvent.startActualBool',
						name$tr$param$: {'code': info},
						formatter: 'boolean',
						readonly: true,
						sortable: true,
						grouping: {
							title: info + 'Has Actual Start',
							getter: 'MainEvent' + item.Id + '.StartActualBool',
							aggregators: [],
							aggregateCollapsed: true
						}
					}, {
						id: 'RelevantEnd' + item.Id,
						field: 'MainEvent' + item.Id + '.EndRelevant',
						name: info + 'Rel. End',
						name$tr$: 'procurement.package.entityEvent.endRelevant',
						name$tr$param$: {'code': info},
						editor: 'dateutc',
						formatter: 'dateutc',
						validator: validationService.validateMainEventDto$EndRelevant,
						sortable: true,
						grouping: {
							title: info + 'Relevant End',
							getter: 'MainEvent' + item.Id + '.EndRelevant',
							aggregators: [],
							aggregateCollapsed: true
						}
					}, {
						id: 'EndActual' + item.Id,
						field: 'MainEvent' + item.Id + '.EndActualBool',
						name: info + 'Is Act. End',
						name$tr$: 'procurement.package.entityEvent.endActualBool',
						name$tr$param$: {'code': info},
						formatter: 'boolean',
						readonly: true,
						sortable: true,
						grouping: {
							title: info + 'Has Actual End',
							getter: 'MainEvent' + item.Id + '.EndActualBool',
							aggregators: [],
							aggregateCollapsed: true
						}
					}];
				} else {
					return [{
						id: 'RelevantEnd' + item.Id,
						field: 'MainEvent' + item.Id + '.EndRelevant',
						name: info + 'Rel. End',
						name$tr$: 'procurement.package.entityEvent.endRelevant',
						name$tr$param$: {'code': info},
						editor: 'dateutc',
						formatter: 'dateutc',
						validator: validationService.validateMainEventDto$EndRelevant,
						sortable: true,
						grouping: {
							title: info + 'Relevant End',
							getter: 'MainEvent' + item.Id + '.EndRelevant',
							aggregators: [],
							aggregateCollapsed: true
						}
					}, {
						id: 'EndActual' + item.Id,
						field: 'MainEvent' + item.Id + '.EndActualBool',
						name: info + 'Is Act. End',
						name$tr$: 'procurement.package.entityEvent.endActualBool',
						name$tr$param$: {'code': info},
						formatter: 'boolean',
						readonly: true,
						sortable: true,
						grouping: {
							title: info + 'Has Actual End',
							getter: 'MainEvent' + item.Id + '.EndActualBool',
							aggregators: [],
							aggregateCollapsed: true
						}
					}];
				}
			};

			service.getExtraRowsForEvents = function (item) {
				var info = item.DescriptionInfo.Translated + ' ';
				if (item.HasStartDate) {
					return [{
						'gid': 'Event',
						'rid': 'RelevantStart' + item.Id,
						'model': 'MainEvent' + item.Id + '.StartRelevant',
						'label': info + 'Rel. Start',
						'label$tr$': 'procurement.package.entityEvent.startRelevant',
						label$tr$param$: {'code': info},
						'type': 'dateutc',
						validator: validationService.validateMainEventDto$StartRelevant
					}, {
						'gid': 'Event',
						'rid': 'StartActual' + item.Id,
						'model': 'MainEvent' + item.Id + '.StartActualBool',
						'label': info + 'Is Act. Start',
						'label$tr$': 'procurement.package.entityEvent.startActualBool',
						label$tr$param$: {'code': info},
						'type': 'boolean',
						'readonly': true
					}, {
						'gid': 'Event',
						'rid': 'RelevantEnd' + item.Id,
						'model': 'MainEvent' + item.Id + '.EndRelevant',
						'label': info + 'Rel. End',
						'label$tr$': 'procurement.package.entityEvent.endRelevant',
						label$tr$param$: {'code': info},
						'type': 'dateutc',
						validator: validationService.validateMainEventDto$EndRelevant
					}, {
						'gid': 'Event',
						'rid': 'EndActual' + item.Id,
						'model': 'MainEvent' + item.Id + '.EndActualBool',
						'label': info + 'Is Act. End',
						'label$tr$': 'procurement.package.entityEvent.endActualBool',
						label$tr$param$: {'code': info},
						'type': 'boolean',
						'readonly': true
					}];
				} else {
					return [{
						'gid': 'Event',
						'rid': 'RelevantEnd' + item.Id,
						'model': 'MainEvent' + item.Id + '.EndRelevant',
						'label': info + 'Rel. End',
						'label$tr$': 'procurement.package.entityEvent.endRelevant',
						label$tr$param$: {'code': info},
						'type': 'dateutc',
						validator: validationService.validateMainEventDto$EndRelevant
					}, {
						'gid': 'Event',
						'rid': 'EndActual' + item.Id,
						'model': 'MainEvent' + item.Id + '.EndActualBool',
						'label': info + 'Is Act. End',
						'label$tr$': 'procurement.package.entityEvent.endActualBool',
						label$tr$param$: {'code': info},
						'type': 'boolean',
						'readonly': true
					}];
				}
			};

			return service;
		}]);
})(angular);