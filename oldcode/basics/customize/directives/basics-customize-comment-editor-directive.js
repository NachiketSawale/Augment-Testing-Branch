(function () {

	/*global angular*/
	'use strict';
	angular.module('basics.customize').directive('basicsCustomizeCommentEditor', [ function () {

		return {
			restrict: 'A',
			scope: {entity: '='},
			templateUrl: window.location.pathname + '/basics.customize/templates/basics-customize-comment-editor.html'
		};

	}]);

})();
