/*
 * Copyright(c) RIB Software GmbH
 */
import {IPrcItemInfoBLEntity} from '../model/entities/prc-item-info-blentity.interface';
import {
    IIdentificationData,
    PlatformConfigurationService
} from '@libs/platform/common';
import {
    DataServiceFlatLeaf,
    DataServiceFlatNode, IDataServiceChildRoleOptions,
    IDataServiceOptions,
    ServiceRole
} from '@libs/platform/data-access';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
    PrcItemInfoBlEntity
} from '../model/entities/prc-item-info-bl-httpresponse-entity.class';
import {IPrcItemEntity} from '../model/entities';
import {PrcCommonItemComplete} from '../model/procurement-common-item-complete.class';
import {firstValueFrom} from 'rxjs';

export abstract class ProcurementCommonItemInfoBlDataService<T extends IPrcItemInfoBLEntity,PT extends IPrcItemEntity, PU extends PrcCommonItemComplete>extends DataServiceFlatLeaf<T, PT, PU>{
    private http = inject(HttpClient);
    private readonly configService = inject(PlatformConfigurationService);
    protected constructor(protected parentService: DataServiceFlatNode<PT, PU, object, object>) {

        const options: IDataServiceOptions<T> = {
            apiUrl: 'procurement/common/prciteminfobl',
            readInfo: {
                endPoint: 'list',
                usePost: false,
                prepareParam: (ident: IIdentificationData) => {
                    return {mainId: ident.pKey1!};
                },
            },
            roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
                role: ServiceRole.Leaf,
                itemName: 'PrcItemInfoBLDto',
                parent: parentService
            }
        };
        super(options);
    }
    public async getItemInfoBlSpecification(){
        const selectedEntity = this.getSelectedEntity();
        const basClobsFk = selectedEntity?.BasClobsFk;
        if (basClobsFk) {
            const response = await firstValueFrom(this.http.get<PrcItemInfoBlEntity>(this.configService.webApiBaseUrl + 'cloud/common/clob/getclobbyid?id=' + basClobsFk));
            return response;
        }
        return undefined;
    }

    public override isParentFn(parentKey: PT, entity: T): boolean {
		return entity.PrcItemFk === parentKey.Id;
	}
}