/**
 * Created by pel on 2022/08/23
 */
(function (angular) {
	'use strict';
	var moduleName = 'documents.project';
	var projectMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name documentProjectChangeRubricCategoryService
	 * @function
	 *
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	projectMainModule.service('documentProjectChangeRubricCategoryService', documentProjectChangeRubricCategoryService);

	documentProjectChangeRubricCategoryService.$inject = ['globals','$q', '$injector', '$translate', '$http',
		'platformTranslateService', 'platformModalService', 'documentsProjectDocumentDataService','_'];
	function documentProjectChangeRubricCategoryService(globals,$q, $injector, $translate, $http,
		platformTranslateService,platformModalService, documentsProjectDocumentDataService,_) {

		var service = {},self = this;

		service.execute = function (moduleName) {

			var modalOptions = {
				headerTextKey: 'Change Rubric Category',
				templateUrl: globals.appBaseUrl + 'documents.project/partials/change-rubric-category-template.html',
				iconClass: 'ico-warning'
			};
			modalOptions.getDataService = function () {
				return documentsProjectDocumentDataService.getService({moduleName: moduleName});
			};
			var documentDataService =modalOptions.getDataService();
			var selectedDoc = documentDataService.getSelected();

			if(_.isNil(selectedDoc)){
				var message = $translate.instant('cloud.common.noCurrentSelection');
				platformModalService.showMsgBox(message,  'Info', 'ico-info');
			}else{
				var rootScope = $injector.get('$rootScope');
				if(rootScope.currentModule === moduleName){
					platformModalService.showDialog(modalOptions).then(function (result) {
						if(result){
							self.handleOk(result);
						}
					});
				}

			}
		};

		return service;
	}
})(angular);
