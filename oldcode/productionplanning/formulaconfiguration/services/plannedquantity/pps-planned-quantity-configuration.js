(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.formulaconfiguration';

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

	angular.module(moduleName).value('ppsPlannedQuantityLayoutConfig', {
		'addition': {
			'grid': extendGrouping([])
		}
	});

	// master Layout
	angular.module(moduleName).factory('ppsPlannedQuantityLayout', PpsPlannedQuantityLayout);
	PpsPlannedQuantityLayout.$inject = ['basicsLookupdataConfigGenerator', 'ppsPlannedQuantityTypeService', 'ppsPlannedQuantityResourceTypes'];

	function PpsPlannedQuantityLayout(basicsLookupdataConfigGenerator, ppsPlannedQuantityTypeService, ResourceTypes) {

		let QuantityTypes = ppsPlannedQuantityTypeService.getPlannedQuantityTypeConfig();

		var plannedQtyResourceLookupOption = {
			showClearButton: false,
			defaultFilter: {
				EstHeaderFk: 'EstHeaderFk',
				EstLineItemFk: 'EstLineItemFk',
			},
			events: [
				{
					name: 'onSelectedItemChanged',
					handler: function (e, args) {
						args.entity.selectedResource = args.selectedItem;
					}
				}
			]
		};

		var plannedQtyQuantityLookupOption = {
			showClearButton: false,
			events: [
				{
					name: 'onSelectedItemChanged',
					handler: function (e, args) {
						args.entity.selectedQuantity = args.selectedItem;
					}
				}
			]
		};

		return {
			'fid': 'productionplanning.formulaconfiguration.ppsPlannedQuantityLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'baseGroup',
					attributes: [
						'description', 'quantity', 'basuomfk', 'resourcetypefk', 'boqestitemresfk', 'boqheaderfk', 'ppsplannedquantitytypefk',
						'propertymaterialcostcodefk', 'commenttext', 'mdcproductdescriptionfk', 'prjlocationfk', 'duedate',
						'sourcecode1', 'sourcecode2','sourcecode3', 'internalprice', 'externalprice', 'reference', 'brief', 'basuombillfk', 'billingquantity', 'ischargeable'
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
			'overloads': {
				'propertymaterialcostcodefk': {
					detail: {
						type: 'directive',
						directive: 'pps-dynamic-grid-and-form-lookup',
						options: {
							isTextEditable: false,
							dependantField: 'PpsPlannedQuantityTypeFk',
							lookupInfo: QuantityTypes.lookupInfo,
							grid: false,
							dynamicLookupMode: true,
							showClearButton: false,
							lookupOptions: plannedQtyQuantityLookupOption
						}
					},
					grid: {
						maxLength: 252,
						editor: 'dynamic',
						formatter: 'dynamic',
						domain: function (item, column) {
							column.editorOptions = null;
							column.formatterOptions = null;
							let prop = item.PpsPlannedQuantityTypeFk ? QuantityTypes.lookupInfo[item.PpsPlannedQuantityTypeFk] : undefined;
							if (prop && prop.column) {
								column.editorOptions = {
									directive: prop.lookup.options.lookupDirective,
									lookupOptions: prop.lookup.options.lookupOptions === undefined ? plannedQtyQuantityLookupOption : prop.lookup.options.lookupOptions
								};
								column.formatterOptions = prop.lookup.formatterOptions;
							}
							else if(item.PpsPlannedQuantityTypeFk === 6){
								return 'description';
							}
							else {
								column.editorOptions = {readonly: true};
								column.formatterOptions = null;
							}
							return 'lookup';
						}
					}
				},
				'boqestitemresfk': {
					detail: {
						type: 'directive',
						directive: 'pps-second-dynamic-grid-and-form-lookup',
						options: {
							isTextEditable: false,
							dependantField: 'ResourceTypeFk',
							lookupInfo: ResourceTypes.lookupInfo,
							grid: false,
							dynamicLookupMode: true,
							showClearButton: false,
							lookupOptions: plannedQtyResourceLookupOption
						}
					},
					grid: {
						editor: 'dynamic',
						formatter: 'dynamic',
						domain: function (item, column) {

							var prop = !_.isNull(item) && item.ResourceTypeFk ? ResourceTypes.lookupInfo[item.ResourceTypeFk] : undefined;
							if (prop && prop.column) {
								column.editorOptions = {
									directive: prop.lookup.options.lookupDirective,
									lookupOptions: plannedQtyResourceLookupOption
								};
								column.formatterOptions = prop.lookup.formatterOptions;
							} else {
								column.editorOptions = {readonly: true};
								column.formatterOptions = null;
							}
							return 'lookup';
						}
					}
				},
				// estheaderfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				// dataServiceName: 'estimateMainHeaderLookupDataService',
				// moduleQualifier: 'estimateMainHeaderLookupDataService',
				// desMember: 'Code',
				// additionalColumns: true,
				// filter: function (item) {
				// return item && item.ProjectFk ? item.ProjectFk : -1;
				// },
				// navigator: {
				// moduleName: 'estimate.main'
				// }
				// }),
				'boqheaderfk': {
					readonly: true
				},
				'basuomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					filterKey: '',
					cacheEnable: true
				}),
				'basuombillfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					filterKey: '',
					cacheEnable: true
				}),
				'resourcetypefk': {
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'pps-planned-quantity-resource-type-lookup',
							descriptionMember: 'Code'
						}
					},
					grid: {
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							directive: 'pps-planned-quantity-resource-type-lookup',
							displayMember: 'Code',
						},
						formatter: 'lookup',
						formatterOptions: {
							version: 3,
							valueMember: 'Id',
							displayMember: 'Code',
							lookupType: 'ResourceTypes'
						},
					}
				},
				'ppsplannedquantitytypefk':basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.ppsplannedquantitytype', null, {
					showIcon: true
					// ,
					// events: [
					// 	{
					// 		name: 'onSelectedItemChanged',
					// 		handler: function (e, args) {
					// 			args.entity.PropertyMaterialCostcodeFk = undefined;
					// 		}
					// 	}
					// ]
				}),
				mdcproductdescriptionfk: {
					detail: {
						type: 'directive',
						directive: 'material-product-description-lookup',
						options: {
							displayMember: 'Code',
							filterKey: 'mdc-product-template-material-filter'
						}
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'material-product-description-lookup',
							lookupOptions: {
								filterKey: 'mdc-product-template-material-filter',
								displayMember: 'Code',
								showClearButton: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							displayMember: 'Code',
							lookupType: 'MDCProductDescriptionTiny'
						}
					}
				},
				prjlocationfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'projectLocationLookupDataService',
					additionalColumns: true,
					filter: function (item) {
						return item && item.ProjectFk ? item.ProjectFk : -1;
					},
					showClearButton: true
				})
			}
		};
	}
})(angular);