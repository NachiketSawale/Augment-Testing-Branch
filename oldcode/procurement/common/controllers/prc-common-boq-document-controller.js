(function()
{
	'use strict';

	/**
	 * @ngdoc controller
	 * @name
	 * @function
	 * @description
	 **/
	angular.module('procurement.common').controller('prcCommonBoqDocumentController', ['$scope', 'prcBoqMainService', 'procurementContextService', 'boqMainDocumentService',
		function ($scope, prcBoqMainService, procurementContextService, boqMainDocumentService)
		{
			boqMainDocumentService.initController($scope, prcBoqMainService.getService(procurementContextService.getMainService()));
		}
	]);
})();
