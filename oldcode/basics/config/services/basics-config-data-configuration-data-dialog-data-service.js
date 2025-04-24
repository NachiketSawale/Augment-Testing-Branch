
(function (angular) {
	'use strict';
	var myModule = angular.module('basics.config');

	/**
	 * @ngdoc service
	 * @name basicsConfigDataConfigurationDialogDataService
	 * @description pprovides methods, create and update DataConfiguration entities
	 */
	myModule.service('basicsConfigDataConfigurationDialogDataService', BasicsConfigDataConfigurationDialogDataService);

	BasicsConfigDataConfigurationDialogDataService.$inject = ['_', '$http', 'basicsConfigModuleColumnInformationDataService',
		'basicsConfigModuleTableInformationDataService'];

	function BasicsConfigDataConfigurationDialogDataService(_, $http, basicsConfigModuleColumnInformationDataService,
	                                                        basicsConfigModuleTableInformationDataService) {

		var self = this;

		var serviceData = {
			selectedItem: null,
			configDataConfigurationList: [],
			configDataConfigurationListDeleted: [],
			configDataConfigurationListModified: [],
			entityAddedEvent: new Platform.Messenger(),
			entityDeletedEvent: new Platform.Messenger(),
			selectionAfterSortEvent: new Platform.Messenger()
		};

		self.getEntityAddedEvent = function getEntityAddedEvent () {
			return serviceData.entityAddedEvent;
		};

		self.getEntityDeletedEvent = function getEntityDeletedEvent() {
			return serviceData.entityDeletedEvent;
		};

		self.getSelectionAfterSortEvent = function getSelectionAfterSortEvent() {
			return serviceData.selectionAfterSortEvent;
		};

		self.getItemList = function getItemList() {
			return serviceData.configDataConfigurationList;
		};

		self.onSelectedRowChanged = function onSelectedRowChanged(selectedRow) {
			serviceData.selectedItem = selectedRow;
		};

		self.getConfigDataConfigurationListDeleted = function getConfigDataConfigurationListDeleted() {
			return serviceData.configDataConfigurationListDeleted;
		};

		self.getConfigDataConfigurationListModified = function getConfigDataConfigurationListModified() {
			return serviceData.configDataConfigurationListModified;
		};

		self.storeChanges = function storeChanges() {
			_.forEach(serviceData.configDataConfigurationListDeleted, function(item) {
				if(!item.IsMandatory) {
					basicsConfigModuleColumnInformationDataService.deleteItem(item);
				} else {
					self.markItemAsModified(item);
				}
			});

			_.forEach(serviceData.configDataConfigurationListModified, function(item){
				if(!item.IsMandatory && !item.ShowInWizard) {
					basicsConfigModuleColumnInformationDataService.deleteItem(item);
				} else {
					basicsConfigModuleColumnInformationDataService.storeChangedColumnInfo(item);
				}
			});

		};

		self.load = function load() {
			serviceData.configDataConfigurationList = [];
			serviceData.configDataConfigurationListDeleted = [];
			serviceData.configDataConfigurationListModified = [];

			var items = basicsConfigModuleColumnInformationDataService.getList();
			_.forEach(items, function(item) {
				if(item.ShowInWizard === true){
					serviceData.configDataConfigurationList.push(item);
				}
			});
		};

		self.createItem = function createItem() {
			var selected = basicsConfigModuleTableInformationDataService.getSelected();
			var creationData = {
				PKey1: selected.Id,
				PKey2: selected.ModuleFk
			};

			return $http.post(globals.webApiBaseUrl + 'basics/config/modulecolumninfo/create', creationData)
				.then(function (response) {
					serviceData.configDataConfigurationList.push(response.data);
					serviceData.entityAddedEvent.fire(response.data);
				},
				function (/* error */) {
				});
		};

		self.deleteItem = function deleteItem() {
			if(serviceData.selectedItem) {
				var deletedItem = _.find(serviceData.configDataConfigurationList, function (item) {
					return item.Id === serviceData.selectedItem.Id;
				});

				if (deletedItem) {
					if (deletedItem.Version > 0) {// remember the deleted for save when OK is pressed
						deletedItem.ShowInWizard = false;
						serviceData.configDataConfigurationListDeleted.push(deletedItem);
					}

					_.remove(serviceData.configDataConfigurationList, function (item) {
						return item.Id === deletedItem.Id;
					});

					serviceData.entityDeletedEvent.fire(deletedItem);
				}
			}
		};

		self.markItemAsModified = function markItemAsModified(item) {
			if(serviceData.selectedItem) {
				var alreadyModified = _.find(serviceData.configDataConfigurationListModified, function (candidate) {
					return candidate.Id === item.Id;
				});

				if (!alreadyModified) {
					serviceData.configDataConfigurationListModified.push(item);
				}
			}
		};

		self.updateItem = function updateItem(data, entity, type) {
			let selected = entity;
			let creationData = {
				PKey1: selected.Id,
				PKey2: selected.ModuleFk
			};

			let columnList = [];
			_.forEach(data.value, function (item) {
				columnList.push(item.Column);
			});

			let typeColumn= type.selectedTitle;

			return $http.post(globals.webApiBaseUrl + 'basics/config/modulecolumninfo/updateItem', {creationData, columnList, typeColumn })
				.then(function (response) {
						serviceData.configDataConfigurationList.push(response.data);
						serviceData.entityAddedEvent.fire(response.data);
					},
					function (/* error */) {
					});
		};

		return self;
	}
})(angular);
