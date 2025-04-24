(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	angular.module('procurement.common').factory('procurementCommonCreateService',
		['$injector', '$translate', 'basicsLookupdataLookupDataService', '$q',
			function ($injector, $translate, basicsLookupdataLookupDataService, $q) {


				function init(_moduleName, $scope) {
					if ($scope.currentSerivce) {
						if (_moduleName === 'procurement.contract') {
							$scope.currentSerivce.RubricFk = 26;
							$scope.currentSerivce.ValidationService = $injector.get('contractHeaderElementValidationService');
							$scope.currentSerivce.filterKey = 'prc-con-configuration-filter';
							$scope.currentSerivce.IsContract = true;
							$scope.currentSerivce.moduleName = $translate.instant('procurement.common.createmodule.contract');
						}
						if (_moduleName === 'procurement.requisition') {
							$scope.currentSerivce.RubricFk = 23;
							$scope.currentSerivce.ValidationService = $injector.get('procurementRequisitionHeaderValidationService');
							$scope.currentSerivce.filterKey = 'prc-req-configuration-filter';
							$scope.currentSerivce.moduleName = $translate.instant('procurement.common.createmodule.requisition');
						}
						$scope.currentSerivce.IsDefault = ' And IsDefault = true';
						return getDefault($scope);
					}
					return $q.when(false);
				}

				function getDefault($scope) {
					if ($scope.currentSerivce && $scope.currentSerivce.ValidationService && angular.isFunction($scope.currentSerivce.ValidationService.validateDialogBusinessPartnerFk)) {
						$scope.currentSerivce.ValidationService.validateDialogBusinessPartnerFk($scope.currentItem, null);
					}
					// get default configuration
					return basicsLookupdataLookupDataService.getSearchList('PrcConfiguration', 'RubricFk = ' + $scope.currentSerivce.RubricFk + $scope.currentSerivce.IsDefault).then(function (result) {
						if (result && result[0]) {
							$scope.currentItem.ConfigurationFk = result[0].Id;
						}
						if (angular.isFunction($scope.currentSerivce.ValidationService.validateDialogConfigurationFk)) {
							$scope.currentSerivce.ValidationService.validateDialogConfigurationFk($scope.currentItem, $scope.currentItem.ConfigurationFk);
						} else if (angular.isFunction($scope.currentSerivce.ValidationService.asyncValidateDialogConfigurationFk)) {
							$scope.currentSerivce.ValidationService.asyncValidateDialogConfigurationFk($scope.currentItem, $scope.currentItem.ConfigurationFk);
						}
					});


				}


				function getFormConfigForDialog($scope) {

					let validateConfigurationFkFn = _.noop;
					if ($scope.currentSerivce && $scope.currentSerivce.ValidationService) {
						if (angular.isFunction($scope.currentSerivce.ValidationService.validateDialogConfigurationFk)) {
							validateConfigurationFkFn = $scope.currentSerivce.ValidationService.validateDialogConfigurationFk;
						} else if (angular.isFunction($scope.currentSerivce.ValidationService.asyncValidateDialogConfigurationFk)) {
							validateConfigurationFkFn = $scope.currentSerivce.ValidationService.asyncValidateDialogConfigurationFk;
						}
					}

					let config = {
						'fid': 'procurement.common.create.module',  // create project
						'version': '1.1.0',     // if same version setting can be reused, otherwise discard settings
						'showGrouping': false,
						'groups': [
							{
								'gid': 'basicData',
								'header$tr$': 'procurement.contract.wizards.SetReportingDateHeader',
								'isOpen': true,
								'visible': true,
								'sortOrder': 1
							}
						],
						'rows': [
							{
								'rid': 'configurationfk',
								'gid': 'basicData',
								'label': 'Configuration',
								'label$tr$': 'procurement.package.entityConfiguration',
								'type': 'directive',
								'model': 'ConfigurationFk',
								'validator': $scope.currentSerivce && $scope.currentSerivce.ValidationService ? $scope.currentSerivce.ValidationService.validateDialogConfigurationFk : _.noop,
								'directive': 'basics-configuration-configuration-combobox',
								'options': {
									'filterKey': $scope.currentSerivce ? $scope.currentSerivce.filterKey : null
								}
							},
							{
								'rid': 'code',
								'gid': 'basicData',
								'label': 'Code',
								'label$tr$': 'cloud.common.entityCode',
								'validator': $scope.currentSerivce && $scope.currentSerivce.ValidationService ? $scope.currentSerivce.ValidationService.validateDialogCode : _.noop,
								'type': 'code',
								'model': 'Code'
							}
						]
					};

					if ($scope.currentSerivce.IsContract) {
						let columns = [
							{
								'rid': 'businesspartnerfk',
								'gid': 'basicData',
								'label': 'entityBusinessPartner',
								'label$tr$': 'cloud.common.entityBusinessPartner',
								'type': 'directive',
								'model': 'BusinessPartnerFk',
								'validator': $scope.currentSerivce && $scope.currentSerivce.ValidationService ? $scope.currentSerivce.ValidationService.validateDialogBusinessPartnerFk : _.noop,
								'directive': 'filter-business-partner-dialog-lookup',
								'options': {
									'showClearButton': true,
									'filterKey': 'procurement-contract-businesspartner-businesspartner-filter',
									'IsShowBranch': true,
									'approvalBPRequired': true,
									'mainService': 'procurementContractHeaderDataService',
									'BusinessPartnerField': 'BusinesspartnerFk',
									'SubsidiaryField': 'SubsidiaryFk',
									'SupplierField': 'SupplierFk',
									'ContactField': 'ContactFk',
									'events': [{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											if ($scope.currentSerivce && $scope.currentSerivce.ValidationService && _.isFunction($scope.currentSerivce.ValidationService.SelectedItemChanged2BusinessPartnerFk)) {
												$scope.currentSerivce.ValidationService.SelectedItemChanged2BusinessPartnerFk(e, args);
											}
										}
									}]
								}
							},
							{
								'rid': 'contactfk',
								'gid': 'basicData',
								'label': 'ConHeaderContact',
								'label$tr$': 'procurement.contract.ConHeaderContact',
								'type': 'directive',
								'model': 'ContactFk',
								'directive': 'business-partner-main-contact-dialog',
								'options': {
									'showClearButton': true,
									'filterKey': 'prc-con-contact-filter'
								}
							},
							{
								'rid': 'subsidiaryfk',
								'gid': 'basicData',
								'label': 'entitySubsidiary',
								'validator': $scope.currentSerivce && $scope.currentSerivce.ValidationService ? $scope.currentSerivce.ValidationService.validateSubsidiaryFk : _.noop,
								'label$tr$': 'cloud.common.entitySubsidiary',
								'type': 'directive',
								'model': 'SubsidiaryFk',
								'directive': 'business-partner-main-subsidiary-lookup',
								'options': {
									'showClearButton': true,
									'filterKey': 'prc-con-subsidiary-filter'
								}
							},
							{
								'rid': 'supplierfk',
								'gid': 'basicData',
								'label': 'entitySupplier',
								'validator': $scope.currentSerivce && $scope.currentSerivce.ValidationService ? $scope.currentSerivce.ValidationService.validateSupplierFk : _.noop,
								'label$tr$': 'cloud.common.entitySupplier',
								'type': 'directive',
								'model': 'SupplierFk',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									'lookupDirective': 'business-partner-main-supplier-lookup',
									'descriptionMember': 'Description',
									'lookupOptions': {
										'filterKey': 'prc-con-supplier-filter',
										'disableInput': false,
										'showClearButton': true,
										'showEditButton': true
									}
								}
							}
						];
						_.forEach(columns, function (column) {
							config.rows.push(column);
						});
					}
					return config;
				}

				return {
					init: init,
					getFormConfigForDialog: getFormConfigForDialog,
					getDefault: getDefault
				};

			}]);
})(angular);