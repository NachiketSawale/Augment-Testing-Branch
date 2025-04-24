
(function () {

	'use strict';
	angular.module('qto.main').directive('qtoDetailCommentTypeSelector', ['_', '$injector','moment', '$q', 'qtoDetailCommentTypeLookupDataService', 'BasicsLookupdataLookupDirectiveDefinition',
		function (_,$injector, moment, $q, qtoDetailCommentTypeLookupDataService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				version:2,
				lookupType: 'qtoDetailCommentTypeSelector',
				valueMember: 'Id',
				events: [

					{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							let selectedItem = angular.copy(args.selectedItem);
							if(args.entity && selectedItem) {
								args.entity.IsDelete =selectedItem.IsDelete;

								let qtoDetailCommentsService = $injector.get('qtoDetailCommentsService');
								qtoDetailCommentsService.refreshBtn.fire();
							}
						}
					}
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults,{
				dataProvider: {
					myUniqueIdentifier: 'qtoCommentsTypeLookupHandler',

					getList: function getList() {
						return qtoDetailCommentTypeLookupDataService.getcommentTypeList().then(function (data) {
							return _.filter(data, function(item){
								return item.IsWrite && item.IsCreate && item.IsRead;
							});
						});
					},

					getDefault: function getDefault() {
						return $q.when([]);
					},

					getItemByKey: function getItemByKey(value) {
						return qtoDetailCommentTypeLookupDataService.getItemById(value);
					},

					getSearchList: function getSearchList() {
						return qtoDetailCommentTypeLookupDataService.getcommentTypeList().then(function (data) {
							data = _.filter(data, function(item){
								return item.IsWrite && item.IsCreate && item.IsRead;
							});

							return data;
						});
					}
				}
			});
		}
	]);

})();
