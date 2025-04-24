/**
 * Created by wuj on 3/6/2015.
 */
(function () {
	'use strict';
	/* jshint -W072 */

	var modName = 'basics.materialcatalog',
		cloudCommonModule = 'cloud.common';
	var enterPassword = 'basics.materialcatalog.enterPassword';
	angular.module(modName).factory('basicsMaterialCatalogLayout', ['basicsLookupdataConfigGenerator', '$translate', 'basicsMaterialCatalogService',
		function (basicsLookupdataConfigGenerator, $translate, mainServices) {
			let internetColumns;
			if (mainServices.isInternetFields) {
				internetColumns = ['materialcatalogtypefk', 'basrubriccategoryfk', 'code', 'descriptioninfo', 'validfrom',
					'validto', 'clerkfk', 'datadate', 'islive', 'isticketsystem','conheaderfk'];
			} else {
				internetColumns = ['materialcatalogtypefk', 'basrubriccategoryfk', 'code', 'descriptioninfo', 'validfrom',
					'validto', 'clerkfk', 'datadate', 'islive', 'isticketsystem', 'url', 'isinternetcatalog', 'urluser', 'password','conheaderfk'];
			}
			return {
				'fid': 'basics.materialCatalog.detail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': internetColumns
					},
					{
						'gid': 'supplierGroup',
						'attributes': ['businesspartnerfk', 'subsidiaryfk', 'supplierfk']
					},
					{
						'gid': 'termsGroup',
						'attributes': ['paymenttermfk', 'paymenttermfifk', 'paymenttermadfk', 'prcincotermfk', 'isneutral']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [modName, 'basics.clerk'],
					'extraWords': {
						moduleName: { location: modName, identifier: 'moduleName', initial: 'Material Catalog' },
						IsTicketsystem: { location: modName, identifier: 'isTicketSystem', initial: 'IsTicketsystem' },
						supplierGroup: {location: cloudCommonModule, identifier: 'entitySupplier', initial: 'Supplier'},
						termsGroup: {location: modName, identifier: 'termsGroup', initial: 'Terms'},
						MaterialCatalogTypeFk: {location: cloudCommonModule, identifier: 'entityType', initial: 'Type'},
						Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
						ValidFrom: {location: modName, identifier: 'validFrom', initial: 'Valid From'},
						ValidTo: {location: modName, identifier: 'validTo', initial: 'Valid To'},
						ClerkFk: {location: cloudCommonModule, identifier: 'entityResponsible', initial: 'Responsible'},
						DataDate: {location: modName, identifier: 'dataDate', initial: 'Date Version'},
						IsLive: {location: cloudCommonModule, identifier: 'entityIsLive', initial: 'Active'},
						IsTicketSystem: {location: cloudCommonModule, identifier: 'entityIsLive', initial: 'Is TicketSystem'},
						IsInternetCatalog: {location: modName, identifier: 'IsInternetCatalog', initial: 'Is Internet Catalog'},
						BusinessPartnerFk: {
							location: cloudCommonModule,
							identifier: 'entityBusinessPartner',
							initial: 'Business Partner'
						},
						BasRubricCategoryFk:{
							location: modName,
							identifier: 'baseRubricCategory',
							initial: 'Rubric Category'
						},
						SubsidiaryFk: {
							location: cloudCommonModule,
							identifier: 'entitySubsidiary',
							initial: 'Subsidiary'
						},
						SupplierFk: {location: cloudCommonModule, identifier: 'entitySupplier', initial: 'Supplier'},
						PaymentTermFk: {location: cloudCommonModule, identifier: 'entityPaymentTermPA', initial: 'Payment Term (PA)'},
						PaymentTermFiFk: {location: cloudCommonModule, identifier: 'entityPaymentTermFI', initial: 'Payment Term (FI)'},
						PaymentTermAdFk: {location: cloudCommonModule, identifier: 'entityPaymentTermAD', initial: 'Payment Term (AD)'},
						PrcIncotermFk: {
							location: cloudCommonModule,
							identifier: 'entityIncoterms',
							initial: 'Incoterms'
						},
						IsNeutral: {location: modName, identifier: 'isNeutral', initial: 'Neutral Material'},
						Url:{location: modName, identifier: 'url', initial: 'Url'},
						UrlUser:{location: modName, identifier: 'urlUser', initial: 'Url User'},
						Password:{location: modName, identifier: 'urlPassword', initial: 'Url Password',placeholder: '{{}}'},
						ConHeaderFk: {location: cloudCommonModule, identifier: 'cloud.common.entityContract', initial: 'Contract'}
					}
				},
				'overloads': {
					'islive': {
						'readonly': true
					},
					'materialcatalogtypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.materialcatalog.type', null, {
						field: 'Isframework',
						customBoolProperty: 'ISFRAMEWORK'
					}),

					'clerkfk': {
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
					'basrubriccategoryfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-rubric-category-combo-box',
							'options': {
								filterKey: 'mdc-material-catalog-rubric-category-filter'
							}
						},
						'grid': {
							readonly: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'RubricCategory',
								displayMember: 'Description'
							},
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-lookupdata-rubric-category-combo-box',
								lookupOptions: {
									filterKey: 'mdc-material-catalog-rubric-category-filter'
								}
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
								showClearButton: true,
								'IsShowBranch': true,
								'mainService':'basicsMaterialCatalogService',
								'BusinessPartnerField':'BusinessPartnerFk',
								'SubsidiaryField':'SubsidiaryFk',
								'SupplierField':'SupplierFk'
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								// directive: 'business-partner-main-business-partner-dialog',
								directive: 'filter-business-partner-dialog-lookup',
								lookupOptions: {
									showClearButton: true,
									'IsShowBranch': true,
									'mainService':'basicsMaterialCatalogService',
									'BusinessPartnerField':'BusinessPartnerFk',
									'SubsidiaryField':'SubsidiaryFk',
									'SupplierField':'SupplierFk'
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

					'subsidiaryfk': {
						'detail': {
							'type': 'directive',
							'directive': 'business-partner-main-subsidiary-lookup',
							'options': {
								filterKey: 'mdc-material-catalog-subsidiary-filter',
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
									filterKey: 'mdc-material-catalog-subsidiary-filter',
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
									filterKey: 'mdc-material-catalog-supplier-filter',
									showClearButton: true
								}
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-supplier-lookup',
								lookupOptions: {
									filterKey: 'mdc-material-catalog-supplier-filter',
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
							editor: 'lookup',
							editorOptions: {
								lookupField: 'PaymentTermFk',
								lookupOptions: {showClearButton: true, displayMember: 'Code'},
								directive: 'basics-lookupdata-payment-term-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PaymentTerm',
								displayMember: 'Code'
							}
						}
					},

					'paymenttermfifk': {
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
							editor: 'lookup',
							editorOptions: {
								lookupField: 'PaymentTermFk',
								lookupOptions: {showClearButton: true, displayMember: 'Code'},
								directive: 'basics-lookupdata-payment-term-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PaymentTerm',
								displayMember: 'Code'
							}
						}
					},

					'paymenttermadfk': {
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
							editor: 'lookup',
							editorOptions: {
								lookupField: 'PaymentTermFk',
								lookupOptions: {showClearButton: true, displayMember: 'Code'},
								directive: 'basics-lookupdata-payment-term-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PaymentTerm',
								displayMember: 'Code'
							}
						}
					},

					'prcincotermfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								showClearButton: true,
								lookupDirective: 'basics-lookupdata-incoterm-combobox',
								descriptionMember: 'Description'
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupField: 'PrcIncotermFk',
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
					'password': {
						'grid': {
							exclude: true
						},
						'detail': {
							placeholder: function (entity) {
								return entity.HasPassword ? '******' : $translate.instant(enterPassword);
							}
						}
					},
					'conheaderfk': {
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
					grid: [
						{
							lookupDisplayColumn: true,
							field: 'ClerkFk',
							name$tr$: 'cloud.common.entityResponsibleDescription',
							width: 145
						},
						{
							lookupDisplayColumn: true,
							field: 'SupplierFk',
							name$tr$: 'cloud.common.entitySupplierDescription',
							width: 125
						},
						{
							lookupDisplayColumn: true,
							field: 'PaymentTermFk',
							name$tr$: 'cloud.common.entityPaymentTermPaDescription',
							width: 150
						},
						{
							lookupDisplayColumn: true,
							field: 'PaymentTermFiFk',
							name$tr$: 'cloud.common.entityPaymentTermFiDescription',
							width: 150
						},
						{
							lookupDisplayColumn: true,
							field: 'PaymentTermAdFk',
							name$tr$: 'cloud.common.entityPaymentTermAdDescription',
							width: 150
						},{
							'lookupDisplayColumn': true,
							'field': 'PrcIncotermFk',
							'displayMember': 'DescriptionInfo.Translated',
							'name$tr$': 'cloud.common.entityIncotermCodeDescription',
							'width': 120
						},
					]
				},
				'overloadsMandatory': ['BusinessPartnerFk']
			};
		}]);

	angular.module(modName).factory('basicsMaterialCatalogUIStandardService',
		['platformUIStandardConfigService', 'basicsMaterialcatalogTranslationService', 'basicsMaterialCatalogLookUpItems',
			'basicsMaterialCatalogLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, lookUpItems,
				layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'MaterialCatalogDto',
					moduleSubModule: 'Basics.MaterialCatalog'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
					domainSchema.Password = {domain: 'password'};
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
