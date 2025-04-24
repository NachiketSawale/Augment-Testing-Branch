
(function (angular) {
	/* global globals _ */
	'use strict';

	angular.module('estimate.main').factory('estimateMainJobLookupByProjectDataService', [
		'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', '$injector','$http','$q',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, $injector,$http,$q) {

			let readData = {projectFk: null};

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec ('estimateMainJobLookupByProjectDataService', {
				valMember: 'Id',
				version:2,
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 100,
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo.Description',
						name: 'Description',
						formatter: 'description',
						width: 150,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'b6d3e75e8d5a40ce9bd7faa716a53e8b'
			});

			let lookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'logistic/job/', endPointRead: 'lookuplistbyfilter'},
				filterParam: readData,
				disableDataCaching: true
			};

			let service = platformLookupDataServiceFactory.createInstance (lookupDataServiceConfig).service;
			let jobList = [];
			let jobPromise  =  null;

			service.getJobList = function getJobList(){

				let options = {
					IsContainVersionJob:true,
					projectFk:  $injector.get('projectMainService').getIfSelectedIdElse(null) ||
						$injector.get ('estimateMainService').getSelectedProjectId () ||
						$injector.get('constructionSystemMainInstanceService').getCurrentSelectedProjectId()
				};

				let deferred = $q.defer();
				$http.post(globals.webApiBaseUrl + 'logistic/job/lookuplistbyfilter', options).then (function (response) {
					jobList = response.data;
					deferred.resolve(response.data);
				});
				return deferred.promise;
			};


			service.resetCache = function (){
				return service.getJobList().then(function () {
					let estJob = _.filter(jobList,function (d) {
						return !d.IsVersionJob;
					});
					return estJob;
				});
			};

			service.reload = function() {
				let deferred = $q.defer();
				service.getJobList()
					.then(function(data) {
						jobList = data;
						deferred.resolve(jobList);
					})
					.catch(function(error) {
						deferred.reject(error);
					});
				return deferred.promise;
			};


			service.getList = function getList() {
				if(jobList && jobList.length){
					let estJob = _.filter(jobList,function (d) {
						return !d.IsVersionJob;
					});
					return $q.when(estJob);
				}

				return service.getJobList().then(function () {
					let estJob = _.filter(jobList,function (d) {
						return !d.IsVersionJob;
					});
					return estJob;
				});
			};


			service.getItemById = function(item) {
				if (item === undefined) {
					service.reload();
				}
				return _.find(jobList, {Id: item});
			};



			service.getItemByKey = function getItemByKey(value) {
				return service.getItemById (value);
			};

			service.getItemByIdAsync = function(value){

				let item = service.getItemById(value);
				if(item) {
					return item;
				}

				if (!jobPromise) {
					jobPromise = service.getJobList();
				}
				return jobPromise.then(function (data) {
					jobPromise = null;
					jobList = data;
					return  service.getItemById(value);
				});
			};

			service.clear = function () {

			};

			return service;
		}
	]);
})(angular);
