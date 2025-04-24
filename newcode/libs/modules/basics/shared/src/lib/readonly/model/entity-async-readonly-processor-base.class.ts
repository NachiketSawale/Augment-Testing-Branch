/*
 * Copyright(c) RIB Software GmbH
 */

import { get, isFunction } from 'lodash';
import { IEntityList, IEntityRuntimeDataRegistry, IEntitySelection } from '@libs/platform/data-access';
import { AsyncReadonlyFunctions, AsyncSharedReadonlyFunction, AsyncReadonlyFunction, IAsyncReadonlyFunctionsGenerator, AsyncReadonlyStatus } from './readonly-functions.model';
import { Subscription } from 'rxjs';
import { EntityReadonlyProcessorBase } from './entity-readonly-processor-base.class';

/**
 * Async entity readonly processor base class.
 * Async readonly function will be called when entity selection changed.
 */
export abstract class EntityAsyncReadonlyProcessorBase<T extends object> extends EntityReadonlyProcessorBase<T> implements IAsyncReadonlyFunctionsGenerator<T> {
	private entitySelectionSubscription?: Subscription;
	private readonly asyncReadonlyFuncMap = new Map<string, AsyncSharedReadonlyFunction<T>>();
	private asyncReadonlyStatusMap = new WeakMap<T, AsyncReadonlyStatus>();

	protected get entitySelection() {
		return this.runtime as IEntitySelection<T>;
	}

	protected get entityList() {
		return this.runtime as IEntityList<T>;
	}

	/**
	 * The constructor
	 * @param runtime usually it is the entity data service
	 */
	protected constructor(protected override runtime: IEntityRuntimeDataRegistry<T> & IEntitySelection<T> & IEntityList<T>) {
		super(runtime);
		this.initAsyncReadonlyFuncMap();
		this.subscribeEntitySelection();
	}

	public abstract generateAsyncReadonlyFunctions(): AsyncReadonlyFunctions<T>;

	protected initAsyncReadonlyFuncMap() {
		const asyncReadonlyFuncs = this.generateAsyncReadonlyFunctions();

		Object.keys(asyncReadonlyFuncs).forEach((key) => {
			this.asyncReadonlyFuncMap.set(key, this.resolveAsyncReadonlyFunction(asyncReadonlyFuncs, key));
		});
	}

	protected async readonlyEntityAsync(item: T) {
		return false;
	}

	private resolveAsyncReadonlyFunction(readonlyFuncs: AsyncReadonlyFunctions<T>, key: string) {
		const readonlyConfig = get(readonlyFuncs, key);

		if (isFunction(readonlyConfig)) {
			return {
				shared: [],
				readonly: readonlyConfig as AsyncReadonlyFunction<T>,
			};
		}

		return readonlyConfig as AsyncSharedReadonlyFunction<T>;
	}

	public subscribeEntitySelection() {
		if (this.entitySelectionSubscription) {
			return;
		}

		this.entitySelectionSubscription = this.entitySelection.selectionChanged$.subscribe(() => {
			const entity = this.entitySelection.getSelectedEntity();

			if (!entity) {
				return;
			}

			if (this.isAsyncReadonlyProcessed(entity)) {
				return;
			}

			this.asyncReadonlyStatusMap.set(entity, AsyncReadonlyStatus.Working);

			this.processAsyncReadonly(entity).then(
				() => {
					this.asyncReadonlyStatusMap.set(entity, AsyncReadonlyStatus.Success);
				},
				() => {
					this.asyncReadonlyStatusMap.set(entity, AsyncReadonlyStatus.Failed);
				},
			);
		});
	}

	public unsubscribeEntitySelection() {
		if (!this.entitySelectionSubscription) {
			return;
		}

		this.entitySelectionSubscription.unsubscribe();
		this.entitySelectionSubscription = undefined;
	}

	public async processAsyncReadonly(entity: T) {
		if (this.readonlyEntity(entity) || (await this.readonlyEntityAsync(entity))) {
			this.runtime.setEntityReadOnly(entity, true);
			return;
		}

		if (this.asyncReadonlyFuncMap.size === 0) {
			return;
		}

		const state = this.getReadonlyState(entity);
		const promises: Promise<void>[] = [];

		this.asyncReadonlyFuncMap.forEach((readonlyFunc, key) => {
			promises.push(
				readonlyFunc.readonly
					.call(this, {
						item: entity,
						field: key,
						state: state,
					})
					.then((readonly) => {
						this.applyReadonlyResult(readonlyFunc, state, entity, key, readonly);
					}),
			);
		});

		await Promise.all(promises);
	}

	public resetAsyncReadonlyStatus(entity?: T) {
		if (entity) {
			this.asyncReadonlyStatusMap.delete(entity);
		} else {
			this.asyncReadonlyStatusMap = new WeakMap<T, AsyncReadonlyStatus>();
		}
	}

	protected isAsyncReadonlyProcessed(entity: T) {
		const status = this.asyncReadonlyStatusMap.get(entity);
		return status === AsyncReadonlyStatus.Working || status === AsyncReadonlyStatus.Success;
	}

	public async updateEntityReadonly(entity: T) {
		this.process(entity);
		await this.processAsyncReadonly(entity);
	}

	public async updateEntityListReadonly() {
		this.entityList.getList().forEach((e) => this.process(e));

		this.resetAsyncReadonlyStatus();

		const entity = this.entitySelection.getSelectedEntity();

		if (entity) {
			await this.processAsyncReadonly(entity);
		}
	}
}
