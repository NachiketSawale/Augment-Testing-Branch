/**
 * Created by leo on 17.11.2014.
 */
(function (angular) {
	'use strict';

	var mod = angular.module('scheduling.templategroup');

	// Layout specs

	mod.factory('schedulingTemplateActivityTmplGrp2CUGrpConfigurationService', ['basicsLookupdataConfigGenerator',

		function (basicsLookupdataConfigGenerator) {

			return {
				getTmplGrp2CUGrpDetailLayout: function () {
					return {
						'fid': 'scheduling.template.activitytmplgrp2cugrpdetailform',
						'version': '1.0.0',
						'addValidationAutomatically': true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['controllinggroupfk', 'controllinggroupdetailfk']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							'controllinggroupfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'controllingGroupLookupDataService',
								enableCache: true
							}),
							'controllinggroupdetailfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'controllingGroupDetailLookupDataService',
								filter: function (item) {
									var groupId = null;

									if (item && item.ControllingGroupFk) {
										groupId = item.ControllingGroupFk;
									}
									return groupId;
								},
								enableCache: true
							})
						}
					};
				}
			};
		}
	]);

	mod.value('schedulingTemplateActivityTemplateGroupEditDetailLayout', {
		fid: 'scheduling.template.activitytemplategroupeditdetailform',
		version: '1.0.0',
		addValidationAutomatically: true,
		groups: [
			{
				gid: 'baseGroup',
				attributes: [ 'code', 'descriptioninfo' ]
			},
			{
				gid: 'entityHistory',
				isHistory: true
			}
		]
	} );
})(angular);
