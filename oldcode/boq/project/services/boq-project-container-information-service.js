((angular) => {

	'use strict';
	let boqProjectModule = angular.module('boq.project');

	/**
	 * @ngdoc service
	 * @name boqProjectContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	boqProjectModule.service('boqProjectContainerInformationService', BoqProjectContainerInformationService);

	BoqProjectContainerInformationService.$inject = ['$injector', '_', 'platformLayoutHelperService', 'basicsLookupdataConfigGenerator'];

	function BoqProjectContainerInformationService($injector, _, platformLayoutHelperService, basicsLookupdataConfigGenerator) {
		let self = this;

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			let config = {};
			switch (guid) {
				case 'c1fc5b2e7f6f47bdabaef27a7dfe05f1': // boqProjectClerkListController
					config = self.getBoqProjectClerkServiceInfos();
					config.layout = self.getBoqProjectClerkLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					break;
				/* case '9dba09dfec334213bc8cb59ef42ffc27': // boqProjectClerkDetailController
					config = self.getBoqProjectClerkServiceInfos();
					config.layout = self.getBoqProjectClerkLayout();
					config.ContainerType = 'Detail';
					break; */
			}
			return config;
		};

		this.getBoqProjectClerkServiceInfos = function getBoqProjectClerkServiceInfos() {
			return {
				standardConfigurationService: 'boqProjectClerkLayoutService',
				dataServiceName: 'boqProjectClerkDataService',
				validationServiceName: 'boqProjectClerkValidationService'
			};
		};

		this.getBoqProjectClerkLayout = function getBoqProjectClerkLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'boq.project.clerk',
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
