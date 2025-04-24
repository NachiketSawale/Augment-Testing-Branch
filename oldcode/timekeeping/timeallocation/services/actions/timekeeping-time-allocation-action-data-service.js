/**
 * Created by leo on 06.10.2021
 */

(function (angular) {
	'use strict';
	let myModule = angular.module('timekeeping.timeallocation');

	/**
	 * @ngdoc service
	 * @name timekeepingTimeallocationActionDataService
	 * @description pprovides methods to access, create and update timekeeping timeallocation action item entities
	 */
	myModule.service('timekeepingTimeallocationActionDataService', TimekeepingTimeallocationActionDataService);

	TimekeepingTimeallocationActionDataService.$inject = ['_', 'platformDataServiceFactory', 'timekeepingTimeallocationHeaderDataService', '$http', 'globals', '$q'];

	function TimekeepingTimeallocationActionDataService(_, platformDataServiceFactory, timekeepingTimeallocationHeaderDataService, $http, globals, $q) {
		let self = this;
		let timekeepingTimeallocationActionServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'timekeepingTimeallocationActionDataService',
				entityNameTranslationID: 'timekeeping.timeallocation.itemEntity',
				presenter: {
					list: {}
				},
				entityRole: {
					leaf: {itemName: 'TimeAlloc2PrjActions', parentService: timekeepingTimeallocationHeaderDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(timekeepingTimeallocationActionServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.doNotLoadOnSelectionChange = true;

		serviceContainer.service.setDataItemList = function setDataItemList(items){
			serviceContainer.data.itemList = [];
			_.each(items, function iterator(item) {
				_.each(item.TimeAllocations2ProjectActions, function (action) {
					serviceContainer.data.itemList.push(action);
				});
			});
		};

		serviceContainer.service.updateAction = function updateAction(item, field){
			let colArray = _.split(field, '_');
			let actionFk = parseInt(colArray[1]);
			let action = _.find(serviceContainer.data.itemList, function(entity){
				return entity.TimeAllocationFk === item.Id && entity.PrjActionFk === actionFk;
			});
			if (action){
				let number = _.isString(item[field]) ? parseInt(item[field]) : item[field];
				if(number === null || _.isNaN(number)){
					item[field] = null;
					serviceContainer.service.deleteItem(action);
				} else {
					action.AssignedHours = item[field];
					serviceContainer.service.markItemAsModified(action);
				}
			} else {
				let creationData = {Pkey1: item.Id, PKey2: actionFk};
				return $http.post(globals.webApiBaseUrl + 'timekeeping/timeallocation/2prjaction/create', creationData).then(function (res) {
					if (res && res.data) {
						res.data.AssignedHours = item[field];
						serviceContainer.data.itemList.push(res.data);
						serviceContainer.service.markItemAsModified(res.data);
					}
				});
			}
			return $q.when(true);
		};
	}
})(angular);