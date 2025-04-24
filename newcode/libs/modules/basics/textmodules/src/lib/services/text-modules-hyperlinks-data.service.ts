/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {
    DataServiceFlatLeaf,
    IDataServiceChildRoleOptions,
    IDataServiceEndPointOptions,
    IDataServiceOptions,
    ServiceRole
} from '@libs/platform/data-access';
import * as _ from 'lodash';
import {ITextModuleHyperlinkEntity} from '../model/entities/textmodulehyperlink-entity.interface';
import {ITextModuleEntity} from '../model/entities/textmodule-entity.interface';
import {BasicsTextModulesMainService} from './text-modules-main-data.service';
import {TextModuleCompleteEntity} from '../model/entities/textmodulecomplete-entity.class';

@Injectable({
    providedIn: 'root'
})
export class BasicsTextModulesHyperlinksDataService extends DataServiceFlatLeaf<ITextModuleHyperlinkEntity, ITextModuleEntity, TextModuleCompleteEntity> {

    public readonlyFields: string[] = ['LanguageFk', 'DescriptionInfo', 'Url'];

    public constructor() {
        const options: IDataServiceOptions<ITextModuleHyperlinkEntity> = {
            apiUrl: 'basics/textmodules/hyperlink',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'getbyparentid',
                usePost: false,
                prepareParam: ident => {
                    return {
                        mainItemId: ident.pKey1
                    };
                }
            },
            entityActions: {
                deleteSupported: true,
                createSupported: true
            },
            roleInfo: <IDataServiceChildRoleOptions<ITextModuleHyperlinkEntity, ITextModuleEntity, TextModuleCompleteEntity>>{
                role: ServiceRole.Leaf,
                itemName: 'TextModuleHyperlink',
                parent: inject(BasicsTextModulesMainService)
            }
        };

        super(options);
        this.processor.addProcessor({

            process: (item) => {
                //todo processItem
                this.updateItemReadonly(item);
            },
            revertProcess: (item: ITextModuleHyperlinkEntity) => {

            }
        });
    }

    public gridReadonly: boolean = true;

    public updateItemReadonly(item: ITextModuleHyperlinkEntity) {
        const fields = [];
        const gridReadonly: boolean = true;
        _.forEach(this.readonlyFields, function (field) {
            fields.push({
                field: field,
                readonly: gridReadonly
            });
        });
    }

    protected override provideLoadPayload(): object {
        const parentSelection = this.getSelectedParent();
        if (parentSelection) {
            return {
                mainItemId: parentSelection.Id
            };
        }
        return {
            mainItemId: -1
        };
    }

    protected override onLoadSucceeded(loaded: ITextModuleHyperlinkEntity[]): ITextModuleHyperlinkEntity[] {
        return loaded;
    }
}
