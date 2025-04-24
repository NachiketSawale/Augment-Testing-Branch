/**
 * Created by Cakıral on 06.08.2020
 */


(function (angular) {
	'use strict';
	let cardModule = angular.module('project.main');

	cardModule.service('projectMainBillToReadOnlyProcessor', ProjectMainBillToReadOnlyProcessor);

	ProjectMainBillToReadOnlyProcessor.$inject = ['platformRuntimeDataService', 'basicsCompanyNumberGenerationInfoService', 'projectMainService'];

	function ProjectMainBillToReadOnlyProcessor(platformRuntimeDataService, basicsCompanyNumberGenerationInfoService, projectMainService) {
		this.processItem = function processCardEntity(billToEntity) {

			platformRuntimeDataService.readonly(billToEntity, [
				{field: 'SubsidiaryFk', readonly: !billToEntity.BusinessPartnerFk}]);
			let selected = projectMainService.getSelected();
			if (billToEntity.Version === 0 ) {
				let fields = [];
				let selected = projectMainService.getSelected();
				if(selected.RubricCategoryBillToFk!= null && basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('projectBillToNumberInfoService').hasToGenerateForRubricCategory(selected.RubricCategoryBillToFk)){
					billToEntity.Code = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('projectBillToNumberInfoService').provideNumberDefaultText(selected.RubricCategoryBillToFk, billToEntity.Code);
					fields.push({field: 'Code', readonly: true});

					platformRuntimeDataService.readonly(billToEntity, fields);
				}
			}

			if (billToEntity.Version > 0) {
				platformRuntimeDataService.readonly(billToEntity, [{ field: 'Code', readonly: true }]);
			}

			if (selected.IsPercentageBased === false) {
				platformRuntimeDataService.readonly(billToEntity, [{ field: 'QuantityPortion', readonly: true }]);
			}
		};


	}
})(angular);
