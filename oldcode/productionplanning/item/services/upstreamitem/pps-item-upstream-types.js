/**
 * Created by lav on 4/8/2020.
 */
/* globals angular */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.item';
	angular.module(moduleName).constant('upstreamTypes', {
		Production: 1,
		Acquisition: 2,
		FromStock: 3,
		SuppliedByCustomer: 4,
		Formwork: 6,
		Process:7,
		lookupInfo: {
			1: {
				column: 'PPS_ITEM_UPSTREAM_FK',
				lookup: {
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'pps-item-complex-lookup',
						descriptionMember: 'Description'
					},
					formatterOptions: {
						version: 3,
						lookupType: 'PPSItem',
						displayMember: 'Code'
					}
				}
			},
			2: {
				column: 'PRC_PACKAGE_FK',
				lookup: {
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'pps-item-procurement-package-lookup',
						descriptionMember: 'Description'
					},
					formatterOptions: {
						lookupType: 'PrcPackage',
						displayMember: 'Code',
						descriptionMember: 'Description'
					}
				}
			},
			3: {
				column: 'RES_REQUISITION_FK',
				lookup: {
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'resource-requisition-lookup-dialog-new',
						descriptionMember: 'Description',
						displayMember: 'Code'
					},
					formatterOptions: {
						lookupType: 'resourceRequisition',
						version: 3,
						displayMember: 'Description',
						descriptionMember: 'Description'
					}
				}
			},
			4: {
				column: 'PES_ITEM_FK',
				lookup: {
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'productionplanning-common-pes-item-lookup',
						descriptionMember: 'Description1',
						displayMember: 'Description1'
					},
					formatterOptions: {
						lookupType: 'PesItemWithPpsUpStream',
						version: 2,
						displayMember: 'Description1',
						descriptionMember: 'Description1'
					}
				}
			},
			6: {
				column: 'PpsFormworkFk',
				lookup: {
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'pps-process-configuration-formwork-dialog-lookup',
						descriptionMember: 'Description'
					},
					formatterOptions: {
						lookupType: 'Formwork',
						displayMember: 'Code',
						version: 3
					}
				}
			},
			7: {
				column: 'PpsProcessFk',
				lookup: {
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'pps-process-configuration-process-dialog-lookup',
						descriptionMember: 'Description'
					},
					formatterOptions: {
						lookupType: 'Process',
						displayMember: 'Code',
						version: 3
					}
				}
			}
		}
	});
})(angular);

