/**
 * @author: chd
 * @date: 3/23/2021 5:34 PM
 * @description:
 */
(function (angular) {
	'use strict';
	let moduleName = 'mtwo.aiconfiguration';

	/**
	 * @ngdoc service
	 * @name mtwoAIConfigurationConstantValues
	 * @function
	 *
	 * @description
	 * mtwoAIConfigurationConstantValues provides definitions and constants frequently used in ai configuration module
	 */
	angular.module(moduleName).value('mtwoAIConfigurationConstantValues', {
		parameterType: {
			input: 1,
			output: 2
		},
		uuid: {
			container: {
				modelList: '05c9e0602169424889b56326d65239b7',
				modelVersion: '79faf63ee34d40b6933c03ad000c5420',
				modelInput: 'f6b4194427ad4ee592aee8f15934111b',
				modelOutput: '592e58b7ca2d473ca5631e0ef90b356d'
			}
		}
	});
})(angular);
