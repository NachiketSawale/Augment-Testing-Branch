/**
 * Created by zos on 3/14/2018.
 */
(function (angular) {
	/* global _ */ 
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqMainParamStructureLookupDataService
	 * @function
	 * @description
	 * this is the data service providing data for parameter assigned structure lookup
	 */
	angular.module(moduleName).service('boqMainParamStructureLookupDataService', ['$q', '$translate', '$injector', 'boqRuleComplexLookupService', 'estimateMainParamStructureConstant',
		function ($q, $translate, $injector, boqRuleComplexLookupService, estimateMainParamStructureConstant) {

			// Object presenting the service
			var service = {
				getList: getFilteredList,
				getListSync: getListSync,
				getListAsync: getListAsync,
				getItemById: getItemByVal,
				getItemByKey: getItemByVal,
				getItemByIdAsync: getItemByIdAsync
			};

			// lookup data
			var items4prjBoq = [
					{
						Id: estimateMainParamStructureConstant.Project, Code: 'Project', DescriptionInfo: {
							Description: 'Project',
							Translated: $translate.instant('project.main.sourceProject')// 'Project'
						}
					},
					{
						Id: estimateMainParamStructureConstant.BoQs, Code: 'BoQs', DescriptionInfo: {
							Description: 'BoQs',
							Translated: $translate.instant('estimate.main.boqContainer')// 'BoQs'
						}
					}
				],
				items4wicBoq = [
					{
						Id: estimateMainParamStructureConstant.BoQs, Code: 'BoQs', DescriptionInfo: {
							Description: 'BoQs',
							Translated: $translate.instant('estimate.main.boqContainer')// 'BoQs'
						}
					}
				],

				itemsOnly4PrjBoq = [
					{
						Id: estimateMainParamStructureConstant.Project, Code: 'Project', DescriptionInfo: {
							Description: 'Project',
							Translated: $translate.instant('project.main.sourceProject')// 'Project'
						}
					}
				];

			function getItems() {
				var isDetailsFormulaParameters = $injector.get('boqMainCommonFeaturesService').getIsDetailsFormulaParameters();
				if (isDetailsFormulaParameters) {
					return itemsOnly4PrjBoq;
				} else {
					if (boqRuleComplexLookupService.isNavFromBoqProject()) {
						return items4prjBoq;
					} else {
						return items4wicBoq;
					}
				}
			}

			// get data list of the parameter structure items sync
			function getListSync() {
				return (angular.copy(getItems()));
			}

			// get list of the parameter structure items async
			function getListAsync() {
				return $q.when(getItems());
			}

			// get parameter structure items filtered as per given structure id
			function getFilteredList() {
				return $q.when(getItems());
			}

			// get parameter structure item by Id
			function getItemByVal(value) {
				var item = _.find(getItems(), {Id: value});
				return item;
			}

			// get parameter structure item by Id Async
			function getItemByIdAsync(value) {
				var deferred = $q.defer();
				var result = getItemByVal(value);
				deferred.resolve(result);
				return deferred.promise;
			}

			return service;
		}]);
})(angular);
