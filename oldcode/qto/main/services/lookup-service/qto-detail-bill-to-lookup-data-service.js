(function (angular) {
	'use strict';
	let moduleName = 'qto.main';
	let salesBillingModule = angular.module(moduleName);

	salesBillingModule.factory('qtoDetailBillToLookupDataService', ['_', 'globals', '$http',
		function (_, globals, $http ) {

			let service = {};

			let billToList = [];

			let projectId = 0;

			let billToPromise = null;

			service.setProjectId = function (value) {
				billToPromise = null;
				projectId = value;
			};

			service.getItemById = function (value) {
				return _.find(billToList, {Id: value});
			};

			service.getItemByIdAsync = function (value) {
				let readData ={
					PKey1 : projectId,
					Id:value
				};

				if (projectId > 0) {
					if (!billToPromise) {
						billToPromise = $http.post(globals.webApiBaseUrl + 'project/main/billto/listbyparent', readData);
					}
					return billToPromise.then(function (response) {
						billToList = _.uniqBy(billToList.concat(response.data), 'Id');
						billToPromise = null;
						return service.getItemById(value);
					});
				} else {
					if (!billToPromise) {
						billToPromise = $http.post(globals.webApiBaseUrl + 'project/main/billto/listbyparent', readData);
					}
					return billToPromise.then(function (response) {
						billToPromise = null;
						billToList = _.uniqBy(billToList.concat(response.data), 'Id');
						return service.getItemById(value);
					});
				}
			};


			service.getBillToList = function (ordHeaderFk) {
				ordHeaderFk = ordHeaderFk? ordHeaderFk: 0;
				return $http.get(globals.webApiBaseUrl + 'project/main/billto/getBillToByContractNProject?projectId='+projectId+'&ordHeaderFk='+ordHeaderFk).then(function (response) {
					billToList = _.uniqBy(billToList.concat(response.data), 'Id');
					return response.data;

				});
			};

			return service;

		}]);
})(angular);
