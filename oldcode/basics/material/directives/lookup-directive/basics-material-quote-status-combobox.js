/**
 * Created by clv on 8/15/2018.
 */
(function(angular){

	'use strict';
	var moduleName = 'basics.material';

	/**
	 * @ngdoc directive
	 * @name procurement.requisition.directive:procurementQuoteStatusCombobox
	 * @element div
	 * @restrict A
	 * @description
	 * Strategy combobox.
	 *
	 */
	angular.module(moduleName).directive('basicsMaterialQuoteStatusCombobox',['BasicsLookupdataLookupDirectiveDefinition', 'platformStatusIconService',
		'_',
		function (BasicsLookupdataLookupDirectiveDefinition, platformStatusIconService,
		          _) {

			var defaults = {
				version:3,
				lookupType: 'QuoteStatus',
				valueMember: 'Id',
				displayMember: 'Description',
				showCustomInputContent: true,
				formatter: function(items, lookupItem, displayValue, lookupConfig){// items =>currentItem.quoteStatus (currently selected)
					var dataView = lookupConfig.dataView;
					//var data = dataView.dataFilter.data;
					var currentStatusIds = [];
					//var statusFormatArr = [];

					if(!dataView.dataCache.isLoaded){
						dataView.loadData('');
						dataView.dataCache.isLoaded = true;
					}

					var selectedItem = _.filter(dataView.dataFilter.data, {Selected: true});
					var formatString = '';
					if(selectedItem && selectedItem.length > 0){
						var item = selectedItem[0];
						var imageUrl = platformStatusIconService.select(item);
						var isCss = platformStatusIconService.hasOwnProperty('isCss')?platformStatusIconService.isCss(): false;
						formatString = (isCss ? '<i class="block-image ' + imageUrl + '"></i>' : '<img src="' + imageUrl + '">') +
                            '<span style="padding-left: .1em;">' + item.Description + '</span>';
						if(selectedItem.length > 1){
							formatString += ' (Mixed)';
						}
					}
					selectedItem.forEach(function(item){
						currentStatusIds.push(item.Id);
					});

					// _.forEach(data, function(item){
					// 	if(item.Selected){
					// 		var imageUrl = platformStatusIconService.select(item);
					// 		var isCss = platformStatusIconService.hasOwnProperty('isCss')?platformStatusIconService.isCss(): false;
					// 		statusFormatArr.push((isCss ? '<i class="block-image ' + imageUrl + '"></i>' : '<img src="' + imageUrl + '">') +
					// 			'<span style="padding-left: .1em;">' + item.Description + '</span>');
					// 		currentStatusIds.push(item.Id);
					// 	}
					// });
					dataView.scope.$parent.$parent.currentItem.quoteStatus = angular.copy(currentStatusIds);
					//return statusFormatArr.join(',');
					return formatString;
				},
				columns: [
					{ id: 'selected', field: 'Selected', name: 'Selected', width: 50, formatter: 'boolean', editor: 'boolean', headerChkbox: false},
					{ id: 'description',
						field: 'Description',
						name: 'Description',
						width: 100,
						name$tr$: 'cloud.common.entityDescription',
						formatter: function(row,cell, value,columndef,dataContext){
							var imageUrl = platformStatusIconService.select(dataContext);
							var isCss = platformStatusIconService.hasOwnProperty('isCss')?platformStatusIconService.isCss(): false;
							return (isCss ? '<i class="block-image ' + imageUrl + '"></i>' : '<img src="' + imageUrl + '">') +
								'<span class="pane-l">' + value + '</span>';
						}
					}
				],
				selectableCallback: function(){
					return false;
				},
				uuid: '9981284d02ee4ed0b188f4befacdc6c1'
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