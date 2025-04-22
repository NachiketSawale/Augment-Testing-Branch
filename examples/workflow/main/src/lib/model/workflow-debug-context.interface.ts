
/*
 * Copyright(c) RIB Software GmbH
 */
import { IIdentificationData } from '@libs/platform/common';
/**
 *IDebugContext stores the input data to get base context of debug actions.
 */
export interface IDebugContext {
	TemplateId: number,
	VersionId: number,
	Identification: IIdentificationData | null,
	JsonContext: string | ' '
}