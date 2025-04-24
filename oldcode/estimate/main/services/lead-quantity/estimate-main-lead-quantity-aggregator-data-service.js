(function () {
	'use strict';
	/* global globals, _, Platform */
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainLeadQuantityAggregatorDataService
	 * @function
	 *
	 * @description
	 * This is the config service for Estimate lead quantity calculation.
	 */
	angular.module(moduleName).factory('estimateMainLeadQuantityAggregatorDataService', ['$injector', '$translate', '$http', 'basicsLookupdataConfigGenerator', 'PlatformMessenger', 'estimateMainService', 'estimateMainFilterService',

		function ($injector, $translate, $http, basicsLookupdataConfigGenerator, PlatformMessenger, estimateMainService, estimateMainFilterService) {

			let service = {},
				structure2NoLeadQtyItems = {},
				PKey1, PKey2, validFilterRequest = true, isFilterEmpty = true;

			function getReadData(selectedStrKey){
				validFilterRequest = true;
				isFilterEmpty = true;
				if(!_.isString(selectedStrKey)){
					validFilterRequest = false;
					return;
				}

				let filterRequest = angular.copy($injector.get('cloudDesktopSidebarService').getFilterRequestParams());
				let groupingFilter = $injector.get('platformGenericStructureService').getGroupingFilterRequest();
				if (groupingFilter) {
					filterRequest.groupingFilter = angular.copy(groupingFilter);
				}

				let headerId = estimateMainService.getSelectedEstHeaderId();
				if (headerId < 0){
					let cloudDesktopPinningContextService = $injector.get('cloudDesktopPinningContextService');
					let estHeaderContext = _.find(cloudDesktopPinningContextService.getContext(), {token: moduleName});
					headerId = estHeaderContext ? estHeaderContext.id : -1;
				}
				filterRequest.ProjectContextId = estimateMainService.getSelectedProjectId();
				// eslint-disable-next-line no-prototype-builtins
				filterRequest.FurtherFilters = !filterRequest.hasOwnProperty('FurtherFilters') ? [] : filterRequest.FurtherFilters;
				let headerToken = _.find(filterRequest.FurtherFilters, {Token: 'EST_HEADER'});
				if(headerToken){
					headerToken.Value = headerId;
				}else{
					headerToken = {Token: 'EST_HEADER', Value: headerId};
					filterRequest.FurtherFilters.push(headerToken);
				}
				extendSearchFilterAssign(selectedStrKey, filterRequest);
				return filterRequest;
			}

			function extendSearchFilterAssign(selectedStrKey, filterRequest){
				let structureKey;
				switch(selectedStrKey){
					case 'estimateMainBoqService':
						structureKey = 'BOQ_ITEM';
						break;
					case 'costGroupStructureDataServiceFactory':
						structureKey = 'BAS_COSTGROUP';
						break;
					default:
						validFilterRequest = false;
						break;
				}
				if(_.isEmpty(structureKey) || !_.isString(structureKey)){
					validFilterRequest = false;
					return;
				}
				// init FurtherFilters - add filter IDs from filter structures
				let filterType = estimateMainFilterService.getFilterFunctionType();

				// first remove all existing leading structure filters
				filterRequest.FurtherFilters = _.filter(filterRequest.FurtherFilters, function(i) { return i && i.Token ? i.Token.indexOf('FILTER_BY_STRUCTURE') < 0 : true; });

				let allLeadingStructuresFilters = _.map(estimateMainFilterService.getAllFilterIds(), function (v, k) {

					if(!_.isEqual(k, structureKey)) {
						return undefined;
					}
					isFilterEmpty = (!_.isEmpty(k) && _.size(v) === 0);
					if (_.size(v) === 0 ) {
						return undefined;
					}
					// type 0 - assigned;

					// -> no change needed

					// type 1 - assigned and not assigned
					if (filterType === 1) {
						v.push('null');
					}
					// type 2 - not assigned
					else if (filterType === 2) {
						v = ['null'];
					}
					let value = v.join(',');
					return {Token: 'FILTER_BY_STRUCTURE:' + k, Value: value};
				});

				let leadingStructuresFilters = _.filter(allLeadingStructuresFilters, angular.isDefined);
				if ((!leadingStructuresFilters || !leadingStructuresFilters.length) && _.some(allLeadingStructuresFilters, item => item === undefined)) {
					validFilterRequest = false;
				}

				if(!leadingStructuresFilters || !leadingStructuresFilters.length) {
					leadingStructuresFilters.push({Token: 'FILTER_BY_STRUCTURE:' + structureKey, Value: null});
				}
				if(structureKey === 'BAS_COSTGROUP'){
					var selectedCostGroupCatEntity = $injector.get('costGroupCatalogService').getSelected();
					if(selectedCostGroupCatEntity){
						leadingStructuresFilters.push({Token: 'BAS_COSTGROUP_CAT', Value: selectedCostGroupCatEntity.Id});
					}
				}
				filterRequest.FurtherFilters = filterRequest.FurtherFilters ? _.concat(filterRequest.FurtherFilters, leadingStructuresFilters) : leadingStructuresFilters;
			}

			function findItemByKey(key, allItems, itemTosearch, doMergeWithAggrItems) {
				let matchedItem;
				if(!allItems || !allItems.length || !itemTosearch){
					return matchedItem;
				}

				switch(key){
					case 'estimateMainBoqService':
						PKey1 = 'BoqItemFk';
						PKey2 = 'BoqHeaderFk';
						matchedItem = doMergeWithAggrItems ? _.find(allItems, {BoqItemFk : itemTosearch[PKey1], BoqHeaderFk : itemTosearch[PKey2]})
							: _.find(allItems, {Id : itemTosearch[PKey1], BoqHeaderFk : itemTosearch[PKey2]});
						break;
					case 'costGroupStructureDataServiceFactory':
						PKey1 = 'CostGroupFk';
						PKey2 = 'CostGroupCatFk';
						matchedItem = doMergeWithAggrItems ? _.find(allItems, {CostGroupFk : itemTosearch[PKey1], CostGroupCatalogFk : itemTosearch[PKey2]})
							: _.find(allItems, {Id : itemTosearch[PKey1], CostGroupCatalogFk : itemTosearch[PKey2]});
						break;
					default:
						PKey1 = '';
						PKey2 = '';
						break;
				}
				return matchedItem;
			}

			function setData(key, data) {
				structure2NoLeadQtyItems = structure2NoLeadQtyItems ? structure2NoLeadQtyItems : {};
				structure2NoLeadQtyItems[key] = data;
			}

			function updateData(key, data) {
				let existingItems = getData(key);
				if(existingItems && existingItems.length){
					angular.forEach(data, function (item){
						let matchedItem = findItemByKey(key, existingItems, item, true);
						if(matchedItem){
							angular.extend(matchedItem, item);
						}else{
							existingItems.push(item);
						}
					});
					setData(key, existingItems);
				}else{
					setData(key, data);
				}
			}

			function getData(key) {
				if(_.isString(key) && structure2NoLeadQtyItems && _.size(structure2NoLeadQtyItems)){
					let items = structure2NoLeadQtyItems[key];
					return items && items.length ? items : [];
				}else{
					return [];
				}
			}

			function extendLeadingStrctureItems(structKey){
				let aggrData = getData(structKey);
				let structureItems = $injector.get(structKey).getList();

				if(!structureItems){
					return;
				}

				let result = [];
				angular.forEach(aggrData, function (aggrItem) {
					if(aggrItem){
						let matchedItem = findItemByKey(structKey, structureItems, aggrItem, false);
						if (matchedItem) {
							matchedItem.AggrQuantityTotal = aggrItem.QuantityTotal;
							matchedItem.AggrHoursUnit = aggrItem.HoursUnit;
							matchedItem.AggrHoursTotal = aggrItem.HoursTotal;
							matchedItem.AggrCostUnit = aggrItem.CostUnit;
							matchedItem.AggrCostTotal = aggrItem.CostTotal;

							let isExist = _.find(result, {Id : matchedItem.Id, BoqHeaderFk : matchedItem.BoqHeaderFk});
							if(isExist){
								angular.extend(isExist, matchedItem);
							}else{
								result.push(matchedItem);
							}
						}
					}
				});

				switch(structKey){
					case 'estimateMainBoqService':
						service.onBoQLeadQtyAggregatorUpdated.fire(result);
						break;
					case 'costGroupStructureDataServiceFactory':
						service.onCostGroupLeadQtyAggregatorUpdated.fire(result);
						break;
					default:
						break;
				}
			}

			function aggregateLeadQuantity(dataServiceName){

				if(!_.isString(dataServiceName)){
					return;
				}
				let selectedStrKey = dataServiceName;
				let readData = getReadData(selectedStrKey);

				if(!validFilterRequest && !isFilterEmpty){
					return;
				}

				$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/calculateaggregatequantities', readData)
					.then(function(response) {
						let leadQtyAggrItems = response && response.data ? response.data : [];
						if(leadQtyAggrItems && leadQtyAggrItems.length){
							updateData(selectedStrKey, leadQtyAggrItems);
							extendLeadingStrctureItems(selectedStrKey);
						}
					}, function error() {}
					);
			}

			angular.extend(service, {
				aggregateLeadQuantity : aggregateLeadQuantity,
				onBoQLeadQtyAggregatorUpdated : new Platform.Messenger(),
				onCostGroupLeadQtyAggregatorUpdated : new Platform.Messenger()
			});

			return service;
		}
	]);
})(angular);

