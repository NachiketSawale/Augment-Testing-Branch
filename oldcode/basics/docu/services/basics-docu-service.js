/*
 * Created by reimer on 12.11.2015.
 */

(function (angular) {

	/* global globals */
	'use strict';

	var moduleName = 'basics.docu';

	/**
	 * @ngdoc service
	 * @name basicsDocuService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('basicsDocuService', ['$window', '$q', '$http', 'platformContextService',

		function ($window, $q, $http, platformContextService) {

			var service = {};

			var win;

			var technicalDocu;

			var videoWin;

			//// events
			//service.formDataSaved = new Platform.Messenger();
			//service.winOnClosed = new Platform.Messenger();
			//

			var openDocuWindow = function (module) {

				// preventive close existing window
				service.closeDocu();

				var culture = platformContextService.getCulture();
				var templateUrl = globals.webApiBaseUrl + 'basics/docu/getdocu?module=' + module + '&culture=' + culture;
				// var windowFeature = 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes';
				var windowFeature = null;  // jshint ignore:line
				//win = $window.open (templateUrl, null, windowFeature, null);
				win = $window.open(templateUrl, '_blank');

			};

			///**
			// * @ngdoc function
			// * @name showData
			// * @function Opens the form in a new browser window (in readonly mode)
			// * @methodOf basicsUserformCommonService
			// * @description
			// * @param {Integer} the form id
			// * @param {Integer} the context id (e.g. a project id)
			// * @returns {}
			// */
			service.showDocu = function (module) {
				openDocuWindow(module);
			};

			service.closeDocu = function () {
				if (win) {
					win.close();
					win = null;
				}
			};

			service.showVideo = function (module) {
				openVideoWindow(module);
			};

			service.closeVideo = function () {
				if (videoWin) {
					videoWin.close();
					videoWin = null;
				}
			};

			service.hasVideo = function (module) {
				var culture = platformContextService.getCulture();
				return $http.get(globals.webApiBaseUrl + 'basics/docu/hasvideo?module=' + module + '&culture=' + culture, {cache: true});
			};

			function openVideoWindow(module) {
				// preventive close existing window
				service.closeVideo();

				var culture = platformContextService.getCulture();
				var templateUrl = globals.webApiBaseUrl + 'basics/docu/getvideo?module=' + module + '&culture=' + culture;
				// var windowFeature = 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes';
				var windowFeature = null;  // jshint ignore:line
				//win = $window.open (templateUrl, null, windowFeature, null);
				videoWin = $window.open(templateUrl, '_blank');
			}

			return service;

		}]);
})(angular);

