/**
 * Created by clv on 8/16/2018.
 */
(function(angular){

	'use strict';
	var moduleName = 'basics.material';

	angular.module(moduleName).directive('basicsMaterialMaterialGroupCombobox',['BasicsLookupdataLookupDirectiveDefinition',
		'basicsMaterialMaterialCatalogService', 'platformGridAPI', '_',
		function(BasicsLookupdataLookupDirectiveDefinition,  basicsMaterialMaterialCatalogService, platformGridAPI, _){

			var uuid = '376ede650f244a298c9563e84d290ca8';
			var defaults = {
				lookupType: 'materialGroup',
				valueMember: 'Id',
				displayMember: 'Code',
				showCustomInputContent: true,
				//version: 2,
				formatter: formatter,
				columns: [
					{
						id: 'selected',
						field: 'Selected',
						name: 'Selected',
						name$tr$: 'basics.import.entitySelected',
						width: 50,
						formatter: 'boolean',
						editor: 'boolean',
						headerChkbox: false,
						validator: validator
					},
					{ id: 'code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode',formatter: 'Code', width: 50},
					{ id: 'description',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						width: 100,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				treeOptions: {
					parentProp: 'MaterialGroupFk',
					childProp: 'ChildItems',
					initialState: 'collapse',
					inlineFilters: true,
					hierarchyEnabled: true
				},
				filterOptions:{
					serverKey: 'update-material-price-material-group-filter',
					serverSide: true,
					fn: function(){
						var catalog = basicsMaterialMaterialCatalogService.getSelected();
						if(catalog){
							return 'MaterialCatalogFk=' + catalog.Id;
						}
						return 'MaterialCatalogFk=0';
					}
				},
				uuid: uuid
			};

			function formatter(item,lookupItem,displayValue,lookupConfig){

				var dataView = lookupConfig.dataView;
				var data = dataView.dataFilter.data; // get the cacheData

				var flatten = function flatten(list){ // flatten cacheData

					var temp = angular.copy(list);
					var result = [];
					var unshiftItem = function(item){temp.unshift(item);};

					while(temp.length > 0){
						var obj = temp.shift();
						var child = obj.ChildItems;
						result.push(obj);
						if(child && child.length > 0){
							child = angular.copy(child).reverse(); // keep the order in ui.
							child.forEach(unshiftItem);
						}
					}
					return result;
				};
				var flattenItems = flatten(data);
				var currentGroups = _.filter(flattenItems,function(item){

					if(item.Selected){ //find Selected is true.
						return true;
					}
					return false;
				});

				var groupFormatArr =  currentGroups.map(function(item){return item.Code;});
				dataView.scope.$parent.$parent.currentItem.materialGroupIds = currentGroups.map(function(item){ return item.Id;});
				return '<span>' + groupFormatArr.join(' ,') + '</span>';
			}
			function validator(entity, value){

				var checkChildren = function checkChildren(item, flg) {
					if (item.ChildItems && item.ChildItems.length > 0) {
						for (var i = 0; i < item.ChildItems.length; i++) {
							checkChildren(item.ChildItems[i], flg);
						}
					}
					item.Selected = flg;
				};
				checkChildren(entity, value);
				platformGridAPI.grids.invalidate(uuid);
				return {apply: true, valid: true, error: ''};
			}

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults,
				{
					processData: function (itemList) {

						if (!itemList || itemList.length < 1) {
							return;
						}
						var newList = [];
						//move root item away, cause root item belong to material_catalog from server end.
						var childProp = defaults.treeOptions.childProp;
						itemList.forEach(function (item) {
							if (item[childProp]) {
								newList = newList.concat(item[childProp]);
							}
						});
						return newList;
					},
					controller: ['$scope', function($scope){
						$scope.$on('$destroy', function(){
							if($scope.lookupOptions && angular.isFunction($scope.lookupOptions.dataView.invalidateData)){
								if($scope.lookupOptions.dataView.dataCache)
								{
									var dataCache = $scope.lookupOptions.dataView.dataCache.data;
									setSelectedToFalse(dataCache);
								}
								//$scope.lookupOptions.dataView.invalidateData();
							}
						});
					}]
				 }
			);

			function setSelectedToFalse(list){
				_.forEach(list, function(item){
					item.Selected = false;
					if(item.ChildItems && item.ChildItems.length > 0){
						setSelectedToFalse(item.ChildItems);
					}
				});
			}
		}]);
})(angular);