// / <reference path="../lib/angular/angular.js" />

(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name platformController
	 * @description common controller
	 */
	angular.module('platform').controller('platformController',
		['$scope', '$window', '$rootScope', 'platformTranslateService',
			function ($scope, $window, $rootScope, platformTranslateService) {
				platformTranslateService.registerModule('app');
			}
		]);
})(angular);