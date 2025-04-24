/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular){
	/* global globals */
	'use strict';
	let moduleName = 'estimate.assemblies';
	angular.module(moduleName).directive('estimateMainAssemblyMaterialLookup',
		['$q','$templateCache','$http','$injector','basicsMaterialLookupService', 'BasicsLookupdataLookupDirectiveDefinition','basicsLookupdataLookupFilterService',
			function ($q,$templateCache,$http,$injector,basicsMaterialLookupService,BasicsLookupdataLookupDirectiveDefinition,basicsLookupdataLookupFilterService) {
				let defaults = {
					lookupType: 'MaterialCommodity',
					valueMember: 'Id',
					displayMember: 'Code',
					showClearButton: true,
					autoComplete:true,
					columns: [
						{id: 'code', field: 'Code', name: 'Code', width: 100, name$tr$: 'cloud.common.entityCode'},
						{
							id: 'desc',
							field: 'DescriptionInfo.Translated',
							name: 'Description',
							width: 150,
							name$tr$: 'cloud.common.entityDescription'
						},
						{
							id: 'estimateprice',
							field: 'EstimatePrice',
							name: 'Estimate Price',
							width: 80,
							formatter: 'money',
							name$tr$: 'basics.material.record.estimatePrice'
						},
						{
							id: 'listprice',
							field: 'ListPrice',
							name: 'List Price',
							width: 80,
							formatter: 'money',
							name$tr$: 'basics.material.record.listprice'
						}],
					popupOptions: {
						width: 420,
						height: 300,
						template: $templateCache.get('grid-popup-lookup.html'),
						footerTemplate: $templateCache.get('lookup-popup-footer.html'),
						controller: 'basicsLookupdataGridPopupController',
						showLastSize: true
					},
					dialogOptions: {
						width: '75%',
						height: '80%',
						showMinimizeMaximizeButton: true,
						resizeable: true,
						headerText$tr$:'basics.material.materialSearchLookup.htmlTranslate.materialSearch',
						templateUrl: globals.appBaseUrl + 'basics.material' + '/templates/material-lookup/material-lookup-dialog.html',
						windowClass: 'ms-modal-dialog'
					},
					selectableCallback: function (dataItem,assembly,scope) {
						if (transferMaterialIds && scope && scope.filterKey === 'estimate-main-assembly-transfer-material-Lookup-filter') {
							return !transferMaterialIds.includes(dataItem.Id);
						}
						return true;
					},
					width: '850px',
					height: '600px',
					minWidth: '400px',
					minHeight: '400px',
					filterKey: 'estimate-main-assembly-material-Lookup-filter',
					resizeable: true
				};

				basicsLookupdataLookupFilterService.registerFilter({
					key: 'estimate-main-assembly-material-Lookup-filter',
					serverSide: true,
					fn: function (entity, searchOptions) {
						let isPrjAssembly = $injector.get('platformGridAPI').grids.exist('51f9aff42521497898d64673050588f4');
						let assemblyService = isPrjAssembly ? $injector.get('projectAssemblyMainService') : $injector.get('estimateAssembliesService');
						let assemblyCategory = assemblyService.getAssemblyCategory();
						let estAssemblyTypeLogics = $injector.get('estimateMainCommonService').getEstAssemblyTypeLogics();

						searchOptions.Filter = {};
						searchOptions.ContractName = "MasterAssemblyMaterialFilter";

						if (assemblyCategory && (assemblyCategory.EstAssemblyTypeLogicFk === estAssemblyTypeLogics.CrewAssembly ||
                            assemblyCategory.EstAssemblyTypeLogicFk === estAssemblyTypeLogics.CrewAssemblyUpdated)) {
							searchOptions.Filter.IsLabour = true;
						}
					}
				});
				let transferMaterialIds;
				basicsLookupdataLookupFilterService.registerFilter({
					key: 'estimate-main-assembly-transfer-material-Lookup-filter',
					serverSide: true,
					fn: function (entity, searchOptions) {
						let isPrjAssembly = $injector.get('platformGridAPI').grids.exist('51f9aff42521497898d64673050588f4');
						let assemblyService = isPrjAssembly ? $injector.get('projectAssemblyMainService') : $injector.get('estimateAssembliesService');
						let assemblyCategory = assemblyService.getAssemblyCategory();
						let estAssemblyTypeLogics = $injector.get('estimateMainCommonService').getEstAssemblyTypeLogics();

						searchOptions.Filter = {};
						var assembly = $injector.get('estimateAssembliesService').getSelected();
						searchOptions.ContractName = "MasterAssemblyMaterialFilter";

						if (assemblyCategory && (assemblyCategory.EstAssemblyTypeLogicFk === estAssemblyTypeLogics.CrewAssembly ||
							assemblyCategory.EstAssemblyTypeLogicFk === estAssemblyTypeLogics.CrewAssemblyUpdated)) {
							searchOptions.Filter.IsLabour = true;
						}
						var assembly = $injector.get('estimateAssembliesService').getSelected();
						if(assembly){
							$http.get(globals.webApiBaseUrl + 'estimate/main/lineitem/FilterOutMaterIdsByAssembly?estHeaderFk='+assembly.EstHeaderFk +'&estLineItemFk='+assembly.Id).then(function (response){
								if(response.data && response.data.length > 0){
									transferMaterialIds = response.data;
								}
							});
						}
					}
				});


				return new BasicsLookupdataLookupDirectiveDefinition('input-base', defaults,{
					dataProvider: {
						myUniqueIdentifier: 'EstimateAssemblyListMaterialLookupDataHandler',
						getSearchList: basicsMaterialLookupService.getSearchList,
						// getList: basicsMaterialLookupService.getList,
						getList: function getList(options, scope) {
							let defer = $q.defer();
							let isPrjAssembly = $injector.get('platformGridAPI').grids.exist('51f9aff42521497898d64673050588f4');

							basicsMaterialLookupService.searchOptions.isMaster = true;
							basicsMaterialLookupService.searchOptions.CategoryIdsFilter = [];

							basicsMaterialLookupService.searchOptions.MaterialTypeFilter = {
								IsForEstimate: true,
								IsPrjAssembly: isPrjAssembly
							};

							if (isPrjAssembly) {
								let project = $injector.get('projectMainService').getSelected();
								basicsMaterialLookupService.searchOptions.ProjectId = project ? project.Id : null;

								let itemSelected = $injector.get('projectAssemblyMainService').getSelected();
								basicsMaterialLookupService.searchOptions.LgmJobFk = itemSelected ? itemSelected.LgmJobFk : null;
							}

							basicsMaterialLookupService.searchOptions.SearchText = scope.searchString;

							let assemblyService = isPrjAssembly ? $injector.get('projectAssemblyMainService') : $injector.get('estimateAssembliesService');
							let assemblyCategory = assemblyService.getAssemblyCategory();
							let estAssemblyTypeLogics = $injector.get('estimateMainCommonService').getEstAssemblyTypeLogics();
							if(assemblyCategory && (assemblyCategory.EstAssemblyTypeLogicFk === estAssemblyTypeLogics.CrewAssembly ||
								assemblyCategory.EstAssemblyTypeLogicFk === estAssemblyTypeLogics.CrewAssemblyUpdated)){
								basicsMaterialLookupService.searchOptions.IsLabour = true;
							}
							basicsMaterialLookupService.search().then(function (resultAll) {
								defer.resolve(resultAll.items);
							});

							return defer.promise;
						},
						getItemByKey: basicsMaterialLookupService.getItemByKey
					}
				});
			}]);

})(angular);
