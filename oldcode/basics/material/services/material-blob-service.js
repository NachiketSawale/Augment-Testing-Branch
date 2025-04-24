/**
 * Created by wui on 11/30/2016.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterialMaterialBlobService', ['$http', '$q',
		function ($http, $q) {

			var blobCache = {};

			return {
				getImage: getImage,
				provideImage: provideImage,
				provideImageNoPlaceholder: provideImageNoPlaceholder,
				clearCache: clearCache
			};

			function getImage(dataItem) {
				var key = generateCacheKey(dataItem);

				if (blobCache[key]) {
					return $q.when({
						data: blobCache[key]
					});
				}

				if (_.isNil(dataItem.InternetCatalogFk)) {
					return $http.get(globals.webApiBaseUrl + 'cloud/common/blob/getblobbyid?id=' + dataItem.BasBlobsFk);
				}
				else {
					return $http.get(globals.webApiBaseUrl + 'basics/material/commoditysearch/1.0/internetBlob?blobId=' + dataItem.BasBlobsFk + '&catalogId=' + dataItem.InternetCatalogFk);
				}
			}

			function provideImage(dataItems) {
				dataItems.forEach(function (dataItem) {
					if (_.isNil(dataItem.BasBlobsFk)) {
						return;
					}
					var placeholderImg=dataItem.InternetCatalogFk?'ico-mat-placeholder':'ico-pic-placeholder';
					dataItem.Image ='cloud.style/content/images/control-icons.svg#'+placeholderImg;
					setImage(dataItem);
				});
			}

			function provideImageNoPlaceholder(dataItem) {
				if (_.isNil(dataItem.BasBlobsFk)) {
					return;
				}
				setImage(dataItem);
			}

			function setImage(dataItem) {
				getImage(dataItem).then(function (response) {
					const blob = response.data;

					if (blob) {
						dataItem.Image = 'data:image/png;base64,' + blob.Content;
						blobCache[generateCacheKey(dataItem)] = blob;
					}
				});
			}

			function generateCacheKey(dataItem) {
				if (_.isNil(dataItem.InternetCatalogFk)) {
					return dataItem.BasBlobsFk.toString();
				}
				else {
					return dataItem.BasBlobsFk + '&' + dataItem.InternetCatalogFk;
				}
			}

			function clearCache() {
				blobCache = {};
			}

		}
	]);

})(angular);