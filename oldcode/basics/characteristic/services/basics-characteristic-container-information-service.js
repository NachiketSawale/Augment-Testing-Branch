/**
 * Created by xsi on 2016-07-21.
 */
(function(angular) {
	'use strict';
	var moduleName = 'basics.characteristic';
	angular.module(moduleName).factory('basicsCharacteristicContainerInformationService', [
		'basicsCommonContainerInformationServiceUtil',
		function (containerInformationServiceUtil) {
			var service = {};
			/* jshint -W074 */
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				switch (guid) {
					case '2565A90A68984456BB7A62D701271A9F'://Characteristics
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc : 'basicsCharacteristicCharacteristicUIStandardService',
							dataSvc : 'basicsCharacteristicCharacteristicService',
							validationSvc : 'basicsCharacteristicCharacteristicValidationService'
						});
						break;
					case 'A5F523F960624768AE9E31A28E378DC8'://Characteristic Detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc : 'basicsCharacteristicCharacteristicUIStandardService',
							dataSvc : 'basicsCharacteristicCharacteristicService',
							validationSvc : 'basicsCharacteristicCharacteristicValidationService'
						});
						break;
					case '26CC2D8AFD3B433DAA2532B9D7F59A29'://Automatic Assignment
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc : 'basicsCharacteristicAutomaticAssignmentUIStandardService',
							dataSvc : 'basicsCharacteristicAutomaticAssignmentService'
						});
						break;
					case '5E5CFB298FFF4205ADAB8FB696AC91EC'://Characteristic Groups
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc : 'basicsCharacteristicGroupUIStandardService',
							dataSvc : 'basicsCharacteristicMainService',
							validationSvc : 'basicsCharacteristicGroupValidationService'
						});
						break;
					case '7F2DD4CCA7284D4B9870E1AB25F21534'://Characteristic Group Detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc : 'basicsCharacteristicGroupUIStandardService',
							dataSvc : 'basicsCharacteristicMainService',
							validationSvc : 'basicsCharacteristicGroupValidationService'
						});
						break;
					case '49CB8879815B4BE88C8D6EDE1EB52AD0'://Characteristic Sections
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc : 'basicsCharacteristicSectionUIStandardService',
							dataSvc : 'basicsCharacteristicSectionService'
						});
						break;
					case '0D48F09CF87A496CA0A1766819DD62E7'://Characteristic Section Detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc : 'basicsCharacteristicSectionUIStandardService',
							dataSvc : 'basicsCharacteristicSectionService'
						});
						break;
					case 'CF5649D049F44340B93768232E4A911E'://Discrete Values
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc : 'basicsCharacteristicDiscreteValueUIStandardService',
							dataSvc : 'basicsCharacteristicDiscreteValueService',
							validationSvc : 'basicsCharacteristicDiscreteValueValidationService'
						});
						break;
					case '11FDD68F0D3948749FDF3AC6F1972401'://Discrete Value Detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc : 'basicsCharacteristicDiscreteValueUIStandardService',
							dataSvc : 'basicsCharacteristicDiscreteValueService',
							validationSvc : 'basicsCharacteristicDiscreteValueValidationService'
						});
						break;
					case '4307455A185A4D1D84DA91ECEC793EBB'://Used In company
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc : 'basicsCharacteristicUsedInCompanyUIStandardService',
							dataSvc : 'basicsCharacteristicUsedInCompanyService'
						});
						break;
				}
				return config;
			};
			return service;
		}
	]);

})(angular);