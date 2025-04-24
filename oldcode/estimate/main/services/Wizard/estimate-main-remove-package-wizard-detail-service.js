(function () {
	'use strict';
	/* global globals, _ */
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateMainRemovePackageWizardDetailService
	 * @function
	 *
	 * @description
	 * estimateMainRuleRemoveDetailService is the data service for  Remove package wizard Grid
	 */
	estimateMainModule.factory('estimateMainRemovePackageWizardDetailService', ['$injector', '$http', 'estimateMainService', 'platformTranslateService', 'PlatformMessenger', 'platformDataServiceFactory','estimateMainRemovePackageResourcesDialogService','basicsLookupdataLookupDescriptorService',
		function ($injector, $http, estimateMainService, platformTranslateService, PlatformMessenger, platformDataServiceFactory,packageResourcesService,basicsLookupdataLookupDescriptorService) {

			let service = {};
			let dataList = [],
				isProtectContractedPackageOption= false;

			angular.extend(service, {
				listLoaded: new PlatformMessenger(),
				onSelectionChanged: new PlatformMessenger(),
				registerListLoaded: registerListLoaded,
				unregisterListLoaded: unregisterListLoaded,
				getList: getList,
				addItems: addItems,
				getPackagesToRemove: getPackagesToRemove,
				updateOnHeaderCheckboxChange: updateOnHeaderCheckboxChange
			});

			service.getColumnsReadOnly = function getColumnsReadOnly() {
				let columns = [
					{
						id: 'isChecked',
						field: 'IsChecked',
						name$tr$: 'estimate.main.generateProjectBoQsWizard.select',
						toolTip: 'Select',
						formatter: 'boolean',
						editor: 'boolean',
						width: 65,
						headerChkbox: true,
						validator: 'isCheckedValueChange',
						isTransient : true,
						sortOrder:0
					},
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						width: 200,
						toolTip: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode',
						grouping: {
							title: 'cloud.common.entityCode',
							getter: 'Code',
							aggregators: [],
							aggregateCollapsed: true
						}
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						width: 275,
						toolTip: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					}
				];
				return columns;
			};

			platformTranslateService.translateGridConfig(service.getColumnsReadOnly());

			let serviceOption;
			serviceOption = {
				module: angular.module(moduleName),
				entitySelection: {},
				modification: {multi: {}},
				translation: {
					uid: 'estimateMainRemovePackageWiyardDetailService',
					title: 'Title',
					columns: [
						{
							header: 'cloud.common.entityDescription',
							field: 'Description'
						}]
				}
			};

			let container;
			container = platformDataServiceFactory.createNewComplete(serviceOption);

			service.setDataList = function (isWizardOpen,selectedScope) {

				if (isWizardOpen) {
					let estHeaderId= estimateMainService.getSelectedEstHeaderId();
					let selectedLineItemId = [];
					if(selectedScope === 2 ){
						let selectedItem = estimateMainService.getSelectedEntities();
						if(selectedItem.length > 0){
							for(let i = 0; i < selectedItem.length; i++){
								selectedLineItemId.push(selectedItem[i].Id);
							}
						}
					}
					if(selectedScope === 1 ){
						let selectedItems = estimateMainService.getList();
						if(selectedItems.length > 0){
							_.forEach(selectedItems,(item)=>{
								selectedLineItemId.push(item.Id);
							});
						}
					}
					packageResourcesService.setIsLoading(true);
					return $injector.get('procurementPackageDataService').asyncProtectContractedPackageItemAssignment().then(function(isProtectContractedPackage){
						isProtectContractedPackageOption = isProtectContractedPackage;
						let data = {
							estHeaderId:estHeaderId,
							selectedLineItemIds:selectedLineItemId
						};
						return $http.post(globals.webApiBaseUrl + 'procurement/package/package/getprcitemassignmentsandpackages',data).then(function (response) {
							if (response && response.data && response.data.length >= 1) {
								_.forEach(response.data, function (item) {
									unCheckContractedPackage(item.Item1);
								});
								if(dataList){
									_.forEach(response.data, function (respData) {
										_.forEach(respData.Item1, function (packageItem) {
											_.find(dataList, function (item) {
												if (item.Id === packageItem.Id) {
													packageItem.IsChecked = packageItem.IsContracted ? false : item.IsChecked;
												}
											});
										});
									});
								}
								dataList = null;
								_.forEach(response.data, function (respData) {
									addItems(respData.Item1);
								});
								let packagesToRemove =_.filter(dataList, {'IsChecked': true});
								packageResourcesService.setIsLoading(false);
								return packageResourcesService.setDataList(true, packagesToRemove, selectedScope).then(function (result){
									return result;
								});
							} else {
								dataList = null;
								addItems(response.data);
								packageResourcesService.setIsLoading(false);
							}
						});

					});

				} else {
					dataList = null;
				}
			};

			angular.extend(service, container.service);

			service.getStandardConfigForListView = function () {
				return {
					columns: service.getColumnsReadOnly()
				};
			};

			function registerListLoaded(callBackFn) {
				service.listLoaded.register(callBackFn);
			}

			function unregisterListLoaded(callBackFn) {
				service.listLoaded.unregister(callBackFn);
			}

			function getList() {
				return dataList;
			}

			function addItems(items) {
				if (items === null) {
					dataList = null;
					return;
				}
				dataList = dataList ? dataList : [];
				angular.forEach(items, function (item) {
					let matchItem = _.find(dataList, {Code: item.Code});
					if (!matchItem) {
						dataList.push(item);
					}
				});
				container.data.itemList = dataList;
				service.refreshGrid();
			}

			function getPackagesToRemove() {
				let filteredList = [];

				if (dataList && dataList.length) {
					filteredList = _.filter(dataList, function (item) {
						return item.IsChecked && !item.IsContracted;
					});
				}
				container.data.itemList = dataList;
				return filteredList;
			}

			function updateOnHeaderCheckboxChange(){
				dataList = dataList ? dataList : [];
				unCheckContractedPackage(dataList);

				if(isProtectContractedPackageOption){
					container.data.itemList = dataList;
					service.refreshGrid();
				}
			}

			function unCheckContractedPackage(list){
				if(isProtectContractedPackageOption){
					let platformRuntimeDataService = $injector.get('platformRuntimeDataService');
					_.forEach(list,function(item){
						let pakStatus = basicsLookupdataLookupDescriptorService.getData('PackageStatus');
						let status = _.find(pakStatus, {Id: item.PackageStatusFk});
						if (status.IsContracted) {
							item.IsContracted = true;
							item.IsChecked = !item.IsContracted;
							platformRuntimeDataService.readonly(item, [{ field: 'IsChecked', readonly: true }]);
						}else{
							let prcItem = _.find(list[0].Item2, {PrcPackageFk: item.Id, IsContracted:true });
							if(prcItem){
								item.IsContracted = true;
								item.IsChecked = !item.IsContracted;
								platformRuntimeDataService.readonly(item, [{ field: 'IsChecked', readonly: true }]);
							}
						}
					});
				}
			}

			service.refreshGrid = function refreshGrid() {
				service.listLoaded.fire();
			};

			service.getSelectedPackages = function getSelectedItems() {
				let resultSet = service.getSelectedEntities();
				return resultSet;
			};

			service.parentService = function parentService() {
				return estimateMainService;
			};
			return service;
		}]
	);
})();
