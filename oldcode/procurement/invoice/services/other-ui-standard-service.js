(function () {
	'use strict';
	var modName = 'procurement.invoice',
		cloudCommonModule = 'cloud.common';
	var procurementStructureModule = 'basics.procurementstructure';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module(modName).factory('procurementInvoiceOtherLayout', ['basicsLookupdataConfigGenerator','$injector','procurementInvoiceOtherDataService', 'platformLayoutHelperService',function (basicsLookupdataConfigGenerator,$injector,dataService, platformLayoutHelperService) {
		return {
			'fid': 'procurement.invoice.detail',
			'version': '1.0.0',
			'addValidationAutomatically': true,
			'showGrouping': true,
			'groups': [
				{
					'gid': 'invoiceService',
					'attributes': ['prcstructurefk', 'controllingunitfk', 'quantity', 'uomfk', 'amountnet', 'amountnetoc', 'amountgross',
						'amountgrossoc', 'amounttotal', 'amounttotaloc', 'amounttotalgross', 'amounttotalgrossoc', 'description', 'isassetmanagement',
						'fixedassetfk', 'bascompanydeferaltypefk', 'datedeferalstart', 'controllinggrpsetfk', 'mdcsalestaxgroupfk', 'jobfk',
						'userdefined1', 'userdefined2', 'userdefined3', 'account', 'accountdesc','icinvheadercode']
				},
				{
					'gid': 'invoiceOther',
					'attributes': ['taxcodefk', 'commenttext']
				},
				{'gid': 'entityHistory', 'isHistory': true}
			],
			'translationInfos': {
				'extraModules': [procurementStructureModule],
				'extraWords': {
					AmountTotal: {location: modName, identifier: 'amountTotal', initial: 'Amount(Total)'},
					AmountTotalOc: {location: modName, identifier: 'amountTotalOc', initial: 'Amount(Total OC)'},
					AmountTotalGross: {location: modName, identifier: 'amountTotalGross', initial: 'Amount Total Gross'},
					AmountTotalGrossOc: {location: modName, identifier: 'amountTotalOcGross', initial: 'Amount Total Gross (OC)'},
					Quantity: {location: cloudCommonModule, identifier: 'entityQuantity', initial: 'entityQuantity'},
					UomFk: {location: cloudCommonModule, identifier: 'entityUoM', initial: 'Uom'},
					CommentText: {location: cloudCommonModule, identifier: 'entityComment', initial: 'entityComment'},
					invoiceService: {location: modName, identifier: 'group.service', initial: 'invoiceService'},
					invoiceOther: {location: modName, identifier: 'group.other', initial: 'invoiceOther'},
					IsAssetManagement: {location: modName, identifier: 'entityIsAssetmanagement', initial: 'Is Assetmanagement'},
					FixedAssetFk: {location: cloudCommonModule, identifier: 'entityFixedAsset', initial: 'Fixed Asset'},
					BasCompanyDeferalTypeFk: {location: modName, identifier: 'entityCompanyDeferralType', initial: 'Deferral Type'},
					DateDeferalStart: {location: modName, identifier: 'entityDateDeferralStart', initial: 'Date Deferral Start'},
					ControllinggrpsetFk: {location: cloudCommonModule, identifier: 'entityControllinggrpset', initial: 'Controlling grp set'},
					AmountGross: {location: modName, identifier: 'amountUnitGross', initial: 'Amount Unit Gross'},
					AmountGrossOc: {location: modName, identifier: 'amountUnitOcGross', initial: 'Amount Unit Gross (OC)'},
					Account: {location: modName, identifier: 'account', initial: 'Account'},
					AccountDesc: {location: modName, identifier: 'accountDesc', initial: 'Account Description'},
					ICInvHeaderCode: {location: modName, identifier: 'iCInvoiceNo', initial: 'IC Invoice No.'},
					MdcSalesTaxGroupFk: {
						location: cloudCommonModule,
						identifier: 'entityMdcSalesTaxGroupFk',
						initial: 'Mdc Sales Tax Group'
					},
					JobFk: {location: modName, identifier: 'entityJob', initial: 'Job'},
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
					}
				}
			},
			'overloads': {
				'code': {
					'mandatory': true
				},
				'account': {
					readonly: true
				},
				'accountdesc': {
					readonly: true
				},
				'icinvheadercode': {
					readonly: true
				},
				'amountnet': {
					'grid': {
						'name': 'Amount(Unit)',
						'name$tr$': 'procurement.invoice.amountUnit'
					},
					'detail': {
						'label': 'Amount(Unit)',
						'label$tr$': 'procurement.invoice.amountUnit'
					}
				},
				'amountnetoc': {
					'grid': {
						'name': 'Amount(Unit OC)',
						'name$tr$': 'procurement.invoice.amountUnitOc'
					},
					'detail': {
						'label': 'Amount(Unit OC)',
						'label$tr$': 'procurement.invoice.amountUnitOc'
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
							lookupDirective: 'basics-procurementstructure-structure-dialog',
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								showClearButton: false
							}
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								showClearButton: false
							},
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
				'jobfk':  platformLayoutHelperService.provideJobLookupOverload(),
				'mdcsalestaxgroupfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsCustomSalesTaxGroupLookupDataService',
					desMember: 'DescriptionInfo.Translated',
					enableCache: true,
					showClearButton: true,
					filterKey: 'saleTaxCodeByLedgerContext-filter'
				}),
				'controllingunitfk': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							lookupDirective: 'controlling-structure-dialog-lookup',
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								filterKey: 'prc-invoice-controlling-unit-filter',
								showClearButton: false,
								considerPlanningElement: true,
								selectableCallback: function (dataItem) {
									return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, dataService);
								}
							}
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								filterKey: 'prc-invoice-controlling-unit-filter',
								showClearButton: false,
								considerPlanningElement: true,
								selectableCallback: function (dataItem) {
									return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, dataService);
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
				'taxcodefk': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							lookupDirective: 'basics-master-data-context-tax-code-lookup',
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								showClearButton: false
							}
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {showClearButton: false},
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
				'uomfk': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-uom-lookup',
						'options': {
							'eagerLoad': true
						}
					},
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
							lookupType: 'uom',
							displayMember: 'Unit'
						}
					}
				},
				'bascompanydeferaltypefk': {
					detail: {
						'type': 'directive',
						'directive': 'basics-company-deferaltype-lookup',
						'options': {
							filterKey: 'deferal-type-filter',
							displayMember: 'DescriptionInfo.Translated'
						}
					},
					grid: {
						editor: 'lookup',
						'editorOptions': {
							'directive': 'basics-company-deferaltype-lookup',
							'lookupOptions': {
								'filterKey': 'deferal-type-filter',
								'displayMember': 'DescriptionInfo.Translated'
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'companydeferaltype',
							displayMember: 'DescriptionInfo.Translated'
						},
						'width': 150
					}
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
								filterKey: 'procurement-invoice-item-fixed-asset-filter',
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
								filterKey: 'procurement-invoice-item-fixed-asset-filter',
								showClearButton: true
							}
						}
					}
				}

			},
			'addition': {
				grid: [
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
					}, {
						'lookupDisplayColumn': true,
						'field': 'TaxCodeFk',
						'displayMember': 'DescriptionInfo.Translated',
						'name$tr$': 'cloud.common.entityTaxCodeDescription',
						'width': 150
					}
				],
				detail: []
			}

		};
	}
	]);

	angular.module(modName).factory('procurementInvoiceOtherUIStandardService',
		['platformUIStandardConfigService', 'procurementInvoiceTranslationService',
			'procurementInvoiceOtherLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'InvOtherDto',
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

				var service = new BaseService(layout, domainSchema, translationService);

				platformUIStandardExtentService.extend(service, layout.addition, domainSchema);

				return service;
			}
		]);
})();
