(function (angular) {
	'use strict';
	/*global _*/

	var moduleName = 'productionplanning.common';
	var angModule = angular.module(moduleName);
	angModule.service('ppsCommonGotoTabsExtension', [
		'mainViewService', '$translate',
		'$state', 'cloudDesktopSidebarService',
		'cloudCommonGridService',
		function (mainViewService, $translate,
					 $state, cloudDesktopSidebarService,
			cloudCommonGridService) {
			this.createBtn = function (service, moduleName) {
				var tabs = mainViewService.getTabs();
				var btn = {
					id: 'newpagetotab',
					caption: $translate.instant('productionplanning.common.newPageForTab'),
					type: 'dropdown-btn',
					iconClass: 'tlb-icons ico-goto-tab',
					list: {
						showImages: true,
						listCssClass: 'dropdown-menu-right',
						items: []
					}
				};
				tabs.forEach(function (tab) {
					btn.list.items.push({
						id: tab.Id,
						caption: tab.Description,
						type: 'item',
						fn: function () {
							var selectedItem = service.getSelected();
							window.filter = {
								navigateToTab: true,
								tabId: tab.Id,
								redirect: 'app.' + moduleName.replaceAll('.', '').toLowerCase(),
								mainItemId: selectedItem.Id
							};
							window.open(location.href); // duplicated current web page
						},
						disabled: function () {
							return !service.getSelected();
						}
					});
				});

				return btn;
			};

			this.tryGoToTab = function (serviceContainer) {
				var redirect = false;
				try { // try/catch block to hide the cross-domain issue
					if(window.opener) {
						var param = window.opener.filter;
						window.opener = null;
						if(param && param.navigateToTab) {
							mainViewService.setActiveTabIndex(param.tabId);
							$state.transitionTo(param.redirect).then(function () {
								loadByIds(serviceContainer, [param.mainItemId]);
							});
							cloudDesktopSidebarService.onCloseSidebar.fire(false);
							redirect = true;
						}
					}
				} catch(error) {
					redirect = false;
				}

				return redirect;
			};

			function loadByIds(serviceContainer, idsArray) {
				var orgFn = serviceContainer.data.initReadData;
				serviceContainer.data.initReadData = function (readData) {
					var filterParams = cloudDesktopSidebarService.getFilterRequestParams();
					_.merge(readData, filterParams);
					readData.PKeys = idsArray.map(function (id) {
						return {Id: id};
					});
					readData.IncludeNonActiveItems = true;
					readData.ProjectContextId = null;
					readData.PinningContext = null;
					readData.furtherFilters = null;
					readData.UseCurrentClient = false;
					readData.filter = '';
					readData.Pattern = '';
					readData.IsEnhancedFilter = false;
					readData.EnhancedFilterDef = null;
				};
				return serviceContainer.service.load().then(function (response) {
					var items = _.get(response, 'data.Dtos') || _.get(response, 'data.Main') || response;
					items = cloudCommonGridService.flatten(items, [], 'ChildItems');
					if(angular.isArray(items) && items.length > 0) {
						serviceContainer.service.setSelected(_.find(items, {Id: idsArray[0]}));
					}
				}).finally(function () {
					serviceContainer.data.initReadData = orgFn;
				});
			}
			this.loadByIds = loadByIds;
		}
	]);
})(angular);
