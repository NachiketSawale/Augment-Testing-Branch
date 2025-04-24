/**
 * Created by reimer on 19.09.2016.
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
	angular.module('procurement.txinterface').directive('procurementTxInterfaceDocumentSelectionDirective', [
		function () {

			var template =
				'<div> \
					<div data-platform-grid data-data="gridData" style="height: 150px;"></div> \
				</div>';

			return {

				restrict: 'A',

				replace: false,

				scope: {
					ngModel: '='
				},

				template: template,

				controller: 'procurementTxInterfaceDocumentSelectionController'

				// link: linker

			};


		}]);
})();
