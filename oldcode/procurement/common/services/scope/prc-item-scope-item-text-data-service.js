/**
 * Created by wui on 10/24/2018.
 */

(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('prcItemScopeItemTextDataService', [
		'$http',
		'platformDataServiceFactory',
		'basicsLookupdataLookupDescriptorService',
		'procurementCommonServiceCache','platformRuntimeDataService','PlatformMessenger',
		function ($http,
			platformDataServiceFactory,
			basicsLookupdataLookupDescriptorService,
			procurementCommonServiceCache,platformRuntimeDataService,PlatformMessenger) {

			basicsLookupdataLookupDescriptorService.loadData('Configuration2TextType');

			function constructorFn(parentService) {
				// service configuration
				var service;
				var setReadonlyor;
				var canItemTypeEdit;
				var serviceContainer,
					serviceOptions = {
						flatLeafItem: {
							serviceName: 'prcItemScopeItemTextDataService',
							httpCRUD: {
								route: globals.webApiBaseUrl + 'procurement/common/item/scope/detail/blob/'
							},
							presenter: {
								list: {
									initCreationData: function initCreationData(creationData) {
										var parent = parentService.getSelected();
										creationData.Id = parent.Id;
									},
									incorporateDataRead: function incorporateDataRead(readItems, data) {
										var Isreadonly = !setReadonlyor();
										var dataRead = serviceContainer.data.handleReadSucceeded(readItems, data, true);
										let prcItem = parentService.parentService().parentService().getSelected();
										if (Isreadonly || prcItem.BasItemTypeFk === 7) {
											service.setFieldReadonly(readItems);
										}
										return dataRead;
									}
								}
							},
							entityRole: {leaf: {itemName: 'PrcItemScopeDtlBlob', parentService: parentService}}
						}
					};

				serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

				// read service from serviceContainer
				service = serviceContainer.service;
				var readonlyFields = [{field: 'PlainText', readonly: true}, {field: 'PrcTextTypeFk', readonly: true},{field: 'Content', readonly: true}, {field: 'ContentString', readonly: true}];
				service.setFieldReadonly = function(items){
					if(_.isArray(items)){
						_.forEach(items, function(item){
							platformRuntimeDataService.readonly(item, readonlyFields);
						});
					}
				};
				canItemTypeEdit = function () {
					var parentItem;
					if(parentService.getItemName()==='PrcItemScopeDetail'){
						parentItem = parentService.parentService().parentService().getSelected();
						if(_.isNil(parentService.getSelected())){
							return false;
						}
					}else {
						parentItem = parentService.getSelected();
					}
					if (parentItem) {
						let itemTypeFk = parentItem.BasItemTypeFk;
						let isReadonly = itemTypeFk === 7 ? true : false;
						$($('#ui-layout-east').find('#itemTextArea')).attr('disabled', isReadonly);
						setTimeout(()=>{$($('#ui-layout-east').find('.ql-editor')).attr('contenteditable', !isReadonly);},200);
						if (itemTypeFk === 7) {
							return false;
						} else {
							return true;
						}
					}
					return false;
				};
				service.data = serviceContainer.data;

				service.registerEntityCreated(hasText);
				service.registerEntityDeleted(hasText);

				function hasText() {
					var scopeDetail = parentService.getSelected();
					var itemList = service.getList();
					var hasText = itemList.length > 0;

					if (scopeDetail.HasText !== hasText) {
						scopeDetail.HasText = hasText;
						parentService.markItemAsModified(scopeDetail);
					}
				}

				setReadonlyor = function () {
					var getModuleStatusFn = parentService.getItemStatus || parentService.getModuleState;
					if (getModuleStatusFn) {
						var status = getModuleStatusFn();
						if(status){
							return !(status.IsReadOnly || status.IsReadonly);
						}
					}
					return false;
				};
				var canCreate = service.canCreate;
				service.canCreate = function () {
					if(!parentService.getSelected()){
						return false;
					}
					return canCreate() && setReadonlyor() && canItemTypeEdit();
				};
				var canDelete = service.canDelete;
				service.canDelete = function () {
					if(!parentService.getSelected()){
						return false;
					}
					return canDelete() && setReadonlyor() && canItemTypeEdit();
				};
				service.getModuleState = function () {
					return setReadonlyor();
				};
				service.readonlyFieldsByItemType=(entity,itemTypeFk)=>{
					let columns = Object.keys(entity);
					_.forEach(columns, (item) => {
						if(itemTypeFk=== 7){
							platformRuntimeDataService.readonly(entity, [{field: item, readonly: true}]);
						}
					});
				};
				service.updateToolsEvent = new PlatformMessenger();
				return service;
			}

			return procurementCommonServiceCache.registerService(constructorFn, 'prcItemScopeItemTextDataService');
		}
	]);

})(angular);