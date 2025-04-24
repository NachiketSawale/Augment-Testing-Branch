/**
 * Created by baf on 29.06.2021
 */

(function (angular) {
	/* global globals*/
	'use strict';
	var myModule = angular.module('project.main');

	/**
	 * @ngdoc service
	 * @name projectMainBiddingConsortiumDataService
	 * @description pprovides methods to access, create and update project main biddingConsortium entities
	 */
	myModule.service('projectMainBiddingConsortiumDataService', ProjectMainBiddingConsortiumDataService);

	ProjectMainBiddingConsortiumDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'projectMainConstantValues', 'projectMainTenderResultService'];

	function ProjectMainBiddingConsortiumDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, projectMainConstantValues, projectMainTenderResultService) {
		var self = this;

		function canCreateBidderConsortium() {
			var selParent = projectMainTenderResultService.getSelected();

			return selParent && selParent.IsBiddingConsortium;
		}

		var projectMainBiddingConsortiumServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'projectMainBiddingConsortiumDataService',
				entityNameTranslationID: 'project.main.biddingConsortiumEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'project/main/biddingconsortium/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = projectMainTenderResultService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat', canCreateCallBackFunc: canCreateBidderConsortium },
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					projectMainConstantValues.schemes.biddingConsortium)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = projectMainTenderResultService.getSelected();
							creationData.PKey1 = selected.Id;
							creationData.PKey2 = selected.ProjectFk;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'BiddingConsortiums', parentService: projectMainTenderResultService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(projectMainBiddingConsortiumServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'projectMainBiddingConsortiumValidationService'
		}, projectMainConstantValues.schemes.biddingConsortium));
	}
})(angular);
