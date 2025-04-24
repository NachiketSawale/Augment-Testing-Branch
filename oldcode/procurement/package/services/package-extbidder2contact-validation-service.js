/**
 * Created by jie on 2024.08.23
 */
(function (angular) {
	'use strict';
	/* global _ */

	angular.module('procurement.package').factory('packageExtBidder2ContactValidationService',
		['$translate',
			'packageExtBidder2ContactDataService',
			'basicsLookupdataLookupDescriptorService',
			'platformRuntimeDataService',
			'platformDataValidationService',
			'$http',
			'globals',
			'$q',
			function ($translate,
				dataService,
				basicsLookupdataLookupDescriptorService,
				platformRuntimeDataService,
				platformDataValidationService,
				$http,
				globals,
				$q) {
				function constructor(dataService) {
					var service = {};
					service.validateBpdContactFk = (entity, value, model) => {
						entity[model] = value;

						var itemList = dataService.getList();
						var result = {apply: true, valid: true};
						result = platformDataValidationService.isUniqueAndMandatory(itemList, 'BpdContactFk', entity.BpdContactFk, entity.Id, {object: 'BpdContactFk'.toLowerCase()});
						platformRuntimeDataService.applyValidationResult(result, entity, 'BpdContactFk');
						platformDataValidationService.finishValidation(result, entity, entity.BpdContactFk, 'BpdContactFk', service, dataService);
						var contact = _.find(basicsLookupdataLookupDescriptorService.getData('contact'), {Id: value});
						if(contact){
							entity.BpdContactRoleFk = contact.ContactRoleFk;
						}

						return result;
					};

					return service;
				}
				var validationServiceCache = {};

				function getExtBidder2ContactValidationService(option) {
					var moduleName = option.moduleName;
					if (!validationServiceCache.hasOwnProperty(moduleName)) {
						validationServiceCache[moduleName] = constructor.apply(null, [option.service]);
					}
					return validationServiceCache[moduleName];
				}

				return {
					getExtBidder2ContactValidationService: getExtBidder2ContactValidationService
				};
			}
		]);
})(angular);
