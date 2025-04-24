/**
 * Created by lnt on 11/1/2017.
 */
(function (angular) {

	'use strict';

	/* globals _ */

	var moduleName = 'qto.main';
	var qtoMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name qtoMainSearchDetailDialogValidationService
	 * @description provides validation methods for qto details
	 */
	qtoMainModule.factory('qtoMainSearchDetailDialogValidationService',
		['$translate', '$injector', 'platformRuntimeDataService', 'platformDataValidationService', 'qtoMainSearchDataDetailDialogService',
			function ($translate, $injector, platformRuntimeDataService, platformDataValidationService, qtoSearchDataDetailDialogService) {

				var service = {};

				var self = this;
				self.checkMandatory = function(entity, value, model, apply, errrParam){
					var result = platformDataValidationService.isMandatory(value, model, errrParam);
					if (apply) {
						result.apply = true;
					}
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, qtoSearchDataDetailDialogService.dataService);
					return result;
				};

				service.validateBoqItemFk = function (entity, value, model, isSetList) {
					let qtoBoqList = $injector.get('basicsLookupdataLookupDescriptorService').getData('boqItemLookupDataService');
					let item = _.find(qtoBoqList, {Id: value});
					let result;
					if (value === null || value === 0) {
						value = null;
					}
					else if (item && item.BoqLineTypeFk === 0) {
						// if position boq contains sub quantity, can not assign qto lines to BoqItem which contains sub quantity items.
						let qtoBoqStructureService = $injector.get('qtoBoqStructureService');
						if(qtoBoqStructureService.isCrbBoq() && _.isArray(item.BoqItems) && item.BoqItems.length > 0){
							if(_.find(item.BoqItems, function(item){return item.BoqLineTypeFk === 11;}) !== null){
								result = platformDataValidationService.createErrorObject(moduleName + '.SubQuantityBoQItemsErrormsg');
								qtoSearchDataDetailDialogService.dataService.onQtoDetailBoqItemChange.fire(true);
								platformRuntimeDataService.applyValidationResult(result, entity, model);
								return result;
							}
						}
					}
					else if (item && item.BoqLineTypeFk !== 0 && item.BoqLineTypeFk !== 11) {
						result = {
							apply: true, valid: false,
							error: $translate.instant('qto.main.selectBoqItemError')
						};
						qtoSearchDataDetailDialogService.dataService.onQtoDetailBoqItemChange.fire(true);
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						return result;
					}

					result = platformDataValidationService.isMandatory(value, model);
					platformRuntimeDataService.applyValidationResult(result, entity, model);

					// set the ok button as disable
					if(!isSetList) {
						qtoSearchDataDetailDialogService.dataService.getValidation2Items();
					}

					return result;
				};

				service.validateBoqItemIsSameUom = function(entity, value, model)
				{
					let result = { apply: true, valid: true, error: '' };
					if(!entity.IsSameUom){
						result = {
							apply: true, valid: false,
							error: $translate.instant('qto.main.wizard.wizardDialog.copyQtoLineWarnning')
						};

						qtoSearchDataDetailDialogService.dataService.onQtoDetailBoqItemChange.fire(true);

						platformRuntimeDataService.applyValidationResult(result, entity, model);
					}

					return result;
				};

				return service;
			}
		]);

})(angular);
