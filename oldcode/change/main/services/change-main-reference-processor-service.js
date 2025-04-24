
(function (angular) {
	'use strict';
	var moduleName = 'change.main';

	/**
	 * @ngdoc service
	 * @name changeMainReferenceProcessorService
	 * @description processes items sent from server regarding data specific write protection of properties
	 */
	angular.module(moduleName).service('changeMainReferenceProcessorService', ChangeMainReferenceProcessorService);

	ChangeMainReferenceProcessorService.$inject = ['platformRuntimeDataService'];

	function ChangeMainReferenceProcessorService(platformRuntimeDataService) {
		var self = this;

		self.processItem = function processItem(item) {
			item.ReferenceFk = item.ChangeReferenceFk;
			item.ParentFk = item.ChangeFk;

			platformRuntimeDataService.readonly(item, [
				{
					field: 'ChangeAssignmentFk',
					readonly: item.AssignmentType === 0
				}]);
		};

		self.revertProcessItem = function revertProcessItem(item) {
			item.ChangeFk = item.ParentFk;
			item.ChangeReferenceFk = item.ReferenceFk;
			delete item.ParentFk;
			delete item.ReferenceFk;
		};
	}

})(angular);
