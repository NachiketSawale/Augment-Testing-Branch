/**
 * Created by hof on 24/02/2021.
 */
/* global globals, _ */
(function factoryFn() {
	'use strict';
	/**
	 * @ngdoc service
	 * @name ppsMasterDataServiceFactory
	 * @function
	 *
	 * @description
	 * Service to handle all data from a specific type.
	 **/

	const moduleName = 'productionplanning.common';
	angular.module(moduleName).factory('ppsVirtualDataServiceFactory', PpsMasterDataServiceFactory);

	PpsMasterDataServiceFactory.$inject = ['$http', '$q', '$timeout', '$injector',
		'PlatformMessenger',
		'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'platformDataServiceModificationTrackingExtension',
		'platformModuleStateService',
		'platformRuntimeDataService'];

	function PpsMasterDataServiceFactory($http, $q, $timeout, $injector,
		PlatformMessenger,
		platformDataServiceFactory,
		platformDataServiceProcessDatesBySchemeExtension,
		platformDataServiceModificationTrackingExtension,
		platformModuleStateService,
		platformRuntimeDataService) {

		/*****************************************************************************************
		 *      Factory
		 *****************************************************************************************/

		const factory = {};

		/*****************************************************************************************
		 *      Factory private members
		 *****************************************************************************************/

		const virtualDataServiceContainers = [];


		function createNewVirtualDataService(config) {

			const defaultServiceOptions = {
				// all virtual entities are saved as leaf!
				flatLeafItem: {
					module: config.parentService.getModule(),
					serviceName: getServiceNameByIdentifier(config.id),
					entityNameTranslationID: 'productionplanning.common.event.eventTitle',
					entityRole: {
						leaf: {
							itemName: 'Virtual',
							parentService: config.parentService
						}
					},
					httpRead: {
						route: globals.webApiBaseUrl + config.endpoint.route,
						usePostForRead: true,
						endRead: config.endpoint.read,
						initReadData: function initReadData(readData) {
							_.unset(readData, 'filter');
							_.assign(readData, serviceContainer.data.loadingFilter);
						}
					},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								// additionalPromises
								let customDataRead = !_.isNil(config.customDataRead)? config.customDataRead(readData, data) : $q.when(true);
								// let optionDataRead = serviceContainer.data.optionsInitialized? $q.when(true) : serviceContainer.service.loadOptions();
								let additionalPromises = [customDataRead];

								return $q.all(additionalPromises).then(function handReadData() {
									let result = {
										dtos: serviceContainer.service.addVirtualEntities(readData.dtos)
									};
									return serviceContainer.data.handleReadSucceeded(_.cloneDeep(result.dtos), data);
								});
							}
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(defaultServiceOptions);

			// workaround to be detectable for e.g. logging?
			serviceContainer.service.getContainerData = () => serviceContainer.data;

			$http.get(globals.webApiBaseUrl + 'productionplanning/common/user/hasfullshiftaccessright').then(function (response) {
				// a global variable to check user has access for fulshift icon
				serviceContainer.service.fullshiftPermission = response.data;
			});

			initVirtualDataService(serviceContainer, config);

			return serviceContainer;
		}

		function getServiceNameByIdentifier(serviceId) {
			return `${_.camelCase(serviceId)}PpsVirtualDataService`;
		}

		/*****************************************************************************************
		 *      Factory public members
		 *****************************************************************************************/

		/**
		 * @ngdoc function
		 * @name createVirtualDataService
		 * @description Public function that creates a virtual dataService.
		 * If the service already exists, the existing service is returned instead.
		 *
		 * @param {Object} config: The configuration object.
		 * @param {string} config.id: Identifier of the virtualDataService. Needs to be unique.
		 * @param {Object} config.parentService: DataService that will become the masterDataService's parent service.
		 * @param {Object} config.endpoint: Config obeject that details the endpoint where data is fetched from/stored at the server.
		 * @param {string} config.endpoint.route: Basic route of the endpoints of the service.
		 * @param {string} config.endpoint.endRead: Endpoint to fetch data from server.
		 * @param {Object} config.dateProcessors: Object where each property contains configuratins for date processors.
		 * @param {Object} config.dateProcessors.[].typeName: Type name of the schema used for the date processors of incoming entities of type [EntityName].
		 * @param {Object} config.dateProcessors.[].moduleSubmodule: Full module name of the schema used for the date processors of incoming entities of type [EntityName].
		 * @param {function} [config.customDataRead]: Optional asynchronous (!) method that is called after data is fetched from the server.
		 * @param {function} [config.customServiceRegistration]: Optional method that is called whenever a service registers to the VDS.
		 *
		 * @returns {Object} The container of the virtualDataService that was created.
		 **/
		factory.createVirtualDataService = function createVirtualDataService(config) {

			let virtualDataService = _.find(virtualDataServiceContainers, function findVds(vdsContainer) {
				return vdsContainer.service.getServiceName() === getServiceNameByIdentifier(config.id);
			});

			let virtualDataServiceContainer;
			// if not yet created: create virtual data service
			if (_.isUndefined(virtualDataService)) {
				virtualDataServiceContainer = createNewVirtualDataService(config);
				virtualDataService = virtualDataServiceContainer.service;
				virtualDataServiceContainers.push(virtualDataServiceContainer);
				return virtualDataServiceContainer;
			} else {
				return virtualDataService;
			}
		};


		/**
		 * @ngdoc function
		 * @name getVirtualDataService
		 * @description Public function that searches the existing masterDataServices by its id.
		 *
		 * @param {Object|string} match: The data that will be used to identify the matching virtualDataService.
		 * string: Identifier of a virtualDataService.
		 * Object: The dataService that is registered to a virtualDataService.
		 *
		 * @returns {Object} The virtualDataService that was found. Undefined if no service exists.
		 **/
		factory.getVirtualDataService = function getVirtualDataService(match) {
			let virtualServiceContainer = {};
			if (_.isString(match)) {
				virtualServiceContainer = _.find(virtualDataServiceContainers, function findServiceByName(vdsContainer) {
					return vdsContainer.service.getServiceName() === getServiceNameByIdentifier(match);
				});
			} else if (_.isObject(match)) {
				virtualServiceContainer = _.find(virtualDataServiceContainers, function findServiceByService(vdsContainer) {
					return vdsContainer.service.isRegistered(match);
				});
			}
			return !_.isNil(virtualServiceContainer)? virtualServiceContainer.service : null;
		};


		/**
		 * @ngdoc function
		 * @name getVirtualDataService
		 * @description Public function that registers a serviceContainer to an existing virtualDataServices by its id.
		 *
		 * @param {Object|string} match: The data that will be used to identify the matching VDS.
		 * string: Identifier of a virtualDataService.
		 * Object: A dataService that is registered to a virtualDataService.
		 * @param {string} entityName: The entity name of the actual entities stored by the passed serviceContainer.
		 * @param {Object} serviceContainer: The serviceContainer that is registered to the VDS.
		 * @param {Object} [config]: Optional config object for the registrations.
		 * @param {string} [config.match]: Property name of the actual entity matching the id value of the virtual entity.
		 * @param {Object} [config.validation]: Optional validation config to validate propterties in the VDS
		 * @param {Object} [config.validation.service]: The validation service.
		 * @param {Array} [config.validation.properties]: An array of properties which will be validated.
		 *
		 * @returns {boolean} Returns the VDS if the VDS was found and the passed service container was registered.
		 * Returns false otherwise.
		 **/
		factory.registerToVirtualDataService = function registerToVirtualDataService(match, entityName, serviceContainer, config) {
			let vds = factory.getVirtualDataService(match);
			if (!_.isNil(vds) && !vds.isRegistered(serviceContainer.service)) {
				vds.registerActualService(entityName, serviceContainer, config);
			}
			return !_.isNil(vds) ? vds : false;
		};

		/*****************************************************************************************
		 *      Service
		 *****************************************************************************************/


		function initVirtualDataService(serviceContainer, config){

			const data = serviceContainer.data;
			const service = serviceContainer.service;

			/*****************************************************************************************
			 *      Data members
			 *****************************************************************************************/

			// region data extensions

			// example loading filter
			data.loadingFilter = {
				mainItemIds : [],
				entity : '',
				foreignKey : ''
			};
			// overwrite clear content to NEVER clear content!
			_.unset(data, 'clearContent');
			// initalize empty relations list
			data.relatons = [];
			// intialize virtual entity data
			data.virtualEntities = {};
			// initialize removed virtual entity data cache
			data.removedEntityIdCache = {};

			// region virtual entity options

			// all properties below should eventually be merged to this parent object!
			// i.e.: mapping, prefix, readonly
			data.virtualEntityOptions = {};

			// options initialized flag
			data.httpOptions = config.endpoint.options;
			// options initialized flag
			data.optionsInitialized = false;
			// intialize virtual entity data
			data.entityMappings = config.entityMappings || {};
			// intialize virtual entity properties
			data.entityProperties = {};
			// intialize virtual entity prefixes
			data.entityPrefixes = {};
			// initialize virtual entity readonly option
			data.entityReadOnly = {};
			// initialize validation:
			data.validation = {};
			if (config.validation) {
				_.forEach(config.validation, (cfg, entityName) => {
					data.validation[entityName] = { properties: cfg.properties };
					if (cfg.service) {
						data.validation[entityName].service = cfg.service;
					} else if (cfg.serviceName) {
						data.validation[entityName].service = $injector.get(config.validation.serviceName);
					} else if (cfg.initService) {
						data.validation[entityName].service = cfg.initService(service);
					}
				});
			}

			// endregion

			// intialize registered data services data
			data.registeredServices = {};
			// create processors by entity name
			data.dateProcessors = {};
			_.forEach(config.dateProcessors, function createDateProcessors(dateProcessConfig, entityName) {
				data.dateProcessors[entityName] = platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: dateProcessConfig.typeName,
					moduleSubModule: dateProcessConfig.moduleSubModule
				});
			});
			// on refresh of root data: discard cached data
			data.parentService.registerListLoaded(function clearData() {
				data.itemList.length = 0;
				data.virtualEntities = {};
				data.removedEntityIdCache = {};
			});

			// boolean flag to merge data async in vds
			data.mergeAsync = false;
			// markedItems include all manipluated items
			data.markedItems = [];
			// custom service registration called if a service registers to the VDS.
			data.customServiceRegistration = config.customServiceRegistration;

			// queue for stacking requests
			data.queuedRequest = $q.when(true);
			data.isRequesting = false;

			let runningRequests = 0;
			data.queueRequest = function queueRequest(promiseFn) {
				runningRequests++;
				data.isRequesting = true;
				let lastRequest = data.queuedRequest;
				data.queuedRequest = lastRequest.finally(() => {
					return promiseFn().finally(() => {
						runningRequests--;
						data.isRequesting = runningRequests <= 0;
					});
				});
				return data.queuedRequest;
			};

			data.messageDescriptions = config.messageDescriptions;

			data.queueRequest(loadOptions);

			// endregion

			/*****************************************************************************************
			 *      Service members
			 *****************************************************************************************/

			// region service extensions

			/**
			 * @ngdoc function
			 * @name isRegistered
			 * @description Public function that checks if a passed dataService is registered to the VDS.
			 *
			 * @param {Object} dataService: The dataService that is checked.
			 *
			 * @returns {boolean} Returns true if the passed service is registered to the VDS.
			 **/
			service.isRegistered = function isRegistered(dataService) {
				let allRegisteredServices = _.map(_.flatten(_.values(data.registeredServices)), 'serviceContainer.service');
				return !_.isNil(_.find(allRegisteredServices, (rs) => {
					return rs.getServiceName() === dataService.getServiceName();
				}));
			};

			/**
			 * @ngdoc function
			 * @name registerActualService
			 * @description Public function that registers a serviceContainer to the VDS.
			 *
			 * @param {string} entityName: The entity name of the actual entities stored by the passed serviceContainer.
			 * @param {Object} serviceContainer: The serviceContainer that is registered to the VDS.
			 * @param {Object} [config]: Optional config object for the registrations.
			 * @param {string} [config.match]: Property name of the actual entity matching the id value of the virtual entity.
			 **/
			service.registerActualService = function registerActualService(entityName, serviceContainer, config) {

				// region: Registration

				let registration = {
					serviceContainer: serviceContainer,
					config: config || {}
				};
				if (_.isNil(data.registeredServices[entityName])) {
					data.registeredServices[entityName] = [registration];
				} else {
					data.registeredServices[entityName].push(registration);
				}

				if (!data.itemName || data.itemName === 'Virtual') {
					setItemName(entityName);
				}

				function onEntityCreated(redundantParam, newItem) {
					var virtualPlaceholder = _.cloneDeep(newItem);
					// change Id of placeholder if match differs from 'Id'
					if (registration.config.match) {
						virtualPlaceholder.Id = virtualPlaceholder[registration.config.match];
					}
					// add to virtual data to support remaining functionality!
					if (_.isNil(data.virtualEntities[entityName])) {
						data.virtualEntities[entityName] = [];
					}
					data.virtualEntities[entityName].push(virtualPlaceholder);
					let createdEntity = createGenericEntity(virtualPlaceholder, entityName);
					data.itemList.push(createdEntity);
					// special implementation: If Id is 0??? Still don't know what to do...
				}

				if (_.isFunction(serviceContainer.service.registerEntityCreated)) {
					serviceContainer.service.registerEntityCreated(onEntityCreated);
				}

				function onEntityDeleted(redundantParam, deletedItem) {
					// remove virtual and generic entity
					let deletedItems = _.isArray(deletedItem)? deletedItem : [deletedItem];
					_.forEach(deletedItems, (delItem) => {
						let removedVirtualEntities = _.remove(data.virtualEntities[entityName], (currentEntity) => {
							return currentEntity.Id === delItem[registration.config.match || 'Id'];
						});
						let removedGenericEntities = _.remove(data.itemList, (currentEntity) => {
							return currentEntity.Id === delItem[registration.config.match || 'Id'] &&
								currentEntity.EntityName === entityName;
						});
						if (_.isEmpty(removedVirtualEntities) && _.isEmpty(removedGenericEntities)) {
							if (_.isNil(data.removedEntityIdCache[entityName])) {
								data.removedEntityIdCache[entityName] = [];
							}
							data.removedEntityIdCache[entityName].push(delItem[registration.config.match || 'Id']);
						}
					});
				}

				if (_.isFunction(serviceContainer.service.registerEntityDeleted)) {
					serviceContainer.service.registerEntityDeleted(onEntityDeleted);
				}

				// endregion

				// region: Custom registration

				if (_.isFunction(data.customServiceRegistration)) {
					data.customServiceRegistration(entityName, registration.serviceContainer, registration.config);
				}

				// endRegion

				// region modify registered service container

				// overwrite markAsModified
				serviceContainer.service.markItemAsModified = function markItemAsModifiedVdsOverwrite(item) {
					handleMarkEntitiesAsModified([item], entityName, 'actual', registration.config.match);
				};
				// endregion

			};

			/**
			 * @ngdoc function
			 * @name loadVirtualEntities
			 * @description Public function that loads entities based on a filter.
			 *
			 * @param {Object} filter: The filter object that is directly passed to the read endpoint.
			 **/
			service.loadVirtualEntities = function loadVirtualEntities(filter) {
				return data.queueRequest(() => {
					data.loadingFilter = filter;
					return service.load();
				});
			};

			/**
			 * @ngdoc function
			 * @name addVirtualEntities
			 * @description Public function that adds virtual entities to data.virtualEntities of the VDS.
			 * Additionally creates a generic entity for each virtual entity and adds them to the data.itemList of the VDS.
			 *
			 * @param {Object} dtos: An object where each property contains a list of different dtos.
			 * @param {Object[]} dtos[EntityName]: A list of dtos of the EntityName.
			 *
			 * @returns {Object[]} Returns the current list of generic entities of the VDS.
			 **/
			service.addVirtualEntities = function addVirtualEntities(dtos) {
				// set current generic item list as new item list
				let resultDtoList = data.itemList;
				// todo taking the first one per default seems too optimisitc and can lead to errors when many services registered (this solution has been already used somewhere else in this service...)

				const registrationConfigsMatch = new Map(Object.keys(dtos).map(entityType => {
					const registrationForType = data.registeredServices[entityType]?.length > 0 && data.registeredServices[entityType][0];
					let matchingProperty = registrationForType?.config?.match ?? 'Id';  // 'Id' as fallback if no custom config for entity available

					return [entityType, matchingProperty];
				}));

				const virtualEntityMap = new Map(Object.keys(data.virtualEntities)
					.map(key => [key, new Map(data.virtualEntities[key]
						.map(value => [value[registrationConfigsMatch.get(key)], value[registrationConfigsMatch.get(key)]]))]));

				// iterate result dtos object by proeprties
				_.forEach(dtos, function forEachEntityListFn(newList, propertyKey) {
					// if there are entities in removed cache => remove from new list!
					if (!_.isNil(data.removedEntityIdCache[propertyKey])) {
						_.remove(newList, (nE) => { return _.includes(data.removedEntityIdCache[propertyKey], nE.Id); });
					}

					// get current list or create empty one
					if (!virtualEntityMap.has(propertyKey)) {
						data.virtualEntities[propertyKey] = [];
						virtualEntityMap.set(propertyKey, new Map());
					}

					const itemsToClone = [];
					// process new items!
					processEntities(newList, propertyKey);
					newList.forEach(newItem => {
						const matchOnProperty = registrationConfigsMatch.get(propertyKey) || 'Id';
						// if it doesn't yet exist in the stored lists
						if (virtualEntityMap.get(propertyKey) && !virtualEntityMap.get(propertyKey).has(newItem[matchOnProperty])) {
							// create generic virtual entity
							let newVirtualEntity = createGenericEntity(newItem, propertyKey);
							// add it to both the generic and the specific entity list

							itemsToClone.push(newItem);
							virtualEntityMap.get(propertyKey).set(newItem[matchOnProperty], newItem[matchOnProperty]);

							resultDtoList.push(newVirtualEntity);
						}
					});
					// custom clone deep
					data.virtualEntities[propertyKey].push(...customDeepCopyForVitual(itemsToClone, propertyKey));
				});
				// return the extended dto list
				return resultDtoList;
			};

			/**
			 * @ngdoc function
			 * @name removeVirtualEntities
			 * @description Public function that removes virtual entities from data.virtualEntities of the VDS.
			 * Also removes the generic entity for each virtual entity from the data.itemList of the VDS.
			 *
			 * @param {Object} dtos: An object where each property contains a list of different dtos.
			 * @param {Object[]} dtos[EntityName]: A list of dtos of the EntityName.
			 **/
			service.removeVirtualEntities = function removeVirtualEntities(dtos) {
				let updateModifications = platformDataServiceModificationTrackingExtension.getModifications(service);
				_.forEach(dtos, function forEachEntityListFn(removedList, propertyKey){
					_.forEach(removedList, function forEachEntityFn(removedItem) {
						// check if it exists in list
						let virtualEntityToBeRemoved = _.find(data.virtualEntities[propertyKey] , {Id: removedItem.Id});
						if (!_.isNil(virtualEntityToBeRemoved)) {
							let genericEntityToBeRemoved = findGenericEntity(virtualEntityToBeRemoved, propertyKey);
							// unmark as modified in VDS
							clearModification(genericEntityToBeRemoved, updateModifications);
							// remove entities from lists
							_.remove(data.virtualEntities[propertyKey], virtualEntityToBeRemoved);
							_.remove(data.itemList, genericEntityToBeRemoved);
						}
					});
				});
			};

			/**
			 * @ngdoc function
			 * @name findVirtualEntities
			 * @description Public function that finds a list of virtual entites based on a list of actual entities.
			 *
			 * @param {Object[]} requestedData: A list of actual entities which match the searched virtual entities.
			 * @param {string} entityName: Name of the virtual entity.
			 * @param {string} [matchingProperty]: Optional name of the property of the actual entitiy containing the id of the matching virtual entity.
			 *
			 * @returns {Object[]} Returns the found list of virtual entities.
			 **/
			service.findVirtualEntities = function findVirtualEntities(requestedData, entityName, matchingProperty) {
				let virtualEntities = data.virtualEntities[entityName];
				matchingProperty = matchingProperty || 'Id';
				let requestProperties = _.map(requestedData, matchingProperty);
				return _.filter(virtualEntities, function findVrtEnt(virtualEntity) {
					return _.includes(requestProperties, virtualEntity.Id);
				});
			};


			/**
			 * @ngdoc function
			 * @name findGenericEntities
			 * @description Public function that finds a list of generic entites based on a list of actual entities.
			 *
			 * @param {Object[]} requestedData: A list of actual entities which match the searched generic entities.
			 * @param {string} entityName: Name of the virtual entity.
			 * @param {string} [matchingProperty]: Optional name of the property of the actual entitiy containing the id of the matching virtual entity.
			 *
			 * @returns {Object[]} Returns the found list of virtual entities.
			 **/
			service.findGenericEntities = function findGenericEntities(requestedData, entityName, matchingProperty) {
				let matchingVirtualEntities = service.findVirtualEntities(requestedData, entityName, matchingProperty);
				return _.map(matchingVirtualEntities, function findGnrEnt(virtualEntity) {
					return findGenericEntity(virtualEntity, entityName);
				});
			};

			/**
			 * @ngdoc function
			 * @name mergeChangedVirtualData
			 * @description Public function that merges a list of changed virtual entities to a list of generic entities.
			 *
			 * @param {Object[]} changedVirtualData: A list of virtual entities that should be merged to generic entities.
			 * @param {string} entityName: Name of the virtual entity.
			 * @param {Object[]} [destinationGenericData]: Optional list of generic entities that the data will be merged to.
			 * If not set, data.itemList of the VDS is used instead.
			 *
			 * @returns {Object[]} Returns the merged list of generic entities.
			 **/
			service.mergeChangedVirtualData = function mergeChangedVirtualData(changedVirtualData, entityName, destinationGenericData) {
				return _.map(changedVirtualData, function mergeChgEnt(virtualEntity) {
					let optionalGenericEntity = !_.isNil(destinationGenericData)? findGenericEntity(virtualEntity, entityName, destinationGenericData) : null;
					return mergeVirtualEntity(virtualEntity, entityName, optionalGenericEntity);
				});
			};

			/**
			 * @ngdoc function
			 * @name mergeChangedGenericData
			 * @description Public function that merges a list of changed generic entities to a list of virtual entities.
			 *
			 * @param {Object[]} changedGenericData: A list of generic entities that should be merged to virtual entities.
			 * @param {Object[]} [destinationVirtualData]: Optional list of virtual entities that the data will be merged to.
			 * If not set, data.virtualEntities[EntityName] of the VDS is used instead.
			 *
			 * @returns {Object[]} Returns the merged list of generic entities.
			 **/
			service.mergeChangedGenericData = function mergeChangedGenericData(changedGenericData, destinationVirtualData) {
				return _.map(changedGenericData, function mergeChgEnt(genericEntity) {
					let optionalVirtualEntity = !_.isNil(destinationVirtualData)? findVirtualEntity(genericEntity, destinationVirtualData) : null;
					return mergeGenericEntity(genericEntity, optionalVirtualEntity);
				});
			};

			/**
			 * @ngdoc function
			 * @name vdsSyncTimeout
			 * @description Timeout to merge data async
			 */
			service.vdsSyncTimeout = $timeout();

			/**
			 * @ngdoc PlatformMessenger
			 * @name onVirtualDataChanged
			 * @description Platform messenger which will be fired on virtual data changed.
			 */
			service.onVirtualDataChanged = new PlatformMessenger();

			// store orgininal markItemAsModified function as separated variable
			service.markItemAsModifiedOriginal = serviceContainer.service.markItemAsModified;

			/**
			 * @ngdoc function
			 * @name markEntitiesAsModified
			 * @description mark multiple generic entities as modified
			 *
			 * @param genericEntities
			 */
			service.markEntitiesAsModified = function markGenericEntitiesAsModified(genericEntities) {
				_.forEach(genericEntities, (genericEntity) => {
					if(genericEntity.EndDate && !genericEntity.EndDate.isValid()){
						genericEntity.EndDate = null; // fix error of "Could not convert string to DateTime: Invalid date. Path 'PlannedFinish' " when saving. by zwz 2021/11/18
					}
				});

				// merge async for better performance in some container
				if (data.mergeAsync) {
					_.forEach(genericEntities, (genericEntity) => {
						_.remove(data.markedItems, (mItem) => {
							return mItem.CompositeId === genericEntity.CompositeId;
						});
						data.markedItems.push(genericEntity);
					});

					clearTimeout(service.vdsSyncTimeout);
					if (data.markedItems.length > 0) {
						service.vdsSyncTimeout = setTimeout(() => {
							handleMarkEntitiesAsModified(data.markedItems);
							// reset async after end of timeout
							data.mergeAsync = false;
							data.markedItems = [];
						},0);
					}
				} else {
					handleMarkEntitiesAsModified(genericEntities);
				}
			};


			/**
			 * @ngdoc function
			 * @name markEntitiesAsModified
			 * @description mark multiple generic entities as modified
			 *
			 * @param genericEntities
			 */
			service.markEntitiesAsUnmodified = function markGenericEntitiesAsModified(genericEntities) {
				handleMarkEntitiesAsUnmodified(genericEntities);
			};

			/**
			 * @ngdoc function
			 * @name mergeUpdatedDataInCache
			 * @description Public function that merges updated data from the server callback back to the virtual entities.
			 *
			 * @param {Object.<string, Object[]>} updateData: The update object containing list of updated entities.
			 **/
			service.mergeUpdatedDataInCache = function mergeUpdatedDataInCache(updateData) {
				let entityUpdateIdentifiers = _.map(data.virtualEntities, function mapEntitiyNames(items, entityName) {
					return `Virtual${entityName}ToSave`;
				});
				let updatedVirtualEntities = _.pickBy(updateData, function filterVirtualEntities(updatedItems, itemName) {
					return !_.isNil(updatedItems) && _.includes(entityUpdateIdentifiers, itemName);
				});
				_.forEach(updatedVirtualEntities, function mergeUpdatedList(updatedItems, itemName) {
					let entityName = _.replace(itemName, /(Virtual)(.*)(ToSave)/, '$2');
					_.forEach(updatedItems, function mergeUpdatedItem(updatedItem) {
						let registrationConfig = data.registeredServices[entityName] && data.registeredServices[entityName][0].config;
						let matchingId = registrationConfig && registrationConfig.match ? updatedItem[registrationConfig.match] : updatedItem.Id;
						let currentItem = _.find(data.virtualEntities[entityName], { Id: matchingId });
						let matchingUpdatedClone = _.cloneDeep(updatedItem);
						matchingUpdatedClone.Id = matchingId;
						if (currentItem) {
							data.mergeItemAfterSuccessfullUpdate(currentItem, matchingUpdatedClone, true, data);
							processEntities([currentItem], entityName);
							mergeVirtualEntity(currentItem, entityName);
						}
					});
				});
			};

			service.getQueuedRequest = function getQueuedRequest() {
				return data.queuedRequest;
			};

			/**
			 * @ngdoc function
			 * @name manualValidation
			 * @description Public function that returns the details of a leading registration based on an entity.
			 *
			 * @param {number} entityId: The id of the searched entity. Needs to match the id of the generic entity.
			 * @param {string} entityName: Name of the generic entity.
			 *
			 * @returns {Object} Result object that contains the leading registration.
			 * Returns null if no entity was found.
			 **/
			service.getLeadingRegistration = function getLeadingRegistration(entityId, entityName) {
				let genericEntity = _.find(data.itemList, (item) => {
					return item.Id === entityId && item.EntityName === entityName;
				});
				if (_.isNil(genericEntity)) {
					return null;
				}
				let reg = findMatchingRegistrations(genericEntity);
				if (!_.isNil(reg.leadingRegistration)) {
					return reg.leadingRegistration;
				}
				// if no leading regsitration is available: return virtual registration
				let virtualEntity = findVirtualEntity(genericEntity);
				return {
					container: serviceContainer,
					entity: virtualEntity,
					config: {
						validation: data.validation[genericEntity.EntityName]
					}
				};
			};

			// endregion

			/*****************************************************************************************
			 *      Private routines
			 *****************************************************************************************/

			// region private methods

			/**
			 * @ngdoc function
			 * @name handleMarkEntitiesAsModified
			 * @description Private function to handle generic and actual entity changes. This function can be triggered from actual dataService or VDS.
			 *
			 * @param {Array} entities: Generic or actual entities which should be handled.
			 * @param {String} [entityName]: Optional entity name. Only needed for actual entities.
			 * @param {String} [entityType]: Optional entity type. If no entityType is set the entities will be handled as genericEntities.
			 */
			function handleMarkEntitiesAsModified(entities, entityName, entityType, matchProperty) {
				let allMatchingRegistrations = [];
				let genericEntities = [];
				_.forEach(entities, (entity) => {
					// Find matches in registrations: Returns registration info objects
					let registrationResult = findMatchingRegistrations(entity, entityName, matchProperty);

					if (!_.isNil(registrationResult.leadingRegistration)) {
						let lRs = registrationResult.leadingRegistration;
						let remaingRegistrations = registrationResult.remaingRegistrations;
						let foundInMatching;
						let originalEntity = _.cloneDeep(lRs.entity);
						if (entityType === 'actual') {
							// TODO: Should be compared to virtual entity only if loaded?
							let matchingVirtual = _.head(service.findVirtualEntities([lRs.entity], entityName, lRs.config.match));
							originalEntity = !_.isNil(matchingVirtual)? _.cloneDeep(matchingVirtual) : originalEntity;
						}
						// merge and mark in leading registration as modified
						if (!_.isUndefined(entityType) && entityType === 'actual') {
							// merge actual to actual and fill generEntities
							processEntities([entity], entityName);
							genericEntities.push(...getGenericEntitiesWithActualEntity(entity, lRs, entityName));
						} else {
							mergeGenericToActualEntity(entity, lRs.entity, lRs.config.match);
						}
						// validate entity
						if (lRs.config.validation) {
							vdsValidate(lRs.config.validation, lRs.entity, originalEntity);
						}

						lRs.container.data.markItemAsModified(lRs.entity, lRs.container.data);
						// clear modification in VDS
						if (_.isUndefined(entityType)) {
							clearModification(entity);
						}

						// then, merge changes but clear modification for all found remaining registrations
						_.forEach(remaingRegistrations, function clearModInRemRegs(rRs) {
							if (!_.isUndefined(entityType) && entityType === 'actual') {
								// merge actual to actual
								processEntities([entity], entityName);
								genericEntities.push(...getGenericEntitiesWithActualEntity(entity, rRs, entityName));
							} else {
								mergeGenericToActualEntity(entity, rRs.entity, rRs.config.match);
							}
							// rRs.container.data.doClearModifications(rRs.entity, rRs.container.data);
							clearActualModification(rRs.entity, rRs.container);

							foundInMatching = _.find(allMatchingRegistrations, (registration) => {
								return registration.container.service.getServiceName() === rRs.container.service.getServiceName();
							});
							if (!foundInMatching) {
								allMatchingRegistrations.push(rRs);
							}
						});

						foundInMatching = _.find(allMatchingRegistrations, (registration) => {
							return registration.container.service.getServiceName() === lRs.container.service.getServiceName();
						});

						if (!foundInMatching) {
							allMatchingRegistrations.push(lRs);
						}
					} else {
						// if not found in any registrations: Only mark in VDS as modified!
						markModification(entity);
					}
				});

				// if no entityType is set the given entities are already genericEntities
				if (_.isUndefined(entityType)) {
					genericEntities = entities;
				}
				// finally, refresh all matching registrations
				if (allMatchingRegistrations.length > 0) {
					// post process all found registrations either by calling serivce.gridRefresh() or service.
					_.forEach(allMatchingRegistrations, function postProcessRegistrations(mRs) {
						if (_.isFunction(mRs.container.service.virtualDataChanged)) {
							mRs.container.service.virtualDataChanged(genericEntities);
						} else {
							mRs.container.service.gridRefresh();
						}
					});
				}
				service.onVirtualDataChanged.fire(genericEntities);
			}

			function handleMarkEntitiesAsUnmodified(entities) {
				_.forEach(entities, (entity) => {
					// Find matches in registrations: Returns registration info objects
					let registrationResult = findMatchingRegistrations(entity);
					if (!_.isNil(registrationResult.leadingRegistration)) {
						clearActualModification(registrationResult.leadingRegistration.entity, registrationResult.leadingRegistration.container);
					} else {
						clearModification(entity);
					}
				});
			}

			/**
			 * @ngdoc function
			 * @name createGenericEntity
			 * @description Private function that creates a generic entity out of a virtual entity based on a given mapping.
			 *
			 * @param {Object} sourceEntity: The virtual/actual entity that is the base for the new entity.
			 * @param {string} entityName: Name of the virtual entity. Will be used to set the correct mapping.
			 *
			 * @returns {Object} The new generic entity.
			 **/
			function createGenericEntity(sourceEntity, entityName) {
				let newGenericEntity = {
					EntityName: entityName
				};
				mergeSourceToDestination(sourceEntity, newGenericEntity, _.invert(data.entityMappings[entityName]));
				// finally, set the composite id by concatenating id and entity name
				newGenericEntity.CompositeId = `${data.entityPrefixes[newGenericEntity.EntityName]}${newGenericEntity.Id}`;
				return newGenericEntity;
			}

			/**
			 * @ngdoc function
			 * @name mergeGenericEntity
			 * @description Private function that merges data from a generic entity to a virtual entity.
			 *
			 * @param {Object} genericEntity: The generic entity that needs to be merged to a matching virtual entity.
			 * @param {Object} [virtualEntity]: The virtual entity that should be merged to. If not set will be search in
			 * stored virtualEntities data of the VDS.
			 *
			 * @returns {Object} The merged virtual entity.
			 **/
			function mergeGenericEntity(genericEntity, virtualEntity) {
				virtualEntity = virtualEntity || findVirtualEntity(genericEntity);
				if (!_.isNil(virtualEntity)) {
					mergeSourceToDestination(genericEntity, virtualEntity, data.entityMappings[genericEntity.EntityName]);
				}
				return virtualEntity;
			}

			/**
			 * @ngdoc function
			 * @name mergeGenericToActualEntity
			 * @description Private function that merges data from a generic entity to an actual entity.
			 *
			 * @param {Object} genericEntity: The generic entity that needs to be merged to a matching virtual entity.
			 * @param {Object} actualEntity: The actual entity that should be merged to.
			 * @param {string} [matchingProperty]: Optional name of property of the actual entity matching the id of the generic entity.
			 *
			 * @returns {Object} The merged actual entity.
			 **/
			function mergeGenericToActualEntity(genericEntity, actualEntity, matchingProperty) {
				let mapping = _.cloneDeep(data.entityMappings[genericEntity.EntityName]);
				// if matchingProperty is set replace Id mapping with matchingProperty
				mapping['Id'] = matchingProperty || mapping['Id'];
				// replace Id of mapping if necessary
				mergeSourceToDestination(genericEntity, actualEntity, mapping);
				return actualEntity;
			}

			/**
			 * @ngdoc function
			 * @name mergeActualToActualEntity
			 * @description Private function that merges data from an actual entity to another actual entity with existing config properties.
			 *
			 * @param {Object} sourceEntity: The source entity that should be merged from.
			 * @param {Object} destinationEntity: The destination entity that should be merged to.
			 * @param {String} entityName: Name of the entity.
			 * @returns {Object} The destination entity.
			 */
			function mergeActualToActualEntity(sourceEntity, destinationEntity, entityName) {
				let properties = _.cloneDeep(data.entityProperties[entityName]);
				mergePropertiesSourceToDestination(sourceEntity, destinationEntity, properties);
				return destinationEntity;
			}

			/**
			 * @ngdoc function
			 * @name mergeVirtualEntity
			 * @description Private function that merges data from a virtual entity to a generic entity.
			 *
			 * @param {Object} virtualEntity: The virtual entity that needs to be merged to a generic virtual entity.
			 * @param {string} entityName: Name of the entity that the passed virtual entity represents.
			 * @param {Object} [genericEntity]: The generic entity that should be merged to. If not set will be search in
			 * stored itemList data of the VDS.
			 *
			 * @returns {Object} The merged generic entity.
			 **/
			function mergeVirtualEntity(virtualEntity, entityName, genericEntity) {
				genericEntity = genericEntity || findGenericEntity(virtualEntity, entityName);
				if (!_.isNil(genericEntity)) {
					mergeSourceToDestination(virtualEntity, genericEntity, _.invert(data.entityMappings[genericEntity.EntityName]));
				}
				return genericEntity;
			}

			/**
			 * @ngdoc function
			 * @name mergeSourceToDestination
			 * @description Private function that generically merges properties from a source to a destination entity based on a mapping object.
			 *
			 * @param {Object} sourceEntity: The source entity that should be merged from.
			 * @param {Object} destinationEntity: The destination entity that should be merged to.
			 * @param {Object} mapping: A mapping object where every key value pair represents the names of the source and destination property.
			 * Key = source property name, Value = destination property name
			 *
			 **/
			function mergeSourceToDestination(sourceEntity, destinationEntity, mapping) {
				// foreach (value, key)!
				// custom clone deep
				const entityDeepCopy = {};
				Object.keys(mapping).forEach(key => entityDeepCopy[key] = moment.isMoment(sourceEntity[key]) ? moment(sourceEntity[key]) : sourceEntity[key]);

				_.forEach(mapping, function mappingFn(destinationProperty, sourceProperty) {
					// do not mapp id!
					if (_.isFunction(sourceEntity[sourceProperty])) {
						// copy if function
						destinationEntity[destinationProperty] = sourceEntity[sourceProperty];
					} else {
						// clone if object
						destinationEntity[destinationProperty] = entityDeepCopy[sourceProperty];
					}
				});
			}

			/**
			 * @ngdoc function
			 * @name mergePropertiesSourceToDestination
			 * @description Private function for merging properties from source to destination entity.
			 *
			 * @param {Object} sourceEntity: The source entity that should be merged from.
			 * @param {Object} destinationEntity: The destination entity that should be merged to.
			 * @param {Array} properties: Array of properties to merge
			 **/
			function mergePropertiesSourceToDestination(sourceEntity, destinationEntity, properties) {
				//custom clone deep
				const entityDeepCopy = {};
				properties.forEach(key => entityDeepCopy[key] = moment.isMoment(sourceEntity[key]) ? moment(sourceEntity[key]) : sourceEntity[key]);

				_.forEach(properties, (property) => {
					// #125931: Only merge if both of the entities have defined the property (value of null is ok!)
					if (!_.isUndefined(destinationEntity[property]) && !_.isUndefined(sourceEntity[property])) {
						destinationEntity[property] = entityDeepCopy[property];
					}
				});
			}

			/**
			 * @ngdoc function
			 * @name findVirtualEntity
			 * @description Private function that searches for a virtual entity based on a generic entity.
			 *
			 * @param {Object} genericEntity: The generic entity that is the pendant of the searched virtual entity.
			 * @param {Object[]} [virtualEntityList]: Optional list of predefined virtual entities that should be searched.
			 * If none is passed, data.virtualEntities of the VDS is searched instead.
			 *
			 * @returns {Object} The found virtual entity.
			 **/
			function findVirtualEntity(genericEntity, virtualEntityList) {
				virtualEntityList = virtualEntityList || data.virtualEntities[genericEntity.EntityName];
				let mappingByEntity = data.entityMappings[genericEntity.EntityName];
				return _.find(virtualEntityList, function fndVrtEnt(item) {
					return item[mappingByEntity['Id']] === genericEntity.Id;
				});
			}

			/**
			 * @ngdoc function
			 * @name findActualEntity
			 * @description Private function that searches for an actual entity based on a generic entity.
			 *
			 * @param {Object} matchingEntity: The entity that is the pendant of the searched actual entity.
			 * @param {Object[]} actualEntityList: List of actual virtual entities that should be searched.
			 * @param {string} [matchingActualProperty]: Optional name of property of the actual entity matching the id of the generic entity.
			 * If none is give, the default mapping of the entity is used instead.
			 *
			 * @returns {Object} The found virtual entity.
			 **/
			function findActualEntity(searcedEntity, actualEntityList, matchingActualProperty, matchingSearchProperty) {
				matchingActualProperty = matchingActualProperty || (!_.isNil(searcedEntity.EntityName)? data.entityMappings[searcedEntity.EntityName]['Id'] : 'Id');
				return _.find(actualEntityList, function fndActEnt(actualEntity) {
					return actualEntity[matchingActualProperty] === searcedEntity[matchingSearchProperty || 'Id'];
				});
			}

			/**
			 * @ngdoc function
			 * @name findGenericEntity
			 * @description Private function that searches for a generic entity based on a virtual entity.
			 *
			 * @param {Object} virtualEntity: The virtual entity that is the pendant of the searched generic entity.
			 * @param {string} entityName: Name of the entity that the passed virtual entity represents.
			 * @param {Object[]} [genericEntityList]: Optional list of predefined generic entities that should be searched.
			 * If none is passed, data.itemList of the VDS is searched instead.
			 *
			 * @returns {Object} The found generic entity.
			 **/
			function findGenericEntity(virtualEntity, entityName, genericEntityList) {
				genericEntityList = genericEntityList || data.itemList;
				let mappingByEntity = data.entityMappings[entityName];
				return _.find(genericEntityList, function fndGnEnt(item) {
					return item.Id === virtualEntity[mappingByEntity['Id']];
				});
			}

			/**
			 * @ngdoc function
			 * @name findMatchingRegistrations
			 * @description Private function that returns a list of registration objects based on a generic entity.
			 * Each registration object contains the serviceContainer of a registered service and the actual entity matching the generic entity.
			 *
			 * @param {Object} genericEntity: The generic entity that is the pendant of the searched actual entities.
			 *
			 * @typedef {Object} RegistrationResult
			 * @property {Registration} leadingRegistration: The registration that matches an actual entity and is a root service.
			 * If no root service is among the found registrations, the first registration found is taken.
			 * @property {Registration} remainingRegistrations: All left found registrations that are not the leading registration.
			 *
			 * @typedef {Object} Registration
			 * @property {Object} container: The serviceContainer of the registered service.
			 * @property {number} entity: The actual entity matching the generic entity in the data of the registered service.
			 *
			 * @returns {RegistrationResult}
			 **/
			function findMatchingRegistrations(entity, name, matchProperty) {

				let entityName = entity.EntityName || name;
				let registrationMatches = [];
				_.forEach(data.registeredServices[entityName], function findInRegistration(registration) {
					let actualEntityInRegistration;
					actualEntityInRegistration = findActualEntity(entity, registration.serviceContainer.service.getList(), registration.config.match, matchProperty);
					if (!_.isNil(actualEntityInRegistration)) {
						let registrationMatch = {
							container: registration.serviceContainer,
							entity: actualEntityInRegistration,
							config: registration.config
						};
						registrationMatches.push(registrationMatch);
					}
				});
				let leadingRegistration = _.find(registrationMatches, 'container.data.isRoot') || _.head(registrationMatches);
				let remainingRegistrations = _.filter(registrationMatches, function findNonLeadingRegs(registration) {
					return registration !== leadingRegistration;
				});
				return {
					leadingRegistration: leadingRegistration,
					remaingRegistrations: remainingRegistrations
				};
			}

			/**
			 * @ngdoc function
			 * @name getGenericEntitiesWithActualEntity
			 * @description Private function which returns genericEntites with a given actualEntity.
			 * If the genericEntity doesn't exist it will be created.
			 *
			 * @param {Object} entity: actualEntity
			 * @param {Object} registration: registrated service
			 * @param {String} entityName
			 * @returns {[genericEntities]}
			 */
			function getGenericEntitiesWithActualEntity(entity, registration, entityName) {
				let genericEntities = [];
				mergeActualToActualEntity(entity, registration.entity, entityName);
				let foundGenericEntities = service.findGenericEntities([entity], entityName, registration.config.match);
				if (foundGenericEntities.length > 0) {
					_.forEach(foundGenericEntities, (genericEntity) => {
						clearModification(genericEntity);
						genericEntities.push(genericEntity);
					});
				} else {
					// create generic if it doesn't exist already
					let newGenericEntity = createGenericEntity(entity, entityName);
					genericEntities.push(newGenericEntity);
					clearModification(newGenericEntity);
				}
				return genericEntities;
			}

			/**
			 * @ngdoc function
			 * @name clearModification
			 * @description Private function that clears modifications of a passed genericEntity of the VDS.
			 *
			 * @param {Object} genericEntity: The generic entity which modification should be cleared.
			 * @param {Object} updateModifications: To avoid performance problem in a loop.
			 **/
			function clearModification(genericEntity, updateModifications) {
				let virtualEntity = mergeGenericEntity(genericEntity);
				let previousItemName = data.itemName.split('Virtual')[1];
				// set itemName to virtual + entity name
				setItemName(genericEntity.EntityName);
				data.doClearModifications(virtualEntity, data);
				// after clearing a modification, set the item name to make sure mergeUpdatedDataInCache works!
				setItemName(null, updateModifications);
				// set the itemName to the last one
				// keep the last used name!!!
				setItemName(previousItemName);
			}

			/**
			 * @ngdoc function
			 * @name clearModification
			 * @description Private function that clears modifications of a passed genericEntity of the VDS.
			 *
			 * @param {Object} actualEntity: The actual entity which modification should be cleared.
			 * @param {Object} registeredContainer: Registered container that should clear the modification.
			 **/
			function clearActualModification(actualEntity, registeredContainer) {
				var modState = platformModuleStateService.state(registeredContainer.service.getModule());
				if (modState.validation && modState.validation.issues) {
					_.remove(modState.validation.issues, function (err) {
						// console.log(`Removing validation of entity ${actualEntity.Id} from ${registeredContainer.service.getServiceName()}`);
						return err.entity.Id === actualEntity.Id && err.dataSrv === registeredContainer.service;
					});
				}
				// finally, clear modified entity
				registeredContainer.data.doClearModifications(actualEntity, registeredContainer.data);
			}

			/**
			 * @ngdoc function
			 * @name markModification
			 * @description Private function that marks modifications of a passed genericEntity of the VDS.
			 *
			 * @param {Object} genericEntity: The generic entity which modification should be marked.
			 **/
			function markModification(genericEntity) {
				let originalEntity = _.cloneDeep(findVirtualEntity(genericEntity));
				let virtualEntity = mergeGenericEntity(genericEntity);
				let previousItemName = data.itemName.split('Virtual')[1];
				// validate first!
				if (data.validation[genericEntity.EntityName]) {
					vdsValidate(data.validation[genericEntity.EntityName], virtualEntity, originalEntity);
				}
				// set itemName to  entity name
				setItemName(genericEntity.EntityName);
				service.markItemAsModifiedOriginal(virtualEntity);
				// keep the last used name!!!
				setItemName(previousItemName);
			}

			/**
			 * @ngdoc function
			 * @name loadOptions
			 * @description Public function that loads options of the VDS based on the configured endpoint.
			 **/
			function loadOptions() {
				data.optionsInitialized = true;
				let optionRoute = `${data.httpReadRoute}${data.httpOptions}`;
				return $http.get(optionRoute).then((optionResponse) => {
					_.forEach(optionResponse.data, (value, optionKey) => {
						if (_.isObject(data[optionKey])) {
							_.merge(data[optionKey], value);
						}
					});
					return $q.resolve();
				});
			}

			/**
			 * @ngdoc function
			 * @name markModification
			 * @description Private function that marks modifications of a passed genericEntity of the VDS.
			 *
			 * @param {Object} genericEntity: The generic entity which modification should be marked.
			 **/
			function processEntities(itemList, entityName) {
				const fieldsToProcess = data.dateProcessors[entityName].fields.map(x => x.field);
				let refValue = null;
				// creating moments in date processor much faster when created from ms!
				itemList.forEach(x => fieldsToProcess.forEach(y => {
					refValue = x[y];
					if (!_.isNull(refValue)) {
						x[y] = new Date(refValue).getTime();
					}
				}));
				_.forEach(itemList, data.dateProcessors[entityName].processItem);
			}

			/**
			 * @ngdoc function
			 * @name setItemName
			 * @description Private function that sets the data itemName of the VDS.
			 *
			 * @param {[string]} entityName: Optional name of the entity that the itemName should be set to.
			 * @param {Object} updateModifications: To avoid performance problem in a loop.
			 * If none is passed, the method will try to find of the registered entities and set it to the first where it finds modified entities.
			 **/
			function setItemName(entityName, updateModifications) {
				if (_.isNil(entityName) || _.isEmpty(entityName)) {
					updateModifications = updateModifications || platformModuleStateService.state(service.getModule()).modifications;
					let virtualUpdateDataKey = _.findKey(updateModifications, (entityList, updatedItemName) => {
						let nameWithoutModificationInfo = updatedItemName.replace(/ToSave|Virtual/g, '');
						let entityNameList = _.map(data.virtualEntities, (list, key) => { return key; });
						return _.includes(entityNameList, nameWithoutModificationInfo) && !_.isEmpty(entityList);
					});
					data.itemName = !_.isNil(virtualUpdateDataKey)? virtualUpdateDataKey.replace('ToSave', '') : 'Virtual';
				} else {
					data.itemName = `Virtual${entityName}`;
				}
			}

			function vdsValidate(validation, mergedEntity, originalEntity) {
				_.forEach(validation.properties, function (property) {
					if (_.isFunction(validation.service['validate' + property])) {
						const validationResult = validation.service['validate' + property](mergedEntity, originalEntity[property], property);
						// if validation result is valid => remove validation error!
						platformRuntimeDataService.applyValidationResult(validationResult, mergedEntity, property);
					}
				});
			}


			function customDeepCopyForVitual(itemsToClone, entityType) {
				let deepCopy = itemsToClone.map(x => Object.assign({}, { ...x }));
				processEntities(deepCopy, entityType);
				return deepCopy;
			}

			// endregion
		}

		return factory;
	}
})();
