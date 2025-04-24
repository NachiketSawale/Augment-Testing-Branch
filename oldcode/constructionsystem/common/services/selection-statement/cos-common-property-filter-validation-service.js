(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.common';

	angular.module(moduleName).factory('constructionsystemCommonPropertyFilterValidationService', [
		'constructionsystemCommonFilterServiceCache',
		'constructionSystemCommonPropertyNameLookupService', 'platformDataValidationService', 'platformRuntimeDataService',
		'basicsLookupdataLookupDescriptorService','_',
		function (filterServiceCache, constructionSystemCommonPropertyNameLookupService,
			platformDataValidationService, platformRuntimeDataService, basicsLookupdataLookupDescriptorService, _) {

			return {
				createService: createService
			};

			function createService(parentServiceName) {
				var service = {};

				service.parentServiceName = parentServiceName;


				var dataService = filterServiceCache.getService('constructionsystemCommonPropertyFilterGridDataService', parentServiceName);

				service.validatePropertyId = function validatePropertyId(entity, value, model) {// jshint ignore: line
					var property = _.find(basicsLookupdataLookupDescriptorService.getData('CosPropertyKeyLookup'), {Id: value});
					entity.ValueType = property ? property.ValueType : 1;
					entity.PropertyName = property ? property.PropertyName : '';

					var result = platformDataValidationService.isMandatory(value, model);
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					return result;
				};


				service.validatePropertyValue = function validatePropertyValue(entity, value, model) {// jshint ignore: line
					var result = platformDataValidationService.isMandatory(value, model);
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					return result;
				};

				service.validateEntity = function validateEntity(entity) {
					service.validatePropertyId(entity, entity.PropertyId, 'PropertyId');
					service.validatePropertyValue(entity, entity.PropertyValue, 'PropertyValue');
				};

				var onEntityCreated = function onEntityCreated(e, entity) {
					service.validateEntity(entity);
				};
				dataService.registerEntityCreated(onEntityCreated);

				var onListLoaded = function onListLoaded() {
					var list = dataService.getList();
					angular.forEach(list, function (entity) {
						service.validateEntity(entity);
					});
				};
				dataService.registerListLoaded(onListLoaded);

				return service;
			}
		}
	]);
})(angular);