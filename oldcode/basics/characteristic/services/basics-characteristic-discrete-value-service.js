(function () {
	'use strict';
	var moduleName = 'basics.characteristic';

	angular.module(moduleName).factory('basicsCharacteristicDiscreteValueService', ['$injector', 'basicsCharacteristicCharacteristicService', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'platformDataServiceSelectionExtension',
		function ($injector, basicsCharacteristicCharacteristicService, platformDataServiceFactory, basicsLookupdataLookupDescriptorService, platformDataServiceSelectionExtension) {
			var serviceOption = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'basicsCharacteristicDataGroupService',
					httpCreate: { route: globals.webApiBaseUrl + 'basics/characteristic/discretevalue/' },
					httpRead: {route: globals.webApiBaseUrl + 'basics/characteristic/discretevalue/',initReadData: function (readData) {
						var lineItemService = $injector.get('estimateMainService');
						var colName = lineItemService.getCharacteristicColumn();
						if(colName) {
							var colArray = _.split(colName, '_');
							if(colArray && colArray.length > 0){
								var id = colArray[_.lastIndexOf(colArray) - 1];
								readData.filter = '?mainItemId=' + id;
							}
						}
						else {
							var selectedParentItem = basicsCharacteristicCharacteristicService.getSelected();
							readData.filter = '?mainItemId=' + selectedParentItem.Id;
						}
					}},
					actions: {
						delete: true,
						create: 'flat',
						canCreateCallBackFunc: function (item, data) { // jshint ignore:line
							return canEdit();
						}
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								creationData.CharacteristicId = basicsCharacteristicCharacteristicService.getIfSelectedIdElse();//else is undefined
							}
						}
					},
					entityRole: {
						leaf: {
							itemName: 'DiscreteValue',
							parentService: basicsCharacteristicCharacteristicService
						}
					},
					entitySelection: {},
					translation: {
						uid: 'ED1D05EB-15BB-439B-A8E5-8D602275A0D9',
						title: 'basics.characteristic.title.discreteValues',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: { typeName: 'CharacteristicValueDto', moduleSubModule: 'Basics.Characteristic' }
					}
				}
			};
			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
			var service = serviceContainer.service;
			var parentService = serviceContainer.data.parentService;

			//todo(Seto):not update items version when update items
			delete service.mergeUpdatedDataInCache;

			//If we delete the item(the IsDefault field of this item is true).
			//the default value of the parent container must set null.
			serviceContainer.data.onDeleteDone = function onDeleteDoneInList(deleteParams, data, response) {
				var tempentity = deleteParams.entity;
				if(deleteParams.entities && deleteParams.entities.length > 0) {
					tempentity = deleteParams.entities[0];
				}
				if (data.deleteFromSelections) {
					data.deleteFromSelections(tempentity, data);
				}
				data.doClearModifications(tempentity, data);
				data.itemList = _.filter(data.itemList, function (item) {
					return item.Id !== tempentity.Id;
				});

				if (data.rootOptions && data.rootOptions.mergeAffectedItems) {
					data.rootOptions.mergeAffectedItems(response, data);
				}

				data.listLoaded.fire();
				platformDataServiceSelectionExtension.doSelectCloseTo(deleteParams.index, data);

				onDeleteDiscreteValue(tempentity);
			};

			var doReadDataBase = serviceContainer.data.doReadData;
			serviceContainer.data.doReadData = function doReadData(data) {
				data.currentParentItem = data.parentService.getSelected(); //ensue the parent item is selected.
				return doReadDataBase(data);
			};

			//When the default value and type of the parent container have been changed,
			//the discrete value container need response the changes.
			parentService.defaultValueChanged.register(function (e, characteristicEntity) {
				var dataList = service.getList();
				dataList.forEach(function (item) {
					if (item.Id !== characteristicEntity.DefaultValue) {
						if (item.IsDefault) {
							item.IsDefault = false;
							service.markItemAsModified(item);
						}
					} else {
						item.IsDefault = true;
						service.markItemAsModified(item);
					}
				});
				service.gridRefresh();
			});
			parentService.characteristicTypeChanged.register(function (e, characteristicEntity) {
				var dataList = service.getList();
				if (characteristicEntity.CharacteristicTypeFk !== 10) {
					dataList.forEach(function (item) {
						service.deleteItem(item);
					});
				}
				service.loadSubItemList();
				service.gridRefresh();
			});

			//When the is default field have been changed.
			//the default value of the parent container need response the changes.
			service.isDefaultModified = function isDefaultModified(currentItem) {
				var currentParentItem = parentService.getSelected();
				if (currentItem.IsDefault) {
					currentParentItem.DefaultValue = currentItem.Id;
				}
				// else {   --> we will always have a default discrete value
				// 	currentParentItem.DefaultValue = null;
				// }
				basicsLookupdataLookupDescriptorService.updateData('CharacteristicValue', [currentItem]);
				parentService.markItemAsModified(currentParentItem);
				parentService.gridRefresh();
				return true;
			};

			function onDeleteDiscreteValue(discreteValue) {
				var currentItem = parentService.getSelected();
				if (discreteValue.IsDefault) {
					currentItem.DefaultValue = null;
				}
				parentService.markItemAsModified(currentItem);
				parentService.gridRefresh();
			}

			function canEdit() {
				var parentItem;
				if (parentService) {
					parentItem = parentService.getSelected();
				}
				return (parentItem && angular.isDefined(parentItem.Id) && parentItem.CharacteristicTypeFk === 10);
			}

			return service;
		}]);
})(angular);
