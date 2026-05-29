import { Router } from 'express'
import { IUserApplicationService } from "./IUserApplicationService"

export interface IUserModule {
  applicationService: IUserApplicationService
  router: Router
}