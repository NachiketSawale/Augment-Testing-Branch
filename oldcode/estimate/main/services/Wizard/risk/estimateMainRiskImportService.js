/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals */
	let moduleName = 'estimate.main';

	/*
	* @ngdoc service
	* @name estimateMainRiskImportService
	* @requires $q
	* @description main service for risk import wizard
	* */

	angular.module(moduleName).factory('estimateMainRiskImportService',
		[ '$q', '$http','$injector',
			'platformDialogService',
			'estimateMainWizardContext',
			'estimateMainRiskImportWizardController',
			function (
				$q,$http,$injector,
				platformDialogService,
				estimateMainWizardContext,
				estimateMainRiskImportWizardController) {
				let service = {};

				let modalOptions = {
					templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/risk/estimate-main-risk-import-wizard.html',
					controller:[
						'$scope','$injector','cloudDesktopPinningContextService',
						'$translate', 'platformGridAPI', 'platformContextService',
						'basicsRiskRegisterUIConfigurationService','basicsRiskRegisterDataService','estimateMainService',
						'estimateMainWizardContext',estimateMainRiskImportWizardController
					],
					backdrop: false,
					windowClass: 'form-modal-dialog',
					width: '700px',
					resizeable: true
				};
				service.showImportRiskWizardDialog = function () {
					platformDialogService.showDialog(modalOptions);
				};

				return service;
			}]);})(angular);
