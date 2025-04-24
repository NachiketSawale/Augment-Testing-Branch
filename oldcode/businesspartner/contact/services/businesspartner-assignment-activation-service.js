(function (angular) {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	let moduleName = 'businesspartner.contact';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('businessPartnerAssignmentActivationService', [
		'$q', '$translate', '$http', 'platformTranslateService', 'platformModalService', 'businesspartnerContactDataService', 'businesspartnerContact2BpAssignmentDataService',
		function ($q, $translate, $http, platformTranslateService, platformModalService, businesspartnerContactDataService, businesspartnerContact2BpAssignmentDataService) {

			let service = {};

			let dialogConfig = {
				title: $translate.instant('businesspartner.contact.businessPartnerAssignment.grid'),
				resizeable: true,
				dataItems: [],
				bodyTextKey: $translate.instant('businesspartner.contact.businessPartnerAssignment.grid'),
				OKBtnText: 'cloud.common.ok',
				templateUrl: globals.appBaseUrl + 'businesspartner.contact/templates/businesspartner-assignment-activation-dialog.html',
				cancelBtnText: 'cloud.common.cancel',
				OKBtnRequirement: false,
				gridConfiguration: {
					uuid: '489312f78f1c48b58881c43950837428',
					version: '0.2.4',
					columns: [
						{
							id: 'businesspartnerfk',
							field: 'BusinessPartnerFk',
							name: 'Business Partner',
							name$tr$: 'businesspartner.main.businessPartnerName1',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'BusinessPartner',
								displayMember: 'BusinessPartnerName1'
							},
							readonly: true,
							width: 150
						}, {
							id: 'subsidiaryfk',
							field: 'SubsidiaryFk',
							name: 'Branch',
							name$tr$: 'sales.common.entitySubsidiaryFk',
							formatter: 'lookup',
							formatterOptions: {
								displayMember: 'AddressLine',
								lookupType: 'Subsidiary'
							},
							readonly: true,
							width: 150
						},
						{
							id: 'contactrolefk',
							field: 'ContactRoleFk',
							name: 'ContactRoleFk',
							name$tr$: 'procurement.rfq.wizard.contacts.contactRole',
							formatter: 'lookup',
							formatterOptions: {
								lookupSimpleLookup: true,
								lookupModuleQualifier: 'businesspartner.contact.role',
								displayMember: 'Description',
								valueMember: 'Id'
							},
							readonly: true,
							width: 100
						},
						{
							id: 'islive',
							field: 'IsLive',
							name: 'Active',
							name$tr$: 'cloud.common.entityIsLive',
							formatter: 'boolean',
							editor: 'boolean',
							width: 60,
							headerChkbox: true
						}
					]
				},
				handleOK: function handleOK(result) {
					if (result && result.length > 0) {
						// eslint-disable-next-line no-unused-vars
						$http.post(globals.webApiBaseUrl + 'businesspartner/contact/businesspartnerassignment/update', result).then(function () {
							businesspartnerContact2BpAssignmentDataService.load();
						});
					}
				}
			};

			service.showEditor = function () {
				let contact = businesspartnerContactDataService.getSelected();
				if (contact === null) {
					showInfo('Please first select a data entity');
					return;
				}

				$http.get(globals.webApiBaseUrl + 'businesspartner/contact/businesspartnerassignment/list?mainItemId=' + contact.Id).then(function (response) {
					let datas = [];
					if (response.data && response.data.length > 0) {
						_.forEach(response.data, function (item) {
							if (item.IsMain === false) {
								datas.push(item);
							}
						});
					}

					dialogConfig.dataItems = datas;
					platformTranslateService.translateGridConfig(dialogConfig.gridConfiguration);
					platformModalService.showDialog(dialogConfig).then(function (result) {
						if (result.isOK) {
							if (dialogConfig.handleOK) {
								dialogConfig.handleOK(dialogConfig.dataItems);
							}
						} else {
							if (dialogConfig.handleCancel) {
								dialogConfig.handleCancel(result);
							}
						}
					});
				});
			};

			service.getDataItems = function getDataItems() {
				return $q.when(dialogConfig.dataItems);
			};

			service.getGridConfiguration = function getGridConfiguration() {
				return dialogConfig.gridConfiguration;
			};

			function showInfo(message) {
				let modalOptions = {
					headerTextKey: 'Info',
					bodyTextKey: message,
					showOkButton: true,
					iconClass: 'ico-warning'
				};
				platformModalService.showDialog(modalOptions);
			}

			return service;

		}
	]);
})(angular);