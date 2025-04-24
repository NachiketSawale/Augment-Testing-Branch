/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global _, angular */
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc controller
	 * @name estimateMainPlantTotalsController
	 * @function
	 *
	 * @description
	 * Controller for plant total costs.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateMainPlantTotalsController',
		['$scope', '$injector', 'platformGridControllerService', 'estimateMainPlantUiTotalsService', 'estimateDefaultGridConfig', 'estimateMainPlantTotalsService',
			function ($scope, $injector, platformGridControllerService, estimateMainPlantUiTotalsService, estimateDefaultGridConfig, estimateMainPlantTotalsService){

				let gridConfig = angular.extend({}, estimateDefaultGridConfig);

				platformGridControllerService.initListController($scope, estimateMainPlantUiTotalsService, estimateMainPlantTotalsService, null, gridConfig);
				estimateMainPlantTotalsService.scope($scope);

				let toolActiveValue = null;
				if(!estimateMainPlantTotalsService.toolHasAdded){
					$scope.addTools(estimateMainPlantTotalsService.initTotalIcons($scope));
					estimateMainPlantTotalsService.toolHasAdded = true;
				}else {
					toolActiveValue = estimateMainPlantTotalsService.getToolActiveValue($scope.tools.items);
					$scope.addTools(estimateMainPlantTotalsService.initTotalIcons($scope));
				}

				function disableCalculatorTools(){
					let itemsIndex = _.findIndex($scope.tools.items, function(item){
						return item.id === 'plant_total_calculatorTools';
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

				// when the filters are set and line-item grid is refreshed
				if(!estimateMainPlantTotalsService.getIsLoad()) {
					estimateMainPlantTotalsService.setIsLoad(true);
				}
				if(!estimateMainPlantTotalsService.getIsFristLoad()) {
					estimateMainPlantTotalsService.setIconHighlight();
					estimateMainPlantTotalsService.setIsFristLoad(true);
				}else if(toolActiveValue){
					estimateMainPlantTotalsService.activateIcon(estimateMainPlantTotalsService.scope(), toolActiveValue, true);
				}

				function setDynamicColumnsLayoutToGrid(){
					estimateMainPlantUiTotalsService.applyToScope($scope);
				}

				estimateMainPlantUiTotalsService.registerSetConfigLayout(setDynamicColumnsLayoutToGrid);

				$injector.get('estimateMainPlantListService').onDataRead.register(refresh);
				function refresh(){
					estimateMainPlantTotalsService.load();
				}

				$scope.$on('$destroy', function () {
					estimateMainPlantTotalsService.setIsLoad(false);
					estimateMainPlantTotalsService.setLastSelectedKey(null);

					$injector.get('estimateMainPlantListService').onDataRead.unregister(refresh);
				});

			}]);
})();
