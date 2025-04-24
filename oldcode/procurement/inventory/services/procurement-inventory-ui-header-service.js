/**
 * Created by pel on 7/3/2019.
 */

(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var modName = 'procurement.inventory',
		cloudCommonModule = 'cloud.common',
		projectStockModule = 'project.stock';


	angular.module(modName).factory('procurementInventoryHeaderLayout', [
		function () {
			return {
				'fid': 'procurement.inventory.header',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['id', 'description', 'inventorydate', 'transactiondate', 'prjprojectfk', 'prjstockfk', 'prcstocktransactiontypefk',
							'isposted', 'stocktotal', 'inventorytotal', 'commenttext', 'userdefined1', 'userdefined2', 'userdefined3', 'userdefined4',
							'userdefined5', 'prjstockdowntimefk','companyfk']

					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [modName,projectStockModule],
					'extraWords': {
						'moduleName': {
							'location': modName,
							'identifier': 'moduleName',
							'initial': 'Inventory Header'
						},
						'Description': {'location': modName, 'identifier': 'header.description', 'initial': 'Description'},
						'PrjProjectFk': {'location': cloudCommonModule, 'identifier': 'entityProjectNo', 'initial': 'Project No.'},
						'PrjStockFk': {'location': modName, 'identifier': 'header.prjStockFk', 'initial': 'Stock Code'},
						'InventoryDate': {'location': modName, 'identifier': 'header.inventoryDate', 'initial': 'Inventory Date'},
						'TransactionDate': {'location': modName, 'identifier': 'header.transactionDate', 'initial': 'Transaction Date'},
						'PrcStockTransactionTypeFk': {'location': modName, 'identifier': 'header.prcStockTransactionTypeFk', 'initial': 'Stock Transaction Type'},
						'IsPosted': {'location': modName, 'identifier': 'header.isPosted', 'initial': 'Is Posted'},
						'StockTotal': {'location': modName, 'identifier': 'header.stockTotal', 'initial': 'Stock Total'},
						'InventoryTotal': {'location': modName, 'identifier': 'header.inventoryTotal', 'initial': 'Inventory Total'},
						'CommentText': {'location': modName, 'identifier': 'header.commentText', 'initial': 'Comment'},
						'UserDefined1': {'location': modName, 'identifier': 'header.userDefined1', 'initial': 'UserDefined 1'},
						'UserDefined2': {location: modName, identifier: 'header.userDefined2', initial: 'UserDefined 2'},
						'UserDefined3': {location: modName, identifier: 'header.userDefined3', initial: 'UserDefined 3'},
						'UserDefined4': {location: modName, identifier: 'header.userDefined4', initial: 'UserDefined 4'},
						'UserDefined5': {location: modName, identifier: 'header.userDefined5', initial: 'UserDefined 5'},
						'PrjStockDownTimeFk': {location: projectStockModule, identifier: 'downtimeListContainerTitle', initial: 'Stock DownTime'},
						'CompanyFk':{'location': cloudCommonModule, 'identifier': 'entityCompany', 'initial': 'Company' },
					}
				},
				'overloads': {
					'id': {
						'readonly': true
					},
					prjstockfk: {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'procurement-stock-lookup-dialog',
								'lookupOptions': {
									'filterKey': 'stock-project-filter'
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'ProjectStock', 'displayMember': 'Code'
							},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'procurement-stock-lookup-dialog',
							'options': {
								'filterKey': 'stock-project-filter'
							}
						}
					},
					'prjprojectfk': {
						'navigator': {
							moduleName: 'project.main'
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-lookup-data-project-project-dialog',
								'displayMember': 'ProjectName',
								'lookupOptions': {
									'filterKey': 'prc-invoice-header-project-filter',
									'showClearButton': true
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'PrcProject', 'displayMember': 'ProjectNo'
							},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'basics-lookup-data-project-project-dialog',
								'descriptionMember': 'ProjectName',
								'lookupOptions': {
									'showClearButton': true,
									'lookupKey': 'prc-invoice-header-project-property',
									'filterKey': 'prc-invoice-header-project-filter'
								}
							}
						},
						mandatory: true

					},
					'prcstocktransactiontypefk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'procurement-stock-transaction-type-dialog',
								'lookupOptions': {
									'filterKey': 'header-inventory-stock-transaction-transactiontype-filter'
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
								filterKey: 'header-inventory-stock-transaction-transactiontype-filter'
							}
						}

					},
					'isposted': {'readonly': true},
					'inventorydate': {
						mandatory: true
					},
					'transactiondate': {
						mandatory: true
					},
					'stocktotal': {
						'readonly': true,
						formatter: 'money'
					},
					'inventorytotal': {
						'readonly': true,
						formatter: 'money'
					},
					prjstockdowntimefk: {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'project-stock-down-time-lookup-dialog',
								'lookupOptions': {
									'filterKey': 'stock-down-time-filter'
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'ProjectStockDownTime', 'displayMember': 'Description'
							},
							'width': 100
						},
						'detail': {
							'type': 'directive',
							'directive': 'project-stock-down-time-lookup-dialog',
							'options': {
								'filterKey': 'stock-down-time-filter'
							}
						}
					},
					'companyfk': {
						readonly: true,
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
							width: 120
						},
						detail: {
							model: 'CompanyFk',
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-company-company-lookup',
								descriptionMember: 'CompanyName'
							}
						}

					},
				}

			};
		}]);

	angular.module(modName).factory('procurementInventoryHeaderUIStandardService',
		['platformUIStandardConfigService', 'procurementInventoryHeaderTranslationService',
			'procurementInventoryHeaderLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PrcInventoryHeaderDto',
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

