/**
 * Created by gaz on 6/28/2018.
 */
(function(angular){
	'use strict';

	var moduleName = 'basics.materialcatalog';

	angular.module(moduleName).factory('basicsMaterialCatalogGroupSuggestedPrcStructureDataService', ['_', '$q','$http','platformTranslateService','basicsMaterialCatalogService','materialCatalogGroupAiMappingService',
		function(_, $q, $http,platformTranslateService,materialCatalogService,materialCatalogGroupAiMappingService) {
			var dataCache = {};
			var groupId = null;
			var extraData = {};

			function fillCache(materialGroups, prcStructuresList) {
				if (materialGroups && materialGroups.length > 0) {
					_.forEach(materialGroups, function(materialGroup) {
						var prcStructureFks = materialGroup.SuggestedPrcStructureFks;
						var prcStructures = [];
						if (prcStructureFks && prcStructureFks.length > 0) {
							_.forEach(prcStructureFks, function (prcStructureFk) {
								var prcStructure = _.find(prcStructuresList, {Id: prcStructureFk});
								if (prcStructure) {
									prcStructure.TotalCurrency = prcStructure.Id;
									prcStructures.push(prcStructure);
								}
							});
						}
						dataCache[materialGroup.Id] = prcStructures;
						extraData[materialGroup.Id] = [];
						fillCache(materialGroup.ChildItems, prcStructuresList);
					});
				}
			}

			function attachData(data) {
				dataCache = {};
				fillCache(data.Main, data.Prcstructure);
			}

			function attachExtraData(data) {
				var selectedId =  materialCatalogGroupAiMappingService.getSelectedId();
				var groupExtraData = extraData[selectedId];
				var item = _.find(groupExtraData, {Id: data.Id});
				if (!item) {
					groupExtraData.push(data);
				}
			}

			function getExtraList() {
				var selectedId =  materialCatalogGroupAiMappingService.getSelectedId();
				return extraData[selectedId];
			}

			function getList() {
				var selectedId =  materialCatalogGroupAiMappingService.getSelectedId();
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