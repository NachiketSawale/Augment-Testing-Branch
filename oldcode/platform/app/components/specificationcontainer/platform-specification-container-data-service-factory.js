/**
 * Created by nitsche on 2025-02-20.
 */
(function (angular) {
	'use strict';

	var moduleName = 'platform';

	/**
	 * @ngdoc service
	 * @name platformSpecificationContainerDataServiceFactory
	 * @description provides a service factory for data services of source windows in diverse modules
	 */
	angular.module(moduleName).service('platformSpecificationContainerDataServiceFactory', PlatformSpecificationContainerDataServiceFactory);

	PlatformSpecificationContainerDataServiceFactory.$inject = [
		'_', '$http', '$injector', 'platformDataServiceFactory', 'platformDataServiceModificationTrackingExtension',
		'platformDataServiceInitOptionExtension'
	];

	function PlatformSpecificationContainerDataServiceFactory(
		_, $http, $injector, platformDataServiceFactory, platformDataServiceModificationTrackingExtension,
		platformDataServiceInitOptionExtension
	) {
		let instances = {}, self = this;
		this.createDataService = function createDataService(options, servBase) {
			var dsName = self.getDataServiceName(options);

			var srv = instances[dsName];
			if (_.isNull(srv) || _.isUndefined(srv)) {
				srv = self.doCreateDataService(options, servBase);
				instances[dsName] = srv;
			}

			return srv;
		};
		this.doCreateDataService = function doCreateDataService(options, servBase) {
			let serviceContainer = platformDataServiceFactory.createService(options, servBase);
			let opt = platformDataServiceInitOptionExtension.completeOptions(options);
			platformDataServiceModificationTrackingExtension.addModificationTracking(serviceContainer, opt);
			this.addSpecificationServiceMethods(serviceContainer, options);

			return serviceContainer.service;
		};
		this.getDataServiceName = function getDataServiceName(options) {
			return options.flatLeafItem.serviceName
		};

		this.addSpecificationServiceMethods = function addSpecificationServiceMethods(serviceContainer, options) {
			serviceContainer.data.hasModifications = function hasModifications() {
				return modifiedSpecification !== null;
			};

			serviceContainer.service.getParentDataService = function getParentDataService() {
				return options.flatLeafItem.entityRole.leaf.parentService;
			}

			serviceContainer.service.getUpdateToSaveName = function getUpdateToSaveName() {
				return options.flatLeafItem.entityRole.leaf.itemName + 'ToSave';
			}

			//Create and save TextBlobs
			serviceContainer.service.provideUpdateData = function provideChangesToUpdate(updateData) {            //bei jeder Aktionen aufgerufen, soll auch bei Save-Button speichern
				if (modifiedSpecification) {
					updateData[options.flatLeafItem.entityRole.leaf.itemName + 'ToSave']= angular.copy(modifiedSpecification);
					if (!updateData.EntitiesCount) {
						updateData.EntitiesCount = 1;
					}
					else {
						updateData.EntitiesCount += 1;
					}
					clearSpecification();
				}
			};

			serviceContainer.service.loadSubItemList = function loadSubItemListFromService() {
				return serviceContainer.service.loadSpecificationById()
			};


			serviceContainer.service.registerGetModificationCallback = function registerGetModificationCallback(callbackFn) {
				serviceContainer.data.getBlobModificationCallback = callbackFn;
			};
			serviceContainer.service.unregisterGetModificationCallback = function unregisterGetModificationCallback() {
				serviceContainer.data.getBlobModificationCallback = null;
			};

			serviceContainer.service.currentSpecificationChanged = new Platform.Messenger();
			let modifiedSpecification = null;

			serviceContainer.data.setCurrentSpecification = function (specification) {
				if(!_.isArray(serviceContainer.data.itemList)){
					serviceContainer.data.itemList = []
				}
				if(_.some(serviceContainer.data.itemList)){
					serviceContainer.data.itemList[0] = specification;
				}
				else{
					serviceContainer.data.itemList.push(specification);
				}
			}
			serviceContainer.data.getCurrentSpecification = function () {
				return serviceContainer.data.itemList[0];
			}
			serviceContainer.data.setCurrentSpecification({
				Content: null,
				Id: 0,
				Version: 0
			});
			//loadSpecificationById
			serviceContainer.service.loadSpecificationById = function loadSpecificationById() {
				let data = serviceContainer.service.getParentDataService().getSelected()
				if (data && data[options.flatLeafItem.entityRole.leaf.parentChildProp]) {
					$http(
						{
							method: 'GET',
							url: globals.webApiBaseUrl + 'cloud/common/blob/getblobstring?id=' + data[options.flatLeafItem.entityRole.leaf.parentChildProp]
						}
					).then(function (response) {
							// Load successful
							if (response && response.data) {
								serviceContainer.data.setCurrentSpecification(angular.copy(response.data))
								serviceContainer.service.currentSpecificationChanged.fire(serviceContainer.data.getCurrentSpecification());
							}
							else{
								serviceContainer.service.currentSpecificationChanged.fire(null);
							}
						},
						function (/*error*/) {
							// Load failed
							clearSpecification();
						});
				}
				else {
					clearSpecification();
					serviceContainer.service.currentSpecificationChanged.fire(null);
				}
			};
			var clearSpecification = function clearSpecification() {
				modifiedSpecification = null;
				serviceContainer.data.setCurrentSpecification({
					Content: null,
					Id: 0,
					Version: 0
				});
			};

			serviceContainer.service.unloadSubEntities = function unloadSubEntities() {
				clearSpecification();
				serviceContainer.service.currentSpecificationChanged.fire(null);
			}

			//@param {Object} specification : modified specification that's to be saved
			serviceContainer.service.setSpecificationAsModified = function setSpecificationAsModified(specification) {
				if(!_.some(serviceContainer.data.itemList)){
					if (!_.isArray(serviceContainer.data.itemList)){
						serviceContainer.data.itemList = []
					}
					let blobFk = serviceContainer.service.getParentDataService().getSelected()[options.flatLeafItem.entityRole.leaf.parentChildProp]
					serviceContainer.data.itemList.push({Id: blobFk ?? 0, Content: specification, Version:0});
				}
				let item = serviceContainer.data.itemList[0]
				item.Content = specification;
				serviceContainer.service.markItemAsModified(item)
			};
			//Value for Service-Update
			serviceContainer.service.getModifiedSpecification = function getModifiedSpecification() {
				//	if(angular.isDefined(modifiedSpecification)){
				if (modifiedSpecification !== null) {
					var copy = angular.copy(modifiedSpecification);
					modifiedSpecification = null;

					return copy;
				}
				else {
					return null;
				}
			};

			//Current
			/**
			 * @ngdoc function
			 * @name getCurrentSpecification
			 * @function
			 * @description This function returns the current specification coming form the currently selected clerk
			 * @returns {Object} returns object representing the current specification
			 */
			serviceContainer.service.getCurrentSpecification = function getCurrentSpecification() {
				serviceContainer.service.loadSpecificationById(null, options.flatLeafItem.entityRole.leaf.parentService.getSelected());
				return serviceContainer.data.itemList[0];
			};
			serviceContainer.service.setCurrentSpecification = function setCurrentSpecification(specification) {
				if (serviceContainer.data.itemList[0] !== specification) {
					serviceContainer.data.itemList[0] = specification;
					serviceContainer.service.currentSpecificationChanged.fire(specification);
				}
			};
		}
	}

})(angular);
