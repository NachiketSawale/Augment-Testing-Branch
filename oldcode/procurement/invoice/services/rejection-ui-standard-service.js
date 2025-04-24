(function () {
	'use strict';
	var modName = 'procurement.invoice',
		cloudCommonModule = 'cloud.common';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	angular.module(modName).factory('procurementInvoiceRejectionLayout', ['basicsLookupdataConfigGenerator',
		function (basicsLookupdataConfigGenerator) {
			return {
				'fid': 'procurement.invoice.detail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'invoiceService',
						'attributes': ['quantity', 'invrejectionreasonfk', 'uomfk', 'amountnet', 'amountnetoc', 'amounttotal', 'amounttotaloc', 'description', 'quantityaskedfor', 'quantityconfirmed', 'priceaskedforoc', 'priceconfirmedoc', 'itemreference', 'askedfortotal', 'confirmedtotal', 'nettotal', 'priceaskedfor', 'priceconfirmed', 'askedfortotaloc', 'confirmedtotaloc', 'nettotaloc', 'invrejectfk', 'controllinggrpsetfk', 'mdcsalestaxgroupfk']
					},
					{
						'gid': 'invoiceOther',
						'attributes': ['taxcodefk', 'commenttext', 'remark']
					},
					{'gid': 'entityHistory', 'isHistory': true}
				],
				'translationInfos': {
					'extraModules': [],
					'extraWords': {
						Quantity: {
							location: cloudCommonModule,
							identifier: 'entityQuantity',
							initial: 'entityQuantity'
						},
						InvRejectionReasonFk: {location: modName, identifier: 'entityRejection', initial: 'reason'},
						UomFk: {location: cloudCommonModule, identifier: 'entityUoM', initial: 'Uom'},
						CommentText: {
							location: cloudCommonModule,
							identifier: 'entityComment',
							initial: 'entityComment'
						},
						Remark: {location: cloudCommonModule, identifier: 'entityRemark', initial: 'entityRemark'},
						invoiceService: {location: modName, identifier: 'group.service', initial: 'invoiceService'},
						invoiceOther: {location: modName, identifier: 'group.other', initial: 'invoiceOther'},
						QuantityAskedFor: {location: modName, identifier: 'entityQuantityAskedFor', initial: 'Quantity Asked For'},
						QuantityConfirmed: {location: modName, identifier: 'entityQuantityConfirmed', initial: 'Quantity Confirmed'},
						PriceAskedFor: {location: modName, identifier: 'entityPriceAskedfor', initial: 'Price(Asked for)'},
						PriceConfirmed: {location: modName, identifier: 'entityPriceConfirmed', initial: 'Price(Confirmed)'},
						PriceAskedForOc: {location: modName, identifier: 'entityPriceAskedforOc', initial: 'Price(Asked For OC)'},
						PriceConfirmedOc: {location: modName, identifier: 'entityPriceConfirmedOc', initial: 'Price(Confirmed OC)'},
						Itemreference: {location: modName, identifier: 'entityItemreference', initial: 'Item reference'},
						AskedForTotal: {location: modName, identifier: 'askedForTotal', initial: 'Total(Asked For)'},
						ConfirmedTotal: {location: modName, identifier: 'confirmedTotal', initial: 'Total(Confirmed)'},
						NetTotal: {location: modName, identifier: 'netTotal', initial: 'Total(Net)'},
						AskedForTotalOc: {location: modName, identifier: 'askedForTotalOc', initial: 'Total(Asked For OC)'},
						ConfirmedTotalOc: {location: modName, identifier: 'confirmedTotalOc', initial: 'Total(Confirmed OC)'},
						NetTotalOc: {location: modName, identifier: 'netTotalOc', initial: 'Total(Net OC)'},
						InvRejectFk: {location: modName, identifier: 'view.rejection', initial: 'Rejection'},
						ControllinggrpsetFk: {location: cloudCommonModule, identifier: 'entityControllinggrpset', initial: 'Controlling grp set'},
						MdcSalesTaxGroupFk: {
							location: cloudCommonModule,
							identifier: 'entityMdcSalesTaxGroup',
							initial: 'Sales Tax Group'
						}
					}
				},
				'overloads': {
					'code': {
						'mandatory': true
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
					'amounttotal': {
						readonly: true
					},
					'amounttotaloc': {
						readonly: true
					},
					'invrejectionreasonfk': {
						'detail': {
							'type': 'directive',
							'directive': 'invoice-rejection-reason-lookup',
							'options': {
								showClearButton: false
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'invoice-rejection-reason-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'InvRejection',
								displayMember: 'DescriptionInfo.Translated'
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
					'askedfortotal': {
						readonly: true
					},
					'confirmedtotal': {
						readonly: true
					},
					'askedfortotaloc': {
						readonly: true
					},
					'confirmedtotaloc': {
						readonly: true
					},
					'invrejectfk': {
						'detail': {
							'type': 'directive',
							'directive': 'procurement-invoice-rejection-v-lookup',
							'options': {
								filterKey: 'procurement-invoice-rejection-rejection-filter'
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'procurement-invoice-rejection-v-lookup',
								lookupOptions: {
									filterKey: 'procurement-invoice-rejection-rejection-filter'
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'InvReject',
								displayMember: 'Description'
							}
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
					'mdcsalestaxgroupfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCustomSalesTaxGroupLookupDataService',
						desMember: 'DescriptionInfo.Translated',
						enableCache: true,
						showClearButton: true,
						filterKey: 'saleTaxCodeByLedgerContext-filter'
					})
				},
				'addition': {
					grid: [
						{
							'lookupDisplayColumn': true,
							'field': 'TaxCodeFk',
							'displayMember': 'DescriptionInfo.Translated',
							'name$tr$': 'cloud.common.entityTaxCodeDescription',
							'width': 150
						}
					]
				}
			};
		}]
	);

	angular.module(modName).factory('procurementInvoiceRejectionUIStandardService',
		['platformUIStandardConfigService', 'procurementInvoiceTranslationService',
			'procurementInvoiceRejectionLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'InvRejectDto',
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
