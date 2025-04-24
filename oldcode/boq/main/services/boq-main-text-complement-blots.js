/*
 * $Id: boq-main-text-complement-blots.js 2021-03-23 12:52:34Z ong $
 * Copyright (c) RIB Software SE
 */

// utility function used to inherit non prototypical methods/properties
function extend(target, base) {
	/* global Quill */
	'use strict';

	for (var prop in base) {
		target[prop] = base[prop];
	}
}

// definition of a custom Blot.
(function (Embed) {
	'use strict';

	function TextComplement() {
		Object.getPrototypeOf(Embed).apply(this, arguments);
	}

	TextComplement.prototype = Object.create(Embed && Embed.prototype);
	TextComplement.prototype.constructor = TextComplement;
	extend(TextComplement, Embed);

	TextComplement.create = function create(value) {
		return value; // expects a domNode as value
	};

	TextComplement.value = function value(domNode) {
		return domNode;
	};

	TextComplement.blotName = 'textcomplement';
	TextComplement.tagName = 'textcomplement';

	Quill.register(TextComplement, true);

})(Quill.import('blots/embed')); // import the embed blot. This is important as this is being extended
