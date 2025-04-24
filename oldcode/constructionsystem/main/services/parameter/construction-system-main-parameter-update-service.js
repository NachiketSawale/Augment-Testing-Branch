/**
 * Created by xsi on 2016-10-09.
 */
/* global _ */
(function (angular) {

	'use strict';
	var moduleName = 'constructionsystem.main';
	/**
	 * @ngdoc service
	 * @name estimateParamUpdateService
	 * @description provides parameters to create, save or delete for the line items and all fiter structures
	 */
	angular.module(moduleName).factory('constructionSystemMainParamUpdateService', [
		function () {
			var service = {},
				paramToSave = [],
				paramToDelete = [],
				prjParamToSave = [],
				modifiedRules = [];

			service.setParamToSave = function setParamToSave(params, destItem, serviceName, itemName) {
				if(_.isArray(params)){
					angular.forEach(params, function(param){
						if(param){
							if(destItem && _.isArray(destItem.Param) && destItem.Param.indexOf(param.Id) !== -1){return;}
							prjParamToSave.push(param);
							setParamItem(param, destItem, serviceName, itemName, 'ToSave');
						}
					});
				}
			};

			/* jshint -W074 */ // not complex.
			var setParamItem = function setParamItem(item, destItem, serviceName, itemName, action){
				item.Action = action;
				item.ItemName = destItem.IsRoot ? 'EstHeader' : itemName;
				item.EstParameterGroupFk = item.ParametergroupFk ? item.ParametergroupFk:item.EstParameterGroupFk;
				var itemId = destItem.IsRoot ? destItem.EstHeaderFk : destItem.Id;
				itemId = _.isString(itemId) ? itemId.replace('schedule', ''): itemId;
				if(destItem.IsRoot){
					item.EstHeaderFk = itemId;
				}else{
					switch (serviceName){
						case'estimateMainRootService':
							item.EstHeaderFk= itemId;
							break;
						case'estimateMainService':
							item.EstLineItemFk = itemId;
							break;
						case'constructionSystemMainBoqService':
							item.BoqItemFk = itemId;
							item.BoqHeaderFk = destItem.BoqHeaderFk;
							break;
						case'constructionSystemMainLocationService':
							item.PrjLocationFk = itemId;
							break;
						case'constructionSystemMainControllingService':
							item.MdcControllingUnitFk = itemId;
							break;
					}
				}
				paramToSave.push(item);
			};

			service.updateParamToSave = function updateParamToSave(updateData, estHeaderId) {
				angular.forEach(paramToSave, function(item){
					if(item){
						if(!_.isArray(updateData[item.ItemName + 'Param'+ item.Action])){
							updateData[item.ItemName + 'Param'+ item.Action] = [];
						}
						item.EstHeaderFk = estHeaderId;
						item.Id = item.MainId >= 0 ? item.MainId : item.Id;
						var data = updateData[item.ItemName + 'Param'+ item.Action];
						if(!data.length || data.indexOf(item) === -1){
							updateData[item.ItemName + 'Param'+ item.Action].push(item);
						}
						updateData.EntitiesCount += 1;
					}
				});
				return updateData;
			};

			service.getParamToSave = function getParamToSave() {
				return _.filter(paramToSave, {Action:'ToSave'});
			};

			service.getParamToDelete = function getParamToDelete() {
				return paramToDelete;
			};

			service.setParamToDelete = function setParamToDelete(params, destItem, serviceName, itemName) {
				if(_.isArray(params)){
					angular.forEach(params, function(param){
						if(param){
							setParamItem(param, destItem, serviceName, itemName, 'ToDelete');
							paramToDelete.push(param);
						}
					});
				}
			};

			service.markParamAsModified = function markParamAsModified(param, destItem, serviceName, itemName, list) {
				if(param){
					modifiedRules = modifiedRules.concat([param]);
					var item = _.find(list, {Id : param.Id});
					if(item){
						angular.extend(item, param);
						service.setParamToSave([param], destItem, serviceName, itemName);
					}
				}
			};

			service.clear = function clear() {
				paramToSave = [];
				prjParamToSave = [];
				paramToDelete = [];
			};

			return service;
		}
	]);

})(angular);