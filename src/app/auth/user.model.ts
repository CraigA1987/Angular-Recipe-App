// model is used to store user data and to ensure token is (still) valid - firebase token only valid for an hour

export class User {
  constructor(
    public email: string,
    public id: string,
    private _token: string, // private properties can only be accessed via a getter - should NOT be retrivable
    private _tokenExpirationDate: Date
  ) {}

  get token() {
    // getter is a property where code is run when you try to access the property. Cannot be overwritten as getter not a setter
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      // if not token date, or its less than the current date, we have an expired token
      return null;
    }
    return this._token;
  }
}
