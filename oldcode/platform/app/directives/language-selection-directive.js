/**
 * Created by rei 29.10.18, usage fopr portal dialogs
 */
(function (angular) {
	'use strict';

	function platformLanguageSelection($compile, $rootScope, platformContextService, platformLogonService) {
		return {
			restrict: 'A',
			scope: true,
			link: function (scope, elem /*  attr */) {

				function onUiLanguageChanged() {
					function findLanguageItem(self) {
						var selectedId = self.selectedUiLang;
						return _.find(self.items, function (item) {
							return item.language === selectedId;
						});
					}

					var self = scope.uiLangOptions;
					var item = findLanguageItem(self);
					self.changed = true; // keep track of changes
					platformContextService.setLanguage(item.language);
					platformContextService.culture(item.culture);
					platformContextService.saveContextToLocalStorage();
				}

				scope.uiLangOptions = {
					displayMember: 'languageName',
					valueMember: 'language',
					cssClass: 'merged',
					watchItems: true,
					selectedId: undefined,
					changed: false,
					popupOptions: {
						hasDefaultWidth: false
					},
					changeEvent: onUiLanguageChanged,
				};

				// prepare items, we assume data already loaded...
				scope.uiLangOptions.selectedUiLang = platformContextService.getLanguage() || platformContextService.getDefaultLanguage();
				scope.uiLangOptions.items = platformLogonService.getUiLanguagesNative();

				function rebuild() {

					var template = '<div><div class="border-none language-control" data-domain-control data-domain="select" data-model="uiLangOptions.selectedUiLang" ' +
						'	data-options="uiLangOptions" data-change="uiLangOptions.changeEvent(item)"></div></div>';

					elem.replaceWith($compile(template)(scope));
				}

				rebuild();
			}
		};
	}

	platformLanguageSelection.$inject = ['$compile', '$rootScope', 'platformContextService', 'platformLogonService'];
	angular.module('platform').directive('platformLanguageSelection', platformLanguageSelection);
})(angular);
