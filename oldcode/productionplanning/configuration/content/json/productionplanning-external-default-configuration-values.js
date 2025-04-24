/* eslint-disable no-mixed-spaces-and-tabs */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.configuration';

	/**
	  * @ngdoc service
	  * @name ppsExternalDefaultConfigConstantValues
	  * @function
	  *
	  * @description
	  * ppsExternalDefaultConfigConstantValues provides default configurations for pps external source types
	  */
	angular.module(moduleName).value('ppsExternalDefaultConfigConstantValues', {
		mesDefaultConfig: {
			'ProductionRelease': true,
			'RequiredLanguage': 'de',
			'Version': '1.1',
			'UseLogin': true,
			'LogJson': true,
			'ValidDocumentTypeIds': [],
			'DocumentTypeFk': 0,
			'CharacteristicInfo':
				{
					'ComplexityId': null,
					'MesUserDefinedFields':
						[
							{ 'Index': 1, 'BasCharacteristicId': 0 }
						]
				}
		},
		stockyardAppDefaultConfig: {
			'ExternalConfiguration':
				{
					'ModuleConfig':
					{
						'Rebook': false,
						'StoreOverview': false,
						'DeliveryUnitView': false,
						'DeliveryUnitCheck': false,
						'QualityCheck': false,
						'StoreIn': false,
						'TransportView': false,
						'CheckStacksView': false
					},
					'FeatureConfig':
					{
						'ArticleSearchPossible': false,
						'DeliveryUnitSetCheckedPossible': false,
						'DeliveryUnitSetTrailerNumberPossible': false,
						'DeliveryUnitTrailerNumberNeeded': false,
					 	'DeliveryUnitTrailerNumberUserdefinedField': 0,
					 	'ShowLoadingDeviceAsArticle': false,
					 	'ShowBundledArticles': false,
					 	'ShowDeliveryUnitsForSignedInCompany': false,
					 	'ShowTransportLists': false,
					 	'ShowPopUpCompleteRack': false,
					 	'ShowTransportViewFilter': false,
					 	'ShowStorePositionListFilter': false,
					 	'IsRebookSearchTopicSupported': false,
					 	'IsDeliveryUnitSearchSupported': false,
					 	'ShowCheckStacksListFilter': false
					 },
					'ScanConfig':
					 {
					 	'ArticleScanEnabled': false,
					 	'StockLocationScanEnabled': false,
					 	'DeliveryUnitScanEnabled': false,
					 	'WorkflowScanId': null,
					 	'WorkflowProductId': null,
					 	'WorkflowStockLocationId': null,
					 	'WorkflowRouteId': null
					 },
					'StateMappingConfig':
					 {
					 	'ProductInventory': 0,
					 	'ProductScrap': 0,
					 	'ProductQcHold': 0,
					 	'ProductFabHold': 0,
					 	'ProductChecked': 0,
					 	'RouteChecked': 0,
					 	'RouteLoaded': 0,
					 	'RouteInProgress': 0,
					 	'RouteDone': 0,
					 	'TransportStatusIds': [],
					 },
					'FilterConfig':
					 {
					 	'ArticleOnStockStatusIds': [],
					 	'DeliveryUnitDateFilterProperty': 'TrsWaypointDefaultDestinationPlannedtime',
					 	'DeliveryUnitFilters':
								[
									{ 'StatusIds': [], 'Title': 'All', 'MaterialGroupIds': [] },
									{ 'StatusIds': [0], 'Title': 'New', 'MaterialGroupIds': [0] }
								],
					 	'ArticleStatusFilters':
								[
									{ 'StatusIds': [], 'Title': 'All' },
									{ 'StatusIds': [0], 'Title': 'New' }
								],
					 	'RebookSearchTopics':
								[
									{ 'Title': 'Code', 'Filters': ['Code'] },
									{ 'Title': 'Code&Drawing', 'Filters': ['Code', 'DrawingCode'] },
								]
					 },
					'LoadingDeviceConfig':
					 {
					 	'ResRequisitionTypeId': 0,
					 	'ResRequisitionStatusId': 0,
					 	'ResRequisitionBasUomId': 0
					 },
					'DisplayPatternConfiguration':
					 {
					 	'ArticleDisplayPattern_Key': null,
					 	'ArticleDisplayPattern_Description': null,
					 	'BundleDisplayPattern_Key': null,
					 	'BundleDisplayPattern_Description': null,
					 	'StoreOverviewDisplayPattern_Key': null,
					 	'StoreOverviewDisplayPattern_Description': null,
					 	'StoreOverviewBundleDisplayPattern_Key': null,
					 	'StoreOverviewBundleDisplayPattern_Description': null,
					 	'DeliveryUnitDisplayPattern_Key': null,
					 	'DeliveryUnitItemDisplayPattern_Key': null,
					 	'DeliveryUnitDisplayPattern_Address': null,
					 	'LoadingDeviceRebookDisplayPattern_Key': null,
					 	'LoadingDeviceRebookDisplayPattern_Description': null,
					 	'BundleRebookDisplayPattern_Key': null,
					 	'BundleRebookDisplayPattern_Description': null,
					 	'LoadingDeviceDisplayPattern_Key': null,
					 	'LoadingDeviceDisplayPattern_Description': null,
					 	'TransportDisplayPattern_Key': null,
					 	'TransportDisplayPattern_Description': null,
					 	'TransportSourceDisplayPattern_Key': null,
					 	'TransportSourceDisplayPattern_Description': null,
					 	'TransportDestDisplayPattern_Key': null,
					 	'TransportDestDisplayPattern_Description': null,
					 	'List_ArticleDisplayPattern_Key': null,
					 	'List_ArticleDisplayPattern_Description': null,
					 	'List_RackDisplayPattern_Key': null,
					 	'List_RackDisplayPattern_Description': null,
					 	'List_BundleDisplayPattern_Key': null,
					 	'List_BundleDisplayPattern_Description': null,
					 	'List_DeliveryUnitDisplayPattern_Key': null
					 },
					'InventoryStockLocations': [0],
					'DispatchStockLocation': 0,
					'TimeoutSec': 0,
					'DefaultStockId': 0,
					'CreateWebSvcJobWorkflowTemplateId': 0
				}
		},
		timPrecastConfig: {
			'AppId': 0
		}
	});
})(angular);
