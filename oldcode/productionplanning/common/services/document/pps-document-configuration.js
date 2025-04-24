/**
 * Created by anl on 1/4/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';

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

	angular.module(moduleName).value('productionplanningCommonDocumentExtendLayout', {
		addition: {
			grid: extendGrouping([])
		}
	});

	//master Layout
	angular.module(moduleName).factory('productionplanningCommonDocumentLayout', ProductionplanningCommonDocumentLayout);
	ProductionplanningCommonDocumentLayout.$inject = ['basicsLookupdataConfigGenerator', 'ppsCommonGenericDocumentFromValuesHelper'];
	function ProductionplanningCommonDocumentLayout(basicsLookupdataConfigGenerator, ppsCommonGenericDocumentFromValuesHelper) {
		const fieldOriginSelectOptions = {
			items: ppsCommonGenericDocumentFromValuesHelper.translatedFromValues,
			valueMember: 'id',
			displayMember: 'description'
		};

		return {
			'fid': 'productionplanning.common.documentlayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'basic',
					attributes: ['documenttypefk', 'description', 'originfilename', 'commenttext', 'ppsdocumenttypefk']
				},
				{
					gid: 'binding',
					attributes: ['ppsitemfk', 'productdescriptionfk', 'engdrawingfk', 'mntactivityfk', 'mntreportfk']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'overloads': {
				documenttypefk: {
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-lookupdata-table-document-type-combobox'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'documentType',
							displayMember: 'Description'
						},
						width: 120
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-lookupdata-table-document-type-combobox',
							descriptionMember: 'Description'
						}
					}
				},
				mntactivityfk: {
					navigator: {
						moduleName: 'productionplanning.mounting'
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'productionplanning-activity-lookup-new-directive'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MntActivity',
							displayMember: 'Code',
							version: 3
						},
						width: 120
					}
				},
				mntreportfk: {
					navigator: {
						moduleName: 'productionplanning.mounting'
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'productionplanning-mounting-report-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MntReport',
							displayMember: 'Code'
						},
						width: 120
					}
				},
				ppsitemfk: {
					navigator: {
						moduleName: 'productionplanning.item'
					},
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PPSItem',
							displayMember: 'Code',
							version: 3
						},
						editor: 'lookup',
						editorOptions: {
							lookupField: 'ItemFk',
							directive: 'productionplanning-item-item-lookup-dialog',
							displayMember: 'Code'
						},
						width: 90
					}
				},
				productdescriptionfk: {
					navigator: {
						moduleName: 'productionplanning.producttemplate'
					},
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PPSProductDescription',
							displayMember: 'Code',
							version: 3
						},
						editor: 'lookup',
						editorOptions: {
							lookupField: 'ProductDescriptionFk',
							directive: 'productionplanning-producttemplate-product-description-lookup',
							displayMember: 'Code'
						},
						width: 90
					},
					detail: {
						type: 'directive',
						directive: 'productionplanning-producttemplate-product-description-lookup',
						options: {
							lookupDirective: 'productionplanning-producttemplate-product-description-lookup',
							descriptionMember: 'Description'
						},
					}
				},
				engdrawingfk: {
					navigator: {
						moduleName: 'productionplanning.drawing'
					},
					grid: {
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							directive: 'productionplanning-drawing-lookup',
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
				originfilename: {
					readonly: true
				},
				ppsdocumenttypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.ppsdocumenttype', null, {showIcon: false})
			},
			'addition': {
				'grid': [{
					id: 'origin',
					field: 'Origin',
					name: '*Origin',
					name$tr$: 'productionplanning.common.document.origin',
					formatter: 'select',
					formatterOptions: fieldOriginSelectOptions,
					editor: 'select',
					editorOptions: fieldOriginSelectOptions
				}, {
					id: 'belonging',
					field: 'Belonging',
					name: '*Belonging',
					name$tr$: 'productionplanning.common.document.belonging',
					readonly: true,
					formatter: 'image',
					formatterOptions: {
						imageSelector: 'ppsDocumentIconService',
						tooltip: true
					}
				}],
				'detail': []
			}

		};
	}

})(angular);