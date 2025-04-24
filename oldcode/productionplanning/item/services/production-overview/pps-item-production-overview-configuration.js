(function(angular) {
	'use strict';
	/*global globlas, _*/

	const moduleName = 'productionplanning.item';
	const module = angular.module(moduleName);
	module.factory('ppsItemProductionOverviewConfigurationService', ppsItemProductionOverviewConfigurationService);

	ppsItemProductionOverviewConfigurationService.$inject = ['basicsCommonUomDimensionFilterService', 'basicsLookupdataConfigGenerator'];

	function ppsItemProductionOverviewConfigurationService(basicsCommonUomDimensionFilterService, basicsLookupdataConfigGenerator) {
		const config = {
			fid: 'productionplanning.item.productionoverview.layout',
			version: '1.0.0',
			addValidationAutomatically: true,
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['statusfk', 'code', 'descriptioninfo', 'quantity', 'mdcmaterialfk', 'productdescriptionfk',
						'plannedproduction', 'planneddelivery', 'engdrawingfk', 'trsproductbundlefk',
						'length', 'basuomlengthfk', 'width', 'basuomwidthfk', 'height', 'basuomheightfk', 'weight', 'basuomweightfk']
				}
			],
			overloads: {
				statusfk: {
					grid: {
						formatter: 'dynamic',
						editor: 'dynamic',
						domain: function (item, column) {
							let info = statusLookupInfo[item.ParentId === null ? 'ppsItem' : 'product'];
							if (info) {
								column.formatterOptions = info.lookup.formatterOptions;
								if (!column.formatterOptions) {
									let prop = info.lookup.options;
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
								column.formatterOptions = null;
							}
							return 'lookup';
						}
					}
				},
				mdcmaterialfk: {
					grid:{
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialRecord',
							displayMember: 'Code'
						},
						width: 70
					}
				},
				productdescriptionfk: {
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PPSProductDescription',
							displayMember: 'Code',
							version: 3
						},
						width: 90
					}
				},
				engdrawingfk: {
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							version: 3,
							lookupType: 'EngDrawing',
							displayMember: 'Code'
						},
						width: 70
					}
				},
				trsproductbundlefk: {
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'TrsBundleLookup',
							displayMember: 'Code'
						},
						width: 70
					}
				}
			}
		};

		const attNames = ['basuomlengthfk', 'basuomwidthfk', 'basuomheightfk', 'basuomweightfk'];
		attNames.forEach((col) => {
			config.overloads[col] = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'basicsUnitLookupDataService',
				cacheEnable: true,
				filterKey: getUoMFilterKey(col)
			});
		});

		// Set all columns readonly
		config.groups[0].attributes.forEach(function (attr) {
			if(config.overloads[attr]) {
				config.overloads[attr].readonly = true;
			} else {
				config.overloads[attr] = { readonly: true };
			}
		});

		let statusLookupInfo = {
			ppsItem: {
				lookup: createOptionsForLookup(basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.ppsitemstatus', null, {
					showIcon: true,
					customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
					field: 'RubricCategoryFk',
					imageSelectorService: 'platformStatusSvgIconService',
					svgBackgroundColor: 'Backgroundcolor',
					backgroundColorType: 'dec',
					backgroundColorLayer: [1, 2, 3, 4, 5, 6]
				})),
				column: 'PPSItemStatusFk'
			},
			product: {
				lookup: createOptionsForLookup(basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.ppsproductstatus', null, {
					showIcon: true,
					imageSelectorService: 'platformStatusSvgIconService',
					svgBackgroundColor: 'BackgroundColor',
					backgroundColorType: 'dec',
					backgroundColorLayer: [1, 2, 3, 4, 5, 6]
				})),
				column: 'ProductStatusFk'
			}
		};

		function createOptionsForLookup(overLoad) {
			let lookupGridCfg = overLoad.grid;
			return{
				directive: !_.isNil(lookupGridCfg.editorOptions) ? (lookupGridCfg.editorOptions.lookupDirective || lookupGridCfg.editorOptions.directive) : undefined,
				options: !_.isNil(lookupGridCfg.editorOptions) ? lookupGridCfg.editorOptions.lookupOptions : undefined,
				formatter: lookupGridCfg.formatter,
				formatterOptions: lookupGridCfg.formatterOptions
			};
		}

		function getUoMFilterKey(column) {
			let key;
			switch (column) {
				case 'basuomlengthfk':
				case 'basuomwidthfk':
				case 'basuomheightfk':
					key = basicsCommonUomDimensionFilterService.registerLengthDimensionFilter(1);
					break;
				case 'basuomweightfk':
					key = basicsCommonUomDimensionFilterService.registerMassDimensionFilter();
					break;
			}
			return key;
		}

		return config;
	}
})(angular);