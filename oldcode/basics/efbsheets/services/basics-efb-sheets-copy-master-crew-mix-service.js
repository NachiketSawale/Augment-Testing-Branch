/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'basics.efbsheets';
	/* global globals */

	// 'search Master CrewMix' dialog grid column definition
	angular.module(moduleName).value('efbSheetsSearchMasterCrewMixColumnsDef',
		{
			getStandardConfigForListView: function () {
				let columns =
					[
						{
							id: 'code',
							field: 'Code',
							name: 'Code',
							formatter : 'code',
							name$tr$: 'cloud.common.entityCode',
							width: 200
						},
						{
							id: 'desc',
							field: 'DescriptionInfo.Description',
							name: 'Description',
							name$tr$: 'cloud.common.entityDescription',
							formatter : 'description',
							width: 300
						}
					];
				return columns;
			}
		}
	);

	/**
     * @ngdoc service
     * @name basicsEfbsheetsCopyMasterCrewMixService
     * @function
     * @requires $q
     *
     * @description
     * data service for copy Master CrewMix
     */
	/* jshint -W072 */
	angular.module(moduleName).factory('basicsEfbsheetsCopyMasterCrewMixService', [
		'$q', '$injector','$window', '$http', 'platformContextService', 'basicsEfbsheetsProjectMainService', 'platformCreateUuid','efbSheetsSearchMasterCrewMixColumnsDef',
		'basicsLookupdataLookupDataService', 'basicsLookupdataLookupViewService','basicsLookupdataLookupDefinitionService',
		function ($q,$injector, $window, $http, platformContextService, basicsEfbsheetsProjectMainService, platformCreateUuid, columnsDef,
			basicsLookupdataLookupDataService,basicsLookupdataLookupViewService,basicsLookupdataLookupDefinitionService) {

			let service = {};

			service.showMasterCrewMixDialog = function showMasterCrewMixDialog(selectedProjectItem) {
				let masterCrewMixLookupOptions = {
					lookupType: 'estCrewMixMasterLookup',
					valueMember: 'Code',
					displayMember: 'Icon',

					isClientSearch: true,
					isExactSearch: true,

					showClearButton: true,
					showEditButton: false,

					eagerSearch: true,

					showCustomInputContent: true,
					uuid: 'b0b2f9bab961417d8ae14cfd260d624e',
					columns: columnsDef.getStandardConfigForListView(),
					gridOptions: {
						multiSelect: true
					},
					isStaticGrid: true,
					title: {
						name: 'Master CrewMixes',
						name$tr$: 'basics.efbsheets.masterCrewMixes'
					},
					buildSearchString: function (searchValue) {
						if (!searchValue) {
							return '';
						}
						return searchValue;
					},
					onDataRefresh: function () {
						// refresh it, and check it refresh or not
						return service.getListAsync();
					}
				};

				let customConfiguration ={
					dataProvider: {
						getList: function () {
							return service.getListAsync();
						},

						getItemByKey: function (value) {
							return service.getSearchList(value);
						},

						getSearchList: function (value, config, scope) {
							return service.getSearchList(value, config, scope);
						}
					},
				};

				function handleDataProvider(lookupOptions, customConfiguration) {
					if (lookupOptions.lookupType) {
						if (customConfiguration.dataProvider) {
							customConfiguration.dataProvider = basicsLookupdataLookupDataService.registerDataProvider(lookupOptions.lookupType, customConfiguration.dataProvider, true);
						}
						else {
							customConfiguration.dataProvider = basicsLookupdataLookupDataService.registerDataProviderByType(lookupOptions.lookupType, customConfiguration.url, true);
						}
					}
					masterCrewMixLookupOptions.dataProvider = customConfiguration.dataProvider;
				}

				handleDataProvider(masterCrewMixLookupOptions,customConfiguration);

				basicsLookupdataLookupDefinitionService.set(masterCrewMixLookupOptions);

				basicsLookupdataLookupViewService.showDialog(masterCrewMixLookupOptions).then(function (result) {
					// handle result here.
					if (result && result.isOk) {
						if (result.data && result.data.length > 0) {
							let data = { 'EstCrewMixes' :  result.data,
								'ProjectId' : selectedProjectItem ? selectedProjectItem.Id : null};

							$http.post(globals.webApiBaseUrl + 'basics/efbsheets/crewmixes/saverequestdata', data ).then(function () {
								basicsEfbsheetsProjectMainService.load();
								$injector.get('estimateMainLookupService').getPrjCostCodesTree();
							});
						}
					}
				});
			};

			let lookupData = {
				estCrewMixItems:[]
			};

			service.getEstCrewMixMasterPromise = function(){
				return $http.get(globals.webApiBaseUrl + 'basics/efbsheets/crewmixes/list');
			};

			// get data list of the master CrewMix items
			service.getList = function getList() {
				if(lookupData.estCrewMixItems.length >0){
					return lookupData.estCrewMixItems;
				}
				else{
					return [];
				}
			};

			// get data list of the master Crewmix items
			service.getListAsync = function getListAsync() {
				if(lookupData.estCrewMixItems && lookupData.estCrewMixItems.length >0){
					return $q.when(lookupData.estCrewMixItems);
				}
				else{
					return service.getEstCrewMixMasterPromise().then(function(response){
						lookupData.estCrewMixItems = response.data;
						return lookupData.estCrewMixItems;
					});
				}
			};

			// get list of the estimate boq items by filter value
			service.getSearchList = function getSearchList(value) {
				if(angular.isUndefined(value) && lookupData.estCrewMixItems){
					return $q.when(lookupData.estCrewMixItems);
				}

				if (!lookupData.searchMasterCrewMixItemsPromise) {
					lookupData.searchMasterCrewMixItemsPromise = $http.get(globals.webApiBaseUrl + 'basics/efbsheets/crewmixes/listbyfilter?filterValue='+ value );
				}
				return lookupData.searchMasterCrewMixItemsPromise.then(function (response) {
					lookupData.searchMasterCrewMixItemsPromise = null;
					return response.data;
				});
			};

			// clear lookup data
			service.clear = function(){
				lookupData.estCrewMixItems = [];
			};

			service.setMasterCrewMixItems = function(estMasterCrewMixItems){
				lookupData.estCrewMixItems =estMasterCrewMixItems;
			};

			return service;
		}
	]);
})(angular);
