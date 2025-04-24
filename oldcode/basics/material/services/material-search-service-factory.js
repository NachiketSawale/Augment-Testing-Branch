(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).constant('basicsMaterialSearchSortOptions', {
		None: -1,
		SupplierAscending: 0,
		SupplierDescending: 1,
		CodeAscending: 2,
		CodeDescending: 3,
		PriceAscending: 4,
		PriceDescending: 5
	});

	angular.module(moduleName).constant('basicsMaterialSearchTextKindOptions', {
		all: 0,
		basics: 1,
		specification: 2,
		attribute: 3,
		catalogAndStructure: 4
	});

	angular.module(moduleName).constant('basicsMaterialCatalogType', {
		framework: 3
	});

	/**
	 * @ngdoc service
	 * @name basics.material.basicsMaterialSearchServiceFactory
	 * @function
	 * @requireds
	 *
	 * @description Provide Material Search data service factory for different places like ticket system, material lookup in different modules
	 */
	angular.module(moduleName).factory('basicsMaterialSearchServiceFactory',
		['$http', 'basicsMaterialSearchSortOptions', 'basicsMaterialMaterialBlobService', 'PlatformMessenger', '$q','_', 'platformModalService',
			'basicsMaterialPriceListLookupDataService', 'basicsLookupdataLookupFilterService', 'platformGridAPI', 'basicsMaterialSearchGridId',
			function ($http, sortOptions, basicsMaterialMaterialBlobService, PlatformMessenger, $q, _, platformModalService,
					  basicsMaterialPriceListLookupDataService, basicsLookupdataLookupFilterService, platformGridAPI, basicsMaterialSearchGridId) {

				function create() {
					var service = {};
					var queryPath = globals.webApiBaseUrl + 'basics/material/commoditysearch/';
					var putInternetMaterialUrl = globals.webApiBaseUrl + 'basics/publicapi/material/1.0/putmaterialfrominternet';
					var catalogUrl = globals.webApiBaseUrl + 'basics/materialcatalog/catalog/';
					service.oldOption=null;
					var defaultSearchOption = {
						CurrentPage: 1,
						ItemsPerPage: 10,
						AttrPageNumber: 1,
						AttrPageCount: 100,
						SearchText: '',
						FilterString: '',
						Filter: {}, // for material lookup controller
						CategoryIdsFilter: null,
						UomIdsFilter: null,
						UomsFilter: null,
						PriceRange: null,
						Co2SourceNameFilter:null,
						Co2SourceIdsFilter:null,
						Co2SourceRange:null,
						Co2ProjectRange:null,
						StructureId: null,
						AttributeFilters: null,
						SortOption: sortOptions.PriceAscending, //Price low -> high
						PreDefine: null,
						FilterByFramework: false,
						// Todo - DEV-12444 this option should be removed, no need anymore due to project rate book is integrated into backend
						isMaster: false, // if true, it will not filter material categories based on ratebook(master data filter)
						MaterialTypeFilter: {
							IsForEstimate: false,
							IsForProcurement: false,
							IsForRM: false,
							IsForLogistics: false,
							IsForModel: false,
							IsForSales: false
						},
						ShowTraceLog: true
					};
					var defaultData = {
						items: [],
						groups: [],
						categories: [],
						structures: [],
						attributes: [],
						uoms: [],
						price: {},
						co2project: {},
						co2source: {},
						co2sources: [],
						matchedCount: 0,
						maxGroupCount: 0,
						hasResult: false,
						progress: {
							isLoading: false,
							info: 'Loading'
						},
						alternativeSources: [],
						attrContext: {},
						errors: []
					};

					service.dataCache = {
						loaded: {}
					};
					service.searchOptions = angular.copy(defaultSearchOption);
					service.data = angular.copy(defaultData);
					service.onListLoaded = new PlatformMessenger();
					service.onSearchConditionChange = new PlatformMessenger();
					service.setCache = setCache;
					/**
				 * Group material by property.
				 * @param data
				 * @param property
				 * @returns {Array}
				 */
					function groupBy(data, property) {
						var materials = data.Materials,
							catalogs = data.InternetCategories;

						if (!materials || !materials.length) {
							return [];
						}

						var result = [];
						var groups = _.groupBy(materials, function (item) {
							return item[property];
						});

						for (var group in groups) {
							if (groups.hasOwnProperty(group)) {
								var catalog = _.find(catalogs, {Id: parseInt(group)});

								result.push({
									gid: group,
									title: catalog ? catalog.DescriptionInfo.Description : 'iTWO 4.0',
									items: groups[group]
								});
							}
						}

						return result.sort(function (group1, group2) {
							if (group1.gid === 'null') {
								return -1;
							}
							else if (group2.gid === 'null') {
								return 1;
							}
							else {
								return 0;
							}
						});

					//return result;
					}

					/**
				 * @ngdoc function
				 * @name searchSuccessHandler
				 * @function
				 * @methodOf basicsMaterialSearchServiceFactory
				 * @description
				 * @param {Object} response, response data from search material web api
				 * @param {Bool} resetCategoriesByResult reset the categories filtering according to the search result or not
				 * @param {Bool} restAttributeByResult reset the attribute filtering according to the search result or not
				 * @returns search result of material
				 */
					function searchSuccessHandler(response, resetCategoriesByResult, restAttributeByResult) {
						var result = response.data;
						service.data.hasResult = true;

						if (resetCategoriesByResult === true) {
							service.data.categories = result.MaterialCategories;
							service.data.alternativeSources = result.AlternativeSources;
						}

						service.data.structures = result.Structures;

						if (result.MaterialIdSelected !== 0){
							var materialIndex =  _.findIndex(result.Materials, { Id: result.MaterialIdSelected });
							if (materialIndex !== -1){
								var materialToSelect =  result.Materials[materialIndex];
								service.searchOptions.StructureId = materialToSelect.PrcStructureFk;
							}
						}

						if (restAttributeByResult === true) {
							service.data.attributes = result.Attributes;
							service.data.attrContext = {};
							service.data.uoms = result.Uoms;
							service.data.co2sources = result.Co2Sources;
							if (result.PriceRange) {
								service.data.price = {
									options: {
										min: result.PriceRange.MinValue,
										max: result.PriceRange.MaxValue,
										step: 1,
										range: true
									},
									value: [result.PriceRange.MinValue, result.PriceRange.MaxValue]
								};
							}
							else {
								service.data.price = null;
							}
							if(result.Co2ProjectRange){
								let stepVal = 1;
								if(!_.isNil(result.Co2ProjectRange.MaxValue)){
									stepVal = getStep(result.Co2ProjectRange.MaxValue);
								}
								service.data.co2project = {
									options: {
										min: result.Co2ProjectRange.MinValue,
										max: result.Co2ProjectRange.MaxValue,
										step: stepVal,
										range: true
									},
									value: [result.Co2ProjectRange.MinValue, result.Co2ProjectRange.MaxValue]
								};
							}else{
								service.data.co2project = null;
							}
							if(result.Co2SourceRange){
								let stepVal = 1;
								if(!_.isNil(result.Co2SourceRange.MaxValue)){
									stepVal = getStep(result.Co2SourceRange.MaxValue);
								}
								service.data.co2source = {
									options: {
										min: result.Co2SourceRange.MinValue,
										max: result.Co2SourceRange.MaxValue,
										step: stepVal,
										range: true
									},
									value: [result.Co2SourceRange.MinValue, result.Co2SourceRange.MaxValue]
								};
							}else{
								service.data.co2source = null;
							}
						}

						//Remove the attribute filter setting according to the feedback.
						//The filtered attribute not in the return attribute, remove it
						// service.searchOptions.AttributeFilters = _.filter(service.searchOptions.AttributeFilters, function (filterAttr) {
						// 	return _.some(result.Attributes, filterAttr);
						// });

						service.data.matchedCount = result.MatchedCount;
						service.data.maxGroupCount = result.MaxGroupCount;
						service.data.items = result.Materials;
						service.data.errors = result.InternetCatalogErrors;
						setCache(result.Materials);
						initPriceList();
						service.processFrameworkCatalog();
						basicsMaterialMaterialBlobService.provideImage(service.data.items);
						service.data.groups = groupBy(result, 'InternetCatalogFk');
						service.data.internetCategories = result.InternetCategories;
						service.onListLoaded.fire({materialIdToSelect: result.MaterialIdSelected});

						return service.data;
					}

					function setCache(materials) {
						if (materials && materials.length) {
							materials.forEach(item => {
								service.dataCache.loaded[item.Id] = item;
							});
						}
					}

					function getCache(id) {
						return service.dataCache.loaded[id];
					}

					function getStep(value){
						let stepVal = 1;
						let maxValue = value.toString();
						let indexVal = maxValue.length-(maxValue.indexOf('.')+1);
						if(maxValue.indexOf('.')!==-1){
							for (let i = 0; i < indexVal; i++) {
								stepVal = stepVal/10;
							}
						}
						return stepVal;
					}

					function initPriceList() {
						if(_.isNil(service.data.categories) || !service.data.categories.length){
							return;
						}

						service.data.categories.forEach(function (catalog) {
							service.processPriceList(catalog.Id, catalog.MaterialPriceVersionFk);
						});
					}

					/**
				 * @ngdoc function
				 * @name processResponse
				 * @function
				 * @methodOf basicsMaterialSearchServiceFactory
				 * @description process the respond data from material search/initial
				 * @param {Bool} resetCategoriesByResult reset the categories filtering according to the search result or not
				 * @returns {Bool} restAttributeByResult reset the attribute filtering according to the search result or not
				 * @returns search result of material
				 */
					function processResponse(response, resetCategoriesByResult, restAttributeByResult){
						if(angular.isFunction(service.searchOptions.lookupdataProcessor)){
							return service.searchOptions.lookupdataProcessor(response.data.Materials).then(function(returnMaterail){
								if(returnMaterail){
									response.data.Materials = returnMaterail;
								}
								return searchSuccessHandler(response, resetCategoriesByResult, restAttributeByResult);
							});
						}

						return searchSuccessHandler(response, resetCategoriesByResult, restAttributeByResult);
					}

					/**
				 * @ngdoc function
				 * @name doSeacrhHttpCall
				 * @function
				 * @methodOf basicsMaterialSearchServiceFactory
				 * @description do http call the search the matial according to the search options
				 * @param {Bool} resetCategoriesByResult reset the categories filtering according to the search result or not
				 * @returns {Bool} restAttributeByResult reset the attribute filtering according to the search result or not
				 * @returns {Promise} material search promise
				 */
					function doSeacrhHttpCall(resetCategoriesByResult, restAttributeByResult, simpleMode, ignorePricePermission) {
						var data = angular.copy(service.searchOptions);
						if(data.EnableOnlyMainContract === false){
							data.Filter.BasisContractId = null;
						}
						data.IsResetCatalog = resetCategoriesByResult;
						data.IsResetAttribute = restAttributeByResult;
						data.ignorePricePermission = !!ignorePricePermission;
						service.data.progress.isLoading = true;
						service.oldOption=data;
						return $http({
							method: 'POST',
							url: queryPath + (simpleMode? '1.0/simplesearch': '1.0/search'),
							data: data
						}).then(function (response) {
							if(response.data && response.data.TraceLog) {
								console.log(response.data.TraceLog);
							}
							return processResponse(response, resetCategoriesByResult, restAttributeByResult);
						}).finally(function () {
							service.data.progress.isLoading = false;
						});
					}

					service.loadResultSet = function () {
						if (service.oldOption) {
							var loadAllOption = angular.copy(service.oldOption);
							loadAllOption.ItemsPerPage = 500;
							loadAllOption.CurrentPage = 1;
							return $http({
								method: 'POST',
								url: queryPath + '1.0/search',
								data: loadAllOption
							});
						}
					};

					/**
				 * reset price list according to price version defined in material catalog
				 */
					service.processPriceList = function(catalogId, priceVersionId, unSelectPriceList) {
						var materials = service.data.items;

						if (_.isNil(materials) || !materials.length) {
							return;
						}

						var result = materials.filter(function (material) {
							return material.MdcMaterialCatalogFk === catalogId;
						});

						if (result.length) {
							result.forEach(function (item) {
								if (item.PriceLists && item.PriceLists.length) {
									// Id = -1 can select the material price data without price list
									// after selecting price list, the id of selected price list is processed to null
									var priceList = unSelectPriceList ?
										_.find(item.PriceLists, function (p) { return (p.Id === -1 || p.Id === null) }) :
										_.find(item.PriceLists, {MaterialPriceVersionFk: priceVersionId});

									if (priceList && item.MaterialPriceListFk !== priceList.Id) {
										item.MaterialPriceListFk = (unSelectPriceList || priceList.Id < 0) ? null : priceList.Id;
										basicsMaterialPriceListLookupDataService.setState(item, priceList);
										basicsMaterialPriceListLookupDataService.overridePrice(item, priceList);
									}
								}
							});
						}
					};

					/**
				 * Set IsFromFC flag to material.
                 */
					service.processFrameworkCatalog = function () {
						var materials = service.data.items;

						if(!materials.length){
							return;
						}

						var frameworkCatalogIds = service.data.categories.filter(function (item) {
							return item.IsFrameworkCatalog;
						}).map(function (item) {
							return item.Id;
						});

						materials.forEach(function (item) {
							item.IsFromFC = frameworkCatalogIds.some(function (id) {
								return id === item.MdcMaterialCatalogFk;
							});
						});
					};

					/**
				 * @ngdoc function
				 * @name initialData
				 * @function
				 * @methodOf basicsMaterialSearchServiceFactory
				 * @description Initial the material search result with the selected lookup, only for material lookup
				 * @param {Int} current selected material id
				 * @returns {Promise} material search promise
				 */
					service.initialData = function (materialId) {
						return $http.get(queryPath + 'initial?materialId=' + materialId).then(function (response) {
							return processResponse(response, true, true);
						});
					};

					/**
				 * New method to replace "initialData"
				 * @param materialId
				 * @param options
                 * @param scope
                 * @returns {*}
                 */
					service.initialDataNew = function (materialId, options, scope) {
						var searchoptions = {
							MaterialId: materialId
						};

						getFilterString(options.filterKey, scope.entity, searchoptions);

						return $http.post(queryPath + 'initialnew', searchoptions).then(function (response) {
							return processResponse(response, true, true);
						});
					};

					/**
				 * @ngdoc function
				 * @name search
				 * @function
				 * @methodOf basicsMaterialSearchServiceFactory
				 * @description start a new search in seach button or by press end in search text box directly
				 * @returns {Promise} material search promise
				 */
					service.search = function (ignorePricePermission) {

						//Empty the attribute filters when search
						service.searchOptions.AttributeFilters = [];
						service.searchOptions.StructureId = null;
						service.searchOptions.CategoryIdsFilter = [];
						service.searchOptions.UomIdsFilter = [];
						service.searchOptions.UomsFilter = [];
						service.searchOptions.PriceRange = null;
						service.searchOptions.Co2ProjectRange = null;
						service.searchOptions.Co2SourceRange = null;
						service.searchOptions.Co2SourceNameFilter = [];
						service.searchOptions.Co2SourceIdsFilter = [];
						service.searchOptions.CurrentPage = 1;
						service.searchOptions.AttrPageNumber = 1;
						service.onSearchConditionChange.fire();
						return doSeacrhHttpCall(true, true, null, ignorePricePermission);
					};

					/**
				 * @ngdoc function
				 * @name navigateStructure
				 * @function
				 * @methodOf basicsMaterialSearchServiceFactory
				 * @description search when navigate through the procurement structure
				 * @returns {Promise} material search promise
				 */
					service.navigateStructure = function () {

						//Empty the attribute filters when search
						service.searchOptions.AttributeFilters = [];
						service.searchOptions.CategoryIdsFilter = [];
						service.searchOptions.UomIdsFilter = [];
						service.searchOptions.UomsFilter = [];
						service.searchOptions.Co2SourceNameFilter = [];
						service.searchOptions.Co2SourceIdsFilter = [];
						service.searchOptions.PriceRange = null;
						service.searchOptions.Co2ProjectRange = null;
						service.searchOptions.Co2SourceRange = null;
						service.searchOptions.AttrPageNumber = 1;
						service.onSearchConditionChange.fire();
						return doSeacrhHttpCall(true, true);
					};

					/**
				 * @ngdoc function
				 * @name filterByAttribute
				 * @function
				 * @methodOf basicsMaterialSearchServiceFactory
				 * @description search according to the attribute filter
				 *              The attribute filter list should not be reset
				 * @returns {}
				 */
					service.filterByAttribute = function () {
						service.onSearchConditionChange.fire();
						return doSeacrhHttpCall(false, false);
					};


					/**
				 * @ngdoc function
				 * @name paging
				 * @function
				 * @methodOf basicsMaterialSearchServiceFactory
				 * @description paging the search result
				 *              The attribute filter list should not be reset
				 * @returns {}
				 */
					service.paging = function (simpleMode, ignorePricePermission) {
						return doSeacrhHttpCall(false, false, simpleMode, ignorePricePermission);
					};

					/**
				 * @ngdoc function
				 * @name filterByCategory
				 * @function
				 * @methodOf basicsMaterialSearchServiceFactory
				 * @description search according to the category filter
				 *              The attribute filter list will be reset
				 * @returns {}
				 */
					service.filterByCategory = function () {
					//Empty the attribute filters when search
						service.searchOptions.AttributeFilters = [];
						service.searchOptions.UomIdsFilter = [];
						service.searchOptions.UomsFilter = [];
						service.searchOptions.Co2SourceNameFilter = [];
						service.searchOptions.Co2SourceIdsFilter = [];
						service.searchOptions.PriceRange = null;
						service.searchOptions.Co2ProjectRange = null;
						service.searchOptions.Co2SourceRange = null;
						service.searchOptions.AttrPageNumber = 1;
						service.onSearchConditionChange.fire();
						return doSeacrhHttpCall(false, true);
					};

					/**
				 * @ngdoc function
				 * @name getAttributesByMaterialId
				 * @function
				 * @methodOf basicsMaterialSearchServiceFactory
				 * @description return the attributes of the material according to the given material id
				 * @param {Number} materialId material id
				 * @returns {Promise} Array of the attributes
				 */
					service.getAttributesByMaterialId = function (materialId) {
						return $http.get(queryPath + '1.0/listattributes?materialId=' + materialId).then(function (response) {
							return response.data;
						});
					};

					service.getDocumentsById=function(item){
						if(item.InternetCatalogFk){
							return this.getDocumentsByInternetId(item.Id,item.InternetCatalogFk);
						}
						else{
							return this.getDocumentsByMaterialId(item.Id);
						}
					};

					function filterBySupport(data){
						var maindatas=data.Main;
						var typedatas=data.DocumentType;
						var showTypeMap={};
						var showMains=[];
						_.forEach(typedatas,function(supporType){
							showTypeMap[supporType.Id] = supporType;
						});
						data.DocumentType=_.values(showTypeMap);
						_.forEach(maindatas,function(maindata){
							if(showTypeMap[maindata.DocumentTypeFk]){
							   showMains.push(maindata);
						   }
						});
						data.Main=showMains;
						return data;
					}
					/**
				 * @ngdoc function
				 * @name getDocumentsByMaterialId
				 */
					service.getDocumentsByMaterialId = function (materialId) {
						return $http.post(globals.webApiBaseUrl + 'basics/material/document/listbyparent', {PKey1: materialId}).then(function (response) {
							return filterBySupport(response.data);
						});
					};

					/**
				 * @ngdoc function
				 * @name getDocumentsByInternetId
				 */
					service.getDocumentsByInternetId = function (materialId,catalogId) {
						return $http.get(globals.webApiBaseUrl + 'basics/material/commoditysearch/1.0/internetDoc?materialId=' + materialId+'&catalogId='+catalogId).then(function (response) {
						   return filterBySupport(response.data);
					 });
					};

					/**
				 * @ngdoc function
				 * @name getAttributes
				 * @function
				 * @methodOf basicsMaterialSearchServiceFactory
				 * @description return the attributes of the material according to the given material id
				 * @param {Number} material material item
				 * @returns {Promise} Array of the attributes
				 */
					service.getAttributes = function (material) {
						return $http.get(queryPath + '1.0/listattributes', {
							params: {
								materialId: material.Id,
								catalogId: material.InternetCatalogFk
							}
						}).then(function (response) {
							return response.data;
						});
					};

					/**
				 * Get internet catalog url result.
				 * @param id
				 * @returns {*|Promise}
				 */
					service.getInternetCatalogUrl = function (id) {
						return $http.get(catalogUrl + 'parseurl', {
							params: {
								id: id
							}
						});
					};

					/**
				 * @ngdoc function
				 * @name reset
				 * @function
				 * @methodOf basicsMaterialSearchServiceFactory
				 * @description reset the search option to the default
				 */
					service.reset = function () {
						service.searchOptions = angular.copy(defaultSearchOption);
						service.data = angular.copy(defaultData);
					};

					/**
				 * @ngdoc function
				 * @name doGetList
				 * @function
				 * @methodOf basicsMaterialSearchServiceFactory
				 * @description lookup for the material according to the given search text. It is used for the pop out when user type in directly in lookup editor
				 * @param {String} searchString search string for the lookup type in
				 * @param {String} filterString filter string in the context set by lookup editor
				 * @param {Function} lookupdataProcessor lookup data processor for showing the lookup data in search view correctly.
				 * @returns {Promise} search result of the material
				 */
					function doGetList(searchString, filterString, lookupdataProcessor) {
						return $http.get(queryPath + 'getsearchlist?searchText=' + searchString + '&filterString=' + filterString).then(function (response) {
							if (angular.isFunction(lookupdataProcessor)) {
								return lookupdataProcessor(response.data);
							}
							return response.data;
						});
					}

					function getFilterString(filterKey, entity, searchOptions) {
						if (!filterKey) {
							return '';
						}

						var filterOption = basicsLookupdataLookupFilterService.hasFilter(filterKey) ?
							basicsLookupdataLookupFilterService.getFilterByKey(filterKey) : null;

						if (angular.isObject(filterOption) && filterOption.fn && typeof filterOption.fn === 'function') {
							return filterOption.fn(entity, searchOptions);
						}

						return '';
					}

					/**
				 * @ngdoc function
				 * @name getSearchList
				 * @function
				 * @methodOf basicsMaterialSearchServiceFactory
				 * @description Implement the interface for lookup data provider, get result according to the filter and search text
				 * @param {String} filterString filter string in the context set by lookup editor
				 * @param {String} displayMeber the field display in lookup editor
				 * @param {Object} scope lookup scope
				 * @param {Object} setting lookup setting
				 * @returns {Promise} search result of the material
				 */
					service.getSearchList = function (searchRequest, options, scope) {
						//return doGetList(setting.searchString, filterString);
						var searchoptions = service.searchOptions;

						getFilterString(options.filterKey, scope.entity, searchoptions);

						searchoptions.CurrentPage = searchRequest.PageState.PageNumber + 1;
						searchoptions.ItemsPerPage = searchRequest.PageState.PageSize;
						searchoptions.SearchText = searchRequest.SearchText;

						// navigate to new material lookup backend
						searchoptions.Context = searchoptions.Filter;
						searchoptions.UserInput = searchRequest.SearchText;

						const payload = service.getFilterParam(searchoptions, {
							countAll: true,
							userInput: searchoptions.SearchText,
							contractName: searchoptions.ContractName,
							context: searchoptions.Filter,
							materialTypeFilter: searchoptions.MaterialTypeFilter,
							orderBy: sortOptions.None,
						});

						return service.executeFilter(payload).then(function (res) {
							return {
								items: res.data.Materials,
								itemsFound: res.data.MaterialsFound,
								itemsRetrieved: res.data.Materials.length
							};
						});
					};

					/**
				 * @ngdoc function
				 * @name getList
				 * @function
				 * @methodOf basicsMaterialSearchServiceFactory
				 * @description Implement the interface for lookup data provider, list all the matched items
				 * @param {Object} options lookup options
				 * @param {Object} scope lookup scope
				 * @param {Object} setting lookup setting
				 * @returns {Promise} search result of the material
				 */
					service.getList = function (options, scope, setting) {
						return doGetList(setting.searchString, '', options.dataProvider.lookupdataProcessor);
					};

					/**
				 * @ngdoc function
				 * @name getItemByKey
				 * @function
				 * @methodOf basicsMaterialSearchServiceFactory
				 * @description Implement the interface for lookup data provider, get the item according to the given id
				 * @param {Number} value material id
				 * @param {Object} scope lookup scope
				 * @param {Object} options lookup options
				 * @returns {Promise} material data
				 */
					service.getItemByKey = function (value, options) {
						const item = getCache(value);

						if (item) {
							return $q.when(item);
						}

						return $http.get(queryPath + 'getcommoditybyid?materialId=' + value).then(function (response) {
							var data = response.data;

							if (options.dataProvider && angular.isFunction(options.dataProvider.lookupdataProcessor)) {
								data = options.dataProvider.lookupdataProcessor([data])[0];
							}

							setCache([data]);

							return data;
						});
					};

					/**
				 * Put internet material to server database.
				 * @param material
				 * @returns {*}
				 */
					service.putInternetMaterial = function (materials) {
						service.data.progress.isLoading = true;

						if (!angular.isArray(materials)) {
							materials = [materials];
						}

						return $http({
							method: 'POST',
							url: putInternetMaterialUrl,
							data: {
								Identifiers: materials.map(function (material) {
									return {
										InternetCatalogId: material.InternetCatalogFk,
										MaterialId: material.Id,
										CatalogFk: material.MdcMaterialCatalogFk,
										MdcMatPriceverFk:material.MdcMatPriceverFk
									};
								})
							}
						}).finally(function () {
							service.data.progress.isLoading = false;
						});
					};

					/**
				 * Show errors during material import.
				 */
					service.showValidation = function (data) {
						platformModalService.showDialog({
							templateUrl: globals.appBaseUrl + 'basics.material/templates/lookup/import-material-validation.html',
							controller: ['$scope', function ($scope) {
								$scope.data = data;
							}]
						});
					};

					/**
				 * Check internet material, copy from internet to local.
				 * @param items
				 */
					service.copy = function (items) {
						var deferred = $q.defer();

						if (!angular.isArray(items)) {
							items = [];
						}

						var localItems = items.filter(function (item) {
							return _.isNil(item.InternetCatalogFk);
						});
						var internetItems = items.filter(function (item) {
							return !_.isNil(item.InternetCatalogFk);
						});

						if (internetItems.length) {
						// copy material from specified url.
							service.putInternetMaterial(internetItems).then(function (response) {
								if(response.data.Success){
								// copy successfully, return new material id.
									deferred.resolve(localItems.concat(response.data.Materials));
								}
								else {
									service.showValidation(response.data.ValidationResults);
									deferred.reject();
								}
							});
						}
						else {
							deferred.resolve(items);
						}

						return deferred.promise;
					};

					service.loadMoreAttribute = function(property) {
						var data = service.searchOptions;

						if (_.isNil(property)) {
							data.AttrPageNumber += 1;
						}
						else {
							var excludeValues = service.data.attributes.filter(function (item) {
								return item.Property.toLowerCase() === property.toLowerCase();
							}).map(function (item) {
								return item.Value;
							});

							data = angular.copy(data);

							data.AttrPageNumber = 1;

							data.MorePropValue = {
								Property: property,
								ExcludeValues: excludeValues
							};
						}

						return $http({
							method: 'POST',
							url: queryPath + 'loadmoreattribute',
							data: data
						}).then(function (res) {
							if (res.data && res.data.length) {
								service.data.attributes = service.data.attributes.concat(res.data);
							}
							else {
								if (_.isNil(property)) {
									service.data.attrContext.__end = true;
								}
								else {
									if (_.isNil(service.data.attrContext[property])) {
										service.data.attrContext[property] = {};
									}
									service.data.attrContext[property].__end = true;
								}
							}
							return res.data;
						});
					};

					redesign(service, defaultSearchOption);

					return service;
				}

				function redesign(service, defaultSearchOption) {
					const characteristicSectionId = 16;
					defaultSearchOption.ItemsPerPage = 50;

					service.searchOptions.ItemsPerPage = 50;
					service.onItemUpdated = new PlatformMessenger();

					service.getFilterDefs = function () {
						return $http.get(globals.webApiBaseUrl + 'basics/material/filter/definitions');
					};

					service.getCharacteristics = function(materialId) {
						return $http.get(globals.webApiBaseUrl + 'basics/characteristic/data/list?sectionId=' + characteristicSectionId + '&mainItemId=' + materialId);
					}

					service.filterRequest = function(filterOption) {
						const option = angular.copy(filterOption);
						if(!service.searchOptions.EnableOnlyMainContract && option?.context?.BasisContractId){
							option.context.BasisContractId = null;
						}

						return service.executeFilter(service.getFilterParam(service.searchOptions, option)).then(function (response) {
							filterSuccessHandler(response);
						});
					};

					service.executeFilter = function (payload) {
						return $http.post(globals.webApiBaseUrl + 'basics/material/filter/execute', {
							...payload,
							ShowTraceLog: true
						}).then(res => {
							console.log(res.data?.TraceLog);
							service.setCache(res.data.Materials);
							return res;
						});
					}

					service.resetPage = function() {
						service.searchOptions.CurrentPage = 1;
					};

					service.getFilterParam = function (searchOptions, filterOption) {
						return {
							pageNumber: searchOptions.CurrentPage,
							pageSize: searchOptions.ItemsPerPage,
							orderBy: searchOptions.SortOption,
							...filterOption
						};
					}

					service.addData = function(item, insertIndex) {
						if (insertIndex && insertIndex > -1) {
							service.data.items.splice(insertIndex, 0, item);
						}
						else {
							service.data.items.push(item);
						}

						service.onListLoaded.fire();
					}

					function filterSuccessHandler(response) {
						service.data.hasResult = true;
						service.data.items = response.data.Materials;
						service.data.matchedCount = response.data.MaterialsFound;
						service.data.hasMoreMaterials = response.data.HasMoreMaterials;

						service.onListLoaded.fire();
					}

					service.gridRefresh = function () {
						platformGridAPI.grids.invalidate(basicsMaterialSearchGridId);
					};

					service.setEnableOnlyMainContract = function(enable) {
						service.searchOptions.EnableOnlyMainContract = !!enable;
					}

				}

				return {
					create: create
				};
			}]);
})(angular);