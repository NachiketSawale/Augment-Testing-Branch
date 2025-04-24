/**
 * Created by balkanci on 12.11.2015.
 */
(function () {
	'use strict';
	var project = angular.module('constructionsystem.master');
	project.factory('constructionSystemMasterHelpService', ['globals', 'constructionSystemMasterHeaderService', 'platformFileUtilServiceFactory',

		function (globals, constructionSystemMasterHeaderService, platformFileUtilServiceFactory) {

			var config = {
				deleteUrl: globals.webApiBaseUrl + 'constructionsystem/master/help/deleteblob',
				importUrl: globals.webApiBaseUrl + 'constructionsystem/master/help/importblob',
				getUrl: globals.webApiBaseUrl + 'constructionsystem/master/help/getblob',
				fileFkName: 'BasBlobsFk',
				dtoName: 'CosHeaderDto'
			};
			return platformFileUtilServiceFactory.getFileService(config, constructionSystemMasterHeaderService);

		}]);
})(angular);
