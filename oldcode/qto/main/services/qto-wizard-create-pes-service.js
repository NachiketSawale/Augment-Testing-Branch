(function (angular) {
	/* global  globals */
	'use strict';

	angular.module('qto.main').factory('qtoMainCreatePestWizardDataService',
		['platformModalService', 'qtoMainCreatePestWizardHttpService', '$q','$http','$translate',
			function (platformModalService, qtoMainCreatePestWizardHttpService, $q,$http,$translate) {

				let qtoHeaderId = null;
				let service = {};
				service.contractIds={};
				service.createPesDetail = function (createDto) {
					let defer = $q.defer();
					qtoMainCreatePestWizardHttpService.createPesDetail(createDto).then(function (response) {
						let data = response.data;
						if(response.data.timeStr && response.data.timeStr.m_StringValue){
							console.log(response.data.timeStr.m_StringValue);
						}

						if(data.ErrNoQtoDetail){
							let strTitle = $translate.instant ('cloud.common.informationDialogHeader');
							let strContent = $translate.instant ('qto.main.errNoQtoDetail');
							platformModalService.showMsgBox (strContent, strTitle, 'info');
							return;
						}

						defer.resolve(data.Pes);
					}, function (error) {
						defer.reject(error);
					});
					return defer.promise;
				};

				service.getContractId = function (qtoHeaderId) {
					let defer = $q.defer();
					qtoMainCreatePestWizardHttpService.getContractId(qtoHeaderId).then(function (response) {
						service.contractIds[qtoHeaderId]=response.data;
						defer.resolve(response.data);
					}, function (error) {
						defer.reject(error);
					});
					return defer.promise;
				};

				service.execute = function (qtoHeaderItem) {
					platformModalService.showDialog({
						templateUrl: globals.appBaseUrl + 'qto.main/partials/qto-main-wizard-create-pes.html',
						backdrop: false,
						currentItem:qtoHeaderItem
					}).then(function () {
					});
				};

				service.getQtoHeaderId = function getQtoHeaderId() {
					return qtoHeaderId;
				};

				service.setQtoHeaderId = function setQtoHeaderId(value) {
					qtoHeaderId = value;
				};

				service.getListByQtoHeaderId =  function getListByQtoHeaderId() {
					let qtoHeaderFk = service.getQtoHeaderId();
					return $http.get(globals.webApiBaseUrl + 'qto/main/detail/GetListByQtoHeaderId?qtoHeaderId=' + qtoHeaderFk+'&type=pes');
				};

				return service;
			}]);
})(angular);

(function (angular) {
	'use strict';

	angular.module('qto.main').factory('qtoMainCreatePestWizardHttpService',
		['$http',
			function ($http) {

				var service = {};

				service.createPesDetail = function (createDto) {
					return $http.post(globals.webApiBaseUrl + 'qto/main/createpes/createpesdetail', createDto);
				};
				service.getContractId = function (id) {
					return $http.get(globals.webApiBaseUrl + 'qto/main/header/getcontractid?qtoHeaderId='+ id);
				};
				return service;
			}]);
})(angular);

