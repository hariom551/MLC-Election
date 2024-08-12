import { Router } from "express"
import { DayWiseReport, FeedingStaff, QCDayWiseReport, qcstaffcount, ReferenceVoterList, staffname, voterList } from "../controllers/subAdmin.controllers.js";


const subAdminRouter = Router()


subAdminRouter.route("/voterList/:DId").post(voterList)
subAdminRouter.route("/feedingstaffcount").post(FeedingStaff)
subAdminRouter.route("/daywisereport").post(DayWiseReport)
subAdminRouter.route("/staffname").post(staffname)
subAdminRouter.route("/qcstaffcount").post(qcstaffcount)
subAdminRouter.route("/qcdaywiseReport").post(QCDayWiseReport) 
subAdminRouter.route("/referencevoterlist").post(ReferenceVoterList)



export default subAdminRouter;