/**
 * Created by uestuenel on 01.10.2015.
 */

(function () {
	'use strict';

	function insertBackgroundImage() {

		return {
			restrict: 'A',
			link: function (scope, element) {
				element.parent('#mainContent').addClass('desktopViewWrapper');
			}
		};

	}

	angular.module('basics.common').directive('basicsCommonInsertBackgroundImage', [insertBackgroundImage]);
})();