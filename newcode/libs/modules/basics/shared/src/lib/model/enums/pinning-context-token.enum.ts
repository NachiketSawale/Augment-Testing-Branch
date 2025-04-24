/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Enum for pinning context tokens
 */
export enum PinningContextToken {
	/**
	 * Stores project id
	 */
	Project = 'project.main',
	/**
	 * Stores estimate header id
	 */
	Estimate = 'estimate.main',
	/**
	 * Stores model id
	 */
	Model = 'model.main',
	/**
	 * Stores boq header id
	 */
	Boq = 'boq.main',
	/**
	 * Stores construction instance header id
	 */
	Cos = 'constructionsystem.main',
}