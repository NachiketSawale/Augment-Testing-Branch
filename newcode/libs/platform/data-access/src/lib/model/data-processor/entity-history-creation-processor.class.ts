/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityBaseProcessor } from './entity-base-processor.class';
import { PlatformDateService, IEntityBase } from '@libs/platform/common';
import { EntityDateProcessor } from './entity-date-processor.class';


/**
 * Class for processing entities and adding arrays
 * type param {T} entity type handled by the data service
 */

export class EntityHistoryCreationProcessor<T extends IEntityBase > extends EntityBaseProcessor<T>  {
	public constructor(private dateService: PlatformDateService) {
		super();
	}

	public override process(toProcess:  T): void {
		this.processUser(toProcess);
		this.processDates(toProcess);
	}

	private processUser(item :T){
		item.inserted = this.getUserInfo(item.InsertedBy);
		item.updated = this.getUserInfo(item.UpdatedBy);
	}

	private getUserInfo(id:number | undefined){
		if(!id){
			return '';
		}

		//Todo - exchange following line with final implementation when PlatformUserInfoService is available
		return 'User ' + id.toString();
	}

	private processDates(item: T){
		const processor = new EntityDateProcessor<T>([], this.dateService);
		processor.process(item);
		// ToDo - Write information about dates to insertedAt and updatedAt
		if(item.InsertedAt !== undefined) {
			item.inserted =  item.inserted + this.dateService.formatLocal(item.InsertedAt, 'yyyy-MM-dd HH:mm:ss');
		}
		if(item.UpdatedAt!== undefined){
			item.updated = item.updated + this.dateService.formatLocal(item.UpdatedAt, 'yyyy-MM-dd HH:mm:ss');
		}
	}
}
