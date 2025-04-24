import { inject, Injectable } from '@angular/core';
import { FieldType, LookupSimpleEntity, UiCommonLookupEndpointDataService, UiCommonLookupSimpleDataService } from '@libs/ui/common';
import { IOenServicePartEntity } from '../../model/entities/oen-service-part-entity.interface';
import { IOenZzEntity } from '../../model/entities/oen-zz-entity.interface';
import { IOenZzVariantEntity } from '../../model/entities/oen-zz-variant-entity.interface';
import { ITranslated, PlatformTranslateService } from '@libs/platform/common';
import { BoqItemDataServiceBase } from '../boq-main-boq-item-data.service';

@Injectable({
	providedIn: 'root'
})
export class BoqMainOenZzVariantLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IOenZzVariantEntity, TEntity> {

	public constructor() {
		super(
			{
				//TODO-BOQ: 'prepareListFilter' is not working so pass ID statically.
				httpRead: { route: 'boq/main/oen/lvheader/', endPointRead: 'listzzvariant' },
				filterParam: true,
				prepareListFilter: context => {
					return 'zzId=1011224'; //TODO-BOQ get zzId
				}
			},
			{
				uuid: 'e2fdfc883ff64f63bccf2b0c71505a10',
				idProperty: 'Id',
				valueMember: 'Id',
				displayMember: 'Nr',
				showGrid: true,
				showClearButton: true,
				gridConfig: {
					columns: [
						{
							id: 'Nr',
							model: 'Nr',
							type: FieldType.Code,
							label: 'boq.main.oen.dto.OenZzVariantDto.Nr',
							sortable: true,
						},
						{
							id: 'Description',
							model: 'Description',
							type: FieldType.Description,
							label: 'boq.main.oen.dto.OenZzVariantDto.Description',
							sortable: true,
						},
					]
				}
			});
	}
}

@Injectable({
	providedIn: 'root'
})
export class BoqMainOenZzLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IOenZzEntity, TEntity> {

	private boqItemDataService!: BoqItemDataServiceBase;

	private boqMainOenZzVariantLookupService = inject(BoqMainOenZzVariantLookupService);

	public constructor() {
		super(
			{
				httpRead: { route: 'boq/main/oen/lvheader/', endPointRead: 'listzz' },
				filterParam: true,
				prepareListFilter: context => {
					return 'lvHeaderId=' + this.boqItemDataService.getSelectedBoqHeaderId(); //TODO-BOQ use OenLvHeaderService
				}
			},
			{
				uuid: '43683f5e7d484ff1bf274762205f0e1b',
				idProperty: 'Id',
				valueMember: 'Id',
				displayMember: 'Nr',
				showGrid: true,
				showClearButton: true,
				events: [{
					name: 'onSelectedItemChanged',
					handler: (e) => {
						this.boqMainOenZzVariantLookupService.cache.clear(); //TODO-BOQ update oenZzVariantLookup on item changed (binding not working)
					}
				}],
				gridConfig: {
					uuid: 'e2fdfc883ff64f63bccf2b0c71505a10',
					columns: [
						{ id: 'Nr', model: 'Nr', type: FieldType.Code, label: 'boq.main.oen.dto.OenZzDto.Nr', sortable: true, visible: true },
						{ id: 'Description', model: 'Description', type: FieldType.Description, label: 'boq.main.oen.dto.OenZzDto.Description', sortable: true, visible: true },
					]
				}
			});
	}
	public setBoqItemDataService(dataService: BoqItemDataServiceBase){
		this.boqItemDataService = dataService;
	}
}

@Injectable({
	providedIn: 'root'
})
export class BoqMainOenStatusLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<LookupSimpleEntity, TEntity> {

	/**
	 * constructor
	 */
	public constructor() {
		super('boq.main.oenstatus', {
			displayMember: 'Description',
			uuid: '',
			valueMember: 'Id'
		});
	}
}

@Injectable({
	providedIn: 'root'
})
export class BoqMainOenServicePartLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IOenServicePartEntity, TEntity> {
	public constructor() {
		super(
			{
				//TODO-BOQ: 'prepareListFilter' is not working so pass ID statically.
				httpRead: { route: 'boq/main/oen/lvheader/', endPointRead: 'listservicepart?lvHeaderId=1064061' },
				filterParam: true,
				prepareListFilter: context => {
					return {
						lvHeaderId: 1064061,
					};
				}
			},
			{
				uuid: 'e2fdfc883ff64f63bccf2b0c71505a10',
				idProperty: 'Id',
				valueMember: 'Id',
				displayMember: 'Nr',
				showGrid: true,
				gridConfig: {
					columns: [
						{
							id: 'Nr',
							model: 'Nr',
							type: FieldType.Code,
							label: 'boq.main.oen.dto.OenServicePartDto.Nr',
							sortable: true,
							visible: true
						},
						{
							id: 'Description',
							model: 'Description',
							type: FieldType.Description,
							label: 'boq.main.oen.dto.OenServicePartDto.Description',
							sortable: true,
							visible: true
						},
					]
				}
			}
		);
	}
}

@Injectable({
	providedIn: 'root'
})
export class BoqMainOenPricingMethodLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<LookupSimpleEntity, TEntity> {

	/**
	 * constructor
	 */
	public constructor() {
		super('boq.main.oenpricingmethod', {
			displayMember: 'Description',
			uuid: '',
			valueMember: 'Id'
		});
	}
}

@Injectable({
	providedIn: 'root'
})
export class BoqMainOenReleaseStatusLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<LookupSimpleEntity, TEntity> {

	/**
	 * constructor
	 */
	public constructor() {
		super('boq.main.oenreleasestatusfk', {
			displayMember: 'Description',
			uuid: '',
			valueMember: 'Id'
		});
	}
}

@Injectable({
	providedIn: 'root'
})
export class BoqMainOenLbMetadataTypeLookupDataService<TEntity extends object> extends UiCommonLookupSimpleDataService<LookupSimpleEntity, TEntity> {
	private readonly translate = inject(PlatformTranslateService);
	private codes = [this.translate.instant('boq.main.oen.lbMetadataType.1'), this.translate.instant('boq.main.oen.lbMetadataType.2'), this.translate.instant('boq.main.oen.lbMetadataType.3'),this.translate.instant('boq.main.oen.lbMetadataType.4')];
	private lookupTypes :{ Id: number, Code: ITranslated }[] = [{Id: 1, Code: this.codes[0]}, {Id: 2, Code: this.codes[1]}, {Id: 3, Code: this.codes[2]}, {Id: 4, Code: this.codes[3]}];

	/**
	 * constructor
	 */
	public constructor() {
		super('', {
			displayMember: 'Code',
			uuid: '',
			valueMember: 'Id'
		});
	}

	//TODO-BOQ: getLookupData & getItemById will be added.
	// If lookupTypes declared as any type it fetches error.
}