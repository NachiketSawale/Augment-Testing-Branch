/**
 * Created by zwz on 2024/5/22.
 */
(function () {
	'use strict';
	/*global angular*/

	const moduleName = 'productionplanning.ppsmaterial';
	angular.module(moduleName).service('ppsMaterialToMdlProductTypeValidationService', [
		'platformValidationServiceFactory',
		'platformDataValidationService',
		'basicsLookupdataLookupDescriptorService',
		'ppsMaterialToMdlProductTypeDataService',
		function (platformValidationServiceFactory,
			platformDataValidationService,
			basicsLookupdataLookupDescriptorService,
			dataService) {
			let self = this;
			platformValidationServiceFactory.addValidationServiceInterface({
				typeName: 'PpsMaterial2MdlProductTypeDto',
				moduleSubModule: 'ProductionPlanning.PpsMaterial'
			}, {
				mandatory: ['ProductCategory', 'PpsMaterialFk']
			},
				self,
				dataService);

			self.validatePpsMaterialFk = function (entity, value, model) {
				// sync field ProductionMode
				if (value > 0) {
					basicsLookupdataLookupDescriptorService.loadItemByKey('ppsmaterialLookupDataService', value).then(function (ppsMaterialItem) {
						if(ppsMaterialItem){
							entity.ProductionMode = ppsMaterialItem.IsSerialProduction ? 'MP' : 'AP';
							dataService.gridRefresh();
						}
					});
				}

				return platformDataValidationService.validateMandatory(entity, value, model, self, dataService);
			};

		}]);
})();