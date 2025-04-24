(function (angular) {

	'use strict';
	let moduleName = 'businesspartner.main';
	let dialogId = '000af9b0abd14af8b594f45800ae99de';

	angular.module(moduleName).directive('businessPartnerBusinessStatusCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		'platformStatusIconService', '_', '$injector', 'dialogUserSettingService',
		function (BasicsLookupdataLookupDirectiveDefinition,
		   platformStatusIconService, _, $injector, dialogUserSettingService) {
			let isApprovedBP = null;

			let defaults = {
				version: 3,
				lookupType: 'BusinessPartnerStatus',
				valueMember: 'Id',
				displayMember: 'Description',
				showCustomInputContent: true,
				filterOptions: {
					serverSide: false,
					fn: function (item) {
						return isApprovedBP ? item.IsApproved : item.Id > 0;
					}
				},
				formatter: function (items, lookupItem, displayValue, lookupConfig) {// items =>currentItem.quoteStatus (currently selected)
					let dataView = lookupConfig.dataView;
					if (!dataView.dataCache.isLoaded) {
						dataView.loadData('');
						dataView.dataCache.isLoaded = true;
					}

					let data = dataView.dataFilter.data; // get the cacheData
					isApprovedBP = dataView.scope.$parent.$parent.businesspartnerstatus.isApprovedBP;

					let currentStatusIds = [];
					let selectedItem = _.filter(data, {Selected: true});

					let formatString = '';
					if (selectedItem && selectedItem.length > 0) {
						let item = selectedItem[0];
						let imageUrl = platformStatusIconService.select(item);
						let isCss = Object.hasOwn(platformStatusIconService, 'isCss') ? platformStatusIconService.isCss() : false;
						formatString = (isCss ? '<i class="block-image ' + imageUrl + '"></i>' : '<img src="' + imageUrl + '">') +
						   '<span style="padding-left: .1em;">' + item.Description + '</span>';
						if (selectedItem.length > 1) {
							formatString += ' (Mixed)';
						}
					}
					selectedItem.forEach(function (item) {
						currentStatusIds.push(item.Id);
					});

					dataView.scope.$parent.$parent.businesspartnerstatus.selectedItemsFk  = angular.copy(currentStatusIds);
					return formatString;
				},
				columns: [
					{
						id: 'selected',
						field: 'Selected',
						name: 'Selected',
						width: 50,
						formatter: 'boolean',
						editor: 'boolean',
						headerChkbox: false
					},
					{
						id: 'description',
						field: 'Description',
						name: 'Description',
						width: 100,
						name$tr$: 'cloud.common.entityDescription',
						formatter: function (row, cell, value, columndef, dataContext) {
							let imageUrl = platformStatusIconService.select(dataContext);
							let isCss = Object.hasOwn(platformStatusIconService, 'isCss') ? platformStatusIconService.isCss() : false;
							return (isCss ? '<i class="block-image ' + imageUrl + '"></i>' : '<img src="' + imageUrl + '">') +
							   '<span class="pane-r">' + value + '</span>';
						}
					}
				],
				selectableCallback: function () {
					return false;
				},
				uuid: 'A8E89F7889EC4E6EBD414C4B8B5B26EF'
			};
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults,
			   {
				   processData: function (itemList) {
					   const savedItemsFk = dialogUserSettingService.getCustomConfig(dialogId, 'BpStatusSelItemFk');
					   _.forEach(itemList, function (item) {
						   item.Selected = false;
					   });

					   if (savedItemsFk && savedItemsFk.length > 0) {
						   const selectedIds = new Set(savedItemsFk);
						   const shouldIncludeApprovalStatus = isApprovedBP && itemList.some(item => item.IsApproved);
						   _.forEach(itemList, item => {
							   item.Selected = shouldIncludeApprovalStatus ? item.IsApproved && selectedIds.has(item.Id) : selectedIds.has(item.Id);
						   });
					   }
					   return itemList;
				   }
			   });
		}]);

	angular.module(moduleName).directive('businessPartnerBusinessStatus2Combobox', ['BasicsLookupdataLookupDirectiveDefinition',
		'platformStatusIconService', '_', '$injector', 'dialogUserSettingService',
		function (BasicsLookupdataLookupDirectiveDefinition,
		   platformStatusIconService, _, $injector, dialogUserSettingService) {
			let defaults = {
				version: 3,
				lookupType: 'BusinessPartnerStatus2',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				showCustomInputContent: true,
				formatter: function (items, lookupItem, displayValue, lookupConfig) {// items =>currentItem.quoteStatus (currently selected)
					let dataView = lookupConfig.dataView;
					if (!dataView.dataCache.isLoaded) {
						dataView.loadData('');
						dataView.dataCache.isLoaded = true;
					}

					let data = dataView.dataFilter.data; // get the cacheData
					let currentStatusIds = [];
					// let statusFormatArr = [];
					let selectedItem = _.filter(data, {Selected: true});

					let formatString = '';
					if (selectedItem && selectedItem.length > 0) {
						let item = selectedItem[0];
						let imageUrl = platformStatusIconService.select(item);
						let isCss = Object.hasOwn(platformStatusIconService, 'isCss') ? platformStatusIconService.isCss() : false;
						formatString = (isCss ? '<i class="block-image ' + imageUrl + '"></i>' : '<img src="' + imageUrl + '">') +
						   '<span style="padding-left: .1em;">' + item.DescriptionInfo.Description + '</span>';
						if (selectedItem.length > 1) {
							formatString += ' (Mixed)';
						}
					}
					selectedItem.forEach(function (item) {
						currentStatusIds.push(item.Id);
					});
					dataView.scope.$parent.$parent.businesspartnerstatus2.selectedItemsFk = angular.copy(currentStatusIds);
					return formatString;
				},
				columns: [
					{
						id: 'selected',
						field: 'Selected',
						name: 'Selected',
						width: 50,
						formatter: 'boolean',
						editor: 'boolean',
						headerChkbox: false
					},
					{
						id: 'description',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						width: 100,
						name$tr$: 'cloud.common.entityDescription',
						formatter: function (row, cell, value, columndef, dataContext) {
							let imageUrl = platformStatusIconService.select(dataContext);
							let isCss = Object.hasOwn(platformStatusIconService, 'isCss') ? platformStatusIconService.isCss() : false;
							return (isCss ? '<i class="block-image ' + imageUrl + '"></i>' : '<img src="' + imageUrl + '">') +
							   '<span class="pane-r">' + value + '</span>';
						}
					}
				],
				selectableCallback: function () {
					return false;
				},
				uuid: 'DD91CFF8C59E42D5B835EBCE1CB29233'
			};
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults,
			   {
				   processData: function (itemList) {
					   const savedItems2Fk = dialogUserSettingService.getCustomConfig(dialogId, 'BpStatus2SelItemFk');
					   _.forEach(itemList, function (item) {
						   item.Selected = false;
					   });

					   if (savedItems2Fk && savedItems2Fk.length > 0) {
						   const selectedIds = new Set(savedItems2Fk);
						   _.forEach(itemList, function (item) {
							   item.Selected = selectedIds.has(item.Id);
						   });
					   }
					   return itemList;
				   }
			   });
		}]);
})(angular);