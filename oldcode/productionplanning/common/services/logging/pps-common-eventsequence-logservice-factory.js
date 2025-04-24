/**
 * Created by zov on 1/17/2020.
 */
(function () {
	'use strict';
	/*global angular*/

	/**
     * @ngdoc service
     * @name ppsCommonEventSequenceLogServiceFactory
     * @function
     * @requires 
     *
     * @description
     * Data service factory for event sequence logs
     * 
     */
	var moduleName = 'productionplanning.common';
	var ppsCommonModule = angular.module(moduleName);
	ppsCommonModule.factory('ppsCommonEventSequenceLogServiceFactory', srv);
	srv.$inject = ['platformDataServiceFactory', 'ppsCommonLoggingHelper',
		'$injector', 'platformRuntimeDataService'];
	function srv(platformDataServiceFactory, ppsCommonLoggingHelper,
		$injector, platformRuntimeDataService) {

		var serviceFactroy = {};
		var serviceCache = {};

		function createNewComplete(parentServiceName, translationServiceName){
			var dataService = null;
			var serviceInfo = {
				flatLeafItem: {
					module: ppsCommonModule,
					serviceName: parentServiceName + '_PpsItemEventSeqLogService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'productionplanning/common/logreport/',
						endRead: 'eventSequenceLogs'
					},
					entityRole: {
						leaf: {
							itemName: 'EventLog',
							parentService: $injector.get(parentServiceName),
							parentFilter: 'eventId',
							filterParent: function(data) {
								// get event which link to selected parent
								var eventId;
								data.currentParentItem = data.parentService.getSelected();
								if (data.currentParentItem) {
									eventId = data.currentParentItem.PpsEventFk;
								}
								return eventId;
							}
						}
					},
					actions: {},
					dataProcessor: [{
						processItem: function (item) {
							platformRuntimeDataService.readonly(item, [{field: 'Remark', readonly: item.Id < 0}]);
						}
					}],
					presenter: {
						list: {
							incorporateDataRead: function(readData, data) {
								var result = data.handleReadSucceeded(readData, data);
								ppsCommonLoggingHelper.translateLogColumnName(dataService.getList(), $injector.get(translationServiceName), dataService);
								return result;
							}
						}
					},
					entitySelection: {supportsMultiSelection: true}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceInfo);
			dataService = serviceContainer.service;

			serviceContainer.data.itemModified.register(function onLogModified(e, log) {
				var logs = dataService.getList();
				// sync Remark
				logs.forEach(function (item) {
					if (item.Id === log.Id) {
						item.Remark = log.Remark;
					}
				});

				dataService.gridRefresh();
			});

			// before provideLeafItemsUpdateData hasn't supported yet in platformDataServiceModificationTrackingExtension
			// so we have to modify updateData in node/root level
			var parentSrv = dataService.parentService();
			if (parentSrv !== null) {
				var orgFn = parentSrv.provideUpdateData;
				parentSrv.provideUpdateData = function (updateData) {
					provideUpdateData(updateData);
					if (orgFn) {
						return orgFn(updateData);
					}
				};
			}

			function provideUpdateData(updateData) {
				var propName = serviceContainer.data.itemName + 'ToSave';
				if (updateData[propName]) {
					var logs2Save = [];
					updateData[propName].forEach(function (item) {
						if (!_.find(logs2Save, {Id: item.Id})) {
							logs2Save.push(item);
						}
					});
				}
			}

			return dataService;
		}

		serviceFactroy.getService = function getService(parentServiceName, translationServiceName){
			if(!serviceCache[parentServiceName]){
				serviceCache[parentServiceName] = createNewComplete(parentServiceName, translationServiceName);
			}

			return serviceCache[parentServiceName];
		};

		return serviceFactroy;
	}
    
})();