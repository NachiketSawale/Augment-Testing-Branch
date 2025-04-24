/**
 * @ngdoc directive
 * @name cloud.common.directive:cloudCommonLastobjectsList
 * @element div
 * @restrict A
 * @priority default value
 * @scope isolate scope
 * @description
 *
 * @example
 */
(function (angular) {
	'use strict';

	function replaceSpecialChars(string) {
		if (!string || string.length === 0) {
			return string;
		}
		return string.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	/**
	 *
	 * @param scope
	 * @param cs
	 * @returns {*|Object}
	 */
	function makeChildScopewithClean(scope, cs) {
		if (cs) {
			cs.$destroy();
		}
		return scope.$new();
	}

	angular.module('cloud.common').directive('cloudCommonLastobjectsList', ['$templateCache', '$compile', '_', 'platformTranslateService', 'platformStringUtilsService',
		function ($templateCache, $compile, _, platformTranslateService, stringUtils) {
			return {
				restrict: 'A',
				scope: true,
				link: function (scope, elem, attr) {
					var childscope;

					function processOptions(lastObjectsOptions) {
						var content = [];

						function getTemplate(key) {
							var template = $templateCache.get(key + '.html');
							if (!template) {
								throw new Error('Template ' + key + ' not found');
							}
							return template;
						}

						// we sort by lastChanged date
						scope.theLastObject = lastObjectsOptions;

						angular.forEach(scope.theLastObject, function (lObject, idx) {
							var template = getTemplate('sblastobject-summary');
							template = template.replace(/\$\$title\$\$/g, stringUtils.replaceSpecialChars(scope.theLastObject[idx].summary));
							template = template.replace(/\$\$subtitle\$\$/g, stringUtils.replaceSpecialChars(scope.getlocalizedSubSummary(scope.theLastObject[idx])));
							template = template.replace(/\$\$moduleimage\$\$/g, scope.getModuleImageClass(scope.theLastObject[idx]));
							template = template.replace(/\$\$navigateTo\$\$/g, 'onNavigateToObject(theLastObject[' + idx + '])');
							content.push(template);
						});
						content = angular.element(content.join(''));

						elem.empty();
						childscope = makeChildScopewithClean(scope, childscope);
						elem.append($compile(content)(childscope));
					}

					var refreshLastObjects = function () {
						var lastObjectList = scope.$eval(attr.list);
						processOptions(lastObjectList);
					};

					// register translation changed event
					platformTranslateService.translationChanged.register(refreshLastObjects);

					scope.$watch(function () {
						return scope.$eval(attr.list);
					}, refreshLastObjects);

					scope.$on('$destroy', function () {
						platformTranslateService.translationChanged.unregister(refreshLastObjects);
					});

				}
			};
		}]
	);
})(angular);
