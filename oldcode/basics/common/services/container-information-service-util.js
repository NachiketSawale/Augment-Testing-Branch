/**
 * Created by chm on 8/10/2016.
 */

(function (angular) {
	'use strict';
	const moduleName = 'basics.common';

	/**
	 * @ngdoc service
	 * @name containerInformationServiceUtil
	 * @function
	 *
	 * @description
	 * A helper service to create config for XxxContainerInformationService
	 **/
	angular.module(moduleName).factory('basicsCommonContainerInformationServiceUtil', ['$injector',
		function ($injector) {
			const service = {};

			/**
			 * Creates config for grid container.
			 *
			 * @private
			 * @memberOf _
			 * @category containerInformationServiceUtil
			 * @param {object} cfg Indicates the incoming standard service names.
			 * e.g.
			 * cfg : {
			 * cfgSvc : businessPartnerMainSupplierUIStandardService,
			 * dataSvc: businesspartnerMainSupplierDataService
			 * validationSvc: businesspartnerMainSupplierValidationService
			 * }
			 * @param {object} gridConfig Indicates the special config for grid. if it's null, use default.
			 * @returns {object} Returns the config instance.
			 */
			service.createCfgForGrid = function createCfgForGrid(cfg, gridConfig) {
				const config = {};

				config.layout = $injector.get(cfg.cfgSvc).getStandardConfigForListView();
				config.ContainerType = 'Grid';
				config.standardConfigurationService = cfg.cfgSvc;
				config.dataServiceName = cfg.dataSvc;
				config.validationServiceName = cfg.validationSvc;
				if (gridConfig) {
					config.listConfig = angular.copy(gridConfig);
				} else {
					config.listConfig = {initCalled: false, columns: []};
				}

				return config;
			};

			/**
			 * Creates config for detail container.
			 *
			 * @private
			 * @memberOf _
			 * @category containerInformationServiceUtil
			 * @param {object} cfg Indicates the incoming services name.
			 * e.g.
			 * cfg : {
			 * cfgSvc : businessPartnerMainSupplierUIStandardService,
			 * dataSvc: businesspartnerMainSupplierDataService
			 * validationSvc: businesspartnerMainSupplierValidationService
			 * }
			 * @returns {object} Returns the config instance.
			 */
			service.createCfgForDetail = function createCfgForDetail(cfg) {
				let config;

				config = $injector.get(cfg.cfgSvc).getStandardConfigForDetailView();
				config.ContainerType = 'Detail';
				config.standardConfigurationService = cfg.cfgSvc;
				config.dataServiceName = cfg.dataSvc;
				config.validationServiceName = cfg.validationSvc;

				return config;
			};

			return service;
		}

	]);

})(angular);