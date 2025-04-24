(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.ppsmaterial';

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

	angular.module(moduleName).value('productionplanningPpsMaterialProductDescLayoutConfig', {
		'addition': {
			'grid': extendGrouping([])
		}
	});

	//master Layout
	angular.module(moduleName).factory('productionplanningPpsMaterialProductDescLayout', productionplanningPpsMaterialProductDescLayout);
	productionplanningPpsMaterialProductDescLayout.$inject = ['basicsLookupdataConfigGenerator', 'basicsCommonUomDimensionFilterService'];

	function productionplanningPpsMaterialProductDescLayout(basicsLookupdataConfigGenerator, uomDimensionFilter) {

		function createOverloads() {
			var ols = {
				'code': {
					grid:{
						sortOptions: {
							numeric: true
						}
					}
				},
				'length': {
					disallowNegative: true
				},
				'width': {
					disallowNegative: true
				},
				'height': {
					disallowNegative: true
				},
				'weight': {
					disallowNegative: true
				},
				'area': {
					disallowNegative: true
				},
				'engdrawingfk': {
					navigator: {
						moduleName: 'productionplanning.drawing'
					},
					grid: {
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							directive: 'productionplanning-drawing-dialog-lookup',
							lookupOptions: {
								displayMember: 'Code'
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							version: 3,
							lookupType: 'EngDrawing',
							displayMember: 'Code'
						},
						width: 70
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'productionplanning-drawing-dialog-lookup',
							descriptionMember: 'Description'
						}
					}
				},
				processtemplatefk: {
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'ProcessTemplate',
							displayMember: 'DescriptionInfo.Translated',
							version: 3
						},
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								showClearButton: true
							},
							directive: 'pps-process-configuration-process-template-dialog-lookup'
						},
						width: 100
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {showClearButton: true},
							lookupDirective: 'pps-process-configuration-process-template-dialog-lookup',
						}
					}
				},
				ppsformulainstancefk: {
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PpsFormulaInstance',
							displayMember: 'DescriptionInfo.Translated',
							version: 3
						},
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							directive: 'productionplanning-formula-configuration-instance-lookup',
							lookupOptions: {showclearButton: true}
						},
						width: 100
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {showclearButton: true},
							lookupDirective: 'productionplanning-formula-configuration-instance-lookup',
							descriptionMember: 'DescriptionInfo.Translated'
						}
					}
				}
			};
			var attNames = ['uomfk', 'basuomlengthfk', 'basuomwidthfk', 'basuomheightfk', 'basuomweightfk', 'basuomareafk', 'basuomvolumefk'];
			attNames.forEach(function (col) {
				ols[col] = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					cacheEnable: true,
					filterKey: getUoMFilterKey(col)
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
			}
			return key;
		}

		return {
			'fid': 'productionplanning.ppsmaterial.ppsMaterialProductDescLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'basicData',
					attributes: [
						'code', 'uomfk', 'descriptioninfo', 'isdefault', 'engdrawingfk', 'islive', 'processtemplatefk', 'ppsformulainstancefk'
					]
				},
				{
					gid: 'dimensions',
					attributes: [
						'length', 'basuomlengthfk', 'width', 'basuomwidthfk', 'height', 'basuomheightfk',
						'area', 'area2', 'area3', 'basuomareafk', 'volume', 'volume2', 'volume3', 'basuomvolumefk'
					]
				},
				{
					gid: 'propertiesGroup',
					attributes: [
						'isolationvolume', 'concretevolume', 'concretequality', 'weight', 'weight2', 'weight3', 'basuomweightfk'
					]
				},
				{
					gid: 'userDefTextGroup',
					isUserDefText: true,
					attCount: 5,
					attName: 'userdefined',
					noInfix: true
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'overloads': createOverloads()
		};
	}

})(angular);