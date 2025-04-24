/*
 * $Id: data-service-base.class.ts 49772 2022-08-04 12:49:12Z baf $
 * Copyright(c) RIB Software GmbH
 */

import { IDataServiceOptions } from './interface/options/data-service-options.interface';
import { IDataProvider } from '../data-provider/data-provider.interface';
import { IIdentificationDataConverter } from './interface/identification-data-converter.interface';
import { SimpleIdIdentificationDataConverter } from './integral-part/simple-id-identification-data.converter';
import { EntityMultiProcessor } from './integral-part/entity-multi-processor.class';
import { HttpDataCacheProvider } from '../data-provider/http-data-cache-provider.class';
import { EntityRuntimeDataRegister } from './integral-part/entity-runtime-data-register.class';
import { IIdentificationData, IPinningContext, ISearchPayload, ISearchResult } from '@libs/platform/common';
import { IEntityRuntimeDataRegistry } from './interface/entity-runtime-data-registry.interface';
import { EntityActionState } from './integral-part/entity-action-state.class';
import { IEntityActionState } from './interface/entity-action-state.interface';
import { IFieldValidationResult, IReadOnlyField } from '../runtime-data/entity-runtime-data.class';
import { IEntityProcessor } from '../data-processor/entity-processor.interface';
import { IReadOnlyEntityRuntimeData } from '../runtime-data/read-only-entity-runtime-data.interface';
import { IEntityNavigation } from './interface/entity-navigation.interface';
import { IEntitySelection } from './interface/entity-selection.interface';

/**
 * Base clas of all data service classes. Provides basic functionality of interpretation of the options
 * @typeParam T - entity type handled by the data service
 */
export abstract class DataServiceBase<T extends object> implements IEntityRuntimeDataRegistry<T>, IEntityNavigation<T> {
	/**
	 * The data provider being used by the data service
	 * @protected
	 */
	protected readonly entityRuntimeDataRegister: EntityRuntimeDataRegister<T> = new EntityRuntimeDataRegister<T>();

	/**
	 * The data provider being used by the data service
	 * @protected
	 */
	protected readonly provider: IDataProvider<T>;

	/**
	 * A converter from entity to identification
	 * @protected
	 */
	protected readonly converter: IIdentificationDataConverter<T>;

	/**
	 * Processor for administration of all processor being used by the data service
	 * @protected
	 */
	protected readonly processor: EntityMultiProcessor<T>;

	/**
	 * Overwrite this function for special handling after create call to server succeeded
	 * @param created
	 * @protected
	 */
	protected onCreateSucceeded?(created: object): T;

	/**
	 * Overwrite this function for provision of special create payload
	 * @protected
	 */
	protected provideCreatePayload?(): object;

	/**
	 * Overwrite this function for provision of special create payload for child creation in hierarchical data services
	 * @protected
	 */
	protected provideCreateChildPayload?(): object;

	/**
	 * Overwrite this function special handling after load call to server succeeded
	 * @param loaded
	 * @protected
	 */
	protected onLoadSucceeded?(loaded: object): T[];

	/**
	 * Overwrite this function special handling after call of load filtered from server succeeded.
	 * This function is only to be overwritten in root services. Other services do not use filtering
	 * @param loaded
	 * @protected
	 */
	protected onLoadByFilterSucceeded?(loaded: object): ISearchResult<T>;

	/**
	 * Overwrite this function for provision
	 * @protected
	 */
	protected provideLoadPayload?(): object;

	/**
	 * Overwrite this function for provision of special load filtered payload
	 * This function is only to be overwritten in root services. Other services do not use filtering
	 * @protected
	 */
	protected provideLoadByFilterPayload?(payload: ISearchPayload): object;

	/**
	 * Determines whether the fixed dialog creation is supported by this data service.
	 * By default, this method returns false, it should be overridden this method to provide
	 * a custom implementation that indicates whether a fixed dialog for creation is supported.
	 * @protected
	 */
	protected isCreateByFixDialogSupported(): boolean {
		return false;
	}

	/**
	 * Overwrite this function special handling a custom fixed dialog.
	 * @protected
	 */
	protected createByFixDialog(): Promise<T> {
		if (this.isCreateByFixDialogSupported()) {
			throw new Error('If fixed dialog creation is supported, this method must be overridden.');
		}
		return Promise.reject(new Error('Fixed dialog creation is not supported.'));
	}

	/**
	 * Constructor
	 * @param options
	 * @protected
	 */
	protected constructor(protected readonly options: IDataServiceOptions<T>) {
		this.provider = this.createHttpProvider(options);
		this.converter = options.converter ?? new SimpleIdIdentificationDataConverter<T>();
		this.processor = new EntityMultiProcessor<T>(this.provideAllProcessor(options), this.provideGetChildrenCallback());
	}

	protected createHttpProvider(options: IDataServiceOptions<T>): IDataProvider<T> {
		if (options.provider) {
			return options.provider;
		}
		return new HttpDataCacheProvider(options);
	}

