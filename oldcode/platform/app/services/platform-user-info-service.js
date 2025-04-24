/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformUserInfoService
	 * @function
	 * @requires $http, $q, platformContextService, _
	 * @description
	 * platformPermissionService provides support for loading and checking access right
	 */
	angular.module('platform').factory('platformUserInfoService', platformUserInfoService);

	platformUserInfoService.$inject = ['$http', '$q', '_', '$translate', '$state', 'platformContextService', 'globals'];

	function platformUserInfoService($http, $q, _, $translate, $state, platformContextService, globals) {
		var loadedUsers = {};
		var service = {};
		let isPending=false;
		let pendingUserPromise;
		var userInfo = {
			userValid: false,
			LogonName: '',
			UserId: 0,
			UserName: '',
			Email: '',
			Idp: undefined,
			IdpName: undefined,
			IsPasswordChangeRequired: false,
			PasswordExpiration: null,
			ExplicitAccess: false,
			UserDataLanguageId: 1, // is english
			UiLanguage: undefined,
			UiCulture: undefined
		};

		service.getCurrentUserInfo = function () {
			return userInfo;
		};

		/**
		 * @ngdoc function
		 * @name getUserInfoPromise
		 * @function
		 * @methodOf platform:platformUserInfoService
		 * @description reads userInfo from Web-API with returning a promise
		 * @param useExisting {boolean} when true, user info is returned immediately
		 */
		service.getUserInfoPromise = function (useExisting) {
			if (useExisting && userInfo.userValid) {
				return $q.when(userInfo);
			}

			if (!isPending) {
				isPending = true;
				pendingUserPromise = $http.get(globals.webApiBaseUrl + 'services/platform/getuserinfo')
					.then(function (response) {
						angular.extend(userInfo, response.data);

						// force pass changedialog when requested for this user
						if (userInfo.ExplicitAccess && userInfo.IsPasswordChangeRequired === true) {
							$state.transitionTo('changepassword');
						}
						userInfo.userValid = true;
						isPending = false;

						// propagate user language settings to system context
						platformContextService.setDataLanguageId(userInfo.UserDataLanguageId);
						if (userInfo.UiLanguage) {
							platformContextService.setLanguage(userInfo.UiLanguage);
						}
						if (userInfo.UiCulture) {
							platformContextService.setCulture(userInfo.UiCulture);
						}
						platformContextService.setCurrentUserId(userInfo.UserId);
						platformContextService.registerLocalStorageChanges();
						return (userInfo);
					});
			}
			return pendingUserPromise;
		};

		/**
		 * return the userValid Flag from userInfo
		 *
		 * @returns  false if user info is not already loaded from server
		 */
		service.isUserValid = function () {
			return userInfo.userValid;
		};

		/**
		 * @ngdoc function
		 * @name loadUsers
		 * @function
		 * @methodOf platform.platformUserInfoService
		 * @description loads given user id(s)
		 * @param ids {integer|array} user id(s) to be loaded
		 * @returns {promise} resolved when users info is available for lookup
		 */
		service.loadUsers = function loadUsers(ids) {
			if (ids) {
				var data = [];

				_.each(_.isArray(ids) ? ids : [ids], function (id) {
					if (_.isUndefined(loadedUsers[id])) {
						data.push(id);
					}
				});

				if (data.length) {
					var promise = $http.post(globals.webApiBaseUrl + 'services/platform/loaduserinfobyids', data)
						.then(function (result) {
							_.each(result.data, function (item) {
								loadedUsers[item.id] = item;
							});

							return true;
						}, function () {
							_.each(data, function (id) {
								loadedUsers[id] = '';
							});

							return false;
						});

					_.each(data, function (id) {
						loadedUsers[id] = promise;
					});

					return promise;
				}
			}

			return $q.when(true);
		};

		/**
		 * @ngdoc function
		 * @name isLoaded
		 * @function
		 * @methodOf platform.platformUserInfoService
		 * @description checks if user id is already available
		 * @param id {integer} user's id
		 * @returns {bool} true if available
		 */
		service.isLoaded = function isLoaded(id) {
			return !!loadedUsers[id];
		};

		/**
		 * @ngdoc function
		 * @name logonName
		 * @function
		 * @methodOf platform.platformUserInfoService
		 * @description retrieve logon name for given id
		 * @param id {integer} user's id
		 * @returns {string|promise} logon name for given id or promise when loading
		 */
		service.logonName = function logonName(id) {
			return _.get(loadedUsers[id], 'logonName', id.toString() + ' | ' + $translate.instant('platform.userInfoNotAvailable'));
		};

		/**
		 * @ngdoc function
		 * @name name
		 * @function
		 * @methodOf platform.platformUserInfoService
		 * @description retrieve logon name for given id
		 * @param id {integer} user's id
		 * @returns {string|promise} logon name for given id or promise when loading
		 */
		service.name = function name(id) {
			var name = _.get(loadedUsers[id], 'name', null);

			if (name && name.length !== 0) {
				return name;
			}
			return service.logonName(id);
		};

		return service;
	}
})();
