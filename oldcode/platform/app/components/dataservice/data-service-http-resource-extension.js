/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformDataServiceHttpResourceExtension
	 * @function
	 * @requires $http, $q
	 * @description
	 * platformDataServiceHttpResourceExtension adds selection behaviour to data services created from the data service factory
	 */
	angular.module('platform').service('platformDataServiceHttpResourceExtension', PlatformDataServiceHttpResourceExtension);

	PlatformDataServiceHttpResourceExtension.$inject = ['$http', '$q', 'platformObjectHelper', 'platformRuntimeDataService'];

	function PlatformDataServiceHttpResourceExtension($http, $q, objectHelper, platformRuntimeDataService) {
		/**
		 * @ngdoc function
		 * @name state
		 * @function
		 * @methodOf platform.platformDataServiceHttpResourceExtension
		 * @description adds selection behaviour to data services
		 * @param container {object} contains entire service and its data to be created
		 * @returns state
		 */
		var self = this;

		this.addHttpResources = function addHttpResources(container, options) {
			self.addHTTPCreateAccess(container, options);
			self.addHTTPReadAccess(container, options);
			self.addHTTPUpdateAccess(container, options);
			self.addHTTPDeleteAccess(container, options);
			self.addHTTPCRUDAccess(container, options);
		};

		/**
		 Resources available by using a local function besides using uri resources
		 If the following is configured, the local function will be used
		 as to fetch data, (CURD)
		 instead of making http request.
		 httpRead: {
                        useLocalResource: true,
                        resourceFunction: readFunction || function () {return [];},
                        resourceFunctionParameters: functionArgs
                 }
		 */
		this.addHTTPCreateAccess = function addHTTPCreateAccess(container, options) {
			if (options.httpCreate) {
				var opt = options.httpCreate;
				container.data.httpCreateRoute = opt.route;
				container.data.endCreate = opt.endCreate;

				if (opt.useLocalResource) {
					container.data.doCallHTTPCreate = function doCallLocalCreate(creationData, data, onCreateSucceeded) {
						return self.createEntityUsingLocalResources(opt, creationData, data, onCreateSucceeded);
					};
				} else {
					container.data.doCallHTTPCreate = function doCallHTTPCreate(creationData, data, onCreateSucceeded) {
						return self.createEntityUsingHttpPost(creationData, data, onCreateSucceeded);
					};
				}
			}
		};

		this.addHTTPReadAccess = function addHTTPReadAccess(container, options) {
			if (options.httpRead) {
				var opt = options.httpRead;
				container.data.httpReadRoute = opt.route;
				container.data.endRead = opt.endRead;
				container.data.usePostForRead = opt.usePostForRead;
				// TODO: remove initReadData, if no usages in modules anymore
				// migration to extendSearchFilter -> see data-service-factory.js
				if (opt.initReadData) {
					container.data.initReadData = opt.initReadData;
				}
				if (opt.extendSearchFilter) {
					container.data.extendSearchFilter = opt.extendSearchFilter;
				}

				container.service.usePostForRead = function usePostForRead() {
					return !!container.data.usePostForRead;
				};

				if (opt.useLocalResource) {
					container.data.doCallHTTPRead = function doCallLocalRead(readData, data, onReadSucceeded) {
						return self.readDataUsingLocalResources(opt, readData, data, onReadSucceeded);
					};
				} else {
					if (container.data.usePostForRead) {
						container.data.doCallHTTPRead = function doCallHTTPReadUsingPost(readData, data, onReadSucceeded) {
							return self.readDataUsingHttpPost(readData, data, onReadSucceeded);
						};
					} else {
						container.data.doCallHTTPRead = function doCallHTTPReadUsingGet(readData, data, onReadSucceeded) {
							// Some services switch from get to post and back in runtime, so we made an additional switch inside this method.
							return data.usePostForRead ? self.readDataUsingHttpPost(readData, data, onReadSucceeded) : self.readDataUsingHttpGet(readData, data, onReadSucceeded);
						};
					}
				}
			}
		};

		this.addHTTPUpdateAccess = function addHTTPUpdateAccess(container, options) {
			if (options.httpUpdate) {
				var opt = options.httpUpdate;
				container.data.httpUpdateRoute = opt.route;
				container.data.endUpdate = opt.endUpdate;

				if (opt.useLocalResource) {
					container.data.doCallHTTPUpdate = function doCallLocalUpdate(updateData, data) {
						return self.updateDataUsingLocalResources(opt, updateData, data);
					};
				} else {
					container.data.doCallHTTPUpdate = function doCallHTTPUpdate(updateData, data) {
						return self.updateDataUsingHttpPost(updateData, data);
					};
				}
			}
		};

		this.addHTTPDeleteAccess = function addHTTPDeleteAccess(container, options) {
			if (options.httpDelete) {
				var opt = options.httpDelete;
				container.data.httpDeleteRoute = opt.route;
				container.data.endDelete = opt.endDelete;

				if (opt.useLocalResource) {
					container.data.doCallHTTPDelete = function doCallLocalDelete(deleteParams, data, onDeleteDone) {
						return self.deleteEntityUsingLocalResources(opt, deleteParams, data, onDeleteDone);
					};
				} else {
					container.data.doCallHTTPDelete = function doCallHTTPDelete(deleteParams, data, onDeleteDone) {
						return self.deleteEntityUsingHttpPost(deleteParams, data, onDeleteDone);
					};
				}
			}
		};

		this.addHTTPCRUDAccess = function addHTTPCRUDAccess(container, options) {
			if (options.httpCRUD) {
				var crudOptions = options.httpCRUD;

				var cOpt = {};
				cOpt.route = crudOptions.route;
				cOpt.endCreate = !_.isNil(crudOptions.endCreate) ? crudOptions.endCreate : 'create';
				self.addHTTPCreateAccess(container, {httpCreate: cOpt});

				var rOpt = {};
				rOpt.route = crudOptions.route;
				rOpt.endRead = crudOptions.endRead;
				if (crudOptions.usePostForRead) {
					rOpt.usePostForRead = true;
				}
				// TODO: remove initReadData, if no usages in modules anymore
				// migration to extendSearchFilter -> see data-service-factory.js
				if (crudOptions.initReadData) {
					rOpt.initReadData = crudOptions.initReadData;
				}
				if (crudOptions.extendSearchFilter) {
					rOpt.extendSearchFilter = crudOptions.extendSearchFilter;
				}
				self.addHTTPReadAccess(container, {httpRead: rOpt});

				var uOpt = {};
				uOpt.route = crudOptions.route;
				uOpt.endUpdate = 'update';
				uOpt.itemName = crudOptions.itemName;
				self.addHTTPUpdateAccess(container, {httpUpdate: uOpt});

				var dOpt = {};
				dOpt.route = crudOptions.route;
				if (!crudOptions.endDelete) {
					dOpt.endDelete = 'delete';
				} else {
					dOpt.endDelete = crudOptions.endDelete;
				}

				self.addHTTPDeleteAccess(container, {httpDelete: dOpt});
			}
		};

		function isPromise(obj) {
			return objectHelper.isPromise(obj);
		}

		function prepareParams(optionParams, serviceData, callData, callBackFn) {
			var args = optionParams || [];
			args.push(serviceData, callData, callBackFn);

			return args;
		}

		// Create
		this.createEntityUsingLocalResources = function createEntityUsingLocalResources(options, creationData, data, onCreateSucceeded) {
			var dataRs = options.resourceFunction.apply(null, prepareParams(options.resourceFunctionParameters, data, creationData, onCreateSucceeded));
			if (isPromise(dataRs)) {
				return dataRs;
			}
			if (onCreateSucceeded) {
				dataRs = onCreateSucceeded(dataRs, data, creationData);
			}

			return $q.when(dataRs);
		};

		this.createEntityUsingHttpPost = function createEntityUsingHttpPost(creationData, data, onCreateSucceeded) {
			return $http.post(data.httpCreateRoute + data.endCreate, creationData)
				.then(function (response) {
					if (onCreateSucceeded) {
						return onCreateSucceeded(response.data, data, creationData);
					}

					return response.data;
				});
		};

		this.createConfiguredEntityUsingHttpPost = function createConfiguredEntityUsingHttpPost(creationData, data, onCreateSucceeded) {
			return $http.post(data.httpCreateRoute + 'configuredcreate', creationData)
				.then(function (response) {
					if (onCreateSucceeded) {
						return onCreateSucceeded(response.data, data, creationData);
					}

					return response.data;
				});
		};

		// Read
		this.readDataUsingLocalResources = function readDataUsingLocalResources(options, readData, data, onReadSucceeded) {
			var dataRs = options.resourceFunction.apply(null, prepareParams(options.resourceFunctionParameters, data, readData, onReadSucceeded));
			if (isPromise(dataRs)) {
				return dataRs;
			}
			if (onReadSucceeded) {
				dataRs = onReadSucceeded(dataRs, data);
			}
			return $q.when(dataRs);
		};

		this.readDataUsingHttpPost = function readDataUsingHttpPost(readData, data, onReadSucceeded) {
			self.killRunningReadRequest(data);

			return $http.post(data.httpReadRoute + data.endRead, readData, {timeout: self.provideReadRequestToken(data)})
				.then(function (response) {
					self.endRunningReadRequest(data);
					if (onReadSucceeded) {
						return onReadSucceeded(response.data, data);
					}

					return response.data;
				})
				.catch(_.noop); // prevent unhandled rejection error in console in angular > 1.6
		};

		this.readDataUsingHttpGet = function readDataUsingHttpGet(readData, data, onReadSucceeded) {
			self.killRunningReadRequest(data);

			return $http.get(data.httpReadRoute + data.endRead + readData.filter, {timeout: self.provideReadRequestToken(data)})
				.then(function (response) {
					self.endRunningReadRequest(data);
					if (onReadSucceeded) {
						return onReadSucceeded(response.data, data);
					}
					return response.data;
				})
				.catch(_.noop()); // prevent unhandled rejection error in console in angular > 1.6
		};

		// Update
		this.updateDataUsingLocalResources = function updateDataUsingLocalResources(options, updateData, data) {
			if (updateData.EntitiesCount > 0) {
				var dataRs = options.resourceFunction.apply(null, prepareParams(options.resourceFunctionParameters, data, updateData));

				return $q.when(dataRs);
			} else {
				return $q.when(updateData);
			}
		};

		this.updateDataUsingHttpPost = function updateDataUsingHttpPost(updateData, data) {
			if (updateData.EntitiesCount > 0) {
				return $http.post(data.httpUpdateRoute + data.endUpdate, updateData);
			} else {
				return $q.when(updateData);
			}
		};

		// Delete
		this.deleteEntityUsingLocalResources = function deleteEntityUsingLocalResources(options, deleteParams, data, onDeleteDone) {
			options.resourceFunction.apply(null, prepareParams(options.resourceFunctionParameters, data, deleteParams, onDeleteDone));
			onDeleteDone(deleteParams, data, null);
			return $q.when(true);
		};

		this.deleteEntityUsingHttpPost = function deleteEntityUsingHttpPost(deleteParams, data, onDeleteDone) {
			var td = deleteParams.entity;
			if (deleteParams.entities && deleteParams.entities.length > 0) {
				td = deleteParams.entities;
			}
			return $http.post(data.httpDeleteRoute + data.endDelete, td).then(function (response) {
				onDeleteDone(deleteParams, data, response.data);
				return true;
			}, function () {
				platformRuntimeDataService.removeMarkAsBeingDeletedFromList(td);
			});
		};

		this.endRunningReadRequest = function endRunningReadRequest(data) {
			if (data && data.runningReadCall) {
				data.runningReadCall = null;
			}
		};

		this.killRunningReadRequest = function killRunningReadRequest(data) {
			if (data && data.runningReadCall) {
				data.runningReadCall.resolve('User Cancelled');
			}
		};

		this.provideReadRequestToken = function provideReadRequestToken(data) {
			data.runningReadCall = $q.defer();

			return data.runningReadCall.promise;
		};
	}
})();
