/**
 * Created by chlai on 11.10.2024.
 */

(function (angular) {
	'use strict';

	/**
	 *
	 */
	angular.module('basics.common').value('basicsCommonProjectNavigatorConfig',  [
		{
			id: 45, // BAS_MODULE id
			moduleName: 'project.main',
			displayName: 'Projects',
			displayName$tr$: 'cloud.desktop.moduleDisplayNameProjectMain',
			iconClass: 'ico-project',
			projectContext: true,
			naviToModule: true,
			isActive: true
		}, {
			id: 85, // BAS_MODULE id
			moduleName: 'procurement.package',
			displayName: 'Package',
			displayName$tr$: 'cloud.desktop.moduleDisplayNamePackage',
			iconClass: 'ico-package',
			group: 'project.main',
			furtherFilters: {Token: 'PRC_PACKAGE', Value: 'key'},
			projectContext: true,
			naviToModule: true,
			color: '#52ABFF',
			isActive: true,
			filterInfo: {
				isActive: {
					enabled: false
				},
				status: {
					enabled: true,
					httpRead: 'basics/customize/packagestatus',
					hasRubricCategory: false,
				}
			}
		}, {
			id: 42, // BAS_MODULE id
			moduleName: 'procurement.requisition',
			displayName: 'Requisition',
			displayName$tr$: 'cloud.desktop.moduleDisplayNameRequisition',
			iconClass: 'ico-requisition',
			group: 'procurement.package',
			//furtherFilters: {Token: 'PRC_PACKAGE', Value: 'key'},
			projectContext: true,
			naviToModule: true,
			color: '#52ABFF',
			isActive: true,
			filterInfo: {
				isActive: {
					enabled: false
				},
				status: {
					enabled: true,
					httpRead: 'basics/customize/reqstatus',
					hasRubricCategory: false
				}
			}
		}, {
			id: 40, // BAS_MODULE id
			moduleName: 'procurement.rfq',
			displayName: 'RfQ',
			displayName$tr$: 'cloud.desktop.moduleDisplayNameRfQ',
			iconClass: 'ico-rfq',
			group: 'procurement.package',
			//furtherFilters: {Token: 'PRC_PACKAGE', Value: 'key'},
			projectContext: true,
			naviToModule: true,
			color: '#52ABFF',
			isActive: true,
			filterInfo: {
				isActive: {
					enabled: false
				},
				status: {
					enabled: true,
					httpRead: 'basics/customize/rfqstatus',
					hasRubricCategory: false
				}
			}
		}, {
			id: 43, // BAS_MODULE id
			moduleName: 'procurement.quote',
			displayName: 'Quote',
			displayName$tr$: 'cloud.desktop.moduleDisplayNameQuote',
			iconClass: 'ico-quote',
			group: 'procurement.package',
			//furtherFilters: {Token: 'PRC_PACKAGE', Value: 'key'},
			projectContext: true,
			naviToModule: true,
			color: '#52ABFF',
			isActive: true,
			filterInfo: {
				isActive: {
					enabled: false
				},
				status: {
					enabled: true,
					httpRead: 'basics/customize/quotationstatus',
					hasRubricCategory: false
				}
			}
		}, {
			id: 41, // BAS_MODULE id
			moduleName: 'procurement.contract',
			displayName: 'Contract',
			displayName$tr$: 'cloud.desktop.moduleDisplayNameContract',
			iconClass: 'ico-contracts',
			group: 'procurement.package',
			//furtherFilters: {Token: 'PRC_PACKAGE', Value: 'key'},
			projectContext: true,
			naviToModule: true,
			color: '#52ABFF',
			isActive: true,
			filterInfo: {
				isActive: {
					enabled: false
				},
				status: {
					enabled: true,
					httpRead: 'basics/customize/constatus',
					hasRubricCategory: false
				}
			}
		}, {
			id: 64, // BAS_MODULE id
			moduleName: 'procurement.pes',
			displayName: 'Pes',
			displayName$tr$: 'cloud.desktop.moduleDisplayNamePerformanceEntrySheet',
			iconClass: 'ico-pes',
			group: 'procurement.package',
			//furtherFilters: {Token: 'PRC_PACKAGE', Value: 'key'},
			projectContext: true,
			naviToModule: true,
			color: '#52ABFF',
			isActive: true,
			filterInfo: {
				isActive: {
					enabled: false
				},
				status: {
					enabled: true,
					httpRead: 'basics/customize/pesstatus',
					hasRubricCategory: false
				}
			}
		}, {
			id: 76, // BAS_MODULE id
			moduleName: 'procurement.invoice',
			displayName: 'Invoice',
			displayName$tr$: 'cloud.desktop.moduleDisplayNameInvoice',
			iconClass: 'ico-invoice',
			group: 'procurement.package',
			//furtherFilters: {Token: 'PRC_PACKAGE', Value: 'key'},
			projectContext: true,
			naviToModule: true,
			color: '#52ABFF',
			isActive: true,
			filterInfo: {
				isActive: {
					enabled: false
				},
				status: {
					enabled: true,
					httpRead: 'basics/customize/invoicestatus',
					hasRubricCategory: false
				}
			}
		}, {
			id: 92, // BAS_MODULE id
			moduleName: 'sales.bid',
			displayName: 'Bids',
			displayName$tr$: 'cloud.desktop.moduleDisplayNameBusinessBid',
			iconClass: 'ico-sales-bid',
			group: 'sales.contract',
			projectContext: true,
			naviToModule: true,
			color: '#68C0B8',
			isActive: true,
			filterInfo: {
				isActive: {
					enabled: false
				},
				status: {
					enabled: true,
					httpRead: 'basics/customize/bidstatus',
					hasRubricCategory: true
				}
			}
		},{
			id: 98, // BAS_MODULE id
			moduleName: 'sales.contract',
			displayName: 'Contract',
			displayName$tr$: 'cloud.desktop.moduleDisplayNameSalesContract',
			iconClass: 'ico-sales-contract',
			group: 'project.main',
			projectContext: true,
			naviToModule: true,
			color: '#68C0B8',
			isActive: true,
			filterInfo: {
				isActive: {
					enabled: false
				},
				status: {
					enabled: true,
					httpRead: 'basics/customize/orderstatus',
					hasRubricCategory: true
				}
			}
		}, {
			id: 100, // BAS_MODULE id
			moduleName: 'sales.wip',
			displayName: 'WIP',
			displayName$tr$: 'cloud.desktop.moduleDisplayNameWip',
			iconClass: 'ico-sales-wip',
			group: 'sales.contract',
			projectContext: true,
			naviToModule: true,
			color: '#68C0B8',
			isActive: true,
			filterInfo: {
				isActive: {
					enabled: false
				},
				status: {
					enabled: true,
					httpRead: 'basics/customize/workinprogressstatus',
					hasRubricCategory: true
				}
			}
		}, {
			id: 101, // BAS_MODULE id
			moduleName: 'sales.billing',
			displayName: 'Billing',
			displayName$tr$: 'cloud.desktop.moduleDisplayNameBilling',
			iconClass: 'ico-sales-billing',
			group: 'sales.contract',
			projectContext: true,
			naviToModule: true,
			color: '#68C0B8',
			isActive: true,
			filterInfo: {
				isActive: {
					enabled: false
				},
				status: {
					enabled: true,
					httpRead: 'basics/customize/billstatus',
					hasRubricCategory: true
				}
			}
		}, {
			id: 38, // BAS_MODULE id
			moduleName: 'boq.main',
			displayName: 'BoQ',
			displayName$tr$: 'cloud.desktop.moduleDisplayNameBoqMain',
			iconClass: 'ico-project-boq',
			group: 'project.main',
			projectContext: true,
			naviToModule: false,
			color: '#FFE880',
			isActive: true,
			filterInfo: {
				isActive: {
					enabled: false
				},
				status: {
					enabled: true,
					httpRead: 'basics/customize/boqstatus',
					hasRubricCategory: false
				}
			}
		}, {
			id: 99, // BAS_MODULE id
			moduleName: 'constructionsystem.main',
			displayName: 'Construction System Instance',
			displayName$tr$: 'cloud.desktop.moduleDisplayNameConstructionSystemInstance',
			iconClass: 'ico-construction-system',
			group: 'project.main',
			furtherFilters: {Token: 'COS_INS_HEADER', Value: 'key'},
			projectContext: true,
			naviToModule: false,
			color: '#B2857B',
			isActive: true,
			filterInfo: {
				isActive: {
					enabled: false
				},
				status: {
					enabled: false
				}
			}
		},{
			id: 57, // BAS_MODULE id
			moduleName: 'estimate.main',
			displayName: 'Estimate',
			displayName$tr$: 'cloud.desktop.moduleDisplayNameEstimate',
			iconClass: 'ico-estimate',
			group: 'project.main',
			furtherFilters: {Token: 'EST_HEADER', Value: 'key'},
			projectContext: true,
			naviToModule: false,
			color: '#BD72CB',
			isActive: true,
			filterInfo: {
				isActive: {
					enabled: true
				},
				status: {
					enabled: true,
					httpRead: 'basics/customize/eststatus',
					hasRubricCategory: false
				}
			}
		},{
			id: 133, // BAS_MODULE id
			moduleName: 'productionplanning.mounting',
			displayName: 'Mounting',
			displayName$tr$: 'cloud.desktop.moduleDisplayNamePpsMounting',
			iconClass: 'ico-mounting',
			group: 'project.main',
			furtherFilters: {TOKEN: 'productionplanning.mounting', Value: 'key'},
			projectContext: true,
			naviToModule: false,
			color: '#EE59A3',
			isActive: true,
			filterInfo: {
				isActive: {
					enabled: false
				},
				status: {
					enabled: true,
					httpRead: 'basics/customize/mountingrequisitionstatus',
					hasRubricCategory: false
				}
			}
		},{
			id: 97, // BAS_MODULE id
			moduleName: 'model.main',
			displayName: 'Model',
			displayName$tr$: 'cloud.desktop.moduleDisplayNameModel',
			iconClass: 'ico-model',
			group: 'project.main',
			naviServiceConnector: {
				getUrl: function (modelId) {
					return globals.webApiBaseUrl + 'model/project/model/getbyid?id=' + modelId;
				}
			},
			naviToModule: false,
			color: '#879FAB',
			isActive: true,
			filterInfo: {
				isActive: {
					enabled: false
				},
				status: {
					enabled: true,
					httpRead: 'basics/customize/modelstatus',
					hasRubricCategory: false
				}
			}
		},{
			id: 47, // BAS_MODULE id
			moduleName: 'scheduling.main',
			displayName: 'Scheduling',
			displayName$tr$: 'cloud.desktop.moduleDisplayNameSchedulingMain',
			iconClass: 'ico-scheduling',
			group: 'project.main',
			furtherFilters: {Token: 'PSD_SCHEDULE', Value: 'key'},
			projectContext: false, // as scheduling has their own pinning context logic, therefore here ist set to false
			naviToModule: false,
			color: '#FFAB66',
			isActive: true,
			filterInfo: {
				isActive: {
					enabled: true
				},
				status: {
					enabled: true,
					httpRead: 'basics/customize/schedulestatus',
					hasRubricCategory: false
				}
			}
		}, {
			id: 119, // BAS_MODULE id
			moduleName: 'productionplanning.item',
			displayName: 'Production Unit',
			displayName$tr$: 'cloud.desktop.moduleDisplayNamePPSItem',
			iconClass: 'ico-production-planning',
			group: 'project.main',
			furtherFilters: {Token: '"productionplanning.item', Value: 'key'},
			projectContext: true,
			naviToModule: false,
			color: '#D9E368',
			isActive: true,
			filterInfo: {
				isActive: {
					enabled: false
				},
				status: {
					enabled: true,
					httpRead: 'basics/customize/ppsitemstatus',
					hasRubricCategory: false
				}
			}
		}, {
			id: 58, // BAS_MODULE id
			moduleName: 'qto.main',
			displayName: 'QTO',
			displayName$tr$: 'cloud.desktop.moduleDisplayNameQTO',
			iconClass: 'ico-qto',
			group: 'project.main',
			projectContext: true,
			naviToModule: true,
			color: '#9FDDDF',
			isActive: true,
			filterInfo: {
				isActive: {
					enabled: false
				},
				status: {
					enabled: true,
					httpRead: 'basics/customize/qtostatus',
					hasRubricCategory: false
				}
			}
		}, {
			id: 106, // BAS_MODULE id
			moduleName: 'change.main',
			displayName: 'Changes',
			displayName$tr$: 'cloud.desktop.moduleDisplayNameChangeMain',
			iconClass: 'ico-change-management',
			group: 'project.main',
			projectContext: true,
			naviToModule: true,
			color: '#9FDDDF',
			isActive: true,
			filterInfo: {
				isActive: {
					enabled: false
				},
				status: {
					enabled: true,
					httpRead: 'basics/customize/projectchangestatus',
					hasRubricCategory: true
				}
			}
		},{
			id: 204, // BAS_MODULE id
			moduleName: 'model.annotation',
			displayName: 'Model Annotation',
			displayName$tr$: 'cloud.desktop.moduleDisplayNameModelAnnotation',
			iconClass: 'ico-model-annotation',
			group: 'model.main',
			projectContext: true,
			naviToModule: true,
			color: '#9FDDDF',
			isActive: true,
			hideData: true,
			filterInfo: {
				isActive: {
					enabled: false
				},
				status: {
					enabled: false
				}
			}
		},{
			id: 231, // BAS_MODULE id
			moduleName: 'model.measurements',
			displayName: 'Model Measurements',
			displayName$tr$: 'cloud.desktop.moduleDisplayNameModelMeasurements',
			iconClass: 'ico-measurements',
			group: 'model.main',
			projectContext: true,
			naviToModule: true,
			color: '#9FDDDF',
			isActive: true,
			hideData: true,
			filterInfo: {
				isActive: {
					enabled: false
				},
				status: {
					enabled: false
				}
			}
		},{
			id: 113, // BAS_MODULE id
			moduleName: 'model.changeset',
			displayName: 'Model Comparison',
			displayName$tr$: 'cloud.desktop.moduleDisplayNameModelChangeSet',
			iconClass: 'ico-model-comparison',
			group: 'model.main',
			projectContext: true,
			naviToModule: true,
			color: '#9FDDDF',
			isActive: false,
			hideData: true,
			filterInfo: {
				isActive: {
					enabled: false
				},
				status: {
					enabled: false
				}
			}
		},{
			id: 171, // BAS_MODULE id
			moduleName: 'model.map',
			displayName: 'Model Map',
			displayName$tr$: 'cloud.desktop.moduleDisplayNameModelMap',
			iconClass: 'ico-model-map',
			group: 'model.main',
			projectContext: true,
			naviToModule: true,
			color: '#9FDDDF',
			isActive: true,
			hideData: true,
			filterInfo: {
				isActive: {
					enabled: false
				},
				status: {
					enabled: false
				}
			}
		},{
			id: 116, // BAS_MODULE id
			moduleName: 'defect.main',
			displayName: 'Defect',
			displayName$tr$: 'cloud.desktop.moduleDisplayNameDefect',
			iconClass: 'ico-defect-management',
			group: 'project.main',
			projectContext: true,
			naviToModule: true,
			color: '#9FDDDF',
			isActive: true,
			filterInfo: {
				isActive: {
					enabled: false
				},
				status: {
					enabled: true,
					httpRead: 'basics/customize/defectstatus',
					hasRubricCategory: true
				}
			}
		},{
			id: 107, // BAS_MODULE id
			moduleName: 'project.inforequest',
			displayName: 'Information',
			displayName$tr$: 'cloud.desktop.moduleDisplayNameProjectInfoRequest',
			iconClass: 'ico-request-for-information',
			group: 'project.main',
			projectContext: true,
			naviToModule: true,
			color: '#9FDDDF',
			isActive: true,
			filterInfo: {
				isActive: {
					enabled: false
				},
				status: {
					enabled: true,
					httpRead: 'basics/customize/rfistatus',
					hasRubricCategory: true
				}
			}
		},{
			id: 135, // BAS_MODULE id
			moduleName: 'logistic.job',
			displayName: 'Logistic Jobs',
			displayName$tr$: 'cloud.desktop.moduleDisplayNameLogisticJob',
			iconClass: 'ico-logistic-job',
			group: 'project.main',
			projectContext: true,
			naviToModule: true,
			color: '#9FDDDF',
			isActive: true,
			filterInfo: {
				isActive: {
					enabled: false
				},
				status: {
					enabled: true,
					httpRead: 'basics/customize/jobstatus',
					hasRubricCategory: false
				}
			}
		},{
			id: 147, // BAS_MODULE id
			moduleName: 'logistic.settlement',
			displayName: 'Settlement',
			displayName$tr$: 'cloud.desktop.moduleDisplayNameLogisticSettlement',
			iconClass: 'ico-invoicing',
			group: 'project.main',
			projectContext: true,
			naviToModule: true,
			color: '#9FDDDF',
			isActive: true,
			filterInfo: {
				isActive: {
					enabled: false
				},
				status: {
					enabled: true,
					httpRead: 'basics/customize/logisticssettlementstatus',
					hasRubricCategory: true
				}
			}
		},{
			id: 142, // BAS_MODULE id
			moduleName: 'logistic.dispatching',
			displayName: 'Dispatching Notes',
			displayName$tr$: 'cloud.desktop.moduleDisplayNameLogisticDispatching',
			iconClass: 'ico-dispatching',
			group: 'project.main',
			projectContext: true,
			naviToModule: true,
			color: '#9FDDDF',
			isActive: true,
			filterInfo: {
				isActive: {
					enabled: false
				},
				status: {
					enabled: true,
					httpRead: 'basics/customize/dispatchstatus',
					hasRubricCategory: true
				}
			}
		},


	]);
})(angular);