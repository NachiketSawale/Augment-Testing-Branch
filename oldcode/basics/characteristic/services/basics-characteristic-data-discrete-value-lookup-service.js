/**
 * Created by Peter on 16.12.2015.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.characteristic';

	/**
	 * @ngdoc service
	 * @name basicsCharacteristicDataDiscreteValueLookupService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('basicsCharacteristicDataDiscreteValueLookupService', ['$q', 'platformLookupDataServiceFactory',

		function ($q, platformLookupDataServiceFactory) {

			var config = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/characteristic/discretevalue/', endPointRead: 'list' } // will be filtered on client side!
				// filterParam: 'sectionId'
			};

			var service = platformLookupDataServiceFactory.createInstance(config).service;

			service.getlookupType = function() {
				return 'basicsCharacteristicDataDiscreteValueLookup';
			};

			var options = {};
			options.lookupType = service.getlookupType();

			service.getDefaultItem = function(characteristicFk) {
				var list = service.getListSync(options);
				return  _.find(list, function(item) {
					return item.CharacteristicFk === characteristicFk && item.IsDefault === true;
				});
				//return defaultItem;
			};

			service.getDefaultItemAsync = function (characteristicFk) {
				var deferred = $q.defer();
				var list = service.getListSync(options);
				if (list && list.length > 0) {
					var defaultItem = _.find(list, function (item) {
						return item.CharacteristicFk === characteristicFk && item.IsDefault === true;
					});
					deferred.resolve(defaultItem);
				} else {
					service.getList(options).then(function () {
						list = service.getListSync(options);
						var defaultItem = _.find(list, function (item) {
							return item.CharacteristicFk === characteristicFk && item.IsDefault === true;
						});
						deferred.resolve(defaultItem);
					});
				}

				return deferred.promise;
			};


			// todo: causes TypeError: Cannot read property 'displayMember' of null in platform-grid-domain-service.js:477???
			// we have to cast id as a number! Therefore we override the default method.
			//service.getItemByIdAsync = function (id, options) {
			//
			//	var deferred = $q.defer();
			//	service.getList(options).then(function(list)  {
			//		var numId = Number(id);
			//		var result = null;
			//		for (var i = 0; i < list.length; i++) {
			//			if (list[i].Id === numId) {
			//				result = list[i];
			//				break;
			//			}
			//		}
			//		deferred.resolve(result);
			//	});
			//
			//	return deferred.promise;
			//};

			return service;

		}]);
})(angular);
