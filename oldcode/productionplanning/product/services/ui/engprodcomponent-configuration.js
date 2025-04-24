/**
 * Created by zwz on 12/16/2020.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.product';

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

	//EngProdComponent Layout
	angular.module(moduleName).value('productionplanningProductEngProdComponentLayoutConfig', {
		addition: {
			grid: extendGrouping([])
		}
	});

	angular.module(moduleName).factory('productionplanningProductEngProdComponentLayout', Layout);
	Layout.$inject = ['basicsLookupdataConfigGenerator',
		'basicsLookupdataLookupFilterService',
		'drawingComponentTypes',
		'$injector',
		'productionplanningProductEngProdComponentMdcMaterialCostCodeFkLookupConfigService'];
	function Layout(basicsLookupdataConfigGenerator,
		basicsLookupdataLookupFilterService,
		drawingComponentTypes,
		$injector,
		mdcMaterialCostCodeFkLookupConfigService) {
		// register lookup filters
		var filters = [{
			key: 'productionplanning-product-engProdComponent-engdrwcomptypefk-filter',
			fn: function (item) {
				return item.Id === drawingComponentTypes.Material || item.Id === drawingComponentTypes.CostCode || item.Id === drawingComponentTypes.Product;
			}
		}];
		_.each(filters, function (filter) {
			if (!basicsLookupdataLookupFilterService.hasFilter(filter.key)) {
				basicsLookupdataLookupFilterService.registerFilter(filter);
			}
		});

		var layout = {
			fid: 'productionplanning.product.engProdComponentLayout',
			version: '1.0.0',
			showGrouping: true,
			addValidationAutomatically: true,
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['description', 'engdrawingcomponentfk', 'engdrwcomptypefk', 'mdcmaterialcostcodeproductfk', 'engdrawingfk', 'prcstocktransactionfk', 'sorting', 'islive']
				},
				{
					gid: 'qtyGroup',
					attributes: ['quantity', 'basuomfk', 'quantity2', 'basuomqty2fk', 'quantity3', 'basuomqty3fk', 'billingquantity', 'basuombillfk']
				},
				{
					gid: 'actQtyGroup',
					attributes: ['actualquantity', 'basuomactqtyfk', 'actualquantity2', 'basuomactqty2fk', 'actualquantity3', 'basuomactqty3fk']
				},
				{
					gid: 'userDefTextGroup',
					isUserDefText: true,
					attCount: 5,
					attName: 'userdefined',
					noInfix: true
				},
				{
					gid: 'userFlagGroup',
					attributes: ['userflag1', 'userflag2']
				},
				{
					gid: 'reservedGroup',
					attributes: ['reserved1', 'reserved2']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			overloads: {
				engdrawingcomponentfk: {
					grid: {
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							directive: 'productionplanning-drawing-component-dialog-Lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'EngDrawingComponent',
							displayMember: 'Description',
							version: 3
						}
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'productionplanning-drawing-component-dialog-Lookup',
							descriptionMember: 'Description'
						}
					}
				},
				engdrwcomptypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.engineeringdrawingcomponenttype',
					null,
					{
						showIcon: true,
						filterKey: 'productionplanning-product-engProdComponent-engdrwcomptypefk-filter'
					}),
				mdcmaterialcostcodeproductfk: mdcMaterialCostCodeFkLookupConfigService.provideMdcMaterialCostCodeFkLookupConfig(),
				engdrawingfk: {
					navigator: {
						moduleName: 'productionplanning.drawing'
					},
					//readonly: true,
					grid: {
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							directive: 'productionplanning-drawing-dialog-lookup',
							lookupOptions: {
								additionalColumns: true,
								addGridColumns: [{
									id: 'Description',
									field: 'Description',
									name: 'Description',
									width: 300,
									formatter: 'description',
									name$tr$: 'cloud.common.entityDescription'
								}],
								displayMember: 'Code',
								//defaultFilter: { projectId: 'ProjectId', ppsItemId: 'PPSItemFk' }
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
							descriptionMember: 'Description',
							lookupOptions: {
								defaultFilter: { projectId: 'ProjectId', ppsItemId: 'PPSItemFk' }
							}
						}
					}
				},
				//boqitemdstfk: boqItemDstFkLookupConfigService.provideBoqItemDstFkLookupConfig(),
				prcstocktransactionfk: {
					readonly: true,
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'procument-pes-stock-transaction-lookup-diaglog'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PrcStocktransaction',
							displayMember: 'MaterialDescription'
						},
						width: 100
					},
					detail: {
						type: 'directive',
						directive: 'procument-pes-stock-transaction-lookup-diaglog'
					}
				}
			}
		};

		layout.overloads.basuomfk = layout.overloads.basuomqty2fk = layout.overloads.basuomqty3fk = layout.overloads.basuomactqtyfk = layout.overloads.basuomactqty2fk = layout.overloads.basuomactqty3fk = layout.overloads.basuombillfk =
			basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'basicsUnitLookupDataService',
				cacheEnable: true
			});

		return layout;
	}

})(angular);
