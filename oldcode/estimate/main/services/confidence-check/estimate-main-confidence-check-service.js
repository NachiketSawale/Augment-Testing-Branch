/**
 * $Id$
 * Copyright (c) RIB Software SE
 */


(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name estimateMainConfidenceCheckService
	 * @function
	 *
	 * @description
	 * Main service for Estimate Confidence check container
	 */

	/* global globals, _, Platform */

	let moduleName = 'estimate.main';
	let serviceName = 'estimateMainConfidenceCheckService';

	angular.module(moduleName).factory('estimateMainConfidenceCheckService', ['$injector','platformDataServiceFactory','estimateMainService','estimateMainFilterService','estimateMainFilterCommon',
		function ($injector,platformDataServiceFactory,estimateMainService,estimateMainFilterService,estimateMainFilterCommon) {

			let service = {};
			let projectId = estimateMainService.getSelectedProjectId();
			let estHeaderId, gridId = 'e790ba05b2f54e35ab95041e10941499';

			let confidenceCheckService = {
				hierarchicalRootItem: {
					module: moduleName,
					serviceName: serviceName,
					entityNameTranslationID: 'estimate.main.confidenceCheck.confidenceCheck',
					httpRead: {
						route: globals.webApiBaseUrl + 'estimate/main/confidencecheck/',
						endRead: 'getconfidencechecklist',
						initReadData: function (readData) {
							let estHeaderId = estimateMainService.getSelectedEstHeaderId();
							if(estHeaderId){
								readData.filter = '?projectId=' + projectId + '&estHeaderId=' + estHeaderId;
								return readData;
							}
						}
					},
					useItemFilter: true,
					presenter: {
						tree: {
							parentProp: 'EstConfidenceParentFk',
							childProp: 'EstConfidenceCheckChildrens',
							incorporateDataRead: function incorporateDataRead(readData,data) {
								estimateMainService.updateModuleHeaderInfo();
								service.processItem(readData);
								return data.handleReadSucceeded(readData, data);
							}
						}
					},
					entityRole: {
						root: {
							addToLastObject: true,
							codeField: 'FilterColumnName',
							descField: 'DescriptionInfo.Translated',
							lastObjectModuleName: moduleName,
							moduleName: 'Estimate Main',
							itemName: 'EstConfidenceCheck'
						}
					},
					translation: {
						uid: serviceName,
						title: 'estimate.main.confidenceCheck.confidenceCheck'
					},
					entitySelection: {supportsMultiSelection: true}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(confidenceCheckService);

			service = serviceContainer.service;
			let allFilterIds = [];

			service.setFilter('projectId=' + projectId + 'estHeaderId=' + estHeaderId);

			// filter leading structure by line items
			estimateMainFilterService.addLeadingStructureFilterSupport(service, 'Id');

			service.filterEstConfidenceCheckItem = new Platform.Messenger();

			service.registerFilterConfidenceCheckItem = function (callBackFn) {
				service.filterEstConfidenceCheckItem.register(callBackFn);
			};
			service.unregisterFilterConfidenceCheckItem = function (callBackFn) {
				service.filterEstConfidenceCheckItem.unregister(callBackFn);
			};

			service.markersChanged = function markersChanged(itemList) {
				let filterKey = 'EST_CONFIDENCE_CHECK';

				if (_.isArray(itemList) && _.size(itemList) > 0) {
					allFilterIds = [];

					// get all child locations (for each item)
					_.each(itemList, function (item) {
						let Ids = _.map(estimateMainFilterCommon.collectItems(item, 'EstConfidenceCheckChildrens'), 'Id');
						allFilterIds = allFilterIds.concat(Ids);
					});
					estimateMainFilterService.setFilterIds(filterKey, allFilterIds);
					estimateMainFilterService.addFilter('estimateMainConfidenceCheckController', service, function () {
						return true;
					}, {id: filterKey, iconClass: 'tlb-icons ico-filter-confidence-check', captionId: 'filterConfidenceCheck'});
				} else {
					allFilterIds = [];
					estimateMainFilterService.setFilterIds(filterKey, []);
					estimateMainFilterService.removeFilter('estimateMainConfidenceCheckController');
				}

				service.filterEstConfidenceCheckItem.fire();
			};

			service.loadConfidenceCheck = function (isFromNavigator) {
				if (projectId !== estimateMainService.getSelectedProjectId() ||  service.getList().length <= 0) {
					projectId = estimateMainService.getSelectedProjectId();
					estHeaderId = estimateMainService.getSelectedEstHeaderId();
					service.setFilter('projectId=' + projectId + 'estHeaderId=' + estHeaderId);
					if (projectId ) {
						service.load().then(function () {
							$injector.get('platformGridAPI').rows.expandAllNodes(gridId);
						});
					}
				}
				else{
					if(isFromNavigator === 'isForNagvitor'){
						service.load();
					}
				}
			};

			service.setAutoRefresh = function setAutoRefresh(isAutoRefresh){
				service.autoRefresh = isAutoRefresh;
			};

			service.isAutoRefresh = function isAutoRefresh(){
				return service.autoRefresh;
			};

			service.processItem = function processItem(items) {
				if(items){
					let childItems = items[0].EstConfidenceCheckChildrens;

					_.each(childItems,function (item){
						let allFieldsReadOnly = [];
						_.forOwn(item, function (value, key) {
							let field = {field: key, readonly: true};
							allFieldsReadOnly.push(field);
						});
						allFieldsReadOnly.push({field: 'IsMarked', readonly: true});
						allFieldsReadOnly.push({field: 'Filter', readonly: true});
						$injector.get('platformRuntimeDataService').readonly(item, allFieldsReadOnly);
					});
				}
			};
			return service;
		}]);

})(angular);