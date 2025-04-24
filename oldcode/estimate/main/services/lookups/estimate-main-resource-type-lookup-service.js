(function () {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainResourceTypeLookupService', ['$http', '$q', '$injector', 'estimateAssembliesService', 'platformGridAPI', 'estimateMainCommonService','projectAssemblyMainService', 'estimateMainResourceType',
		function ( $http, $q, $injector, estimateAssembliesService, platformGridAPI, estimateMainCommonService,projectAssemblyMainService, estimateMainResourceType) {

			// Object presenting the service
			let service = {};

			// private code
			let lookupData = {
				estResourceTypes:[],
				assResourceType:[],
				assResourceTypeCopy:[],
				assemblyCategoryId:0
			};
			function checkIfRiskModule(){
				return platformGridAPI.grids.exist('202eae863efc4c1f9a2cd4d685e346b7');
			}

			function checkIsPrjAssembly() {
				if(platformGridAPI.grids.exist('51f9aff42521497898d64673050588f4')){
					return checkIsCAOrCUTypeInPrjAssembly() || checkIsProtectedTypeInPrjAssembly();
				} else {
					return false;
				}
			}

			function checkIsCAOrCUTypeInPrjAssembly() {
				let prjCategory =  projectAssemblyMainService.getAssemblyCategory();
				let estAssemblyTypeLogics = estimateMainCommonService.getEstAssemblyTypeLogics();
				if(!prjCategory){
					return false;
				}
				if(prjCategory.EstAssemblyTypeLogicFk === estAssemblyTypeLogics.CrewAssembly || prjCategory.EstAssemblyTypeLogicFk === estAssemblyTypeLogics.CrewAssemblyUpdated){
					return true;
				} else {
					return false;
				}
			}

			function checkIsProtectedTypeInPrjAssembly() {
				let prjCategory = projectAssemblyMainService.getAssemblyCategory();
				let estAssemblyTypeLogics = estimateMainCommonService.getEstAssemblyTypeLogics();

				if (!prjCategory) {
					return false;
				}

				return prjCategory.EstAssemblyTypeLogicFk === estAssemblyTypeLogics.ProtectedAssembly;
			}
			
			let getEstResourceTypesPromise = function(){
				return $http.get(globals.webApiBaseUrl + 'estimate/main/resource/type/list');
			};

			function getEstCompleteResTypePromises(){
				return {
					'estResTypes': $http.get(globals.webApiBaseUrl + 'estimate/main/resource/type/list'),
					'resKind': $http.post(globals.webApiBaseUrl + 'basics/customize/resresourcekind/list')
				};
			}

			let mergeResKinds = function mergeResKinds(estResourceTypes, resKinds){
				let resourceTypes = estResourceTypes && estResourceTypes.length? estResourceTypes : [];
				let maxIdItem = _.maxBy(resourceTypes, 'Id');
				let maxId = maxIdItem && maxIdItem.Id > 0 ? maxIdItem.Id : 0;
				angular.forEach(resKinds, function(resKind){
					maxId = ++maxId;
					resKind.EstResourceTypeFk = 6;
					resKind.EstResKindFk = angular.copy(resKind.EstResKindFk ? resKind.EstResKindFk : resKind.Id);
					resKind.Id = maxId;
					resourceTypes.push(resKind);
				});
				resourceTypes = _.filter(resourceTypes, function(rt){
					if(rt.ShortKeyInfo && rt.ShortKeyInfo.Translated){ return rt;}
				});
				return resourceTypes;
			};

			// get data list of the estimate ResourceType items
			service.getList = function getList() {
				if(lookupData.estResourceTypes.length >0){
					return lookupData.estResourceTypes;
				}
				else{
					return $q.all(getEstCompleteResTypePromises()).then(function(response){
						lookupData.estResourceTypes = _.uniq(response.estResTypes.data, 'Id');
						lookupData.estResourceTypes = mergeResKinds(lookupData.estResourceTypes, response.resKind.data);
						// processData(lookupData.estResourceTypes);
						return lookupData.estResourceTypes;
					});
				}
			};

			// filter by crew
			service.getListForAssembly = function getListForAssembly(isPrjAssembly){
				if(lookupData.assResourceType.length >0){
					service.filterAssemblyType(lookupData.assResourceType,isPrjAssembly);
					// return processData(lookupData.assResourceType);
					return lookupData.assResourceType;
				}
				else{
					return getEstResourceTypesPromise().then(function(response){
						lookupData.assResourceType = response.data;
						lookupData.assResourceTypeCopy = lookupData.assResourceType;
						service.filterAssemblyType(lookupData.assResourceType,isPrjAssembly);
						// return processData(lookupData.assResourceType);
						return lookupData.assResourceType;
					});
				}
			};

			service.getListFactory = function getListFactory() {
				if(service.isAssemblyModule()){
					return service.getListForAssembly(false);
				}else if(checkIsPrjAssembly()){
					return service.getListForAssembly(true);
				}else if(checkIfRiskModule()){
					let list = service.getList();
					return _.filter(list,function (item) {
						return (item.EstResourceTypeFk === estimateMainResourceType.CostCode || item.EstResourceTypeFk === estimateMainResourceType.Material || item.EstResourceTypeFk === estimateMainResourceType.Assembly || item.EstResourceTypeFk === estimateMainResourceType.ResResource);
					});
				}
				else{
					return service.getList();
				}
			};

			service.isAssemblyModule = function isAssemblyModule() {
				let isAssModule = platformGridAPI.grids.exist('234bb8c70fd9411299832dcce38ed118');
				return isAssModule;
			};

			service.resetAssemblyCategoryId = function resetAssemblyCategoryId() {
				lookupData.assemblyCategoryId = 0;
			};

			service.filterAssemblyType = function filterAssemblyType(resourcetype,isPrjAssembly) {
				// if assembly category assembly type is 'crew',then do this filter
				let selectedItem = isPrjAssembly ? projectAssemblyMainService.getSelected() : estimateAssembliesService.getSelected();
				let assemblyCategory = isPrjAssembly ? projectAssemblyMainService.getAssemblyCategory() : estimateAssembliesService.getAssemblyCategory();
				if(assemblyCategory) {
					// resourcetype = lookupData.assResourceType = angular.copy(lookupData.assResourceTypeCopy);
					resourcetype = lookupData.assResourceType = lookupData.assResourceTypeCopy;
					lookupData.assemblyCategoryId = assemblyCategory.Id;
					let estAssemblyTypeLogics = estimateMainCommonService.getEstAssemblyTypeLogics();
					let estResourceTypes = estimateMainCommonService.getEStResourceTypes();
					// For assemblies under this Type of category(Crew or updated Type), in Resource container,
					// only “Is labor” Cost codes & “Crew Assembly(or Updated Type)” resource types should be shown (hide or disable others)
					// and can be assigned: C,M,S,CA,CU
					if (selectedItem && selectedItem.LineItemType === 1 &&
							(assemblyCategory.EstAssemblyTypeLogicFk === estAssemblyTypeLogics.CrewAssembly || assemblyCategory.EstAssemblyTypeLogicFk === estAssemblyTypeLogics.CrewAssemblyUpdated)) {
						// filter only crew
						lookupData.assResourceType = _.filter(resourcetype, function (item) {
							return item.EstResourceTypeFk === estResourceTypes.CostCode || item.EstResourceTypeFk === estResourceTypes.Material || item.EstResourceTypeFk === estResourceTypes.SubItem ||
									item.EstAssemblyTypeLogicFk === estAssemblyTypeLogics.CrewAssembly || item.EstAssemblyTypeLogicFk === estAssemblyTypeLogics.CrewAssemblyUpdated ||
									item.EstResourceTypeFk === estResourceTypes.Plant || item.EstResourceTypeFk === estResourceTypes.EquipmentAssembly;
						});
					}
					// Can be any set of resources put together except “Work Item Assemblies”. General assembly.
					else if (selectedItem && selectedItem.LineItemType === 1 && assemblyCategory.EstAssemblyTypeLogicFk === 1) {
						// filter only crew
						lookupData.assResourceType = _.reject(resourcetype, function (item) {
							return item.EstResourceTypeFk === estimateMainResourceType.Assembly && item.EstAssemblyTypeLogicFk === 2;
						});
					}
					// If assembly type is "Protected Assembly (PA)", exclude Plant & Equipment Assembly
					if (assemblyCategory.EstAssemblyTypeLogicFk === estAssemblyTypeLogics.ProtectedAssembly) {
						lookupData.assResourceType = _.reject(lookupData.assResourceType, function (item) {
							return item.EstResourceTypeFk === estResourceTypes.Plant ||
								item.EstResourceTypeFk === estResourceTypes.EquipmentAssembly;
						});
					}
				}
			};

			service.getAssignLookupData = function getAssignLookupData() {
				if(lookupData.estResourceTypes && lookupData.estResourceTypes.length >0){
					let assResourceTypes = service.getListFactory();
					return $q.when(assResourceTypes);
				}
				else{
					return $q.all(getEstCompleteResTypePromises()).then(function(response){
						// lookupData.estResourceTypes = angular.copy(_.uniq(response.data, 'Id'));
						lookupData.estResourceTypes = _.uniq(response.estResTypes.data, 'Id');
						lookupData.estResourceTypes = mergeResKinds(lookupData.estResourceTypes, response.resKind.data);
						// processData(lookupData.estResourceTypes);
						return lookupData.estResourceTypes;
					});
				}
			};

			// get data list of the estimate ResourceType items
			service.getListAsync = function getListAsync() {
				if(lookupData.estResourceTypes && lookupData.estResourceTypes.length >0){
					return $q.when(lookupData.estResourceTypes);
				}
				else{
					return $q.all(getEstCompleteResTypePromises()).then(function(response){
						// lookupData.estResourceTypes = angular.copy(_.uniq(response.data, 'Id'));
						lookupData.estResourceTypes = _.uniq(response.estResTypes.data, 'Id');
						lookupData.estResourceTypes = mergeResKinds(lookupData.estResourceTypes, response.resKind.data);
						// processData(lookupData.estResourceTypes);
						return lookupData.estResourceTypes;
					});
				}
			};

			// for resource type formatter
			service.getItemById = function getItemById(id) {
				return _.find(lookupData.estResourceTypes, {'Id': id});
			};

			// for resource kind dialog header
			service.getItemByResKindFk = function getItemById(kindFk) {
				return _.find(lookupData.estResourceTypes, {'EstResKindFk': kindFk});
			};

			service.getItemByIdAsync = function getItemByIdAsync(id) {
				if(lookupData.estResourceTypes && lookupData.estResourceTypes.length > 0) {
					return $q.when(service.getItemById(id));
				} else {
					return $q.all(getEstCompleteResTypePromises()).then(function(response){
						// lookupData.estResourceTypes = angular.copy(_.uniq(response.data, 'Id'));
						lookupData.estResourceTypes = _.uniq(response.estResTypes.data, 'Id');
						lookupData.estResourceTypes = mergeResKinds(lookupData.estResourceTypes, response.resKind.data);
						// processData(lookupData.estResourceTypes);
						return service.getItemById(id);
					});
				}
			};

			// estimate look up data service call
			service.loadLookupData = function(){
				return $q.all(getEstCompleteResTypePromises()).then(function(response){

					lookupData.estResourceTypes = _.uniq(response.estResTypes.data, 'Id');
					lookupData.estResourceTypes = mergeResKinds(lookupData.estResourceTypes, response.resKind.data);
					// processData(lookupData.estResourceTypes);
					lookupData.assResourceType = response.estResTypes.data;
					lookupData.assResourceTypeCopy = response.estResTypes.data;
					if(service.isAssemblyModule()){
						service.filterAssemblyType(lookupData.assResourceType,false);
						return lookupData.assResourceType;
					}

					if(checkIsPrjAssembly()){
						service.filterAssemblyType(lookupData.assResourceType,true);
						return lookupData.assResourceType;
					}

					if(checkIfRiskModule()){
						return _.filter(lookupData.estResourceTypes,function (item) {
							return (item.EstResourceTypeFk === estimateMainResourceType.CostCode || item.EstResourceTypeFk === estimateMainResourceType.Material || item.EstResourceTypeFk === estimateMainResourceType.Assembly || item.EstResourceTypeFk === estimateMainResourceType.ResResource);
						});
					}
					return lookupData.estResourceTypes;
				});
			};

			// General stuff
			service.reLoad = function(){
				service.resetAssemblyCategoryId();

				return service.loadLookupData();
			};

			service.getEstResourceType = function (value){
				let estType = _.find(lookupData.estResourceTypes, function (item){
					return item.ShortKeyInfo && item.ShortKeyInfo.Description && value &&(item.ShortKeyInfo.Description.toUpperCase() === value.toUpperCase() || item.ShortKeyInfo.Translated.toUpperCase() === value.toUpperCase());
				});

				return estType;
			};

			return service;
		}]);
})();
