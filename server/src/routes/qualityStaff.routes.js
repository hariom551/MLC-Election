import { Router } from "express"
import { DeleteVoter, prevletter, sendSMS, updateletter, voterDetailById, wardwiseVoterContact } from "../controllers/qualityStaff.controller.js";
import { UpdateVoter } from "../controllers/feedingStaff.controllers.js";


const QualityStaffRouter = Router()

QualityStaffRouter.route("/wardwiseVoterContact").post(wardwiseVoterContact)
QualityStaffRouter.route("/sendSMS").post(sendSMS)
QualityStaffRouter.route("/DeleteVoter").post(DeleteVoter)
QualityStaffRouter.route("/voterDetailById").post(voterDetailById)
QualityStaffRouter.put('/UpdateVoter/:idNo', UpdateVoter);
QualityStaffRouter.get('/prevletter', prevletter);
QualityStaffRouter.post('/updateletter', updateletter );

export default QualityStaffRouter;