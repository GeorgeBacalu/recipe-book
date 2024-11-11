export class User {
  constructor(public id: string, public email: string, private _token: string, private _expiresAt: Date) { }

  get token(): string { return this?._expiresAt > new Date() && this._token; }

  get expiresAt(): Date { return this._expiresAt; }
}
