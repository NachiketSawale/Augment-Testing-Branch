/*
 * Copyright(c) RIB Software GmbH
 */

import { Type } from '@angular/core';

/**
 * Represents a type that accepts either concrete values or a type.
 *
 * @typeParam T The base type to assume.
 */
export type ValueOrType<T> = T | Type<T>;
