/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import { get } from 'lodash';
import {
    DataServiceFlatLeaf,
    IDataServiceChildRoleOptions,
    IDataServiceEndPointOptions,
} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import { IPrcStructureEventEntity } from '../model/entities/prc-structure-event-entity.interface';
import { PrcStructureComplete } from '../model/complete-class/prc-structure-complete.class';
import {BasicsProcurementStructureDataService} from '../procurement-structure/basics-procurement-structure-data.service';
import {tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {PlatformConfigurationService} from '@libs/platform/common';
import { IPrcStructureEntity } from '@libs/basics/interfaces';


/**
 * Procurement structure event data service
 */
@Injectable({
    providedIn: 'root',
})
export class BasicsProcurementStructureEventDataService extends DataServiceFlatLeaf<IPrcStructureEventEntity,IPrcStructureEntity,PrcStructureComplete> {
    private http = inject(HttpClient);
    private config = inject(PlatformConfigurationService);

    public constructor(parentService: BasicsProcurementStructureDataService) {
        const options: IDataServiceOptions<IPrcStructureEventEntity> = {
            apiUrl: 'basics/procurementstructure/event',
            createInfo: <IDataServiceEndPointOptions>{
                endPoint: 'createevent',
                usePost: true,
                prepareParam: ident => {
                    return {
                        MainItemId: ident.pKey1
                    };
                }
            },
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'list'
            },
            roleInfo: <IDataServiceChildRoleOptions<IPrcStructureEventEntity, IPrcStructureEntity, PrcStructureComplete>>{
                role: ServiceRole.Leaf,
                itemName: 'PrcStructureEvent',
                parent: parentService
            }
        };
        super(options);
    }

    protected override provideLoadPayload(): object {
        const parentSelection = this.getSelectedParent();
        if (parentSelection) {
            return {
                mainItemId: parentSelection.Id
            };
        } else {
            throw new Error('There should be a selected parent catalog to load the event data');
        }
    }

    protected override onLoadSucceeded(loaded: object): IPrcStructureEventEntity[] {
        if (loaded) {
            return get(loaded, 'Main', []);
        }
        return [];
    }

    public deepCopy() {
        const parentItem = this.getSelectedParent();
        if (parentItem !== undefined) {
            this.http.post(this.config.webApiBaseUrl + 'basics/procurementstructure/event/deepcopy?mainItemId=' + parentItem.Id, this.getSelection()).pipe(
                tap(
                    response => {
                        //todo reload event list
                    }
                )
            );
        }
    }

    public override isParentFn(parentKey: IPrcStructureEntity, entity: IPrcStructureEventEntity): boolean {
		return entity.PrcStructureFk === parentKey.Id;
	}
}
