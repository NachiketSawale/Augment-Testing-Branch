
(function () {
	'use strict';
	/* global _  globals */
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);

	estimateMainModule.factory('estimateMainParamRemoveDetailService', ['$http','$injector','platformTranslateService','PlatformMessenger','estimateRuleComplexLookupCommonService','platformDataServiceFactory','basicsLookupdataLookupDescriptorService',
		function ($http,$injector,platformTranslateService,PlatformMessenger,estimateRuleComplexLookupCommonService,platformDataServiceFactory,basicsLookupdataLookupDescriptorService) {

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
				addItems:addItems,
				initController:new PlatformMessenger()
			});

			platformTranslateService.translateGridConfig(gridColumns);

			let serviceOption;
			serviceOption = {
				module: angular.module(moduleName),
				entitySelection: {},
				modification: {multi: {}},
				translation: {
					uid: 'estimateMainParamRemoveDetailService',
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
				_.forEach(dataList,function (d) {
					service.setReadOnly(d);
					d.ProjectEstRuleFk = d.PrjEstRuleFk;
				});
				return  dataList;
			}

			service.loadParam = function (prjEstRuleFks) {
				let param = {
					ruleIds: prjEstRuleFks
				};
				$http.post(globals.webApiBaseUrl + 'estimate/rule/projectestruleparam/listbyprjruleIds', param).then (function (response) {
					basicsLookupdataLookupDescriptorService.updateData('EstMainParameterValues',response.data.PrjRuleParameterValueLookup);
					let data = response.data.Main;
					_.forEach(data,function (d) {
						d.isChecked = true;
					});
					addItems (data);
				});
			};

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

			service.setReadOnly= function(item){
				$injector.get('platformRuntimeDataService').readonly(item, [
					{field:  'Code', readonly: 'readonly'},
					{field:  'DescriptionInfo.Translated', readonly: 'readonly'},
					{field:  'ProjectEstRuleFk', readonly: 'readonly'},
					{field:  'EstRuleParamValueFk', readonly: 'readonly'},
					{field:  'AssignedStructureId', readonly: 'readonly'},
					{field:  'IsLookup', readonly: 'readonly'},
					{field:  'ValueType', readonly: 'readonly'},
					{field:  'DefaultValue', readonly: 'readonly'},
					{field:  'UomFk', readonly: 'readonly'},
					{field:  'ParameterValue', readonly: 'readonly'},
					{field:  'ValueDetail', readonly: 'readonly'},
					{field:  'EstParameterGroupFk', readonly: 'readonly'}
				]);
			};

			service.removeParam = function removeParam(prjEstRuleFk){
				dataList = _.filter(dataList,function (d) {
					return  d.PrjEstRuleFk !== prjEstRuleFk;
				});
				service.refreshGrid();
			};

			service.refreshGrid = function refreshGrid() {
				service.listLoaded.fire();
			};

			return service;
		}]
	);
})();
