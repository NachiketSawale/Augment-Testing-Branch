/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global _ */
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc controller
	 * @name estimateMainLineItemTotalController
	 * @function
	 *
	 * @description
	 * Controller for total costs.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateMainConfigTotalController',
		['$scope', '$injector', '$timeout', 'platformGridAPI', 'platformGridControllerService', 'estimateMainCommonUIService',
			'estimateDefaultGridConfig',
			'estimateMainService',
			// 'estimateMainFilterService',
			'cloudDesktopPinningContextService',
			'cloudDesktopSidebarService',
			'estimateConfigTotalService',
			'estimateCommonControllerFeaturesServiceProvider',
			'estimateCommonDynamicConfigurationServiceFactory',
			'estimateMainConfigTotalDynamicConfigurationService',
			'estimateMainBoqService',
			function ($scope,  $injector, $timeout, platformGridAPI, platformGridControllerService, estimateMainCommonUIService,
				estimateDefaultGridConfig,
				estimateMainService,
				// estimateMainFilterService,
				cloudDesktopPinningContextService,
				cloudDesktopSidebarService,
				estimateConfigTotalService,
				estimateCommonControllerFeaturesServiceProvider,
				estimateCommonDynamicConfigurationServiceFactory,
				estimateMainConfigTotalDynamicConfigurationService,
				estimateMainBoqService
			) {

				let gridConfig = angular.extend({/* enter specific options here */}, estimateDefaultGridConfig);

				platformGridControllerService.initListController($scope, estimateMainConfigTotalDynamicConfigurationService, estimateConfigTotalService, null, gridConfig);
				estimateCommonControllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);
				estimateConfigTotalService.scope($scope); // pass the scope

				let toolActiveValue = null;
				if(!estimateConfigTotalService.toolHasAdded){
					$scope.addTools(estimateConfigTotalService.initTotalIcons($scope));
					estimateConfigTotalService.toolHasAdded = true;
				}else {
					toolActiveValue = estimateConfigTotalService.getToolActiveValue($scope.tools.items);
					$scope.addTools(estimateConfigTotalService.initTotalIcons($scope));
				}

				function disableCalculatorTools(){
					let itemsIndex = _.findIndex($scope.tools.items, function(item){
						return item.id === 'config_total_calculatorTools';
					});
					_.each($scope.tools.items[itemsIndex].list.items, function(tool){
						tool.disabled = function() { return $scope.showInfoOverlay; };
					});

					$scope.$watch('showInfoOverlay', function () {
						if ($scope.tools) {
							$scope.tools.update();
						}
					});
				}

				disableCalculatorTools();

				function doOnLineItemChanged() {
					let lastSelectedKey = estimateConfigTotalService.getLastSelectedKey();

					if(lastSelectedKey){
						if(lastSelectedKey === 'configTotalLineItem'){
							estimateConfigTotalService.changeIcon($scope, 'configTotalLineItem');
						}
					}else{
						let totalKey = null;
						let lineItems = estimateMainService.getSelectedEntities();
						if (!_.isEmpty(lineItems)) {
							if (estimateConfigTotalService.isLeadingStrActive()){
								totalKey =  _.isString(lastSelectedKey) && lastSelectedKey !== null ? lastSelectedKey : _.size(lineItems) === 1 ? 'configTotalLineItem': 'configTotalFilter';
							}else{
								totalKey = _.isString(lastSelectedKey) && lastSelectedKey !== null && (estimateConfigTotalService.isStructureFilterSet() || estimateConfigTotalService.isEnhancedFilterSet()) ? lastSelectedKey : 'configTotalLineItem';
							}
						}
						else if(estimateConfigTotalService.isStructureFilterSet()) {
							totalKey = 'configTotalFilter';
						}
						else if(estimateConfigTotalService.isEnhancedFilterSet()) {
							totalKey = _.isString(lastSelectedKey) && lastSelectedKey !== null ? lastSelectedKey : 'configTotalGrand';
						}
						else {
							totalKey = 'configTotalGrand';
						}
						if (totalKey){
							estimateConfigTotalService.changeIcon($scope, totalKey);
						}
					}

				}

				// calculate total on multi line items selection changed
				estimateConfigTotalService.multiLineItemsChanged.register(doOnLineItemChanged);

				// when the filters are set and line-item grid is refreshed
				if(!estimateConfigTotalService.getIsLoad()) {
					// estimateMainService.registerListLoaded(loadTotalOnLineItemLoaded);
					estimateConfigTotalService.setIsLoad(true);
				}
				if(!estimateConfigTotalService.getIsFristLoad()) {
					estimateConfigTotalService.setIconHighlight();
					estimateConfigTotalService.setIsFristLoad(true);
				}else if(toolActiveValue){
					estimateConfigTotalService.activateIcon(estimateConfigTotalService.scope(),toolActiveValue);
				}

				function setDynamicColumnsLayoutToGrid(){
					estimateMainConfigTotalDynamicConfigurationService.applyToScope($scope);
				}

				estimateMainConfigTotalDynamicConfigurationService.registerSetConfigLayout(setDynamicColumnsLayoutToGrid);

				let estimateMainConfigTotalDynamicUserDefinedColumnService = $injector.get('estimateMainConfigTotalDynamicUserDefinedColumnService');
				estimateMainConfigTotalDynamicUserDefinedColumnService.initReloadFn();

				function onInitialized() {
					estimateMainConfigTotalDynamicUserDefinedColumnService.loadDynamicColumns();
				}
				platformGridAPI.events.register($scope.gridId, 'onInitialized', onInitialized);

				// when boqitem marker chagnes, set the params,
				estimateMainBoqService.onMarkerchagnedBoqItemIds.register(setRequestParamsBoqItemInfo);
				function setRequestParamsBoqItemInfo(boqItemIds){
					estimateConfigTotalService.setRequestParamsBoqItemInfo(boqItemIds);
				}

				$scope.$on('$destroy', function () {
					estimateConfigTotalService.setIsLoad(false);
					estimateConfigTotalService.multiLineItemsChanged.unregister(doOnLineItemChanged);
					estimateMainConfigTotalDynamicConfigurationService.unregisterSetConfigLayout(setDynamicColumnsLayoutToGrid);
					estimateMainConfigTotalDynamicUserDefinedColumnService.onDestroy();
					platformGridAPI.events.unregister($scope.gridId, 'onInitialized', onInitialized);
					estimateConfigTotalService.setLastSelectedKey(null);
					estimateMainBoqService.onMarkerchagnedBoqItemIds.unregister(setRequestParamsBoqItemInfo);
				});

			}]);
})();
