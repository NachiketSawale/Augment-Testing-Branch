/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

((angular) => {

	'use strict';
	const moduleName = 'estimate.project';

	/**
     * @ngdoc service
     * @name estimateProjectContainerInformationService
     * @function
     *
     * @description
     *
     */
	angular.module(moduleName).service('estimateProjectContainerInformationService', estimateProjectContainerInformationService);

	estimateProjectContainerInformationService.$inject = ['$injector', '_', 'platformLayoutHelperService', 'basicsLookupdataConfigGenerator'];

	function estimateProjectContainerInformationService($injector, _, platformLayoutHelperService, basicsLookupdataConfigGenerator) {
		/* jshint -W040 */ // remove the warning that possible strict voilation
		let self = this;

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			let config = {};
			switch (guid) {
				case 'bceaa9e8a4f04e5797e87871078e6edc': // estimateProjectClerkListController
					config = self.getEstimateProjectClerkServiceInfos();
					config.layout = self.getEstimateProjectClerkLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case 'a8eceb9f41f8475fa35b876a642c22d5': // estimateProjectClerkDetailController
					config = self.getEstimateProjectClerkServiceInfos();
					config.layout = self.getEstimateProjectClerkLayout();
					config.ContainerType = 'Detail';
					break;
			}
			return config;
		};

		this.getEstimateProjectClerkServiceInfos = function getEstimateProjectClerkServiceInfos() {
			return {
				standardConfigurationService: 'estimateProjectClerkLayoutService',
				dataServiceName: 'estimateProjectClerkDataService',
				validationServiceName: 'estimateProjectClerkValidationService'
			};
		};

		this.getEstimateProjectClerkLayout = function getEstimateProjectClerkLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'estimate.project.header.clerk',
				['clerkrolefk','clerkfk','commenttext']);
			res.overloads = self.getOverloads(['clerkrolefk','clerkfk']);

			return res;
		};

		this.getOverloads = function getOverloads(overloads) {
			let ovls = {};
			if(overloads) {
				_.forEach(overloads, (ovl) => {
					let ol = self.getOverload(ovl);
					if(ol) {
						ovls[ovl] = ol;
					}
				});
			}

			return ovls;
		};

		this.getOverload = function getOverloads(overload) {
			let ovl = null;

			switch(overload) {
				case 'clerkrolefk': ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsCustomClerkRoleLookupDataService',
					enableCache: true
				}); break;
				case 'clerkfk': ovl = platformLayoutHelperService.provideClerkLookupOverload(); break;
			}

			return ovl;
		};
	}
})(angular);
