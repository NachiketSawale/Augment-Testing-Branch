/**
 * Created by winjit.deshkar on 19-10-2023.
 */

( function (angular) {
	/* global $ */
	'use strict';

	let moduleName = 'basics.costcodes';

	/**
	 * @ngdoc service
	 * @name basicsCostcodesDetailsStackLookup
	 * @function
	 *
	 * @description
	 * lookup to show the grouping resources details
	 */
	angular.module(moduleName).directive('basicsCostcodesDetailsStackLookup', ['BasicsLookupdataLookupDirectiveDefinition', 'estimateParamComplexLookupCommonService', 'basicsCostcodesDetailsStackCommonService',
		function (BasicsLookupdataLookupDirectiveDefinition, estimateParamComplexLookupCommonService, basicsCostcodesDetailsStackCommonService) {

			let defaults = {
				lookupType: 'basicsCostcodesDetailsStackLookup',
				valueMember: 'Code',
				displayMember: 'Code',
				showCustomInputContent: true, // show custom input content.
				formatter: estimateParamComplexLookupCommonService.displayFormatter, // return custom input content
				idProperty:'Id',
				uuid: '9d0d91dd571b442c9896cbe196e8d7e2',
				events: [
					{
						name: 'onInputGroupClick',
						handler: function (e) {
							if (e.target.className.indexOf('ico-parameter') === -1 && e.target.className.indexOf('ico-menu') === -1) {
								return;
							}
							// if this has been setted readonly,
							if(this.ngReadonly){
								return;
							}

							basicsCostcodesDetailsStackCommonService.openPopup(e, this);
						}
					}
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: {

					getList: function () {
						return [];
					},

					getItemByKey: function () {
						return null;
					},

					getDisplayItem: function () {
						return null;
					}
				},
				controller: ['$scope', function ($scope) { // do external logic to specific lookup directive controller here.
					$.extend($scope.lookupOptions, {
						buttons: [],
						showClearButton: false
					});
				}]
			});
		}
	]);
})(angular);
