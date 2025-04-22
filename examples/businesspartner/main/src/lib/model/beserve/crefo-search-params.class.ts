export class CrefoSearchParams {
	public name: string = '';
	public location: string = '';
	public street: string = '';
	public zipcode: string = '';
	public areacode: string = '';
	public phoneno: string = '';
	public query: string = '';

	public clear() {
		this.name = '';
		this.location = '';
		this.street = '';
		this.zipcode = '';
		this.areacode = '';
		this.phoneno = '';
		this.query = '';
	}
}