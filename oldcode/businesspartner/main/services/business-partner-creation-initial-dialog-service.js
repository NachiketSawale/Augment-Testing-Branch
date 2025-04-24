/**
 * Created by hzh on 2024/08/21.
 */
(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.main';

	/**
	 * @ngdoc service
	 * @name businessPartnerCreationInitialDialogService
	 * @function
	 *
	 * @description
	 * businessPartnerCreationInitialDialogService is the data service for all creation initial dialog related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).service('businessPartnerCreationInitialDialogService',
		['_', '$http', '$injector',
			function (_, $http, $injector) {
				this.adjustCreateConfiguration = function (createItem) {
					var businesspartnerMainHeaderDataService = $injector.get('businesspartnerMainHeaderDataService');

					return $http.post(globals.webApiBaseUrl + 'businesspartner/main/businesspartner/createbp')
						.then(function (response) {
							businesspartnerMainHeaderDataService.setAllUniqueColumns(response.data.allUniqueColumns);
							return createItem = _.extend(createItem, {
								dataItem: response.data.main
							});
						});
				};
			}
		]
	);
})(angular);
