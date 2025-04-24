(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.pes';

	var mod = angular.module(moduleName),
		procurementPesModuleName = 'procurement.pes',
		cloudCommonModule = 'cloud.common',
		procurementCommonModule = 'procurement.common',
		cellHighlightColor = '#ffa';

	mod.factory('procurementPesHeaderDetailLayout', ['platformLayoutHelperService', 'procurementPesHeaderService', 'basicsLookupdataConfigGenerator', '$injector',
		function (platformLayoutHelperService, procurementPesHeaderService, basicsLookupdataConfigGenerator, $injector) {
			return {
				'fid': 'procurement.pes.detailform',
				'version': '1.0.0',
				'showGrouping': true,
				'change': 'change',
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'baseGroup',
						'attributes': ['id', 'pesstatusfk', 'prcconfigurationfk', 'code', 'description', 'documentdate', 'datedeliveredfrom',
							'datedelivered', 'clerkprcfk', 'clerkprcdescription', 'clerkreqfk', 'clerkreqdescription', 'currencyfk',
							'exchangerate', 'prcstructurefk', 'pesvalue', 'pesvalueoc', 'pesvat', 'pesvatoc', 'totalstandardcost', 'isnotaccrual', 'billingschemafk', 'dateeffective',
							'bpdvatgroupfk', 'pesheaderfk', 'salestaxmethodfk','externalcode']
					},
					{
						'gid': 'supplier',
						'attributes': ['businesspartnerfk', 'subsidiaryfk', 'supplierfk', 'supplierbpname']
					},
					{
						'gid': 'project',
						'attributes': ['projectfk', 'projectstatusfk', 'conheaderfk', 'conheaderdescription', 'packagefk', 'packagedescription', 'controllingunitfk', 'controllingunitdescription']
					},
					{
						'gid': 'userDefinedFields',
						'attributes': ['userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [procurementPesModuleName, cloudCommonModule, procurementCommonModule],
					'extraWords': {
						baseGroup: {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'},
						Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
						Description: {
							location: procurementPesModuleName,
							identifier: 'entityDescription',
							initial: 'External Reference No.'
						},
						PesStatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: 'Status'},
						DocumentDate: {
							location: procurementPesModuleName,
							identifier: 'entityDocumentDate',
							initial: 'Document Date'
						},
						DateDeliveredFrom: {
							location: procurementPesModuleName,
							identifier: 'entityDateDeliveredFrom',
							initial: 'Date Delivered From'
						},
						DateDelivered: {
							location: procurementPesModuleName,
							identifier: 'entityDateDelivered',
							initial: 'Date Delivered'
						},
						BusinessPartnerFk: {
							location: cloudCommonModule,
							identifier: 'entityBusinessPartner',
							initial: 'Business Partner'
						},
						SubsidiaryFk: {location: cloudCommonModule, identifier: 'entitySubsidiary', initial: 'Subsidiary'},
						SupplierFk: {location: cloudCommonModule, identifier: 'entitySupplierCode', initial: 'Supplier Code'},
						ProjectFk: {location: cloudCommonModule, identifier: 'entityProjectNo', initial: 'Project No.'},
						ProjectStatusFk: {location: procurementCommonModule, identifier: 'projectStatus', initial: 'Project Status'},
						ConHeaderFk: {
							location: procurementPesModuleName,
							identifier: 'entityContractCode',
							initial: 'Contract'
						},
						PackageFk: {location: cloudCommonModule, identifier: 'entityPackage', initial: 'Package'},
						PrcConfigurationFk: {
							location: procurementPesModuleName,
							identifier: 'entityPrcConfigurationFk',
							initial: 'Configuration'
						},
						supplier: {location: cloudCommonModule, identifier: 'entitySupplier', initial: 'Supplier'},
						project: {location: cloudCommonModule, identifier: 'entityProject', initial: 'Project'},
						ClerkPrcFk: {
							location: procurementPesModuleName,
							identifier: 'entityClerkPrcFk',
							initial: 'Responsible'
						},
						ClerkReqFk: {
							location: procurementPesModuleName,
							identifier: 'entityClerkReqFk',
							initial: 'Requisition Owner'
						},
						CurrencyFk: {location: cloudCommonModule, identifier: 'entityCurrency', initial: 'Currency'},
						ExchangeRate: {'location': cloudCommonModule, 'identifier': 'entityRate', 'initial': 'Rate'},
						Remark: {location: cloudCommonModule, identifier: 'entityRemark', initial: 'Remarks'},
						ControllingUnitFk: {
							location: cloudCommonModule,
							identifier: 'entityControllingUnitCode',
							initial: 'Controlling Unit Code'
						},
						SupplierBPName: {
							location: cloudCommonModule,
							identifier: 'entitySupplierDescription',
							initial: 'Supplier Description'
						},
						ConHeaderDescription: {
							location: procurementPesModuleName,
							identifier: 'entityConHeaderDescription',
							initial: 'Contract Description'
						},
						ControllingUnitDescription: {
							location: cloudCommonModule,
							identifier: 'entityControllingUnitDesc',
							initial: 'Controlling Unit Description'
						},
						PackageDescription: {
							location: cloudCommonModule,
							identifier: 'entityPackageDescription',
							initial: 'Package Description'
						},
						ClerkPrcDescription: {
							location: procurementPesModuleName,
							identifier: 'entityClerkPrcDescription',
							initial: 'Responsible Description'
						},
						ClerkReqDescription: {
							location: procurementPesModuleName,
							identifier: 'entityClerkReqDescription',
							initial: 'Requisition Owner Description'
						},
						UserDefined1: {
							location: cloudCommonModule,
							identifier: 'entityUserDefined',
							initial: 'User Defined 1',
							param: {'p_0': '1'}
						},
						UserDefined2: {
							location: cloudCommonModule,
							identifier: 'entityUserDefined',
							initial: 'User Defined 2',
							param: {'p_0': '2'}
						},
						UserDefined3: {
							location: cloudCommonModule,
							identifier: 'entityUserDefined',
							initial: 'User Defined 3',
							param: {'p_0': '3'}
						},
						UserDefined4: {
							location: cloudCommonModule,
							identifier: 'entityUserDefined',
							initial: 'User Defined 4',
							param: {'p_0': '4'}
						},
						UserDefined5: {
							location: cloudCommonModule,
							identifier: 'entityUserDefined',
							initial: 'User Defined 5',
							param: {'p_0': '5'}
						},
						userDefinedFields: {
							location: procurementPesModuleName,
							identifier: 'entityUserDefinedFields',
							initial: 'User Defined Fields'
						},
						entityHistory: {location: cloudCommonModule, identifier: 'entityHistory', initial: 'History'},
						InsertedAt: {location: cloudCommonModule, identifier: 'entityInsertedAt', initial: 'Inserted At'},
						InsertedBy: {location: cloudCommonModule, identifier: 'entityInsertedBy', initial: 'Inserted By'},
						UpdatedAt: {location: cloudCommonModule, identifier: 'entityUpdatedAt', initial: 'Updated At'},
						UpdatedBy: {location: cloudCommonModule, identifier: 'entityUpdatedBy', initial: 'Updated By'},
						Version: {location: cloudCommonModule, identifier: 'entityVersion', initial: 'Version'},
						PrcStructureFk: {
							location: procurementPesModuleName,
							identifier: 'entityPrcStructureFk',
							initial: 'Structure Code'
						},
						PesValue: {location: cloudCommonModule, identifier: 'entityTotal', initial: 'Total'},
						PesValueOc: {location: procurementPesModuleName, identifier: 'entityPesValueOc', initial: 'Total(OC)'},
						PesVat: {location: procurementPesModuleName, identifier: 'entityPesVat', initial: 'VAT'},
						PesVatOc: {location: procurementPesModuleName, identifier: 'entityPesVatOc', initial: 'VAT(OC)'},
						TotalStandardCost: {location: procurementPesModuleName, identifier: 'entityTotalStandardCost', initial: 'Total Standard Cost'},
						IsNotAccrual: {location: procurementPesModuleName, identifier: 'entityIsNotAccrual', initial: 'Is Not Accrual'},
						BillingSchemaFk: {location: procurementCommonModule, identifier: 'billingSchema', initial: 'Billing Schema'},
						DateEffective: {location: 'basics.common', identifier: 'dateEffective', initial: 'Date Effective'},
						BpdVatGroupFk: {location: procurementCommonModule, identifier: 'entityVatGroup', initial: 'Vat Group'},
						PesHeaderFk: {location: procurementCommonModule, identifier: 'entityBasicPesHeader', initial: 'Basic Pes'},
						SalesTaxMethodFk: {location: procurementCommonModule, identifier: 'entitySalesTaxMethodFk', initial: 'Sales Tax Method'},
						ExternalCode: {location: procurementPesModuleName,identifier: 'externalCode',initial: 'External Code'}
					}
				},
				'overloads': {
					'id': {
						'readonly': true
					},
					'pesvalue': {
						'readonly': true
					},
					'pesvalueoc': {
						'readonly': true
					},
					'pesvat': {
						'readonly': true
					},
					'pesvatoc': {
						'readonly': true
					},
					'totalstandardcost': {
						'readonly': true
					},
					'prcstructurefk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'basics-procurementstructure-structure-dialog',
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
								directive: 'basics-procurementstructure-structure-dialog'
							},
							width: 150,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Prcstructure',
								displayMember: 'Code'
							}
						},
						'readonly': false
					},
					'code': {
						'width': 100
					},
					'pesstatusfk': {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'PesStatus',
								displayMember: 'Description',
								imageSelector: 'platformStatusIconService'
							}
						},
						'detail': {
							'type': 'directive',
							'model': 'PesStatusFk',
							'directive': 'procurement-pes-header-status-combobox',
							'options': {
								readOnly: true,
								imageSelector: 'platformStatusIconService'
							}
						},
						'readonly': true
					},
					'clerkprcfk': {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'clerk',
								displayMember: 'Code'
							},
							'editor': 'lookup',
							'editorOptions': {
								directive: 'cloud-clerk-clerk-dialog',
								lookupOptions: {
									showClearButton: true
								}
							}
						},
						'detail': {
							'model': 'ClerkPrcFk',
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true
								}
							}
						}
					},
					'clerkprcdescription': {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'clerk',
								displayMember: 'Description'
							},
							'field': 'ClerkPrcFk'
						},
						'detail': {
							'type': 'directive',
							'directive': 'cloud-clerk-clerk-dialog-without-teams',
							'options': {
								displayMember: 'Description',
								readOnly: true
							},
							'model': 'ClerkPrcFk',
							'hide': true
						},
						'readonly': true
					},
					'clerkreqfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								directive: 'cloud-clerk-clerk-dialog',
								lookupOptions: {
									showClearButton: true
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'clerk',
								displayMember: 'Code'
							}
						},
						'detail': {
							'model': 'ClerkReqFk',
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true
								}
							}
						}
					},
					'clerkreqdescription': {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'clerk',
								displayMember: 'Description'
							},
							'field': 'ClerkReqFk'
						},
						'detail': {
							'type': 'directive',
							'directive': 'cloud-clerk-clerk-dialog-without-teams',
							'options': {
								displayMember: 'Description',
								readOnly: true
							},
							'model': 'ClerkReqFk'
						},
						'readonly': true
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
					'businesspartnerfk': {
						'navigator': {
							moduleName: 'businesspartner.main',
							registerService: 'businesspartnerMainHeaderDataService'
						},
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'BusinessPartner',
								displayMember: 'BusinessPartnerName1'
							},
							'editor': 'lookup',
							'editorOptions': {
								// 'directive': 'business-partner-main-business-partner-dialog',
								'directive': 'filter-business-partner-dialog-lookup',
								lookupOptions: {
									filterKey: 'businesspartner-main-businesspartner-for-pes-filter',
									'IsShowBranch': true,
									'mainService': 'procurementPesHeaderService',
									'BusinessPartnerField': 'BusinesspartnerFk',
									'SubsidiaryField': 'SubsidiaryFk',
									'SupplierField': 'SupplierFk'
								}
							}
						},
						'detail': {
							'type': 'directive',
							// 'directive': 'business-partner-main-business-partner-dialog',
							'directive': 'filter-business-partner-dialog-lookup',
							'options': {
								lookupDirective: 'filter-business-partner-dialog-lookup',
								filterKey: 'businesspartner-main-businesspartner-for-pes-filter',
								'IsShowBranch': true,
								'mainService': 'procurementPesHeaderService',
								'BusinessPartnerField': 'BusinesspartnerFk',
								'SubsidiaryField': 'SubsidiaryFk',
								'SupplierField': 'SupplierFk'
							},
							'model': 'BusinessPartnerFk'
						},
						'width': 140
					},
					'prcconfigurationfk': {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'PrcConfiguration',
								displayMember: 'DescriptionInfo.Translated'
							},
							'editor': 'lookup',
							'editorOptions': {
								directive: 'basics-configuration-configuration-combobox',
								lookupOptions: {
									filterKey: 'prc-pes-configuration-filter'
								}
							}
						},
						'detail': {
							'type': 'directive',
							'model': 'PrcConfigurationFk',
							'directive': 'basics-configuration-configuration-combobox',
							'options': {
								filterKey: 'prc-pes-configuration-filter'
							}
						}
					},
					'subsidiaryfk': {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'Subsidiary',
								displayMember: 'AddressLine'
							},
							'editor': 'lookup',
							'editorOptions': {
								directive: 'business-partner-main-subsidiary-lookup',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'businesspartner-main-subsidiary-for-pes-filter',
									displayMember: 'AddressLine'
								}
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'business-partner-main-subsidiary-lookup',
							'options': {
								filterKey: 'businesspartner-main-subsidiary-for-pes-filter',
								showClearButton: true,
								displayMember: 'AddressLine'
							},
							'model': 'SubsidiaryFk'
						}
					},
					'supplierfk': {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'Supplier',
								displayMember: 'Code'
							},
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'business-partner-main-supplier-dialog',
								'lookupOptions': {
									filterKey: 'businesspartner-main-supplier-for-pes-filter',
									showClearButton: true
								}
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'business-partner-main-supplier-lookup',
								descriptionMember: 'Description',
								lookupOptions: {
									filterKey: 'businesspartner-main-supplier-for-pes-filter',
									showClearButton: true
								}
							},
							'model': 'SupplierFk'
						}
					},
					'supplierbpname': {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'Supplier',
								displayMember: 'Description'
							},
							'field': 'SupplierFk'
						},
						'detail': {
							'type': 'directive',
							'directive': 'business-partner-main-supplier-lookup',
							'options': {
								displayMember: 'Description',
								readOnly: true
							},
							'model': 'SupplierFk'
						},
						'readonly': true
					},
					'projectfk': platformLayoutHelperService.provideProjectLookupOverload('project-main-project-for-pes-filter'),
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
					'conheaderfk': {
						'navigator': {
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
							}
						},
						'detail': {
							'model': 'ConHeaderFk',
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'prc-con-header-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'prc-con-header-for-pes-filter',
									title: {name: 'cloud.common.dialogTitleContract'}
								}
							}
						}
					},
					'conheaderdescription': {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'ConHeaderView',
								displayMember: 'Description'
							},
							'field': 'ConHeaderFk'
						},
						'detail': {
							'type': 'directive',
							'directive': 'prc-con-header-dialog',
							'options': {
								displayMember: 'Description',
								readOnly: true
							},
							'model': 'ConHeaderFk'
						},
						'readonly': true
					},
					'packagefk': {
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
							}
						},
						'detail': {
							'model': 'PackageFk',
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'procurement-common-package-lookup',
								descriptionMember: 'Description',
								lookupOptions: {
									filterKey: 'prc-boq-package-for-pes-filter',
									showClearButton: true
								}
							}
						}
					},
					'packagedescription': {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'PrcPackage',
								displayMember: 'Description'
							},
							'field': 'PackageFk'
						},
						'detail': {
							'type': 'directive',
							'directive': 'procurement-common-package-lookup',
							'options': {
								displayMember: 'Description',
								readOnly: true
							},
							'model': 'PackageFk'
						},
						'readonly': true
					},
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
									selectableCallback: function (dataItem) {
										return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, procurementPesHeaderService);
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
									selectableCallback: function (dataItem) {
										return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, procurementPesHeaderService);
									}
								}
							}
						}
					},
					'controllingunitdescription': {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'controllingunit',
								displayMember: 'DescriptionInfo.Translated'
							},
							'field': 'ControllingUnitFk'
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-master-data-context-controlling-unit-lookup',
							'options': {
								displayMember: 'DescriptionInfo.Translated',
								readOnly: true
							},
							'model': 'ControllingUnitFk'
						},
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
					'billingschemafk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'procurement-configuration-billing-schema-combobox',
								'lookupOptions': {
									'filterKey': 'prc-pes-billing-schema-filter'
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
								filterKey: 'prc-pes-billing-schema-filter'
							}
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
								procurementPesHeaderService.cellChange(item, field);
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
					pesheaderfk: {
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PesHeader',
								displayMember: 'Code'
							}
						},
						detail: {
							model: 'PesHeaderFk',
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								'lookupDirective': 'procurement-pes-header-lookup-directive',
								'descriptionMember': 'Description'
							}
						},
						readonly: true
					},
					'salestaxmethodfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.salestaxmethod', 'Description')
				},
				'addition': {
					'grid': extendGrouping([{
						'formatter': 'money',
						'field': 'TotalGross',
						'name': 'Total Gross',
						'name$tr$': 'procurement.common.totalGross',
						'width': 150
					}, {
						'formatter': 'money',
						'field': 'TotalGrossOc',
						'name': 'Total Gross (OC)',
						'name$tr$': 'procurement.common.totalOcGross',
						'width': 150
					},
					{
						afterId: 'pesheaderfk',
						id: 'pesheaderdescription',
						lookupDisplayColumn: true,
						field: 'PesHeaderFk',
						name: 'Basic Pes Description',
						name$tr$: 'procurement.common.entityBasicPesHeaderDesc',
						width: 180,
						sortable: true
					}, {
						'readOnly': true,
						'width': 150,
						'formatter': 'lookup',
						'id': 'CallOffMainContractFk',
						'field': 'CallOffMainContractFk',
						'name': 'Call Off\'s Main Contract',
						'name$tr$': 'procurement.common.callOffMainContract',
						'formatterOptions': {
							lookupType: 'ConHeaderView',
							displayMember: 'Code'
						},
						'navigator': {
							moduleName: 'procurement.contract',
							registerService: 'procurementContractHeaderDataService'
						}
					}, {
						'formatter': 'text',
						'field': 'CallOffMainContractDes',
						'name': 'Call Off\'s Main Contract Description',
						'name$tr$': 'procurement.common.callOffMainContractDes',
						'width': 150
					}, {
						'lookupDisplayColumn': true,
						'field': 'PackageFk',
						'displayMember': 'TextInfo',
						'name$tr$': 'procurement.common.entityPackageTextInfo',
						'width': 125
					},
					{
						'formatter': 'money',
						'field': 'BillingSchemaFinal',
						'name': 'Billing Schema Final',
						'name$tr$': 'procurement.common.billingSchemaFinal',
						'width': 150,
						readonly: true
					},{
						'formatter': 'money',
						'field': 'BillingSchemaFinalOC',
						'name': 'Billing Schema Final OC',
						'name$tr$': 'procurement.common.billingSchemaFinalOc',
						'width': 150,
						readonly: true
					}]),
					'detail': [{
						afterId: 'pesvatoc',
						rid: 'totalGross',
						gid: 'baseGroup',
						model: 'TotalGross',
						label: 'Total (Gross)',
						label$tr$: 'procurement.common.totalGross',
						type: 'decimal',
						readonly: true,
						options: {
							decimalPlaces: 2
						}
					}, {
						afterId: 'totalGross',
						rid: 'totalGrossOc',
						gid: 'baseGroup',
						model: 'TotalGrossOc',
						label: 'Total (Gross OC)',
						label$tr$: 'procurement.common.totalOcGross',
						type: 'decimal',
						readonly: true,
						options: {
							decimalPlaces: 2
						}
					}, {
						afterId: 'conHeaderFk',
						rid: 'callOffMainContract',
						gid: 'project',
						model: 'CallOffMainContractFk',
						label: 'Call Off\'s Main Contract',
						label$tr$: 'procurement.common.callOffMainContract',
						type: 'directive',
						directive: 'platform-composite-input',
						navigator: {
							moduleName: 'procurement.contract',
							registerService: 'procurementContractHeaderDataService'
						},
						options: {
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
						'afterId': 'PackageFk',
						'gid': 'project',
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
					},
					{
						afterId: 'schemaFinal',
						rid: 'BillingSchemaFinal',
						gid: 'baseGroup',
						model: 'BillingSchemaFinal',
						label: 'Billing Schema Final',
						label$tr$: 'procurement.common.billingSchemaFinal',
						type: 'money',
						readonly: true
					},{
						afterId: 'schemaFinalOc',
						rid: 'BillingSchemaFinalOC',
						gid: 'baseGroup',
						model: 'BillingSchemaFinalOC',
						label: 'Billing Schema Final OC',
						label$tr$: 'procurement.common.billingSchemaFinalOc',
						type: 'money',
						readonly: true
					}]
				}
			};
		}]);

	mod.factory('procurementPesItemDetailLayout', ['procurementCommonPrcItemFormatter', 'procurementPesItemService', 'basicsLookupdataConfigGenerator',
		'procurementCommonPriceConditionService', 'procurementPesHeaderService', 'accounting', 'platformLayoutHelperService', '$injector', 'basicsCommonRoundingService','procurementItemProjectChangeService',
		function (procurementCommonPrcItemFormatter, procurementPesItemService, basicsLookupdataConfigGenerator, priceConditionDataService, procurementPesHeaderService, accounting,
			platformLayoutHelperService, $injector, roundingService,procurementItemProjectChangeService) {
			let basRoundingDataService = roundingService.getService('basics.material');

			function highlightColumn(row, cell, value, columnDef, dataContext) {
				if (value === null) {
					value = dataContext[columnDef.field];
				}
				columnDef.domain='money';
				var highlightBg = '';
				var formatterVal = $injector.get('platformGridDomainService').formatter('money')(row, cell, value, columnDef);
				if (columnDef.field === 'Price' && dataContext.IsChangePrice) {
					highlightBg = 'background: ' + cellHighlightColor + ';';
				}
				if (columnDef.field === 'PriceOc' && dataContext.IsChangePriceOc) {
					highlightBg = 'background: ' + cellHighlightColor + ';';
				}
				if (columnDef.field === 'PriceGross' && dataContext.IsChangePriceGross) {
					highlightBg = 'background: ' + cellHighlightColor + ';';
				}
				if (columnDef.field === 'PriceGrossOc' && dataContext.IsChangePriceGrossOc) {
					highlightBg = 'background: ' + cellHighlightColor + ';';
				}
				return '<div style="' + highlightBg + 'width: 100%; height: 100%; top: 0;left: 0; text-align: right;box-sizing: border-box; /*padding-right: 4px; padding-top: 2px;*/">' + formatterVal + '</div>';
			}
			let layout = {
				'fid': 'procurement.pes.item.detailform',
				'version': '1.0.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'baseGroup',
						'attributes': ['conheaderfk', 'prcitemfk', /* 'prcitemdescription1', 'prcitemdescription2', */'description1', 'description2', 'prcitemspecification', 'itemno',
							'quantitycontracted', 'quantitycontractedconverted', 'quantitycontractedaccepted', 'quantitydelivered', 'quantitydeliveredconverted',
							'quantityremaining', 'quantityremainingconverted', 'quantityaskedfor', 'quantity', 'percentagequantity', 'quantityconverted',
							'uomfk', 'price', 'priceoc', 'projectfk', 'prcpackagefk', 'controllingunitfk', 'batchno',
							'prcstructurefk', 'isfinaldelivery', 'lotno', 'prcstocktransactionfk', 'prcstocktransactiontypefk',
							'prjstockfk', 'prjstocklocationfk', 'standardcost', 'provisionpercent', 'provisontotal', 'mdcmaterialfk', 'materialstockfk',/* 'materialcode', */
							'prcpriceconditionfk', 'priceextra', 'priceextraoc', 'mdctaxcodefk', 'isassetmanagement', 'controllinggrpsetfk', 'fixedassetfk', 'total', 'totaloc', 'pricegross', 'pricegrossoc', 'totalgross', 'totalgrossoc', 'totalprice', 'totalpriceoc', 'discountsplit', 'discountsplitoc', 'externalcode', 'materialexternalcode', 'totalpricegross', 'totalpricegrossoc', 'expirationdate', 'alternativeuomfk', 'alternativequantity', 'totaldelivered', 'totalocdelivered',
							'budgetperunit', 'budgettotal', 'budgetfixedunit', 'budgetfixedtotal', 'mdcsalestaxgroupfk', 'co2project', 'co2projecttotal', 'co2sourcetotal', 'co2source','invoicequantity','cumulativeinvoicedquantity']
					},
					{
						'gid': 'projectChange',
						'attributes': ['prjchangefk', 'prjchangestatusfk']
					},
					{
						'gid': 'userDefinedFields',
						'attributes': ['userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [procurementPesModuleName, cloudCommonModule, procurementCommonModule],
					'extraWords': {
						ItemNo: {location: procurementPesModuleName, identifier: 'entityItemNo', initial: 'Item NO.'},
						QuantityContracted: {
							location: procurementPesModuleName,
							identifier: 'entityQuantityContracted',
							initial: 'Contracted Quantity'
						},
						QuantityContractedAccepted: {
							location: procurementPesModuleName,
							identifier: 'entityQuantityContractedAccepted',
							initial: 'Contracted Quantity (Approved)'
						},
						QuantityDelivered: {
							location: procurementPesModuleName,
							identifier: 'entityQuantityDelivered',
							initial: 'Delivered Quantity'
						},
						QuantityAskedFor: {
							location: procurementPesModuleName,
							identifier: 'entityQuantityAskedFor',
							initial: 'Quantity Asked For'
						},
						Quantity: {
							location: procurementPesModuleName,
							identifier: 'entityQuantityConfirmed',
							initial: 'Quantity Confirmed'
						},
						PercentageQuantity: {
							location: procurementPesModuleName,
							identifier: 'percentageQuantity',
							initial: 'Percentage Quantity'
						},

						QuantityContractedConverted: {
							location: procurementPesModuleName,
							identifier: 'entityFactoredQuantityContracted',
							initial: 'Factored Contracted Quantity'
						},
						QuantityDeliveredConverted: {
							location: procurementPesModuleName,
							identifier: 'entityFactoredQuantityDelivered',
							initial: 'Factored Delivered Quantity'
						},
						QuantityConverted: {
							location: procurementPesModuleName,
							identifier: 'entityFactoredQuantityConfirmed',
							initial: 'Factored Quantity Confirmed'
						},

						UomFk: {location: cloudCommonModule, identifier: 'entityUoM', initial: 'Uom'},
						BatchNo: {
							location: procurementPesModuleName,
							identifier: 'entityBatchNo',
							initial: 'Batch No.'
						},
						ConHeaderFk: {
							location: procurementPesModuleName,
							identifier: 'entityConHeaderFk',
							initial: 'Contract'
						},
						PrcItemFk: {
							location: procurementPesModuleName,
							identifier: 'entityPrcItemFk',
							initial: 'Contract Item'
						},
						ProjectFk: {
							location: cloudCommonModule,
							identifier: 'entityProjectNo',
							initial: 'Project No.'
						},
						PrcPackageFk: {
							location: procurementPesModuleName,
							identifier: 'entityPackageFk',
							initial: 'Package'
						},
						ControllingUnitFk: {
							location: cloudCommonModule,
							identifier: 'entityControllingUnitCode',
							initial: 'Controlling Unit Code'
						},
						PrcStructureFk: {
							location: procurementPesModuleName,
							identifier: 'entityPrcStructureFk',
							initial: 'Structure Code'
						},
						MdcSalesTaxGroupFk: {
							location: cloudCommonModule,
							identifier: 'entityMdcSalesTaxGroupFk',
							initial: 'Sales Tax Group'
						},
						Price: {
							location: cloudCommonModule,
							identifier: 'entityPrice',
							initial: 'Price'
						},
						PriceOc: {
							location: procurementPesModuleName,
							identifier: 'entityPriceOc',
							initial: 'Price(OC)'
						},
						QuantityRemaining: {
							location: procurementPesModuleName,
							identifier: 'entityRemainingQuantity',
							initial: 'Remaining Quantity'
						},
						QuantityRemainingConverted: {
							location: procurementPesModuleName,
							identifier: 'entityFactoredRemainingQuantity',
							initial: 'Factored Remaining Quantity'
						},
						IsFinalDelivery: {
							location: procurementPesModuleName,
							identifier: 'entityIsFinalDelivery',
							initial: 'Is Final Delivery'
						},
						// PrcItemDescription1: {
						//     location: procurementCommonModule,
						//     identifier: 'prcItemDescription1',
						//     initial: 'prcItemDescription1'
						// },
						// PrcItemDescription2: {
						//     location: procurementCommonModule,
						//     identifier: 'prcItemFurtherDescription',
						//     initial: 'Further Description'
						// },
						Description1: {
							location: procurementCommonModule,
							identifier: 'prcItemDescription1',
							initial: 'prcItemDescription1'
						},
						Description2: {
							location: procurementCommonModule,
							identifier: 'prcItemFurtherDescription',
							initial: 'Further Description'
						},
						PrcStockTransactionTypeFk: {
							location: procurementCommonModule,
							identifier: 'entityPrcStockTransactionType',
							initial: 'Stock Transaction Type'
						},
						PrjStockFk: {
							location: procurementCommonModule,
							identifier: 'entityPrjStock',
							initial: 'Stock'
						},
						PrjStockLocationFk: {
							location: procurementCommonModule,
							identifier: 'entityPrjStockLocation',
							initial: 'Stock Location'
						},
						StandardCost: {
							location: procurementCommonModule,
							identifier: 'entityStandardCost',
							initial: 'Standard Cost'
						},
						ProvisionPercent: {
							location: procurementCommonModule,
							identifier: 'entityProvisionPercent',
							initial: 'Provision Percent'
						},
						ProvisonTotal: {
							location: procurementCommonModule,
							identifier: 'entityProvisonTotal',
							initial: 'Provison Total'
						},
						PrcStockTransactionFk: {
							location: procurementCommonModule,
							identifier: 'entityPrcStockTransaction',
							initial: 'Stock Transaction'
						},
						LotNo: {
							location: procurementCommonModule,
							identifier: 'entityLotNo',
							initial: 'Lot No.'
						},
						// MaterialCode: {
						//     location: procurementPesModuleName,
						//     identifier: 'entityMaterialFk',
						//     initial: 'Material No.'
						// },
						MdcMaterialFk: {
							location: procurementPesModuleName,
							identifier: 'entityMaterialFk',
							initial: 'Material No.'
						},
						MaterialStockFk: {
							location: procurementPesModuleName,
							identifier: 'entityStockMaterial',
							initial: 'Stock Material'
						},
						MdcTaxCodeFk: {
							location: cloudCommonModule,
							identifier: 'entityTaxCode',
							initial: 'entityTaxCode'
						},
						PrcPriceConditionFk: {
							location: cloudCommonModule,
							identifier: 'entityPriceCondition',
							initial: 'entityPriceCondition'
						},
						PriceExtra: {
							location: procurementCommonModule,
							identifier: 'prcItemPriceExtras',
							initial: 'prcItemPriceExtras'
						},
						PriceExtraOc: {
							location: procurementCommonModule,
							identifier: 'prcItemPriceExtrasCurrency',
							initial: 'prcItemPriceExtrasCurrency'
						},
						PrcItemSpecification: {
							location: cloudCommonModule,
							identifier: 'EntitySpec',
							initial: 'EntitySpec'
						},// ,
						// Description1:{
						//     location: procurementCommonModule,
						//     identifier: '',
						//     initial: 'PesItem Description 1'
						// },
						// Description2:{
						//     location: procurementCommonModule,
						//     identifier: '',
						//     initial: 'PesItem Description 2'
						// }
						IsAssetManagement: {
							location: procurementPesModuleName,
							identifier: 'entityIsAssetmanagement',
							initial: 'Is Assetmanagement'
						},
						ControllinggrpsetFk: {
							location: cloudCommonModule,
							identifier: 'entityControllinggrpset',
							initial: 'Controlling grp set'
						},
						FixedAssetFk: {
							location: cloudCommonModule,
							identifier: 'entityFixedAsset',
							initial: 'Fixed Asset'
						},
						Total: {
							location: cloudCommonModule,
							identifier: 'entityTotal',
							initial: 'Total'
						},
						TotalOc: {
							location: procurementCommonModule,
							identifier: 'prcItemTotalCurrency',
							initial: 'Total Currency'
						},
						PriceGross: {
							location: procurementCommonModule,
							identifier: 'priceGross',
							initial: 'Price Gross'
						},
						PriceGrossOc: {
							location: procurementCommonModule,
							identifier: 'priceOcGross',
							initial: 'Price Gross (Oc)'
						},
						TotalGross: {
							location: procurementCommonModule,
							identifier: 'totalGross',
							initial: 'Total (Gross)'
						},
						TotalGrossOc: {
							location: procurementCommonModule,
							identifier: 'totalOcGross',
							initial: 'Total Gross (Oc)'
						},
						TotalPrice: {
							location: procurementCommonModule,
							identifier: 'prcItemTotalPrice',
							initial: 'Total Price'
						},
						TotalPriceOc: {
							location: procurementCommonModule,
							identifier: 'prcItemTotalPriceCurrency',
							initial: 'Total Price (Currency)'
						},
						DiscountSplit: {
							location: procurementCommonModule,
							identifier: 'DiscountSplitEntity',
							initial: 'Discount Split'
						},
						DiscountSplitOc: {
							location: procurementCommonModule,
							identifier: 'DiscountSplitOcEntity',
							initial: 'Discount Split Oc'
						},
						ExternalCode: {
							location: procurementCommonModule,
							identifier: 'externalCode',
							initial: 'External Code'
						},
						MaterialExternalCode: {
							location: procurementCommonModule,
							identifier: 'prcItemMaterialExternalCode',
							initial: 'Material External Code'
						},
						TotalPriceGross: {
							location: procurementCommonModule,
							identifier: 'totalPriceGross',
							initial: 'Total Price Gross'
						},
						TotalPriceGrossOc: {
							location: procurementCommonModule,
							identifier: 'totalPriceGrossOc',
							initial: 'Total Price Gross (OC)'
						},
						ExpirationDate: {
							location: procurementCommonModule,
							identifier: 'ExpirationDate',
							initial: 'Expiration Date'
						},
						AlternativeUomFk: {
							location: procurementCommonModule,
							identifier: 'AlternativeUom',
							initial: 'Alternative Uom'
						},
						AlternativeQuantity: {
							location: procurementCommonModule,
							identifier: 'AlternativeQuantity',
							initial: 'Alternative Quantity'
						},
						TotalDelivered: {
							location: procurementPesModuleName,
							identifier: 'entityDeliveredTotal',
							initial: 'Delivered Total'
						},
						TotalOcDelivered: {
							location: procurementPesModuleName,
							identifier: 'entityDeliveredTotalOc',
							initial: 'Delivered Total Oc'
						},
						BudgetPerUnit: {
							location: procurementCommonModule,
							identifier: 'entityBudgetPerUnit',
							initial: 'Budget Per Unit'
						},
						BudgetTotal: {
							location: procurementCommonModule,
							identifier: 'entityBudgetTotal',
							initial: 'Budget Total'
						},
						BudgetFixedUnit: {
							location: procurementCommonModule,
							identifier: 'entityBudgetFixedUnit',
							initial: 'Budget Fixed Unit'
						},
						BudgetFixedTotal: {
							location: procurementCommonModule,
							identifier: 'entityBudgetFixedTotal',
							initial: 'Budget Fixed Total'
						},
						Co2Project: {
							location: procurementPesModuleName,
							identifier: 'entityCo2Project',
							initial: 'CO2/kg (Project)'
						},
						Co2ProjectTotal: {
							location: procurementPesModuleName,
							identifier: 'entityCo2ProjectTotal',
							initial: 'CO2/kg (Project Total)'
						},
						Co2SourceTotal: {
							location: procurementPesModuleName,
							identifier: 'entityCo2SourceTotal',
							initial: 'CO2/kg (Source Total)'
						},
						Co2Source: {
							location: procurementPesModuleName,
							identifier: 'entityCo2Source',
							initial: 'CO2/kg (Source)'
						},
						projectChange: {location: procurementCommonModule, identifier: 'projectChange', initial: 'Project Change'},
						PrjChangeFk: {location: procurementCommonModule, identifier: 'projectChange', initial: 'Project Change'},
						PrjChangeStatusFk: {location: procurementCommonModule, identifier: 'projectChangeStatus', initial: 'Project Change Status'},
						InvoiceQuantity: {location: procurementCommonModule, identifier: 'invoiceQuantity', initial: 'Invoice Quantity'},
						CumulativeInvoicedQuantity: {location: procurementCommonModule, identifier: 'cumulativeInvoicedQuantity', initial: 'Cumulative Invoiced Quantity'}
					}
				},
				'overloads': {
					'conheaderfk': {
						'navigator': {
							moduleName: 'procurement.contract',
							registerService: 'procurementContractHeaderDataService'
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'prc-con-header-dialog',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'procurement-pes-item-contract-filter',
									title: {name: 'cloud.common.dialogTitleContract'}
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'conheader',
								displayMember: 'Code'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'prc-con-header-dialog',
								'descriptionMember': 'Description',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'procurement-pes-item-contract-filter',
									title: {name: 'cloud.common.dialogTitleContract'}
								}
							},
							'change': 'formOptions.onPropertyChanged'
						}
					},
					'prcitemfk': {
						'detail': {
							'type': 'directive',
							'directive': 'procurement-common-item-merged-lookup',
							'options': {
								title: {name: 'Contract Item', name$tr$: 'procurement.pes.entityPrcItemFk'},
								disableDataCaching: true,
								showClearButton: true,
								filterKey: 'procurement-pes-item-item-filter'
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									title: {name: 'Contract Item', name$tr$: 'procurement.pes.entityPrcItemFk'},
									disableDataCaching: true,
									showClearButton: true,
									filterKey: 'procurement-pes-item-item-filter'
								},
								directive: 'procurement-common-item-merged-lookup'
							},
							// formatter: procurementCommonPrcItemFormatter,
							formatter: 'lookup',
							formatterOptions: {
								// create: {
								//     action: procurementPesItemService.createOtherItems
								// },
								lookupType: 'PrcItemMergedLookup',
								displayMember: 'ItemNO',
								version: 3
							},
							width: 100
						}
					},

					'quantitycontractedconverted': {
						'readonly': true,
						'width': 120
					},
					'quantitydeliveredconverted': {
						'readonly': true,
						'width': 120
					},
					'quantityremainingconverted': {
						'readonly': true,
						'width': 120
					},
					'quantityconverted': {
						'readonly': true,
						'width': 120
					},
					'quantitycontracted': {
						'readonly': true,
						'width': 120
					},
					'quantitycontractedaccepted': {
						'readonly': true,
						'width': 120
					},
					'quantitydelivered': {
						'readonly': true,
						'width': 120
					},
					'quantityremaining': {
						'readonly': true,
						'width': 120
					},
					'quantityaskedfor': {
						'width': 120
					},
					// 'materialcode': {
					//     readonly: true
					// },
					'mdcmaterialfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-material-material-lookup',
							'options': {
								'filterKey': 'procurement-pes-item-mdcmaterial-filter',
								'showClearButton': true,
								'gridOptions': {
									'multiSelect': true
								},
								'usageContext': 'procurementPesItemService'

							}
						},
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'MaterialCommodity',
								'displayMember': 'Code'
							},
							'editor': 'lookup',
							'editorOptions': {
								'lookupOptions': {
									'filterKey': 'procurement-pes-item-mdcmaterial-filter',
									'showClearButton': true,
									'gridOptions': {
										'multiSelect': true
									},
									'usageContext': 'procurementPesItemService'
								},
								'directive': 'basics-material-material-lookup'
							},
							'width': 100
						}
					},
					'materialstockfk': {
						'readonly': true,
						'detail': {
							'type': 'directive',
							'directive': 'basics-material-material-lookup',
							'options': {
								'showClearButton': true,
								'gridOptions': {
									'multiSelect': true
								}
							},
						},
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'MaterialCommodity',
								'displayMember': 'Code'
							},
							'editor': 'lookup',
							'editorOptions': {
								'lookupOptions': {
									'gridOptions': {
										'multiSelect': true
									}
								},
								'directive': 'basics-material-material-lookup'
							},
							'width': 100
						}
					},
					'mdctaxcodefk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'basics-master-data-context-tax-code-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									showClearButton: true
								}
							}
						},
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'TaxCode',
								displayMember: 'Code'
							},
							editor: 'lookup',
							editorOptions: {
								lookupField: 'MdcTaxCodeFk',
								lookupOptions: {
									showClearButton: true
								},
								directive: 'basics-master-data-context-tax-code-lookup'
							},
							width: 100
						}
					},
					'uomfk': {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-lookupdata-uom-lookup',
								lookupOptions: {
									isFastDataRecording: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'UoM',
								displayMember: 'Unit'
							}
						},
						'detail': {
							type: 'directive',
							directive: 'basics-lookupdata-uom-lookup'
						}
					},
					'alternativeuomfk': {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-lookupdata-uom-lookup',
								lookupOptions: {
									isFastDataRecording: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'UoM',
								displayMember: 'Unit'
							}
						},
						'detail': {
							type: 'directive',
							directive: 'basics-lookupdata-uom-lookup'
						}
					},
					'projectfk': platformLayoutHelperService.provideProjectLookupOverload(),
					'prcpackagefk': {
						navigator: {
							moduleName: 'procurement.package',
							registerService: 'procurementPackageDataService'
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'procurement-common-package-lookup',
								'lookupOptions': {
									'showClearButton': true,
									filterKey: 'procurement-pes-item-package-filter'
								}
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
								'lookupOptions': {
									'showClearButton': true,
									filterKey: 'procurement-pes-item-package-filter'
								}
							}
						}
					},
					'controllingunitfk': {
						navigator: {
							moduleName: 'controlling.structure'
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'controlling-structure-dialog-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									filterKey: 'controlling-unit-for-pes-item-filter',
									considerPlanningElement: true,
									selectableCallback: function (dataItem) {
										return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, procurementPesHeaderService);
									}
								}
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									filterKey: 'controlling-unit-for-pes-item-filter',
									considerPlanningElement: true,
									selectableCallback: function (dataItem) {
										return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, procurementPesHeaderService);
									}
								},
								directive: 'controlling-structure-dialog-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Controllingunit',
								displayMember: 'Code'
							},
							width: 130
						}
					},
					'prcstructurefk': {
						navigator: {
							moduleName: 'basics.procurementstructure'
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'basics-procurementstructure-structure-dialog',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {}
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {},
								directive: 'basics-procurementstructure-structure-dialog'
							},
							width: 150,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Prcstructure',
								displayMember: 'Code'
							}
						}
					},
					'mdcsalestaxgroupfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCustomSalesTaxGroupLookupDataService',
						desMember: 'DescriptionInfo.Translated',
						enableCache: true,
						showClearButton: true,
						filterKey: 'procurement-pes-item-mdcsalestaxgroup-filter'
					}),
					isfinaldelivery: {
						'width': 100
					},
					'price': {
						'detail': {
							'model': 'Price',
							'type': 'directive',
							'directive': 'procument-pes-item-highlight-cell-input',
							'options': {
								'judgeIsHighlightField': 'IsChangePrice',
								'hightlightColor': cellHighlightColor
							}
						},
						'grid': {
							'formatter': highlightColumn
						}
					},
					'priceoc': {
						'detail': {
							'model': 'PriceOc',
							'type': 'directive',
							'directive': 'procument-pes-item-highlight-cell-input',
							'options': {
								'judgeIsHighlightField': 'IsChangePriceOc',
								'hightlightColor': cellHighlightColor
							}
						},
						'grid': {
							'formatter': highlightColumn
						}
					},
					'pricegross': {
						'detail': {
							'model': 'PriceGross',
							'type': 'directive',
							'directive': 'procument-pes-item-highlight-cell-input',
							'options': {
								'judgeIsHighlightField': 'IsChangePriceGross',
								'hightlightColor': cellHighlightColor
							}
						},
						'grid': {
							'formatter': highlightColumn
						}
					},
					'pricegrossoc': {
						'detail': {
							'model': 'PriceGrossOc',
							'type': 'directive',
							'directive': 'procument-pes-item-highlight-cell-input',
							'options': {
								'judgeIsHighlightField': 'IsChangePriceGrossOc',
								'hightlightColor': cellHighlightColor
							}
						},
						'grid': {
							'formatter': highlightColumn
						}
					},
					'prjstockfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'projectStockLookupDataService',
						enableCache: true,
						valMember: 'Id',
						dispMember: 'Code',
						filterKey: 'procurement-pes-item-stock-type-filter',
						filter: function (item) {
							var prj = {PKey1: null, PKey2: null, PKey3: null};
							if (item) {
								prj.PKey2 = item.MaterialStockFk||item.MdcMaterialFk;
							} else {
								var headerSelectedItem = procurementPesHeaderService.getSelected();
								if (headerSelectedItem) {
									prj.PKey3 = headerSelectedItem.ProjectFk;
								} else {
									prj.PKey3 = 0;
								}
							}
							return prj;
						}
					}),
					'prjstocklocationfk': platformLayoutHelperService.provideProjectStockLocationLookupOverload(null, [{
						'projectFk': 'ProjectFk',
						projectFkReadOnly: false,
						getAdditionalEntity: function (item) {
							let prj = null;
							if (item) {
								let headerSelectedItem = procurementPesHeaderService.getSelected();
								if (headerSelectedItem) {
									prj = headerSelectedItem.ProjectFk;
								}
							}
							return {'ProjectFk': prj};
						}
					}, {
						'projectStockFk': 'PrjStockFk',
						projectStockFkReadOnly: false,
						getAdditionalEntity: function (item) {
							if (item) {
								return item;
							}
							return {'PrjStockFk': null};
						}
					}]),

					'prcstocktransactiontypefk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'procument-pes-stock-transactiontype-lookup-diaglog',
								'lookupOptions': {
									'filterKey': 'procurement-pes-item-transactiontype-filter'
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'PrcStocktransactiontype',
								'valueMember': 'Id',
								'displayMember': 'DescriptionInfo.Translated',
								'imageSelector': 'basicsCustomizeProcurementStockTransactionTypeIconService'
							},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'procument-pes-stock-transactiontype-lookup-diaglog',
							'options': {
								'filterKey': 'procurement-pes-item-transactiontype-filter'
							}
						}

					},
					'prcstocktransactionfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'procument-pes-stock-transaction-lookup-diaglog',
								'lookupOptions': {
									'filterKey': 'procurement-pes-item-transaction-filter',
									'showClearButton': true
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'PrcStocktransaction',
								'displayMember': 'MaterialDescription'
							},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'procument-pes-stock-transaction-lookup-diaglog',
							'options': {
								'filterKey': 'procurement-pes-item-transaction-filter',
								'showClearButton': true
							}
						}

					},
					'prcpriceconditionfk': {
						'detail': {
							'type': 'directive',
							'directive': 'item-basics-Material-Price-Condition-Combobox',
							'options': {
								filterKey: 'req-requisition-filter',
								showClearButton: true,
								dataService: priceConditionDataService.getService
							}
						},
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PrcPricecondition',
								displayMember: 'DescriptionInfo.Translated'
							},
							editor: 'lookup',
							editorOptions: {
								directive: 'item-basics-Material-Price-Condition-Combobox',
								lookupOptions: {
									filterKey: 'req-requisition-filter',
									showClearButton: true,
									dataService: priceConditionDataService.getService
								}
							},
							width: 180
						}
					},
					'priceextra': {
						'readonly': true,
						'mandatory': true
					},
					'priceextraoc': {
						'readonly': true,
						'mandatory': true
					},
					'prcitemspecification': {
						'grid': {
							'field': 'PrcItemFk',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PrcItemMergedLookup',
								displayMember: 'Specification',
								version: 3
							}
						},
						'detail': {
							'model': 'PrcItemFk',
							'type': 'directive',
							'directive': 'procurement-common-item-merged-lookup',
							'options': {
								disableDataCaching: true,
								displayMember: 'Specification',
								readOnly: true
							}
						},
						readonly: true
					},
					'controllinggrpsetfk': {
						'readonly': true,
						'detail': {
							visible: false
						},
						'grid': {
							field: 'image',
							formatter: 'image',
							formatterOptions: {
								imageSelector: 'controllingStructureGrpSetDTLActionProcessor'
							}
						}
					},
					fixedassetfk: {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-lookupdata-fixed-asset-lookup',
								lookupOptions: {
									filterKey: 'procurement-pes-item-fixed-asset-filter',
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'FixedAsset',
								displayMember: 'Asset'
							},
							width: 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'basics-lookupdata-fixed-asset-lookup',
								descriptionMember: 'Description',
								lookupOptions: {
									filterKey: 'procurement-pes-item-fixed-asset-filter',
									showClearButton: true
								}
							}
						}
					},
					'total': {
						'readonly': true,
						'mandatory': true
					},
					'totaloc': {
						'readonly': true,
						'mandatory': true
					},
					'totalgross': {
						'mandatory': true
					},
					'totalgrossoc': {
						'mandatory': true
					},
					'totalprice': {
						'readonly': true,
						'mandatory': true
					},
					'totalpriceoc': {
						'readonly': true,
						'mandatory': true
					},
					'discountsplit': {
						'readonly': true
					},
					'discountsplitoc': {
						'readonly': true
					},
					'totalpricegross': {
						'readonly': true
					},
					'totalpricegrossoc': {
						'readonly': true
					},
					'totaldelivered': {
						'readonly': true,
						'width': 120
					},
					'totalocdelivered': {
						'readonly': true,
						'width': 120
					},
					'co2project': {
						'readonly': true
					},
					'co2projecttotal': {
						'readonly': true
					},
					'co2sourcetotal': {
						'readonly': true
					},
					'co2source': {
						'readonly': true
					},
					'prjchangefk':       procurementItemProjectChangeService.getPrjChangeConfig(),
					'prjchangestatusfk': procurementItemProjectChangeService.getPrjChangeStatusConfig(),
					'cumulativeinvoicedquantity': {
						'readonly': true,
						'width': 180
					},
				},
				'addition': {
					'grid': extendGrouping([
						{
							'afterId': 'conheaderfk',
							'id': 'ConHeaderDescription',
							'field': 'ConHeaderFk',
							'name': 'Contract Description',
							'name$tr$': 'procurement.pes.entityConHeaderDescription',
							sortable: true,
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'conheaderview',
								displayMember: 'Description'
							},
							'width': 140
						},
						{
							'afterId': 'value',
							'id': 'vat',
							'field': 'Vat',
							'name': 'VAT',
							'name$tr$': 'procurement.pes.entityPesVat',
							'sortable': true,
							'formatter': 'money'
						},
						{
							'afterId': 'vat',
							'id': 'vatOC',
							'field': 'VatOC',
							'name': 'VAT(OC)',
							'name$tr$': 'procurement.pes.entityPesVatOc',
							'sortable': true,
							'formatter': 'money'
						},
						{
							'afterId': 'vatOC',
							'id': 'totalStandardCost',
							'field': 'TotalStandardCost',
							'name': 'Total Standard Cost',
							'name$tr$': 'procurement.pes.entityTotalStandardCost',
							'sortable': true,
							'formatter': 'money'
						},
						{
							'afterId': 'prcpackagefk',
							'id': 'packageDescription',
							lookupDisplayColumn: true,
							field: 'PrcPackageFk',
							name$tr$: 'cloud.common.entityPackageDescription',
							sortable: true,
							width: 145
						},
						{
							'afterId': 'controllingunitfk',
							'id': 'controllingUnitDescription',
							'lookupDisplayColumn': true,
							'field': 'ControllingUnitFk',
							'displayMember': 'DescriptionInfo.Translated',
							'name$tr$': 'cloud.common.entityControllingUnitDesc',
							sortable: true,
							'width': 150
						},
						{
							'afterId': 'prcstructurefk',
							'id': 'structureDescription',
							lookupDisplayColumn: true,
							field: 'PrcStructureFk',
							name$tr$: 'cloud.common.entityStructureDescription',
							sortable: true,
							displayMember: 'DescriptionInfo.Translated',
							width: 145
						},
						{
							'lookupDisplayColumn': true,
							'field': 'MdcTaxCodeFk',
							'displayMember': 'DescriptionInfo.Translated',
							'name$tr$': 'cloud.common.entityTaxCodeDescription',
							'width': 120
						},
						{
							lookupDisplayColumn: true,
							field: 'MaterialStockFk',
							name$tr$: 'procurement.pes.entityStockMaterialDescription',
							displayMember: 'DescriptionInfo.Translated',
							width: 150
						}
						// ,
						// {
						//    //'afterId': 'prcstocktransactiontypefk',
						//    //'id': 'materialDescription',
						//    //'formatter': 'lookup',
						//    //'formatterOptions': {
						//    //    lookupType: 'PrcStocktransactiontype',
						//    //    displayMember: 'Materiadescription'
						//    //},
						//    //field: 'PrcStockTransactionTypeFk',
						//    //name$tr$: 'procurement.pes.materialDescription',
						//    //sortable: true,
						//    //width: 145,
						//
						//    //'afterId': 'prcstocktransactiontypefk',
						//    //'id': 'materialDescription',
						//    //lookupDisplayColumn: true,
						//    //field: 'PrcStockTransactionTypeFk',
						//    //name$tr$:  'procurement.pes.materialDescription',
						//    //formatterOptions: {
						//    //    lookupType: 'PrcStocktransactiontype',
						//    //    displayMember: 'Materiadescription'
						//    //},
						//    //sortable: true,
						//    //width: 145
						//
						//    //'afterId': 'prcstocktransactiontypefk',
						//    //'lookupDisplayColumn': true,
						//    //'id': 'materialDescription',
						//    //'field': 'PrcStockTransactionTypeFk',
						//    //'name': 'materialDescription',
						//    //'name$tr$':  'procurement.pes.materialDescription',
						//    //formatter: 'lookup',
						//    //formatterOptions: {
						//    //    lookupType: 'PrcStocktransactiontype',
						//    //    displayMember: 'materialDescription'
						//    //},
						//    //sortable: true,
						//    //width: 145
						//
						//
						//    //'afterId': 'prcstocktransactiontypefk',
						//    //'id': 'materialDescription',
						//    //'field': 'PrcStockTransactionTypeFk',
						//    //'name': 'materialDescription',
						//    //'name$tr$': 'procurement.pes.materialDescription',
						//    //'editor': 'lookup',
						//    //'editorOptions': {
						//    //    'directive': 'procument-pes-stock-transactiontype-lookup-diaglog',
						//    //    'lookupOptions': {
						//    //        'filterKey': 'procurement-pes-item-transactiontype-filter',
						//    //        'displayMember': 'Materiadescription'
						//    //    }
						//    //},
						//    //'formatter': 'lookup',
						//    //'formatterOptions': {'lookupType': 'PrcStocktransactiontype', 'displayMember': 'Materiadescription'},
						//    //'width': 145
						// }
					]),
					'detail': [
						{
							'afterId': 'value',
							'rid': 'vat',
							'gid': 'baseGroup',
							'model': 'Vat',
							'label': 'VAT',
							'label$tr$': 'procurement.pes.entityPesVat',
							'type': 'money',
							'readonly': true
						},
						{
							'afterId': 'vat',
							'rid': 'vatOC',
							'gid': 'baseGroup',
							'model': 'VatOC',
							'label': 'VAT(OC)',
							'label$tr$': 'procurement.pes.entityPesVatOc',
							'type': 'money',
							'readonly': true
						},
						{
							'afterId': 'vatOC',
							'rid': 'totalStandardCost',
							'gid': 'baseGroup',
							'model': 'TotalStandardCost',
							'label': 'Total Standard Cost',
							'label$tr$': 'procurement.pes.entityTotalStandardCost',
							'type': 'money',
							'readonly': true
						}
					]
				}
			};
			basRoundingDataService.uiRoundingConfig(layout);
			return layout;
		}]);

	mod.factory('procurementPesShipmentInfoLayout', [
		function () {
			return {
				'fid': 'procurement.pes.shipmentInfo.detailform',
				'version': '1.0.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'baseGroup',
						'attributes': ['shipmentnumber', 'packinglistnumber', 'bascountryfk', 'totaldimension', 'totalweight']
					},
					{
						'gid': 'Carrier',
						'attributes': ['trackingnumber', 'carriername', 'carrierlink', 'logistics']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [procurementPesModuleName, cloudCommonModule, procurementCommonModule],
					'extraWords': {
						Shipmentnumber: {
							location: procurementPesModuleName,
							identifier: 'entityShipmentnumber',
							initial: 'Shipment Number'
						},
						Packinglistnumber: {
							location: procurementPesModuleName,
							identifier: 'entityPackinglistnumber',
							initial: 'Packinglist Number'
						},
						BasCountryFk: {
							location: procurementPesModuleName,
							identifier: 'entityBasCountryFk',
							initial: 'Country of Origin'
						},
						Totaldimension: {
							location: procurementPesModuleName,
							identifier: 'entityTotaldimension',
							initial: 'Total Dimension'
						},
						Totalweight: {
							location: procurementPesModuleName,
							identifier: 'entityTotalweight',
							initial: 'Total Weight'
						},
						Carrier: {
							location: procurementPesModuleName,
							identifier: 'groupCarrier',
							initial: 'Carrier'
						},
						Trackingnumber: {
							location: procurementPesModuleName,
							identifier: 'entityTrackingnumber',
							initial: 'Tracking Number'
						},
						Carriername: {
							location: procurementPesModuleName,
							identifier: 'entityCarriername',
							initial: 'Carrier Name'
						},
						Carrierlink: {
							location: procurementPesModuleName,
							identifier: 'entityCarrierlink',
							initial: 'Carrier Link'
						},
						Logistics: {
							location: procurementPesModuleName,
							identifier: 'entityLogistics',
							initial: 'Logistics'
						}
					}
				},
				'overloads': {
					'bascountryfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-country-combobox',
							'options': {
								displayMember: 'Description'
							}
						}
					},
					'logistics': {
						'detail': {
							'readonly': true
						}
					}
				}
			};
		}
	]);

	mod.factory('procurementPesAccrualDetailLayout', ['procurementCommonAccrualLayoutService',
		function (procurementCommonAccrualLayoutService) {
			return {
				'fid': 'procurement.pes.accrual.detailform',
				'version': '1.0.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'baseGroup',
						'attributes': ['dateeffective', 'companytransactionfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [procurementPesModuleName, cloudCommonModule],
					'extraWords': {
						DateEffective: {
							location: procurementPesModuleName,
							identifier: 'entityDateEffective',
							initial: 'Date Effective'
						},
						CompanyTransactionFk: {
							location: procurementPesModuleName,
							identifier: 'entityCompanyTransactionFk',
							initial: 'Company Transaction'
						}
					}
				},
				'overloads': {
					'dateeffective': {
						'readonly': true,
						'detail':{
							'type': 'dateutc',
							'formatter': 'dateutc'
						},
						'grid':{
							'editor': 'dateutc',
							'formatter': 'dateutc'
						}
					},
					'companytransactionfk': {
						readonly: true,
						width: 120
					}
				},
				'addition': procurementCommonAccrualLayoutService.addition()
			};
		}]);

	mod.value('procurementPesSelfbillingDetailLayout', {
		'fid': 'procurement.pes.selfbilling.detailform',
		'version': '1.0.0',
		'showGrouping': true,
		'addValidationAutomatically': true,
		'groups': [
			{
				'gid': 'baseGroup',
				'attributes': ['code', 'sbhstatusfk', 'billdate', 'description', 'deliveredfromdate', 'delivereddate', 'taxno', 'vatno', 'responsible',
					'comment', 'remark', 'userdefinedtext1', 'userdefinedtext2', 'userdefinedtext3', 'userdefinedtext4', 'userdefinedtext5',
					'userdefineddate1', 'userdefineddate2', 'userdefineddate3', 'userdefineddate4', 'userdefineddate5',
					'userdefinedmoney1', 'userdefinedmoney2', 'userdefinedmoney3', 'userdefinedmoney4', 'userdefinedmoney5', 'isprogress']
			},
			{
				'gid': 'entityHistory',
				'isHistory': true
			}
		],
		'translationInfos': {
			'extraModules': [procurementPesModuleName, cloudCommonModule],
			'extraWords': {
				Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
				SbhStatusFk: {location: procurementPesModuleName, identifier: 'selfBilling.sbhStatus', initial: 'Status'},
				BillDate: {location: procurementPesModuleName, identifier: 'selfBilling.billDate', initial: 'Bill Date'},
				Description: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},
				DeliveredFromDate: {location: procurementPesModuleName, identifier: 'selfBilling.deliveredfromDate', initial: 'Delivered From Date'},
				DeliveredDate: {location: procurementPesModuleName, identifier: 'selfBilling.deliveredDate', initial: 'Delivered Date'},
				TaxNo: {location: procurementPesModuleName, identifier: 'selfBilling.taxNo', initial: 'Tax No.'},
				VatNo: {location: procurementPesModuleName, identifier: 'selfBilling.vatNo', initial: 'Vat No.'},
				Responsible: {location: cloudCommonModule, identifier: 'entityResponsible', initial: 'Responsible'},
				Comment: {location: cloudCommonModule, identifier: 'entityComment', initial: 'Comments'},
				Remark: {location: cloudCommonModule, identifier: 'entityRemark', initial: 'Remark'},
				UserDefinedText1: {location: procurementPesModuleName, identifier: 'selfBilling.userDefinedText1', initial: 'User Defined Text1'},
				UserDefinedText2: {location: procurementPesModuleName, identifier: 'selfBilling.userDefinedText2', initial: 'User Defined Text2'},
				UserDefinedText3: {location: procurementPesModuleName, identifier: 'selfBilling.userDefinedText3', initial: 'User defined Text3'},
				UserDefinedText4: {location: procurementPesModuleName, identifier: 'selfBilling.userDefinedText4', initial: 'User defined Text4'},
				UserDefinedText5: {location: procurementPesModuleName, identifier: 'selfBilling.userDefinedText5', initial: 'User defined Text5'},
				UserDefinedDate1: {location: procurementPesModuleName, identifier: 'selfBilling.userDefinedDate1', initial: 'User defined Date1'},
				UserDefinedDate2: {location: procurementPesModuleName, identifier: 'selfBilling.userDefinedDate2', initial: 'User defined Date2'},
				UserDefinedDate3: {location: procurementPesModuleName, identifier: 'selfBilling.userDefinedDate3', initial: 'User defined Date3'},
				UserDefinedDate4: {location: procurementPesModuleName, identifier: 'selfBilling.userDefinedDate4', initial: 'User defined Date4'},
				UserDefinedDate5: {location: procurementPesModuleName, identifier: 'selfBilling.userDefinedDate5', initial: 'User defined Date5'},
				UserDefinedMoney1: {location: procurementPesModuleName, identifier: 'selfBilling.userDefinedMoney1', initial: 'User defined Money1'},
				UserDefinedMoney2: {location: procurementPesModuleName, identifier: 'selfBilling.userDefinedMoney2', initial: 'User defined Money2'},
				UserDefinedMoney3: {location: procurementPesModuleName, identifier: 'selfBilling.userDefinedMoney3', initial: 'User defined Money3'},
				UserDefinedMoney4: {location: procurementPesModuleName, identifier: 'selfBilling.userDefinedMoney4', initial: 'User defined Money4'},
				UserDefinedMoney5: {location: procurementPesModuleName, identifier: 'selfBilling.userDefinedMoney5', initial: 'User defined Money5'},
				IsProgress: {location: procurementPesModuleName, identifier: 'selfBilling.selfBillingIsProgress', initial: 'Is Progress'}
			}
		},
		'overloads': {
			'sbhstatusfk': {
				'readonly': true,
				'grid': {
					'formatter': 'lookup',
					'formatterOptions': {
						'displayMember': 'Description',
						'imageSelector': 'platformStatusIconService',
						'lookupModuleQualifier': 'prc.sbhstatus',
						'lookupSimpleLookup': true,
						'valueMember': 'Id'
					}
				},
				'detail': {
					'type': 'directive',
					'directive': 'basics-lookupdata-simple',
					'options': {
						'lookupType': 'prc.sbhstatus',
						'displayMember': 'Description',
						'valueMember': 'Id',
						'filter': {showIcon: true},
						'lookupModuleQualifier': 'prc.sbhstatus',
						'imageSelector': 'platformStatusIconService'
					}
				}
			},
			'code': {
				maxLength: 16
			},
			'description': {
				maxLength: 252
			},
			'taxno': {
				maxLength: 252
			},
			'vatno': {
				maxLength: 252
			},
			'responsible': {
				maxLength: 255
			},
			'comment': {
				maxLength: 255
			},
			'userdefinedtext1': {
				maxLength: 252
			},
			'userdefinedtext2': {
				maxLength: 252
			},
			'userdefinedtext3': {
				maxLength: 252
			},
			'userdefinedtext4': {
				maxLength: 252
			},
			'userdefinedtext5': {
				maxLength: 252
			}
		}
	});

	function extendGrouping(gridColumns) {
		angular.forEach(gridColumns, function (column) {
			angular.extend(column, {
				grouping: {
					title: column.name$tr$,
					getter: column.field,
					aggregators: [],
					aggregateCollapsed: true
				}
			});
		});

		return gridColumns;
	}
})(angular);