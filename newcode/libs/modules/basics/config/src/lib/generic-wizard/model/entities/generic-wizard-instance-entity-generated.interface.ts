/*
 * Copyright(c) RIB Software GmbH
 */

// import { IGenericWizardInstanceParameterEntity } from './generic-wizard-instance-parameter-entity.interface';
// import { IGenericWizardStepScriptEntity } from './generic-wizard-step-script-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IGenericWizardInstanceEntityGenerated extends IEntityBase {
	/*
	 * CommentInfo
	 */
	CommentInfo?: IDescriptionInfo | null;

	/*
	 * GenwizardInstparamEntities
	 */
	// GenwizardInstparamEntities?: IGenericWizardInstanceParameterEntity[] | null;

	/*
	 * GenwizardStepscriptEntities
	 */
	//GenwizardStepscriptEntities?: IGenericWizardStepScriptEntity[] | null;

	/*
	 * Id
	 */
	Id?: number | null;

	/*
	 * ModuleFk
	 */
	ModuleFk?: number | null;

	/*
	 * Remark
	 */
	Remark?: string | null;

	/*
	 * Wizard2GroupFk
	 */
	Wizard2GroupFk?: number | null;

	/*
	 * WizardConfiGuuid
	 */
	WizardConfiGuuid?: string | null;

	/**
	 * Title of the generic wizard instance
	 */
	TitleInfo: IDescriptionInfo;
}
