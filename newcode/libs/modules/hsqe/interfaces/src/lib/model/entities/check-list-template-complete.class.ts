/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification } from '@libs/platform/common';
import { IHsqChkListTemplateEntity } from './hsq-chk-list-template-entity.interface';
import { IHsqChkListTemplate2FormEntity } from './hsq-chk-list-template-2form-entity.interface';

export class CheckListTemplateComplete implements CompleteIdentification<IHsqChkListTemplateEntity> {
	public MainItemId: number = 0;

	/**
	 * Checklist Template
	 */
	public CheckListTemplate?: IHsqChkListTemplateEntity | null;

	/**
	 * Checklist Templates
	 */
	public CheckListTemplates?: IHsqChkListTemplateEntity[] | null = [];

	public HsqChkListTemplate2FormToSave?: IHsqChkListTemplate2FormEntity[] | null = [];

	public HsqChkListTemplate2FormToDelete?: IHsqChkListTemplate2FormEntity[] | null = [];

	public constructor(e: IHsqChkListTemplateEntity | null) {
		if (e != null) {
			this.MainItemId = e.Id;
			this.CheckListTemplate = e;
		}
	}
}
