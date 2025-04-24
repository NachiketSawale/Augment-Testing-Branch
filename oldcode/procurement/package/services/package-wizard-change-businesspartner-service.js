/**
 * Created by lcn on 5/15/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.package';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	angular.module(moduleName).factory('procurementPackageWizardChangeBusinessPartnerService',['$q','$http','$translate','procurementPackageDataService','platformDialogService','procurementPackagePackage2HeaderService','basicsLookupdataLookupDescriptorService','procurementCommonGeneralsDataService', '$injector',function ($q,$http,$translate,packageDataService,platformDialogService,procurementPackagePackage2HeaderService,lookupDescriptorService,procurementCommonGeneralsDataService, $injector) {

		var service = {},self = this;

		var single = (function () {
			var unique;

			function initService() {
				if (unique === undefined) {
					procurementCommonGeneralsDataService = procurementCommonGeneralsDataService.getService(procurementPackagePackage2HeaderService);
					unique = 1;
				}
				return unique;
			}

			return {initService: initService};
		})();

		self.handleOk = function (result) {
			single.initService();
			// change subpackage when change structure dialog by package list
			var selected = result.selected;
			var subPackageList = result.subPackageList;
			var originalBusinessPartnerFk = result.OriginalBusinessPartnerFk;
			if (result.IsApplyToSubPackage) {
				var reloadArgs = [];

				if (!subPackageList) {
					return true;
				}
				angular.forEach(subPackageList,function (item) {
					var argsEntity = {};
					argsEntity.MainItemId = item.PrcHeaderEntity.Id;
					argsEntity.OriginalBusinessPartnerFk = originalBusinessPartnerFk;
					argsEntity.BusinessPartnerFk = selected.BusinessPartnerFk;
					reloadArgs.push(argsEntity);
				});
				packageDataService.update().then(function (response) {
					if (response && !_.isEmpty(reloadArgs)) {
						procurementCommonGeneralsDataService.reloadDataByChangeBusinessPartner(reloadArgs).then(function () {
							packageDataService.setSelected({}).then(function () {
								var newEntity = packageDataService.getItemById(selected.Id);
								packageDataService.setSelected(newEntity);
							});
						});
					}
				});

				return true;
			}
		};

		service.execute = function (oldvalue) {
			var selected = packageDataService.getSelected();
			if (!selected || !selected.Id) {
				platformDialogService.showMsgBox('procurement.package.wizard.changeBusinessPartner.warningMsg','procurement.package.wizard.changeBusinessPartner.changeBusinessPartnerFailedTitle','warning');
				return;
			}

			var number,isShowYesNoDialogBody;

			var yesNoDialogBodyText = $translate.instant('procurement.package.wizard.changeBusinessPartner.isApplyMessage').replace('(s)','');

			number = procurementPackagePackage2HeaderService.getList().length || 0;
			var currentlist = procurementPackagePackage2HeaderService.getList().slice(0);

			if (number > 1) {
				isShowYesNoDialogBody = true;
				yesNoDialogBodyText = $translate.instant('procurement.package.wizard.changeBusinessPartner.isApplyMessage').replace('(s)','s');
			} else if (number === 1) {
				isShowYesNoDialogBody = true;
				yesNoDialogBodyText = $translate.instant('procurement.package.wizard.changeBusinessPartner.isApplyMessage').replace('(s)','');
			} else {
				isShowYesNoDialogBody = false;
			}

			if (!isShowYesNoDialogBody) {
				platformDialogService.showMsgBox('procurement.package.wizard.changeBusinessPartner.noSubPackageWarningMsg','procurement.package.wizard.changeBusinessPartner.changeBusinessPartnerFailedTitle','warning');
			} else {
				var modalOptions = {
					headerText: $translate.instant('procurement.package.wizard.changeBusinessPartner.caption'),
					bodyText: yesNoDialogBodyText,
					showYesButton: true, showNoButton: true,
					iconClass: 'ico-question'
				};
				platformDialogService.showDialog(modalOptions)
					.then(function (result) {
						if (result.yes) {
							result.IsApplyToSubPackage = true;
							result.subPackageList = currentlist;
							result.selected = selected;
							result.OriginalBusinessPartnerFk = oldvalue;
							self.handleOk(result);
						}
					});
			}
		};

		function onBusinessPartnerChanged(oldvalue) {
			var items = procurementPackagePackage2HeaderService.getList();
			if (items.length > 0) {
				service.execute(oldvalue);
			}
		}

		packageDataService.onBusinessPartnerFkChanged.register(onBusinessPartnerChanged);

		return service;
	}]);
})(angular);