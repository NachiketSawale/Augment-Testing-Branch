/**
 * @ngdoc directive
 * @name cloudDesktopSvgImage
 * @element svg
 * @restrict A
 * @priority default value
 * @description
 * Insert a svg image from a svg sprite.
 * @example
 * <doc:example>
 * <doc:source>
 * <svg data-cloud-desktop-svg-image data-sprite ="tlb-icons" data-image="ico-save" data-replace>
 * </doc:source>
 * </doc:example>
 */
(function (angular) {
	'use strict';
	angular.module('cloud.desktop').directive('cloudDesktopSvgImage',
		['_', 'cloudDesktopSvgIconService', function (_, svgIconService) {
			return {
				restrict: 'A',
				scope: {
					sprite: '@',
					image: '@',
					color: '@?',
					colorNr: '@?',
				},
				link: function (scopeRef, elemRef, attrs) {
					let scope = scopeRef;
					let elem = elemRef;
					scope.replace = Object.prototype.hasOwnProperty.call(attrs, 'replace');

					if (!attrs.sprite || !attrs.image || _.isUndefined(attrs.image)) {
						throw new Error('No sprite or image specified sprite:' + attrs.sprite + ' image:' + attrs.image);
					}

					let unregisterWatch = function () {
					};

					if (attrs.watch) {
						if (angular.isFunction(scope.$parent.$eval(attrs.watch))) {
							unregisterWatch = scope.$watch(scope.$parent.$eval(attrs.watch), function (oldValue, newItem) {
								if (oldValue !== newItem) {
									init();
								}
							});
						}
					}

					function getSvgTemplate(sprite, image, color, colorNr) {
						let svgPath = svgIconService.getIconUrl(sprite, image);
						let template;

						if (scope.replace) {
							let colorStyleString = color ? ` style='--icon-color-${colorNr || 1}: ${color}'` : '';
							template =
								`<svg xmlns="http://www.w3.org/2000/svg" ${colorStyleString}>
                           <use href="${svgPath}"/>
								</svg>`;
						} else {
							if (color) {
								elem[0].setAttribute('style', `--icon-color-${colorNr || 1}: ${color}'`);
							}
							template = `<use href="${svgPath}"/>`;
						}

						return template;
					}

					function init() {
						let template = getSvgTemplate(scope.sprite, scope.image, scope.color, scope.colorNr);

						if (scope.replace) {
							elem.replaceWith(template);
						} else {
							elem[0].innerHTML = template;
						}

						// add viewBox size, so you can enlarge the image by setting a width and height.
						// regex = new RegExp('<g.+?name="' + attrs.image + '".+?data-size="(.+?);(.+?)".+?>');
						// var resultsSize = regex.exec(results[0]);
						// if (resultsSize.length === 3) {
						// elem[0].setAttribute('viewBox', '0 0 ' + resultsSize[1] + ' ' + resultsSize[2]);
						// }
					}

					init();

					scope.$on('$destroy', function () {
						unregisterWatch();

						elem = null;
						scope = null;
						unregisterWatch = null;
					});
				}
			};
		}]
	);
})(angular);
