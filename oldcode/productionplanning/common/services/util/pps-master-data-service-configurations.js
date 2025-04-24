/**
 * Created by hof on 16/07/2020.
 */
/* global angular, _ */
(function () {
	'use strict';

	function masterDataDefaultConfigurations () {

		//clone config list!

		var configurationList = {
			list: []
		};

		var eventMasterDataConfiguration = {
			id: 'Event',
			itemName: 'MasterEvent',
			matchConfig: {
				'Id': 'Id'
			},
			propertyConfig: {
				endpoint: 'productionplanning/common/event/getCorePropertyList',
				propertyList: ['ModificationInfo']
			},
			dataProcessor : {
				typeName: 'EventDto',
				moduleSubModule: 'ProductionPlanning.Common'
			}
		};
		configurationList.list.push(eventMasterDataConfiguration);
		configurationList.get = function (id, overload) {
			var foundConfiguration = _.find(configurationList.list, {id: id});
			if (!_.isUndefined(foundConfiguration)) {
				return _.assign({}, foundConfiguration, overload);
			}
		};


		return configurationList;
	}

	angular.module('platform').constant('ppsMasterDataConfigurations', masterDataDefaultConfigurations());
})();