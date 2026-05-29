import { Router } from 'express'
import { IAuthenticationApplicationService } from "./IAuthenticationApplicationService"

export interface IAuthenticationModule {
  applicationService: IAuthenticationApplicationService
  router: Router
}