(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc directive
	 * @description
	 */
	angular.module('platform').directive('platformEmailInput', [function () {

		var template = '<div class="input-group"> \
                        <input type="email" ng-model="ngModel" class="form-control" placeholder="cloud@rib-software.com" \
                               ng-change="ngChange()" \
                               data-ng-readonly="controlOptions.readonly || !entity.Id" \
                               data-tabstop="{{controlOptions.tabStop}}" data-enterstop="{{controlOptions.enterStop}}"/> \
                        <span class="input-group-addon"> \
                           <a title="Send E-mail" class="btn btn-default" href="mailto:{{ngModel}}"><i class="block-image control-icons ico-send-email"></i></a> \
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

			// templateUrl: globals.appBaseUrl + 'cloud.common/templates/emailinput.html',
			template: template,

			link: linker

		};

		function linker(scope/*, element, attrs*/) {
			scope.path = globals.appBaseUrl;
		}

	}]);

})(angular);

