/**
 * Created by leo on 07.11.2017.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals, _ */
	angular.module('estimate.assemblies').factory('estimateAssembliesCategoryLookupDataService', [
		'platformLookupDataServiceFactory','$http','$q', 'basicsLookupdataConfigGenerator', '$injector','cloudCommonGridService',
		function (platformLookupDataServiceFactory,$http,$q, basicsLookupdataConfigGenerator, $injector,cloudCommonGridService) {
			let service = {};

			let lookupData = {
				getAssemblyCategroys:[]
			};

			service.getGetAssemblyCategroys = function(){
				let isPrjAssembly = $injector.get('projectAssemblyMainService').getIsPrjAssembly();
				if (isPrjAssembly){
					let project = $injector.get('projectMainService').getSelected();
					let postData = {
						IsPrjAssembly: true,
						ProjectId: project ? project.Id : null,
						IsShowInLeading: 0
					};
					return $http.post(globals.webApiBaseUrl + 'estimate/assemblies/structure/filtertree', postData);
				} else {
					return $http.get(globals.webApiBaseUrl + 'estimate/assemblies/structure/tree');
				}
			};

			service.getFilteredAssemblyCategorys = function(){
				let projectId = $injector.get('estimateProjectRateBookConfigDataService').getProjectId();
				let filterRequest = {
					ProjectId : projectId,
					IsShowInLeading : 0
				};
				return $http.post(globals.webApiBaseUrl + 'estimate/assemblies/structure/filtertree' , filterRequest);
			};

			let getUniqCat = function getUniqCat(data){
				return _.uniq(data, 'Id');
			};

			service.getList = function getList() {
				if(lookupData.getAssemblyCategroys.length >0){
					return lookupData.getAssemblyCategroys;
				}
				else{
					service.getGetAssemblyCategroys().then(function(response){
						lookupData.getAssemblyCategroys = getUniqCat(response.data);
						return lookupData.getAssemblyCategroys;
					});
				}
			};

			service.getListAsync = function getListAsync() {
				return service.getGetAssemblyCategroys().then(function(response){
					lookupData.getAssemblyCategroys = getUniqCat(response.data);
					return lookupData.getAssemblyCategroys;
				});
			};

			service.getListWithAssemblyCatFilteredAsync = function getListWithAssemblyCatFilteredAsync() {
				if(lookupData.getAssemblyCategroys && lookupData.getAssemblyCategroys.length >0){
					return $q.when(lookupData.getAssemblyCategroys);
				}
				else{
					return service.getFilteredAssemblyCategorys().then(function(response){
						lookupData.getAssemblyCategroys = getUniqCat(response.data);
						return lookupData.getAssemblyCategroys;
					});
				}
			};

			service.getItemById = function getItemById(value) {
				return null;
			};

			service.getCatItemById = function getCatItemById(value) {
				let item = null;
				let list = [];
				if (lookupData.getAssemblyCategroys) {
					cloudCommonGridService.flatten(lookupData.getAssemblyCategroys, list, 'AssemblyCatChildren');
				}

				if (list && list.length > 0) {
					for (let i = 0; i < list.length; i++) {
						if (list[i].Id === value) {
							item = list[i];
							break;
						}
					}
					return item;
				}
			};

			service.getItemByIdAsync = function getItemByIdAsync(value) {
				let item = null;
				if (lookupData.getAssemblyCategroys.length) {
					item = service.getCatItemById(value);
				}
				if (item) {
					return $q.when(item);
				} else {
					if (!lookupData.getAssemblyCategroysPromise) {
						lookupData.getAssemblyCategroysPromise = service.getListAsync();
					}
					return lookupData.getAssemblyCategroysPromise.then(function (data) {
						lookupData.getAssemblyCategroysPromise = null;
						lookupData.getAssemblyCategroys = getUniqCat(data);
						return service.getCatItemById(value);
					});
				}
			};

			service.loadLookupData = function loadLookupData(){
				return  service.getGetAssemblyCategroys().then(function(response){
					lookupData.getAssemblyCategroys = getUniqCat(response.data);
					return lookupData.getAssemblyCategroys;
				});
			};

			service.reload = function reload(){
				return service.loadLookupData();
			};

			service.reloadMasterAssemblyCats = function reloadMasterAssemblyCats(){
				return service.getListWithAssemblyCatFilteredAsync();
			};

			service.clear = function clear(){
				lookupData.getAssemblyCategroys =[];
			};

			return service;
		}
	]);
})(angular);
