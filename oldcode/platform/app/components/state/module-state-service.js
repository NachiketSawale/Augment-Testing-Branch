/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformModuleStateService
	 * @function
	 * @requires $cacheFactory, _
	 * @description
	 * platformModuleStateService provides state object for modules
	 */
	angular.module('platform').service('platformModuleStateService', PlatformModuleStateService);

	PlatformModuleStateService.$inject = ['$cacheFactory', '_'];

	function PlatformModuleStateService($cacheFactory, _) {
		var cache = $cacheFactory('platformModuleStateCache');
		var config = {
			defaultStateValue: {
				mainEntities: [],
				selectedMainEntity: {},

				modifications: {
					EntitiesCount: 0
				},

				validation: {
					asyncCalls: [],
					issues: []
				}
			}
		};

		var self = this;

		this.createDefault = function createDefault(rootService) {
			var modConfig = _.cloneDeep(config.defaultStateValue);
			modConfig.rootService = rootService;

			return modConfig;
		};

		/**
		 * @ngdoc function
		 * @name state
		 * @function
		 * @methodOf platform.platformModuleStateService
		 * @description retrieves state for given module or creates a new one by using defaultStateValue
		 * @param appModule {object} application module (in angular sense)
		 * @param rootService {object} root service of module.
		 * @returns state
		 */
		this.state = function state(appModule, rootService) {
			var moduleName = angular.isString(appModule) ? appModule : appModule.name;

			var cachedState = appModule && (cache.get(moduleName) || cache.put(moduleName, self.createDefault(rootService)));

			if (rootService && cachedState.rootService !== rootService) {
				cachedState.rootService = rootService;
			}

			return cachedState;
		};

		/**
		 * @ngdoc function
		 * @name clearState
		 * @function
		 * @methodOf platform.platformModuleStateService
		 * @description retrieves state for given module or creates a new one by using defaultStateValue
		 * @param appModule {object} application module (in angular sense)
		 * @param rootService {object} root service of module.
		 * @returns state
		 */
		this.clearState = function clearState(rootService) {
			var appModule = rootService.getModule();
			var moduleName = angular.isString(appModule) ? appModule : appModule.name;

			var cachedState = appModule && cache.put(moduleName, self.createDefault(rootService));

			if (rootService && cachedState.rootService !== rootService) {
				cachedState.rootService = rootService;
			}

			return cachedState;
		};
	}
})();