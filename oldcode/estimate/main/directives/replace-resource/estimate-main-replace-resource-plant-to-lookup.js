/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals, _ */
	angular.module('estimate.main').directive('estimateMainReplaceResourcePlantToLookup', ['$q', '$injector', 'platformGridAPI', 'estimateMainCommonService', 'BasicsLookupdataLookupDirectiveDefinition', 'platformDataServiceProcessDatesBySchemeExtension', 'estimateMainPlantAssemblyDialogService', 'platformTranslateService', 'estimateMainPlantAssemblyDialogConfigService',
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
					templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/replace-resource/estimate-main-replace-resource-plant-to-lookup.html',
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
				disableDataCaching: true
			};

			return new BasicsLookupdataLookupDirectiveDefinition('input-base', defaults, {
				dataProvider: {
					myUniqueIdentifier: 'estimateMainReplacePlantAssemblyHandler',

					getList: function getList(settings, scope) {
						return estimateMainPlantAssemblyDialogService.getSearchList(null, null, scope.entity, null, true, settings);
					},

					getDefault: function getDefault(){
						return $q.when({});
					},

					getItemByKey: function getItemByKey() {
						return $q.when([]);
					},

					getSearchList: function getSearchList() {
						return $q.when([]);
					}
				},
				controller: ['$scope', '$timeout', 'platformGridAPI',
					function ($scope, $timeout, platformGridAPI) {
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