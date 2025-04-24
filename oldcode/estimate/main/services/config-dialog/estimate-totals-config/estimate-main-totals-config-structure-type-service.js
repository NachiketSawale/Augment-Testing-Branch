/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global _ */
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainTotalsConfigStructureTypeService
	 * @function
	 *
	 * @description
	 * estimateMainTotalsConfigStructureTypeService provides all lookup data for estimate module totals config structure type lookup
	 */
	angular.module(moduleName).factory('estimateMainTotalsConfigStructureTypeService', [
		'$q', '$http', '$translate',
		function ($q, $http, $translate) {

			// selectedItemId the item will be showed
			let data = [], selectedItemId = '', mdcContextId, isReload;
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
				getItemByKey : getItemByKey
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

			function loadData() {
				let leadStructures = [
					{Id: 1, Description: $translate.instant('basics.customize.boqHeaderFk')},
					{Id: 2, Description: $translate.instant('basics.customize.psdActivityFk')},
					{Id: 3, Description: $translate.instant('basics.customize.prjLocationFk')},
					{Id: 4, Description: $translate.instant('basics.customize.mdcControllingUnitFk')},

					{Id: 5, Description: $translate.instant('estimate.main.costGroupTitle1')},
					{Id: 6, Description: $translate.instant('estimate.main.costGroupTitle2')}
				];

				data = leadStructures;

				return $q.when(leadStructures);
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

			function getItemByKey(id) {
				if(data && data.length > 0 && isReload){
					isReload = false;
					return _.find(data, {'Id': id});
				}
				else{
					return loadData().then(function(){
						isReload = false;
						return _.find(data, {'Id': id});
					});
				}
			}

			return service;
		}]);
})();

