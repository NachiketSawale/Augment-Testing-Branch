/**
 * Created by anl on 23/06/2022.
 */

(function (angular) {
	'use strict';
	let module = angular.module('productionplanning.item');

	module.service('productionplanningItemSubItemDataService', SubItemDataService);

	SubItemDataService.$inject = [
		'_', '$q', '$http', '$timeout', '$injector',
		'platformDataServiceFactory',
		'schedulingMainActivityBaseLineComparisonService',
		'platformDataServiceDataPresentExtension',
		'productionplanningItemDataService',
		'basicsCommonToolbarExtensionService',
		'ppsVirtualDateshiftDataServiceFactory',
		'productionplanningCommonEventMainServiceFactory',
		'productionplanningItemProcessor',
		'basicsLookupdataLookupDescriptorService'];

	function SubItemDataService(
		_, $q, $http, $timeout, $injector,
		platformDataServiceFactory,
		schedulingMainActivityBaseLineComparisonService,
		platformDataServiceDataPresentExtension,
		rootItemDataService,
		basicsCommonToolbarExtensionService,
		ppsVirtualDateshiftDataServiceFactory,
		eventMainServiceFactory,
		productionplanningItemProcessor,
		basicsLookupdataLookupDescriptorService) {

		let scope = {};
		let parentItemFilter = null;
		let IsContainerLocked = false;

		const setLockIcon = (lock) => {
			IsContainerLocked = angular.isDefined(lock) ? lock : IsContainerLocked;
			if(scope.tools) {
				scope.tools.update();
			}
		};

		let subItemServiceOption = {
			flatNodeItem: {
				module: module,
				serviceName: 'productionplanningItemSubItemDataService',
				entityNameTranslationID: 'productionplanning.item.entityItem',
				httpRead: {
					route: globals.webApiBaseUrl + 'productionplanning/item/',
					endRead: 'getsubitems'
				},
				actions: {delete: false, create: false},
				dataProcessor: [productionplanningItemProcessor],
				presenter: {
					list: {
						incorporateDataRead: incorporateDataRead
					}
				},
				entityRole: {
					node: {
						itemName: 'SubItem',
						parentService: rootItemDataService,
						parentFilter: 'mainItemId'
					}
				}
			}
		};

		function incorporateDataRead(readData, data) {
			basicsLookupdataLookupDescriptorService.attachData(readData.lookups);
			let result = {
				FilterResult: readData.FilterResult,
				dtos: readData.dtos || []
			};

			service.sysClerkSlot(readData.dtos);
			service.appendItemsToRootService(readData.dtos);

			bindToPpsItems(result.dtos);

			return container.data.handleReadSucceeded(result, data);
		}

		function bindToPpsItems(subItems) {
			const ppsItems = service.parentService().getList();

			for (let i = 0; i < subItems.length; i++) {
				const ppsItem = ppsItems.filter(item => item.Id === subItems[i].Id)[0];
				if (ppsItem) {
					subItems[i] = ppsItem;
				}
			}
		}

		let container = platformDataServiceFactory.createNewComplete(subItemServiceOption);
		let service = container.service;
		container.data.doNotUnloadOwnOnSelectionChange = true;
		container.data.doNotLoadOnSelectionChange = true;

		// todo: rename to prouctionplanning.item
		ppsVirtualDateshiftDataServiceFactory.createNewVirtualDateshiftDataService('productionplanning.common', service);

		// For dateshift validation of dynamic slot date field, here we need to initialize ppsItemEvent dataService in advanced.
		// In initialization of ppsItemEvent dataService, a relative configuration will be registered to virtualDateshift service.(by zwz on 2021/11/18 for fixing issue of HP-ALM #125321)
		eventMainServiceFactory.getService('ItemFk', 'productionplanning.common.item.event', service);

		service.setScope = ($scope) => {
			scope = $scope;
			if (parentItemFilter !== null) {
				service.loadSubItems();
			}
		};

		service.containerRefresh = () => {
			service.resetLockIcon();
			service.gridRefresh();
		};

		service.resetLockIcon = (flag) =>{
			setLockIcon(flag);
		};

		const selectionChange = () => {
			let subItemSelected = container.data.selectedItem;
			if (subItemSelected) {
				setLockIcon(true);
				rootItemDataService.setSelected(subItemSelected);
			}
		};

		service.setParentItemFilter = (selectedItem) => {
			parentItemFilter = selectedItem;
		};

		service.getParentItemFilter = () => {
			return parentItemFilter;
		};

		service.loadSubItems = () => {
			if (parentItemFilter !== null) {
				setLockIcon(false);
				service.setFilter('mainItemId=' + parentItemFilter.Id);
				service.load().then(() => {
					let parentSelected = rootItemDataService.getSelected();
					if (parentSelected !== null) {
						let subItem = _.find(service.getList(), {Id: parentSelected.Id});
						if (subItem !== null) {
							service.setSelected(subItem);
						}
					}
				});
			}
		};

		service.appendItemsToRootService = (subItems) => {
			if (_.isArray(subItems)) {
				let newItems = [];
				let rootItemList = rootItemDataService.getList();
				_.each(subItems, (subItem) => {
					if (!_.find(rootItemList, {Id: subItem.Id})) {
						newItems.push(subItem);
					}
				});
				if (newItems.length > 0) {
					rootItemDataService.appendItems(newItems);
				}
			}
		};

		service.sysClerkSlot = (dtos) => {
			if(rootItemDataService.clerkChanged === true){
				let itemList = rootItemDataService.getUnfilteredList();
				_.forEach(dtos, function (dto){
					let matchItem = _.find(itemList, function (item){
						return item.Id === dto.Id;
					});
					if(matchItem){
						angular.extend(dto, matchItem);
					}
				});
			}
		};

		service.onValueChanged = (newChangedItem, col) => {
			let rootItemList = rootItemDataService.getList();
			let selectedRootItem = _.find(rootItemList, {Id: newChangedItem.Id});
			if (selectedRootItem) {
				rootItemDataService.markItemAsModified(selectedRootItem);
			}
			if(col === 'ProductDescriptionCode'){
				rootItemDataService.setSubItemDescriptionCodeChanged(true);
			}
			if(col === 'SiteFk') {
				rootItemDataService.siteChanged = true;
			}
		};

		service.registerSelectionChanged(selectionChange);

		let cache = [];
		service.copy = () => {
			let source = service.getSelectedEntities();
			cache = _.map(source, function (s) {
				return {Id: s.Id,
					PPSHeaderFk: s.PPSHeaderFk,
					MdcMaterialFk: s.MdcMaterialFk
				};
			});
		};

		service.paste = () => {
			if (cache.length > 0) {
				if(!_.some(cache, ['PPSHeaderFk', parentItemFilter.PPSHeaderFk])){
					$injector.get('platformModalService').showErrorBox('productionplanning.item.wizard.notSame', 'productionplanning.item.wizard.itemGroup.notSameTitle');
					return;
				}
				$http.post(globals.webApiBaseUrl + 'productionplanning/item/copyfromsubitems?targetItemId=' + parentItemFilter.Id, _.map(cache, 'Id')).then(function (response) {
					let returnItems = response.data.dtos;
					basicsLookupdataLookupDescriptorService.attachData(response.data.lookups);

					$injector.get('ppsItemCreateSubPUsService').syncItemsAfterCreation(parentItemFilter, returnItems);
				});
			}
		};

		service.CopyCache = () => {
			return cache;
		};

		service.update = rootItemDataService.update;

		service.setPPSDocConfig = function (containerId, parentSrvName, selectedItem){
			var dataFactory = $injector.get('ppsCommonDocumentCombineDataServiceFactory');
			if(dataFactory){
				dataFactory.setConfig(containerId, parentSrvName, selectedItem);
			}
		};

		service.IsContainerLocked = () =>{
			return IsContainerLocked;
		};

		return service;
	}
})(angular);