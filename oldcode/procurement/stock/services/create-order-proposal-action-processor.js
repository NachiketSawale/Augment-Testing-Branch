/**
 * Created by jhe on 10/10/2018.
 */
// eslint-disable-next-line func-names
// eslint-disable-next-line no-redeclare
/* global angular */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.stock';

	/**
     * @ngdoc service
     * @name createOrderProposalActionProcessor
     * @function
     *
     * @description
     * The modelProjectFileActionProcessor translates an action string into a list of actions descriptions usable by an action  formatter
     */

	angular.module(moduleName).service('createOrderProposalActionProcessor', CreateOrderProposalActionProcessor);

	CreateOrderProposalActionProcessor.$inject = ['_', 'procurementStockShowOrderProposalDialogService'];

	function CreateOrderProposalActionProcessor(_, procurementStockShowOrderProposalDialogService) {
		var service = this;

		this.provideActionSpecification = function provideActionSpecification(actionList, state) {
			{
				if (state !== -1) {
					var icon;
					switch (state) {
						case 0:
							icon = 'status-icons ico-status03';
							break;
						case 1:
							icon = 'status-icons ico-status02';
							break;
						default:
							break;
					}
					/** @namespace procurementStockShowOrderProposalDialogService.showOrderProposal */
					actionList.push({
						toolTip: 'Show Order Proposal',
						icon: icon,
						callbackFn: procurementStockShowOrderProposalDialogService.showOrderProposal
					});
				}

			}
		};

		this.processItem = function processItem(type) {
			if(_.isNil(type.OrderProposalStatuses)) {
				type.OrderProposalStatuses = {};
			}
			type.OrderProposalStatuses.actionList = [];
			service.provideActionSpecification(type.OrderProposalStatuses.actionList, type.OrderProposalStatus);
		};

		this.revertProcessItem = function revertProcessItem(type) {
			type.OrderProposalStatuses.length = 0;
			delete type.OrderProposalStatuses;
		};
	}
})(angular);
