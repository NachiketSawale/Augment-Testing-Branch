/**
 * Created by lnt.
 */
(function () {
	/* global _ */
	'use strict';

	let moduleName = 'qto.main';

	/**
	 * @ngdoc controller
	 * @name qtoMainBoqHeaderLookupController
	 * @function
	 *
	 * @description
	 * Controller for the boq header lookup view.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('qtoMainBoqHeaderLookupController',
		['$scope', '$injector', '$translate', 'platformPermissionService', 'qtoMainDetailLookupFilterService',
			function ($scope, $injector, $translate, platformPermissionService, qtoMainDetailLookupFilterService) {

				// scope variables/ functions
				$scope.selectedBoqHeader = qtoMainDetailLookupFilterService.selectedBoqHeader;
				$scope.selectedItem = null;
				$scope.entity = null;

				$scope.boqHeaderLookupFilter = qtoMainDetailLookupFilterService.boqHeaderLookupFilter;

				if ($scope.boqHeaderLookupFilter.filterCrbBoqs) {
					qtoMainDetailLookupFilterService.clearFilter(true, true);
				}

				// ///////////////////////////////////
				// Boq Header Lookup
				// ///////////////////////////////////

				let boqHeaderLookupService = $injector.get('boqMainCopyHeaderLookupDataService');
				boqHeaderLookupService.setFilter($scope.boqHeaderLookupFilter);

				let reactOnSelectedItemChanged = function reactOnSelectedItemChanged(selectedItem) {

					if (selectedItem) {
						qtoMainDetailLookupFilterService.qtoHeaderLookupFilter.boqHeaderFk = selectedItem.BoqHeaderFk;
					}

					qtoMainDetailLookupFilterService.setSelectedBoqHeader(selectedItem);

					$scope.selectedBoqHeader = qtoMainDetailLookupFilterService.selectedBoqHeader;

					qtoMainDetailLookupFilterService.setSelectedQtoHeader(null);
					qtoMainDetailLookupFilterService.qtoHeaderFilterCleared.fire();

					let linesLookupService = $injector.get('qtoMainLineLookupService');
					let qtoLines = linesLookupService.getList();
					if (qtoLines.length > 0){
						linesLookupService.load();
					}
				};

				$scope.lookupOptions = {
					events: [
						{
							name: 'onSelectedItemChanged', handler: function selectedBoqHeaderChanged(e, args) {
								reactOnSelectedItemChanged(args.selectedItem);
							}
						},
						{
							name: 'onPopupOpened',
							handler: function () {

								let boqType = qtoMainDetailLookupFilterService.boqHeaderLookupFilter.boqType;
								let gridId = $scope.lookupOptions.uuid;
								let boqMainBoqTypes = $injector.get('boqMainBoqTypes');
								let platformGridAPI = $injector.get('platformGridAPI');

								platformGridAPI.events.register(gridId, 'onInitialized', function () {

									let gridColumns = platformGridAPI.columns.getColumns(gridId);

									let listOfDisplayedColumns = ['BoqNumber', 'Description', 'FinalPrice', 'FinalPriceGross', 'ExternalCode', 'BasCurrencyFk'];

									let projectColumnList = ['PrjProjectFk', 'IsGCBoq', 'BoqStatusFk'];

									let packageColumnList = ['PackageFk', 'MdcControllingunitFks', 'PackageFks', 'MdcControllingunitFk', 'BoqStatusFk'];

									let contractColumnList = ['PackageFk', 'MdcControllingunitFks', 'PackageFks', 'MdcControllingunitFk', 'BoqStatusFk'];
									switch (boqType) {

										case boqMainBoqTypes.project:
											listOfDisplayedColumns = listOfDisplayedColumns.concat(projectColumnList);
											break;

										case boqMainBoqTypes.package:
											listOfDisplayedColumns = listOfDisplayedColumns.concat(packageColumnList);
											break;

										case boqMainBoqTypes.contract:
											listOfDisplayedColumns = listOfDisplayedColumns.concat(contractColumnList);
											break;

									}

									// Iterate over all column definitions and set the 'hidden' property accordingly
									_.forEach(gridColumns, function (column) {
										column.hidden = !listOfDisplayedColumns.includes(column.id);

									});
									platformGridAPI.columns.configuration(gridId, gridColumns);

								});
							}
						}
					],
					dataServiceName: 'boqMainCopyHeaderLookupDataService',
					displayMember: 'BoqNumber',
					lookupModuleQualifier: 'boqMainCopyHeaderLookupDataService',
					lookupType: 'boqMainCopyHeaderLookupDataService',
					showClearButton: true,
					valueMember: 'Id',
					uuid: 'a8f414f1a7fb4e5ea4179d558ec69996',
					disableDataCaching: true,
					filterOnSearchIsFixed: true,
					isClientSearch: true,
					filter: function (/* entity */) {
						return $scope.boqHeaderLookupFilter;
					},
					columns: [
						{
							id: 'BoqNumber',
							field: 'BoqNumber',
							name: 'BoqNumber',
							formatter: 'code',
							name$tr$: 'boq.main.boqNumber'
						},
						{
							id: 'Description',
							field: 'Description',
							name: 'Description',
							formatter: 'description',
							name$tr$: 'cloud.common.entityDescription'
						},
						{
							id: 'IsGCBoq',
							field: 'IsGCBoq',
							name: 'GC Boq',
							formatter: 'boolean',
							name$tr$: 'boq.main.IsGCBoq'
						},
						{
							id: 'MdcMaterialCatalogFk',
							field: 'WicFramework',
							name: 'WIC Framework',
							formatter: 'code',
							name$tr$: 'boq.wic.MdcMaterialCatalogFk'

						},
						{
							id: 'BpdBusinessPartnerFk',
							field: 'BusinessPartnerName',
							name: 'Business Partner',
							formatter: 'description',
							name$tr$: 'cloud.common.entityBusinessPartner'
						},
						// TODO: !!!!
						// At the moment we don't have an interface or a logic that directly gives access to these lookup view entities so it gives null/empty values !!!!
						{
							id: 'BpdSubsidiaryFk',
							field: 'Branch',
							name: 'Branch',
							grid: {
								'editor': 'lookup',
								'editorOptions': {
									'directive': 'business-partner-main-subsidiary-lookup',
									'lookupOptions': {'showClearButton': true, 'filterKey': 'wic-boq-subsidiary-filter', 'displayMember': 'AddressLine'}
								},
								'formatter': 'lookup',
								'formatterOptions': {'lookupType': 'subsidiary', 'displayMember': 'AddressLine'},
								'width': 180
							},
							'detail': {
								'type': 'directive',
								'directive': 'business-partner-main-subsidiary-lookup',
								'options': {
									'filterKey': 'wic-boq-subsidiary-filter', 'showClearButton': true,
									'displayMember': 'AddressLine'
								}
							},
							name$tr$: 'cloud.common.entitySubsidiary'
						},
						{
							id: 'BpdSupplierFk',
							field: 'Supplier',
							name: 'Supplier No',
							formatter: 'description',
							name$tr$: 'cloud.common.entitySupplierCode'
						},
						{
							id: 'MdcWicTypeFk',
							field: 'WicType',
							name: 'WIC Type',
							formatter: 'description',
							name$tr$: 'basics.customize.wictype'
						},
						{
							id: 'ConHeaderFkDescription',
							field: 'ProcurementContractDescription',
							name: 'Contract Description',
							formatter: 'description',
							name$tr$:'cloud.common.entityContractDescription'
						},
						{
							id: 'ConHeaderFkCode',
							field: 'ProcurementContractCode',
							name: 'Contract',
							formatter: 'code',
							name$tr$:'cloud.common.entityContract'
						},
						{
							id: 'OrdHeaderFk',
							field: 'SalesContractCode',
							name: 'Sales Contract',
							formatter: 'description',
							name$tr$: 'boq.wic.OrdHeaderFk'
						},
						{
							id: 'OrdHeaderFks',
							field: 'SalesContractDescription',
							name: 'Sales Contract Description',
							formatter: 'description',
							name$tr$: 'boq.wic.OrdHeaderFk'
						},
						{
							id: 'ValidFrom',
							field: 'ValidFrom',
							name: 'Valid From',
							formatter: 'dateutc',
							name$tr$: 'cloud.common.entityValidFrom'
						},
						{
							id: 'ValidTo',
							field: 'ValidTo',
							name: 'Valid To',
							formatter: 'dateutc',
							name$tr$: 'cloud.common.entityValidTo'
						},
						{
							id: 'PrjProjectFk',
							field: 'ProjectNumber',
							name: 'Project Number',
							formatter: 'description',
							name$tr$: 'project.main.projectNo'
						},
						{
							id: 'FinalPrice',
							field: 'Finalprice',
							name: 'Final Price',
							formatter: 'money',
							name$tr$: 'boq.main.Finalprice'
						},
						{
							id: 'FinalPriceGross',
							field: 'Finalgross',
							name: 'Final Price (Gross)',
							formatter: 'money',
							name$tr$: 'boq.main.Finalgross'
						},
						{
							id: 'ExternalCode',
							field: 'ExternalCode',
							name: 'External Code',
							formatter: 'description',
							name$tr$: 'boq.main.ExternalCode'
						},
						{
							id: 'BasCurrencyFk',
							field: 'Currency',
							name: 'Currency',
							formatter: 'description',
							name$tr$: 'cloud.common.entityCurrency'
						},
						{
							id: 'BoqStatusFk',
							field: 'BoqStatusFk',
							name: 'BoQ Status',
							formatter: 'lookup',
							formatterOptions: {
								displayMember: 'Description',
								imageSelector: 'platformStatusIconService',
								lookupModuleQualifier: 'basics.customize.boqstatus',
								lookupSimpleLookup: true,
								valueMember: 'Id'
							},
							name$tr$: 'boq.main.BoqStatusFk'
						},
						{
							id: 'PackageFk',
							field: 'ProcurementPackageCode',
							name: 'Package Code',
							formatter: 'code',
							name$tr$: 'cloud.common.entityPackageCode'
						},
						{
							id: 'PackageFks',
							field: 'ProcurementPackageDescription',
							name: 'Package Description',
							formatter: 'description',
							name$tr$: 'cloud.common.entityPackageDescription'
						},
						{
							id: 'MdcControllingunitFk',
							field: 'ControllingUnitCode',
							name: 'Controlling Unit',
							formatter: 'code',
							name$tr$: 'cloud.common.entityControllingUnitCode'
						},
						{
							id: 'MdcControllingunitFks',
							field: 'ControllingUnitDescription',
							name: 'Controlling Unit Description',
							formatter: 'description',
							name$tr$: 'cloud.common.entityControllingUnitDesc'
						}
					],
					popupOptions: {
						width: 350
					}
				};

				qtoMainDetailLookupFilterService.boqHeaderFilterCleared.register(clearedBoqHeaderFilter);

				function clearedBoqHeaderFilter(){
					$scope.selectedBoqHeader = {Id: null, BoqHeaderFk: null, Description: ''};
				}

				$scope.$on('$destroy', function () {
					qtoMainDetailLookupFilterService.boqHeaderFilterCleared.unregister(clearedBoqHeaderFilter);
				});
			}
		]);
})();
