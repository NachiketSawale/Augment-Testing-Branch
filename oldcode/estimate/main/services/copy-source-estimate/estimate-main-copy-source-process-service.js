(function () {

	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc constant
	 * @name estimateMainCopySourceFilterTypeConstant
	 * @function
	 *
	 * @description
	 * estimateMainCopySourceFilterTypeConstant are the possible selections for Copy Source Filter Type
	 */
	angular.module(moduleName).service('estimateMainCopySourceProcessService',
		['estimateMainResourceProcessor', 'platformRuntimeDataService',
			function (estimateMainResourceProcessor, platformRuntimeDataService){
				let service = {};

				service.processItem = function processItem(resItem) {
					estimateMainResourceProcessor.readOnly([resItem], true);
					platformRuntimeDataService.readonly(resItem, [{field: 'Rule' , readonly: true}, {field: 'Param' , readonly: true}]);
				};

				return service;

			}
		]);
})();
