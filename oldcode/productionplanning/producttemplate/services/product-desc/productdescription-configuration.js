/**
 * Created by zwz on 5/6/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.producttemplate';

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

	//Layout Config
	angular.module(moduleName).value('productionplanningProducttemplateProductDescriptionLayoutConfig', {
		'addition': {
			'grid': extendGrouping([])
		}
	});

	//Layout
	angular.module(moduleName).factory('productionplanningProducttemplateProductDescriptionLayout', ProductDescriptionLayout);
	ProductDescriptionLayout.$inject = ['$injector', 'basicsLookupdataConfigGenerator', 'basicsCommonUomDimensionFilterService',
		'productionplanningCommonLayoutHelperService', 'basicsLookupdataLookupFilterService',
		'$translate'];

	function ProductDescriptionLayout($injector, basicsLookupdataConfigGenerator, uomDimensionFilter,
									  ppsCommonLayoutHelperService, basicsLookupdataLookupFilterService,
									  $translate) {

		var filters = [{
			key: 'productionplanning-drawing-stack-filter',
			fn: function (stack, productTemplate) {
				return stack.EngDrawingFk === productTemplate.EngDrawingFk;
			}
		},{
			key: 'pps-producttemplate-strand-pattern-filter',
			serverSide: true,
			fn: function (item) {
				var params = {};
				params.mdcMaterialId = item.MaterialFk;
				return params;
			}
		}];

		basicsLookupdataLookupFilterService.registerFilter(filters);

		function getIcon(iconUrl, titleStr) {
			return '<i class="pane-r block-image ' + iconUrl + (titleStr ? '" title="' + translate(titleStr) : '') + '"></i>';
		}

		function translate(str) {
			return $translate.instant(str);
		}

		function createOverloads() {
			var ols = {
				'code': {
					navigator: {
						moduleName: 'productionplanning.producttemplate'
					},
					grid:{
						sortOptions: {
							numeric: true
						}
					}
				},
				'engtaskfk': {
					navigator: {
						moduleName: 'productionplanning.engineering'
					},
					grid: {
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							directive: 'productionplanning-engineering-task-lookup',
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
								displayMember: 'Code'
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							version: 3,
							lookupType: 'EngTask',
							displayMember: 'Code'
						},
						width: 70
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'productionplanning-engineering-task-lookup',
							descriptionMember: 'Description'
						}
					}
				},
				'engdrawingfk': {
					navigator: {
						moduleName: 'productionplanning.drawing'
					},
					readonly: true,
					grid: {
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							directive: 'productionplanning-drawing-lookup',
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
							lookupDirective: 'productionplanning-drawing-lookup',
							descriptionMember: 'Description'
						}
					}
				},
				'materialfk': ppsCommonLayoutHelperService.provideMaterialLookupOverload(),
				'quantity': {
					disallowNegative: true
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
				'weight2': {
					disallowNegative: true
				},
				'weight3': {
					disallowNegative: true
				},
				'area': {
					disallowNegative: true
				},
				'area2': {
					disallowNegative: true
				},
				'area3': {
					disallowNegative: true
				},
				'stackcode': {readonly: true},
				'islive': {readonly: true},
				'sortcode': {readonly: true},
				'dbid': {
					formatter: function (row, cell, value, columnDef, dataContext, flag) {
						var format = '';
						if (dataContext.Version > 0) {
							format += flag ? '2' : getIcon('tlb-icons ico-db-delete', 'productionplanning.cadimport.delete');
						} else if (dataContext.DbId) {
							format += flag ? '3' : getIcon('tlb-icons ico-db', 'productionplanning.cadimport.existed');
						} else {
							format += flag ? '1' : getIcon('tlb-icons ico-db-new', 'productionplanning.cadimport.new');
						}
						if (dataContext.DocState) {
							format += flag ? '2' : getIcon('control-icons ico-folder-empty', 'productionplanning.cadimport.docOK');
						} else {
							format += flag ? '1' : getIcon('control-icons ico-folder-overlay1', 'productionplanning.cadimport.docMissing');
						}
						if (dataContext.InProduction) {
							format += flag ? '1' : getIcon('status-icons ico-status55', 'productionplanning.cadimport.inProduction');
						} else {
							format += flag ? '2' : '';
						}
						return format;
					}
				},
				'guid': {
					readonly: true
				},
				'ppsstrandpatternfk': {
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
								filterKey: 'pps-producttemplate-strand-pattern-filter',
							}
						}
					},
					detail: {
						type: 'directive',
						directive: 'productionplanning-strandpattern-lookup',
						options: {
							displayMember: 'Code',
							lookupOptions: {
								filterKey: 'pps-producttemplate-strand-pattern-filter'
							}
						}
					}
				},
				mdcproductdescriptionfk:{
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MDCProductDescriptionTiny',
							displayMember: 'Code',
							version: 3
						},
						editor: 'lookup',
						editorOptions: {
							lookupDirective: 'material-product-description-lookup',
							lookupOptions: {
								displayMember: 'Code'
							}
						}
					},
					detail: {
						type: 'directive',
						directive: 'material-product-description-lookup',
						options: {
							displayMember: 'Code'
						}
					}
				},
				ppsformulaversionfk: {
					readonly:true,
					grid: {
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							directive: 'pps-formula-configuration-version-combobox',
							displayMember: 'FormulaVersion',
						},
						formatter: 'lookup',
						formatterOptions: {
							version: 3,
							valueMember: 'Id',
							displayMember: 'FormulaVersion',
							lookupType: 'PpsFormulaVersion'
						},
					},
					detail: {
						type: 'directive',
						directive: 'pps-formula-configuration-version-combobox',
						options: {
							displayMember: 'FormulaVersion'
						}
					}
				},
				'installsequence': {
					readonly: true
				}
			};
			var attNames = ['uomfk', 'uomlengthfk', 'uomwidthfk', 'uomheightfk', 'uomweightfk', 'uomareafk', 'uombillfk', 'uomvolumefk'];
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
				case 'uomlengthfk':
				case 'uomwidthfk':
				case 'uomheightfk':
					key = uomDimensionFilter.registerLengthDimensionFilter(1);
					break;
				case 'uomareafk':
					key = uomDimensionFilter.registerLengthDimensionFilter(2);
					break;
				case 'uomvolumefk':
					key = uomDimensionFilter.registerLengthDimensionFilter(3);
					break;
				case 'uomweightfk':
					key = uomDimensionFilter.registerMassDimensionFilter();
					break;
			}
			return key;
		}

		return {
			'fid': 'productionplanning.producttemplate.productDescriptionLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'change': function (entity, field) {
				var dataServ = $injector.get('productionplanningProducttemplateMainService');
				dataServ.handleFieldChanged(entity, field);
			},
			'groups': [
				{
					gid: 'baseGroup',
					attributes: ['dbid', 'code', 'sortcode', 'descriptioninfo', 'engdrawingfk', 'engtaskfk', 'materialfk', 'quantity', 'uomfk',
						'billingquantity', 'uombillfk', 'stackcode', 'level', 'number4stack', 'number4plan', 'islive', 'ppsstrandpatternfk',
						'guid', 'installationsequence', 'mdcproductdescriptionfk', 'ppsformulaversionfk', 'installsequence']
				},
				{
					gid: 'dimensions',
					attributes: [
						'length', 'uomlengthfk', 'width', 'uomwidthfk', 'height', 'uomheightfk',
						'area', 'area2', 'area3', 'uomareafk', 'volume', 'volume2', 'volume3', 'uomvolumefk'
					]
				},
				{
					gid: 'propertiesGroup',
					attributes: [
						'isolationvolume', 'concretevolume', 'concretequality', 'weight', 'weight2', 'weight3', 'uomweightfk'
					]
				},
				{
					gid: 'userDefTextGroup',
					attributes: [
						'userdefined1',
						'userdefined2',
						'userdefined3',
						'userdefined4',
						'userdefined5',
						'userdefinedbymaterial1',
						'userdefinedbymaterial2',
						'userdefinedbymaterial3',
						'userdefinedbymaterial4',
						'userdefinedbymaterial5'
					]
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
