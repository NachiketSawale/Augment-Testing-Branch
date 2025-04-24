/**
 * Created by wul on 4/17/2018.
 */
(function () {

	'use strict';
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);

	/* jslint nomen:true */
	/* global globals, _ */
	estimateMainModule.factory('estimateMainWicboqToPrjboqCompareDataForBoqService', ['$q','platformDataServiceFactory', 'ServiceDataProcessArraysExtension', 'boqMainImageProcessor', 'lookupZeroToNullProcessor', 'platformModalService', 'estimateMainService','boqMainCommonService',
		function ($q,platformDataServiceFactory, ServiceDataProcessArraysExtension, boqMainImageProcessor, lookupZeroToNullProcessor, platformModalService, estimateMainService,boqMainCommonService) {

			let projectId = estimateMainService.getSelectedProjectId();

			let boqServiceOption = {
				hierarchicalRootItem: {
					module: estimateMainModule,
					serviceName: 'estimateMainBoqService',
					httpRead: {
						route: globals.webApiBaseUrl + 'boq/project/',
						endRead: 'getsimpleboqsearchlist'
					},
					dataProcessor: [new ServiceDataProcessArraysExtension(['BoqItems']), boqMainImageProcessor, lookupZeroToNullProcessor],
					useItemFilter: true,
					presenter: {
						tree: {
							parentProp: 'BoqItemFk',
							childProp: 'BoqItems',
							incorporateDataRead: function (readData, data) {
								_.forEach(readData, function(rootboq){
									boqMainCommonService.setBoqItemLevel(rootboq);
								});
								return data.handleReadSucceeded(readData, data);
							}
						}
					},
					entityRole: {root: {
						addToLastObject: true,
						lastObjectModuleName: moduleName,
						codeField: 'Reference',
						descField: 'BriefInfo.Description',
						itemName: 'EstBoq',
						moduleName: 'Estimate Main'
					}},
					actions: {} // no create/delete actions
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(boqServiceOption);
			serviceContainer.data.updateOnSelectionChanging = null;
			let service = serviceContainer.service;
			service.setFilter('projectId=' + projectId + '&filterValue=');

			service.loadData = function() {
				projectId = estimateMainService.getSelectedProjectId();

				service.setFilter('projectId=' + projectId);

				if(projectId){
					return service.load();
				}else{
					let defer = $q.defer();
					defer.resolve([]);
					return defer.promise;
				}

			};

			let scope = {};

			service.setScope = function ($scope) {
				scope = $scope;
			};

			service.setLoadingState = function(state){
				scope.isLoading = state;
			};

			return service;
		}]);
})();
