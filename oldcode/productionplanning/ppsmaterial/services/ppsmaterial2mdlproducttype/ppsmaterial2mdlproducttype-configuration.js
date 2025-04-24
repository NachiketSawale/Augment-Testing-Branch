/**
 * Created by zwz on 2024/5/22.
 */
(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.ppsmaterial';

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

	angular.module(moduleName).value('ppsMaterialToMdlProductTypeLayoutConfig', {
		'addition': {
			'grid': extendGrouping([])
		}
	});

	//master Layout
	angular.module(moduleName).factory('ppsMaterialToMdlProductTypeLayout', PpsMaterialToMdlProductTypeLayout);
	PpsMaterialToMdlProductTypeLayout.$inject = ['basicsLookupdataConfigGenerator', '$translate'];

	function PpsMaterialToMdlProductTypeLayout(basicsLookupdataConfigGenerator, $translate) {
		function getProductionModeFormatOptions() {
			return {
				items: [
					{ id: 'MP', description: $translate.instant('productionplanning.ppsmaterial.ppsMaterialToMdlProductType.manualProduction') },
					{ id: 'AP', description: $translate.instant('productionplanning.ppsmaterial.ppsMaterialToMdlProductType.autoProduction') },
				],
				valueMember: 'id',
				displayMember: 'description'
			};
		}

		return {
			'fid': 'productionplanning.ppsmaterial.ppsMaterialToMdlProductTypeLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'basicData',
					attributes: [
						'description', 'ppsmaterialfk', 'productcategory', 'producttype', 'productionmode', 'islive'
					]
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'translationInfos': {
				extraModules: [moduleName],
				extraWords: {
					Description: { location: moduleName, identifier: 'ppsMaterialToMdlProductType.description', initial: '*3D Object Type' },
				}
			},
			'overloads': {
				ppsmaterialfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'ppsmaterialLookupDataService',
					cacheEnable: true
				}),
				productionmode: {
					readonly: true,
					grid: {
						formatter: 'select',
						formatterOptions: getProductionModeFormatOptions(),
						editor: 'select',
						editorOptions: getProductionModeFormatOptions()
					}
				},

			}
		};
	}

})(angular);