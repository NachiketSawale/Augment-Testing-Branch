/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	'use strict';
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name estimateMainCopySourceFilterService
	 * @function
	 *
	 * @description
	 * estimateMainCopySourceFilterService is the service that holds the state of the currently active filter conditions for the estimate lookup
	 */
	estimateMainModule.factory('estimateMainCopySourceFilterService', ['$translate', '$injector', 'platformDataServiceFactory', 'PlatformMessenger', 'platformRuntimeDataService', 'basicsLookupdataLookupFilterService',
		function ($translate, $injector, platformDataServiceFactory, PlatformMessenger, platformRuntimeDataService, basicsLookupdataLookupFilterService) {

			let service = {
				fieldChange : fieldChange,
				getSelected : getSelected,
				setSelected : setSelected,
				getSelectedAssemblyCatId : getSelectedAssemblyCatId,
				getSelectedProjectId : getSelectedProjectId,
				getSelectedEstHeaderId : getSelectedEstHeaderId,
				isSubItemService : function isSubItem() {
					return false;
				},
				getIsAssembly : getIsAssembly,
				getIsSelectedProject : getIsSelectedProject,
				getIsSelectedEstHeader : getIsSelectedEstHeader,
				registerDataModified : new PlatformMessenger(),
				dataModified : new PlatformMessenger(),
				loadSourceLineItems : new PlatformMessenger(),
				loadSourceAssemblies : new PlatformMessenger()
			};

			let defaultSelectedItem = {
					EstimateFilterType : 1,
					SearchText : '',
					Records : 200,
					isPending : false,
					onExecuteSearchBtnText: $translate.instant('cloud.desktop.filterdefFooterBtnSearch')
				},
				selectedItem = {},
				isAssembly = false,
				isSelectedProject = false,
				isSelectedEstHeader = false;
				const localStorageKey = "EstimateSourceLineItemPrjId";

			function getIsAssembly(){
				return isAssembly;
			}

			function setIsAssembly(item){
				isAssembly = item.EstimateFilterType === 2;
			}

			function getIsSelectedProject(){
				return isSelectedProject;
			}

			function setIsSelectedProject(item){
				isSelectedProject = !!item.ProjectId;
			}

			function getIsSelectedEstHeader (){
				return isSelectedEstHeader;
			}

			function setIsSelectedEstHeader (item){
				isSelectedEstHeader = !!item.EstHeaderId;
			}

			function getSelectedAssemblyCatId (){
				return selectedItem && getIsAssembly() ? selectedItem.AssemblyCategoryId : null;
			}

			function getSelectedProjectId (){
				return selectedItem && getIsSelectedProject() ? selectedItem.ProjectId : null;
			}

			function getSelectedEstHeaderId (){
				return selectedItem && getIsSelectedEstHeader() ? selectedItem.EstHeaderId : -1;
			}

			function init(item){

				setIsAssembly(item);

				setIsSelectedEstHeader(item);

				setIsSelectedProject(item);

				setSelected(item);

				processItem(item);
			}

			function processItem(item){

				let fields = [{field: 'EstimateFilterType', readonly: false},
					{field: 'ProjectId', readonly: isAssembly},
					{field: 'AssemblyCategoryId', readonly: !isAssembly},
					{field: 'EstHeaderId', readonly: !isSelectedProject},
					{field: 'SearchText', readonly: false},
					{field: 'Records', readonly: false }];

				platformRuntimeDataService.readonly(item, fields);
			}

			function fieldChange(item, field)
			{
				if(item === null){
					return;
				}

				switch(field){
					case 'EstimateFilterType':
						item.AssemblyCategoryId = null;
						item.ProjectId = null;
						item.EstHeaderId = null;
						item.SearchText = '';
						break;
					case 'AssemblyCategoryId' :
						item.EstimateFilterType = 2;
						item.ProjectId = null;
						item.EstHeaderId = null;
						break;
					case 'ProjectId':
						item.EstimateFilterType = 1;
						item.AssemblyCategoryId = null;
						item.EstHeaderId = null;
						break;
					case 'EstHeaderId':
						item.EstimateFilterType = 1;
						item.AssemblyCategoryId = null;
						break;
				}

				init(item);

				if(field === 'EstimateFilterType' || field === 'ProjectId'){
					service.loadSourceLineItems.fire(null);
					service.loadSourceAssemblies.fire(null);
				}else{
					if(getIsAssembly()){
						if(field === 'AssemblyCategoryId' || field === 'SearchText' || field === 'Records'){
							service.loadSourceAssemblies.fire(item);
						}
					}else{
						if(field === 'EstHeaderId' || field === 'SearchText' || field === 'Records'){
							service.loadSourceLineItems.fire(item);
						}
					}
				}
			}

			function getSelected()
			{
				selectedItem = getLocalPrjValue(selectedItem,true);					
				return selectedItem;
			}

			function setSelected(item)
			{
				item = getLocalPrjValue(item,false);
				selectedItem = item;				
			}

			let filters = [
				{
					key: 'estimate-main-copy-source-header-filter',
					serverSide: true,
					serverKey: 'estimate-main-copy-source-header-filter',
					fn: function() {
						let item = service.getSelected();
						return {
							projectId: item && angular.isDefined(item) ? item.ProjectId : null
						};
					}
				}
			];

			basicsLookupdataLookupFilterService.registerFilter(filters);

			/* jshint -W098 */ // callBackFn defined but never used
			service.registerSelectionChanged = function (/* callBackFn */) {
				service.dataModified.fire();
			};

			service.unregisterSelectionChanged = function (/* callBackFn */) {

			};

			service.registerDataModified = function (/* callBackFn */) {

			};

			service.unregisterDataModified = function (/* callBackFn */) {

			};

			init(defaultSelectedItem);

			// isNullCheck flag ensures that the additional null check for ProjectId is only applied when getLocalPrjValue is called from getSelected
			function getLocalPrjValue(selectedItem, isNullCheck) {
				if (!selectedItem) return;
	
				if(selectedItem.EstimateFilterType === 1 && selectedItem.ProjectId === undefined && (isNullCheck === false || selectedItem.ProjectId !== null)){					
					selectedItem.ProjectId = $injector.get('platformContextService').getApplicationValue(localStorageKey);
					isSelectedProject = selectedItem.ProjectId > 0;
				}

				return selectedItem;
			}		

			return service;
		}]);
})(angular);
