/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.parameter';

	/**
	 * @ngdoc service
	 * @name estimateParameterFormatterService
	 * @function
	 *
	 * @description
	 * estimateParameterFormatterService provides list of parameter formatter data for estimate main filter structures and line item
	 */
	angular.module(moduleName).factory('estimateParameterFormatterService', [
		'$http', '$q', '$injector', 'estimateParamUpdateService', 'boqRuleComplexLookupService','$translate','estimateMainParamStructureConstant','estMainParamItemNames',
		function ($http, $q, $injector, estimateParamUpdateService, boqRuleComplexLookupService,$translate,estimateMainParamStructureConstant,estMainParamItemNames) {

			// Object presenting the service
			let service = {},
				itemName = [],
				lookupData = {
					estParams: [],
					sourceProjectParam:[]
				},
				postData = {
					estHeaderFk: 0,
					itemName: []
				};

			let backupLookupData = lookupData;
			let isRestoreLookupData = false;

			service.isCss = function () {
				return true;
			};

			service.refresh = function (isPrjAssembly) {
				lookupData.estParams = [];
				lookupData.sourceProjectParam = [];

				if (isPrjAssembly){
					lookupData.EstLineItemsLoaded = false;
					lookupData.EstLineItemsParam = [];
					lookupData.PrjEstAssemblyCatLoaded = false;
					lookupData.EstAssemblyCatParam = [];
				}
				else {
					lookupData = {};
					postData = {};
				}


			};

			service.refreshParams = function(){
				lookupData.estParams = [];
				lookupData.EstLineItems2EstRules = [];
				lookupData.EstLineItemsLoaded = false;
				lookupData.estParamPromise = null;
				lookupData.EstLineItemsParam = [];
				lookupData.EstLineItemsPromise = null;
			};

			service.setSelectedProject = function setSelectedProject(prjId) {
				lookupData.projectFk = postData.projectFk = prjId;
			};

			service.setSourceSelectedProject = function setSourceSelectedProject(prjId,headerId) {
				if(lookupData.sourceProjectId === prjId && postData.sourceEstHeaderFk !== headerId){
					postData.sourceEstHeaderFk = headerId;
					let sourceProjectParam = angular.copy(lookupData.sourceProjectParam);
					lookupData.sourceProjectParam = sourceProjectParam;
				} else {
					lookupData.sourceProjectParam = [];
					lookupData.sourceProjectId = postData.sourceProjectId = prjId;
				}
			};


			service.setEstLineItemsParam = function setEstLineItems2EstRules(itemName, paramList) {

				if (lookupData[itemName]) {
					lookupData[itemName] = paramList;
				}
			};


			// set selected Estimate Header and ProjectId for selected Item
			service.setSelectedEstHeaderNProject = function setSelectedEstHeaderNProject(headerId) {
				if (postData.estHeaderFk !== headerId) {
					postData.estHeaderFk = headerId;
					let estParams = angular.copy(lookupData.estParams);
					lookupData = {};
					lookupData.estParams = estParams;
				}
			};

			// get complete lookup
			let getCompleteLookup = function getgetCompleteLookup() {
				return {
					'estParams': $http.post(globals.webApiBaseUrl + 'basics/customize/estparameter/list')
				};
			};

			// merge required options
			/* jshint -W074 */ //
			let mergeOptions = function mergeOptions(options, item) {
				options.validItemName = item.IsRoot >0 || item.IsEstHeaderRoot ? 'EstHeader' : options.isSourceLineItem ? 'SourceLineItems' : options.itemName;

				if (!_.find(itemName, {name: options.validItemName})) {
					itemName.push({'name': options.validItemName});
				}
				postData.id = item.IsRoot || item.IsEstHeaderRoot ? item.EstHeaderFk:item.Id;
				postData.currentItemName = options.validItemName;
				postData.headerKey = '';

				if (item.IsRoot || item.IsEstHeaderRoot ) {
					postData.filterKey = 'EstHeaderFk';
					postData.estHeaderFk = postData.id;
				} else {
					// share the code with construction system
					switch (options.itemServiceName) {
						case'estimateMainRootService':
							postData.filterKey = 'EstHeaderFk';
							break;
						case'estimateMainService':
						case'estimateMainCopySourceLineItemLookupService':
							postData.filterKey = 'EstLineItemFk';
							postData.headerKey = 'EstHeaderFk';
							postData.estHeaderFk = item.EstHeaderFk;
							if(options.itemServiceName === 'estimateMainCopySourceLineItemLookupService'){
								postData.sourceEstHeaderFk = item.EstHeaderFk;
							}else{
								postData.estHeaderFk = item.EstHeaderFk;
							}
							break;
						case'constructionSystemMainBoqService':
						case'estimateMainBoqService':
							postData.boqHeaderFk = -1;
							postData.estHeaderFk = item.EstHeaderFk? item.EstHeaderFk:postData.estHeaderFk;
							if(item.BoqHeaderFk){
								postData.boqHeaderFk = item.BoqHeaderFk;
							}else if(item.Id===-1 && item.BoqItems && item.BoqItems.length){
								postData.boqHeaderFk = item.BoqItems[0].BoqHeaderFk;
								postData.estHeaderFk = $injector.get('estimateMainService').getSelectedEstHeaderId();
							}

							postData.filterKey = 'BoqItemFk';
							postData.headerKey = 'BoqHeaderFk';
							break;
						case'boqMainService':
							postData.boqHeaderFk = item.BoqHeaderFk;
							postData.filterKey = 'BoqItemFk';
							postData.headerKey = 'BoqHeaderFk';
							break;
						case'estimateMainActivityService':
							postData.filterKey = 'PsdActivityFk';
							break;
						case'estimateMainAssembliesCategoryService':
							postData.filterKey = 'EstAssemblyCatFk';
							postData.estHeaderFk = item.EstHeaderFk ? item.EstHeaderFk : $injector.get('estimateMainService').getSelectedEstHeaderId();
							break;
						case'projectAssemblyStructureService':
							postData.filterKey = 'EstAssemblyCatFk';
							postData.isPrjAssembly = true;
							postData.projectFk = item.PrjProjectFk;
							postData.estHeaderFk = item.EstHeaderFk;

							break;
						case 'projectAssemblyMainService':
							postData.isPrjAssembly = true;

							postData.filterKey = 'EstLineItemFk';
							postData.headerKey = 'EstHeaderFk';
							postData.estHeaderFk = item.EstHeaderFk;
							break;
						case'constructionSystemMainLocationService':
						case'estimateMainLocationService':
							postData.filterKey = 'PrjLocationFk';
							postData.estHeaderFk = $injector.get('estimateMainService').getSelectedEstHeaderId();
							break;
						case'constructionSystemMainControllingService':
						case'estimateMainControllingService':
							postData.filterKey = 'MdcControllingUnitFk';
							postData.estHeaderFk = $injector.get('estimateMainService').getSelectedEstHeaderId();
							break;
						case'estimateMainProcurementStructureService':
							postData.filterKey = 'PrcStructureFk';
							postData.estHeaderFk = $injector.get('estimateMainService').getSelectedEstHeaderId();
							break;
						case 'costGroupStructureDataServiceFactory':
							postData.filterKey = 'CostGroupFk';
							postData.estHeaderFk = $injector.get('estimateMainService').getSelectedEstHeaderId();
							break;
					}
				}

				return postData;
			};

			// get list of filtered Params by item Id
			let getParamsById = function getParamsById(opt) {
				let key = opt.filterKey,
					value = opt.id,
					headerKey = opt.headerKey === 'BoqHeaderFk' ? opt.headerKey : '',
					headerValue = opt.boqHeaderFk,
					currentItemName = opt.currentItemName;

				let itemParams = _.filter(lookupData[currentItemName + 'Param'], function (item) {
					return (item[key] === value && item.Action !== 'ToDelete');
				});

				if (headerKey) {
					itemParams = _.filter(itemParams, function (item) {
						return item[headerKey] === headerValue;
					});
				}
				return itemParams;
			};

			// get list of filtered Params including saved and deleted items
			let getFilteredParams = function getFilteredParams(list, item) {
				list = list ? list : [];
				let itemId = item.IsRoot || item.IsEstHeaderRoot ? item.EstHeaderFk : item.Id;
				let paramToSave = _.filter(estimateParamUpdateService.getParamToSave(), function (prm) {
					if(item.IsRoot || item.IsEstHeaderRoot) {
						// filter out parameters of lineItem
						return prm[postData.filterKey] === itemId && prm.ItemName === 'EstHeader';
					}
					else {return prm[postData.filterKey] === itemId;}
				});
				list = list.concat(paramToSave);
				let delItems = _.filter(estimateParamUpdateService.getParamToDelete(), function (prm) {
					return prm[postData.filterKey] === itemId;
				});
				if (delItems.length) {
					list = _.filter(list, function (li) {
						return delItems.indexOf(_.find(delItems, {MainId: li.MainId})) === -1;
					});
				}
				return _.uniq(list, 'MainId');
			};

			// get list of the estimate Parameter Code by Id
			service.getItemById = function getItemById(value) {
				let iconItem = {};
				let hintMsg = $translate.instant('estimate.parameter.parameterHint');

				if (_.isString(value) && value === 'default') {
					iconItem = {css: true, res: 'tlb-icons ico-menu', text: ''};
				} else if (value && value.params) {
					let confilct = false;

					let params = value.params;
					if (params.sort) {
						params = params.sort();
					}

					for (let i = 0; i < params.length; i++) {
						let code1 = params[i] ? params[i].toLowerCase() : null;
						let code2 = params[i + 1] ? params[i + 1].toLowerCase() : null;
						if ((code1 === code2 && !!params[i + 1]) || params[i] === '...' || params[i] === '') {
							confilct = true;
							break;
						}
					}
					if (confilct) {
						iconItem = {css: true, res: 'control-icons  ico-parameter-warning', title: ''+hintMsg+''};
					} else {
						//text --> counter-text in Blue circle
						iconItem = {css: true, res: 'control-icons ico-est-parameter ico-overlay-counter', title: ''+hintMsg+'', text: params.filter(item => item).length};
					}
				}
				return iconItem;
			};

			// get list of the estimate Parameter Code by Id
			service.getItemParamById = function getItemParamById(value, options, item) {
				mergeOptions(options, item);
				let paramCodes = getParamsById(postData);
				let filterId = postData.id = item.IsRoot || item.IsEstHeaderRoot ? item.EstHeaderFk:item.Id;
				let paramToSave = _.filter(estimateParamUpdateService.getParamToSave(), function (prm) {
					if (prm[postData.filterKey] === filterId) {
						return prm.Code;
					}
				});

				angular.forEach(paramToSave, function (pItem) {
					if (paramCodes.indexOf(pItem) === -1) {
						paramCodes = paramCodes.concat(pItem);
					}
				});

				let delItems = _.filter(estimateParamUpdateService.getParamToDelete(), function (prm) {
					return prm[postData.filterKey] === filterId;
				});
				let paramToDelete = _.map(delItems, 'Code');
				if (paramToDelete.length) {
					paramCodes = _.filter(paramCodes, function (li) {
						return paramToDelete.indexOf(li) === -1;
					});
				}
				item.Param = _.map(paramCodes, 'Code');
				value = item.Param;
				return item.Param;
			};

			// get list of the estimate Param items by code(for immediate window)
			service.getItemsByParam = function getItemsByParam(mainItem, opt) {
				let items = [];
				mergeOptions(opt, mainItem);
				let list = lookupData[postData.currentItemName + 'Param'];
				let itemId = mainItem.IsRoot || mainItem.IsEstHeaderRoot  ? mainItem.EstHeaderFk : mainItem.Id;
				let filteredItems = _.filter(list, function (item) {
					return item[postData.filterKey] === itemId;
				});
				if (postData.headerKey) {
					filteredItems = _.filter(filteredItems, function (item) {
						return item[postData.headerKey] === mainItem[postData.headerKey];
					});
				}
				list = getFilteredParams(filteredItems, mainItem);

				// here I think it make problem, the new item with the same code will be filtered
				mainItem.Param = _.map(list, 'Code');

				items = list;
				let cnt = 0;
				let newItemsIndex = _.map(_.filter(items, {Version: 0}), 'Id');
				angular.forEach(items, function (item) {
					cnt++;
					if (item && item.Version !== 0) {
						while (newItemsIndex.length && newItemsIndex.indexOf(cnt) !== -1) {
							cnt++;
						}
						item.Id = cnt;
					}
				});

				return _.uniq(items, 'Id');
			};

			service.getItemsByParamEx = function getItemsByParamEx(mainItem, opt) {
				let displayData = [];
				let validItemName = mainItem.IsRoot || mainItem.IsEstHeaderRoot ? 'EstHeader' : opt.itemName;
				let data = {
					currentItemName: validItemName,
					estHeaderFk: postData.estHeaderFk,
					filterKey: postData.filterKey,
					headerKey: postData.headerKey,
					id: mainItem.Id,
					itemName: [validItemName]
				};

				return $http.post(globals.webApiBaseUrl + 'estimate/parameter/lookup/list', data).then(function (response) {
					processData(response.data);
					lookupData[data.currentItemName + 'Param'] = response.data[data.currentItemName + 'Param'];
					displayData = service.getItemsByParam(mainItem, opt);
					backupLookupData = lookupData;
					return $q.when(displayData);
				});
			};

			// get list of Parameters Lookup Items
			service.getLookupList = function (itemName) {
				if (itemName) {
					return lookupData[itemName + 'Param'];
				}
			};

			// process Rules Items
			function processData(data) {
				if (!data) {
					return;
				}

				let processItems = function (items) {
					angular.forEach(items, function (item) {
						if (!_.isObject(item)) {
							return;
						}
						item.MainId = angular.copy(item.Id);
					});
				};
				if (_.isArray(data)) {
					processItems(data);
				} else if (_.isObject(data)) {
					_.each(data, function (items, key) {
						if (key !== 'itemName') {
							processItems(items);
						}
					});
				}
			}

			service.processData = processData;

			service.removeLineItemParam = function removeLineItemParam(validItemName, key, value) {
				lookupData[validItemName + 'Param'] = _.filter(lookupData[validItemName + 'Param'], function (item) {
					return item[key] !== value;
				});
			};

			service.addLineItemParam = function addLineItemParam(validItemName, key, paramList) {
				if (_.isArray(paramList)) {
					_.forEach(paramList, function (param) {
						let paramFind = _.find(lookupData[validItemName + 'Param'], function (item) {
							return item.Id === param.Id;
						});
						if (!paramFind) {
							lookupData[validItemName + 'Param'].push(param);
						}
					});
				}
			};

			// load Parameter Data as per item
			function loadItemData(name) {
				if (name) {
					let data = angular.copy(postData);
					data.itemName = [name];

					if(name === 'SourceLineItems'){
						data.projectFk = postData.sourceProjectId;
						data.estHeaderFk = postData.sourceEstHeaderFk;
					}

					return $http.post(globals.webApiBaseUrl + 'estimate/parameter/lookup/list', data).then(function (response) {
						processData(response.data);

						lookupData[name + 'Param'] = response.data;
						backupLookupData = lookupData;
						return response.data;
					});
				} else {
					return $q.when([]);
				}
			}

			// get param from list of the Parameters
			let getParam = function getParam(params) {
				let tempparam = {params: params};
				return params && params.length ? tempparam : 'default';
			};

			// get list of the Parameters as per item async
			let getListAsync = function getListAsync(item, options) {
				mergeOptions(options, item);
				let value = item.Param;
				if ((lookupData[options.validItemName + 'Param'] && lookupData[options.validItemName + 'Param'].length) || lookupData[options.validItemName + 'Loaded']) {
					let params = service.getItemParamById(value, options, item);
					return getParam(params);
				} else {
					if (!lookupData[options.validItemName + 'Promise']) {
						lookupData[options.validItemName + 'Promise'] = loadItemData(options.validItemName);
					}
					return lookupData[options.validItemName + 'Promise'].then(function (data) {
						lookupData[options.validItemName + 'Promise'] = null;
						lookupData[options.validItemName + 'Loaded'] = true;
						angular.extend(lookupData, data);
						let params = service.getItemParamById(value, options, item);
						return getParam(params);
					});
				}
			};

			// get list of the estimate Parameter Code item by Id Async
			service.getItemByParamAsync = function getItemByParamAsync(item, options) {
				if (!item) {
					return;
				}
				if(!item.Param){
					item.Param = [];
				}
				if(options.isSourceLineItem){

					// use lookupData.sourceProjectRules if list is already loaded otherwise load from server
					if(lookupData.sourceProjectParam && lookupData.sourceProjectParam.length){
						return $q.when(getListAsync(item, options));
					} else {
						if(!lookupData.sourceProjectParamPromise) {
							lookupData.sourceProjectParamPromise = getCompleteLookup().estParams;
						}
						return lookupData.sourceProjectParamPromise.then(function (response) {
							lookupData.sourceProjectParamPromise = null;
							_.forEach(response.data, function (pitem) {
								pitem.ValueType = pitem.ParamvaluetypeFk;
							});
							lookupData.sourceProjectParam = response.data;
							return $q.when(getListAsync(item, options));
						});
					}
				} else {
					// load est param
					if (lookupData.estParams && lookupData.estParams.length) {
						return $q.when(getListAsync(item, options));
					} else {
						if (!lookupData.estParamPromise) {
							lookupData.estParamPromise = getCompleteLookup().estParams;
						}
						return lookupData.estParamPromise.then(function (response) {
							lookupData.estParamPromise = null;
							_.forEach(response.data, function (pitem) {
								pitem.ValueType = pitem.ParamvaluetypeFk;
							});
							lookupData.estParams = response.data;
							return $q.when(getListAsync(item, options));
						});
					}
				}

			};

			service.handleUpdateDone = function (data) {
				_.forEach(estMainParamItemNames, function (name){
					if(data[name + 'ParamToSave'] || data[name + 'ParamToDelete']){
						handleUpdateDone(data, name);
					}
				});
			};

			// merge item after update
			function handleUpdateDone(data, name) {
				let lineItemParamKey = 'EstLineItemParameter';
				let filterItems = _.filter(data, function (value, key) {
					return key === name + 'ParamToSave';
				});

				if (isRestoreLookupData) {
					lookupData = backupLookupData;
				}

				let list = name === lineItemParamKey ? lookupData['EstLineItemsParam'] : lookupData[name + 'Param'];

				if (filterItems && filterItems[0]) {
					processData(filterItems[0]);
				}

				if (_.isArray(list)) {
					angular.forEach(filterItems[0], function (item) {
						if (item) {
							let oldItem = name === lineItemParamKey ? _.find(list, {MainId: item.RealyId}) : _.find(list, {MainId: item.Id});

							if (name === 'Boq') { // this case just for project boq.dont delete
								oldItem = _.find(list, {
									BoqHeaderFk: item.BoqHeaderFk,
									BoqItemFk: item.BoqItemFk,
									Code: item.Code,
									MainId: item.MainId
								});
							}
							if (oldItem) {
								let originalId = oldItem.Id;
								let originalMainId = oldItem.MainId;
								angular.extend(list[list.indexOf(oldItem)], item);
								oldItem.Id = originalId;
								oldItem.MainId = originalMainId;
							} else {
								list.push(item);
							}
						}
					});
				} else {
					list = filterItems[0];
				}

				let deletedItems = _.filter(data, function (value, key) {
					return key === name + 'ParamToDelete';
				});

				let result;
				result = _.filter(list, function (li) {
					let item = _.find(deletedItems[0], {Id: li.MainId});

					if (name === 'Boq') {  // this case just for project boq.dont delete
						item = _.find(deletedItems[0], {
							BoqHeaderFk: li.BoqHeaderFk,
							BoqItemFk: li.BoqItemFk,
							Code: li.Code,
							Id: li.MainId
						});
					}

					if (!item) {
						return li;
					}
				});

				lookupData[name + 'Param'] = result;
				lookupData[name + 'ParamNotDeleted'] = data.ParamsNotDeleted && data.ParamsNotDeleted.length ? data.ParamsNotDeleted : [];
				return lookupData[name + 'Param'];
			}

			service.handleUpdateDoneEx = function (data, currentItemName) {
				let name = postData.currentItemName;
				postData.currentItemName = currentItemName;
				service.handleUpdateDone(data);
				postData.currentItemName = name;
			};

			let itemNameMaps = {
				'EstBoq': estimateMainParamStructureConstant.BoQs,
				'EstActivity': estimateMainParamStructureConstant.ActivitySchedule,
				'EstPrjLocation': estimateMainParamStructureConstant.Location,
				'EstCtu': estimateMainParamStructureConstant.Controllingunits,
				'EstPrcStructure': estimateMainParamStructureConstant.ProcurementStructure,
				'EstAssemblyCat': estimateMainParamStructureConstant.AssemblyCategoryStructure,
				'EstCostGrp': estimateMainParamStructureConstant.EnterpriseCostGroup,
				'EstLineItems': estimateMainParamStructureConstant.LineItem,
				'EstHeader': estimateMainParamStructureConstant.EstHeader
			};
			/**
			 * @ngdoc method handleUpdateDoneWithLineItemParams
			 * @desc if lineItemParams exist, then merge the lineItemParams with the lookupData
			 * @param lineItemParams
			 */
			service.handleUpdateDoneWithLineItemParams = function(lineItemParams) {
				if (lineItemParams && lineItemParams.length) {
					let invertItemNameMaps = _.invert(itemNameMaps);
					let lineItemParamMerge = function (itemToSave) {
						let item = itemToSave.EstLineItemParameters;
						if(item) {
							let itemName = invertItemNameMaps[item.AssignedStructureId];
							let list = lookupData[itemName + 'Param'];
							if (list && _.isArray(list)) {
								let oldItem = _.find(list, {MainId: item.RealyId});
								if (oldItem) {
									let originalId = oldItem.Id;
									let originalMainId = oldItem.MainId;
									angular.extend(oldItem, item);
									oldItem.Id = originalId;
									oldItem.MainId = originalMainId;
								}
							}
						}
					};
					lineItemParams.forEach(lineItemParamMerge);
				}
			};

			// merge parameters
			service.mergeParams = function mergeParams(result) {
				processData(result);
				angular.extend(lookupData, result);
			};

			// load lookup data
			service.loadLookupItemData = function loadLookupItemData(data) {
				if (!data || !data.itemName) {
					return $q.when([]);
				}
				data.itemName = _.isArray(data.itemName) ? data.itemName : [data.itemName];
				return $http.post(globals.webApiBaseUrl + 'estimate/parameter/lookup/list', data).then(function (response) {
					lookupData[data.itemName + 'Param'] = response.data;
					backupLookupData = lookupData;
					processData(response.data);
					angular.extend(lookupData, data);
					return response.data;
				});
			};

			// clear lookup data
			service.clear = function clear() {
				backupLookupData = lookupData;
				lookupData = {};
			};

			service.getParamNotDeleted = function (itemName) {
				return lookupData[itemName + 'ParamNotDeleted'];
			};

			service.clearParamNotDeleted = function (itemName) {
				lookupData[itemName + 'ParamNotDeleted'] = [];
			};

			service.isRestoreParam = function (isRestore) {
				isRestoreLookupData = isRestore;
			};

			let setParamAssignment4BoqItems = function (boqItems, boqParamItems) {
				angular.forEach(boqItems, function (boqItem) {
					boqItem.ParamAssignment = _.filter(boqParamItems, function (boqParamItem) {
						return boqParamItem.BoqHeaderFk === boqItem.BoqHeaderFk && boqParamItem.BoqItemFk === boqItem.Id;
					});

					let childBoqItems = boqItem.BoqItems;
					if (childBoqItems && childBoqItems.length) {
						setParamAssignment4BoqItems(childBoqItems, boqParamItems);
					}
				});
			};

			// after drag/drop wic boq to proejct boq,need update the UI to show parameters
			service.buildParamAssignment = function buildRuleAndRuleAssignment(boqTreeItems, boqParamItems) {
				if (boqParamItems && boqParamItems.length && boqTreeItems && boqTreeItems.length) {
					processData(boqParamItems);
					lookupData.BoqParam = boqParamItems;
					// as the boqTreeItems has a hirachical structure, so a recursion function here to handler it
					setParamAssignment4BoqItems(boqTreeItems, boqParamItems);
				}
			};

			service.getEstParams = function () {
				return lookupData.estParams;
			};

			service.getItemByIdNew = function (item) {
				if (!item) {
					return;
				}

				return _.map(boqRuleComplexLookupService.getItemById(item.RuleAssignment), 'Icon');
			};


			service.updateCacheParam = function updateCacheParam(currentItemName,prjRuleIds,currentEntityId,isMaster,delParamCodes) {
				let itemParams = [];

				switch (currentItemName) {
					case 'EstBoq':
						_.forEach(lookupData[currentItemName + 'Param'],function(item){
							if(prjRuleIds.indexOf(item.ProjectEstRuleFk)<0){
								itemParams.push(item);
							}else if(prjRuleIds.indexOf(item.ProjectEstRuleFk)>=0 && item.BoqItemFk !== currentEntityId){
								itemParams.push(item);
							}
						});
						break;
					case 'EstActivity':
						_.forEach(lookupData[currentItemName + 'Param'],function(item){
							if(prjRuleIds.indexOf(item.ProjectEstRuleFk)<0){
								itemParams.push(item);
							}else if(prjRuleIds.indexOf(item.ProjectEstRuleFk)>=0 && item.PsdActivityFk !== currentEntityId){
								itemParams.push(item);
							}
						});
						break;
					case 'EstPrjLocation':
						_.forEach(lookupData[currentItemName + 'Param'],function(item){
							if(prjRuleIds.indexOf(item.ProjectEstRuleFk)<0){
								itemParams.push(item);
							}else if(prjRuleIds.indexOf(item.ProjectEstRuleFk)>=0 && item.PrjLocationFk !== currentEntityId){
								itemParams.push(item);
							}
						});
						break;
					case 'EstCtu':
						_.forEach(lookupData[currentItemName + 'Param'],function(item){
							if(prjRuleIds.indexOf(item.ProjectEstRuleFk)<0){
								itemParams.push(item);
							}else if(prjRuleIds.indexOf(item.ProjectEstRuleFk)>=0 && item.MdcControllingUnitFk !== currentEntityId){
								itemParams.push(item);
							}
						});
						break;
					case 'EstPrcStructure':
						_.forEach(lookupData[currentItemName + 'Param'],function(item){
							if(prjRuleIds.indexOf(item.ProjectEstRuleFk)<0){
								itemParams.push(item);
							}else if(prjRuleIds.indexOf(item.ProjectEstRuleFk)>=0 && item.PrcStructureFk !== currentEntityId){
								itemParams.push(item);
							}
						});
						break;
					case 'EstAssemblyCat':

						if(isMaster && delParamCodes && delParamCodes.length>0) {
							_.forEach(lookupData[currentItemName + 'Param'], function (item) {
								if (delParamCodes.indexOf(item.Code) < 0) {
									itemParams.push(item);
								} else if (delParamCodes.indexOf(item.Code) >= 0 && item.EstAssemblyCatFk !== currentEntityId) {
									itemParams.push(item);
								}
							});
						}else {
							_.forEach(lookupData[currentItemName + 'Param'], function (item) {
								if (prjRuleIds.indexOf(item.ProjectEstRuleFk) < 0) {
									itemParams.push(item);
								} else if (prjRuleIds.indexOf(item.ProjectEstRuleFk) >= 0 && item.EstAssemblyCatFk !== currentEntityId) {
									itemParams.push(item);
								}
							});
						}

						break;
					case  'EstCostGrp':
						_.forEach(lookupData[currentItemName + 'Param'],function(item){
							if(prjRuleIds.indexOf(item.ProjectEstRuleFk)<0){
								itemParams.push(item);
							}else if(prjRuleIds.indexOf(item.ProjectEstRuleFk)>=0 && item.CostGroupFk !== currentEntityId){
								itemParams.push(item);
							}
						});
						break;
					case 'EstLineItems':
						if(isMaster && delParamCodes && delParamCodes.length>0) {
							_.forEach(lookupData[currentItemName + 'Param'], function (item) {
								if (delParamCodes.indexOf(item.Code) < 0) {
									itemParams.push(item);
								} else if (delParamCodes.indexOf(item.Code) >= 0 && item.EstLineItemFk !== currentEntityId) {
									itemParams.push(item);
								}
							});
						}else {
							_.forEach(lookupData[currentItemName + 'Param'], function (item) {
								if (prjRuleIds.indexOf(item.ProjectEstRuleFk) < 0) {
									itemParams.push(item);
								} else if (prjRuleIds.indexOf(item.ProjectEstRuleFk) >= 0 && item.EstLineItemFk !== currentEntityId) {
									itemParams.push(item);
								}
							});
						}
						break;
					case 'EstHeader':
						_.forEach(lookupData[currentItemName + 'Param'],function(item){
							if(prjRuleIds.indexOf(item.ProjectEstRuleFk)<0){
								itemParams.push(item);
							}else if(prjRuleIds.indexOf(item.ProjectEstRuleFk)>=0 && item.EstHeaderFk !== currentEntityId){
								itemParams.push(item);
							}
						});
						break;
				}

				lookupData[currentItemName + 'Param'] = itemParams;

				$injector.get('estimateMainLineitemParamertersService').refreshToLineItemParams(null,true);
			};

			return service;
		}]);
})();
