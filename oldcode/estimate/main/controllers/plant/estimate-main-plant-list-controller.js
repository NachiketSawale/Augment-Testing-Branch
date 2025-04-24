/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainPlantListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of Plant List entities.
	 **/
	angular.module(moduleName).controller('estimateMainPlantListController',
		['$scope', '$timeout', '$http', '$injector', 'platformGridControllerService', 'estimateMainPlantListValidationService', 'estimateMainPlantListUIConfigService', 'estimateMainPlantListService',
			'estimateMainService',
			function ($scope, $timeout, $http, $injector, platformGridControllerService, estimateMainPlantListValidationService, estimateMainPlantListUIConfigService, estimateMainPlantListService,
								estimateMainService) {

				let gridConfig = {
					initCalled: false,
					columns: []
				};

				let isCalcTotalWithWq = $injector.get('estimateMainService').getEstTypeIsTotalWq();

				platformGridControllerService.initListController($scope, estimateMainPlantListUIConfigService, estimateMainPlantListService, estimateMainPlantListValidationService, gridConfig);

				estimateMainPlantListUIConfigService.applyToScope($scope);

				function calculate(){
					let projectFk = estimateMainService.getSelectedProjectId();
					let estHeaderFk = estimateMainService.getSelectedEstHeaderId();
					if(projectFk > 0 && estHeaderFk > 0){
						estimateMainPlantListService.load();
					}
				}

				function updateTools() {

					isCalcTotalWithWq = $injector.get('estimateMainService').getEstTypeIsTotalWq();

					estimateMainPlantListService.setIsCalcTotalWithWq(isCalcTotalWithWq);

					let tools = [
						{
							id: 'regenerateFromEstimate',
							sort: 200,
							caption: 'estimate.main.calculate',
							type: 'item',
							iconClass: 'control-icons ico-recalculate',
							disabled: function () {
								return false;
							},
							fn: function regenerateFromEstimate() {
								estimateMainService.update().then(function(){
									calculate();
								});
							}
						},
						{
							id: 'calculationType',
							calculationTypeIconsGroup: 'calculationType',
							type: 'sublist',
							list: {
								cssClass: 'radio-group',
								showTitles: true,
								activeValue: isCalcTotalWithWq.toString(),
								items: [
									{
										id: 'calculateWithWq',
										caption: 'estimate.main.calculateWithWq',
										type: 'radio',
										value: 'true',
										iconClass: 'tlb-icons ico-filter-wic-boq',
										fn: function () {
											isCalcTotalWithWq = true;
											estimateMainPlantListService.setIsCalcTotalWithWq(true);
										},
										disabled: function () {
											return false;
										}
									},
									{
										id: 'calculateWithAq',
										caption: 'estimate.main.calculateWithAq',
										type: 'radio',
										value: 'false',
										iconClass: 'tlb-icons ico-filter-activity',
										fn: function () {
											isCalcTotalWithWq = false;
											estimateMainPlantListService.setIsCalcTotalWithWq(false);
										},
										disabled: function () {
											return false;
										}
									}
								]
							}
						}
					];

					$scope.addTools(tools);

					_.remove($scope.tools.items, function (e) {
						return e.id === 'createChild' || e.id === 'create' || e.id === 'delete';
					});

					$timeout(function () {
						$scope.tools.update();
					});
				}

				updateTools();

				function refresh(){
					updateTools();
					calculate();
				}

				$injector.get('estimateMainService').onDataRead.register(refresh);

				$scope.$on('$destroy', function () {
					$injector.get('estimateMainService').onDataRead.unregister(refresh);
				});
			}
		]);
})();