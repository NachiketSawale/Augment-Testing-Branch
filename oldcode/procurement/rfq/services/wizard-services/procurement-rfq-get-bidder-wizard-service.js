(function (angular) {
	'use strict';
	var moduleName = 'procurement.rfq';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	// wizard 'get bidder' dialog grid column definition
	angular.module(moduleName).value('procurementRfqGetBidderColumnsDef',
		{
			getStandardConfigForListView: function () {
				return {
					columns: [
						{
							id: 'BusinessPartnerStatus',
							field: 'Id',
							name: 'BusinessPartnerStatus',
							name$tr$: 'procurement.rfq.businessPartnerStatus',
							sortable: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'BusinessPartner',
								displayMember: 'StatusDescriptionTranslateInfo.Translated',
								imageSelector: 'platformStatusIconService'
							},
							width: 100
						}, {
							id: 'BusinessPartnerStatus2',
							field: 'Id',
							name: 'BusinessPartnerStatus2',
							name$tr$: 'procurement.rfq.uniformBusinessPartnerStatus2',
							sortable: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'BusinessPartner',
								displayMember: 'Status2DescriptionTranslateInfo.Translated',
								imageSelector: 'businesspartnerMainStatusSalesIconService'
							},
							width: 100
						}, {
							id: 'matchCode',
							field: 'MatchCode',
							name: 'Match Code',
							name$tr$: 'businesspartner.main.matchCode',
							sortable: true,
							width: 100
						}, {
							id: 'bpName1',
							field: 'BusinessPartnerName1',
							name: 'Name',
							name$tr$: 'cloud.common.entityName',
							sortable: true,
							width: 100
						}, {
							id: 'zipCode',
							field: 'ZipCode',
							name: 'ZipCode',
							name$tr$: 'procurement.rfq.uniformBusinessPartnerNZip',
							width: 100,
							sortable: true
						}, {
							id: 'city',
							field: 'City',
							name: 'City',
							name$tr$: 'cloud.common.entityCity',
							width: 100,
							sortable: true
						}, {
							id: 'street',
							field: 'Street',
							name: 'Street',
							name$tr$: 'cloud.common.entityStreet',
							width: 150,
							sortable: true
						}, {
							id: 'userdefined1',
							field: 'Userdefined1',
							name: 'User Define 1',
							name$tr$: 'businesspartner.main.import.entityUserDefined1',
							width: 100,
							sortable: true
						}
					]
				};
			}
		}
	);

	/**
	 * @ngdoc service
	 * @name procurementRfqGetBidderWizardService
	 * @function
	 * @requires $q
	 *
	 * @description
	 * data service for rfq wizard 'get bidder'.
	 */
	/* jshint -W072 */
	angular.module(moduleName).factory('procurementRfqGetBidderWizardService', [
		'$q',
		'$window',
		'$http',
		'platformContextService',
		'procurementRfqMainService',
		'procurementRfqGetBidderColumnsDef',
		'basicsLookupdataLookupDescriptorService',
		'procurementRfqBusinessPartnerService',
		'basicsCommonBusinesspartnerPortalDialogService',
		'procurementCommonHelperService',
		'platformModalService',
		function (
			$q,
			$window,
			$http,
			platformContextService,
			procurementRfqMainService,
			columnsDef,
			lookupDescriptorService,
			procurementRfqBusinessPartnerService,
			businesspartnerPortalDialogService,
			procurementCommonHelperService,
			platformModalService) {

			var service = {};

			service.showBizPartnerPortalDialog = function showBizPartnerPortalDialog(options) {
				service.isApprovedBP = options.isApprovedBP ?? false;
				var mainItem = getMainItem();
				if (!mainItem.selected) {
					return;
				}

				businesspartnerPortalDialogService.showDialog({
					columns: columnsDef,
					gridData: [],
					inquiryDataFn: inquiryData,
					requestDataFn: requestData,
					isApprovedBP: service.isApprovedBP,
				}).then(function (result) {
					if (result.ok) {
						createData();
					}
				});
			};

			function getMainItem() {
				var obj = {selected: false, value: -1};
				var mainItem = procurementRfqMainService.getSelected();
				if (mainItem && Object.getOwnPropertyNames(mainItem).length > 0) {
					obj.selected = true;
					obj.value = mainItem.Id;
				}
				return obj;
			}

			function inquiryData(requestId) {
				// '#/api?navigate&operation=inquiry&selection=single&module=businesspartner.main&requestid=996cc6ed7f2a4864ba552f236d72812d&company=101&search=abc';
				let rfqDetails = procurementRfqMainService.getSelected();
				let params = {
					module: 'businesspartner.main',
					requestId: requestId
				}
				if (rfqDetails) {
					params.rfqCompanyFk = rfqDetails.CompanyFk;
					params.rfqProjectFk = rfqDetails.ProjectFk;
				}

				const extParamsObj = {};
				if (service.isApprovedBP) {
					extParamsObj.isApprovedBP = service.isApprovedBP;
				}

				let bidderDetails = procurementRfqBusinessPartnerService.getSelected();
				if (bidderDetails) {
					extParamsObj.subsidiaryFk = bidderDetails.SubsidiaryFk;
				}
				extParamsObj.is4Procurement = true;

				const extParams = JSON.stringify(extParamsObj);
				if (extParams !== '{}') {
					params.extparams = extParams;
				}

				procurementCommonHelperService.openInquiryWindow(params);
			}

			function requestData(requestId) {
				return $http.post(globals.webApiBaseUrl + 'businesspartner/main/businesspartner/requestportalbizpartner', {Value: requestId});
			}

			function createData() {
				var data = [];
				var mainItemId = getMainItem().value;

				// exclude the duplicated items
				_.forEach(businesspartnerPortalDialogService.dataService.getList(), function (newItem) {
					var item = _.find(procurementRfqBusinessPartnerService.getList(), function (existedItem) {
						return newItem.Id === existedItem.BusinessPartnerFk;
					});
					if (!item) { // if not existed, add it.
						data.push({
							Id: mainItemId,
							BpId: newItem.Id,
							SubsidiaryId: newItem.SubsidiaryFk,
							SupplierId: newItem.SupplierId,
							ContactId: newItem.ContactId
						});
					}
				});

				if (data.length > 0) {
					$http.post(globals.webApiBaseUrl + 'procurement/rfq/wizard/saveportalbizpartner', data).then(function (response) {
						lookupDescriptorService.attachData(response.data || {});
						procurementRfqBusinessPartnerService.doProcessData(response.data.Main); // set readonly and others.
						procurementRfqBusinessPartnerService.setList(response.data.Main);
					});
				}else{
					platformModalService.showDialog({
						headerTextKey: $translate.instant('cloud.common.infoBoxHeader'),
						bodyTextKey: $translate.instant('procurement.rfq.bidderSearchAddDuplicateBPInfo'),
						iconClass: 'ico-info'
					})
				}
			}

			return service;
		}
	]);
})(angular);
