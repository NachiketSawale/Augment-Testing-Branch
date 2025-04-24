/**
 * Created by wui on 3/1/2017.
 */
/* global globals */

(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.project';

	angular.module(moduleName).factory('constructionSystemProjectCosInstanceFlagImageService', [
		function () {
			var service = {};

			service.getImage = function (flag) {
				var icon = '';

				switch (flag) {
					case 1:
						icon = 'status25';
						break;
					case 2:
						icon = 'status01';
						break;
					case 3:
						icon = 'status02';
						break;
					case 4:
						icon = 'status45';
						break;
					case 5:
						icon = 'status44';
						break;
					case 6:
						icon = 'status03';
						break;
					case 7:
						icon = 'status25';
						break;
					case 8:
						icon = 'status01';
						break;
				}

				return globals.appBaseUrl + '/cloud.style/content/images/status-icons.svg#ico-' + icon;
			};

			return service;
		}
	]);

})(angular);