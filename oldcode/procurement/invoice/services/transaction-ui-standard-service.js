(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	var modName = 'procurement.invoice';
	var cloudCommonModule = 'cloud.common';
	var procurementCommonModule = 'procurement.common';

	angular.module(modName).factory('procurementInvoiceTransactionLayout', ['$injector', function ($injector) {
		return {
			'fid': 'procurement.invoice.detail',
			'version': '1.0.0',
			'addValidationAutomatically': true,
			'showGrouping': true,
			readonly: true,
			'groups': [
				{
					'gid': 'invoiceTransaction',
					'attributes': ['documenttype', 'linetype', 'currency', 'vouchernumber', 'voucherdate', 'postingnarritive', 'postingdate', 'externalnumber', 'externaldate',
						'netduedate', 'discountduedate', 'discountamount', 'creditor', 'creditorgroup', 'businesspostinggroup', 'accountpayable', 'nominalaccount', 'nominalaccountfi', 'amount',
						'quantity', 'isdebit', 'vatamount', 'vatcode', 'isprogress', 'ordernumber', 'amountauthorized', 'controllingunitcode', 'controllingunitassign01', 'controllingunitassign01desc', 'controllingunitassign02', 'controllingunitassign02desc',
						'controllingunitassign03', 'controllingunitassign03desc', 'controllingunitassign04', 'controllingunitassign04desc', 'controllingunitassign05', 'controllingunitassign05desc', 'controllingunitassign06', 'controllingunitassign06desc', 'controllingunitassign07', 'controllingunitassign07desc', 'controllingunitassign08', 'controllingunitassign08desc', 'controllingunitassign09',
						'controllingunitassign09desc', 'controllingunitassign10', 'controllingunitassign10desc', 'issuccess', 'transactionid', 'handoverid', 'returnvalue', 'postingtype', 'coderetention', 'paymenttermfk', 'nominaldimension', 'nominaldimension2', 'nominaldimension3',
						'controllingunitassign01comment', 'controllingunitassign02comment', 'controllingunitassign03comment', 'controllingunitassign04comment', 'controllingunitassign05comment',
						'controllingunitassign06comment', 'controllingunitassign07comment', 'controllingunitassign08comment', 'controllingunitassign09comment', 'controllingunitassign10comment', 'companydeferaltypefk', 'datedeferalstart', 'controllinggrpsetfk', 'assetno', 'documentno', 'pesheaderfk', 'pesitemfk', 'invotherfk', 'contractitemdesc',
						'itemreference', 'extorderno', 'extpesno', 'prcitemfk', 'userdefined1', 'userdefined2', 'userdefined3', 'conheaderfk', 'controllingunitfk', 'controllinguniticfk', 'taxcodefk', 'taxcodematrixcode', 'iscanceled', 'vatgroup', 'linereference', 'nominalaccountdesc', 'nominalaccountfidesc']
				},
				{'gid': 'entityHistory', 'isHistory': true}
			],
			'translationInfos': {
				'extraModules': [modName, cloudCommonModule, procurementCommonModule],
				'extraWords': {
					DocumentType: {location: modName, identifier: 'transaction.documentType', initial: 'Document Type'},
					LineType: {location: modName, identifier: 'transaction.lineType', initial: 'Line Type'},
					Currency: {location: modName, identifier: 'transaction.currency', initial: 'Currency'},
					VoucherNumber: {location: modName, identifier: 'transaction.voucherNumber', initial: 'Voucher Number'},
					VoucherDate: {location: modName, identifier: 'transaction.voucherDate', initial: 'Voucher Date'},
					PostingNarritive: {location: modName, identifier: 'transaction.postingNarritive', initial: 'Posting Narritive'},
					PostingDate: {location: modName, identifier: 'transaction.postingDate', initial: 'Posting Date'},
					ExternalNumber: {location: modName, identifier: 'transaction.externalNumber', initial: 'External Number'},
					ExternalDate: {location: modName, identifier: 'transaction.externalDate', initial: 'External Date'},
					NetDuedate: {location: modName, identifier: 'transaction.netDuedate', initial: 'Net Due Date'},
					DiscountDuedate: {location: modName, identifier: 'transaction.discountDueDate', initial: 'Discount Due Date'},
					DiscountAmount: {location: modName, identifier: 'header.discountAmount', initial: 'Discount Amount'},
					Creditor: {location: modName, identifier: 'transaction.creditor', initial: 'Creditor'},
					CreditorGroup: {location: modName, identifier: 'transaction.creditorGroup', initial: 'Creditor Group'},
					BusinessPostingGroup: {location: modName, identifier: 'transaction.businessPostingGroup', initial: 'Business Posting Group'},
					AccountPayable: {location: modName, identifier: 'transaction.accountPayable', initial: 'Account Payable'},
					NominalAccount: {location: modName, identifier: 'transaction.nominalAccount', initial: 'Nominal Account'},
					NominalAccountFi: {location: modName, identifier: 'transaction.nominalAccountFi', initial: 'Nominal Account Fi'},
					Amount: {location: modName, identifier: 'transaction.amount', initial: 'Amount'},
					Quantity: {location: modName, identifier: 'transaction.quantity', initial: 'Quantity'},
					IsDebit: {location: modName, identifier: 'transaction.isdebit', initial: 'Is Debit'},
					VatAmount: {location: modName, identifier: 'transaction.vatAmount', initial: 'Vat Amount'},
					VatCode: {location: modName, identifier: 'transaction.vatCode', initial: 'Vat Code'},
					IsProgress: {location: modName, identifier: 'transaction.isprogress', initial: 'Is Progress'},
					OrderNumber: {location: modName, identifier: 'transaction.orderNumber', initial: 'Order Number'},
					AmountAuthorized: {location: modName, identifier: 'transaction.amountAuthorized', initial: 'Amount Authorized'},
					ControllingUnitCode: {location: modName, identifier: 'transaction.controllingUnitCode', initial: 'Controlling Unit Code'},
					ControllingUnitAssign01: {location: modName, identifier: 'transaction.controllingUnitAssign01', initial: 'Controlling Unit Assign01'},
					ControllingunitAssign01desc: {location: modName, identifier: 'transaction.controllingUnitAssign01Desc', initial: 'Controlling Unit Assign01 Description'},
					ControllingUnitAssign02: {location: modName, identifier: 'transaction.controllingUnitAssign02', initial: 'Controlling Unit Assign02'},
					ControllingunitAssign02desc: {location: modName, identifier: 'transaction.controllingUnitAssign02Desc', initial: 'Controlling Unit Assign02 Description'},
					ControllingUnitAssign03: {location: modName, identifier: 'transaction.controllingUnitAssign03', initial: 'Controlling Unit Assign03'},
					ControllingunitAssign03desc: {location: modName, identifier: 'transaction.controllingUnitAssign03Desc', initial: 'Controlling Unit Assign03 Description'},
					ControllingUnitAssign04: {location: modName, identifier: 'transaction.controllingUnitAssign04', initial: 'Controlling Unit Assign04'},
					ControllingunitAssign04desc: {location: modName, identifier: 'transaction.controllingUnitAssign04Desc', initial: 'Controlling Unit Assign04 Description'},
					ControllingUnitAssign05: {location: modName, identifier: 'transaction.controllingUnitAssign05', initial: 'Controlling Unit Assign05'},
					ControllingunitAssign05desc: {location: modName, identifier: 'transaction.controllingUnitAssign05Desc', initial: 'Controlling Unit Assign05 Description'},
					ControllingUnitAssign06: {location: modName, identifier: 'transaction.controllingUnitAssign06', initial: 'Controlling Unit Assign06'},
					ControllingunitAssign06desc: {location: modName, identifier: 'transaction.controllingUnitAssign06Desc', initial: 'Controlling Unit Assign06 Description'},
					ControllingUnitAssign07: {location: modName, identifier: 'transaction.controllingUnitAssign07', initial: 'Controlling Unit Assign07'},
					ControllingunitAssign07desc: {location: modName, identifier: 'transaction.controllingUnitAssign07Desc', initial: 'Controlling Unit Assign07 Description'},
					ControllingUnitAssign08: {location: modName, identifier: 'transaction.controllingUnitAssign08', initial: 'Controlling Unit Assign08'},
					ControllingunitAssign08desc: {location: modName, identifier: 'transaction.controllingUnitAssign08Desc', initial: 'Controlling Unit Assign08 Description'},
					ControllingUnitAssign09: {location: modName, identifier: 'transaction.controllingUnitAssign09', initial: 'Controlling Unit Assign09'},
					ControllingunitAssign09desc: {location: modName, identifier: 'transaction.controllingUnitAssign09Desc', initial: 'Controlling Unit Assign09 Description'},
					ControllingUnitAssign10: {location: modName, identifier: 'transaction.controllingUnitAssign10', initial: 'Controlling Unit Assign10'},
					ControllingunitAssign10desc: {location: modName, identifier: 'transaction.controllingUnitAssign10Desc', initial: 'Controlling Unit Assign10 Description'},
					IsSuccess: {location: modName, identifier: 'transaction.issuccess', initial: 'Is Success'},
					TransactionId: {location: modName, identifier: 'transaction.transactionId', initial: 'transactionId'},
					HandoverId: {location: modName, identifier: 'transaction.handoverId', initial: 'HandoverId'},
					ReturnValue: {location: modName, identifier: 'transaction.returnValue', initial: 'Return Value'},
					invoiceTransaction: {location: modName, identifier: 'group.transaction', initial: 'Transaction'},
					PostingType: {location: modName, identifier: 'group.postingtype', initial: 'Posting Type'},
					CodeRetention: {location: modName, identifier: 'header.codeRetention', initial: 'Code Retention'},
					PaymentTermfk: {location: modName, identifier: 'header.paymentTerm', initial: 'Payment Term'},
					NominalDimension: {location: modName, identifier: 'transaction.nominalDimension', initial: 'Nominal Dimension'},
					NominalDimension2: {location: modName, identifier: 'transaction.nominalDimension2', initial: 'Nominal Dimension2'},
					NominalDimension3: {location: modName, identifier: 'transaction.nominalDimension3', initial: 'Nominal Dimension3'},
					ControllingunitAssign01Comment: {location: modName, identifier: 'transaction.controllingUnitAssign01Comment', initial: 'Controlling Unit Assign01 Comment'},
					ControllingunitAssign02Comment: {location: modName, identifier: 'transaction.controllingUnitAssign02Comment', initial: 'Controlling Unit Assign02 Comment'},
					ControllingunitAssign03Comment: {location: modName, identifier: 'transaction.controllingUnitAssign03Comment', initial: 'Controlling Unit Assign03 Comment'},
					ControllingunitAssign04Comment: {location: modName, identifier: 'transaction.controllingUnitAssign04Comment', initial: 'Controlling Unit Assign04 Comment'},
					ControllingunitAssign05Comment: {location: modName, identifier: 'transaction.controllingUnitAssign05Comment', initial: 'Controlling Unit Assign05 Comment'},
					ControllingunitAssign06Comment: {location: modName, identifier: 'transaction.controllingUnitAssign06Comment', initial: 'Controlling Unit Assign06 Comment'},
					ControllingunitAssign07Comment: {location: modName, identifier: 'transaction.controllingUnitAssign07Comment', initial: 'Controlling Unit Assign07 Comment'},
					ControllingunitAssign08Comment: {location: modName, identifier: 'transaction.controllingUnitAssign08Comment', initial: 'Controlling Unit Assign08 Comment'},
					ControllingunitAssign09Comment: {location: modName, identifier: 'transaction.controllingUnitAssign09Comment', initial: 'Controlling Unit Assign09 Comment'},
					ControllingunitAssign10Comment: {location: modName, identifier: 'transaction.controllingUnitAssign10Comment', initial: 'Controlling Unit Assign10 Comment'},
					CompanyDeferalTypeFk: {location: modName, identifier: 'entityCompanyDeferralType', initial: 'Deferral Type'},
					DateDeferalStart: {location: modName, identifier: 'entityDateDeferralStart', initial: 'Date Deferral Start'},
					ControllinggrpsetFk: {location: cloudCommonModule, identifier: 'entityControllinggrpset', initial: 'Controlling grp set'},
					Assetno: {location: modName, identifier: 'entityAssetNo', initial: 'Asset No.'},
					DocumentNo: {location: modName, identifier: 'entityDocumentNo', initial: 'Document No.'},
					PesHeaderFk: {location: modName, identifier: 'transaction.pesHeader', initial: 'Pes No.'},
					PesItemFk: {location: modName, identifier: 'transaction.pesItem', initial: 'Pes Item'},
					InvOtherFk: {location: modName, identifier: 'transaction.otherItem', initial: 'Other Service Item'},
					ContractItemDesc: {location: modName, identifier: 'group.contract', initial: 'Contract'},
					ItemReference: {
						location: procurementCommonModule,
						identifier: 'transaction.entityItemreference',
						initial: 'Item reference'
					},
					ExtOrderNo: {
						location: modName,
						identifier: 'transaction.extOrderNo',
						initial: 'Ext Order No'
					},
					ExtPesNo: {
						location: modName,
						identifier: 'transaction.extPesNo',
						initial: 'Ext Pes No'
					},
					PrcItemFk: {location: modName, identifier: 'entityPrcItemFk', initial: 'Contract Item'},
					Userdefined1: {
						location: procurementCommonModule,
						identifier: 'userDefined1',
						initial: 'User Defined 1'
					},
					Userdefined2: {
						location: procurementCommonModule,
						identifier: 'userdefined2',
						initial: 'User Defined 2'
					},
					Userdefined3: {
						location: procurementCommonModule,
						identifier: 'userdefined3',
						initial: 'User Defined 3'
					},
					ConHeaderFk: {
						location: modName,
						identifier: 'entityConHeaderFk',
						initial: 'Contract'
					},
					ControllingUnitFk: {
						location: procurementCommonModule,
						identifier: 'transaction.controllingUnitCode',
						initial: 'Controlling Unit Code'
					},
					ControllingUnitIcFk: {
						location: modName,
						identifier: 'transaction.controllingUnitIc',
						initial: 'Clearing Controlling Unit'
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
					IsCanceled: {
						location: procurementCommonModule,
						identifier: 'transaction.isCanceled',
						initial: 'Cancelled'
					},
					VatGroup: {
						location: procurementCommonModule,
						identifier: 'entityVatGroup',
						initial: 'Vat Group'
					},
					LineReference: {
						location: modName,
						identifier: 'entityLineReference',
						initial: 'Line Reference'
					},
					NominalAccountDesc: {
						location: modName,
						identifier: 'entityNominalAccountDesc',
						initial: 'Nominal Account Description'
					},
					NominalAccountFiDesc: {
						location: modName,
						identifier: 'entityNominalAccountFiDesc',
						initial: 'Nominal Account Fi Description'
					}
				}
			},
			'overloads': {
				'nominalaccountdesc': {readonly: true},
				'nominalaccountfidesc': {readonly: true},
				'documenttype': {readonly: true},
				'linetype': {readonly: true},
				'currency': {readonly: true},
				'vouchernumber': {readonly: true},
				'voucherdate': {readonly: true},
				'postingnarritive': {readonly: true},
				'postingdate': {readonly: true},
				'externalnumber': {readonly: true},
				'externaldate': {readonly: true},
				'netduedate': {readonly: true},
				'discountduedate': {readonly: true},
				'discountamount': {readonly: true},
				'creditor': {readonly: true},
				'creditorgroup': {readonly: true},
				'businesspostinggroup': {readonly: true},
				'accountpayable': {readonly: true},
				'nominalaccount': {readonly: true},
				'nominalaccountfi': {readonly: true},
				'amount': {readonly: true},
				'quantity': {readonly: true},
				'isdebit': {readonly: true},
				'vatamount': {readonly: true},
				'vatcode': {readonly: true},
				'isprogress': {readonly: true},
				'ordernumber': {readonly: true},
				'amountauthorized': {readonly: true},
				'controllingunitcode': {readonly: true},
				'controllingunitassign01': {readonly: true},
				'controllingunitassign02': {readonly: true},
				'controllingunitassign03': {readonly: true},
				'controllingunitassign04': {readonly: true},
				'controllingunitassign05': {readonly: true},
				'controllingunitassign06': {readonly: true},
				'controllingunitassign07': {readonly: true},
				'controllingunitassign08': {readonly: true},
				'controllingunitassign09': {readonly: true},
				'controllingunitassign10': {readonly: true},
				'controllingunitassign01desc': {readonly: true},
				'controllingunitassign02desc': {readonly: true},
				'controllingunitassign03desc': {readonly: true},
				'controllingunitassign04desc': {readonly: true},
				'controllingunitassign05desc': {readonly: true},
				'controllingunitassign06desc': {readonly: true},
				'controllingunitassign07desc': {readonly: true},
				'controllingunitassign08desc': {readonly: true},
				'controllingunitassign09desc': {readonly: true},
				'controllingunitassign10desc': {readonly: true},
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
				'nominaldimension': {readonly: true},
				'nominaldimension2': {readonly: true},
				'nominaldimension3': {readonly: true},
				'issuccess': {readonly: true},
				'transactionid': {readonly: true},
				'handoverid': {readonly: true},
				'returnvalue': {readonly: true},
				'postingtype': {readonly: true},
				'coderetention': {readonly: true},
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
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PaymentTerm',
							displayMember: 'Code'
						},
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {showClearButton: true},
							directive: 'basics-lookupdata-payment-term-lookup'
						},
						width: 150
					},
					readonly: true
				},
				'companydeferaltypefk': {
					detail: {
						'type': 'directive',
						'directive': 'basics-company-deferaltype-lookup',
						'options': {
							displayMember: 'DescriptionInfo.Translated'
						}
					},
					grid: {
						editor: 'lookup',
						'editorOptions': {
							'directive': 'basics-company-deferaltype-lookup',
							'lookupOptions': {
								'displayMember': 'DescriptionInfo.Translated'
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'companydeferaltype',
							displayMember: 'DescriptionInfo.Translated'
						},
						'width': 150
					},
					readonly: true
				},
				'datedeferalstart': {readonly: true},
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
				'itemreference': {readonly: true},
				'assetno': {readonly: true},
				'documentno': {readonly: true},
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
				'pesheaderfk': {
					readonly: true,
					'grid': {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PesHeader',
							displayMember: 'Code'
						}
					},
					displayName: 'Pes No.',
					displayName$tr$: modName + '.transaction.pesHeader'
				},
				'pesitemfk': {
					readonly: true,
					'grid': {
						formatter: 'lookup',
						formatterOptions: {
							version:3,
							lookupType: 'PesItem',
							displayMember: 'Description1'
						}
					}
				},
				'invotherfk': {
					readonly: true,
					'grid': {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'InvOther',
							displayMember: 'Description'
						}
					}
				},
				'contractitemdesc': {
					readonly: true
				},
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
				'controllingunitfk': {
					readonly: true,
					'navigator': {
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
				'controllinguniticfk': {
					readonly: true,
					'navigator': {
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
				'extorderno': {readonly: true},
				'extpesno': {readonly: true},
				'userdefined1': {readonly: true},
				'userdefined2': {readonly: true},
				'userdefined3': {readonly: true},
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
				'iscanceled': {
					readonly: true
				},
				'vatgroup': {
					readonly: true
				},
				'linereference': {
					readonly: true
				}
			},
			'addition': {
				'grid': [
					{
						'lookupDisplayColumn': true,
						'field': 'PaymentTermFk',
						'displayMember': 'DescriptionInfo.Translated',
						'name$tr$': 'procurement.invoice.header.paymentTermDes',
						'width': 150
					},
				]
			}
		};
	}]);

	angular.module(modName).factory('procurementInvoiceTransactionUIStandardService',
		['platformUIStandardConfigService', 'procurementInvoiceTranslationService',
			'procurementInvoiceTransactionLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'InvTransactionDto',
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
