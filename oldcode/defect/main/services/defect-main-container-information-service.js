/*
 * $Id: project-main-container-information-service.js 426072 2017-03-23 07:23:00Z zos $
 * Copyright (c) RIB Software AG
 */
/* global  */
(function (angular) {

	'use strict';
	var moduleName = 'defect.main';
	var defectMainModule = angular.module(moduleName);
	defectMainModule.factory('defectMainContainerInformationService', ['$injector','basicsCommonContainerInformationServiceUtil',
		function ($injector) {
			var service = {};
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				var layServ = null;
				switch (guid) {

					case '01A52CC968494EACACE7669FB996BC72':
						layServ = $injector.get('defectMainHeaderUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'defectMainHeaderUIStandardService';
						config.dataServiceName = 'defectMainHeaderDataService';
						config.validationServiceName = 'defectMainHeaderElementValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '5C9D46FF418144718F6EAB49825CB86E':// Header Detail
						layServ = $injector.get('defectMainHeaderUIStandardService');
						config.layout = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'defectMainHeaderUIStandardService';
						config.dataServiceName = 'defectMainHeaderDataService';
						config.validationServiceName = 'defectMainHeaderElementValidationService';
						break;
					case 'CF8FBEB95CF24FCF98730A4817241201':// document
						layServ = $injector.get('defectDocumentUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'defectDocumentUIStandardService';
						config.dataServiceName = 'defectDocumentDataService';
						config.validationServiceName ='defectDocumentValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '5B5B35364B3D419BA34E78F664B4234F':// document detail
						layServ = $injector.get('defectDocumentUIStandardService');
						config.layout = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'defectDocumentUIStandardService';
						config.dataServiceName = 'defectDocumentDataService';
						config.validationServiceName ='defectDocumentValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;

					case '623A5C418C5140B6879FF7DE7D106AAE':// checklist
						layServ = $injector.get('defectChecklistUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'defectChecklistUIStandardService';
						config.dataServiceName = 'defectChecklistDataService';
						config.validationServiceName = 'defectChecklistValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;

					case 'ED8CAAA4757A4E618E6B1FCEF27941F9':// section
						layServ = $injector.get('defectSectionUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'defectSectionUIStandardService';
						config.dataServiceName = 'defectSectionDataService';
						config.validationServiceName = 'defectSectionValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;

					case '913B56330DAD4388BBAB12C54A5095BE': // DefectClerkListController
						layServ = $injector.get('defectClerkConfigurationService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'defectClerkConfigurationService';
						config.dataServiceName = 'defectClerkService';
						config.validationServiceName = 'defectClerkValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'A7B3399B76BD47CAA1982394C7A6681D': // defectClerkDetailController
						layServ = $injector.get('defectClerkConfigurationService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'defectClerkConfigurationService';
						config.dataServiceName = 'defectClerkService';
						config.validationServiceName = 'defectClerkValidationService';
						break;
				}
				return config;
			};
			return service;
		}
	]);
})(angular);