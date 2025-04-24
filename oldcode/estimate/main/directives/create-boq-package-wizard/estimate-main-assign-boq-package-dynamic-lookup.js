/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).directive('estimateMainAssignBoqPackageDynamicLookup', [
		'_',
		'$compile',
		'$templateCache',
		'platformObjectHelper',
		'basicsLookupdataLookupOptionService',
		function (_,
			$compile,
			$templateCache,
			platformObjectHelper,
			basicsLookupdataLookupOptionService) {
			let defaultOptions = {
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
				let template = $templateCache.get('estimate-main-assign-boq-package-dynamic-lookup-template.html'),
					options = scope.$parent.$eval(attrs.options),
					settings = _.mergeWith({}, defaultOptions, options, basicsLookupdataLookupOptionService.customizer);

				template = template.replace(/\$\$directiveHolder\$\$/gm, settings.lookupDirective ? ('data-' + settings.lookupDirective) : '')
					.replace(/\$\$entityHolder\$\$/gm, attrs.entity ? ('data-entity="$parent.' + attrs.entity + '"') : '')
					.replace(/\$\$configHolder\$\$/gm, attrs.config ? ('data-config="$parent.' + attrs.config + '"') : '');

				scope.description = '';

				scope.lookupOptions = settings.lookupOptions;

				if(options.descriptionField){
					scope.descriptionField = '$parent.entity.' + options.descriptionField;
				}

				if(options.readOnlyField) {
					scope.$watch('$parent.entity.' + options.readOnlyField, function (newValue) {
						scope.hideLookup = newValue;
					});
				}

				$compile(angular.element(template).appendTo(element))(scope);
			}
		}]);

})(angular);
