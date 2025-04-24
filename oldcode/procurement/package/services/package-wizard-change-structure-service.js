(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.package').factory('procurementPackageWizardChangeStructureService',
		['$q', '$http', '$translate', 'procurementPackageDataService', 'platformDialogService', 'procurementPackagePackage2HeaderService', 'basicsLookupdataLookupDescriptorService',
			'procurementCommonGeneralsDataService', 'procurementCommonCertificateNewDataService', 'procurementContextService', 'procurementCommonTotalDataService', '$injector','platformDataServiceModificationTrackingExtension',
			function ($q, $http, $translate, packageDataService, platformDialogService, procurementPackagePackage2HeaderService, lookupDescriptorService,
				procurementCommonGeneralsDataService, procurementCommonCertificateDataService, moduleContext, procurementCommonTotalDataService, $injector,platformDataServiceModificationTrackingExtension) {

				var service = {}, self = this;
				var _isUpdateSubListDescription, _id, _value;

				var single = (function () {
					var unique;

					function initService() {
						if (unique === undefined) {
							procurementCommonGeneralsDataService = procurementCommonGeneralsDataService.getService(procurementPackagePackage2HeaderService);
							procurementCommonCertificateDataService = procurementCommonCertificateDataService.getService(procurementPackagePackage2HeaderService);
							procurementCommonTotalDataService = procurementCommonTotalDataService.getService();
							unique = 1;
						}
						return unique;
					}

					return {initService: initService};
				})();

				self.UpdateSubListDescription = function UpdateSubListDescription(id, value) {
					var url = globals.webApiBaseUrl + 'procurement/package/prcpackage2header/updatesublistdescription';
					return $http({
						method: 'GET',
						url: url,
						params: {
							prcPackage: id,
							description: value === null ? '' : value
						}
					});
				};

				self.handleOk = function (result) {

					single.initService();
					// change subpackage when change structure dialog by package list
					var selected = result.selected;
					var subPackageList = result.subPackageList;
					if (result.IsApplyToSubPackage) {
						var reloadArgs = [];
						if (!subPackageList) {
							return true;
						}
						var netTotalItem = procurementCommonTotalDataService.getNetTotalItem();
						var netTotal = 0;
						if (netTotalItem && netTotalItem.ValueNet) {
							netTotal = netTotalItem.ValueNet;
						}
						angular.forEach(subPackageList, function (item) {
							var argsEntity = {};
							argsEntity.SubPackageId = item.Id;
							argsEntity.MainItemId = item.PrcHeaderEntity.Id;
							argsEntity.OriginalStructureFk = item.PrcHeaderEntity.StructureFk;
							argsEntity.OriginalConfigurationFk = item.PrcHeaderEntity.ConfigurationFk;
							argsEntity.MdcControllingunitFk = item.MdcControllingUnitFk;
							argsEntity.MdcTaxCodeFk = selected.TaxCodeFk;
							argsEntity.StructureFk = selected.StructureFk;
							argsEntity.ConfigurationFk = item.PrcHeaderEntity.ConfigurationFk;
							argsEntity.ProjectFk = item.ProjectFk || moduleContext.loginProject;
							argsEntity.NetTotal = netTotal;
							if (argsEntity.MdcTaxCodeFk <= 0) {
								argsEntity.MdcTaxCodeFk = null;
							}

							reloadArgs.push(argsEntity);
						});

						let packageUpdatedata = platformDataServiceModificationTrackingExtension.getModifications(packageDataService);
						if(packageUpdatedata){
							platformDataServiceModificationTrackingExtension.markAsModified(packageDataService, selected, packageDataService.getContainerData());
						}

						packageDataService.update().then(function (response) {
							$http.post(globals.webApiBaseUrl + 'procurement/package/package/updateHeaderAndChildTaxCode', { MainItemId: selected.Id }).then(function () {
								if (response && !_.isEmpty(reloadArgs)) {
									procurementCommonGeneralsDataService.reloadDataByChangeStructure(reloadArgs).then(function (data) {
										if (_isUpdateSubListDescription) {
											self.UpdateSubListDescription(_id, _value).then(function () {
												if (data) {
													// Here we need to return a promise,so we use setSelected function
													packageDataService.setSelected(null).then(function () {
															var newEntity = packageDataService.getItemById(selected.Id);
															packageDataService.setSelected(newEntity);
														}
													);
												}
											});
										} else {
											if (data) {
												// Here we need to return a promise,so we use setSelected function
												packageDataService.setSelected({}).then(function () {
														var newEntity = packageDataService.getItemById(selected.Id);
														packageDataService.setSelected(newEntity);
													}
												);
											}
										}
									});
								} else {
									if (_isUpdateSubListDescription) {
										self.UpdateSubListDescription(_id, _value);
									}
								}
							})
						});

						return true;
					}
				};

				service.execute = function () {
					var selected = packageDataService.getSelected();
					if (!selected || !selected.Id) {
						platformDialogService.showMsgBox('procurement.package.wizard.changeStructure.warningMsg', 'procurement.package.wizard.changeStructure.changeStructureFailedTitle', 'warning');
						return;
					}

					var number,
						isShowYesNoDialogBody;

					var yesNoDialogBodyText = $translate.instant('procurement.package.wizard.changeStructure.isApplyBoqAndItemMessage');

					number = procurementPackagePackage2HeaderService.getList().length || 0;
					var currentlist = procurementPackagePackage2HeaderService.getList().slice(0);

					if (number >= 1) {
						isShowYesNoDialogBody = true;
					} else {
						isShowYesNoDialogBody = false;
					}

					if (!isShowYesNoDialogBody) {
						platformDialogService.showMsgBox('procurement.package.wizard.changeStructure.noSubPackageWarningMsg', 'procurement.package.wizard.changeStructure.changeStructureFailedTitle', 'warning');
					} else {
						var modalOptions = {
							headerText: $translate.instant('procurement.package.wizard.changeStructure.caption'),
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
									self.handleOk(result);
								} else {
									if (_isUpdateSubListDescription) {
										packageDataService.update().then(function () {
											self.UpdateSubListDescription(_id, _value).then(function () {
												packageDataService.setSelected(null).then(function () {
													var newEntity = packageDataService.getItemById(selected.Id);
													packageDataService.setSelected(newEntity);
												}
												);

											});
										});
									}
								}
							});
					}
				};

				function onStructureChanged(isUpdateSubListDescription, _structureData) {
					var items = procurementPackagePackage2HeaderService.getList();

					if (items.length > 0) {
						_isUpdateSubListDescription = isUpdateSubListDescription;
						if (_isUpdateSubListDescription) {
							_id = _structureData.id;
							_value = _structureData.value;
						}
						service.execute();
					}
				}

				packageDataService.onStructureFkChanged.register(onStructureChanged);

				return service;
			}]);
})(angular);
