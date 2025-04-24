/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc directive
	 * @name estimateMainMaterialLookup
	 * @requires  BasicsLookupdataLookupDirectiveDefinition
	 * @description modal dialog window with list of material records
	 */
	/* jshint -W072 */// this function has too much parameters
	angular.module(moduleName).directive('estimateMainMaterialLookup', ['$q', 'estimateMainCommonService','estimateMainConfigDetailService', 'estimateMainPrjMaterialLookupService', 'estimateMainResourceService',
		'BasicsLookupdataLookupDirectiveDefinition','basicsMaterialLookupService', '$templateCache',
		'basicsLookupdataLookupFilterService', 'cloudDesktopPinningContextService', '$injector','estimateProjectRateBookConfigDataService',
		function ($q, estimateMainCommonService,estimateMainConfigDetailService, estimateMainPrjMaterialLookupService, estimateMainResourceService, BasicsLookupdataLookupDirectiveDefinition,basicsMaterialLookupService, $templateCache,
			basicsLookupdataLookupFilterService, cloudDesktopPinningContextService, $injector, estimateProjectRateBookConfigDataService) {

			let lookupOptions = {};

			let defaults = {
				lookupType: 'MaterialRecord',
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
						name$tr$: 'project.material.prjestimateprice'
					},
					{
						id: 'dayworkRate',
						field: 'DayworkRate',
						name: 'Daywork Rate',
						width: 80,
						formatter: 'money',
						name$tr$: 'basics.material.record.DayworkRate'
					},
					{
						id: 'cost',
						field: 'Cost',
						name: 'Cost',
						width: 80,
						formatter: 'money',
						name$tr$: 'basics.material.record.Cost'
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
				uuid:'8F425AA1F8AB459D93F3DA57B5316775',
				// isPrjEstMaterial:false, // disabled: option is set in estimate-main-resource-code-lookup
				dialogOptions: {
					id:'8F425AA1F8AB459D93F3DA57B5316775',
					width: '75%',
					height: '80%',
					headerText$tr$:'basics.material.materialSearchLookup.htmlTranslate.materialSearch',
					templateUrl: globals.appBaseUrl + 'basics.material' + '/templates/material-lookup/material-lookup-dialog.html',//'/partials/material-lookup.html',//
					showMinimizeMaximizeButton: true,
					resizeable: true
				},
				events: [
					{
						name: 'onSelectedItemChanged', // register event and event handler here.
						handler: function (e, args) {
							let usageContextService = lookupOptions.usageContext ? $injector.get(lookupOptions.usageContext) : null;
							if (usageContextService && angular.isFunction(usageContextService.setSelectedMaterialLookupItem)){
								usageContextService.setSelectedMaterialLookupItem(args.selectedItem);
							}else{
								estimateMainCommonService.setSelectedLookupItem(args.selectedItem);
								estimateMainConfigDetailService.setSelectedLookupItem(args.selectedItem);
								estimateMainPrjMaterialLookupService.markPrjMaterialAsModified(args, estimateMainResourceService.getList());
							}
						}
					},
					{
						name: 'onSelectedItemsChanged',
						handler: function (e, args) {
							let selectedItems = args.selectedItems,
								usageContext = args.lookupOptions.usageContext;

							// handle selected item in the service, (e.g update other entity fields based on single lookup selection)
							if (usageContext){
								let serviceContext = $injector.get(usageContext);
								if (serviceContext && angular.isFunction(serviceContext.getMaterialLookupSelectedItems)){
									serviceContext.getMaterialLookupSelectedItems({} , selectedItems || []);
								}
							}
						}
					},
					{
						name: 'onPopupOpened',
						handler: function(){
							defaults.onPopupOpened = 1;
						}
					},
					{
						name: 'onPopupClosed',
						handler: function(){
							delete defaults.onPopupOpened;
						}
					}
				],
				filterKey: 'estimate-main-material-lookup-filter',
				onDataRefresh: function ($scope) {

					$injector.get('estimateMainLookupService').clearCache(true);
					$injector.get('estimateMainLookupService').reload();

					estimateMainPrjMaterialLookupService.clear();

					$injector.get('estimateProjectRateBookConfigDataService').initData();
					estimateMainPrjMaterialLookupService.loadPrjMaterial();
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
				width: '850px',
				height: '600px',
				minWidth: '600px',
				minHeight: '400px',
				resizeable: true,
				pageOptions: {
					enabled: true,
					size: 10
				},
				version: 3,
				disableDataCaching: true,
				isSupportedKeyDown: true
			};

			// fix defect #75973, using estimate price(project) as material price if exist.
			basicsLookupdataLookupFilterService.registerFilter({
				key: 'estimate-main-material-lookup-filter',
				serverSide: true,
				fn: function (entity, searchOptions) {
					let item = cloudDesktopPinningContextService.getPinningItem('project.main');
					searchOptions.Filter = {};
					if (item) {
						searchOptions.Filter.ProjectId = item.id;
						// toto: #93728, fill job condition here.
						searchOptions.Filter.LgmJobFk = estimateMainPrjMaterialLookupService.getJobFk();
						searchOptions.ContractName = 'EstimateMaterialFilter';

						// DEV-12444: rate book filter is integrated into common material search in backend, no need to handle it in frontend, please remove related logic about "isMaster".
						//searchOptions.CategoryIdsFilter = estimateProjectRateBookConfigDataService.getFilterIds(4);

						searchOptions.MaterialTypeFilter = {
							IsForEstimate: true
						};
					}
				}
			});

			return new BasicsLookupdataLookupDirectiveDefinition('input-base', defaults,{
				// dataProvider:estimateMainMaterialLookupDataService
				dataProvider: {
					myUniqueIdentifier: 'EstimateMainPrjMaterialLookupDataHandler',

					getPrjMaterial: function (data) {
						return estimateMainPrjMaterialLookupService.getPrjMaterial(data).then(function(result){
							return result;
						});
					},
					getSearchList: function getSearchList(filterString, displayMember, scope, setting){
						if (!defaults.onPopupOpened && !_.isEmpty(filterString.SearchText) && (scope.entity[displayMember.displayMember] === filterString.SearchText)){ // If textEditable is activated, this getSearchList function will be executed every time, workaround to avoid to sent http request to search when lookup search is not used
							let basicsLookupdataLookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');
							return $q.when(basicsLookupdataLookupDescriptorService.getLookupItem('MaterialRecord', scope.entity[displayMember.materialFkField]));
						}
						return basicsMaterialLookupService.getSearchList(filterString, displayMember, scope, setting);
					},
					getList: function getList(options, scope){
						let defer = $q.defer();

						let item = cloudDesktopPinningContextService.getPinningItem('project.main');
						if (item) {
							basicsMaterialLookupService.searchOptions.ProjectId = item.id;
							basicsMaterialLookupService.searchOptions.SearchText = (scope && scope.searchString) ? scope.searchString : null;
							basicsMaterialLookupService.searchOptions.LgmJobFk = estimateMainPrjMaterialLookupService.getJobFk();
						}

						basicsMaterialLookupService.search().then(function(resultAll){
							let resultMaterials = resultAll.items;
							defer.resolve(resultMaterials);
						});

						return defer.promise;
					},
					getItemByKey : function getItemByKey(value, options, scope){
						let basicsLookupdataLookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');
						if (_.isNumber(value)){
							if (basicsLookupdataLookupDescriptorService.hasLookupItem('MaterialRecord', value)){
								return $q.when(basicsLookupdataLookupDescriptorService.getLookupItem('MaterialRecord', value));
							}
							return basicsMaterialLookupService.getItemByKey(value, options).then(function(items){
								return _.isArray(items) ? _.head(items) : items;
							});
						}else{
							if (scope && scope.entity && scope.entity.MdcMaterialFk > 0){
								if (basicsLookupdataLookupDescriptorService.hasLookupItem('MaterialRecord', scope.entity.MdcMaterialFk)){
									return $q.when(basicsLookupdataLookupDescriptorService.getLookupItem('MaterialRecord', scope.entity.MdcMaterialFk));
								}
								return basicsMaterialLookupService.getItemByKey(scope.entity.MdcMaterialFk, options).then(function(items){
									return _.isArray(items) ? _.head(items) : items;
								});
							}
							return $q.when([]);
						}
					}
				},
				controller: ['$scope', function ($scope) { // do external logic to specific lookup directive controller here.
					angular.extend(lookupOptions, $scope.options);
				}]
			});
		}
	]);
})(angular);

