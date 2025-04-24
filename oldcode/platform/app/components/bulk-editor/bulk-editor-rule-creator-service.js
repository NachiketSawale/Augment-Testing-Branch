(function (angular) {
	'use strict';

	angular.module('platform').service('platformBulkEditorRuleCreatorService', platformBulkEditorRuleCreatorService);

	platformBulkEditorRuleCreatorService.$inject = ['_'];

	function platformBulkEditorRuleCreatorService(_) {
		const self = this;

		self.getRuleForType = function getRuleForType(typeData) {
			if (!_.isObject(typeData)) {
				throw new Error('typeData');
			}
			let rules;
			switch (typeData.type) {
				case 'copyValue':
					rules = {
						BulkGroup: [[{
							Children: [{
								Id: -1,
								OperatorFk: typeData.selectedColumn.domain === 'translation' ? 34 : 28,
								Operands: [
									{NamedProperty: {FieldName: typeData.selectedColumn.field.toLowerCase()}},
									{Literal: {String: typeData.copyValue}}
								]
							}]
						}]]
					};

					break;
				case 'pasteValue':
					rules = {
						BulkGroup: [[{
							Children: [{
								Id: -1,
								OperatorFk: 28,
								Operands: [
									{NamedProperty: {FieldName: typeData.selectedColumn.field.toLowerCase()}},
									{Literal: {String: typeData.pasteValue}}
								]
							}]
						}]]
					};

					break;
				default:
					throw new Error('');
			}
			return rules;
		};
	}
})(angular);
