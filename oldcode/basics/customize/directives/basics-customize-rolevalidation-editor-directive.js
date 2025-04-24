(function () {

	/*global angular*/
	'use strict';
	angular.module('basics.customize').directive('basicsCustomizeRoleValidationEditor', [ function () {

		return {
			restrict: 'A',
			scope: {entity: '='},
			templateUrl: window.location.pathname + '/basics.customize/templates/basics-customize-rolevalidation-editor.html'
		};

	}]);

})();
