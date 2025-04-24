/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals, _ */
	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainEstTotalsConfigDataService
	 * @function
	 *
	 * @description
	 * estimateMainEstTotalsConfigDataService is the data service for  EStimate configuration dialog functions.
	 */
	angular.module(moduleName).factory('estimateMainEstTotalsConfigDataService', [
		'$http', 'PlatformMessenger', 'platformGridAPI', 'estimateMainTotalsConfigTypeService', '$injector', 'estimateMainEstTotalsConfigDetailDataService', 'estimateMainCostCodeAssignmentDetailDataService', 'estimateMainCostCodeAssignmentDetailLookupDataService',
		function ($http, PlatformMessenger, platformGridAPI, estimateMainTotalsConfigTypeService, $injector, estimateMainEstTotalsConfigDetailDataService, estimateMainCostCodeAssignmentDetailDataService, estimateMainCostCodeAssignmentDetailLookupDataService) {

			let currentItem = {},
				completeData = {};

			let service = {
				load: load,
				setData: setData,
				clear: clear,
				getTotalsConfigData: getTotalsConfigData,
				updateTolDetails: updateTolDetails,
				getTotlasConfig: getTotlasConfig,
				getTotalsConfigDetails: getTotalsConfigDetails,
				getCostcodeAssignDetails: getCostcodeAssignDetails,
				provideUpdateData: provideUpdateData,
				setIsUpdTotals: setIsUpdTotals,
				detailGridIsEditable: detailGridIsEditable,
				setDetailGridReadOnly: setDetailGridReadOnly,
				onItemChange: new PlatformMessenger(),
				updateColumn: updateColumn
			};


			// load complete estimate totals by typeId
			function load(typeId) {
				estimateMainTotalsConfigTypeService.setSelectedItemId(typeId);
				// get est totals config and details
				return estimateMainTotalsConfigTypeService.getItemByIdAsync(typeId).then(function (item) {
					if (item && item.Id) {
						return $http.get(globals.webApiBaseUrl + 'estimate/main/totalsconfig/complete?strConfigFk=' + item.TotalsconfigFk).then(function (response) {
							response.data.EstTotalsConfigType = item;
							let isLoadCostCode = true;
							setData(response.data, isLoadCostCode);
							return currentItem;
						});
					}
				});
			}

			// set estimate config type, config data
			function setData(data) {
				completeData = {
					EstTotalsConfigType: data.EstTotalsConfigType,
					EstTotalsConfig: data.EstTotalsConfig,
					EstTotalsConfigDetails: data.EstTotalsConfigDetails,
					EstCostcodeAssignDetails: data.EstCostcodeAssigDetails
				};
				currentItem.estTolConfigTypeFk = completeData.EstTotalsConfigType ? completeData.EstTotalsConfigType.Id : 0;
				let contextId = 0;
				if(data.ContextFk > 0){
					contextId = data.ContextFk;
				}
				else if(data.EstConfigType) {
					contextId = data.EstConfigType.MdcContextFk;
				}
				else if(data.EstTotalsConfigType) {
					estimateMainCostCodeAssignmentDetailLookupDataService.setContextId(data.EstTotalsConfigType.ContextFk);
				}

				estimateMainTotalsConfigTypeService.setMdcContextId(contextId);
				estimateMainTotalsConfigTypeService.setSelectedItemId(currentItem.estTolConfigTypeFk);
				currentItem.estTotalsConfigDesc = completeData.EstTotalsConfig ? completeData.EstTotalsConfig.DescriptionInfo.Translated : null;
				currentItem.ActivateLeadingStr = completeData.EstTotalsConfig ? completeData.EstTotalsConfig.ActivateLeadingStr: false;
				currentItem.LeadingStr = completeData.EstTotalsConfig ? (completeData.EstTotalsConfig.LeadingStr || 1) :  1;

				if (completeData.EstTotalsConfig && [5, 6].indexOf(completeData.EstTotalsConfig.LeadingStr) > -1 ){
					currentItem.LeadingStrPrjCostgroup = completeData.EstTotalsConfig.LeadingStr === 5 ? completeData.EstTotalsConfig.LeadingStrPrjCostgroup: '';
					currentItem.LeadingStrEntCostgroup = completeData.EstTotalsConfig.LeadingStr === 6 ? completeData.EstTotalsConfig.LeadingStrEntCostgroup: null;
				}

				currentItem.EstTotalsConfigDetails = completeData.EstTotalsConfigDetails ? completeData.EstTotalsConfigDetails : [];
				currentItem.estCostcodeAssignDetails = completeData.EstCostcodeAssignDetails ? completeData.EstCostcodeAssignDetails : [];

				let estTotalsConfigFk = data.EstConfig ? data.EstConfig.EstTotalsconfigFk : null;
				let estTotalsConfigTypeFk = data.EstConfig ? data.EstConfig.EstTotalsconfigtypeFk : null;

				currentItem.isEditTolConfigType = !!(!estTotalsConfigTypeFk && !!estTotalsConfigFk);

				completeData.IsUpdTotals = !!completeData.EstTotalsConfig;

				estimateMainEstTotalsConfigDetailDataService.clear();
				estimateMainEstTotalsConfigDetailDataService.addItems(currentItem.EstTotalsConfigDetails);

				$injector.get('estimateMainCostCodeAssignmentDetailDataService').clear();
				estimateMainEstTotalsConfigDetailDataService.setDataAssign(currentItem.estCostcodeAssignDetails);

				estimateMainTotalsConfigTypeService.loadData();

				service.onItemChange.fire(currentItem);
			}

			// provide current estimate config type, config updateData
			function provideUpdateData(data) {
				angular.extend(data, completeData);
				data.IsDefaultTotals = !data.isEditTolConfigType;
				data.EstTotalsConfigType = completeData.EstTotalsConfigType;
				if (!data.EstTotalsConfig) {
					data.EstTotalsConfig = {'DescriptionInfo': {}};
				}
				data.EstTotalsConfig.DescriptionInfo.Description = data.estTotalsConfigDesc;
				data.EstTotalsConfig.DescriptionInfo.Translated = data.estTotalsConfigDesc;
				data.EstTotalsConfig.DescriptionInfo.Modified = true;

				data.IsUpdTotals = completeData.IsUpdTotals;
				// update specific totals
				data.EstTotalsConfigDetailsToSave = estimateMainEstTotalsConfigDetailDataService.getItemsToSave();
				data.EstTotalsConfigDetailsToDelete = estimateMainEstTotalsConfigDetailDataService.getItemsToDelete();

				// Handle project cost code before saving
				let costCodeAssignmentsDetailsToSave = angular.copy(estimateMainCostCodeAssignmentDetailDataService.getAllList());
				_.forEach(costCodeAssignmentsDetailsToSave, function(configDetailToSave){
					if (configDetailToSave.IsCustomProjectCostCode===true){
						configDetailToSave.Project2mdcCstCdeFk = configDetailToSave.MdcCostCodeFk;
						configDetailToSave.MdcCostCodeFk = null;
					}else{
						configDetailToSave.Project2mdcCstCdeFk = null;
					}
				});
				data.EstCostcodeAssigDetailsToSave = costCodeAssignmentsDetailsToSave;
				// data.EstCostcodeAssigDetailsToSave = estimateMainEstTotalsConfigDetailDataService.getDataAssign();
				data.EstCostcodeAssigDetailsToDelete = estimateMainCostCodeAssignmentDetailDataService.getItemsToDelete();

				data.EstTotalsConfig.ActivateLeadingStr = data.ActivateLeadingStr;
				data.EstTotalsConfig.LeadingStr = data.LeadingStr;

				if ([5, 6].indexOf(data.LeadingStr) > -1 ){
					data.EstTotalsConfig.LeadingStrPrjCostgroup = data.LeadingStr === 5 ? data.LeadingStrPrjCostgroup: '';
					data.EstTotalsConfig.LeadingStrEntCostgroup = data.LeadingStr === 6 ? data.LeadingStrEntCostgroup: null;
				}

				data.EstTotal2CostTypeDetailsToSave = estimateMainEstTotalsConfigDetailDataService.getTotal2CostTypeDetailsToSave(data.EstTotalsConfigDetails);
				data.EstTotal2ResourceFlagDetailsToSave = estimateMainEstTotalsConfigDetailDataService.getTotal2ResourceFlagDetailsToSave(data.EstTotalsConfigDetails);
			}

			function getTotlasConfig() {
				return completeData.EstTotalsConfig;
			}

			function getTotalsConfigDetails() {
				return completeData.EstTotalsConfigDetails;
			}

			function getCostcodeAssignDetails() {
				return completeData.EstCostcodeAssigDetails;
			}

			function updateTolDetails(items) {
				completeData.EstTotalsConfigDetails = items;
				currentItem.EstTotalsConfigDetails = items;
				// service.onItemChange.fire(currentItem);
			}

			function setIsUpdTotals(isUpdTotals) {
				completeData.IsUpdTotals = isUpdTotals;
			}

			function getTotalsConfigData() {
				return completeData;
			}

			function setDetailGridReadOnly(isReadOnly) {
				currentItem.isEditTolConfigType = isReadOnly;
			}

			function detailGridIsEditable() {
				return currentItem.isEditTolConfigType;
			}

			function clear() {
				currentItem = {};
				completeData = {};
				$injector.get('estimateMainEstTotalsConfigDetailDataService').clear();
				$injector.get('estimateMainCostCodeAssignmentDetailDataService').clear();
				estimateMainTotalsConfigTypeService.clearMdcContextId();
			}

			function updateColumn(readOnly){
				estimateMainEstTotalsConfigDetailDataService.selectChange();
				estimateMainCostCodeAssignmentDetailDataService.updateColumn(readOnly);
			}

			return service;
		}
	]);
})();
