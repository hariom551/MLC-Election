import { Router } from "express"
import { AddVoter, allAreaDetails, searchAreaVill, searchCaste, searchSurname, getPerseemanDetails, ChakNoBlock, SearchPacketNo, ReferenceDetails, UpdateVoter  } from "../controllers/feedingStaff.controllers.js";

const feedingStaffRouter = Router()

feedingStaffRouter.post('/SearchPacketNo', SearchPacketNo);
feedingStaffRouter.post('/ReferenceDetails', ReferenceDetails);
feedingStaffRouter.post('/searchSurname', searchSurname);
feedingStaffRouter.post('/searchCaste', searchCaste);
feedingStaffRouter.post('/searchAreaVill/:DId', searchAreaVill);
feedingStaffRouter.post('/allAreaDetails/:DId', allAreaDetails);
feedingStaffRouter.post('/addVoter', AddVoter); 
feedingStaffRouter.post('/getPerseemanDetails', getPerseemanDetails); 
feedingStaffRouter.get('/ChakNoBlock', ChakNoBlock); 
export default feedingStaffRouter;
