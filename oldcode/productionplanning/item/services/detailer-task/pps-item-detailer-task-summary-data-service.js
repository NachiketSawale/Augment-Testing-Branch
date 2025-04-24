/**
 * Created by lav on 9/24/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('ppsItemDetailerTaskSummaryDataService', DataService);

	DataService.$inject = ['platformDataServiceFactory',
		'platformDataServiceEntityReadonlyProcessor',
		'$injector',
		'ppsItemDetailersDataService'];

	function DataService(platformDataServiceFactory,
						 platformDataServiceEntityReadonlyProcessor,
						 $injector,
						 ppsItemDetailersDataService) {
		var serviceOptions = {
			flatLeafItem: {
				module: moduleName,
				serviceName: 'ppsItemDetailerTaskSummaryDataService',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/engineering/task/',
					endRead: 'detailertasksummary',
					initReadData: function (readData) {
						var selectedClerk = ppsItemDetailersDataService.getSelected();
						var clerkId = selectedClerk ? selectedClerk.Id : null;
						var roleId = $injector.get('ppsItemDetailersFilterService').entity.roleId;
						var date = $injector.get('ppsItemDetailerTaskFilterService').entity.startingDate;
						if (date) {
							date = date.format('YYYY-MM-DD');
						}
						readData.filter = '?clerkId=' + clerkId + '&roleId=' + roleId + '&date=' + date;
					}
				},
				entityRole: {
					leaf: {
						itemName: '',
						parentService: ppsItemDetailersDataService
					}
				},
				actions: {},
				dataProcessor: [platformDataServiceEntityReadonlyProcessor]
			}
		};

		var container = platformDataServiceFactory.createNewComplete(serviceOptions);
		var service = container.service;
		service.getSelectedFilter = function (filter) {
			return $injector.get('ppsItemDetailerTaskFilterService').entity[filter];
		};
		service.setSelectedFilter = function (filter) {
			if (filter === 'startingDate') {
				var entity = $injector.get('ppsItemDetailerTaskFilterService').entity;
				var endDate = _.cloneDeep(entity.startingDate);
				if (endDate) {
					endDate.add(7 - endDate.format('E'), 'days');
				}
				entity.endDate = endDate;
			}
			service.load();
		};

		return service;
	}

})(angular);