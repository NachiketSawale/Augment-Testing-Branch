/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const basicsCommonModule = angular.module('basics.common');

	/**
	 * @ngdoc service
	 * @name basics.common.basicsCommonSimpleUploadService
	 * @function
	 *
	 * @description Provides an easy-to-use interface to upload files of arbitrary size to the server.
	 *              Check out the full documentation of the Simple Upload Framework on the wiki.
	 */
	basicsCommonModule.factory('basicsCommonSimpleUploadService',
		basicsCommonSimpleUploadService);

	basicsCommonSimpleUploadService.$inject = ['_', '$http', '$q'];

	function basicsCommonSimpleUploadService(_, $http, $q) {

		return {
			uploadFile(file, config) {
				const effectiveConfig = _.assign({
					chunkSize: 1024 * 1024 * 5, // 5MB
					basePath: null, // e.g. 'basics/common/myfeature/'
					customRequest: null,
					concurrentUploadCount: 5
				}, _.isObject(config) ? config : {});

				if (!_.isString(effectiveConfig.basePath)) {
					throw new Error('No base URL specified for upload.');
				}

				return $http.post(globals.webApiBaseUrl + effectiveConfig.basePath + 'beginupload', effectiveConfig.customRequest).then(function (response) {
					const uploadUuid = response.data;

					return file.arrayBuffer().then(function (buffer) {
						const chunkCount = buffer.byteLength / effectiveConfig.chunkSize + (buffer.byteLength % effectiveConfig.chunkSize > 0 ? 1 : 0);

						const chunks = _.map(_.range(0, chunkCount), function createSliceInfo(chunkIndex) {
							const startIndex = chunkIndex * effectiveConfig.chunkSize;
							return {
								chunkIndex: chunkIndex,
								startIndex: startIndex,
								endIndex: Math.min(startIndex + effectiveConfig.chunkSize, buffer.byteLength)
							};
						});

						function uploadChunks() {
							function uploadNextChunk() {
								const chunk = chunks.shift();
								if (chunk) {
									const slice = buffer.slice(chunk.startIndex, chunk.endIndex);
									const binarySlice = new Uint8Array(slice);
									return $http.post(globals.webApiBaseUrl + effectiveConfig.basePath + `upload/${uploadUuid}/${chunk.chunkIndex}`, binarySlice, {
										transformRequest: [],
										headers: {
											'Content-Type': 'application/octet-stream'
										}
									}).then(uploadNextChunk);
								}
								return $q.when();
							}

							return uploadNextChunk();
						}

						const uploadPromises = _.map(_.range(0, effectiveConfig.concurrentUploadCount), uploadChunks);

						return $q.all(uploadPromises).then(function () {
							return $http.post(globals.webApiBaseUrl + effectiveConfig.basePath + `endupload/${uploadUuid}`, {}).then(response => response.data);
						});
					});
				});
			}
		};
	}
})(angular);
