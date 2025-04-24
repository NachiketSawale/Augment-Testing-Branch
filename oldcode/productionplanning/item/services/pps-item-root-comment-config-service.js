(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'productionplanning.item';
	angular.module(moduleName).service('productionplanningItemRootCommentConfigService', [
		'productionplanningItemDataService',
		function (productionplanningItemDataService) {
			var self = this;
			self.getConfig = function () {
				return {
					// lastUrl: globals.webApiBaseUrl + 'productionplanning/item/comments/last',
					// remainUrl: globals.webApiBaseUrl + 'productionplanning/item/comments/remain',
					// entityName: 'Comments',
					// dateProp: 'InsertedAt',
					// saveParentBefore: false,
					//parentService: productionplanningItemDataService,
					isPinBoardReadonly: false,
					getCommentParentId: function getCommentParentId(entity) {
						let list = productionplanningItemDataService.getList();
						let rootItem = entity;
						while (rootItem && rootItem.PPSItemFk !== null) {
							rootItem = _.find(list, {Id: rootItem.PPSItemFk});
						}
						return entity.PPSItemFk !== null ? rootItem.Id : entity.Id;
					}
				};
			};
		}
	]);
})(angular);
