/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Indicates the type of the pin board container.
 */
export enum CommentType {
	/**
	 * Indicates the pin board container is of the standard type.
	 *
	 * The editor of the standard pin board container only has three buttons: Insert Link, Insert Image, and Insert Emoji.
	 */
	Standard,

	/**
	 * Indicates the pin board container is of the customized type.
	 *
	 * The comment items of the customized pin board container are accompanied by status icons.
	 * These status icons indicate the type of the comment item, such as a question type, an answer type, and so on.
	 *
	 * The editor of the customized pin board container features some status icon radio buttons,
	 * allowing the user to specify the type of comment when adding a new one.
	 */
	Customized,
}
