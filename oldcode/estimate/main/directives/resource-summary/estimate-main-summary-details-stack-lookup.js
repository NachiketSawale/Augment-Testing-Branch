/**
 * Created by bel on 08.15.2018.
 */

( function (angular) {
	/* global $ */
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainSummaryDetailsStackLookup
	 * @function
	 *
	 * @description
	 * lookup to show the grouping resources details
	 */
	angular.module(moduleName).directive('estimateMainSummaryDetailsStackLookup', ['BasicsLookupdataLookupDirectiveDefinition', 'estimateParamComplexLookupCommonService', 'estimateMainResourceDetailStackCommonService',
		function (BasicsLookupdataLookupDirectiveDefinition, estimateParamComplexLookupCommonService, estimateMainResourceDetailStackCommonService) {


			let defaults = {
				lookupType: 'estimateMainSummaryDetailsStackLookup',
				valueMember: 'Code',
				displayMember: 'Code',
				showCustomInputContent: true, // show custom input content.
				formatter: estimateParamComplexLookupCommonService.displayFormatter, // return custom input content
				idProperty:'Id',
				uuid: '8c2709e273ef401d9b45493c8e1c85b5',
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

							estimateMainResourceDetailStackCommonService.openPopup(e, this);
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
