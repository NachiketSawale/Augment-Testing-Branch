/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */
/* global console:false */
/* global Cache:false */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformContextService
	 * @function
	 * @requires $http
	 *
	 * @description platformContextService provides access to system and application contexts
	 */

	platformSchemaService.$inject = ['$http', '$q', 'platformContextService'];

	angular.module('platform').factory('platformSchemaService', platformSchemaService);

	function platformSchemaService($http, $q, platformContextService) {
		/*
		 locale function returning the full qualified token for cache
		 */
		function getToken(schemaOption) {
			var theToken;
			if (!schemaOption.assemblyName) {
				theToken = 'RIB.Visual.' + schemaOption.moduleSubModule + '.ServiceFacade.WebApi.' + schemaOption.typeName;
			} else {
				theToken = schemaOption.typeName;
			}
			return theToken;
		}

		var theCache = null;
		var cacheConfig = {
			expirationAbsolute: null,
			expirationSliding: null,
			priority: Cache.Priority.HIGH /* , callback: cacheCallBack */
		};
		var service;

		service = {
			/**
			 * @ngdoc function
			 * @name initialize
			 * @function
			 * @methodOf platform:platformSchemaService
			 * @description initializes schema service cache to size 1000
			 */
			initialize: function initialize() {
				if (!theCache) {
					theCache = new Cache(1000);
				}
			},

			/**
			 * @ngdoc function
			 * @name getSchemas
			 * @method setLanguageItem
			 * @param {Object}   schemaOption  {array} of schemaItems
			 *    schemaItems{
			 *       typeName:       {string},  name of the dto type coming form backend, normally .net class name form a webapi dto, classname will be expanded to
			 *                                  RIB.Visual.{module.submodule}.ServiceFacade.WebApi.{typeName},
			 *                                  if there is assemblyName , ont null, typeName must be a full qualified name of the .net class
			 *       moduleSubModule:{string,optional},  if not null, 'module.submodule', part of the .net class name, will be expanded to RIB.Visual.{module.submodule}.ServiceFacade.WebApi
			 *       assemblyName:   {string,optional},  if not null, name of a .net assembly where the above typeName (full qulified .net Classname) could be found
			 *   }
			 * @param {object} [isLoadedOption] reflects loaded, so if successful laoding of schema done, this variable is set to true
			 * @methodOf platform:platformSchemaService
			 * @description reads a list of schemas to a dto class from backend service, if not already
			 *              loaded in the cache.
			 * function returns the number of items read from backend.
			 */
			getSchemas: function (schemaOption, isLoadedOption) {

				if (_.isObject(isLoadedOption) && isLoadedOption.isLoaded) {
					return $q.when(0);
				}

				service.initialize();

				var schemaList = [];
				if (schemaOption && schemaOption.length > 0) {
					// schemaList = schemaOption.schemaList;
					angular.forEach(schemaOption, function (schemaItem) {
						var searchItem;
						var token;
						if (!schemaItem.assemblyName) {
							token = 'RIB.Visual.' + schemaItem.moduleSubModule + '.ServiceFacade.WebApi.' + schemaItem.typeName;
						} else {
							token = schemaItem.typeName;
						}
						var cachedItem = theCache.getItem(token);
						if (!cachedItem) {
							searchItem = {
								TypeName: schemaItem.typeName,
								ModuleSubModule: schemaItem.moduleSubModule,
								AssemblyName: schemaItem.assemblyName
							};
							schemaList.push(searchItem);
						}
					});
				}
				if (schemaList && schemaList.length > 0) {
					return $http.post(globals.webApiBaseUrl + 'platform/getschemas', schemaList)
						.then(function (response) {
							if (_.isObject(isLoadedOption)) {
								isLoadedOption.isLoaded = true;
							}

							if (response.data && response.data.schemas) {
								angular.forEach(response.data.schemas, function (item) {
									theCache.setItem(item.schema, item, cacheConfig);

									// Add Inserted, Updated if history properties available
									if (item.properties.InsertedAt) {
										item.properties.Inserted = item.properties.Updated = {domain: 'history'};
									}
								});
								return response.data.schemas.length;
							}
							return 0;
						});
				} else {
					// all in cache found, indicate its loaded
					if (_.isObject(isLoadedOption)) {
						isLoadedOption.isLoaded = true;
					}

					return $q.when(0);
				}
			},

			/**
			 * @ngdoc function
			 * @name getSchema
			 * returns a schema, it first searches in the local cache, if not found it forwards the request to the backend
			 *
			 * @param {Object}   schemaOption
			 * schemaOption{
			 *   typeName:       {string},  name of the dto type coming form backend, normally .net class name form
			 *                              a webapi dto, classname will be expanded to
			 *                              RIB.Visual.{module.submodule}.ServiceFacade.WebApi.{typeName},
			 *                              if there is assemblyName , ont null, typeName must be a full qualified name of the .net class
			 *   moduleSubModule:{string,optional},  if not null, 'module.submodule', part of the .net class name,
			 *                              will be expanded to RIB.Visual.{module.submodule}.ServiceFacade.WebApi
			 *   assemblyName:   {string,optional},  if not null, name of a .net assembly where the above typeName
			 *                              (full qulified .net Classname) could be found
			 * }
			 *
			 * @methodOf platform:platformSchemaService
			 * @description read a schema to a dto class from cache or backend service
			 *
			 * @returns a promise
			 */
			getSchema: function (schemaOption) {
				const token = getToken(schemaOption);
				const cachedItem = theCache.getItem(token);

				if (!cachedItem) {
					if (!platformContextService.isLoggedIn) {
						// prevent from additional 401 errors after logout
						return $q.reject({});
					}

					const param = {
						'typeName': schemaOption.typeName,
						'moduleSubModule': schemaOption.moduleSubModule,
						'assemblyName': schemaOption.assemblyName
					};

					return $http.get(globals.webApiBaseUrl + 'platform/getschema', {params: param})
						.then(function (response) {
							const schema = response.data;

							theCache.setItem(schema.schema, schema, cacheConfig);

							// Add Inserted, Updated if history properties available
							if (schema.properties.InsertedAt) {
								schema.properties.Inserted = schema.properties.Updated = {domain: 'history'};
							}

							return schema;
						});

				} else {
					return $q.when(cachedItem);
				}
			},
			/**
			 * @ngdoc function
			 * @name getSchemaFromCache
			 * returns a schema from cache, if not there it returns undefined or null
			 *
			 * @param {Object}   schemaOption
			 * schemaOption{
			 *   typeName:       {string},  name of the dto type coming form backend, normally .net class name form
			 *                              a webapi dto, classname will be expanded to
			 *                              RIB.Visual.{module.submodule}.ServiceFacade.WebApi.{typeName},
			 *                              if there is assemblyName , ont null, typeName must be a full qualified name of the .net class
			 *   moduleSubModule:{string,optional},  if not null, 'module.submodule', part of the .net class name,
			 *                              will be expanded to RIB.Visual.{module.submodule}.ServiceFacade.WebApi
			 *   assemblyName:   {string,optional},  if not null, name of a .net assembly where the above typeName
			 *                              (full qulified .net Classname) could be found
			 * }
			 *
			 * @methodOf platform:platformSchemaService
			 * @description read a schema to a dto class from cache or backend service
			 *
			 * @return  the schema as json object or null
			 */
			getSchemaFromCache: function (schemaOption) {

				var token = getToken(schemaOption);

				return theCache.getItem(token);
			},

			/**
			 * @ngdoc function
			 * @name getCache
			 * returns the cache
			 *
			 */
			getCache: function () {
				return theCache;
			},

			/**
			 * @ngdoc function
			 * @name cacheInfo
			 * @methodOf platform:platformSchemaService
			 * @description return information about the cache into the console
			 *
			 * @return  the schema as json object
			 */
			cacheInfo: function () {
				console.log('Schema Cache Info:  Size:', theCache.size(), theCache.stats);
			}
		};

		service.initialize();
		return service;
	}
})();
