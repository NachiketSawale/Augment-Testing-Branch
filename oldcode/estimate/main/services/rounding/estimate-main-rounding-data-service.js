/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	/* global _ */
	let moduleName = 'estimate.main';
	/** @ngdoc service
	 * @name estimateMainRoundingDataService
	 * @function
	 * @description
	 * estimateMainRoundingDataService is the data service for estimate related common functionality.
	 */

	angular.module(moduleName).factory('estimateMainRoundingDataService', [
		function () {

			let service = {
				setEstRoundingConfigData: setEstRoundingConfigData,
				setEstRoundingConfig: setEstRoundingConfig,
				setRoundingColumnIds: setRoundingColumnIds,
				getEstRoundingConfig: getEstRoundingConfig,
				getRoundingColumnIds: getRoundingColumnIds,
				mergeEstRoundingConfig: mergeEstRoundingConfig
			};
			let estRoundingConfig = [];
			let estLineItemRoundingColumnIds = [];

			function setEstRoundingConfig(roundingConfigData){
				estRoundingConfig = _.size(roundingConfigData) > 0 ? roundingConfigData : [];
			}

			function setRoundingColumnIds(roundingColumnIds){
				estLineItemRoundingColumnIds = roundingColumnIds;
			}

			function getEstRoundingConfig(){
				return estRoundingConfig;
			}

			function getRoundingColumnIds(){
				return estLineItemRoundingColumnIds;
			}

			function setEstRoundingConfigData(estRoundingConfigDetails)
			{
				estRoundingConfigDetails = estRoundingConfigDetails ? estRoundingConfigDetails : {};
				let roundingConfig = estRoundingConfigDetails.RoundingConfigDetails || [];
				let allColumnIds = estRoundingConfigDetails.EstRoundingColumnIds || [];

				setEstRoundingConfig(roundingConfig);

				if (_.size(allColumnIds) > 0 ){
					setRoundingColumnIds(allColumnIds);
				}
			}

			function mergeEstRoundingConfig(roundingConfigDetails){
				if(roundingConfigDetails && roundingConfigDetails.length){
					if(_.isArray(estRoundingConfig) && estRoundingConfig.length){
						_.forEach(roundingConfigDetails, function(detailItem){
							let oldItem = _.find(estRoundingConfig, {'ColumnId': detailItem.ColumnId});
							if (oldItem) {
								_.extend(oldItem, detailItem);
							}else{
								if(_.isArray(estRoundingConfig)){
									estRoundingConfig.push(detailItem);
								}
							}
						});
					}else{
						estRoundingConfig = roundingConfigDetails;
					}
				}
			}

			return service;
		}]);
})(angular);
