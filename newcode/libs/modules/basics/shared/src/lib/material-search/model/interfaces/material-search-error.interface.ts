/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Error info interface for material search
 */
export interface IMaterialSearchError {
    /**
     * Which material catalog
     */
    Catalog: string;
    /**
     * Exception detail
     */
    Exception: unknown;
}