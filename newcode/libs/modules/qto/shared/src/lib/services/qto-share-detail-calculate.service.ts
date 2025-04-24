/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import * as _ from 'lodash';
import {HttpClient} from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {IQtoShareDetailEntity} from '../model/entities/qto-share-detail-entity.interface';
import {QtoShareDetailGridComplete} from '../model/qto-share-detail-complete.class';
import {QtoShareDetailDataService} from '../services/qto-share-detail-data.service';
import {CompleteIdentification, IEntityIdentification, PlatformConfigurationService} from '@libs/platform/common';
import {ValidationInfo} from '@libs/platform/data-access';
import {QtoShareFormulaType} from '../model/enums/qto-share-formula-type.enum';
import {IQtoShareHeaderEntity} from '../model/entities/qto-share-header-entity.interface';

@Injectable({
    providedIn: 'root'
})

/**
 * calculate qto line service
 */
export class QtoShareDetailCalculateService<T extends IQtoShareDetailEntity, U extends QtoShareDetailGridComplete, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> {
    protected readonly http = inject(HttpClient);
    protected readonly configurationService = inject(PlatformConfigurationService);

    public constructor(protected dataService: QtoShareDetailDataService<T, U, PT, PU>) {
    }

    /**
     * calculate qto lines
     */
    public calculateQtoLines() {
        this.dataService.deleteTemporaryQtos();
        //TODO: missing => moudles: package, pes, boq, bill and wip -lnt
        this.dataService.parentService.save().then(() => {
            const qtoHeader = this.dataService.getCurrentQtoHeader();
            const itemsPredefine = this.getItemsPredefineList();
            if (itemsPredefine.length > 0) {
                //TODO: missing => qtoMainFormulaUpdateDialogService -lnt
                // qtoMainFormulaUpdateDialogService.showDialog(itemsPredefine).then(function (result) {
                //     if (result.ok) {
                //         const itemList = qtoMainFormulaUpdateDialogService.dataService.getList();
                //         const qtoDetailCompletes: QtoShareDetailGridComplete[] = [];
                //         _.each(itemList, function (item) {
                //             const qtoDetailComplete = {
                //                 MainItemId: item.Id,
                //                 Id: item.Id,
                //                 QtoDetail: item
                //             };
                //
                //             qtoDetailCompletes.push(qtoDetailComplete);
                //         });
                //         reCalculateQtoLine(qtoHeader, qtoDetailCompletes);
                //     }
                // });
            } else {
                void this.reCalculateQtoLine(qtoHeader);
            }
        });
    }

    /**
     * to get the conflict items
     * @private
     */
    private getItemsPredefineList() {
        const items = this.dataService.getList();
        const itemsCopy = _.cloneDeep(items);
        return _.filter(itemsCopy, (item) => {
            let isValidate = false;
            if (item.QtoFormula && item.QtoFormula.QtoFormulaTypeFk === QtoShareFormulaType.Predefine) {
                if (item.Operator1 && item.QtoFormula.Operator1 && item.QtoFormula.Operator1.indexOf(item.Operator1) === -1) {
                    item.Operator1 = '';
                    const info: ValidationInfo<T> = new ValidationInfo<T>(item, '', 'Operator1');
                    void this.dataService.dataValidationService.asyncCommonValidateOperators(info);
                    isValidate = true;
                }

                if (item.Operator2 && item.QtoFormula.Operator2 && item.QtoFormula.Operator2.indexOf(item.Operator2) === -1) {
                    item.Operator2 = '';
                    const info: ValidationInfo<T> = new ValidationInfo<T>(item, '', 'Operator2');
                    void this.dataService.dataValidationService.asyncCommonValidateOperators(info);
                    isValidate = true;
                }

                if (item.Operator3 && item.QtoFormula.Operator3 && item.QtoFormula.Operator3.indexOf(item.Operator3) === -1) {
                    item.Operator3 = '';
                    const info: ValidationInfo<T> = new ValidationInfo<T>(item, '', 'Operator3');
                    void this.dataService.dataValidationService.asyncCommonValidateOperators(info);
                    isValidate = true;
                }

                if (item.Operator4 && item.QtoFormula.Operator4 && item.QtoFormula.Operator4.indexOf(item.Operator4) === -1) {
                    item.Operator4 = '';
                    const info: ValidationInfo<T> = new ValidationInfo<T>(item, '', 'Operator4');
                    void this.dataService.dataValidationService.asyncCommonValidateOperators(info);
                    isValidate = true;
                }

                if (item.Operator5 && item.QtoFormula.Operator5 && item.QtoFormula.Operator5.indexOf(item.Operator5) === -1) {
                    item.Operator5 = '';
                    const info: ValidationInfo<T> = new ValidationInfo<T>(item, '', 'Operator5');
                    void this.dataService.dataValidationService.asyncCommonValidateOperators(info);
                    isValidate = true;
                }
            }
            return isValidate;
        });
    }

    /**
     * recalculate the qto line
     * @param qtoHeader
     * @param qtoDetailCompletes
     * @private
     */
    private async reCalculateQtoLine(qtoHeader: IQtoShareHeaderEntity | undefined, qtoDetailCompletes: QtoShareDetailGridComplete | undefined = undefined) {
        if (qtoHeader) {
            const postParam = {
                QtoHeaderId: qtoHeader.Id,
                Goniometer: qtoHeader.BasGoniometerTypeFk,
                NoDecimals: qtoHeader.NoDecimals,
                QtoDetailToSave: qtoDetailCompletes,
            };

            const url = this.configurationService.webApiBaseUrl + 'qto/main/detail/calculate';
            await firstValueFrom(this.http.post(url, postParam));

            //TODO: missing => basicsLookupdataLookupDescriptorService and updateBoqItemQuantity
            // this.http.post(this.configurationService.webApiBaseUrl + 'qto/main/detail/calculate', postParam).subscribe( () => {
            //     // this.load().then(function () {
            //     //     var boqItemList = $injector.get('basicsLookupdataLookupDescriptorService').getData('boqItemLookupDataService');
            //     //     var boqItemFks = (_.uniq((_.map(boqItemList, 'BoqItemFk'))));
            //     //     var qtoDetailList = service.getList();
            //     //     this.parentService.updateBoqItemQuantity(boqItemFks, qtoDetailList);
            //     // });
            // });
        }
    }

}