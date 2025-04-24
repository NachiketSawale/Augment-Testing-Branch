/**
 * Created by waldrop on 07.02.2019.
 */

(function (angular) {

	'use strict';

	var moduleName = 'basics.userform';

	/**
	 * @ngdoc service
	 * @name basicsUserFormPassthroughDataService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('basicsUserFormPassthroughDataService',
		['$injector',
			function ( $injector) {

				var service = {};

				function getUserId(){

					var platformUserInfoService = $injector.get('platformUserInfoService');
					var userId = platformUserInfoService.getCurrentUserInfo().UserId;

					return userId;
				}

				function getContext(){
					var platformContextService = $injector.get('platformContextService');

					var context = platformContextService.getContext();

					return context;

				}
				service.getUserInfo = function getUserInfo(){
					return {userId: getUserId()};


				};
				service.getContextInfo = function(){

					return getContext();
				};

				var initialData = {};
				service.setInitialData = function (data) {
					initialData = data;
				};

				service.getInitialData = function () {
					return initialData;
				};

				return service;

			}]);
})(angular);

