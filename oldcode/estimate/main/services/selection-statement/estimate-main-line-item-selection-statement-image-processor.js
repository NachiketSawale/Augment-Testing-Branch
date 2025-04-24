/**
 * Created by mov on 4/10/2018.
 */

(function () {


	'use strict';
	/**
	 * @ngdoc service
	 * @name estimateMainLineItemSelectionStatementImageProcessor
	 * @function
	 *
	 * @description
	 * The estimateMainLineItemSelectionStatementImageProcessor adds path to images for Line item selection statement depending on their type.
	 */
	angular.module('estimate.main').factory('estimateMainLineItemSelectionStatementImageProcessor', ['$log', function ($log) {

		let service = {};

		/* jshint -W074 */ // I don't see a high cyclomatic complexity
		service.processItem = function processItem(lineItemSelStatement) {
			if (!(lineItemSelStatement && angular.isDefined(lineItemSelStatement.EstLineItemSelStatementType))) {
				return '';
			}

			switch (lineItemSelStatement.EstLineItemSelStatementType) {
				case 0: // This is a position
					lineItemSelStatement.image = 'ico-boq-item';
					break;
				case 1: // folder
					lineItemSelStatement.image = 'ico-folder-empty';
					break;
				default:
					$log.debug('estimateMainLineItemSelectionStatementImageProcessor; processItem -> not handled line type -> no image assigned yet :' + lineItemSelStatement.EstLineItemSelStatementType);
					break;
			}
		};

		return service;

	}]);
})();
