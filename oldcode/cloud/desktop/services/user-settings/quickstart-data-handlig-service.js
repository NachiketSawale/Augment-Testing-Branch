(function () {
	'use strict';

	angular.module('cloud.desktop').factory('cloudDesktopQuickstartDataHandligService', cloudDesktopQuickstartDataHandligService);

	cloudDesktopQuickstartDataHandligService.$inject = ['cloudDesktopModuleService', '$q', 'basicsCommonUtilities', '$filter', '$translate'];

	function cloudDesktopQuickstartDataHandligService(cloudDesktopModuleService, $q, basicsCommonUtilities, $filter, $translate) {
		var desktopPageStructure;

		return {
			getDesktopItems: getDesktopItems
		};

		function setDesktopPageStructure(pageObject) {
			desktopPageStructure = pageObject;
		}

		function getDesktopPageStructure() {
			return desktopPageStructure;
		}

		function getDesktopItems(quickstartSettings, itemsFromDesktopGetSettings) {
			setDesktopPageStructure(itemsFromDesktopGetSettings.desktopPagesStructure);

			var moduleItems = quickstartSettings.useSettings ? quickstartSettings.modules : itemsFromDesktopGetSettings.modules;

			quickstartSettings.desktopItems = getItems(moduleItems, quickstartSettings);

			return quickstartSettings;
		}

		/*
		function getModulesItemsForUserSettings(quickstartSettings) {
			return cloudDesktopModuleService.getModulesById(quickstartSettings.modules).then(function (modules) {
				return modules;
			});
		}
		*/

		function mapItemsInSidebarMenuItem(data, items) {
			angular.forEach(data, function (item) {
				var imgUrl;
				if (item.type !== 0 && item.image) {
					imgUrl = item.type === 1 ? basicsCommonUtilities.toImage(item.image) : item.image;
				}
				items.push(new SidebarMenuItem(item.id, item.iconClass, item.routeUrl, item.disabled, item.displayName$tr$ ? $translate.instant(item.displayName$tr$) : item.displayName, item.type, imgUrl, item.displayNameEN));
			});
		}

		function getItems(data, quickstartSettings) {
			var items = [];

			mapItemsInSidebarMenuItem(data, items);

			// in useSettings=true are the modules included. They checked before if any webTiles or externalTiles exist.
			if (!quickstartSettings.useSettings) {
				// check of tiles with type = 2
				getExternalWebTiles(items);
				items = $filter('orderBy')(items, 'Description');
			}

			// set page items at the beginning of the list when activated.
			if (quickstartSettings.showPages) {
				addDesktopPagesItems(items, quickstartSettings);
			}

			return items;
		}

		function getExternalWebTiles(moduleItems) {
			// in module items are the type 0 and 1. type 2 are in pages. therefore take pagestructire and find the type=2 and add in moduleitems
			_.each(getDesktopPageStructure(), function (pages) {
				if (pages.id !== 'main' && pages.id !== 'config') {
					_.each(pages.groups, function (group) {
						if (group.tiles) {
							var externalWebTiles = _.filter(group.tiles, {'type': 2});
							if (externalWebTiles) {
								_.each(externalWebTiles, function (tiles) {
									// icons can be uploaded in settings-dialog
									var iconUrl = tiles.icon && tiles.icon.data !== '' ? tiles.icon.data : undefined;
									moduleItems.push(new SidebarMenuItem(tiles.id, tiles.iconClass, tiles.url, tiles.disabled, tiles.displayName$tr$ ? $translate.instant(tiles.displayName$tr$) : tiles.displayName, tiles.type, iconUrl));
								});
							}
						}
					});
				}
			});
		}

		function addDesktopPagesItems(items, quickstartSettings) {
			var pagesArray = getPagesItems();

			if (quickstartSettings.showTabs) { // for ui
				quickstartSettings.pages = pagesArray;
			} else {
				_.forEachRight(pagesArray, function (page) {
					items.unshift(page);
				});
			}
		}

		function getPagesItems() {
			var toReturn = [];
			_.forEach(getDesktopPageStructure(), function (page, index) {
				var css = (getDesktopPageStructure().length - 1) === index ? 'ico-page last-section' : 'ico-page';

				toReturn.push(new SidebarMenuItem(page.id, css, page.routeUrl, false, page.pageName, 0, null, page.pageName, true));
			});
			return toReturn;
		}

		function SidebarMenuItem(id, cssClass, goToModuleName, disabled, displayName, type, imgUrl, displayNameEN, ribPage) {
			this.id = _.isString(id) ? id.replace(' ', '.') : id; // quick fix. manche modulenamen haben leerstellen.
			this.displayName = displayName;
			this.Description = displayName; // need for tabs
			this.cssClass = cssClass;
			this.redirect = goToModuleName;
			this.headerClickKey = goToModuleName; // need for tabs
			this.disabled = disabled;
			this.type = type ? type : 0;
			this.imgUrl = imgUrl;
			this.displayNameEN = displayNameEN || '';
			this.hasChildren = (type && type !== 0) ? false : true;
			this.ribPage = ribPage ? ribPage : false;
		}
	}
})();
