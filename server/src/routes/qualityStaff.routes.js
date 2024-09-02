import { Router } from "express"
import { addtelecallerdata, DeleteVoter, DisplayTelecallerData, prevletter, sendSMS,upload, updateletter, voterDetailById, 
    wardwiseVoterContact, 
    whatsapp} from "../controllers/qualityStaff.controller.js";
import { UpdateVoter } from "../controllers/feedingStaff.controllers.js";
import uploadFiles from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js"

const QualityStaffRouter = Router()

QualityStaffRouter.route("/wardwiseVoterContact").post(wardwiseVoterContact)
QualityStaffRouter.route("/sendSMS").post(sendSMS);
QualityStaffRouter.route("/whatsapp").post(whatsapp);
QualityStaffRouter.route("/DeleteVoter").post(verifyJWT, DeleteVoter)
QualityStaffRouter.route("/voterDetailById").post(voterDetailById)
QualityStaffRouter.put('/UpdateVoter/:idNo',verifyJWT, UpdateVoter);
QualityStaffRouter.get('/prevletter', prevletter);
QualityStaffRouter.post('/updateletter', updateletter );
QualityStaffRouter.get('/employeeDetails', DisplayTelecallerData );
QualityStaffRouter.post('/addtelecallerdata',upload.single("file"),addtelecallerdata );

export default QualityStaffRouter;