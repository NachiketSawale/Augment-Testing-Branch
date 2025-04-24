/**
 * Created by pel on 7/5/2019.
 */

(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var modName = 'procurement.inventory';

	angular.module(modName).factory('procurementInventoryLayout', ['basicsLookupdataConfigGenerator','procurementInventoryHeaderDataService','procurementPriceComparisonCommonService',
		'platformLayoutHelperService',
		function (basicsLookupdataConfigGenerator, parentService,commonService, platformLayoutHelperService) {
			return {
				'fid': 'procurement.inventory',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['mdcmaterialfk','catalogfk','basuomfk','prjstocklocationfk','lotno','prcstocktransactiontypefk','productcode', 'productdescription','stockquantity','stocktotal','stockprovisiontotal','actualquantity',
							'actualtotal','actualprovisiontotal','quantitydifference','totaldifference','provisiondifference', 'price', 'status','userdefined1', 'userdefined2','userdefined3','userdefined4',
							'userdefined5','expirationdate', 'recordeduomfk', 'recordedquantity','iscounted','quantity1','quantity2', 'clerkfk1','clerkfk2', 'differenceclerkquantity']

					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [modName],
					'extraWords': {
						'moduleName': {
							'location': modName,
							'identifier': 'moduleName',
							'initial': 'Inventory'
						},
						'MdcMaterialFk':{'location': modName, 'identifier': 'mdcmaterialfk', 'initial': 'Material'},
						'BasUomFk':{'location': modName, 'identifier': 'uom', 'initial': 'Uom'},
						'PrjStockLocationFk':{'location': modName, 'identifier': 'prjstocklocationfk', 'initial': 'Storage Location' },
						'LotNo':{'location': modName, 'identifier': 'lotno', 'initial': 'Lot No' },
						'StockQuantity':{'location': modName, 'identifier': 'stockquantity', 'initial': 'Stock Quantity' },
						'StockTotal':{'location': modName, 'identifier': 'header.stockTotal', 'initial': 'Stock Total' },
						'StockProvisionTotal':{'location': modName, 'identifier': 'stockprovisiontotal', 'initial': 'Stock Provision Total' },
						'ActualQuantity':{'location': modName, 'identifier': 'actualquantity', 'initial': 'Actual Quantity' },
						'ActualTotal':{'location': modName, 'identifier': 'actualtotal', 'initial': 'Actual Total' },
						'ActualProvisionTotal':{'location': modName, 'identifier': 'actualprovisiontotal', 'initial': 'Actual Provision Total' },
						'QuantityDifference':{'location': modName, 'identifier': 'quantitydifference', 'initial': 'Quantity Difference' },
						'TotalDifference':{'location': modName, 'identifier': 'totaldifference', 'initial': 'Total Difference' },
						'ProvisionDifference':{'location': modName, 'identifier': 'provisiondifference', 'initial': 'Provision Difference' },
						'UserDefined1':{'location': modName, 'identifier': 'header.userDefined1', 'initial': 'UserDefined 1' },
						'UserDefined2': {location: modName, identifier: 'header.userDefined2', initial: 'UserDefined 2'},
						'UserDefined3': {location: modName, identifier: 'header.userDefined3', initial: 'UserDefined 3'},
						'UserDefined4': {location: modName, identifier: 'header.userDefined4', initial: 'UserDefined 4'},
						'UserDefined5': {location: modName, identifier: 'header.userDefined5', initial: 'UserDefined 5'},
						'ProductCode':{'location': modName, 'identifier': 'productcode', 'initial': 'Product Code' },
						'ProductDescription':{'location': modName, 'identifier': 'productdes', 'initial': 'Product Description' },
						'CatalogFk':{'location': modName, 'identifier': 'catalog', 'initial': 'Catalog Code' },
						'Price':{'location': modName, 'identifier': 'price', 'initial': 'Price' },
						'Status':{'location': modName, 'identifier': 'status', 'initial': 'Status' },
						'PrcStocktransactiontypeFk':{'location': modName, 'identifier': 'header.prcStockTransactionTypeFk', 'initial': 'Stock Transaction Type' },
						'ExpirationDate':{'location': modName, 'identifier': 'ExpirationDate', 'initial': 'Expiration Date' },
						'RecordedUomFk':{'location': modName, 'identifier': 'recordedUomFk', 'initial': 'Recorded Uom' },
						'RecordedQuantity':{'location': modName, 'identifier': 'recordedQuantity', 'initial': 'Recorded Quantity' },
						'IsCounted':{'location': modName, 'identifier': 'isCounted', 'initial': 'Is Counted' },
						'Quantity1':{'location': modName, 'identifier': 'quantity1', 'initial': 'Clerk 1 Quantity' },
						'Quantity2':{'location': modName, 'identifier': 'quantity2', 'initial': 'Clerk 2 Quantity' },
						'ClerkFk1':{'location': modName, 'identifier': 'clerk1', 'initial': 'Clerk 1' },
						'ClerkFk2':{'location': modName, 'identifier': 'clerk2', 'initial': 'Clerk 2' },
						'DifferenceClerkQuantity': {'location': modName, 'identifier': 'differenceClerkQuantity', 'initial': 'Difference Clerk Quantity' },
					}
				},
				'overloads':{
					'mdcmaterialfk':{
						navigator: {
							moduleName: 'basics.material'
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'basics-material-material-lookup',
								'descriptionMember': 'DescriptionInfo.Translated',
								'lookupOptions': {
									'lookupType': 'MaterialCommodity',
									'filterKey': 'procurement-common-item-mdcmaterial-filter'
								},
								showClearButton: true
							}
						},
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'MaterialCommodity',
								displayMember: 'Code'
							},
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									filterKey: 'procurement-common-item-mdcmaterial-filter',
									showClearButton: true
								},
								directive: 'basics-material-material-lookup'
							},
							width: 100
						},
						mandatory: true
					},
					'basuomfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'basics-lookupdata-uom-lookup',
								'descriptionMember': 'DescriptionInfo.Translated',
								'lookupOptions': {
									'showClearButton': true
								}
							}
						},
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Uom',
								displayMember: 'Unit'
							},
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-lookupdata-uom-lookup',
								lookupOptions: {
									isFastDataRecording: true
								}
							},
							width: 100
						}
					},
					/*
					'prjstocklocationfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'projectStockLocationLookupDataService',
						enableCache: true,
						valMember: 'Id',
						dispMember: 'Code',
						filter: function (/!* item *!/) {
							var parentItem =  parentService.getSelected();
							var prjStock;
							if (parentItem) {
								prjStock = parentItem.PrjStockFk;
							}
							return prjStock;
						}
					}),
*/
					'prjstocklocationfk': platformLayoutHelperService.provideProjectStockLocationLookupOverload(null, [{
						'projectFk': 'ProjectFk',
						projectFkReadOnly: false,
						getAdditionalEntity: function () {
							let parentItem =  parentService.getSelected();
							let prj = null;
							if (parentItem) {
								prj = parentItem.PrjProjectFk;
							}
							return {
								'ProjectFk': prj
							};
						}
					}, {
						'projectStockFk': 'PrjStockFk',
						projectStockFkReadOnly: false,
						getAdditionalEntity: function () {
							let parentItem =  parentService.getSelected();
							let prjStock = null;
							if (parentItem) {
								prjStock = parentItem.PrjStockFk;
							}
							return {
								'PrjStockFk': prjStock
							};
						}
					}]),
					'catalogfk': {
						navigator: {
							moduleName: 'basics.materialcatalog'
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-material-material-catalog-lookup',
								'lookupOptions': {
									'showClearButton': true
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {'lookupType': 'MaterialCatalog', 'displayMember': 'Code'},
							'width': 150
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'basics-material-material-catalog-lookup',
								'descriptionMember': 'DescriptionInfo.Translated',
								'lookupOptions': {
									'showClearButton': true
								}
							}
						},
						'readonly':true
					},
					'actualtotal':{
						'readonly': true,
						'formatter': function iconBreakdownPercentFormatter(row, cell, value, columnDef, dataContext) {
							var error = dataContext.__rt$data.errors && dataContext.__rt$data.errors[columnDef.field];
							var actualTotal = commonService.formatter.moneyFormatter.apply(this, [row, cell, value, columnDef, dataContext, true]);
							if (error) {
								return '<i class="block-image control-icons ico-grid-warning-yellow"  title="' + error.error + '"></i><span class="pane-r">' + actualTotal + '</span>';
							}
							else {
								return '<div>' + actualTotal + '</div>';
							}
						}
					},
					'stockquantity':{'readonly':true},
					'stocktotal':{'readonly':true, formatter: 'money'},
					'stockprovisiontotal':{'readonly':true,formatter: 'money'},
					'quantitydifference':{'readonly':true},
					'totaldifference':{'readonly':true,formatter: 'money'},
					'provisiondifference':{'readonly':true,formatter: 'money'},
					'actualprovisiontotal':{formatter: 'money'},
					'productcode':{'readonly': true},
					'productdescription':{'readonly': true},
					'status':{'readonly': true},
					'differenceclerkquantity':{'readonly': true},
					'prcstocktransactiontypefk':{
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'procurement-stock-transaction-type-dialog',
								'lookupOptions': {
									'filterKey': 'inventory-stock-transaction-transactiontype-filter'
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
								filterKey: 'inventory-stock-transaction-transactiontype-filter'
							}
						}

					},
					'recordeduomfk': {
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
					'clerkfk1': {
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true
								}
							},
							requiredInErrorHandling: true
						},
						grid: {
							editor: 'lookup',
							directive: 'basics-lookupdata-lookup-composite',
							editorOptions: {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								lookupOptions: {
									showClearButton: true,
									displayMember: 'Code',
									addGridColumns: [{
										id: 'Description',
										field: 'Description',
										name: 'Description',
										width: 200,
										formatter: 'description',
										name$tr$: 'cloud.common.entityDescription'
									}],
									additionalColumns: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Clerk',
								displayMember: 'Code'
							}
						}
					},
					'clerkfk2': {
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true
								}
							},
							requiredInErrorHandling: true
						},
						grid: {
							editor: 'lookup',
							directive: 'basics-lookupdata-lookup-composite',
							editorOptions: {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								lookupOptions: {
									showClearButton: true,
									displayMember: 'Code',
									addGridColumns: [{
										id: 'Description',
										field: 'Description',
										name: 'Description',
										width: 200,
										formatter: 'description',
										name$tr$: 'cloud.common.entityDescription'
									}],
									additionalColumns: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Clerk',
								displayMember: 'Code'
							}
						}
					}
				},

				'addition': {
					grid: [
						{
							lookupDisplayColumn: true,
							field: 'MdcMaterialFk',
							name$tr$: 'procurement.inventory.materialdes',
							displayMember: 'DescriptionInfo.Translated',
							width: 150
						},
						{
							lookupDisplayColumn: true,
							field: 'MdcMaterialFk',
							name$tr$: 'procurement.inventory.materialfurtherdes',
							displayMember: 'DescriptionInfo2.Translated',
							width: 150
						},
						{
							lookupDisplayColumn: true,
							field: 'CatalogFk',
							name$tr$: 'procurement.inventory.catalogdes',
							displayMember: 'DescriptionInfo.Translated'
						},
						{
							lookupDisplayColumn: true,
							field: 'BasUomFk',
							name$tr$: 'procurement.inventory.uomdes',
							displayMember: 'DescriptionInfo.Translated'
						}
					],
					'detail': [
						{
							required: false,
							readonly: true,
							lookupDisplayColumn: true,
							'model': 'MdcMaterialFk',
							'label': 'Further Description',
							'label$tr$': 'procurement.inventory.materialfurtherdes',
							'type': 'directive',
							'directive': 'basics-material-material-lookup',
							'options': {
								'displayMember': 'DescriptionInfo2.Translated'
							}
						}
					]

				}

			};
		}]);

	angular.module(modName).factory('procurementInventoryUIStandardService',
		['platformUIStandardConfigService', 'procurementInventoryTranslationService',
			'procurementInventoryLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PrcInventoryDto',
					moduleSubModule: 'Procurement.Inventory'
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
