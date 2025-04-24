/**
 * Created by sandu on 14.09.2015.
 */
(function () {
	'use strict';

	var mod = new angular.module('usermanagement.right');

	mod.factory('usermanagementRoleDetailLayout', ['basicsLookupdataConfigGenerator', function (basicsLookupdataConfigGenerator){
		return {
			fid: 'usermanagement.right.roledetailform',
			version: '1.0.0',
			addValidationAutomatically: true,
			showGrouping: true,
			groups: [
				{
					gid: 'basicData',
					attributes: ['name', 'description', 'accessrolecategoryfk', 'issystem', 'isfunctional']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}],
			translationInfos: {
				extraModules: ['usermanagement.right'],
				extraWords: {
					'Name': {
						location: 'usermanagement.right',
						identifier: 'rightName',
						initial: 'Name'},
					'IsUserRole': {
						location: 'usermanagement.right',
						identifier: 'rightIsUserRole',
						initial: 'Is User Role'
					},
					'Description': {
						location: 'usermanagement.right',
						identifier: 'rightDescription',
						initial: 'Description'
					},
					'AccessRoleCategoryFk': {
						location: 'usermanagement.right',
						identifier: 'accessRoleCategoryFk',
						initial: 'Category'
					},
					'IsSystem': {
						location: 'usermanagement.right',
						identifier: 'isSystem',
						initial: 'System Role'
					},
					'IsFunctional': {
						location: 'usermanagement.right',
						identifier: 'isFunctional',
						initial: 'Functional Restriction'
					}
				}
			},
			overloads: {
				accessrolecategoryfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'usermanagementRightCategoryLookupService',
					enableCache: true
				}),
				issystem: {
					readonly: true
				}
			}
		};
	}]);

	mod.factory('usermanagementRoleXRoleDetailLayout', [function () {
		return {
			fid: 'usermanagement.right.roleXrole.detailform',
			version: '1.0.0',
			showGrouping: true,
			groups: [
				{
					gid: 'basicData',
					attributes: ['accessrolefk2']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'translationInfos': {

				'extraModules': ['usermanagement.right'],

				'extraWords': {

					'AccessRoleFk2': {location: 'usermanagement.right', identifier: 'accessRoleFK', initial: 'Role'}
				}
			},
			'overloads': {
				'accessrolefk2': {
	                detail: {
		                type: 'directive',
		                directive: 'basics-lookupdata-lookup-composite',
		                options: {
			                lookupDirective: 'usermanagement-right-role-dialog',
			                descriptionMember: 'Description',
			                lookupOptions: {
				                showClearButton: true
			                }
		                }
	                },
	                grid: {
		                editor: 'lookup',
		                directive: 'basics-lookupdata-lookup-composite',
		                editorOptions: {
			                lookupDirective: 'usermanagement-right-role-dialog',
			                lookupOptions: {
				                showClearButton: true,
				                displayMember: 'Name'
			                }
		                },
		                formatter: 'lookup',
		                formatterOptions: {
			                lookupType: 'AccessRole',
			                displayMember: 'Name'
		                }
	                }
				}
			}
		};
	}]);

	mod.factory('usermanagementRightDetailLayout', ['basicsLookupdataConfigGenerator', function () {
		return {
			fid: 'usermanagement.right.detailform',
			version: '1.0.0',
			showGrouping: true,
			groups: [
				{
					gid: 'basicData',
					attributes: ['name', 'description', 'read', 'write', 'create', 'delete', 'execute', 'readdeny', 'writedeny', 'createdeny', 'deletedeny', 'executedeny']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}],
			'translationInfos': {
				'extraModules': ['usermanagement.right'],
				'extraWords': {

					'Name': {location: 'usermanagement.right', identifier: 'structureName', initial: 'Name'},
					'Description': {
						location: 'usermanagement.right',
						identifier: 'descriptorDescription',
						initial: 'Description'
					},
					'Read': {location: 'usermanagement.right', identifier: 'rightRead', initial: 'R'},
					'Write': {location: 'usermanagement.right', identifier: 'rightWrite', initial: 'W'},
					'Create': {location: 'usermanagement.right', identifier: 'rightCreate', initial: 'C'},
					'Delete': {location: 'usermanagement.right', identifier: 'rightDelete', initial: 'D'},
					'Execute': {location: 'usermanagement.right', identifier: 'rightExecute', initial: 'E'},
					'ReadDeny': {location: 'usermanagement.right', identifier: 'rightReadDeny', initial: 'RD'},
					'WriteDeny': {
						location: 'usermanagement.right',
						identifier: 'rightWriteDeny',
						initial: 'WD'
					},
					'CreateDeny': {
						location: 'usermanagement.right',
						identifier: 'rightCreateDeny',
						initial: 'CD'
					},
					'DeleteDeny': {
						location: 'usermanagement.right',
						identifier: 'rightDeleteDeny',
						initial: 'DD'
					},
					'ExecuteDeny': {
						location: 'usermanagement.right',
						identifier: 'rightExecuteDeny',
						initial: 'ED'
					}
				}
			},
			'overloads': {
				'name': {readonly: true},
				'description': {readonly: true},
				'read': {
					'grid': {
						field: 'Descriptor.Read',
						toolTip$tr$: 'usermanagement.right.toolTipRead',
					},
					detail: {model: 'Descriptor.Read',
	                    label$tr$: 'usermanagement.right.toolTipRead'}
				},
				'write': {
					'grid': {
						field: 'Descriptor.Write',
						toolTip$tr$: 'usermanagement.right.toolTipWrite',
					},
					detail: {model: 'Descriptor.Write',
	                    label$tr$: 'usermanagement.right.toolTipWrite'}
				},
				'create': {
					grid: {
						field: 'Descriptor.Create',
						toolTip$tr$: 'usermanagement.right.toolTipCreate',
						// formatterOptions: {hideReadonly: true}
					},
					detail: {model: 'Descriptor.Create',
	                    label$tr$: 'usermanagement.right.toolTipCreate'}
				},
				'delete': {
					grid: {
						field: 'Descriptor.Delete',
						toolTip$tr$: 'usermanagement.right.toolTipDelete',
						// formatterOptions: {hideReadonly: true}
					},
					detail: {model: 'Descriptor.Delete',
	                    label$tr$: 'usermanagement.right.toolTipDelete'}
				},
				'execute': {
					'grid': {
						field: 'Descriptor.Execute',
						toolTip$tr$: 'usermanagement.right.toolTipExecute',
					},
					'detail': {model: 'Descriptor.Execute',
	                    label$tr$: 'usermanagement.right.toolTipExecute'}
				},
				'readdeny': {
					grid: {
						field: 'Descriptor.ReadDeny',
						toolTip$tr$: 'usermanagement.right.toolTipReadDeny',
					},
					detail: {model: 'Descriptor.ReadDeny',
	                    label$tr$: 'usermanagement.right.toolTipReadDeny'}
				},
				'writedeny': {
					grid: {
						field: 'Descriptor.WriteDeny',
						toolTip$tr$: 'usermanagement.right.toolTipWriteDeny',
					},
					detail: {model: 'Descriptor.WriteDeny',
	                    label$tr$: 'usermanagement.right.toolTipWriteDeny'}
				},
				'createdeny': {
					grid: {
						field: 'Descriptor.CreateDeny',
						toolTip$tr$: 'usermanagement.right.toolTipCreateDeny',
					},
					detail: {model: 'Descriptor.CreateDeny',
	                    label$tr$: 'usermanagement.right.toolTipCreateDeny'}
				},
				'deletedeny': {
					grid: {
						field: 'Descriptor.DeleteDeny',
						toolTip$tr$: 'usermanagement.right.toolTipDeleteDeny',
					},
					detail: {model: 'Descripto.DeleteDeny',
	                    label$tr$: 'usermanagement.right.toolTipDeleteDeny'}
				},
				'executedeny': {
					grid: {
						field: 'Descriptor.ExecuteDeny',
						toolTip$tr$: 'usermanagement.right.toolTipExecuteDeny',
					},
					detail: {model: 'Descriptor.ExecuteDeny',
	                    label$tr$: 'usermanagement.right.toolTipExecuteDeny'}
				}
			}
		};
	}]);

})();