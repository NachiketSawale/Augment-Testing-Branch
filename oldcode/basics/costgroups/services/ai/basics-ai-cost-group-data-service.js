/**
 * @author: chd
 * @date: 10/27/2020 10:01 AM
 * @description:
 */

/**
 * Created by wed on 08/05/2019.
 */

(function (window, angular) {

	'use strict';

	var moduleName = 'basics.costgroups';

	angular.module(moduleName).factory('basicsAICostGroupDataService', [
		'globals',
		'_',
		'$q',
		function (globals,
		          _,
		          $q) {

			var service = {};
			var costGroupMappings = [];
			var costGroups = [];

			service.fillCache = function(Mainlist, MatchedList) {
				/**
				 * Mainlist stands for the "data.dtos" list
				 * MatchedList stands for the target list, which is the data.CostGroup in this case
				 * The two lists are binded by "data.LineItem2CostGroups.MatchedCostGroupFks == data.CostGroup.Id
				 */
				costGroupMappings = [];

				if (Mainlist !== null && Mainlist.length > 0) {
					_.forEach(Mainlist, function (entry) {
						var FKs = entry.MatchedCostGroupFks;
						var MatchedCostGroupItems = [];
						if (FKs !== null && FKs.length > 0) {
							_.forEach(FKs, function (FK) {
								var MatchedItem = _.find(MatchedList, {Id: FK});
								if (MatchedItem !== null) {
									MatchedCostGroupItems.push(MatchedItem);
								}
							});

							var cache = {
								MainItemId: entry.MainItemId,
								CostGroupCatFk: entry.CostGroupCatFk,
								MatchedCostGroupItems: MatchedCostGroupItems
							};

							costGroupMappings.push(cache);
						}



					});
				}
			};

			service.attachSuggestedCostGroupsData = function(data) {
				costGroups = data.CostGroup;
				service.fillCache(data.LineItem2CostGroups, data.CostGroup);
			};

			service.getCostGroupById = function (id) {
				return _.find(costGroups, {Id: id});
			};

			service.getCostGroupList = function (costGroupCatId, entityId) {
				var matchedCostGroup = [];
				_.forEach(costGroupMappings, function (item) {
					if (item.MainItemId === entityId && item.CostGroupCatFk === costGroupCatId) {
						_.forEach(item.MatchedCostGroupItems, function (item) {
							matchedCostGroup.push(item);
						});
					}
				});

				return matchedCostGroup;
			};

			return service;
		}

	]);
})(window, angular);
