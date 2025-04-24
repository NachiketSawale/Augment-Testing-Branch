(function (angular) {
	'use strict';

	angular.module('documents.project').factory('documentProjectRevisionValidationService', [
		'documentsProjectDocumentModuleContext','platformModuleStateService',
		function (
			documentsProjectDocumentModuleContext,platformModuleStateService
		) {

			var service = {};

			service.validateDescription = commonValidation;
			service.validateCommentText = commonValidation;
			service.validateBarCode = commonValidation;

			function commonValidation() {
				triggerLeadingServiceModifyItem();
				return true;
			}

			function triggerLeadingServiceModifyItem() {
				var parentService = documentsProjectDocumentModuleContext.getConfig().parentService;
				if(parentService !== undefined){
					//if only change the project document information then not need to save the header
					//when click the save button in header container just trigger to save the document action
					var parentState = platformModuleStateService.state(parentService.getModule());
					if(parentState && parentState.modifications){
						parentState.modifications.EntitiesCount += 1;
					}
				}
			}

			return service;
		}
	]);

})(angular);