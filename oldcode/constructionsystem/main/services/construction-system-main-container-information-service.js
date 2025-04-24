/**
 * Created by xsi on 2016-07-18.
 */
(function(angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';
	angular.module(moduleName).factory('constructionsystemMainContainerInformationService', [
		'basicsCommonContainerInformationServiceUtil', '$injector',


		function (containerInformationServiceUtil, $injector) {
			var service = {};

			/* jshint -W074 */
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				switch (guid) {
					case 'c17ce6c31f454e18a2bc84de91f72f48':// Instances
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'constructionSystemMainInstanceUIConfigService',
							dataSvc: 'constructionSystemMainInstanceService',
							validationSvc: 'constructionSystemMainInstanceValidationService'
						}, null);
						break;
					case '90f746cdd8c64f819e89b7b6e9993536':// Instance Detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'constructionSystemMainInstanceUIConfigService',
							dataSvc: 'constructionSystemMainInstanceService',
							validationSvc: 'constructionSystemMainInstanceValidationService'
						});
						break;
					case '962190ed40074f40a687064875cdccbb':// Instance Header Parameters
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'constructionSystemMainInstanceHeaderParameterUIConfigService',
							dataSvc: 'constructionSystemMainInstanceHeaderParameterService',
							validationSvc: 'constructionSystemMainInstanceHeaderParameterValidationService'
						}, null);
						break;
					case 'ea84e185f04d44138eb829a14f7181af':// Instance Header Parameter Detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'constructionSystemMainInstanceHeaderParameterUIConfigService',
							dataSvc: 'constructionSystemMainInstanceHeaderParameterService',
							validationSvc: 'constructionSystemMainInstanceHeaderParameterValidationService'
						});
						break;
					case 'd4a280f7761c4574b90eb413508308a5':// Instance Parameters
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'constructionSystemMainInstanceParameterUIConfigService',
							dataSvc: 'constructionSystemMainInstanceParameterService',
							validationSvc: 'constructionSystemMainInstanceParameterValidationService'
						}, null);
						break;
					case '51a7e35aada943ce91d791fe6de013f0':// Instance Parameter Detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'constructionSystemMainInstanceParameterUIConfigService',
							dataSvc: 'constructionSystemMainInstanceParameterService',
							validationSvc: 'constructionSystemMainInstanceParameterValidationService'
						});
						break;
					case 'F6733538A0334B299C76C460E12CE569':// Object Parameters
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'constructionSystemMainInstance2ObjectParamUIConfigService',
							dataSvc: 'constructionSystemMainInstance2ObjectParamService'
						}, null);
						break;
					case '6574B0FA40FC4E46A2D9B6788CDB218E':// Object Parameter Detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'constructionSystemMainInstance2ObjectParamUIConfigService',
							dataSvc: 'constructionSystemMainInstance2ObjectParamService'
						});
						break;

					// grouped imports from model.main
					case '3b5c28631ef44bb293ee05475a9a9513': // modelMainViewerLegendListController
					case 'd12461a0826a45f1ab76f53203b48ec6': // modelMainViewerLegendDetailController
						config = $injector.get('modelMainContainerInformationService').getContainerInfoByGuid(guid);
						break;
					case '553196be4e394702bb9e9e86b6bc7a59':// Object Template
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'constructionSystemMainObjectTemplateUIStandardService',
							dataSvc: 'constructionSystemMainObjectTemplateDataService',
							validationSvc: 'constructionSystemMainObjectTemplateValidationService'
						}, null);
						break;
					case '5993871142644309b165d52701f6502b':// Object Template Detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'constructionSystemMainObjectTemplateUIStandardService',
							dataSvc: 'constructionSystemMainObjectTemplateDataService',
							validationSvc: 'constructionSystemMainObjectTemplateValidationService'
						});
						break;
					case '7e8e5c39d3314b87a23f8277ee0335e2':// Object Template Property
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'constructionSystemMainObjectTemplatePropertyUIStandardService',
							dataSvc: 'constructionSystemMainObjectTemplatePropertyDataService',
							validationSvc: 'constructionSystemMainObjectTemplatePropertyValidationService'
						});
						break;
					case 'fd0073b62d8142fe87072c49d31aac3c':// Object Template Property Detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'constructionSystemMainObjectTemplatePropertyUIStandardService',
							dataSvc: 'constructionSystemMainObjectTemplatePropertyDataService',
							validationSvc: 'constructionSystemMainObjectTemplatePropertyValidationService'
						});
						break;
					case 'f46d660558a7438fb2cc8014f00f00b4': // constructionSystemMainObject2LocationListController
						config.layout = $injector.get('constructionSystemMainObject2LocationConfigurationService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'constructionSystemMainObject2LocationConfigurationService';
						config.dataServiceName = 'constructionSystemMainObject2LocationService';
						config.listConfig = {
							initCalled: false,
							grouping: true,
							enableColumnReorder: false,
							enableConfigSave: false
						};
						break;
				}
				return config;
			};
			return service;
		}
	]);

})(angular);
