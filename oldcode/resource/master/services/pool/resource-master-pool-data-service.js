/**
 * Created by Zweig Zhang on 23.03.2017
 */
(function (angular) {
	'use strict';
	var moduleName = 'resource.master';
	var masterModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name resourceMasterPoolDataService
	 * @function
	 *
	 * @description
	 * resourceMasterPoolDataService is the data service for pool.
	 */

	masterModule.factory('resourceMasterPoolDataService', resourceMasterPoolDataService);

	resourceMasterPoolDataService.$inject = ['resourceMasterMainService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'resourceMasterPoolResourceProcessor', 'resourceMasterContextService', 'basicsCommonMandatoryProcessor'];

	function resourceMasterPoolDataService(resourceMasterMainService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
	                                       resourceMasterPoolResourceProcessor, moduleContext, basicsCommonMandatoryProcessor) {

		var poolServiceInfo = {
			flatLeafItem: {
				module: masterModule,
				serviceName: 'resourceMasterPoolDataService',
				entityNameTranslationID: 'resource.master.entityPool',
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'PoolDto',
					moduleSubModule: 'Resource.Master'
				}), resourceMasterPoolResourceProcessor],
				httpCreate: {route: globals.webApiBaseUrl + 'resource/master/pool/'},
				httpRead: {route: globals.webApiBaseUrl + 'resource/master/pool/'},
				entityRole: {
					leaf: {
						itemName: 'Pool',
						parentService: resourceMasterMainService,
						parentFilter: 'resourceFk'
					}
				},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = resourceMasterMainService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				actions: {
					delete: {},
					create: 'flat',
					canCreateCallBackFunc: function () {
						var parentItem = resourceMasterMainService.getSelected();
						return !moduleContext.isReadOnly && !!parentItem && !!parentItem.Id;
					},
					canDeleteCallBackFunc: function () {
						return !moduleContext.isReadOnly;
					}

				}

			}
		};

		/* jshint -W003 */
		var container = platformDataServiceFactory.createNewComplete(poolServiceInfo);

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'PoolDto',
			moduleSubModule: 'Resource.Master',
			validationService: 'resourceMasterPoolValidationService'
		});

		return container.service;
	}
})(angular);
