(function (angular) {
	/* global globals, Platform */
	'use strict';

	var modulemodel = 'cloud.desktop';

	/**
	 * @ngdoc service
	 * @model cloudDesktopExternalSystemCredentialService
	 */
	angular.module(modulemodel).service('cloudDesktopExternalSystemCredentialDataService', CloudDesktopExternalSystemCredentialDataService);

	CloudDesktopExternalSystemCredentialDataService.$inject = ['_', '$http'];

	function CloudDesktopExternalSystemCredentialDataService(_, $http) {
		var self = this;

		var serviceData = {
			selectedItem: null,
			externalSystemCredentialList: [],
			externalSystemCredentialListDelete: [],
			entityAddedEvent: new Platform.Messenger(),
			entityDeletedEvent: new Platform.Messenger(),
			selectionAfterSortEvent: new Platform.Messenger()
		};

		self.getEntityAddedEvent = function getEntityAddedEvent() {
			return serviceData.entityAddedEvent;
		};

		self.getEntityDeletedEvent = function getEntityDeletedEvent() {
			return serviceData.entityDeletedEvent;
		};

		self.getSelectionAfterSortEvent = function getSelectionAfterSortEvent() {
			return serviceData.selectionAfterSortEvent;
		};

		self.getItemList = function getItemList() {
			return serviceData.externalSystemCredentialList;
		};

		self.onSelectedRowChanged = function onSelectedRowChanged(selectedRow) {
			serviceData.selectedItem = selectedRow;
		};

		self.getExternalSystemCredentialListDelete = function getExternalSystemCredentialListDelete() {
			return serviceData.externalSystemCredentialListDelete;
		};

		self.load = function load() {
			return $http.get(globals.webApiBaseUrl + 'basics/customize/externalsource2user/listbyuser')
				.then(function (response) {
					serviceData.externalSystemCredentialList = [];
					_.forEach(response.data, function (item) {
						serviceData.externalSystemCredentialList.push(item);
					});
					return response.data;
				},
				function (/* error */) {
				});
		};

		self.create = function create() {
			return $http.get(globals.webApiBaseUrl + 'basics/customize/externalsource2user/createforuser')
				.then(function (response) {
					serviceData.externalSystemCredentialList.push(response.data);
					serviceData.entityAddedEvent.fire(response.data);
				},
				function (/* error */) {
				});

		};

		self.deleteItem = function deleteItem() {
			if (!_.isNil(serviceData.selectedItem)) {
				var deletedItem = _.find(serviceData.externalSystemCredentialList, function (item) {
					return item.Id === serviceData.selectedItem.Id;
				});

				if (!_.isNil(deletedItem)) {
					if (deletedItem.Version > 0) {// remember the deleted for save when OK is pressed
						serviceData.externalSystemCredentialListDelete.push(deletedItem);
					}

					_.remove(serviceData.externalSystemCredentialList, function (item) {
						return item.Id === deletedItem.Id;
					});

					serviceData.entityDeletedEvent.fire(deletedItem);
				}
			}
		};

		return self;
	}
})(angular);
