(function (angular) {
	'use strict';

	var mod = angular.module('basics.clerk');

	//Layout specs
	mod.value('basicsClerkAbsenceConfigurationValue', {
		fid: 'basics.clerk.clerkabsence',
		version: '0.2.4',
		showGrouping: true,
		addValidationAutomatically: true,
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['clerkfk', 'absencefrom', 'absenceto', 'description']
			},
			{
				gid: 'entityHistory',
				isHistory: true
			}
		],
		overloads: {
			clerkfk: {
				detail: {
					
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'cloud-clerk-clerk-dialog',
						descriptionMember: 'Description',
						lookupOptions: {
							showClearButton: false
						}
					},
					requiredInErrorHandling: true
				},
				grid: {

					editor: 'lookup',
					directive: 'basics-lookupdata-lookup-composite',
					editorOptions: {
						lookupDirective: 'cloud-clerk-clerk-dialog',
						lookupOptions: {
							showClearButton: true
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'Clerk',
						displayMember: 'Description'
					}
				},
				readonly: true,
			}
		}
	});

})(angular);

