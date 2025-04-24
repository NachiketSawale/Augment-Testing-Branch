((angular => {
	'use strict';

	/*
	used in sidebar-report
	 */
	angular.module('cloud.common').factory('cloudCommonInitUiLanguageItems', cloudCommonInitUiLanguageItems);

	cloudCommonInitUiLanguageItems.$inject = ['globals', '_', 'platformLogonService', 'platformContextService'];

	function cloudCommonInitUiLanguageItems(globals, _, platformLogonService, platformContextService) {
		return {
			getLanguageItems: getLanguageItems,
			getCommonLanguageId: getCommonLanguageId,
			getCultureViaId: getCultureViaId,
			getCulture: getCulture
		};

		function getCultureViaId(list) {
			const item = _.find(list.items, {id: list.activeValue});
			return item ? item.Culture : null;
		}

		function getItemsForListContainer(languageItems, options) {
			languageItems.map(function (item) {
				angular.extend(item, {
					id: item.Id,
					cssClass: 'btn-default',
					caption: item.Description,
					toolTip: item.Description,
					iconClass: 'control-icons ico-' + item.Language,
					type: 'item',
					fn: function (id, item) {
						if (Object.prototype.hasOwnProperty.call(options, 'fn') && _.isFunction(options.fn)) {
							options.fn(item);
						}
					}
				});
			});
		}

		function getLanguageItems(options) {
			return platformLogonService.readUiLanguagesOnly().then(function () {
				let languageItems = globals.uilanguagessimple;
				getItemsForListContainer(languageItems, options);
				return languageItems;
			});
		}

		function getCommonLanguageId(languageCulture, items) {
			let itemByCulture = _.find(items, {Culture: languageCulture});
			return itemByCulture ? itemByCulture.id : 1;
		}

		function getCulture() {
			return platformContextService.getCulture();
		}
	}
}))(angular);
