/**
 * Created by alm on 14/3/2017.
 */

(function () {
	// eslint-disable-next-line no-redeclare
	/* global angular,$ */
	'use strict';
	angular.module('documents.project').controller('documentsProjectCxUploadWizardController', ['_','$scope','$sce','$translate','documentsProjectDocumentModuleContext','documentsProjectDocumentDataService','cxService','platformModalService','projectMainService', 'basicsLookupdataLookupDescriptorService',
		function (_,$scope,$sce,$translate,documentsProjectDocumentModuleContext,documentsProjectDocumentDataService,cxService,platformModalService,projectMainService, lookupDescriptorService){

			$scope.cxupload={title:$translate.instant('documents.project.cxUploadTitle')};
			$scope.cxuploadloading=true;
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
					$scope.cxupload.url = $sce.trustAsResourceUrl(backdata.url + '/Register/'+projectName+'/iTWOIntergation/Index?k=' + backdata.key);
				}
				else{
					$scope.cxuploadloading=false;
					$scope.close();
				}
			});

			function uploadToCx(json){
				cxService.uploadCx(json).then(function (data) {
					if(data.link) {
						var documentService=documentsProjectDocumentDataService.getService(documentsProjectDocumentModuleContext.getConfig());
						var selectDocument = documentService.getSelected();
						selectDocument.Url = data.link;
						selectDocument.DocumentTypeFk = 1000;
						documentService.markItemAsModified(selectDocument);
						documentService.update().then(function(){
							var modalOptions = {
								bodyText: $translate.instant('documents.project.uploadSuccess'),
								iconClass: 'ico-info'
							};
							platformModalService.showDialog(modalOptions);
						});
					}

				}, function error() {
					var modalOptions = {
						bodyText: $translate.instant('documents.project.uploadFailure'),
						iconClass: 'ico-info'
					};
					platformModalService.showDialog(modalOptions);
				});
			}

			var cxFn=function(event){
				var DocmentDatas=event.data;
				var Status=DocmentDatas.Status;
				$scope.$apply(function(){
					$scope.cxuploadloading=false;
				});
				if(Status){
					if('cancel'===Status){
						$scope.close();
					}
					else if('toFolderTree'===Status){
						$scope.$apply(function() {
							$scope.$parent.$parent.$parent.options.width = '600px';
							$scope.$parent.$parent.$parent.options.height = '460px';
						});
						document.getElementById('cxuploadIframe').style.height='415px';
						var changeBoxSize = {status:'toFolderTree'};
						document.getElementById('cxuploadIframe').contentWindow.postMessage(changeBoxSize,'*');
					}
					else if('publish'===Status){
						$scope.$apply(function() {
							$scope.$parent.$parent.$parent.options.width = '1250px';
							$scope.$parent.$parent.$parent.options.height = '693px';

						});
						document.getElementById('cxuploadIframe').style.height='650px';
						$('#publishToCx').removeClass('treeBox').addClass('uploadBox');
						var uploadFiles = [];
						var chkFilevalue=$scope.$parent.$parent.$parent.modalOptions.value;
						for (var i = 0; i < chkFilevalue.length; i++) {
							uploadFiles.push({ CXDocId: (chkFilevalue[i].cxDocId).toString(), extension: '.txt', revisions: [{ rev: (chkFilevalue[i].rev).toString(), fileName: chkFilevalue[i].name,size: 0, iTWO40DocId: (chkFilevalue[i].docId).toString(), iTWO40FileName: chkFilevalue[i].physicalname }] });
						}
						var uploadData={status:'toUploadPage',uploadItems: uploadFiles };
						document.getElementById('cxuploadIframe').contentWindow.postMessage(uploadData,'*');
					}
					else if('finish'===Status){
						// console.log(JSON.parse(DocmentDatas.Json));
						$scope.close();
						var createCxJson=DocmentDatas.Json;
						uploadToCx(createCxJson);
					}
				}
				else{
					$scope.close();
				}

			};
			window.addEventListener('message',cxFn,false);
			$scope.close = function () {
				window.removeEventListener('message',cxFn);
				$scope.$parent.$close(false);
			};

			$scope.modalOptions = {
				headerText: $translate.instant('documents.project.cxUploadTitle'),
				cancel: $scope.close
			};

		}

	]);

})();