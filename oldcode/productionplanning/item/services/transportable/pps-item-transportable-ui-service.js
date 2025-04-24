(function (angular) {
	'use strict';
	/*global _*/
	var moduleName = 'productionplanning.item';
	angular.module(moduleName).factory('ppsItemTransportableUIStandardService', [
		'platformUIStandardConfigService', 'productionplanningCommonTranslationService',
		'ppsCommonTransportInfoHelperService', 'ppsItemTransportableLayout',
		'platformSchemaService', 'platformUIStandardExtentService',
		'ppsItemTransportableLayoutConfig','ppsCommonCustomColumnsServiceFactory',
		function (PlatformUIStandardConfigService, productionplanningCommonTranslationService,
					 ppsCommonTransportInfoHelperService, layout,
					 platformSchemaService, platformUIStandardExtentService,
					 ppsItemTransportableLayoutConfig,customColumnsServiceFactory) {
			var schema = platformSchemaService.getSchemaFromCache({ typeName: 'PpsItemTransportableDto', moduleSubModule: 'ProductionPlanning.Item' });
			let masterAttributeDomains = schema.properties;
			var customColumnsService = customColumnsServiceFactory.getService('productionplanning.common.product');
			_.merge(masterAttributeDomains, customColumnsService.attributes);
			var service = new PlatformUIStandardConfigService(layout, masterAttributeDomains, productionplanningCommonTranslationService);
			platformUIStandardExtentService.extend(service, ppsItemTransportableLayoutConfig.addition, masterAttributeDomains);
			return service;
		}
	]);

	angular.module(moduleName).factory('ppsItemTransportableLayout', [
		'platformLayoutHelperService', 'basicsLookupdataConfigGenerator',
		'basicsCommonUomDimensionFilterService', 'productionplanningCommonLayoutHelperService',
		'ppsCommonCustomColumnsServiceFactory',
		function (platformLayoutHelperService, basicsLookupdataConfigGenerator,
			uomDimensionFilter, ppsCommonLayoutHelperService,
			customColumnsServiceFactory) {

			function createOptionsForMCLookup(overLoad) {
				var lookupGridCfg = overLoad.grid;
				return{
					directive: !_.isNil(lookupGridCfg.editorOptions) ? (lookupGridCfg.editorOptions.lookupDirective || lookupGridCfg.editorOptions.directive) : undefined,
					options: !_.isNil(lookupGridCfg.editorOptions) ? lookupGridCfg.editorOptions.lookupOptions : undefined,
					formatter: lookupGridCfg.formatter,
					formatterOptions: lookupGridCfg.formatterOptions
				};
			}

			var statusLookupInfo = {
				product: { // lookup for product
					lookup: createOptionsForMCLookup(basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.ppsproductstatus', null, {
						showIcon: true,
						imageSelectorService: 'platformStatusSvgIconService',
						svgBackgroundColor: 'ProductStatusBackgroundColor',
						backgroundColorType: 'dec',
						backgroundColorLayer: [1, 2, 3, 4, 5, 6]
					})),
					column: 'ProductStatusFk'
				},
				bundle: { // lookup for bundle
					lookup: createOptionsForMCLookup(basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.transportbundlestatus', null, {
						showIcon: true
					})),
					column: 'BundleStatusFk'
				},
				upstreamItem: {
					lookup: createOptionsForMCLookup(basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.ppsupstreamstatus', null, {
						showIcon: true,
						imageSelectorService: 'platformStatusSvgIconService',
						svgBackgroundColor: 'UpstreamItemBackgroundColor',
						backgroundColorType: 'dec',
						backgroundColorLayer: [1, 2, 3, 4, 5, 6]
					})),
					column: 'UpstreamItemStatusFk'
				},
			};

			function getStatusLookupInfo(item) {
				if (item.ProductId) {
					return statusLookupInfo.product;
				} else if (item.BundleId) {
					return statusLookupInfo.bundle;
				} else if (item.UpstreamItemId) {
					return statusLookupInfo.upstreamItem;
				}
			}

			var config = {
				fid: 'productionplanning.item.transportableLayout',
				version: '1.0.0',
				showGrouping: true,
				addValidationAutomatically: true,
				groups: [
					{
						gid: 'baseGroup',
						attributes: ['statusid', 'code', 'descriptioninfo', 'projectid', 'lgmjobfk', 'trsrequisitionfk', 'trsrequisitiondate', 'length', 'basuomlengthfk', 'width', 'basuomwidthfk', 'height', 'basuomheightfk',
							'weight', 'basuomweightfk', 'lengthcalculated', 'widthcalculated', 'heightcalculated', 'weightcalculated', 'quantity', 'basuomfk', 'producttemplatecode', 'currentlocationjobfk', 'prjstockfk', 'prjstocklocationfk']
					}
				],
				overloads: {
					statusid: {
						grid: {
							formatter: 'dynamic',
							editor: 'dynamic',
							domain: function (item, column) {
								var info = getStatusLookupInfo(item);
								if (info) {
									column.editorOptions = {
										directive: 'pps-dynamic-grid-and-form-lookup',
										dependantField: 'IsProduct',
										lookupInfo: statusLookupInfo,
										isTextEditable: false,
										dynamicLookupMode: true,
										grid: true,
										showClearButton: true
									};
									column.formatterOptions = info.lookup.formatterOptions;
									if (!column.formatterOptions) {
										var prop = info.lookup.options;
										column.formatterOptions = {
											lookupSimpleLookup: prop.lookupSimpleLookup,
											lookupModuleQualifier: prop.lookupModuleQualifier,
											lookupType: prop.lookupType,
											valueMember: 'Id',
											displayMember: prop.displayMember,
											dataServiceName: prop.dataServiceName,
											version: prop.version,
											imageSelector: prop.imageSelector
										};
									}
								} else {
									column.editorOptions = null;
									column.formatterOptions = null;
								}
								return 'lookup';
							}
						},
						detail: {
							type: 'directive',
							directive: 'pps-dynamic-grid-and-form-lookup',
							options: {
								isTextEditable: false,
								dependantField: 'IsProduct',
								lookupInfo: statusLookupInfo,
								grid: false,
								dynamicLookupMode: true,
								showClearButton: false
							}
						},
						readonly: true
					},
					projectid: platformLayoutHelperService.provideProjectLookupOverload(),
					lgmjobfk: ppsCommonLayoutHelperService.provideJobExtensionLookupOverload({projectFk: 'ProjectId'}),
					trsrequisitionfk: {
						navigator: {
							moduleName: 'transportplanning.requisition'
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true,
									defaultFilter: {
										ProjectId: 'ProjectFk',
										ProjectIdReadOnly: true
									},
									filterKey: 'bundle-trsRequisition-filter'
								},
								directive: 'transportplanning-requisition-lookup-dialog'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'TrsRequisition',
								displayMember: 'Code',
								version: 3
							},
							width: 70
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupOptions: {
									showClearButton: true
								},
								lookupDirective: 'transportplanning-requisition-lookup-dialog',
								descriptionMember: 'DescriptionInfo.Translated'
							}
						}
					},
					basuomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsUnitLookupDataService',
						cacheEnable: true
					}),
					currentlocationjobfk: ppsCommonLayoutHelperService.provideJobExtensionLookupOverload({
						projectFk: 'ProjectFk',
						activeJob: true,
						jobType: 'external'
					}),
					prjstockfk: {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-site-stock-lookup-dialog',
								lookupOptions: {
									displayMember: 'Code',
									addGridColumns: [{
										id: 'Description',
										field: 'Description',
										name: 'Description',
										formatter: 'description',
										name$tr$: 'cloud.common.entityDescription',
										width: 200
									}],
									additionalColumns: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ProjectStockNew',
								displayMember: 'Code',
								version: 3
							}
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ProjectStockNew',
								displayMember: 'Code',
								version: 3
							},
							options: {
								lookupDirective: 'basics-site-stock-lookup-dialog',
								descriptionMember: 'Description'
							}
						},
						readonly: true
					},
					prjstocklocationfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'projectStockLocationLookupDataService',
						enableCache: true,
						valMember: 'Id',
						dispMember: 'Code',
						filter: function (item) {
							return !_.isNil(item.PrjStockFk) ? item.PrjStockFk : undefined;
						},
						readonly: true
					}),
				}
			};

			function getUoMFilterKey(column) {
				var key;
				switch (column) {
					case 'basuomlengthfk':
					case 'basuomwidthfk':
					case 'basuomheightfk':
						key = uomDimensionFilter.registerLengthDimensionFilter(1);
						break;
					case 'basuomareafk':
						key = uomDimensionFilter.registerLengthDimensionFilter(2);
						break;
					case 'basuomvolumefk':
						key = uomDimensionFilter.registerLengthDimensionFilter(3);
						break;
					case 'basuomweightfk':
						key = uomDimensionFilter.registerMassDimensionFilter();
						break;
					case 'basuombillfk':
				}
				return key;
			}

			var attNames = ['basuomlengthfk', 'basuomwidthfk', 'basuomheightfk', 'basuomweightfk'];
			attNames.forEach(function (col) {
				config.overloads[col] = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					cacheEnable: true,
					filterKey: getUoMFilterKey(col)
				});
			});

			// set all columns readonly
			config.groups[0].attributes.forEach(function (attr) {
				if(config.overloads[attr]) {
					config.overloads[attr].readonly = true;
				} else {
					config.overloads[attr] ={ readonly: true };
				}
			});

			var customColumnsService = customColumnsServiceFactory.getService('productionplanning.common.product');
			customColumnsService.setEventTypeConfig(config, 'productionplanning.common.product.event');

			return config;
		}
	]);

	angular.module(moduleName).factory('ppsItemTransportableLayoutConfig', [
		'platformObjectHelper', 'ppsCommonTransportInfoHelperService',
		function (platformObjectHelper, ppsCommonTransportInfoHelperService) {
			var trsColumns = {
				grid: [],
				detail: []
			};
			ppsCommonTransportInfoHelperService.addAdditionUiConfiguration(trsColumns);
			return {
				addition: {
					grid: platformObjectHelper.extendGrouping(trsColumns.grid),
					detail: trsColumns.detail
				}
			};
		}
	]);
})(angular);
