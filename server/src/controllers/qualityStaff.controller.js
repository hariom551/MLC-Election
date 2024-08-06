import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { queryDatabase } from '../utils/queryDatabase.js';
import fetch from 'node-fetch';
import uploadFiles from "../middleware/multer.middleware.js";

const wardwiseVoterContact = asyncHandler(async (req, res) => {
    const { WBId } = req.body;
    if (!WBId) {
        return res.status(400).json({ error: "WBID is required" })
    }
    try {
        const result = await queryDatabase(
            `SELECT COUNT(Id) AS total_records, COUNT( MNo) AS Total_mobile_numbers FROM voterlist WHERE WBId = ?`, [WBId]
        );

         return res.status(201).json(
            new ApiResponse(200, result, " details fetched successfully")
        )
    } catch (error) {
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
})

const sendSMS = asyncHandler(async (req, res) => {
    const { WBId } = req.body;
    if (!WBId) {
        return res.status(400).json({ error: "WBId is required" });
    }
    try {
        const results = await queryDatabase(
            `SELECT EFName, ELName, HFName, HLName, MNo FROM voterlist WHERE WBId = ?`,
            [WBId]
        );

        if (results.length === 0) {
            return res.status(404).json({ error: "No records found for the given WBId" });
        }

        const sendSMSPromises = results.map(async (result) => {
            const { EFName, ELName, MNo } = result;
            const smss = `Dear ${EFName} ${ELName}, your registration is successful in RRC NER for Apprenticeship. Your registration no. is ${MNo} and password is ${MNo}. SISTEK`;

            const encodedMessage = encodeURIComponent(smss);

            const api_url = `http://msg.msgclub.net/rest/services/sendSMS/sendGroupSms?AUTH_KEY=2185e5def263defc28233d2e10bab1&message=${encodedMessage}&senderId=SISTEK&routeId=1&mobileNos=${MNo}&smsContentType=english`;


            try {
                const response = await fetch(api_url);
                const data = await response.json();
                console.log(`Response from SMS API:`, data);

                if (data.responseCode === "3001") {

                    return { MNo, status: "success", response: data.response };
                } else {
                    throw new Error(JSON.stringify(data));
                }
            } catch (error) {
                console.error(`Error sending SMS to ${MNo}:`, error.message);
                return { MNo, status: "failed", error: error.message };
            }
        });

        const smsResults = await Promise.all(sendSMSPromises);

        const successCount = smsResults.filter(result => result.status === "success").length;
        const failedCount = smsResults.filter(result => result.status === "failed").length;

        return res.status(200).json({
            message: `SMS sending completed. Success: ${successCount}, Failed: ${failedCount}`,
            details: smsResults
        });

    } catch (error) {
        console.error(`Database error:`, error.message);
        return res.status(500).json({ error: 'A database error occurred.' });
    }
});

const DeleteVoter = asyncHandler(async (req, res) => {
    const { Id } = req.body;
    if (!Id) {
        return res.status(400).json({ error: "Id is required" });
    }
   
    try {
        await queryDatabase(
            `INSERT INTO dvoterlist(
                Id, SNo, EFName, HFName, ELName, HLName, RType, ERFName, HRFName, ERLName, HRLName, 
                CasteId, Qualification, Occupation, Age, DOB, Sex, MNo, MNo2, VIdNo, AadharNo, GCYear, 
                Image, HNo, SHNo, Landmark, HLandmark, MId, AreaId, ChkBlkId, WBId, VSId, CounId, TehId, 
                DId, StateId, Degree, IdProof, Document3, Status, Remarks, StaffId, QCStaff, AdminId, 
                IsEdited, IncFormId, PacketNo, ONStatus, MobileNoRemark, AddressRemark, NameRemark, 
                FatherNameRemark, RequiredForms, DeathRemark, ExtraRemark, SpecialRemark, MBActive, 
                GPId, SBy, SDate, MBy, MDate
            )
            SELECT 
                Id, SNo, EFName, HFName, ELName, HLName, RType, ERFName, HRFName, ERLName, HRLName, 
                CasteId, Qualification, Occupation, Age, DOB, Sex, MNo, MNo2, VIdNo, AadharNo, GCYear, 
                Image, HNo, SHNo, Landmark, HLandmark, MId, AreaId, ChkBlkId, WBId, VSId, CounId, TehId, 
                DId, StateId, Degree, IdProof, Document3, Status, Remarks, StaffId, QCStaff, AdminId, 
                IsEdited, IncFormId, PacketNo, ONStatus, MobileNoRemark, AddressRemark, NameRemark, 
                FatherNameRemark, RequiredForms, DeathRemark, ExtraRemark, SpecialRemark, MBActive, 
                GPId, SBy, SDate, MBy, MDate
            FROM voterlist 
            WHERE Id  = ?`, 
            [Id]
        );
        
        
        await queryDatabase(
            'DELETE FROM voterlist WHERE Id = ?', [Id]
        );

        return res.status(200).json(
            new ApiResponse(200, "voter Deleted successfully")
        )
    } catch (error) {
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }

});

const voterDetailById = asyncHandler(async (req, res)=>{
    const {content}= req.body;
    
    if(!content){
        return res.status(400).json({ error: "Id is required" });
    }
    try {
        const results1= await queryDatabase(`SELECT PacketNo FROM voterlist WHERE ID= ?`, [content]);


        const results2 = await queryDatabase(`SELECT EFName, HFName,ELName, HLName, RType, ERFName, HRFName, 
                ERLName, HRLName, CasteId, Qualification, Occupation, 
                Age, DATE_FORMAT(DOB, '%Y-%m-%d') AS DOB, Sex, MNo, MNo2,
                AadharNo, VIdNo, GCYear FROM voterlist WHERE Id = ?`,[content]);

        const result3 = await queryDatabase(`SELECT AreaId, TehId, 
                CounId, VSId, WBId, ChkBlkId, HNo, areavill.EAreaVill, areavill.HnoRange, 
                Landmark FROM voterlist JOIN areavill ON voterlist.AreaId = areavill.Id WHERE voterlist.Id=?`,[content]);

        const result4= await queryDatabase(`SELECT MobileNoRemark, AddressRemark, NameRemark, FatherNameRemark, RequiredForms, DeathRemark, ExtraRemark, SpecialRemark FROM voterlist WHERE Id=?`, [content])
        return res.status(201).json(
            new ApiResponse(200, [results1, results2, result3, result4], " details fetched successfully")
        )
    } catch (error) {
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }

});



const updateletter=asyncHandler(async(req,res)=>{
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: "Content is required" });
    }

    try {
        // Insert the content into the letter table
        await queryDatabase(
            'INSERT INTO letter (content) VALUES (?)',
            [content]
        );

        return res.status(201).json(
            new ApiResponse(200, null, "Content saved successfully")
        );
    } catch (error) {
        console.error('Error saving content:', error.message);
        return res.status(error.statusCode || 500).json(
            new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error")
        );
    }
})

const prevletter = asyncHandler(async (req, res) => {
    console.log("abcgh")
    try {
        const results = await queryDatabase('SELECT * FROM letter ORDER BY id DESC LIMIT 1');
        return res.json(results); // Correctly return the results array
    } catch (error) {
        console.error('Database query error', error);
        return res.status(500).send('A database error occurred.');
    }
});



export { wardwiseVoterContact, sendSMS, DeleteVoter, voterDetailById , updateletter,prevletter}; 