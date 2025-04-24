/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {
    createLookup,
    FieldType,
    IEditorDialogResult, IFieldValueChangeInfo,
    IFormDialogConfig, StandardDialogButtonId,
    UiCommonFormDialogService, UiCommonMessageBoxService
} from '@libs/ui/common';
import {BasicsSharedRubricCategoryByRubricAndCompanyLookupService, Rubric} from '@libs/basics/shared';
import {IChangeRubricCategoryParamGenerated} from '../../model/entities/change-rubric-category-param-generated.interface';
import {HttpClient} from '@angular/common/http';
import {PlatformConfigurationService, PlatformTranslateService} from '@libs/platform/common';
import {DocumentSharedDocumentProjectCategoryLookupService} from '../../lookup-services/document-project-category-lookup.service';
import {DocumentSharedDocumentTypeLookupService} from '../../lookup-services/document-project-document-type-lookup.service';
import {DocumentProjectDataRootService} from '../../document-project/services/document-project-data-root.service';
import {IProjectDocumentTypeEntity} from '../../model/entities/project-document-type-entity.interface';
import {IBasicsCustomizeProjectDocumentCategoryEntity} from '@libs/basics/interfaces';


@Injectable({
    providedIn: 'root'
})
export abstract class ChangeProjectDocumentRubricCategoryWizardService {
    private readonly translateService = inject(PlatformTranslateService);
    private formDialogService = inject(UiCommonFormDialogService);
    private readonly configService = inject(PlatformConfigurationService);
    private readonly http = inject(HttpClient);
    private readonly messageBoxService = inject(UiCommonMessageBoxService);
    private readonly dialogService = inject(UiCommonMessageBoxService);

    public async onStartWizard(documentDataService: DocumentProjectDataRootService<object>) {
        const documentEntity = documentDataService.getSelectedEntity();
        if (null === documentEntity) {
            await this.dialogService.showMsgBox(
                this.translateService.instant('cloud.common.noCurrentSelection').text,
                this.translateService.instant('cloud.common.errorMessage').text,
                'ico-error');
        } else {
            const rubricCategoryEntity: IChangeRubricCategoryParamGenerated = {
                DocumentId: documentEntity.Id,
                RubricCategoryFk: documentEntity.RubricCategoryFk,
                DocumentCategoryFk: documentEntity.PrjDocumentCategoryFk,
                PrjDocumentTypeFk: documentEntity.PrjDocumentTypeFk
            };
            const modelOptions: IFormDialogConfig<IChangeRubricCategoryParamGenerated> = {
                headerText: 'documents.project.changeRubricCategory',
                showOkButton: true,
                formConfiguration: {
                    showGrouping: false,
                    groups: [
                        {
                            groupId: 'basicData'
                        }
                    ],
                    rows: [{
                        groupId: 'basicData',
                        id: 'rubricCategoryFk',
                        model: 'RubricCategoryFk',
                        label: {
                            text: 'Rubric Category',
                            key: 'documents.project.entityRubricCategory'
                        },
                        type: FieldType.Lookup,
                        change: (info: IFieldValueChangeInfo<IChangeRubricCategoryParamGenerated>) => {
                            //todo add validation here
                        },
                        lookupOptions: createLookup({
                            dataServiceToken: BasicsSharedRubricCategoryByRubricAndCompanyLookupService,
                            serverSideFilter: {
                                key: 'rubric-category-by-rubric-company-lookup-filter',
                                execute() {
                                    return {
                                        Rubric: Rubric.Documents
                                    };
                                }
                            }
                        }),
                        sortOrder: 1
                    }, {
                        groupId: 'basicData',
                        id: 'documentCategoryFk',
                        model: 'DocumentCategoryFk',
                        label: {
                            text: 'Document Category',
                            key: 'documents.project.entityPrjDocumentCategory'
                        },
                        type: FieldType.Lookup,
                        change: (info: IFieldValueChangeInfo<IChangeRubricCategoryParamGenerated>) => {
                            //todo add validation here
                        },
                        lookupOptions: createLookup<IChangeRubricCategoryParamGenerated, IBasicsCustomizeProjectDocumentCategoryEntity>({
                            dataServiceToken: DocumentSharedDocumentProjectCategoryLookupService,
                            showClearButton: true,
                            clientSideFilter: {
                                execute(item, context): boolean {
                                    return (item.RubricCategoryFk === context.entity?.RubricCategoryFk || context.entity?.DocumentCategoryFk === item.RubricCategoryFk);
                                }
                            }
                        }),
                        sortOrder: 1
                    }, {
                        groupId: 'basicData',
                        id: 'prjDocumentTypeFk',
                        model: 'PrjDocumentTypeFk',
                        label: {
                            text: 'Project Document Type',
                            key: 'documents.project.entityPrjDocumentType'
                        },
                        type: FieldType.Lookup,
                        change: (info: IFieldValueChangeInfo<IChangeRubricCategoryParamGenerated>) => {
                            //todo add validation here
                        },
                        lookupOptions: createLookup<IChangeRubricCategoryParamGenerated, IProjectDocumentTypeEntity>({
                            dataServiceToken: DocumentSharedDocumentTypeLookupService,
                            clientSideFilter: {
                                execute(item, context): boolean {
                                    const docCategoryFk = context.entity?.DocumentCategoryFk;
                                    if (docCategoryFk && item.RelatedTypeFk.includes(docCategoryFk)) {
                                        return item.IsLive && item.Sorting !== 0 && item.RelatedDocCategoryFk.includes(docCategoryFk);
                                    } else {
                                        return item.IsLive && item.Sorting !== 0;
                                    }
                                }
                            }
                        }),
                        sortOrder: 1
                    }]
                },
                customButtons: [],
                entity: rubricCategoryEntity
            };
            return this.formDialogService.showDialog(modelOptions)?.then((result: IEditorDialogResult<IChangeRubricCategoryParamGenerated>) => {
                if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
                    const changeRubricCategoryParam = result.value;
                    this.http.post(
                        `${this.configService.webApiBaseUrl}documents/projectdocument/final/changeRubricCategory`,
                        {
                            DocumentId: changeRubricCategoryParam.DocumentId,
                            RubricCategoryFk: changeRubricCategoryParam.RubricCategoryFk,
                            DocumentCategoryFk: changeRubricCategoryParam.DocumentCategoryFk,
                            PrjDocumentTypeFk: changeRubricCategoryParam.PrjDocumentTypeFk
                        }).subscribe(response => {
                        if (response) {
                            documentDataService.refreshSelected();
                        } else {
                            this.messageBoxService.showInfoBox('documents.project.changeRubricCategoryFailure', 'ico-info', false);
                        }
                    });
                }
            });
        }
    }
}