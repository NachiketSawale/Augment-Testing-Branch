
(function () {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.main';
	let estimateProjectModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name estimateMainRemovePackageResourcesDialogService
	 * @function
	 *
	 * @description
	 * This is the data service to remove Package assigned to the specific Resources.
	 */
	angular.module(moduleName).factory('estimateMainRemovePackageResourcesDialogService', ['$q', '$http', '$injector', 'platformDataServiceFactory', 'projectMainService', 'PlatformMessenger', 'estimateMainService','estimateMainCommonService',
		function ($q, $http, $injector, platformDataServiceFactory, projectMainService, PlatformMessenger, estimateMainService,estimateMainCommonService) {

			let service = {};
			let dataList  =[];
			let isLoading = false;

			function registerListLoaded(callBackFn) {
				service.listLoaded.register(callBackFn);
			}
			function unregisterListLoaded(callBackFn) {
				service.listLoaded.unregister(callBackFn);
			}

			function getList(){
				return  dataList;
			}

			angular.extend(service, {
				listLoaded: new PlatformMessenger(),
				registerListLoaded: registerListLoaded,
				unregisterListLoaded: unregisterListLoaded,
				getList: getList,
				onResizeGrid: new PlatformMessenger()
			});

			let estimateProjectHeaderListServiceOptions = {
				module: estimateProjectModule,
				modification: {multi: {}},
				translation: {
					uid: 'estimateMainRemovePackageResourcesDialogService',
					title: 'Title',
					columns: [
						{
							header: 'cloud.common.entityDescription',
							field: 'DescriptionInfo'
						}]
				},
				entitySelection: {}
			};
			service.onLoadPackageResource = new PlatformMessenger();
			let container = platformDataServiceFactory.createNewComplete(estimateProjectHeaderListServiceOptions);

			container.data.usesCache = false;

			angular.extend(service, container.service);

			service.addItems = function addItems(items) {
				if (items === null) {
					dataList = null;
					return;
				}
				dataList = items ? items : [];
				angular.forEach(dataList, function(item){
					item.IsChecked = true;
				});
				container.data.itemList = dataList;
				service.refreshGrid();
			};

			service.getDataItem = function getDataItem() {
				return dataList;
			};

			service.setDataList= function(isWizardOpen, packagesToFilter, selectedScope) {
				function getEstimateScope(estimateScope) {
					if (estimateScope === 1 || estimateScope === 2) {
						return 'SelectedLineItems';
					} else if (estimateScope === 0) {
						return 'AllItems';
					}
				}
				if(isWizardOpen){
					let filterData = {};
					let selectedLineItems = selectedScope === 1 ? estimateMainService.getList() : estimateMainService.getSelectedEntities();
					filterData.SelectedLevel = getEstimateScope(selectedScope);
					filterData.EstLineItemIds = selectedLineItems ? _.map(selectedLineItems, 'Id'):[];
					filterData.EstHeaderIds =[];
					filterData.EstHeaderIds.push(estimateMainService.getSelectedEstHeaderId());
					let selectedPackages =  packagesToFilter && packagesToFilter.length ? packagesToFilter : $injector.get('estimateMainRemovePackageWizardDetailService').getPackagesToRemove();
					filterData.PrcPackageIds = selectedPackages && selectedPackages.length ? _.map(selectedPackages, 'Id'):[];
					service.setIsLoading(true);
					return $http.post(globals.webApiBaseUrl + 'estimate/main/resource/getlistbypackage', filterData).then(function(response) {
						if (response && response.data) {
							_.forEach(response.data, function (item) {
								estimateMainCommonService.translateCommentCol(item);
							});
							return $injector.get('estimateMainResourceDetailService').setResourcesBusinessPartnerName(response.data, response.data).then(function (/* result */) {
								service.addItems(response.data);
								service.setIsLoading(false);
								service.onLoadPackageResource.fire(response.data);

								return dataList;
							});
						} else {
							dataList = null;
						}

						service.setIsLoading(false);
						return $q.when(dataList);
					});

				}else{
					dataList= null;
					return $q.when(dataList);
				}
			};

			service.refreshGrid = function refreshGrid() {
				service.listLoaded.fire();
			};

			service.parentService = function(){
				return estimateMainService;
			};

			service.setValueToDataList = function setValueToDataList(col, value){
				dataList = dataList ? dataList : [];
				angular.forEach(dataList, function(item){
					item[col] = value;
				});
			};

			service.getPackageResourcesToRemove = function getPackageResourcesToRemove() {
				let filteredList = [];
				if(dataList && dataList.length){
					filteredList = _.filter(dataList, function(item){
						return item.IsChecked;
					});
				}
				return filteredList;
			};

			service.setIsLoading = function setIsLoading(value){
				isLoading = value;
			};

			service.getIsLoading = function getIsLoading(){
				return isLoading;
			};

			return service;
		}]);
})();
