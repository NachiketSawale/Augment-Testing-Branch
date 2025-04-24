/**
 * Created by xsi on 2016-07-13.
 */
(function(angular) {
	'use strict';
	let moduleName = 'businesspartner.evaluationschema';
	angular.module(moduleName).factory('businesspartnerEvaluationschemaContainerInformationService', [
		'basicsCommonContainerInformationServiceUtil',
		function (containerInformationServiceUtil) {
			let service = {};

			/* jshint -W074 */
			service.getContainerInfoByGuid = function (guid) {
				let config = {};
				switch (guid) {
					case '6003E88EB8734DA693F6FBB8DBEE621E':// Schemas
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'businessPartnerEvaluationschemaHeaderUIStandardService',
							dataSvc: 'businesspartnerEvaluationschemaHeaderService',
							validationSvc: 'businesspartnerEvaluationschemaHeaderValidationService'
						}, null);
						break;
					case 'EA75E48752624F3389ECC286EDE0F763':// Schemas Detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'businessPartnerEvaluationschemaHeaderUIStandardService',
							dataSvc: 'businesspartnerEvaluationschemaHeaderService',
							validationSvc: 'businesspartnerEvaluationschemaHeaderValidationService'
						});
						break;
					case 'D6320711B95D403199AD36BCC9B2BE12':// Groups
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'businessPartnerEvaluationSchemaGroupUIStandardService',
							dataSvc: 'businessPartnerEvaluationSchemaGroupService',
							validationSvc: 'businessPartnerEvaluationschemaGroupValidationService'
						}, null);
						break;
					case 'F89D0A40D28D475481656124683F757C':// Group Detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'businessPartnerEvaluationSchemaGroupUIStandardService',
							dataSvc: 'businessPartnerEvaluationSchemaGroupService',
							validationSvc: 'businessPartnerEvaluationschemaGroupValidationService'
						});
						break;
					case '25B798025AE0458EB34A5249101C428C':// Group Icons
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'businessPartnerEvaluationSchemaGroupIconUIStandardService',
							dataSvc: 'businessPartnerEvaluationschemaGroupIconService',
							validationSvc: 'businessPartnerEvaluationschemaGroupIconValidationService'
						}, null);
						break;
					case '84B6893D227C42C2BA2275B15EF12C78':// Group Icon Detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'businessPartnerEvaluationSchemaGroupIconUIStandardService',
							dataSvc: 'businessPartnerEvaluationschemaGroupIconService',
							validationSvc: 'businessPartnerEvaluationschemaGroupIconValidationService'
						});
						break;
					case 'C57FBC4EB15844D0A29B6361BC131941':// Items
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'businessPartnerEvaluationSchemaItemUIStandardService',
							dataSvc: 'businessPartnerEvaluationSchemaItemService',
							validationSvc: 'businessPartnerEvaluationschemaItemValidationService'
						}, null);
						break;
					case '55C26AA6A9834F57B3089439CA49A6A6':// Item Detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'businessPartnerEvaluationSchemaItemUIStandardService',
							dataSvc: 'businessPartnerEvaluationSchemaItemService',
							validationSvc: 'businessPartnerEvaluationschemaItemValidationService'
						});
						break;
					case '85E27C1F72D041F38215EE8478CE6EA3':// Schema Icons
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'businessPartnerEvaluationschemaIconUIStandardService',
							dataSvc: 'businesspartnerEvaluationschemaIconService',
							validationSvc: 'businesspartnerEvaluationschemaIconValidationService'
						}, null);
						break;
					case 'FF3D3400CC6949DCB9D55E09C6762062':// Schema Icons Detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'businessPartnerEvaluationschemaIconUIStandardService',
							dataSvc: 'businesspartnerEvaluationschemaIconService',
							validationSvc: 'businesspartnerEvaluationschemaIconValidationService'
						});
						break;
					case 'D252A6F857A84387A1E20ABBC7DB588B':// Subgroups
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'businessPartnerEvaluationSchemaSubgroupUIStandardService',
							dataSvc: 'businessPartnerEvaluationSchemaSubgroupService',
							validationSvc: 'businessPartnerEvaluationschemaSubgroupValidationService'
						}, null);
						break;
					case '8D56FFA82E6144379648CF32D1A6D856':// Subgroups Detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'businessPartnerEvaluationSchemaSubgroupUIStandardService',
							dataSvc: 'businessPartnerEvaluationSchemaSubgroupService',
							validationSvc: 'businessPartnerEvaluationschemaSubgroupValidationService'
						});
						break;
				}
				return config;
			};
			return service;
		}

	]);

})(angular);
