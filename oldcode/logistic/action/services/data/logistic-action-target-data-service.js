/**
 * Created by Shankar on 17.01.2025
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('logistic.action');

	/**
	 * @ngdoc service
	 * @name logisticActionTargetDataService
	 * @description provides methods to access, create and update action target entities
	 */
	myModule.service('logisticActionTargetDataService', LogisticActionTargetDataService);

	LogisticActionTargetDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
	'platformDataServiceEntityReadonlyProcessor'];

	function LogisticActionTargetDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		platformDataServiceEntityReadonlyProcessor) {
		let self = this;

		let logisticActionTargetServiceOption = {
			flatRootItem: {
				module: myModule,
				serviceName: 'logisticActionTargetDataService',
				entityNameTranslationID: 'basics.customize.actionTarget',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/action/target/',
					endRead: 'filtered',
					usePostForRead: true,
					filterOnLoadFn: function (target) {
						return target.IsLive;
					}
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'BasicsCustomizeLogisticsActionTargetDTO',
					moduleSubModule: 'Basics.Customize'
				}), platformDataServiceEntityReadonlyProcessor],
				entityRole: { root: { itemName: 'Action', moduleName: 'cloud.desktop.moduleDisplayNameLogisticAction' } },
				entitySelection: { supportsMultiSelection: true },
				presenter: { list: {} },
				actions: { delete: false, create: false },
				sidebarSearch: {
					options:{
						moduleName: 'logistic.action',
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						includeDateSearch: true,
						useIdentification: true,
						pattern: '',
						pageSize: 100,
						useCurrentClient: true,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: true
					}

				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(logisticActionTargetServiceOption, self);
		serviceContainer.data.Initialised = true;

	}
})(angular);
