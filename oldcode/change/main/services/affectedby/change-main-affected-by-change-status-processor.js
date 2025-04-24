/**
 * Created by baf on 21.02.2021.
 */

(function (angular) {
	'use strict';

	var moduleName = 'change.main';

	/**
	 * @ngdoc service
	 * @name changeMainAffectedByChangeStatusProcessor
	 * @description provides validation methods for all kind of change entities
	 */
	angular.module(moduleName).service('changeMainAffectedByChangeStatusProcessor', ChangeMainAffectedByChangeStatusProcessor);

	ChangeMainAffectedByChangeStatusProcessor.$inject = ['_', 'changeMainService'];

	function ChangeMainAffectedByChangeStatusProcessor(_, changeMainService) {
		this.processItem = function processItem(item) {
			var selectedChange = changeMainService.getSelected();
			if(!_.isNil(selectedChange)) {
				item.PrjChangeStatusFk = selectedChange.ChangeStatusFk;
			}
		};
	}

})(angular);
