/**
 * Created by chk on 3/8/2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'documents.import';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('documentsImportResultService',
		['globals','$q', '$http', 'platformDataServiceFactory', 'documentImportJobDataService', 'PlatformMessenger',
			function (globals,$q, $http, platformDataServiceFactory, documentImportJobDataService, PlatformMessenger) {

				var service = {}, pageNum = -1, isLastPage = false,
					option = {
						module: angular.module(moduleName),
						entitySelection: {}
					};


				var container = platformDataServiceFactory.createNewComplete(option);

				function parentSelectedChanged(item) {
					if(item){
						pageNum = 0; isLastPage = false;
						$http.get(globals.webApiBaseUrl + 'documents/documentsimport/getimportresult?jobId=' + item.Id).then(function (res) {
							service.importResultChanged.fire(res && res.data ? res.data : []);
							pageNum = res && res.data ? (res.data.length > 0 ? 0 : -1) : -1;
						});
					}else{
						pageNum = -1;
						service.importResultChanged.fire([]);
					}


				}

				documentImportJobDataService.selectedChanged.register(parentSelectedChanged);

				service = container.service;

				angular.extend(service, {
					getList: getList
				});

				function getList() {
					return [];

				}

				function getResultByPage() {
					var item = documentImportJobDataService.getSelected();
					if(item){
						$http.get(globals.webApiBaseUrl + 'documents/documentsimport/getimportresultbypage?jobId=' + item.Id + '&pageNum=' + pageNum).then(function (res) {
							service.importResultChanged.fire(res && res.data ? res.data : []);
							isLastPage = res && res.data ? (res.data.length <= 0) : true;
						});
					}
				}

				service.nextPage = function () {
					pageNum += 1;
					getResultByPage();
				};


				service.prePage = function () {
					pageNum -= 1;
					getResultByPage();
				};

				service.previousDisabled = function () {
					return pageNum <= 0;
				};

				service.nextDisabled = function () {
					return pageNum === -1 || isLastPage;
				};

				service.clearData = function(){
					pageNum = -1;
					isLastPage = false;
				};

				service.importResultChanged = new PlatformMessenger();
				return service;
			}]);

})(angular);