/**
 * Created by chi on 6/1/2016.
 */
(function(angular) {
	'use strict';

	angular.module('constructionsystem.master').factory('constructionSystemMasterParameter2TemplateValidationService', constructionSystemMasterParameter2TemplateValidationService);
	constructionSystemMasterParameter2TemplateValidationService.$inject = ['constructionSystemMasterParameterReadOnlyProcessor','constructionSystemMasterParameter2TemplateDataService'];
	function constructionSystemMasterParameter2TemplateValidationService(constructionSystemMasterParameterReadOnlyProcessor,constructionSystemMasterParameter2TemplateDataService) {
		var service = {};

		service.validateCosDefaultTypeFk = validateCosDefaultTypeFk;

		return service;

		// /////////////////////////////////
		function validateCosDefaultTypeFk(entity, value, model) {
			entity[model] = value;
			if (!(value === 3 || value === 4)) {
				var quantityqueryinfo = entity.QuantityQueryInfo;
				if (quantityqueryinfo) {
					entity.QuantityQueryInfo.Description=null;
					if(quantityqueryinfo.DescriptionTr){
						entity.TranslationTrToDelete=quantityqueryinfo.DescriptionTr;
						entity.QuantityQueryInfo.DescriptionModified=true;
						entity.QuantityQueryInfo.DescriptionTr=null;
						entity.QuantityQueryInfo.Modified=true;
						entity.QuantityQueryInfo.Translated=null;
						entity.QuantityQueryTranslationList = [];
						// var basicsQuantityQueryEditorService=$injector.get('basicsQuantityQueryEditorService');
						// if(!!basicsQuantityQueryEditorService&&!!basicsQuantityQueryEditorService.currentCosMasterParameter2TemplateQuantityQueryTranslationEntity){
						//      basicsQuantityQueryEditorService.currentCosMasterParameter2TemplateQuantityQueryTranslationEntity=null;
						//    //basicsQuantityQueryEditorService.selectedCosMasterParameter2TemplateLanguageId = basicsQuantityQueryEditorService.defaultLanguageId;
						//    var constructionSystemQuantityQueryEditorControllerService=$injector.get('constructionSystemQuantityQueryEditorControllerService');
						//     if(!!constructionSystemQuantityQueryEditorControllerService){
						//        if(!constructionSystemQuantityQueryEditorControllerService.onLanguageSelectionChanged){
						//           constructionSystemQuantityQueryEditorControllerService=constructionSystemQuantityQueryEditorControllerService.createService();
						//     }
						//     constructionSystemQuantityQueryEditorControllerService.onLanguageSelectionChanged.fire(basicsQuantityQueryEditorService.selectedCosMasterParameter2TemplateLanguageId,
						//       'cosParameter2Template');
						//   }
						// }
					}
				}
			}
			constructionSystemMasterParameterReadOnlyProcessor.processItem(entity);
			constructionSystemMasterParameter2TemplateDataService.fireDefaultTypeChanged();
			return true;
		}
	}
})(angular);