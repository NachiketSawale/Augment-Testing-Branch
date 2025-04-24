/**
 * Created by wed on 8/25/2017.
 */

(function (angular) {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businessPartnerGuarantorDataService', ['_', 'platformDataServiceFactory', 'businesspartnerMainHeaderDataService',
		'basicsCommonMandatoryProcessor', 'platformContextService', 'platformRuntimeDataService', 'businessPartnerGuarantorReadonlyProcessor',
		'businesspartnerStatusRightService', 'ServiceDataProcessDatesExtension',
		function (_, platformDataServiceFactory, businesspartnerMainHeaderDataService, basicsCommonMandatoryProcessor, platformContextService, platformRuntimeDataService,
			businessPartnerGuarantorReadonlyProcessor, businesspartnerStatusRightService, ServiceDataProcessDatesExtension) {
			var container = {};
			var srvOption = {
				flatNodeItem: {
					module: moduleName,
					serviceName: 'businessPartnerGuarantorDataService',
					entityNameTranslationID: 'businesspartner.main.entityGuarantor',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'businesspartner/main/guarantor/'
					},
					dataProcessor: [businessPartnerGuarantorReadonlyProcessor, new ServiceDataProcessDatesExtension(['RequiredDate', 'ExpirationDate', 'DischargedDate', 'ValidatedDate', 'Date', 'Validfrom', 'Validto'])],
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								var status = businesspartnerMainHeaderDataService.getItemStatus();
								if (status.IsReadonly === true) {
									businesspartnerStatusRightService.setListDataReadonly(readData, true);
								}
								return container.data.handleReadSucceeded(readData, data);
							},
							initCreationData: function (creationData) {
								creationData.PKey1 = businesspartnerMainHeaderDataService.getIfSelectedIdElse(-1);
							},
							handleCreateSucceeded: function (/* entity */) {

							}
						}
					},
					entityRole: {
						node: {itemName: 'Guarantor', parentService: businesspartnerMainHeaderDataService}
					}
				}
			};

			container = platformDataServiceFactory.createNewComplete(srvOption);

			var canDelete = function () {
				var isParentSelected = !!businesspartnerMainHeaderDataService.getSelected();
				if (isParentSelected) {
					var guarantorSelected = container.service.getSelected();
					if (guarantorSelected) {
						return guarantorSelected.CompanyFk === platformContextService.getContext().signedInClientId;
					}
				}
				return false;
			};

			container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'GuarantorDto',
				moduleSubModule: 'BusinessPartner.Main',
				validationService: 'businessPartnerGuarantorValidationService',
				mustValidateFields: ['BusinessPartnerFk', 'RhythmFk', 'GuarantorTypeFk', 'CreditLine', 'GuaranteeFee', 'GuaranteeFeeMinimum', 'GuaranteePercent']
			});

			var canCreate = container.service.canCreate;
			container.service.canCreate = function () {
				return canCreate() && !businesspartnerMainHeaderDataService.getItemStatus().IsReadonly;
			};

			container.service.canDelete = function () {
				return canDelete() && !businesspartnerMainHeaderDataService.getItemStatus().IsReadonly;
			};

			businesspartnerMainHeaderDataService.onCallAfterSuccessfulUpdate.register(onAfterUpdate);

			return container.service;

			function onAfterUpdate(updateData) {
				if (!updateData) {
					return;
				}

				let selected = container.service.getSelected();
				if ((updateData.CertificateToSave && updateData.CertificateToSave.length > 0) ||
					(updateData.CertificateToDelete && updateData.CertificateToDelete.length > 0)) {
					if (container.data.unloadSubEntities) {
						container.data.unloadSubEntities(container.data);
					}
					if (container.service.clearCache) {
						container.service.clearCache();
					}
					container.data.loadSubItemList()
						.then(function () {
							if (selected) {
								let list = container.service.getList();
								let newSelected = list.find(e => e.Id === selected.Id);
								container.service.setSelected(newSelected);
							}
						});
				}
			}

		}]);
})(angular);
