/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

// eslint-disable-next-line func-names
(function () {
	'use strict';
	var modName = 'sales.wip';
	var cloudCommonModule = 'cloud.common';
	var salesCommonModule = 'sales.common';

	angular.module(modName).factory('salesWipTransactionLayout', ['basicsLookupdataConfigGenerator', 'basicsCommonComplexFormatter',
		function (basicsLookupdataConfigGenerator, basicsCommonComplexFormatter) {
			var config;
			config =
				{
					'fid': 'sales.wip.detail',
					'version': '1.0.0',
					'addValidationAutomatically': true,
					'showGrouping': true,
					'change': 'change',
					'groups': [
						{
							'gid': 'wipTransaction',
							'attributes': ['transactionid', 'companyfk', 'companyinvoicefk', 'ordheaderfk', 'isconsolidated', 'ischange', 'currency', 'wipstatusfk', 'code', 'description', 'vatgroupfk', 'incoterm', 'incotermcode', 'datedocument', 'dateeffective', 'datedelivered', 'datedeliveredfrom', 'addressfk', 'itemreference', 'amount', 'vatamount', 'amountoc', 'vatamountoc', 'quantity', 'incamount', 'incvatamount', 'incamountoc', 'incvatamountoc', 'incquantity', 'price', 'vatprice', 'priceoc', 'vatpriceoc', 'nominalaccount', 'nominaldimension1', 'nominaldimension2', 'nominaldimension3', 'taxcodefk', 'taxcodematrixcode', 'vatcode', 'vatpercent', 'controllingunitcode', 'controllingunitassign01', 'controllingunitassign01desc', 'controllingunitassign02', 'controllingunitassign02desc', 'controllingunitassign03', 'controllingunitassign03desc', 'controllingunitassign04', 'controllingunitassign04desc', 'controllingunitassign05', 'controllingunitassign05desc', 'controllingunitassign06', 'controllingunitassign06desc', 'controllingunitassign07', 'controllingunitassign07desc', 'controllingunitassign08', 'controllingunitassign08desc', 'controllingunitassign09', 'controllingunitassign09desc', 'controllingunitassign10', 'controllingunitassign10desc', 'boqheaderfk', 'boqitemfk', 'itemdescription1', 'itemdescription2', 'itemspecification', 'itemuomquantity', 'issuccess', 'handoverid', 'returnvalue', 'wipno', 'userdefined1', 'userdefined2', 'userdefined3', 'controllingunitassign01comment', 'controllingunitassign02comment', 'controllingunitassign03comment', 'controllingunitassign04comment', 'controllingunitassign05comment', 'controllingunitassign06comment', 'controllingunitassign07comment', 'controllingunitassign08comment', 'controllingunitassign09comment', 'controllingunitassign10comment', 'iscanceled']
						},
						{'gid': 'entityHistory', 'isHistory': true}
					],
					'overloads': {
						'transactionid': {readonly: true},
						'companyfk': {
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
						'companyinvoicefk': {
							grid: {
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-company-company-lookup'
								},
								formatter: 'lookup',
								formatterOptions: {'lookupType': 'Company', 'displayMember': 'Code'},
								width: 100
							},
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'basics-company-company-lookup',
									descriptionMember: 'CompanyName'
								}
							},
							readonly: true
						},
						'ordheaderfk': {
							grid: {
								editor: 'lookup',
								directive: 'basics-lookupdata-lookup-composite',
								editorOptions: {
									lookupDirective: 'sales-common-contract-dialog'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'SalesContract',
									displayMember: 'Code'
								}
							},
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'sales-common-contract-dialog',
									descriptionMember: 'DescriptionInfo.Translated',
								}
							},
							readonly: true
						},
						'isconsolidated': {readonly: true},
						'ischange': {readonly: true},
						'currency': {readonly: true},
						'wipstatusfk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.workinprogressstatus', null, {
							showIcon: true
						}),
						'code': {readonly: true},
						'description': {readonly: true},
						'vatgroupfk': {
							grid: {
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-lookupdata-simple',
									lookupOptions: {
										displayMember: 'Description',
										lookupModuleQualifier: 'businesspartner.vatgroup',
										lookupType: 'businesspartner.vatgroup',
										valueMember: 'Id'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									displayMember: 'Description',
									lookupModuleQualifier: 'businesspartner.vatgroup',
									lookupType: 'businesspartner.vatgroup',
									lookupSimpleLookup: true,
									valueMember: 'Id'
								}
							},
							detail: basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('businesspartner.vatgroup', null, null, false, {}),
							readonly: true
						},
						'incoterm': {readonly: true},
						'incotermCode': {readonly: true},
						'datedocument': {readonly: true},
						'dateeffective': {readonly: true},
						'datedelivered': {readonly: true},
						'datedeliveredfrom': {readonly: true},
						'addressfk': {
							grid: {
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-common-address-dialog',
									lookupOptions: {
										foreignKey: 'AddressFk',
										titleField: 'cloud.common.address'
									}
								},
								formatter: basicsCommonComplexFormatter,
								field: 'AddressEntity',
								formatterOptions: {
									displayMember: 'AddressLine'
								}
							},
							detail: {
								type: 'directive',
								directive: 'basics-common-address-dialog',
								model: 'AddressEntity',
								options: {
									titleField: 'cloud.common.address',
									foreignKey: 'AddressFk',
									hideEditButton: true,
								}
							},
							readonly: true
						},
						'itemreference': {readonly: true},// wait
						'amount': {readonly: true},
						'vatamount': {readonly: true},
						'amountoc': {readonly: true},
						'vatamountoc': {readonly: true},
						'quantity': {readonly: true},
						'incamount': {readonly: true},
						'incvatamount': {readonly: true},
						'incamountoc': {readonly: true},
						'incvatamountoc': {readonly: true},
						'incquantity': {readonly: true},
						'price': {readonly: true},
						'vatprice': {readonly: true},
						'priceoc': {readonly: true},
						'vatpriceoc': {readonly: true},
						'nominalaccount': {readonly: true},
						'nominaldimension1': {readonly: true},
						'nominaldimension2': {readonly: true},
						'nominaldimension3': {readonly: true},
						'taxcodefk': {
							grid: {
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
							},
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'basics-master-data-context-tax-code-lookup',
									descriptionMember: 'DescriptionInfo.Translated'
								}
							},
							readonly: true
						},
						'taxcodematrixcode': {readonly: true},// wait
						'vatcode': {readonly: true},
						'vatpercent': {readonly: true},
						'controllingunitcode': {readonly: true},
						'controllingunitassign01': {readonly: true},
						'controllingunitassign01desc': {readonly: true},
						'controllingunitassign02': {readonly: true},
						'controllingunitassign02desc': {readonly: true},
						'controllingunitassign03': {readonly: true},
						'controllingunitassign03desc': {readonly: true},
						'controllingunitassign04': {readonly: true},
						'controllingunitassign04desc': {readonly: true},
						'controllingunitassign05': {readonly: true},
						'controllingunitassign05desc': {readonly: true},
						'controllingunitassign06': {readonly: true},
						'controllingunitassign06desc': {readonly: true},
						'controllingunitassign07': {readonly: true},
						'controllingunitassign07desc': {readonly: true},
						'controllingunitassign08': {readonly: true},
						'controllingunitassign08desc': {readonly: true},
						'controllingunitassign09': {readonly: true},
						'controllingunitassign09desc': {readonly: true},
						'controllingunitassign10': {readonly: true},
						'controllingunitassign10desc': {readonly: true},
						'boqheaderfk': {readonly: true},
						'boqitemfk': {readonly: true},
						'itemdescription1': {readonly: true},
						'itemdescription2': {readonly: true},
						'itemspecification': {readonly: true},
						'itemuomquantity': {readonly: true},
						'issuccess': {readonly: true},
						'handoverid': {readonly: true},
						'returnvalue': {readonly: true},
						'wipno': {readonly: true},
						'userdefined1': {readonly: true},
						'userdefined2': {readonly: true},
						'userdefined3': {readonly: true},
						'controllingunitassign01comment': {readonly: true},
						'controllingunitassign02comment': {readonly: true},
						'controllingunitassign03comment': {readonly: true},
						'controllingunitassign04comment': {readonly: true},
						'controllingunitassign05comment': {readonly: true},
						'controllingunitassign06comment': {readonly: true},
						'controllingunitassign07comment': {readonly: true},
						'controllingunitassign08comment': {readonly: true},
						'controllingunitassign09comment': {readonly: true},
						'controllingunitassign10comment': {readonly: true},
						'iscanceled': {readonly: true}
					},
					'addition': {
						grid: [
							{
								'lookupDisplayColumn': true,
								'afterId': 'companyfk',
								'field': 'CompanyFk',
								'name$tr$': 'cloud.common.entityCompanyName',
								'displayMember': 'CompanyName',
								'width': 140
							},
							{
								'lookupDisplayColumn': true,
								'afterId': 'companyinvoicefk',
								'field': 'CompanyInvoiceFk',
								'displayMember': 'CompanyName',
								'name$tr$': 'sales.common.transaction.conHeaderCompanyInvoicedCodeDescription',
								'width': 100
							},
							{
								'lookupDisplayColumn': true,
								'afterId': 'taxCodefk',
								'field': 'TaxCodeFk',
								'displayMember': 'DescriptionInfo.Translated',
								'name$tr$': 'cloud.common.entityTaxCodeDescription',
								'width': 150
							}
						],
						detail: []
					}
				};
			return config;
		}]);

	/* jshint -W106 */ // Variable name is according usage in translation json
	angular.module(modName).value('salesWipransactionTranslations', {
		translationInfos: {
			'extraModules': [salesCommonModule, cloudCommonModule],
			'extraWords': {
				wipTransaction: {location: salesCommonModule, identifier: 'transaction.group', initial: 'Transaction'},
				TransactionId: {
					location: salesCommonModule,
					identifier: 'transaction.transactionId',
					initial: 'Transaction Id'
				},
				CompanyFk: {
					location: cloudCommonModule,
					identifier: 'entityCompany',
					initial: 'Company Code'
				},
				CompanyInvoiceFk: {
					location: salesCommonModule,
					identifier: 'transaction.conHeaderCompanyInvoicedCode',
					initial: 'Invoiced Company Code'
				},
				WipHeaderFk: {
					location: salesCommonModule,
					identifier: 'transaction.wipHeader',
					initial: 'Wip Header'
				},
				OrdHeaderFk: {
					location: salesCommonModule,
					identifier: 'transaction.ordHeader',
					initial: 'Ord Header'
				},
				Isconsolidated: {
					location: salesCommonModule,
					identifier: 'transaction.isConsolidated',
					initial: 'Consolidated'
				},
				Ischange: {
					location: salesCommonModule,
					identifier: 'transaction.isChange',
					initial: 'Change'
				},
				Currency: {location: salesCommonModule, identifier: 'entityCurrencyFk', initial: 'Currency'},
				WipStatusFk: {
					location: salesCommonModule,
					identifier: 'transaction.wipStatus',
					initial: 'Wip Status'
				},
				Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
				Description: {
					location: cloudCommonModule,
					identifier: 'entityDescription',
					initial: '*Description'
				},
				VatGroupFk: {
					location: cloudCommonModule,
					identifier: 'transaction.entityVatGroup',
					initial: 'Vat Group'
				},
				Incoterm: {location: cloudCommonModule, identifier: 'entityIncoterms', initial: 'Incoterm'},
				IncotermCode: {location: cloudCommonModule, identifier: 'entityIncotermCode', initial: 'Incoterm Code'},
				DateDocument: {
					location: salesCommonModule,
					identifier: 'transaction.documentDate',
					initial: 'Document Date'
				},
				DateDelivered: {
					location: salesCommonModule,
					identifier: 'transaction.dateDelivered',
					initial: 'Date Delivered'
				},
				DateDeliveredfrom: {
					location: salesCommonModule,
					identifier: 'transaction.dateDeliveredfrom',
					initial: 'Date Delivered From'
				},
				AddressFk: {location: cloudCommonModule, identifier: 'address', initial: 'Address'},
				ItemReference: {
					location: salesCommonModule,
					identifier: 'transaction.entityItemreference',
					initial: 'Item reference'
				},
				Amount: {location: salesCommonModule, identifier: 'transaction.amount', initial: 'Amount'},
				AmountOc: {location: salesCommonModule, identifier: 'transaction.amountOc', initial: 'Amount Oc'},
				VatAmount: {
					location: salesCommonModule,
					identifier: 'transaction.vatAmount',
					initial: 'Vat Amount'
				},
				VatAmountOc: {
					location: salesCommonModule,
					identifier: 'transaction.vatAmountOc',
					initial: 'Vat Amount Oc'
				},
				IncAmount: {
					location: salesCommonModule,
					identifier: 'transaction.incAmount',
					initial: 'Inc Amount'
				},
				IncAmountOc: {
					location: salesCommonModule,
					identifier: 'transaction.incAmountOc',
					initial: 'Inc Amount Oc'
				},
				IncVatAmount: {
					location: salesCommonModule,
					identifier: 'transaction.incVatAmount',
					initial: 'Inc Vat Amount'
				},
				IncVatAmountOc: {
					location: salesCommonModule,
					identifier: 'transaction.incVatAmountOC',
					initial: 'Inc Vat Amount Oc'
				},
				Quantity: {location: salesCommonModule, identifier: 'transaction.quantity', initial: 'Quantity'},
				IncQuantity: {
					location: salesCommonModule,
					identifier: 'transaction.incQuantity',
					initial: 'Inc Quantity'
				},
				Price: {location: cloudCommonModule, identifier: 'entityPrice', initial: 'Price'},
				VatPrice: {
					location: salesCommonModule,
					identifier: 'transaction.vatPrice',
					initial: 'Vat Price'
				},
				PriceOc: {location: salesCommonModule, identifier: 'transaction.priceOc', initial: 'Price OC'},
				VatPriceOc: {
					location: salesCommonModule,
					identifier: 'transaction.vatPriceOc',
					initial: 'Vat Price OC'
				},
				NominalAccount: {
					location: salesCommonModule,
					identifier: 'transaction.nominalAccount',
					initial: 'Nominal Account'
				},
				NominalDimension1: {
					location: salesCommonModule,
					identifier: 'transaction.nominaldimension1name',
					initial: 'Nominal Dimension 1'
				},
				NominalDimension2: {
					location: salesCommonModule,
					identifier: 'transaction.nominaldimension2name',
					initial: 'Nominal Dimension 2'
				},
				NominalDimension3: {
					location: salesCommonModule,
					identifier: 'transaction.nominaldimension3name',
					initial: 'Nominal Dimension 3'
				},
				TaxCodeFk: {
					location: cloudCommonModule,
					identifier: 'entityTaxCode',
					initial: 'Tax Code'
				},
				TaxCodeMatrixCode: {
					location: salesCommonModule,
					identifier: 'transaction.taxcodematrix',
					initial: 'Tax Code Matrix'
				},
				VatCode: {
					location: salesCommonModule,
					identifier: 'transaction.vatCode',
					initial: 'Vat Code'
				},
				VatPercent: {
					location: cloudCommonModule,
					identifier: 'entityVatPercent',
					initial: 'Vat Percent'
				},
				ControllingUnitCode: {
					location: salesCommonModule,
					identifier: 'transaction.controllingUnitCode',
					initial: 'Controlling Unit Code'
				},
				ControllingUnitAssign01: {
					location: salesCommonModule,
					identifier: 'transaction.controllingUnitAssign01',
					initial: 'Controlling Unit Assign01'
				},
				ControllingunitAssign01desc: {
					location: salesCommonModule,
					identifier: 'transaction.controllingUnitAssign01Desc',
					initial: 'Controlling Unit Assign01 Description'
				},
				ControllingUnitAssign02: {
					location: salesCommonModule,
					identifier: 'transaction.controllingUnitAssign02',
					initial: 'Controlling Unit Assign02'
				},
				ControllingunitAssign02desc: {
					location: salesCommonModule,
					identifier: 'transaction.controllingUnitAssign02Desc',
					initial: 'Controlling Unit Assign02 Description'
				},
				ControllingUnitAssign03: {
					location: salesCommonModule,
					identifier: 'transaction.controllingUnitAssign03',
					initial: 'Controlling Unit Assign03'
				},
				ControllingunitAssign03desc: {
					location: salesCommonModule,
					identifier: 'transaction.controllingUnitAssign03Desc',
					initial: 'Controlling Unit Assign03 Description'
				},
				ControllingUnitAssign04: {
					location: salesCommonModule,
					identifier: 'transaction.controllingUnitAssign04',
					initial: 'Controlling Unit Assign04'
				},
				ControllingunitAssign04desc: {
					location: salesCommonModule,
					identifier: 'transaction.controllingUnitAssign04Desc',
					initial: 'Controlling Unit Assign04 Description'
				},
				ControllingUnitAssign05: {
					location: salesCommonModule,
					identifier: 'transaction.controllingUnitAssign05',
					initial: 'Controlling Unit Assign05'
				},
				ControllingunitAssign05desc: {
					location: salesCommonModule,
					identifier: 'transaction.controllingUnitAssign05Desc',
					initial: 'Controlling Unit Assign05 Description'
				},
				ControllingUnitAssign06: {
					location: salesCommonModule,
					identifier: 'transaction.controllingUnitAssign06',
					initial: 'Controlling Unit Assign06'
				},
				ControllingunitAssign06desc: {
					location: salesCommonModule,
					identifier: 'transaction.controllingUnitAssign06Desc',
					initial: 'Controlling Unit Assign06 Description'
				},
				ControllingUnitAssign07: {
					location: salesCommonModule,
					identifier: 'transaction.controllingUnitAssign07',
					initial: 'Controlling Unit Assign07'
				},
				ControllingunitAssign07desc: {
					location: salesCommonModule,
					identifier: 'transaction.controllingUnitAssign07Desc',
					initial: 'Controlling Unit Assign07 Description'
				},
				ControllingUnitAssign08: {
					location: salesCommonModule,
					identifier: 'transaction.controllingUnitAssign08',
					initial: 'Controlling Unit Assign08'
				},
				ControllingunitAssign08desc: {
					location: salesCommonModule,
					identifier: 'transaction.controllingUnitAssign08Desc',
					initial: 'Controlling Unit Assign08 Description'
				},
				ControllingUnitAssign09: {
					location: salesCommonModule,
					identifier: 'transaction.controllingUnitAssign09',
					initial: 'Controlling Unit Assign09'
				},
				ControllingunitAssign09desc: {
					location: salesCommonModule,
					identifier: 'transaction.controllingUnitAssign09Desc',
					initial: 'Controlling Unit Assign09 Description'
				},
				ControllingUnitAssign10: {
					location: salesCommonModule,
					identifier: 'transaction.controllingUnitAssign10',
					initial: 'Controlling Unit Assign10'
				},
				ControllingunitAssign10desc: {
					location: salesCommonModule,
					identifier: 'transaction.controllingUnitAssign10Desc',
					initial: 'Controlling Unit Assign10 Description'
				},
				BoqHeaderFk: {location: salesCommonModule, identifier: 'transaction.boqHeader', initial: 'Boq Header'},
				BoqItemFk: {location: salesCommonModule, identifier: 'transaction.boqItem', initial: 'Boq Item'},
				ItemDescription1: {
					location: salesCommonModule,
					identifier: 'prcItemDescription1',
					initial: 'Description 1'
				},
				ItemDescription2: {
					location: salesCommonModule,
					identifier: 'prcItemDescription2',
					initial: 'Description 2'
				},
				ItemSpecification: {
					location: salesCommonModule,
					identifier: 'itemSpecification',
					initial: 'Specification'
				},
				ItemUomQuantity: {
					location: salesCommonModule,
					identifier: 'transaction.itemUomQuantity',
					initial: 'Item Uom Quantity'
				},
				IsSuccess: {
					location: salesCommonModule,
					identifier: 'transaction.isSuccess',
					initial: 'Is Success'
				},
				HandoverId: {
					location: salesCommonModule,
					identifier: 'transaction.handoverId',
					initial: 'Handover Id'
				},
				ReturnValue: {
					location: salesCommonModule,
					identifier: 'transaction.returnValue',
					initial: 'Return Value'
				},
				WipNo: {
					location: salesCommonModule,
					identifier: 'transaction.wipNo',
					initial: 'Wip No'
				},
				Userdefined1: {
					location: salesCommonModule,
					identifier: 'userDefined1',
					initial: 'User Defined 1'
				},
				Userdefined2: {
					location: salesCommonModule,
					identifier: 'userDefined2',
					initial: 'User Defined 2'
				},
				Userdefined3: {
					location: salesCommonModule,
					identifier: 'userDefined3',
					initial: 'User Defined 3'
				},
				ControllingunitAssign01Comment: {
					location: salesCommonModule,
					identifier: 'transaction.controllingUnitAssign01Comment',
					initial: 'Controlling Unit Assign01 Comment'
				},
				ControllingunitAssign02Comment: {
					location: salesCommonModule,
					identifier: 'transaction.controllingUnitAssign02Comment',
					initial: 'Controlling Unit Assign02 Comment'
				},
				ControllingunitAssign03Comment: {
					location: salesCommonModule,
					identifier: 'transaction.controllingUnitAssign03Comment',
					initial: 'Controlling Unit Assign03 Comment'
				},
				ControllingunitAssign04Comment: {
					location: salesCommonModule,
					identifier: 'transaction.controllingUnitAssign04Comment',
					initial: 'Controlling Unit Assign04 Comment'
				},
				ControllingunitAssign05Comment: {
					location: salesCommonModule,
					identifier: 'transaction.controllingUnitAssign05Comment',
					initial: 'Controlling Unit Assign05 Comment'
				},
				ControllingunitAssign06Comment: {
					location: salesCommonModule,
					identifier: 'transaction.controllingUnitAssign06Comment',
					initial: 'Controlling Unit Assign06 Comment'
				},
				ControllingunitAssign07Comment: {
					location: salesCommonModule,
					identifier: 'transaction.controllingUnitAssign07Comment',
					initial: 'Controlling Unit Assign07 Comment'
				},
				ControllingunitAssign08Comment: {
					location: salesCommonModule,
					identifier: 'transaction.controllingUnitAssign08Comment',
					initial: 'Controlling Unit Assign08 Comment'
				},
				ControllingunitAssign09Comment: {
					location: salesCommonModule,
					identifier: 'transaction.controllingUnitAssign09Comment',
					initial: 'Controlling Unit Assign09 Comment'
				},
				ControllingunitAssign10Comment: {
					location: salesCommonModule,
					identifier: 'transaction.controllingUnitAssign10Comment',
					initial: 'Controlling Unit Assign10 Comment'
				},
			}
		}
	});

	angular.module(modName).factory('salesWipTransactionUIStandardService',
		['platformUIStandardConfigService', 'salesWipTranslationService',
			'salesWipTransactionLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'WipTransactionDto',
					moduleSubModule: 'Sales.Wip'
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
