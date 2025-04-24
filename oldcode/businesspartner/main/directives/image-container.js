/**
 * Created by wui on 5/5/2015.
 */

(function (angular) {
	'use strict';

	angular.module('businesspartner.main').directive('businessPartnerMainImageContainer', [function () {

		return {
			restrict: 'A',
			link: function (scope, element) {
				var images = element.find('img');
				var splitter = element.closest('.k-splitter').data('kendoSplitter');

				if (splitter) {
					splitter.bind('layoutChange', resize);

					scope.$on('$destroy', function () {
						splitter.unbind('layoutChange', resize);
					});
				}

				resize();

				function resize() {
					var width = element.width();
					var height = element.height();
					var base = width > height ? height : width;
					var k = (0.8 * base) / width * 100;
					images.attr('width', k + '%');
				}
			}
		};

	}]);

})(angular);
