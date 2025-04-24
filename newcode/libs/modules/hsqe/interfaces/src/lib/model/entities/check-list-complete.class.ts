/*
 * Copyright(c) RIB Software GmbH
 */

import { IHsqCheckListEntity } from './hsq-check-list-entity.interface';
import { CompleteIdentification } from '@libs/platform/common';
import { IHsqCheckList2ActivityEntity } from './hsq-check-list-2-activity-entity.interface';
import { IHsqCheckListDocumentEntity } from './hsq-check-list-document-entity.interface';
import { IHsqCheckList2FormEntity } from './hsq-check-list-2-form-entity.interface';
import { IHsqCheckList2LocationEntity } from './hsq-check-list-2-location-entity.interface';

export class CheckListComplete implements CompleteIdentification<IHsqCheckListEntity> {
	/**
	 * CheckListHeaders
	 */
	public CheckListHeader?: IHsqCheckListEntity | null = null;
	/**
	 * CheckListHeaders
	 */
	public CheckListHeaders?: IHsqCheckListEntity[] | null = [];
	/**
	 * ActivityToDelete
	 */
	public ActivityToDelete?: IHsqCheckList2ActivityEntity[] | null = [];

	/**
	 * ActivityToSave
	 */
	public ActivityToSave?: IHsqCheckList2ActivityEntity[] | null = [];

	/**
	 * MainItemId
	 */
	public MainItemId: number = 0;

	public DocumentToSave: IHsqCheckListDocumentEntity[] | null = [];
	public DocumentToDelete: IHsqCheckListDocumentEntity[] | null = [];

	public LocationToSave: IHsqCheckList2LocationEntity[] | null = [];
	public LocationToDelete: IHsqCheckList2LocationEntity[] | null = [];

	/**
	 * FormDataToSave
	 */
	public FormDataToSave?: IHsqCheckList2FormEntity[] | null = [];

	/**
	 * FormDataToDelete
	 */
	public FormDataToDelete?: IHsqCheckList2FormEntity[] | null = [];
}
