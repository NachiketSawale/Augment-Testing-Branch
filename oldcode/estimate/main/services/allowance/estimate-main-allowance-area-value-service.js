(function(angular){
	/* global globals */
	'use strict';
	let module = angular.module('estimate.main');
	module.factory('estimateMainAllowanceAreaValueService',['_', 'platformDataServiceFactory', 'estimateMainStandardAllowancesDataService',
		'platformDataServiceDataProcessorExtension',
		function(_, platformDataServiceFactory, estimateMainStandardAllowancesDataService, platformDataServiceDataProcessorExtension){
			let entities = [];
			let options = {
				flatLeafItem: {
					module: module,
					serviceName: 'estimateMainAllowanceAreaValueService',
					httpCreate: {route: globals.webApiBaseUrl + 'estimate/main/allowancearea/', endCreate: 'createAreaValue'},
					httpRead: {
						useLocalResource: true,
						resourceFunction: function () {
							return entities;
						}},
					actions: {delete: true, create: 'flat'},
					entityRole: {
						leaf: {
							itemName: 'Area2GcAreaValue',parentService: estimateMainStandardAllowancesDataService
						}
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData, data, creationOptions) {
								creationData.EstAllowanceFk = estimateMainStandardAllowancesDataService.getSelected().Id;
								if(creationOptions){
									angular.extend(creationData, creationOptions);
								}
							},
							incorporateDataRead: function (itemList, data) {
								return container.data.handleReadSucceeded(itemList, data);
							}
						}
					},
					useItemFilter: true
				}
			};

			let container = platformDataServiceFactory.createNewComplete(options);
			let service = container.service;

			container.service.setEntities = function(values){
				entities = [];
				if(values){
					let id2EntityMap = {};

					_.forEach(entities, function (entity){
						id2EntityMap[entity.Id] = true;
					});

					_.forEach(values, function(value){
						if(!id2EntityMap[value.Id]){
							entities.push(value);
						}
					});

					_.forEach(entities, function(value){
						container.data.itemList.push(value);
					});
				}
			};

			container.service.addEntity = function(entity){
				if(entity){
					entities.push(entity);
				}
			};

			function generateUpdateDoneFunc(container){
				let dataService = container.data;
				return function handleUpdateDone(updateData, response){
					if(response.Area2GcAreaValueToSave){
						angular.forEach(response.Area2GcAreaValueToSave, function (item) {
							if(item){
								let oldItem = _.find(dataService.itemList, {Id: item.Id});

								if (oldItem) {
									dataService.mergeItemAfterSuccessfullUpdate(oldItem, item, true, dataService);
									platformDataServiceDataProcessorExtension.doProcessItem(oldItem, dataService);
								}
							}
						});
					}
				};
			}

			service.handleUpdateDone = generateUpdateDoneFunc(container);

			service.reSetList = function (deleteArea, isGcArea) {
				let area2GcAreaValues = service.getList();
				area2GcAreaValues = _.filter(area2GcAreaValues,function (item) {
					return isGcArea ? item.EstAllowanceGcAreaFk !== deleteArea.Id : item.EstAllowanceAreaFk !== deleteArea.Id;
				});
				service.setList(area2GcAreaValues);
			};
			return service;
		}]);
})(angular);