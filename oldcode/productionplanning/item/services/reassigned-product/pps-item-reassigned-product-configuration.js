(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('productionplanningItemReassignedProductLayout', ReassignedProductLayout);
	ReassignedProductLayout.$inject = ['basicsLookupdataConfigGenerator', 'basicsCommonUomDimensionFilterService'];
	function ReassignedProductLayout(basicsLookupdataConfigGenerator, uomDimensionFilter) {
		function createOverloads() {
			let ols = {
				code: { readonly: true },
				descriptioninfo: { readonly: true },
				statusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.ppsproductstatus', null, {
					showIcon: true,
					imageSelectorService: 'platformStatusSvgIconService',
					svgBackgroundColor: 'BackgroundColor',
					backgroundColorType: 'dec',
					backgroundColorLayer: [1, 2, 3, 4, 5, 6]
				}),
				materialgroupfk: {
					readonly: true,
					grid:{
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialGroup',
							displayMember: 'Code'
						}
					}
				},
				materialfk: {
					readonly: true,
					grid:{
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialRecord',
							displayMember: 'Code'
						}
					}
				},
				length: {
					readonly: true,
					disallowNegative: true,
					bulkSupport: false,
					formatter: 'convert',
					nameExtension: 'uom'
				},
				width: {
					readonly: true,
					disallowNegative: true,
					formatter: 'convert',
					nameExtension: 'uom',
					bulkSupport: false
				},
				height: {
					readonly: true,
					disallowNegative: true,
					formatter: 'convert',
					nameExtension: 'uom',
					bulkSupport: false
				},
				weight: {
					readonly: true,
					disallowNegative: true,
					formatter: 'convert',
					nameExtension: 'uom'
				},
				weight2: {
					readonly: true,
					disallowNegative: true,
					formatter: 'convert',
					nameExtension: 'uom'
				},
				weight3: {
					readonly: true,
					disallowNegative: true,
					formatter: 'convert',
					nameExtension: 'uom'
				},
				actualweight: {
					readonly: true,
					disallowNegative: true,
					formatter: 'convert',
					nameExtension: 'uom'
				},
				area: {
					readonly: true,
					disallowNegative: true,
					formatter: 'convert',
					nameExtension: 'uom'
				},
				area2: {
					readonly: true,
					disallowNegative: true,
					formatter: 'convert',
					nameExtension: 'uom'
				},
				area3: {
					readonly: true,
					disallowNegative: true,
					formatter: 'convert',
					nameExtension: 'uom'
				},
				ppsstrandpatternfk: {
					readonly: true,
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PpsStrandPattern',
							displayMember: 'Code',
							version: 3
						},
						editor: 'lookup',
						editorOptions: {
							lookupDirective: 'productionplanning-strandpattern-lookup',
							lookupOptions: {
								displayMember: 'Code',
								filterKey: 'pps-common-product-strand-pattern-filter',
							}
						}
					}
				},
				billquantity:{readonly: true},
				planquantity:{readonly: true},
				volume:{readonly: true},
				volume2:{readonly: true},
				volume3:{readonly: true},
				isolationvolume:{readonly: true},
				concretevolume:{readonly: true},
				userdefined1:{readonly: true},
				userdefined2:{readonly: true},
				userdefined3:{readonly: true},
				userdefined4:{readonly: true},
				userdefined5:{readonly: true},
			};
			let attNames = ['basuomlengthfk', 'basuomwidthfk', 'basuomheightfk', 'basuomweightfk', 'basuomareafk', 'basuombillfk', 'basuomplanfk', 'basuomvolumefk'];
			attNames.forEach(function (col) {
				ols[col] = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					cacheEnable: true,
					filterKey: getUoMFilterKey(col),
					readonly: true,
				});
			});
			return ols;
		}

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

		return {
			'fid': 'productionplanning.item.reassignedProductLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'groups': [{
				gid: 'baseGroup',
				attributes: ['code', 'descriptioninfo', 'statusfk', 'materialgroupfk', 'materialfk', 'ppsstrandpatternfk', 'actualweight', 'isolationvolume', 'concretevolume', 'volume', 'volume2', 'volume3', 'basuomvolumefk', 'weight', 'weight2', 'weight3', 'area', 'area2', 'area3', 'planquantity', 'basuomplanfk', 'billquantity', 'basuombillfk', 'basuomlengthfk', 'basuomwidthfk', 'basuomheightfk', 'basuomweightfk', 'basuomareafk', 'length', 'width', 'height']
			},
			{
				gid: 'userDefTextGroup',
				isUserDefText: true,
				attCount: 5,
				attName: 'userdefined',
				noInfix: true,
				readonly: true,
			},],
			'overloads': createOverloads()
		};
	}
})(angular);
