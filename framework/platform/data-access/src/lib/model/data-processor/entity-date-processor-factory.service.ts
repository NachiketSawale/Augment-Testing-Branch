/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { IEntityProcessor } from './entity-processor.interface';
import { DateFieldInfo, EntityDateProcessor } from './entity-date-processor.class';
import { EntitySchemaEvaluator } from '../entity-schema/entity-schema-evaluator.class';
import { IEntitySchema } from '../entity-schema/entity-schema.interface';
import { PlatformDateService } from '@libs/platform/common';
import { inject, Injectable } from '@angular/core';
import { IEntitySchemaId } from '../entity-schema/entity-schema-id.interface';
import { PlatformSchemaService } from '../entity-schema/platform-schema.service';

@Injectable({
	providedIn: 'root'
})
/**
 * Class implementing the interface with two functions doing nothing. Derive from this class, whenever the
 * data processor you are writing only supports one of the two processing methods
 * type param {T} entity type handled by the data service
 */
export class EntityDateProcessorFactory {

	private dateService = inject(PlatformDateService);

	private determineDateFields<T>(entitySchema: IEntitySchema<T>) : DateFieldInfo<T>[]{
		const dateTimeFields = EntitySchemaEvaluator.EvaluateTimeFields(entitySchema);
		const fieldsWithDomain = [] as DateFieldInfo<T>[];
		dateTimeFields.forEach(field => {
			fieldsWithDomain.push(new DateFieldInfo<T>(field.name as keyof T, field.property.domain));
		});

		return fieldsWithDomain;
	}

	public createProcessor <T extends object>(entitySchema: IEntitySchema<T>): IEntityProcessor<T> {
		const dateFields = this.determineDateFields<T>(entitySchema);
		return new EntityDateProcessor<T>(dateFields, this.dateService);
	}

	public createProcessorFromSchemaInfo <T extends object>(entitySchemaId: IEntitySchemaId): IEntityProcessor<T>{
		const schemaService = inject(PlatformSchemaService);
		const schema = schemaService.getCachedSchema(entitySchemaId) as IEntitySchema<T>;
		return this.createProcessor<T>(schema);
	}
}
