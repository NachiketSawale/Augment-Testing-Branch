/*
 * Copyright(c) RIB Software GmbH
 */
import { cloneDeep } from 'lodash';
import { ColumnDef, IGridApi } from '@libs/ui/common';
import { IEntityContainerGridColumnConfigData } from './entity-container-grid-column-config-data.interface';

/**
 * Config dialog state api.
 */
export interface IEntityContainerGridDialogStateData<T extends object> {
	/**
	 * Config dialog data.
	 */
	propertyConfig: IEntityContainerGridColumnConfigData[];

	/**
	 * Container columns.
	 */
	columns: ColumnDef<T>[];

	/**
	 * Module config info.
	 */
	enableModuleConfig: boolean;
}

/**
 * Grid dialog state for respective container.
 */
export class EntityContainerGridConfigDialogState<T extends object> implements IEntityContainerGridDialogStateData<T> {
	/**
	 * Config dialog data.
	 */
	private _propertyConfig: IEntityContainerGridColumnConfigData[] = [];

	/**
	 * Container columns.
	 */
	private _columns: ColumnDef<T>[];

	public constructor(private containerData: IGridApi<T>) {
		this._columns = cloneDeep(this.containerData.columns);
	}

	/**
	 * Set dialog data.
	 */
	public set propertyConfig(config: IEntityContainerGridColumnConfigData[]) {
		this._propertyConfig = config;
	}

	/**
	 * Get dialog data.
	 */
	public get propertyConfig(): IEntityContainerGridColumnConfigData[] {
		return this._propertyConfig;
	}

	/**
	 * Set container columns.
	 */
	public set columns(columns: ColumnDef<T>[]) {
		this._columns = [...columns];
		this.containerData.columns= this._columns;
	}

	/**
	 * Get container columns.
	 */
	public get columns(): ColumnDef<T>[] {
		return this._columns;
	}

	/**
	 * Module config info.
	 */
	public get enableModuleConfig(): boolean {
		return !!this.containerData.configuration.enableModuleConfig;
	}
}
