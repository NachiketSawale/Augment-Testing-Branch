/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {get, uniq} from 'lodash';
import {PlatformConfigurationService,PlatformTranslateService} from '@libs/platform/common';
import {CustomStep,MultistepDialog, MultistepTitleFormat, UiCommonMessageBoxService, UiCommonMultistepDialogService} from '@libs/ui/common';
import {UpdateMaterialPriceStep1Component} from '../../update-material-price/components/update-material-price-step1/update-material-price-step1.component';
import {BasicsMaterialRecordDataService} from '../../material/basics-material-record-data.service';
import {BasicsMaterialMaterialCatalogDataService} from '../../material-catalog/basics-material-material-catalog-data.service';
import {BasicsMaterialMaterialGroupDataService} from '../../material-group/basics-material-material-group-data.service';
import {BasicsMaterialUpdatePriceWizardOption} from '../../model/enums/update-material-price-wizard-option.enum';
import {UpdateMaterialPriceStep2Component} from '../../update-material-price/components/update-material-price-step2/update-material-price-step2.component';
import {IMaterialEntity} from '@libs/basics/interfaces';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {IBasicsMaterialUpdatePriceParam, IUpdatePriceDataComplete} from '../../model/entities/basics-material-update-price-entity.interface';

@Injectable({
    providedIn: 'root'
})
export abstract class UpdateMaterialPriceWizardService {
    private readonly messageBoxService = inject(UiCommonMessageBoxService);
    private readonly translateService = inject(PlatformTranslateService);
    private readonly dataService = inject(BasicsMaterialRecordDataService);
    private readonly catalogDataService = inject(BasicsMaterialMaterialCatalogDataService);
    private readonly groupDataService = inject(BasicsMaterialMaterialGroupDataService);
    private readonly http = inject(HttpClient);
    private readonly configService = inject(PlatformConfigurationService);
    private multistepService = inject<UiCommonMultistepDialogService>(UiCommonMultistepDialogService);

    public async onStartWizard() {
        const currentCatalog = this.catalogDataService.getSelectedEntity();
        const materials = this.dataService.getList();
        const selectedMaterials = this.dataService.getSelection();
        const groups = this.groupDataService.getList();
        if (!currentCatalog && materials.length == 0 && selectedMaterials.length == 0) {
            return this.messageBoxService.showMsgBox('basics.material.updatePriceWizard.updateMaterialPriceNoMaterialCatalog', 'cloud.common.informationDialogHeader',
                'ico-info');
        } else if (currentCatalog && currentCatalog.IsInternetCatalog && materials.length == 0 && selectedMaterials.length == 0) {
            return this.messageBoxService.showMsgBox('basics.material.updatePriceWizard.cannotUpdateInternetMaterial', 'cloud.common.informationDialogHeader',
                'ico-info');
        } else {
            let option = BasicsMaterialUpdatePriceWizardOption.HighlightedMaterial;
            if (selectedMaterials.length === 0) {
                option = BasicsMaterialUpdatePriceWizardOption.MaterialResultSet;
                if (materials.length === 0) {
                    option = BasicsMaterialUpdatePriceWizardOption.HighlightedMaterialCatalog;
                    if (groups.length === 0) {
                        return this.messageBoxService.showMsgBox('basics.material.updatePriceWizard.noMaterials', 'cloud.common.informationDialogHeader',
                            'ico-info');
                    } else if (currentCatalog) {
                        const resp = await firstValueFrom(this.http.get(`${this.configService.webApiBaseUrl}basics/material/wizard/updatematerialprice/hasmaterialincatalog?catalogId=` + currentCatalog.Id));
                        if (resp) {
                            return this.showUpdatePriceDialog(option);
                        } else {
                            return this.messageBoxService.showMsgBox('basics.material.updatePriceWizard.noMaterials', 'cloud.common.informationDialogHeader',
                                'ico-info');
                        }
                    }
                }
            }
            return this.showUpdatePriceDialog(option);
        }
    }

