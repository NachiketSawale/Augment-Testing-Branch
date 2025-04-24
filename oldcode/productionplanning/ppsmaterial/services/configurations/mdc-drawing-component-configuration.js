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

    angular.module(moduleName).factory('mdcDrawingComponentLayoutConfig', ['drawingComponentTypes', function (drawingComponentTypes) {
    	return {
	      'addition': {
		      'grid': extendGrouping([{
			      afterId: 'mdcmaterialcostcodefk',
			      id: 'materialCostcodeDes',
			      field: 'MdcMaterialCostCodeFk',
			      name: '*Component Description',
			      name$tr$: 'productionplanning.drawing.drawingComponent.materialCostCodeDes',
			      formatter: 'dynamic',
			      domain: function domain(item, column) {
				      var domain = 'lookup';
				      var prop = drawingComponentTypes.properties[item.EngDrwCompTypeFk];
				      if (prop) {
					      column.formatterOptions = {
						      lookupType: prop.lookupType,
						      displayMember: prop.descriptionPropertyName,
						      version: prop.version
					      };
				      }
				      else {
					      column.formatterOptions = null;
				      }
				      return domain;
			      },
			      editor: null,
		      },{
			      afterId: 'materialCostcodeDes',
			      id: 'materialGroup',
			      field: 'MdcMaterialCostCodeFk',
			      name: '*Material Group',
			      name$tr$: 'productionplanning.drawing.drawingComponent.materialGroup',
			      formatter: 'dynamic',
			      domain: function domain(item, column) {
				      var domain = 'lookup';
				      var prop = drawingComponentTypes.properties[item.EngDrwCompTypeFk];
				      if (prop) {
					      column.formatterOptions = {
						      lookupType: prop.lookupType,
						      displayMember: prop.materialGroupPropertyName,
					      };
				      }
				      else {
					      column.formatterOptions = null;
				      }
				      return domain;
			      },
			      editor: null,
		      },{
			      afterId: 'materialGroup',
			      id: 'materialCatalog',
			      field: 'MdcMaterialCostCodeFk',
			      name: '*Material Catalog',
			      name$tr$: 'productionplanning.drawing.drawingComponent.materialCatalog',
			      formatter: 'dynamic',
			      domain: function domain(item, column) {
				      var domain = 'lookup';
				      var prop = drawingComponentTypes.properties[item.EngDrwCompTypeFk];
				      if (prop) {
					      column.formatterOptions = {
						      lookupType: prop.lookupType,
						      displayMember: prop.materialCatalogPropertyName,
					      };
				      }
				      else {
					      column.formatterOptions = null;
				      }
				      return domain;
			      },
			      editor: null,
		      }])
	      }
      };
    }]);

    //master Layout
    angular.module(moduleName).factory('mdcDrawingComponentLayout', mdcDrawingComponentLayout);
	mdcDrawingComponentLayout.$inject = ['basicsLookupdataConfigGenerator', 'drawingComponentTypes', 'basicsLookupdataLookupFilterService'];
    function mdcDrawingComponentLayout(basicsLookupdataConfigGenerator, drawingComponentTypes, basicsLookupdataLookupFilterService) {

	    var filters = [{
		    key: 'ppsMaterial-mdcDrawingComponent-engdrwcomptypefk-filter',
		    fn: function (item) {
			    return item.Id === drawingComponentTypes.Material || item.Id === drawingComponentTypes.CostCode;
		    }
	    }];
	    basicsLookupdataLookupFilterService.registerFilter(filters);

	    var mcOverLoads = {
		    'mdcmaterialfk': {
			    navigator: {
				    moduleName: 'basics.material'
			    },
			    grid: {
				    formatter: 'lookup',
				    formatterOptions: {
					    lookupType: 'MaterialCommodity',
					    displayMember: 'Code'
				    },
				    editor: 'lookup',
				    editorOptions: {
					    lookupOptions: {
						    showClearButton: true,
						    gridOptions: {
							    disableCreateSimilarBtn: true
						    },
						    events: [
							    {
								    name: 'onSelectedItemChanged',
								    handler: function (e, args) {
									    args.entity.Uom3Fk = args.entity.Uom2Fk = args.entity.UomFk = args.selectedItem.BasUomFk;
									    args.entity.Description = args.selectedItem.DescriptionInfo.Translated;
								    }
							    }
						    ]
					    },
					    directive: 'basics-material-material-lookup'
				    },
				    width: 100
			    },
			    detail: {
				    type: 'directive',
				    directive: 'basics-material-material-lookup',
				    options: {
					    lookupOptions: {
						    showClearButton: true,
						    gridOptions: {
							    disableCreateSimilarBtn: true
						    },
						    events: [
							    {
								    name: 'onSelectedItemChanged',
								    handler: function (e, args) {
									    args.entity.Uom3Fk = args.entity.Uom2Fk = args.entity.UomFk = args.selectedItem.BasUomFk;
									    args.entity.Description = args.selectedItem.DescriptionInfo.Translated;
								    }
							    }
						    ]
					    },
					    lookupDirective: 'basics-material-material-lookup',
					    descriptionMember: 'DescriptionInfo.Translated'
				    }
			    }
		    },
		    'mdccostcodefk': {
			    grid: {
				    formatter: 'lookup',
				    formatterOptions: {
					    lookupType: 'costcode',
					    displayMember: 'Code',
					    version: 3
				    },
				    editor: 'lookup',
				    editorOptions: {
					    lookupField: 'CostCodeFk',
					    lookupOptions: {
						    showClearButton: true,
						    events: [
							    {
								    name: 'onSelectedItemChanged',
								    handler: function (e, args) {
									    args.entity.Uom3Fk = args.entity.Uom2Fk = args.entity.UomFk = args.selectedItem.UomFk;
									    args.entity.Description = args.selectedItem.DescriptionInfo.Translated;
								    }
							    }
						    ]
					    },
					    directive: 'basics-cost-codes-lookup'
				    }
			    },
			    detail: {
				    type: 'directive',
				    directive: 'basics-cost-codes-lookup',
				    options: {
					    lookupOptions: {
						    showClearButton: true,
						    events: [
							    {
								    name: 'onSelectedItemChanged',
								    handler: function (e, args) {
									    args.entity.Uom3Fk = args.entity.Uom2Fk = args.entity.UomFk = args.selectedItem.UomFk;
									    args.entity.Description = args.selectedItem.DescriptionInfo.Translated;
								    }
							    }
						    ]
					    }
				    }
			    }
		    }
	    };

	    var mcLookupInfo = {};
	    mcLookupInfo[1] = {lookup: createOptionsForMCLookup(mcOverLoads, 'mdcmaterialfk'), column: 'MdcMaterialCostCodeFk'}; // material, componentType===1
	    mcLookupInfo[2] = {lookup: createOptionsForMCLookup(mcOverLoads, 'mdccostcodefk'), column: 'MdcMaterialCostCodeFk'}; // costcode, componentType===2
	    mcLookupInfo[99999999] = {column: 'MdcMaterialCostCodeFk'}; // add a "empty" lookupInfo, just a temporary solution for fixing validation issue of MdcMaterialCostCodeFk. It's relative to special behavior about dynamic lookup in function doApply() in lookup-input-base.js (by zwz on 2022/11/28 for ticket #136944)

	    function createOptionsForMCLookup(overLoads, propName) {
		    var lookupGridCfg = overLoads[propName].grid;
		    return{
			    directive: lookupGridCfg.editorOptions.lookupDirective || lookupGridCfg.editorOptions.directive,
			    options: lookupGridCfg.editorOptions.lookupOptions,
			    formatter: lookupGridCfg.formatter,
			    formatterOptions: lookupGridCfg.formatterOptions
		    };
	    }
        return {
            'fid': 'productionplanning.ppsmaterial.mdcDrawingComponentLayout',
            'version': '1.0.0',
            'showGrouping': true,
            'addValidationAutomatically': true,
            'groups': [
                {
                    gid: 'basicData',
                    attributes: [
	                    'description', 'engdrwcomptypefk', 'mdcmaterialcostcodefk', 'remark', 'islive','sorting','autogenerated'
                    ]
                },
	            {
		            gid: 'Quantities',
		            attributes: ['quantity', 'uomfk', 'quantity2', 'uom2fk', 'quantity3', 'uom3fk', 'billingquantity', 'basuombillfk']
	            },
	            {
		            gid: 'userDefTextGroup',
		            isUserDefText: true,
		            attCount: 5,
		            attName: 'userdefined',
		            noInfix: true
	            }
            ],
            'overloads': {
	            'engdrwcomptypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.engineeringdrawingcomponenttype',
		            null,
		            {
			            filterKey: 'ppsMaterial-mdcDrawingComponent-engdrwcomptypefk-filter',
			            showIcon: true
		            }),
	            'mdcmaterialcostcodefk': {
		            detail: {
			            type: 'directive',
			            directive: 'pps-dynamic-grid-and-form-lookup',
			            options: {
				            isTextEditable: false,
				            dependantField: 'EngDrwCompTypeFk',
				            lookupInfo: mcLookupInfo,
				            grid: false,
				            dynamicLookupMode: true,
				            showClearButton: false
			            }
		            },
		            grid:{
			            editor: 'dynamic',
			            formatter: 'dynamic',
			            domain: function (item, column, flag) {
				            var info = item.EngDrwCompTypeFk ? mcLookupInfo[item.EngDrwCompTypeFk] : undefined;
				            if (info) {
					            column.editorOptions = {
						            directive: 'pps-dynamic-grid-and-form-lookup',
						            dependantField: 'EngDrwCompTypeFk',
						            lookupInfo: mcLookupInfo,
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
					            column.editorOptions = {readonly: true};
					            column.formatterOptions = null;
				            }

				            return flag ? 'directive' : 'lookup';
			            }
		            }
	            },
	            'uomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
		            dataServiceName: 'basicsUnitLookupDataService',
		            filterKey: '',
		            cacheEnable: true
	            }),
	            'basuombillfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
		            dataServiceName: 'basicsUnitLookupDataService',
		            filterKey: '',
		            cacheEnable: true
	            }),
	            'islive': {readonly: true},
	            uom2fk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
		            dataServiceName: 'basicsUnitLookupDataService',
		            filterKey: '',
		            cacheEnable: true
	            }),
	            uom3fk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
		            dataServiceName: 'basicsUnitLookupDataService',
		            filterKey: '',
		            cacheEnable: true
	            })
            }
        };
    }
})(angular);