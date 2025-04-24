/**
 * Created by anl on 4/25/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.accounting';

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

	angular.module(moduleName).factory('productionplanningAccountingResultLayout', ResultLayout);
	ResultLayout.$inject = ['basicsLookupdataConfigGenerator', '_',
		'productionplanningAccountingResultDataService',
		'ComponentTypesResult'];

	function ResultLayout(basicsLookupdataConfigGenerator, _,
		resultService,
		componentTypesResult) {

		let characteristicLookupConfig = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
			dataServiceName: 'ppsCommonCharacteristicSimpleLookupDataService',
			filter: function (entity) {
				return Number('6' + entity.PpsEntityFk);
			},
			filterKey: 'basicsCharacteristicDataLookupFilter'
		});
		let characteristicLookupGridConfig = characteristicLookupConfig.grid;
		let characteristicLookupDetailConfig = characteristicLookupConfig.detail;

		return {
			'fid': 'productionplanning.accounting.resultlayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'baseGroup',
					attributes: ['description', 'componenttypefk', 'result', 'materialgroupfk', 'sorting', 'islive']
				},
				{
					gid: 'Formulas',
					attributes: ['quantityformula', 'uomfk', 'quantityformula2', 'uom2fk', 'quantityformula3', 'uom3fk']
				},
				{
					gid: 'updatePropertyGroup',
					attributes: ['updactive', 'ppsentityfk', 'property', 'overrideuom']
				},
				{
					gid: 'upstreamItemGroup',
					attributes: ['upstreamitemtarget', 'upstreamitemtemplatefk']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'overloads': {
				componenttypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.engineeringdrawingcomponenttype',
					'Description',
					{
						showIcon: true,
						events: [
							{
								name: 'onSelectedItemChanged',
								handler: function ComponentTypeChanged(e, args) {
									args.entity.selectedComponentType = args.selectedItem;
								}
							}],
						filterKey: 'ruleset-result-drawing-componenttype-filter',
					}),
				result: {
					detail: {
						type: 'directive',
						directive: 'productionplanning-accounting-result-select-control',
						options: {
							rid: 'result',
							model: 'Result'
						}
					},
					grid: {
						formatter: 'dynamic',
						editor: 'dynamic',
						domain: function (item, column) {
							var domain = 'lookup';// (see domainList in domain-service.js)
							var prop = componentTypesResult.properties[item.ComponentTypeFk];
							if (prop) {
								// domain = 'lookup';
								column.editorOptions = {
									directive: prop.directive,
									lookupOptions: {
										events: [
											{
												name: 'onSelectedItemChanged',
												handler: function (e, args) {
													_.forEach(componentTypesResult.properties, function (p) {
														args.entity[p.property] = null;
													});
													args.entity[prop.property] = args.selectedItem;
												}
											}
										]
									}
								};
								column.formatterOptions = {
									lookupType: prop.lookupType,
									displayMember: prop.displayMember
								};
								if (prop.version) {
									column.formatterOptions.version = prop.version;// for new lookup master api, the value of version should be greater than 2
								}
							} else {
								column.editorOptions = {readonly: true};
								column.formatterOptions = null;
							}
							return domain;
						}
					}
				},
				uomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					filterKey: '',
					cacheEnable: true
				}),
				uom2fk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					filterKey: '',
					cacheEnable: true
				}),
				uom3fk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					filterKey: '',
					cacheEnable: true
				}),
				ppsentityfk: {
					grid: {
						formatter: 'select',
						formatterOptions: {
							items: resultService.getPpsEntitySelections(),
							valueMember: 'Id',
							displayMember: 'Description'
						},
						editor: 'select',
						editorOptions: {
							items: resultService.getPpsEntitySelections(),
							valueMember: 'Id',
							displayMember: 'Description'
						}
					},
					detail: {
						type: 'select',
						options: {
							items: resultService.getPpsEntitySelections(),
							valueMember: 'Id',
							displayMember: 'Description'
						}
					}
				},
				property: {
					detail: {
						type: 'directive',
						directive: 'productionplanning-accounting-result-property-control',
						options: angular.extend(characteristicLookupDetailConfig.options.lookupOptions, {
							rid: 'property',
							model: 'Property'
						})
					},
					grid: {
						formatter: 'dynamic',
						editor: 'dynamic',
						domain: function (item, column) {
							let domain;
							if (item.PpsEntityFk === 14) {
								column.formatterOptions = {
									items: resultService.getPropertySelections(),
									valueMember: 'Id',
									displayMember: 'Description'
								};
								column.editorOptions = {
									items: resultService.getPropertySelections(),
									valueMember: 'Id',
									displayMember: 'Description'
								};
								domain = 'select';
							} else if (item.PpsEntityFk === 1 || item.PpsEntityFk === 2) {
								column.formatterOptions = characteristicLookupGridConfig.formatterOptions;
								column.editorOptions = {
									directive: characteristicLookupGridConfig.editorOptions.lookupDirective || characteristicLookupGridConfig.editorOptions.directive,
									lookupOptions: characteristicLookupGridConfig.editorOptions.lookupOptions
								};
								domain = 'lookup';
							}
							return domain || 'description';
						}
					},
				},
				materialgroupfk: {
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-material-material-group-lookup',
							descriptionMember: 'DescriptionInfo.Translated'
						}
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							lookupDirective: 'basics-material-material-group-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialGroup',
							displayMember: 'Code'
						}
					}
				},
				upstreamitemtarget: {
					detail: {
						type: 'directive',
						directive: 'pps-accounting-upstream-item-target-lookup-combobox',
						options: {
							showClearButton: true
						}
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							lookupDirective: 'pps-accounting-upstream-item-target-lookup-combobox',
							showClearButton: true
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'UpstreamItemTarget',
							displayMember: 'Code',
							dataServiceName: 'ppsAccountingResultUpstreamTargetDataService'
						}
					}
				},
				upstreamitemtemplatefk: {
					detail: {
						type: 'directive',
						directive: 'pps-configuration-upstream-item-template-lookup',
						options: {
							showClearButton: true
						}
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							lookupDirective: 'pps-configuration-upstream-item-template-lookup',
							showClearButton: true
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'UpstreamItemTemplate',
							displayMember: 'Code'
						}
					}
				}
			},
			'addition': {
				grid: extendGrouping([
					{
						afterId: 'result',
						id: 'resultDesc',
						field: 'Result',
						name: 'Result Description',
						name$tr$: 'productionplanning.accounting.entityResult',
						sortable: true,
						width: 140,
						formatter: 'dynamic',
						editor: null,
						domain: function (item, column) {
							var domain = 'lookup';
							var prop = componentTypesResult.properties[item.ComponentTypeFk];
							if (prop) {
								column.formatterOptions = {
									lookupType: prop.lookupType,
									displayMember: 'DescriptionInfo.Translated'
								};
								if (prop.version) {
									column.formatterOptions.version = prop.version;// for new lookup master api, the value of version should be greater than 2
								}
							} else {
								column.formatterOptions = null;
							}
							return domain;
						}
					}
				])
			}
		};
	}
})(angular);
