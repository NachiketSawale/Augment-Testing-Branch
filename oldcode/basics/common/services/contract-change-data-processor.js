/**
 * Created by yew on 19.12.2019.
 */

(function () {
	'use strict';
	const moduleName = 'basics.common';

	/**
	 * @ngdoc service
	 * @name basicsCommonContractChangeDataProcessor
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('basicsCommonContractChangeDataProcessor', ['$http', '$injector', '$translate', 'platformRuntimeDataService', 'platformModalService', '_', 'globals',
		function ($http, $injector, $translate, platformRuntimeDataService, platformModalService, _, globals) {
			function doReadData(service, parentService, readData, data) {
				setRowReadonly(readData);
				const itemList = data.handleReadSucceeded(readData, data);
				const parentHeader = parentService.getSelected();
				let entity = _.filter(readData, function (e) {
					return e.Id === parentHeader.Id;
				})[0];
				if (readData.length > 0 && readData[0].ChildItems) {
					service.setSelected(readData[0].ChildItems[0]);
				}
				if (entity) {
					service.setSelected(entity);
				} else if (readData.length > 0 && readData[0].ChildItems) {
					entity = _.filter(readData[0].ChildItems, function (e) {
						return e.Id === parentHeader.Id;
					})[0];
					service.setSelected(entity);
				}
				return itemList;
			}

			function doCreateItem(service, parentService, url, createItem, createChildItem) {
				const sel = service.getSelected();
				const parentHeader = parentService.getSelected();
				if (_.isUndefined(parentHeader)) {
					return;
				}
				let mainItemId = parentHeader.Id;
				if (sel && sel.HasChildren === true) {
					mainItemId = sel.Id;
				} else if (service.getTree().length > 0) {
					mainItemId = service.getTree()[0].Id;
				}
				$http.get(globals.webApiBaseUrl + url + mainItemId).then(function (response) {
					if (response.data === null) {
						platformModalService.showMsgBox($translate.instant('procurement.contract.createChangeNotFound'), 'Issue', 'ico-info');
						return;
					}
					if (sel && sel.HasChildren === false) {
						return createItem();
					}
					return createChildItem();
				});

			}

			function doCallOffCreateItem(service, parentService, url, createItem, createChildItem) {
				const sel = service.getSelected();
				const parentHeader = parentService.getSelected();
				if (_.isUndefined(parentHeader)) {
					return;
				}
				let mainItemId = parentHeader.Id;
				if (sel && sel.HasChildren === true) {
					mainItemId = sel.Id;
				} else if (service.getTree().length > 0) {
					mainItemId = service.getTree()[0].Id;
				}
				if (url === null) {
					if (sel && sel.HasChildren === false) {
						return createItem();
					}
					return createChildItem();
				}
				$http.get(globals.webApiBaseUrl + url + mainItemId).then(function (response) {
					if (response.data !== null) {
						platformModalService.showMsgBox($translate.instant('procurement.contract.createCallOffNotFound'), 'Issue', 'ico-info');
						return;
					}
					if (sel && sel.HasChildren === false) {
						return createItem();
					}
					return createChildItem();
				});

			}

			function doOnCreateSucceeded(service, parentService, created, data, creationData, onCreateSucceeded, serviceContainerData) {
				if (_.isUndefined(creationData.parent) || _.isUndefined(creationData.parent.ChildItems)) {
					creationData.parent = parentService.getSelected();
					creationData.parent.HasChildren = true;
				}
				return onCreateSucceeded.call(serviceContainerData, created, data, creationData).then(function () {
					const copyList = angular.copy(parentService.getList());
					const copyEntity = angular.copy(created);
					parentService.allHeaderData.push(copyEntity);
					copyList.push(copyEntity);
					parentService.setList(copyList);
					parentService.setSelected(copyEntity);
					setRowReadonly([created]);
					service.setSelected(created);
					parentService.clearModifications();
				});
			}

			function setRowReadonly(items) {
				if (_.isArray(items)) {
					_.forEach(items, function (item) {
						platformRuntimeDataService.readonly(item, true);
						if (item.ChildItems !== null && item.ChildItems.length > 0) {
							_.forEach(item.ChildItems, function (childItem) {
								platformRuntimeDataService.readonly(childItem, true);
							});
						}
					});
				}
			}

			function doDeleteItem(service, parentService, url, serviceContainerData) {
				const confirmDeleteDialogHelper = $injector.get('prcCommonConfirmDeleteDialogHelperService');
				const sel = service.getSelected();
				if (sel.HasChildren) {
					platformModalService.showMsgBox($translate.instant('procurement.contract.deleteChanges'), 'Info', 'ico-info');
					return;
				}

				confirmDeleteDialogHelper.deleteEntities(function (sel) {
					$http.post(globals.webApiBaseUrl + url, sel).then(function () {
						const list = parentService.getList();
						const parentHeader = parentService.getSelected();
						const parentList = _.filter(list, function (e) {
							return e.Id !== sel.Id;
						});
						parentService.allHeaderData = _.filter(parentService.allHeaderData, function (e) {
							return e.Id !== sel.Id;
						});
						parentService.setList(parentList);
						if (parentHeader.Id === sel.Id) {
							parentService.setSelected(_.filter(parentService.allHeaderData, function (e) {
								return e.Id === service.getTree()[0].Id;
							})[0]);
						} else {
							parentService.setSelected(parentHeader);
						}
						service.deleteItem(sel);
						parentService.clearModifications();
					});
				}, sel, serviceContainerData);
			}

			return {
				'doReadData': doReadData,
				'doCreateItem': doCreateItem,
				'doOnCreateSucceeded': doOnCreateSucceeded,
				'doDeleteItem': doDeleteItem,
				'doCallOffCreateItem': doCallOffCreateItem
			};
		}
	]);
})(angular);
