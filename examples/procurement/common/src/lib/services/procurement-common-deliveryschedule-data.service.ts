/*
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification, IEntityIdentification, PlatformConfigurationService } from '@libs/platform/common';
import { DataServiceFlatLeaf, DataServiceFlatNode, IDataServiceChildRoleOptions, IDataServiceOptions, IReadOnlyField, ServiceRole } from '@libs/platform/data-access';
import { BasItemType, MainDataDto } from '@libs/basics/shared';
import { IProcurementCommonDeliveryScheduleEntity } from '../model/entities/procurement-common-deliveryschedule-entity.interface';
import { IPrcItemEntity } from '../model/entities';
import { ProcurementCommonDeliveryScheduleProcessor } from './processors';
import { inject } from '@angular/core';
import { ProcurementCommonRoundingService } from './helper';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { utcToZonedTime as tzUtcToZonedTime, format as tzFormat } from 'date-fns-tz';
import { sumBy } from 'lodash';

export abstract class ProcurementCommonDeliveryScheduleDataService<T extends IProcurementCommonDeliveryScheduleEntity,PT extends IEntityIdentification, PU extends  CompleteIdentification<PT>>extends DataServiceFlatLeaf<T, PT, PU> {

	public Scheduled: {
		openQuantity: number;
		quantityScheduled: number;
		totalQuantity: number;
	} | undefined;
	public readonly readonlyProcessor: ProcurementCommonDeliveryScheduleProcessor<T, PT, PU>;
	private readonly prcRoundingService = inject(ProcurementCommonRoundingService);
	private readonly roundingType = this.prcRoundingService.getRoundingType<IProcurementCommonDeliveryScheduleEntity>();
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);

	protected constructor(protected parentService: DataServiceFlatNode<PT, PU,object,object>,protected internalModule?:string) {

		const options: IDataServiceOptions<T> = {
			apiUrl: 'procurement/common/deliveryschedule',
			readInfo: {
				endPoint: 'list',
				usePost: false
			},
			roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
				role: ServiceRole.Leaf,
				itemName: 'PrcItemDelivery',
				parent: parentService
			}
		};

		super(options);
		this.readonlyProcessor = this.createReadonlyProcessor();
		this.processor.addProcessor([
			this.readonlyProcessor
		]);
	}

	protected override provideLoadPayload(): object {
		const parent = this.parentService.getSelectedEntity()!;
		return {
			MainItemId: this.getMainItemId(parent),
		};
	}

	protected override provideCreatePayload(): object {
		const parentSelected = this.parentService.getSelectedEntity()!;
		const currentItemList = this.getList();
		return {
			PrcItemFk: this.getMainItemId(parentSelected),
			PrcItemstatusFk:this.getMainItemStatus(parentSelected),
			RunningNumbers:currentItemList.map(e=>e.RunningNumber)
		};
	}

	protected override onCreateSucceeded(created: object): T {
		return created as unknown as T;
	}

	protected override onLoadSucceeded(loaded: object): T[] {
		const dataDto = new MainDataDto<T>(loaded);
		return dataDto.Main;
	}

	public getParentService() {
		return this.parentService;
	}

	public getParentSelection(){
		return this.parentService.getSelectedEntity();
	}

	public getInternalModule(){
		return this.internalModule;
	}



	public override canCreate(): boolean {
		const selectedItem = this.parentService.getSelectedEntity() as unknown as IPrcItemEntity;
		return this.canEditByItemType(selectedItem);
	}

	public override canDelete(): boolean {
		const selectedItem = this.parentService.getSelectedEntity() as unknown as IPrcItemEntity;
		return this.canEditByItemType(selectedItem);
	}

	public canEditByItemType(selectedItem : IPrcItemEntity){
		if(selectedItem){
			const itemTypeFk = selectedItem.BasItemTypeFk;
			return itemTypeFk !== BasItemType.TextElement;
		}
		return false;
	}

	public calculateDateRequired(){
		const parentSelectedItem = this.parentService.getSelectedEntity() as unknown as IPrcItemEntity;
		const date = new Date();
		const newDateRequiredDate = new Date(date.getDate() + (parentSelectedItem.TotalLeadTime === undefined ? 0 :parentSelectedItem.TotalLeadTime));
		return new Date(newDateRequiredDate.getTime() + newDateRequiredDate.getTimezoneOffset() * 60000);
	}

	public SelectQuantity() {
		const quantityScheduled = sumBy(this.getList(),e=>e.Quantity);

		const parentSelectedItem = this.getParentSelection() as unknown as IPrcItemEntity;

		const roundingTypeQuantity = this.roundingType.Quantity;
		const roundingTypeQuantityScheduled = this.roundingType.quantityScheduled;
		const roundingTypeOpenQuantity = this.roundingType.openQuantity;

		this.Scheduled!.totalQuantity = this.prcRoundingService.round(roundingTypeQuantity, parentSelectedItem.Quantity);
		this.Scheduled!.quantityScheduled = this.prcRoundingService.round(roundingTypeQuantityScheduled, quantityScheduled);
		this.Scheduled!.openQuantity = this.prcRoundingService.round(roundingTypeOpenQuantity, this.Scheduled!.totalQuantity - this.Scheduled!.quantityScheduled);
	}

	public setReadOnlyByItemType(selectedItem: T, itemTypeFk: number) {
		if (itemTypeFk === BasItemType.TextElement) {
			const readonlyFields: IReadOnlyField<T>[] = Object.keys(selectedItem).map(field => ({
				field:field,
				readOnly: true,
			}));
			this.setEntityReadOnlyFields(selectedItem, readonlyFields);
		}
	}

	public clearCache(){
		this.setList([]);
	}

	public formatter(value:number){
			return value.toFixed(3);
	}

	protected abstract getMainItemId(parent:PT):number;

	protected abstract getMainItemStatus(parent:PT):number;

	protected abstract createReadonlyProcessor():ProcurementCommonDeliveryScheduleProcessor<T, PT, PU>;

	protected async reload(mainItemId:number):Promise<void> {
		const readonlyFields = [
			{field: 'DateRequired',readonly:true},
			{field: 'TimeRequired',readonly:true},
			{field: 'Description',readonly:true},
			{field: 'Quantity',readonly:true},
			{field: 'CommentText',readonly:true},
			{field: 'RunningNumber',readonly:true},
			{field: 'AddressDto',readonly:true}
		] as unknown as  IReadOnlyField<T>[];

		const responseData = await firstValueFrom(this.http.get(this.configService.webApiBaseUrl + 'procurement/common/deliveryschedule/list?MainItemId='+mainItemId));
		if(responseData){
			const dataDto = new MainDataDto<T>(responseData);
			dataDto.Main.forEach(e=>{
				if(e.TimeRequired && this.isUtcDate(e.TimeRequired)){
					const zonedDate = tzUtcToZonedTime(e.TimeRequired, 'UTC');
					e.TimeRequired = new Date(tzFormat(zonedDate, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'UTC' }));
				}
				this.setEntityReadOnlyFields(e, readonlyFields);
			});
			this.setList(dataDto.Main);
			this.SelectQuantity();
		}
	}

	private isUtcDate(compareDate:Date):boolean {
		return compareDate.getTimezoneOffset() === 0;
	}

	public override isParentFn(parentKey: PT, entity: IProcurementCommonDeliveryScheduleEntity): boolean {
		return entity.PrcItemFk === parentKey.Id;
	}
}