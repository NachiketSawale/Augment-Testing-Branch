/**
 * Created by xia on 9/11/2018.
 */

(function(){
	'use strict';

	let moduleName = 'estimate.rule';

	angular.module(moduleName).factory('estimateRuleAssignmentService', function () {
		let service = {};

		service.createNewEntity = function createNewEntity(item, isExecution) {

			let isExecutionValue = angular.isDefined(isExecution) ? isExecution : item.IsExecution;

			return {
				IsExecution: isExecutionValue,
				EstEvaluationSequenceFk: item.EstEvaluationSequenceFk,
				Comment: item.Comment,
				DescriptionInfo : item.DescriptionInfo,
				Operand: item.Operand,
				FormFk: item.FormFk,
				IsPrjRule : item.IsPrjRule,
				Id: item.OriginalMainId || item.MainId
			};
		};

		service.updateProperties = function updateProperties(item, updateInfo) {
			item.EstEvaluationSequenceFk = updateInfo.EstEvaluationSequenceFk;
			item.IsExecution = updateInfo.IsExecution;
			item.Comment = updateInfo.Comment;
			item.Operand = updateInfo.Operand;
		};

		return service;
	});

})();
