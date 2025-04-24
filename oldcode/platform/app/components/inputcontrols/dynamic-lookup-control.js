(function (angular) {
	'use strict';

	angular.module('platform').directive('dynamicLookupControl', dynamicLookupControl);

	dynamicLookupControl.$inject = ['$compile', '_'];

	/*
	 Usage:
	 <div dynamic-lookup-control data-directive="myLookupControl" data-model="myModel"></div>

	 attributes:
	 model: the angular data model

	 */
	function dynamicLookupControl($compile, _) {
		return {
			restrict: 'A',
			scope: false,
			link: function (scope, elem, attrs) { // jshint ignore:line
				if (!_.isUndefined(attrs.grid)) {
					throw new Error('dynamic domain control must not be used in grid!');
				}
				var directive = null;

				function getLookupInfos() {
					var colInfo = scope.$eval(attrs.lookupInfo);
					scope.lookupOptions = (colInfo.editorOptions && colInfo.editorOptions.lookupOptions) ? colInfo.editorOptions.lookupOptions : colInfo.formatterOptions ? colInfo.formatterOptions : colInfo;
					scope.editorOptions = (colInfo && colInfo.editorOptions) ? colInfo.editorOptions : colInfo.formatterOptions ? colInfo.formatterOptions : colInfo;
					directive = colInfo.editorOptions && colInfo.editorOptions.directive ? colInfo.editorOptions.directive : colInfo.editorOptions && colInfo.editorOptions.lookupDirective ? colInfo.editorOptions.lookupDirective : colInfo.editorOptions && colInfo.editorOptions.serviceName ? 'basics-lookup-data-by-custom-data-service-grid-less' : 'basics-lookupdata-simple';
					if (scope.lookupOptions && scope.editorOptions) {
						if (scope.editorOptions.serviceName) {
							// this property is required for basics-lookup-data-by-custom-data-service
							scope.lookupOptions.dataServiceName = scope.editorOptions.serviceName;
							_.extend(scope.lookupOptions, scope.editorOptions);
						}
					}
				}

				getLookupInfos();

				// noinspection HtmlUnknownAttribute
				var template = '<div $$directive$$ config="lookupInfo" options="lookupOptions" $$placeholder$$></div>';
				var placeholder = _.reduce(attrs, function (result, value, key) {
					switch (key) {
						case 'dynamicLookupControl':
						case '$attr':
						case '$$element':
							break;
						case 'readonly':
							scope.lookupOptions.readonly = (value === 'true');
							break;
						case 'ngIf':
						case 'ngModel':
						case 'ngModelOptions':
						case 'lookupInfo':
							result += (result.length ? ' ' : '') + 'data-' + _.kebabCase(key) + (value && value.length ? ('="' + value + '"') : '');
							break;
						default:
							result += (result.length ? ' ' : '') + 'data-' + key + (value && value.length ? ('="' + value + '"') : '');
							break;
					}
					return result;
				}, '');
				var unregister = [];

				template = template.replace(/\$\$placeholder\$\$/, placeholder);

				function render(directive) {
					getLookupInfos();
					var replaced = template.replace(/\$\$directive\$\$/, directive);
					var newElem = angular.element(replaced);
					elem.html('');
					elem.append(newElem);
					$compile(newElem)(scope);
				}

				unregister.push(scope.$watch(attrs.config, function () {
					getLookupInfos();
					render(directive);
				}));

				unregister.push(scope.$on('directiveChanged', function () {
					// todo check
				}));

				unregister.push(scope.$on('$destroy', function () {
					_.over(unregister)();
					unregister = null;
				}));
			}
		};
	}
})(angular);