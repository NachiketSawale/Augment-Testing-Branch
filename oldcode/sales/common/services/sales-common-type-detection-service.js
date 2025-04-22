/**
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {

	'use strict';
	var salesCommonModule = 'sales.common';

	/**
	 * @ngdoc service
	 * @name salesCommonTypeDetectionService
	 * @description provides helper functions for checking the type of sales entities, e.g. framework contract call off
	 */
	angular.module(salesCommonModule).service('salesCommonTypeDetectionService', ['_',
		function (_) {
			var service = {
				bid: {},
				contract: {},
				wip: {},
				billing: {},
			};

			// TODO: add bid types detection

			// framework contracts
			service.contract.isFrameworkContract = function isFrameworkContract(contractHeader) {
				return contractHeader.IsFramework && _.isNil(contractHeader.OrdHeaderFk) && _.isNil(contractHeader.PrjChangeFk);
			};

			service.contract.isFrameworkContractCallOff = function isFrameworkContractCallOff(contractHeader) {
				return (contractHeader.IsMainContractFramework && !_.isNil(contractHeader.OrdHeaderFk) && _.isNil(contractHeader.PrjChangeFk))
					|| (!_.isNil(contractHeader.BoqWicCatFk));
			};

			// basic contracts
			service.contract.isSalesOrder = function isSalesOrder(contractHeader) {
				return _.isNil(contractHeader.OrdHeaderFk) && _.isNil(contractHeader.PrjChangeFk);
			};

			service.contract.isChangeOrder = function isChangeOrder(contractHeader) {
				return !_.isNil(contractHeader.OrdHeaderFk) && !_.isNil(contractHeader.PrjChangeFk);
			};

			service.contract.isCallOffOrder = function isCallOffOrder(contractHeader) {
				return !_.isNil(contractHeader.OrdHeaderFk) && _.isNil(contractHeader.PrjChangeFk);
			};

			// TODO: add wip types detection

			// TODO: add bill types detection

			return service;
		}
	]);
})();
