/**
 * Created by wui on 2/22/2016.
 */

(function (angular) {
	'use strict';

	angular.module('basics.common').controller('basicsCommonEmotionController', ['$scope',
		function ($scope) {

			$scope.handleClick = function (e) {
				let elementHTML;

				if (e.target.nodeName === 'I') {
					elementHTML = e.target.outerHTML;
				}
				// For FireFox
				else if (e.target.nodeName === 'BUTTON') {
					elementHTML = e.target.children[0].outerHTML;
				}

				if (elementHTML) {
					$scope.$close({
						isOk: true,
						value: elementHTML
					});
				}
			};

		}
	]);

})(angular);