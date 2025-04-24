/**
 * Created by nitsche on 21.10.2022
 */

(function (angular) {
	'use strict';
	let myModule = angular.module('project.group');

	/**
	 * @ngdoc service
	 * @name projectGroupProjectGroupValidationService
	 * @description provides validation methods for resource equipment ProjectGroup entities
	 */
	myModule.service('projectGroupProjectGroupValidationService', ProjectGroupProjectGroupValidationService);

	ProjectGroupProjectGroupValidationService.$inject = ['_', 'platformDataValidationService', 'platformValidationServiceFactory', 'projectGroupConstantValues', 'projectGroupProjectGroupDataService'];

	function ProjectGroupProjectGroupValidationService(_, platformDataValidationService, platformValidationServiceFactory, projectGroupConstantValues, projectGroupProjectGroupDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(
			projectGroupConstantValues.schemes.projectGroup,
			{
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(projectGroupConstantValues.schemes.projectGroup)
			},
			self,
			projectGroupProjectGroupDataService);

		this.validateIsDefault = function validateIsDefault(entity, value /* , model */) {
			if (value) {
				var items = projectGroupProjectGroupDataService.getList();

				_.forEach(items, function(item) {
					let notify = item.IsDefault;
					item.IsDefault = false;
					item.IsDefaultHasBeenChecked = false;
					if(notify) {
						projectGroupProjectGroupDataService.fireItemModified(item);
					}
				});

				entity.IsDefaultHasBeenChecked = true;
			}

			return {valid: true, apply: true};
		};

		this.validateAdditionalCode = function validateAdditionalCode(entity, value) {
			var parent = projectGroupProjectGroupDataService.getItemById(entity.ProjectGroupFk);
			var parentPath = _.isNil(parent) ? '\\' : parent.UncPath + '\\';
			entity.UncPath = parentPath + value;
		};

		this.validateITwoBaselineServerFk = function validateITwoBaselineServerFk(entity, value, model)
		{
			if(!entity.IsAutoIntegration) {
				return true;
			}

			if(value !== entity.ITwoBaselineServerFk) {
				entity.DefaultTemplateProjectFk = null;
			}

			return platformDataValidationService.validateMandatory(entity, value, model, self, projectGroupProjectGroupDataService);
		};
	}
})(angular);