/**
 * Created by mov on 4/10/2018.
 */

(function () {

	/* global _ */
	'use strict';
	/**
	 * @ngdoc service
	 * @name estimateMainLineItemSelectionStatementProcessor
	 * @function
	 *
	 * @description
	 * The estimateMainLineItemSelectionStatementProcessor for Line item selection statement depending on their type.
	 */
	angular.module('estimate.main').factory('estimateMainLineItemSelectionStatementProcessor', [
		'platformRuntimeDataService',
		function (platformRuntimeDataService) {

			let service = {};

			service.processItem = function processItem(lineItemSelStatement) {
				if (!(lineItemSelStatement && angular.isDefined(lineItemSelStatement.EstLineItemSelStatementType))) {
					readOnly(lineItemSelStatement, true);
					return '';
				}

				switch (lineItemSelStatement.EstLineItemSelStatementType) {
					case 0: // This is a position
						break;
					case 1: // This is a folder
						readOnly(lineItemSelStatement, true);
						break;
				}
			};

			function readOnly(item, isReadOnly){
				let fields = [];
				_.forOwn(item, function(value, key) {
					if ('IsExecute, Code, DescriptionInfo'.indexOf(key) === -1){
						let field = {field: key , readonly: isReadOnly};
						fields.push(field);
					}
				});
				platformRuntimeDataService.readonly(item, fields);
			}

			return service;

		}]);
})();
