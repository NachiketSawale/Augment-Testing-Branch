/**
 * Created by wed on 11/7/2017.
 */

(function (angular) {

	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).directive('basicsCommonTotalCostComposite', [
		'_',
		'$compile',
		'$templateCache',
		'platformObjectHelper',
		'basicsLookupdataLookupOptionService',
		function (
			_,
			$compile,
			$templateCache,
			platformObjectHelper,
			basicsLookupdataLookupOptionService) {
			const guid = 'c0cc205914ea401faafc93aeab608e61';
			const defaultOptions = {
				// specific lookup directive to be used to edit value.
				lookupDirective: '',
				// property name , get its value to show in description box.
				descriptionMember: '',
				// options for specific directive.
				lookupOptions: {}
			};

			return {
				restrict: 'A',
				scope: {},
				link: linker
			};

			function linker(scope, element, attrs) {
				let template = '<div class="lg-4 md-4" $$directiveHolder$$ $$entityHolder$$ $$configHolder$$ data-options="lookupOptions"></div><input $$configHolder$$ class="text-right domain-type-money form-control lg-8 md-8" data-platform-numeric-converter data-ng-model="$parent.$parent.entity.TotalCost" data-platform-control-validation data-ng-model-options="{ updateOn: \'blur\' }" data-ng-pattern-restrict="^(([-+]?(\\d{0,3})([.,]\\d{3}){0,3}([.,]\\d{0,2}))|([-+]?\\d{0,12})([.,]\\d{0,2})?)$" data-enterstop="true" data-tabstop="true" data-domain="money" data-entity="$parent.$parent.entity"/>',
					options = scope.$parent.$eval(attrs.options),
					settings = _.mergeWith({}, defaultOptions, options, basicsLookupdataLookupOptionService.customizer),
					eventConfig = {
						id: guid,
						name: 'onEditValueChanged',
						handler: function (e, args) {
							if (args.selectedItem) {
								scope.$parent.$parent.entity.TotalCost = platformObjectHelper.getValue(args.selectedItem, settings.descriptionMember);
							}
						}
					};

				if (angular.isArray(settings.lookupOptions.events)) {
					const descHandler = _.find(settings.lookupOptions.events, {id: guid});

					if (!descHandler) {
						settings.lookupOptions.events.push(eventConfig);
					} else {
						// every time the link function get called, a new isolate scope get created
						// and we need the new handler that captured this new scope
						descHandler.handler = eventConfig.handler;
					}
				} else {
					settings.lookupOptions.events = [eventConfig];
				}

				template = template.replace(/\$\$directiveHolder\$\$/gm, settings.lookupDirective ? ('data-' + settings.lookupDirective) : '')
					.replace(/\$\$entityHolder\$\$/gm, attrs.entity ? ('data-entity="$parent.' + attrs.entity + '"') : '')
					.replace(/\$\$configHolder\$\$/gm, attrs.config ? ('data-config="$parent.' + attrs.config + '"') : '');

				scope.description = '';

				scope.lookupOptions = settings.lookupOptions;

				$compile(angular.element(template).appendTo(element))(scope);
			}
		}]);

})(angular);
