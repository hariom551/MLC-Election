import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { queryDatabase } from '../utils/queryDatabase.js';
import fetch from 'node-fetch';
import uploadFiles from "../middleware/multer.middleware.js";
import multer from "multer";
import { fileURLToPath } from "url";
import axios from 'axios';

// import upload from '../middleware/upload.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


 const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, 'uploads');
      fs.mkdirSync(uploadPath, { recursive: true }); 
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

  // Create the multer instance with the storage configuration
  const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024, 
    },
});


const currentDate = new Date();
const CDate = currentDate.toISOString(); 

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

            const api_url = `http://msg.msgclub.net/rest/services/sendSMS/sendGroupSms?AUTH_KEY=comment&message=${encodedMessage}&senderId=SISTEK&routeId=1&mobileNos=${MNo}&smsContentType=english`;


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

const ultramsgApiUrl = 'https://api.ultramsg.com/instance93141/messages/chat';
const ultramsgToken = 'tyxyxiv2k0e7801s';

const whatsapp = asyncHandler(async (req, res) => {
    const { Mobile, Text } = req.body;

    if (!Mobile || !Array.isArray(Mobile) || !Text) {
      return res.status(400).json({ error: 'Invalid input data' });
    }
  
    try {
      var data = JSON.stringify({
        "token": ultramsgToken,
        "to": Mobile.join(', '),
        "body": Text
      });
  
      var config = {
        method: 'post',
        url: ultramsgApiUrl,
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
  
      const response = await axios(config);
  
      console.log(JSON.stringify(response.data));
      res.status(200).json({ message: 'Message sent successfully', data: response.data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to send message', details: error.message });
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
    const { content,loginUserId } = req.body;
    if (!content) {
        return res.status(400).json({ error: "Content is required" });
    }

    try {
        // Insert the content into the letter table
        await queryDatabase(
            'INSERT INTO letter (content,SDate,MDate,SBy,MBy) VALUES (?,?,?,?,?)',
            [content,CDate,CDate,loginUserId,loginUserId]
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
   
    try {
        const results = await queryDatabase('SELECT * FROM letter ORDER BY id DESC LIMIT 1');
        return res.json(results); // Correctly return the results array
    } catch (error) {
        console.error('Database query error', error);
        return res.status(500).send('A database error occurred.');
    }
});


const DisplayTelecallerData = asyncHandler(async (req, res) => {
    try {
        const result = await queryDatabase(`SELECT * FROM telecallerdetail`);
        
        // Check if result is not empty
        if (!result || result.length === 0) {
            return res.status(404).json({ message: "No data found" });
        }
    
        return res.status(200).json(result); // Ensure response is sent as JSON
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ error: "A database error occurred" });
    }
});





  
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

const addtelecallerdata = asyncHandler(async (req, res) => {
    // Check if the file exists
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = path.join(__dirname, "./uploads", req.file.filename);
    const parsedResults = [];

    fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("data", (data) => {
            parsedResults.push(data);
        })
        .on("end", async () => {
            const query = `
                INSERT IGNORE INTO telecallerdetail (
                    sr_no, CreatedDate, LastModifiedDate, ImportedBy, LeadNo, FirstName, LastName, 
                    CountryCode, PhoneNo, AlternateCountryCode, 
                    AlternatePhoneNo, NoOfAttempts, LeadTags, 
                    LastCallEmployee, LastCallTime, LastCallType, LastCallDuration, LastCallNote, AssignTo, LeadStatus, Reminder, CompanyName, Email, Address1, Address2, City, State, Zipcode, Country, Description, Source, Price
                ) VALUES ?
            `;

            const values = parsedResults.map((row) => [
                row.sr_no,
                row["Created Date"],
                row["Last Modified Date"],
                row["Imported By"],
                row["Lead No."],
                row["First Name"],
                row["Last Name"],
                row["Country Code"],
                row["Phone Number"],
                row["Alternate Country Code"],
                row["Alternate Phone Number"],
                row["No of Attempts"],
                row["Lead Tags"],
                row["Last Call - Employee"],
                row["Last Call - Call time"],
                row["Last Call - Call Type"],
                row["Last Call - Call Duration"],
                row["Last Call - Note"],
                row["Assign To"],
                row["Lead Status"],
                row["Reminder"],
                row["Company Name"],
                row["Email"],
                row["Address 1"],
                row["Address 2"],
                row["City"],
                row["State"],
                row["Zipcode"],
                row["Country"],
                row["Description"],
                row["Source"],
                row["Price"],
            ]);

            // Insert data in batches
            const BATCH_SIZE = 100; // Adjust as needed
            for (let i = 0; i < values.length; i += BATCH_SIZE) {
                const batch = values.slice(i, i + BATCH_SIZE);
                try {
                    await queryDatabase(query, [batch]);
                } catch (err) {
                    console.error("Error inserting batch:", err);
                    return res.status(500).json({ message: "Error inserting data" });
                }
            }

            res.json({
                message: "File uploaded and data inserted successfully!",
            });

            // Delete the file after processing
            try {
                fs.unlinkSync(filePath);
            } catch (err) {
                console.error("Error deleting file:", err);
            }
        })
        .on("error", (err) => {
            console.error("Error reading CSV file:", err);
            res.status(500).json({ message: "Error reading CSV file" });
        });
});





export { wardwiseVoterContact, sendSMS, whatsapp, DeleteVoter, voterDetailById , updateletter,prevletter, 
    DisplayTelecallerData,addtelecallerdata, upload}; 