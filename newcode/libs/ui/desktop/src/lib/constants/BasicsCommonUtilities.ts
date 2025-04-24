/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import * as _ from 'lodash';
import { IMarkOptions } from '../models/interfaces/common-utilities.interface';

/**
 * Constants for BasicsCommonUtilities
 */
export class BasicsCommonUtilities {
	/**
	 * Variable for name of module.
	 */
	public static moduleName = 'basics.common';
	/**
	 * Removes all blanks, "(", ")","-" character from formatted phone string.
	 */
	public static generatePhonePattern(phone: string) {
		return phone.replace(/\s/g, '').replace('(', '').replace(')', '').replace('-', '');
	}

	/**
	 * Check and prepare the filter for search.
	 *  @returns {String}
	 */
	public static buildSearchFilter(searchFields: string[], searchValue: string): string {
		let filterString = '';
		if (searchValue && searchValue.length && searchFields && searchFields.length) {
			// searchValue = this.urlEncoding(searchValue); // don't need url encoding now, it seems somewhere do encoding already.
			searchFields.forEach((searchField: string) => {
				if (searchField.match(/fk$/i)) {
					// foreign key
					return;
				}
				if (filterString) {
					filterString = filterString + ' or ';
				}

				if (searchField === 'DescriptionInfo' || searchField === 'DescriptionInfo.Translated') {
					// description and description_tr
					filterString = filterString + 'DescriptionInfo.Description.Contains("' + searchValue + '")';
				} else {
					filterString = filterString + '(' + searchField + '!=null and ' + searchField + '.ToString().Contains("' + searchValue + '"))';
				}

				// todo: temporary solution, consider common solution for search not string type property.
				/*
                if (searchField.toLowerCase() === 'id' && $.isNumeric(searchValue)) {
                    filterString = filterString + searchField + '=' + searchValue;
                } else {
                    filterString = filterString + searchField + '.Contains("' + searchValue + '")';
                }
                */
			});
		}
		return filterString ? '(' + filterString + ')' : '';
	}

	/**
	 * Transfer blob data to image content.
	 *  @returns {string}
	 */
	toImage(blob: string | string[] | undefined): string {
		let image = '';

		if (_.isString(blob) && blob.length > 0 && blob.indexOf('data:') === -1) {
			image = 'data:image/jpg;base64,' + blob;
		}

		return image;
	}
	/**
	 * add http:// as prefix in the url.
	 * @param url accept url in string.
	 * @returns {string}
	 */
	public static getUrlWithPrefix(url: string): string {
		if (url && !url.match(/^http([s]?):\/\/.*/)) {
			url = 'http://' + url;
		}
		return url;
	}

	/**
	 * transfer image content to blob data.
	 * @param image take string to change in Blob.
	 * @returns {string}
	 */
	public static toBlob(image: string): string {
		let blob = '';

		if (_.isString(image) && image.indexOf('data:') !== -1) {
			blob = image.split(',')[1];
		}

		return blob;
	}

	/**
	 * make sure text string which is used to build regular expression pattern is valid.
	 * @param text take string to ensure the pattern.
	 */
	public static ensurePattern(text: string): string {
		if (!text || !_.isString(text)) {
			return '';
		}

		const metaChars = ['\\\\', '\\^', '\\$', '\\*', '\\+', '\\?', '\\{', '\\}', '\\.', '\\(', '\\)', '\\:', '\\=', '\\!', '\\|', '\\[', '\\]', '\\&'];

		metaChars.forEach((metaChar) => {
			text = text.replace(new RegExp(metaChar, 'gi'), metaChar);
		});

		return text;
	}

	/**
	 * encoding url string for some special char.
	 * @param text accept text in string for encoding the url.
	 * @returns {string}
	 */
	public static urlEncoding(text: string): string {
		const codes = [
			{ char: '\\%', code: '%25' }, // should be replaced first.
			{ char: '\\"', code: '%22' },
			{ char: '\\#', code: '%23' },
			{ char: '\\&', code: '%26' },
			{ char: '\\(', code: '%28' },
			{ char: '\\)', code: '%29' },
			{ char: '\\+', code: '%2B' },
			{ char: '\\,', code: '%2C' },
			{ char: '\\/', code: '%2F' },
			{ char: '\\:', code: '%3A' },
			{ char: '\\;', code: '%3B' },
			{ char: '\\<', code: '%3C' },
			{ char: '\\?', code: '%3F' },
			{ char: '\\@', code: '%40' },
			{ char: '\\|', code: '%7C' },
			{ char: '\\\\', code: '%5C' },
		];

		if (text && text.length > 0) {
			codes.forEach(function (item) {
				text = text.replace(new RegExp(item.char, 'gi'), item.code);
			});
		}

		return text;
	}

	/**
	 * combine string type properties with certain separator.
	 * @param textArr text in array.
	 * @param separator to separate the string.
	 * @returns {string}
	 */
	public static combineText(textArr: string[], separator: string): string {
		let result = '';

		if (_.isArray(textArr)) {
			textArr = textArr.filter(function (text) {
				return _.isString(text);
			});
			result = textArr.join(separator);
		}

		return result;
	}
	/**
	 * whether the target object is {} or not.
	 * @param obj to check whether it is empty or not.
	 */
	public static isEmptyObject(obj: object): boolean {
		return _.isEmpty(obj);
	}
	/**
	 * Checks the Longitude and Latitude.
	 * @param markOption accept IMarkOptions object for marking the option.
	 * @returns {boolean}
	 */
	public static isLatLongValid(markOption: IMarkOptions): boolean {
		let invalidLocation = false;
		if (markOption && markOption.latitude && markOption.longitude) {
			invalidLocation = markOption.latitude > 90 || markOption.latitude < -90 || markOption.longitude > 180 || markOption.longitude < -180;
			if (invalidLocation) {
				return false;
			}
		} else {
			return false;
		}
		return true;
	}
	/**
	 * To get extremes.
	 * @param markItemList accept array of IMarkOptions to mark item list.
	 * @returns
	 */
	public static getExtremes(markItemList: IMarkOptions[]) {
		const validMarkItemList = _.filter(markItemList, (markItem: IMarkOptions) => {
			return markItem.latitude !== 0 || markItem.longitude !== 0;
		});
		return {
			maxLong: ((items) => {
				var maLo = _.maxBy(items, (item) => {
					return item.longitude;
				});

				return _.isNil(maLo) ? 179 : maLo.longitude;
			})(validMarkItemList),
			minLong: ((items) => {
				var miLo = _.minBy(items, (item) => {
					return item.longitude;
				});
				return _.isNil(miLo) ? -179 : miLo.longitude;
			})(validMarkItemList),
			maxLat: ((items) => {
				var maLa = _.maxBy(items, (option) => {
					return option.latitude;
				});
				return _.isNil(maLa) ? 89 : maLa.latitude;
			})(validMarkItemList),
			minLat: ((items) => {
				var miLa = _.minBy(items, (item) => {
					return item.latitude;
				});
				return _.isNil(miLa) ? -89 : miLa.latitude;
			})(validMarkItemList),
		};
	}
	/**
	 * To get array as set object.
	 * @param array accept array
	 * @param idFunc accept Funtion
	 * @param value accept value in boolean
	 * @returns {result}
	 */
	public static arrayAsSetObject(array: [], value: boolean) {
		const actualValue: boolean = arguments.length > 2 ? value : true;
		const result = { actualIdFunc: false };
		if (_.isArray(array)) {
			array.forEach((v) => {
				result.actualIdFunc = actualValue;
			});
		}
		return result;
	}
}
