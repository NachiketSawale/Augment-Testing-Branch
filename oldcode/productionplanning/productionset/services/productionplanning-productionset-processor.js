(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.productionset';
	/**
	 * @ngdoc service
	 * @name productionplanningProductionsetProcessor
	 * @function
	 * @requires
	 *
	 * @description
	 *
	 *
	 */
	angular.module(moduleName).service('productionplanningProductionsetProcessor', Processor);

	Processor.$inject = ['productionplanningProductionsetStatusLookupService', 'basicsCompanyNumberGenerationInfoService', 'ppsCommonCodGeneratorConstantValue', 'platformRuntimeDataService'];

	function Processor(productionplanningProductionsetStatusLookupService, basicsCompanyNumberGenerationInfoService, ppsCommonCodGeneratorConstantValue, platformRuntimeDataService) {

		this.processItem = function processItem(item) {
			var statusList = productionplanningProductionsetStatusLookupService.getList();
			var status = _.find(statusList, {Id: item.PpsProdSetStatusFk});
			if(status.BackgroundColor) {
				item.BackgroundColor = status.BackgroundColor;
			}
			if(item.Version === 0){
				var categoryId = ppsCommonCodGeneratorConstantValue.getCategoryFkviaEventType(item.EventTypeFk, ppsCommonCodGeneratorConstantValue.PpsEntityConstant.PPSProductionSet);
				if( categoryId !== null &&  basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('ppsProductionSetNumberInfoService').hasToGenerateForRubricCategory(categoryId) )
				{
					item.Code = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('ppsProductionSetNumberInfoService').provideNumberDefaultText(categoryId);
					platformRuntimeDataService.readonly(item, [{field: 'Code', readonly: true}]);
				}
			}
			else{
				platformRuntimeDataService.readonly(item, [{field: 'Code', readonly: false}]);
			}
		};
	}

})(angular);