/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import {FieldType, UiCommonLookupTypeDataService} from '@libs/ui/common';
import {IProcurementStructureLookupEntity} from './entities/procurement-structure-lookup-entity';
import { MainDataDto } from '../model/dtoes';
import { IPrcStructureTaxEntity } from '@libs/basics/interfaces';
import { BasicsSharedCompanyContextService } from '../services';
import { PlatformHttpService } from '@libs/platform/common';
/*
 * Procurement Structure
 */
@Injectable({
    providedIn: 'root'
})
export class BasicsSharedProcurementStructureLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IProcurementStructureLookupEntity, TEntity> {

	 private readonly httpService = inject(PlatformHttpService);
	 private readonly companyContextService = inject(BasicsSharedCompanyContextService);

    public constructor() {
        super('prcstructure', {
            uuid: 'a4cc03889298406495178b513a0b8ead',
            idProperty: 'Id',
            valueMember: 'Id',
            displayMember: 'Code',
            gridConfig: {
                uuid: 'a4cc03889298406495178b513a0b8ead',
                columns: [
                    {
                        id: 'code',
                        model: 'Code',
                        type: FieldType.Code,
                        label: {text: 'Code', key: 'cloud.common.entityCode'},
                        sortable: true,
                        visible: true,
                        readonly: true
                    },
                    {
                        id: 'description',
                        model: 'DescriptionInfo',
                        type: FieldType.Translation,
                        label: {text: 'Description', key: 'cloud.common.entityDescription'},
                        sortable: true,
                        visible: true,
                        readonly: true
                    },
                    {
                        id: 'comment',
                        model: 'CommentTextInfo',
                        type: FieldType.Translation,
                        label: {text: 'Comment', key: 'cloud.common.entityCommentText'},
                        sortable: true,
                        visible: true,
                        readonly: true
                    },
	                {
		                id: 'allowAssignment',
		                model: 'AllowAssignment',
		                type: FieldType.Boolean,
		                label: { text: 'Allow Assignment', key: 'basics.procurementstructure.allowAssignment' },
		                sortable: true,
		                visible: true,
		                readonly: true,
	                },
                ]
            },
            treeConfig: {
                parentMember: 'PrcStructureFk',
                childMember: 'ChildItems'
            },
            dialogOptions: {
                headerText: {
	                key: 'basics.procurementstructure.dialogTitleStructure',
                }
            },
            showDialog: true,
	         selectableCallback: (item) => item.IsLive && item.AllowAssignment,
	         inputSearchMembers: ['Code', 'DescriptionInfo.Description'],
        });
    }

	 public async getMdcSalesTaxGroupFk(prcStructureFk: number) {
		 const company = this.companyContextService.loginCompanyEntity;
		 const result = await this.httpService.get('basics/procurementstructure/taxcode/list', {params: {mainItemId: prcStructureFk}});
		 const prcStructTaxEntities = new MainDataDto<IPrcStructureTaxEntity>(result).Main;
		 return prcStructTaxEntities?.find(e => e.MdcLedgerContextFk === company!.LedgerContextFk)?.MdcSalesTaxGroupFk;
	 }
}