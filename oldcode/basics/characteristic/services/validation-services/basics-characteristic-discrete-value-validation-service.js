(function (angular) {
	'use strict';
	angular.module('basics.characteristic').factory('basicsCharacteristicDiscreteValueValidationService', ['basicsCharacteristicDiscreteValueService', 'platformPropertyChangedUtil',
		function (dataService, platformPropertyChangedUtil) {
			var service = {};
			service.validateModel = function () {

			};

			service.validateIsDefault = function (entity, value, field) {
				platformPropertyChangedUtil.onlyOneIsTrue(dataService, entity, value, field);
				entity.IsDefault = value;
				dataService.isDefaultModified(entity);
			};

			return service;
		}
	]);
})(angular);
