(function (angular) {
	'use strict';
	/* global angular */
	var moduleName = 'productionplanning.processconfiguration';

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

	angular.module(moduleName).value('phaseReqTemplateLayoutConfig', {
		'addition': {
			'grid': extendGrouping([])
		}
	});

	// master Layout
	angular.module(moduleName).factory('phaseReqTemplateLayout', phaseReqTemplateLayout);
	phaseReqTemplateLayout.$inject = ['basicsLookupdataConfigGenerator', 'upstreamGoodsTypes'];
	function phaseReqTemplateLayout(basicsLookupdataConfigGenerator, upstreamGoodsTypes) {

		var upstreamGoodsLookupOptions = {
			showClearButton: false,
			events: [
				{
					name: 'onSelectedItemChanged',
					handler: function (e, args) {
						args.entity.selectedUpstreamGoods = args.selectedItem;
						if (!args.selectedItem){
							clearAllGoods(args.entity);
						}
					}
				}
			]
		};

		return {
			'fid': 'productionplanning.processconfiguration.phaseReqTemplateLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'change': 'onPropertyChange',
			'groups': [
				{
					gid: 'baseGroup',
					attributes: ['upstreamgoodstypefk', 'upstreamgoods', 'quantity', 'basuomfk', 'commenttext']
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
			'overloads': {
				upstreamgoodstypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.ppsupstreamgoodstype', null,
					{
						filterKey: 'ppsreqtemplate-upstream-goodtype-filter',
						events: [{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								clearAllGoods(args.entity);
							}
						}]
					}),
				upstreamgoods:{
					detail: {
						type: 'directive',
						directive: 'dynamic-grid-and-form-lookup',
						options: {
							isTextEditable: false,
							dependantField: 'UpstreamGoodsTypeFk',
							lookupInfo: upstreamGoodsTypes.lookupInfo,
							grid: false,
							dynamicLookupMode: true,
							showClearButton: false,
							lookupOptions: upstreamGoodsLookupOptions
						}
					},
					grid: {
						formatter: 'dynamic',
						editor: 'dynamic',
						domain: function (item, column) {
							var prop = upstreamGoodsTypes.lookupInfo[item.UpstreamGoodsTypeFk];
							if (prop && prop.column) {
								column.editorOptions = {
									directive: prop.lookup.options.lookupDirective,
									lookupOptions: upstreamGoodsLookupOptions
								};
								column.formatterOptions = prop.lookup.formatterOptions;
							} else {
								column.editorOptions = null;
								column.formatterOptions = null;
							}
							return 'lookup';
						}
					}
				},
				basuomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					cacheEnable: true,
					showClearButton: true
				})
			}
		};

		function clearAllGoods(entity) {
			if(entity){
				entity.PpsFormworkTypeFk =
					entity.PpsProcessTemplateFk =
						entity.MdcMaterialFk =
							entity.RequirementGoods =
								entity.MdcCostCodeFk =
									entity.MdcCostCodeTtFk = undefined;
			}
		}
	}
})(angular);