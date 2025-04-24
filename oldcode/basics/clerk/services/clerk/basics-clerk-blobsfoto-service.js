/**
 * Created by balkanci on 12.11.2015.
 */
(function () {
	'use strict';
	angular.module('basics.clerk').factory('basicsClerkPhotoService', ['globals', 'basicsClerkMainService', 'platformFileUtilServiceFactory',

		function (globals, basicsClerkMainService, platformFileUtilServiceFactory) {

			var config = {
				deleteUrl: globals.webApiBaseUrl + 'basics/clerk/blobsfoto/deleteblobsfoto',
				importUrl: globals.webApiBaseUrl + 'basics/clerk/blobsfoto/importblobsfoto',
				getUrl: globals.webApiBaseUrl + 'basics/clerk/blobsfoto/exportblobsfoto',
				fileFkName: 'BlobsPhotoFk',
				dtoName: 'ClerkDto'
			};
			return platformFileUtilServiceFactory.getFileService(config, basicsClerkMainService);
		}]);
})(angular);