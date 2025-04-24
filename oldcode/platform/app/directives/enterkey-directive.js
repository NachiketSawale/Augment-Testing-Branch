/**
 * Created by ford on 8/22/2016.
 */
(function (angular) {
	'use strict';

	function EnterKeyDirective() {
		var directive = {};
		directive.restrict = 'A';
		directive.scope = false;
		directive.link = function ($scope, $ele, $attr/* ,$ctrl */) {
			var exec = $scope.$eval($attr.enterKeyPressed);
			if (angular.isUndefined(exec)) {
				throw new Error('No function defined for execution on event');
			}
			$ele.bind('keydown', function (e) {
				if (e.keyCode === 13) {
					exec(e);
				}
			});

			$scope.$on('$destroy', function () {
				$ele.unbind();
			});
		};
		return directive;
	}

	angular.module('platform').directive('enterKeyPressed', EnterKeyDirective);

})(angular);