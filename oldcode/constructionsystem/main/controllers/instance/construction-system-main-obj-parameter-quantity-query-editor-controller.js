/**
 * Created by jim on 2/28/2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('constructionSystemMainObjParameterQuantityQueryEditorController',
		['$scope','$injector', 'platformContextService',
			'basicsQuantityQueryEditorService','constructionSystemMainInstance2ObjectParamService',
			'quantityQueryEditorControllerServiceCache','constructionSystemMainInstance2ObjectService',
			'constructionSystemCommonObjectParamValidationService',
			function ($scope,$injector, platformContextService,
				basicsQuantityQueryEditorService,constructionSystemMainInstance2ObjectParamService,
				quantityQueryEditorControllerServiceCache,constructionSystemMainInstance2ObjectService,
				constructionSystemCommonObjectParamValidationService) {

				$scope.editorDataService=constructionSystemMainInstance2ObjectParamService;
				$scope.cmDocValue='';

				var constructionSystemQuantityQueryEditorControllerService=quantityQueryEditorControllerServiceCache.getService('constructionSystemQuantityQueryEditorControllerService',
					$scope.editorDataService.getServiceName());

				constructionSystemQuantityQueryEditorControllerService.setScope($scope);
				constructionSystemQuantityQueryEditorControllerService.getLanguages('objectParameter');

				function parameterSelectionChanged() {
					$scope.editorDataService=constructionSystemMainInstance2ObjectParamService;
					basicsQuantityQueryEditorService.currentCosMasterParameterQuantityQueryTranslationEntity = null;

					var instance2ObjectParameterDto=constructionSystemMainInstance2ObjectParamService.getSelected();
					if(instance2ObjectParameterDto){
						$scope.cmReadOnly=false;
						constructionSystemMainInstance2ObjectParamService.getInstanceHeaderDto().then(function (instanceHeaderDto){
							basicsQuantityQueryEditorService.selectedLanguageId=instanceHeaderDto.BasLanguageQtoFk;
							var constructionSystemQuantityQueryEditorControllerService=quantityQueryEditorControllerServiceCache.getService('constructionSystemQuantityQueryEditorControllerService',$scope.editorDataService.getServiceName());
							constructionSystemQuantityQueryEditorControllerService.onLanguageSelectionChanged.fire(basicsQuantityQueryEditorService.selectedLanguageId,'objectParameter');
						});
					}else{
						$scope.cmReadOnly='nocursor';
					}
				}

				function codeMirrorContentChange(e,args){
					var entity=constructionSystemMainInstance2ObjectParamService.getSelected();
					if(entity){
						constructionSystemCommonObjectParamValidationService(constructionSystemMainInstance2ObjectParamService, constructionSystemMainInstance2ObjectService).validateQuantityQuery(entity,args.newQuantityQuery);
					}
				}

				constructionSystemMainInstance2ObjectParamService.registerSelectionChanged(parameterSelectionChanged);
				basicsQuantityQueryEditorService.codeMirrorContentChange.register(codeMirrorContentChange);

				parameterSelectionChanged();

				$scope.$on('$destroy', function () {
					constructionSystemMainInstance2ObjectService.instanceHeaderDto=null;
					constructionSystemMainInstance2ObjectParamService.instanceHeaderDto=null;
					constructionSystemMainInstance2ObjectParamService.unregisterSelectionChanged(parameterSelectionChanged);
				});
			}]
	);
})(angular);