/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let timekeepingWorkTimeModelModule = angular.module('timekeeping.worktimemodel');

	/**
	 * @ngdoc service
	 * @name timekeepingWorktimemodelContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	timekeepingWorkTimeModelModule.service('timekeepingWorktimemodelContainerInformationService', ['$injector', 'platformLayoutHelperService',
		'basicsLookupdataConfigGenerator',
		function ($injector, platformLayoutHelperService, basicsLookupdataConfigGenerator) {
			let self = this;


			/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
			this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				let config = {};

				switch (guid) {
					case '990a46ae64d74fa4ae226a74730c5ccf':// timekeepingWorkTimeModelListController
						config = platformLayoutHelperService.getStandardGridConfig(self.getWorkTimeModelServiceInfos(), self.getWorkTimeModelLayout);
						break;
					case 'ad495e8fb0ff4cf09296789ee58fd6af': // timekeepingWorkTimeModelDetailController
						config = platformLayoutHelperService.getStandardDetailConfig(self.getWorkTimeModelServiceInfos(), self.getWorkTimeModelLayout);
						break;

					case '099dbd22e4334b27af27d080bee3dd65':// timekeepingWorkTimeDerivationListController
						config = platformLayoutHelperService.getStandardGridConfig(self.getWorkTimeDerivationServiceInfos(), self.getWorkTimeDerivationLayout);
						break;
					case 'f9bd8c7b94a74663900f47f8a2a5bb9e':// timekeepingWorkTimeDerivationDetailController
						config = platformLayoutHelperService.getStandardDetailConfig(self.getWorkTimeDerivationServiceInfos(), self.getWorkTimeDerivationLayout);
						break;

					case '2c97189d84574b82a555e20301529c1c':// timekeepingWorkTimeModelDayListController
						config = platformLayoutHelperService.getStandardGridConfig(self.getWorkTimeModelDayServiceInfos(), self.getWorkTimeModelDayLayout);
						break;
					case 'e31e2637059e41d4a32856fb2126bdd5':// timekeepingWorkTimeModelDayDetailController
						config = platformLayoutHelperService.getStandardDetailConfig(self.getWorkTimeModelDayServiceInfos(), self.getWorkTimeModelDayLayout);
						break;

					case 'b49b64d4b0204eb190350168633ef306':// timekeepingWorkTimeModelDtlListController
						config = platformLayoutHelperService.getStandardGridConfig(self.getWorkTimeModelDtlServiceInfos(), self.getWorkTimeModelDtlLayout);
						break;
					case '7a1e913380024d598a65902a6e24fc27':// timekeepingWorkTimeModelDtlDetailController
						config = platformLayoutHelperService.getStandardDetailConfig(self.getWorkTimeModelDtlServiceInfos(), self.getWorkTimeModelDtlLayout);
						break;

						// TimeSymbol 2 Worktime Model
					case 'b3aa28b1d5db4b4b884679a95c3a32b8':// timekkepingTimeSymbol2WorktimeMdlListController
						config =  platformLayoutHelperService.getStandardGridConfig(self.getTimeSymbol2WorkTimeModelServiceInfos(), self.getTimeSymbol2WorkTimeModelLayout);
						break;
					case '79369d99b969492b830da0e62aea78bd':// timekkepingTimeSymbol2WorktimeMdlDetailController
						config =  platformLayoutHelperService.getStandardDetailConfig(self.getTimeSymbol2WorkTimeModelServiceInfos(), self.getTimeSymbol2WorkTimeModelLayout);
						break;
				}

				return config;
			};

			this.getWorkTimeModelServiceInfos = function getWorkTimeModelServiceInfos() {
				return {
					standardConfigurationService: 'timekeepingWorkTimeModelLayoutService',
					dataServiceName: 'timekeepingWorkTimeModelDataService',
					validationServiceName: 'timekeepingWorkTimeModelValidationService'
				};
			};

			this.getWorkTimeDerivationServiceInfos = function getWorkTimeDerivationServiceInfos() {
				return {
					standardConfigurationService: 'timekeepingWorkTimeDerivationLayoutService',
					dataServiceName: 'timekeepingWorkTimeDerivationDataService',
					validationServiceName: 'timekeepingWorkTimeModelDerivationValidationService'
				};
			};

			this.getWorkTimeModelDayServiceInfos = function getWorkTimeModelDayServiceInfos() {
				return {
					standardConfigurationService: 'timekeepingWorkTimeModelDayLayoutService',
					dataServiceName: 'timekeepingWorkTimeModelDayDataService',
					validationServiceName: 'timekeepingWorkTimeModelDayValidationService'
				};
			};

			this.getWorkTimeModelDtlServiceInfos = function getWorkTimeModelDtlServiceInfos() {
				return {
					standardConfigurationService: 'timekeepingWorkTimeModelDetailLayoutService',
					dataServiceName: 'timekeepingWorkTimeModelDtlDataService',
					validationServiceName: 'timekeepingWorkTimeModelDtlValidationService'
				};
			};

			this.getTimeSymbol2WorkTimeModelServiceInfos = function getTimeSymbol2WorkTimeModelServiceInfos() {
				return {
					standardConfigurationService: 'timekeepingTimeSymbol2WorkTimeModelLayoutService',
					dataServiceName: 'timekeepingTimeSymbol2WorkTimeModelDataService',
					validationServiceName: 'timekeepingTimeSymbol2WorkTimeModelValidationService'
				};
			};

			this.getWorkTimeModelLayout = function getWorkTimeModelLayout() {
				let res = platformLayoutHelperService.getBasisLayoutConfigObject('1.0.0', 'timekeeping.worktimemodel',
					['isdefault', 'descriptioninfo', 'sorting', 'weekendson', 'commenttext', 'isstatussensitive', 'vactionyearstart', 'vactionexpirydate','isfallback','workingtimemodelfbfk']);
				res.overloads = platformLayoutHelperService.getOverloads(['weekendson','workingtimemodelfbfk'], self);
				return res;
			};

			this.getWorkTimeDerivationLayout = function getWorkTimeDerivationLayout() {
				let res = platformLayoutHelperService.getBasisLayoutConfigObject('1.0.0', 'timekeeping.worktimemodel.derivation',
					['timesymbolfk', 'weekdayindex', 'fromtime', 'totime', 'fromquantity', 'toquantity', 'timesymbolderivedfk']);
				res.overloads = platformLayoutHelperService.getOverloads(['weekdayindex', 'timesymbolfk', 'timesymbolderivedfk'], self);
				return res;
			};


			this.getWorkTimeModelDayLayout = function getWorkTimeModelDayLayout() {
				let res = platformLayoutHelperService.getBasisLayoutConfigObject('1.0.0', 'timekeeping.worktimemodel.day',
					['validfrom', 'targethours', 'weekdayindex']);
				res.overloads = platformLayoutHelperService.getOverloads(['weekdayindex'], self);
				return res;
			};

			this.getWorkTimeModelDtlLayout = function getWorkTimeModelDtlLayout() {
				let res = platformLayoutHelperService.getFiveGroupsBaseLayout('1.0.0', 'timekeeping.worktimemodel.dtl',
					['validfrom','timesymbolleveltimesfk'],
					{
						gid: 'limits',
						attributes: ['weeklylimit','monthlylimit']
					},
					{
						gid: 'timeSymbolLimits',
						attributes: ['timesymbolbdl1fk', 'timesymbolbdl2fk','timesymbolrecapblfk','timesymbolrecapulfk']
					},
					{
						gid: 'savingLimits',
						attributes: ['lowerdailysavinglimit', 'upperdailysavinglimit','weeklysavinglimit','monthlysavinglimit','yearlysavinglimit','accountminlimit','accountmaxlimit']
					},
					{
						gid: 'timeSymbolSavingLimits',
						attributes: ['timesymbolblsl1fk', 'timesymbolblsl2fk','timesymbolbusl1fk','timesymbolbusl2fk','timesymbolasl1fk','timesymbolasl2fk','timesymboloml1fk','timesymboloml2fk']
					},
					platformLayoutHelperService.getUserDefinedTextGroup(5, 'userDefTextGroup', 'userdefined', ''));

				res.overloads = platformLayoutHelperService.getOverloads(['timesymbolbusl1fk', 'timesymbolbusl2fk', 'timesymbolasl1fk', 'timesymbolasl2fk', 'timesymboloml1fk',
					'timesymboloml2fk', 'timesymbolrecapblfk', 'timesymbolrecapulfk','timesymbolbdl1fk','timesymbolbdl2fk','timesymbolblsl1fk','timesymbolblsl2fk','timesymbolleveltimesfk','weeklylimit','monthlylimit',
					'lowerdailysavinglimit', 'upperdailysavinglimit','weeklysavinglimit','monthlysavinglimit','yearlysavinglimit','accountminlimit','accountmaxlimit'], self);
				return res;
			};
			this.getTimeSymbol2WorkTimeModelLayout = function getTimeSymbol2WorkTimeModelLayout(){
				let res = platformLayoutHelperService.getBasisLayoutConfigObject('1.0.0', 'timekeeping.worktimemodel.ts2wtm',
					['timesymbolfk', 'workingtimemodelfk','evaluatepositivehour','commenttext']);
				res.overloads = platformLayoutHelperService.getOverloads(['timesymbolfk','workingtimemodelfk'], self);
				return res;
			};


			this.getOverload = function getOverload(overload) {
				let ovl = null;
				switch (overload) {
					case 'weekendson':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'schedulingLookupCalendarWeekdayDataService'

						});
						break;

					case 'timesymbolfk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'timekeepingTimeSymbolLookupDataService'
						});
						break;
					case 'workingtimemodelfk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'timekeepingWorkTimeModelLookupDataService',
						});
						break;
					case 'weekdayindex':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'schedulingLookupCalendarWeekdayDataService'

						});
						break;
					case 'weeklylimit':
					case 'monthlylimit':
					case 'lowerdailysavinglimit':
					case 'upperdailysavinglimit':
					case 'weeklysavinglimit':
					case 'monthlysavinglimit':
					case 'yearlysavinglimit':
					case 'accountminlimit':
					case 'accountmaxlimit':
						ovl = {editorOptions: {allownull: true}};
						break;
					case 'timesymbolderivedfk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'timekeepingTimeSymbolLookupDataService'
						});
						break;
					case 'timesymbolbusl1fk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'timekeepingTimeSymbolLookupDataService'
						});
						break;
					case 'timesymbolbusl2fk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'timekeepingTimeSymbolLookupDataService'
						});
						break;
					case 'timesymbolbdl1fk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'timekeepingTimeSymbolLookupDataService'
						});
						break;
					case 'timesymbolbdl2fk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'timekeepingTimeSymbolLookupDataService'
						});
						break;
					case 'timesymbolblsl1fk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'timekeepingTimeSymbolLookupDataService'
						});
						break;
					case 'timesymbolblsl2fk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'timekeepingTimeSymbolLookupDataService'
						});
						break;

					case 'timesymbolasl1fk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'timekeepingTimeSymbolLookupDataService'
						});
						break;
					case 'timesymbolasl2fk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'timekeepingTimeSymbolLookupDataService'
						});
						break;
					case 'timesymboloml1fk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'timekeepingTimeSymbolLookupDataService'
						});
						break;
					case 'timesymboloml2fk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'timekeepingTimeSymbolLookupDataService'
						});
						break;
					case 'timesymbolrecapblfk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'timekeepingTimeSymbolLookupDataService'
						});
						break;

					case 'timesymbolrecapulfk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'timekeepingTimeSymbolLookupDataService'
						});
						break;
					case 'timesymbolleveltimesfk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'timekeepingTimeSymbolLookupDataService'
						});
						break;
						//
					case 'workingtimemodelfbfk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'timekeepingWorkTimeModelFbLookupDataService',
						});
						break;
				}
				return ovl;
			};
		}
	]);
})(angular);
