/**
 * Created by badugula on 25.08.2019.
 */
(function () {
	'use strict';
	/* global _ */
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
     * @ngdoc service
     * @name estimateMainRuleRemoveDetailService
     * @function
     *
     * @description
     * estimateMainRuleRemoveDetailService is the data service for estimate rules lookup to Gird data assignment
     */
	estimateMainModule.factory('estimateMainRuleRemoveDetailService', ['platformTranslateService','PlatformMessenger','estimateRuleComplexLookupCommonService','platformDataServiceFactory',
		function (platformTranslateService,PlatformMessenger,estimateRuleComplexLookupCommonService,platformDataServiceFactory) {

			let service = {};
			let gridColumns = [
				{

				}
			];
			let dataList  =[];

			angular.extend(service, {
				listLoaded: new PlatformMessenger(),
				registerListLoaded: registerListLoaded,
				unregisterListLoaded: unregisterListLoaded,
				getList: getList,
				addItems:addItems
			});

			platformTranslateService.translateGridConfig(gridColumns);

			let serviceOption;
			serviceOption = {
				module: angular.module(moduleName),
				entitySelection: {},
				modification: {multi: {}},
				translation: {
					uid: 'estimateMainRuleRemoveDetailService',
					title: 'Title',
					columns: [
						{
							header: 'cloud.common.entityDescription',
							field: 'DescriptionInfo'
						}]
				}
			};

			let container;
			container = platformDataServiceFactory.createNewComplete(serviceOption);

			service.setDataList= function(data) {
				addItems(data);
				container.data.itemList = dataList;
			};

			angular.extend(service, container.service);

			service.getStandardConfigForListView = function () {
				return {
					columns: estimateRuleComplexLookupCommonService.getColumnsReadOnly()
				};
			};

			function registerListLoaded(callBackFn) {
				service.listLoaded.register(callBackFn);
			}
			function unregisterListLoaded(callBackFn) {
				service.listLoaded.unregister(callBackFn);
			}

			function getList(){
				return  dataList;
			}

			function addItems(items) {
				if (items === null) {
					dataList = null;
					return;
				}
				dataList = dataList ? dataList : [];
				angular.forEach(items, function(item){
					let matchItem = _.find(dataList, {Code : item.Code});
					if(!matchItem){
						dataList.push(item);
					}
				});
				service.refreshGrid();
			}

			service.refreshGrid = function refreshGrid() {
				service.listLoaded.fire();
			};

			return service;
		}]
	);
})();
