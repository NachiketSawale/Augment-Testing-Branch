(function (angular) {
	/*global angular,_,globals*/
	'use strict';
	var moduleName = 'basics.riskregister';
	angular.module(moduleName).service('basicsRiskRegisterDependencyFormatterService', [
		'$http','$q','basicsRiskRegisterDependencyUpdateService',
		'cloudCommonGridService',
		function ($http, $q, basicsRiskRegisterDependencyUpdateService,
		          cloudCommonGridService) {
			// Object presenting the service
			var service = {},
				riskEventId = 0,
				itemName = [],
				lookupData = {
					basDependency : []
				},
				postData = {
					basImpactFk : 0,
					itemName: []
				};

			var backupLookupData = lookupData;
			var isRestoreLookupData = false;

			service.isCss = function(){return true;};

			service.refresh = function(){
				lookupData = {};
				lookupData.basicsRiskItems = [];
			};

			//get complete lookup
			var getCompleteLookup = function getgetCompleteLookup(){
				return {
					'basicsRiskItems': $http.post(globals.webApiBaseUrl + 'basics/riskregister/dependencies/list')
				};
			};

			service.setSelectedEvent = function setSelectedEvent(eventId) {
				if(riskEventId !== eventId){
					lookupData.basRiskEventFk = postData.basRiskEventFk = riskEventId = eventId;
				}
			};

			var getEventId = function getEventId(){
				return riskEventId;
			};

			var getFilteredDepens = function getFilteredDepens(list, item) {
				list = list ? list : [];
				var itemId =  item.Id;
				var depenToSave = _.filter(basicsRiskRegisterDependencyUpdateService.getDepenToSave(), function(prm){
					return prm[postData.filterKey] === itemId;
				});
				list = list.concat(depenToSave);
				var delItems = _.filter(basicsRiskRegisterDependencyUpdateService.getDepenToDelete(), function(prm){
					return prm[postData.filterKey] === itemId;
				});
				if(delItems.length){
					list =  _.filter(list, function(li){
						return  delItems.indexOf(_.find(delItems, {MainId : li.MainId})) === -1;
					});
				}
				return _.uniq(list, 'MainId');
			};

			function processData (data){
				if(!data){return;}

				var processItems = function(items){
					angular.forEach(items, function(item){
						if(!_.isObject(item)){return;}
						item.MainId = angular.copy(item.Id);
					});
				};
				if(_.isArray(data)){
					processItems(data);
				}else if(_.isObject(data)){
					_.each(data, function(items, key){
						if(key !== 'itemName'){
							processItems(items);
						}
					});
				}
			}

			//merge required options
			/* jshint -W074 */ //
			var mergeOptions = function mergeOptions(options, item){
				options.validItemName = 'RiskEvents';

				if(!_.find(itemName, {name:options.validItemName})){
					itemName.push({'name':options.validItemName});
				}
				postData.id =  item.Id;
				postData.currentItemName = options.validItemName;
				postData.headerKey = '';
				postData.filterKey = 'RiskEventFk';


				return postData;
			};

			//load Parameter Data as per item
			function loadItemData(name){
				if(name){
					var data = angular.copy(postData);
					data.itemName = [name];
					return $http.post(globals.webApiBaseUrl + '"basics/riskregister/dependencies/lookup/list', data).then(function(response){
						processData(response.data);

						lookupData[name+'Dependency'] = response.data;
						backupLookupData = lookupData;
						return response.data;
					});
				}else{
					return $q.when([]);
				}
			}

			//get param from list of the Parameters
			var getDependency = function getDependency (params){
				var tempparam={ params:params};
				return params && params.length ?  tempparam: 'default';
			};

			service.processData = processData;

			service.handleUpdateDone = function(data){
				var name = postData.currentItemName = 'RiskEvents';
				var filterItems = _.filter(data, function(value, key){
					return key === name+'DependencyToSave';
				});

				if(isRestoreLookupData){
					lookupData = backupLookupData;
				}

				var list = lookupData[name +'Dependency'];

				if(filterItems && filterItems[0]){
					processData(filterItems[0]);
				}

				if(_.isArray(list)){
					angular.forEach(filterItems[0], function(item){
						if(item){
							var oldItem = _.find(list, {MainId : item.Id});

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

				var deletedItems = _.filter(data, function(value, key){
					return key === name+'DepenToDelete';
				});

				var result;
				result = _.filter(list, function (li) {
					var item = _.find(deletedItems[0], {Id: li.MainId});

					if (!item) {
						return li;
					}
				});

				lookupData[name +'Dependency'] = result;
				lookupData[name+'DepensNotDeleted'] = data.DepensNotDeleted && data.DepensNotDeleted.length ? data.DepensNotDeleted : [];
				return lookupData[name +'Dependency'];
			};

			var getDependenciesById = function getDependenciesById(opt) {
				var key = opt.filterKey,
					value = opt.id,
					basImpactFk = opt.basImpactFk,
					riskEventFk = opt.riskEventFk,
					currentItemName = opt.currentItemName;

				return   _.filter(lookupData[currentItemName + 'Dependency'], function (item) {
					return (item[key] === value && item.Action !== 'ToDelete');
				});
			};

			service.getItemDependencyById = function getItemDependencyById(value,options, item) {
				mergeOptions(options, item);

				if(!value){return;}
				var items = [];
				var list = lookupData.basicsRiskItems;
				if(list && list.length>0){
					var output = [];
					list = cloudCommonGridService.flatten(list, output, 'RiskEvents');
					for (var i = 0; i < list.length; i++) {
						for (var j = 0; j < value.length; j++) {
							if (list[i].Code === value[j].Code) {
								items.push(list[i]);
								break;
							}
						}
					}
				}
				items = _.sortBy(items, ['Code']);
				return _.uniq(items, 'Code');
			};

			service.getItemsByDepen = function getItemsByDepen(mainItem, opt) {
				var items = [];
				var value = [];
				mergeOptions(opt, mainItem);
				var list =lookupData[postData.currentItemName+'Dependency'];
				/*var itemId = mainItem ? mainItem.RiskEventFk : mainItem.Id;
				var filteredItems = _.filter(list, function(item){
					return item[postData.filterKey] === itemId;
				});
				if(postData.headerKey){
					filteredItems = _.filter(filteredItems, function(item){
						return item[postData.headerKey] === mainItem[postData.headerKey];
					});
				}
				list = getFilteredDepens(filteredItems, mainItem);*/

				//here I think it make problem, the new item with the same code will be filtered
				mainItem.RiskDependencies = _.map(list, 'RiskEventFk');

				value = mainItem.RiskDependencies;

				items =list;
				var cnt = 0;
				var newItemsIndex = _.map( _.filter(items, {Version : 0}), 'Id');
				angular.forEach(items, function(item){
					cnt++;
					if(item && item.Version !== 0){
						while(newItemsIndex.length && newItemsIndex.indexOf(cnt) !== -1){
							cnt++;
						}
						item.Id = cnt;
					}
				});

				return _.uniq(items, 'Id');
			};

			//clear lookup data
			service.clear = function clear(){
				backupLookupData = lookupData;
				lookupData = {};
			};

			service.getDepenNotDeleted = function (itemName) {
				return lookupData[itemName+'DepensNotDeleted'];
			};

			service.clearDepenNotDeleted = function (itemName) {
				lookupData[itemName+'DepensNotDeleted'] = [];
			};

			service.isRestoreParam = function (isRestore){
				isRestoreLookupData = isRestore;
			};

			service.getItemByDependencyAsync = function getItemByDependencyAsync(item, options) {
				if(!item){
					return;
				}
				//load est param
				if(lookupData.basDependency && lookupData.basDependency.length){
					return $q.when(getListAsync(item, options));
				}else{
					if(!lookupData.basDependencyPromise) {
						lookupData.basDependencyPromise = getCompleteLookup().basicsRiskItems;
					}
					return lookupData.basDependencyPromise.then(function(response){
						lookupData.basDependencyPromise = null;
						_.forEach(response.data,function(pitem){
							pitem.ValueType = pitem.ParamvaluetypeFk;
						});
						lookupData.basDependency = response.data;
						return $q.when(getListAsync(item, options));
					});
				}
			};

			//get list of the Parameters as per item async
			var getListAsync = function getListAsync (item, options){
				mergeOptions(options, item);
				var value = item.Dependency;
				if((lookupData[options.validItemName+'Dependency'] && lookupData[options.validItemName+'Dependency'].length) || lookupData[options.validItemName  + 'Loaded']) {
					var params = service.getItemById(value, options, item);
					return $q.when(getDependency(params));
				} else {
					if(!lookupData[options.validItemName +'Promise']) {
						lookupData[options.validItemName +'Promise'] = loadItemData(options.validItemName);
					}
					return lookupData[ options.validItemName +'Promise'].then(function(data){
						lookupData[ options.validItemName +'Promise'] = null;
						lookupData[options.validItemName  + 'Loaded'] = true;
						angular.extend(lookupData, data);
						var params = service.getItemById(value, options, item);
						return getDependency (params);
					});
				}
			};
			return service;
		}
	]);
})(angular);
