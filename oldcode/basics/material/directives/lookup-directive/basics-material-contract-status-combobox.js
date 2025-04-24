/**
 * Created by clv on 8/15/2018.
 */
(function(angular){

	'use strict';
	var moduleName = 'basics.material';

	angular.module(moduleName).directive('basicsMaterialContractStatusCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		'platformStatusIconService','_',
		function(BasicsLookupdataLookupDirectiveDefinition,
		         platformStatusIconService, _){

			var defaults = {
				lookupType: 'ConStatus',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				showCustomInputContent: true,
				formatter: function(items, lookupItem, displayValue, lookupConfig){// items =>currentItem.quoteStatus (currently selected)
					var dataView = lookupConfig.dataView;
					if(!dataView.dataCache.isLoaded){
						dataView.loadData('');
						dataView.dataCache.isLoaded = true;
					}
					//var data = dataView.dataFilter.data;
					var currentStatusIds = [];
					//var statusFormatArr = [];
					var selectedItem = _.filter(dataView.dataFilter.data, {Selected: true});
					var formatString = '';
					if(selectedItem && selectedItem.length > 0){
						var item = selectedItem[0];
						var imageUrl = platformStatusIconService.select(item);
						var isCss = platformStatusIconService.hasOwnProperty('isCss')?platformStatusIconService.isCss(): false;
						formatString = (isCss ? '<i class="block-image ' + imageUrl + '"></i>' : '<img src="' + imageUrl + '">') +
                            '<span style="padding-left: .1em;">' + item.DescriptionInfo.Description + '</span>';
						if(selectedItem.length > 1){
							formatString += ' (Mixed)';
						}
					}
					selectedItem.forEach(function(item){
						currentStatusIds.push(item.Id);
					});

					// _.forEach(data, function(item){
					// 	if(item.Selected){
					// 		currentStatusIds.push(item.Id);
					// 		var imageUrl = platformStatusIconService.select(item);
					// 		var isCss = platformStatusIconService.hasOwnProperty('isCss')?platformStatusIconService.isCss(): false;
					// 		statusFormatArr.push((isCss ? '<i class="block-image ' + imageUrl + '"></i>' : '<img src="' + imageUrl + '">') +
					// 			'<span style="padding-left: .1em;">' + item.DescriptionInfo.Description + '</span>');
					// 	}
					// });

					dataView.scope.$parent.$parent.currentItem.contractStatus = angular.copy(currentStatusIds);
					//return  statusFormatArr.join(',');
					return formatString;
				},
				columns: [
					{ id: 'selected', field: 'Selected', name: 'Selected', width: 50, formatter: 'boolean', editor: 'boolean', headerChkbox: false
					},
					{ id: 'description',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						width: 100,
						name$tr$: 'cloud.common.entityDescription',
						formatter: function(row,cell, value,columndef,dataContext){
							var imageUrl = platformStatusIconService.select(dataContext);
							var isCss = platformStatusIconService.hasOwnProperty('isCss')?platformStatusIconService.isCss(): false;
							return (isCss ? '<i class="block-image ' + imageUrl + '"></i>' : '<img src="' + imageUrl + '">') +
								'<span class="pane-r">' + value + '</span>';
						}
					}
				],
				selectableCallback: function(){
					return false;
				},
				uuid: 'c8824a7010994861a7e946bcfa5d2fbf'
			};
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults,
				{
					processData: function (itemList) {
						if(itemList && itemList.length > 0){
							_.forEach(itemList, function(item){
								item.Selected = true;
							});
						}
						return itemList;
					}
				});
		}]);
})(angular);