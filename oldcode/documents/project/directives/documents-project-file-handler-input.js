/**
 * Created by lja on 2016-2-5.
 */
(function () {
	'use strict';

	var moduleName = 'documents.project';

	angular.module(moduleName).directive('documentsProjectFileHandlerInput',
		['globals','documentsProjectDocumentFileUploadDataService', 'basicsCommonFileDownloadService',
			function (globals,fileUploadDataService, basicsCommonFileDownloadService) {
				return {

					restrict: 'A',
					scope: {
						entity: '=',
						ngModel: '=',
						options: '='
					},
					templateUrl: globals.appBaseUrl + moduleName + '/partials/file-handler-input.html',
					link: linker
				};

				function linker(scope) {

					/* if(scope.entity){
						scope.isShowDownLoadBtn = scope.entity.FileArchiveDocFk ? true : false;
						scope.isShowUpLoadBtn = true;
					}else{
						scope.isShowUpLoadBtn = false;
					} */

					scope.onDownload = function () {
						if (scope.entity.FileArchiveDocFk) {
							basicsCommonFileDownloadService.download(scope.entity.FileArchiveDocFk);
						} else if (scope.entity.ArchiveElementId) {
							var archiveId = scope.entity.ArchiveElementId ? scope.entity.ArchiveElementId : (scope.entity.DatengutFileId ? scope.entity.DatengutFileId : '');
							var obj = {DatengutFiles: [{ArchiveElementId: archiveId, FileName: ''}]};
							basicsCommonFileDownloadService.download(null, obj);
						}
					};

					scope.onUpload = function () {
						fileUploadDataService.execute();
					};
				}
			}]);
})(angular);