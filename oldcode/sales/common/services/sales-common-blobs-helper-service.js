/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	var salesCommonModule = 'sales.common';

	/**
	 * @ngdoc service
	 * @name salesCommonBlobsHelperService
	 * @description provides helper functions for blobs functionality
	 */
	angular.module(salesCommonModule).service('salesCommonBlobsHelperService', ['_',
		function (_) {
			var service = {};
			var blobTemplate = {'Content': '', 'InsertedAt': null, 'InsertedBy': null, 'UpdatedAt': null, 'UpdatedBy': null, 'Version': 0};

			service.handleBlobsUpdateDone = function (toSaveName, updateData, response, data) {
				var header = _.find(data.getList(), {Id: updateData.MainItemId}),
					sizeUpdate = _.size(updateData[toSaveName]),
					sizeResponse = _.size(response[toSaveName]);
				if (sizeUpdate > 0 && sizeResponse === sizeUpdate) {
					for (var i = 0; i < sizeUpdate; ++i) {
						// assign to bid header if new (version is 0)
						if (updateData[toSaveName][i].Version === 0) {
							header['Blobs' + updateData[toSaveName][i].TextType + 'Fk'] = response[toSaveName][i].Id;
						}
					}
				}
			};

			service.completeMissingBlobs = function (readData, item, blobProperties) {
				// complete missing blobs
				var IdNext = -2; // TODO: see grid-controller-service.js => "$scope.selectedEntityID !== -1", so we cannot use -1 as id
				if (item) {
					var id2prop = service.getId2prop(blobProperties, item);
					_.each(_.difference(blobProperties, _.values(id2prop)), function (prop) {
						readData.push(angular.extend({Id: --IdNext, TextType: prop}, blobTemplate));
					});
				}
			};

			service.getId2prop = function (blobProperties, item) {
				var id2prop = {};

				_.each(blobProperties, function (p) {
					if (item[p]) {
						id2prop[item[p]] = p;
					}
				});
				return id2prop;
			};

			return service;
		}
	]);
})();
