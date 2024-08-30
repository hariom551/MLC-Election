import { Router } from "express"
import { AddOutForm,
     AddIncomForm, incomFormDetails, SearchVMobNo, 
     OutFormDetails,
     FormsAdminInfo,
     UpdateIncomForm,
     updateOutForm} from "../controllers/formsAdmin.controllers.js"
import { verifyJWT } from "../middleware/auth.middleware.js"



const formsAdminRouter = Router()


formsAdminRouter.route("/addOutForm").post(AddOutForm)
formsAdminRouter.route("/outFormDetails").get(verifyJWT, OutFormDetails)
formsAdminRouter.route("/updateOutForm").post(updateOutForm)
formsAdminRouter.route("/addIncomForm").post(AddIncomForm)
formsAdminRouter.route("/UpdateIncomForm").post(UpdateIncomForm)
formsAdminRouter.route("/incomFormDetails").get(verifyJWT,incomFormDetails)
formsAdminRouter.route("/searchVMobNo").post(SearchVMobNo)
formsAdminRouter.route("/formsAdminInfo").get(verifyJWT, FormsAdminInfo)



export default formsAdminRouter;