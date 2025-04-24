/**
 * Created by rje on 13.07.2016.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _, globals */
	'use strict';
	let moduleName = 'estimate.assemblies';
	/**
	 * @ngdoc directive
	 * @name estimateAssembliesMaterialLookup
	 * @requires  BasicsLookupdataLookupDirectiveDefinition
	 * @description modal dialog window with list of material records
	 */

	angular.module(moduleName).directive('estimateAssembliesMaterialLookup', ['$q', 'estimateMainCommonService','estimateMainConfigDetailService', 'estimateMainPrjMaterialLookupService', 'estimateMainResourceService',
		'BasicsLookupdataLookupDirectiveDefinition','basicsMaterialLookupService', '$templateCache', '$injector','basicsLookupdataLookupFilterService', 'platformGridAPI', 'estimateMainMaterialFastInputDataService',
		function ($q, estimateMainCommonService,estimateMainConfigDetailService, estimateMainPrjMaterialLookupService, estimateMainResourceService, BasicsLookupdataLookupDirectiveDefinition,basicsMaterialLookupService, $templateCache, $injector,basicsLookupdataLookupFilterService, platformGridAPI, estimateMainMaterialFastInputDataService) {
			let defaults = {
				lookupType: 'AssemblyMaterialRecord',
				showClearButton: true,
				isTextEditable: true,
				autoComplete:true,
				columns: [
					{id: 'code', field: 'Code', name: 'Code', width: 80, name$tr$: 'cloud.common.entityCode'},
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
					}
				],
				popupOptions: {
					width: 420,
					height: 300,
					template: $templateCache.get('grid-popup-lookup.html'),
					footerTemplate: $templateCache.get('lookup-popup-footer.html'),
					controller: 'basicsLookupdataGridPopupController',
					showLastSize: true
				},
				// isPrjEstMaterial:false, // disabled: option is set in estimate-main-resource-code-lookup
				dialogOptions: {
					id: '88e41e83ce704266b9238bf79b046aca',
					width: '75%',
					height: '80%',
					showMinimizeMaximizeButton: true,
					resizeable: true,
					headerText$tr$:'basics.material.materialSearchLookup.htmlTranslate.materialSearch',
					templateUrl: globals.appBaseUrl + 'basics.material' + '/templates/material-lookup/material-lookup-dialog.html',
					windowClass: 'ms-modal-dialog'
				},
				events: [
					{
						name: 'onInitialized',
						handler: function () {
							basicsMaterialLookupService.searchOptions.isMaster = true;
						}
					},
					{
						name: 'onSelectedItemChanged', // register event and event handler here.
						handler: function (e, args) {
							estimateMainCommonService.setSelectedLookupItem(args.selectedItem);
							estimateMainConfigDetailService.setSelectedLookupItem(args.selectedItem);
							estimateMainPrjMaterialLookupService.markPrjMaterialAsModified(args, estimateMainResourceService.getList());
						}
					},
					{
						name: 'onSelectedItemsChanged',
						handler: function (e, args) {
							let selectedItems = angular.copy(args.selectedItems),
								usageContext = args.lookupOptions.usageContext;

							// handle selected item in the service, (e.g update other entity fields based on single lookup selection)
							if (usageContext){
								let serviceContext = $injector.get(usageContext);
								if (serviceContext && angular.isFunction(serviceContext.getMaterialLookupSelectedItems)){
									serviceContext.getMaterialLookupSelectedItems({} , selectedItems || []);
								}
							}
						}
					}
				],
				onDataRefresh: function ($scope) {
					// eslint-disable-next-line no-prototype-builtins
					if ($scope.hasOwnProperty('searchViewOptions') && $scope.searchViewOptions.hasOwnProperty('searchService') && angular.isFunction($scope.searchViewOptions.searchService.search)){
						// dialog
						$scope.searchViewOptions.searchService.search();
					}else{
						// popup
						$scope.settings.dataView.dataProvider.getList($scope.options, $scope, $scope.settings.dataView.searchResult).then(function(data){
							$scope.refreshData(data);
						});
					}
				},
				selectableCallback: function (selectItem) {
					let assembly = $injector.get('estimateAssembliesService').getSelected();
					if(assembly && assembly.TransferMdcMaterialFk){
						return  !(selectItem.Id === assembly.TransferMdcMaterialFk);
					}
					return true;
				},
				filterKey: 'estimate-material-lookup-filter',
				width: '850px',
				height: '600px',
				minWidth: '600px',
				minHeight: '400px',
				resizeable: true
			};


			basicsLookupdataLookupFilterService.registerFilter({
				key: 'estimate-material-lookup-filter',
				serverSide: true,
				fn: function (entity, searchOptions) {
					let isPrjAssembly = platformGridAPI.grids.exist('20c0401f80e546e1bf12b97c69949f5b');
					let assemblyService = isPrjAssembly ? $injector.get('projectAssemblyMainService') : $injector.get('estimateAssembliesService');

					searchOptions.Filter = {};
					searchOptions.MaterialTypeFilter = {
						IsForEstimate: true,
					};

					searchOptions.Filter.IsPrjAssembly = isPrjAssembly;

					// if project assembly resources
					if(isPrjAssembly){
						searchOptions.ContractName = "ProjectAssemblyMaterialFilter";
						let project = $injector.get('projectMainService').getSelected();
						searchOptions.Filter.ProjectId = project ? project.Id : null;
						let itemSelected = assemblyService.getSelected();
						searchOptions.Filter.LgmJobFk = itemSelected ? itemSelected.LgmJobFk : null;
					}else{
						searchOptions.ContractName = "MasterAssemblyMaterialFilter";
					}

					let assemblyCategory = assemblyService.getAssemblyCategory();
					let estAssemblyTypeLogics = $injector.get('estimateMainCommonService').getEstAssemblyTypeLogics();
					if(assemblyCategory && (assemblyCategory.EstAssemblyTypeLogicFk === estAssemblyTypeLogics.CrewAssembly ||
							assemblyCategory.EstAssemblyTypeLogicFk === estAssemblyTypeLogics.CrewAssemblyUpdated)){
						searchOptions.Filter.IsLabour = true;
					}
				}
			});

			return new BasicsLookupdataLookupDirectiveDefinition('input-base', defaults,{
				dataProvider: {
					myUniqueIdentifier: 'EstimateAssemblyMaterialLookupDataHandler',
					getSearchList: basicsMaterialLookupService.getSearchList,
					getList: function getList(options, scope) {
						let defer = $q.defer();
						basicsMaterialLookupService.searchOptions.isMaster = true;
						basicsMaterialLookupService.searchOptions.SearchText = scope.searchString;
						estimateMainMaterialFastInputDataService.prepareSearchPayloadForAssembly(basicsMaterialLookupService.searchOptions);
						basicsMaterialLookupService.search().then(function (resultAll) {
							let resultMaterials = resultAll.items;
							defer.resolve(resultMaterials);
						});

						return defer.promise;
					},
					getItemByKey: function getItemByKey(value, options, scope) {
						let basicsLookupdataLookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');
						let materialItem = null;

						if (_.isNumber(value)) {
							materialItem = basicsLookupdataLookupDescriptorService.getLookupItem(defaults.lookupType, value);
							if (materialItem) {
								return $q.when(materialItem);
							}
							return basicsMaterialLookupService.getItemByKey(value, options).then(function (items) {
								return _.isArray(items) ? _.head(items) : items;
							});
						} else {
							if (scope && scope.entity && scope.entity.MdcMaterialFk > 0) {
								materialItem = basicsLookupdataLookupDescriptorService.getLookupItem(defaults.lookupType, scope.entity.MdcMaterialFk);
								if (materialItem) {
									return $q.when(materialItem);
								}
								return basicsMaterialLookupService.getItemByKey(scope.entity.MdcMaterialFk, options).then(function (items) {
									return _.isArray(items) ? _.head(items) : items;
								});
							}
							return $q.when([]);
						}
					}
				}
			});
		}
	]);
})(angular);
