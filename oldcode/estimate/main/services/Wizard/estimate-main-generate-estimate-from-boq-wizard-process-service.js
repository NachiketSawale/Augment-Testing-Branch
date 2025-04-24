/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name estimateMainGenerateEstimateFromBoqWizardProcessService
	 * @function
	 * @requires platformRuntimeDataService
	 *
	 * @description
	 * estimateMainGenerateEstimateFromBoqWizardProcessService is the service to set grid details readonly or editable.
	 *
	 */

	angular.module('estimate.main').factory('estimateMainGenerateEstimateFromBoqWizardProcessService',
		['_', 'platformRuntimeDataService',
			function (_, platformRuntimeDataService) {

				let service = {};

				angular.extend(service, {
					processItem: processItem,
					setFieldReadOnly: setFieldReadOnly
				});

				return service;

				function processItem(item,field) {
					if (field === 'Type' && item.Type === 2) {
						setFieldReadOnly(item, 'EstHeaderId', true);
						platformRuntimeDataService.applyValidationResult({
							valid: true,
							apply: true,
						}, item, 'EstHeaderId');
						resetFields(item);
					}
					if (field === 'Type' && item.Type === 1) {
						setFieldReadOnly(item, 'EstHeaderId', false);
						platformRuntimeDataService.applyValidationResult({
							valid: false,
							error: '...',
							error$tr$: 'estimate.main.estimateCodeEmptyErrMsg'
						}, item, 'EstHeaderId');
						resetFields(item);
					}
				}

				function setFieldReadOnly(item, column, readonly) {
					let fields = [{field: column, readonly: readonly}];
					platformRuntimeDataService.readonly(item, fields);
				}

				function resetFields(item)
				{
					if (Object.prototype.hasOwnProperty.call(item,'ProjectWicId')) {

						item.ProjectWicId = null;
					}
					if (Object.prototype.hasOwnProperty.call(item,'EstHeaderId')) {
						item.EstHeaderId = null;
					}
					if (Object.prototype.hasOwnProperty.call(item,'SourceBoqHeaderFk')) {
						item.SourceBoqHeaderFk = null;
					}
					if (Object.prototype.hasOwnProperty.call(item,'RootItemId')) {
						item.RootItemId = null;
					}
					if (Object.prototype.hasOwnProperty.call(item,'BoqRootItemDescription')) {
						item.BoqRootItemDescription = null;
					}
				}
			}]);
})(angular);
