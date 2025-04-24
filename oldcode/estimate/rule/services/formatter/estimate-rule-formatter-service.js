/**
 * Created by joshi on 21.01.2016.
 */

(function () {
	'use strict';
	/* global globals, _ */
	let moduleName = 'estimate.rule';

	/**
	 * @ngdoc service
	 * @name estimateRuleItems2RuleLookupService
	 * @function
	 *
	 * @description
	 * estimateRuleItems2RuleLookupService provides list of lookup data for estimate main filter structures and line item
	 */
	angular.module(moduleName).factory('estimateRuleFormatterService', ['$http','$injector', '$q', 'estimateMainRuleUpdateService', 'estimateRuleAssignmentService', 'estimateRuleMasterDataFilterService',
		function ( $http,$injector, $q, estimateRuleUpdateService, estimateRuleAssignmentService, estimateRuleMasterDataFilterService) {

			// Object presenting the service
			let service = {},
				itemName = [],
				projectId = 0,
				sourceProjectId = 0,
				lookupData = {
					estPrjRules:[],
					sourceProjectRules:[]
				},
				postData = {
					estHeaderFk :0,
					id : 0,
					boqHeaderFk : 0,
					projectFk : 0,
					itemName: []
				};

			// user click module's refresh button,refresh the estPrjRules and leadingstructure2Rule data
			service.refresh = function(){
				lookupData = {};
				lookupData.estPrjRules = [];
				lookupData.sourceProjectRules = [];
				postData = {};
			};

			service.refreshRules = function(){
				lookupData.estPrjRules = [];
				lookupData.EstLineItems2EstRules = [];
				lookupData.EstLineItemsPromise = null;
				lookupData.EstLineItemsLoaded = false;
				lookupData.estPrjRulesPromise = null;
			};

			service.setEstLineItems2EstRules  = function setEstLineItems2EstRules(itemName,ruleList){

				if(lookupData[itemName] ){
					lookupData[itemName] = ruleList;
				}
			};

			service.setEstPrjRules = function setEstPrjRules(estPrjRules){
				lookupData.estPrjRules = estimateRuleMasterDataFilterService.filterRuleByMasterData(estPrjRules, 'MainId');
			};
			service.updateRuleAssignment = function updateRuleAssignment(data) {
				if (!Array.isArray(data)) {
					return;
				}

				data.forEach(newItem => {
					let existingItem = _.find(lookupData.estPrjRules, { Id: newItem.Id });
					if (existingItem) {
						_.extend(existingItem, newItem);
					}
				});
			};
			service.setSelectedProject = function setSelectedProject(prjId) {
				lookupData.projectFk = postData.projectFk = projectId = prjId;
				lookupData.estPrjRules = [];
			};

			service.setSourceSelectedProject = function setSourceSelectedProject(prjId,headerId) {
				if(postData.sourceProjectId === prjId && postData.sourceEstHeaderFk !== headerId){
					postData.sourceEstHeaderFk = headerId;
					let sourceProjectRules = angular.copy(lookupData.sourceProjectRules);
					lookupData.sourceProjectRules = sourceProjectRules;
				} else {
					lookupData.sourceProjectRules = [];
					lookupData.sourceProjectId = postData.sourceProjectId = sourceProjectId = prjId;
				}
			};

			// set selected Estimate Header and ProjectId for selected Item
			service.setSelectedEstHeaderNProject = function setSelectedEstHeaderNProject(headerId, prjId){
				if(postData.estHeaderFk !== headerId){
					postData.estHeaderFk = headerId;
					let estPrjRules= angular.copy(lookupData.estPrjRules);
					lookupData = {};
					lookupData.estPrjRules = estPrjRules;
				}
				service.setSelectedProject(prjId);
			};

			// get complete lookup
			let getCompleteLookup = function getCompleteLookup(prjId){
				return {
					'estPrjRules' : $http.get(globals.webApiBaseUrl + 'estimate/rule/projectestimaterule/list?projectFk=' + prjId || postData.projectFk)
				};
			};

			// merge required options
			/* jshint -W074 */ //
			let mergeOptions = function mergeOptions(options, item){
				options.validItemName = (item.IsRoot|| item.IsEstHeaderRoot) ? 'EstHeader' : options.isSourceLineItem ? 'SourceLineItems' : options.itemName;
				if(!_.find(itemName, {name:options.validItemName})){
					itemName.push({'name':options.validItemName});
				}
				postData.id = (item.IsRoot|| item.IsEstHeaderRoot) ? item.EstHeaderFk : item.Id;
				postData.currentItemName = options.validItemName;
				postData.boqHeaderFk = 0;
				postData.headerKey = null;
				postData.id = !postData.id && item.IsEstHeaderRoot ? item.estHeaderFk : postData.id;
				postData.projectFk =  $injector.get('estimateMainService').getProjectId();

				if(item.IsRoot|| item.IsEstHeaderRoot){
					postData.filterKey = 'EstHeaderFk';
					postData.headerKey = 'EstHeaderFk';
					postData.estHeaderFk = item.EstHeaderFk;
				}else{
					postData.estHeaderFk = $injector.get('estimateMainService').getSelectedEstHeaderId();
					switch (options.itemServiceName){
						case'estimateMainRootService':
							postData.filterKey = 'EstHeaderFk';
							break;
						case'estimateMainService':
						case'projectAssemblyMainService':
						case'estimateMainCopySourceLineItemLookupService':
							postData.filterKey = 'EstLineItemFk';
							postData.headerKey = 'EstHeaderFk';
							if(options.itemServiceName === 'estimateMainCopySourceLineItemLookupService'){
								postData.sourceEstHeaderFk = item.EstHeaderFk;
							}else{
								postData.estHeaderFk = item.EstHeaderFk;
							}
							break;
						case'estimateMainBoqService':
							postData.boqHeaderFk = item.BoqHeaderFk;
							postData.filterKey = 'BoqItemFk';
							postData.headerKey = 'BoqHeaderFk';
							if(item.Id === -1 && item.BoqItems && item.BoqItems.length) {
								postData.boqHeaderFk = item.BoqItems[0].BoqHeaderFk;
							}
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
							break;
						case 'projectAssemblyStructureService':
							postData.filterKey = 'EstAssemblyCatFk';
							postData.isPrjAssembly = true;
							postData.projectFk = item.PrjProjectFk;
							break;
						case'estimateMainLocationService':
							postData.filterKey = 'PrjLocationFk';
							break;
						case'estimateMainControllingService':
							postData.filterKey = 'MdcControllingUnitFk';
							break;
						case'estimateMainProcurementStructureService':
							postData.filterKey = 'PrcStructureFk';
							break;
						case 'costGroupStructureDataServiceFactory':
							postData.filterKey ='CostGroupFk';
							break;
					}
				}
				return postData;
			};

			let getRulesByProject = function getRulesByProject(){
				if(postData.currentItemName === 'SourceLineItems'){
					return lookupData.sourceProjectRules;
				} else {
					return lookupData.estPrjRules;
				}
			};

			// get list of filtered rules by item Id
			let getRulesById = function getRulesById(opt) {
				let items = [],
					key = opt.filterKey,
					value = opt.id,
					headerKey = opt.headerKey === 'BoqHeaderFk' || opt.headerKey === 'EstHeaderFk' ? opt.headerKey : '',
					headerValue = opt.boqHeaderFk || opt.estHeaderFk,
					currentItemName = opt.currentItemName;

				let item2Rules = _.filter(lookupData[currentItemName+'2EstRules'], function(item){
					return item[key] === value;
				});

				let prjRules = getRulesByProject();
				if(headerKey){
					item2Rules = _.filter(item2Rules, function(item){
						return item[headerKey] === headerValue;
					});
				}
				items = item2Rules;
				if(item2Rules && item2Rules.length && prjRules && prjRules.length){
					items =[];
					angular.forEach(item2Rules, function(itemRule){
						let rule =  _.find(prjRules, {Id : itemRule.PrjEstRuleFk} );
						if(rule){
							itemRule.Icon = rule.Icon;
							estimateRuleAssignmentService.updateProperties(rule, itemRule);
							rule.EstEvaluationSequenceFk = itemRule.EstEvaluationSequenceFk ? itemRule.EstEvaluationSequenceFk : rule.EstEvaluationSequenceFk;

							items.push(rule);
						}
					});
				}
				return items;
			};

			// get list of the estimate Rule item by code
			let getRulesByCode = function getRulesByCode(codes) {
				let items = [];
				let rules = getRulesByProject();
				angular.forEach(codes, function(code){
					if(!!code && !_.find(items,{Code: code.toString()})) {
						let item = _.find(rules, {Code: code.toString()});
						if (item) {
							items.push(item);
						}
					}
				});
				return items;
			};

			service.getRulesByCode = getRulesByCode;

			service.removeRules = function removeRules(currentItemName, key, value){
				lookupData[currentItemName+'2EstRules'] = _.filter(lookupData[currentItemName+'2EstRules'], function(item){
					return item[key] !== value;
				});
			};

			service.removeRulesByPrjRuleIds = function (currentItemName, prjRuleIds) {
				const retVal = {
					isSuccess : false,
					ruleCodes : []
				};
				if (Array.isArray(lookupData[currentItemName + '2EstRules']) && lookupData[currentItemName + '2EstRules'].length) {
					const rules = lookupData[currentItemName + '2EstRules'];
					const initialCount = rules.length;
					lookupData[currentItemName + '2EstRules'] = rules.filter(item => !prjRuleIds.includes(item.PrjEstRuleFk));
					retVal.isSuccess = initialCount !== lookupData[currentItemName + '2EstRules'].length;
					retVal.ruleCodes = lookupData.estPrjRules.filter(e => prjRuleIds.includes(e.Id)).map(e => e.Code);
				}
				return retVal;
			};

			service.addRules = function addRules(currentItemName, key, ruleList){
				if(_.isArray(ruleList)){
					_.forEach(ruleList, function(rule){
						let ruleFind = _.find(lookupData[currentItemName+'2EstRules'], function(item){
							return item.Id === rule.Id;
						});
						if(!ruleFind){
							lookupData[currentItemName+'2EstRules'].push(rule);
						}
					});
				}
			};

			service.getRuleItemsById = function(value, options, item){
				mergeOptions(options, item);
				let items = item.IsRoot || item.IsEstHeaderRoot || item.EstHeaderFk ||item.BoqHeaderFk? getRulesById(postData) : _.isArray(value) && value.length ? getRulesByCode(value) : getRulesById(postData);// drag drop rule to HeaderRoot refresh issue to other root(boq, activity)

				let filterId = item.IsRoot ? item.EstHeaderFk : item.Id;
				let ruleToSave = _.filter(estimateRuleUpdateService.getRuleToSave(), function(rule){
					return rule[postData.filterKey] === filterId &&  postData.currentItemName === rule.ItemName;
				});
				items = items.concat(ruleToSave);

				let delItems = _.filter(estimateRuleUpdateService.getRuleToDelete(), function(rule){
					return rule[postData.filterKey] === filterId;
				});
				let ruleToDelete = _.map(delItems, 'Code');
				if(ruleToDelete.length){
					items =  _.filter(items, function(li){
						return  ruleToDelete.indexOf(li.Code) === -1;
					});
				}

				items = _.uniqBy(items, 'Code');
				items = _.sortBy(items, ['Code']);
				item.Rule = _.map(items, 'Code');

				if(items && item && item.RuleAssignment){
					angular.forEach(items, function(itemRule){
						let rule =  _.find(item.RuleAssignment, {Id : itemRule.Id} );
						if(rule){
							itemRule.IsExecution = rule.IsExecution;
							itemRule.Comment = rule.Comment;
							itemRule.Operand = rule.Operand;
						}
					});
				}
				// TODO-Walt: sequence
				item.RuleAssignment = angular.copy(items);

				let icons = _.map(items, 'Icon');
				return icons;
			};

			// get list of the estimate RuleCode item by Id
			service.getItemById = function getItemById(value, options, item) {
				let items = service.getRuleItemsById(value, options, item);
				return items;
			};

			service.getRuleFormulaListById = function (value, options, item){
				let items = service.getRuleItemsById(value, options, item);
				return items;
			};

			// get list of Rules Lookup Items
			service.getLookupList = function(itemName){
				if(itemName){
					return lookupData[itemName + '2EstRules'];
				}
			};

			// process Rules Items
			function processData (data){
				if(!data){return;}

				let processItems = function(items){
					angular.forEach(items, function(item){
						item.MainId = angular.copy(item.Id);
					});
				};
				if(_.isArray(data)){
					processItems(data);
				}else if(_.isObject(data)){
					_.each(data, function(items){
						processItems(items);
					});
				}

			}

			service.processData = processData;

			// load Rules Data as per item
			function loadItemData(name){
				if(_.isString(name) && (name.length > 0)){
					let data = angular.copy(postData);
					data.itemName = [name];
					if(name === 'EstActivity'){
						data.id = _.isString(data.id) ? data.id.replace('schedule', '') : data.id;
					}
					if(name === 'SourceLineItems'){
						data.projectFk = postData.sourceProjectId;
						data.estHeaderFk = postData.sourceEstHeaderFk;
					}

					return $http.post(globals.webApiBaseUrl + 'estimate/rule/completelookup/list', data).then(function(response){
						processData(response.data);
						return response.data;
					});
				}else{
					return $q.when([]);
				}
			}

			// get list of the Rules as per item async
			let getListAsync = function getListAsync(item, options) {
				mergeOptions(options, item);
				let value = item.Rule;

				if((lookupData[options.validItemName+'2EstRules'] && lookupData[options.validItemName+'2EstRules'].length) ||
					lookupData[options.validItemName  + 'Loaded'])
				{
					return service.getRuleItemsById(value, options, item);
				}else {
					if(!lookupData[ options.validItemName +'Promise']) {
						lookupData[ options.validItemName +'Promise'] = loadItemData(options.validItemName);
					}
					return lookupData[ options.validItemName +'Promise'].then(function(data){
						lookupData[options.validItemName +'Promise'] = null;
						lookupData[options.validItemName  + 'Loaded'] = true;
						angular.extend(lookupData, data);
						return service.getItemById(value, options, item);
					});
				}
			};

			let getRuleListAsync = function getListAsync(item, options) {
				mergeOptions(options, item);
				let value = item.Rule;
				if((lookupData[options.validItemName+'2EstRules'] && lookupData[options.validItemName+'2EstRules'].length) ||
					lookupData[options.validItemName  + 'Loaded'])
				{
					return service.getRuleItemsById(value, options, item);
				}
				else {
					if(!lookupData[ options.validItemName +'Promise']) {
						lookupData[ options.validItemName +'Promise'] = loadItemData(options.validItemName);
					}
					return lookupData[ options.validItemName +'Promise'].then(function(data){
						lookupData[options.validItemName +'Promise'] = null;
						lookupData[options.validItemName  + 'Loaded'] = true;
						angular.extend(lookupData, data);
						return service.getRuleItemsById(value, options, item);
					});
				}
			};

			service.getRuleItemsByIdAsync = function getRuleItemsByIdAsync(item, options){
				mergeOptions(options, item);
				if(!item){
					return;
				}
				// TODO check
				if(options && options.isSourceLineItem){
					if(lookupData.sourceProjectRules && lookupData.sourceProjectRules.length){
						return $q.when(getRuleListAsync(item, options));
					} else {
						// use lookupData.sourceProjectRules if list is already loaded otherwise load from server
						if(!lookupData.sourceProjectRulesPromise) {
							lookupData.sourceProjectRulesPromise = getCompleteLookup(sourceProjectId).estPrjRules;
						}
						return lookupData.sourceProjectRulesPromise.then(function(response){
							lookupData.sourceProjectRules = response.data;
							return $q.when(getRuleListAsync(item, options));
						});
					}
				}else{
					// load est rules
					if(lookupData.estPrjRules && lookupData.estPrjRules.length){
						return $q.when(getRuleListAsync(item, options));
					}
					else {
						if(!lookupData.estPrjRulesPromise) {
							lookupData.estPrjRulesPromise = getCompleteLookup(projectId).estPrjRules;
						}
						return lookupData.estPrjRulesPromise.then(function(response){
							lookupData.estPrjRules = response.data;
							return $q.when(getRuleListAsync(item, options));
						});
					}
				}
			};

			// get rules of line item or filter structures async
			service.getItemByRuleAsync = function getItemByRuleAsync(item, options) {
				mergeOptions(options, item);
				if(!item){
					return;
				}
				if(!item.Rule){
					item.Rule = [];
				}
				if(options.isSourceLineItem){
					if(lookupData.sourceProjectRules && lookupData.sourceProjectRules.length){
						return $q.when(getListAsync(item, options));
					} else {
						// use lookupData.sourceProjectRules if list is already loaded otherwise load from server
						if(!lookupData.sourceProjectRulesPromise) {
							lookupData.sourceProjectRulesPromise = getCompleteLookup(sourceProjectId).estPrjRules;
						}
						return lookupData.sourceProjectRulesPromise.then(function(response){
							lookupData.sourceProjectRules = response.data;
							return $q.when(getListAsync(item, options));
						});
					}

				} else {

					// load est rules
					if(lookupData.estPrjRules && lookupData.estPrjRules.length){
						return $q.when(getListAsync(item, options));
					}
					else {
						if(!lookupData.estPrjRulesPromise) {
							lookupData.estPrjRulesPromise = getCompleteLookup(projectId).estPrjRules;
						}
						return lookupData.estPrjRulesPromise.then(function(response){
							lookupData.estPrjRules = response.data;
							return $q.when(getListAsync(item, options));
						});
					}

				}
			};

			service.mergePrjEstRule = function(orginalRules, newRules){
				angular.forEach(newRules, function(item){
					if(item){
						let oldItem = _.find(orginalRules, {Code : item.Code});
						if(oldItem){
							angular.extend(orginalRules[orginalRules.indexOf(oldItem)], item);
						}else{
							orginalRules.push(item);
						}
					}
				});
			};

			// merge item after update
			service.handleUpdateDone = function(data){
				// Handle Project Assembly Rules (Which is the same as lookupData.estPrjRules)
				let prjAssemblyRuleToSaveField = 'PrjAssemblyRuleToSave';
				if(data[prjAssemblyRuleToSaveField] && data[prjAssemblyRuleToSaveField].length){
					if(_.isArray(lookupData.estPrjRules) && lookupData.estPrjRules.length){
						// TODO:concat can not update the prjEstRule version
						service.mergePrjEstRule(lookupData.estPrjRules, _.map(data[prjAssemblyRuleToSaveField], 'PrjEstRule'));
						// lookupData.estPrjRules = lookupData.estPrjRules.concat(data.PrjEstRuleToSave);
						lookupData.estPrjRules = _.uniqBy(lookupData.estPrjRules, 'Code');
					}else{
						lookupData.estPrjRules =  data[prjAssemblyRuleToSaveField];
					}
				}

				if(data.PrjEstRuleToSave && data.PrjEstRuleToSave.length){
					if(_.isArray(lookupData.estPrjRules) && lookupData.estPrjRules.length){
						// TODO:concat can not update the prjEstRule version
						service.mergePrjEstRule(lookupData.estPrjRules, data.PrjEstRuleToSave);
						// lookupData.estPrjRules = lookupData.estPrjRules.concat(data.PrjEstRuleToSave);
						lookupData.estPrjRules = _.uniqBy(lookupData.estPrjRules, 'Code');
					}else{
						lookupData.estPrjRules =  data.PrjEstRuleToSave;
					}
				}
				let name = postData.currentItemName;
				let filterItems = _.filter(data, function(value, key){
					return key === name+'RuleToSave';
				});
				if(filterItems && filterItems[0]){
					processData(filterItems[0]);
				}
				let list = lookupData[name +'2EstRules'];
				if(_.isArray(list)){
					angular.forEach(filterItems[0], function(item){
						if(item){
							let oldItem = _.find(list, {MainId : item.Id});
							if(oldItem){
								angular.extend(list[list.indexOf(oldItem)], item);
							}else{
								list.push(item);
							}
						}
					});
				}else{
					list = filterItems[0];
				}

				let deletedItems = _.filter(data, function(value, key){
					return key === name+'RuleToDelete';
				});

				let result = _.filter(list, function(li){
					let item = _.find(deletedItems[0], {Id:li.MainId});
					if(!item){
						return li;
					}
				});
				if(deletedItems && deletedItems.length > 0 && deletedItems[0]) {
					service.setRuleToDelete(name+'RuleToDelete',deletedItems[0]);
				}
				lookupData[name +'2EstRules'] = result;
			};

			let deleteRules = {};
			service.setRuleToDelete = function(key,value){
				deleteRules[key] = value;
			};
			service.getRuleToDelete = function(key){
				return deleteRules[key];
			};
			service.clearAllDelete = function(){
				deleteRules = {};
			};
			service.deleteParamByRule = function (option){
				let platformDeleteSelectionDialogService = $injector.get('platformDeleteSelectionDialogService');
				platformDeleteSelectionDialogService.showDialog({
					dontShowAgain: true,
					id: '7a9f7da5c9b44e339d49ba149a905987'
				}).then(result => {
					if (result.ok || result.delete) {
						deleteParamByRule(option);
					}
				});
			};

			function deleteParamByRule(option) {
				let entity = option.entity;
				let currentItemName = option.itemName;
				let structureId = 0;
				let mainServiceName = option.mainServiceName;
				let estLeadingStructureContext = {};
				let prjRuleIds = [];
				let mdcRuleIds = [];
				if (option.ruleToDelete && option.ruleToDelete.length > 0) {
					if (option.isPrjAssembly) {
						prjRuleIds = _.map(option.ruleToDelete, 'PrjEstRuleFk');
					} else {
						mdcRuleIds = _.map(option.ruleToDelete, 'MainId');
					}
				}
				estLeadingStructureContext.EstLeadingStructureId = entity.Id;
				switch (currentItemName) {
					case 'EstAssemblyCat':
						structureId = 16;
						estLeadingStructureContext.EstAssemblyCatFk = entity.Id;
						break;
					case 'EstLineItems':
						structureId = 1001;
						estLeadingStructureContext.EstLineItemFk = entity.Id;
						break;
				}

				let postData = {
					'ProjectId': option.projectId,
					'EstHeaderFk': option.estHeaderFk,
					'SelectedEstLineItemIds': [entity.Id],
					'PrjEstRuleIds': prjRuleIds,
					'PrjEstRules': [],
					'StructureId': structureId,
					'LineItemsSelectedLevel': null,
					'IsLeadingStructure': false,
					'SelectedParams': [],
					'IsRoot': false,
					'IsRemoveRuleParam': false,
					'EstLeadingStructureContext': estLeadingStructureContext,
					'MdcRuleIds': mdcRuleIds
				};

				$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/deleteParamByPrjRule', postData)
					.then(function (response) {
						$injector.get('estimateParameterFormatterService').updateCacheParam(currentItemName, prjRuleIds, entity.Id, !option.isPrjAssembly, response.data);
						$injector.get(mainServiceName).gridRefresh();
						service.clearAllDelete();
					});
			}

			return service;
		}]);
})();
