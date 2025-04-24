(function (angular) {
	'use strict';

	const modulemodel = 'basics.common';

	/**
	 * @ngdoc service
	 * @model basicsCommonWizardHelper
	 */
	angular.module(modulemodel).service('basicsCommonWizardHelper', BasicsCommonWizardHelper);

	function BasicsCommonWizardHelper($http, _) {

		let self = this;

		self.createStep = function createStep(stepTitleTranslationId, fieldList, topDescription) {
			let stub = getFormConfigStub();
			let step = {
				title$tr$: stepTitleTranslationId,
				form: stub,
				canFinish: false,
				id: stepTitleTranslationId,
				topDescription: topDescription
			};

			_.each(fieldList, function createStep(fieldObject) {
				stub.rows.push(createDomainRow(fieldObject));
			});
			return step;
		};

		function createDomainRow(fieldObject) {
			let row = {
				gid: 'group',
				rid: fieldObject.model,
				label$tr$: fieldObject.tr,
				model: fieldObject.model,
				type: fieldObject.domain,
				sortOrder: 0,
				options: fieldObject.domain === 'radio' ? fieldObject.options : null
			};
			if (fieldObject.options && fieldObject.domain !== 'radio') {
				row = _.merge(row, fieldObject.options);
			}
			return row;
		}

		function getFormConfigStub() {
			return {
				fid: '',
				version: '0.0.1',
				showGrouping: false,
				groups: [
					{
						gid: 'group',
						attributes: []
					}
				],
				rows: []
			};
		}
	}

	BasicsCommonWizardHelper.$inject = ['$http', '_'];

})(angular);
