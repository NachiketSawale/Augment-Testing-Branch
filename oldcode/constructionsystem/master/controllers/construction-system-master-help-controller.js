(function () {

	'use strict';
	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).controller('constructionSystemMasterHelpController', ['$scope', 'constructionSystemMasterHelpService', 'constructionSystemMasterHeaderService', 'platformFileUtilControllerFactory',
		function ($scope, constructionSystemMasterHelpService, constructionSystemMasterHeaderService, platformFileUtilControllerFactory) {
			platformFileUtilControllerFactory.initFileController($scope, constructionSystemMasterHeaderService, constructionSystemMasterHelpService);
		}
	]);
})();