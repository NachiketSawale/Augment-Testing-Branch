/**
 * Created by lvy on 6/13/2018.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name constructionSystemMainObjectTemplatePropertyValidationService
	 * @description provides validation methods for instance object template property
	 */
	/* global moment, _ */
	var modulename = 'constructionsystem.main';

	angular.module(modulename).factory('constructionSystemMainObjectTemplatePropertyValidationService',
		['$injector', 'platformDataValidationService', 'basicsLookupdataLookupDescriptorService',
			function ($injector, platformDataValidationService, basicsLookupdataLookupDescriptorService) {
				var service = {};

				service.validateMdlPropertyKeyFk = function (entity, value) {
					var dataService = $injector.get('modelMainPropertyDataService');
					var items = dataService.getList();

					// entity.idString = entity.ModelFk.toString()/* + '-' + entity.ObjectFk.toString()*/ + '-' + value + '-' + entity.Id.toString();
					var result = platformDataValidationService.validateMandatoryUniqEntity(entity, value, 'MdlPropertyKeyFk', items, service, dataService);
					if (result === true || result && result.valid) {
						result = false;
						var keys = basicsLookupdataLookupDescriptorService.getData('modelAdministrationPropertyKeys');
						var item = keys ? _.find(keys, {Id: value}) : null;
						if (item) {
							entity.ValueType = item.ValueType;
							result = true;
						}
					}
					return result;
				};
				function resetValues(entity) {
					entity.PropertyValueLong = 0;
					entity.PropertyValueNumber = 0.0;
					entity.PropertyValueText = null;
					entity.PropertyValueDate = moment().set({'year': 1, 'month': 0, 'date': 1});
					entity.PropertyValueBool = false;
				}
				service.validateValue = function (entity, value) {
					resetValues(entity);
					if (entity.ValueType === 4) {
						entity.PropertyValueBool = value;
					} else if (entity.ValueType === 3) {
						entity.PropertyValueLong = value;
					} else if (entity.ValueType === 2) {
						entity.PropertyValueNumber = value;
					} else if (entity.ValueType === 1) {
						entity.PropertyValueText = value;
					} else if (entity.ValueType === 5) {
						entity.PropertyValueDate = value;
					}
					return true;
				};
				return service;
			}
		]);
})(angular);