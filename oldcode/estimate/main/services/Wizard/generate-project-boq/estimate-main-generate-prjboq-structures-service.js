/**
 * Created by wul on 12/4/2018.
 */

(function () {
	/* global globals */
	'use strict';
	let moduleName = 'estimate.main';

	/**
     * @ngdoc service
     * @name estimateMainWicboqToPrjboqCompareUiForWicService
     * @function
     *
     * @description
     *
     */
	angular.module(moduleName).factory('estimateMainGeneratePrjboqStructureService',
		['$http', '$q', '_',
			function ($http, $q, _) {

				let service = {};

				let boqHeadersWithStructures = [];

				service.loadBoqStuctures = function (boqHeaderIds) {
					boqHeadersWithStructures = [];

					$http.post(globals.webApiBaseUrl + 'boq/main/getboqheaderswithstructure', boqHeaderIds).then(function(response) {
						boqHeadersWithStructures = response.data;
					});
				};

				service.getBoqStructure = function (boqHeaderId) {
					let deferred = $q.defer();
					let boqHeader = _.find(boqHeadersWithStructures, {Id: boqHeaderId});

					if(boqHeader){
						deferred.resolve(boqHeader);
					}else{
						$http.post(globals.webApiBaseUrl + 'boq/main/getboqheaderswithstructure', [boqHeaderId]).then(function(response) {
							if(response && response.data && response.data.length > 0){
								boqHeadersWithStructures.push(response.data[0]);
								deferred.resolve(response.data[0]);
							}
							deferred.resolve('');
						});
					}

					return deferred.promise;
				};

				service.clear = function () {
					boqHeadersWithStructures = [];
				};

				return service;
			}
		]);
})(angular);

