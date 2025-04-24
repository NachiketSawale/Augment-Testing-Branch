/**
 * Created by lja on 2016-2-3.
 */
(function (angular) {
	'use strict';

	var moduleName = 'documents.project';

	angular.module(moduleName).directive('documentsProjectFileUploadLookup',
		['documentsProjectDocumentFileUploadDataService','globals','_',
			function (fileUploadDataService,globals,_) {
				return {
					restrict: 'EA',
					templateUrl: globals.appBaseUrl + moduleName + '/partials/file-upload.html',
					link: function (scope, element) {
						function filesHaveBeenUploadedReaction(e,args){
							if(fileUploadDataService.isDragOrSelect==='select'){
								var data=args.data;
								scope.allFileName.push(args.data);
								var allFileNames = _.map(scope.allFileName, function (item) {
									return item.fileName;
								});
								allFileNames=allFileNames.reverse();
								var fileNamesInputElement=element.find('#fileName');
								fileNamesInputElement.val('"'+allFileNames.join('" "')+'"');
								scope.$emit('fileChosen', data);
							}
						}

						fileUploadDataService.filesHaveBeenUploaded.register(filesHaveBeenUploadedReaction);
						scope.allFileName=[];
						scope.chooseFile = function () {
							var uploadService = fileUploadDataService.getUploadService();
							var basDocumentTypeArray=fileUploadDataService.getBasDocumentTypeArray();
							var allSupportedFileTypeIds=_.map(basDocumentTypeArray,function(item){
								return item.Id;
							});
							var allSupportedFileExtensions=_.map(allSupportedFileTypeIds,function(item){
								return uploadService.getExtension(basDocumentTypeArray, item);
							});
							allSupportedFileExtensions=_.filter(allSupportedFileExtensions,function(item){
								return !!item;
							});
							var fileExtensionArray=[];
							var gridFlag=fileUploadDataService.gridFlag;
							if(gridFlag === '4EAA47C530984B87853C6F2E4E4FC67E'){
								fileExtensionArray=allSupportedFileExtensions;
							}else{
								var selectedDocumentFileTypeId=fileUploadDataService.getDocumentFileType();
								var selectedDocumentFileExtension=uploadService.getExtension(basDocumentTypeArray, selectedDocumentFileTypeId);
								if(selectedDocumentFileExtension){
									fileExtensionArray.push(selectedDocumentFileExtension);
								}
							}
							fileExtensionArray=_.map(fileExtensionArray,function(item){
								return item.replace(/[*.\s]/g,'');
							});
							var finalFileExtensionArray=[];
							for(var i=0; i<fileExtensionArray.length; i++){
								if(fileExtensionArray[i].indexOf(';')!==-1){
									finalFileExtensionArray = finalFileExtensionArray.concat(fileExtensionArray[i].split(';'));
								}else if(fileExtensionArray[i].indexOf(',')!==-1){
									finalFileExtensionArray = finalFileExtensionArray.concat(fileExtensionArray[i].split(','));
								}else{
									finalFileExtensionArray.push(fileExtensionArray[i]);
								}
							}
							fileUploadDataService.getSupportedMimeTypeMapping().then(function(res){
								var supportedMimeTypeMapping=res;
								var supportedMimeTypesForAcceptAttr=_.map(finalFileExtensionArray,function(fileExtension){
									var attrValue =supportedMimeTypeMapping[fileExtension];
									if (attrValue) {
										return attrValue;
									}else{
										return null;
									}
								});
								supportedMimeTypesForAcceptAttr=_.filter(supportedMimeTypesForAcceptAttr,function(item){
									return item!==null;
								});
								if(!!supportedMimeTypesForAcceptAttr&&!!supportedMimeTypesForAcceptAttr.length&&supportedMimeTypesForAcceptAttr.length>0){
									var supportedMimeTypesForAcceptAttrString=supportedMimeTypesForAcceptAttr.join(',');
									var fileOption = {multiple: true, autoUpload: false,accept:supportedMimeTypesForAcceptAttrString};
									uploadService.selectFiles(fileOption);
								}
							});
						};
						scope.$on('$destroy', function () {
							scope.allFileName=[];
						});
					}
				};
			}]);

})(angular);