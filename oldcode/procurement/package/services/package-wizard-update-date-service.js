/**
 * Created by wwa on 9/23/2016.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.package').factory('procurementPackageWizardUpdateDateService',
		['$q', '$http', '$translate', 'procurementPackageDataService', 'platformModalService',
			function ($q, $http, $translate, packageDataService, platformModalService) {

				var service = {}, self = this;

				function handleUpdateDateResult(result){
					var bodyText = '';
					var isUpdated = result.IsUpdated;
					/** @namespace result.UpdatedCount */
					var updatedCount = result.UpdatedCount;
					if(!isUpdated){
						bodyText = $translate.instant('procurement.package.wizard.updateDate.noActivity');
					} else if (updatedCount === 0) {
						bodyText = $translate.instant('procurement.package.wizard.updateDate.notUpdate');
						isUpdated = false;
					} else if (updatedCount === 1) {
						bodyText = $translate.instant('procurement.package.wizard.updateDate.bodyTextKey')
							.replace('(qty)', updatedCount).replace('(s)', '');
					} else {
						bodyText = $translate.instant('procurement.package.wizard.updateDate.bodyTextKey')
							.replace('(qty)', updatedCount).replace('(s)', 's');
					}

					if (isUpdated){
						packageDataService.refresh().then(function(data){
							packageDataService.setSelected({}).then(function () {
								packageDataService.setSelected( _.find(data, {Id: result.MainItemId}));
							});
						});
					}
					platformModalService.showDialog({
						headerTextKey: 'cloud.common.informationDialogHeader',
						bodyTextKey: bodyText,
						showOkButton: true,
						iconClass: 'ico-info'
					});
				}

				function updateDateFromActivity(result) {
					var updatedList = null;
					if (!result.isUpdateAll){// for update current container items
						updatedList = _.filter(packageDataService.getList(), function(item){
							return item.ActivityFk && packageDataService.checkIfCurrentLoginCompany(item);
						});
						if (updatedList.length === 0){
							return handleUpdateDateResult({IsUpdated: false});
						}
					}
					$http.post(globals.webApiBaseUrl + 'procurement/package/wizard/updatedate', {
						mainItemId: packageDataService.getSelected() ? packageDataService.getSelected().Id : -1,
						isUpdateAll: result.isUpdateAll,
						containerListIds: updatedList ? _.map(updatedList,'Id') : []
					}).then(function (res){
						handleUpdateDateResult(res.data);
					});

				}

				self.handleOk = function (result) {
					updateDateFromActivity(result);
				};

				service.execute = function () {

					var modalOptions = {
						headerTextKey: 'procurement.package.wizard.updateDate.caption',
						bodyTextKey: 'procurement.package.wizard.updateDate.bodyTitle',
						templateUrl: globals.appBaseUrl + 'procurement.package/partials/update-date-wizard-partial.html',
						// iconClass: 'ico-question',
						showCancelButton: true
					};

					platformModalService.showDialog(modalOptions).then(function (result) {
						if (result) {
							self.handleOk(result);
						}
					});
				};

				return service;
			}]);
})(angular);