/*
 * Copyright(c) RIB Software GmbH
 */

/*
PhoneCreationDto
 */
export interface IPhoneCreateRequest {
	CountryId?: number|null;

	Pattern?: string|null;

	PlainPhone?: string|null;

	CommentText?: string|null;
}
