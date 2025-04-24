/*
 * Copyright(c) RIB Software GmbH
 */
import {IEntityProcessor, IReadOnlyField} from '@libs/platform/data-access';
import { IBasicsClerkDocumentEntity } from '@libs/basics/interfaces';
import { SalesContractDocumentDataService } from './sales-contract-document-data.service';
import { IDocumentEntity } from '@libs/sales/interfaces';
/**
 * Sales contract document data entity readonly processor
 */
export class SalesContractDocumentReadonlyProcessorService<T extends IDocumentEntity> implements IEntityProcessor<T> {

	/**
	 *The constructor
	 */
	public constructor(protected dataService: SalesContractDocumentDataService) {
	}

	/**
	 * Process readonly logic
	 * @param item
	 */
	public process(item: T) {
		this.handlerItemReadOnlyStatus(item);
	}

	private handlerItemReadOnlyStatus(item: T) {
		const readOnlyStatus = false;

		if (!readOnlyStatus) {
			const readonlyFields: IReadOnlyField<IBasicsClerkDocumentEntity>[] = [
				{ field: 'DocumentTypeFk', readOnly: !!item.FileArchiveDocFk }
			];
			this.dataService.setEntityReadOnlyFields(item, readonlyFields);
		}

		return readOnlyStatus;
	}

	/**
	 * Revert process item
	 * @param item
	 */
	public revertProcess(item:  T) {}

}
