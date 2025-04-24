/**
 * Created by jim on 2/28/2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('constructionSystemMainInsParameterQuantityQueryEditorController',
		['$scope','$injector', 'platformContextService',
			'basicsQuantityQueryEditorService','constructionSystemMainInstanceParameterService',
			'quantityQueryEditorControllerServiceCache','constructionSystemMainInstanceService',
			function ($scope,$injector, platformContextService,
				basicsQuantityQueryEditorService,constructionSystemMainInstanceParameterService,
				quantityQueryEditorControllerServiceCache,constructionSystemMainInstanceService) {

				$scope.editorDataService=constructionSystemMainInstanceParameterService;
				$scope.cmDocValue='';

				var constructionSystemQuantityQueryEditorControllerService=quantityQueryEditorControllerServiceCache.getService('constructionSystemQuantityQueryEditorControllerService',
					$scope.editorDataService.getServiceName());

				constructionSystemQuantityQueryEditorControllerService.setScope($scope);
				constructionSystemQuantityQueryEditorControllerService.getLanguages('instanceParameter');

				function parameterSelectionChanged() {
					basicsQuantityQueryEditorService.currentCosMasterParameterQuantityQueryTranslationEntity = null;

					var instanceParameterDto=constructionSystemMainInstanceParameterService.getSelected();
					if(instanceParameterDto){
						$scope.cmReadOnly=false;
						constructionSystemMainInstanceParameterService.getInstanceHeaderDto().then(function (instanceHeaderDto){
							basicsQuantityQueryEditorService.selectedLanguageId=instanceHeaderDto.BasLanguageQtoFk;
							var constructionSystemQuantityQueryEditorControllerService=quantityQueryEditorControllerServiceCache.getService('constructionSystemQuantityQueryEditorControllerService',$scope.editorDataService.getServiceName());
							constructionSystemQuantityQueryEditorControllerService.onLanguageSelectionChanged.fire(basicsQuantityQueryEditorService.selectedLanguageId,'instanceParameter');
						});
					}else{
						$scope.cmReadOnly='nocursor';
					}
				}

				constructionSystemMainInstanceParameterService.registerSelectionChanged(parameterSelectionChanged);

				parameterSelectionChanged();

				$scope.$on('$destroy', function () {
					constructionSystemMainInstanceService.instanceHeaderDto=null;
					constructionSystemMainInstanceParameterService.instanceHeaderDto=null;
					constructionSystemMainInstanceParameterService.unregisterSelectionChanged(parameterSelectionChanged);
				});
			}]
	);
})(angular);