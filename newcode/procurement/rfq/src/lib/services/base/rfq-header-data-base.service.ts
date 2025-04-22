/*
 * Copyright(c) RIB Software GmbH
 */
import { get, set, isString } from 'lodash';
import { ISearchResult } from '@libs/platform/common';
import { DataServiceFlatRoot, ServiceRole } from '@libs/platform/data-access';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { RfqHeaderEntityComplete } from '../../model/entities/rfq-header-entity-complete.class';

export abstract class ProcurementRfqHeaderDataBaseService extends DataServiceFlatRoot<IRfqHeaderEntity, RfqHeaderEntityComplete> {
	private readonly timeFields = [
		'TimeQuoteDeadline',
	];

	protected constructor() {
		super({
			apiUrl: 'procurement/rfq/header',
			readInfo: {
				endPoint: 'listrfq',
				usePost: true
			},
			deleteInfo: {
				endPoint: 'deleterfq'
			},
			updateInfo: {
				endPoint: 'updaterfq',
				/*preparePopupDialogData:() => {
					return this.createDialogService.openCreateDialogForm();
				}*/
			},
			createInfo: {
				endPoint: 'createrfq'
			},
			roleInfo: {
				role: ServiceRole.Root,
				itemName: 'RfqHeaders'
			}
		});

		this.processor.addProcessor({
			// TODO-DRIZZLE: Using the common/global time processor.
			process: (toProcess: IRfqHeaderEntity) => {
				this.timeFields.forEach(v => {
					const value = get(toProcess, v);
					if (value && isString(value)) {
						set(toProcess, v, new Date(`1970-01-01 ${value}`));
					}
				});
			},
			revertProcess: (toProcess: IRfqHeaderEntity) => {
				this.timeFields.forEach(v => {
					const value = get(toProcess, v) as string | Date;
					if (!isString(value)) {
						set(toProcess, v, `${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}:${value.getSeconds().toString().padStart(2, '0')})`);
					}
				});
			}
		});
	}

	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IRfqHeaderEntity> {
		// todo - use the general FilterResult interface?
		const fr = get(loaded, 'FilterResult')! as {
			ExecutionInfo: string;
			RecordsFound: number;
			RecordsRetrieved: number;
			ResultIds: number[];
		};

		return {
			FilterResult: {
				ExecutionInfo: fr.ExecutionInfo,
				RecordsFound: fr.RecordsFound,
				RecordsRetrieved: fr.RecordsRetrieved,
				ResultIds: fr.ResultIds
			},
			dtos: get(loaded, 'Main')! as IRfqHeaderEntity[]
		};
	}

	public override createUpdateEntity(modified: IRfqHeaderEntity | null): RfqHeaderEntityComplete {
		const complete = new RfqHeaderEntityComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.RfqHeaders = [modified];
		}
		return complete;
	}

	public override getModificationsFromUpdate(complete: RfqHeaderEntityComplete): IRfqHeaderEntity[] {
		if (complete.RfqHeaders === null) {
			complete.RfqHeaders = [];
		}

		return complete.RfqHeaders;
	}
}
