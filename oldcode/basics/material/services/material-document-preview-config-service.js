/***2017-3-29 by alina****/
(function (angular, jQuery) {
	'use strict';

	angular.module('basics.material').factory('materialDocumentPreviewConfigService',
		['$http','$q',function ($http,$q) {
			var service = {};
			function getPreviewConfig($scope,currentItem){
				var deffered = $q.defer();
				var fileArchiveDocId = currentItem.FileArchiveDocFk;
				var previewUrl=$scope.internetCatalog?'basics/material/commoditysearch/1.0/internetpreview':'basics/common/document/preview';
				var params=$scope.internetCatalog?('?fileArchiveDocId='+fileArchiveDocId+'&catalogId='+$scope.internetCatalog):('?fileArchiveDocId='+fileArchiveDocId);
				var realUrl=globals.webApiBaseUrl +previewUrl+params;
				$http.get(realUrl).then(function(result) {
					var typeName = _.last(result.data.split('.'));
					deffered.resolve({
						src : result.data,
						typeName: typeName,
						title:currentItem.OriginFileName
					});
				});
				return deffered.promise;
			}

			function previewDocument(config,supportType,content, contentHeight){
				const height = contentHeight ?? '500px';
				if(_.includes(supportType, 'xml') || _.includes(supportType, 'html')){
					//html = '<xmp/>';
					jQuery(content).load(config.src);
				}else if (_.includes(supportType, 'png') || _.includes(supportType, 'bmp') || _.includes(supportType, 'jpg') || _.includes(supportType, 'tif')) {
					// eslint-disable-next-line no-useless-escape
					var imgHtml='<img src=\"'+config.src+'\" />';
					jQuery(content).html(imgHtml);
				}else if (_.includes(supportType, 'txt')) {
					jQuery(content).load(config.src);
				}else if(_.includes(supportType, 'pdf')){
					// eslint-disable-next-line no-useless-escape
					var pdfHtml='<embed width="100%" title="" height="97%" name="plugin" src=\"' + config.src + '\" type= \"application/pdf\"></embed>';
					jQuery(content).css('height', height).html(pdfHtml);
				}
			}
			service.onDocumentPreview=function($scope,documentId,index, contentHeight){
				var documents=$scope.previewDocuments;
				var previewDocumentTypes=$scope.previewDocumentTypes;
				var document = _.find(documents, function (doc) {
					return doc.Id === documentId;
				});
				var supportType = _.find(previewDocumentTypes, function (documenttype) {
					return documenttype.Id === document.DocumentTypeFk;
				});
				document.show=!document.show;
				var content=jQuery('.ms-sv-commodity-preview-document-box .ms-sv-commodity-preview-document-content_'+index);
				if(document.show){
					if(content.empty()){
						getPreviewConfig($scope,document).then(function(config){
							jQuery.ajax({
								url:config.src,
								type:'get',
								success:function(){
									previewDocument(config, supportType.Extention, content, contentHeight);
									content.show();
								},
								error:function(){
									content.html('File cannot be loaded');
									content.show();
								}
							});
						});
					}
					else{
						content.show();
					}
				}
				else{
					content.hide();
				}

			};




			return service;
		}]);
})(angular, jQuery);