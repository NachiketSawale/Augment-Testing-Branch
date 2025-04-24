(function (angular) {

	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).directive('prcCommonMultipleTotalTypeComposite', [
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
				let template = '<div class="lg-4 md-4" $$directiveHolder$$ $$entityHolder$$ $$configHolder$$ data-options="lookupOptions"></div><input $$configHolder$$ class="text-right domain-type-money form-control lg-8 md-8" data-ng-model="$parent.$parent.entity.Placeholder" data-ng-model-options="{ updateOn: \'blur\' }" data-ng-pattern-restrict="^[\\s\\S]{0,42}$" data-enterstop="true" data-tabstop="true" data-domain="description" data-entity="$parent.$parent.entity" readonly disabled/>';
				let options = scope.$parent.$eval(attrs.options),
					settings = _.mergeWith({}, defaultOptions, options, basicsLookupdataLookupOptionService.customizer);

				template = template.replace(/\$\$directiveHolder\$\$/gm, settings.lookupDirective ? ('data-' + settings.lookupDirective) : '')
					.replace(/\$\$entityHolder\$\$/gm, attrs.entity ? ('data-entity="$parent.' + attrs.entity + '"') : '')
					.replace(/\$\$configHolder\$\$/gm, attrs.config ? ('data-config="$parent.' + attrs.config + '"') : '');

				scope.description = '';

				scope.lookupOptions = settings.lookupOptions;

				$compile(angular.element(template).appendTo(element))(scope);
			}
		}]);

})(angular);
