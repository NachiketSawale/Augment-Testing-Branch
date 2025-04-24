/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals */

(function () {

	'use strict';
	let moduleName = 'estimate.assemblies',
		angModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name estimateAssembliesCtrlGroupService
	 * @function
	 *
	 * @description
	 * estimateAssembliesCtrlGroupService is the data service for all structure related functionality.
	 */
	angModule.factory('estimateAssembliesCtrlGroupService', ['platformDataServiceFactory', 'estimateAssembliesService',
		'platformModuleStateService','basicsCommonMandatoryProcessor',
		function (platformDataServiceFactory, estimateAssembliesService,platformModuleStateService,basicsCommonMandatoryProcessor) {

			let serviceContainer = platformDataServiceFactory.createNewComplete({
				flatNodeItem: {
					module: angModule,
					serviceName: 'estimateAssembliesCtrlGroupService',
					httpCreate: {route: globals.webApiBaseUrl + 'estimate/assemblies/ctrlgrp/'},
					httpRead: {route: globals.webApiBaseUrl + 'estimate/assemblies/ctrlgrp/'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								let selectedItem = estimateAssembliesService.getSelected();
								if (selectedItem && selectedItem.Id > 0) {
									creationData.Id = selectedItem.Id;
									creationData.estHeaderFk = selectedItem.EstHeaderFk;
								}
							}
						}
					},
					entityRole: {
						node: {itemName: 'EstAssembliesCtrlGrp', parentService: estimateAssembliesService}
					}
				}
			});

			let service = serviceContainer.service;
			let data = serviceContainer.data;

			data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'EstLineitem2CtrlGrpDto',
				moduleSubModule: 'Estimate.Assemblies',
				validationService: 'estimateAssembliesCtrlGroupValidationService'
			});

			let entityDelete = function(){
				let modState = platformModuleStateService.state(service.getModule());

				let parentState = modState.modifications;
				let itemName = data.itemName + 'ToSave';
				let parentValidation = modState.validation;
				if(parentState  && parentState[itemName]) {
					for(let i =  parentState[itemName].length - 1; i >= 0; i--){
						if (null === serviceContainer.service.getItemById(parentState[itemName][i].MainItemId)){
							parentState[itemName].splice(i);
							modState.modifications.EntitiesCount -= 1;
						}

					}
				}
				// Clear specific validation
				if(parentValidation.issues)
				{
					for(let j =  parentValidation.issues.length - 1; j >= 0; j--)
					{
						if(null === serviceContainer.service.getItemById(parentValidation.issues[j].entity.Id))
						{
							parentValidation.issues.splice(j);
						}
					}
				}
			};

			serviceContainer.service.registerSelectionChanged(entityDelete);
			return service;
		}]);
})();
