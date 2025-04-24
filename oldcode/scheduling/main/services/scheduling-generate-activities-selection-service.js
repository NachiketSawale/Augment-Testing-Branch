(function (angular) {

	'use strict';

	let moduleName = 'scheduling.main';
	let schedulingModule = angular.module(moduleName);

	schedulingModule.factory('schedulingMainGenerateActivitiesSelectionService', ['globals', '$http', '$injector', '$translate', '$q', '_', 'schedulingMainService', 'projectMainPinnableEntityService',
		function (globals, $http, $injector, $translate, $q, _, schedulingMainService, projectMainPinnableEntityService) {
			let service = {};

			let selectedCriteria = {
				isFreeOrEstimate: 'FreeSchedule',
				estimateFk: null,
				criteria1: null,
				criteria2: null,
				hide: true,
				hideLevel: true,
				readonly: false,
				updateOrGenerate: 'UpdateAndGenerate',
				createRelations: false,
				relationKindFk: 1,
				boqLevel: null,
				boqMaxLevel: null
			};

			let criteria1Items = [];
			service.setCriteria1Cache = function setCriteria1Cache(items) {
				criteria1Items = items;
			};

			let isLoadedAll = false;
			let isLoadedEstimate = false;
			let boqs = [];
			let projectId = projectMainPinnableEntityService.getPinned();
			if (projectId === null){
				projectId = schedulingMainService.getSelectedProjectId();
			}
			let mainOption;
			let oldEstimateFk = null;

			function getCriteriaFromSchedule(entity) {
				let schedule = schedulingMainService.getSelectedSchedule();
				return $http.get(globals.webApiBaseUrl + 'scheduling/main/activity/getcriteriaforgeneration?scheduleId='+ schedule.Id).then(function(response) {
					if(response.data) {
						entity.hide = false;
						entity.readonly = true;
						entity.isFreeOrEstimate = 'FromEstimate';
						entity.estimateFk = response.data.EstimateId;
						switch(response.data.Criteria1.CriteriaKind){
							case 1:
								entity.criteria1 = 'ESTIMATE ' + response.data.Criteria1.IdOfStructure;
								break;
							case 2:
								entity.criteria1 = 'BOQ ' + response.data.Criteria1.IdOfStructure;
								entity.boqLevel = response.data.Criteria1.BOQLevel;
								entity.hideLevel = false;
								break;
							case 3:
								entity.criteria1 = 'LOCATION ' + response.data.Criteria1.IdOfStructure;
								break;
							case 4:
								entity.criteria1 = 'COSTGROUP ' + response.data.Criteria1.IdOfStructure;
								break;
						}
						entity.criteria2 = response.data.Criteria2;
						entity.createRelations = response.data.CreateRelations;
						entity.relationKindFk = response.data.RelationKind;
					}
				});
			}

			function getAllBoqs(){
				return $http.get(globals.webApiBaseUrl + 'boq/project/list?projectId='+ projectId).then(function(response){
					boqs = [];
					_.each(response.data, function(item){
						boqs.push({Id: item.BoqRootItem.BoqHeaderFk, Code: $translate.instant('scheduling.main.generateActivitiesWizard.criteriaBoQ') + ' ' + item.BoqRootItem.Reference, StructureId: item.BoqHeader.BoqStructureFk});
					});

				});
			}

			let boqsByHeader = [];
			function getBoqsByEstHeader(estHeaderId){
				boqsByHeader = [];
				return $http.get(globals.webApiBaseUrl + 'boq/main/getboqheadersbyestheaderid?estHeaderId='+ estHeaderId).then(function(response){
					boqsByHeader = [];
					_.each(response.data, function(item){
						boqsByHeader.push({Id: item.BoqHeaderFk, Code: $translate.instant('scheduling.main.generateActivitiesWizard.criteriaBoQ') + ' ' + item.Reference});
					});

				});
			}

			let estimates = [];
			function getAllEstimates(){
				let estService = $injector.get('estimateMainHeaderLookupDataService');
				estService.setFilter(projectId);
				return estService.getList({lookupType: 'estimateMainHeaderLookupDataService' }).then(function(data) {
					estimates = [];
					_.each(data, function (item) {
						estimates.push({
							Id: item.Id,
							Code: $translate.instant('scheduling.main.generateActivitiesWizard.criteriaLineItem') + ' ' + item.Code
						});
					});
				});
			}

			let costGrpsByProject = [];
			function getAllCostGrps() {
				costGrpsByProject = [];
				return $http.post(globals.webApiBaseUrl + 'project/main/costgroupcatalog/listbyparent',{PKey1: projectId}).then(function(response) {
					costGrpsByProject = [];
					_.each(response.data, function (item) {
						costGrpsByProject.push({
							Id: item.Id,
							Code: $translate.instant('scheduling.main.generateActivitiesWizard.criteriaPrjCostGrpCat') + ' ' + item.Code
						});
					});
				});
			}

			let costGrpsByEstHeader = [];
			function costGrpsByEstHeaderId(estHeaderId) {
				costGrpsByEstHeader = [];
				return $http.get(globals.webApiBaseUrl + 'estimate/main/lineitemcostgroup/listbyheader?headerId='+ estHeaderId).then(function(response) {
					costGrpsByEstHeader = [];
					if(response.data && response.data.Catalogs) {
						_.each(response.data.Catalogs, function (item) {
							costGrpsByEstHeader.push({
								Id: item.Id,
								Code: $translate.instant('scheduling.main.generateActivitiesWizard.criteriaPrjCostGrpCat') + ' ' + item.Code
							});
						});
					}
				});
			}

			service.init = function init() {
				let projectIdNew = projectMainPinnableEntityService.getPinned();
				if (projectIdNew === null){
					projectIdNew = schedulingMainService.getSelectedProjectId();
				}
				if (projectIdNew !== projectId && (isLoadedAll || isLoadedEstimate)){
					projectId = projectIdNew;
					isLoadedAll = false;
					isLoadedEstimate = false;
				}

				selectedCriteria = {
					isFreeOrEstimate: 'FreeSchedule',
					estimateFk: null,
					criteria1: null,
					criteria2: null,
					hide: true,
					hideLevel: true,
					readonly: false,
					updateOrGenerate: 'UpdateAndGenerate',
					createRelations: false,
					relationKindFk: 1,
					boqLevel: null,
					boqMaxLevel: null
				};
				return getCriteriaFromSchedule(selectedCriteria);
			};

			service.setAllCriteria1 = function setAllCriteria1(mode, estHeaderId){
				let deferred = $q.defer();
				if (mode === 'FreeSchedule') {
					if (!isLoadedAll) {
						let promises = [];
						promises.push(getAllBoqs());
						promises.push(getAllCostGrps());
						promises.push(getAllEstimates());
						$q.all(promises).then(function () {
							isLoadedAll = true;
							return deferred.resolve();
						});
					} else {
						return $q.when(true);
					}
				} else {
					if (!isLoadedEstimate) {
						let promises = [];
						promises.push(getBoqsByEstHeader(estHeaderId));
						promises.push(costGrpsByEstHeaderId(estHeaderId));
						$q.all(promises).then(function () {
							isLoadedEstimate = true;
							return deferred.resolve();
						});
					} else {
						return $q.when(true);
					}
				}
				return deferred.promise;
			};

			service.setCriteria1Items = function setCriteria1Items(mode, estimateFk){
				criteria1Items = [];
				if (mode === 'FreeSchedule'){
					_.each(estimates, function(item){
						criteria1Items.push({Id: 'ESTIMATE ' + item.Id, Code: item.Code, Fk: item.Id});
					});
					_.each(boqs, function(item){
						criteria1Items.push({Id: 'BOQ ' + item.Id, Code: item.Code, Fk: item.Id});
					});
					_.each(costGrpsByProject, function(item){
						criteria1Items.push({Id: 'COSTGROUP ' + item.Id, Code: item.Code, Fk: item.Id});
					});
				} else {
					let estimate = _.find(estimates, {Id: estimateFk});
					if (estimate) {
						criteria1Items.push({Id: 'ESTIMATE ' + estimate.Id, Code: estimate.Code, Fk: estimate.Id});
					}
					_.each(boqsByHeader, function (item) {
						criteria1Items.push({Id: 'BOQ ' + item.Id, Code: item.Code, Fk: item.Id});
					});
					_.each(costGrpsByEstHeader, function (item) {
						criteria1Items.push({Id: 'COSTGROUP ' + item.Id, Code: item.Code, Fk: item.Id});
					});
				}
				criteria1Items.push({
					Id: 'LOCATION ' + projectId,
					Code: $translate.instant('scheduling.main.generateActivitiesWizard.criteriaLoc')
				});
				return criteria1Items;
			};

			service.getCriteria1Cache = function getCriteria1Cache(mode, value) {
				if (isLoadedAll && mode === 'FreeeSchedule'){
					return $q.when(service.setCriteria1Items(mode, value));
				} else if (isLoadedEstimate && mode !== 'FreeeSchedule'){
					return $q.when(service.setCriteria1Items(mode, value));
				} else {
					return service.setAllCriteria1(mode, value).then(function(){
						return $q.when(service.setCriteria1Items(mode, value));
					});
				}
			};

			let criteria2Items = [];
			service.setCriteria2Cache = function setCriteria2Cache(items) {
				criteria2Items = items;
			};

			service.setCriteria2Items = function setCriteria2Items(mode, estimateFk, criteria1){
				criteria2Items = [];
				if (mode === 'FreeSchedule' && !_.startsWith(criteria1,'ESTIMATE')){
					_.each(estimates, function(item){
						criteria2Items.push({Id: item.Id, Code: item.Code, Fk: item.Id });
					});
				} else {
					if (mode !== 'FreeSchedule' && !_.startsWith(criteria1,'ESTIMATE')){

						let estimate = _.find(estimates, {Id: estimateFk});
						if (estimate) {
							criteria2Items.push({Id: estimate.Id, Code: estimate.Code, Fk: estimate.Id});
						}
					}
				}
				return criteria2Items;
			};

			service.getCriteria2Cache = function getCriteria2Cache(mode, estimateFk, criteria1) {
				if (isLoadedAll && mode === 'FreeeSchedule'){
					return $q.when(service.setCriteria2Items(mode, estimateFk, criteria1));
				} else if (isLoadedEstimate && mode !== 'FreeeSchedule'){
					return $q.when(service.setCriteria2Items(mode, estimateFk, criteria1));
				} else {
					return service.setAllCriteria1(mode, estimateFk).then(function(){
						return $q.when(service.setCriteria2Items(mode, estimateFk, criteria1));
					});
				}
			};

			service.setMainOption = function(mode, estimateFk){
				if (mainOption !== mode || mode !== 'FreeSchedule' && estimateFk !== oldEstimateFk) {
					mainOption = mode;
					oldEstimateFk = estimateFk;
					isLoadedEstimate = false;
				}
			};

			service.getCriteria1 = function getCriteria1(entity){
				return service.getCriteria1Cache(entity.isFreeOrEstimate, entity.estimateFk);
			};

			service.getCriteria2 = function getCriteria1(entity){
				return service.getCriteria2Cache(entity.isFreeOrEstimate, entity.estimateFk, entity.criteria1);
			};


			service.setSelectedCriteria = function setSelectedCriteria(newSelectedCriteria) {
				selectedCriteria = newSelectedCriteria;
				getCriteriaFromSchedule(newSelectedCriteria);
			};

			service.getSelectedCriteria = function getSelectedCriteria() {
				return selectedCriteria;
			};

			service.getSelectedCriteriaFromSchedule = function getSelectedCriteriaFromSchedule(){
				let criteria = {};
				return getCriteriaFromSchedule(criteria);
			};

			service.getBoqLevel = function getBoqLevel(criteria1){
				let deferred = $q.defer();

				let id = _.parseInt(_.trimStart(criteria1, 'BOQ '));
				let boq = _.find(boqs, function(item){
					return item.Id === id;
				});
				let boqMaxLevel = null;
				if (boq !== null) {
					$http.get(globals.webApiBaseUrl + 'boq/main/type/getboqstructuredetails?boqStructureId=' + boq.StructureId).then(function (response) {
						if (response && response.data) {
							boqMaxLevel = 1;
							_.each(response.data, function (item) {
								if (item.BoqLineTypeFk < 10 && item.BoqLineTypeFk !== 0 && item.BoqLineTypeFk > boqMaxLevel) {
									boqMaxLevel = item.BoqLineTypeFk;
									selectedCriteria.boqMaxLevel = boqMaxLevel;
								}
							});
						}
						deferred.resolve(boqMaxLevel + 1);
					});
				} else {
					deferred.resolve(boqMaxLevel);
				}
				return deferred.promise;
			};
			return service;

		}]);
})(angular);