/**
 * Created by shen on 7/14/2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc service
	 * @name logisticJobReadonlyValidationService
	 * @description provides validation methods for logistic job readonly entities
	 */
	angular.module(moduleName).service('logisticJobReadonlyProcessorService', logisticJobReadonlyProcessorService);

	logisticJobReadonlyProcessorService.$inject = ['platformRuntimeDataService', 'platformDataServiceConfiguredReadonlyExtension', 'basicsCompanyNumberGenerationInfoService'];

	function logisticJobReadonlyProcessorService(platformRuntimeDataService, platformDataServiceConfiguredReadonlyExtension, basicsCompanyNumberGenerationInfoService) {
		var self = this;

		self.processItem = function (item) {
			if (item.IsReadOnly) {
				platformRuntimeDataService.readonly(item, true);
			} else {
				var fields = [
					{
						field: 'CompanyFk',
						readonly: true
					},
					{
						field: 'RubricCategoryFk',
						readonly: true
					},
					{
						field: 'DivisionFk',
						readonly: true
					},
					{
						field: 'ProjectFk',
						readonly: item.Version > 0
					},
					{
						field: 'EtmPlantComponentFk',
						readonly: item.PlantFk === null
					},
					{
						field: 'BillingJobFk',
						readonly: !item.IsJointVenture
					},
					{
						field: 'HasLoadingCost',
						readonly: !item.IsLoadingCostForBillingType
					}
					/*
					{
						 field: 'JobTypeFk',
						 readonly:item.Version > 0
					}

					 */
				];
				if (item.Version >= 1) {
					fields.push({field: 'JobTypeFk', readonly: true});
				}

				if (item.Version === 0 && basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('logisticJobNumberInfoService').hasToGenerateForRubricCategory(item.RubricCategoryFk)) {
					item.Code = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('logisticJobNumberInfoService').provideNumberDefaultText(item.RubricCategoryFk, item.Code);
					fields.push({field: 'Code', readonly: true});
				}

				platformDataServiceConfiguredReadonlyExtension.overrideReadOnlyProperties('Logistic.Job', 'Job', fields);

				platformRuntimeDataService.readonly(item, fields);
			}
		};
	}
})(angular);
