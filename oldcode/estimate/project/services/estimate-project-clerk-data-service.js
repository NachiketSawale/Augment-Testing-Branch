/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	const moduleName = 'estimate.project';
	const estimateProjectModule = angular.module(moduleName);

	/**
     * @ngdoc service
     * @name estimateProjectClerkDataService
     * @description provides methods to access, create and update estimate Project clerk entities
     */
	estimateProjectModule.service('estimateProjectClerkDataService', estimateProjectClerkDataService);

	estimateProjectClerkDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'estimateProjectService'];

	function estimateProjectClerkDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, estimateProjectService) {
		/* jshint -W040 */ // remove the warning that possible strict voilation
		let self = this;
		let estimateProjectClerkServiceOption = {
			flatLeafItem: {
				module: estimateProjectModule,
				serviceName: 'estimateProjectClerkDataService',
				entityNameTranslationID: 'cloud.common.entityClerk',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'estimate/project/clerk/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = estimateProjectService.getSelected();
						readData.PKey1 = selected && selected.PrjEstimate ? selected.PrjEstimate.EstHeaderFk : -1;
					}
				},
				actions: {delete: true, create: 'flat'},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = estimateProjectService.getSelected();
							creationData.PKey1 = selected && selected.PrjEstimate ? selected.PrjEstimate.EstHeaderFk : -1;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'EstimateProjectHeader2Clerks', parentService: estimateProjectService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(estimateProjectClerkServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'estimateProjectClerkValidationService'
		}, {typeName: 'EstimateProjectHeader2ClerkDto', moduleSubModule: 'Estimate.Project'}));
	}
})(angular);
