/**
 * Created by rajib on 11/9/2017
 */

(function (angular) {

	'use strict';
	var moduleName = 'scheduling.template';

	/**
	 * @ngdoc controller
	 * @name schedulingTemplateActivityTemplateDocumentDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of scheduling template activitytemplatedocument entities.
	 **/
	angular.module(moduleName).controller('schedulingTemplateActivityTemplateDocumentDetailController', SchedulingTemplateActivityTemplateDocumentDetailController);

	SchedulingTemplateActivityTemplateDocumentDetailController.$inject = ['$scope', 'platformContainerControllerService', 'basicsCommonUploadDownloadControllerService', 'schedulingTemplateDocumentService'];

	function SchedulingTemplateActivityTemplateDocumentDetailController($scope, platformContainerControllerService, basicsCommonUploadDownloadControllerService, schedulingTemplateDocumentService) {
		platformContainerControllerService.initController($scope, moduleName, '680410db44fb436282e502f7d386c64c', 'schedulingTemplateTranslationService');
		basicsCommonUploadDownloadControllerService.initDetail($scope, schedulingTemplateDocumentService);
	}

})(angular);