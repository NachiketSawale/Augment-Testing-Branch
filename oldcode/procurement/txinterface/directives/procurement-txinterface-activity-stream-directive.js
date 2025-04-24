/**
 * Created by reimer on 24.10.2016.
 */

/* jshint multistr: true */
(function () {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc directive
	 * @description
	 */
	angular.module('procurement.txinterface').directive('procurementTxInterfaceActivityStreamDirective', [
		function () {

			var template = '<iframe class="frame flex-element" height="100%" width="100%" frameborder="0" border="0" marginwidth="0" marginheight="0" scrolling="auto"></iframe>';

			return {

				restrict: 'AE',

				replace: true,

				scope: {

					iframesrc: '='

				},

				template: template,

				link: function linker(scope, element) {

					// Need watch to wait for promise!
					// element.attr('src', scope.iframesrc);
					scope.$watch('iframesrc', function (newVal) {
						if (newVal) {
							element.attr('src', scope.iframesrc);
						}
					}, true);

				}

			};

		}]);
})();
