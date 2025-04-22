/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Reduced details of workflow template.
 * To be used for escalation workflow details.
 */
export interface IWorkflowTemplateReduced {

		/**
		 * Workflow template Id.
		 */
		Id: number;

		/**
		 * Workflow template description.
		 */
		Description: string;

		/**
		 * Workflow template comment.
		 */
		CommentText: string;

		/**
		 * Workflow type Id.
		 */
		TypeId: number;
}