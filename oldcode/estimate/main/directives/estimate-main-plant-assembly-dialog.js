/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals, _ */
	/**
     * @ngdoc directive
     * @name basics.lookupdata.directive: estimateMainPlantAssemblyDialog
     * @element
     * @restrict
     * @priority
     * @scope
     * @description
     * #
     *a dialog directive for estimate main (displays Plant Master and plant Groups per Job with assemblies).
     *
     */
	angular.module('estimate.main').directive('estimateMainPlantAssemblyDialog', ['$q', '$injector', 'platformGridAPI', 'estimateMainCommonService', 'BasicsLookupdataLookupDirectiveDefinition', 'platformDataServiceProcessDatesBySchemeExtension', 'estimateMainPlantAssemblyDialogService', 'platformTranslateService', 'estimateMainPlantAssemblyDialogConfigService',
		function ($q, $injector, platformGridAPI, estimateMainCommonService, BasicsLookupdataLookupDirectiveDefinition, platformDataServiceProcessDatesBySchemeExtension, estimateMainPlantAssemblyDialogService, platformTranslateService, estimateMainPlantAssemblyDialogConfigService) {

			let settings = estimateMainPlantAssemblyDialogConfigService.getStandardConfigForListView();

			if (!settings.isTranslated) {
				platformTranslateService.translateGridConfig(settings.columns);
				settings.isTranslated = true;
			}
			let lookupOptions = {};
			let defaults = {
				lookupType: 'estplantassemblyfk',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'd9a7bad1ffd74002b1db662a6b2c2893',
				resizeable: true,
				minWidth: '600px',
				maxWidth: '90%',
				height: '500px',
				columns: angular.copy(settings.columns),
				dialogOptions: {
					id: '29faa15d5b674beda9460c550ef2d09d',
					headerText: 'Assign Plant Assembly',
					templateUrl: globals.appBaseUrl + 'estimate.main/templates/estimate-main-plant-assembly-dialog.html',
					controller: 'basicsLookupdataGridDialogController',
					resizeable:true
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
							if(selectedItem){
								let usageContextService = lookupOptions.usageContext ? $injector.get(lookupOptions.usageContext) : null;
								if(usageContextService && angular.isFunction(usageContextService.setSelectedAssemblyLookupItem)){
									usageContextService.setSelectedAssemblyLookupItem(selectedItem);
								}else{
									estimateMainCommonService.setSelectedLookupItem(selectedItem);
								}
							}

						}
					}
				],
				onDataRefresh: function onDataRefresh($scope) {
					platformGridAPI.items.data(defaults.uuid, []);
					estimateMainPlantAssemblyDialogService.getSearchList($scope.searchString, $scope.options.displayMember, $scope.entity, null, true, $scope.options).then(function(data){
						$scope.refreshData(data);
					});
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('input-base', defaults, {
				dataProvider: {
					myUniqueIdentifier: 'estimateMainPlantAssemblyDialogHandler',

					getList: function getList(settings, scope) {
						return estimateMainPlantAssemblyDialogService.getSearchList(null, null, scope.entity, null, true, settings);
					},

					getDefault: function getDefault(){
						return $q.when({}); // TODO: return default
					},

					getItemByKey: function getItemByKey(value, options, scope) {
						if (_.isNumber(value)){
							if (scope && _.isEmpty(scope.entity)){ // Is triggered from bulkEditor
								return $q.when(estimateMainPlantAssemblyDialogService.getAssemblyByIdBulkEditorAsync(value, scope));
							}
							return $q.when(estimateMainPlantAssemblyDialogService.getAssemblyByIdAsync(value));
						}else{
							if (scope && scope.entity && scope.entity.EstAssemblyFk > 0){
								return $q.when(estimateMainPlantAssemblyDialogService.getAssemblyByIdAsync(scope.entity.EstAssemblyFk));
							}
							return $q.when();
						}
					},

					getSearchList: function getSearchList(searchString, displayMember, scope, searchListSettings) {
						let defer = $q.defer();
						let searchStr = _.get(searchListSettings, 'searchString');
						if (searchStr) {
							searchStr = searchStr && searchStr.length > 0 ? searchStr.toLowerCase() : '';

							if (!defaults.onPopupOpened && !_.isEmpty(searchStr) && (scope.entity[displayMember] === searchStr.toUpperCase())){ // If textEditable is activated, this getSearchList function will be executed every time, workaround to avoid to sent http request to search when lookup search is not used
								let basicsLookupdataLookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');
								return $q.when(basicsLookupdataLookupDescriptorService.getLookupItem(defaults.lookupType, scope.entity.EstAssemblyFk));
							}

							estimateMainPlantAssemblyDialogService.getSearchList(searchStr, displayMember, scope.entity, null, true, scope.options).then(function(data){
								defer.resolve(data);
							});
							return defer.promise;
						} else {
							return $q.when([]);
						}
					}
				},
				controller: ['$scope', '$timeout', 'platformGridAPI', function ($scope, $timeout, platformGridAPI) {
					angular.extend(lookupOptions, $scope.options);
					estimateMainPlantAssemblyDialogService.setSearchListResult(null);


					let isScrollLoading = false;
					function onScroll(e, args){

						let searchSettings = estimateMainPlantAssemblyDialogService.getSearchListResult();

						if (searchSettings){
							let dataHeight = args.grid.getDataLength() * 25;
							let isHeightReadyToLoad = dataHeight - args.scrollTop < args.grid.getGridPosition().height;

							if (isHeightReadyToLoad && !isScrollLoading && dataHeight > 0){
								let dataCount = estimateMainPlantAssemblyDialogService.getList().length;
								let isAllSearchDataLoaded =  dataCount === searchSettings.ItemsTotalCount;
								if (!isAllSearchDataLoaded){
									isScrollLoading = true;
									estimateMainPlantAssemblyDialogService.getSearchList(searchSettings.SearchValue, $scope.options.displayMember, $scope.entity, { CurrentPage: searchSettings.CurrentPage }, true, $scope.options).then(function(data){
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

})(angular);