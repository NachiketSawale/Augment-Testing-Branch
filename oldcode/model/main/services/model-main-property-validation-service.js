/**
 * Created by Frank Baedeker on 15.01.2016.
 */

(function (angular) {
	'use strict';
	/* global moment */
	var moduleName = 'model.main';

	/**
	 * @ngdoc service
	 * @name modelMainPropertyValidationService
	 * @description provides validation methods for model object property entities
	 */
	angular.module(moduleName).service('modelMainPropertyValidationService', ModelMainPropertyValidationService);

	ModelMainPropertyValidationService.$inject = ['platformDataValidationService', '$injector', '$http', '$q', '_',
		'modelAdministrationPropertyKeyDataService'];
	function ModelMainPropertyValidationService(platformDataValidationService, $injector, $http, $q, _,
	                                            modelAdministrationPropertyKeyDataService) {

		var service = {};

		service.asyncValidatePropertyKeyFk = function (entity, value) {
			var dataService = $injector.get('modelMainPropertyDataService');
			var items = dataService.getList();

			entity.idString = entity.ModelFk.toString()/* + '-' + entity.ObjectFk.toString()*/ + '-' + value + '-' + entity.Id.toString();
			var result = platformDataValidationService.validateMandatoryUniqEntity(entity, value, 'PropertyKeyFk', items, service, dataService);
			var checkPromise;
			if (result === true || result && result.valid) {
				result = false;
				checkPromise = modelAdministrationPropertyKeyDataService.getValueTypeByPropertyKeyId(value).then(function (valueType) {
					if (_.isNumber(valueType)) {
						entity.ValueType = valueType;
						return true;
					}
					return false;
				});
			} else {
				checkPromise = $q.resolve(false);
			}
			return checkPromise;
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
			var dataService = $injector.get('modelMainPropertyDataService');
			var propName = dataService.valueTypeToPropName(entity.ValueType);
			if (propName) {
				entity[propName] = value;
			}
			return true;
		};

		return service;
	}

})(angular);
