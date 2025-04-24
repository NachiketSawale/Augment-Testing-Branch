/**
 * Created by mik on 22/04/2020.
 */

(function () {
	'use strict';
	/**
	 * @ngdoc service
	 * @name ppsMasterDataServiceFactory
	 * @function
	 *
	 * @description
	 * Service to handle all data from a specific type.
	 **/

	var moduleName = 'productionplanning.common';
	angular.module('platform').factory('ppsMasterDataServiceFactory', PpsMasterDataServiceFactory);

	PpsMasterDataServiceFactory.$inject = ['_', '$http', '$q', '$timeout', '$rootScope',
		'PlatformMessenger',
		'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'platformDataServiceValidationErrorHandlerExtension'];

	function PpsMasterDataServiceFactory(_, $http, $q, $timeout, $rootScope,
										 PlatformMessenger,
										 platformDataServiceFactory,
										 platformDataServiceProcessDatesBySchemeExtension,
										 platformDataServiceValidationErrorHandlerExtension) {

		/*****************************************************************************************
		 *      Factory
		 *****************************************************************************************/

		var factory = {};

		/*****************************************************************************************
		 *      Factory private members
		 *****************************************************************************************/

		var masterDataServices = [];

		function createNewMasterDataService(config) {

			var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor({
				typeName: config.dataProcessor.typeName,
				moduleSubModule: config.dataProcessor.moduleSubModule
			});

			var defaultServiceOptions = {
				flatLeafItem: {
					module: moduleName,
					dataProcessor: [dateProcessor],
					serviceName: getServiceNameByIdentifier(config.id || config.dataServiceContainer.service.getItemName()),
					entityRole: {
						leaf: {
							itemName: config.itemName || config.dataServiceContainer.service.getItemName(),
							parentService: config.parentService || config.dataServiceContainer.service.parentService()
						}
					},
					presenter: {}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(defaultServiceOptions);
			initMasterDataService(serviceContainer, config);
			return serviceContainer.service;
		}

		function getServiceNameByIdentifier(serviceId) {
			return serviceId + 'PpsMasterDataService';
		}

		function mdsValidate(validation, slaveEntity, masterEntity) {
			_.forEach(validation.properties, function (property) {
				if (_.isFunction(validation.service['validate' + property])) {
					validation.service['validate' + property](slaveEntity, masterEntity[property], property);
				}
			});
		}

		// [DEPRECATED]
		// function findMasterDataServiceBySlaveDataService(slaveDataService) {
		// 	return _.find(masterDataServices, function (masterDataService) {
		// 		return masterDataService.isRegistered(slaveDataService);
		// 	});
		// }

		/*****************************************************************************************
		 *      Factory public members
		 *****************************************************************************************/


		/**
		 * @ngdoc function
		 * @name registerServiceToMasterDataService
		 * @description Public function that registers a dataService (and optionally a grid) to masterDataService
		 *
		 * @param {Object} config: The configuration object.
		 * @param {Object} [config.dataServiceContainer]:	DataServiceContainer that will become the slave data service.
		 * 													If none is passed, the masterDataService will still be created and returned
		 * 													but all other optional config properties are required.
		 * @param {string} [config.id]:	Optional identifier of the masterDataService.
		 * 								DataServices with the same config id will become slaves of the same data service.
		 * 								Needs to be unique.
		 * 								If no id is passed, the itemName of the passed dataService will be used.
		 * @param {Object} config.matchConfig: Object with config to find entities in the masterDataService. masterDataId: slaveId
		 * @param {Object} config.propertyConfig: Config object that contains settings to find a list of property keys that are part of the master service dto.
		 * @param {string} config.propertyConfig.endpoint: 	Endpoint (excluding webApiBaseUrl) to fetch a list of properties that will become the service's propertyList.
		 * 													Expects a string array as response.
		 * @param {Array} config.propertyConfig.propertyList: 	String array that contains all properties that are merged from and to the master/slave entities.
		 * 														If config.propertyConfig.endpoint is defined, this will be ignored.
		 * @param {string} [config.itemName]: 	Optional identifier for the entity name of the masterDataService.
		 * 										If none is passed, the itemName of the passed dataService will be used.
		 * @param {Object} [config.parentService]: 	Optional dataService that will become the masterDataService's parent service.
		 * 										If none is passed, the parentService of the passed service will be used.
         * @param {Object} [config.independentEntity]: 	Optional boolean flag to indicate if the service has its own update dto.
		 * 										If none is passed, the slave service will never mark any of its entities as modified.
		 * @param {Object} [config.overwriteEntity]: 	Optional boolean flag to indicate if the service overrules the mds when updating the dto.
		 * 										If non is passed, the slave service will not overrule the update dto.
		 * @param {Object} [config.validation.service]: Optional validation service for each registered slaveservice.
		 * @param {Object} [config.validation.properties]: Optional validation service properties. These properties will be validated.
		 *
		 * @returns {Object} The masterDataService that the passed dataService is now registered to.
		 **/
		factory.registerServiceToMasterDataService = function registerServiceToMasterDataService(config) {

			// console.log('MasterDataService feature not active yet!');
			// return;

			var masterDataService = _.find(masterDataServices, function (rs) {
				return rs.getServiceName() === getServiceNameByIdentifier(config.id || config.dataServiceContainer.service.getItemName());
			});

			//if not yet created: create masterdata service
			if (_.isUndefined(masterDataService)) {
				masterDataService = createNewMasterDataService(config);
				masterDataServices.push(masterDataService);
			}

			//if a dataService is passed, register it to the masterDataService
			if (!_.isNil(config.dataServiceContainer)) {
				masterDataService.addSlaveService(config);
			}
			return masterDataService;
		};


		/**
		 * @ngdoc function
		 * @name getMasterDataService
		 * @description Public function that searches the existing masterDataServices by its id.
		 *
		 * @param {Object|string} match: The data that will be used to identify the matching masterDataService.
		 * 		string: Identifier of a masterDataService.
		 * 		Object: The dataService that is registered to a masterDataService.
		 *
		 * @returns {Object} The masterDataService that was found. Undefined if no service exists.
		 **/
		factory.getMasterDataService = function getMasterDataService(match) {
			if (_.isString(match)) {
				return _.find(masterDataServices, function (rs) {
					return rs.getServiceName() === getServiceNameByIdentifier(match);
				});
			} else if (_.isObject(match)) {
				return _.find(masterDataServices, function (rs) {
					return rs.isRegistered(match);
				});
			}
		};


		/*****************************************************************************************
		 *      Service
		 *****************************************************************************************/

		function initMasterDataService(serviceContainer, config) {

			/*****************************************************************************************
			 *      Service private members
			 *****************************************************************************************/

			var service = serviceContainer.service;
			var registeredServiceContainer = [];
			var propertyList = [];

			if (_.has(config, 'propertyConfig')) {
				if (!_.isNil(config.propertyConfig.endpoint)) {
					$http.get(globals.webApiBaseUrl + config.propertyConfig.endpoint)
						.then(function (result) {
							propertyList = propertyList.concat(result.data);
							_.forEach(registeredServiceContainer, function (slaveServiceContainer) {
								if (!_.isEmpty(slaveServiceContainer.data.itemList)) {
									service.mergeData(slaveServiceContainer);
								}
							});
						});
				}
				if (!_.isNil(config.propertyConfig.propertyList)) {
					propertyList = propertyList.concat(config.propertyConfig.propertyList);
				}
			}


			/**
			 * @ngdoc function
			 * @name mergeProperties
			 * @description Private function to merge property values from one entity to another, filtered by the configured list of property keys.
			 *
			 * @param {Object} destinationEntity: Entity that will be updated.
			 * @param {Object} sourceEntiy: Entity that will be used to assign new values.
			 *
			 **/
			function mergeProperties(destinationEntity, sourceEntiy, keepExisting) {
				if (!_.isNil(propertyList) && !_.isEmpty(propertyList)) {
					_.forEach(propertyList, function (propertyKey) {
						if (!_.isUndefined(sourceEntiy[propertyKey]) && (!keepExisting || _.isUndefined(destinationEntity[propertyKey]))) {
							if (_.isFunction(sourceEntiy[propertyKey])) {
								destinationEntity[propertyKey] = sourceEntiy[propertyKey];
							} else {
								destinationEntity[propertyKey] = _.cloneDeep(sourceEntiy[propertyKey]);
							}
						} else {
							// eslint-disable-next-line no-self-assign
							destinationEntity[propertyKey] = destinationEntity[propertyKey];
						}
					});
				}
			}

			/**
			 * @ngdoc function
			 * @name findEntity
			 * @description Private function to find a matching entity in a list of slave or masterData entities.
			 *
			 * @param {Object} entity: Entity that will be updated.
			 * @param {Array} list: Entity that will be used to assign new values.
			 * @param {bool} isMasterList: True if the list is a list of master entities and the passed entity a slave entity. Vice versa if false.
			 * @param {Object} matchConfig: Config object that contains the property names of the masterData entity as keys
			 * and the matching property name of the slaveData entity as value.
			 * @param {[Function]} Optional filter function that removes all unwanted entities from the list.
			 *
			 * @return {Array} The found entities. Empty if no object was found.
			 **/
			function findEntities(entity, list, isMasterList, matchConfig, filter) {
				if (_.isFunction(filter) && !isMasterList) {
					list = _.filter(list, filter);
				}
				var foundEntities = _.filter(list, function (listEntity) {
					return _.every(matchConfig, function (slaveProp, masterProp) {
						if (isMasterList) {
							return listEntity[masterProp] === entity[slaveProp];
						} else {
							return listEntity[slaveProp] === entity[masterProp];
						}
					});
				});
				return foundEntities;
			}

			/**
			 * @ngdoc function
			 * @name findSlaveEntities
			 * @description Private function to find a matching slave entity in a list of entities by its matching masterDataEntity.
			 *
			 * @param {Object} slaveServiceContainer: Container of the slave service.
			 * @param {Object} masterDataEntity: Master data entity.
			 *
			 * @return {Array} The found entities. Empty if no object was found.
			 **/
			function findSlaveEntities(slaveServiceContainer, masterDataEntity) {
				var slaveItemList = slaveServiceContainer.data.itemList;
				var matchConfig = slaveServiceContainer.data.matchConfig;
				var filter = slaveServiceContainer.data.masterDataFilter;
				return findEntities(masterDataEntity, slaveItemList, false, matchConfig, filter);
			}

			/**
			 * @ngdoc function
			 * @name findMasterEntity
			 * @description Private function to find a matching master entity in a list of entities by its matching slaveDataEntity.
			 *
			 * @param {Object} slaveServiceContainer: Container of the slave service.
			 * @param {Object} slaveDataEntity: Slave data entity.
			 *
			 * @return {Object} The found entity. Undefined if no object was found.
			 **/
			function findMasterEntity(slaveServiceContainer, slaveDataEntity) {
				var masterItemList = serviceContainer.data.itemList;
				var matchConfig = slaveServiceContainer.data.matchConfig;
				var filter = slaveServiceContainer.data.masterDataFilter;
				return _.head(findEntities(slaveDataEntity, masterItemList, true, matchConfig, filter));
			}

			/**
			 * @ngdoc function
			 * @name findMasterEntity
			 * @description Private function to find a matching master entity in a list of entities by its matching slaveDataEntity.
			 *
			 * @param {Object} slaveServiceContainer: Container of the slave service.
			 * @param {Object} slaveDataEntity: Slave data entity.
			 *
			 * @return {Object} The found entity. Undefined if no object was found.
			 **/
			function mergeSlaveServiceModifications(slaveServiceContainer) {
				if (slaveServiceContainer.data.markedItems.length > 0) {
					service.masterDataChanged(slaveServiceContainer, slaveServiceContainer.data.markedItems, true);
					slaveServiceContainer.data.markedItems = [];
				}
			}

			/**
			 * @ngdoc function
			 * @name mergeAllModifications
			 * @description Private function to instantly force all slave services to merge their modifications to the master service.
			 **/
			function mergeAllModifications() {
				_.forEach(registeredServiceContainer,mergeSlaveServiceModifications);
			}

			/*****************************************************************************************
			 *      Service public members
			 *****************************************************************************************/

			service.isRegistered = function isRegistered(dataService) {
				return !_.isNil(_.find(registeredServiceContainer.service, dataService));
			};

			service.addSlaveService = function addSlaveService(config) {
				var slaveServiceContainer = config.dataServiceContainer;
				if (service.isRegistered(slaveServiceContainer.service)) {
					// eslint-disable-next-line no-console
					console.warn('Service: [' + slaveServiceContainer.service.getServiceName() + '] already registered to masterDataService [' + service.getServiceName() + '].');
				} else {
					slaveServiceContainer.data.matchConfig = config.matchConfig;
					slaveServiceContainer.data.masterDataFilter = config.filter;
					slaveServiceContainer.data.independentEntity = config.independentEntity;
					slaveServiceContainer.data.overwriteEntity = config.overwriteEntity;
					slaveServiceContainer.data.mergeDataAsync = config.mergeDataAsync || false;

					slaveServiceContainer.service.mdsValidation = config.validation;

					var dataServiceListLoadedCallback = function () {
						if (slaveServiceContainer.data.itemList.length > 0) {
							service.mergeData(slaveServiceContainer);
						}
					};
					slaveServiceContainer.service.registerListLoaded(dataServiceListLoadedCallback);

					slaveServiceContainer.service.masterDataServiceTimeout = false;
					slaveServiceContainer.data.markedItems = [];
					slaveServiceContainer.service.markItemAsModified = function markMasterDataAsModified(item) {
						//if slave service has independent entity, mark it as modified
						if (slaveServiceContainer.data.independentEntity ) {
							slaveServiceContainer.data.markItemAsModified(item, slaveServiceContainer.data);
						}

						_.remove(slaveServiceContainer.data.markedItems, function(mItem) {
							return mItem.Id === item.Id;
						});
						slaveServiceContainer.data.markedItems.push(item);
						if (!_.isUndefined(slaveServiceContainer.data.mergeDataAsync) && slaveServiceContainer.data.mergeDataAsync) {
							clearTimeout(slaveServiceContainer.service.masterDataServiceTimeout);
							if (slaveServiceContainer.data.markedItems.length > 0) {
								slaveServiceContainer.service.masterDataServiceTimeout = $timeout(function () {
									mergeSlaveServiceModifications(slaveServiceContainer);
								});
							}
						} else {
							mergeSlaveServiceModifications(slaveServiceContainer);
						}
					};

					registeredServiceContainer.push(slaveServiceContainer);
				}
			};

			service.onMasterDataChanged = new PlatformMessenger();

			/**
			 * @ngdoc function
			 * @name mergeData
			 * @description Public function to merge new incoming slave data to masterData and returns correct list of entities.
			 *
			 * @param {Array} data: data to merge into masterData
			 * @param {Object} matchConfig: Object with key value pair to find data in the masterData.
			 *
			 * @return {Array} returnValues: Array of given data merged with masterData values.
			 **/
			service.mergeData = function (slaveContainer) {
				var returnValues = [];

				_.forEach(slaveContainer.data.itemList, function (slaveEntity) {
					if (_.isFunction(slaveContainer.data.filter) && !slaveContainer.data.filter(slaveEntity)) {
						return;
					}
					// check if entity already exists in masterData
					var foundData = findMasterEntity(slaveContainer, slaveEntity);
					if (!_.isEmpty(propertyList)) {
						if (_.isUndefined(foundData)) {
							// add data to masterData
							var newMasterServiceEntity = {};
							//set matchConfig properties with given keys
							_.forEach(slaveContainer.data.matchConfig, function (slaveKey, masterKey) {
								newMasterServiceEntity[masterKey] = _.cloneDeep(slaveEntity[slaveKey]);
							});
							mergeProperties(newMasterServiceEntity, slaveEntity);
							serviceContainer.data.itemList.push(newMasterServiceEntity);
						} else {
							//if entity already exists, merge possible undefined properties
							mergeProperties(foundData, slaveEntity, true);
							// merge attributes from masterData to given data
							mergeProperties(slaveEntity, foundData);
						}
					}
					returnValues.push(slaveEntity);
				});

				return returnValues;
			};


			service.setData = function setData(item, slaveServiceContainer) {
				var matchingMasterEntity = findMasterEntity(slaveServiceContainer, item);
				if (!_.isUndefined(matchingMasterEntity)) {
					mergeProperties(matchingMasterEntity, item);
				}
				return matchingMasterEntity;
			};


			service.customMasterDataChanged = function customMasterDataChanged(itemList, config) {
				var virtualContainer = {
					data: {
						itemList: itemList,
						matchConfig: {
							Id : 'Id'
						}
					}
				};
				if (!_.isUndefined(config)){
					_.assign(virtualContainer.data, config);
				}
				service.masterDataChanged(virtualContainer, itemList, false);
			};

			service.masterDataChanged = function masterDataChanged(triggerServiceContainer, items, doMarkAsModified) {
				var masterDataEntities = [];
				//set changed master data
				_.forEach(items, function(item) {
					// validate before setData in masterDataEntity
					_.forEach(registeredServiceContainer, function (slaveServiceContainer) {
						if (slaveServiceContainer.service.mdsValidation) {
							//_.forEach(masterDataEntities, function (masterEntity) {
							var matchingMasterdataEntity = findMasterEntity(slaveServiceContainer, item);
							if (!_.isEmpty(matchingMasterdataEntity)) {
								//_.forEach(matchingSlaveEntities, function (slaveEntity) {
									mdsValidate(slaveServiceContainer.service.mdsValidation, item, matchingMasterdataEntity);
								//});
							}
							//});
						}
					});

					var masterDataEntity;
					masterDataEntity = service.setData(_.cloneDeep(item), triggerServiceContainer);
					if (!_.isUndefined(masterDataEntity)) {
						masterDataEntities.push(masterDataEntity);
					}
				});
				if (triggerServiceContainer.data.overwriteEntity || triggerServiceContainer.data.independentEntity) {
					//if trigger service is independent or overwrite entity -> mark as modified in slave
					_.forEach(items, function(item) {
						triggerServiceContainer.data.markItemAsModified(item, triggerServiceContainer.data);
					});
					//if trigger service is overwrite entity -> unmark mds entity
					if (triggerServiceContainer.data.overwriteEntity) {
						serviceContainer.data.doClearModifications(masterDataEntities, serviceContainer.data);
						doMarkAsModified = false;
					}
				}

				if (!_.isEmpty(masterDataEntities)) {
					_.forEach(registeredServiceContainer, function (slaveServiceContainer) {

						if (triggerServiceContainer.service === slaveServiceContainer.service) {
							//if slave service has overwrite entity -> remove modified item from master data service and mark in slave!
							if (slaveServiceContainer.data.overwriteEntity) {
								serviceContainer.data.doClearModifications(items, serviceContainer.data);
								slaveServiceContainer.data.markItemAsModified(items, slaveServiceContainer.data);
							}

							// validate if slaveservice has a registered validationservice
							// if (slaveServiceContainer.service.mdsValidation) {
							// 	_.forEach(masterDataEntities, function (masterEntity) {
							// 		var matchingSlaveEntities = findSlaveEntities(slaveServiceContainer, masterEntity);
							// 		if (!_.isEmpty(matchingSlaveEntities)) {
							// 			_.forEach(matchingSlaveEntities, function (slaveEntity) {
							// 				mdsValidate(slaveServiceContainer.service.mdsValidation, slaveEntity, masterEntity);
							// 			});
							// 		}
							// 	});
							// }

							return;
						}
						var hasUpdatedEntity = false;
						var hasOverwrittenEntity = false;
						_.forEach(masterDataEntities, function (masterEntity) {
							var matchingSlaveEntities = findSlaveEntities(slaveServiceContainer, masterEntity);
							if (!_.isEmpty(matchingSlaveEntities)) {
								hasUpdatedEntity = true;
								_.forEach(matchingSlaveEntities, function (slaveEntity) {
									// if (slaveServiceContainer.service.mdsValidation) {
									// 	mdsValidate(slaveServiceContainer.service.mdsValidation, slaveEntity, masterEntity);
									// }
									mergeProperties(slaveEntity, masterEntity);
								});
								//if slave service overwrites the mds -> do not mark as modified and mark in slave service!
								if (slaveServiceContainer.data.overwriteEntity && doMarkAsModified){
									hasOverwrittenEntity = true;
									serviceContainer.data.doClearModifications(masterEntity, serviceContainer.data);
									_.forEach(matchingSlaveEntities, function(item) {
										slaveServiceContainer.data.markItemAsModified(item, slaveServiceContainer.data);
									});
								}
							}
						});
						if (hasOverwrittenEntity) {
							doMarkAsModified = false;
						}
						if (hasUpdatedEntity) {
							if (_.isFunction(slaveServiceContainer.service.masterDataChanged)) {
								slaveServiceContainer.service.masterDataChanged(masterDataEntities);
							} else {
								slaveServiceContainer.service.gridRefresh();
							}
						}
					});
					if (doMarkAsModified) {
						service.markEntitiesAsModified(masterDataEntities);
					}
					service.onMasterDataChanged.fire(masterDataEntities);
				}
			};

			//registration of update request #116078
			// function getRootService(dataService) {
			// 	if (dataService.isRoot) {
			// 		return dataService;
			// 	} else {
			// 		return getRootService(dataService.parentService());
			// 	}
			// }
			// var rootService = getRootService(service);
			// $rootScope.$on('updateRequested', function () {
			//
			// 	return platformDataServiceValidationErrorHandlerExtension.assertAllValid(rootService, false).then(function(result) {
			// 		if (result) {
			// 			mergeAllModifications();
			// 		}
			// 	});
			// });
		}

		return factory;
	}
})();
