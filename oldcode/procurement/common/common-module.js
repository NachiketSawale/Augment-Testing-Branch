// / <reference path='../help/10_angular/angular.js' />

// eslint-disable-next-line no-redeclare
/* global angular,globals */

(function (angular) {
	'use strict';

	/*
	 ** procurement.requisition module is created.
	 */
	var moduleName = 'procurement.common';

	angular.module('cloud.desktop').factory('procurementCommonDeleteErrorInterceptor', procurementCommonDeleteErrorInterceptor);
	procurementCommonDeleteErrorInterceptor.$inject = ['$q', 'globals', '$injector'];

	function procurementCommonDeleteErrorInterceptor($q, globals, $injector) {

		let selectionDeleteUrls = [
			'package/package/deletepackage',
			'contract/header/deletecontract',
			'invoice/header/deleteinv',
			'pes/header/deletepes',
			'quote/header/deleteqtn',
			'requisition/requisition/deleterequisition',
			'rfq/header/deleterfq'
		];
		/**
		 * This function handles error messages force by the backend server.
		 * The error will be forwarded as Platform message 'onHttpError' containing error data
		 * @param rejection
		 * @returns {Promise}
		 */
		function responseError(rejection) {
			if (rejection.status !== 401 && rejection.status !== -1) {  // authentication error handle by autothentication library and canceled promise (-1)
				// suppress fire error event for i18n json files
				if (rejection && rejection.config && rejection.config.url) {
					let url = rejection.config.url;
					let procurementModule = _.filter(selectionDeleteUrls, function(item){
						if (url.indexOf(item) >= 0){
							return true;
						}
					});
					if (procurementModule && procurementModule.length > 0 && url.indexOf('/i18n/') === -1) {
						if (rejection.config.headers.errorDialog === undefined || rejection.config.headers.errorDialog === true) {
							var procurementCommonDialogService = $injector.get('procurementCommonDialogService');
							if (rejection.data === '') {
								rejection.data = {
									ErrorMessage: 'http-status: ' + rejection.status + ' ' + rejection.statusText,
									MessageDetail: 'url: ' + url,
									ErrorDetail: 'url: ' + url
								};
							}
							// dialogService.showErrorDialog(rejection.data);
							return procurementCommonDialogService.showErrorDialog(rejection.data).then(function () {
								rejection.status = -1;
								return $q.reject(rejection);
							});
						}
					}
				}
			}
			return $q.reject(rejection);
		}

		return {
			responseError: responseError
		};
	}

	angular.module(moduleName, ['ui.router', 'platform', 'basics.material', 'basics.lookupdata', 'cloud.common', 'wysiwyg.module']); // jshint ignore:line
	globals.modules.push(moduleName);

	angular.module(moduleName).config(['mainViewServiceProvider', '$httpProvider', function (platformLayoutService,$httpProvider) {
		$httpProvider.interceptors.push('procurementCommonDeleteErrorInterceptor');
		let options = {
			'moduleName': moduleName,
			'resolve': {
				'loadDomains': ['platformSchemaService', 'resourceEquipmentConstantValues', function (platformSchemaService) {

					return platformSchemaService.getSchemas([
						{typeName: 'PrcPackageDto', moduleSubModule: 'Procurement.Package'},
						{typeName: 'PrcDocumentDto', moduleSubModule: 'Procurement.Common'},
						{typeName: 'ReqHeaderDto', moduleSubModule: 'Procurement.Requisition'},
						{typeName: 'RfqHeaderDto', moduleSubModule: 'Procurement.RfQ'},
						{typeName: 'QuoteHeaderDto', moduleSubModule: 'Procurement.Quote'},
						{typeName: 'ConHeaderDto', moduleSubModule: 'Procurement.Contract'},
						{typeName: 'PrcInventoryHeaderDto', moduleSubModule: 'Procurement.Inventory'}
					]);
				}],

				'loadLookup': ['basicsLookupdataLookupDefinitionService', function (basicsLookupdataLookupDefinitionService) {
					return basicsLookupdataLookupDefinitionService.load([
						'businessPartnerMainSupplierLookup',
						'businessPartnerMainSupplierDialog']);
				}],
				// needed to install listener for parent-service create event (even when characteristic container ist not activated)
				'initCharacteristicDataService': ['basicsCharacteristicDataServiceFactory', 'procurementPesHeaderService',
					function (basicsCharacteristicDataServiceFactory, procurementPesHeaderService) {
						basicsCharacteristicDataServiceFactory.getService(procurementPesHeaderService, 20);
					}
				],
				'loadSystemOption':['basicCustomizeSystemoptionLookupDataService', function(basicCustomizeSystemoptionLookupDataService) {
					basicCustomizeSystemoptionLookupDataService.getList();
				}],
				'registerWizards': ['basicsConfigWizardSidebarService','procurementContextService', function (wizardService,moduleContext) {

					var wizardData = [
						{
							serviceName: moduleContext,
							wizardGuid: '2BFCF68F2CF44CE3ACA66EA7E5716A37',
							methodName: 'changeProcurementDocumentStatus',
							canActivate: true
						}
					];
					wizardService.registerWizard(wizardData);
				}],
				'loadPermissions': ['platformPermissionService', function (platformPermissionService) {
					return platformPermissionService.loadPermissions([
						'4eaa47c530984b87853c6f2e4e4fc67e',
						'f86aa473785b4625adcabc18dfde57ac'
					]);
				}]
			}
		};
		platformLayoutService.registerModule(options);
	}]).run(['platformTranslateService','basicsConfigWizardSidebarService','_','platformSidebarWizardDefinitions',
		function (platformTranslateService,wizardService,_,platformSidebarWizardDefinitions) {
			var wizardData = _.concat([{
				serviceName: 'procurementCommonWizardService',
				wizardGuid: '2BFCF68F2CF44CE3ACA66EA7E5716A37',
				methodName: 'changeProcurementDocumentStatus',
				canActivate: true
			}],platformSidebarWizardDefinitions.model.sets.default);
			wizardService.registerWizard(wizardData);
			platformTranslateService.registerModule(moduleName);
		}
	]);

	/** fixed warning */
	/** @namespace $scope.subviewCtrl */
	/** @namespace newVal.Id */
	/** @namespace newVal.BoqRootItem */
	/** @namespace oldVal.Id */
	/** @namespace oldVal.BoqRootItem */
	/** @namespace targetData[value].IsPercent */
	/** @namespace selected.PrcBoq */
	/** @namespace deleteParams.entity.BoqHeader */
	/** @namespace deleteParams.entity.PrcBoq */
	/** @namespace updateData.PrcBoqExtended */
	/** @namespace state.Isreadonly */
	/** @namespace parentItem.PrcHeaderEntity */
	/** @namespace data.IsPercent */
	/** @namespace dataItem.Icon */
	/** @namespace selectedItem.ReqHeaderEntity */
	/** @namespace response.Recalculate */
	/** @namespace item.IdReal */

})(angular);