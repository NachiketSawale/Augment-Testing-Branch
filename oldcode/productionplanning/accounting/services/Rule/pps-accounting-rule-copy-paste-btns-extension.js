/**
 * Created by zwz on 2021/10/18.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.accounting';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningAccountingRuleCopyPasteBtnsExtension
	 * @function
	 * @requires _, $translate
	 * @description
	 * productionplanningAccountingRuleCopyPasteBtnsExtension provides copy and paste buttons for rule list controller
	 */
	angModule.service('productionplanningAccountingRuleCopyPasteBtnsExtension', Extension);
	Extension.$inject = ['_', '$http', '$translate'];

	function Extension(_, $http, $translate) {

		/**
		 * @ngdoc function
		 * @name createCopyPasteBtns
		 * @description Public function that creates copy-button and paste-button for rule list controller.
		 * @param {Object} service: The dataService that functionality of copy-button and paste-button depends on.
		 **/
		this.createCopyPasteBtns = function (service, doUpdateToolsFunc) {
			return [{
				id: 'copy',
				caption: 'cloud.common.toolbarCopy',
				iconClass: 'tlb-icons ico-copy',
				type: 'item',
				fn: function () {
					service.sourceRules = _.clone(service.getSelectedEntities());
					doUpdateToolsFunc();
				},
				disabled: function () {
					return !service.hasSelection();
				}
			}, {
				id: 'paste',
				caption: $translate.instant('cloud.common.toolbarPasteSelectedItem'),
				type: 'item',
				iconClass: 'tlb-icons ico-paste',
				fn: function () {
					$http.post(globals.webApiBaseUrl + 'productionplanning/accounting/rule/deepcopy', service.sourceRules)
						.then(function (response) {
							if (response.data && response.data.length > 0) {
								var parentItem = service.parentService().getSelected();
								_.forEach(response.data, (newItem)=>{
									newItem.RulesetFk = parentItem.Id;
									service.onCreateSucceeded(newItem);
								});
								doUpdateToolsFunc();
							}
						});
				},
				disabled: function () {
					return _.isNil(service.sourceRules);
				}
			}];
		};

		this.clearPasteData = function (service){
			service.sourceRules = null;
		};

	}
})(angular);
