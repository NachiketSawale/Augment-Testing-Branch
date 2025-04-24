/**
 * Created by mov on 1/16/2020.
 */
(function () {
	'use strict';
	/* global _, globals */
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainTotalsConfigStructureTypeService
	 * @function
	 *
	 * @description
	 * estimateMainTotalsConfigStructureTypeService provides all lookup data for estimate module totals config structure type lookup
	 */
	angular.module(moduleName).factory('estimateMainTotalsConfigStructureTypeServiceCostGroup', [
		'$q', '$http', '$translate', '$injector',
		function ($q, $http, $translate, $injector) {

			// selectedItemId the item will be showed
			let data = [], selectedItemId = '', mdcContextId, isReload, editType = '', costGroupType = 0;
			let service = {
				getList: getList,
				getItemById: getItemById,
				loadData: loadData,
				getItemByIdAsync: getItemByIdAsync,
				setSelectedItemId: setSelectedItemId,
				getSelectedItemId: getSelectedItemId,
				setMdcContextId: setMdcContextId,
				getMdcContextId: getMdcContextId,
				clearMdcContextId: clearMdcContextId,
				getItemByKey : getItemByKey,

				setEditType: setEditType,
				getEditType: getEditType,
				setCostGroupType: setCostGroupType // 5: Project : 6: enterprise
			};

			function setSelectedItemId(itemId){
				selectedItemId = itemId;
			}

			function getSelectedItemId(){
				return selectedItemId;
			}

			function getMdcContextId(){
				return mdcContextId;
			}

			function setMdcContextId(id) {
				if(id !== 0){
					mdcContextId = id;
				}
			}

			function clearMdcContextId(){
				mdcContextId = null;
			}

			function loadData(entity) {
				let defer = $q.defer();

				let prjId = 0;

				let leadStructures = [];
				let editType = $injector.get('estimateMainDialogProcessService').getDialogConfig().editType;

				if (entity.LeadingStr === 5){
					// ProjectCostGroup
					prjId = editType === 'customizefortotals' ? 0 : $injector.get('estimateMainService').getSelectedProjectId();

					getProjectCostGroups(prjId).then(function (result) {
						if(result && result.data){
							_.forEach(result.data, function (item) {
								leadStructures.push({Id: item.StructureName, Description: item.StructureName, mainId: item.RootItemId});
							});
							defer.resolve(leadStructures);
						}
					});
				}else if (costGroupType === 6){
					// EnterpriseCostGroup
					prjId = editType === 'customizefortotals' ? 0 : $injector.get('estimateMainService').getSelectedProjectId();

					return getEnterpriseCostGroups(prjId).then(function (result) {
						if(result && result.data){
							_.forEach(result.data, function (item) {
								leadStructures.push({Id: item.Id, Description: item.StructureName, mainId: item.RootItemId});
							});
							defer.resolve(leadStructures);
						}
					});
				}

				return defer.promise;
			}

			function getList() {

				let defer = $q.defer();

				defer.resolve(data);

				return defer.promise;
			}

			function getListAsync() {
				return service.loadData();
			}

			function getItemById(id) {
				let item = _.find(data, {'Id': id});
				return item;
			}

			function getItemByIdAsync(id) {
				return getListAsync().then(function () {
					return getItemById(id);
				});
			}

			function getItemByKey(id, options, scope) {
				if(data && data.length > 0 && isReload){
					isReload = false;
					return _.find(data, {'Id': id});
				}
				else{
					return loadData(scope.entity).then(function(){
						isReload = false;
						return _.find(data, {'Id': id});
					});
				}
			}

			function setEditType(value){
				editType = value;
			}

			function getEditType(){
				return editType;
			}

			function setCostGroupType(value, editType){
				data = [];

				costGroupType = value;

				let prjId = 0;
				let leadStructures = [];

				if (costGroupType === 5){
					// ProjectCostGroup
					prjId = editType === 'customizefortotals' ? 0 : $injector.get('estimateMainService').getSelectedProjectId();

					return getProjectCostGroups(prjId).then(function (result) {
						if(result && result.data){
							_.forEach(result.data, function (item) {
								leadStructures.push({Id: item.StructureName, Description: item.StructureName, mainId: item.RootItemId});
							});

							data = leadStructures;
						}
					});

				}else if (costGroupType === 6){
					// EnterpriseCostGroup
					prjId = editType === 'customizefortotals' ? 0 : $injector.get('estimateMainService').getSelectedProjectId();

					return getEnterpriseCostGroups(prjId).then(function (result) {
						if(result && result.data){
							_.forEach(result.data, function (item) {
								leadStructures.push({Id: item.Id, Description: item.StructureName, mainId: item.RootItemId});
							});

							data = leadStructures;
						}
					});
				}
			}

			function getProjectCostGroups(projectId){
				return $http.post(globals.webApiBaseUrl + 'estimate/main/lookup/getprojectcostgroups', {ProjectFk: projectId});
			}

			function getEnterpriseCostGroups(projectId){
				return $http.post(globals.webApiBaseUrl + 'estimate/main/lookup/getenterprisecostgroups', {ProjectFk: projectId});
			}

			return service;
		}]);
})();

