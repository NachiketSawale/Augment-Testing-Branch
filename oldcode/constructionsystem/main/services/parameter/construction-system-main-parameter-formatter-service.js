/**
 * Created by xsi on 2016-10-09.
 */
/* global _,globals */
(function () {
	'use strict';
	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).factory('constructionSystemMainParameterFormatterService', ['$http', '$q', 'constructionSystemMainParamUpdateService',
		function ( $http, $q, constructionSystemMainParamUpdateService) {

			// Object presenting the service
			var service = {},
				// eslint-disable-next-line no-unused-vars
				projectId = 0,
				itemName = [],
				lookupData = {
					estParams : []
				},
				postData = {
					estHeaderFk : 0,
					itemName: []
				};

			service.isCss = function(){return true;};

			// set selected Estimate Header and ProjectId for selected Item
			service.setSelectedEstHeaderNProject = function setSelectedEstHeaderNProject(headerId, prjId){
				projectId = prjId;
				if(postData.estHeaderFk !== headerId){
					postData.estHeaderFk = headerId;
					var estParams = angular.copy(lookupData.estParams);
					lookupData = {};
					lookupData.estParams = estParams;
				}
			};

			// get complete lookup
			var getCompleteLookup = function getgetCompleteLookup(){
				return {
					'estParams' : $http.get(globals.webApiBaseUrl + 'basics/customize/estparameter/list')
				};
			};

			// merge required options
			/* jshint -W074 */ //
			var mergeOptions = function mergeOptions(options, item){
				options.validItemName = item.IsRoot ? 'EstHeader' : options.itemName;

				if(!_.find(itemName, {name:options.validItemName})){
					itemName.push({'name':options.validItemName});
				}
				postData.id = item.IsRoot ? item.EstHeaderFk : item.Id;
				postData.currentItemName = options.validItemName;
				postData.headerKey = '';

				if(item.IsRoot){
					postData.filterKey = 'EstHeaderFk';
				}else{
					switch (options.itemServiceName){
						case'estimateMainRootService':
							postData.filterKey = 'EstHeaderFk';
							break;
						case'estimateMainService':
							postData.filterKey = 'EstLineItemFk';
							break;
						case'constructionSystemMainBoqService':
							postData.boqHeaderFk = item.BoqHeaderFk;
							postData.filterKey = 'BoqItemFk';
							postData.headerKey = 'BoqHeaderFk';
							break;
						case'constructionSystemMainLocationService':
							postData.filterKey = 'PrjLocationFk';
							break;
						case'constructionSystemMainControllingService':
							postData.filterKey = 'MdcControllingUnitFk';
							break;
					}
				}

				return postData;
			};

			// get list of filtered Params by item Id
			var getParamsById = function getParamsById(opt) {
				var key = opt.filterKey,
					value = opt.id,
					headerKey = opt.headerKey,
					headerValue = opt.boqHeaderFk,
					currentItemName = opt.currentItemName;

				var itemParams = _.filter(lookupData[currentItemName+'Param'], function(item){
					return item[key] === value;
				});

				if(headerKey){
					itemParams = _.filter(itemParams, function(item){
						return item[headerKey] === headerValue;
					});
				}
				return _.map(itemParams, 'Code');
			};

			// get list of filtered Params including saved and deleted items
			var getFilteredParams = function getFilteredParams(list, item) {
				list = list ? list : [];
				var itemId = item.IsRoot ? item.EstHeaderFk : item.Id;
				var paramToSave = _.filter(constructionSystemMainParamUpdateService.getParamToSave(), function(prm){
					return prm[postData.filterKey] === itemId;
				});
				list = list.concat(paramToSave);
				var delItems = _.filter(constructionSystemMainParamUpdateService.getParamToDelete(), function(prm){
					return prm[postData.filterKey] === itemId;
				});
				if(delItems.length){
					list =  _.filter(list, function(li){
						return  delItems.indexOf(_.find(delItems, {MainId : li.MainId})) === -1;
					});
				}
				return _.uniq(list, 'MainId');
			};

			// get list of the estimate Parameter Code by Id
			service.getItemById = function getItemById(value) {
				var iconItem = {};
				if(_.isString(value) && value === 'default'){
					iconItem = {css: true, res: 'tlb-icons ico-menu', text: ''};
				}else{
					iconItem = {css: true, res: 'control-icons ico-parameter', text: ''};
				}
				return iconItem;
			};

			// get list of the estimate Parameter Code by Id
			service.getItemParamById = function getItemParamById(value, options, item) {
				mergeOptions(options, item);
				var paramCodes = _.isArray(value) && value.length ? value : getParamsById(postData);
				var filterId = item.IsRoot ? item.EstHeaderFk : item.Id;
				var paramToSave = _.filter(constructionSystemMainParamUpdateService.getParamToSave(), function(prm){
					if(prm[postData.filterKey] === filterId){
						return prm.Code;
					}
				});
				paramCodes = paramCodes.concat(paramToSave);

				var delItems = _.filter(constructionSystemMainParamUpdateService.getParamToDelete(), function(prm){
					return prm[postData.filterKey] === filterId;
				});
				var paramToDelete = _.map(delItems, 'Code');
				if(paramToDelete.length){
					paramCodes =  _.filter(paramCodes, function(li){
						return  paramToDelete.indexOf(li) === -1;
					});
				}
				item.Param = _.uniq(paramCodes);
				return item.Param;
			};

			// get list of the estimate Param items by code(for immediate window)
			service.getItemsByParam = function getItemsByParam(mainItem, opt) {
				var items = [];
				var value;
				mergeOptions(opt, mainItem);
				var list =lookupData[postData.currentItemName+'Param'];
				var itemId = mainItem.IsRoot ? mainItem.EstHeaderFk : mainItem.Id;
				var filteredItems = _.filter(list, function(item){
					return item[postData.filterKey] === itemId;
				});
				if(postData.headerKey){
					filteredItems = _.filter(filteredItems, function(item){
						return item[postData.headerKey] === mainItem[postData.headerKey];
					});
				}
				list = getFilteredParams(filteredItems, mainItem);

				mainItem.Param = _.map(list, 'Code');
				value = mainItem.Param;
				if(list && list.length>0){
					angular.forEach(value, function(val){
						var item = _.find(list, {'Code':val});
						if(item){
							items.push(item);
						}
					});
				}
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

			// get list of Parameters Lookup Items
			service.getLookupList = function(itemName){
				if(itemName){
					return lookupData[itemName + 'Param'];
				}
			};

			// process Rules Items
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

			// load Parameter Data as per item
			function loadItemData(name){
				if(name){
					var data = angular.copy(postData);
					data.itemName = [name];
					return $http.post(globals.webApiBaseUrl + 'estimate/parameter/lookup/list', data).then(function(response){
						processData(response.data);
						return response.data;
					});
				}else{
					return $q.when([]);
				}
			}

			// get param from list of the Parameters
			var getParam = function getParam (params){
				return params && params.length ?  params[0] : 'default';
			};

			// get list of the Parameters as per item async
			var getListAsync = function getListAsync (item, options){
				mergeOptions(options, item);
				var value = item.Param;
				if((lookupData[options.validItemName+'Param'] && lookupData[options.validItemName+'Param'].length) || lookupData[options.validItemName  + 'Loaded']) {
					var params = service.getItemParamById(value, options, item);
					return $q.when(getParam (params));
				} else {
					if(!lookupData[options.validItemName +'Promise']) {
						lookupData[options.validItemName +'Promise'] = loadItemData(options.validItemName);
					}
					return lookupData[ options.validItemName +'Promise'].then(function(data){
						lookupData[ options.validItemName +'Promise'] = null;
						lookupData[options.validItemName  + 'Loaded'] = true;
						angular.extend(lookupData, data);
						var params = service.getItemParamById(value, options, item);
						return getParam (params);
					});
				}
			};

			// get list of the estimate Parameter Code item by Id Async
			service.getItemByParamAsync = function getItemByParamAsync(item, options) {
				if(!item){
					return;
				}
				// load est param
				if(lookupData.estParams && lookupData.estParams.length){
					return $q.when(getListAsync(item, options));
				}else{
					if(!lookupData.estParamPromise) {
						lookupData.estParamPromise = getCompleteLookup().estParams;
					}
					return lookupData.estParamPromise.then(function(response){
						lookupData.estParamPromise = null;
						lookupData.estParams = response.data;
						return $q.when(getListAsync(item, options));
					});
				}
			};

			// merge item after update
			service.handleUpdateDone = function(data){
				var name = postData.currentItemName;
				var filterItems = _.filter(data, function(value, key){
					return key === name+'ParamToSave';
				});

				var list = lookupData[name +'Param'];

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
					return key === name+'ParamToDelete';
				});

				lookupData[name +'Param'] =  _.filter(list, function(li){
					var item = _.find(deletedItems[0], {Id:li.MainId});
					if(!item){
						return li;
					}
				});
			};

			// merge parameters
			service.mergeParams = function mergeParams(result){
				processData(result);
				angular.extend(lookupData, result);
			};

			service.updateParamData=function(updateData){
				var url=globals.webApiBaseUrl + 'estimate/main/lineitem/update';
				$http.post(url,updateData).then(function(response){
					service.handleUpdateDone(response.data);
					service.clear();
					constructionSystemMainParamUpdateService.clear();
				});
			};

			// clear lookup data
			service.clear = function clear(){
				lookupData = {};
			};

			return service;
		}]);
})();
