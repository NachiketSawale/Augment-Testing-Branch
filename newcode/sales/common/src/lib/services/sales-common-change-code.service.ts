import { inject, Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
    FieldType,
    FormRow,
    IEditorDialogResult,
    IFormConfig,
    IFormDialogConfig,
    StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService
} from '@libs/ui/common';
import {ValidationResult} from '@libs/platform/data-access';
import {PlatformConfigurationService, PlatformTranslateService} from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class SalesCommonChangeCodeService {

    protected readonly formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
    protected readonly translateService = inject(PlatformTranslateService);
    protected readonly messageBoxService = inject(UiCommonMessageBoxService);
    protected http = inject(HttpClient);
    protected configService = inject(PlatformConfigurationService);
    private codeValidationResult: ValidationResult = new ValidationResult();

    public async showChangeCodeDialog(subModule: string,selectedHeaderEntity: object): Promise<boolean> {

        const selectedEntity = selectedHeaderEntity;
        if(selectedEntity === null) {
            this.messageBoxService.showMsgBox(this.translateService.instant('cloud.common.noCurrentSelection').text, this.getDynamicMessage('headerTitle', subModule), 'ico-warning');
            return false;
        }

        const entity: ISalesChangeCodeEntity = {
	        Id: Object(selectedEntity)['Id'],
	        OldCode: Object(selectedEntity)['Code'],
	        NewCode: '',
	        Description: Object(selectedEntity)['DescriptionInfo']['Description'] ?? ''
        };

        const config: IFormDialogConfig<ISalesChangeCodeEntity> = {
            headerText: this.getDynamicMessage('headerTitle', subModule),
            formConfiguration: this.generateFormConfig(selectedEntity, subModule),
            customButtons: [],
            entity: entity
        };

        const ret = false;
        this.formDialogService.showDialog(config)?.then(async (result: IEditorDialogResult<ISalesChangeCodeEntity>) => {
            if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
                if(result.value.NewCode) {
                    const queryPath = this.configService.webApiBaseUrl + 'sales/'+ subModule +'/update';
						  let postData = null; //OrdHeaderComplete | WipHeaderComplete | undefined;
						  switch (subModule) {
							  case 'contract': {
								  const ordData = selectedEntity;
								  Object(ordData)['Code'] = result.value.NewCode;
								  postData = {
									  OrdHeader: ordData
								  };
								  break;
							  }

							  case 'wip': {
								  const wipData = selectedEntity;
								  Object(wipData)['Code'] = result.value.NewCode;
								  postData = {
									  EntitiesCount: 1,
									  MainItemId: Object(wipData).Id,
									  WipHeader: wipData
								  };
								  break;
							  }
                            
                            case 'billing': {
                                const billData = selectedEntity;
                                Object(billData)['BillNo'] = result.value.NewCode;
                                postData = {
                                    BilHeader: billData
                                };
                                break;
                            }

                            case 'bid': {
                                const bidData = selectedEntity;
                                Object(bidData)['Code'] = result.value.NewCode;
                                postData = {
                                    bidHeader: bidData
                                };
                                break;
                            }

						  }

                    if(postData !== null) {
                        this.http.post(queryPath, postData).subscribe((res) => {
                                    this.messageBoxService.showInfoBox(this.getDynamicMessage('codeUpdated', subModule), 'info', true);
                                    return;
								});
                    }
                } else {
                    this.messageBoxService.showMsgBox(this.getDynamicMessage('invalidCode', subModule), this.getDynamicMessage('headerTitle', subModule), 'ico-warning');
                }
            }
        });

        return ret;
    }

    public async isUniqueCode(code: string, companyId: number, subModule: string) {
        const url = 'sales/'+subModule+'/isuniquecode?companyId='+ companyId +'&code='+ code +'&entityid=undefined';
        return await this.http.get(this.configService.webApiBaseUrl + url).toPromise().then(res =>{
            if(res) {
                this.codeValidationResult = new ValidationResult();
            } else {
                this.codeValidationResult = new ValidationResult(this.getDynamicMessage('uniqueCode', subModule));
            }
        });
    }

    private generateFormConfig(selectedEntity: object, subModule: string): IFormConfig<ISalesChangeCodeEntity> {
        const formRows: FormRow<ISalesChangeCodeEntity>[] = [
            {
                id: 'OldCode',
                label: this.getDynamicMessage('codeLabel', subModule),
                type: FieldType.Code,
                model: 'OldCode',
                required: false,
                readonly: true
            },
            {
                id: 'NewCode',
                label: this.getDynamicMessage('newCodeLabel', subModule),
                type: FieldType.Code,
                model: 'NewCode',
                required: true,
                validator: info => {
                    // const selectedEntity = this.headerDataService.getSelectedEntity();
                    return this.isUniqueCode(info.value as string, (Object(selectedEntity)['CompanyFk'] ?? -1), subModule).then(res => {

                        // to prevent overwriting the current value
                        info.entity.NewCode = info.value as string;

                        // to apply validation result
                        return this.codeValidationResult;
                    });
                }
            },
            {
                id: 'Description',
                label: 'Description',
                type: FieldType.Description,
                model: 'Description',
                required: false,
                readonly: true
            },
        ];
        return {
            formId: 'change.code.form',
            showGrouping: false,
            addValidationAutomatically: false,
            rows: formRows,
        };
    }

    private getDynamicMessage(messageType: string, subModule: string): string {
        switch (messageType) {
            case 'invalidCode':
                return subModule === 'billing' ? 'sales.billing.validBillNo' : 'sales.common.validCode';

            case 'codeUpdated':
                return subModule === 'billing' ? 'sales.billing.billNoUpdatedSuccess' : 'sales.common.codeUpdatedSuccess';

            case 'uniqueCode':
                return subModule === 'billing' ? 'sales.billing.billNoUniqueError' : 'sales.common.codeUniqueError';
            
            case 'codeLabel':
                return subModule === 'billing' ? 'sales.billing.entityBillNo' : 'cloud.common.entityCode';

            case 'newCodeLabel':
                return subModule === 'billing' ? 'sales.billing.newBillNo' : 'sales.common.entityNewCode';
            
            case 'headerTitle':
                return subModule === 'billing' ? 'sales.billing.billNoChangeWizardTitle' : 'sales.common.codeChangeWizardTitle';

            default:
                return '';
        }
    }
}

export interface ISalesChangeCodeEntity {
    Id: number | undefined;
    OldCode?: string | undefined;
    NewCode: string;
    Description?: string;
}
