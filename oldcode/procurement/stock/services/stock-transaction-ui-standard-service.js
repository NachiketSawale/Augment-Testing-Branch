// eslint-disable-next-line no-redeclare
/* global angular */
(function () {
	'use strict';
	var modName = 'procurement.stock';
	angular.module(modName).factory('procurementStockTransactionLayout', ['basicsLookupdataConfigGenerator', 'platformModuleNavigationService', 'platformLayoutHelperService', 'procurementStockHeaderDataService',
		function (basicsLookupdataConfigGenerator, naviservice, platformLayoutHelperService, parentService) {

			return {
				'fid': 'procurement.stock.transaction',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['prcstocktransactiontypefk', 'mdcmaterialfk', 'prjstockfk', 'prjstocklocationfk', 'lotno', 'transactiondate', 'documentdate',
							'quantity', 'basuomfk', 'total', 'provisionpercent', 'provisiontotal', 'mdccontrollingunitfk', 'prcstocktransactionfk', 'pesheaderfk', 'invheaderfk', 'commenttext', 'dispatchrecordfk', 'dispatchheaderfk', 'ppsproductfk', 'prcinventoryheaderfk', 'id', 'inventorydate', 'expirationdate'
						]
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					},
					{
						'gid': 'UserDefinedFields',
						'attributes': ['userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5']

					}
				],
				'translationInfos': {
					'extraModules': [modName, 'basics.common'],
					'extraWords': {
						PrcStocktransactiontypeFk: {location: modName, identifier: 'transaction.PrcStocktransactiontypeFk', initial: 'Transaction Type'},
						MdcMaterialFk: {location: modName, identifier: 'transaction.MdcMaterialFk', initial: 'Material Code'},
						PrjStockFk: {location: modName, identifier: 'transaction.PrjStockFk', initial: 'Stock Code'},
						PrjStocklocationFk: {location: modName, identifier: 'transaction.PrjStocklocationFk', initial: 'Stock Location'},
						Lotno: {location: modName, identifier: 'transaction.Lotno', initial: 'Lot No.'},
						TransactionDate: {location: modName, identifier: 'transaction.TransactionDate', initial: 'Transaction Date'},
						DocumentDate: {location: modName, identifier: 'transaction.DocumentDate', initial: 'Document Date'},
						Quantity: {location: modName, identifier: 'transaction.Quantity', initial: 'Quantity'},
						BasUomFk: {location: modName, identifier: 'transaction.BasUomFk', initial: 'Uom'},
						Total: {location: modName, identifier: 'transaction.Total', initial: 'Total Value'},
						ProvisionPercent: {location: modName, identifier: 'transaction.ProvisionPercent', initial: 'Provision Percent'},
						ProvisionTotal: {location: modName, identifier: 'transaction.ProvisionTotal', initial: 'Provision Total Value'},
						MdcControllingunitFk: {location: modName, identifier: 'transaction.MdcControllingunitFk', initial: 'Controllingunit Code'},
						PrcStocktransactionFk: {location: modName, identifier: 'transaction.PrcStocktransactionFk', initial: 'Transaction'},
						PesHeaderFk: {location: modName, identifier: 'transaction.PesItemFk', initial: 'Pes'},
						InvHeaderFk: {location: modName, identifier: 'transaction.Inv2contractFk', initial: 'Invoice'},
						CommentText: {location: modName, identifier: 'transaction.entityCommentText', initial: 'Comment'},
						DispatchRecordFk: {location: modName, identifier: 'transaction.DispatchRecordFk', initial: 'Dispatching Record'},
						DispatchHeaderFk: {location: modName, identifier: 'transaction.DispatchHeaderFk', initial: 'Dispatching Header'},
						PpsProductFk: {location: modName, identifier: 'transaction.PpsProductFk', initial: 'PPS Product'},
						PrcInventoryHeaderFk: {location: modName, identifier: 'transaction.PrcInventoryFk', initial: 'Inventory'},
						InventoryDate: {location: modName, identifier: 'transaction.InventoryDate', initial: 'Inventory Date'},
						ExpirationDate: {location: modName, identifier: 'transaction.ExpirationDate', initial: 'Expiration Date'},
						Userdefined1: {location: modName, identifier: 'transaction.entityUserDefinedField1', initial: 'User Defined 1'},
						Userdefined2: {location: modName, identifier: 'transaction.entityUserDefinedField2', initial: 'User Defined 2'},
						Userdefined3: {location: modName, identifier: 'transaction.entityUserDefinedField3', initial: 'User Defined 3'},
						Userdefined4: {location: modName, identifier: 'transaction.entityUserDefinedField4', initial: 'User Defined 4'},
						Userdefined5: {location: modName, identifier: 'transaction.entityUserDefinedField5', initial: 'User Defined 5'},
						UserDefinedFields: {'location': modName, 'identifier': 'transaction.entityUserDefined', 'initial': 'UserDefined'},
					}
				},
				'overloads': {
					'prcstocktransactiontypefk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'procurement-stock-transaction-type-dialog',
								'lookupOptions': {
									'filterKey': 'prc-stock-transaction-transactiontype-filter'
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'StockTransactionType',
								'displayMember': 'DescriptionInfo.Translated',
								'imageSelector': 'basicsCustomizeProcurementStockTransactionTypeIconService'
							},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'procurement-stock-transaction-type-dialog',
							'options': {
								filterKey: 'prc-stock-transaction-transactiontype-filter'
							}
						}

					},
					'mdcmaterialfk': {
						navigator: {
							moduleName: 'basics.material'
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-material-material-lookup',
							'options': {
								filterKey: 'procurement-common-item-mdcmaterial-filter'
							}
						},
						'grid': {
							// editor: 'lookup',
							// editorOptions: {
							//     lookupOptions: {
							//         filterKey: 'basics-material-records-neutral-materialCatalog-filter',
							//         showClearButton: true
							//     },
							//     directive: 'basics-material-neutral-material-lookup'
							// },
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'MaterialRecord',
								displayMember: 'Code'
							}
						},
						'readonly': true
					},
					prjstockfk: {
						'grid': {
							// 'editor': 'lookup',
							// 'editorOptions': {
							//     'directive': 'procurement-stock-lookup-dialog'
							// },
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'ProjectStock', 'displayMember': 'Code'
							},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'procurement-stock-lookup-dialog'
						},
						'readonly': true
					},
					'prjstocklocationfk': platformLayoutHelperService.provideProjectStockLocationLookupOverload(null, [{
						'projectFk': 'ProjectFk',
						projectFkReadOnly: false,
						getAdditionalEntity: function (item) {
							let prj = null;
							if (item) {
								let headerSelectedItem = parentService.getSelected();
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
							return item;
						}
					}]),
					'basuomfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-uom-lookup'
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
					'mdccontrollingunitfk': {
						navigator: {
							moduleName: 'controlling.structure'
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'basics-master-data-context-controlling-unit-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									filterKey: 'prc-stock-controlling-unit-filter'
								}
							}

						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true,
									filterKey: 'prc-stock-controlling-unit-filter'
								},
								directive: 'basics-master-data-context-controlling-unit-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Controllingunit',
								displayMember: 'Code'
							},
							width: 130
						}
					},
					'prcstocktransactionfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'procument-pes-stock-transaction-lookup-diaglog',
								'lookupOptions': {
									'filterKey': 'prc-transactions-transaction-filter',
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
								'filterKey': 'prc-transactions-transaction-filter',
								'showClearButton': true
							}
						}
					},
					'pesheaderfk': {
						'navigator': {
							moduleName: 'procurement.pes'
						},
						'grid': {
							// 'editor': 'lookup',
							// 'editorOptions': {
							//     'directive': 'procurement-stock-pes-item-dialog',
							//     'lookupOptions': {
							//         'showClearButton': true
							//     }
							// },
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'PesHeader', 'displayMember': 'Code'
							},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'label$tr$': 'procurement.invoice.header.pes',
							'options': {
								lookupDirective: 'procurement-invoice-pes-lookup',
								descriptionMember: 'Description',
								'lookupOptions': {
									'filterKey': 'prc-stock-pes-header-filter'
								}
							}
						},
						readonly: true

					},
					'invheaderfk': {
						'navigator': {
							moduleName: 'procurement.invoice',
							navFunc: function (options, entity) {
								if (entity.Inv2contractFk !== null) {
									naviservice.navigate(options.navigator, entity, options.field);
								}
							}
						},
						'grid': {
							// 'editor': 'lookup',
							// 'editorOptions': {
							//     'directive': 'procurement-stock-inv2-contract-dialog'
							// },
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'InvHeaderChained', 'displayMember': 'Code'
							},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'label$tr$': 'procurement.stock.transaction.Inv2contractFk',
							'options': {
								lookupDirective: 'procurement-stock-inv2-contract-dialog',
								descriptionMember: 'Description',
								'lookupOptions': {
									'filterKey': 'prc-stock-invoice-filter'
								}
							}
						},
						readonly: true
					},
					'lotno': {width: 100},
					'total': {formatter: 'money'},
					'provisiontotal': {formatter: 'money'},
					'provisionpercent': {formatter: 'money'},
					'dispatchheaderfk': {
						'navigator': {
							moduleName: 'logistic.dispatching',
							navFunc: function (options, entity) {
								if (entity.DispatchHeaderFk !== null) {
									naviservice.navigate(options.navigator, entity, options.field);
								}
							}
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'logistic-dispatching-header-paging-lookup',
								'lookupOptions': {
									'dataServiceName': 'logisticDispatchingHeaderLookupDataService',
									'lookupType': 'dispatchHeader'
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'dispatchHeader',
								'displayMember': 'Code',
								'pKeyMaps': [{pkMember: 'CompanyFk', fkMember: 'CompanyFk'}],
								'version': 3
							},
							'width': 125
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'logistic-dispatching-header-paging-lookup',
								lookupField: 'LgmDispatchHeaderFk',
								displayMember: 'Code',
								descriptionMember: 'Description'
							}
						},
						readonly: true
					},
					'dispatchrecordfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'logistic-dispatching-record-dialog-lookup',
								'lookupType': 'DispatchRecord'
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'DispatchRecord',
								'displayMember': 'RecordNo',
								'pKeyMaps': [{pkMember: 'CompanyFk', fkMember: 'CompanyFk'}],
								'version': 3
							},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'logistic-dispatching-record-dialog-lookup',
								displayMember: 'RecordNo',
								descriptionMember: 'Description'
							}
						},
						readonly: true
					},
					'ppsproductfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'productionplanning-common-product-lookup-new',
								'lookupType': 'CommonProduct'
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'CommonProduct',
								'displayMember': 'Code',
								'version': 3
							},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'productionplanning-common-product-lookup-new',
								displayMember: 'Code',
								descriptionMember: 'DescriptionInfo.Translated'
							}
						},
						readonly: true
					},
					'prcinventoryheaderfk': {
						'navigator': {
							moduleName: 'procurement.inventory'
						},
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'InventoryHeader', 'displayMember': 'Description'
							},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'procurement-inventory-header-lookup',
								descriptionMember: 'Description'
							}
						},
						readonly: true
					},
					'id': {
						'readonly': true
					},
					'inventorydate': {
						'readonly': true
					}
				},
				'addition': {
					grid: [
						{
							'lookupDisplayColumn': true,
							'field': 'MdcControllingunitFk',
							'displayMember': 'DescriptionInfo.Translated',
							'name$tr$': 'cloud.common.entityControllingUnitDesc',
							'width': 100
						},
						{
							'lookupDisplayColumn': true,
							'field': 'PesHeaderFk',
							'name$tr$': 'procurement.invoice.header.pesHeaderDes',
							'width': 180
						},
						{
							'lookupDisplayColumn': true,
							'field': 'InvHeaderFk',
							'name$tr$': 'procurement.stock.transaction.invoiceDescription',
							'width': 180
						},
						{
							'afterId': 'dispatchheaderfk',
							'id': 'dispatchheaderDescription',
							'field': 'DispatchHeaderFk',
							'name': 'Dispatching Header Description',
							'name$tr$': 'procurement.stock.transaction.DispatchHeaderFkDescription',
							'sortable': true,
							'width': 180,
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'dispatchHeader',
								'displayMember': 'Description',
								'pKeyMaps': [{pkMember: 'CompanyFk', fkMember: 'CompanyFk'}],
								'version': 3
							}
						},
						{
							'afterId': 'dispatchrecordfk',
							'id': 'dispatchrecordDescription',
							'field': 'DispatchRecordFk',
							'name': 'Dispatching Record Description',
							'name$tr$': 'procurement.stock.transaction.DispatchRecordFkDescription',
							'sortable': true,
							'width': 180,
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'DispatchRecord',
								'displayMember': 'Description',
								'pKeyMaps': [{pkMember: 'CompanyFk', fkMember: 'CompanyFk'}],
								'version': 3
							}
						},
						// {
						//     afterId:'prjstocklocationfk',
						//     'lookupDisplayColumn': true,
						//     'field': 'PrjStocklocationFk',
						//     'displayMember': 'DescriptionInfo.Description',
						//     'name': 'Stock Location Description',
						//     'name$tr$': 'procurement.stock.transaction.stocklocationDescription',
						//     'width': 100
						// },
						//
						{
							'afterId': 'ppsproductfk',
							'id': 'ppsproductDescription',
							'field': 'PpsProductFk',
							'name$tr$': 'procurement.stock.transaction.PpsProductDesc',
							'width': 100,
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'CommonProduct',
								'displayMember': 'DescriptionInfo.Translated',
								'version': 3
							}
						}
					]
				}
			};
		}]);

	angular.module(modName).factory('procurementStockTransactionUIStandardService',
		['platformUIStandardConfigService', 'procurementStockTranslationService',
			'procurementStockTransactionLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'StockTransactionDto',
					moduleSubModule: 'Procurement.Stock'
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
