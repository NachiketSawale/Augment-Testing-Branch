(angular => {
	'use strict';
	const moduleName = 'productionplanning.configuration';

	angular.module(moduleName).service('ppsStatusTriggerRuleProcessor', processor);

	processor.$inject = [];

	function processor() {
		const separator = ',';
		const service = {};

		service.processItem = item => {
			deserializeSourceStatus(item);
		};

		service.revertProcessItem = item => {
			serializeSourceStatus(item);
		};

		function deserializeSourceStatus(item) {
			item.PossibleSourceStatus = deserialize(item.PossibleSourceStatus);
			item.RequiredSourceStatus = deserialize(item.RequiredSourceStatus);
		}

		function serializeSourceStatus(entity) {
			if (Array.isArray(entity) && entity.length > 0) {
				entity.forEach(i => serializeSourceStatus(i));
			} else if (entity) {
				entity.PossibleSourceStatus = join(entity.PossibleSourceStatus);
				entity.RequiredSourceStatus = join(entity.RequiredSourceStatus);
			}

			function join(status) {
				return !Array.isArray(status) ? status : status.join(separator);
			}
		}

		function deserialize(status) {
			if (Array.isArray(status)) {
				return status;
			}

			if (typeof status !== 'string' || status.length === 0) {
				return [];
			}

			return status.split(separator).map(i => parseInt(i, 10));
		}

		return service;
	}
})(angular);