/**
 * Created by Frank Baedeker on 03.11.2015.
 */
(function () {
	/* global globals */
	'use strict';
	var moduleName = 'basics.customize';
	var basicsCustomizeModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name basicsCustomizeStatusRoleDataService
	 * @function
	 *
	 * @description
	 * basicsCustomizeStatusRoleDataService is the data service for all entity type descriptions
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	basicsCustomizeModule.factory('basicsCustomizeStatusRoleDataService', ['$q', 'platformDataServiceFactory', 'basicsCustomizeTypeDataService', 'platformDataServiceDataProcessorExtension', 'platformDataServiceEntityRoleExtension', 'basicsCustomizeStatusRuleDataService',

		function ($q, platformDataServiceFactory, basicsCustomizeTypeDataService, platformDataServiceDataProcessorExtension, platformDataServiceEntityRoleExtension, basicsCustomizeStatusRuleDataService) {
			var service = {};

			function canCreateRole()
			{
				var res = false;
				var sel = service.getSelectedParentItem();
				if(sel && sel.Id && sel.Hasrolevalidation) {
					res = true;
				}

				return res;
			}

			function canDeleteRole()
			{
				var res = false;
				var sel = service.getSelected();
				if(sel && sel.Id) {
					res = true;
				}

				return res;
			}

			// The instance of the main service - to be filled with functionality below
			var basicsCustomizeStatusRoleDataServiceOption = {
				module: basicsCustomizeModule,
				serviceName: 'basicsCustomizeStatusRoleDataService',
				httpRead: { route: globals.webApiBaseUrl + 'basics/customize/', endRead: 'list', usePostForRead: true },
				httpCreate: { route: globals.webApiBaseUrl + 'basics/customize/', endCreate: 'create' },
				modification: { multi: {} },
				dataProcessor: [],
				actions: { create: 'flat', canCreateCallBackFunc: canCreateRole, delete: {}, canDeleteCallBackFunc: canDeleteRole},
				entitySelection: {},
				presenter: {list: {} }
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsCustomizeStatusRoleDataServiceOption);
			var data = serviceContainer.data;
			service = serviceContainer.service;

			data.doesRequireLoadAlways = true;

			data.httpRoutePrefix = data.httpReadRoute;
			data.itemName = '';

			data.deletedEntities = [];
			data.modifiedEntities = [];
			data.modifiedEntitiesCount = 0;
			data.typeEntity = undefined;
			data.statusRuleField = '';
			data.filteredList = [];
			data.selectedParentItem = '';

			data.deleteItem = function deleteCustomizeInstance(entity, data) {
				platformDataServiceEntityRoleExtension.deleteSubEntity(entity, service, data);
			};

			data.checkTranslationForChanges = function checkTranslationForChanges() {
			};

			service.initialize = function initialize(endPoint, dbTable, statusRuleProperty)
			{
				data.deletedEntities = [];
				data.modifiedEntities = [];
				data.modifiedEntitiesCount = 0;
				data.typeEntity = undefined;
				data.statusRuleField = statusRuleProperty;
				data.filteredList = [];
				if(dbTable.length > 0) {
					data.typeEntity = basicsCustomizeTypeDataService.getTypeByDBTableName(dbTable);
				}

				if(endPoint.length > 0) {
					data.httpReadRoute = data.httpRoutePrefix + endPoint + '/';
					data.httpCreateRoute = data.httpReadRoute;

					return service.load();
				}
				else {
					service.setList([]);

					return $q.when([]);
				}
			};

			service.getStatusRuleField = function getStatusRuleField() {
				return data.statusRuleField;
			};

			service.deleteItem = function deleteItem(entity){
				service.addEntityToDeleted(null, entity, data);
				data.itemList.pop(entity);
				data.filteredList.pop(entity);
				data.listLoaded.fire();
			};

			service.setSelectedParentItem = function setSelectedParentItem(selectedParentItem){
				data.selectedParentItem = selectedParentItem;
			};

			service.getSelectedParentItem = function getSelectedParentItem(){
				return data.selectedParentItem;
			};

			data.onCreateSucceeded = function onCreateSucceeded(newData, data) {
				platformDataServiceDataProcessorExtension.doProcessItem(newData, data);
				newData[data.statusRuleField] = data.selectedParentItem.Id;

				data.itemList.push(newData);
				data.filteredList.push(newData);
				service.addEntityToModified(null, newData);

				data.listLoaded.fire();
				service.setSelected(newData);

				data.entityCreated.fire(null, newData);
			};

			service.addEntityToModified = function doAddEntityToModified(elemState, entity) {
				if(!_.find(data.modifiedEntities, { Id: entity.Id })) {
					data.modifiedEntities.push(entity);
					data.modifiedEntitiesCount += 1;
				}
			};

			service.addEntityToDeleted = function doAddNodeEntityToDeleted(elemState, entity, data) {
				data.deletedEntities.push(entity);
				data.modifiedEntitiesCount += 1;
			};

			service.getModifications = function getModifications(updateData) {
				if(data.modifiedEntitiesCount >= 1 && data.typeEntity) {
					updateData.StatusRoleData = {
						Id: data.typeEntity.Id
					};

					if(data.modifiedEntities.length > 0) {
						updateData.StatusRoleData.ToSave = angular.copy(data.modifiedEntities);
					}

					if(data.deletedEntities.length > 0) {
						updateData.StatusRoleData.ToDelete = angular.copy(data.deletedEntities);
					}
				}
			};

			service.verifyModifications = function verifyModifications() {
				return true;
			};

			service.tryGetTypeEntries = function doTryGetCustomizeTypeEntries() {
				return data.modifiedEntities;
			};

			service.revertProcessItems = function doRevertCustomizeTypeItems() {
				var items = service.tryGetTypeEntries();
				if(items && items.length > 0) {
					platformDataServiceDataProcessorExtension.revertProcessItems(items, data);
				}
			};

			data.mergeItemAfterSuccessfullUpdate = function mergeItemAfterSuccessfullUpdate() {
			};

			service.mergeInUpdateData = function doMergeInCustomizeTypeUpdateData() {
			};

			service.parentService = function getInstanceParentService() {
				return basicsCustomizeTypeDataService;
			};

			service.getData = function getData() {
				return data;
			};

			service.provideUpdateData = function provideCustomizeInstanceUpdateData() {};

			service.getDataType = function getDataType() {
				return data.typeEntity;
			};

			service.getFilteredList = function getFilteredList(){
				return data.filteredList;
			};

			function filterList(e, selectedItem){
				service.setSelectedParentItem(selectedItem);
				data.filteredList = [];
				if (selectedItem) {
					data.filteredList = _.filter(data.itemList, function (item) {
						return item[data.statusRuleField] === selectedItem.Id;
					});
				}
				data.listLoaded.fire();
			}

			basicsCustomizeStatusRuleDataService.registerSelectionChanged(filterList);

			return service;
		}]);
})();
