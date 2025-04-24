/**
 * Created by Ivy on 07.20.2020.
 */

(function () {
	/* global $ */
	'use strict';
	var modName = 'procurement.common';
	var cloudCommonModule = 'cloud.common';
	var procurementCommonModule = 'procurement.common';
	var salesCommonModName = 'sales.common';
	var salesContractModName = 'sales.contract';

	angular.module(modName).factory('procurementContractTransactionLayout', [
		'prcAndSalesContractTransactionLayout',
		'prcOnlyContractTransactionLayout',
		function(
			commonLayout,
			prcOnlyLayout
		) {
			var basicDataArray = commonLayout.groups[0].attributes.concat(prcOnlyLayout.groups[0].attributes);
			var additionGridArray = commonLayout.addition.grid.concat(prcOnlyLayout.addition.grid);
			var prcCommonLayout = $.extend(true, {}, commonLayout, prcOnlyLayout);
			prcCommonLayout.groups[0].attributes = basicDataArray;
			prcCommonLayout.addition.grid = additionGridArray;
			return prcCommonLayout;
		}]);

	angular.module(modName).factory('salesOrdTransactionLayout', [
		'prcAndSalesContractTransactionLayout',
		'salesOnlyContractTransactionLayout',
		function(
			commonLayout,
			salesOnlyLayout
		) {
			var basicDataArray = commonLayout.groups[0].attributes.concat(salesOnlyLayout.groups[0].attributes);
			var additionGridArray = commonLayout.addition.grid.concat(salesOnlyLayout.addition.grid);
			var translationAddition = commonLayout.translationInfos.extraModules.concat(salesOnlyLayout.translationInfos.extraModules);
			var prcCommonLayout = $.extend(true, {}, commonLayout, salesOnlyLayout);
			prcCommonLayout.groups[0].attributes = basicDataArray;
			prcCommonLayout.addition.grid = additionGridArray;
			prcCommonLayout.translationInfos.extraModules = translationAddition;
			return prcCommonLayout;
		}]);

	angular.module(modName).factory('prcAndSalesContractTransactionLayout', [
		'basicsLookupdataConfigGenerator',
		'basicsCommonComplexFormatter',
		'$injector',
		function (
			basicsLookupdataConfigGenerator,
			basicsCommonComplexFormatter,
			$injector
		) {
			var config;
			config = {
				'fid': 'procurement.common.detail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'change':'change',
				'groups': [
					{
						'gid': 'conTransaction',
						'attributes': ['transactionid', 'companyfk', 'companyinvoicefk', 'isconsolidated', 'ischange', 'currency', 'code', 'description', 'dateordered', 'dateeffective', 'businesspartnerfk', 'subsidiaryfk', 'contactfk', 'bankfk', 'vatgroupfk', 'paymenttermfifk', 'paymenttermpafk', 'paymenttermadfk', 'incoterm', 'incotermcode', 'datedelivery', 'addressfk', 'itemreference', 'amount', 'vatamount', 'amountoc', 'vatamountoc', 'incamount', 'incvatamount', 'incamountoc', 'incvatamountoc', 'incquantity', 'quantity', 'price', 'vatprice', 'priceoc', 'vatpriceoc', 'nominalaccount', 'nominaldimension1', 'nominaldimension2', 'nominaldimension3', 'taxcodefk', 'taxcodematrixcode', 'vatcode', 'vatpercent', 'controllingunitfk', 'controllingunitassign01', 'controllingunitassign01desc', 'controllingunitassign02', 'controllingunitassign02desc', 'controllingunitassign03', 'controllingunitassign03desc', 'controllingunitassign04', 'controllingunitassign04desc', 'controllingunitassign05', 'controllingunitassign05desc', 'controllingunitassign06', 'controllingunitassign06desc', 'controllingunitassign07', 'controllingunitassign07desc', 'controllingunitassign08', 'controllingunitassign08desc', 'controllingunitassign09', 'controllingunitassign09desc', 'controllingunitassign10', 'controllingunitassign10desc', 'itemdescription1', 'itemdescription2', 'itemspecification', 'itemuomquantity', 'issuccess', 'handoverid', 'orderno', 'userdefined1', 'userdefined2', 'userdefined3', 'returnvalue']
					},
					{'gid': 'entityHistory', 'isHistory': true}
				],
				'translationInfos': {
					'extraModules': [modName, procurementCommonModule, cloudCommonModule],
					'extraWords': {
						conTransaction: { location: modName, identifier: 'transaction.group', initial: 'Transaction' },
						TransactionId: {
							location: procurementCommonModule,
							identifier: 'transaction.transactionId',
							initial: 'Transaction Id'
						},
						CompanyFk: {
							location: cloudCommonModule,
							identifier: 'entityCompany',
							initial: 'Company Code'
						},
						Isconsolidated: {
							location: procurementCommonModule,
							identifier: 'transaction.isConsolidated',
							initial: 'Consolidated'
						},
						Ischange: {
							location: procurementCommonModule,
							identifier: 'transaction.isChange',
							initial: 'Change'
						},
						Currency: {location: modName, identifier: 'transaction.currency', initial: 'Currency'},
						Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
						Description: {
							location: cloudCommonModule,
							identifier: 'entityDescription',
							initial: 'Description'
						},
						DateOrdered: {
							location: procurementCommonModule,
							identifier: 'transaction.dateOrdered',
							initial: 'Date Ordered'
						},
						DateEffective: {
							location: procurementCommonModule,
							identifier: 'transaction.dateEffective',
							initial: 'Date Effective'
						},
						BusinessPartnerFk: {
							location: cloudCommonModule,
							identifier: 'entityBusinessPartner',
							initial: 'Business Partner'
						},
						SubsidiaryFk: {
							location: cloudCommonModule,
							identifier: 'entitySubsidiary',
							initial: 'Subsidiary'
						},
						ContactFk: {
							location: modName,
							identifier: 'ConHeaderContact',
							initial: 'Contact'
						},
						BankFk: {
							location: cloudCommonModule,
							identifier: 'entityBankName',
							initial: 'Bank'
						},
						VatGroupFk: {
							location: procurementCommonModule,
							identifier: 'entityVatGroup',
							initial: 'Vat Group'
						},
						PaymentTermFiFk: {
							location: cloudCommonModule,
							identifier: 'entityPaymentTermFI',
							initial: 'Payment Term (FI)'
						},
						PaymentTermPaFk: {
							location: cloudCommonModule,
							identifier: 'entityPaymentTermPA',
							initial: 'Payment Term (PA)'
						},
						PaymentTermAdFk: {
							location: cloudCommonModule,
							identifier: 'entityPaymentTermAD',
							initial: 'Payment Term (AD)'
						},
						Incoterm: {location: cloudCommonModule, identifier: 'entityIncoterms', initial: 'Incoterm'},
						IncotermCode: {location: cloudCommonModule, identifier: 'entityIncotermCode', initial: 'Incoterm Code'},
						DateDelivery: {
							location: modName,
							identifier: 'entityDateDelivered',
							initial: 'Date Delivered'
						},
						AddressFk: {location: cloudCommonModule, identifier: 'address', initial: 'Address'},
						ItemReference: {
							location: procurementCommonModule,
							identifier: 'transaction.entityItemreference',
							initial: 'Item reference'
						},
						Amount: {location: modName, identifier: 'transaction.amount', initial: 'Amount'},
						AmountOc: {location: modName, identifier: 'transaction.amountOc', initial: 'Amount Oc'},
						VatAmount: {
							location: procurementCommonModule,
							identifier: 'transaction.vatAmount',
							initial: 'Vat Amount'
						},
						VatAmountOc: {
							location: procurementCommonModule,
							identifier: 'transaction.vatAmountOc',
							initial: 'Vat Amount Oc'
						},
						IncAmount: {
							location: procurementCommonModule,
							identifier: 'transaction.incAmount',
							initial: 'Inc Amount'
						},
						IncAmountOc: {
							location: procurementCommonModule,
							identifier: 'transaction.incAmountOc',
							initial: 'Inc Amount Oc'
						},
						IncVatAmount: {
							location: procurementCommonModule,
							identifier: 'transaction.incVatAmount',
							initial: 'Inc Vat Amount'
						},
						IncVatAmountOc: {
							location: procurementCommonModule,
							identifier: 'transaction.incVatAmountOC',
							initial: 'Inc Vat Amount Oc'
						},
						IncQuantity: {
							location: procurementCommonModule,
							identifier: 'transaction.incQuantity',
							initial: 'Inc Quantity'
						},
						Quantity: {location: modName, identifier: 'transaction.quantity', initial: 'Quantity'},
						Price: {location: cloudCommonModule, identifier: 'entityPrice', initial: 'Price'},
						VatPrice: {
							location: procurementCommonModule,
							identifier: 'transaction.vatPrice',
							initial: 'Vat Price'
						},
						PriceOc: {location: modName, identifier: 'entityPriceOc', initial: 'Price(OC)'},
						VatPriceOc: {
							location: procurementCommonModule,
							identifier: 'transaction.vatPriceOc',
							initial: 'Vat Price OC'
						},
						NominalAccount: {
							location: procurementCommonModule,
							identifier: 'transaction.nominalAccount',
							initial: 'Nominal Account'
						},
						NominalDimension1: {
							location: procurementCommonModule,
							identifier: 'transaction.nominaldimension1name',
							initial: 'Nominal Dimension 1'
						},
						NominalDimension2: {
							location: procurementCommonModule,
							identifier: 'transaction.nominaldimension2name',
							initial: 'Nominal Dimension 2'
						},
						NominalDimension3: {
							location: procurementCommonModule,
							identifier: 'transaction.nominaldimension3name',
							initial: 'Nominal Dimension 3'
						},
						TaxCodeFk: {
							location: cloudCommonModule,
							identifier: 'entityTaxCode',
							initial: 'Tax Code'
						},
						TaxCodeMatrixCode: {
							location: procurementCommonModule,
							identifier: 'transaction.taxcodematrix',
							initial: 'Tax Code Matrix'
						},
						VatCode: {
							location: procurementCommonModule,
							identifier: 'transaction.vatCode',
							initial: 'Vat Code'
						},
						VatPercent: {
							location: cloudCommonModule,
							identifier: 'entityVatPercent',
							initial: 'Vat Percent'
						},
						ControllingUnitFk: {
							location: procurementCommonModule,
							identifier: 'transaction.controllingUnitCode',
							initial: 'Controlling Unit Code'
						},
						ControllingUnitAssign01: {
							location: procurementCommonModule,
							identifier: 'transaction.controllingUnitAssign01',
							initial: 'Controlling Unit Assign01'
						},
						ControllingunitAssign01desc: {
							location: procurementCommonModule,
							identifier: 'transaction.controllingUnitAssign01Desc',
							initial: 'Controlling Unit Assign01 Description'
						},
						ControllingUnitAssign02: {
							location: procurementCommonModule,
							identifier: 'transaction.controllingUnitAssign02',
							initial: 'Controlling Unit Assign02'
						},
						ControllingunitAssign02desc: {
							location: procurementCommonModule,
							identifier: 'transaction.controllingUnitAssign02Desc',
							initial: 'Controlling Unit Assign02 Description'
						},
						ControllingUnitAssign03: {
							location: procurementCommonModule,
							identifier: 'transaction.controllingUnitAssign03',
							initial: 'Controlling Unit Assign03'
						},
						ControllingunitAssign03desc: {
							location: procurementCommonModule,
							identifier: 'transaction.controllingUnitAssign03Desc',
							initial: 'Controlling Unit Assign03 Description'
						},
						ControllingUnitAssign04: {
							location: procurementCommonModule,
							identifier: 'transaction.controllingUnitAssign04',
							initial: 'Controlling Unit Assign04'
						},
						ControllingunitAssign04desc: {
							location: procurementCommonModule,
							identifier: 'transaction.controllingUnitAssign04Desc',
							initial: 'Controlling Unit Assign04 Description'
						},
						ControllingUnitAssign05: {
							location: procurementCommonModule,
							identifier: 'transaction.controllingUnitAssign05',
							initial: 'Controlling Unit Assign05'
						},
						ControllingunitAssign05desc: {
							location: procurementCommonModule,
							identifier: 'transaction.controllingUnitAssign05Desc',
							initial: 'Controlling Unit Assign05 Description'
						},
						ControllingUnitAssign06: {
							location: procurementCommonModule,
							identifier: 'transaction.controllingUnitAssign06',
							initial: 'Controlling Unit Assign06'
						},
						ControllingunitAssign06desc: {
							location: procurementCommonModule,
							identifier: 'transaction.controllingUnitAssign06Desc',
							initial: 'Controlling Unit Assign06 Description'
						},
						ControllingUnitAssign07: {
							location: procurementCommonModule,
							identifier: 'transaction.controllingUnitAssign07',
							initial: 'Controlling Unit Assign07'
						},
						ControllingunitAssign07desc: {
							location: procurementCommonModule,
							identifier: 'transaction.controllingUnitAssign07Desc',
							initial: 'Controlling Unit Assign07 Description'
						},
						ControllingUnitAssign08: {
							location: procurementCommonModule,
							identifier: 'transaction.controllingUnitAssign08',
							initial: 'Controlling Unit Assign08'
						},
						ControllingunitAssign08desc: {
							location: procurementCommonModule,
							identifier: 'transaction.controllingUnitAssign08Desc',
							initial: 'Controlling Unit Assign08 Description'
						},
						ControllingUnitAssign09: {
							location: procurementCommonModule,
							identifier: 'transaction.controllingUnitAssign09',
							initial: 'Controlling Unit Assign09'
						},
						ControllingunitAssign09desc: {
							location: procurementCommonModule,
							identifier: 'transaction.controllingUnitAssign09Desc',
							initial: 'Controlling Unit Assign09 Description'
						},
						ControllingUnitAssign10: {
							location: procurementCommonModule,
							identifier: 'transaction.controllingUnitAssign10',
							initial: 'Controlling Unit Assign10'
						},
						ControllingunitAssign10desc: {
							location: procurementCommonModule,
							identifier: 'transaction.controllingUnitAssign10Desc',
							initial: 'Controlling Unit Assign10 Description'
						},
						ItemDescription1: {
							location: procurementCommonModule,
							identifier: 'prcItemDescription1',
							initial: 'Description 1'
						},
						ItemDescription2: {
							location: procurementCommonModule,
							identifier: 'prcItemDescription2',
							initial: 'Description 2'
						},
						ItemSpecification: {
							location: procurementCommonModule,
							identifier: 'itemSpecification',
							initial: 'Specification'
						},
						ItemUomQuantity: {
							location: procurementCommonModule,
							identifier: 'transaction.itemUomQuantity',
							initial: 'Item Uom Quantity'
						},
						IsSuccess: {
							location: procurementCommonModule,
							identifier: 'transaction.issuccess',
							initial: 'Is Success'
						},
						HandoverId: {
							location: procurementCommonModule,
							identifier: 'transaction.handoverId',
							initial: 'Handover Id'
						},
						Orderno: {
							location: procurementCommonModule,
							identifier: 'transaction.orderNo',
							initial: 'Order No'
						},
						Userdefined1: {
							location: procurementCommonModule,
							identifier: 'userDefined1',
							initial: 'User Defined 1'
						},
						Userdefined2: {
							location: procurementCommonModule,
							identifier: 'userDefined2',
							initial: 'User Defined 2'
						},
						Userdefined3: {
							location: procurementCommonModule,
							identifier: 'userDefined3',
							initial: 'User Defined 3'
						},
						ReturnValue: {
							location: procurementCommonModule,
							identifier: 'transaction.returnValue',
							initial: 'Return Value'
						}
					}
				},
				'overloads': {
					'transactionid': {readonly: true},
					'companyfk': {
						grid: {
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
					'isconsolidated': {readonly: true},
					'ischange': {readonly: true},
					'currency': {readonly: true},
					'code': {readonly: true},
					'description': {readonly: true},
					'dateordered': {readonly: true},
					'dateeffective': {readonly: true},
					'businesspartnerfk': {
						readonly: true,
						navigator: {
							moduleName: 'businesspartner.main'
						},
						grid: {
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'BusinessPartner',
								'displayMember': 'BusinessPartnerName1'
							},
							'width': 150
						},
						detail: {
							'type': 'directive',
							'directive': 'filter-business-partner-dialog-lookup'
						}
					},
					'subsidiaryfk': {
						readonly: true,
						grid: {
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'subsidiary', 'displayMember': 'AddressLine'},
							'width': 180
						},
						detail: {
							'type': 'directive',
							'directive': 'business-partner-main-subsidiary-lookup'
						}
					},
					'contactfk': {
						readonly: true,
						grid: {
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'Contact', 'displayMember': 'FullName'},
							'width': 100
						},
						detail: {
							'type': 'directive',
							'directive': 'business-partner-main-contact-dialog'
						}
					},
					'bankfk': {
						readonly: true,
						detail: {
							'type': 'directive',
							'directive': 'business-partner-main-bank-lookup'
						},
						grid: {
							width: 200,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'businesspartner.main.bank',
								displayMember: 'IbanNameOrBicAccountName'
							}
						}
					},
					'vatgroupfk': {
						grid: {
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
					'paymenttermfifk': {
						readonly: true,
						grid: {
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'PaymentTerm', 'displayMember': 'Code'},
							'width': 80
						},
						detail: {
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
						readonly: true,
						grid: {
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'PaymentTerm', 'displayMember': 'Code'},
							'width': 80
						},
						detail: {
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
						readonly: true,
						grid: {
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'PaymentTerm', 'displayMember': 'Code'},
							'width': 80
						},
						detail: {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'basics-lookupdata-payment-term-lookup',
								'descriptionMember': 'Description',
								'lookupOptions': {'showClearButton': true}
							}
						}
					},
					'incoterm': {readonly: true},
					'incotermcode': {readonly: true},
					'datedelivery': {readonly: true},
					'addressfk': {
						grid: {
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
					'itemreference': {readonly: true},
					'amount': {readonly: true},
					'vatamount': {readonly: true},
					'amountoc': {readonly: true},
					'vatamountoc': {readonly: true},
					'incamount': {readonly: true},
					'incvatamount': {readonly: true},
					'incamountoc': {readonly: true},
					'incvatamountoc': {readonly: true},
					'incquantity': {readonly: true},
					'quantity': {readonly: true},
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
					'controllingunitfk': {
						readonly: true,
						'navigator':{
							moduleName: 'controlling.structure'
						},
						grid: {
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'ControllingUnit', 'displayMember': 'Code'},
							'width': 80
						},
						detail: {
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
										return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, null);
									}
								}
							}
						}
					},
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
					'itemdescription1': {readonly: true},
					'itemdescription2': {readonly: true},
					'itemspecification': {readonly: true},
					'itemuomquantity': {readonly: true},
					'issuccess': {readonly: true},
					'handoverid': {readonly: true},
					'orderno': {readonly: true},
					'returnvalue': {readonly: true},
					'userdefined1': {readonly: true},
					'userdefined2': {readonly: true},
					'userdefined3': {readonly: true}
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

	angular.module(modName).factory('prcOnlyContractTransactionLayout', [
		function () {
			var config;
			config = {
				'groups': [
					{
						'gid': 'conTransaction',
						'attributes': ['conheaderfk', 'prcconfigurationfk', 'supplierfk', 'constatusfk', 'datereported', 'prcitemfk', 'materialfk']
					}
				],
				'translationInfos': {
					'extraWords': {
						ConHeaderFk: {
							location: modName,
							identifier: 'entityConHeaderFk',
							initial: 'Contract'
						},
						PrcConfigurationFk: {
							location: modName,
							identifier: 'entityPrcConfigurationFk',
							initial: 'Configuration'
						},
						SupplierFk: {
							location: cloudCommonModule,
							identifier: 'entitySupplierCode',
							initial: 'Supplier Code'
						},
						ConStatusFk: {
							location: procurementCommonModule,
							identifier: 'transaction.conStatus',
							initial: 'Contract Status'
						},
						DateReported: {
							location: procurementCommonModule,
							identifier: 'transaction.dateReported',
							initial: 'Date Reported'
						},
						CompanyInvoiceFk: {
							location: procurementCommonModule,
							identifier: 'transaction.conHeaderCompanyInvoicedCode',
							initial: 'Invoiced Company Code'
						},
						PrcItemFk: {location: modName, identifier: 'entityPrcItemFk', initial: 'Contract Item'},
						MaterialFk: {location: modName, identifier: 'entityMaterialFk', initial: 'Material No.'}
					}
				},
				'overloads': {
					'conheaderfk': {
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ConHeaderView',
								displayMember: 'Code'
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
					},
					'prcconfigurationfk': {
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'prcconfiguration',
								displayMember: 'DescriptionInfo.Translated'
							},
							width: 150
						},
						detail: {
							type: 'directive',
							directive: 'basics-configuration-configuration-combobox'
						},
						readonly: true
					},
					'supplierfk': {
						readonly: true,
						grid: {
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'Supplier', 'displayMember': 'Code'},
							'width': 100
						},
						detail: {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'business-partner-main-supplier-lookup',
								'descriptionMember': 'Description',
								'lookupOptions': {'filterKey': 'prc-con-supplier-filter', 'showClearButton': true}
							}
						}
					},
					'constatusfk': {
						readonly: true,
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ConStatus',
								displayMember: 'DescriptionInfo.Translated',
								imageSelector: 'platformStatusIconService'
							}
						},
						detail: {
							type: 'directive',
							directive: 'procurement-contract-header-status-combobox',
							options: {
								readOnly: true
							}
						}
					},
					'datereported': {readonly: true},
					'prcitemfk': {
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PrcItemMergedLookup',
								displayMember: 'Itemno',
								version: 3
							},
							width: 100
						},
						detail: {
							type: 'directive',
							directive: 'procurement-common-item-merged-lookup'
						},
						readonly: true
					},
					'materialfk': {
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'MaterialCommodity',
								displayMember: 'Code'
							},
							width: 100
						},
						detail: {
							type: 'directive',
							directive: 'basics-material-material-lookup'
						},
						readonly: true
					}
				},
				'addition': {
					grid: [
						{
							'lookupDisplayColumn': true,
							'afterId': 'conheaderFk',
							'field': 'ConHeaderFk',
							'displayMember': 'Description',
							'name$tr$': 'procurement.invoice.header.conHeaderDes',
							'width': 100
						},
						{
							'lookupDisplayColumn': true,
							'afterId': 'companyinvoicefk',
							'field': 'CompanyInvoiceFk',
							'displayMember': 'CompanyName',
							'name$tr$': 'procurement.common.transaction.conHeaderCompanyInvoicedCodeDescription',
							'width': 100
						},
						{
							'lookupDisplayColumn': true,
							'afterId': 'materialfk',
							'field': 'MaterialFk',
							'displayMember': 'DescriptionInfo.Translated',
							'name$tr$': 'procurement.common.prcItemMaterialExternalCode',
							'width': 150
						}
					]
				}
			};
			return config;
		}]);

	angular.module(modName).factory('salesOnlyContractTransactionLayout', [
		'basicsLookupdataConfigGenerator',
		function (
			basicsLookupdataConfigGenerator
		) {
			var config;
			config = {
				'groups': [{
					'gid': 'conTransaction',
					'attributes': ['ordheaderfk', 'ordstatusfk', 'datedeliveryfrom', 'boqheaderfk', 'boqitemfk', 'customerfk', 'controllingunitassign01comment', 'controllingunitassign02comment', 'controllingunitassign03comment', 'controllingunitassign04comment', 'controllingunitassign05comment', 'controllingunitassign06comment', 'controllingunitassign07comment', 'controllingunitassign08comment', 'controllingunitassign09comment', 'controllingunitassign10comment', 'iscanceled']
				}],
				'translationInfos': {
					'extraModules': [salesCommonModName, salesContractModName],
					'extraWords': {
						OrdHeaderFk: { location: salesCommonModName, identifier: 'entityOrdHeaderFk', initial: 'Contract' },
						OrdStatusFk: { location: salesContractModName, identifier: 'entityOrdStatusFk', initial: 'OrdStatusFk' },
						DateDeliveryFrom: { location: salesContractModName, identifier: 'entityDateDeliveryFrom', initial: 'Date Delivery From' },
						CustomerFk: { location: salesCommonModName, identifier: 'entityCustomerFk', initial: 'Customer' },
						BoqHeaderFk: { location: salesContractModName, identifier: 'entityBoqHeader', initial: 'BoQ Header' },
						BoqItemFk: { location: salesContractModName, identifier: 'entityBoqItem', initial: 'BoQ Item' },
						CompanyInvoiceFk: {
							location: salesCommonModName,
							identifier: 'transaction.conHeaderCompanyInvoicedCode',
							initial: 'Company Responsible Code'
						},
						ControllingunitAssign01Comment: {
							location: salesCommonModName,
							identifier: 'transaction.controllingUnitAssign01Comment',
							initial: 'Controlling Unit Assign01 Comment'
						},
						ControllingunitAssign02Comment: {
							location: salesCommonModName,
							identifier: 'transaction.controllingUnitAssign02Comment',
							initial: 'Controlling Unit Assign02 Comment'
						},
						ControllingunitAssign03Comment: {
							location: salesCommonModName,
							identifier: 'transaction.controllingUnitAssign03Comment',
							initial: 'Controlling Unit Assign03 Comment'
						},
						ControllingunitAssign04Comment: {
							location: salesCommonModName,
							identifier: 'transaction.controllingUnitAssign04Comment',
							initial: 'Controlling Unit Assign04 Comment'
						},
						ControllingunitAssign05Comment: {
							location: salesCommonModName,
							identifier: 'transaction.controllingUnitAssign05Comment',
							initial: 'Controlling Unit Assign05 Comment'
						},
						ControllingunitAssign06Comment: {
							location: salesCommonModName,
							identifier: 'transaction.controllingUnitAssign06Comment',
							initial: 'Controlling Unit Assign06 Comment'
						},
						ControllingunitAssign07Comment: {
							location: salesCommonModName,
							identifier: 'transaction.controllingUnitAssign07Comment',
							initial: 'Controlling Unit Assign07 Comment'
						},
						ControllingunitAssign08Comment: {
							location: salesCommonModName,
							identifier: 'transaction.controllingUnitAssign08Comment',
							initial: 'Controlling Unit Assign08 Comment'
						},
						ControllingunitAssign09Comment: {
							location: salesCommonModName,
							identifier: 'transaction.controllingUnitAssign09Comment',
							initial: 'Controlling Unit Assign09 Comment'
						},
						ControllingunitAssign10Comment: {
							location: salesCommonModName,
							identifier: 'transaction.controllingUnitAssign10Comment',
							initial: 'Controlling Unit Assign10 Comment'
						}
					}
				},
				'overloads': {
					'ordheaderfk': {
						readonly: true,
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'sales-common-contract-dialog',
								descriptionMember: 'DescriptionInfo.Translated'
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'sales-common-contract-dialog',
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
								lookupType: 'SalesContract',
								displayMember: 'Code'
							}
						}
					},
					'ordstatusfk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.orderstatus', null, {
						showIcon: true
					}),
					'customerfk': {
						readonly: true,
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'business-partner-main-customer-lookup',
								lookupOptions: {
									addGridColumns: [{
										id: 'Description',
										field: 'Description',
										name: 'Description',
										name$tr$: 'cloud.common.entityDescription'
									}],
									additionalColumns: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'customer',
								displayMember: 'Code'
							},
							width: 125
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'business-partner-main-customer-lookup',
								descriptionMember: 'Description'
							}
						}
					},
					'datedeliveryfrom': {readonly: true},
					'boqheaderfk': {readonly: true},
					'boqitemfk': {readonly: true},
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
							'afterId': 'companyinvoicefk',
							'field': 'CompanyInvoiceFk',
							'displayMember': 'CompanyName',
							'name$tr$': 'sales.common.transaction.conHeaderCompanyInvoicedCodeDescription',
							'width': 100
						}
					]
				}
			};
			return config;
		}]);
})();
