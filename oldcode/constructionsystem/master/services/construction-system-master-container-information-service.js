/**
 * Created by xsi on 2016-07-07.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';
	angular.module(moduleName).factory('constructionsystemMasterContainerInformationService', [
		'$injector', 'basicsCommonContainerInformationServiceUtil',

		function ($injector, containerInformationServiceUtil) {
			var service = {};

			/* jshint -W074 */
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				switch (guid) {
					case '7fb0f988359341e6950d9f679d0c7b62':
						var dataService = $injector.get('constructionSystemMasterGroupService');
						var filterService = $injector.get('constructionSystemMasterGroupFilterService');
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'constructionSystemMasterGroupUIStandardService',
							dataSvc: 'constructionSystemMasterGroupService',
							validationSvc: 'constructionSystemMasterGroupValidationService'
						},{
							parentProp:'CosGroupFk',
							childProp: 'GroupChildren',
							marker: {
								filterService: filterService,
								filterId: 'constructionSystemMasterGroupService',
								dataService: dataService,
								serviceName: 'constructionSystemMasterGroupService'
							},
							cellChangeCallBack: function cellChangeCallBack(arg) {
								dataService.onCellChange(arg);
							},
							rowChangeCallBack: function rowChangeCallBack(/* arg, buttons */) {

							}
						});
						break;
					case  '189564016710460192353d6dd68daa44':
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'constructionSystemMasterGroupUIStandardService',
							dataSvc: 'constructionSystemMasterGroupService',
							validationSvc: 'constructionSystemMasterGroupValidationService'
						});
						break;
					case 'ACC544C6504A4A678DBE74D8F390EEA8':// Construction System Masters Header

						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'constructionSystemMasterHeaderUIStandardService',
							dataSvc: 'constructionSystemMasterHeaderService',
							validationSvc: 'constructionSystemMasterHeaderValidationService'
						}, null);
						break;
					case 'FD415CFDA30F423CAA757762F9F9D6DE':// Construction System Masters Header From
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'constructionSystemMasterHeaderUIStandardService',
							dataSvc: 'constructionSystemMasterHeaderService',
							validationSvc: 'constructionSystemMasterHeaderValidationService'
						});
						break;
					case '1BF54E1872EA4559BC95A1C2C6152450':// Parameter
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'constructionSystemMasterParameterUIStandardService',
							dataSvc: 'constructionSystemMasterParameterDataService',
							validationSvc: 'constructionSystemMasterParameterValidationService'
						}, null);
						break;
					case '1BF54E1802EA4559BC95A1C2C6152454':// Parameter Form
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'constructionSystemMasterParameterUIStandardService',
							dataSvc: 'constructionSystemMasterParameterDataService',
							validationSvc: 'constructionSystemMasterParameterValidationService'
						});
						break;
					case 'F312265433D140F7BB9F00CD7A026E91':// Parameter Values
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'constructionSystemMasterParameterValueUIStandardService',
							dataSvc: 'constructionSystemMasterParameterValueDataService',
							validationSvc: 'constructionSystemMasterParameterValueValidationService'
						}, null);
						break;
					case 'F312265433D140F7BB9F66CD7A026E32':// Parameter Values Form
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'constructionSystemMasterParameterValueUIStandardService',
							dataSvc: 'constructionSystemMasterParameterValueDataService',
							validationSvc: 'constructionSystemMasterParameterValueValidationService'
						});
						break;
					case '37CF0F655BD94DBBB424DEEE45547E32':// Parameter Groups
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'constructionSystemMasterParameterGroupUIStandardService',
							dataSvc: 'constructionSystemMasterParameterGroupDataService',
							validationSvc: 'constructionSystemMasterParameterGroupValidationService'
						}, null);
						break;
					case '27CF0F655BD94DBBB424DEEE45547E35':// Parameter Groups Form
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'constructionSystemMasterParameterGroupUIStandardService',
							dataSvc: 'constructionSystemMasterParameterGroupDataService',
							validationSvc: 'constructionSystemMasterParameterGroupValidationService'
						});
						break;
					case '12ED89F703F9484D8934A967DA15BBE4':// Assembly Assignment
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'constructionSystemMasterAssemblyUIStandardService',
							dataSvc: 'constructionSystemMasterAssemblyService',
							validationSvc: 'constructionSystemMasterAssemblyValidationService'
						}, null);
						break;

					// For Construction System Master  Assembly Resource Container
					case '574b34f0674d450ca9c696d9bd5c4ea7':
						config = $injector.get('ConstructionSystemMasterAssemblyResourceContainerInformationService').getContainerInfoByGuid(guid);
						break;

					case '068F5A3774344F85905A18ABD2FC3E2A':// Assembly Assignment Form
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'constructionSystemMasterAssemblyUIStandardService',
							dataSvc: 'constructionSystemMasterAssemblyService',
							validationSvc: 'constructionSystemMasterAssemblyValidationService'
						});
						break;
					case 'B13B068F2F7C439D8EAA3DF7D66EBB96':// Activity Template
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'constructionSystemMasterActivityTemplateUIStandardService',
							dataSvc: 'constructionSystemMasterActivityTemplateService',
							validationSvc: 'constructionSystemMasterActivityTemplateValidationService'
						}, null);
						break;
					case '14CAE87B5C294052A8CFB8A733ACE89A':// Activity Template Form
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'constructionSystemMasterActivityTemplateUIStandardService',
							dataSvc: 'constructionSystemMasterActivityTemplateService',
							validationSvc: 'constructionSystemMasterActivityTemplateValidationService'
						});
						break;
					case '9A833119C0594C3EB541364E8E4C7136':// Controlling Groups
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'constructionSystemMasterControllingGroupUIStandardService',
							dataSvc: 'constructionSystemMasterControllingGroupService',
							validationSvc: 'constructionSystemMasterControllingGroupValidationService'
						}, null);
						break;
					case 'DC659B57E6F943BE84A334A16D08DC96':// Controlling Groups Form
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'constructionSystemMasterControllingGroupUIStandardService',
							dataSvc: 'constructionSystemMasterControllingGroupService',
							validationSvc: 'constructionSystemMasterControllingGroupValidationService'
						});
						break;
					case '1CD70E4C9E1740C39E00213C9745153F':// Work Item Assignments
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'constructionSystemMasterWicUIStandardService',
							dataSvc: 'constructionSystemMasterWicService',
							validationSvc: 'constructionSystemMasterWicValidationService'
						}, null);
						break;
					case '76F471CFD25F48CC8F6306C5C4B1D6A9':// Work Item Assignments Form
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'constructionSystemMasterWicUIStandardService',
							dataSvc: 'constructionSystemMasterWicService',
							validationSvc: 'constructionSystemMasterWicValidationService'
						});
						break;
					case '1318e19a7da04d8ba01a0fbcde2c77bd':// Templates
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'constructionSystemMasterTemplateUIStandardService',
							dataSvc: 'constructionSystemMasterTemplateDataService',
							validationSvc: 'constructionSystemMasterTemplateValidationService'
						}, null);
						break;
					case '79e66f0c359a4d109c20b82ee3cc507a':// Templates Form
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'constructionSystemMasterTemplateUIStandardService',
							dataSvc: 'constructionSystemMasterTemplateDataService',
							validationSvc: 'constructionSystemMasterTemplateValidationService'
						});
						break;
					case '2F47326E7B2441DABADB4DAEBB327E2D':// Model Object
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'constructionSystemMasterModelObjectUIStandardService',
							dataSvc: 'constructionSystemMasterModelObjectDataService'
						}, null);
						break;
					case '4F2AF86298A941E8A2AA35B0EED27220':// Model Object Form
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'constructionSystemMasterModelObjectUIStandardService',
							dataSvc: 'constructionSystemMasterModelObjectDataService'
						});
						break;
					case '575D3224FF8C4943A9C5C25D904BEEAA':// Model Property
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'modelMainPropertyConfigurationService',
							dataSvc: 'constructionSystemCommonModelPropertyDataService'
						}, null);
						break;
					case '61CFEA3536D44F30B92681EB3665DC98':// Model Property Form
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'modelMainPropertyConfigurationService',
							dataSvc: 'constructionSystemCommonModelPropertyDataService'
						});
						break;
					case '907a9e74be7245b4b277cbf4febd6806':// Parameter Templates
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'constructionSystemMasterParameter2TemplateUIStandardService',
							dataSvc: 'constructionSystemMasterParameter2TemplateDataService',
							validationSvc: 'constructionSystemMasterParameter2TemplateValidationService'
						}, null);
						break;
					case '6058b3709bbc4faeb8425512d7cc5d95':// Parameter Templates Form
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'constructionSystemMasterParameter2TemplateUIStandardService',
							dataSvc: 'constructionSystemMasterParameter2TemplateDataService',
							validationSvc: 'constructionSystemMasterParameter2TemplateValidationService'
						});
						break;
					case 'd736297005f9469d93d09a14c59fe414':// Global Parameter
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'constructionSystemMasterGlobalParameterUIStandardService',
							dataSvc: 'constructionSystemMasterGlobalParameterDataService',
							validationSvc: 'constructionSystemMasterGlobalParameterValidationService'
						}, null);
						config.listConfig.initCalled = true;
						break;
					case 'aab5cdd616ba0498daaeb8215c3c6022':// Global Parameter Form
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'constructionSystemMasterGlobalParameterUIStandardService',
							dataSvc: 'constructionSystemMasterGlobalParameterDataService',
							validationSvc: 'constructionSystemMasterGlobalParameterValidationService'
						});
						break;
					case 'a096f97b3ef242febe7219478f06f9b4':// Global Parameter Values
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'constructionSystemMasterGlobalParameterValueUIStandardService',
							dataSvc: 'constructionSystemMasterGlobalParameterValueDataService',
							validationSvc: 'constructionSystemMasterGlobalParameterValueValidationService'
						}, null);
						break;
					case '42555609fbcd47aeb64468d270a648ab':// Global Parameter Values Form
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'constructionSystemMasterGlobalParameterValueUIStandardService',
							dataSvc: 'constructionSystemMasterGlobalParameterValueDataService',
							validationSvc: 'constructionSystemMasterGlobalParameterValueValidationService'
						});
						break;
					case '2e51def88fbb40bbbb53876e54de22c9':// Object Template
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'constructionSystemMasterObjectTemplateUIStandardService',
							dataSvc: 'constructionSystemMasterObjectTemplateDataService',
							validationSvc: 'constructionSystemObjectTemplateValidationService'
						}, null);
						break;
					case 'fcb2a29ce70f4a1db8489cc5c997431b':// Object Template Form
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'constructionSystemMasterObjectTemplateUIStandardService',
							dataSvc: 'constructionSystemMasterObjectTemplateDataService',
							validationSvc: 'constructionSystemObjectTemplateValidationService'
						});
						break;
					case '83ef6ff7f7704edc9a2f1b50bd35690d':// Object Template Property
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'constructionSystemMasterObjectTemplatePropertyUIStandardService',
							dataSvc: 'constructionSystemMasterObjectTemplatePropertyDataService',
							validationSvc: 'constructionSystemMasterObjectTemplatePropertyValidationService'
						}, null);
						break;
					case '29aba7c0e5bb464b894a477169cd5233':// Object Template Property Detail
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'constructionSystemMasterObjectTemplatePropertyUIStandardService',
							dataSvc: 'constructionSystemMasterObjectTemplatePropertyDataService',
							validationSvc: 'constructionSystemMasterObjectTemplatePropertyValidationService'
						}, null);
						break;
					case '25cdff39a402445188247d0096836cc2':// Object Template To Templage
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'constructionSystemMasterObjectTemplate2TemplateUIStandardService',
							dataSvc: 'constructionSystemMasterObjectTemplate2TemplateDataService',
							validationSvc: 'constructionSystemObjectTemplateValidationService'
						}, null);
						break;
					case 'e36ceb46cae143ada0413d8e0f21737d':// Object Template To Templage Detail
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'constructionSystemMasterObjectTemplate2TemplateUIStandardService',
							dataSvc: 'constructionSystemMasterObjectTemplate2TemplateDataService',
							validationSvc: 'constructionSystemObjectTemplateValidationService'
						}, null);
						break;
					case '193e273962d747bc94d4a9c82782e000':// Object Template Property To Templage
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'constructionSystemMasterObjectTemplateProperty2TemplateUIStandardService',
							dataSvc: 'constructionSystemMasterObjectTemplateProperty2TemplateDataService',
							validationSvc: 'constructionSystemMasterGlobalParameterValueValidationService'
						}, null);
						break;
					case 'b74fbd432f7e470194efcfd460e0ff24':// Object Template Property To Templage Detail
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'constructionSystemMasterObjectTemplateProperty2TemplateUIStandardService',
							dataSvc: 'constructionSystemMasterObjectTemplateProperty2TemplateDataService',
							validationSvc: 'constructionSystemMasterGlobalParameterValueValidationService'
						}, null);
						break;
					case '6649459c8df046b3bbaaf3ceec4233fd':// global-param-group
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'constructionSystemMasterGlobalParamGroupUiConfigService',
							dataSvc: 'constructionSystemMasterGlobalParamGroupDataService',
							validationSvc: 'constructionSystemMasterGlobalParamGroupValidationService'
						}, null);
						break;
					case '1f974111b07143ab81bbcaca9aeee6a2':// global-param-group-detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'constructionSystemMasterGlobalParamGroupUiConfigService',
							dataSvc: 'constructionSystemMasterGlobalParamGroupDataService',
							validationSvc: 'constructionSystemMasterGlobalParamGroupValidationService'
						});
						break;
				}
				return config;
			};
			return service;
		}
	]);

})(angular);
