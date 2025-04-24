(function(){
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainUpdateCompositeAssemblyService', ['$injector', '$q', '$http', 'platformModalService', '$translate',
		'estimateMainService',
		function($injector, $q, $http, platformModalService, $translate, estimateMainService){

			let service = {};

			let sContent = $translate.instant('estimate.main.updateCompositeAssemblyFromMasterData');

			let sTitle = $translate.instant('estimate.main.estimate');

			service.showDialog = function showDialog()
			{
				platformModalService.showYesNoDialog(sContent, sTitle).then(function (selectedResponse)
				{
					if (selectedResponse.yes)
					{
						let postData = {
							'EstHeaderId': parseInt(estimateMainService.getSelectedEstHeaderId()),
							'ProjectId': estimateMainService.getSelectedProjectId()
						};

						$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/updatecompositeassembly', postData).then(function(updateResponse)
						{
							if(updateResponse.data)
							{
								estimateMainService.load();
							}
						});
					}
				});
			};

			return service;
		}]);

})();
