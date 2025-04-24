(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc directive
	 * @description
	 */
	angular.module('platform').directive('platformUrlInput', ['$window', function ($window) {

		var template = '<div class="input-group"> \
	                     <input type="url" ng-model="ngModel" class="form-control" placeholder="http://www.rib-software.com" \
	                           ng-change="ngChange()" \
	                           data-ng-readonly="controlOptions.readonly || !entity.Id" \
	                           data-tabstop="{{controlOptions.tabStop}}" data-enterstop="{{controlOptions.enterStop}}" \
	                     /> \
	                     <span class="input-group-btn"> \
		                     <button class="btn btn-default" data-ng-click="openUrl()"><img data-ng-src="{{path}}cloud.style/content/images/control-icons.svg#ico-open-url" title="Go to URL"></button> \
		                  </span> \
	                  </div>';

		return {
			restrict: 'A',
			replace: false,
			scope: {
				ngModel: '=',
				controlOptions: '=',
				entity: '=',
				ngChange: '&'
			},
			// templateUrl: globals.appBaseUrl + 'cloud.common/templates/urlinput.html',
			template: template,
			link: linker
		};

		function linker(scope/*, element, attrs*/) {

			scope.path = globals.appBaseUrl;

			scope.openUrl = function () {
				$window.open(scope.ngModel, '', 'width=1024, height=720');
			};
		}

	}]);

})(angular);


