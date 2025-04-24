/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.assemblies';

	angular.module(moduleName).directive('estimateAssembliesCategoryRootLookup', ['$injector', 'basicsLookupdataConfigGenerator', 'estimateAssembliesCategoryLookupListColumns', 'BasicsLookupdataLookupDirectiveDefinition', '$translate', 'estimateAssembliesCategoryRootLookupDataService',
		function ($injector, basicsLookupdataConfigGenerator, estimateAssembliesCategoryLookupListColumns, BasicsLookupdataLookupDirectiveDefinition, $translate, estimateAssembliesCategoryRootLookupDataService) {

			let assemblyTypeGridConfig = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				moduleQualifier: 'estimateAssembliesAssemblyTypeLookupDataService',
				dataServiceName: 'estimateAssembliesAssemblyTypeLookupDataService',
				valMember: 'Id',
				dispMember: 'ShortKeyInfo.Translated'
			}).grid;

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
				title: {name: $translate.instant('estimate.assemblies.entityEstAssemblyTypeFk')},
				onDataRefresh: function ($scope) {
					estimateAssembliesCategoryRootLookupDataService.reload().then(function (data) {
						if (data) {
							$scope.refreshData(data);
						}
					});
				},
				selectableCallback: function () {
					return true;
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: {
					getList: function () {
						return estimateAssembliesCategoryRootLookupDataService.getListAsync();
					},

					getItemByKey: function (value) {
						return estimateAssembliesCategoryRootLookupDataService.getItemByIdAsync(value);
					},

					getDisplayItem: function (value) {
						return estimateAssembliesCategoryRootLookupDataService.getItemByIdAsync(value);
					},
					getSearchList: function () {
						return estimateAssembliesCategoryRootLookupDataService.getListAsync();
					}
				}
			});
		}]);
})(angular);
