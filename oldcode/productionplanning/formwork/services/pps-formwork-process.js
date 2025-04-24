(function (angular) {
	'use strict';
	/* global angular, _ */
	var moduleName = 'productionplanning.formwork';

	angular.module(moduleName).factory('ppsFormworkProcessor', processor);

	processor.$inject = ['platformRuntimeDataService', 'ppsCommonCodGeneratorConstantValue', 'basicsCompanyNumberGenerationInfoService', 'basicsLookupdataLookupDescriptorService'];

	function processor(platformRuntimeDataService, ppsCommonCodGeneratorConstantValue, basicsCompanyNumberGenerationInfoService, basicsLookupdataService) {
		var service = {};

		service.processItem = function (item) {
		  if(item.Version === 0 && !_.isNil(item.FormworkTypeFk)){
		      var formworkType = basicsLookupdataService.getLookupItem('FormworkType', item.FormworkTypeFk);
			  var categoryId = _.isNil(formworkType)?   null : formworkType.RubricCategoryFk;
			  if( categoryId !== null &&  basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('ppsFormworkNumberInfoService').hasToGenerateForRubricCategory(categoryId) ){
				  item.Code = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('ppsFormworkNumberInfoService').provideNumberDefaultText(categoryId);
				  service.setColumnsReadOnly(item, ['Code'], true);
			  }
			  else {
				  service.setColumnsReadOnly(item, ['Code'], false);
			  }
		  }
		};

		service.setColumnsReadOnly = function setColumnsReadOnly(item, columns, flag) {
			var fields = [];
			_.each(columns, function (column) {
				fields.push({field: column, readonly: flag});
			});
			platformRuntimeDataService.readonly(item, fields);
		};

		return service;
	}
})(angular);