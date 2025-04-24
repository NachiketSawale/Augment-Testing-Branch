/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/* global globals, _ */

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainAssemblyTemplateLookup
	 * @function
	 *
	 * @description
	 * Service for the assembly template lookup, It's used for lookup directive basic settings
	 **/
	angular.module(moduleName).directive('estimateMainAssemblyTemplateLookup', [
		'$q', '$injector','$http', 'platformGridAPI', 'estimateMainCommonService', 'estimateMainAssemblyTemplateService', 'BasicsLookupdataLookupDirectiveDefinition', 'estimateMainLookupDialogAssemblyListColumns', 'platformTranslateService',
		function ($q, $injector, $http,platformGridAPI, estimateMainCommonService, estimateMainAssemblyTemplateService, BasicsLookupdataLookupDirectiveDefinition, estimateMainLookupDialogAssemblyListColumns, platformTranslateService) {
			let settings = estimateMainLookupDialogAssemblyListColumns.getStandardConfigForListView();
			if (!settings.isTranslated) {
				platformTranslateService.translateGridConfig(settings.columns);
				settings.isTranslated = true;
			}

			function setAssemblyLookupItem(selectedItem, entity){
				if(selectedItem){
					entity.EstHeaderAssemblyFk = selectedItem.EstHeaderFk;
					let usageContextService = lookupOptions.usageContext ? $injector.get(lookupOptions.usageContext) : null;
					if(usageContextService && angular.isFunction(usageContextService.setSelectedAssemblyLookupItem)){
						usageContextService.setSelectedAssemblyLookupItem(selectedItem);
					}else{
						estimateMainCommonService.setSelectedLookupItem(selectedItem);
					}
				}
			}

			let lookupOptions = {};
			let defaults = {
				lookupType: 'estassemblyfk',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '0e1f1ac18b114eba9413547b7d8517be',
				resizeable: true,
				minWidth: '600px',
				maxWidth: '90%',
				height: '500px',
				columns: angular.copy(estimateMainLookupDialogAssemblyListColumns.getStandardConfigForListView().columns),
				dialogOptions: {
					id: '6d6f55c8243c4b5cac5296a5cbd546b5',
					headerText: 'Assign Templates',
					templateUrl: globals.appBaseUrl + 'estimate.main/templates/assemblytemplate-lookup-dialog.html',
					controller: 'basicsLookupdataGridDialogController',
					resizeable: true
				},
				popupOptions: {
					width: 420,
					height: 300,
					templateUrl: 'grid-popup-lookup.html',
					footerTemplateUrl: 'lookup-popup-footer.html',
					controller: 'basicsLookupdataGridPopupController',
					showLastSize: true
				},
				disableDataCaching: true,
				events: [
					{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							let selectedItem = angular.copy(args.selectedItem);
							setAssemblyLookupItem(selectedItem, args.entity);
						}
					}
				],
				onDataRefresh: function onDataRefresh($scope) {
					platformGridAPI.items.data(defaults.uuid, []);
					estimateMainAssemblyTemplateService.getSearchList($scope.searchString, $scope.options.displayMember, $scope.entity, null, true, $scope.options, null ,null, true).then(function(data){
						$scope.refreshData(data);
					});
				},
				selectableCallback: function (selectItem) {
					let assemblyEntity = $injector.get('estimateAssembliesService').getSelected();
					if(assemblyEntity && transferAssemblyIds && (assemblyEntity.TransferMdcMaterialFk || assemblyEntity.TransferMdcCostCodeFk)){
						return  !(transferAssemblyIds.includes(selectItem.Id));
					}
					return true;
				}
			};
			let transferAssemblyIds;
			return new BasicsLookupdataLookupDirectiveDefinition('input-base', defaults, {
				dataProvider: {
					myUniqueIdentifier: 'assemblyTemplateLookupHandler',

					getList: function getList(settings, scope) {
						return estimateMainAssemblyTemplateService.getSearchList(null, null, scope.entity, null, true, settings);
					},

					getDefault: function getDefault(){
						return $q.when({}); // TODO: return default
					},

					getItemByKey: function getItemByKey(value, options, scope) {
						if (_.isNumber(value)){
							if (scope && _.isEmpty(scope.entity)){ // Is triggered from bulkEditor
								return $q.when(estimateMainAssemblyTemplateService.getAssemblyByIdBulkEditorAsync(value, scope));
							}
							return $q.when(estimateMainAssemblyTemplateService.getAssemblyByIdAsync(value));
						}else{
							if (scope && scope.entity && scope.entity.EstAssemblyFk > 0){
								return $q.when(estimateMainAssemblyTemplateService.getAssemblyByIdAsync(scope.entity.EstAssemblyFk));
							}
							return $q.when();
						}
					},

					getSearchList: function getSearchList(searchString, displayMember, scope, searchListSettings) {
						let defer = $q.defer();
						let searchStr = _.get(searchListSettings, 'searchString');
						if (searchStr) {
							searchStr = searchStr && searchStr.length > 0 ? searchStr.toLowerCase() : '';

							if (!defaults.onPopupOpened && !_.isEmpty(searchStr) && scope.entity && (scope.entity[displayMember] === searchStr.toUpperCase())){ // If textEditable is activated, this getSearchList function will be executed every time, workaround to avoid to sent http request to search when lookup search is not used
								let basicsLookupdataLookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');
								return $q.when(basicsLookupdataLookupDescriptorService.getLookupItem(defaults.lookupType, scope.entity.EstAssemblyFk));
							}

							scope.options = scope.options || {};
							scope.options.splitSearchString = true;

							var assembly = $injector.get('estimateAssembliesService').getSelected();
							if(assembly && (assembly.TransferMdcCostCodeFk || assembly.TransferMdcMaterialFk)){
								$http.get(globals.webApiBaseUrl + 'estimate/assemblies/FilterOutAssemblyIdsByResource?estHeaderFk='+assembly.EstHeaderFk +'&costCodeFk='+assembly.TransferMdcCostCodeFk+'&materialFk='+assembly.TransferMdcMaterialFk).then(function (response){
									if(response.data && response.data.length > 0){
										transferAssemblyIds = response.data;
										estimateMainAssemblyTemplateService.transferAssemblyIds = response.data;
									}
									estimateMainAssemblyTemplateService.getSearchList(searchStr, displayMember, scope.entity, null, true, scope.options, null, null, true).then(function(data){
										defer.resolve(data);
									});
								});
							}else {
								estimateMainAssemblyTemplateService.getSearchList(searchStr, displayMember, scope.entity, null, true, scope.options, null, null, true).then(function(data){
									defer.resolve(data);
								});
							}
							return defer.promise;
						} else {
							return $q.when([]);
						}
					},
					resolveStringValue : function (value, formatterOptions, service, entity, column){
						let options = column && column.editorOptions ? column.editorOptions.lookupOptions :{
							usageContext:'estimateMainService'
						};
						options.splitSearchString = true;
						return estimateMainAssemblyTemplateService.getSearchList(value, 'Code', entity, null, false, options,null, null, true).then(function(items){
							if (items && items.length > 0){
								setAssemblyLookupItem(items[0], entity);
								return {
									apply: true,
									valid: true,
									value: items[0].Id
								};
							}
							return {
								apply: true,
								valid: false,
								value: value,
								error: 'not found!'
							};
						});
					}
				},
				controller: ['$scope', '$timeout', 'platformGridAPI', function ($scope, $timeout, platformGridAPI) {
					angular.extend(lookupOptions, $scope.options);
					estimateMainAssemblyTemplateService.setSearchListResult(null);


					let isScrollLoading = false;
					function onScroll(e, args){

						let searchSettings = estimateMainAssemblyTemplateService.getSearchListResult();

						if (searchSettings){
							let dataHeight = args.grid.getDataLength() * 25;
							let isHeightReadyToLoad = dataHeight - args.scrollTop < args.grid.getGridPosition().height;

							if (isHeightReadyToLoad && !isScrollLoading && dataHeight > 0){
								let dataCount = estimateMainAssemblyTemplateService.getList().length;
								let isAllSearchDataLoaded =  dataCount === searchSettings.ItemsTotalCount;
								if (!isAllSearchDataLoaded){
									isScrollLoading = true;
									estimateMainAssemblyTemplateService.getSearchList(searchSettings.SearchValue, $scope.options.displayMember, $scope.entity, { CurrentPage: searchSettings.CurrentPage }, true, $scope.options, searchSettings.ItemsTotalCount,null,true).then(function(data){
										let list = angular.copy(platformGridAPI.items.data($scope.lookupOptions.uuid));
										_.forEach(data, function(assembly){
											list.push(assembly);
										});
										platformGridAPI.items.data($scope.lookupOptions.uuid, list);

										setTimeout(function(){
											isScrollLoading = false;
										}, 200);
									});
								}
							}
						}
					}

					$scope.lookupOptions.events = $scope.lookupOptions.events || [];

					$scope.lookupOptions.events.push({
						name: 'onPopupOpened',
						handler: function () {
							defaults.onPopupOpened = 1;
							platformGridAPI.events.register($scope.lookupOptions.uuid, 'onScroll', onScroll);
						}
					});
					$scope.lookupOptions.events.push({
						name: 'onPopupClosed',
						handler: function () {
							delete defaults.onPopupOpened;
							platformGridAPI.events.unregister($scope.lookupOptions.uuid, 'onScroll', onScroll);
						}
					});

					$scope.$on('$destroy', function () {
						platformGridAPI.events.unregister($scope.lookupOptions.uuid, 'onScroll', onScroll);
					});
				}]
			});
		}
	]);
})();
