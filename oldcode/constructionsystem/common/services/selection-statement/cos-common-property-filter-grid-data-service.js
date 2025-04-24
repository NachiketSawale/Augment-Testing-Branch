/**
 * Created by luo on 2017/2/15.
 */
/* global _ */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.common';

	angular.module(moduleName).factory('constructionsystemCommonPropertyFilterGridDataService', [
		'platformDataServiceFactory', 'PlatformMessenger',
		function (platformDataServiceFactory, PlatformMessenger) {

			return {
				createService: createService
			};

			function createService(parentServiceName) {
				var serviceOption = {
					module: angular.module(moduleName),
					serviceName: 'constructionsystemCommonPropertyFilterGridDataService',
					httpRead: {
						useLocalResource: true,
						resourceFunction: function () {
							return [];
						}
					},
					presenter: {list: {}},
					entitySelection: {},
					modification: {},
					actions: {
						delete: true,
						create: 'flat'
					}
				};

				var container = platformDataServiceFactory.createNewComplete(serviceOption);
				var service = container.service;
				var data = container.data;

				service.parentServiceName = parentServiceName;

				// used to collect property filter and saved to the field 'SelectStatement' of COS Master.
				service.onPropertyFilterChanged = new PlatformMessenger();

				// avoid console error: service.parentService() is not a function (see: platformDataServiceModificationTrackingExtension)
				data.markItemAsModified = function () {
				};
				service.markItemAsModified = function (entity) {
					service.onPropertyFilterChanged.fire(entity);
				};

				service.createItem = function () {
					var rowId = _.max(_.map(service.getList(), 'Id')) || 0;
					var newItem = {
						Id: ++rowId,
						PropertyId: null,
						PropertyName: '',
						ValueType: 0,
						Operation: 1,
						PropertyValue: ''
					};

					data.itemList.push(newItem);
					data.entityCreated.fire(null, newItem);
				};

				service.deleteItem = function () {
					var deleteParams = {};
					deleteParams.entities = service.getSelectedEntities();

					data.onDeleteDone(deleteParams, data, null);
				};

				return service;
			}

		}
	]);
})(angular);