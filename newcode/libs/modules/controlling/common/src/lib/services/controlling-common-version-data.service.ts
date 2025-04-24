/*
 * Copyright(c) RIB Software GmbH
 */

import {
    DataServiceFlatLeaf, DataServiceFlatRoot,
    IDataServiceChildRoleOptions,
    IDataServiceOptions,
    ServiceRole
} from '@libs/platform/data-access';
import {
    CompleteIdentification, PlatformConfigurationService, PlatformTranslateService,
} from '@libs/platform/common';
import {
    IControllingCommonBisPrjHistoryEntity
} from '../model/entities/controlling-common-bis-prj-history-entity.interface';
import {IControllingCommonProjectEntity} from '../model/entities/controlling-common-project-entity.interface';
import {inject} from '@angular/core';
import {
    IDialogResult,
    UiCommonInputDialogService,
    UiCommonMessageBoxService
} from '@libs/ui/common';
import {HttpClient} from '@angular/common/http';
import * as _ from 'lodash';
/**
 * The basic data service for procurement item entity
 */
export abstract class ControllingCommonVersionDataService<T extends IControllingCommonBisPrjHistoryEntity, PT extends IControllingCommonProjectEntity,PU extends CompleteIdentification<PT>> extends DataServiceFlatLeaf<T, PT, PU> {

    private http = inject(HttpClient);
    private configService = inject(PlatformConfigurationService);
    private translate = inject(PlatformTranslateService);
    private readonly messageBoxService = inject(UiCommonMessageBoxService);
    private readonly inputDialogService = inject(UiCommonInputDialogService);

    protected constructor (protected parentService: DataServiceFlatRoot<PT,PU>) {
        const options: IDataServiceOptions<T> = {
            apiUrl: 'controlling/BisPrjHistory',
            readInfo: {
                endPoint: 'list',
                usePost: false
            },
            roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
                role: ServiceRole.Leaf,
                itemName: 'BisPrjHistory',
                parent: parentService,
            }
        };
        super(options);
    }

    private getProperty = <T, K extends keyof T>(obj: T, key: K) => {
        return obj[key];
    };
    protected override onLoadSucceeded(loaded:T[]):T [] {
        return loaded;
    }
    protected  override provideLoadPayload(): object {
        const parent = this.getSelectedParent();
        if (parent) {
            return {
                mainItemId: parent.Id
            };
        } else {
            throw new Error('There should be a selected parent header record to load the data');
        }
    }
    public override delete(entities: T[] | T) {
        this.messageBoxService.deleteSelectionDialog()?.then((dialogResult:IDialogResult)=>{
            if(dialogResult.closingButtonId==='yes'){
                const parent = this.getSelectedParent();
                const entity = _.isArray(entities)?entities.pop():entities;
                this.http.get(this.configService.webApiBaseUrl + 'controlling/BisPrjHistory/DeleteControllingVersionAssociation' + '?projectId=' + parent?.Id + '&&bisPrjHistoryId=' + entity?.Id).subscribe(response=> {
                    const returnId = response as number | 0 ;
                    const lastVersion = _.max(_.map(this.getList(),'Id')) as number|0;
                    const option = {
                        headerText:this.translate.instant('cloud.common.informationDialogHeader'),
                        bodyText:this.translate.instant('controlling.projectcontrols.deletedfailed'),//deletedsuccessfully
                        iconClass:'ico-error',//'ico-info',
                        dontShowAgain:false
                    };
                    if(returnId&&lastVersion&&returnId===lastVersion){
                        option.bodyText = this.translate.instant('controlling.projectcontrols.deletedsuccessfully');
                        option.iconClass = 'ico-info';
                        super.delete(entities);
                    }
                    this.messageBoxService.showMsgBox(option);
                });
            }
        });
    }

}