/**
 * Created by alm on 23/8/2018.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('procurementCommonUpdateItemPriceService', ['$translate', '$http', 'platformModalService', 'platformWizardDialogService',
		'platformContextService',
		'platformLanguageService',
		'platformDomainService',
		'accounting',
		function ($translate, $http, platformModalService, platformWizardDialogService,
			platformContextService,
			platformLanguageService,
			platformDomainService,
			accounting) {
			var service = {};
			service.materialIds = [];
			service.queryNeutralMaterial = true;
			service.showUpdateItemPriceWizardDialog = function (parentService) {
				var serviceName = parentService.getServiceName();
				var selectedLead = parentService.getSelected();
				if (selectedLead === null) {

					if (serviceName.indexOf('Package') !== -1) {
						platformModalService.showMsgBox($translate.instant('procurement.common.wizard.errorNoSelectOnePackage'), 'Info', 'ico-info');
					} else if (serviceName.indexOf('Requisition') !== -1) {
						platformModalService.showMsgBox($translate.instant('procurement.common.wizard.errorNoSelectOneREQ'), 'Info', 'ico-info');
					} else if (serviceName.indexOf('Contract') !== -1) {
						platformModalService.showMsgBox($translate.instant('procurement.common.wizard.errorNoSelectOneContract'), 'Info', 'ico-info');
					} else if (serviceName.indexOf('Quote') !== -1) {
						platformModalService.showMsgBox($translate.instant('procurement.common.wizard.errorNoSelectOneQuote'), 'Info', 'ico-info');
					}
					return;
				}

				var wzConfig = {
					title$tr$: 'procurement.common.wizard.updateItemPrice.title',
					steps: [{
						id: 'baseUpdateOption',
						disallowBack: false,
						disallowNext: false,
						canFinish: false
					}, {
						id: 'updatePrice',
						disallowBack: false,
						disallowNext: false,
						canFinish: true
					}]
				};
				platformWizardDialogService.translateWizardConfig(wzConfig);

				var modalOptions = {
					templateUrl: globals.appBaseUrl + 'procurement.common/partials/wizard/update-item-price.html',
					resizeable: true,
					width: '800px',
					value: {
						wizard: wzConfig,
						parentService: parentService,
						wizardName: 'wzdlg'
					},
					showOKButton: true
				};

				parentService.update().then(function () {

					platformModalService.showDialog(modalOptions);

				});

			};
			service.catalogId = null;
			service.setTempData = function (data) {
				service.catalogId = data;
				/*
            _.forEach(data,function(item){
                service.tempPriceCondition.push({Id:item.Id,Description:item.DescriptionInfo.Translated,PriceListFk:item.PriceListFk});
            });
            */
			};

			service.getUpdateItem = function (matchItems) {

				return $http.post(globals.webApiBaseUrl + 'basics/common/historicalprice/prcitem', matchItems);
			};
			service.refreshUpdateItem = function (matchItems) {

				return $http.post(globals.webApiBaseUrl + 'procurement/common/UpdateItemPrice/refreshUpdateItem', matchItems);
			};
			service.goUpdateItem = function (gridData) {
				return $http.post(globals.webApiBaseUrl + 'procurement/common/UpdateItemPrice/updatePrcItemPrice', gridData);
			};

			service.formatterMoneyType = function formatterMoneyType(entity, field) {

				var culture = platformContextService.culture(),
					cultureInfo = platformLanguageService.getLanguageInfo(culture),
					domainInfo = platformDomainService.loadDomain('money');
				if (!entity) {
					return accounting.formatNumber(0, domainInfo.precision, cultureInfo[domainInfo.datatype].thousand, cultureInfo[domainInfo.datatype].decimal);
				}
				var displayValue = entity[field];
				if (_.isNumber(displayValue)) {
					return accounting.formatNumber(displayValue, domainInfo.precision, cultureInfo[domainInfo.datatype].thousand, cultureInfo[domainInfo.datatype].decimal);
				} else {
					return displayValue;
				}
			};

			return service;
		}]);

})(angular);