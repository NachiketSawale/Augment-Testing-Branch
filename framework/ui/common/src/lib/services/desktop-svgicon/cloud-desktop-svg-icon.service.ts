/* eslint-disable */
// TODO: Either remove this file, or re-enable ESLint and fix all errors
//       before it is included in a production version!

/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { map } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class CloudDesktopSvgIconService {
	//basePath = 'assets/images/';
	basePath = 'assets/ui/common/images/';
	constructor(private http: HttpClient) { }

	/**
	 * @ngdoc function
	 * @name getIcons
	 * @function
	 * @methodOf cloudDesktopSvgIconService
	 * @description Extracts SVG sub-images from an icon set.
	 * @param {String} iconSet The name of the icon set, e.g. `tlb-icons`.
	 * @param {Array<String>|String} icons The names of the icons to extract.
	 * @param {object} config A configuration object
	 * @returns {Observable<Object>} A Observable that is resolved to an object with a property for each successfully
	 *                            extracted icon, once the sprite containing the icon set has been loaded. The
	 *                            property name in the object match the icon names. The value of each property
	 *                            is a string with the Xml source of the icon SVG document.
	 */

	getIcons(iconSet: string, icons: string | string[], config?: string) {
		const iconNames = _.isArray(icons) ? icons : [icons];

		const defaultConfig = {
			useOuterHTML: true,
		};
		const fullConfig = _.merge(defaultConfig, config);

		return this.http.get('cloud.style/content/images/' + iconSet + '.svg').pipe(function successCallback(response: any) {
			let result: any;

			iconNames.forEach(function (iconName: string) {
				const regex = new RegExp('<svg[^<]+\\sid="' + _.escapeRegExp(iconName) + '".*?>(.+?)</svg>');
				const results = regex.exec(response.data);
				if (results && results.length > 0) {
					result[iconName] = results[fullConfig.useOuterHTML ? 0 : 1];
				}
			});

			return result;
		});
	}

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
	 * @returns {Obeservable<Array<Element>>} A Obeservable that is resolved to an array of DOM elements once the icons
	 *                                    have been extracted. Each DOM element represents one reusable icon.
	 */

	createIconDefs(iconSet: string, icons: string | string[], idPrefix: string) {
		return this.getIcons(iconSet, icons).pipe(
			map((icons: any) => {
				return _.map(Object.keys(icons), function (iconName) {
					//	const svgEl = $(icons[iconName])[0];
					// svgEl.setAttribute('id', (idPrefix || '') + iconName);
					// return svgEl;
				});
			})
		);
	}

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
	 * @returns {Obeservable<Array<Element>>} A Obeservable that is resolved to an array of DOM elements once the icons
	 *                                    have been extracted. Each DOM element represents one reusable icon
	 *                                    that has been appended to the `<defs>` element.
	 * @throws {Error} D3 selection error thats why commented out.
	 */

	// appendIconDefs(iconSet:any, icons:any, idPrefix:any, defsEl:any) {
	//   var defsElement:any;
	//   if (defsEl instanceof HTMLElement) {
	//     defsElement = defsEl;
	//   } else if (defsEl instanceof d3.selection) {
	//     defsElement = defsEl.node();
	//   } else {
	//     throw new Error('Unable to recognize the type of the supplied <defs> element.');
	//   }

	//   return this.createIconDefs(iconSet, icons, idPrefix).pipe(function (iconDefs) {
	//     iconDefs.forEach(function (iconDef) {
	//       defsElement.appendChild(iconDef);
	//     });
	//     return icons;
	//   });
	// };

	/**
	 * @ngdoc function
	 * @name getIconUrlByClasses
	 * @function
	 * @methodOf cloudDesktopSvgIconService
	 * @description Returns the url of the icon defined via CSS classes.
	 * @param {String} iconClasses The css classes of the icon, e.g. 'tlb-icons ico-edit'
	 * @returns { String } A string containing the url to the icon
	 */

	// getIconUrlByClasses = (iconClasses:any) => {
	//   const classes = iconClasses.split(' ');
	//   const sprite = classes.find(this.elem.nativeElement.startsWith('ico-'));
	//   const image = classes.find(this.elem.nativeElement.endsWith('-icons'));

	//   return this.getIconUrl(sprite, image);
	// };

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

	getIconUrl = (sprite: string, image: string): string | undefined => {
		if (!sprite || sprite.length === 0 || !image || image.length === 0) {
			return undefined;
		}
		const spriteStr = sprite.endsWith('-icons') ? sprite : sprite + '-icons';
		const imageStr = image.startsWith('ico-') ? image : 'ico-' + image;

		return `${this.basePath}${spriteStr}.svg#${imageStr}`;
	};
}
