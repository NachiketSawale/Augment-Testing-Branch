
(function (angular) {
	/* global globals _ */
	'use strict';

	angular.module('estimate.main').factory('estimateMainCurrentElementJobService', [
		'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', '$injector','$http','$q',
		function (platformLookupDataServiceFactory, basicsLookupDataConfigGenerator, $injector,$http,$q) {

			return createService(platformLookupDataServiceFactory, basicsLookupDataConfigGenerator, $injector,$http,$q, 'estimateMainCurrentElementJobService');
		}
	]);

	angular.module('estimate.main').factory('estimateMainReplaceElementJobService', [
		'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', '$injector','$http','$q',
		function (platformLookupDataServiceFactory, basicsLookupDataConfigGenerator, $injector,$http,$q) {

			return createService(platformLookupDataServiceFactory, basicsLookupDataConfigGenerator, $injector,$http,$q, 'estimateMainReplaceElementJobService');
		}
	]);

	function createService(platformLookupDataServiceFactory, basicsLookupDataConfigGenerator, $injector,$http,$q, serviceName) {

		let readData = {projectFk: null};

		basicsLookupDataConfigGenerator.storeDataServiceDefaultSpec (serviceName, {
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
					field: 'Description',
					name: 'Description',
					formatter: 'description',
					width: 150,
					name$tr$: 'cloud.common.entityDescription'
				}
			],
			uuid: '0cd55303286f46c1aff09812bbbc1293'
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

			let estHeaderId = $injector.get('estimateMainService').getSelectedEstHeaderId();
			let projectId = $injector.get('estimateMainService').getProjectId();
			let estimateMainReplaceResourceCommonService = $injector.get('estimateMainReplaceResourceCommonService');
			let typeId = serviceName === 'estimateMainCurrentElementJobService'
				? estimateMainReplaceResourceCommonService.getDefaultType()
				: estimateMainReplaceResourceCommonService.getReplaceToType();
			// typeId = typeId === 3 ? 4 : typeId;
			let mainID = serviceName === 'estimateMainCurrentElementJobService'
				? estimateMainReplaceResourceCommonService.getToReplaceOrDefaultCurrentElement()
				:estimateMainReplaceResourceCommonService.getReplaceElementId();

			let deferred = $q.defer();
			if(serviceName === 'estimateMainCurrentElementJobService') {
				$http.get(globals.webApiBaseUrl + 'estimate/main/resource/getcurrentelementjobs?typeId=' + typeId + '&mainID=' + mainID + '&estHeaderId=' + estHeaderId).then(function (response) {
					jobList = response.data;
					deferred.resolve(response.data);
				});
			}else{
				if(typeId === 1){
					$http.get(globals.webApiBaseUrl + 'project/costcodes/job/rate/getprjcostcodejob?prjCostCodeId=' + mainID).then(function (response) {
						jobList = response.data;
						deferred.resolve(response.data);
					});
				}else if(typeId === 2){
					$http.get(globals.webApiBaseUrl + 'project/material/getprjmaterialjob?materialId=' + mainID + '&projectId=' +projectId).then(function (response) {
						jobList = response.data;
						deferred.resolve(response.data);
					});
				}
			}
			return deferred.promise;
		};

		service.resetCache = function (){
			return service.getJobList().then(function () {
				return _.filter(jobList, function (d) {
					return !d.IsVersionJob;
				});
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

			return service.getJobList().then(function () {
				return _.filter(jobList, function (d) {
					return !d.IsVersionJob;
				});
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
			jobList = [];
		};

		return service;
	}

})(angular);
