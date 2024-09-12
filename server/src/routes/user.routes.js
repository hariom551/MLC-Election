import { Router } from "express"
import { loginUser, logoutuser, hariom, submitDetails, changePassword, checkRole,
     AddDistrict, GetDistrictDetails, UpdateDistrictDetail, DeleteDistrictDetail, 
     DistrictDetails, Publish} from "../controllers/user.controlers.js"

import { verifyJWT } from "../middleware/auth.middleware.js"
const router = Router()



router.route("/login").post(loginUser)
router.route("/DistrictDetails").get(DistrictDetails)
router.route("/submitdetails").post( submitDetails)
router.route("/hariom").post(verifyJWT,  hariom)
router.route("/changePassword").post(verifyJWT,changePassword)
router.route("/addDistrict").post(AddDistrict)
router.route("/getDistrictDetails").get(GetDistrictDetails)
router.route("/updateDistrictDetail").post(UpdateDistrictDetail)
router.route("/deleteDistrictDetail").post(DeleteDistrictDetail)
// router.route("/deleteDistrictDetail").post(DeleteDistrictDetail)
router.route("/logoutuser").delete(logoutuser)
router.route("/publish").post(verifyJWT, Publish)


// router.route("/verifyUser").get( verifyJWT)

export default router