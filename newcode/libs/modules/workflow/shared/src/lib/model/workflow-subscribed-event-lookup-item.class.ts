/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * WorkflowSubscribedEventLookupItem class for WorkflowSubscribedEventLookup.
 */
export class WorkflowSubscribedEventLookupItem {
	public description: string = '';
	public uuid: string = '';

	/**
	 * Creates an instance of subscribed event with required properties.
	 */
	public constructor(description: string, uuid: string) {
		this.description = description;
		this.uuid = uuid;
	}
}