/*
 * Copyright(c) RIB Software GmbH
 */



import { CompleteIdentification } from '@libs/platform/common';
import { IMaterialScopeDtlBlobEntity } from '../entities/material-scope-dtl-blob-entity.interface';
import { IMaterialScopeDetailPcEntity } from '../entities/material-scope-detail-pc-entity.interface';
import { IMaterialScopeDetailEntity } from '@libs/basics/interfaces';

export class MaterialScopeDetailComplete implements CompleteIdentification<IMaterialScopeDetailEntity> {
	/**
	 * CostGroupToDelete
	 */
	// public CostGroupToDelete?: IMainItem2CostGroupEntity[] | null = [];

	/**
	 * CostGroupToSave
	 */
	// public CostGroupToSave?: IMainItem2CostGroupEntity[] | null = [];

	/**
	 * MainItemId
	 */
	public MainItemId: number = 0;

	/**
	 * MaterialScopeDetail
	 */
	public MaterialScopeDetail?: IMaterialScopeDetailEntity | null;

	/**
	 * MaterialScopeDetailPcToDelete
	 */
	public MaterialScopeDetailPcToDelete?: IMaterialScopeDetailPcEntity[] | null = [];

	/**
	 * MaterialScopeDetailPcToSave
	 */
	public MaterialScopeDetailPcToSave?: IMaterialScopeDetailPcEntity[] | null = [];

	/**
	 * MaterialScopeDtlBlobToDelete
	 */
	public MaterialScopeDtlBlobToDelete?: IMaterialScopeDtlBlobEntity[] | null = [];

	/**
	 * MaterialScopeDtlBlobToSave
	 */
	public MaterialScopeDtlBlobToSave?: IMaterialScopeDtlBlobEntity[] | null = [];

	public constructor(e: IMaterialScopeDetailEntity | null) {
		if (e) {
			this.MainItemId = e.Id;
			this.MaterialScopeDetail = e;
		}
	}
}

