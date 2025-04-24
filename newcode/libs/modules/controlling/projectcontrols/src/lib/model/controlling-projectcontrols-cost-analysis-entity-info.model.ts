// /*
//  * Copyright(c) RIB Software GmbH
//  */
//
// import { EntityInfo } from '@libs/ui/business-base';
// import { IControllingProjectcontrolsCostAnalysisEntity } from './entities/controlling-projectcontrols-cost-analysis-entity.class';
// import { ControllingProjectcontrolsCostAnalysisDataService } from '../services/controlling-projectcontrols-cost-analysis-data.service';
// import { ControllingProjectcontrolsCostAnalysisLayoutService } from '../services/controlling-projectcontrols-cost-analysis-layout.service';
//
// export const CONTROLLING_PROJECTCONTROLS_COST_ANALYSIS_ENTITY_INFO = EntityInfo.create<IControllingProjectcontrolsCostAnalysisEntity>({
// 	grid: {
// 		title: { key: 'controlling.projectcontrols.groupingContainer', text: 'Dashboard' },
// 		containerUuid: '773618e488874716a5ed278aa3663865',
// 		// behavior: (ctx) => ctx.injector.get(BasicsCostCodesCompanyBehavior),
// 		treeConfiguration: true,
// 	},
// 	dataService: (ctx) => ctx.injector.get(ControllingProjectcontrolsCostAnalysisDataService),
// 	dtoSchemeId: { moduleSubModule: 'Controlling.Projectcontrols', typeName: 'IControllingProjectcontrolsCostAnalysisEntity' },
// 	permissionUuid: '773618e488874716a5ed278aa3663865',
// 	layoutConfiguration: (context) => {
// 		return context.injector.get(ControllingProjectcontrolsCostAnalysisLayoutService).generateLayout();
// 	},
// 	// todo: implement the validation service for SAC
// 	// validationService: ctx => ctx.injector.get(QtoMainHeaderValidationService),
// });
