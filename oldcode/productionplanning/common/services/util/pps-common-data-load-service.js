/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name productionplanning.common:ppsCommonDataLoadService
	 * @function
	 * @requires
	 * @description
	 * ppsCommonDataLoadService loads data without overwriting loaded data
	 */
	angular.module('productionplanning.common').service('ppsCommonDataLoadService', PpsCommonDataLoadService);

	PpsCommonDataLoadService.$inject = ['$http', '_', 'platformDataServiceDataProcessorExtension',
		'cloudCommonGridService',
		'$injector'];

	function PpsCommonDataLoadService($http, _, platformDataServiceDataProcessorExtension,
		cloudCommonGridService,
		$injector) {

		/**
		 * @ngdoc function
		 * @name addSideloadFunctionality
		 * @function
		 * @methodOf productionplanning.common.PpsCommonDataServiceSideloadExtension
		 * @description adds methods to enable sideloading data
		 * @param container {object} contains entire service and its data to be created
		 * @returns
		 */
		var service = this;

		service.readData = function readData(container, filter) {
			return loadData(container, filter, false);
		};

		service.updateData = function readData(container, filter) {
			return loadData(container, filter, true);
		};

		service.doFetchData = function doFetchData(route, filter) {
			return $http.post(route, filter).then(function (response) {
				return response;
			});
		};

		service.processRespone = function processRespone(container, response) {
			var items;
			if (Object.prototype.hasOwnProperty.call(response.data, 'dtos')) {
				items = response.data.dtos;
			} else {
				items = response.data || [];
			}
			platformDataServiceDataProcessorExtension.doProcessData(items, container.data);
			return items;
		};

		const handlePpsItem = (container, items, merge) =>{
			let subItemService = $injector.get('productionplanningItemSubItemDataService');
			const simpleProcessors = _.filter(container.service.getDataProcessor(), function (proc) {
				return _.isFunction(proc.processItem) && proc.processItem.length === 1;
			});
			if (merge) {
				let flatItems = [];
				let childItems = [];
				let rootItem;
				_.forEach(items, function (item){
					container.service.setDefaultDrawingFromParent(item);
				});
				flatItems = cloudCommonGridService.flatten(items, flatItems, 'ChildItems');
				_.forEach(simpleProcessors, function (processor) {
					_.forEach(flatItems, processor.processItem);
				});
				_.forEach(flatItems, function (updatedEntity) {
					let outdatedEntity = container.service.getItemById(updatedEntity.Id);
					if (!_.isNil(outdatedEntity)) {
						if (updatedEntity.PPSItemFk === null) {
							rootItem = outdatedEntity;
							childItems = angular.copy(outdatedEntity.ChildItems);
							angular.extend(outdatedEntity, updatedEntity);
						} else {
							let outdatedEntity = container.service.getItemById(updatedEntity.Id);
							if(outdatedEntity) {
								angular.extend(outdatedEntity, updatedEntity);
							}

							let outdatedSubItem = _.find(childItems, {Id: updatedEntity.Id});
							if(outdatedSubItem) {
								angular.extend(outdatedSubItem, updatedEntity);
							}

							outdatedSubItem = subItemService.getItemById(updatedEntity.Id);
							if(outdatedSubItem) {
								angular.extend(outdatedSubItem, updatedEntity);
							}
						}
					}
				});
				rootItem.ChildItems = childItems;
				subItemService.gridRefresh();
				const excludedSerices = $injector.get('productionplanningItemUtilService').getExcludedChildServicesForRefreshing();
				service.getChildServices().filter(childService => !_.some(excludedSerices, (excludedSerice) => childService === excludedSerice)).forEach(childService => childService.load());
			}
		};

		function loadData(container, filter, merge) {
			return service.doFetchData(container.data.httpReadRoute + container.data.endRead, filter).then(function (response) {
				let items = service.processRespone(container, response);
				if(container.service.getServiceName() === 'productionplanningItemDataService'){
					handlePpsItem(container, items, merge);
				}else {
					if (merge) {
						_.forEach(items, function (updatedEntity) {
							var outdatedEntity = _.find(container.data.itemList, {Id: updatedEntity.Id});
							if (!_.isNil(outdatedEntity)) {
								_.assign(outdatedEntity, updatedEntity);
							}
						});
					}
				}
				container.data.dataModified.fire();
				return items;
			});
		}

		return service;
	}
})(angular);