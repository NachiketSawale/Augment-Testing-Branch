/*
 * $Id: cloud-desktop-svg-icon-service.js 546348 2019-05-29 21:57:36Z haagf $
 * Copyright (c) RIB Software SE
 */

// This file uses D3 v4.
(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name cloud.desktop.cloudDesktopSvgIconService
	 * @function
	 *
	 * @description Simplifies access to simple icons for use in SVG documents.
	 */
	angular.module('cloud.desktop').factory('cloudDesktopSvgIconService', ['_', '$', '$http', 'd3',
		function (_, $, $http, d3) {
			let service = {};

			/**
			 * @ngdoc function
			 * @name getIcons
			 * @function
			 * @methodOf cloudDesktopSvgIconService
			 * @description Extracts SVG sub-images from an icon set.
			 * @param {String} iconSet The name of the icon set, e.g. `tlb-icons`.
			 * @param {Array<String>|String} icons The names of the icons to extract.
			 * @param {object} config A configuration object
			 * @returns {Promise<Object>} A promise that is resolved to an object with a property for each successfully
			 *                            extracted icon, once the sprite containing the icon set has been loaded. The
			 *                            property name in the object match the icon names. The value of each property
			 *                            is a string with the Xml source of the icon SVG document.
			 */
			service.getIcons = function (iconSet, icons, config) {
				var iconNames = angular.isArray(icons) ? icons : [icons];

				var defaultConfig = {
					useOuterHTML: true
				};
				var fullConfig = angular.merge(defaultConfig, config);

				return $http.get('cloud.style/content/images/' + iconSet + '.svg', {cache: true}).then(function successCallback(response) {
					var result = {};

					iconNames.forEach(function (iconName) {
						var regex = new RegExp('<svg[^<]+\\sid="' + _.escapeRegExp(iconName) + '".*?>(.+?)</svg>');
						var results = regex.exec(response.data);
						if (results && results.length > 0) {
							result[iconName] = results[fullConfig.useOuterHTML ? 0 : 1];
						}
					});

					return result;
				});
			};

			/**
			 * @ngdoc function
			 * @name createIconDefs
			 * @function
			 * @methodOf cloudDesktopSvgIconService
			 * @description Extracts SVG sub-images from an icon set and prepares them for use as reusable SVG
			 *              definitions. Each resulting definition will have an ID based upon the icon name.
			 * @param {String} iconSet The name of the icon set, e.g. `tlb-icons`.
			 * @param {Array<String>|String} icons The names of the icons to extract.
			 * @param {String} idPrefix Optionally, a string that will be prepended to all icon names for the ID
			 *                          attribute of the resulting definitions.
			 * @returns {Promise<Array<Element>>} A promise that is resolved to an array of DOM elements once the icons
			 *                                    have been extracted. Each DOM element represents one reusable icon.
			 */
			service.createIconDefs = function (iconSet, icons, idPrefix) {
				return service.getIcons(iconSet, icons).then(function (icons) {
					return _.map(Object.keys(icons), function (iconName) {
						var svgEl = $(icons[iconName])[0];
						svgEl.setAttribute('id', (idPrefix || '') + iconName);
						return svgEl;
					});
				});
			};

			/**
			 * @ngdoc function
			 * @name appendIconDefs
			 * @function
			 * @methodOf cloudDesktopSvgIconService
			 * @description Extracts SVG sub-images from an icon set and appends them to an existing SVG `<defs>`
			 *              element. Each resulting definition will have an ID based upon the icon name.
			 * @param {String} iconSet The name of the icon set, e.g. `tlb-icons`.
			 * @param {Array<String>|String} icons The names of the icons to extract.
			 * @param {String} idPrefix Optionally, a string that will be prepended to all icon names for the ID
			 *                          attribute of the resulting definitions.
			 * @param {Object} defsEl The SVG `<defs>` element (or a D3 selection thereof) to which the icon defintions
			 *                        should be appended.
			 * @returns {Promise<Array<Element>>} A promise that is resolved to an array of DOM elements once the icons
			 *                                    have been extracted. Each DOM element represents one reusable icon
			 *                                    that has been appended to the `<defs>` element.
			 * @throws {Error} `defsEl` is of an unknown type.
			 */
			service.appendIconDefs = function (iconSet, icons, idPrefix, defsEl) {
				var defsElement;
				if (defsEl instanceof HTMLElement) {
					defsElement = defsEl;
				} else if (defsEl instanceof d3.selection) {
					defsElement = defsEl.node();
				} else {
					throw new Error('Unable to recognize the type of the supplied <defs> element.');
				}

				return service.createIconDefs(iconSet, icons, idPrefix).then(function (iconDefs) {
					iconDefs.forEach(function (iconDef) {
						defsElement.appendChild(iconDef);
					});
					return icons;
				});
			};

			const basePath = 'cloud.style/content/images/';

			/**
			 * @ngdoc function
			 * @name getIconUrlByClasses
			 * @function
			 * @methodOf cloudDesktopSvgIconService
			 * @description Returns the url of the icon defined via CSS classes.
			 * @param {String} iconClasses The css classes of the icon, e.g. 'tlb-icons ico-edit'
			 * @returns { String } A string containing the url to the icon
			 */
			service.getIconUrlByClasses = (iconClasses) => {
				const classes = iconClasses.split(' ');
				const sprite = classes.find(elem => elem.startsWith('ico-'));
				const image = classes.find(elem => elem.endsWith('-icons'));

				return service.getIconUrl(sprite, image);
			};

			/**
			 * @ngdoc function
			 * @name getIconUrl
			 * @function
			 * @methodOf cloudDesktopSvgIconService
			 * @description Returns the url of the icon defined via CSS classes.
			 * @param {String} sprite The css class of the sprite, e.g. 'tlb-icons'.
			 * @param {String} image The css class of the icon, e.g. 'ico-edit'.
			 * @returns { String } A string containing the url to the icon.
			 */
			service.getIconUrl = (sprite, image) => {
				if ((!sprite || sprite.length === 0) || (!image || image.length === 0)) {
					return undefined;
				}
				const spriteStr = sprite.endsWith('-icons') ? sprite : sprite + '-icons';
				const imageStr = image.startsWith('ico-') ? image : 'ico-' + image;

				return `${basePath}${spriteStr}.svg#${imageStr}`;
			};

			return service;
		}]);
})();
