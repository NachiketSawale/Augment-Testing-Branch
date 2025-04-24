/**
 *
 * Created by balkanci on 19.03.2015.
 */
(function (angular) {
	'use strict';

	angular.module('platform').directive('navigatorButton', control);

	control.$inject = ['$compile', 'platformModuleNavigationService', 'platformModuleInfoService', 'platformObjectHelper', '$timeout', 'cloudDesktopKeyService', 'platformDialogService'];

	function control($compile, naviService, moduleInfoService, objectHelper, $timeout, keyService, platformDialogService) {
		return {
			restrict: 'AE',
			link: function (scope, elem, attrs) {

				var navigator = scope.$eval(attrs.config).navigator;
				if (!navigator) {
					throw 'No Navigator Config found';
				}

				var title = moduleInfoService.getNavigatorTitle(navigator.moduleName);
				var iconClass = 'ico-goto';

				var naviConf = naviService.getNavigator(navigator.moduleName);
				if (naviConf && naviConf.externalEntityParam) {
					iconClass = 'ico-goto2';
				}

				scope.navigate = function (config, entity, event) {
					//go-to button in dialogs get the key forceNewTab = true
					if(!config.navigator.forceNewTab) {
						config.navigator.forceNewTab = platformDialogService.isElementInDialog(angular.element(event.target));
					}
					naviService.navigate(config.navigator, entity, config.model);
					keyService.resetCursorForNavBtn();
				};

				scope.checkForValue = function checkForValue(config, entity) {
					var hidden = false;
					if (config && config.navigator) {
						var allowed = naviService.hasPermissionForModule(config.navigator.moduleName);
						var navConfig = naviService.getNavigator(config.navigator.moduleName);
						if (objectHelper.isSet(entity) && navConfig && _.isFunction(navConfig.hide)) {
							hidden = navConfig.hide(entity);
						}
						return objectHelper.isSet(entity) && objectHelper.getValue(entity, config.model) && !hidden && allowed;
					}
				};

				var attrList = [
					'data-ng-model="' + (attrs.model || attrs.ngModel) + '"',
					!attrs.readonly ? '' : ' data-ng-readonly="' + attrs.readonly + '"',
					!attrs.config ? '' : ' data-config="' + attrs.config + '"',
					!attrs.entity ? '' : ' data-entity="' + attrs.entity + '"',
					' ng-click="navigate(' + attrs.config + ',' + attrs.entity + ', $event)"',
					' ng-show="checkForValue(' + attrs.config + ',' + attrs.entity + ')"'
				].join('');

				var template = '<button class="btn btn-default navigator-button tlb-icons ' + iconClass + '" ' +
					'title="' + title + '" data-@@attributes@@></button>';

				template = template.replace('data-@@attributes@@', attrList);

				var linkFn = $compile(template);
				var content = linkFn(scope);

				$timeout(function link() {
					elem.replaceWith(content);
				});

				/*
				 e.g. Modul Contract. Layout Contract Detail.
				 if two controls side by side and + a navigation-button, and then there's a layoutbug.
				 */
				if (content.parents('.input-group').find('[class*="lg-"]')[0]) {
					content.addClass('navigatorButtonWrapper');
				}

			}
		};
	}
})(angular);