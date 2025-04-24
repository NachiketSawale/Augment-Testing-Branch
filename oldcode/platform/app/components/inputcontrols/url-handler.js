(function (angular) {
	'use strict';

	angular.module('platform').directive('platformUrlHandler', handler);

	// handler.$inject = ['_'];

	function handler() {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, elem) {

				scope.openUrl = function () {
					let input = elem[0].value;
					if (!(['http', 'https', 'ftp', 'ftps', 'file'].some((word) => input.startsWith(word)) || input.startsWith('\\'))) {
						input = 'https://'+ input;
					}
					let win = window.open();

					win.opener = null;
					win.location = input;
					win.target = '_blank';
				};
			}
		};
	}
})(angular);