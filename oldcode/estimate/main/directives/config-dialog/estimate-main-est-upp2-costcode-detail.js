/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name estimateMainUpp2CostcodeDetail
	 * @requires
	 * @description
	 */
	angular.module('estimate.main').directive('estimateMainUpp2CostcodeDetail', ['$timeout', '$templateCache', function ($timeout, $templateCache) {
		return {
			restrict: 'A',
			template : $templateCache.get('estimate-main-est-upp2-costcode-detail.html'),
			link: function (scope, element) {

				let getDetailGridWidth = function getDetailGridWidth() {
					let toolbar = element.find('.toolbar');
					return angular.element(toolbar).width();
				};

				let setDetailGridWidth = function setDetailGridWidth(element, width) {
					element.find('#uppcostcodedetail').css('width', (width-1) + 'px');
				};

				let adjustDetailGridWidth = function () {
					let maxWidth = getDetailGridWidth();
					setDetailGridWidth(element, maxWidth);
				};

				$timeout(function () {
					adjustDetailGridWidth();
				});
			}
		};
	}]);
})();
