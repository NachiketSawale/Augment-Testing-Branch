(function () {
	/* global globals */
	'use strict';

	let moduleName = 'timekeeping.recording';
	/**
	 * @ngdoc service
	 * @name timekeepingRoundingConfigDataService
	 * @function
	 *
	 * @description
	 * This is the data service for Timekeeping Rounding Configuration dialog functions.
	 */
	angular.module(moduleName).factory('timekeepingRoundingConfigDataService', ['$http', '$injector', '_', 'PlatformMessenger', 'timekeepingRoundingConfigDetailDataService',
		function ($http, $injector, _,PlatformMessenger, roundingConfigDetailDataService) {

			let currentItem = {},
				completeData = {},
				isRoundingConfigInUse = false,
				modified = false;

			let service = {
				load:load,
				setData : setData,
				clear : clear,
				updateRoundingConfigDetails : updateRoundingConfigDetail,
				getRoundingConfig:getRoundingConfig,
				getRoundingConfigDetail:getRoundingConfigDetail,
				provideUpdateData : provideUpdateData,
				isReadOnly: isReadOnly,
				maintainReadOnlyState: maintainReadOnlyState,
				getCurrentItem: getCurrentItem,
				isModified: isModified,
				setModified: setModified,
				onItemChange : new  PlatformMessenger()
			};

			return service;


			// load complete tks Rounding Config by typeId
			function load(typeId){
				return $http.get(globals.webApiBaseUrl + 'timekeeping/recording/roundingconfig/gettksroundingconfigbyid?id='+typeId).then(function(response){
					setData(response.data);
					return currentItem;
				});
			}

			function resetCurrentItem(item) {
				if(_.isObject(item)) {
					Object.keys(item).forEach(key => delete item[key]);
					item.roundingConfigTypeFk = null;
					item.roundingConfigDesc = null;
					item.roundingConfigDetail = [];
				}
			}

			// set timekeeping config type, config data
			function setData(data){

				if(!_.isObject(data) || _.isEmpty(data)) {
					completeData = {};

					// !! Attention !!
					// For the current item is potentially already delivered as "dataItem" to the corresponding rounding dialog config
					// we cannot set a new empty currentItem object here for this would break the connection to the dialog form.
					// So we simply reset the properties to an initial state.
					resetCurrentItem(currentItem);

					isRoundingConfigInUse = false;
					service.onItemChange.fire(currentItem);
					return currentItem;
				}

				completeData = data;
				currentItem.roundingConfigTypeFk = _.isObject(completeData.RoundingConfigType) ? completeData.RoundingConfigType.Id : null;
				currentItem.roundingConfigDesc = !_.isEmpty(completeData.RoundingConfig) ? completeData.RoundingConfig.DescriptionInfo.Translated : null;
				currentItem.roundingConfigDetail = completeData.RoundingConfigDetail ? [completeData.RoundingConfigDetail]: [];
				isRoundingConfigInUse = data.IsRoundingConfigInUse;

				service.onItemChange.fire(currentItem);

				// Maintain readonly state of different properties
				maintainReadOnlyState();

				return currentItem;
			}

			function maintainReadOnlyState() {
				let platformRuntimeDataService = $injector.get('platformRuntimeDataService');
				let allFields = ['roundingConfigTypeFk', 'roundingConfigDesc'];
				let fields = _.map(allFields, function (field) {
					let isReadonly = false;
					if(field === 'roundingConfigDesc') {
						isReadonly = isRoundingConfigInUse;
					}

					return {field: field, readonly: isReadonly};
				});

				platformRuntimeDataService.readonly(currentItem); // clear previous readonly state
				platformRuntimeDataService.readonly(currentItem, fields);
			}

			// provide current timekeeping config type, config updateData
			function provideUpdateData(data){
				angular.extend(data, completeData);
				if(!data.RoundingConfig){
					data.RoundingConfig = {'DescriptionInfo':{}};
				}
				data.RoundingConfig.DescriptionInfo.Description = currentItem.roundingConfigDesc;
				data.RoundingConfig.DescriptionInfo.Translated = currentItem.roundingConfigDesc;
				data.RoundingConfig.DescriptionInfo.Modified = true;
				data.RoundingConfigDetail = angular.copy(roundingConfigDetailDataService.getItemsToSave());
				roundingConfigDetailDataService.clear();
				data.IsRoundingConfigInUse = isRoundingConfigInUse;
			}

			function getRoundingConfig(){
				return completeData.RoundingConfig;
			}

			function getRoundingConfigDetail(){
				return [completeData.RoundingConfigDetail];
			}

			function isReadOnly() {
				return isRoundingConfigInUse;
			}

			function updateRoundingConfigDetail(items){
				completeData.RoundingConfigDetail = items;
				currentItem.RoundingConfigDetail = items;
				// service.onItemChange.fire(currentItem);
			}

			function getCurrentItem() {
				return currentItem;
			}

			function setModified(ismodified) {
				modified = ismodified;
			}

			function isModified() {
				return modified;
			}

			function clear(){
				// The following approach is taken for the sake of keeping the according object reference alive, but deleting its properties
				Object.keys(currentItem).forEach(key => delete currentItem[key]);
				Object.keys(completeData).forEach(key => delete completeData[key]);
			}
		}
	]);
})();
