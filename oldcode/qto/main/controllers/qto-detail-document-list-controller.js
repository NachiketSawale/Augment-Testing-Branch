/**
 * Created by lnt on 28.10.2020.
 */

/* global _  */

(function (angular) {

	'use strict';
	var moduleName = 'qto.main';

	/**
	 * @ngdoc controller
	 * @name qtoDetailDocumentListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of qto detail document entities.
	 **/
	angular.module(moduleName).controller('qtoDetailDocumentListController',
		['$scope', 'platformContainerControllerService', 'basicsCommonUploadDownloadControllerService', 'qtoDetailDocumentService','platformGridControllerService','basicsCommonFileDownloadService','qtoMainDetailService',
			function ($scope, platformContainerControllerService, basicsCommonUploadDownloadControllerService, qtoDetailDocumentService,platformGridControllerService,basicsCommonFileDownloadService, qtoMainDetailService) {

				platformContainerControllerService.initController($scope, moduleName, '886f9059992f46d3864d2Cbe173bd251');

				basicsCommonUploadDownloadControllerService.initGrid($scope, qtoDetailDocumentService);

				if(qtoMainDetailService.getSelectedEntities().length<=0 && qtoMainDetailService.getList().length>0){
					qtoDetailDocumentService.load();
				}

				// add download all button
				const tools =[{
					id: 'downloads',
					caption: 'download all',
					type: 'item',
					iconClass: 'tlb-icons ico-download-all',
					fn: function download() {
						downloadFiles();
					},
					sort:8,
					disabled: function canDownload() {
						return !disableDownloadFiles();
					}
				}];
				$scope.addTools(tools);

				_.forEach($scope.tools.items, function (item) {
					if ('multipleupload' === item.id) {
						item.permission = '#c';
					} // Sets the permission that causes the auto hide in the readonly mode
				});

				$scope.tools.update();
				
				/**
				 * Download QTO files in bulk
				 **/
				function downloadFiles() {
					const documentDtos = qtoDetailDocumentService.getList();
					var obj = {DatengutFiles: []};
					_.map(documentDtos, function (item) {
						var archiveId = item.ArchiveElementId ? item.ArchiveElementId : (item.DatengutFileId ? item.DatengutFileId : '');
						obj.DatengutFiles.push({ArchiveElementId: archiveId, FileName: ''});
					});
					const docIdArray = _.map(documentDtos,
						function (item) {
							if (item.FileArchiveDocFk && disableDownloadFiles()) {
								return item.FileArchiveDocFk;
							}

						}).join();
					basicsCommonFileDownloadService.download(docIdArray, obj);
				}
				/**
				* If no data exists, batch downloads are disabled
				* */
				function disableDownloadFiles(){
					const qtoDocumentList = qtoDetailDocumentService.getList();
					if(qtoDocumentList && qtoDocumentList.length>0){
						return true;
					}else {
						return false;
					}
				}

			}
		]);
})(angular);