/**
 * Created by baf on 05.03.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('logistic.sundrygroup');

	/**
	 * @ngdoc service
	 * @name logisticSundryServiceGroupDataService
	 * @description provides methods to access, create and update logistic sundrygroup  entities
	 */
	myModule.service('logisticSundryServiceGroupDataService', LogisticSundryServiceGroupDataService);

	LogisticSundryServiceGroupDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'ServiceDataProcessArraysExtension' , 'logisticSundryServiceGroupConstantValues'];

	function LogisticSundryServiceGroupDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, ServiceDataProcessArraysExtension, logisticSundryServiceGroupConstantValues) {

		var self = this;
		var logisticSundrygroupServiceOption = {
			hierarchicalRootItem: {
				module: myModule,
				serviceName: 'logisticSundryServiceGroupDataService',
				entityNameTranslationID: 'logistic.sundrygroup.sundryServiceGroupEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/sundrygroup/',
					usePostForRead: true,
					endRead: 'filtered',
					endDelete: 'multidelete'
				},
				dataProcessor: [new ServiceDataProcessArraysExtension(['Subgroups']),platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'SundryServiceGroupDto',
					moduleSubModule: 'Logistic.SundryGroup'
				})],
				entityRole: {
					root: {
						// descField: 'SundryServiceGroupName',
						itemName: 'SundryServiceGroups',
						moduleName: 'cloud.desktop.moduleDisplayNameLogisticSundryServiceGroup'
					}
				},
				entitySelection: {supportsMultiSelection: true},
				presenter: {
					tree: {
						parentProp: 'SundryServiceGroupFk',
						childProp: 'SundryServiceGroups',
						initCreationData: function initCreationData(creationData) {
							var parentId = creationData.parentId;
							delete creationData.parentId;
							if (!_.isNull(parentId) && !_.isUndefined(parentId) && parentId > 0) {
								creationData.PKey1 = parentId;
							}
						}

					}
				},
				translation: {
					uid: 'logisticSundryServiceGroupDataService',
					title: 'logistic.sundrygroup.listSundryServiceGroupTitle',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: logisticSundryServiceGroupConstantValues.schemes.group
				},
				sidebarSearch: {
					options: {
						moduleName: 'logistic.sundrygroup',
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						pattern: '',
						pageSize: 100,
						useCurrentClient: null,
						includeNonActiveItems: false,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: true
					}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticSundrygroupServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.hasToReduceTreeStructures = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticSundryServiceGroupValidationService'
		}, logisticSundryServiceGroupConstantValues.schemes.group));
	}

})(angular);
