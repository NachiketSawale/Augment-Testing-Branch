(function () {
	'use strict';

	angular.module('platform').factory('platformStatusBarViewSettings', platformStatusBarViewSettings);

	platformStatusBarViewSettings.$inject = ['$translate', 'mainViewService', 'cloudDesktopPinningFilterService', '$q', '_'];

	function platformStatusBarViewSettings($translate, mainViewService, cloudDesktopPinningFilterService, $q, _) {
		let service = {};

		function getItemsArray() {
			return [
				{
					align: 'right',
					disabled: false,
					id: 'viewedFilter',
					toolTip: {
						title: $translate.instant('cloud.desktop.statusbarFilter.pinnedViewTitle'),
						hasDefaultWidth: true,
						width: 300
					},
					type: 'image',
					visible: false,
					iconClass: 'control-icons ico-filter-on',
					cssClass: 'block-image'
				},
				{
					align: 'right',
					disabled: false,
					id: 'viewLoadTab',
					toolTip: {
						title: $translate.instant('cloud.desktop.statusbarFilter.loadViewTitle'),
						caption: $translate.instant('cloud.desktop.statusbarFilter.loadTabViewDescription'),
						hasDefaultWidth: true,
						width: 300
					},
					type: 'image',
					visible: false,
					iconClass: 'control-icons ico-opt-load-tab',
					cssClass: 'block-image'
				},
				{
					align: 'right',
					disabled: false,
					id: 'viewLoadModule',
					toolTip: {
						title: $translate.instant('cloud.desktop.statusbarFilter.loadViewTitle'),
						caption: $translate.instant('cloud.desktop.statusbarFilter.loadModuleViewDescription'),
						hasDefaultWidth: true,
						width: 300
					},
					type: 'image',
					visible: false,
					iconClass: 'control-icons ico-opt-load-start',
					cssClass: 'block-image'
				}
			];
		}

		service.getStatusBarViewItems = function () {
			let filterPromis = [];
			service.items = getItemsArray();

			let activeView = mainViewService.getCurrentView();
			let config = activeView ? activeView.Config : null;

			if (config) {
				var viewConfig = config;
				if (viewConfig.filterId) {
					filterPromis.push(getPinnedFilterItem());
				}

				service.items[1].visible = Boolean(viewConfig.loadDataTabChanged);
				service.items[2].visible = Boolean(viewConfig.loadDataModuleStart);

				if (!_.isEmpty(filterPromis)) {
					return $q.all(filterPromis).then(response => {
						if (!_.isEmpty(response) && response[0] !== '') {
							service.items[0].visible = true;
							service.items[0].toolTip.caption = $translate.instant('cloud.desktop.statusbarFilter.pinnedViewDescription', {'pinnedName': response[0]});
						}
						return service.items;
					});
				} else {
					return $q.when(service.items);
				}

			} else {
				return $q.when([]);
			}
		};

		function getPinnedFilterItem() {
			return cloudDesktopPinningFilterService.getPinnedFilter().then(response => {
				return (response && response.displayName) ? response.displayName : '';
			});
		}

		service.updateStatusBarViewItems = function (filter, config) {
			service.items = getItemsArray();

			if (_.isEmpty(config)) {
				return service.items;
			}

			if (config.filterId) {
				service.items[0].visible = true;
				service.items[0].toolTip.caption = $translate.instant('cloud.desktop.statusbarFilter.pinnedViewDescription', {'pinnedName': filter.displayName});
			}
			service.items[1].visible = Boolean(config.loadDataTabChanged);
			service.items[2].visible = Boolean(config.loadDataModuleStart);

			return service.items;
		};

		service.deleteItems = function () {
			return [
				{
					id: 'viewedFilter',
					delete: true
				},
				{
					id: 'viewLoadTab',
					delete: true
				},
				{
					id: 'viewLoadModule',
					delete: true
				}
			];
		};

		return service;
	}
})();
