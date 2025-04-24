(function (angular) {
	'use strict';
	var moduleName = 'resource.master';

	/**
	 * @ngdoc service
	 * @name resourceMasterMainPhotoDataService
	 * @function
	 * @requireds platformDataServiceFactory
	 *
	 * @description Provide activity data service
	 */
	/* jshint -W072*/
	angular.module(moduleName).factory('resourceMasterMainPhotoDataService',resourceMasterMainPhotoDataService);

	resourceMasterMainPhotoDataService.$inject = ['platformDataServiceFactory', 'resourceMasterMainService', 'globals'/*, 'platformDataServiceModificationTrackingExtension'*/];

	function resourceMasterMainPhotoDataService(platformDataServiceFactory, resourceMasterMainService, globals) {
		var serviceOptions = {
			flatLeafItem: {
				module: angular.module(moduleName),
				serviceName: 'resourceMasterMainPhotoDataService',
				entityRole: {
					leaf: {
						itemName: 'Photo',
						parentService: resourceMasterMainService,
						doesRequireLoadAlways: true,
						parentFilter: 'resourceFk'
					}
				},
				httpCreate: {route: globals.webApiBaseUrl + 'resource/master/photo/', endCreate: 'create'},
				httpRead: {route: globals.webApiBaseUrl + 'resource/master/photo/'},
				presenter: {list: {	
					initCreationData: function initCreationData(creationData) {
					var selected = resourceMasterMainService.getSelected();
					creationData.PKey1 = selected.Id;
				}
				}}
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

		serviceContainer.service.disablePrev = function(){
			return canContactNavigate();
		};

		serviceContainer.service.disableNext = function(){
			return canContactNavigate('forward');
		};

		function canContactNavigate(type) {
			type = type || 'backward';
			var select = serviceContainer.service.getSelected();
			var list = serviceContainer.service.getList();
			if (!select || !select.Id || list <= 0) {
				return false;
			}
			var index = type === 'forward' ? list.length - 1 : 0;
			return select === list[index];
		}


/*
	    //override onDeleteDone
		var baseOnDeleteDone = serviceContainer.data.onDeleteDone;
		serviceContainer.data.onDeleteDone = function onDeleteDoneInList(deleteParams, data) {
		    var deleteItem = serviceContainer.service.getSelected();
		    if (deleteItem && deleteItem.hasOwnProperty('Id')) {
		        baseOnDeleteDone(deleteParams, data);
		    }
		};

		var data = serviceContainer.data;
		angular.extend(data, {
		    doClearModifications: doClearModifications
		});
		function doClearModifications(deleteEntities, data) {
		    if (deleteEntities instanceof Array) {
		        for (var i = 0; i < deleteEntities.length; i++) {
		            platformDataServiceModificationTrackingExtension.clearModificationsInLeaf(serviceContainer.service, data, deleteEntities[i]);
		        }
		    }
		    else {
		        platformDataServiceModificationTrackingExtension.clearModificationsInLeaf(serviceContainer.service, data, deleteEntities);
		    }
		}

	    //override addEntitiesToDeleted
		angular.extend(serviceContainer.service, {
		    addEntitiesToDeleted: addEntitiesToDeleted
		});
		function addEntitiesToDeleted(elemState, entities, data, modState) {
		    if (!elemState[data.itemName + 'ToDelete']) {
		        elemState[data.itemName + 'ToDelete'] = [];
		    }
		    var storedEntities = _.filter(entities, function (entity) {
		        return entity.Version > 0;
		    });
		    _.forEach(storedEntities, function (entity) {
		        if (entity.Version > 0) {
		            elemState[data.itemName + 'ToDelete'].push(entity);
		        }
		    });
		    modState.EntitiesCount += storedEntities.length;
		}
*/

		return serviceContainer.service;
	}
})(angular);
