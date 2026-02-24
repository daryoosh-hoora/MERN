import { Router } from 'express'
import { ITaskApplicationService } from "./ITaskApplicationService"

export interface ITaskModule {
  applicationService: ITaskApplicationService
  router: Router
}