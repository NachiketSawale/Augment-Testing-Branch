/**
 * Created by lvy on 4/25/2018.
 */

(function (angular) {
	'use strict';

	var modulename = 'constructionsystem.main';
	angular.module(modulename).directive('constructionSystemMainInstanceHeaderParameterValueLookup', [
		'$q',
		'BasicsLookupdataLookupDirectiveDefinition',
		'constructionSystemMainInstanceHeaderParameterLookupService',
		'parameterDataTypes',
		function (
			$q,
			BasicsLookupdataLookupDirectiveDefinition,
			constructionSystemMainInstanceHeaderParameterLookupService,
			parameterDataTypes
		) {
			var defaults = {
				lookupType: 'cosglobalparamvalue',
				valueMember: 'Id',
				displayMember: 'Description',
				filterKey: 'parameterfk-for-constructionsystem-main-instanceheaderparameter-filter',
				uuid: '58dfdfa373804b938fc2fee84bad1efa',
				columns: [
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						width: 150,
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'ParameterValue',
						field: 'ParameterValue',
						name: 'ParameterValue',
						width: 150,
						name$tr$: 'constructionsystem.main.entityParameterValue',
						formatter: function (row, cell, value, config, item) {

							switch (item.ParameterTypeFk){
								case parameterDataTypes.Date:
									if(isNaN(Date.parse(value))){
										return '';
									}
									var dt = new Date(value);
									var dtDate = dt.getDate();
									var dtDateString = dtDate < 10 ? '0' + dtDate : dtDate;
									var dtMonth = dt.getMonth()+ 1;
									var dtMonthString = dtMonth < 10 ? '0'+ dtMonth : dtMonth;
									var dtYear = dt.getFullYear();
									return dtDateString + '/' + dtMonthString + '/' + dtYear;
								default: break;
							}
							return value;
						}
					}
				],
				width: 80,
				height: 200,
				showClearButton: true
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults,{
				dataProvider: {
					getSearchList: constructionSystemMainInstanceHeaderParameterLookupService.getSearchList,
					getList: constructionSystemMainInstanceHeaderParameterLookupService.getList,
					getItemByKey: constructionSystemMainInstanceHeaderParameterLookupService.getItemByKey
				}
			});
		}
	]);
})(angular);