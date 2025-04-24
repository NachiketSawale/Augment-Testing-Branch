(function (angular) {
	'use strict';
	var moduleName = 'procurement.quote';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	// wizard 'get bidder' dialog grid column definition
	angular.module(moduleName).value('procurementQtnGetMaterialsColumnsDef',
		{
			getStandardConfigForListView: function () {
				return {
					columns: [
						{
							id: 'BusinessPartnerStatus',
							field: 'Id',
							name: 'BusinessPartnerStatus',
							name$tr$: 'procurement.rfq.businessPartnerStatus',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'BusinessPartner',
								displayMember: 'StatusDescriptionTranslateInfo.Translated',
								imageSelector: 'platformStatusIconService'
							},
							width: 100
						},
						{
							id: 'BusinessPartnerStatus2',
							field: 'Id',
							name: 'BusinessPartnerStatus2',
							name$tr$: 'businesspartner.main.entityStatus2',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'BusinessPartner',
								displayMember: 'Status2DescriptionTranslateInfo.Translated',
								imageSelector: 'businesspartnerMainStatusSalesIconService'
							},
							width: 100
						},
						{
							id: 'bpName1',
							field: 'BusinessPartnerName1',
							name: 'Name 1',
							name$tr$: 'businesspartner.main.name1',
							width: 100
						},
						{
							id: 'bpName2',
							field: 'BusinessPartnerName2',
							name: 'Name 2',
							name$tr$: 'businesspartner.main.name2',
							width: 100
						},
						{
							id: 'bpName3',
							field: 'BusinessPartnerName3',
							name: 'Name 3',
							name$tr$: 'businesspartner.main.name3',
							width: 100
						},
						{
							id: 'bpName4',
							field: 'BusinessPartnerName4',
							name: 'Name 4',
							name$tr$: 'businesspartner.main.name4',
							width: 100
						},
						{
							id: 'matchCode',
							field: 'MatchCode',
							name: 'Match Code',
							name$tr$: 'businesspartner.main.matchCode',
							width: 100
						},
						{
							id: 'email',
							field: 'Email',
							name: 'Email',
							name$tr$: 'procurement.rfq.rfqBusinessPartnerBpEmail',
							widh: 120,
							formatter: 'description'
						},
						{
							id: 'desc',
							field: 'Description',
							name: 'Description',
							name$tr$: 'cloud.common.entityDescription',
							width: 150
						},
						{
							id: 'street',
							field: 'Street',
							name: 'Street',
							name$tr$: 'cloud.common.entityStreet',
							width: 150
						},
						{
							id: 'zipCode',
							field: 'ZipCode',
							name: 'ZipCode',
							name$tr$: 'cloud.common.entityZipCode',
							width: 100
						},
						{
							id: 'city',
							field: 'City',
							name: 'City',
							name$tr$: 'cloud.common.entityCity',
							width: 100
						},
						{
							id: 'iso2',
							field: 'Iso2',
							name: 'ISO2',
							name$tr$: 'cloud.common.entityISO2',
							width: 100
						},
						{
							id: 'Userdefined1',
							field: 'Userdefined1',
							name: 'Userdefined1',
							name$tr$: 'cloud.common.entityUserDefined',
							name$tr$param$: {'p_0': '1'},
							width: 100
						},
						{
							id: 'Userdefined2',
							field: 'Userdefined2',
							name: 'Userdefined2',
							name$tr$: 'cloud.common.entityUserDefined',
							name$tr$param$: {'p_0': '2'},
							width: 100
						},
						{
							id: 'Userdefined3',
							field: 'Userdefined3',
							name: 'Userdefined3',
							name$tr$: 'cloud.common.entityUserDefined',
							name$tr$param$: {'p_0': '3'},
							width: 100
						},
						{
							id: 'Userdefined4',
							field: 'Userdefined4',
							name: 'Userdefined4',
							name$tr$: 'cloud.common.entityUserDefined',
							name$tr$param$: {'p_0': '4'},
							width: 100
						},
						{
							id: 'Userdefined5',
							field: 'Userdefined5',
							name: 'Userdefined5',
							name$tr$: 'cloud.common.entityUserDefined',
							name$tr$param$: {'p_0': '5'},
							width: 100
						}
					]
				};
			}
		}
	);

	/**
	 * @ngdoc service
	 * @name procurementQtnGetMaterialsWizardService
	 * @function
	 * @requires $q
	 *
	 * @description
	 * data service for rfq wizard 'get bidder'.
	 */
	/* jshint -W072 */
	angular.module(moduleName).factory('procurementQtnGetMaterialsWizardService', [
		'$q',
		'$injector',
		'$window',
		'$http',
		'platformContextService',
		'procurementQuoteHeaderDataService',
		'procurementQtnGetMaterialsColumnsDef',
		'basicsLookupdataLookupDescriptorService',
		'basicsCommonMaterialsPortalDialogService',
		'basicsMaterialRecordUIConfigurationService',
		'procurementCommonHelperService',
		function (
			$q,
			$injector,
			$window,
			$http,
			platformContextService,
			procurementQuoteHeaderDataService,
			columnsDef,
			lookupDescriptorService,
			materialsPortalDialogService,
			basicsMaterialRecordUIConfigurationService,
			procurementCommonHelperService) {

			var service = {};
			var inputquoteItems = null;
			service.showMaterialsPortalDialog = function showMaterialsPortalDialog(quoteItems) {
				inputquoteItems = quoteItems;
				var materialUiService = angular.copy(basicsMaterialRecordUIConfigurationService.getStandardConfigForListView());
				var mainItem = getMainItem();
				if (!mainItem.selected) {
					return;
				}

				materialsPortalDialogService.showDialog({
					columns: materialUiService.columns,
					gridData: [],
					inquiryDataFn: inquiryData,
					requestDataFn: requestData
				}).then(function (result) {
					if (result.ok) {
						createData();
					}
				});
			};

			function getMainItem() {
				var obj = {selected: false, value: -1};
				var mainItem = procurementQuoteHeaderDataService.getSelected();
				if (mainItem && Object.getOwnPropertyNames(mainItem).length > 0) {
					obj.selected = true;
					obj.value = mainItem.Id;
				}
				return obj;
			}

			function inquiryData(requestId) {
				// '#/api?navigate&operation=inquiry&selection=single&module=businesspartner.main&requestid=996cc6ed7f2a4864ba552f236d72812d&company=101&search=abc';
				let params = {
					module: 'basics.material',
					requestId: requestId
				}

				procurementCommonHelperService.openInquiryWindow(params);
			}

			function requestData(requestId) {
				return $http.post(globals.webApiBaseUrl + 'procurement/quote/header/requestportbymaterials', {Value: requestId});
			}

			function createData() {
				var materialIds = [];
				var newItem = materialsPortalDialogService.dataService.getList();
				if (newItem) {
					angular.forEach(newItem, function (item) {
						materialIds.push(item.Id);
					});
				}
				_.forEach(inputquoteItems, function (inputQuoteItem) {
					inputQuoteItem.materialIds = materialIds;
					inputQuoteItem.IsCreateByMaterials = true;
				});

				$http.post(globals.webApiBaseUrl + 'procurement/quote/header/createqtn', inputquoteItems)
					.then(function (response) {
						if (response.data) {
							procurementQuoteHeaderDataService.loadNewItems(response.data);
						}
					});
			}

			return service;
		}
	]);
})(angular);
