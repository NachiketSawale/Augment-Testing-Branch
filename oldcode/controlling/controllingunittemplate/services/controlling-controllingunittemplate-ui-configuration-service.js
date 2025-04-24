/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'controlling.controllingunittemplate';

	/**
	 * @ngdoc service
	 * @name controllingControllingunittemplateUIConfigurationService
	 * @function
	 * @requires
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(moduleName).factory('controllingControllingunittemplateUIConfigurationService', ['basicsLookupdataConfigGenerator',
		function (basicsLookupdataConfigGenerator) {
			var service = {};

			service.getControlTemplateLayout = function () {
				return {
					fid: 'controlling.controllingunittemplate.controlTemplateForm',
					version: '0.1.0',
					addValidationAutomatically: true,
					showGrouping: true,
					groups: [{
						'gid': 'baseGroup',
						'attributes': ['code', 'descriptioninfo', 'isdefault', 'islive']
					}, {
						'gid': 'entityHistory',
						'isHistory': true
					}],
					overloads: {
						code: {
							required: true
						}
					}
				};
			};

			service.getControltemplateUnitLayout = function () {
				return {
					fid: 'controlling.controllingunittemplate.controlTemplateUnitForm',
					version: '0.3.0',
					addValidationAutomatically: true,
					showGrouping: true,
					groups: [{
						gid: 'baseGroup',
						attributes: ['code', 'descriptioninfo', 'controllingcatfk', 'uomfk',
							'isbillingelement', 'isaccountingelement', 'isplanningelement', 'istimekeepingelement',
							'isassetmanagement', 'isstockmanagement', 'isplantmanagement', 'isintercompany',
							'companyfk', 'commenttext', 'isfixedbudget', 'isdefault'
						]
					}, {
						gid: 'assignments',
						attributes: [
							'assignment01', 'assignment02', 'assignment03', 'assignment04', 'assignment05',
							'assignment06', 'assignment07', 'assignment08', 'assignment09', 'assignment10'
						]
					}, {
						gid: 'userDefTextGroup',
						isUserDefText: true,
						attCount: 5,
						attName: 'userdefined',
						noInfix: true
					}, {
						gid: 'entityHistory',
						isHistory: true
					}],
					overloads: {
						controllingcatfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.controllingcat'),
						uomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsUnitLookupDataService',
							cacheEnable: true
						}),
						companyfk: {
							readonly: true,
							grid: {
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-company-company-lookup'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'company',
									displayMember: 'Code'
								},
								width: 140
							},
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'basics-company-company-lookup',
									descriptionMember: 'CompanyName',
									lookupOptions: {}
								}
							}
						}
					}
				};
			};

			service.getControltemplateGroupLayout = function () {
				return {
					fid: 'controlling.controllingunittemplate.controlTemplateGroupForm',
					version: '0.1.0',
					showGrouping: true,
					groups: [{
						'gid': 'baseGroup',
						'attributes': ['controllinggroupfk', 'controllinggrpdetailfk']
					}, {
						'gid': 'entityHistory',
						'isHistory': true
					}],
					overloads: {
						controllinggroupfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'controllingGroupLookupDataService',
							enableCache: true
						}),
						controllinggrpdetailfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'controllingGroupDetailLookupDataService',
							filter: function (item) {
								return item && item.ControllingGroupFk ? item.ControllingGroupFk : null;
							},
							enableCache: true,
							columns: [{
								id: 'Code',
								field: 'Code',
								name: 'Code',
								formatter: 'code',
								name$tr$: 'cloud.common.entityCode'
							}, {
								id: 'Description',
								field: 'DescriptionInfo',
								name: 'Description',
								formatter: 'translation',
								name$tr$: 'cloud.common.entityDescription'
							}, {
								id: 'CommentText',
								field: 'CommentText',
								name: 'Comment',
								formatter: 'description',
								name$tr$: 'cloud.common.entityCommentText'
							}]
						})
					}
				};
			};

			return service;
		}
	]);
})(angular);
