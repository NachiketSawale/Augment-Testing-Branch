/**
 * Created by baf on 03.05.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentControllingUnitValidationService
	 * @description provides validation methods for resource equipment controllingUnit entities
	 */
	angular.module(moduleName).service('resourceEquipmentControllingUnitValidationService', ResourceEquipmentControllingUnitValidationService);

	ResourceEquipmentControllingUnitValidationService.$inject = ['_', '$q','$http','platformValidationServiceFactory', 'resourceEquipmentConstantValues', 'resourceEquipmentControllingUnitDataService', 'platformRuntimeDataService', 'basicsLookupdataLookupDescriptorService', 'platformDataValidationService'];

	function ResourceEquipmentControllingUnitValidationService(_, $q,$http,platformValidationServiceFactory, resourceEquipmentConstantValues, resourceEquipmentControllingUnitDataService, platformRuntimeDataService, basicsLookupdataLookupDescriptorService, platformDataValidationService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(resourceEquipmentConstantValues.schemes.controllingUnit, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceEquipmentConstantValues.schemes.controllingUnit)
		}, self, resourceEquipmentControllingUnitDataService);

		var originControllingUnitFn = self.validateControllingUnitFk ? self.validateControllingUnitFk : _.noop;
		self.validateControllingUnitFk = function (entity, value, model, validateService, dataService) {
			var readonly = null;
			var result = originControllingUnitFn(entity, value, model, validateService, dataService);
			//when a controlling unit is chosen projectFk and projectContext are readonly
			if (entity && !_.isNil(value) && result.valid) {
				readonly = true;
			} else {
				readonly = false;
			}

			platformRuntimeDataService.readonly(entity, [
				{
					field: 'ProjectContextFk',
					readonly: readonly
				},
				{
					field: 'ProjectFk',
					readonly: readonly
				}
			]);

			return result;
		};




		self.asyncValidateProjectContextFk = function asyncValidateProjectContextFk(entity, value, model,errorParam) {
			var defer = $q.defer();
			var id = entity.Id || 0;
			$http.get(globals.webApiBaseUrl+'resource/equipment/controllingunit/isunique?id=' + id + '&plantId=' + entity.PlantFk + '&prjContextId=' + value).then(function (result) {
				if (!result.data) {
					defer.resolve(platformDataValidationService.createErrorObject('cloud.common.uniqueValueErrorMessage', errorParam || {object: model.toLowerCase()}));
				} else {
					defer.resolve(true);
				}
			});

			return defer.promise;
		};


		var originProjectContextFn = self.validateProjectContextFk ? self.validateProjectContextFk : _.noop;
		self.validateProjectContextFk = function validateProjectContextFk(entity, value, model, validateService, dataService) {
			var result = originProjectContextFn(entity, value, model, validateService, dataService);
			var readonly = null;
			if (result.valid) {
				readonly = false;
			} else {
				readonly = true;
			}
			platformRuntimeDataService.readonly(entity, [
				{
					field: 'ControllingUnitFk',
					readonly: readonly
				},
				{
					field: 'ProjectFk',
					readonly: readonly
				}
			]);
			return result;
		};


		self.validateProjectFk = function validateProjectFk(entity, value) {
			// when a project is chosen set projectContextFk readonly
			var readonly = null;
			if (entity && value) {
				readonly = true;
			} else {
				readonly = false;
			}
			platformRuntimeDataService.readonly(entity, [{field: 'ProjectContextFk', readonly: readonly}]);
			return true;
		};

		self.asyncValidateProjectFk = function asyncValidateProjectFk(entity, value, model, validateService, dataService) {
			//get project and set the projectContext
			var value2Lookup = value ? value : 0;
			return basicsLookupdataLookupDescriptorService.getItemByKey('Project', value2Lookup,
				{
					displayMember: 'ProjectNo',
					lookupType: 'Project'
				}).then(function (projectLookupItem) {
				if (projectLookupItem) {
					entity.ProjectContextFk = projectLookupItem.ProjectContextFk;
					if (entity.ProjectContextFk) {
						platformDataValidationService.finishValidation(true, entity, value, 'ProjectContextFk', self, resourceEquipmentControllingUnitDataService);
						self.validateProjectContextFk(entity, value, 'ProjectContextFk', validateService, dataService);
					}
				}
				return true;
			});
		};
	}
})(angular);
