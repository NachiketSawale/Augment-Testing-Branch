/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName ='estimate.assemblies';


	angular.module(moduleName).value('estimateAssembliesCategoryLookupListColumns', {
		getStandardConfigForListView: function (assemblyTypeGridConfig) {
			return {
				columns: [
					{
						field: 'Code',
						formatter: 'code',
						id: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						field: 'DescriptionInfo',
						formatter: 'translation',
						id: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						field: 'EstAssemblyTypeFk',
						editor: assemblyTypeGridConfig.editor,
						editorOptions: assemblyTypeGridConfig.editorOptions,
						formatter: assemblyTypeGridConfig.formatter,
						formatterOptions: assemblyTypeGridConfig.formatterOptions,
						id: 'EstAssemblyTypeFk',
						name: 'Assembly Type',
						name$tr$: 'estimate.assemblies.entityEstAssemblyTypeFk'
					}
				]
			};
		}
	});

	angular.module(moduleName).directive('estimateAssembliesSourceLineItemsAssemblyCategoryLookup',[
		'$q','basicsLookupdataConfigGenerator','estimateAssembliesCategoryLookupListColumns','BasicsLookupdataLookupDirectiveDefinition','$translate','estimateAssembliesCategoryLookupDataService', 'estimateMainAssemblycatTemplateService',
		function($q,basicsLookupdataConfigGenerator,estimateAssembliesCategoryLookupListColumns,BasicsLookupdataLookupDirectiveDefinition,$translate,estimateAssembliesCategoryLookupDataService, estimateMainAssemblycatTemplateService){


			let assemblyTypeGridConfig = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				moduleQualifier: 'estimateAssembliesAssemblyTypeLookupDataService',
				dataServiceName: 'estimateAssembliesAssemblyTypeLookupDataService',
				valMember: 'Id',
				dispMember: 'ShortKeyInfo.Translated'
			}
			).grid;

			let defaults = {
				uuid: '2ce472c397b441e1b5d3d921cec3e01d',
				lookupType: 'AssembliesSourceLineItemsAssemblyCategoryLookup',
				valueMember: 'Id',
				displayMember: 'Code',
				resizeable: true,
				minWidth: '600px',
				maxWidth: '90%',
				columns: angular.copy(estimateAssembliesCategoryLookupListColumns.getStandardConfigForListView(assemblyTypeGridConfig).columns),
				width: 1000,
				height: 400,
				treeOptions: {
					parentProp: 'EstAssemblyCatFk',
					childProp: 'AssemblyCatChildren',
					inlineFilters: true,
					hierarchyEnabled: true
				},
				title: {name: $translate.instant('estimate.assemblies.entityEstAssemblyTypeFk')},
				onDataRefresh: function ($scope) {
					estimateMainAssemblycatTemplateService.clearCategoriesCache();
					estimateMainAssemblycatTemplateService.loadAllAssemblyCategories().then(function(treeList){
						if(treeList){
							$scope.refreshData(treeList);
						}
					});
				},
				selectableCallback: function () {
					return true;
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults,{
				dataProvider: {
					getList: function () {
						// return estimateAssembliesCategoryLookupDataService.getListWithAssemblyCatFilteredAsync();
						return estimateMainAssemblycatTemplateService.loadAllAssemblyCategories().then(function(treeList){
							return treeList || [];
						});
					},

					getItemByKey: function (value) {
						// return estimateAssembliesCategoryLookupDataService.getItemByIdAsync(value);
						return $q.when(estimateMainAssemblycatTemplateService.getItemById(value));
					},

					getDisplayItem: function (value) {
						// return estimateAssembliesCategoryLookupDataService.getItemByIdAsync(value);
						return $q.when(estimateMainAssemblycatTemplateService.getItemById(value));
					},
					getSearchList: function(){
						// return estimateAssembliesCategoryLookupDataService.getListWithAssemblyCatFilteredAsync();
						return estimateMainAssemblycatTemplateService.loadAllAssemblyCategories().then(function(treeList){
							return treeList || [];
						});
					}
				}
			});
		}]);
})(angular);
