/**
 * Created by chk on 12/17/2015.
 */
/* global _ */
(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('constructionsystem.master').factory('constructionSystemMasterParameterValueValidationService',
		['$injector', 'constructionSystemMasterParameterValueDataService',
			'constructionSystemMasterValidationHelperService',
			function ($injector, dataService, validationHelperService) {
				var service = {};
				var self = this;

				self.handleDefaultItem = function (entity) {
					var entities = [];
					angular.forEach(dataService.getList(), function (item) {
						if (item.Id !== entity.Id && item.IsDefault) {
							entities.push(item);
						}
					});
					_.forEach(entities, function (item) {
						item.IsDefault = false;
						dataService.markItemAsModified(item);
					});
					dataService.gridRefresh();
				};

				service.validateIsDefault = function (entity, value) {
					self.handleDefaultItem(entity);
					dataService.markItemAsModified(entity);
					var currentItem = dataService.getSelected();
					if (currentItem && currentItem.Id !== entity.Id) {
						dataService.setSelected(entity);
					}

					var parameterDataService = $injector.get('constructionSystemMasterParameterDataService');
					parameterDataService.defaultValueChanged.fire(null, {defaultValueEntity: entity, isDefault: value});

					return true;
				};
				service.validateSorting = function (entity, value, model) {
					return validationHelperService.validateSorting(value, model);
				};

				service.validateDescriptionInfo = function validateDescriptionInfo(entity, value, model) {
					return validationHelperService.validateDescriptionInfo(entity, value, model, dataService);
				};

				service.validateQuantityQuery=function funcA(){
					return true;
				};

				// service.asyncValidateQuantityQuery=function funcA(entity, value, model){
				// console.log('123');
				// return true;
				// };

				return service;
			}]);

})(angular);