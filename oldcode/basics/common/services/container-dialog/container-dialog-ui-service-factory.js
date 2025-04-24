/**
 * Created by waz on 11/15/2017.
 */
(function (angular) {
	'use strict';

	const module = 'basics.common';
	angular
		.module(module)
		.factory('basicsCommonContainerDialogUiServiceFactory', BasicsCommonContainerDialogUiServiceFactory);
	BasicsCommonContainerDialogUiServiceFactory.$inject = ['_'];

	function BasicsCommonContainerDialogUiServiceFactory(_) {

		function createStaticUiService(uiService, filterKeys) {
			const fullColumns = uiService.getStandardConfigForListView().columns;
			let useColumns = _.filter(_.cloneDeep(fullColumns), function (o) {
				return _.includes(filterKeys, o.id);
			});
			useColumns = _.forEach(useColumns, function (o) {
				o.readonly = true;
				o.editor = null;
				o.navigator = null;
			});
			return {
				getStandardConfigForListView: function () {
					return {
						columns: useColumns
					};
				}
			};
		}

		return {
			'createStaticUiService': createStaticUiService
		};
	}
})(angular);