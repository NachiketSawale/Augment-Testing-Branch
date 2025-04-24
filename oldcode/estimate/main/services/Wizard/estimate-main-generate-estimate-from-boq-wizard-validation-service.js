/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainGenerateEstimateFromBoqWizardValidationService
	 * @description provides validation methods for grid in wizard
	 */

	angular.module(moduleName).factory('estimateMainGenerateEstimateFromBoqWizardValidationService',
		['_', '$injector', 'platformDataValidationService', 'estimateMainGenerateEstimateFromBoqWizardDetailService','platformRuntimeDataService',
			function (_, $injector, platformDataValidationService, estimateMainGenerateEstimateFromBoqWizardDetailService,runtimeDataService) {

				let service = {};

				angular.extend(service, {
					validateProjectWicId: validateProjectWicId,
					validateRootItemId: validateRootItemId,
					validateEstHeaderId: validateEstHeaderId,
					validGridItems : validGridItems
				});

				function validateProjectWicId(entity, value, field) {
					return platformDataValidationService.validateMandatory(entity, value, field, service, estimateMainGenerateEstimateFromBoqWizardDetailService);
				}

				function validateRootItemId(entity, value, field) {
					return platformDataValidationService.validateMandatory(entity, value, field, service, estimateMainGenerateEstimateFromBoqWizardDetailService);
				}

				function validateEstHeaderId(entity, value, field) {
					return platformDataValidationService.validateMandatory(entity, value, field, service, estimateMainGenerateEstimateFromBoqWizardDetailService);
				}

				function validGridItems(selectedItem,itemDetailList){
					let fields = ['ProjectWicId', 'RootItemId', 'EstHeaderId'];

					if(itemDetailList.length > 0){
						angular.forEach(itemDetailList, function (item) {
							if(item !== selectedItem){
								angular.forEach(fields, function (field) {
									if (runtimeDataService.hasError(item, field) && !platformDataValidationService.isEmptyProp(item[field])){
										switch(fields.indexOf(field)){
											case 0 : {
												validateProjectWicId(item, item.ProjectWicId, field);
											}
												break;
											case 1 : {
												validateRootItemId(item, item.RootItemId, field);
											}
												break;
											case 2 : {
												if(item.Type === 1) {
													validateEstHeaderId(item, item.EstHeaderId, field);
												}
											}
												break;
										}
									}
								});
							}
						});
					}
				}

				return service;
			}]);

})(angular);


