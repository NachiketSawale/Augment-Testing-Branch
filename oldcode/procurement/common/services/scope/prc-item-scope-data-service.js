/**
 * Created by wui on 10/15/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'procurement.common';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	angular.module(moduleName).factory('prcItemScopeDataService', [
		'PlatformMessenger',
		'platformDataServiceFactory',
		'procurementCommonDataServiceFactory',
		'prcItemScopeReadOnlyProcessor','platformRuntimeDataService',
		function (PlatformMessenger,
			platformDataServiceFactory,
			procurementCommonDataServiceFactory,
			prcItemScopeReadOnlyProcessor,platformRuntimeDataService) {

			// create a new data service object
			function constructorFn(parentDataService) {
				var serviceContainer;
				var setReadonlyor;
				var canItemTypeEdit;
				var service;
				var serviceOption = {
					flatNodeItem: {
						module: angular.module(moduleName),
						serviceName: 'prcItemScopeDataService',
						httpRead: {
							route: globals.webApiBaseUrl + 'procurement/common/item/scope/'
						},
						httpCreate: {
							route: globals.webApiBaseUrl + 'procurement/common/item/scope/',
							endCreate: 'create'
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									var parent = parentDataService.getSelected();
									creationData.Id = parent.Id;
								},
								handleCreateSucceeded: function (newData) {
									return isSelected(newData);
								},
								incorporateDataRead: function incorporateDataRead(readItems, data) {
									var Isreadonly = !setReadonlyor();
									var dataRead = serviceContainer.data.handleReadSucceeded(readItems, data, true);
									if (Isreadonly) {
										service.setFieldReadonly(readItems);
									}
									var parentItem =parentDataService.getSelected();
									if (parentItem) {
										let itemTypeFk = parentItem.BasItemTypeFk;
										if (itemTypeFk === 7) {
											_.forEach(readItems,(item)=>{
												service.readonlyFieldsByItemType(item,itemTypeFk);
											});
										}
									}
									return dataRead;
								}
							}
						},
						entityRole: {
							node: {
								itemName: 'PrcItemScope',
								parentService: parentDataService
							}
						},
						translation: {
							uid: 'prcItemScopeDataService',
							title: 'basics.material.scope.listTitle',
							columns: [
								{
									header: 'cloud.common.entityDescription',
									field: 'DescriptionInfo'
								}
							]
						},
						dataProcessor: [prcItemScopeReadOnlyProcessor(parentDataService)]
					}
				};
				serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
				service = serviceContainer.service;

				var readonlyFields = [{field: 'MatScope', readonly: true}, {field: 'DescriptionInfo', readonly: true},
					{field: 'BusinessPartnerFk', readonly: true}, {field: 'SubsidiaryFk', readonly: true}, {field: 'SupplierFk', readonly: true},
					{field: 'BusinessPartnerProdFk', readonly: true}, {field: 'SubsidiaryProdFk', readonly: true},
					{field: 'SupplierProdFk', readonly: true}, {field: 'CommentText', readonly: true}, {field: 'Remark', readonly: true},
					{field: 'UserDefined1', readonly: true}, {field: 'UserDefined2', readonly: true},
					{field: 'UserDefined3', readonly: true}, {field: 'UserDefined4', readonly: true}, {field: 'UserDefined5', readonly: true},
					{field: 'IsSelected', readonly: true}];
				service.setFieldReadonly = function(items){
					if(_.isArray(items)){
						_.forEach(items, function(item){
							platformRuntimeDataService.readonly(item, readonlyFields);
						});
					}
				};

				function isSelected(newData) {
					var list = service.getList();

					if (list.every(function (item) {
						return item.IsSelected === false;
					})) {
						newData.IsSelected = true;
					}

					return newData;
				}

				service.watch = function(scope) {
					var parentService = service.parentService();
					var processor = prcItemScopeReadOnlyProcessor(parentService);

					// MatScope defaults to NULL and is read only. If the parent PRC_ITEM has a MDC_MATERIAL_FK not null
					// then the user can chose from a drop down the records in MDC_MATERIALSCOPE for this material record
					scope.$watch(function () {
						var parent = parentService.getSelected();
						return parent ? parent.MdcMaterialFk : null;
					}, function () {
						var list = service.getList();
						list.forEach(function (item) {
							processor.processItem(item);
						});
					});
				};

				service.isSelectedChanged = new PlatformMessenger();

				service.updateToolsEvent = new PlatformMessenger();

				service.hasScope = function () {
					var prcItem = parentDataService.getSelected();
					var list = service.getList();
					var hasScope = list.some(function (item) {
						return item.IsSelected === true;
					});

					if (prcItem.HasScope !== hasScope) {
						prcItem.HasScope = hasScope;
						parentDataService.markItemAsModified(prcItem);
					}

					if(!prcItem.OrginalPrcItem){
						prcItem.OrginalPrcItem=angular.copy(prcItem);
					}
				};

				service.registerEntityCreated(function (e, newItem) {
					service.hasScope();

					if(newItem.IsSelected){
						var prcItem = parentDataService.getSelected();
						service.isSelectedChanged.fire(service.isSelectedChanged, {
							prcItem: prcItem,
							itemScope: newItem
						});
					}
				});

				service.registerEntityDeleted(function (e, DeletedItems) {
					service.hasScope();

					var hasSelected = DeletedItems.some(function (item) {
						return item.IsSelected === true;
					});

					if(hasSelected){
						var prcItem = parentDataService.getSelected();
						service.isSelectedChanged.fire(service.isSelectedChanged, {
							prcItem: prcItem
						});
					}
				});

				setReadonlyor = function () {
					var getModuleStatusFn = parentDataService.getItemStatus || parentDataService.getModuleState;
					if (getModuleStatusFn) {
						var status = getModuleStatusFn();
						return !(status.IsReadOnly || status.IsReadonly);
					}
					return false;
				};

				canItemTypeEdit = function () {
					var parentItem =parentDataService.getSelected();
					if (parentItem) {
						let itemTypeFk = parentItem.BasItemTypeFk;
						if (itemTypeFk === 7) {
							return false;
						} else {
							return true;
						}
					}
					return false;
				};
				service.getModuleState = function () {
					return parentDataService.getModuleState();
				};
				var canCreate = service.canCreate;
				service.canCreate = function () {
					return canCreate() && setReadonlyor() && canItemTypeEdit();
				};
				var canDelete = service.canDelete;
				service.canDelete = function () {
					return canDelete() && setReadonlyor() && canItemTypeEdit();
				};

				service.readonlyFieldsByItemType=(entity,itemTypeFk)=>{
					let columns = Object.keys(entity);
					_.forEach(columns, (item) => {
						if(itemTypeFk=== 7){
							platformRuntimeDataService.readonly(entity, [{field: item, readonly: true}]);
							$('.item-field_IsSelected').find('[type=checkbox]').attr('disabled',true);
						}else{
							platformRuntimeDataService.readonly(entity, [{field: item, readonly: false}]);
							$('.item-field_IsSelected').find('[type=checkbox]').attr('disabled',false);
						}
					});
				};


				return service;
			}

			return procurementCommonDataServiceFactory.createService(constructorFn, 'prcItemScopeDataService');
		}
	]);

})(angular);