/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {


	'use strict';

	/**
     * @ngdoc directive
     * @name estimateMainReplaceResourceFunctionType
     * @requires BasicsLookupdataLookupDirectiveDefinition
     * @description
     */
	let moduleName = 'estimate.main';
	angular.module(moduleName).directive('estimateMainReplaceResourceFunctionType', [
		'BasicsLookupdataLookupDirectiveDefinition', 'estimateMainReplaceResourceFunctionTypeLookupDataService',
		'estimateMainWizardContext', 'estimateMainResourceFrom', 'estimateMainReplaceFunctionType',
		function (BasicsLookupdataLookupDirectiveDefinition, estimateMainReplaceResourceFunctionTypeLookupDataService,
			estimateMainWizardContext, estimateMainResourceFrom, estimateMainReplaceFunctionType
		) {

			let defaults = {
				lookupType: 'estmodifyfunctiontype',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				uuid : 'a2c1d73d16e24963a026be4f5070bc82',
				onDataRefresh: function ($scope) {
					estimateMainReplaceResourceFunctionTypeLookupDataService.loadData().then(function(data){
						$scope.refreshData(data);
						$scope.settings.dataView.dataCache.isLoaded = false;
					});
				},
				filterOptions: {
					serverSide: false,
					fn: function (item) {
						let isEstAssemblyResource = estimateMainWizardContext.getConfig() === estimateMainResourceFrom.EstimateAssemblyResource;
						if(isEstAssemblyResource){
							return item.Id !== estimateMainReplaceFunctionType.ReplacePlantByPlant;
						}
						return true;
					}
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider : 'estimateMainReplaceResourceFunctionTypeLookupDataService'
			});
		}]);
})();
