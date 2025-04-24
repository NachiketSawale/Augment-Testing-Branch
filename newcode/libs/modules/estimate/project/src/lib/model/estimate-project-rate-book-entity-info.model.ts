/*
 * Copyright(c) RIB Software GmbH
 */
 
import { EntityInfo } from '@libs/ui/business-base';
import { EstimateProjectRateBookDataService } from '../services/estimate-project-rate-book-data.service';
import { EstimateProjectRateBookBehavior } from '../behaviors/estimate-project-rate-book-behavior.service';
import {IRateBookEntity} from '@libs/project/interfaces';
import {EstimateProjectRateBookLayoutService} from '../services/estimate-project-rate-book-layout.service';


 export const ESTIMATE_PROJECT_RATE_BOOK_ENTITY_INFO: EntityInfo = EntityInfo.create<IRateBookEntity> ({
     grid: {
         title: {key: 'project.main.listRateBookTitle', text: 'Master Data Filter'},
         containerUuid: '37de9c2128f54ab199a62c1526b4d411',
         treeConfiguration:true,
         behavior: ctx => ctx.injector.get(EstimateProjectRateBookBehavior)
     },
     dataService: (ctx) => ctx.injector.get(EstimateProjectRateBookDataService),
     dtoSchemeId: {moduleSubModule: 'Project.Main', typeName: 'RateBookDto'},
     permissionUuid: '37de9c2128f54ab199a62c1526b4d411',
     layoutConfiguration: (context) => {
         return context.injector.get(EstimateProjectRateBookLayoutService).generateLayout();
     }
 });