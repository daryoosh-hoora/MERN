import { IApplicationError } from '../application/IApplicationError'

export class Result<T> {
  public readonly isSuccess: boolean
  public readonly isFailure: boolean
  public readonly error?: IApplicationError
  private readonly _value?: T

  private constructor(
    isSuccess: boolean,
    error?: IApplicationError,
    value?: T
  ) {
    this.isSuccess = isSuccess
    this.isFailure = !isSuccess
    this.error = error
    this._value = value

    Object.freeze(this)
  }

  public static ok<T>(value?: T): Result<T> {
    return new Result<T>(true, undefined, value)
  }

  public static fail<T>(error: IApplicationError): Result<T> {
    return new Result<T>(false, error)
  }

  public get value(): T {
    if (!this.isSuccess) {
      throw new Error('Cannot get value of failed result')
    }
    return this._value as T
  }
}
