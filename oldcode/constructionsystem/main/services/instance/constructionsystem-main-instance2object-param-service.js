(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionSystemMainInstance2ObjectParamService
	 * @function
	 * @requires platformDataServiceFactory
	 *
	 * @description
	 * #
	 * data service for constructionSystem main instance2objectparam list/detail controller.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('constructionSystemMainInstance2ObjectParamService', [
		'$http','$q',
		'platformDataServiceFactory', 'constructionSystemMainInstance2ObjectService',
		'ConstructionSystemMainPropertyNameProcessor','constructionSystemMainInstance2ObjectParamFormatterProcessor',
		'constructionSystemMainScriptDataService',
		'constructionSystemMasterParameterValidationHelperService',
		'basicsLookupdataLookupDescriptorService',
		'PlatformMessenger', 'globals', '_',
		function ($http,$q,platformDataServiceFactory, parentService,
			ConstructionSystemMainPropertyNameProcessor, formatterProcessor,
			constructionSystemMainScriptDataService,
			cosParameterValidationHelperService,
			basicsLookupdataLookupDescriptorService,
			PlatformMessenger, globals, _) {

			var serviceName = 'constructionsystem.main.instance2object.param';

			var serviceOptions = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'constructionSystemMainInstance2ObjectParamService',
					httpRead: {
						route: globals.webApiBaseUrl + 'constructionsystem/main/instance2objectparam/',
						endRead: 'list',
						usePostForRead: true,
						initReadData: function (readData) {
							var parentItem = parentService.getSelected();
							if (parentItem && parentItem.InstanceFk && parentItem.ObjectFk) {
								readData.InstanceId = parentItem.InstanceFk;
								readData.ModelObjectId = parentItem.ObjectFk;
								readData.Instance2ObjectId = parentItem.Id;
							} else {
								readData.InstanceId = -1;
								readData.ModelObjectId = -1;
								readData.Instance2ObjectId = -1;
							}
						}
					},
					/* jshint -W055 */
					dataProcessor:[new formatterProcessor(serviceName),{processItem: addAdditionalProperties},new ConstructionSystemMainPropertyNameProcessor(serviceName)],
					presenter: {
						list: {
							incorporateDataRead: incorporateDataRead
						}
					},
					entityRole: {
						leaf: {itemName: 'Instance2ObjectParam', parentService: parentService}
					},
					actions: {delete: false, create: false}
				}
			};

			var tempCache = {}; // it stores the (instance2objectId, instance2objectparam) pair when the property of instance parameter change then recalculate the specified object parameter
			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

			var service = serviceContainer.service;

			service.servicePrefixName = serviceName;

			service.performScriptValidation = new PlatformMessenger();

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
				tempCache = {};
				serviceContainer.data.clearEntireCache(serviceContainer.data);
			};

			function addAdditionalProperties(item){
				var parentItem = parentService.getSelected();
				// for property name filter use
				item.InstanceFk = parentItem.InstanceFk || -1;
			}

			// get the parameters that don't need to hide
			serviceContainer.service.getFilteredList = function getFilteredList() {
				var list = service.getList();
				var filteredList;
				filteredList= _.filter(list, function(item) {
					var flag = true;
					if(item.__rt$data) {
						if(Object.prototype.hasOwnProperty.call(item.__rt$data,'hide')) {
							flag = !item.__rt$data.hide;
						}
					}
					return flag;
				});
				return filteredList;
			};

			service.onValidationInfoChanged = function onValidationInfoChanged() {
				var objParameters = service.getList();
				serviceContainer.data.listLoaded.fire(objParameters);
				service.gridRefresh();
			};

			service.setTempCache = setTempCache;
			service.updateByInstanceParameterPropertyChanged = updateByInstanceParameterPropertyChanged;
			service.reset2ObejctParameters = reset2ObejctParameters;
			service.resetEntireCache = resetEntireCache;

			service.instanceHeaderDto=null;
			service.getInstanceHeaderDto=function(){
				var defer=$q.defer();
				if(service.instanceHeaderDto===null){
					parentService.getInstanceHeaderDto().then(function(instanceHeaderDto){
						service.instanceHeaderDto=instanceHeaderDto;
						defer.resolve(service.instanceHeaderDto);
					},function(){defer.reject(null);});
				}else{
					defer.resolve(service.instanceHeaderDto);
				}
				return defer.promise;
			};
			service.getAsyncParameterValueByPropertyName = function getAsyncParameterValueByPropertyName(entity){
				return $http.get(globals.webApiBaseUrl + 'constructionsystem/main/instance2objectparam/getobjectpropertyvalue', {
					params: {
						modelId: parentService.getSelected().ModelFk,
						instanceHeaderId: parentService.getSelected().InstanceHeaderFk,
						instanceId: entity.InstanceFk,
						instance2ObjectParamId: entity.Id,
						propertyName: entity.PropertyName
					}
				});
			};

			return service;

			// ////////////////////
			function incorporateDataRead(readData, data) {
				// basicsLookupdataLookupDescriptorService.updateData('CosMainInstanceParameterPropertyName',
				// readData.CosMainInstanceParameterPropertyName);
				doUpdate(readData.Main || readData || []);
				var result = data.handleReadSucceeded(readData.Main || readData || [], data);
				serviceContainer.service.goToFirst();
				// script validation while init
				service.performScriptValidation.fire();
				return result;
			}

			function updateByInstanceParameterPropertyChanged() {
				var list = service.getList();
				doUpdate(list);

				// TODO chi: need?
				// script validation while init
				service.performScriptValidation.fire();
			}

			function doUpdate(list) {
				if (!list || list.length === 0) {
					return;
				}

				var ins2ObjId = list[0].Instance2ObjectFk;
				var ins2ObjParams = tempCache[ins2ObjId];
				if (ins2ObjParams) {
					_.forEach(ins2ObjParams, function (param) {
						var found = _.find(list, {Id: param.Id});
						if (found && found.IsInherit) {
							found.ParameterValue = param.ParameterValue;
							found.ParameterValueVirtual = param.ParameterValueVirtual;
							found.ModelPropertyFk = param.ModelPropertyFk;
							found.PropertyName = param.PropertyName;
							// TODO chi: how about lookup
							service.markItemAsModified(found);
						}
					});

				}
				delete tempCache[ins2ObjId];
			}

			function setTempCache(value){
				if (!value) {
					tempCache = {};
					return;
				}

				for (var prop in value) {
					if (Object.prototype.hasOwnProperty.call(value,prop)) {
						if (!tempCache[prop]) {
							tempCache[prop] = [];
							tempCache[prop].push(value[prop]);
						}
						else {
							var found = _.find(tempCache[prop], {Id: value[prop].Id});
							if (found) {
								found = value[prop];
							}
							else {
								tempCache[prop].push(value[prop]);
							}
						}
					}
				}

			}

			function reset2ObejctParameters(items) {
				incorporateDataRead(items, serviceContainer.data);
			}
			function resetEntireCache(items) {
				for (var k in items) {
					if (serviceContainer.data.cache[k]) {
						serviceContainer.data.cache[k].loadedItems = items[k];
					}
				}
			}
		}
	]);
})(angular);
