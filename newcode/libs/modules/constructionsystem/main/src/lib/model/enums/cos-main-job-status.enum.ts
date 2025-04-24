/*
 * Copyright(c) RIB Software GmbH
 */
/**
 * Job State
 */
export enum ConstructionSystemMainJobStatus {
	Waiting = 0,
	Running = 1,
	Finished = 2,
	Canceling = 3,
	Canceled = 4,
	Aborted = 10,
	Failed = 11,
}
