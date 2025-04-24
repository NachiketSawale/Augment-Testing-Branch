(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.header';
	/**
	 * @ngdoc service
	 * @name productionplanningHeaderProcessor
	 * @function
	 * @requires
	 *
	 * @description
	 * productionplanningHeaderProcessor is the service to process data in PPS Header entity
	 *
	 */
	angular.module(moduleName).service('productionplanningHeaderProcessor', Processor);

	Processor.$inject = ['platformRuntimeDataService', 'productionplanningHeaderStatusLookupService', 'basicsCompanyNumberGenerationInfoService',
		'ppsCommonCodGeneratorConstantValue', 'basicsLookupdataLookupDescriptorService'];

	function Processor(platformRuntimeDataService, productionplanningHeaderStatusLookupService, basicsCompanyNumberGenerationInfoService,
					   ppsCommonCodGeneratorConstantValue, basicsLookupdataLookupDescriptorService) {

		this.processItem = function processItem(item) {
			let statusList = productionplanningHeaderStatusLookupService.getList();
			let headerTypeList = basicsLookupdataLookupDescriptorService.getData('basics.customize.ppsheadertype');
			let status = _.find(statusList, {Id: item.HeaderStatusFk});
			if(status && status.Backgroundcolor) {
				item.Status = status;
				item.BackgroundColor = status.Backgroundcolor;
			}

			item.HeaderType = _.find(headerTypeList, {Id: item.HeaderTypeFk});

			setColumnReadOnly(item, 'IsLive', true);
			var categoryId = ppsCommonCodGeneratorConstantValue.CategoryConstant.PpsHeaderCat;
			if(item.Version === 0  && categoryId > 0 &&  basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('ppsHeaderNumberInfoService').hasToGenerateForRubricCategory(categoryId))
			{
				item.Code = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('ppsHeaderNumberInfoService').provideNumberDefaultText(categoryId, item.Code);
				setColumnReadOnly(item, 'Code', true);
				item.HasToGenerateHeaderCode = true;
			}
			else {
				setColumnReadOnly(item, 'Code', false);
			}
		};

		function setColumnReadOnly(item, column, flag) {
			var fields = [
				{field: column, readonly: flag}
			];
			platformRuntimeDataService.readonly(item, fields);
		}

	}

})(angular);