	protected provideAllProcessor(options: IDataServiceOptions<T>): IEntityProcessor<T>[] {
		return options.processors ?? [];
	}

	protected provideGetChildrenCallback(): (parent: T) => T[] {
		return () => [];
	}

	/**
	 * getter for provider
	 */
	public getProvider(): IDataProvider<T> {
		return this.provider;
	}

	/**
	 * Quick check of there are any invalid entities registered on thos data service
	 */
	public hasValidationErrors(): boolean {
		return this.entityRuntimeDataRegister.hasValidationErrors();
	}

	/**
	 * get all entities with validation errors
	 */
	public getInvalidEntities(): T[] {
		return this.entityRuntimeDataRegister.getInvalidEntities();
	}

	/**
	 * get all validation errors for a given entity
	 * @param entity
	 */
	public getValidationErrors(entity: T): IFieldValidationResult<T>[] {
		return this.entityRuntimeDataRegister.getValidationErrors(entity);
	}

	/**
	 * Remove validation error after a correction was done
	 * @param entity Information of invalid entity
	 * @param result Information of invalid property and error description
	 */
	public removeInvalid(entity: T, result: IFieldValidationResult<T>): void {
		this.entityRuntimeDataRegister.removeInvalid(entity, result, this.getServiceName());
	}

	/**
	 * Register validation error on a property of a given entity
	 * @param entity Information of invalid entity
	 * @param result Information of invalid property and error description
	 */
	public addInvalid(entity: T, result: IFieldValidationResult<T>): void {
		this.entityRuntimeDataRegister.addInvalid(entity, result, this.getServiceName());
	}

	/**
	 * Returns name of the data service, evaluated from its constructor.
	 */
	public getServiceName(): string {
		return this.constructor.name;
	}

	protected prepareCreateParameter(parentInfo: IIdentificationData, serviceOptions: IDataServiceOptions<T>): IIdentificationData {
		return parentInfo;
	}

	protected checkCreateIsAllowed(entities: T[] | T | null): boolean {
		return true;
	}

	protected checkDeleteIsAllowed(entities: T[] | T | null): boolean {
		return true;
	}

	protected provideCreateActionState(): IEntityActionState<T> {
		let createSupported = true;
		let dynamicCreateSupported = false;

		if (this.options.entityActions !== undefined) {
			if (this.options.entityActions.createSupported !== undefined) {
				createSupported = this.options.entityActions.createSupported;
			}
			if (this.options.entityActions.createDynamicDialogSupported !== undefined) {
				dynamicCreateSupported = this.options.entityActions.createDynamicDialogSupported;
			}
		}

		return new EntityActionState(createSupported, dynamicCreateSupported, this.options,
			(entities: T[] | T | null) => this.checkCreateIsAllowed(entities),
			(parentInfo: IIdentificationData, serviceOptions: IDataServiceOptions<T>) => this.prepareCreateParameter(parentInfo, serviceOptions));
	}


	protected provideCreateChildActionState(): IEntityActionState<T> {
		let createSupported = true;
		let dynamicCreateSupported = false;
		if (this.options.entityActions !== undefined) {
			if (this.options.entityActions.createSupported !== undefined) {
				createSupported = this.options.entityActions.createSupported;
			}
			if (this.options.entityActions.createDynamicDialogSupported !== undefined) {
				dynamicCreateSupported = this.options.entityActions.createDynamicDialogSupported;
			}
		}

		return new EntityActionState(createSupported, dynamicCreateSupported, this.options,
			(entities: T[] | T | null) => this.checkCreateIsAllowed(entities),
			(parentInfo: IIdentificationData, serviceOptions: IDataServiceOptions<T>) => this.prepareCreateParameter(parentInfo, serviceOptions));
	}

	protected provideDeleteActionState(): IEntityActionState<T> {
		let supported = true;
		if (this.options.entityActions !== undefined && this.options.entityActions.deleteSupported !== undefined) {
			supported = this.options.entityActions.deleteSupported;
		}

		return new EntityActionState(supported, false, this.options, this.checkDeleteIsAllowed);
	}

	public getEntityReadOnlyFields(entity: T): IReadOnlyField<T>[] {
		return this.entityRuntimeDataRegister.getEntityReadOnlyFields(entity);
	}

	public isEntityReadOnly(entity: T): boolean {
		return this.entityRuntimeDataRegister.isEntityReadOnly(entity);
	}

	public getEntityReadonlyRuntimeData(entity: T): IReadOnlyEntityRuntimeData<T> | null {
		return this.entityRuntimeDataRegister.getEntityReadonlyRuntimeData(entity);
	}

	public setEntityReadOnly(entity: T, readonly: boolean): void {
		this.entityRuntimeDataRegister.setEntityReadOnly(entity, readonly);
	}

	public setEntityReadOnlyFields(entity: T, readonlyFields: IReadOnlyField<T>[]): void {
		this.entityRuntimeDataRegister.setEntityReadOnlyFields(entity, readonlyFields);
	}

	public preparePinningContext(dataService: IEntitySelection<T>): IPinningContext[] {
		throw new Error('Method not implemented.');
	}
}
