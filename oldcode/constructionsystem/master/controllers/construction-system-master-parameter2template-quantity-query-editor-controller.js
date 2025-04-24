/**
 * Created by jim on 2/28/2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('constructionSystemMasterParameter2TemplateQuantityQueryEditorController',
		['$scope','$injector', 'platformContextService',
			'basicsQuantityQueryEditorService','constructionSystemMasterParameter2TemplateDataService',
			'quantityQueryEditorControllerServiceCache','constructionSystemMainInstanceService',
			function ($scope,$injector, platformContextService,
				basicsQuantityQueryEditorService,constructionSystemMasterParameter2TemplateDataService,
				quantityQueryEditorControllerServiceCache,constructionSystemMainInstanceService) {

				$scope.editorDataService=constructionSystemMasterParameter2TemplateDataService;
				$scope.cmReadOnly=false;
				$scope.cmDocValue='';

				var constructionSystemQuantityQueryEditorControllerService=quantityQueryEditorControllerServiceCache.getService('constructionSystemQuantityQueryEditorControllerService',
					$scope.editorDataService.getServiceName());

				constructionSystemQuantityQueryEditorControllerService.setScope($scope);
				constructionSystemQuantityQueryEditorControllerService.getLanguages('cosParameter2Template').then(function (response) {
					$scope.languageObjectsArray = response;

					parameterSelectionChanged();

					$scope.setTools({
						showImages: true,
						showTitles: true,
						cssClass: 'tools',
						items: [
							{
								id: 'selectLanguageDDLBtn',
								caption: 'constructionsystem.master.toolButtonLanguage',
								type: 'dropdown-btn',
								iconClass: 'tlb-icons ico-view-ods',
								list: {
									showImages: false,
									cssClass: 'dropdown-menu-right',
									items: [
										// {
										//  id: 'filterTitle',
										//  type: 'item',
										//  disabled: true,
										//  cssClass: 'title',
										//  caption: 'model.viewer.activeFilter'
										// },
										{
											type: 'sublist',
											list: {
												items: $scope.languageObjectsArray
											}
										}]
								}
							}
						]
					});
				});

				function parameterSelectionChanged() {
					basicsQuantityQueryEditorService.selectedCosMasterParameter2TemplateLanguageId = basicsQuantityQueryEditorService.defaultLanguageId;
					basicsQuantityQueryEditorService.currentCosMasterParameter2TemplateQuantityQueryTranslationEntity = null;
					constructionSystemQuantityQueryEditorControllerService.setSelectedCaption(basicsQuantityQueryEditorService.selectedCosMasterParameter2TemplateLanguageId);

					var cosParameter2TemplateDto = constructionSystemMasterParameter2TemplateDataService.getSelected();
					if((!!cosParameter2TemplateDto)&&(cosParameter2TemplateDto.CosDefaultTypeFk === 3 || cosParameter2TemplateDto.CosDefaultTypeFk === 4 || cosParameter2TemplateDto.CosDefaultTypeFk === 5)){
						$scope.cmReadOnly = false;
					}else{
						$scope.cmReadOnly = 'nocursor';
						$scope.cmDocValue='';
					}
					constructionSystemQuantityQueryEditorControllerService.onLanguageSelectionChanged.fire(basicsQuantityQueryEditorService.selectedCosMasterParameter2TemplateLanguageId,'cosParameter2Template');
				}

				constructionSystemMasterParameter2TemplateDataService.registerSelectionChanged(parameterSelectionChanged);

				$scope.$on('$destroy', function () {
					constructionSystemMainInstanceService.instanceHeaderDto=null;
					constructionSystemMasterParameter2TemplateDataService.instanceHeaderDto=null;
					constructionSystemMasterParameter2TemplateDataService.unregisterSelectionChanged(parameterSelectionChanged);
				});
			}]
	);
})(angular);