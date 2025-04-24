/**
 * Created by clv on 10/9/2017.
 */
(function(angular){

	'use strict';
	var moduleName = 'procurement.package';
	angular.module(moduleName).factory('packageBoqCreateCriteriaTypeService',['_', '$q', 'basicsLookupdataLookupDescriptorService', '$translate',
		function (_, $q, lookupDescriptorService, $translate) {

			var criteriaType = [
				{ Id: 1, Value: 'Project BoQ', Description: $translate.instant('procurement.package.criteriaType.projectBoQ')},
				{ Id: 2, Value: 'WIC BoQ', Description: $translate.instant('procurement.package.criteriaType.WICBoQ')},
				{ Id: 3, Value: 'Line Item',Description: $translate.instant('procurement.package.criteriaType.LineItem') },
				{ Id: 4, Value: 'Resource', Description: $translate.instant('procurement.package.criteriaType.resource') }
			];

			lookupDescriptorService.attachData({BoqCreateCriteriaType: criteriaType});

			return {
				getList : function() {
					var deferred = $q.defer();
					deferred.resolve(criteriaType);
					return deferred.promise;
				},
				getItemByKey : function(key){
					var deferred = $q.defer();
					var item = _.find(criteriaType,{Id:key});
					deferred.resolve(item);
					return deferred.promise;
				},
				getValues: function () {
					return _.map(criteriaType, function (item) {
						return item.Value;
					});
				}
			};
		}]);
})(angular);
