/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	/* global globals */
	'use strict';
	let projectGroupModule = angular.module('project.group');

	/**
	 * @ngdoc service
	 * @name projectGroupContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */

	projectGroupModule.service('projectGroupContainerInformationService', ProjectGroupContainerInformationService);

	ProjectGroupContainerInformationService.$inject = ['_', '$http', '$translate', 'platformLayoutHelperService',
		'platformModalService', 'basicsLookupdataLookupFilterService', 'basicsLookupdataConfigGenerator', 'projectGroupConstantValues'];

	function ProjectGroupContainerInformationService(_, $http, $translate, platformLayoutHelperService,
		platformModalService, basicsLookupdataLookupFilterService, basicsLookupdataConfigGenerator, projectGroupConstantValues) {
		let self = this;

		const projectEntityRelatedFilters = [
			{
				key: 'project-main-default-template-filter',
				serverSide: true,
				serverKey: 'project-main-default-template-filter',
				fn: function (item) {
					return {
						ProjectGroupFk: item !== null ? item.Id : null,
						ITwoBaselineServerFk: item !== null ? item.ITwoBaselineServerFk : null,
					};
				}

			}
		];
		basicsLookupdataLookupFilterService.registerFilter(projectEntityRelatedFilters);

		/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			let config = {};
			switch (guid) {
				case projectGroupConstantValues.uuid.container.projectGroupList:// projectGroupProjectGroupListController
					config = platformLayoutHelperService.getGridConfig(self.getProjectGroupServiceInfos(),
						self.getProjectGroupLayout,
						{
							initCalled: false,
							columns: [],
							parentProp: 'ProjectGroupFk',
							childProp: 'ProjectGroupChildren'
						});
					break;
				case projectGroupConstantValues.uuid.container.projectGroupDetails:// projectGroupProjectGroupDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getProjectGroupServiceInfos(), self.getProjectGroupLayout);
					break;
			}
			return config;
		};

		this.getProjectGroupLayout = function getProjectGroupLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout(
				'1.0.0',
				'project.group.projectgroup',
				['instanceaction', 'code', 'isautointegration', 'projectgroupstatusfk', 'descriptioninfo', 'itwobaselineserverfk', 'uncpath', 'commenttext', 'isactive', 'isdefault', 'defaulttemplateprojectfk']);
			res.overloads = platformLayoutHelperService.getOverloads(['projectgroupstatusfk', 'itwobaselineserverfk', 'defaulttemplateprojectfk'], self);
			res.overloads.instanceaction = {
				formatter: 'action',
				formatterOptions: {
					appendContent: false
				},
				forceActionButtonRender: true,
				actionList: [{
					toolTip: $translate.instant('basics.customize.checkConfig'),
					icon: 'control-icons ico-config-test',
					callbackFn: function (entity) {
						// modalDialog show
						$http.post(globals.webApiBaseUrl + 'project/group/checkconfig', entity).then(function (result) {
							result = result.data;
							let bodyTextKey;
							let headerTextKey;
							let iconClass;
							if (result.Succeeded) {
								headerTextKey = 'basics.customize.ConfigurationCheckSuccessful';
								iconClass = 'ico-info';
								bodyTextKey = result.Info;
							} else {
								headerTextKey = 'basics.customize.ConfigurationCheckError';
								iconClass = 'ico-error'; // error
								bodyTextKey = result.ErrorCode + '\n\r' + result.ErrorMessage;
							}
							platformModalService.showMsgBox(bodyTextKey, headerTextKey, iconClass);
							// modalDialog hide
						});
					}
				}]
			};
			res.overloads.isautointegration = { readonly: true };
			return res;
		};

		this.getProjectGroupServiceInfos = function getProjectGroupServiceInfos() {
			return {
				standardConfigurationService: 'projectGroupProjectGroupLayoutService',
				dataServiceName: 'projectGroupProjectGroupDataService',
				validationServiceName: 'projectGroupProjectGroupValidationService'
			};
		};

		this.getOverload = function getOverloads(overload) {
			let ovl = null;

			switch (overload) {
				case 'companyfk':
					ovl = platformLayoutHelperService.provideCompanyLookupOverload();
					break;
				case 'projectgroupstatusfk':
					ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.projectgroupstatus', null, {
						showIcon: true,
						imageSelectorService: 'platformStatusIconService'
					});
					break;
				case 'itwobaselineserverfk':
					ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.itwobaselineserver');
					break;
				case 'defaulttemplateprojectfk':
					ovl = platformLayoutHelperService.provideProjectLookupOverload('project-main-default-template-filter', 'DefaultTemplateProjectFk');
					break;
			}
			return ovl;
		};
	}
})(angular);
