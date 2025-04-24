/**
 * Created by baf on 16.11.2017
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.componenttype';

	/**
	 * @ngdoc service
	 * @name resourceComponenttypeContainerInformationService
	 * @description provides information on container used in resource componenttype module
	 */
	angular.module(moduleName).service('resourceComponenttypeContainerInformationService', ResourceComponentTypeContainerInformationService);

	ResourceComponentTypeContainerInformationService.$inject = ['_', 'basicsLookupdataConfigGenerator'];

	function ResourceComponentTypeContainerInformationService(_, basicsLookupdataConfigGenerator) {
		var self = this;

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = null;
			switch (guid) {
				case '7b66904e63404334a7c1930a1f6ffd82': // resourceComponentTypeListController
					config = self.getResourceComponentTypeServiceInfos();
					config.layout = self.getResourceComponentTypeLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case 'e7b2aa01dab8439cae84f3f5258d4e23': // resourceComponentTypeDetailController
					config = self.getResourceComponentTypeServiceInfos();
					config.layout = self.getResourceComponentTypeLayout();
					config.ContainerType = 'Detail';
					break;
			}
			return config;
		};

		this.getResourceComponentTypeServiceInfos = function getResourceComponentTypeServiceInfos() {
			return {
				standardConfigurationService: 'resourceComponentTypeLayoutService',
				dataServiceName: 'resourceComponentTypeDataService',
				validationServiceName: 'resourceComponentTypeValidationService'
			};
		};

		this.getResourceComponentTypeLayout = function getResourceComponentTypeLayout() {
			return self.getBaseLayout('resource.componenttype.componenttype',
				['descriptioninfo','isbasecomponent','isdefault','sorting','islive'],
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