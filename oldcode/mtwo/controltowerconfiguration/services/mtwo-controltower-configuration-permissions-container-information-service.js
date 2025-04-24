/**
 * Created by waldrop on 9/16/2019
 */

(function (angular) {
	'use strict';

	var moduleName = 'mtwo.controltowerconfiguration';

	/**
	 * @ngdoc service
	 * @name mtwoControltowerContainerInformationService
	 * @description provides information on container used in mtwo controltower module
	 */
	angular.module(moduleName).service('mtwoControltowerconfigurationContainerInformationService', MtwoControltowerconfigurationContainerInformationService);

	MtwoControltowerconfigurationContainerInformationService.$inject = ['_', 'basicsLookupdataConfigGenerator'];

	function MtwoControltowerconfigurationContainerInformationService(_, basicsLookupdataConfigGenerator) {
		var self = this;

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = null;
			switch (guid) {
				case '8b7b355acb6a457e95985b07f36549fd': // mtwoControltowerListController
					config = self.getMtwoControltowerServiceInfos();
					config.layout = self.getMtwoControltowerLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: [], parentProp: 'ParentGuid', childProp: 'Nodes'};
					break;
				// case '1cd262902c8140fbb76d0a9019e36694': // mtwoControltowerDetailController
				// config = self.getMtwoControltowerServiceInfos();
				// config.layout = self.getMtwoControltowerLayout();
				// config.ContainerType = 'Detail';
				// break;
			}
			return config;
		};

		this.getMtwoControltowerServiceInfos = function getMtwoControltowerServiceInfos() {
			return {
				standardConfigurationService: 'usermanagementRightDescriptorStructureUIService',
				dataServiceName: 'mtwoPermissionManagementService'
				/* validationServiceName: 'mtwoControltowerValidationService' */
			};
		};

		this.getMtwoControltowerLayout = function getMtwoControltowerLayout() {
			return self.getBaseLayout('mtwo.controltowerconfiguration.moduleAssignment',
				['structure', 'name', 'isLive'],
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
