/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var timekeepingCommonModule = angular.module('timekeeping.common');

	/**
	 * @ngdoc service
	 * @name timekeepingCommonContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	timekeepingCommonModule.service('timekeepingCommonContainerInformationService', TimekeepingCommonContainerInformationService);

	TimekeepingCommonContainerInformationService.$inject = [];

	function TimekeepingCommonContainerInformationService() {
		// var self = this;
		// var guids = timekeepingCommonConstantValues.uuid.container;
		/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
		this.getContainerInfoByGuid = function getContainerInfoByGuid(/* guid */) {
			var config = {};
			/*
			switch (guid) {
				case guids.xYZ_List: //xYZ_ListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getXYZServiceInfos(), self.getXYZLayout);
					break;
				case guids.xYZ_Details: //xYZ_DetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getXYZServiceInfos(), self.getXYZLayout);
					break;
			}
			*/
			return config;
		};

		/*
		this.getXYZServiceInfos = function getXYZServiceInfos() {
			return {
				standardConfigurationService: 'xYZ_LayoutService',
				dataServiceName: 'xYZ_DataService',
				validationServiceName: 'xYZ_ValidationService'
			};
		};

		this.getXYZLayout = function getXYZLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'timekeeping.common.xyz',
				['code','abcfk','specification','icon','isdefault','islive','sorting','procurementstructuretypefk']);

			res.overloads = platformLayoutHelperService.getOverloads(['abcfk'], self);

			return res;
		};

		this.getOverload = function getOverloads(overload) {
			var ovl = null;

			switch (overload) {
				case 'account01fk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.accounting');
					break;
			}

			return ovl;
		}
*/
	}
})(angular);
