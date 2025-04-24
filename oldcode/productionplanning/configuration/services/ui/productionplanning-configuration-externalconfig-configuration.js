(function (angular) {
	/*global angular*/
	'use strict';
	var moduleName = 'productionplanning.configuration';
	var angModule = angular.module(moduleName);

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

	//external configuration Layout Config
	angModule.value('ppsExternalConfigurationLayoutConfig', {
		'addition': {
			'grid': extendGrouping([])
		}
	});

	//external configuration Layout
	angModule.factory('ppsExternalConfigurationLayout', Layout);
	Layout.$inject = ['basicsLookupdataConfigGenerator', 'basExternalResourceTypes', 'ppsExternalConfigurationDataService', 'platformDataServiceSelectionExtension', 'productionplanningConfigurationClobControllerService'];
	function Layout(basicsLookupdataConfigGenerator, basExternalResourceTypes, ppsExternalConfigurationDataService, platformDataServiceSelectionExtension, productionplanningConfigurationClobControllerService) {

		return {
			'fid': 'productionplanning.configuration.externalconfig.detailForm',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'baseGroup',
					attributes: [
						'description', 'basexternalsourcetypefk', 'basexternalsourcefk', 'sorting', 'pkey1',
						'pkey2', 'islive', 'remark', 'userflag1', 'userflag2'
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
				basexternalsourcetypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.externalsourcetype', null,
					{
						showClearButton: true,
						events: [{
							name: 'onEditValueChanged', handler: (event, data) => {
								if (data.selectedItem && data.entity.BasExternalSourceTypeFk !== data.selectedItem.Id) {
										data.entity.BasExternalSourceTypeFk = data.selectedItem.Id;
										let tempEntity = Object.assign({}, data.entity);
										tempEntity.dropdownItemChanged = true;
										ppsExternalConfigurationDataService.fireItemModified(tempEntity);
								} 
								
							}
						}]
					}),
				basexternalsourcefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.externalsource', null, { showClearButton: true, filterKey: 'ppsconfig-bas-external-resource-filter' }),
				pkey1: {
					detail: {
						type: 'directive',
						directive: 'dynamic-grid-and-form-lookup',
						options: {
							isTextEditable: false,
							dependantField: 'BasExternalSourceTypeFk',
							lookupInfo: basExternalResourceTypes.lookupInfo,
							grid: false,
							dynamicLookupMode: true,
							showClearButton: false,
							lookupOptions: { showClearButton: false }
						}
					},
					grid: {
						formatter: 'dynamic',
						editor: 'dynamic',
						domain: function (item, column) {
							var prop = basExternalResourceTypes.lookupInfo[item.BasExternalSourceTypeFk];
							if (prop && prop.column) {
								column.editorOptions = {
									directive: prop.lookup.options.lookupDirective,
									lookupOptions: { showClearButton: false }
								};
								column.formatterOptions = prop.lookup.formatterOptions;
							} else {
								column.editorOptions = { readonly: true };
								column.formatterOptions = null;
							}
							return 'lookup';
						}
					}
				},
				pkey2: {
					readonly: true
				}
			}
		};
	}
})(angular);