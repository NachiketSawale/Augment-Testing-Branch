
(function (angular) {
	'use strict';
	var moduleName = 'project.inforequest';

	/**
	 * @ngdoc service
	 * @name projectInfoRequestProcessorService
	 * @description processes items sent from server regarding data specific write protection of properties
	 */
	angular.module(moduleName).service('projectInfoRequestProcessorService', ProjectInfoRequestProcessorService);

	ProjectInfoRequestProcessorService.$inject = ['platformRuntimeDataService', 'basicsCompanyNumberGenerationInfoService'];

	function ProjectInfoRequestProcessorService(platformRuntimeDataService, basicsCompanyNumberGenerationInfoService) {
		var self = this;

		self.processItem = function processItem(item) {
			if (item.Version === 0 && basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('projectInfoRequestNumberInfoService').hasToGenerateForRubricCategory(item.RubricCategoryFk)) {
				item.Code = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('projectInfoRequestNumberInfoService').provideNumberDefaultText(item.RubricCategoryFk, item.Code);
				var fields = [];
				fields.push({field: 'Code', readonly: true});
				platformRuntimeDataService.readonly(item, fields);
			}
		};
	}

})(angular);
