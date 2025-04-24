/**
 * Created by leo on 13.09.2017.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceRequisitionActivityLookupDataService
	 * @function
	 *
	 * @description
	 * resourceRequisitionLookupDataService is the data service for requisition look ups
	 */
	angular.module('resource.requisition').factory('resourceRequisitionActivityLookupDataService', ['_', 'platformLookupDataServiceFactory', 'PlatformMessenger',

		function (_, platformLookupDataServiceFactory, PlatformMessenger) {

			var selectedItem = {};
			var activityLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'scheduling/main/activity/', endPointRead: 'tree'},
				tree: { parentProp: 'ParentActivityFk', childProp: 'Activities' },
				filterParam: 'scheduleId'
			};

			var serviceContainer = platformLookupDataServiceFactory.createInstance(activityLookupDataServiceConfig);

			serviceContainer.service.listLoaded = new PlatformMessenger();
			serviceContainer.service.selectionChanged = new PlatformMessenger();

			serviceContainer.selectedObject = {};

			serviceContainer.service.loadSelected = function loadSelected (selected){
				if(selected === 'scheduleFk') {
					serviceContainer.service.setFilter(serviceContainer.service.getSelectedFilter('scheduleFk'));

					serviceContainer.service.getList(serviceContainer.options).then(function(list){
						serviceContainer.service.listLoaded.fire(list);
					});
				}
			};

			// projectMainSourceFilterSelectionService.registerSelectionChanged( loadSelected);
			serviceContainer.service.setSelectedFilter = function setSelectedFilter(nameSelected, idSelected, filter) {
				serviceContainer.selectedObject[nameSelected] = idSelected;
				var notAllEntered = _.find(filter, function(f){
					return _.isNil(serviceContainer.selectedObject[f]);
				});
				if(!notAllEntered) {
					serviceContainer.service.loadSelected('scheduleFk');
				} else {
					serviceContainer.service.listLoaded.fire([]);
				}
			};

			serviceContainer.service.getSelectedFilter = function getSelectedFilter(nameSelected) {
				if (serviceContainer.selectedObject.hasOwnProperty(nameSelected)) {
					return serviceContainer.selectedObject[nameSelected];
				}
				return null;
			};

			serviceContainer.service.getItemByKey = function getItemByKey(id){
				return serviceContainer.service.getItemById(id,serviceContainer.options);
			};

			serviceContainer.service.setSelected = function setSelectedItem(selected) {
				if(selectedItem && selected !== selectedItem || _.isNil(selectedItem)) {
					selectedItem = selected;
					serviceContainer.service.selectionChanged.fire(selected);
				}
			};
			serviceContainer.service.getSelected = function getSelectedItem() {
				return selectedItem;
			};
			return serviceContainer.service;
		}]);
})(angular);
