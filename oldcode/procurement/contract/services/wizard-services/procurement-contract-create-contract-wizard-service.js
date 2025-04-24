(function (angular) {
	'use strict';
	var moduleName = 'procurement.contract';
	/**
	 * Service of wizard 'create contract' dialog controller of module 'procurement.contract'.
	 */
	angular.module(moduleName).factory('procurementContractWizardCreateContractService', [
		'$http',
		'$translate',
		'$q',
		'procurementRequisitionWizardCreateContractService',
		'procurementContractHeaderDataService',
		'basicsLookupdataLookupDescriptorService',
		'basicsLookupdataLookupDataService',
		'globals',
		'_',
		'platformDialogService',
		'platformGridAPI',
		'platformModuleNavigationService',
		'$timeout',
		'basicsWorkflowWizardContextService',
		'businessPartnerHelper',
		'cloudDesktopPinningContextService',
		function (
			$http,
			$translate,
			$q,
			procurementRequisitionWizardCreateContractService,
			contractDataService,
			lookupDescriptorService,
			lookupDataService,
			globals,
			_,
			platformDialogService,
			platformGridAPI,
			platformModuleNavigationService,
			$timeout,
			basicsWorkflowWizardContextService,
			helperService,
			cloudDesktopPinningContextService
		) {

			var service = {
				scope: null,
				selectedSubPackage: null,
				baseContractId: -1,
				translatePrefix: null
			};
			service.clearContractorInfo = clearContractorInfo;
			service.getSelectedContracts = getSelectedContracts;
			service.setDefaultSupplier = setDefaultSupplier;
			service.setDefaultContact = setDefaultContact;
			service.getModule = () => ({name: moduleName});
			service.getPinningProjectId = getPinningProjectId;

			function getSelectedContracts(gridId) {

				var contractsData = platformGridAPI.items.data(gridId) || [];
				var selectedBaseContracts = [];

				contractsData.forEach(function (item) {
					if (item.Selected) {
						selectedBaseContracts.push(item);
					}
				});

				return selectedBaseContracts;
			}

			function clearContractorInfo() {
				service.scope.initOptions.dataModels.businessPartner = {};
				service.scope.initOptions.dataModels.subsidiary = {};
				service.scope.initOptions.dataModels.supplier = {};
				service.scope.initOptions.isBtnNextDisabled = true;
			}


			// todo
			function setDefaultSupplier(bpId, supplierId, subsidiaryId) {
				// load bp's suppliers and set the first suplier as default when SupplierId not set.
				var currentSupplier = _.find(lookupDescriptorService.getData('supplier'), {Id: supplierId});
				if (currentSupplier) {
					service.scope.initOptions.dataModels.supplier = angular.copy(currentSupplier);
				} else {
					var searchRequest = {
						FilterKey: 'businesspartner-main-supplier-common-filter',
						SearchFields: ['Code', 'Description', 'BusinessPartnerName1'],
						SearchText: '',
						AdditionalParameters: {
							BusinessPartnerFk: bpId,
							SubsidiaryFk: subsidiaryId
						}
					};
					lookupDataService.getSearchList('supplier', searchRequest).then(function (dataList) {
						var data = dataList.items ? dataList.items : [];
						if (data && data.length > 0) {
							lookupDescriptorService.attachData({'supplier': data});
							service.scope.initOptions.dataModels.supplier = angular.copy(data[0]);
						}
					});
				}
			}

			function setDefaultContact(bpId, subsidiaryId) {
				if (bpId) {
					var filterDatas = [];
					var pbContactParam = {Value: bpId, filter: ''};
					$http.post(globals.webApiBaseUrl + 'businesspartner/contact/listbybusinesspartnerid', pbContactParam).then(function (response) {
						if (response.data) {
							if (!_.isNil(subsidiaryId)) {
								filterDatas = _.filter(response.data.Main, function (item) {
									return item.SubsidiaryFk === subsidiaryId || _.isNil(item.SubsidiaryFk);
								});
							} else {
								filterDatas = response.data.Main;
							}
							if (filterDatas.length > 0) {
								service.scope.initOptions.dataModels.contact = angular.copy(filterDatas[0]);
							} else {
								service.scope.initOptions.dataModels.contact = null;
							}
						} else {
							service.scope.initOptions.dataModels.contact = null;
						}
					});
				}
			}


			function getPinningProjectId() {
				var context = cloudDesktopPinningContextService.getContext();
				if (context) {
					for (var i = 0; i < context.length; i++) {
						if (context[i].token === 'project.main') {
							return context[i].id;
						}
					}
				}
				return -1;
			}



			return service;
		}
	]);

})(angular);