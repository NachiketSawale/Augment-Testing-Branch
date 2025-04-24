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

	angular.module(moduleName).directive('estimateAssembliesCategoryLookup',['$injector','basicsLookupdataConfigGenerator','estimateAssembliesCategoryLookupListColumns','BasicsLookupdataLookupDirectiveDefinition','$translate','estimateAssembliesCategoryLookupDataService',
		function($injector,basicsLookupdataConfigGenerator,estimateAssembliesCategoryLookupListColumns,BasicsLookupdataLookupDirectiveDefinition,$translate,estimateAssembliesCategoryLookupDataService){


			let assemblyTypeGridConfig = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				moduleQualifier: 'estimateAssembliesAssemblyTypeLookupDataService',
				dataServiceName: 'estimateAssembliesAssemblyTypeLookupDataService',
				valMember: 'Id',
				dispMember: 'ShortKeyInfo.Translated'
			}
			).grid;

			let defaults = {
				uuid: 'C35BF0B76F02463487CE5A8A74784AB7',
				lookupType: 'AssembliesCategoryLookup',
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
					estimateAssembliesCategoryLookupDataService.reload().then(function(data){
						if(data){
							$scope.refreshData(data);
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
						return estimateAssembliesCategoryLookupDataService.getListAsync();
					},

					getItemByKey: function (value) {
						return estimateAssembliesCategoryLookupDataService.getItemByIdAsync(value);
					},

					getDisplayItem: function (value) {
						return estimateAssembliesCategoryLookupDataService.getItemByIdAsync(value);
					},
					getSearchList: function(){
						return estimateAssembliesCategoryLookupDataService.getListAsync();
					}
				}
			});
		}]);
})(angular);
