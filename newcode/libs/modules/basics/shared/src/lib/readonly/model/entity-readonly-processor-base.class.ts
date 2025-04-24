/*
 * Copyright(c) RIB Software GmbH
 */

import { get, set, isFunction } from 'lodash';
import { IEntityProcessor, IEntityRuntimeDataRegistry } from '@libs/platform/data-access';
import { IReadonlyFunctionsGenerator, ReadonlyFunctions, ReadonlyFunction, ReadonlyState, SharedReadonlyFunction, SharedReadonlyFunctionBase } from './readonly-functions.model';

export abstract class EntityReadonlyProcessorBase<T extends object> implements IEntityProcessor<T>, IReadonlyFunctionsGenerator<T> {
	private readonly readonlyFuncMap = new Map<string, SharedReadonlyFunction<T>>();
	protected readonly readonlyStateMap = new WeakMap<T, ReadonlyState<T>>();

	/**
	 * The constructor
	 * @param runtime usually it is the entity data service
	 */
	protected constructor(protected runtime: IEntityRuntimeDataRegistry<T>) {
		this.initReadonlyFuncMap();
	}

	protected initReadonlyFuncMap() {
		const readonlyFuncs = this.generateReadonlyFunctions();

		Object.keys(readonlyFuncs).forEach((key) => {
			this.readonlyFuncMap.set(key, this.resolveReadonlyFunction(readonlyFuncs, key));
		});
	}

	/**
	 * Is whole entity readonly?
	 * @param item
	 * @protected
	 */
	protected readonlyEntity(item: T) {
		return false;
	}

	private resolveReadonlyFunction(readonlyFuncs: ReadonlyFunctions<T>, key: string) {
		const readonlyConfig = get(readonlyFuncs, key);

		if (isFunction(readonlyConfig)) {
			return {
				shared: [],
				readonly: readonlyConfig as ReadonlyFunction<T>,
			};
		}

		return readonlyConfig as SharedReadonlyFunction<T>;
	}

	protected applyReadonlyResult(readonlyFunc: SharedReadonlyFunctionBase<T>, state: ReadonlyState<T>, entity: T, key: string, readonly?: boolean) {
		// Undefined means that it will not affect previous readonly state
		if (readonly === undefined) {
			return;
		}

		const group = [key].concat(<string[]>readonlyFunc.shared);

		group.forEach((e) => {
			set(state, e, readonly);
		});

		this.runtime.setEntityReadOnlyFields(
			entity,
			group.map((e) => {
				return {
					field: e,
					readOnly: readonly,
				};
			}),
		);

		// Set remaining fields to opposite readonly state
		if (readonlyFunc.makeOthersOpposite) {
			Object.keys(entity).forEach((e) => {
				if (!group.includes(e)) {
					set(state, e, !readonly);

					this.runtime.setEntityReadOnlyFields(entity, [
						{
							field: e,
							readOnly: !readonly,
						},
					]);
				}
			});
		}
	}

	public getReadonlyState(entity: T) {
		let state = this.readonlyStateMap.get(entity);

		if (!state) {
			state = {};
			this.readonlyStateMap.set(entity, state);
		}

		return state;
	}

	public process(toProcess: T) {
		if (this.readonlyEntity(toProcess)) {
			this.runtime.setEntityReadOnly(toProcess, true);
			return;
		}

		const state = this.getReadonlyState(toProcess);

		this.readonlyFuncMap.forEach((readonlyFunc, key) => {
			const readonly = readonlyFunc.readonly.call(this, {
				item: toProcess,
				field: key,
				state: state,
			});

			this.applyReadonlyResult(readonlyFunc, state, toProcess, key, readonly);
		});
	}

	public revertProcess(toProcess: T): void {}

	public abstract generateReadonlyFunctions(): ReadonlyFunctions<T>;
}
