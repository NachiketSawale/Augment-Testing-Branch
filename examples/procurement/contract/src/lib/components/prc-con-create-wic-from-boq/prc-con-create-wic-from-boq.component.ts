/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { IDescriptionInfo, PlatformCommonModule, PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { createLookup, FieldType, getCustomDialogDataToken, GridComponent, IGridConfiguration, StandardDialogButtonId, UiCommonModule } from '@libs/ui/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProcurementContractSourceBoqLookupService } from '../../lookups/procurement-contract-source-boq-lookup.service';
import { BasicsSharedCurrencyLookupService, BasicsSharedMaterialCatalogLookupService } from '@libs/basics/shared';
import { isUndefined } from 'lodash';
import { ProcurementContractAssembliesWicGroupLookupService } from '../../lookups/procurement-contract-assemblies-wic-group-lookup.service';

interface IWicEntitySelectable {
	BoqItemFk?: number;
	BoqHeaderFk?: number;
	WicGroupFk?: number;
	ReferenceNo?: string;
	OutlineSpec?: string;
}

interface IWicGridEntity {
	Id: number;
	BoqHeader: {
		BasCurrencyFk: number;
	};
	BoqRootItem: {
		Reference: string;
		BriefInfo: IDescriptionInfo;
		ExternalCode: string;
		IsDisabled: boolean;
	};
	WicCatBoq: {
		MdcMaterialCatalogFk: number;
	};
}

class WicGridEntity {
	public Id?: number;
	public Reference?: string;
	public BriefInfo?: IDescriptionInfo;
	public ExternalCode?: string;
	public IsDisabled?: boolean;
	public BasCurrencyFk?: number;
	public MdcMaterialCatalogFk?: number;
}

@Component({
	selector: 'procurement-contract-create-wic-from-boq',
	standalone: true,
	imports: [PlatformCommonModule, GridComponent, DecimalPipe, UiCommonModule, FormsModule],
	templateUrl: './prc-con-create-wic-from-boq.component.html',
	styleUrl: './prc-con-create-wic-from-boq.component.scss',
})
export class PrcConCreateWicFromBoqComponent {
	public BoqItemFk?: number;
	public selectItems: WicGridEntity[] = [];
	public BoqHeaderFk?: number;
	public WicGroupFk?: number;
	public ReferenceNo: string = '';
	public OutlineSpec: string = '';
	public Reference: string = '';

	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);

	protected gridConfig: IGridConfiguration<WicGridEntity> = {
		uuid: 'fd308c3dd8494cbabee281e8fa2d81c6',
		columns: [
			{
				id: 'reference',
				model: 'Reference',
				width: 100,
				type: FieldType.Code,
				label: { key: 'boq.main.Reference' },
				sortable: true,
				visible: true,
			},
			{
				id: 'briefinfo',
				model: 'BriefInfo',
				width: 120,
				type: FieldType.Description,
				label: { key: 'boq.main.BriefInfo' },
				sortable: true,
				visible: true,
			},
			{
				id: 'externalcode',
				model: 'ExternalCode',
				width: 120,
				type: FieldType.Code,
				label: { key: 'boq.main.ExternalCode' },
				sortable: true,
				visible: true,
				readonly: true,
			},
			{
				id: 'mdcmaterialcatalogfk',
				model: 'MdcMaterialCatalogFk',
				width: 120,
				type: FieldType.Lookup,
				label: { key: 'basics.material.materialCatalog' },
				sortable: true,
				readonly: true,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedMaterialCatalogLookupService,
					showDescription: true,
					descriptionMember: 'Code',
				}),
			},
			{
				id: 'isdisabled',
				model: 'IsDisabled',
				width: 120,
				type: FieldType.Boolean,
				label: { key: 'boq.main.IsDisabled' },
				sortable: true,
				visible: true,
				readonly: true,
			},
			{
				id: 'bascurrencyfk',
				model: 'BasCurrencyFk',
				width: 120,
				type: FieldType.Lookup,
				label: { key: 'cloud.common.entityCurrency' },
				sortable: true,
				readonly: true,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedCurrencyLookupService,
					descriptionMember: 'Currency',
				}),
			},
		],
		items: this.selectItems,
	};
	private readonly translateService = inject(PlatformTranslateService);
	public readonly sourceBoqLookupService = inject(ProcurementContractSourceBoqLookupService);
	public readonly assembliesWicGroupLookupService = inject(ProcurementContractAssembliesWicGroupLookupService);
	private readonly dialogWrapper = inject(getCustomDialogDataToken<IWicEntitySelectable, PrcConCreateWicFromBoqComponent>());

	public constructor() {}

	public async onOKBtnClicked() {
		if (this.BoqItemFk && this.BoqHeaderFk && this.WicGroupFk) {
			this.dialogWrapper.value = {
				BoqItemFk: this.BoqItemFk,
				BoqHeaderFk: this.BoqHeaderFk,
				WicGroupFk: this.WicGroupFk,
				ReferenceNo: this.ReferenceNo,
				OutlineSpec: this.OutlineSpec,
			};
		}
		this.dialogWrapper.close(StandardDialogButtonId.Ok);
	}

	public okBtnDisabled(): boolean {
		return isUndefined(this.BoqItemFk && this.WicGroupFk);
	}

	public async wicGroupChange(): Promise<void> {
		const params = { wicGroupId: this.WicGroupFk! };
		try {
			const responseData: IWicGridEntity[] = await firstValueFrom(this.http.get<IWicGridEntity[]>(`${this.configService.webApiBaseUrl}boq/wic/boq/list`, { params: params }));
			if (responseData && responseData.length > 0) {
				this.selectItems = responseData.map((e) => ({
					Id: e.Id,
					Reference: e.BoqRootItem.Reference,
					BriefInfo: e.BoqRootItem.BriefInfo,
					ExternalCode: e.BoqRootItem.ExternalCode,
					IsDisabled: e.BoqRootItem.IsDisabled,
					BasCurrencyFk: e.BoqHeader.BasCurrencyFk,
					MdcMaterialCatalogFk: e.WicCatBoq.MdcMaterialCatalogFk,
				}));
			} else {
				this.selectItems = [];
			}
		} catch (error) {
			console.error('Failed to fetch WIC group data:', error);
			this.selectItems = [];
		}
	}

	public sourceBoqChange() {
		if (!this.BoqItemFk) {
			return;
		}
		const boqItemLookupEty = this.sourceBoqLookupService.cache.getItem({ id: this.BoqItemFk! });
		if (boqItemLookupEty) {
			this.ReferenceNo = boqItemLookupEty.Reference;
			this.OutlineSpec = boqItemLookupEty.BriefInfo.Translated;
			this.BoqHeaderFk = boqItemLookupEty.BoqHeaderFk;
		}
	}
}