    public async showUpdatePriceDialog(option: number) {
        const dataItem: IUpdatePriceDataComplete = {
            basicOption: option,
            updatePriceParam: {
                priceForm: {priceVersionFk: 0},
                priceResultSet: []
            }
        };
        const stepTitle = this.translateService.instant('basics.material.updatePriceWizard.updateMaterialPriceTitle');
        const basicSetting = new CustomStep('basicSetting', stepTitle, UpdateMaterialPriceStep1Component, [], 'basicOption');
        const searchSetting = new CustomStep('searchSetting', stepTitle, UpdateMaterialPriceStep2Component, [], 'updatePriceParam');
        const multistepDialog = new MultistepDialog(dataItem, [
            basicSetting, searchSetting
        ]);
        multistepDialog.titleFormat = MultistepTitleFormat.StepTitle;
        multistepDialog.dialogOptions.buttons = [{
            id: 'previousStep', caption: {key: 'cloud.common.previousStep'},
            isVisible: (info) => {
                return info.dialog.value?.stepIndex !== 0;
            },
            fn: (event, info) => {
                info.dialog.value?.goToPrevious();
            }
        }, {
            id: 'nextBtn', caption: {key: 'basics.common.button.nextStep'},
            isVisible: (info) => {
                return info.dialog.value?.stepIndex === 0;
            },
            isDisabled: (info) => {
                //todo require control by form
                //return info.dialog.value?this.nextBtnDisabled(info.dialog.value):true;
                return false;
            },
            fn: (event, info) => {
                info.dialog.value?.goToNext();
            }
        }, {
            id: 'updateInsert', caption: {key: 'basics.material.updatePriceWizard.updateOrInsertButton'},
            isVisible: (info) => {
                return info.dialog.value?.stepIndex === 1;
            },
            fn: (event, info) => {
                if (info.dialog.value) {
                    this.updateInsert(info.dialog.value.dataItem.updatePriceParam);
                }
            }
        }, {
            id: 'closeWin', caption: {key: 'basics.common.button.cancel'}, autoClose: true
        }];
        const result = await this.multistepService.showDialog(multistepDialog);
        return result?.value;
    }

    public async updateInsert(priceRequestParam: IBasicsMaterialUpdatePriceParam) {
        const items = priceRequestParam.priceResultSet.filter(item => item.Selected);
        const resp = await firstValueFrom(this.http.post(`${this.configService.webApiBaseUrl}basics/material/wizard/updatematerialprice/updateinsert`,
            {
                PriceVersionFk: priceRequestParam.priceForm.priceVersionFk,
                Materials: items
            }));
        if (resp) {
            const failedMaterialCodes = get(resp, 'failedMaterialCodes');
            const successMaterialCodes = get(resp, 'successMaterialCodes');
            if (failedMaterialCodes || successMaterialCodes) {
                const failedMaterials = failedMaterialCodes ? failedMaterialCodes as string[] : [];
                const successMaterials = successMaterialCodes ? successMaterialCodes as string[] : [];
                if (failedMaterials.length > 0) {
                    await this.messageBoxService.showMsgBox(this.translateService.instant({
                        key: 'basics.material.updatePriceWizard.partialUpdated',
                        params: {'p_0': failedMaterials.length}
                    }).text + failedMaterials.join(','), 'cloud.common.informationDialogHeader', 'ico-info');
                } else {
                    await this.messageBoxService.showMsgBox(this.translateService.instant({
                        key: 'basics.material.updatePriceWizard.allUpdated',
                        params: {'p_0': successMaterials.length}
                    }).text, 'cloud.common.informationDialogHeader', 'ico-info');
                }
            }
        }
    }

    public IsMaterialsInSameCatalog(option: number) {
        const materials = this.dataService.getList();
        const selectedMaterials = this.dataService.getSelection();
        const checkUniqueCatalogIds = (materials: IMaterialEntity[], option: number) => {
            const ids = materials.map(item => item.MaterialCatalogFk);
            const materialCatalogIds = uniq(ids);
            return materialCatalogIds.length === 1 && option !== BasicsMaterialUpdatePriceWizardOption.HighlightedMaterialCatalog;
        };
        if ((option === BasicsMaterialUpdatePriceWizardOption.HighlightedMaterial && selectedMaterials.length <= 1) || (option === BasicsMaterialUpdatePriceWizardOption.HighlightedMaterial && materials.length <= 1)) {
            return true;
        } else {
            return checkUniqueCatalogIds(option === BasicsMaterialUpdatePriceWizardOption.HighlightedMaterial ? selectedMaterials : materials, option);
        }
    }

    public checkIfInternetCatalog(option: number) {
        /* angularjs get IsInternetCatalog from catalog by http,here use get catalog IsInternetCatalog by getList*/
        const materials = this.dataService.getList();
        const selectedMaterials = this.dataService.getSelection();
        const materialCatalogs = this.catalogDataService.getList();
        let firstMaterial: IMaterialEntity | null = null;
        if (option === BasicsMaterialUpdatePriceWizardOption.HighlightedMaterial) {
            firstMaterial = selectedMaterials[0];
        } else if (option === BasicsMaterialUpdatePriceWizardOption.MaterialResultSet) {
            firstMaterial = materials[0];
        }
        if (firstMaterial != null) {
            const catalogId = firstMaterial.MaterialCatalogFk;
            const materialCatalog = materialCatalogs.find(item => {
                return item.Id == catalogId;
            });
            if (materialCatalog) {
                return materialCatalog.IsInternetCatalog;
            }
        }
        return true;
    }
}