/*
 * Copyright(c) RIB Software GmbH
 */
import {Injectable} from '@angular/core';
import {
    UiCommonLookupSimpleDataService
} from '@libs/ui/common';
import {IBasicsCustomizeProjectDocumentCategoryEntity} from '@libs/basics/interfaces';

/*
 * Document Project Category Lookup
 * reuse IBasicsCustomizeProjectDocumentCategoryEntity
 * IBasicsSharedProjectDocumentCategoryLookupService is not be used ,because current lookup service's dropdown list only display the description.
 */
@Injectable({
    providedIn: 'root'
})
export class DocumentSharedDocumentProjectCategoryLookupService<TEntity extends object = object> extends UiCommonLookupSimpleDataService<IBasicsCustomizeProjectDocumentCategoryEntity, TEntity> {
    public constructor() {
        super('documents.project.documentCategory', {
            uuid: 'a9fd9253f479432980f4436bbc97e978',
            valueMember: 'id',
            displayMember: 'description'
        }, {
            customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK', field: 'RubricCategoryFk'
        });
    }
}