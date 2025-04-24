(function (angular) {

	'use strict';

	// todo control is only a torso

	/**
	 * @ngdoc directive
	 * @description
	 */
	angular.module('platform').directive('platformDateTimeInput', [function () {

		var template = '<input type="text" ng-model="ngModel" class="form-control" maxlength="{{maxlength}}"  \
                      data-ng-readonly="controlOptions.readonly || false" data-tabstop="{{controlOptions.tabStop}}" data-enterstop="{{controlOptions.enterStop}}" \
                      rib-validation-method="controlOptions.validationMethod(controlOptions.model, value)" \
                      title="{{entity.errors[controlOptions.model][0] | platformLocalizedErrormessage}}" \
                       />';

		return {

			restrict: 'A',

			replace: false,

			scope: {
				ngModel: '=',
				controlOptions: '=',
				entity: '='
			},

			template: template,

			link: linker

		};

		function linker(/*scope, element, attrs*/) {

		}

	}]);

})(angular);

