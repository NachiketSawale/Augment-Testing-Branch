
(function () {
	'use strict';
	/* global globals, _ */
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);

	estimateMainModule.factory('estimateAllowanceAssignmentGridService', ['$http','$q','$injector','platformTranslateService','PlatformMessenger','platformRuntimeDataService','platformDataServiceFactory','basicsLookupdataLookupFilterService',
		function ($http,$q,$injector,platformTranslateService,PlatformMessenger,platformRuntimeDataService,platformDataServiceFactory,basicsLookupdataLookupFilterService) {

			let service = {},
				source = null,
				data = [],
				mdcContextId = null,
				itemsToSave = [],
				itemsToDelete = [];

			let lookupFilter = [
				{
					key: 'estimate-main-structure-detail-est-quantity-relation',
					serverSide: false,
					fn: function (item) {
						return item.IsLive;
					}
				}
			];

			angular.extend(service, {
				getList: getList,
				clear : clear,
				setDataList: setDataList,
				setMdcContextId:setMdcContextId,
				getMdcContextId:getMdcContextId,
				loadAllowanceAssignment:loadAllowanceAssignment,
				setSource: setSource,
				getSource:getSource,
				refreshGrid: refreshGrid,
				gridRefresh: gridRefresh,
				createItem : createItem,
				deleteItem:deleteItem,
				setItemToSave: setItemToSave,
				getItemsToSave : getItemsToSave,
				getItemsToDelete : getItemsToDelete,
				registerListLoaded: registerListLoaded,
				unregisterListLoaded: unregisterListLoaded,
				registerSelectionChanged: registerSelectionChanged,
				unregisterSelectionChanged: unregisterSelectionChanged,

				registerLookupFilter: registerLookupFilter,
				unregisterLookupFilter: unregisterLookupFilter,

				listLoaded: new PlatformMessenger(),
				selectionChanged : new PlatformMessenger(),
				hasEstStructureErr: new PlatformMessenger()
			});

			let serviceOption = {
				module: angular.module(moduleName),
				entitySelection: {},
				modification: {multi: {}},
				translation: {
					uid: 'estimateAllowanceAssignmentGridService',
					title: 'Title',
					columns: [
						{
							header: 'cloud.common.entityDescription',
							field: 'DescriptionInfo'
						}]
				}
			};

			let container = platformDataServiceFactory.createNewComplete(serviceOption);
			container.data.itemList = [];
			angular.extend(service, container.service);
			return service;



			function setMdcContextId(value) {
				mdcContextId = value;
			}
			function getMdcContextId() {
				return mdcContextId;
			}

			function getList() {
				return data;
			}

			function setSource(value) {
				source = value;
			}


			function getSource() {
				return source;
			}

			function setDataList(items) {
				if (Array.isArray(items)) {
					data = items;
				} else {
					data = [];
				}
				return items;
			}

			function addItem(item) {
				data = data ? data : [];
				data.push(item);
				setItemToSave(item);
				service.refreshGrid();
			}
			function registerLookupFilter() {
				basicsLookupdataLookupFilterService.registerFilter(lookupFilter);
			}

			function unregisterLookupFilter() {
				basicsLookupdataLookupFilterService.unregisterFilter(lookupFilter);
			}

			function refreshGrid() {
				service.listLoaded.fire();
			}

			function updateSelection() {
				service.selectionChanged.fire();
			}

			function registerListLoaded(callBackFn) {
				service.listLoaded.register(callBackFn);
			}

			function unregisterListLoaded(callBackFn) {
				service.listLoaded.unregister(callBackFn);
			}

			function registerSelectionChanged(callBackFn) {
				service.selectionChanged.register(callBackFn);
			}

			function unregisterSelectionChanged(callBackFn) {
				service.selectionChanged.unregister(callBackFn);
			}

			function setItemToSave(item) {
				let modified = _.find(itemsToSave, {Id : item.Id});
				if(!modified){
					itemsToSave.push(item);
				}
			}

			function gridRefresh() {
				refreshGrid();
			}

			function createItem() {
				let  currentAllowanceConfig = $injector.get('estimateAllowanceConfigTypeDialogDataService').getCurrentAllowanceConfigType();
				// server create
				let httpRoute = globals.webApiBaseUrl + 'estimate/EstAllowanceConfigType/createEstAllowanceAssignment',
					postData = {
						EstAllowanceConfigId : currentAllowanceConfig.AllowanceConfigFk
					};

				return $http.post(httpRoute, postData).then(function(response){
					let item = response.data;
					if(item && item.Id){
						addItem(item);
						service.setSelected(item);
						updateSelection();

						platformRuntimeDataService.applyValidationResult({
							valid: false,
							error: '...',
							error$tr$: 'estimate.main.mdcAllowanceFkEmptyErrMsg'
						}, item, 'MdcAllowanceFk');
						refreshGrid();
					}
					return item;
				});
			}

			function deleteItem(selectedItem){
				// let selectedItem = service.getSelected();
				if(selectedItem === null){
					return;
				}

				if(selectedItem && selectedItem.Version > 0){
					itemsToDelete.push(selectedItem);
				}

				data = _.filter(data, function(d){
					return d.Id !== selectedItem.Id;
				});

				itemsToSave = _.filter(itemsToSave, function(d){
					return d.Id !== selectedItem.Id;
				});

				$injector.get('estimateMdcAllowanceCompanyService').clearGridData();
				refreshGrid();
				// service.setSelected(item);
				updateSelection();
			}

			function getItemsToSave(){
				return itemsToSave.length ? itemsToSave : null;
			}

			function getItemsToDelete(){
				return itemsToDelete.length ? itemsToDelete : null;
			}

			function clear(){
				itemsToSave = [];
				itemsToDelete = [];
				data =[];
				service.setSelected(null);
			}

			function loadAllowanceAssignment(allowanceConfigFk) {

				if(!allowanceConfigFk){
					clear();
					refreshGrid();
					return $q.when(null);
				}
				// server create
				let httpRoute = (globals.webApiBaseUrl + 'estimate/EstAllowanceConfigType/getEstAllowanceAssignment?allowanceConfigFk='+allowanceConfigFk);
				return $http.get(httpRoute).then(function(response){
					setDataList(response.data.EstAllowanceAssignment);
					refreshGrid();
					return response.data.ConfigEntity;
				});
			}

		}]
	);
})();
