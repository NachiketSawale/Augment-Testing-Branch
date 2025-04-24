import { CompleteIdentification } from '@libs/platform/common';
import { ITimekeepingSettlementEntity, ITimekeepingSettlementItemEntity } from '@libs/timekeeping/interfaces';


export class ITimekeepingSettlementComplete extends CompleteIdentification<ITimekeepingSettlementEntity>{

	/**
	 * MainItemId
	 */
	public MainItemId:  number = 0;

	/**
	 * Settlement
	 */
	public Settlement : ITimekeepingSettlementEntity[] | null = [];

	/**
	 * SettlementId
	 */
	public SettlementId: number = 0;

	/**
	 * SettlementItemsToDelete
	 */
	public SettlementItemsToDelete: ITimekeepingSettlementItemEntity[] | null = [];

	/**
	 * SettlementItemsToSave
	 */
	public SettlementItemsToSave: ITimekeepingSettlementItemEntity[] | null = [];
}

