import { CustomContext } from '../model/custom-canvas-context.interface';

/**
 *Factory function to create a Step instance with a specified context
 * @param context containing parameters that can modify the path() values.
 * @returns an instance of step with parameter t=0.01
 *
 * Reference - https://github.com/swimlane/ngx-graph/blob/master/src/docs/demos/components/ngx-graph-custom-curve/customStepCurved.ts
 */
export const stepRound = function (context: CustomContext): Step {
	return new Step(context, 0.01);
};

/**
 * This class is used to manage the construction of a path by adding points and defining curves or line segments.
 */
export class Step {
	private _context: CustomContext;
	private _t: number;
	private _x: number;
	private _y: number;
	private _point: number;
	private _line: number;
	/**
	 *
	 * @param {CustomContext} context - The custom rendering context to which points are added.
	 * @param {number} t - A parameter controlling the curvature of the curve.Values between 0 and 1 determine the curve shape.
	 */
	public constructor(context: CustomContext, t: number) {
		this._context = context;
		this._t = t;
		this._x = NaN;
		this._y = NaN;
		this._point = 0;
		this._line = 0;
	}
	/**
	 * Start of an area in the curve
	 */
	public areaStart() {
		this._line = 0;
	}
	/**
	 * End of an area in the curve
	 */
	public areaEnd() {
		this._line = NaN;
	}
	/**
	 * Start of a line segment
	 */
	public lineStart() {
		this._x = this._y = NaN;
		this._point = 0;
	}
	/**
	 * End of a line segment
	 */
	public lineEnd() {
		if (0 < this._t && this._t < 1 && this._point === 2) {
			this._context.lineTo(this._x, this._y);
		}
		if (this._line || (this._line !== 0 && this._point === 1)) {
			this._context.closePath();
		}
		// tslint:disable-next-line: ban-comma-operator
		if (this._line >= 0) {
			(this._t = 1 - this._t), (this._line = 1 - this._line);
		}
	}
	/**
	 * responsible for constructing the curves and adding line segments to a curve that will be applied to the edges.
	 * @param x-  represents the horizontal position of the point.
	 * @param y - represents the vertical position of the point.
	 */
	public point(x: number, y: number) {
		x = +x;
		y = +y;
		switch (this._point) {
			case 0:
				{
					this._point = 1;
					this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
					break;
				}
			case 1:
				{
					this._point = 2;
					let xN;
					let yN;
					let mYb;
					let mYa;
					if (this._t <= 0) {
						xN = Math.abs(x - this._x);
						yN = Math.abs(y - this._y);
						mYb = this._y < y ? this._y + yN : this._y - yN;
						mYa = this._y > y ? y + yN : y - yN;

						this._context.quadraticCurveTo(this._x, this._y, this._x, mYb);
						this._context.lineTo(this._x, mYa);
						this._context.quadraticCurveTo(this._x, y, this._x + xN, y);
						this._context.lineTo(x - xN, y);
					} else {
						const x1 = this._x * (1 - this._t) + x * this._t;

						xN = Math.abs(x - x1) * 0.25;
						yN = Math.abs(y - this._y) * 0.25;
						mYb = this._y < y ? this._y + yN : this._y - yN;
						mYa = this._y > y ? y + yN : y - yN;

						this._context.quadraticCurveTo(x1, this._y, x1, mYb);
						this._context.lineTo(x1, mYa);
						this._context.quadraticCurveTo(x1, y, x1 + xN, y);
						this._context.lineTo(x - xN, y);
					}
					break;

				}
		}
		(this._x = x), (this._y = y);
	}
}