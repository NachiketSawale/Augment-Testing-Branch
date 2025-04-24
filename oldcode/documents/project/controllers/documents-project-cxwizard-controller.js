/**
 * Created by alm on 14/3/2017.
 */

(function () {

	'use strict';
	angular.module('documents.project').controller('documentsProjectCxWizardController', ['_','$scope','$sce','$translate','documentsProjectDocumentModuleContext','documentsProjectDocumentDataService','cxService','projectMainService', 'basicsLookupdataLookupDescriptorService',
		function (_,$scope,$sce,$translate,documentsProjectDocumentModuleContext,documentsProjectDocumentDataService,cxService,projectMainService, lookupDescriptorService){

			$scope.cx={title:$translate.instant('documents.project.cxTitle')};
			$scope.cxloading=true;
			cxService.LoginCx().then(function (backdata) {
				var config = documentsProjectDocumentModuleContext.getConfig();
				var projectName = '';
				if (config.moduleName === 'project.main') {
					var projectMainSelected = projectMainService.getSelected();
					projectName = projectMainSelected.ProjectNo;
				}
				else {
					var projects = lookupDescriptorService.getData('Project');
					var parentSelected = config.parentService.getSelected();
					if (projects && parentSelected && parentSelected.ProjectFk) {
						var project = _.find(projects, {Id: parentSelected.ProjectFk});
						projectName = project.ProjectNo;
					}
				}
				if(!backdata.ErrorCode) {
					$scope.cx.url = $sce.trustAsResourceUrl(backdata.url+'/Register/'+projectName+'/iTWOIntergation/FolderTree' + '?k=' + backdata.key);
				}
				else{
					$scope.cxuploadloading=false;
					$scope.close();
				}
				// $scope.cxloading=false;
			}, function error(err) {
				// $scope.cxloading=false;
				console.log(err);
			});

			var cxFn=function(event){
				var DocmentDatas=event.data;
				var Status=DocmentDatas.Status;
				$scope.$apply(function(){
					$scope.cxloading=false;
				});
				if(Status){
					if('cancel'===Status){
						$scope.close();
					}
				}
				else{
					var config = documentsProjectDocumentModuleContext.getConfig();
					for(var i=0; i<DocmentDatas.length; i++){
						var DocmentData=DocmentDatas[i];
						documentsProjectDocumentDataService.getService(config).createItemCx(DocmentData);
					}
					$scope.close();
				}

			};
			window.addEventListener('message',cxFn,false);
			$scope.close = function () {
				window.removeEventListener('message',cxFn);
				$scope.$parent.$close(false);
			};

			$scope.modalOptions = {
				headerText: $translate.instant('documents.project.cxTitle'),
				cancel: $scope.close
			};

		}

	]);

})();