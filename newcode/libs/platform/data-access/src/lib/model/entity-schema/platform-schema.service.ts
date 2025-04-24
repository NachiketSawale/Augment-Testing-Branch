/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntitySchema } from './entity-schema.interface';
import { IEntitySchemaId } from './entity-schema-id.interface';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { PlatformConfigurationService, ServiceLocator } from '@libs/platform/common';

/**
 * This service is used to register dto schemas.
 */
@Injectable({
	providedIn: 'root'
})
export class PlatformSchemaService<T extends object> {


	/**
	 * Maps of entity schemas with it's respective dto id.
	 * @key RIB.Visual.{module.submodule}.ServiceFacade.WebApi.{typeName}
	 * @value The entity schema
	 */
	private schemaMap: Map<string, IEntitySchema<T>> = new Map();

	private readonly ConfigurationService = inject(PlatformConfigurationService);

	/**
	 * locale function returning the full qualified token for cache
	 * @param schemaOption
	 * @returns void
	 */
	private getToken(schemaOption: IEntitySchemaId) {
		let token;
		if (!schemaOption.assemblyName) {
			token = 'RIB.Visual.' + schemaOption.moduleSubModule + '.ServiceFacade.WebApi.' + schemaOption.typeName;
		} else {
			token = schemaOption.typeName;
		}
		return token;
	}

	/**
	 * Register dto entity schema with it's respective dto schema id.
	 */
	private registerSchema(entitySchemaId: IEntitySchemaId | string, schema: IEntitySchema<T>): void {
		const schemaPath: string = typeof entitySchemaId === 'string' ? entitySchemaId : this.getToken(entitySchemaId);
		this.schemaMap.set(schemaPath, schema);
	}

	/**
	 * Get Schema if already available or load and register it
	 * @param entitySchemaId entitySchemaOption used for loading entity schemas.
	 * @returns Promise<IEntitySchema<T>>
	 */
	public async getSchema(entitySchemaId: IEntitySchemaId): Promise<IEntitySchema<T>> {
		const entitySchema: IEntitySchema<T> | undefined = this.schemaMap.get(this.getToken(entitySchemaId));

		if (entitySchema) {
			return entitySchema;
		}

		return this.loadSchemaAsync(entitySchemaId);
	}

	/**
	 * Get cached Schema if already loaded. In case not loaded an exception is thrown
	 * @param entitySchemaId entitySchemaOption used for loading entity schemas.
	 * @returns Promise<IEntitySchema<T>>
	 */
	public getCachedSchema(entitySchemaId: IEntitySchemaId): IEntitySchema<T> {
		const entitySchema: IEntitySchema<T> | undefined = this.schemaMap.get(this.getToken(entitySchemaId));

		if (entitySchema) {
			return entitySchema;
		}

		throw new Error('Please make sure the needed schema is loaded');
	}


	/**
	 * Load entity schemas from the server
	 * @param entitySchemaId
	 * @returns Promise<IEntitySchema<T>>
	 */
	private loadSchemaAsync(entitySchemaId: IEntitySchemaId): Promise<IEntitySchema<T>> {
		const http = ServiceLocator.injector.get(HttpClient);
		const param = {
			TypeName: entitySchemaId.typeName,
			ModuleSubModule: entitySchemaId.moduleSubModule!,
			AssemblyName: entitySchemaId.assemblyName!
		};

		return new Promise<IEntitySchema<T>>(
			(resolve: (entitySchema: IEntitySchema<T>) => void) => {
				lastValueFrom(http.get<IEntitySchema<T>>(this.ConfigurationService.webApiBaseUrl + 'platform/getschema', { params: param })).then((response: IEntitySchema<T>) => {
					response.mainModule = entitySchemaId.moduleSubModule;
					this.registerSchema(response.schema, response);
					resolve(response);
				});
			});
	}
}
