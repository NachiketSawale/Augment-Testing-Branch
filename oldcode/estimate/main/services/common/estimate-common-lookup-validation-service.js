/**
 * Created by Joshi on 21.03.2016.
 */
(function () {
	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateCommonLookupValidationService
	 * @description provides validation methods for estimate lookups
	 */
	angular.module(moduleName).factory('estimateCommonLookupValidationService',
		['_',
			function (_) {

				let service = {};

				service.addValidationAutomatically = function addValidationAutomatically(columns, validationService) {
					if (!validationService) {
						return;
					}
					_.forEach(columns, function (col) {
						let colField = col.field.replace(/\./g, '$');

						let syncName = 'validate' + colField;
						let asyncName = 'asyncValidate' + colField;

						if (validationService[syncName]) {
							col.validator = validationService[syncName];
						}

						if (validationService[asyncName]) {
							col.asyncValidator = validationService[asyncName];
						}
					});
				};

				return service;
			}
		]);
})();
