/*
 * Copyright(c) RIB Software GmbH
 */
import {IBasicsCustomizeProjectDocumentTypeEntity} from '@libs/basics/interfaces';

export interface IProjectDocumentTypeEntity extends IBasicsCustomizeProjectDocumentTypeEntity{
    RelatedDocCategoryFk: number[];
    RelatedTypeFk: number[];
}
