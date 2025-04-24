/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global globals, _ */
	'use strict';

	/**
	 * @ngdoc service
	 * @name estimateMainPrjMaterialLookupService
	 * @function
	 * @description
	 * estimateMainPrjMaterialLookupService is the data service for estimate project material related functionality.
	 */

	angular.module('estimate.main').factory('estimateMainPrjMaterialLookupService', ['$http', '$q','$injector',
		function ($http, $q, $injector) {
			let service = {},
				projectId = 0,
				modifiedPrjMaterial = [],
				// prjMaterialToSave = [],
				resList = [],
				estPrjMaterialData = [];

			service.getModifiedPrjMaterial = function getModifiedPrjMaterial(projectId){
				filterSelectedPrjMaterial();
				return filterModifiedPrjMaterial(projectId);
				// return prjMaterialToSave;
			};

			service.clear = function clear(){
				modifiedPrjMaterial = [];
				// prjMaterialToSave = [];
				resList = [];
				estPrjMaterialData = [];
			};

			service.setProjectId = function setProjectId(id){
				projectId = id;
			};

			service.markPrjMaterialAsModified = function markPrjMaterialAsModified(args, list){
				let selectedLookupItem = args.selectedItem;
				if(selectedLookupItem && selectedLookupItem.Id){
					modifiedPrjMaterial.push(selectedLookupItem);
				}
				resList = list;
			};

			service.addPrjMaterial = function addPrjMaterial(material){
				let item = _.find(modifiedPrjMaterial, {Id: material.Id});
				if (!item) {
					modifiedPrjMaterial.push(material);
				}
			};

			function filterSelectedPrjMaterial(){
				let estimateMainResourceType = $injector.get('estimateMainResourceType');
				if(resList && resList.length > 0){
					let selected = [],
						resWithMaterial= [];
					resList = _.uniq(resList);
					angular.forEach(resList, function(res){
						if(res.EstResourceTypeFk === estimateMainResourceType.Material && res.Code){
							resWithMaterial.push(res);
						}
					});
					if(resWithMaterial.length >0){
						angular.forEach(modifiedPrjMaterial, function(pm){
							let m = _.find(resWithMaterial, {MdcMaterialFk:pm.Id});
							if(m){
								selected.push(pm);
							}
						});
					}
					modifiedPrjMaterial = _.uniqBy(selected, 'Id');
				}
			}

			function filterModifiedPrjMaterial(prjId){
				let prjMaterialToSave = [];
				projectId = prjId;

				if(estPrjMaterialData.length > 0){
					angular.forEach(modifiedPrjMaterial, function(m){
						let item = _.find(estPrjMaterialData, {MdcMaterialFk: m.Id});
						if (!item) {
							prjMaterialToSave.push(m);
						}
					});

				}else{
					prjMaterialToSave = modifiedPrjMaterial;
				}
				if(prjMaterialToSave.length > 0){
					angular.forEach(prjMaterialToSave, function(m){
						m.Version = 0;
						m.ProjectFk = prjId;
					});
				}
				return prjMaterialToSave;
			}

			service.loadPrjMaterial = function loadPrjMaterial(){
				// for the first project material added(click the material description)
				if (!(estPrjMaterialData.length === 0 && modifiedPrjMaterial.length > 0)) {
					modifiedPrjMaterial = [];
				}

				if(projectId > 0){
					return $http.get(globals.webApiBaseUrl + 'project/material/list?projectId='+ projectId).then(function(response){
						estPrjMaterialData = response.data;
						return response.data;
					});
				}
			};

			service.loadPrjMaterialTree = function loadPrjMaterialTree(forceRefresh){
				if (estPrjMaterialData && estPrjMaterialData.length > 0) {
					if(forceRefresh && projectId){
						return $http.get(globals.webApiBaseUrl + 'project/material/list?projectId='+ projectId).then(function(response){
							estPrjMaterialData = response.data;
							return response.data;
						});
					}
					return $q.when(estPrjMaterialData);
				}
				else if(projectId > 0){
					return $http.get(globals.webApiBaseUrl + 'project/material/list?projectId='+ projectId).then(function(response){
						estPrjMaterialData = response.data;
						return response.data;
					});
				}
				else{
					return $q.when([]);
				}
			};

			service.getPrjMaterialSyn = function getPrjMaterialSyn() {
				return estPrjMaterialData;
			};

			// get project material and attached to matching basic materialestimate entity
			service.getPrjMaterial = function getPrjMaterial(data){
				let attachPrjMaterial = function(){
					angular.forEach(estPrjMaterialData, function(m){
						let item = _.find(data, {Id: m.MdcMaterialFk});
						if(item){
							// item.prjMaterial = angular.copy(m);
							item.prjMaterial = m;
						}
					});
				};

				if(estPrjMaterialData.length > 0){
					attachPrjMaterial();
					return $q.when(data);
				}
				else{
					return service.loadPrjMaterial().then(function (result) {
						if(result){
							attachPrjMaterial();
						}
						return data;
					});
				}
			};

			service.getEstMaterialByIdAsyncByJobId = function getEstCCByIdAsyncByJobId(materialId, res) {
				if(!materialId){
					return $q.when({});
				}
				projectId = projectId || -1;
				let currentJobId = res && res.LgmJobFk ? res.LgmJobFk : $injector.get('estimateMainService').getLgmJobId(res);
				let mdcPrjMaterials = _.filter(estPrjMaterialData, {LgmJobFk: currentJobId});
				if (mdcPrjMaterials && mdcPrjMaterials.length){
					let item = _.find(mdcPrjMaterials, {Id:materialId});
					return $q.when(item);
				}else{
					return $http.get(globals.webApiBaseUrl + 'project/material/listbymatiealid?projectId=' + projectId + '&materialId=' + materialId+ '&jobFk=' + currentJobId)
						.then(function (response) {
							if(response && response.data){
								return response.data[0];
							}
							return null;
						});
				}
			};

			service.getBaseMaterials = function getBaseMaterials(items){
				let MaterialID = {
					ids: items
				};
				return $http.post(globals.webApiBaseUrl + 'basics/material/materials', MaterialID).then(function (response) {
					// lookupData.estCostCodesLoadedData = response.data;
					return response.data;
				});
			};

			let estHeaderJobFk = null;

			// this function will be invoke after loading Line Items list
			service.setEstHeaderJobFk = function (jobFk) {
				estHeaderJobFk = jobFk;
			};

			service.getJobFk = function () {
				let jobFk = $injector.get('estimateMainJobDataService').getJobFk();

				if(jobFk && jobFk - 0 !== 0){
					return jobFk;
				}

				return estHeaderJobFk;
			};

			return service;
		}]);
})(angular);
