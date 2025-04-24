/**
 * Created by wed on 10/26/2017.
 */
(function (window) {
	'use strict';

	window.utility = {
		isFunction: function (fn) {
			return Object.prototype.toString.call(fn) === '[object Function]';
		},
		isArray: function (data) {
			return Object.prototype.toString.call(data) === '[object Array]';
		},
		isString: function (data) {
			return Object.prototype.toString.call(data) === '[object String]';
		},
		isObject: function (data) {
			return Object.prototype.toString.call(data) === '[object Object]';
		},
		array: {
			find: function (list, value, key) {
				if (list && list.length > 0) {
					for (let i = 0; i < list.length; i++) {
						if ((key ? list[i][key] === value : list[i] === value)) {
							return list[i];
						}
					}
				}
				return null;
			},
			where: function (list, predict) {
				if (list && list.length > 0) {
					let collection = [];
					for (let i = 0; i < list.length; i++) {
						if (predict(list[i])) {
							collection.push(list[i]);
						}
					}
					return collection.length ? collection : null;
				}
				return null;
			}
		},
		resolveUrl: function () {
			let urls = {};
			let dirSplit = window.location.pathname.split('/');
			let dirs = [];
			for (let i = 0; i < dirSplit.length; i++) {
				if (dirSplit[i] && dirSplit[i].length > 0 && dirSplit[i].indexOf('.html') === -1) {
					dirs.push(dirSplit[i]);
				}
			}
			urls.appBaseUrl = '/' + dirs.join('/') + '/';

			// special handling for deployment in client/webapihelp folder
			if (dirs[dirs.length - 1] === 'webapihelp') {
				dirs = dirs.slice(0, dirs.length - 1);
			}

			dirs[dirs.length - 1] = 'services';
			urls.webApiBaseUrl = '/' + dirs.join('/') + '/';

			urls.appBaseUrl = window.location.origin + urls.appBaseUrl;
			urls.webApiBaseUrl = window.location.origin + urls.webApiBaseUrl;

			return urls;
		},
		clone: function (data) {
			if (data && this.isObject(data)) {
				let clone = {};
				for (let name in data) {
					if (Object.hasOwnProperty.call(data, name)) {
						let property = data[name];
						if (this.isObject(property)) {
							clone[name] = this.clone(property);
						} else {
							clone[name] = property;
						}
					}
				}
				return clone;
			}
			return data;
		},
		endsWith: function (source, searchString) {
			return source.length - (source.lastIndexOf(searchString) + searchString.length) === 0;
		},
		keepEndsWith: function (source, term) {
			return this.endsWith(source, term) ? source : source + term;
		},
		queryString: function queryString(name, url) {
			let result = {};
			for (let i = 0, searchUrl = (url || window.location.search || '').replace('?', ''), items = searchUrl.split('&'); i < items.length; i++) {
				let searchItem = items[i].split('=');
				result[searchItem[0]] = decodeURIComponent(searchItem[1] || '');
			}
			return name ? result[name] : result;
		},
		isValidUrl: function (url) {
			return url.indexOf(window.location.origin) === 0;
		},
		parseJwt: function (token) {
			let output = ((token || '').split('.')[1]).replace(/-/g, '+').replace(/_/g, '/');
			switch (output.length % 4) { // fix length of base64 coded string
				case 0: {
					break;
				}
				case 2: {
					output += '==';
					break;
				}
				case 3: {
					output += '=';
					break;
				}
				default: {
					throw 'Illegal base64url string!';
				}
			}
			return JSON.parse(window.decodeURIComponent(escape(window.atob(output))));
		}
	};

})(window);