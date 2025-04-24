/**
 * Created by jes on 12/21/2016.
 */

(function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).factory('constructionSystemMainApplyLineItemToEstimateWizardService', constructionSystemMainApplyLineItemToEstimateWizardService);

	constructionSystemMainApplyLineItemToEstimateWizardService.$inject = [
		'_',
		'$http',
		'$translate',
		'platformModalService',
		'constructionSystemMainInstanceService',
		'constructionSystemMainJobDataService'
	];

	function constructionSystemMainApplyLineItemToEstimateWizardService(
		_,
		$http,
		$translate,
		platformModalService,
		constructionSystemMainInstanceService,
		constructionSystemMainJobDataService
	) {
		let service = {};

		let defaultValue = {
			overwrite: 'false',
			isUpdate: 'true',
			updateQuantity: false,
			updatePrice: false,
			keepResourcePackageAssignment: true,
			doNotUpdateResIfCosResIsNull: true
		};

		let modalOptions = {
			headerTextKey: 'constructionsystem.main.applyOptions',
			showOkButton: true,
			showCancelButton: true,
			iconClass: 'ico-question',
			templateUrl: globals.appBaseUrl + 'constructionsystem.main/partials/apply-line-item-to-estimate-wizard-options.html',
			defaultValue: defaultValue,
			model: _.clone(defaultValue)
		};

		let applySubFn = function () {
			let checkedInstances = _.filter(constructionSystemMainInstanceService.getList(), {IsChecked: true});
			if (checkedInstances.length > 0) {
				let requestParam = {
					InsHeaderId: checkedInstances[0].InstanceHeaderFk,
					InstanceIds: _.map(checkedInstances, function (item) {
						return item.Id;
					}),
					Options: {
						Overwrite: modalOptions.model.overwrite === 'true',
						IsUpdate: modalOptions.model.isUpdate === 'true',
						UpdateQuantity: modalOptions.model.updateQuantity,
						UpdatePrice: modalOptions.model.updatePrice,
						KeepResPkgAssignment: modalOptions.model.keepResourcePackageAssignment,
						DoNotUpdateResIfCosResIsNull: modalOptions.model.doNotUpdateResIfCosResIsNull
					}
				};

				$http.post(globals.webApiBaseUrl + 'constructionsystem/main/lineitem/apply', requestParam)
					.then(function (response) {
						// ask user to uncheck the instances with no line items
						let ids = _.isArray(response.data.InstanceIds) ? response.data.InstanceIds : [];
						let splitIds = _.isArray(response.data.SplitInstanceIds) ? response.data.SplitInstanceIds : [];
						let totalIds = ids.concat(splitIds);

						if (totalIds.length > 0) {
							let list = constructionSystemMainInstanceService.getList();
							let instances = _.filter(list, function (item) {
								return totalIds.indexOf(item.Id) !== -1;
							});
							let options = {
								headerTextKey: 'constructionsystem.main.noLineItemError',
								showOkButton: true,
								showCancelButton: true,
								bodyTemplateUrl: globals.appBaseUrl + 'constructionsystem.main/partials/construction-system-instance-info.html',
								message: $translate.instant('constructionsystem.main.applyQuestion'),
								instances: instances
							};
							platformModalService.showDialog(options).then(function (checkResult) {
								if (checkResult.ok) {
									let lineItemList = _.filter(checkedInstances, function (item) {
										return (totalIds.indexOf(item.Id) === -1);
									});
									let checkRequestParam = {
										InsHeaderId: requestParam.InsHeaderId,
										InstanceIds: _.map(lineItemList, function (item) {
											return item.Id;
										}),
										Options: {
											Overwrite: modalOptions.model.overwrite === 'true',
											IsUpdate: modalOptions.model.isUpdate === 'true',
											UpdateQuantity: modalOptions.model.updateQuantity,
											UpdatePrice: modalOptions.model.updatePrice,
											KeepResPkgAssignment: modalOptions.model.keepResourcePackageAssignment,
											DoNotUpdateResIfCosResIsNull: modalOptions.model.doNotUpdateResIfCosResIsNull
										},
										SplitInstanceIds: splitIds
									};
									$http.post(globals.webApiBaseUrl + 'constructionsystem/main/lineitem/apply', checkRequestParam)
										.then(function (response) {
											if (response.data.CosJob) {
												constructionSystemMainJobDataService.createApplyLineItemJob(response.data.CosJob);
											}
										});
								}
							});
						} else {
							/** @namespace response.data.CosJob */
							if (response.data.CosJob) {
								constructionSystemMainJobDataService.createApplyLineItemJob(response.data.CosJob);
							}
						}
					});
			} else {
				platformModalService.showMsgBox('No instance checked', 'Info', 'ico-info');
			}
		};

		service.apply = function apply() {
			platformModalService.showDialog(modalOptions).then(function (result) {
				if (result.ok) {
					if (modalOptions.model.overwrite === 'true') {
						platformModalService.showYesNoDialog('constructionsystem.main.applyOverwriteQuestion', 'constructionsystem.main.applyOverwriteTitle', 'no').then(function (result) {
							if (result.yes) {
								applySubFn();
							}
						});
					} else if (modalOptions.model.isUpdate === 'true' || modalOptions.model.updateQuantity || modalOptions.model.updatePrice) {
						applySubFn();
					}
				}
			});
		};

		service.applyCheckedInstancesInstances = function applyCheckedInstancesInstances(checkedInstances) {
			if (checkedInstances.length > 0) {
				let requestParam = {
					InsHeaderId: checkedInstances[0].InstanceHeaderFk,
					InstanceIds: _.map(checkedInstances, function (item) {
						return item.Id;
					}),
					Options: {
						Overwrite: modalOptions.model.overwrite === 'true',
						UpdateQuantity: modalOptions.model.updateQuantity,
						UpdatePrice: modalOptions.model.updatePrice,
						KeepResPkgAssignment: modalOptions.model.keepResourcePackageAssignment,
						DoNotUpdateResIfCosResIsNull: modalOptions.model.doNotUpdateResIfCosResIsNull
					}
				};

				$http.post(globals.webApiBaseUrl + 'constructionsystem/main/lineitem/apply', requestParam)
					.then(function (response) {
						// ask user to uncheck the instances with no line items
						let ids = _.isArray(response.data.InstanceIds) ? response.data.InstanceIds : [];
						if (ids.length > 0) {
							let list = constructionSystemMainInstanceService.getList();
							let instances = _.filter(list, function (item) {
								return _.find(ids, function (id) {
									return id === item.Id;
								});
							});
							let options = {
								headerTextKey: 'constructionsystem.main.noLineItemError',
								showOkButton: true,
								showCancelButton: true,
								bodyTemplateUrl: globals.appBaseUrl + 'constructionsystem.main/partials/construction-system-instance-info.html',
								message: $translate.instant('constructionsystem.main.calculateLineItem'),
								instances: instances
							};
							platformModalService.showDialog(options);
						} else {
							/** @namespace response.data.CosJob */
							if (response.data.CosJob) {
								constructionSystemMainJobDataService.createApplyLineItemJob(response.data.CosJob);
							}
						}
					});
			} else {
				platformModalService.showMsgBox('No instance checked', 'Info', 'ico-info');
			}
		};

		return service;
	}

})(angular, globals);