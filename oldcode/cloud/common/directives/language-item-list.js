(() => {
	'use strict';

	angular.module('cloud.common').directive('languageItemList', languageItemList);
	languageItemList.$inject = ['$compile', 'cloudCommonInitUiLanguageItems'];

	function languageItemList($compile, cloudCommonInitUiLanguageItems) {
		return {
			restrict: 'AE',
			scope: {
				config: '='
			},
			link: function (scope, elem) {
				let template;

				if(!scope.config.hasOwnProperty('items')) {
					cloudCommonInitUiLanguageItems.getLanguageItems(scope.config).then(function(response) {
						scope.config.items = response;
						renderHTMLMarkup();
					});
				} else {
					renderHTMLMarkup();
				}

				function processActionList() {
					//action-item-list
					template = '<div platform-action-item-list data-set-link="initActionItemsLink(link)"></div>';

					let actionItems = null;
					scope.initActionItemsLink = function (link) {
						actionItems = link;
						link.setFields(scope.config);
					};
				}

				function processDropdown() {
					let activeValue = scope.config.activeValue ? scope.config.activeValue : cloudCommonInitUiLanguageItems.getCulture();

					scope.options = {
						showImages: true,
						showTitles: true,
						items: scope.config.items,
						activeValue: cloudCommonInitUiLanguageItems.getCommonLanguageId(activeValue, scope.config.items)
					};

					Object.assign(scope.config, scope.options);

					template = '<div platform-action-select-btn data-options="config"></div>';
				}

				function getTemplate() {
					if(scope.config.type === 2) {
						processActionList();
					} else {
						processDropdown();
					}

					return template;
				}

				function renderHTMLMarkup() {
					elem.append($compile(getTemplate())(scope));
				}
			}
		};
	}
})();
