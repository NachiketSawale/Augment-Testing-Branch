/*
 * Copyright(c) RIB Software GmbH
 */

import { TValue, DebugContext } from '@libs/workflow/interfaces';
import { ServiceFnArr } from './types/extended-user-action/legacy-service-method-map.type';

/**
 * Content passed from IframeComponent to Iframe
 */
export interface IFrameMessageOptions {
	/**
	 * Workflow Context object
	 */
	Context?: DebugContext;

	/**
	 *	Identifier for iframe post messages.
	 */
	IframePayloadId?: string;

	/**
	 * Result of the asynchronous call from the iframe.
	 */
	ParentFnResult?: TValue | undefined;

	/**
	 * Checks if workflow context object should be set in iframe.
	 */
	ShouldSetContextInIFrame?: boolean,

	/**
	 * Checks if workflow context object should be retrieved from iframe.
	 */
	ShouldGetContextFromIFrame?: boolean,

	/**
	 * Checks if extended user action has been submitted.
	 */
	IsSubmit?: boolean

	/**
	 * Sets required pre-requisites for iframe.
	 */
	ShouldSetPrerequisites?: boolean;

	/**
	 * Services that have to be injected into the angularjs application.
	 *
	 */
	ServiceFnArr?: ServiceFnArr;
}