(() => {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name platformGridFormControl
	 * @element div
	 * @restrict A
	 * @priority default value
	 * @description
	 * Insert a grid for the desktop layout formular
	 */

	function platformGroupedAccordion(platformTranslateService, $templateCache, $compile, $translate) {
		return {
			restrict: 'AE',
			scope: {
				options: '='
			},
			templateUrl: globals.appBaseUrl + 'app/components/formcontrols/template/platform-grouped-accordion-template.html',
			link: function (scope, elem, attrs) {
				let controlTemplate = getTemplate(scope.options.type);

				function getTemplate(key) {
					var template = $templateCache.get(key + '.html');
					if (!template) {
						template = $templateCache.get(key + 'ctrl.html');
					}

					if (!template) {
						template = $templateCache.get('domain.html').replace('$$domain$$', key);
					}

					if (!template) {
						throw new Error('Template ' + key + ' not found');
					}

					return template;
				}

				platformTranslateService.translateObject(scope.options, undefined, {recursive: true});

				if (controlTemplate) {
					let directive = scope.options.type === 'directive' ? 'data-' + scope.options.directive : '';
					let isDomainTemplate = controlTemplate.indexOf('data-domain-control') !== -1 || controlTemplate.indexOf('data-dynamic-domain-control') !== -1;

					let placeholder = [
						'data-entity="$parent.' + attrs.entity + '" ',
						' data-config="$parent.' + attrs.config + '" ',
						' data-model="$parent.' + attrs.model + '" ',
						isDomainTemplate ? '' : ' data-ng-model="$parent.' + attrs.model + '" ',
						isDomainTemplate ? '' : ' data-ng-model-options="{ updateOn: \'default blur\', debounce: { default: 2000, blur: 0}}" ',
						!scope.options.dirty ? '' : ' data-dirty="true" ',
						' data-readonly="' + attrs.readonly + '"',
						' data-ng-readonly="' + attrs.ngReadonly + '"',
						' data-tabstop="' + attrs.tabStop + '"',
						' data-enterstop="' + attrs.enterStop + '"',
					].join('');

					controlTemplate = controlTemplate
						.replace(/\$\$directive\$\$/g, directive)
						.replace(/\$\$row\$\$/g, 'options')
						.replace(/\$\$placeholder\$\$/g, placeholder);

					let controlElem = angular.element(controlTemplate);
					elem.find('.controller').append(controlElem);
						$compile(controlElem)(scope);
				}
			}
		};
	}

	platformGroupedAccordion.$inject = ['platformTranslateService', '$templateCache', '$compile', '$translate'];

	angular.module('platform').directive('platformGroupedAccordion', platformGroupedAccordion);
})();
