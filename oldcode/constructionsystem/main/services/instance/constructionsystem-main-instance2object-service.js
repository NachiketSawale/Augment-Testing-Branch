(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	/**
	 * @ngdoc service
	 * @name constructionSystemMainInstance2ObjectService
	 * @function
	 * @requires platformDataServiceFactory
	 *
	 * @description
	 * #
	 * data service for constructionSystem main instance2object list/detail controller.
	 */

	angular.module(moduleName).factory('constructionSystemMainInstance2ObjectService', ['$http','$q',
		'platformDataServiceFactory', 'constructionSystemMainInstanceService',
		'basicsLookupdataLookupDescriptorService', 'constructionSystemMainJobDataService', 'PlatformMessenger',
		function ($http,$q,platformDataServiceFactory, parentService, lookupDescriptorService, constructionSystemMainJobDataService, PlatformMessenger) {
			var serviceOptions = {
				flatNodeItem: {
					module: angular.module(moduleName),
					serviceName: 'constructionSystemMainInstance2ObjectService',
					httpRead: {
						route: globals.webApiBaseUrl + 'constructionsystem/main/instance2object/',
						endRead: 'list',
						usePostForRead: true,
						initReadData: function (readData) {
							var modelSelectedId = parentService.getCurrentSelectedModelId();
							var obj = parentService.getSelected();
							if (obj && obj.Id && obj.InstanceHeaderFk) {
								readData.CosInsHeaderId = obj.InstanceHeaderFk;
								readData.InstanceId = obj.Id;
								readData.ModelId = modelSelectedId;
							} else {
								readData.CosInsHeaderId = -1;
								readData.InstanceId = -1;
								readData.ModelId = -1;
							}
						}
					},
					httpUpdate: {}, // todo(roberson): why need this option can trigger to load sub entities?
					presenter: {
						list: {
							incorporateDataRead: function incorporateDataRead(readData, data) {
								lookupDescriptorService.attachData(readData);

								return data.handleReadSucceeded(readData.Main, data);
							}
						}
					},
					entityRole: {
						node: {itemName: 'Instance2Object', parentService: parentService}
					},
					actions: {delete: true, create: false},
					filterByViewer: {
						suppressModelId: true
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
			var service = serviceContainer.service;

			service.instanceHeaderDto=null;
			service.getInstanceHeaderDto=function(){
				var defer=$q.defer();
				if(service.instanceHeaderDto===null){
					var selectedInstance2ObjectDto=service.getSelected();
					if(selectedInstance2ObjectDto){
						var instanceHeaderFk=selectedInstance2ObjectDto.InstanceHeaderFk;
						$http.get(globals.webApiBaseUrl + 'constructionsystem/project/instanceheader/getInstanceHeaderById?cosInsHeaderId=' + instanceHeaderFk).then(function (response){
							service.instanceHeaderDto=response.data;
							defer.resolve(service.instanceHeaderDto);
						},function(){
							defer.reject(null);
						});
					}
				}else{
					defer.resolve(service.instanceHeaderDto);
				}
				return defer.promise;
			};

			service.formatterData = function (newData) {
				_.forEach(newData, function (item) {
					if (!item.__rt$data) {
						item.__rt$data = {};
					}
				});
			};

			serviceContainer.data.clearEntireCache = function clearEntireCache(data) {
				if (data && data.usesCache) {
					for (var prop in data.cache) {
						if (Object.prototype.hasOwnProperty.call(data.cache,prop)) {

							var changes = data.cache[prop];

							changes.loadedItems.length = 0;
							changes.selectedItems.length = 0;
							changes.modifiedItems.length = 0;
							changes.deletedItems.length = 0;

							delete data.cache[prop];
						}
					}

					delete data.cache;
					data.cache = {};
				}
			};

			serviceContainer.service.clearCache = function clearCache() {
				serviceContainer.data.clearEntireCache(serviceContainer.data);

				// clearDependentCaches
				_.forEach(serviceContainer.data.childServices, function (childService) {
					if (childService.clearCache) {
						childService.clearCache();
					}
				});
			};

			function refresh(args) {
				if (serviceContainer.data.currentParentItem !== args.instance) {
					return;
				}

				var selectedItem = service.getSelected();

				// clearDependentCaches.
				_.forEach(serviceContainer.data.childServices, function (childService) {
					if (childService.clearCache) {
						childService.clearCache();
					}
				});

				// reload data.
				if (selectedItem) {
					_.forEach(serviceContainer.data.childServices, function (childService) {
						if (childService.load) {
							childService.load();
						}
					});
				}
			}

			/**
			 * reload after instance evaluation or calculation successfully.
			 */
			constructionSystemMainJobDataService.onCalculationDone.register(refresh);
			constructionSystemMainJobDataService.onEvaluationDone.register(refresh);
			constructionSystemMainJobDataService.onAssignObjectDone.register(function(){
				service.load();
			});

			// override it fo show newest assign objects in 3DViewer
			var onDeleteDone = serviceContainer.data.onDeleteDone;
			serviceContainer.data.onDeleteDone = function onDeleteDoneInList() {
				onDeleteDone.apply(serviceContainer.data, arguments);
				parentService.sync3DViewerIfSelectedIsChecked();
				parentService.updateStatusToModified();
			};

			service.propertyReload = new PlatformMessenger();

			return service;
		}
	]);
})(angular);
