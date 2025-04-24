(function (angular) {
	'use strict';

	const moduleName = 'project.main';
	/**
	 * @ngdoc service
	 * @name projectMainPictureValidationService
	 * @description provides validation
	 */
	angular.module(moduleName).service('projectMainPictureValidationService', ProjectMainPictureValidationService);

	ProjectMainPictureValidationService.$inject = ['_', 'projectMainPictureDataService'];

	function ProjectMainPictureValidationService(_, projectMainPictureDataService) {
		const self = this;

		self.validateIsDefault = function validateIsDefault(entity, value) {
			if(value) {
				_.filter(projectMainPictureDataService.getList(), 'IsDefault', true)
					.forEach(function(item) {
						item.IsDefault = false;
						projectMainPictureDataService.markItemAsModified(item);
						projectMainPictureDataService.fireItemModified(item);
					});
			}

			return { apply: value, valid: true };
		};
	}
})(angular);