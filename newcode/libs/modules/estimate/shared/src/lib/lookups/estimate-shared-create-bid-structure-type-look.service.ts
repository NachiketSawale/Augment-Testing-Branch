/*
 * Copyright(c) RIB Software GmbH
 */

import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { inject, Injectable } from '@angular/core';
import { IEstimateSharedLeadingStructureEntity } from '@libs/estimate/interfaces';
import { EstimateMainContextService } from '../common';
import { PlatformTranslateService } from '@libs/platform/common';
import { forEach } from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class EstimateSharedCreateBidStructureTypeLookService<IEntity extends object > extends UiCommonLookupEndpointDataService <IEstimateSharedLeadingStructureEntity, IEntity >{
	private readonly estimateMaincontextService = inject(EstimateMainContextService);
	private readonly translateService = inject(PlatformTranslateService);

	public constructor(){

		super(
			{
				httpRead: { route: 'estimate/main/lookup/', endPointRead: 'getcreatebidstructuretypes', usePostForRead: true},
				filterParam: true,
				prepareListFilter: context => {
					return {
						ProjectFk: this.estimateMaincontextService.getProjectId(),
					};
				}},
			{
				uuid: 'b7872df0cbb5464ee00237bc32486e00',
				idProperty: 'Id',
				valueMember: 'Id',
				displayMember: 'Desc',
				dialogOptions: {
					headerText: {
						text: 'Structure',
					}
				}
			});
	}

	public override convertList(list: IEstimateSharedLeadingStructureEntity[]): IEstimateSharedLeadingStructureEntity[]{
		const res: IEstimateSharedLeadingStructureEntity[] = [
			{Id: 1, RootItemId: 0, IsCostGroupCat: false, StructureName:'', Desc: this.translateService.instant('estimate.main.boqHeaderFk').text},
			{Id: 4, RootItemId: 0, IsCostGroupCat: false, StructureName:'', Desc: this.translateService.instant('estimate.main.mdcControllingUnitFk').text},
			{Id: 3, RootItemId: 0, IsCostGroupCat: false, StructureName:'', Desc: this.translateService.instant('estimate.main.prjLocationFk').text},
			{Id: 2, RootItemId: 0, IsCostGroupCat: false, StructureName:'', Desc: this.translateService.instant('estimate.main.psdActivityFk').text},
			{Id: 16, RootItemId: 0, IsCostGroupCat: false, StructureName:'', Desc: this.translateService.instant('estimate.main.lineItemGroupingContainer').text}
		];

		forEach(list, item=> res.push(item));

		return res;
	}
}

