/**
 * Created by zos on 12/25/2014.
 */

(function (angular) {
	'use strict';
	var moduleName = 'businesspartner.main';
	/**
	 * @ngdoc service
	 * @name businesspartner.main.businesspartnerMainActivityDataServiceNew
	 * @function
	 *
	 * @description Provide activity data service
	 */
	angular.module(moduleName).factory('businesspartnerMainActivityDataService',
		['businesspartnerMainActivityDataServiceFactory','businesspartnerMainHeaderDataService',
			function (businesspartnerMainActivityDataServiceFactory,businesspartnerMainHeaderDataService) {

				const service = businesspartnerMainActivityDataServiceFactory.createService({
					moduleName: moduleName,
					parentService: 'businesspartnerMainHeaderDataService',
					serviceName:'businesspartnerMainActivityDataService',
					isReadonlyFn: function(){
						return businesspartnerMainHeaderDataService.getItemStatus().IsReadonly;
					},
					pKey1Fn: function(header){
						return header.Id;
					}
				});

				return service;
			}]
	);
})(angular);