import { Router } from "express"
import { DeleteVoter, sendSMS, voterDetailById, wardwiseVoterContact } from "../controllers/qualityStaff.controller.js";


const QualityStaffRouter = Router()

QualityStaffRouter.route("/wardwiseVoterContact").post(wardwiseVoterContact)
QualityStaffRouter.route("/sendSMS").post(sendSMS)
QualityStaffRouter.route("/DeleteVoter").post(DeleteVoter)
QualityStaffRouter.route("/voterDetailById").post(voterDetailById)

export default QualityStaffRouter;