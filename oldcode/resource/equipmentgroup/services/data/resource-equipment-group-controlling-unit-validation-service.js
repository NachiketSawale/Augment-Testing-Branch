/**
 * Created by baf on 02.05.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupControllingUnitValidationService
	 * @description provides validation methods for resource equipmentGroup controllingUnit entities
	 */
	angular.module(moduleName).service('resourceEquipmentGroupControllingUnitValidationService', ResourceEquipmentGroupControllingUnitValidationService);

	ResourceEquipmentGroupControllingUnitValidationService.$inject = ['_', '$injector','$q','$http', 'platformValidationServiceFactory', 'resourceEquipmentGroupConstantValues', 'resourceEquipmentGroupControllingUnitDataService', 'platformRuntimeDataService', 'basicsLookupdataLookupDescriptorService', 'platformDataValidationService'];

	function ResourceEquipmentGroupControllingUnitValidationService(_, $injector,$q,$http, platformValidationServiceFactory, resourceEquipmentGroupConstantValues, resourceEquipmentGroupControllingUnitDataService, platformRuntimeDataService, basicsLookupdataLookupDescriptorService, platformDataValidationService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(resourceEquipmentGroupConstantValues.schemes.groupControllingUnit, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceEquipmentGroupConstantValues.schemes.groupControllingUnit)
		}, self, resourceEquipmentGroupControllingUnitDataService);

		var originControllingUnitFn = self.validateControllingUnitFk ? self.validateControllingUnitFk : _.noop;
		self.validateControllingUnitFk = function (entity, value, model, validateService, dataService) {
			var result = originControllingUnitFn(entity, value, model, validateService, dataService);
			//when a controlling unit is chosen projectFk and projectContext are readonly
			var readonly = (entity && !_.isNil(value) && result.valid);

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

		self.asyncValidateControllingUnitFk = function (entity, value /*, model*/) {
			return $injector.get('controllingStructureMainService').asyncGetById(value).then(function (controllingUnit) {
				entity.ProjectFk = controllingUnit.ProjectFk;
				return true;
			});
		};

		var originProjectContextFn = self.validateProjectContextFk ? self.validateProjectContextFk : _.noop;
		self.validateProjectContextFk = function validateProjectContextFk(entity, value, model, validateService, dataService) {
			var result = originProjectContextFn(entity, value, model, validateService, dataService);
			var readonly = !result.valid;

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


		self.asyncValidateProjectContextFk = function asyncValidateProjectContextFk(entity, value, model,errorParam) {
			var defer = $q.defer();
			var id = entity.Id || 0;
			$http.get(globals.webApiBaseUrl+'resource/equipmentgroup/controllingunit/isunique?id=' + id + '&plantGroupId=' + entity.PlantGroupFk + '&prjContextId=' + value).then(function (result) {
				if (!result.data) {
					defer.resolve(platformDataValidationService.createErrorObject('cloud.common.uniqueValueErrorMessage', errorParam || {object: model.toLowerCase()}));
				} else {
					defer.resolve(true);
				}
			});

			return defer.promise;
		};


		self.validateProjectFk = function validateProjectFk(entity, value) {
			// when a project is chosen set projectContextFk readonly
			var readonly = !!entity && !!value;

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
						platformDataValidationService.finishValidation(true, entity, value, 'ProjectContextFk', self, resourceEquipmentGroupControllingUnitDataService);
						self.validateProjectContextFk(entity, value, 'ProjectContextFk', validateService, dataService);
					}
				}
				return true;
			});
		};

	}
})(angular);
