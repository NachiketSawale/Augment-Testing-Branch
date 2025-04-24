/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainEstStructureDataService
	 * @function
	 *
	 * @description
	 * This is the data service for  Estimate Structure dialog functions.
	 */
	angular.module(moduleName).factory('estimateMainEstRuleDataService', ['$http', '$injector', 'PlatformMessenger', 'estimateMainEstRuleAssignTypeService', 'estimateMainRuleConfigDetailDataService', 'estimateMainEstRuleAssignmentParamDataService',
		function ($http, $injector, PlatformMessenger, estimateMainEstRuleAssignTypeService, estimateMainRuleConfigDetailDataService, estimateMainEstRuleAssignmentParamDataService) {

			let currentItem = {},
				completeData = {};

			let service = {
				load:load,
				setData : setData,
				clear : clear,
				updateStrDetails : updateStrDetails,
				getRootAssignConfig:getRootAssignConfig,
				getStructureDetails:getStructureDetails,
				provideUpdateData : provideUpdateData,
				onItemChange : new  PlatformMessenger()
			};


			// load complete estimate structure by typeId
			function load(typeId){
				estimateMainEstRuleAssignTypeService.setSelectedItemId(typeId);

				// get rule level first
				$injector.get('estimateMainEstRuleLevelService').loadData().then(function () {
					// get est structure config and details
					return estimateMainEstRuleAssignTypeService.getItemByIdAsync(typeId).then(function(item){
						if(item && item.Id){
							return $http.get(globals.webApiBaseUrl + 'estimate/main/rootassignmenttype/complete?rootAssignmentTypeFk='+item.Id).then(function(response){
								response.data.EstRootAssignmentType = item;
								setData(response.data);

								// Console reload rule lookup
								$injector.get('estimateMainEstRuleAssignRuleLookupService').reload();

								return currentItem;
							});
						}
					});
				});
			}

			// set estimate config type, config data
			function setData(data){
				completeData = {
					EstRootAssignmentType:data.EstRootAssignmentType,
					EstRootAssignmentDetails:data.EstRootAssignmentDetails || [],
					EstRootAssignmentParams:data.EstRootAssignmentParams || []
				};

				currentItem.estRuleAssignTypeFk = completeData.EstRootAssignmentType ? completeData.EstRootAssignmentType.Id : 0;

				let contextId = 0;
				if(data.ContextFk > 0){
					contextId = data.ContextFk;
				}
				else if(data.EstConfigType) {
					contextId = data.EstConfigType.MdcContextFk;
				}

				estimateMainEstRuleAssignTypeService.setMdcContextId(contextId);
				estimateMainEstRuleAssignTypeService.setSelectedItemId(currentItem.estRuleAssignTypeFk);

				currentItem.estRuleAssignConfigDesc = completeData.EstRootAssignmentType ? completeData.EstRootAssignmentType.DescriptionInfo.Translated : null;

				currentItem.estRootAssignmentDetails = completeData.EstRootAssignmentDetails ? completeData.EstRootAssignmentDetails : [];
				currentItem.estRootAssignmentParams = completeData.EstRootAssignmentParams ? completeData.EstRootAssignmentParams : [];

				estimateMainRuleConfigDetailDataService.clear();
				estimateMainRuleConfigDetailDataService.addItems(currentItem.estRootAssignmentDetails);

				estimateMainEstRuleAssignmentParamDataService.clear();
				estimateMainRuleConfigDetailDataService.setDataAssign(currentItem.estRootAssignmentParams);

				estimateMainEstRuleAssignTypeService.loadData();
				// Console reload rule lookup
				$injector.get('estimateMainEstRuleAssignRuleLookupService').reload();

				service.onItemChange.fire(currentItem);

			}

			// provide current estimate config type, config updateData
			function provideUpdateData(data){
				angular.extend(data, completeData);

				if (completeData.EstRootAssignmentType){
					data.EstRootAssignmentType = completeData.EstRootAssignmentType;

					data.EstRootAssignmentType.DescriptionInfo.Description = data.estRuleAssignConfigDesc;
					data.EstRootAssignmentType.DescriptionInfo.Translated = data.estRuleAssignConfigDesc;
					data.EstRootAssignmentType.DescriptionInfo.Modified = true;
				}

				// update specific totals
				data.EstRootAssignmentDetailsToSave = estimateMainRuleConfigDetailDataService.getItemsToSave();
				data.EstRootAssignmentDetailsToDelete = estimateMainRuleConfigDetailDataService.getItemsToDelete();

				data.EstRootAssignmentParamsToSave = estimateMainEstRuleAssignmentParamDataService.getAllList();
				data.EstRootAssignmentParamsToDelete = estimateMainEstRuleAssignmentParamDataService.getItemsToDelete();
			}

			function getRootAssignConfig(){
				return completeData.EstRootAssignmentType;
			}

			function getStructureDetails(){
				return completeData.EstRootAssignmentDetails;
			}

			function updateStrDetails(items){
				completeData.EstRootAssignmentDetails = items;
				currentItem.estStructureConfigDetails = items;
				// service.onItemChange.fire(currentItem);
			}

			function clear(){
				currentItem = {};
				completeData = {};

				$injector.get('estimateMainRuleConfigDetailDataService').clear();
				estimateMainEstRuleAssignmentParamDataService.clear();
				estimateMainEstRuleAssignTypeService.setMdcContextId();
			}
			return service;
		}
	]);
})();
