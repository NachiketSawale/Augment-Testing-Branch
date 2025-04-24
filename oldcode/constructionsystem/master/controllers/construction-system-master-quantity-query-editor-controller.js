/**
 * Created by jim on 2/28/2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('constructionSystemMasterQuantityQueryEditorController',
		['$scope','$injector', 'platformContextService',
			'basicsQuantityQueryEditorService','constructionSystemMasterParameterDataService',
			'quantityQueryEditorControllerServiceCache','constructionSystemMainInstanceService',
			function ($scope,$injector, platformContextService,
				basicsQuantityQueryEditorService,constructionSystemMasterParameterDataService,
				quantityQueryEditorControllerServiceCache,constructionSystemMainInstanceService) {

				$scope.editorDataService=constructionSystemMasterParameterDataService;
				$scope.cmReadOnly=false;
				$scope.cmDocValue='';

				var constructionSystemQuantityQueryEditorControllerService=quantityQueryEditorControllerServiceCache.getService('constructionSystemQuantityQueryEditorControllerService',
					$scope.editorDataService.getServiceName());

				constructionSystemQuantityQueryEditorControllerService.setScope($scope);
				constructionSystemQuantityQueryEditorControllerService.getLanguages('cosParameter').then(function (response) {
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
										//    {
										//      id: 'filterTitle',
										//      type: 'item',
										//      disabled: true,
										//      cssClass: 'title',
										//      caption: 'model.viewer.activeFilter'
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
					basicsQuantityQueryEditorService.selectedCosMasterParameterLanguageId = basicsQuantityQueryEditorService.defaultLanguageId;
					basicsQuantityQueryEditorService.currentCosMasterParameterQuantityQueryTranslationEntity = null;
					constructionSystemQuantityQueryEditorControllerService.setSelectedCaption(basicsQuantityQueryEditorService.selectedCosMasterParameterLanguageId);

					var cosParameterDto = constructionSystemMasterParameterDataService.getSelected();
					if((!!cosParameterDto)&&(cosParameterDto.CosDefaultTypeFk === 3 || cosParameterDto.CosDefaultTypeFk === 4 || cosParameterDto.CosDefaultTypeFk === 5)){
						$scope.cmReadOnly = false;
					}else{
						$scope.cmReadOnly = 'nocursor';
						$scope.cmDocValue='';
					}
					constructionSystemQuantityQueryEditorControllerService.onLanguageSelectionChanged.fire(basicsQuantityQueryEditorService.selectedCosMasterParameterLanguageId,'cosParameter');
				}

				constructionSystemMasterParameterDataService.registerSelectionChanged(parameterSelectionChanged);

				$scope.$on('$destroy', function () {
					constructionSystemMainInstanceService.instanceHeaderDto=null;
					constructionSystemMasterParameterDataService.instanceHeaderDto=null;
					constructionSystemMasterParameterDataService.unregisterSelectionChanged(parameterSelectionChanged);
				});
			}]
	);
})(angular);