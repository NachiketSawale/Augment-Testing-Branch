/*
 * Copyright(c) RIB Software GmbH
 */

import { HttpClient } from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {
    IFileSelectControlResult,
    PlatformConfigurationService
} from '@libs/platform/common';
import {
    createLookup,
    FieldType,
    FormRow,
    IEditorDialogResult,
    IFormConfig,
    IFormDialogConfig,
    StandardDialogButtonId,
    UiCommonFormDialogService,
    UiCommonMessageBoxService
} from '@libs/ui/common';
import {BusinessPartnerLookupService} from '@libs/businesspartner/shared';
import {lastValueFrom} from 'rxjs';
import {IEntitySelection} from '@libs/platform/data-access';
import {IContactEntity, IImportVCFResponse} from '@libs/businesspartner/interfaces';

export interface IImportVCFFile {
    fileName: IFileSelectControlResult,
    BusinessPartnerId: number,
}

@Injectable({
    providedIn: 'root',
})

export class ImportVcfFileService {
    private readonly http = inject(HttpClient);
    protected configService = inject(PlatformConfigurationService);
    private readonly dialogService = inject(UiCommonMessageBoxService);
    private readonly formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);

    public importVCF(dataService: IEntitySelection<IContactEntity>) {

        const selectedItem = dataService.getSelectedEntity();
        const singleFileData = {
            data: 'data://',
            name: '',
        };
        const formEntity: IImportVCFFile = {
            fileName: singleFileData,
            BusinessPartnerId: 0
        };
        if (selectedItem && selectedItem.BusinessPartnerFk > 0) {
            formEntity.BusinessPartnerId = selectedItem.BusinessPartnerFk;
        }
        const endPoint: string = 'businesspartner/contact/importfileinfo';
        const config: IFormDialogConfig<IImportVCFFile> = {
            headerText: {key: 'Import VCF File'},
            formConfiguration: this.generateEditOptionRows(),
            customButtons: [],
            entity: formEntity
        };

        this.formDialogService.showDialog(config)?.then(async (result: IEditorDialogResult<IImportVCFFile>) => {
            if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
                if (result.value.BusinessPartnerId === 0) {
                    this.dialogService.showMsgBox('businesspartner.main.businessPartnerMustSelect', 'Warning', 'warning');
                    return;
                }
                if (!result.value.fileName) {
                    return;
                }
                const file = result.value.fileName;
                if (file?.file) {
                    const formData = new FormData();
                    formData.append('file', file.file);
                    formData.append('businessPartnerId', result.value.BusinessPartnerId.toString());
                    const response = await lastValueFrom(this.http.post<IImportVCFResponse>(this.configService.webApiBaseUrl + endPoint, formData));
                    if (response && response.FileName !== '' && response.FileName !== null) {
                        const requestParam: IImportVCFResponse = {
                            FileName: response.FileName,
                            ContactDto: response.ContactDto,
                            ContactPhotoToSave: response.ContactPhotoToSave
                        };
                        this.http.post(this.configService.webApiBaseUrl + 'businesspartner/contact/importvcf', requestParam).subscribe(res => {
                            //todo  refresh  businesspartnerMain and businesspartnerContact
                        });
                    }
                }
            }
        });
    }

    private generateEditOptionRows(): IFormConfig<IImportVCFFile> {
        const formRows: FormRow<IImportVCFFile>[] = [
            {
                id: 'BusinessPartnerId',
                label: {
                    text: 'Business Partner'
                },
                type: FieldType.Lookup,
                lookupOptions: createLookup({dataServiceToken: BusinessPartnerLookupService}),
                model: 'BusinessPartnerId',
                readonly: true
            },
            {
                id: 'fileName',
                label: {
                    'text': 'Choose File',
                    'key': 'businesspartner.contact.wizard.chooseFile'
                },
                type: FieldType.FileSelect,
                model: 'fileName',
                options: {
                    retrieveDataUrl: true,
                    retrieveFile: true,
                    //TODO the file filter seems not working in framework
                    //fileFilter: 'text/xml',
                }
            }
        ];
        const formConfig: IFormConfig<IImportVCFFile> = {
            formId: 'importVcfFile',
            showGrouping: false,
            addValidationAutomatically: true,
            rows: formRows
        };
        return formConfig;
    }
}
