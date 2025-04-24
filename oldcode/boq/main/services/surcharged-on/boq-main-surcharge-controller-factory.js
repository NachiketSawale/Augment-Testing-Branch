/**
 * Created by joshi on 27.10.2015.
 */
(function () {

	/* global _ */
	'use strict';
	/**
	 * @ngdoc controller
	 * @name boqMainSurchargeControllerFactory
	 * @function
	 *
	 * @description
	 * Controller factory for the flat grid view of boq surcharge position items.
	 **/

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('boq.main').factory('boqMainSurchargeControllerFactory',
		['boqMainSurchargeServiceFactory', 'platformGridControllerService', 'boqMainValidationServiceProvider', 'boqMainSurchargeStdConfigService', 'boqMainCommonService', '$injector',
			function (boqMainSurchargeServiceFactory, platformGridControllerService, boqMainValidationServiceProvider, boqMainSurchargeStdConfigService, boqMainCommonService, $injector) {

				var service = {};

				service.initController = function initController($scope, boqMainService, boqMainSurchargeServiceKey) {
					var boqMainSurchargeService = boqMainSurchargeServiceFactory.getService(boqMainService, boqMainSurchargeServiceKey);

					var gridConfig = {
						initCalled: false, columns: [],
						parentProp: 'BoqItemFk',
						childProp: 'SurchargeOnChildren',
						cellChangeCallBack: function cellChangeCallBack(arg) {

							var col = arg.grid.getColumns()[arg.cell].field,
								item = arg.item,
								selectedBoqItem = boqMainService.getSelected();

							var updBoqCalcNRefresh = function () {
								var total = boqMainSurchargeService.getSurchargeItemsTotal(item);
								selectedBoqItem.Quantity = total; // The selectedBoqItem is a surcharge item and carries the surcharge total in its Quantity property.
								// The corresponding Price property serves as percentage part and doesn't carry the calculated total.
								boqMainSurchargeService.updBoqCalcNRefresh(selectedBoqItem);
							};

							if (item && item.Id && selectedBoqItem && selectedBoqItem.Id) {
								if (col === 'SelectMarkup') {

									if (item.SelectMarkup) {
										if (boqMainCommonService.isSurchargeItem(item) || boqMainCommonService.isItem(item)) {
											item.QuantitySplit = item.Quantity;
										}
									} else {
										item.QuantitySplit = 0; // null;
									}

									boqMainSurchargeService.setBoqSurchargedItem(item, boqMainService);

									// Maintain surcharge BoqSurchardedItemEntities property an selecteBoqItem
									boqMainSurchargeService.maintainNavigationProperty(selectedBoqItem, item);

									updBoqCalcNRefresh();
								}
								if (col === 'QuantitySplit') {
									var navPropItem = _.find(selectedBoqItem.BoqSurchardedItemEntities, {Id: item.Id});
									if(_.isObject(navPropItem)) {
										angular.extend(navPropItem, item); // Merge local surchargeOn item into corresponding boq item nav prop surchargeOn item.
									}

									updBoqCalcNRefresh();
								}
							}
						}
					};
					var boqMainElementValidationService = boqMainValidationServiceProvider.getInstance(boqMainService);
					platformGridControllerService.initListController($scope, boqMainSurchargeStdConfigService, boqMainSurchargeService, boqMainElementValidationService, gridConfig);

					$injector.get('boqMainOenService').tryDisableContainer($scope, boqMainService, true);

					boqMainService.divisionTypeAssignmentChanged.register(boqMainSurchargeService.markSurchargeOnSelectedByDivisionType);
					$scope.$on('$destroy', function () {
						boqMainService.divisionTypeAssignmentChanged.unregister(boqMainSurchargeService.markSurchargeOnSelectedByDivisionType);
					});
				};

				return service;
			}
		]);
})();
