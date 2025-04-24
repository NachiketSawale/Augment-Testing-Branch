/* global globals,_ */
(function(){
	'use strict';
	var moduleName ='constructionsystem.master';
	angular.module(moduleName).factory('constructionSystemMasterImport5DContentService',['$injector', '$q', '$http','$translate','platformTranslateService','platformModalService','PlatformMessenger',
		function($injector,$q,$http,$translate,platformTranslateService,platformModalService,PlatformMessenger){

			var service = {};
			service.analysisFileComplete = new PlatformMessenger();
			var _moduleName;
			service.execute = function () {

				var modalOptions = {
					headerTextKey: 'constructionsystem.master.Import5DContent',
					templateUrl: globals.appBaseUrl + 'constructionsystem.master/templates/constructionsystem-master-import-5d-content-container.html',
					iconClass: 'ico-warning',
					windowClass: 'msgbox'
				};

				platformModalService.showDialog(modalOptions).then(function (res) {
					if (res !== undefined) {
						if (res.ok){
							res.ok = true;
						}
					}
				});
			};

			service.ImportFile = function ImportFile(filePath) {
				var defer = $q.defer();
				var result = /\.[^.]+/.exec(filePath.name);
				if (_.isArray(result) && result.length > 0 && result[0].toLowerCase() !== '.xml') {
					defer.resolve('selected file extension must be XML');
				} else {
					$http({
						method: 'POST',
						url: globals.webApiBaseUrl + 'constructionsystem/master/header/importfileinfo',
						headers: {'Content-Type': undefined},
						transformRequest: function (data) {
							var fd = new FormData();
							fd.append('model', angular.toJson(data.model));
							if (data.file) {
								fd.append('file', data.file);
							}
							return fd;
						},
						data: {file: filePath}
					}).then(function (successData) {
						if (successData) {
							defer.resolve(true);
						}
					}, function (failure) {
						defer.reject(failure);
					});
				}
				return defer.promise;
			};


			service.import5DContent = function import5DContent(fileName) {
				return $http({
					method: 'GET',
					url: globals.webApiBaseUrl + 'constructionsystem/master/header/import5DContent?fileName='+fileName
				}).then(function (response) {
					response.Applystatus = true;
					return response;
				}, function (response) {
					response.Applystatus = false;
					return response;
				});
			};

			service.importMaterialForWarning = function importMaterialForWarning(xmlData) {
				var postData = {xmlData: xmlData, moduleName: _moduleName};
				return $http.post(globals.webApiBaseUrl + 'procurement/common/wizard/importmaterialforwarning', postData);
			};

			return service;
		}]);

})(angular);