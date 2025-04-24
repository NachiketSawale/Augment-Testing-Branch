/**
 * Created by lcn on 06.22.2020.
 */

// eslint-disable-next-line func-names
(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var modName = 'procurement.pes';
	var cloudCommonModule = 'cloud.common';
	var procurementCommonModule = 'procurement.common';

	angular.module(modName).factory('procurementPesTransactionLayout',['basicsLookupdataConfigGenerator','basicsCommonComplexFormatter', 'platformLayoutHelperService',
		function (basicsLookupdataConfigGenerator,basicsCommonComplexFormatter, platformLayoutHelperService) {
			var config;
			config =
				{
					'fid': 'procurement.pes.detail',
					'version': '1.0.0',
					'addValidationAutomatically': true,
					'showGrouping': true,
					'change': 'change',
					'groups': [
						{
							'gid': 'pesTransaction',
							'attributes': ['transactionid','companyfk','companyinvoicefk','pesheaderfk','conheaderfk','prcconfigurationfk','isconsolidated','ischange','currency','pesstatusfk','code','description','vatgroupfk','incoterm', 'incotermcode', 'datedocument','datedelivered','datedeliveredfrom','addressfk','itemreference','amount','vatamount','amountoc','vatamountoc','quantity','incamount','incvatamount','incamountoc','incvatamountoc','incquantity','price','vatprice','priceoc','vatpriceoc','prjstockfk','prjstocklocationfk','nominalaccount','nominaldimension1','nominaldimension2','nominaldimension3','taxcodefk','taxcodematrixcode','vatcode','vatpercent','controllingunitcode','controllingunitassign01','controllingunitassign01desc','controllingunitassign02','controllingunitassign02desc','controllingunitassign03','controllingunitassign03desc','controllingunitassign04','controllingunitassign04desc','controllingunitassign05','controllingunitassign05desc','controllingunitassign06','controllingunitassign06desc','controllingunitassign07','controllingunitassign07desc','controllingunitassign08','controllingunitassign08desc','controllingunitassign09','controllingunitassign09desc','controllingunitassign10','controllingunitassign10desc','prcitemfk','materialfk','itemdescription1','itemdescription2','itemspecification','itemuomquantity','issuccess','handoverid','returnvalue','pesno','userdefined1','userdefined2','userdefined3','controllingunitassign01comment','controllingunitassign02comment','controllingunitassign03comment','controllingunitassign04comment','controllingunitassign05comment','controllingunitassign06comment','controllingunitassign07comment','controllingunitassign08comment','controllingunitassign09comment','controllingunitassign10comment', 'pesitemdesc']
						},
						{'gid': 'entityHistory','isHistory': true}
					],
					'translationInfos': {
						'extraModules': [modName,procurementCommonModule,cloudCommonModule],
						'extraWords': {
							pesTransaction: {location: modName,identifier: 'transaction.group',initial: 'Transaction'},
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
							CompanyInvoiceFk: {
								location: procurementCommonModule,
								identifier: 'transaction.conHeaderCompanyInvoicedCode',
								initial: 'Invoiced Company Code'
							},
							PesHeaderFk: {
								location: procurementCommonModule,
								identifier: 'transaction.pesHeader',
								initial: 'Pes'
							},
							ConHeaderFk: {location: modName,identifier: 'entityConHeaderFk',initial: 'Contract'},
							PrcConfigurationFk: {
								location: modName,
								identifier: 'entityPrcConfigurationFk',
								initial: 'Configuration'
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
							Currency: {location: modName,identifier: 'transaction.currency',initial: 'Currency'},
							PesStatusFk: {
								location: procurementCommonModule,
								identifier: 'transaction.pesStatus',
								initial: 'Pes Status'
							},
							Code: {location: cloudCommonModule,identifier: 'entityCode',initial: 'Code'},
							Description: {
								location: cloudCommonModule,
								identifier: 'entityDescription',
								initial: '*Description'
							},
							VatGroupFk: {
								location: procurementCommonModule,
								identifier: 'entityVatGroup',
								initial: 'Vat Group'
							},
							Incoterm: {location: cloudCommonModule,identifier: 'entityIncoterms',initial: 'Incoterm'},
							IncotermCode: {location: cloudCommonModule,identifier: 'entityIncotermCode',initial: 'Incoterm Code'},
							DateDocument: {
								location: modName,
								identifier: 'entityDocumentDate',
								initial: 'Document Date'
							},
							DateDelivered: {
								location: modName,
								identifier: 'entityDateDelivered',
								initial: 'Date Delivered'
							},
							DateDeliveredfrom: {
								location: modName,
								identifier: 'entityDateDeliveredFrom',
								initial: 'Date Delivered From'
							},
							AddressFk: {location: cloudCommonModule,identifier: 'address',initial: 'Address'},
							ItemReference: {
								location: procurementCommonModule,
								identifier: 'transaction.entityItemreference',
								initial: 'Item reference'
							},
							Amount: {location: modName,identifier: 'transaction.amount',initial: 'Amount'},
							AmountOc: {location: modName,identifier: 'transaction.amountOc',initial: 'Amount Oc'},
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
							Quantity: {location: modName,identifier: 'transaction.quantity',initial: 'Quantity'},
							IncQuantity: {
								location: procurementCommonModule,
								identifier: 'transaction.incQuantity',
								initial: 'Inc Quantity'
							},
							Price: {location: cloudCommonModule,identifier: 'entityPrice',initial: 'Price'},
							VatPrice: {
								location: procurementCommonModule,
								identifier: 'transaction.vatPrice',
								initial: 'Vat Price'
							},
							PriceOc: {location: modName,identifier: 'entityPriceOc',initial: 'Price OC'},
							VatPriceOc: {
								location: procurementCommonModule,
								identifier: 'transaction.vatPriceOc',
								initial: 'Vat Price OC'
							},
							PrjStockFk: {
								location: procurementCommonModule,
								identifier: 'transaction.prjStockFk',
								initial: 'Stock Code'
							},
							PrjStockLocationFk: {
								location: procurementCommonModule,
								identifier: 'transaction.prjStocklocationFk',
								initial: 'Stock Location'
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
							ControllingUnitCode: {
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
							PrcItemFk: {location: modName,identifier: 'entityPrcItemFk',initial: 'Contract Item'},
							MaterialFk: {location: modName,identifier: 'entityMaterialFk',initial: 'Material No.'},
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
								identifier: 'transaction.isSuccess',
								initial: 'Is Success'
							},
							HandoverId: {
								location: procurementCommonModule,
								identifier: 'transaction.handoverId',
								initial: 'Handover Id'
							},
							ReturnValue: {
								location: procurementCommonModule,
								identifier: 'transaction.returnValue',
								initial: 'Return Value'
							},
							PesNo: {
								location: procurementCommonModule,
								identifier: 'transaction.pesNo',
								initial: 'Pes No'
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
							ControllingunitAssign01Comment: {
								location: procurementCommonModule,
								identifier: 'transaction.controllingUnitAssign01Comment',
								initial: 'Controlling Unit Assign01 Comment'
							},
							ControllingunitAssign02Comment: {
								location: procurementCommonModule,
								identifier: 'transaction.controllingUnitAssign02Comment',
								initial: 'Controlling Unit Assign02 Comment'
							},
							ControllingunitAssign03Comment: {
								location: procurementCommonModule,
								identifier: 'transaction.controllingUnitAssign03Comment',
								initial: 'Controlling Unit Assign03 Comment'
							},
							ControllingunitAssign04Comment: {
								location: procurementCommonModule,
								identifier: 'transaction.controllingUnitAssign04Comment',
								initial: 'Controlling Unit Assign04 Comment'
							},
							ControllingunitAssign05Comment: {
								location: procurementCommonModule,
								identifier: 'transaction.controllingUnitAssign05Comment',
								initial: 'Controlling Unit Assign05 Comment'
							},
							ControllingunitAssign06Comment: {
								location: procurementCommonModule,
								identifier: 'transaction.controllingUnitAssign06Comment',
								initial: 'Controlling Unit Assign06 Comment'
							},
							ControllingunitAssign07Comment: {
								location: procurementCommonModule,
								identifier: 'transaction.controllingUnitAssign07Comment',
								initial: 'Controlling Unit Assign07 Comment'
							},
							ControllingunitAssign08Comment: {
								location: procurementCommonModule,
								identifier: 'transaction.controllingUnitAssign08Comment',
								initial: 'Controlling Unit Assign08 Comment'
							},
							ControllingunitAssign09Comment: {
								location: procurementCommonModule,
								identifier: 'transaction.controllingUnitAssign09Comment',
								initial: 'Controlling Unit Assign09 Comment'
							},
							ControllingunitAssign10Comment: {
								location: procurementCommonModule,
								identifier: 'transaction.controllingUnitAssign10Comment',
								initial: 'Controlling Unit Assign10 Comment'
							},
							PesItemDesc: {
								location: modName,
								identifier: 'entityPesItemFk',
								initial: 'Pes Item'
							}
						}
					},
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
								formatterOptions: {'lookupType': 'Company','displayMember': 'Code'},
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
						'pesheaderfk': {
							grid: {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PesHeader',
									displayMember: 'Code',
									version : 3
								},
								width: 100
							},
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'procurement-invoice-pes-lookup',
									descriptionMember: 'Description',
									version : 3
								}
							},
							readonly: true
						},
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
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-configuration-configuration-combobox'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'prcConfiguration',
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
						'isconsolidated': {readonly: true},
						'ischange': {readonly: true},
						'currency': {readonly: true},
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
							detail: basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('businesspartner.vatgroup',null,null,false,{}),
							readonly: true
						},
						'incoterm': {readonly: true},
						'incotermcode': {readonly: true},
						'datedocument': {readonly: true},
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
						'prjstockfk': {
							grid: {
								editor: 'lookup',
								editorOptions: {
									directive: 'procurement-stock-lookup-dialog'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'ProjectStock',
									displayMember: 'Code'
								},
								width: 100
							},
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'procurement-stock-lookup-dialog',
									descriptionMember: 'Description'
								}
							},
							readonly: true
						},
						'prjstocklocationfk': platformLayoutHelperService.provideProjectStockLocationLookupReadOnlyOverload(),
						/* { grid: {
								editor: 'lookup',
								editorOptions: {
									directive: 'procurement-stock-location-dialog'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'ProjectStock2ProjectStockLocation',
									displayMember: 'Code'
								},
								width: 100
							},
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'procurement-stock-location-dialog',
									descriptionMember: 'DescriptionInfo.Description'
								}
							}} */

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
						'prcitemfk': {
							grid: {
								editor: 'lookup',
								editorOptions: {
									directive: 'procurement-common-item-merged-lookup'
								},
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
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-material-material-lookup'
								},
								width: 100
							},
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'basics-material-material-lookup',
									descriptionMember: 'DescriptionInfo.Translated'
								}
							},
							readonly: true
						},
						'itemdescription1': {readonly: true},
						'itemdescription2': {readonly: true},
						'itemspecification': {readonly: true},
						'itemuomquantity': {readonly: true},
						'issuccess': {readonly: true},
						'handoverid': {readonly: true},
						'returnvalue': {readonly: true},
						'pesno': {readonly: true},
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
						'pesitemdesc': {readonly: true}
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
								'name$tr$': 'procurement.common.transaction.conHeaderCompanyInvoicedCodeDescription',
								'width': 100
							},
							{
								'formatter': 'description',
								'field': 'PesHeaderDesc',
								'name': 'PES Description',
								'name$tr$': 'procurement.invoice.header.pesHeaderDes',
								'width': 100,
								readonly: true
							},
							{
								'lookupDisplayColumn': true,
								'afterId': 'conheaderfk',
								'field': 'ConHeaderFk',
								'displayMember': 'Description',
								'name$tr$': 'procurement.invoice.header.conHeaderDes',
								'width': 100
							},
							{
								'lookupDisplayColumn': true,
								'afterId': 'prjstockfk',
								'field': 'PrjStockFk',
								'displayMember': 'Description',
								'name$tr$': 'procurement.stock.header.PrjStockDescription',
								'width': 100
							},
							{
								'lookupDisplayColumn': true,
								'afterId': 'taxCodefk',
								'field': 'TaxCodeFk',
								'displayMember': 'DescriptionInfo.Translated',
								'name$tr$': 'cloud.common.entityTaxCodeDescription',
								'width': 150
							},
							{
								'lookupDisplayColumn': true,
								'afterId': 'materialfk',
								'field': 'MaterialFk',
								'displayMember': 'DescriptionInfo.Translated',
								'name$tr$': 'procurement.common.prcItemMaterialExternalCode',
								'width': 150
							}
						],
						detail: []
					}
				};
			return config;
		}]);

	angular.module(modName).factory('procurementPesTransactionUIStandardService',
		['platformUIStandardConfigService','procurementPesTranslationService',
			'procurementPesTransactionLayout','platformSchemaService','platformUIStandardExtentService',

			function (platformUIStandardConfigService,translationService,layout,platformSchemaService,platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PesTransactionDto',
					moduleSubModule: 'Procurement.Pes'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				function UIStandardService(layout,scheme,translateService) {
					BaseService.call(this,layout,scheme,translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new BaseService(layout,domainSchema,translationService);

				platformUIStandardExtentService.extend(service,layout.addition,domainSchema);

				return service;
			}
		]);
})();
