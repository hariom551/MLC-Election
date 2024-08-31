import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { queryDatabase } from '../utils/queryDatabase.js';


const voterList = asyncHandler(async (req, res) => {
    const { WBId } = req.body;
    const { DId } = req.params;
    if (!WBId) {
        return res.status(400).json({ error: 'WBId parameter is required' });
    }

    try {
        const results = await queryDatabase(
            `SELECT voterlist.Id, PacketNo, EFName, HFName, ELName, HLName,
             CasteId, caste.ECaste, Age, 
            DATE_FORMAT(DOB, '%d/%m/%Y') as DOB, Sex, MNo, AadharNo, VIdNo,
             AreaVill.EAreaVill ,AreaVill.HAreaVill, AreaId, TehId, CounId, VSId, WBId, ChkBlkId, HNo, Landmark
            FROM voterlist 
            LEFT JOIN caste ON CasteId = caste.ID 
            LEFT JOIN AreaVill ON AreaId= AreaVill.Id
            WHERE WBId = ? AND DId=?`,
            [WBId, DId]
        );
        return res.status(201).json(
            new ApiResponse(200, results, " details fetched successfully")
        )
    } catch (error) {
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const NoMobvoterList = asyncHandler(async (req, res) => {

    const { WBId } = req.body;

    if (!WBId) {
        return res.status(400).json({ error: 'WBId parameter is required' });
    }

    try {
        const results = await queryDatabase(
            `SELECT Id, RegNo, PacketNo, EFName, HFName, ELName, HLName, RType, ERFName, HRFName, 
            ERLName, HRLName, CasteId, caste.ECaste, Qualification, Occupation, Age, 
            DATE_FORMAT(DOB, '%d/%m/%Y') as DOB, Sex, MNo, MNo2, AadharNo, VIdNo, GCYear, 
            AreaVill.EAreaVill, AreaId, TehId, CounId, VSId, WBId, ChkBlkId, HNo, Landmark, Image, IdProof, Degree 
            FROM voterlist 
            LEFT JOIN caste ON CasteId = caste.ID 
            LEFT JOIN AreaVill ON AreaId= AreaVill.Id
            WHERE WBId = ? AND MNo = ?`,
            [WBId, ISNULL]
        );

        return res.json(results);
    } catch (error) {

        return res.status(500).json({ error: 'A database error occurred.' });
    }
});

const FeedingStaff = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.body;

    try {
        const query = `
        SELECT U.name, U.mobile1, U.userid, COUNT(U.userid) AS user_count
        FROM voterlist
         JOIN userlogin AS U ON voterlist.SBy = U.userid AND U.SBy= ?
        WHERE voterlist.SDate BETWEEN '${startDate}' AND '${endDate}'
       GROUP BY U.userid, U.name, U.mobile1;
      `;
        const results = await queryDatabase(query, [req.user.userid, startDate, endDate]);

        return res.json(results);
    } catch (error) {

        return res.status(500).json({ error: "A database error occurred." });
    }
});

const DayWiseReport = asyncHandler(async (req, res) => {
    const { startDate, endDate, userId } = req.body;
   
    try {
        const query = `SELECT DATE_FORMAT(SDate, '%d/%m/%Y') AS formatted_date, COUNT(SBy) AS Total 
                       FROM voterlist 
                       WHERE SBy = ? 
                         AND SDate BETWEEN ? AND ? 
                       GROUP BY SBy, SDate;`;
        const results = await queryDatabase(query, [userId, startDate, endDate]);
      
        return res.json(results);
    } catch (error) {

        return res.status(500).json({ error: "A database error occurred." });
    }
});

const staffname = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    try {
        const query = `SELECT name,role FROM userlogin WHERE userId = ?`;
        const results = await queryDatabase(query, [userId]);
        return res.json(results);
    } catch (error) {
        return res.status(500).json({ error: "A database error occurred." });
    }
});

const qcstaffcount = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.body;

    try {
        const query = `
        SELECT U.name, U.mobile1, U.userid, COUNT(U.userid) AS user_count
        FROM voterlist
        JOIN userlogin AS U ON voterlist.MBy = U.userid 
        GROUP BY U.userid, U.name, U.mobile1;
      `;
        const results = await queryDatabase(query, [ startDate, endDate]);
        return res.json(results);
    } catch (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ error: "A database error occurred." });
    }
});

const QCDayWiseReport = asyncHandler(async (req, res) => {
    const { startDate, endDate, userId } = req.body;
    
    try {
        const query = `SELECT DATE_FORMAT(SDate, '%d/%m/%Y') AS formatted_date, COUNT(SBy) AS Total 
                       FROM voterlist 
                       WHERE MBy = ? 
                         AND MDate BETWEEN ? AND ? 
                       GROUP BY MBy, MDate;`;
        const results = await queryDatabase(query, [userId, startDate, endDate]);
       
        return res.json(results);
    } catch (error) {
       
        return res.status(500).json({ error: "A database error occurred." });
    }
});

const ReferenceVoterList = asyncHandler(async (req, res) => {
    const { number } = req.body;
    try {
      const query = `
        SELECT voterlist.Id, PacketNo, EFName, HFName, ELName, HLName, RType, ERFName, HRFName, 
              ERLName, HRLName, CasteId, caste.ECaste, Qualification, Occupation, Age, 
              DATE_FORMAT(DOB, '%d/%m/%Y') as DOB, Sex, MNo, MNo2, AadharNo, VIdNo, GCYear, 
               AreaVill.EAreaVill ,AreaVill.HAreaVill, AreaId, TehId, CounId, VSId, WBId, ChkBlkId, HNo, Landmark, Image, IdProof, Degree 
              FROM voterlist 
              LEFT JOIN caste ON CasteId = caste.ID 
              LEFT JOIN AreaVill ON AreaId= AreaVill.Id
        JOIN volunteer ON volunteer.Id = voterlist.IncFormId
        WHERE  volunteer.VMob1 = ?;
      `;
      const results = await queryDatabase(query, [number]);
      return res.json(results);
    } catch (error) {
      return res.status(500).json({ error: "A database error occurred." });
    }
  });

const TCdisplayData=asyncHandler(async(req,res)=>{
    
    try {
      const query = `SELECT DISTINCT LastCallEmployee FROM telecallerdetail`;
      const results = await queryDatabase(query);
      return res.json(results);
    } catch (error) {
      return res.status(500).json({ error: "A database error occurred." });
    }
  })

export { voterList, FeedingStaff, DayWiseReport, staffname, qcstaffcount, QCDayWiseReport, ReferenceVoterList};