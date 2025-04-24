(function () {
	'use strict';
	let moduleName = 'controlling.generalcontractor';

	angular.module(moduleName).factory('controllingGeneralContractorUIConfigurationService', ['basicsLookupdataConfigGenerator', '$injector', '$translate',
		function (basicsLookupdataConfigGenerator, $injector, $translate) {
			return {
				getCostControlDetailLayout: function () {
					return {
						fid: 'controlling.generalcontractor.mainEntityNameForm',
						version: '1.0.0',
						showGrouping: true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['code', 'descriptioninfo', 'revenue', 'basiccost', 'basiccostco', 'directcosts', 'budgetshift', 'budget', 'additional', 'contract',
									'performance', 'invoice', 'invoicestatus', 'actualswithoutcontract', 'actualcosts', 'forecast', 'result','userdefined1','userdefined2','userdefined3','budgetpackage',
									'gcccostcontrolcomment','invoicestatuspercent']
							},
							{
								'gid': 'entityHistory',
								'isHistory': false
							}
						],
						'overloads': {
							'code': {
								'navigator': {
									moduleName: 'controlling.structure',
									registerService: 'controllingStructureMainService'
								},
								readonly: true
							},
							'descriptioninfo': {
								readonly: true
							},
							'revenue': {
								readonly: true
							},
							'basiccost': {
								readonly: true
							},
							'basiccostco': {
								readonly: true
							},
							'directcosts': {
								readonly: true
							},
							'budgetshift': {
								readonly: true
							},
							'budget': {
								readonly: true
							},
							'additional': {
								readonly: true
							},
							'contract': {
								readonly: true
							},
							'performance': {
								readonly: true
							},
							'invoice': {
								readonly: true
							},
							'invoicestatus': {
								readonly: true,
								'formatter': function (row, cell, value, m, entity) {
									return !entity.IsFinalInvoice ? $translate.instant('controlling.generalcontractor.FinalInvoice') : '';
								}
							},
							'actualswithoutcontract': {
								readonly: true
							},
							'actualcosts': {
								readonly: true
							},
							'forecast': {
								readonly: true
							},
							'result': {
								readonly: true,
								'formatter': function (row, cell, value) {
									let domainService = $injector.get('platformGridDomainService');
									let formattedValue = '<span class="flex-element text-right">' + domainService.formatter('money')(0, 0, value, {}) + '</span>';

									if (value < 0) {
										formattedValue = '<div class="flex-box flex-align-center" style="color:red;">' + formattedValue + '</div>';
									} else {
										formattedValue = '<div class="flex-box flex-align-center">' + formattedValue + '</div>';
									}
									return formattedValue;
								}
							},
							'userdefined1' :{
								readonly: true

							},
							'userdefined2' :{
								readonly: true

							},
							'userdefined3' :{
								readonly: true

							},
							'budgetpackage': {
								readonly: true
							},
							'invoicestatuspercent':{
								readonly: true
							}
						}
					};
				},

				getSalesContractsDetailLayout: function () {
					return {
						fid: 'controlling.generalcontractor.SalesContractsContainer',
						version: '1.0.0',
						showGrouping: true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['flag','code', 'descriptioninfo', 'ordstatusfk', 'prjchangefk',
									'comment', 'total','businesspartnerfk','customerfk']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							'flag': {
								width: 30,
								readonly: true,
								'formatter': function (row, cell, value /* , m, entity */) {
									value = !value? '':value;
									let outValue = '<div class="flex-align-center flex-element text-center">';

									if(value === '1'){ // green icon
										outValue += '<i class="block-image status-icons ico-status02" title="' + $translate.instant('controlling.generalcontractor.greenHints') + '"></i>';
									}else if(value === '2'){ // red icon
										outValue += '<i class="block-image status-icons ico-status39" title="' + $translate.instant('controlling.generalcontractor.redHints') + '"></i>';
									}else if(value === '3'){ // yellow icon
										outValue += '<i class="block-image type-icons ico-warning19" title="' + $translate.instant('controlling.generalcontractor.yellowHints') + '"></i>';
									}else if(value === '4'){
										outValue += '<i class="block-image status-icons ico-status05" title="' + $translate.instant('controlling.generalcontractor.yellowHints') + '"></i>';
									}

									outValue += '</div>';
									return outValue;
								}
							},
							'code': {
								'navigator': {
									moduleName: 'sales.contract',
									registerService: 'salesContractService'
								},
								readonly: true
							},
							'descriptioninfo': {
								readonly: true
							},
							ordstatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.orderstatus', null, {
								showIcon: true
							}),
							'prjchangefk': {
								readonly: true,
								'grid': {
									editor: 'directive',
									editorOptions: {
										showClearButton: true,
										displayMember: 'Code',
										directive: 'controlling-common-project-change-lookup',
										'additionalColumns':true
									},
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'controllingCommonProjectChangeLookupDataService',
										displayMember: 'Code',
										mainServiceName:'controllingGeneralContractorSalesContractsDataService',
										lookupType:'GccCommonProjectChange'
									},
									width: 130
								}
							},
							'comment': {
								readonly: true
							},
							'total': {
								readonly: true,
							},
							'businesspartnerfk': {
								readonly: true,
								grid: {
									editor: 'lookup',
									editorOptions: {
										showClearButton: false,
										directive: 'business-partner-main-business-partner-dialog'
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'BusinessPartner',
										displayMember: 'BusinessPartnerName1'
									}
								}
							},
							'customerfk': {
								readonly: true,
								grid: {
									editor: 'lookup',
									directive: 'basics-lookupdata-lookup-composite',
									editorOptions: {
										directive: 'business-partner-main-customer-lookup'
									},
									formatter: 'lookup',
									formatterOptions: {'lookupType': 'customer', 'displayMember': 'Code'},
									width: 125
								}
							}
						},
						'addition': {
							'grid': [
								{
									IsReadonly: true,
									field: 'PrjChangeFk',
									'sortable': true,
									name$tr$: 'controlling.generalcontractor.entityPrjchangeDesc',
									displayMember: 'Description',
									editorOptions: {
										showClearButton: true,
										displayMember: 'Description',
										directive: 'controlling-common-project-change-lookup'
									},
									editor: null,
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'controllingCommonProjectChangeLookupDataService',
										displayMember: 'Description',
										mainServiceName:'controllingGeneralContractorSalesContractsDataService',
										lookupType:'GccCommonProjectChange'
									}
								}
							]
						}
					};
				},

				getLineItemsDetailLayout: function () {
					return {
						fid: 'controlling.generalcontractor.LineItemsListController',
						version: '1.0.0',
						showGrouping: true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['mdccontrollingunitfk', 'code', 'descriptioninfo', 'costtotal', 'revenue', 'budget', 'prjchangefk', 'budgetshift', 'additionalexpenses']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							'mdccontrollingunitfk': {
								readonly: true,
								'grid': {
									editor: 'directive',
									editorOptions: {
										showClearButton: true,
										displayMember: 'Code',
										directive: 'controlling-common-controlling-unit-lookup',
										'additionalColumns':true
									},
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'controllingCommonControllingUnitLookupDataService',
										displayMember: 'Code',
										mainServiceName:'controllingGeneralContractorLineItemsDataService',
										lookupType:'GccCommonControllingUnit'
									},
									width: 130
								}
							},
							'additionalexpenses': {
								readonly: true
							},
							'budgetshift': {
								readonly: true
							},
							'code': {
								searchable:true,
								readonly: true
							},
							'descriptioninfo': {
								searchable:true,
								readonly: true
							},
							'costtotal': {
								readonly: true
							},
							'revenue': {
								searchable:true,
								readonly: true,
							},
							'budget': {
								readonly: true,
							},
							'prjchangefk': {
								searchable:true,
								readonly: true,
								'grid': {
									editor: 'directive',
									editorOptions: {
										showClearButton: true,
										displayMember: 'Code',
										directive: 'controlling-common-project-change-lookup',
										'additionalColumns':true
									},
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'controllingCommonProjectChangeLookupDataService',
										displayMember: 'Code',
										mainServiceName:'controllingGeneralContractorLineItemsDataService',
										lookupType:'GccCommonProjectChange'
									},
									width: 130
								}
							},
						},
						'addition': {
							'grid': [
								{
									IsReadonly: true,
									'field': 'MdcControllingUnitFk',
									'displayMember': 'Description.Translated',
									'name$tr$': 'controlling.generalcontractor.entityControllingUnitDesc',
									'sortable': true,
									'width': 150,
									editorOptions: {
										showClearButton: true,
										displayMember: 'Description.Translated',
										directive: 'controlling-common-controlling-unit-lookup'
									},
									editor: null,
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'controllingCommonControllingUnitLookupDataService',
										'displayMember': 'Description.Translated',
										mainServiceName:'controllingGeneralContractorLineItemsDataService',
										lookupType:'GccCommonControllingUnit'
									}
								},
								{
									IsReadonly: true,
									field: 'PrjChangeFk',
									'sortable': true,
									name$tr$: 'controlling.generalcontractor.entityPrjchangeDesc',
									displayMember: 'Description',
									editorOptions: {
										showClearButton: true,
										displayMember: 'Description',
										directive: 'controlling-common-project-change-lookup'
									},
									editor: null,
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'controllingCommonProjectChangeLookupDataService',
										displayMember: 'Description',
										mainServiceName:'controllingGeneralContractorLineItemsDataService',
										lookupType:'GccCommonProjectChange'
									}
								}
							]
						}
					};
				},

				getBudgetShiftDetailLayout: function () {
					return {
						fid: 'controlling.generalcontractor.BudgetShiftContainer',
						version: '1.0.0',
						showGrouping: true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['code','description', 'value', 'mdccounitsourcefk', 'mdccounittargetfk', 'comment']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							'mdccounitsourcefk': {
								readonly: true,
								'grid': {
									editor: 'directive',
									editorOptions: {
										showClearButton: true,
										displayMember: 'Code',
										directive: 'controlling-common-controlling-unit-lookup',
										'additionalColumns':true
									},
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'controllingCommonControllingUnitLookupDataService',
										displayMember: 'Code',
										mainServiceName:'controllingGeneralContractorBudgetShiftDataService',
										lookupType:'GccCommonControllingUnit'
									},
									width: 130
								}
							},
							'mdccounittargetfk': {
								readonly: true,
								'grid': {
									editor: 'directive',
									editorOptions: {
										showClearButton: true,
										displayMember: 'Code',
										directive: 'controlling-common-controlling-unit-lookup',
										'additionalColumns':true
									},
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'controllingCommonControllingUnitLookupDataService',
										displayMember: 'Code',
										mainServiceName:'controllingGeneralContractorBudgetShiftDataService',
										lookupType:'GccCommonControllingUnit'
									},
									width: 130
								}
							},
							'description': {
								readonly: true
							},
							'value': {
								readonly: true
							},
							'comment': {
								readonly: true
							}
						},
						'addition': {
							'grid': [
								{
									IsReadonly: true,
									'field': 'MdcCounitSourceFk',
									'displayMember': 'Description.Translated',
									'name$tr$': 'controlling.generalcontractor.mdcCounitSourcedesc',
									'sortable': true,
									'width': 150,
									editorOptions: {
										showClearButton: true,
										displayMember: 'Description.Translated',
										directive: 'controlling-common-controlling-unit-lookup'
									},
									editor: null,
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'controllingCommonControllingUnitLookupDataService',
										'displayMember': 'Description.Translated',
										mainServiceName:'controllingGeneralContractorBudgetShiftDataService',
										lookupType:'GccCommonControllingUnit'
									}
								},
								{
									IsReadonly: true,
									'field': 'MdcCounitTargetFk',
									'displayMember': 'Description.Translated',
									'name$tr$': 'controlling.generalcontractor.mdcCounitTargetdesc',
									'sortable': true,
									'width': 150,
									editorOptions: {
										showClearButton: true,
										displayMember: 'Description.Translated',
										directive: 'controlling-common-controlling-unit-lookup'
									},
									editor: null,
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'controllingCommonControllingUnitLookupDataService',
										'displayMember': 'Description.Translated',
										mainServiceName:'controllingGeneralContractorBudgetShiftDataService',
										lookupType:'GccCommonControllingUnit'
									}
								},
							]
						}
					};
				},

				getAdditionalExpensesDetailLayout: function () {
					return {
						fid: 'controlling.generalcontractor.AdditionalExpensesListController',
						version: '1.0.0',
						showGrouping: true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['mdccontrollingunitfk', 'code', 'description', 'amount', 'prcpackagefk', 'conheaderfk', 'comment']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							'mdccontrollingunitfk': {
								readonly: true,
								grid: {
									editor: 'directive',
									editorOptions: {
										showClearButton: true,
										displayMember: 'Code',
										directive: 'controlling-common-controlling-unit-lookup',
										'additionalColumns':true
									},
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'controllingCommonControllingUnitLookupDataService',
										displayMember: 'Code',
										mainServiceName:'controllingGeneralContractorAdditionalExpensesDataService',
										lookupType:'GccCommonControllingUnit'
									},
									width: 130
								}
							},
							'code': {
								readonly: true
							},
							'description': {
								readonly: true
							},
							'amount': {
								formatter: 'money',
								readonly: true
							},
							'prcpackagefk': {
								navigator: {
									moduleName: 'procurement.package',
									registerService: 'procurementPackageDataService'
								},
								'grid': {
									'formatter': 'lookup',
									'formatterOptions': {
										lookupType: 'PrcPackage',
										displayMember: 'Code'
									},
									'editor': 'lookup',
									'editorOptions': {
										directive: 'procurement-common-package-lookup',
										lookupOptions: {
											filterKey: 'prc-boq-package-for-pes-filter',
											showClearButton: true
										}
									},
									width: 100
								},
								readonly: true,
							},
							'conheaderfk': {
								navigator: {
									moduleName: 'procurement.contract',
									registerService: 'procurementContractHeaderDataService'
								},
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										directive: 'prc-con-header-dialog',
										lookupOptions: {
											filterKey: 'prc-con-header-for-pes-filter',
											showClearButton: true,
											title: {name: 'cloud.common.dialogTitleContract'}
										}
									},
									'formatter': 'lookup',
									'formatterOptions': {
										lookupType: 'ConHeaderView',
										displayMember: 'Code'
									},
									width: 100
								},
								readonly: true,
							},
							'comment': {
								readonly: true,
							}
						},
						'addition': {
							grid: [
								{
									'lookupDisplayColumn': true,
									'field': 'PrcPackageFk',
									'displayMember': 'Description',
									'name$tr$': 'cloud.common.entityPackageDescription',
									'width': 125
								},
								{
									'lookupDisplayColumn': true,
									'field': 'ConHeaderFk',
									'displayMember': 'Description',
									'name$tr$': 'controlling.generalcontractor.ContractDescription',
									'width': 125
								},
								{
									IsReadonly: true,
									'field': 'MdcControllingUnitFk',
									'displayMember': 'Description.Translated',
									'name$tr$': 'controlling.generalcontractor.entityControllingUnitDesc',
									'sortable': true,
									'width': 150,
									editorOptions: {
										showClearButton: true,
										displayMember: 'Description.Translated',
										directive: 'controlling-common-controlling-unit-lookup'
									},
									editor: null,
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'controllingCommonControllingUnitLookupDataService',
										'displayMember': 'Description.Translated',
										mainServiceName:'controllingGeneralContractorAdditionalExpensesDataService',
										lookupType:'GccCommonControllingUnit'
									}
								}
							]
						}
					};
				},

				getPackagesDetailLayout: function () {
					return {
						fid: 'controlling.generalcontractor.PackagesListController',
						version: '1.0.0',
						showGrouping: true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['code', 'description', 'packagestatusfk', 'budget', 'mdccontrollingunitfk', 'remark']
							},
							{
								'gid': 'entityHistory',
								'isHistory': false
							}
						],
						'overloads': {
							'code': {
								'navigator': {
									moduleName: 'procurement.package',
									registerService: 'procurementPackageDataService'
								},
								readonly: true
							},
							'description': {
								readonly: true
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
								}
							},
							'budget': {
								readonly: true,
								'domain': 'money'
							},
							'mdccontrollingunitfk': {
								readonly: true,
								grid: {
									editor: 'directive',
									editorOptions: {
										showClearButton: true,
										displayMember: 'Code',
										directive: 'controlling-common-controlling-unit-lookup'
									},
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'controllingCommonControllingUnitLookupDataService',
										displayMember: 'Code',
										mainServiceName:'controllingGeneralContractorPackagesDataService',
										lookupType:'GccCommonControllingUnit'
									},
									width: 130
								}
							},
							'remark': {
								readonly: true,
							}
						},
						'addition': {
							'grid': [
								{
									IsReadonly: true,
									'field': 'MdcControllingUnitFk',
									'displayMember': 'Description.Translated',
									'name$tr$': 'controlling.generalcontractor.entityControllingUnitDesc',
									'sortable': true,
									'width': 150,
									editorOptions: {
										showClearButton: true,
										displayMember: 'Description.Translated',
										directive: 'controlling-common-controlling-unit-lookup'
									},
									editor: null,
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'controllingCommonControllingUnitLookupDataService',
										'displayMember': 'Description.Translated',
										mainServiceName:'controllingGeneralContractorPackagesDataService',
										lookupType:'GccCommonControllingUnit'
									}
								}
							]
						}

					};
				},

				getInvoicesDetailLayout: function () {
					return {
						fid: 'controlling.generalcontractor.PrcInvoiceListController',
						version: '1.0.0',
						showGrouping: true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['mdccontrollingunitfk', 'code', 'description', 'amountnet', 'invoicestatusfk',
									'bpdbusinesspartnerfk', 'bpdsupplierfk','paymentdate','invtypefk','conheaderfk']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							'mdccontrollingunitfk': {
								readonly: true,
								grid: {
									editor: 'directive',
									editorOptions: {
										showClearButton: true,
										displayMember: 'Code',
										directive: 'controlling-common-controlling-unit-lookup',
										'additionalColumns':true
									},
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'controllingCommonControllingUnitLookupDataService',
										displayMember: 'Code',
										mainServiceName:'controllingGeneralPrcInvoicesDataService',
										lookupType:'GccCommonControllingUnit'
									},
									width: 130
								}
							},
							'code': {
								readonly: true,
								navigator: {
									moduleName: 'procurement.invoice',
									registerService: 'procurementInvoiceHeaderDataService'
								}
							},
							'description': {
								readonly: true
							},
							'amountnet': {
								formatter: 'money',
								readonly: true
							},
							'invoicestatusfk':
								basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.invoicestatus', null, {showIcon: true}),
							'bpdbusinesspartnerfk': {
								readonly: true,
								'grid': {
									editor: 'lookup',
									editorOptions: {
										// 'directive': 'business-partner-main-business-partner-dialog',
										'directive': 'filter-business-partner-dialog-lookup',
										lookupOptions: {
											filterKey: 'prc-invoice-business-partner-filter'
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
							'bpdsupplierfk': {
								readonly: true,
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
							'paymentdate':{readonly: true},
							'invtypefk': {
								readonly: true,
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
							'conheaderfk': {
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'prc-con-header-dialog',
										'lookupOptions': {
											'filterKey': 'prc-invoice-con-header-filter',
											'showClearButton': true,
											'title': { name:'cloud.common.dialogTitleContract' }
										}
									},
									width: 150,
									formatter: 'lookup',
									'formatterOptions': {
										lookupType: 'ConHeaderView',
										displayMember: 'Code',
									}
								},
								readonly: true
							}
						},
						'addition': {
							grid: [
								{
									'lookupDisplayColumn': true,
									'field': 'ConHeaderFk',
									'displayMember': 'Description',
									'name$tr$': 'controlling.generalcontractor.ContractDescription',
									'width': 125
								},
								{
									IsReadonly: true,
									'field': 'MdcControllingUnitFk',
									'displayMember': 'Description.Translated',
									'name$tr$': 'controlling.generalcontractor.entityControllingUnitDesc',
									'sortable': true,
									'width': 150,
									editorOptions: {
										showClearButton: true,
										displayMember: 'Description.Translated',
										directive: 'controlling-common-controlling-unit-lookup'
									},
									editor: null,
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'controllingCommonControllingUnitLookupDataService',
										'displayMember': 'Description.Translated',
										mainServiceName:'controllingGeneralPrcInvoicesDataService',
										lookupType:'GccCommonControllingUnit'
									}
								}
							]
						}
					};
				},

				getPrcContractsDetailLayout: function () {
					return {
						fid: 'controlling.generalcontractor.PrcContractsContainer',
						version: '1.0.0',
						showGrouping: true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['code', 'description', 'constatusfk', 'prjchangefk', 'total', 'mdccontrollingunitfk',
									'businesspartnerfk', 'supplierfk']
							}
						],
						'overloads': {
							'code': {
								'navigator': {
									moduleName: 'procurement.contract',
									registerService: 'procurementContractHeaderDataService'
								},
								readonly: true
							},
							'description': {
								readonly: true
							},
							'constatusfk': {
								readonly: true,
								'grid': {
									'editor': '',
									'editorOptions': null,
									'formatter': 'lookup',
									'formatterOptions': {
										lookupType: 'ConStatus',
										displayMember: 'DescriptionInfo.Translated',
										imageSelector: 'platformStatusIconService'
									}
								}
							},
							'prjchangefk': {
								readonly: true,
								'grid': {
									editor: 'directive',
									editorOptions: {
										showClearButton: true,
										displayMember: 'Code',
										directive: 'controlling-common-project-change-lookup',
										'additionalColumns':true
									},
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'controllingCommonProjectChangeLookupDataService',
										displayMember: 'Code',
										mainServiceName:'controllingGeneralContractorPrcContractsDataService',
										lookupType:'GccCommonProjectChange'
									},
									width: 130
								}
							},
							'total': {
								readonly: true
							},
							'mdccontrollingunitfk': {
								readonly: true,
								grid: {
									editor: 'directive',
									editorOptions: {
										showClearButton: true,
										displayMember: 'Code',
										directive: 'controlling-common-controlling-unit-lookup',
										'additionalColumns':true
									},
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'controllingCommonControllingUnitLookupDataService',
										displayMember: 'Code',
										mainServiceName:'controllingGeneralContractorPrcContractsDataService',
										lookupType:'GccCommonControllingUnit'
									},
									width: 130
								}
							},
							'businesspartnerfk': {
								readonly: true,
								mandatory: true,
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'filter-business-partner-dialog-lookup',
										'lookupOptions': {
											'showClearButton': true,
											'filterKey': 'procurement-contract-businesspartner-businesspartner-filter'
										}
									},
									'formatter': 'lookup',
									'formatterOptions': {
										'lookupType': 'BusinessPartner',
										'displayMember': 'BusinessPartnerName1'
									},
									'width': 150
								}
							},
							'supplierfk': {
								readonly: true,
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'business-partner-main-supplier-lookup',
										'lookupOptions': {'filterKey': 'prc-con-supplier-filter', 'showClearButton': true}
									},
									'formatter': 'lookup',
									'formatterOptions': {'lookupType': 'Supplier', 'displayMember': 'Code'},
									'width': 100
								}
							}
						},
						'addition': {
							'grid': [
								{
									IsReadonly: true,
									'field': 'MdcControllingUnitFk',
									'displayMember': 'Description.Translated',
									'name$tr$': 'controlling.generalcontractor.entityControllingUnitDesc',
									'sortable': true,
									'width': 150,
									editorOptions: {
										showClearButton: true,
										displayMember: 'Description.Translated',
										directive: 'controlling-common-controlling-unit-lookup'
									},
									editor: null,
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'controllingCommonControllingUnitLookupDataService',
										'displayMember': 'Description.Translated',
										mainServiceName: 'controllingGeneralContractorPrcContractsDataService',
										lookupType: 'GccCommonControllingUnit'
									}
								},
								{
									IsReadonly: true,
									field: 'PrjChangeFk',
									'sortable': true,
									name$tr$: 'controlling.generalcontractor.entityPrjchangeDesc',
									displayMember: 'Description',
									editorOptions: {
										showClearButton: true,
										displayMember: 'Description',
										directive: 'controlling-common-project-change-lookup'
									},
									editor: null,
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'controllingCommonProjectChangeLookupDataService',
										displayMember: 'Description',
										mainServiceName:'controllingGeneralContractorPrcContractsDataService',
										lookupType:'GccCommonProjectChange'
									}
								}
							]
						}
					};
				},

				getPesHeaderDetailLayout: function () {
					return {
						fid: 'controlling.generalcontractor.PesHeaderListController',
						version: '1.0.0',
						showGrouping: true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['code', 'description', 'pesvalue', 'pesstatusfk', 'mdccontrollingunitfk','prjchangefk']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							'code': {
								'navigator': {
									moduleName: 'procurement.pes',
									registerService: 'procurementPesHeaderService'
								},
								readonly: true
							},
							'description': {readonly: true},
							'pesvalue': {readonly: true},
							'pesstatusfk': {
								grid: {
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'PesStatus',
										displayMember: 'Description',
										imageSelector: 'platformStatusIconService'
									}
								},
								detail: {
									type: 'directive',
									model: 'PesStatusFk',
									directive: 'procurement-pes-header-status-combobox',
									options: {
										readOnly: true,
										imageSelector: 'platformStatusIconService'
									}
								},
								readonly: true
							},
							'mdccontrollingunitfk': {
								readonly: true,
								grid: {
									editor: 'directive',
									editorOptions: {
										showClearButton: true,
										displayMember: 'Code',
										directive: 'controlling-common-controlling-unit-lookup',
										'additionalColumns':true
									},
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'controllingCommonControllingUnitLookupDataService',
										displayMember: 'Code',
										mainServiceName:'controllingGeneralContractorPesHeaderDataService',
										lookupType:'GccCommonControllingUnit'
									},
									width: 130
								},
							},
							'prjchangefk': {
								readonly: true,
								'grid': {
									editor: 'directive',
									editorOptions: {
										showClearButton: true,
										displayMember: 'Code',
										directive: 'controlling-common-project-change-lookup',
										'additionalColumns':true
									},
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'controllingCommonProjectChangeLookupDataService',
										displayMember: 'Code',
										mainServiceName:'controllingGeneralContractorPesHeaderDataService',
										lookupType:'GccCommonProjectChange'
									},
									width: 130
								}
							}
						},
						'addition': {
							'grid': [
								{
									IsReadonly: true,
									'field': 'MdcControllingUnitFk',
									'displayMember': 'Description.Translated',
									'name$tr$': 'controlling.generalcontractor.entityControllingUnitDesc',
									'sortable': true,
									'width': 150,
									editorOptions: {
										showClearButton: true,
										displayMember: 'Description.Translated',
										directive: 'controlling-common-controlling-unit-lookup'
									},
									editor: null,
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'controllingCommonControllingUnitLookupDataService',
										'displayMember': 'Description.Translated',
										mainServiceName: 'controllingGeneralContractorPesHeaderDataService',
										lookupType: 'GccCommonControllingUnit'
									}
								},
								{
									IsReadonly: true,
									field: 'PrjChangeFk',
									'sortable': true,
									name$tr$: 'controlling.generalcontractor.entityPrjchangeDesc',
									displayMember: 'Description',
									editorOptions: {
										showClearButton: true,
										displayMember: 'Description',
										directive: 'controlling-common-project-change-lookup'
									},
									editor: null,
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'controllingCommonProjectChangeLookupDataService',
										displayMember: 'Description',
										mainServiceName:'controllingGeneralContractorPesHeaderDataService',
										lookupType:'GccCommonProjectChange'
									}
								}
							]
						}
					};
				},

				getActualDetailLayout: function () {
					return {
						fid: 'controlling.generalcontractor.ActualsListController',
						version: '1.0.0',
						showGrouping: true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['mdccontrollingunit', 'mdccontrollingunitdescription','code', 'companyyear', 'companyperiod','valuetypedescription',
									'amount', 'account','accountdescription', 'quantity', 'uom','uomdescription', 'commenttext', 'nominaldimension1', 'nominaldimension2']
							}
						],
						'overloads': {
							'mdccontrollingunit': {
								readonly: true,
							},
							'mdccontrollingunitdescription':{
								readonly: true,
							},
							'code': {
								readonly: true
							},
							'companyyear': {
								readonly: true
							},
							'companyperiod': {
								readonly: true
							},
							'valuetypedescription': {

							},
							'amount': {
								formatter: 'money',
								readonly: true
							},
							'account': {
								readonly: true
							},
							'accountdescription':{
								readonly: true
							},
							'quantity': {
								formatter: 'money',
								readonly: true
							},
							'uom':{
								readonly: true
							},
							'uomdescription':{
								readonly: true
							},
							'commenttext': {
								readonly: true
							},
							'nominaldimension1': {
								readonly: true
							},
							'nominaldimension2': {
								readonly: true
							}
						}
					};
				},

				getEstimateDetailLayout: function () {
					return {
						'fid': 'estimate.gcc.detailform',
						'version': '1.0.0',
						'showGrouping': true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['flag', 'code', 'descriptioninfo', 'esttypefk', 'eststatusfk', 'comment', 'budgettotal', 'dircosttotal','revenue']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],

						'overloads': {
							'flag': {
								width: 30,
								readonly: true,
								'formatter': function (row, cell, value /* , m, entity */) {
									value = !value? '':value;
									let outValue = '<div class="flex-align-center flex-element text-center">';

									if(value === '1'){ // green icon
										outValue += '<i class="block-image status-icons ico-status02" title="' + $translate.instant('controlling.generalcontractor.greenHints') + '"></i>';
									}else if(value === '2'){ // red icon
										outValue += '<i class="block-image status-icons ico-status39" title="' + $translate.instant('controlling.generalcontractor.redHints') + '"></i>';
									}else if(value === '3'){ // yellow icon
										outValue += '<i class="block-image type-icons ico-warning19" title="' + $translate.instant('controlling.generalcontractor.estYellowHints') + '"></i>';
									}else if(value === '4'){
										outValue += '<i class="block-image status-icons ico-status05" title="' + $translate.instant('controlling.generalcontractor.estYellowHints') + '"></i>';
									}

									outValue += '</div>';
									return outValue;
								}
							},
							'esttypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('estimate.lookup.esttype'),

							'eststatusfk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.eststatus', null, {
								showIcon: true
							})
						}
					};
				}
			};
		}
	]);
})(angular);
