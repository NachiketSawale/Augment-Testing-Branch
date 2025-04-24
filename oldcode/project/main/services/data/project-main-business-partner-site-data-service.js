/**
 * Created by baf on 20.09.2022
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('project.main');

	/**
	 * @ngdoc service
	 * @name projectMainBusinessPartnerSiteDataService
	 * @description pprovides methods to access, create and update project main businessPartnerSite entities
	 */
	myModule.service('projectMainBusinessPartnerSiteDataService', ProjectMainBusinessPartnerSiteDataService);

	ProjectMainBusinessPartnerSiteDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'projectMainConstantValues', 'projectPrj2BPService'];

	function ProjectMainBusinessPartnerSiteDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, projectMainConstantValues, projectMainBusinessPartnerDataService) {
		var self = this;
		var projectMainBusinessPartnerSiteServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'projectMainBusinessPartnerSiteDataService',
				entityNameTranslationID: 'project.main.businessPartnerSiteEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'project/main/bizpartnersite/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = projectMainBusinessPartnerDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					projectMainConstantValues.schemes.bizPartnerSite)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = projectMainBusinessPartnerDataService.getSelected();
							creationData.PKey1 = selected.Id;
							creationData.PKey2 = selected.ProjectFk;
							creationData.PKey3 = selected.BusinessPartnerFk;
							creationData.Id = selected.SubsidiaryFk;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'BusinessPartnerSites', parentService: projectMainBusinessPartnerDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(projectMainBusinessPartnerSiteServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'projectMainBusinessPartnerSiteValidationService'
		}, projectMainConstantValues.schemes.bizPartnerSite));
	}
})(angular);
