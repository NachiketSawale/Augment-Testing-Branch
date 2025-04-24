/**
 * Created by gaz on 6/28/2018.
 */
(function(angular){
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterialNeutralAiDataService', ['_','$q','$http','platformTranslateService','materialNeutralMaterialAiMappingService',
		function(_,$q, $http,platformTranslateService,materialNeutralMaterialAiMappingService) {
			var dataCache = {};
			var groupId = null;
			var extraData = {};

			function fillCache(Mainlist, MatchedList) {
				if (Mainlist && Mainlist.length > 0) {
					_.forEach(Mainlist, function(entry) {
						var FKs = entry.MatchedNeturalMaterialFks;
						var MatchedItems = [];
						if (FKs && FKs.length > 0) {
							_.forEach(FKs, function (FK) {
								var MatchedItem = _.find(MatchedList, {Id: FK});
								if (MatchedItem) {
									MatchedItems.push(MatchedItem);
								}
							});
						}
						dataCache[entry.Id] = MatchedItems;
						extraData[entry.Id] = [];
					});
				}
			}

			function attachData(data) {
				dataCache = {};
				fillCache(data.Main, data.MaterialRecord);
			}


			function attachExtraData(data) {
				var selectedId =  materialNeutralMaterialAiMappingService.getSelectedId();
				var groupExtraData = extraData[selectedId];
				var item = _.find(groupExtraData, {Id: data.Id});
				if (!item) {
					groupExtraData.push(data);
				}
			}

			function getExtraList() {
				var selectedId =  materialNeutralMaterialAiMappingService.getSelectedId();
				return extraData[selectedId];
			}

			function getList() {
				var selectedId =  materialNeutralMaterialAiMappingService.getSelectedId();
				return dataCache[selectedId];
			}

			function setFilter(dataContextId) {
				groupId = dataContextId;
			}

			function getItemById(value) {
				var itemList = dataCache[groupId];
				return _.find(itemList, {Id: value});
			}

			function getItemByIdAsync(value, options) {
				var deferred = $q.defer();
				deferred.resolve(getItemById(value, options));
				return deferred.promise;
			}

			return {
				attachData: attachData,
				attachExtraData: attachExtraData,
				setFilter: setFilter,
				getItemById: getItemById,
				getItemByIdAsync: getItemByIdAsync,
				getList: function () {
					var defer = $q.defer();
					defer.resolve(getList());
					return defer.promise;
				},
				getItemByKey: function (value) {
					var item = _.find(getList(), {Id: value});
					if (!item) {
						item = _.find(getExtraList(), {Id: value});
					}
					var deferred = $q.defer();
					deferred.resolve(item);
					return deferred.promise;
				}
			};
		}
	]);

})(angular);