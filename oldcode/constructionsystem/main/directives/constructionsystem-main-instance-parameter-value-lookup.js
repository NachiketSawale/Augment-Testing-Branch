/**
 * Created by xsi on 2016-03-31.
 */
/* jshint -W072 */
(function (angular) {
	'use strict';
	angular.module('constructionsystem.main').directive('constructionSystemMainInstanceParameterValueLookup',
		['$q',  'BasicsLookupdataLookupDirectiveDefinition', 'constructionSystemMainInstanceParameterLookupService', 'parameterDataTypes',
			function ($q,  BasicsLookupdataLookupDirectiveDefinition, constructionSystemMainInstanceParameterLookupService, parameterDataTypes) {

				var defaults = {
					lookupType: 'CosMainInstanceParameterValue',
					valueMember: 'Id',
					displayMember: 'Description',
					filterKey: 'parameterfk-for-constructionsystem-main-instanceparameter-filter',
					uuid: '08ee8dd0147f49dd858434b065455fc3',
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

								switch(item.ParameterTypeFk){
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

				return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
					dataProvider: {
						getSearchList: constructionSystemMainInstanceParameterLookupService.getSearchList,
						getList: constructionSystemMainInstanceParameterLookupService.getList,
						getItemByKey: constructionSystemMainInstanceParameterLookupService.getItemByKey
					}
				});
			}]);
})(angular);
