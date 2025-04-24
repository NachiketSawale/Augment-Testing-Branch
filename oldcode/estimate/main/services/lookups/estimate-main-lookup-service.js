/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	/* global _, globals */
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainLookupService
	 * @function
	 *
	 * @description
	 * estimateMainLookupService provides all lookup data for estimate module
	 */
	angular.module(moduleName).factory('estimateMainLookupService', ['_', '$http', '$q', '$injector', 'platformGridAPI', 'basicsLookupdataLookupDescriptorService',
		'cloudCommonGridService', 'estimateMainCommonLookupService', 'basicsLookupdataTreeHelper', 'platformDataServiceEntitySortExtension',
		function (_, $http, $q, $injector, platformGridAPI, basicsLookupdataLookupDescriptorService, cloudCommonGridService, estimateMainCommonLookupService, basicsLookupdataTreeHelper, platformDataServiceEntitySortExtension) {

			// Object presenting the service
			let service = {},
				projectId = null,
				lookupData = {
					mdcCostCodes: [],
					estCostCodes: [],
					prjcostcodes: [],
					estprjcostcodes: [],
					estAssemblies: [],
					estCostCodesLoadedData: [],
					prjCostCodeIds: [],
					transferCostCodes:[]
				};
			service.transferCostCodeIds = [];
			let estCostCodesByCodeDictionary = {};

			// Initialize the promise variable for Cost Codes
			var estCostCodeListByCompanyPromise = null;
			var estCostCodePromise = null;
			var transferCodesPromise = null;

			// these keys have different meaning
			let costCodeLookupDataKey = {
				contextCostCode: 'contextcostcodes',// filter by context(in customizing module)
				masterCostCode: 'estmdccostcodes',// filter by company
				projectCostCode: 'estprjcostcodes',// filter by project
				estCostCodesList: 'estcostcodeslist',// flatten cost codes with project value
				estprjcostcodes: 'estprjcostcodes'// cost codes are used in estimate
			};

			function buildTree(list,isPrjCostCodesTree) {
				let context = {
						treeOptions: {
							parentProp: 'CostCodeParentFk',
							childProp: 'CostCodes'
						},
						IdProperty: 'Id'
					},
					treeList = [],
					sortCode = 'CostCodes';
				if(isPrjCostCodesTree){
					context = {
						treeOptions:{
							parentProp: 'CostCodeParentFk',
							childProp: 'ProjectCostCodes'
						},
						IdProperty: 'Id'
					};
					sortCode = 'ProjectCostCodes';
				}
				if (list && list.length) {
					angular.forEach(list, function (d) {
						d.CostCodes = [];
						d.OriginalId = d.Id;
					});
					treeList = basicsLookupdataTreeHelper.buildTree(list, context);
					platformDataServiceEntitySortExtension.sortTree(treeList, 'Code', sortCode);
				}
				return treeList;
			}

			service.buildTree = buildTree;

			// Load the estimate project cost code on project change
			service.setSelectedProjectId = function setSelectedProjectId(id) {
				projectId = id;
			};

			service.getPrjCostCodes = function getPrjCostCodes(estHeaderFk) {
				if (projectId && estHeaderFk > 0  && !_.isUndefined(estHeaderFk)) {
					return $http.get(globals.webApiBaseUrl + 'estimate/main/lineitem/prjestcostcodes?projectId=' + projectId + '&estHeaderFk=' + estHeaderFk);
				} else if (projectId) {
					return $http.get(globals.webApiBaseUrl + 'estimate/main/lineitem/prjcostcodes?projectId=' + projectId);
				} else {
					return $q.when([]);
				}
			};

			service.getPrjCostCodeById = function getPrjCostCodeById(projectId, costcodeId) {
				let defer = $q.defer();
				let projectCostCodeList = basicsLookupdataLookupDescriptorService.getData(costCodeLookupDataKey.projectCostCode);
				let projectCostCode = _.find(projectCostCodeList, function (data) {
					return data.MdcCostCodeFk === costcodeId;
				});
				defer.resolve(projectCostCode);
				return defer.promise;
			};

			service.getEstCCByIdAsync = function getEstCCByIdAsync(costcodeId) {
				projectId = projectId || -1;
				if (basicsLookupdataLookupDescriptorService.hasLookupItem(costCodeLookupDataKey.estCostCodesList, costcodeId)) {
					return $q.when(basicsLookupdataLookupDescriptorService.getLookupItem(costCodeLookupDataKey.estCostCodesList, costcodeId));
				} else {
					if (!costcodeId) {
						return $q.when({});
					}
					return $http.get(globals.webApiBaseUrl + 'estimate/main/lineitem/estcostcodebyid?projectId=' + projectId + '&costcodeId=' + costcodeId).then(function (response) {
						basicsLookupdataLookupDescriptorService.updateData(costCodeLookupDataKey.estCostCodesList, [response.data]);
						return response.data;
					});
				}
			};

			service.getItemById = function (value){
				return basicsLookupdataLookupDescriptorService.getLookupItem(costCodeLookupDataKey.estCostCodesList, value);
			};

			service.getItemByIdAsync = function (value){				
				return service.getEstCCByIdAsync(value);
			};

			service.loadProjectCostCode = function loadProjectCostCode() {
				return service.getPrjCostCodes().then(function (result) {
					if (result.data && result.data.length) {
						basicsLookupdataLookupDescriptorService.removeData(costCodeLookupDataKey.projectCostCode);
						basicsLookupdataLookupDescriptorService.updateData(costCodeLookupDataKey.projectCostCode, result.data);
					} else {
						basicsLookupdataLookupDescriptorService.removeData(costCodeLookupDataKey.projectCostCode);
					}
					lookupData.prjcostcodes = angular.copy(result.data);
					service.replaceCostCodes();
					return lookupData.prjcostcodes;
				});
			};

			service.getProjectCostCodes = function (){
				if(lookupData.prjcostcodes && lookupData.prjcostcodes.length > 0){
					return  $q.when(lookupData.prjcostcodes);
				}
				return service.loadProjectCostCode();
			};

			// get data list of the enterprise costcodes async(filter by company)
			let getListAsync = function getListAsync() {
				return service.getListFilterByCompanyAsync().then(function (data) {
					lookupData.estCostCodesLoadedData = data;
					return lookupData.estCostCodesLoadedData;
				});
			};

			service.getEstCostCodesListAsync = function getEstCostCodesListAsync(param) {
				if (estCostCodeListByCompanyPromise) {
					return estCostCodeListByCompanyPromise;
				}
				estCostCodeListByCompanyPromise = $http.get(globals.webApiBaseUrl + 'basics/costcodes/getestcostcodelistbycompany').then(function (response) {
					lookupData.estCostCodes = buildTree(response.data);
					basicsLookupdataLookupDescriptorService.updateData(costCodeLookupDataKey.estCostCodesList, lookupData.estCostCodes);
					estCostCodeListByCompanyPromise = null;
					if(param === 'isTransferCostCode'){
						return service.GetTranferCostCodes().then(function (transferCostCodes){
							return transferCostCodes;
						});
					}else {
						return lookupData.estCostCodes;
					}

				});
				return estCostCodeListByCompanyPromise;
			};
			service.GetTranferCostCodes = function GetTranferCostCodes(){
				if(lookupData &&lookupData.estCostCodes){
					lookupData.transferCostCodes = [];
					var assembly = $injector.get('estimateAssembliesService').getSelected();
					let estHeaderId = assembly?assembly.EstHeaderFk:-1;
					let estLineItemId = assembly?assembly.Id:-1;
					transferCodesPromise =	$http.get(globals.webApiBaseUrl + 'estimate/assemblies/FilterOutCostCodeIdsByAssembly?estHeaderId='+estHeaderId +'&estLineItemId='+estLineItemId).then(function (response){
						service.transferCostCodeIds = response.data;
						return lookupData.estCostCodes;
					});
				}
				return transferCodesPromise;
			}

			service.getListFilterByCompanyAsync = function getListFilterByCompanyAsync() {
				if (estCostCodePromise) {
					return estCostCodePromise;
				}
				estCostCodePromise = $http.get(globals.webApiBaseUrl + 'basics/costcodes/getlistbycompany').then(function (response) {
					angular.forEach(response.data, function (item) {
						if (item) {
							item.OriginalId = item.Id;
						}
					});
					lookupData.mdcCostCodes = response.data;
					lookupData.estCostCodes = response.data;
					basicsLookupdataLookupDescriptorService.updateData(costCodeLookupDataKey.estCostCodesList, response.data);
					basicsLookupdataLookupDescriptorService.updateData(costCodeLookupDataKey.masterCostCode, response.data);
					estCostCodePromise = null;
					return buildTree(response.data);
				});
				return estCostCodePromise;
			};


			// get Mdc cost code by code from server
			service.getMdcCCByCodeAsync = function getMdcCCByCodeAsync(code) {
				return $http.get(globals.webApiBaseUrl + 'basics/costcodes/getcostcodebycode?code=' + code).then(function (response) {
					return response.data;
				});
			};

			// get estimate cost code by id
			service.getEstCCById = function getEstCCById(id) {
				return basicsLookupdataLookupDescriptorService.getLookupItem(costCodeLookupDataKey.estCostCodesList, id);
			};

			// get master cost code by id
			service.getMdcCCById = function getMdcCCById(id) {
				return basicsLookupdataLookupDescriptorService.getLookupItem(costCodeLookupDataKey.masterCostCode, id);
			};

			// get master cost code by id
			service.getMdcCCByIdAsync = function getMdcCCByIdAsync(costcodeId) {
				if (basicsLookupdataLookupDescriptorService.hasLookupItem(costCodeLookupDataKey.masterCostCode, costcodeId)) {
					return $q.when(basicsLookupdataLookupDescriptorService.getLookupItem(costCodeLookupDataKey.masterCostCode, costcodeId));
				} else {
					if (!costcodeId) {
						return $q.when({});
					}
					return getListAsync().then(function () {
						return basicsLookupdataLookupDescriptorService.getLookupItem(costCodeLookupDataKey.masterCostCode, costcodeId);
					});
				}
			};

			// get project cost code by id
			service.getPrjCCById = function getPrjCCById(id) {
				return basicsLookupdataLookupDescriptorService.getLookupItem(costCodeLookupDataKey.mdcprjCostCodes, id);
			};

			// get tree of the estimate cost codes
			service.getEstCostCodesTree = function () {
				if (lookupData.estCostCodes && lookupData.estCostCodes.length > 0) {
					service.filterByProject();
					return $q.when(lookupData.estCostCodes);
				} else {
					return getListAsync().then(function (data) {
						lookupData.estCostCodes = data;
						basicsLookupdataLookupDescriptorService.removeData(costCodeLookupDataKey.masterCostCode);
						basicsLookupdataLookupDescriptorService.updateData(costCodeLookupDataKey.masterCostCode, data);
						return service.replaceCostCodes();
					});
				}
			};

			service.refreshEstCostCodesTree = function refreshEstCostCodesTree() {
				lookupData.estCostCodes = lookupData.prjcostcodes = [];
				return service.getPrjCostCodes().then(function (result) {
					if (result.data && result.data.length) {
						basicsLookupdataLookupDescriptorService.removeData(costCodeLookupDataKey.projectCostCode);
						basicsLookupdataLookupDescriptorService.updateData(costCodeLookupDataKey.projectCostCode, result.data);
					} else {
						basicsLookupdataLookupDescriptorService.removeData(costCodeLookupDataKey.projectCostCode);
					}
					lookupData.prjcostcodes = angular.copy(result.data);

					return service.getEstCostCodesTree();
				});
			};

			// get tree of the master cost codes
			service.getMdcCostCodesTree = function () {
				if (lookupData.mdcCostCodes && lookupData.mdcCostCodes.length > 0) {
					cloudCommonGridService.sortList(lookupData.mdcCostCodes, 'Code');
					return $q.when(lookupData.mdcCostCodes);
				} else {
					return getListAsync().then(function (data) {
						// lookupData.mdcCostCodes = data;
						// basicsLookupdataLookupDescriptorService.updateData(costCodeLookupDataKey.masterCostCode, data);
						return data;
					});
				}
			};

			service.getEstCostCodesTreeForAssemblies = function (param) {
				if (lookupData.estCostCodes && lookupData.estCostCodes.length > 0) {
					cloudCommonGridService.sortList(lookupData.estCostCodes, 'Code');
					if(param === 'isTransferCostCode'){
						return service.GetTranferCostCodes().then(function (transferCostCodes){
							return transferCostCodes;
						});
					}else {
						return $q.when(lookupData.estCostCodes);
					}
				} else {
					return service.getEstCostCodesListAsync(param).then(function (data) {
						return data;
					});
				}
			};

			service.refreshMdcCostCodesTree = function refreshMdcCostCodesTree() {
				lookupData.mdcCostCodes = [];
				return service.getMdcCostCodesTree();
			};

			service.refreshEstCostCodesTreeForAssemblies = function refreshMdcCostCodesTree() {
				lookupData.estCostCodes = [];
				$injector.get('estimateAssembliesResourceDynamicUserDefinedColumnService').clearCostCodejobRateValueList();
				return service.getEstCostCodesTreeForAssemblies();
			};

			// get tree of the project cost codes(used in project cost code lookup)

			service.loadPrjCostCodeNEstCostCode = function (forceRefresh, estHeaderFk){
				let q = [];
				q.push(service.getPrjCostCodesTree(forceRefresh, estHeaderFk));
				q.push(service.loadProjectCostCode());

				return $q.all(q, function (){return true;});
			};


			service.getPrjCostCodesTree = function (forceRefresh, estHeaderFk) {
				function doneAction (result) {
					// filter by project cost code
					_.each(result.data, function (item) {
						if (item && item.BasCostCode) {
							item.Code = item.BasCostCode.Code;
							item.DescriptionInfo = item.BasCostCode.DescriptionInfo;
						}
					});
					lookupData.estprjcostcodes = result.data;				
					
					let resultData = result.data;				

					_.each(resultData, function (item) {
						item.ProjectCostCodes = null;
					});
					resultData = buildTree(resultData,true);					
					prepareItems(resultData);
					
					basicsLookupdataLookupDescriptorService.updateData(costCodeLookupDataKey.estprjcostcodes, lookupData.estprjcostcodes);
					basicsLookupdataLookupDescriptorService.updateData(costCodeLookupDataKey.mdcprjCostCodes, resultData);

					return resultData;
				}

				function prepareItems(nodes, parentNode) {
					let n;
					let level = 0;
					if (parentNode) {
						level = parentNode.nodeInfo ? parentNode.nodeInfo.level + 1 : 0;
					}
					for (let i = 0; i < nodes.length; i++) {
						n = nodes[i];
						if (n.nodeInfo === undefined) {
							n.nodeInfo = {
								level: level,
								collapsed: false,
								lastElement: false,
								children: !_.isNil(n.ProjectCostCodes) && n.ProjectCostCodes.length
							};
							n.HasChildren = !_.isNil(n.ProjectCostCodes) && n.ProjectCostCodes.length;
						}
						if (!_.isNil(n.ProjectCostCodes) && n.ProjectCostCodes.length > 0) {
							n.nodeInfo.lastElement = false;
							n.nodeInfo.children = true;
							n.HasChildren = true;
							n.nodeInfo.level = level;
							prepareItems(n.ProjectCostCodes, n);
						} else {
							n.nodeInfo.lastElement = true;
							n.nodeInfo.children = false;
							n.HasChildren = false;
							n.nodeInfo.level = level;
						}
					}
				}
				
				if (lookupData.estprjcostcodes && lookupData.estprjcostcodes.length > 0) {
					if (forceRefresh) {
						return service.getPrjCostCodes(estHeaderFk).then(doneAction);
					}
					return $q.when(lookupData.estprjcostcodes);
				} else {
					return service.getPrjCostCodes(estHeaderFk).then(doneAction);
				}
			};

			// get project costcodes
			service.getEstCostCodesSyn = function () {	
				return lookupData.estprjcostcodes;
			};

			// get project costcodes
			service.getPrjCostCodesSyn = function () {
				return lookupData.prjcostcodes;
			};

			service.getMdcCostCodesByCode = function (code) {
				if (lookupData.mdcCostCodes && lookupData.mdcCostCodes.length > 0) {
					return _.filter(lookupData.mdcCostCodes, function (item) {
						return item.Code === code;
					});
				} else {
					return getListAsync().then(function (data) {
						lookupData.mdcCostCodes = data;
						basicsLookupdataLookupDescriptorService.updateData(costCodeLookupDataKey.masterCostCode, data);
						return  _.filter(data, function (item) {
							return item.Code === code;
						});
					});
				}
			};

			// get list of the assemblies
			service.getEstAssembliesList = function getEstAssembliesList() {
				return lookupData.estAssemblies;
			};

			// get search list of the estimate cost codes
			service.getSearchList = function getSearchList(value, field, isSpecificSearch) {
				let data = {
					'searchValue': value,
					'field': field,
					'isSpecificSearch': isSpecificSearch
				};
				if (lookupData.estCostCodes && lookupData.estCostCodes.length > 0) {
					let filterParams = {
						'codeProp': 'Code',
						'descriptionProp': 'DescriptionInfo.Translated',
						'field': field,
						'isSpecificSearch': isSpecificSearch,
						'searchValue': value
					};
					let existItems = estimateMainCommonLookupService.getSearchData(filterParams, angular.copy(lookupData.estCostCodes), 'CostCodes', 'CostCodeParentFk', true);
					return $q.when(existItems);
				} else {
					return $http.post(globals.webApiBaseUrl + 'basics/costcodes/getsearchlistbycompany/', data).then(function (response) {
						let data = _.uniqBy(response.data, 'Id');
						angular.forEach(data, function (d) {
							d.CostCodes = [];
							d.OriginalId = d.Id;
						});
						lookupData.lookupData = lookupData.lookupData ? lookupData.lookupData : {};
						lookupData.lookupData.mdcCostCodes = data;
						return service.getPrjCostCodes().then(function (response) {
							lookupData.prjcostcodes = response.data;
							return service.replaceCostCodes(data);

						});
					});
				}
			};

			// get search list of the master cost codes
			service.getSearchMdcList = function getSearchMdcList(value, field, isSpecificSearch) {
				let data = {
					'searchValue': value,
					'field': field,
					'isSpecificSearch': isSpecificSearch
				};


				if (lookupData.mdcCostCodes && lookupData.mdcCostCodes.length > 0) {

					let filterParams = {
						'codeProp': 'Code',
						'descriptionProp': 'DescriptionInfo.Translated',
						'field': field,
						'isSpecificSearch': isSpecificSearch,
						'searchValue': value
					};
					let existItems = estimateMainCommonLookupService.getSearchData(filterParams, angular.copy(lookupData.mdcCostCodes), 'CostCodes', 'CostCodeParentFk', true);
					return $q.when(existItems);
				} else {
					return $http.post(globals.webApiBaseUrl + 'basics/costcodes/getsearchlistbycompany/', data).then(function (response) {
						let data = _.uniqBy(response.data, 'Id');
						angular.forEach(data, function (d) {
							d.CostCodes = [];
							d.OriginalId = d.Id;
						});
						lookupData.mdcCostCodes = data;
						return data;
					});
				}
			};

			// get search list of the est cost codes
			service.getSearchEstCostCodesList = function getSearchEstCostCodesList(value, field, isSpecificSearch,param) {

				if(param && param === 'isTransferCostCode'){
					return service.GetTranferCostCodes().then(function (transferCostCodes){
						return transferCostCodes;
					});
				}
				let data = {
					'searchValue': value,
					'field': field,
					'isSpecificSearch': isSpecificSearch
				};


				if (lookupData.estCostCodes && lookupData.estCostCodes.length > 0) {

					let filterParams = {
						'codeProp': 'Code',
						'descriptionProp': 'DescriptionInfo.Translated',
						'field': field,
						'isSpecificSearch': isSpecificSearch,
						'searchValue': value
					};
					let existItems = estimateMainCommonLookupService.getSearchData(filterParams, angular.copy(lookupData.estCostCodes), 'CostCodes', 'CostCodeParentFk', true);
					return $q.when(existItems);
				} else if (estCostCodeListByCompanyPromise) {
					return estCostCodeListByCompanyPromise.then(function () {
						let filterParams = {
							'codeProp': 'Code',
							'descriptionProp': 'DescriptionInfo.Translated',
							'field': field,
							'isSpecificSearch': isSpecificSearch,
							'searchValue': value
						};
						let existItems = estimateMainCommonLookupService.getSearchData(filterParams, angular.copy(lookupData.estCostCodes), 'CostCodes', 'CostCodeParentFk', true);
						return $q.when(existItems);
					});
				} else {
					return $http.post(globals.webApiBaseUrl + 'basics/costcodes/getestcostcodesearchlistbycompany/', data).then(function (response) {
						let data = _.uniqBy(response.data, 'Id');
						angular.forEach(data, function (d) {
							d.CostCodes = [];
							d.OriginalId = d.Id;
						});
						lookupData.mdcCostCodes = buildTree(data);
						return lookupData.mdcCostCodes;
					});
				}
			};

			// get search list of the project cost codes
			service.getSearchPrjList = function getSearchPrjList(value, field, isSpecificSearch,child) {
				let childProp = 'CostCodes';
				if(child){
					childProp = child;
				}
				if (lookupData.estprjcostcodes && lookupData.estprjcostcodes.length > 0) {

					let filterParams = {
						'codeProp': 'Code',
						'descriptionProp': 'DescriptionInfo.Translated',
						'field': field,
						'isSpecificSearch': isSpecificSearch,
						'searchValue': value
					};
					let existItems = estimateMainCommonLookupService.getSearchData(filterParams, angular.copy(lookupData.estprjcostcodes), childProp, 'CostCodeParentFk', true);
					return $q.when(existItems);
				} else {
					return service.getPrjCostCodesTree().then(function () {
						if (lookupData.estprjcostcodes && lookupData.estprjcostcodes.length > 0) {

							let filterParams = {
								'codeProp': 'Code',
								'descriptionProp': 'DescriptionInfo.Translated',
								'field': field,
								'isSpecificSearch': isSpecificSearch,
								'searchValue': value
							};
							let existItems = estimateMainCommonLookupService.getSearchData(filterParams, angular.copy(lookupData.estprjcostcodes), childProp, 'CostCodeParentFk', true);
							return $q.when(existItems);
						}
					});
				}
			};

			// replace mdc costcodes with project costcode
			service.replaceCostCodes = function replaceCostCodes(data) {
				let list = [];
				let estCostCodes = data && data.length ? data : lookupData.estCostCodes;
				if (service.checkAssemblyType('Crew')) {
					lookupData.estCostCodes = _.filter(lookupData.estCostCodes, function (costcode) {
						return costcode.IsLabour;
					});
				}
				cloudCommonGridService.flatten(estCostCodes, list, 'CostCodes');
				if (estCostCodes.length > 0 && lookupData.prjcostcodes && lookupData.prjcostcodes.length > 0) {
					angular.forEach(list, function (mdcCC) {
						angular.forEach(lookupData.prjcostcodes, function (prjCC) {
							if (mdcCC.Id === prjCC.MdcCostCodeFk) {
								mdcCC.Rate = prjCC.Rate;
								mdcCC.DayWorkRate = prjCC.DayWorkRate;
								mdcCC.FactorCosts = prjCC.FactorCosts;
								mdcCC.RealFactorCosts = prjCC.RealFactorCosts;
								mdcCC.FactorQuantity = prjCC.FactorQuantity;
								mdcCC.RealFactorQuantity = prjCC.RealFactorQuantity;
								mdcCC.UomFk = prjCC.UomFk;
								mdcCC.CurrencyFk = prjCC.CurrencyFk;
								mdcCC.IsDefault = prjCC.IsDefault;
								mdcCC.IsLabour = prjCC.IsLabour;
								mdcCC.FactorHour = prjCC.FactorHour;
								mdcCC.IsRate = prjCC.IsRate;
								mdcCC.IsEditable = prjCC.IsEditable;
								mdcCC.EstCostTypeFk = prjCC.EstCostTypeFk;
								// copy BasCostCode from prjCC
								mdcCC.BasCostCode = prjCC.BasCostCode;
							}
						});
					});
				}
				if (lookupData.estCostCodes.length) {
					basicsLookupdataLookupDescriptorService.updateData(costCodeLookupDataKey.estCostCodesList, list);
					_.forEach(list, function (costCode) {
						estCostCodesByCodeDictionary[costCode.Code] = costCode;
					});
				}
				return list;
			};

			// estimate look up data service call
			service.load = function () {
				let estimateCompleteLookup = {
					'estCostCode': $http.get(globals.webApiBaseUrl + 'basics/costcodes/getestcostcodelistbycompany'),
					// PLEASE DONT LOAD 46MB JSON Data, this kills any client $http.get(globals.webApiBaseUrl + 'estimate/assemblies/list')
					'estAssemblies': $q.when([]),
					'estcostcodetype': $http.get(globals.webApiBaseUrl + 'basics/costcodes/getcostcodetype')
				};

				$q.all(estimateCompleteLookup).then(function (result) {
					basicsLookupdataLookupDescriptorService.updateData('costcodetype', result.estcostcodetype.data);

					// put data to estCostCodesLoadedData
					// build tree isTree
					let list = buildTree(result.estCostCode.data);
					lookupData.estCostCodesLoadedData = angular.copy(list);
					lookupData.mdcCostCodes = angular.copy(list);
					lookupData.estCostCodes = angular.copy(list);
					basicsLookupdataLookupDescriptorService.updateData(costCodeLookupDataKey.masterCostCode, list);
					service.replaceCostCodes();
					// assemblies
					lookupData.estAssemblies = angular.copy(result.estAssemblies.data);
					basicsLookupdataLookupDescriptorService.updateData('estassemblyfk', result.estAssemblies.data);
				});
			};

			service.getModifiedPrjCC = function getModifiedPrjCC(mdcCostCode, prjId) {
				let estPrjCostCodes = basicsLookupdataLookupDescriptorService.getData(costCodeLookupDataKey.projectCostCode);
				let prjCostCodes = [],
					prjCcToSave = [];
				mdcCostCode = _.uniqBy(mdcCostCode, 'Id');

				if (estPrjCostCodes) {
					_.each(estPrjCostCodes, function (value) {
						prjCostCodes.push(value);
					});

					if (prjCostCodes.length > 0) {
						angular.forEach(mdcCostCode, function (mdcCC) {
							let prjCC = _.find(prjCostCodes, {MdcCostCodeFk: mdcCC.Id});
							if (!prjCC) {
								prjCcToSave.push(mdcCC);
							}
						});
					}
				} else {
					prjCcToSave = mdcCostCode;
				}
				if (prjCcToSave.length > 0) {
					angular.forEach(prjCcToSave, function (prjCC) {
						prjCC.ProjectFk = prjId;
						prjCC.MdcCostCodeFk = prjCC.Id;
						prjCC.Extra = 0;
						prjCC.Version = 0;
					});
				}
				return prjCcToSave;
			};

			// General stuff
			service.reload = function () {
				service.load();
			};

			// 1    Standard Assembly
			// 2    WorkItem Assembly
			// 3    Crew Assembly
			// 4    Material Assembly
			service.checkAssemblyType = function checkAssemblyType(type, dataTree) {
				let assemblyCategoryService = $injector.get('estimateAssembliesService');
				let assemblymodule = platformGridAPI.grids.exist('234bb8c70fd9411299832dcce38ed118');
				let assemblyCategory = assemblyCategoryService.getAssemblyCategory();
				let result = false;

				if (assemblyCategoryService && assemblymodule && assemblyCategory) {
					switch (type) {
						case 'Crew':
							result = assemblyCategory.EstAssemblyTypeLogicFk === 3;
							break;
						case 'Standard':
							result = assemblyCategory.EstAssemblyTypeLogicFk === 1;
							break;
					}
				}
				if (dataTree && assemblyCategory) {
					let curObject = _.find(dataTree, {Id: assemblyCategory.Id});
					if (curObject) {
						curObject.EstAssemblyTypeLogicFk = assemblyCategory.EstAssemblyTypeLogicFk;
					}
				}
				return result;
			};


			service.filterByProject = function filterByProject() {
				let projectCostCodes = _.map(lookupData.prjcostcodes, 'MdcCostCodeFk');
				// find all parents by these project cost codes
				let list = [], newList = [];
				cloudCommonGridService.flatten(lookupData.estprjcostcodes, list, 'CostCodes');
				_.each(projectCostCodes, function (costcode) {
					getIdsIncludeParents(list, costcode, newList);
				});
				lookupData.prjCostCodeIds = _.map(newList, 'Id');
				_.each(newList, function (item) {
					item.CostCodes = null;
				});

				// build tree
				return buildTree(newList);
			};

			service.getPrjCostCodeIds = function getPrjCostCodeIds() {
				return lookupData.prjCostCodeIds;
			};

			function getIdsIncludeParents(flatlist, nodeId, newList) {
				let findNode = _.find(flatlist, {Id: nodeId});
				if (findNode) {
					let existNode = _.find(newList, {Id: nodeId});
					if (!existNode) {
						newList.push(findNode);
					}
					if (findNode.CostCodeParentFk) {
						getIdsIncludeParents(flatlist, findNode.CostCodeParentFk, newList);
					}
				}
			}

			// get master cost code by id
			service.getMdcCCByIdAsync = function getMdcCCByIdAsync(costcodeId) {
				if (basicsLookupdataLookupDescriptorService.getLookupItem(costCodeLookupDataKey.masterCostCode, costcodeId)) {
					return $q.when(basicsLookupdataLookupDescriptorService.getLookupItem(costCodeLookupDataKey.masterCostCode, costcodeId));
				} else {
					if (!costcodeId) {
						return $q.when({});
					}
					return getListAsync().then(function () {
						return basicsLookupdataLookupDescriptorService.getLookupItem(costCodeLookupDataKey.masterCostCode, costcodeId);
					});
				}
			};

			service.clearCache = function clearCache(isRemove) {
				lookupData.estCostCodes = [];
				lookupData.mdcCostCodes = [];
				lookupData.estprjcostcodes = [];
				lookupData.prjCostCodeIds = [];
				lookupData.prjcostcodes = [];

				if (!isRemove) {
					basicsLookupdataLookupDescriptorService.removeData(costCodeLookupDataKey.projectCostCode);
				}
				// reload project cost codes again??
				// service.loadProjectCostCode();
			};

			service.resolveStringValueCallback = function(formatterOptions){
				return function (value, formatterOptions, entity, column){
					return service.getSearchEstCostCodesList(value, column.field, true).then(function(data){
						const userDefinedServiceName = _.get(column, 'editorOptions.lookupOptions.userDefinedConfigService', null);
						if(userDefinedServiceName){
							const userDefinedService = $injector.get(userDefinedServiceName);
							userDefinedService.attachDataToColumnLookup(data, '353cb6c50ba84ca9b82e695911fa6cdb');
						}
						if(data && data.length > 0){
							const selectedItem = angular.copy(data[0]);
							$injector.get('estimateMainCommonService').setSelectedLookupItem(selectedItem);
							return {
								apply: true,
								valid: true,
								value: data[0].Id
							};
						}
						return {
							apply: true,
							valid: false,
							value: value,
							error: 'not found!'
						};
					});
				};
			};

			return service;
		}]);
})();
