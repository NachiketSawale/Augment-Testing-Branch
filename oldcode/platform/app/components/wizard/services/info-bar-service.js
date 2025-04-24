(function (angular) {
	'use strict';

	angular.module('platform').factory('infoBarService', infoBarService);

	infoBarService.$inject = ['_'];

	function infoBarService(_) {
		var service = {};
		var infoArray = [];

		service.setInfo = function setInfo(info) {
			info.list = _.map(info.list, function (entity) {
				var displayMemberList = _.isArray(info.displayMember) ? info.displayMember : [info.displayMember];
				var displayValue;
				_.find(displayMemberList, function (dispMem) {
					displayValue = _.get(entity, dispMem);
					return _.isString(displayValue) ? displayValue.trim() : displayValue;
				});
				entity = _.extend(entity, {
					displayValue: displayValue,
					moduleName: info.moduleName,
					navigationEnabled: info.navigationEnabled
				});
				return entity;
			});

			info.list = _.filter(info.list, function (entity) {
				return entity.displayValue;
			});

			if (infoArray.length !== 0) {
				infoArray.pop();
			}
			infoArray.push(info);
		};

		service.getInfo = function getInfo() {
			return infoArray;
		};

		service.reset = function reset() {
			infoArray = [];
		};

		return service;
	}
})(angular);
