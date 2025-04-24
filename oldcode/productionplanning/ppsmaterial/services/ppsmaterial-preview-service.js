/**
 * Created by snehal on 11/22/2022.
 */
 (function () {
	'use strict';
	angular.module('productionplanning.ppsmaterial').factory('productionplanningPpsmaterialPreviewService',
		['$http','productionplanningPpsMaterialRecordMainService', 'platformFileUtilServiceFactory',
			function ($http,productionplanningPpsMaterialRecordMainService, platformFileUtilServiceFactory) {

				const config = {
					deleteUrl: globals.webApiBaseUrl + 'basics/material/preview/deleteblob',
					importUrl: globals.webApiBaseUrl + 'basics/material/preview/importblob',
					getUrl: globals.webApiBaseUrl + 'basics/material/preview/getblob',
					fileFkName: 'BasBlobsFk',
					dtoName: 'MaterialDto'
				};
				let  service= platformFileUtilServiceFactory.getFileService(config, productionplanningPpsMaterialRecordMainService);
				//keep material focus after delete file
				service.deleteFile= function (){
					let fileEntity=productionplanningPpsMaterialRecordMainService.getSelected();
					return $http.post(config.deleteUrl, fileEntity).then(function () {
						if(fileEntity[config.fileFkName]) {
							fileEntity[config.fileFkName] = null;
						}
					});
				};
				return service;
			}]);
})(angular);