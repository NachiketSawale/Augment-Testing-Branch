(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/**
	 * @ngdoc service
	 * @name procurementCommonContactValidationService
	 * @description provides validation methods for contact
	 */
	angular.module('procurement.common').factory('procurementCommonContactValidationService',
		['$translate', 'basicsLookupdataLookupDescriptorService', 'platformDataValidationService', 'platformRuntimeDataService',
			function ($translate, basicsLookupdataLookupDescriptorService, platformDataValidationService, platformRuntimeDataService) {
				let serviceCache = {};
				return function (dataService) {
					let serviceName = null;
					if (dataService && dataService.getServiceName) {
						serviceName = dataService.getServiceName();
						if (serviceName && Object.prototype.hasOwnProperty.call(serviceCache, serviceName)) {
							return serviceCache[serviceName];
						}
					}

					var service = {};
					service.validateBpdContactFk = function validateBpdContactFk(entity, value, model) {
						var result = true;
						entity.BpdContactFk = value;
						if (value === 0 || value === null) {
							result = {
								apply: true,
								valid: false,
								error: '...',
								error$tr$: 'cloud.common.emptyOrNullValueErrorMessage',
								error$tr$param$: {fieldName: 'Familly Name'}
							};
						} else {
							const list = dataService.getList();
							const existItems = _.find(list, function (item) {
								return item.BpdContactFk === value && item.Id !== entity.Id;
							});
							if (existItems) {
								result = {
									apply: true,
									valid: false,
									error: '...',
									error$tr$: 'cloud.common.uniqueValueErrorMessage',
									error$tr$param$: {fieldName: 'Familly Name'}
								};
							} else {
								const contact = _.find(basicsLookupdataLookupDescriptorService.getData('contact'), {Id: value});
								entity.BpdContactRoleFk = (contact.item || contact).ContactRoleFk;
							}
						}
						platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);

						return result;
					};

					service.validateEntity = function (entity) {
						var resultBpdContact = service.validateBpdContactFk(entity, entity.BpdContactFk, 'BpdContactFk');
						platformRuntimeDataService.applyValidationResult(resultBpdContact, entity, 'BpdContactFk');
						dataService.gridRefresh();
					};

					// noinspection JSUnusedLocalSymbols
					function onEntityCreated(e, item) {
						service.validateEntity(item);
					}

					dataService.registerEntityCreated(onEntityCreated);

					serviceCache[serviceName] = service;
					return service;
				};
			}
		]);

})(angular);
