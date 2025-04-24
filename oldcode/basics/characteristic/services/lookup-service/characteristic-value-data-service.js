/**
 * Created by wui on 6/23/2015.
 */

(function (angular) {

	'use strict';

	angular.module('basics.characteristic').factory('basicsCharacteristicCharacteristicValueDataService', ['$q', '$injector', 'basicsCharacteristicDiscreteValueService','_',
		function ($q, $injector, basicsCharacteristicDiscreteValueService, _) {

			return {
				getList: function () {
					var deferred = $q.defer();
					var result = basicsCharacteristicDiscreteValueService.getList();
					// characteristic in estimate, clear up the cache
					if($injector.get('estimateMainService').getSelected() !==  null){
						result = [];
					}
					if (_.isEmpty(result)) {
						basicsCharacteristicDiscreteValueService.load().then(function () {
							deferred.resolve(basicsCharacteristicDiscreteValueService.getList());
						});
					}
					else {
						deferred.resolve(result);
					}
					return deferred.promise;
				},
				getItemByKey: function (value) {
					var deferred = $q.defer();
					var list = basicsCharacteristicDiscreteValueService.getList();

					if (_.isEmpty(list)) {
						basicsCharacteristicDiscreteValueService.load().then(function () {
							list = basicsCharacteristicDiscreteValueService.getList();
							for (var i = 0; i < list.length; i++) {
								if (list[i].Id === value) {
									deferred.resolve(list[i]);
									break;
								}
							}
						});
					}
					else {
						for (var i = 0; i < list.length; i++) {
							if (list[i].Id === value) {
								deferred.resolve(list[i]);
								break;
							}
						}
					}

					return deferred.promise;
				}
			};
		}
	]);

})(angular);