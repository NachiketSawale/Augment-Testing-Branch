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
	angular.module(moduleName).constant('estimateMainCopySourceFilterTypeConstant',
		[
			{Id:1, Description : 'Project Estimate', Description$tr$ : 'estimate.main.projectEstimate', Default : true},
			{Id:2, Description : 'Assemblies', Description$tr$ : 'estimate.main.assemblies', Default : false}
		]);
})();
