(function () {
	'use strict';
	/* global angular, globals, _ */

	var moduleName = 'productionplanning.productionplace';
	var serviceName = 'ppsProductionPlacePlanningBoardDemandService';

	angular.module(moduleName).factory(serviceName, DemandService);

	DemandService.$inject = ['$http','platformDataServiceFactory', 'ppsProductionPlaceDataService', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsLookupdataLookupDescriptorService'];

	function DemandService($http, platformDataServiceFactory, ppsProductionPlaceDataService, platformDataServiceProcessDatesBySchemeExtension,
		basicsLookupdataLookupDescriptorService) {
		var container = null;

		var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor({
			typeName: 'PpsPhaseDto', moduleSubModule: 'Productionplanning.ProcessConfiguration'
		});
		var serviceOption = {
			flatNodeItem: {
				module: moduleName,
				serviceName: serviceName,
				entityNameTranslationID: 'productionplanning.item.entityItem',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/item/',
					endRead: 'getByPlanningBoardFilter',
					endDelete: 'multidelete',
					usePostForRead: true,
					initReadData: function (readData) {
						readData.SiteIdList = Array.from(new Set(_.map(ppsProductionPlaceDataService.getList(), 'BasSiteFk')));
						readData.From = container.data.filter.From;
						readData.To = container.data.filter.To;
					}
				},
				dataProcessor: [dateProcessor],
				actions: {
					delete: {},
					create: {}
				},
				entitySelection: { supportsMultiSelection: true },
				entityRole: {
					node: {
						itemName: 'PPSItem',
						parentService: ppsProductionPlaceDataService
					}
				},
				useItemFilter: true
			}
		};

		container = platformDataServiceFactory.createNewComplete(serviceOption);

		container.data.doNotUnloadOwnOnSelectionChange = true;
		container.data.doNotLoadOnSelectionChange = true;

		// cache for modified demands
		container.service.modifiedDemands = [];

		container.service.setUuid = (uuid) => {
			container.data.gridUuId = uuid;
		};

		function changeQuantityProperties(demand, value) {
			demand.AssignedQuantity += value;
			demand.OpenQuantity -= value;
		}

		function updateResultByModifiedDemandsList(newDemandList) {
			container.service.modifiedDemands.forEach(function (modifiedDemand) {
				let indexOfDemand = _.findIndex(newDemandList, newDemand => newDemand.Id === modifiedDemand.Id);
				if (indexOfDemand !== -1) {
					_.merge(newDemandList[indexOfDemand], modifiedDemand);
				}
			});
		}


		function updateModifiedDemandsList(newModifiedDemandList) {
			newModifiedDemandList.forEach(function (newModifiedDemand) {
				let indexOfDemand = _.findIndex(container.service.modifiedDemands, modifiedDemand => modifiedDemand.Id === newModifiedDemand.Id);
				if (indexOfDemand !== -1) {
					_.merge(container.service.modifiedDemands[indexOfDemand], newModifiedDemand);
				} else {
					container.service.modifiedDemands.push(newModifiedDemand);
				}
			});
		}

		function changeDemandQuantity(assignment, value) {
			let correspondingDemands = _.filter(container.service.getList(), function (item) {
				return assignment.ProductDescriptionFk === item.ProductDescriptionFk;
			});
			correspondingDemands.forEach(demand => changeQuantityProperties(demand, value));
			updateModifiedDemandsList(correspondingDemands);
			container.service.gridRefresh();
		}

		container.service.increaseDemandQuantity = (assignment) => {
			changeDemandQuantity(assignment, 1);
		};

		container.service.decreaseDemandQuantity = (assignment) => {
			changeDemandQuantity(assignment, -1);
		};

		container.data.gridUuId = '';

		container.data.onReadSucceeded = function inReadResourcesSucceeded(result, data) {
			basicsLookupdataLookupDescriptorService.attachData(result.Lookups);
			if (result.Lookups && result.Lookups.PPSProductDescriptionTiny) {
				basicsLookupdataLookupDescriptorService.updateData('PPSProductDescription', result.Lookups.PPSProductDescriptionTiny);
			}
			updateResultByModifiedDemandsList(result.Dtos);
			data.handleReadSucceeded(result.Dtos, data);
		};

		container.service.unloadSubEntities = function unloadSubEntities() {
			container.service.modifiedDemands = [];
		};

		container.service.updateDemandGridData = (itemIds) => {
			// Return the $http.post promise to ensure it's asynchronous
			return $http.post(globals.webApiBaseUrl + 'productionplanning/item/' + 'getItemsByIds', itemIds)
				 .then(function (response) {
					  if (response.data.Dtos && response.data.Dtos.length > 0) {
							let demands = container.service.getList();
							if(demands){
								response.data.Dtos.forEach(item =>{
									const isPresent = demands.some(demand => demand.Id === item.Id);
									if(!isPresent){
										demands.push(item);
									}
								});
							}
							return true;  // Indicate that the update was successful
					  } else {
							return false; // Indicate that there were no items to update
					  }
				 });
	  	};

		return container.service;
	}
})();