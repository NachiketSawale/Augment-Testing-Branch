/*
 * $Id: utilities.js 608035 2020-10-21 14:14:21Z uestuenel $
 * Copyright (c) RIB Software SE
 */

(function (angular, _) {
	'use strict';

	const moduleName = 'basics.common';

	// noinspection JSValidateTypes
	angular.module(moduleName).constant('basicsCommonUtilities', {

		/**
		 * @description Removes all blanks, "(", ")","-" character from formatted phone string
		 */
		generatePhonePattern: function (phone) {
			return phone.replace(/\s/g, '').replace('(', '').replace(')', '').replace('-', '');
		},

		/**
		 * @description check and prepare the filter for search
		 */
		buildSearchFilter: function (searchFields, searchValue) {
			let filterString = '';
			if (searchValue && searchValue.length && searchFields && searchFields.length) {
				// searchValue = this.urlEncoding(searchValue); // don't need url encoding now, it seems somewhere do encoding already.
				searchFields.forEach(function (searchField) {
					if (searchField.match(/fk$/i)) { // foreign key
						return;
					}
					if (filterString) {
						filterString = filterString + ' or ';
					}

					if (searchField === 'DescriptionInfo' || searchField === 'DescriptionInfo.Translated') { // description and description_tr
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
		},

		/**
		 * @description: transfer blob data to image content.
		 */
		toImage: function (blob) {
			let image = '';

			if (angular.isString(blob) && blob.length > 0 && blob.indexOf('data:') === -1) {
				image = 'data:image/jpg;base64,' + blob;
			}

			return image;
		},

		// @description: add http:// as prefix
		getUrlWithPrefix: function (url) {
			if (url && !url.match(/^http([s]?):\/\/.*/)) {
				url = 'http://' + url;
			}
			return url;
		},

		/**
		 * @description: transfer image content to blob data.
		 */
		toBlob: function (image) {
			let blob = '';

			if (angular.isString(image) && image.indexOf('data:') !== -1) {
				blob = image.split(',')[1];
			}

			return blob;
		},

		/**
		 * make sure text string which is used to build regular expression pattern is valid.
		 * @param text
		 */
		ensurePattern: function (text) {
			if (!text || !angular.isString(text)) {
				return '';
			}

			const metaChars = ['\\\\', '\\^', '\\$', '\\*', '\\+', '\\?', '\\{', '\\}',
				'\\.', '\\(', '\\)', '\\:', '\\=', '\\!', '\\|', '\\[', '\\]', '\\&'];

			metaChars.forEach(function (metaChar) {
				text = text.replace(new RegExp(metaChar, 'gi'), metaChar);
			});

			return text;
		},

		/**
		 * encoding url string for some special char.
		 * @param text
		 * @returns {*}
		 */
		urlEncoding: function (text) {
			const codes = [
				{char: '\\%', code: '%25'}, // should be replaced first.
				{char: '\\"', code: '%22'},
				{char: '\\#', code: '%23'},
				{char: '\\&', code: '%26'},
				{char: '\\(', code: '%28'},
				{char: '\\)', code: '%29'},
				{char: '\\+', code: '%2B'},
				{char: '\\,', code: '%2C'},
				{char: '\\/', code: '%2F'},
				{char: '\\:', code: '%3A'},
				{char: '\\;', code: '%3B'},
				{char: '\\<', code: '%3C'},
				{char: '\\?', code: '%3F'},
				{char: '\\@', code: '%40'},
				{char: '\\|', code: '%7C'},
				{char: '\\\\', code: '%5C'}
			];

			if (text && text.length > 0) {
				codes.forEach(function (item) {
					text = text.replace(new RegExp(item.char, 'gi'), item.code);
				});
			}

			return text;
		},

		/**
		 * @description combine string type properties with certain separator.
		 * @param textArr
		 * @param separator
		 * @returns {string}
		 */
		combineText: function (textArr, separator) {
			let result = '';

			if (angular.isArray(textArr)) {
				textArr = textArr.filter(function (text) {
					return angular.isString(text);
				});
				result = textArr.join(separator);
			}

			return result;
		},

		/**
		 * @description whether the target object is {} or not.
		 * @param obj
		 */
		isEmptyObject: function (obj) {
			return _.isEmpty(obj);
		},
		/**
		 * @description Checks the Long and Latitude.
		 * @param markOption
		 * * @returns {boolean}
		 */
		isLatLongValid: function isLatLongValid(markOption) {
			let invalidLocation = false;
			if (markOption && markOption.latitude && markOption.longitude) {
				invalidLocation = markOption.latitude > 90 || markOption.latitude < -90 ||
					markOption.longitude > 180 || markOption.longitude < -180;
				if (invalidLocation) {
					return false;
				}
			} else {
				return false;
			}
			return true;
		},
		getExtremes: function (markItemList) {
			const validMarkItemList = _.filter(markItemList, function (markItem) {
				return (markItem.latitude !== 0 || markItem.longitude !== 0);
			});
			return {
				maxLong: (function (items) {
					var maLo = _.maxBy(items, function (item) {
						return item.longitude;
					});

					return _.isNil(maLo) ? 179 : maLo.longitude;
				})(validMarkItemList),
				minLong: (function (items) {
					var miLo = _.minBy(items, function (item) {
						return item.longitude;
					});
					return _.isNil(miLo) ? -179 : miLo.longitude;
				})(validMarkItemList),
				maxLat: (function (items) {
					var maLa = _.maxBy(items, function (option) {
						return option.latitude;
					});
					return _.isNil(maLa) ? 89 : maLa.latitude;
				})(validMarkItemList),
				minLat: (function (items) {
					var miLa = _.minBy(items, function (item) {
						return item.latitude;
					});
					return _.isNil(miLa) ? -89 : miLa.latitude;
				})(validMarkItemList)
			};
		},
		arrayAsSetObject: function (array, idFunc, value) {
			const actualIdFunc = _.isFunction(idFunc) ? idFunc : function (v) {
				return v;
			};
			const actualValue = arguments.length > 2 ? value : true;
			const result = {};
			if (_.isArray(array)) {
				array.forEach(function (v) {
					result[actualIdFunc(v)] = actualValue;
				});
			}
			return result;
		}

	});
// eslint-disable-next-line no-undef
})(angular, _);