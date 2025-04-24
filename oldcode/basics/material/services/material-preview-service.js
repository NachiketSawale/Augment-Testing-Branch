/**
 * Created by wuj on 2/15/2016.
 */
(function () {
	'use strict';
	angular.module('basics.material').factory('basicsMaterialPreviewService',
		['$http','basicsMaterialRecordService', 'platformFileUtilServiceFactory',
			function ($http,basicsMaterialRecordService, platformFileUtilServiceFactory) {

				var config = {
					deleteUrl: globals.webApiBaseUrl + 'basics/material/preview/deleteblob',
					importUrl: globals.webApiBaseUrl + 'basics/material/preview/importblob',
					getUrl: globals.webApiBaseUrl + 'basics/material/preview/getblob',
					fileFkName: 'BasBlobsFk',
					dtoName: 'MaterialDto'
				};
				var  service= platformFileUtilServiceFactory.getFileService(config, basicsMaterialRecordService);
				//keep material focus after delete file
				service.deleteFile= function (){
					var fileEntity=basicsMaterialRecordService.getSelected();
					return $http.post(config.deleteUrl, fileEntity).then(function () {
						if(fileEntity[config.fileFkName]) {
							fileEntity[config.fileFkName] = null;
						}
					});
				};
				return service;
			}]);
})(angular);