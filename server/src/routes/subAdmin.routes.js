import { Router } from "express"
import { DayWiseReport, FeedingStaff, QCDayWiseReport, qcstaffcount, ReferenceVoterList, staffname, voterList } from "../controllers/subAdmin.controllers.js";

import { verifyJWT } from "../middleware/auth.middleware.js"

const subAdminRouter = Router()


subAdminRouter.route("/voterList").post(voterList)
subAdminRouter.route("/feedingstaffcount").post(verifyJWT, FeedingStaff)
subAdminRouter.route("/daywisereport").post(DayWiseReport)
subAdminRouter.route("/staffname").post(staffname)
subAdminRouter.route("/qcstaffcount").post(verifyJWT, qcstaffcount)
subAdminRouter.route("/qcdaywiseReport").post(QCDayWiseReport) 
subAdminRouter.route("/referencevoterlist").post(ReferenceVoterList)



export default subAdminRouter;