/**
 * Created by Joshi on 16.11.2016.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainParamStructureLookupDataService
	 * @function
	 * @description
	 * this is the data service providing data for parameter assigned structure lookup
	 */
	angular.module(moduleName).service('estimateMainParamStructureLookupDataService', ['$http', '$q', '$injector', '$translate', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', 'estimateMainService','estimateMainParamStructureConstant',

		function ($http, $q, $injector, $translate, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, estimateMainService,estimateMainParamStructureConstant) {

			// Object presenting the service
			let service = {
				getList: getFilteredList,
				getListSync : getListSync,
				getListAsync : getListAsync,
				getItemById:getItemByVal,
				getItemByKey:getItemByVal,
				getItemByIdAsync:getItemByIdAsync,
				clear:clear
			};

			// lookup data
			let lookupData = {
					paramStructures : []
				},
				items = [
					{Id : estimateMainParamStructureConstant.LineItem, Code : 'LineItem', DescriptionInfo : {
						Description : 'LineItem',
						Translated : $translate.instant('estimate.main.lineItemContainer')// 'LineItem'
					}},
					{Id : estimateMainParamStructureConstant.EstHeader, Code : 'EstHeader', DescriptionInfo : {
						Description : 'EstHeader',
						Translated : $translate.instant('estimate.main.estHeader')// EstHeader'
					}},
					{Id : estimateMainParamStructureConstant.Project, Code : 'Project', DescriptionInfo : {
						Description : 'Project',
						Translated : $translate.instant('project.main.sourceProject')// 'Project'
					}}
				];

			let strctContextItems = [
				{Id : estimateMainParamStructureConstant.LineItem, Code : 'LineItem', DescriptionInfo : {
					Description : 'LineItem',
					Translated : $translate.instant('estimate.main.lineItemContainer')// 'LineItem'
				}},
				{Id : estimateMainParamStructureConstant.BoQs, Code : 'BoQs', DescriptionInfo : {
					Description : 'BoQs',
					Translated : $translate.instant('estimate.main.boqContainer')// 'BoQs'
				}},
				{Id : estimateMainParamStructureConstant.ActivitySchedule, Code : 'Schedule', DescriptionInfo : {
					Description : 'Schedule',
					Translated : $translate.instant('documents.project.entityPsdSchedule')// 'Schedule'
				}},
				{Id : estimateMainParamStructureConstant.Controllingunits, Code : 'ControllingUnit', DescriptionInfo : {
					Description : 'ControllingUnit',
					Translated : $translate.instant('cloud.common.entityControllingUnit')// 'ControllingUnit'
				}},
				{Id : estimateMainParamStructureConstant.Location, Code : 'Location', DescriptionInfo : {
					Description : 'Location',
					Translated : $translate.instant('project.location.location')// 'Location'
				}},
				{Id : estimateMainParamStructureConstant.ProcurementStructure, Code : 'ProcurementStructure', DescriptionInfo : {
					Description : 'ProcurementStructure',
					Translated : $translate.instant('estimate.main.prcStructureContainer')// 'ProcurementStructure'
				}},
				{Id : estimateMainParamStructureConstant.CostGroup1, Code : 'LicCostGroup1', DescriptionInfo : {
					Description : 'LicCostGroup1',
					Translated : $translate.instant('estimate.main.licCostGroup1Fk')// 'LicCostGroup1'
				}},
				{Id : estimateMainParamStructureConstant.CostGroup2, Code : 'LicCostGroup2', DescriptionInfo : {
					Description : 'LicCostGroup2',
					Translated : $translate.instant('estimate.main.licCostGroup2Fk')// 'LicCostGroup2'
				}},
				{Id : estimateMainParamStructureConstant.CostGroup3, Code : 'LicCostGroup3', DescriptionInfo : {
					Description : 'LicCostGroup3',
					Translated : $translate.instant('estimate.main.licCostGroup3Fk')// 'LicCostGroup3'
				}},
				{Id : estimateMainParamStructureConstant.CostGroup4, Code : 'LicCostGroup4', DescriptionInfo : {
					Description : 'LicCostGroup4',
					Translated : $translate.instant('estimate.main.licCostGroup4Fk')// 'LicCostGroup4'
				}},
				{Id : estimateMainParamStructureConstant.CostGroup5, Code : 'LicCostGroup5', DescriptionInfo : {
					Description : 'LicCostGroup5',
					Translated : $translate.instant('estimate.main.licCostGroup5Fk')// 'LicCostGroup5'
				}},
				{Id : estimateMainParamStructureConstant.ProjectCostGroup1, Code : 'ProjectCostGroup1', DescriptionInfo : {
					Description : 'ProjectCostGroup1',
					Translated : $translate.instant('estimate.main.prjCostGroup1Fk')// 'ProjectCostGroup1'
				}},
				{Id : estimateMainParamStructureConstant.ProjectCostGroup2, Code : 'ProjectCostGroup2', DescriptionInfo : {
					Description : 'ProjectCostGroup2',
					Translated : $translate.instant('estimate.main.prjCostGroup2Fk')// 'ProjectCostGroup2'
				}},
				{Id :estimateMainParamStructureConstant.ProjectCostGroup3 , Code : 'ProjectCostGroup3', DescriptionInfo : {
					Description : 'ProjectCostGroup3',
					Translated : $translate.instant('estimate.main.prjCostGroup3Fk')// 'ProjectCostGroup3'
				}},
				{Id :estimateMainParamStructureConstant.ProjectCostGroup4 , Code : 'ProjectCostGroup4', DescriptionInfo : {
					Description : 'ProjectCostGroup4',
					Translated : $translate.instant('estimate.main.prjCostGroup4Fk')// 'ProjectCostGroup4'
				}},
				{Id :estimateMainParamStructureConstant.ProjectCostGroup5 , Code : 'ProjectCostGroup5', DescriptionInfo : {
					Description : 'ProjectCostGroup5',
					Translated : $translate.instant('estimate.main.prjCostGroup5Fk')// 'ProjectCostGroup5'
				}},
				{Id :estimateMainParamStructureConstant.AssemblyCategoryStructure , Code : 'AssemblyCategoryStructure', DescriptionInfo : {
					Description : 'AssemblyCategory Structure',
					Translated : $translate.instant('estimate.main.assemblyCategoryContainer')// 'AssemblyCategory Structure'
				}},
				{Id :estimateMainParamStructureConstant.BasCostGroup , Code : 'BasCostGroup', DescriptionInfo : {
					Description : 'Cost Group',
					Translated : $translate.instant('estimate.main.costGroupContainer')
				}}
			];

			// get selected estimate header id
			function getEstHeaderId(){
				return estimateMainService.getSelectedEstHeaderId();
			}

			// get parameter structure promise
			function getParamStructPromise(){
				return $http.get(globals.webApiBaseUrl + 'estimate/main/calculator/getstructuresbyheader?estHeaderId='+ getEstHeaderId());
			}

			// get data list of the parameter structure items sync
			function getListSync() {
				let list = lookupData.paramStructures && lookupData.paramStructures.length ? lookupData.paramStructures : [];
				return (angular.copy(list));
			}

			// get list of the parameter structure items async
			function getListAsync() {
				if(!lookupData.paramstructAsyncPromise) {
					lookupData.paramstructAsyncPromise = getParamStructPromise();
				}
				return lookupData.paramstructAsyncPromise.then(function(response){
					lookupData.paramstructAsyncPromise = null;
					lookupData.paramStructures = angular.copy(response.data);

					return lookupData.paramStructures;
				});
			}

			// get parameter structure items filtered as per given entity structure id
			function getFilteredItems(entity){
				let result;

				let estimateMainDetailsParamDialogService = $injector.get('estimateMainDetailsParamDialogService');
				let strId = estimateMainDetailsParamDialogService.getLeadingStructureId();

				result = _.filter(strctContextItems, function (item) {
					return item.Id === strId;
				});
				if(entity.IsPrjAssembly){
					result[0] = {Id : estimateMainParamStructureConstant.LineItem, Code : 'LineItem', DescriptionInfo : {
						Description : 'Assembly',
						Translated : $translate.instant('project.main.assemblyTitle')// 'LineItem'
					}};
				}
				result = result.concat( _.filter(items, function (item) {
					if (entity.IsPrjAssembly || entity.IsPrjAssemblyCat) {
						return item.Id !== estimateMainParamStructureConstant.LineItem && item.Id !== estimateMainParamStructureConstant.EstHeader;
					} else {
						return item.Id !== estimateMainParamStructureConstant.LineItem;
					}
				}));

				lookupData.paramStructures = lookupData.paramStructures.concat(result);

				return result;
			}

			// get parameter structure items filtered as per given structure id
			function getFilteredList(opt, scope){
				let entity = scope.entity;
				let list = lookupData.paramStructures;
				if(list && list.length){
					return $q.when(getFilteredItems(entity, list));
				}else{
					return getListAsync().then(function(data){
						return $q.when(getFilteredItems(entity, data));
					});
				}
			}

			// get parameter structure item by Id
			function getItemByVal (value){
				let estimateMainDetailsParamDialogService = $injector.get('estimateMainDetailsParamDialogService');
				let strId = estimateMainDetailsParamDialogService.getLeadingStructureId();
				let result = _.filter(strctContextItems, function (item) {
					return item.Id === strId;
				});

				let params = $injector.get('estimateMainDetailsParamListDataService').getList();
				if(params && params.length > 0 && (params[0].IsPrjAssembly || params[0].IsPrjPlantAssembly)){
					result[0] = {Id : estimateMainParamStructureConstant.LineItem, Code : 'LineItem', DescriptionInfo : {
						Description : 'Assembly',
						Translated : $translate.instant('project.main.assemblyTitle')// 'LineItem'
					}};
				}

				let list = result.concat(lookupData.paramStructures);


				if(!list || !list.length){
					list = items;
				}
				let item = _.find(list, {Id:value});
				return item;
			}

			// get parameter structure item by Id Async
			function getItemByIdAsync(value) {
				if(!lookupData.paramstructAsyncPromise) {
					lookupData.paramstructAsyncPromise = getListAsync();
				}
				return lookupData.paramstructAsyncPromise.then(function(){
					lookupData.paramstructAsyncPromise = null;
					return getItemByVal(value);
				});
			}

			function clear(){
				lookupData.paramStructures = [];
			}

			return service;
		}]);
})(angular);
