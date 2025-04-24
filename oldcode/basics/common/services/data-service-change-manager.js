/**
 * Created by waz on 3/20/2018.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc factory
	 * @name basicsCommonDataServiceChangeManager
	 * @description
	 * A manager for multi-data service interaction
	 */
	const moduleName = 'basics.common';
	const module = angular.module(moduleName);
	module.factory('basicsCommonDataServiceChangeManager', BasicsCommonDataServiceChangeManager);

	BasicsCommonDataServiceChangeManager.$inject = ['$injector', '_'];

	function BasicsCommonDataServiceChangeManager($injector, _) {

		function registerItemModified(subject, observer, callback) {
			registerEvent(subject, observer, 'registerItemModified', callback);
		}

		function registerEntityCreated(subject, observer, callback) {
			registerEvent(subject, observer, 'registerEntityCreated', callback);
		}

		function registerEntityDeleted(subject, observer, callback) {
			registerEvent(subject, observer, 'registerEntityDeleted', callback);
		}

		function registerEvent(subject, observer, eventName, callback) {
			subject = getService(subject);
			if (_.isNil(subject[eventName])) {
				return;
			}

			subject[eventName].call(subject, function (e, result) {
				observer = getService(observer);
				callback.call(observer, result, subject);
			});
		}

		function getService(service) {
			return _.isObject(service) ? service : $injector.get(service);
		}

		return {
			registerEvent: registerEvent,
			registerItemModified: registerItemModified,
			registerEntityCreated: registerEntityCreated,
			registerEntityDeleted: registerEntityDeleted
		};
	}
})(angular);