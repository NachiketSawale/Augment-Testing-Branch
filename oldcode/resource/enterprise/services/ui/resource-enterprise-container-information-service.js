/**
 * Created by baf on 05.03.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.enterprise';

	/**
	 * @ngdoc service
	 * @name resourceEnterpriseContainerInformationService
	 * @description provides information on container used in resource enterprise module
	 */
	angular.module(moduleName).service('resourceEnterpriseContainerInformationService', ResourceEnterpriseContainerInformationService);

	ResourceEnterpriseContainerInformationService.$inject = ['_','$injector', 'basicsLookupdataConfigGenerator'];

	function ResourceEnterpriseContainerInformationService(_, $injector, basicsLookupdataConfigGenerator) {
		let dynamicConfigurations = {};
		let self = this;

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = null;
			switch (guid) {
				case 'c89773b5e5b342339203a99d29c07c09': // resourceEnterpriseListController
					config = self.getResourceEnterpriseDispatcherServiceInfos();
					config.layout = self.getResourceEnterpriseDispatcherLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '7a783576fd3344c5a0d420060a323b3a': // resourceEnterpriseDetailController
					config = self.getResourceEnterpriseDispatcherServiceInfos();
					config.layout = self.getResourceEnterpriseDispatcherLayout();
					config.ContainerType = 'Detail';
					break;
				case '2eea8976a98d11eabb370242ac130002': // reourceenterpriseRservervationListController
					config = self.getResourceEnterpriseReservationServiceInfos();
					config.layout = $injector.get('resourceReservationUIStandardService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '601c700ea98d11eabb370242ac130002': // reourceenterpriseRservervationDetailController
					config = self.getResourceEnterpriseReservationServiceInfos();
					config.layout =  $injector.get('resourceReservationUIStandardService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					break;

				default:
					config = self.hasDynamic(guid) ? dynamicConfigurations[guid] : null;
					break;
			}
			return config;
		};

		this.hasDynamic = function hasDynamic(guid) {
			return !_.isNil(dynamicConfigurations[guid]);
		};

		this.takeDynamic = function takeDynamic(guid, config) {
			dynamicConfigurations[guid] = config;
		};

		this.getResourceEnterpriseDispatcherServiceInfos = function getResourceEnterpriseDispatcherServiceInfos() {
			return {
				standardConfigurationService: 'resourceEnterpriseDispatcherLayoutService',
				dataServiceName: 'resourceEnterpriseDispatcherDataService',
				validationServiceName: 'resourceEnterpriseDispatcherValidationService'
			};
		};

		this.getResourceEnterpriseReservationServiceInfos = function getResourceEnterpriseReservationServiceInfos () {
			return {
				standardConfigurationService:  $injector.get('resourceReservationUIStandardService'),
				dataServiceName: 'resourceEnterpriseReservationDataService',
				validationServiceName: $injector.get('resourceReservationValidationService')
			};
		};

		this.getResourceEnterpriseDispatcherLayout = function getResourceEnterpriseDispatcherLayout() {
			return self.getBaseLayout('resource.enterprise.dispatcher',
				['descriptioninfo'],
				[]);
		};

		this.getBaseLayout = function getBaseLayout(fid, atts, overloads) {
			var res = {
				version: '1.0.0',
				fid: fid,
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [
					{
						gid: 'basicData',
						attributes: atts
					},
					{
						gid: 'entityHistory',
						isHistory: true
					}
				]
			};

			res.overloads = self.getOverloads(overloads);

			return res;
		};

		this.getOverloads = function getOverloads(overloads) {
			var ovls = {};
			if (overloads) {
				_.forEach(overloads, function (ovl) {
					var ol = self.getOverload(ovl);
					if (ol) {
						ovls[ovl] = ol;
					}
				});
			}

			return ovls;
		};

		this.getOverload = function getOverloads(overload) {
			var ovl = null;

			switch (overload) {
				case 'zzzzzz':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'zzzzzz',
						cacheEnable: true
					});
					break;
			}

			return ovl;
		};
	}

})(angular);