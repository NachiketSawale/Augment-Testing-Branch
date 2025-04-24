/**
 * Created in workshop GZ
 */
(function () {
	/* global _ */
	'use strict';

	var moduleName = 'boq.main';

	/**
	 * @ngdoc controller
	 * @name boqMainHeaderLookupController
	 * @function
	 *
	 * @description
	 * Controller for the boq header lookup view.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('boqMainHeaderLookupController',
		['$scope', '$injector', '$translate', 'platformPermissionService', 'boqMainBoqLookupService', 'boqMainLookupFilterService',
			function ($scope, $injector, $translate, platformPermissionService, boqMainBoqLookupService, boqMainLookupFilterService) {
				var filterCleared = function filterCleared() {
					boqMainBoqLookupService.clear();
					boqMainLookupFilterService.clearSelectedBoqHeader();

				};

				var onSingleProjektBoqLoaded = function onSingleProjektBoqLoaded(loadedBoq) {
					$scope.selectedBoqHeader = angular.merge($scope.selectedBoqHeader, loadedBoq);
					reactOnSelectedItemChanged(loadedBoq);
				};

				// scope variables/ functions
				$scope.selectedBoqHeader = boqMainLookupFilterService.selectedBoqHeader;
				$scope.selectedItem = null;
				$scope.entity = null;

				$scope.boqHeaderLookupFilter = boqMainLookupFilterService.boqHeaderLookupFilter;
				boqMainLookupFilterService.filterCleared.register(filterCleared);
				boqMainLookupFilterService.onSingleProjectBoqLoaded.register(onSingleProjektBoqLoaded);

				if ($scope.boqHeaderLookupFilter.filterCrbBoqs) {
					boqMainLookupFilterService.clearFilter(true, true);
				}

				// ///////////////////////////////////
				// Boq Header Lookup
				// ///////////////////////////////////

				var boqHeaderLookupService = $injector.get('boqMainCopyHeaderLookupDataService');
				var targetBoqMainService = boqMainLookupFilterService.getTargetBoqMainService();

				boqHeaderLookupService.setFilter($scope.boqHeaderLookupFilter);

				var filterByPrcStructure = function filterByPrcStructure() { // added for defect 113288
					filterCleared();
					$scope.boqHeaderLookupFilter = boqMainLookupFilterService.boqHeaderLookupFilter;
					boqHeaderLookupService.setFilter($scope.boqHeaderLookupFilter);

					boqHeaderLookupService.resetCache({lookupType: 'boqMainCopyHeaderLookupDataService'});
				};

				boqMainLookupFilterService.PrcStructureChanged.register(filterByPrcStructure); // added for defect 113288

				var reactOnSelectedItemChanged = function reactOnSelectedItemChanged(selectedItem) {
					var callingContext = {};
					var selectedProjectId = null;
					if (selectedItem) {

						if($scope.boqHeaderLookupFilter.projectId > 0) {
							selectedProjectId = $scope.boqHeaderLookupFilter.projectId;
							callingContext.Boq = {
								PrjProjectFk: $scope.boqHeaderLookupFilter.projectId,
								BoqHeaderFk: selectedItem.BoqHeaderFk
							};
						}
						else if($scope.boqHeaderLookupFilter.boqGroupId > 0) {
							callingContext.WicBoq = {
								WicGroupFk: $scope.boqHeaderLookupFilter.boqGroupId,
								BoqHeaderFk: selectedItem.BoqHeaderFk
							};
						}

						boqMainBoqLookupService.setSelectedHeaderFk(selectedItem.BoqHeaderFk, false, false, false, false, callingContext);
						boqMainBoqLookupService.setSelectedProjectId(selectedProjectId);
						boqMainLookupFilterService.setSelectedBoqHeader(selectedItem);
						boqMainLookupFilterService.setSelectedFromEstimateHeader(null);
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

								let boqType = boqMainLookupFilterService.boqHeaderLookupFilter.boqType;
								let gridId = $scope.lookupOptions.uuid;
								let boqMainBoqTypes = $injector.get('boqMainBoqTypes');
								let platformGridAPI = $injector.get('platformGridAPI');

								platformGridAPI.events.register(gridId, 'onInitialized', function() {

									let gridColumns = platformGridAPI.columns.getColumns(gridId);

									let listOfDisplayedColumns = ['BoqNumber', 'Description','FinalPrice','FinalPriceGross','ExternalCode','BasCurrencyFk'];

									let wicColumnList = ['MdcMaterialCatalogFk','BpdBusinessPartnerFk','BpdSubsidiaryFk',
										'BpdSupplierFk','MdcWicTypeFk','CopyTemplateOnly','MdcLineItemContextFk',
										'IsGCBoq','ConHeaderFkCode','ConHeaderFkDescription','OrdHeaderFk','OrdHeaderFks','ValidFrom','ValidTo'];

									let projectColumnList = ['PrjProjectFk','IsGCBoq','BoqStatusFk'];

									let packageColumnList = ['PackageFk','MdcControllingunitFks','PackageFks','MdcControllingunitFk','BoqStatusFk'];

									let contractColumnList = ['PackageFk','MdcControllingunitFks','PackageFks','MdcControllingunitFk', 'BoqStatusFk'];
									switch(boqType)

									{

										case boqMainBoqTypes.wic:
											listOfDisplayedColumns = listOfDisplayedColumns.concat(wicColumnList);
											break;

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

									_.forEach(gridColumns, function(column) {
										column.hidden = !listOfDisplayedColumns.includes(column.id);

									});
									platformGridAPI.columns.configuration(gridId, gridColumns);

								});
							}}
					],
					dataServiceName: 'boqMainCopyHeaderLookupDataService',
					displayMember: 'BoqNumber',
					lookupModuleQualifier: 'boqMainCopyHeaderLookupDataService',
					lookupType: 'boqMainCopyHeaderLookupDataService',
					showClearButton: false,
					valueMember: 'Id',
					uuid: 'ecf55ffffab342238204a39b8801f9eb',
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

				function tryShowWhiteboard() {
					var allowUsage = platformPermissionService.hasRead(targetBoqMainService.getContainerUUID().toLowerCase()) && targetBoqMainService.getRootBoqItem();
					if (allowUsage) { $scope.getUiAddOns().getWhiteboard().setVisible(false); }
					else            { $scope.getUiAddOns().getWhiteboard().showInfo($translate.instant('boq.main.selectTargetBoq')); }
				}
				if (targetBoqMainService) {
					tryShowWhiteboard();
					targetBoqMainService.selectedBoqHeaderChanged.register(tryShowWhiteboard);
				}

				$scope.$on('$destroy', function () {
					// Reset the data service
					// boqMainBoqLookupService.clear();
					boqMainLookupFilterService.onSingleProjectBoqLoaded.unregister(onSingleProjektBoqLoaded);
					boqMainLookupFilterService.filterCleared.unregister(filterCleared);
					boqMainLookupFilterService.PrcStructureChanged.unregister(filterByPrcStructure); // added for defect 113288

					if (targetBoqMainService) {
						targetBoqMainService.selectedBoqHeaderChanged.unregister(tryShowWhiteboard);
					}
				});
			}
		]);
})();
