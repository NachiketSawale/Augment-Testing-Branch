/**
 * Created by lcn on 8/30/2017.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	var moduleName = 'basics.material';
	var cloudCommonModule = 'cloud.common';
	var projectModule = 'project.stock';

	angular.module(moduleName).factory('basicsMaterialStockLayout', basicsMaterialStockLayout);
	basicsMaterialStockLayout.$inject = ['basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService', 'platformLayoutHelperService'];
	function basicsMaterialStockLayout(basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService, platformLayoutHelperService) {
		var filter = [{
			key: 'material-stock-project-filter',
			serverSide: true,
			fn: function (currentItem) {
				if (currentItem.ProjectStockFk) {
					return {ProjectStockFk: currentItem.ProjectStockFk};
				} else {
					return {};
				}
			}
		}, {
			key: 'material-stock-projectstock-filter',
			serverSide: true,
			fn: function (currentItem) {
				if (currentItem.ProjectFk) {
					return {ProjectFk: currentItem.ProjectFk};
				} else {
					return {};
				}
			}
		},
		{
			key: 'material-stock-stocklocation-filter',
			serverSide: true,
			fn: function (currentItem) {
				if (currentItem.ProjectStockFk) {
					return {ProjectStockFk: currentItem.ProjectStockFk};
				} else {
					return {};
				}
			}
		}
		];
		basicsLookupdataLookupFilterService.registerFilter(filter);
		return {
			fid: 'basics.material.stock.list',
			version: '1.0.0',
			showGrouping: true,
			addValidationAutomatically: true,
			groups: [
				{
					'gid': 'basicData',
					'attributes': ['projectfk', 'projectstockfk', 'minquantity', 'maxquantity', 'provisionpercent', 'provisionperuom',
						'islotmanagement', 'stocklocationfk', 'standardcost']
				},
				{
					'gid': 'entityHistory',
					'isHistory': true
				}
			],
			translationInfos: {
				'extraModules': [cloudCommonModule, projectModule],
				'extraWords': {
					ProjectFk: {location: cloudCommonModule, identifier: 'entityProjectNo', initial: 'Project No.'},
					ProjectName: {
						location: cloudCommonModule,
						identifier: 'entityProjectName',
						initial: 'Project Name'
					},
					ProjectStockFk: {location: projectModule, identifier: 'entityStock', initial: 'Stock'},
					MinQuantity: {location: projectModule, identifier: 'minQuantity', initial: 'Minimum Quantity'},
					MaxQuantity: {location: projectModule, identifier: 'maxQuantity', initial: 'Maximum Quantity'},
					ProvisionPercent: {
						location: projectModule,
						identifier: 'provisionPercent',
						initial: 'Provision Percent'
					},
					ProvisionPeruom: {
						location: projectModule,
						identifier: 'provisionPerUoM',
						initial: 'Provision Per UoM'
					},
					IsLotManagement: {
						location: projectModule,
						identifier: 'isLotManagement',
						initial: 'Is Lot Management'
					},
					StockLocationFk: {
						location: projectModule,
						identifier: 'entityStockLocation',
						initial: 'Stock Location'
					},
					StandardCost: {
						location: projectModule,
						identifier: 'StandardCost',
						initial: 'Standard Cost'
					}
				}
			},
			overloads: {
				'projectfk': {
					'navigator': {
						moduleName: 'project.main'
					},
					'grid': {
						'editor': 'lookup',
						'editorOptions': {
							'directive': 'basics-material-project-lookup-dialog',
							'lookupOptions': {
								'filterKey': 'material-stock-project-filter',
								'showClearButton': true

							}
						},
						'formatter': 'lookup',
						'formatterOptions': {
							'lookupType': 'ProjectStock2Project', 'displayMember': 'ProjectNo'
						}
					},
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							'lookupDirective': 'basics-material-project-lookup-dialog',
							'descriptionMember': 'ProjectName',
							'lookupOptions': {
								'initValueField': 'ProjectNo',
								'showClearButton': true,
								'filterKey': 'material-stock-project-filter'

							}
						}
					}
				},
				'projectstockfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'projectStockLookupDataService',
					enableCache: true,
					filter: function (item) {
						const prj = {PKey1: null, PKey2: null, PKey3: null};
						prj.PKey3 = item.ProjectFk || 0;
						return prj;
					}
				}, {required: true}),
				'stocklocationfk': platformLayoutHelperService.provideProjectStockLocationLookupOverload({'projectFk': 'ProjectFk',
					projectFkReadOnly: true, 'projectStockFk': 'ProjectStockFk', projectStockFkReadOnly: true}, null),
				/* basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectStockLocationLookupDataService',
							enableCache: true,
							filter: function (item) {
								var prj;
								if (item) {
									prj = item.ProjectStockFk;
								}
								return prj;
							}
						}) */
			},
			'addition': {
				grid: [
					{
						lookupDisplayColumn: true,
						id: 'projectName',
						field: 'ProjectFk',
						name: 'Project Name',
						name$tr$: 'cloud.common.entityProjectName',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'project',
							displayMember: 'ProjectName'
						},
						width: 100,
						grouping: {
							// title: translationGrid.initial,
							title$tr$: 'cloud.common.entityProjectName',
							getter: 'ProjectFk',
							aggregators: [],
							aggregateCollapsed: true
						}
					}
				]
			}
		};
	}

	angular.module(moduleName).factory('basicsMaterialStockUIStandardService', basicsMaterialStockUIStandardService);
	basicsMaterialStockUIStandardService.$inject = ['platformUIStandardConfigService', 'platformSchemaService', 'basicsMaterialStockLayout',
		'basicsMaterialTranslationService', 'platformUIStandardExtentService'];
	function basicsMaterialStockUIStandardService(platformUIStandardConfigService, platformSchemaService, basicsMaterialStockLayout,
		basicsMaterialTranslationService, platformUIStandardExtentService) {
		var BaseService = platformUIStandardConfigService;
		var domains = platformSchemaService.getSchemaFromCache({
			typeName: 'Material2ProjectStockDto',
			moduleSubModule: 'Basics.Material'
		}).properties;
		var service = new BaseService(basicsMaterialStockLayout, domains, basicsMaterialTranslationService);
		platformUIStandardExtentService.extend(service, basicsMaterialStockLayout.addition, domains);
		return service;
	}
})(angular);
