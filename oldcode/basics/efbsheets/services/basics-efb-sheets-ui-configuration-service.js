/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
     * @ngdoc service
     * @name basicsEfbsheetsUIConfigurationService
     * @function
     *
     * @description
     * basicsEfbsheetsUIConfigurationService is the config service for all Efb Sheets views.
     */
	angular.module('basics.efbsheets').factory('basicsEfbsheetsUIConfigurationService', ['$injector', 'basicsLookupdataConfigGenerator',
		function ($injector, basicsLookupdataConfigGenerator) {

			return {
				getBasicsEfbSheetsDetailLayout: function () {
					return {
						'fid': 'basics.efbsheets.detailform',
						'version': '1.0.0',
						'showGrouping': true,
						'addValidationAutomatically': true,
						'groups': [
							{
								'gid': 'basicData',
								'attributes': ['code', 'descriptioninfo', 'totalhours', 'workingdaysmonths', 'hoursday', 'crewsize', 'crewaverage', 'wageincrease1', 'wageincrease2', 'wagepincrease1', 'wagepincrease2','hourpincrease1','hourpincrease2', 'extrapay', 'averagestandardwage', 'totalsurcharge', 'crewmixaf','totalextracost','crewmixafsn','currencyfk','commenttext']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							'code': {
								'mandatory': true,
								'searchable': true
							},
							'totalhours': {
								'change': 'change'
							},
							'workingdaysmonths': {
								'change': 'change'
							},
							'hoursday':{
								'change': 'change'
							},
							'crewsize':{
								'readonly': true,'grouping':{'generic':false}
							},
							'crewaverage':{
								'readonly': true,'grouping':{'generic':false}
							},
							'wageincrease1':{
								'change': 'change', 'readonly': true
							},
							'wageincrease2':{
								'change': 'change', 'readonly': true
							},
							'extrapay':{
								'change': 'change'
							},
							'averagestandardwage':{
								'readonly': true,'grouping':{'generic':false}
							},'totalsurcharge':{
								'readonly': true,'grouping':{'generic':false}
							},
							'crewmixaf':{
								'readonly': true,'grouping':{'generic':false}
							},
							'totalextracost':{
								'readonly': true,'grouping':{'generic':false}
							},
							'crewmixafsn':{
								'readonly': true,'grouping':{'generic':false}
							},
							'currencyfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCurrencyLookupDataService',
								enableCache: true
							})
						}
					};
				}
			};
		}
	]);
})(angular);