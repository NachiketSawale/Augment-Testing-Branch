/**
 * Created by anl on 10/18/2017.
 */


(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.mounting';
    var cloudCommonModule = 'cloud.common';

    function extendGrouping(gridColumns) {
        angular.forEach(gridColumns, function (column) {
            angular.extend(column, {
                grouping: {
                    title: column.name$tr$,
                    getter: column.field,
                    aggregators: [],
                    aggregateCollapsed: true
                }
            });
        });
        return gridColumns;
    }

    //item Layout
    angular.module(moduleName).value('mountingRequisitionConfig', {
        addition: {
            grid: extendGrouping([
                {
                    afterId: 'projectfk',
                    id: 'projectname',
                    field: 'ProjectFk',
                    name$tr$: cloudCommonModule + '.entityProjectName',
                    sortable: true,
                    width: 140,
                    formatter: 'lookup',
                    formatterOptions: {
                        lookupType: 'project',
                        displayMember: 'ProjectName'
                    }
                },
					{
						afterId: 'projectfk',
						id: 'projectname2',
						field: 'ProjectFk',
						name$tr$: 'cloud.common.entityProjectName2',
						sortable: true,
						width: 140,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'project',
							displayMember: 'ProjectName2'
						}
					},
                {
                    'afterId': 'clerkfk',
                    'id': 'clerkDesc',
                    'field': 'ClerkFk',
                    'name': 'Clerk Description',
                    'name$tr$': 'basics.clerk.clerkdesc',
                    formatter: 'lookup',
                    formatterOptions: {
                        lookupType: 'Clerk',
                        displayMember: 'Description',
                        width: 140,
	                    version: 3
                    }
                },
                {
                    afterId: 'ppsheaderfk',
                    id: 'ppsheaderDesc',
                    field: 'PpsHeaderFk',
                    name: 'PPS Header Description',
                    name$tr$: 'productionplanning.common.event.headerDes',
                    formatter: 'lookup',
                    formatterOptions: {
                        lookupType: 'CommonHeaderV3',
                        displayMember: 'DescriptionInfo.Translated'
                    }
                }
            ])
        }
    });

    angular.module(moduleName).factory('mountingRequisitionLayout', RequisitionLayout);
	RequisitionLayout.$inject = ['basicsLookupdataConfigGenerator', 'platformLayoutHelperService', 'productionplanningCommonLayoutHelperService', 'basicsLookupdataLookupFilterService',
		'basicsLookupdataLookupDescriptorService', '$injector'];
	function RequisitionLayout(basicsLookupdataConfigGenerator, platformLayoutHelperService, ppsCommonLayoutHelperService, basicsLookupdataLookupFilterService,
		basicsLookupdataLookupDescriptorService, $injector) {
		let projectEventHandlers = [{
			name: 'onSelectedItemChanged',
			handler: function (e, args) {
				$injector.get('productionplanningMountingRequisitionDataService').loadHeaderLookup(args.selectedItem.Id, args.entity);
			}
		}];
		let filters = [{
			key: 'pps-header-with-job-info-filter',
			serverKey: 'pps-header-with-job-info-filter',
			serverSide: true,
			fn: function (entity, searchOptions) {
				return {
					ProjectId: entity.ProjectFk,
					WithJobInfo: true
				};
			}
		}];
		basicsLookupdataLookupFilterService.registerFilter(filters);
        return {
            'fid': 'productionplanning.mounting.requisitionLayout',
            'version': '1.0.0',
            'showGrouping': true,
            'addValidationAutomatically': true,
            'groups': [
                {
                    gid: 'baseGroup',
                    attributes: ['reqstatusfk', 'code', 'descriptioninfo', 'projectfk', 'clerkfk', 'ppsheaderfk',
                        'startdate', 'enddate', 'lgmjobfk', 'remarks', 'islive']
                },
                {
                    gid: 'entityHistory',
                    isHistory: true
                },
                {
                    gid: 'userDefTextGroup',
                    isUserDefText: true,
                    attCount: 5,
                    attName: 'userdefined',
                    noInfix: true
                }
            ],
            'overloads': {
                code: {
                    navigator: {
                        moduleName: 'productionplanning.mounting'
                    }
                },
                projectfk: {
                    navigator: {
                        moduleName: 'project.main'
                    },
                    grid: {
                        editor: 'lookup',
                        editorOptions: {
                            directive: 'basics-lookup-data-project-project-dialog',
                            lookupOptions: {
                                showClearButton: true,
	                            events:projectEventHandlers
                            }
                        },
                        formatter: 'lookup',
                        formatterOptions: {
                            lookupType: 'project',
                            displayMember: 'ProjectNo'
                        }
                    },
                    detail: {
                        type: 'directive',
                        directive: 'basics-lookupdata-lookup-composite',
                        options: {
                            lookupDirective: 'basics-lookup-data-project-project-dialog',
                            descriptionField: 'ProjectName',
                            descriptionMember: 'ProjectName',
                            lookupOptions: {
                                initValueField: 'ProjectNo',
	                            events:projectEventHandlers
                            }

                        }
                    }
                },
                'reqstatusfk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.mountingrequisitionstatus', null, {
                    showIcon: true
                }),
                'clerkfk': {
                    grid: {
                        editor: 'lookup',
                        directive: 'basics-lookupdata-lookup-composite',
                        editorOptions: {
                            lookupOptions: {showClearButton: true},
                            directive: 'cloud-clerk-clerk-dialog'
                        },
                        formatter: 'lookup',
                        formatterOptions: {
                            lookupType: 'Clerk',
                            displayMember: 'Code',
	                        version: 3
                        },
                        width: 70
                    },
                    detail: {
                        type: 'directive',
                        directive: 'basics-lookupdata-lookup-composite',
                        options: {
                            lookupOptions: {showClearButton: true},
                            lookupDirective: 'cloud-clerk-clerk-dialog',
                            descriptionMember: 'Description'
                        }
                    }
                },
                'ppsheaderfk': {
                    navigator: {
                        moduleName: 'productionplanning.item'
                    },
                    grid: {
                        editor: 'lookup',
                        directive: 'basics-lookupdata-lookup-composite',
                        editorOptions: {
                            directive: 'productionplanning-common-header-simple-lookup',
                            lookupOptions: {
                                filterKey: 'pps-header-with-job-info-filter'
                            }
                        },
                        formatter: 'lookup',
                        formatterOptions: {
                            lookupType: 'CommonHeaderV3',
                            displayMember: 'Code',
	                        version: 3
                        },
                        width: 70
                    },
                    detail: {
                        type: 'directive',
                        directive: 'basics-lookupdata-lookup-composite',
                        options: {
                            lookupOptions: {
                                filterKey: 'pps-header-with-job-info-filter'
                            },
                            lookupDirective: 'productionplanning-common-header-simple-lookup',
                            descriptionMember: 'DescriptionInfo.Translated'
                        }
                    }
                },
                'islive': {
                    'readonly': true
                },
					'lgmjobfk': ppsCommonLayoutHelperService.provideJobExtensionLookupOverload({projectFk: 'ProjectFk'}, undefined, [{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							let entity = args.entity;
							let jobId = args.selectedItem.Id;
							let headers = basicsLookupdataLookupDescriptorService.getData('CommonHeaderV3');
							let header = _.find(headers, {LgmJobFk: jobId});
							if(header){
								entity.PpsHeaderFk = header.Id;
								var validateService = $injector.get('productionpalnningMountingRequisitionValidationService');
								var ret = validateService.validatePpsHeaderFk(entity, entity.PpsHeaderFk, 'PpsHeaderFk');
								$injector.get('platformRuntimeDataService').applyValidationResult(ret, entity, 'PpsHeaderFk');
							}
						}
					}])
            }
        };
    }

})(angular);