/**
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var salesCommonModule = 'sales.common';

	/**
	 * @ngdoc service
	 * @name salesCommonModuleHeaderInfoService
	 * @description updated the module information header using the project long number (see DEV-11105)
	 * @remarks took reference from procurementCommonOverrideHeaderInfoService
	 */
	angular.module(salesCommonModule).service('salesCommonModuleHeaderInfoService',
		['$log', '_', '$injector', 'platformHeaderDataInformationService',
			function ($log, _, $injector, platformHeaderDataInformationService) {

				var registeredServices = {};

				function getProject(entity) {
					if (_.isNil(_.get(entity, 'ProjectFk'))) {
						return null;
					}
					return $injector.get('basicsLookupdataLookupDescriptorService').getLookupItem('Project', entity.ProjectFk);
				}

				function isValidMainService(mainService) {
					return _.isFunction(_.get(mainService, 'registerSelectionChanged')) && _.isFunction(_.get(mainService, 'getServiceName'));
				}

				function register(mainService, moduleDisplayName) {
					if (isValidMainService(mainService)) {

						let serviceName = mainService.getServiceName();
						if (_.has(registeredServices, serviceName)) {
							return $log.warn('Service ' + serviceName + ' has already been registered.');
						}
						// register service with handler
						registeredServices[serviceName] = {
							handler: function (e, mainEntity) {
								// different cases
								// - only pinned project (no main item selected) => no header info // TODO: check: show pinned project info at least?
								// - no selection and no pinned project => no header info
								// - no long project number available => there is no fallback to project no currently  // TODO: check: show at least projectno?
								if (_.isObject(mainEntity)) {
									let entityHeaderObject = {};
									entityHeaderObject.project = platformHeaderDataInformationService.prepareMainEntityHeaderInfo(getProject(mainEntity), {
										codeField: 'ProjectLongNo',
										descField: 'ProjectName'
									}, 'object') || '';
									entityHeaderObject.module = platformHeaderDataInformationService.prepareMainEntityHeaderInfo(mainEntity, {
										codeField: 'Code',
										descField: 'Description'
									},'object') || '';
									entityHeaderObject.module.moduleName = 'sales.common';

									$injector.get('cloudDesktopInfoService').updateModuleInfo(moduleDisplayName, entityHeaderObject, '');
								} else {
									// no selection
									$injector.get('cloudDesktopInfoService').updateModuleInfo(moduleDisplayName);
								}
							}
						};

						mainService.registerSelectionChanged(registeredServices[serviceName].handler);

					} else {
						$log.warn('Invalid main service passed!');
					}
				}

				function unregister(mainservice) {
					if (isValidMainService(mainservice)) {
						var serviceName = mainservice.getServiceName();
						if (_.has(registeredServices, serviceName)) {
							mainservice.unregisterSelectionChanged(registeredServices[serviceName].handler);
							delete registeredServices[serviceName];
						} else {
							return $log.warn('Service ' + serviceName + ' has not been registered.');
						}
					}
				}

				return {
					register: register,
					unregister: unregister
				};
			}

		]);
})();
