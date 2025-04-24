/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * String builder which could be used to simplify building string from different segments
 */
export class BasicsSharedStringBuilder {
	private segments: string[] = [];
	private maxLength?: number;
	private separator?: string;

	public constructor(options?: { separator?: string; maxLength?: number }) {
		this.maxLength = options?.maxLength;
		this.separator = options?.separator;
	}

	public append(segment: string | null | undefined): void {
		if (segment == null) {
			// null or undefined
			return;
		}

		this.segments.push(segment.trim());
	}

	public toString() {
		let str = this.segments.join(this.separator);

		if (this.maxLength && str.length > this.maxLength) {
			str = str.substring(0, this.maxLength - 1);
		}

		return str;
	}
}
