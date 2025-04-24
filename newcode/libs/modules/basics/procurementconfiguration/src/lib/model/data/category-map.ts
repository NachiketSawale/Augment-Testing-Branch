/*
 * Copyright(c) RIB Software GmbH
 */

import { ClerkRubric, ProcurementRubric, ProjectRubric, Rubric, SalesRubric } from '@libs/basics/shared';

/**
 *
 * Category Map Entity
 */

export interface ICategoryMapEntity {
    category: Rubric[];
    documentType: string;
}


export const CategoryMap: ICategoryMapEntity[] = [
    {category: ClerkRubric, documentType: 'BasClerkdocumenttypeFk'},
    {category: ProcurementRubric, documentType: 'PrcDocumenttypeFk'},
    {category: ProjectRubric, documentType: 'PrjDocumenttypeFk'},
    {category: SalesRubric, documentType: 'SlsDocumenttypeFk'}
];
