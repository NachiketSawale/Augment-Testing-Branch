/**
 * composite directive, including code and description.
 */

(function (angular) {

	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).directive('basicsLookupdataLookupComposite', [
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
			var guid = '5D06C694CAA84D508DBC9832200AA5F5';
			var defaultOptions = {
				// specific lookup directive to be used to edit value.
				lookupDirective: '',
				// property name , get its value to show in description box.
				descriptionMember: '',
				// options for specific directive.
				lookupOptions: {
					eagerLoadTextItem: true
				}
			};

			return {
				restrict: 'A',
				scope: {},
				link: linker
			};

			function linker(scope, element, attrs) {
				var template = $templateCache.get('lookup-composite.html'),
					options = scope.$parent.$eval(attrs.options),
					settings = _.mergeWith({}, defaultOptions, options, basicsLookupdataLookupOptionService.customizer),
					eventConfig = {
						id: guid,
						name: 'onEditValueChanged',
						handler: function (e, args) {
							var baseScope = this;

							if(baseScope.settings.multipleSelection){
								scope.description = '';
								args.selectedItems.forEach(function (selectedItem) {
									scope.description += selectedItem ? platformObjectHelper.getValue(selectedItem, settings.descriptionMember) : '';
									scope.description += '; ';
								});
							}
							else{
								scope.description = args.selectedItem ? platformObjectHelper.getValue(args.selectedItem, settings.descriptionMember) : '';
							}
						}
					};

				if (angular.isArray(settings.lookupOptions.events)) {
					var descHandler = _.find(settings.lookupOptions.events, {id: guid});

					if (!descHandler) {
						settings.lookupOptions.events.push(eventConfig);
					} else {
						// every time the link function get called, a new isolate scope get created
						// and we need the new handler that captured this new scope
						descHandler.handler = eventConfig.handler;
					}
				}
				else {
					settings.lookupOptions.events = [eventConfig];
				}

				template = template.replace(/\$\$directiveHolder\$\$/gm, settings.lookupDirective ? ('data-' + settings.lookupDirective) : '')
					.replace(/\$\$entityHolder\$\$/gm, attrs.entity ? ('data-entity="$parent.' + attrs.entity + '"') : '')
					.replace(/\$\$configHolder\$\$/gm, attrs.config ? ('data-config="$parent.' + attrs.config + '"') : '')
					.replace(/\$\$disabledHolder\$\$/gm, attrs.disabled ? ('data-disabled="$parent.' + attrs.disabled + '"') : '')
					.replace(/\$\$resultHolder\$\$/gm, attrs.result ? ('data-result="$parent.' + attrs.result + '"') : '')
					.replace(/\$\$readonlyHolder\$\$/gm, attrs.config ? ('data-readonly="' + attrs.readonly + '"'):'');


				scope.description = '';

				scope.lookupOptions = settings.lookupOptions;

				$compile(angular.element(template).appendTo(element))(scope);
			}
		}]);

})(angular);