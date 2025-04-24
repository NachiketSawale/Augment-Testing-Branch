/**
 * Created by leo on 13.09.2017.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name logisticJobLookupDataService
	 * @function
	 *
	 * @description
	 * logisticJobLookupDataService is the data service for requisition look ups
	 */
	angular.module('logistic.job').factory('logisticJobDialogLookupDataService', ['lookupFilterDialogDataService', 'platformDataServiceProcessDatesBySchemeExtension',

		function (filterLookupDataService,
		          platformDataServiceProcessDatesBySchemeExtension) {

			var activityLookupDataServiceConfig = {
				httpRoute: 'logistic/job/',
				endPointRead: 'lookuplistbyfilter',
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'JobDto',
					moduleSubModule: 'Logistic.Job'
				})],
				filterParam: {projectFk: null, controllingUnitFk: null}
			};

			return filterLookupDataService.createInstance(activityLookupDataServiceConfig);
		}]);
})(angular);
