/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { IEntityProcessor } from './entity-processor.interface';
import { PlatformDateService } from '@libs/platform/common';
import { EntityDomainType } from '../entity-schema/entity-domain-type.enum';


export class DateFieldInfo<T> {
	public constructor(public field: keyof T, public domain: EntityDomainType) { }
}
/**
 * Class for processing entities and adding arrays
 * type param {T} entity type handled by the data service
 */
export class EntityDateProcessor<T extends object> implements IEntityProcessor<T> {

	public constructor(private fields: DateFieldInfo<T>[], private dateService:PlatformDateService) {
	}

	public process(toProcess: T): void {
		this.fields.forEach((field) => {
			this.parseString(toProcess, field.field, field.domain);
		});
	}

	//parseString
	protected parseString<T>(item: T, field: keyof T, domain: EntityDomainType): void {
		switch (domain) {
			case EntityDomainType.Date:
			case EntityDomainType.DateTime:
				// Assuming item[field] is a string representing a date
				item[field] = this.dateService.formatLocal((item[field] as string), 'yyyy-MM-dd HH:mm:ss') as T[keyof T];
				break;
			case EntityDomainType.DateUtc:
			case EntityDomainType.DateTimeUtc:
				// Assuming item[field] is a string representing a date
				item[field] = this.dateService.formatUTC((item[field] as string), 'yyyy-MM-dd HH:mm:ss') as T[keyof T];
				break;
         case EntityDomainType.Time:
			case EntityDomainType.TimeUtc: {
				// Assuming item[field] is a string representing a time
				const timeDate = (`1970-01-01 ${item[field]}` as string);
				item[field] = this.dateService.formatLocal(timeDate, 'yyyy-MM-dd HH:mm:ss') as T[keyof T];
			}
				break;
			default:
				break;
		}
	}

	//revertProcessItem
	public revertProcess(item: T): void {
		this.fields.forEach((entry) => {
			const field = entry.field;
			if (item[field] && typeof item[field] !== 'string') {
				this.dateService.formatLocal((item[field]) as Date, 'yyyy-MM-dd HH:mm:ss') as T[keyof T];
			}
		});
	}
}