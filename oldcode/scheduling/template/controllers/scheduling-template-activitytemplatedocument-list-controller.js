/**
 * Created by rajib on 11/9/2017
 */

(function (angular) {
	'use strict';
	var moduleName = 'scheduling.template';

	/**
	 * @ngdoc controller
	 * @name schedulingTemplateActivityTemplateDocumentListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of scheduling template activitytemplatedocument entities.
	 **/

	angular.module(moduleName).controller('schedulingTemplateActivityTemplateDocumentListController', SchedulingTemplateActivityTemplateDocumentListController);

	SchedulingTemplateActivityTemplateDocumentListController.$inject = ['$scope', 'platformContainerControllerService', 'basicsCommonUploadDownloadControllerService', 'schedulingTemplateDocumentService'];

	function SchedulingTemplateActivityTemplateDocumentListController($scope, platformContainerControllerService, basicsCommonUploadDownloadControllerService, schedulingTemplateDocumentService) {
		platformContainerControllerService.initController($scope, moduleName, 'e573dacc1e3c4a60aee6043ea736dfdf');
		basicsCommonUploadDownloadControllerService.initGrid($scope, schedulingTemplateDocumentService);
	}
})(angular);