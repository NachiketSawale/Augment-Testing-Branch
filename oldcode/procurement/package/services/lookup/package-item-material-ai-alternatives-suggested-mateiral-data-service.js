/**
 * Created by gaz on 6/28/2018.
 */
(function(angular){
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	var moduleName = 'procurement.package';

	angular.module(moduleName).factory('procurementPackageItemMaterialAiAlternativesSuggestedMaterialDataService',
		['$q', 'procurementPackageItemMaterialAiAlternativesService',

			function($q, procurementPackageItemMaterialAiAlternativesService) {
				var dataCache = {};

				function fillCache(prcItems, alternatives, materials) {
					if (prcItems !== null && prcItems.length > 0) {
						_.forEach(prcItems, function(prcItem) {
							var itemAlternatives = [];
							if (prcItem.SuggestedMaterialFks && prcItem.SuggestedMaterialFks.length > 0) {
								_.forEach(prcItem.SuggestedMaterialFks, function (materialFk) {
									var material = _.find(materials, {Id: materialFk});
									var alternative = _.find(alternatives, {PrcItemId: prcItem.Id, MaterialFk: materialFk});
									if (material && alternative) {
										var newObj = angular.extend({TotalCurrency: alternative.TotalCurrency}, material);
										itemAlternatives.push(newObj);
									}
								});
							}
							dataCache[prcItem.Id] = itemAlternatives;
						});
					}
				}

				function attachData(data) {
					dataCache = {};
					fillCache(data.Main, data.Alternatives, data.Materials);
				}

				function getList() {
					var selectedId =  procurementPackageItemMaterialAiAlternativesService.getSelectedId();
					return dataCache[selectedId];
				}

				return {
					attachData: attachData,
					getList: function () {
						var defer = $q.defer();
						defer.resolve(getList());
						return defer.promise;
					},
					getItemByKey: function (value) {
						var item = _.find(getList(), {Id: value});
						var deferred = $q.defer();
						deferred.resolve(item);
						return deferred.promise;
					}
				};
			}
		]);

})(angular);