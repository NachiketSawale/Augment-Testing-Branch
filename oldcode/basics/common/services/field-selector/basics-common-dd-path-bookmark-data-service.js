/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name basics.common.basicsCommonDdPathBookmarkDataService
	 * @function
	 *
	 * @description Provides access to data dictionary path bookmarks.
	 */
	angular.module('basics.common').factory('basicsCommonDdPathBookmarkDataService', ['$http', '_', '$log',
		function ($http, _, $log) {
			const service = {};

			function createCheckBookmarkFunc(rawBookmark) {
				switch (rawBookmark.Kind.toLowerCase()) {
					case 'l': // literal
						return function (ddPath) {
							return rawBookmark.PathPattern === ddPath;
						};
					case 'p': // prefix
						return function (ddPath) {
							return ddPath.startsWith(rawBookmark.PathPattern);
						};
					case 'r': // regex
						return (function () {
							const regex = new RegExp(rawBookmark.PathPattern);
							return function (ddPath) {
								return regex.test(ddPath);
							};
						})();
					default:
						$log.warn('Unknown bookmark kind "' + rawBookmark.Kind + '" on ID ' + rawBookmark.Id + '.');
						return function () {
							return false;
						};
				}
			}

			function BookmarksContainer(rawBookmarks) {
				this._items = _.isArray(rawBookmarks) ? _.map(rawBookmarks, createCheckBookmarkFunc) : [];
			}

			BookmarksContainer.prototype.isBookmarked = function (ddPath) {
				return _.some(this._items, function (item) {
					return item(ddPath);
				});
			};

			BookmarksContainer.prototype.isEmpty = function () {
				return _.isEmpty(this._items);
			};

			service.loadBookmarks = function (tableName) {
				const params = {
					tableName: _.isString(tableName) ? tableName : ''
				};
				return loadBookmarksHttp(params);
			};

			service.loadBookmarksByModule = function (moduleName) {
				const params = {
					moduleName: _.isString(moduleName) ? moduleName : ''
				};
				return loadBookmarksHttp(params);
			};

			function loadBookmarksHttp(parameters) {
				return $http.get(globals.webApiBaseUrl + 'basics/common/ddpathbookmark/fortable', {
					params: parameters
				}).then(function (response) {
					return new BookmarksContainer(response.data);
				});
			}

			return service;
		}]);
})(angular);
