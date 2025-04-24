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
	angular.module('estimate.assemblies').factory('estimateAssembliesCategoryRootLookupDataService', [
		'platformLookupDataServiceFactory','$http','$q', 'basicsLookupdataConfigGenerator', '$injector','cloudCommonGridService',
		function (platformLookupDataServiceFactory,$http,$q, basicsLookupdataConfigGenerator, $injector,cloudCommonGridService) {
			let service = {};

			let lookupData = {
				getAssemblyRootCategroys:[]
			};

			service.getGetAssemblyCategroys = function() {
				let deferred = $q.defer();
				let d = $http.get(globals.webApiBaseUrl + 'estimate/assemblies/structure/tree');
				let isPrjAssembly = $injector.get('projectAssemblyMainService').getIsPrjAssembly();
				if (isPrjAssembly) {
					let project = $injector.get('projectMainService').getSelected();
					let postData = {
						IsPrjAssembly: true,
						ProjectId: project ? project.Id : null,
						IsShowInLeading: 0
					};
					d = $http.post(globals.webApiBaseUrl + 'estimate/assemblies/structure/filtertree', postData);
				}
				d.then(function (response) {
					if(response.data){
						response.data = _.filter(response.data,function(cr){
							cr.AssemblyCatChildren = null;
							return !cr.EstAssemblyCatFk;
						});
					}
					deferred.resolve(response);
				});
				return deferred.promise;
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
				if(lookupData.getAssemblyRootCategroys.length >0){
					return lookupData.getAssemblyRootCategroys;
				}
				else{
					service.getGetAssemblyCategroys().then(function(response){
						lookupData.getAssemblyRootCategroys = getUniqCat(response.data);
						return lookupData.getAssemblyRootCategroys;
					});
				}
			};

			service.getListAsync = function getListAsync(options) {
				return service.getGetAssemblyCategroys(options).then(function(response){
					lookupData.getAssemblyRootCategroys = getUniqCat(response.data);
					return lookupData.getAssemblyRootCategroys;
				});
			};

			service.getListWithAssemblyCatFilteredAsync = function getListWithAssemblyCatFilteredAsync() {
				if(lookupData.getAssemblyRootCategroys && lookupData.getAssemblyRootCategroys.length >0){
					return $q.when(lookupData.getAssemblyRootCategroys);
				}
				else{
					return service.getFilteredAssemblyCategorys().then(function(response){
						lookupData.getAssemblyRootCategroys = getUniqCat(response.data);
						return lookupData.getAssemblyRootCategroys;
					});
				}
			};

			service.getItemById = function getItemById(value) {
				return null;
			};

			service.getCatItemById = function getCatItemById(value) {
				let item = null;
				let list = [];
				if (lookupData.getAssemblyRootCategroys) {
					cloudCommonGridService.flatten(lookupData.getAssemblyRootCategroys, list, 'AssemblyCatChildren');
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
				if (lookupData.getAssemblyRootCategroys.length) {
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
						lookupData.getAssemblyRootCategroys = getUniqCat(data);
						return service.getCatItemById(value);
					});
				}
			};

			service.loadLookupData = function loadLookupData(){
				return  service.getGetAssemblyCategroys().then(function(response){
					lookupData.getAssemblyRootCategroys = getUniqCat(response.data);
					return lookupData.getAssemblyRootCategroys;
				});
			};

			service.reload = function reload(){
				return service.loadLookupData();
			};

			service.reloadMasterAssemblyCats = function reloadMasterAssemblyCats(){
				return service.getListWithAssemblyCatFilteredAsync();
			};

			service.clear = function clear(){
				lookupData.getAssemblyRootCategroys =[];
			};

			return service;
		}
	]);
})(angular);
