/*
 * $Id: basics-common-date-processor.js 474270 2019-07-08 waldrop $
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	angular.module('basics.common').factory('basicsCommonBulkEditProcessor', ['_', function (_) {

		const service = {};

		service.removeOperands = function removeOperands(bulkConfig, entityIdentifier) {

			switch (entityIdentifier) {
				case 'estimate.main.estlineitems':
					removePrcPackageOperand(bulkConfig);
					break;
				case '':
					break;// for future uses
				default:
					break;
			}
		};

		function removePrcPackageOperand(prcPackage) {

			if (Object.prototype.hasOwnProperty.call(prcPackage, 'BulkGroup')) {
				_.each(prcPackage.BulkGroup, function (bulkArray) {
					if (bulkArray && bulkArray.length > 0) {
						_.each(bulkArray, function (childrenArray) {
							if (Object.prototype.hasOwnProperty.call(childrenArray, 'Children') && childrenArray.Children.length > 0) {
								_.each(childrenArray.Children, function (child) {
									if (Object.prototype.hasOwnProperty.call(child, 'Operands')) {
										_.each(child.Operands, function (operand) {
											if (Object.prototype.hasOwnProperty.call(operand, 'Literal')) {
												operand.Literal = null;
											}
										});
									}
								});
							}
						});
					}
				});
			}
		}

		return service;
	}]);
})(angular);
