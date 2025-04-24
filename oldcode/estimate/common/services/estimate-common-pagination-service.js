/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular){
	'use strict';
	/* global _, $ */
	let moduleName = 'estimate.common';
	let estimateCommonModule = angular.module(moduleName);

	estimateCommonModule.factory('estimateCommonPaginationService', [
		'$q', '$injector', '$timeout', 'platformGridAPI', 'platformDataProcessExtensionHistoryCreator',
		function ($q, $injector, $timeout, platformGridAPI, platformDataProcessExtensionHistoryCreator) {

			let service = {};

			angular.extend(service, {
				// #1 Extend ServiceContainer first
				extendPaginationService: extendPaginationService,

				// #2 Registere in Controller second
				registerPagination: registerPagination,
				unregisterPagination: unregisterPagination
			});

			return service;

			function registerPagination($scope, service){
				let gridId = $scope.gridId;

				let handler = service.getPaginationSettings();
				let recordsFound = handler.filterResponse.RecordsFound;
				let pageNumber = handler.filterRequest.PageNumber;
				let PpageSize = handler.filterRequest.PageSize;
				Object.assign(handler, getPaginationNewSettings());
				if(recordsFound > 0){
					handler.filterResponse.RecordsFound = recordsFound;
					handler.isLoading = false;
					handler.isReady = true;
					handler.filterRequest.PageNumber = pageNumber;
					handler.filterRequest.PageSize = PpageSize;
				}

				service.setPaginationSettings(handler);

				handler.gridId = gridId;

				processSearchToolsFn($scope.tools, handler);

				platformGridAPI.events.register(gridId, 'onScroll', function(e, args){
					let scrollDebounce =_.debounce(function(){
						onScroll(e, args, handler);
						// handler.onScroll(e, args, handler);
					}, 250);
					scrollDebounce();
				});

				let onKeyUpDebounce = _.debounce(function(){
					onSearchKeyUp(arguments);
				}, 500);

				if (gridId){
					let grid = platformGridAPI.grids.element('id',$scope.gridId);
					if (!grid.instance){
						$timeout(function(){
							registerPagination($scope, service);
						}, 1, true);
					}else if(!service.isKeepSearchPanel){
						$timeout(function(){
							// Search panel (general search field)
							$('.filterinput.' + $scope.gridId).unbind('keyup')
								.keyup(function(e){
									onKeyUpDebounce($scope, e, handler);
								});
						}, 51); // Framework is set up is at 50
					}

				}
			}

			function processSearchToolsFn(scopeTools, handler){
				let toolsItems = scopeTools.items;

				let searchAllTool = _.find(toolsItems, {id: 'gridSearchAll'});
				let searchColumnFilterTool = _.find(toolsItems, {id: 'gridSearchColumn'});

				function resetList(){
					clearFilterAndShowAll(handler);
				}

				searchAllTool.fn = function(){
					// clear filter for this another tool
					platformGridAPI.filters.showColumnSearch(handler.gridId, false, true);
					searchColumnFilterTool.value = false;


					// searchAllToolFn.apply(this, arguments);
					let value = arguments[1].value;
					let clearFilter = !value;
					platformGridAPI.filters.showSearch(handler.gridId, value, clearFilter);
					// resetList(value);
				};
				searchColumnFilterTool.fn = function(){
					// clear filter for this another tool
					platformGridAPI.filters.showSearch(handler.gridId, false, true);
					searchAllTool.value = false;


					// searchColumnFilterToolFn.apply(this, arguments);
					let value = arguments[1].value;
					let clearFilter = !value;
					platformGridAPI.filters.showColumnSearch(handler.gridId, value, clearFilter);
					resetList(value);
				};
			}

			function unregisterPagination($scope, service){
				// let pSettigns = service.getPaginationSettings();
				// platformGridAPI.events.unregister($scope.gridId, 'onScroll', pSettigns.onScroll);
				service.setList([]);
			}

			function extendPaginationService(serviceContainer){
				let pSettings=null;

				serviceContainer.data.paginationSettings = getPaginationNewSettings();

				pSettings = serviceContainer.data.paginationSettings;

				handleBeforeReadRequest(pSettings, serviceContainer);
				handleAfterReadRequest(pSettings, serviceContainer);

				// Custom pagination settings function
				serviceContainer.service.getPaginationSettings = function getPaginationSettings(){
					return serviceContainer.data.paginationSettings;
				};
				serviceContainer.service.setPaginationSettings = function setPaginationSettings(value){
					serviceContainer.data.paginationSettings = value;
				};
				serviceContainer.data.paginationSettings.getServiceContainerData = function getServiceContainerData(){
					return serviceContainer.data;
				};

				serviceContainer.data.paginationSettings.getCurrentContainerService = function getCurrentContainerService(){
					return serviceContainer.service;
				};
				serviceContainer.data.paginationSettings.getServiceName = serviceContainer.service.getServiceName;
			}

			function onSearchKeyUp(args){
				let $scope = args[0], e = args[1], handler = args[2];

				let ele = e.target;

				// clear on Esc
				if (e.which === 27) {
					ele.value = '';
				}

				// There are two modes of search.
				// 1 is : Search in single input text in the whole grid
				if ((ele.value.length === 0) || (_.trim(ele.value).length > 1)){
					updateFilter($scope.gridId, ele.value, null, handler);
				}
			}

			function updateFilter(gridID, filterString, $element, handler){
				let grid = platformGridAPI.grids.element('id', gridID);

				if (!_.isUndefined(filterString) && filterString.length) {
					grid.instance.getEditorLock().commitCurrentEdit();
					grid.instance.resetActiveCell();
				}

				grid.columnFilters = undefined;

				let filterRequest = getFilterRequest(handler);

				// Prepare variables to compare
				// filterRequest.Pattern = filterRequest.Pattern || '';

				// Do not send HTTP request if search keyword is the same as preview Search Request
				if (filterRequest.Pattern === filterString){
					return false;
				}else if (_.isEmpty(filterString.trim())){
					if (filterString.length === 0){ // Filter string is cleared
						clearFilterAndShowAll(handler);
					}
					return false;
				}

				filterRequest.Pattern = filterString.trim(); // Trim pattern

				// TODO: Filter in tree data
				let searchableFields = _.map(_.filter(grid.columns.visible, 'searchable'), function(col){
					return {
						field: col.id,
						filterString : filterString
					};
				});

				searchAndResolveHttpRequestData(handler.searchType.searchAll, handler, searchableFields, filterRequest);
			}

			function clearFilterAndShowAll(handler){
				if (!handler.isReady){
					return;
				}

				// Reset list
				handler.filterRequest.Pattern = null;
				handler.filterRequest.furtherFilters = [];

				// Set flag is loading = true to avoid Scroll conflict
				handler.isLoading = true;
				searchAndResolveHttpRequestData(handler.searchType.searchAll, handler, [], handler.filterRequest);
			}

			function searchAndResolveHttpRequestData(searchType, handler, searchableFields, filterRequest){
				let grid = platformGridAPI.grids.element('id', handler.gridId);

				handler.filterRequest.PageNumber = -1; // Reset Paging  (Skip * pageSize) gets the first page items result
				handler.filterRequest.furtherFilters = [];

				if (_.isEmpty(searchableFields)){
					// Reset

					// httpReadRequestResolve(handler, filterRequest, grid);
					triggerReadByPageSettings(handler, grid, true);
					// return false;
				}else{
					_.forEach(searchableFields, function(col){
						// SearchType 1 = General search // Search type 2 = Search by columns
						let filterString = searchType === handler.searchType.searchAll ? filterRequest.Pattern : col.filterString;
						filterRequest.furtherFilters.push({Token: col.field.toUpperCase(), Value: filterString });
					});

					// filterRequest.PageNumber = 0; //Reset Paging  (Skip * pageSize) gets the first page items result

					// If it was not initialized then RETURN
					if (!handler.isReady){
						return;
					}

					// just added
					grid.instance.toggleOverlay(true);

					// Flag to avoid sending duplicate request
					handler.isLoading = true;

					// httpReadRequestResolve(handler, filterRequest, grid);
					triggerReadByPageSettings(handler, grid, true);
					platformGridAPI.filters.updateHeaderRowIndicatorIcon(handler.gridId);
				}
			}

			function getPaginationNewSettings(){
				return {
					// Variables
					gridId: null,
					// Only trigger request data when service has been initialized
					isReady: false,
					// filterRequest to send as HTTP Read Request
					filterRequest: {
						// Pattern: '',
						PageNumber: 0,
						PageSize: 30
					},
					filterResponse: {
						RecordsFound: 0
						// RecordsRetrieved: 0
					},
					// Flag to stop next request from being sent
					isLoading: false,

					searchType: {
						searchAll: 1,
						searchColumn: 2
					}
				};
			}

			function handleBeforeReadRequest(handler, serviceContainer){
				// let serviceFilterRequest = {};
				// eslint-disable-next-line no-prototype-builtins
				if (serviceContainer.data.hasOwnProperty('initReadData')){
					let onInitReadData = serviceContainer.data.initReadData;
					serviceContainer.data.initReadData = function(readData){
						onInitReadData(readData);

						setFilterRequest(handler, readData, handler.filterRequest.Pattern);//

						// arguments[0] = serviceFilterRequest;
						onInitReadData.apply(serviceContainer.data, arguments); // send filter request instead of arguments
					};
				}
			}

			function handleAfterReadRequest(handler, serviceContainer){
				// eslint-disable-next-line no-prototype-builtins
				if (serviceContainer.data.hasOwnProperty('onReadSucceeded')){
					let onReadSucceededFn = serviceContainer.data.onReadSucceeded;
					serviceContainer.data.onReadSucceeded = function (response){
						setFilterResponse(serviceContainer.data.paginationSettings, response);

						let dataService = $injector.get(handler.getServiceName());
						if(_.isFunction(dataService.setDtosByPagination)){
							dataService.setDtosByPagination(response.dtos);
						}

						handler.isLoading = false;
						onReadSucceededFn.apply(serviceContainer.data, arguments);
					};
				}
			}

			function getFilterRequest(handler,noAddPageNumber){
				return Object.assign(handler.filterRequest, {
					PageNumber : noAddPageNumber? handler.filterRequest.PageNumber: handler.filterRequest.PageNumber += 1
				});
			}

			function setFilterRequest(handler, filterRequest/* , pattern */) {

				Object.assign(handler.filterRequest, filterRequest);

				handler.filterRequest.PageNumber = 0;
				if (!Object.prototype.hasOwnProperty.call(handler.filterRequest, 'PageSize')) {
					handler.filterRequest.PageSize = 30;
				}

				// Situation: Keep the filter when changing selection to other leading structure
				// Combine vice-versa
				Object.assign(filterRequest, handler.filterRequest);
			}

			function setFilterResponse(handler, response){
				handler.isReady = true;

				// eslint-disable-next-line no-prototype-builtins
				if (response && response.hasOwnProperty('filterResponse') && response.filterResponse.hasOwnProperty('RecordsFound')){
					handler.filterResponse = response.filterResponse;
				}else{
					// eslint-disable-next-line no-console
					console.log('Response does not have filterResponse property. It should contain RecordsFound property too. Please check your HttpResponse');
				}

			}

			function onScroll(e, args, handler) {
				if (!handler.isReady){
					return;
				}

				let dataCurrentCount = args.grid.getDataLength();

				if(dataCurrentCount === 0){
					return;
				}

				let dataHeight = dataCurrentCount * 25;
				let isHeightReadyToLoad = dataHeight - args.scrollTop < args.grid.getGridPosition().height;

				if (isHeightReadyToLoad && !handler.isLoading) {

					let dataService = $injector.get(handler.getServiceName());
					// Check all data is already loaded
					if (dataCurrentCount === handler.filterResponse.RecordsFound || (_.isFunction(dataService.getDtosByPagination) && dataService.getDtosByPagination() && !dataService.getDtosByPagination().length)){
						// All data is already loaded, no need to send request.
						return;
					}

					handler.isLoading = true;

					triggerReadByPageSettings(handler);
				}
			}

			function triggerReadByPageSettings(handler, grid, clearDataBeforeInserting){
				let serviceContainerData = handler.getServiceContainerData();

				let currentContainerService = handler.getCurrentContainerService();
				if(currentContainerService && _.isFunction(currentContainerService.getFilterCondition)){
					let filter = currentContainerService.getFilterCondition();
					Object.assign(handler.filterRequest, filter);
				}

				serviceContainerData.doCallHTTPRead(getFilterRequest(handler), serviceContainerData).then(function(response){
					// TODO: set response.filterInfo response here
					setFilterResponse(handler, response);

					// eslint-disable-next-line no-prototype-builtins
					if (response && response.hasOwnProperty('dtos')){
						let dtos = _.uniqBy(response.dtos, 'Id');
						let service = $injector.get(handler.getServiceName());

						if(_.isFunction(service.setDtosByPagination)){
							service.setDtosByPagination(response.dtos);
						}

						if(service && _.isFunction(service.dealDoubleData)){
							dtos = service.dealDoubleData(dtos);
						}
						if(service && _.isFunction(service.dealCostGroupData)){
							service.dealCostGroupData(response);
						}

						if(service && _.isFunction(service.updateCacheList)){
							service.updateCacheList(response);
						}

						if (clearDataBeforeInserting){
							handler.getServiceContainerData().itemList = [];
						}

						let list = angular.copy(service.getList());
						_.forEach(dtos, function(dto){
							platformDataProcessExtensionHistoryCreator.processItem(dto);
							list.push(dto);
						});

						// TODO: Expose response to standard function, to it can be processed?
						service.setList(list);
					}else{
						// We only support dtos for now
						console.error('Cannot read DTOs of undefined');
					}

					if (grid){
						grid.instance.toggleOverlay(false);
					}

					handler.isLoading = false;
				});
			}
		}]);
})(angular);
