/**
 * Created by alm on 9/29/2021.
 */

(function () {
	'use strict';
	var moduleName = 'controlling.revrecognition';
	var cloudCommonModule = 'cloud.common';
	
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

	angular.module(moduleName).factory('controllingRevenueRecognitionAccrualLayout', ['basicsCommonComplexFormatter',
		function controllingRevenueRecognitionAccrualLayout(basicsCommonComplexFormatter) {
			return {
				fid: 'controlling.revenuerecognition.accrualForm',
				version: '1.0.0',
				showGrouping: true,
				addValidationAutomatically: true,
				'groups': [
					{
						'gid': 'baseGroup',
						'attributes': ['documenttype','currency','postingdate','vouchernumber','voucherdate','account','offsetaccount','postingnarritive','amount','amountoc','quantity','controllingunitcode','controllingunitassign01','controllingunitassign01desc','controllingunitassign02','controllingunitassign02desc','controllingunitassign03','controllingunitassign03desc','controllingunitassign04','controllingunitassign04desc','controllingunitassign05','controllingunitassign05desc','controllingunitassign06','controllingunitassign06desc','controllingunitassign07','controllingunitassign07desc','controllingunitassign08','controllingunitassign08desc','controllingunitassign09','controllingunitassign09desc','controllingunitassign10','controllingunitassign10desc','nominaldimension','nominaldimension2','nominaldimension3','iscancel']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName, cloudCommonModule],
					'extraWords': {
						DocumentType: {location: cloudCommonModule, identifier: 'entityDocumentType', initial: 'Offset Cont Unit'},
						Currency: {location: cloudCommonModule, identifier: 'entityCurrency', initial: 'Offset Cont Unit'},
						PostingDate:{ location: moduleName, identifier: 'entityPostingDate', initial: 'Posting Date' },
						VoucherNumber: {location: cloudCommonModule, identifier: 'entityVoucherNumber', initial: 'Voucher Number'},
						VoucherDate: {location: cloudCommonModule, identifier: 'entityVoucherDate', initial: 'Voucher Date'},
						Account: {location: moduleName, identifier: 'entityAccount', initial: 'Account'},
						OffsetAccount: {location: cloudCommonModule, identifier: 'entityOffsetAccount', initial: 'Offset Account'},
						PostingNarritive: {location: cloudCommonModule, identifier: 'entityPostingNarritive', initial: 'Posting Narritive'},
						Amount: {location: cloudCommonModule, identifier: 'entityAmount', initial: 'Amount'},
						AmountOc: {location: cloudCommonModule, identifier: 'entityAmountOc', initial: 'Amount Oc'},
						Quantity: {location: cloudCommonModule, identifier: 'entityQuantity', initial: 'Quantity'},
						ControllingUnitCode: {location: cloudCommonModule, identifier: 'entityControllingUnitCode', initial: 'Controlling Unit Code'},
						ControllingUnitAssign01: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign01', initial: 'ControllingUnitAssign01'},
						ControllingUnitAssign01Desc: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign01Desc', initial: 'Controlling Unit Assign 01 Desc'},
						ControllingUnitAssign02: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign02', initial: 'ControllingUnitAssign02'},
						ControllingUnitAssign02Desc: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign02Desc', initial: 'Controlling Unit Assign 02 Desc'},
						ControllingUnitAssign03: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign03', initial: 'ControllingUnitAssign03'},
						ControllingUnitAssign03Desc: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign03Desc', initial: 'Controlling Unit Assign 03 Desc'},
						ControllingUnitAssign04: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign04', initial: 'ControllingUnitAssign04'},
						ControllingUnitAssign04Desc: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign04Desc', initial: 'Controlling Unit Assign 04 Desc'},
						ControllingUnitAssign05: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign05', initial: 'ControllingUnitAssign05'},
						ControllingUnitAssign05Desc: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign05Desc', initial: 'Controlling Unit Assign 05 Desc'},
						ControllingUnitAssign06: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign06', initial: 'ControllingUnitAssign06'},
						ControllingUnitAssign06Desc: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign06Desc', initial: 'Controlling Unit Assign 06 Desc'},
						ControllingUnitAssign07: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign07', initial: 'ControllingUnitAssign07'},
						ControllingUnitAssign07Desc: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign07Desc', initial: 'Controlling Unit Assign 07 Desc'},
						ControllingUnitAssign08: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign08', initial: 'ControllingUnitAssign08'},
						ControllingUnitAssign08Desc: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign08Desc', initial: 'Controlling Unit Assign 08 Desc'},
						ControllingUnitAssign09: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign09', initial: 'ControllingUnitAssign09'},
						ControllingUnitAssign09Desc: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign09Desc', initial: 'Controlling Unit Assign 09 Desc'},
						ControllingUnitAssign10: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign10', initial: 'ControllingUnitAssign10'},
						ControllingUnitAssign10Desc: {location: cloudCommonModule, identifier: 'entityControllingUnitAssign10Desc', initial: 'Controlling Unit Assign 10 Desc'},
						NominalDimension: {location: moduleName, identifier: 'entityNominalDimension', initial: 'Nominal Dimension'},
						NominalDimension2: {location: moduleName, identifier: 'entityNominalDimension2', initial: 'Nominal Dimension 2'},
						NominalDimension3: {location: moduleName, identifier: 'entityNominalDimension3', initial: 'Nominal Dimension 3'},
                        IsCancel:{location: moduleName, identifier: 'transaction.isCancel', initial: 'Is Cancel'}
					}
				},
                addition: {
                    grid: extendGrouping([{
                        'id': 'transHeaderDescription',
                        'field': 'CompanyTransheaderEntity.Description',
                        'name': 'Company Transaction header',
                        'name$tr$': 'controlling.revrecognition.transaction.transHeader',
                        'formatter': 'description',
                        'sortable': true
                    }, {
                        'id': 'commentText',
                        'field': 'CompanyTransheaderEntity.CommentText',
                        'name': 'Comment Text',
                        'name$tr$': 'controlling.revrecognition.transaction.commentText',
                        'formatter': 'description',
                        'sortable': true
                    }, {
                        'id': 'returnValue',
                        'field': 'CompanyTransheaderEntity.ReturnValue',
                        'name': 'Return Value',
                        'name$tr$': 'controlling.revrecognition.transaction.returnValue',
                        'formatter': 'description',
                        'sortable': true
                    }, {
                        'id': 'issuccess',
                        'field': 'CompanyTransheaderEntity.IsSuccess',
                        'name': 'Is Success',
                        'name$tr$': 'controlling.revrecognition.transaction.isSuccess',
                        'formatter': 'boolean',
                        'sortable': true
                    }, {
                        'id': 'companypostingdate',
                        'field': 'CompanyTransheaderEntity',
                        'name': 'Transaction Header Posting Date',
                        'name$tr$': 'controlling.revrecognition.transaction.transactionHeaderPostingDate',
                        'formatter': basicsCommonComplexFormatter,
                        'formatterOptions': {
                            'displayMember': 'PostingDate',
                            'domainType': 'dateutc'
                        },
                        'sortable': true
                    }, {
                        'id': 'transactionStatus',
                        'field': 'CompanyTransheaderEntity.CompanyTransheaderStatusFk',
                        'name': 'Transaction Status',
                        'name$tr$': 'controlling.revrecognition.transaction.transactionStatus',
                        'formatter': 'lookup',
                        'formatterOptions': {
                            lookupType: 'CompanyTransHeaderStatus',
                            displayMember: 'DescriptionInfo.Translated',
                            imageSelector: 'platformStatusIconService'
                        },
                        'sortable': true
                    }, {
                        'id': 'transactionType',
                        'field': 'CompanyTransheaderEntity.TransactionTypeFk',
                        'name': 'Transaction Type',
                        'name$tr$': 'controlling.revrecognition.transaction.transactionType',
                        'formatter': 'lookup',
                        'formatterOptions': {
                            lookupType: 'TransactionType',
                            displayMember: 'DescriptionInfo.Translated'
                        },
                        'sortable': true
                    }, {
                        'id': 'transactionTypeAbbreviation',
                        'field': 'CompanyTransheaderEntity.TransactionTypeFk',
                        'name': 'Transaction Type Abbreviation',
                        'name$tr$': 'controlling.revrecognition.transaction.transactionTypeAbbreviation',
                        'formatter': 'lookup',
                        'formatterOptions': {
                            lookupType: 'TransactionType',
                            displayMember: 'Abbreviation'
                        },
                        'sortable': true
                    }, {
                        'id': 'tradingYear',
                        'field': 'CompanyTransheaderEntity.CompanyPeriodEntity.CompanyYearFk',
                        'name': 'Trading Year',
                        'name$tr$': 'controlling.revrecognition.transaction.tradingYear',
                        'formatter': 'lookup',
                        'formatterOptions': {
                            lookupType: 'companyyear',
                            displayMember: 'TradingYear',
                        },
                        'sortable': true
                    }, {
                        'id': 'startDate',
                        'field': 'CompanyTransheaderEntity.CompanyPeriodEntity',
                        'name': 'Trading Period Start Date',
                        'name$tr$': 'controlling.revrecognition.transaction.startDate',
                        'formatter': basicsCommonComplexFormatter,
                        'formatterOptions': {
                            'displayMember': 'StartDate',
                            'domainType': 'dateutc'
                        },
                        'sortable': true
                    }, {
                        'id': 'endDate',
                        'field': 'CompanyTransheaderEntity.CompanyPeriodEntity',
                        'name': 'Trading Period End Date',
                        'name$tr$': 'controlling.revrecognition.transaction.endDate',
                        'formatter': basicsCommonComplexFormatter,
                        'formatterOptions': {
                            'displayMember': 'EndDate',
                            'domainType': 'dateutc'
                        },
                        'sortable': true
                    }, {
                        'id': 'referenceTransactionHeader',
                        'field': 'CompanyTransheaderEntity.CompanyTransheader',
                        'name': 'Reference Transaction Header',
                        'name$tr$': 'controlling.revrecognition.transaction.referenceTransactionHeader',
                        'formatter': 'description',
                        'sortable': true
                    }, {
                        'id': 'transactionSetId',
                        'field': 'TransactionSetId',
                        'name': 'Transaction Set Id',
                        'name$tr$': 'controlling.revrecognition.transaction.TransactionSetId',
                        'formatter': 'description',
                        'sortable': true
                    }]),
                    detail:[{
                            'rid': 'transHeaderDescription',
                            'gid': 'baseGroup',
                            'model': 'CompanyTransheaderEntity.Description',
                            'label': 'Company Transaction header',
                            'label$tr$': 'controlling.revrecognition.transaction.transHeader',
                            'type': 'description',
                            'readonly': true
                        },{
                            'rid': 'commentText',
                            'gid': 'baseGroup',
                            'model': 'CompanyTransheaderEntity.CommentText',
                            'label': 'Comment Text',
                            'label$tr$': 'controlling.revrecognition.transaction.commentText',
                            'type': 'description',
                            'readonly': true
                    },{
                        'rid': 'returnValue',
                        'gid': 'baseGroup',
                        'model': 'CompanyTransheaderEntity.ReturnValue',
                        'label': 'Return Value',
                        'label$tr$': 'controlling.revrecognition.transaction.returnValue',
                        'type': 'description',
                        'readonly': true
                    }, {
                        'rid': 'issuccess',
                        'gid': 'baseGroup',
                        'model': 'CompanyTransheaderEntity.IsSuccess',
                        'label': 'Is Success',
                        'label$tr$': 'controlling.revrecognition.transaction.isSuccess',
                        'type': 'boolean',
                        'readonly': true
                    },{
                        'rid': 'companypostingdate',
                        'gid': 'baseGroup',
                        'model': 'CompanyTransheaderEntity.PostingDate',
                        'label': 'PostingDate',
                        'label$tr$': 'controlling.revrecognition.transaction.transactionHeaderPostingDate',
                        'type': 'dateutc',
                        'readonly': true
                    },{
                        'rid': 'transactionStatus',
                        'gid': 'baseGroup',
                        'model': 'CompanyTransheaderEntity.CompanyTransheaderStatusFk',
                        'label': 'Posting Date',
                        'label$tr$': 'controlling.revrecognition.transaction.transactionStatus',
                         'type': 'directive',
                         'directive': 'basics-company-trans-status-combobox',
                         'options': {
                            imageSelector: 'platformStatusIconService'
                         },
                        'readonly': true
                    },{
                        'rid': 'transactionType',
                        'gid': 'baseGroup',
                        'model': 'CompanyTransheaderEntity.TransactionTypeFk',
                        'label': 'Transaction Type',
                        'label$tr$': 'controlling.revrecognition.transaction.transactionType',
                        'type': 'directive',
                        'directive': 'basics-lookupdata-transaction-type-combobox',
                        'readonly': true
                    },{
                        'rid': 'transactionTypeAbbreviation',
                        'gid': 'baseGroup',
                        'model': 'CompanyTransheaderEntity.TransactionTypeFk',
                        'label': 'Transaction Type Abbreviation',
                        'label$tr$': 'controlling.revrecognition.transaction.transactionTypeAbbreviation',
                        'type': 'directive',
                        'directive': 'basics-lookupdata-transaction-type-combobox',
                        'options': {
                            displayMember: 'Abbreviation'
                        },
                        'readonly': true
                    },{
                        'rid': 'tradingYear',
                        'gid': 'baseGroup',
                        'model': 'CompanyTransheaderEntity.CompanyPeriodEntity.CompanyYearFk',
                        'label': 'Trading Year',
                        'label$tr$': 'controlling.revrecognition.transaction.tradingYear',
                        'type': 'directive',
                        'directive': 'controlling-revenue-recognition-company-year-combobox',
                        'readonly': true
                    },{
                        'rid': 'startDate',
                        'gid': 'baseGroup',
                        'model': 'CompanyTransheaderEntity.CompanyPeriodEntity.StartDate',
                        'label': 'Trading Period Start Date',
                        'label$tr$': 'controlling.revrecognition.transaction.startDate',
                        'type': 'dateutc',
                        'readonly': true
                    },{
                        'rid': 'endDate',
                        'gid': 'baseGroup',
                        'model': 'CompanyTransheaderEntity.CompanyPeriodEntity.EndDate',
                        'label': 'Trading Period End Date',
                        'label$tr$': 'controlling.revrecognition.transaction.endDate',
                        'type': 'dateutc',
                        'readonly': true
                    },{
                        'rid': 'referenceTransactionHeader',
                        'gid': 'baseGroup',
                        'model': 'CompanyTransheaderEntity.CompanyTransheader',
                        'label': 'Reference Transaction Header',
                        'label$tr$': 'controlling.revrecognition.transaction.referenceTransactionHeader',
                        'type': 'description',
                        'readonly': true
                    }, {
                        'rid': 'transactionSetId',
                        'gid': 'baseGroup',
                        'model': 'TransactionSetId',
                        'label': 'Transaction Set Id',
                        'label$tr$': 'controlling.revrecognition.transaction.TransactionSetId',
                        'type': 'description',
                        'readonly': true
                    }
                    ]
                }

			};
		}
	]);


	angular.module(moduleName).factory('controllingRevenueRecognitionAccrualUIStandardService',

		['platformUIStandardConfigService', 'controllingRevenueRecognitionTranslationService', 'platformSchemaService', 'controllingRevenueRecognitionAccrualLayout', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, platformSchemaService, controllingRevenueRecognitionAccrualLayout, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'CompanyTransactionDto',
					moduleSubModule: 'Basics.Company'
				});

				if (domainSchema) {
					domainSchema = domainSchema.properties;
                    domainSchema.TransactionSetId = {domain: 'description'};
				}

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new BaseService(controllingRevenueRecognitionAccrualLayout, domainSchema, translationService);

				platformUIStandardExtentService.extend(service, controllingRevenueRecognitionAccrualLayout.addition, domainSchema);

				return service;
			}
		]);
})(angular);
