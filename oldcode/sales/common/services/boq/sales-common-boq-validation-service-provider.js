/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	var salesCommonModule = 'sales.common';

	/**
	 * @ngdoc service
	 * @name salesCommonBoqValidationServiceProvider
	 * @description provides boq validation services for common modules
	 */
	angular.module(salesCommonModule).factory('salesCommonBoqValidationServiceProvider', ['platformDataValidationService',
		function (platformDataValidationService) {

			var ValidationServiceProvider = function (mainService) {
				var self = this;

				this.validateBoqRootItem$Reference = function (entity, value) {
					var items = mainService.getList();

					return platformDataValidationService.validateMandatoryUniqEntity(entity, value, 'BoqRootItem.Reference', items, self, mainService);
				};
			};

			// service api
			return {
				getInstance: function getInstance(mainService) {
					return new ValidationServiceProvider(mainService);
				}
			};
		}

	]);

})();
